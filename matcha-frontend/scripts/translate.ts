import { exec } from 'child_process';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const supportedLanguages = new Map(
  Object.entries({
    french: 'fr',
    english: 'en',
    albanian: 'sq',
    arabic: 'ar',
    azerbaijani: 'az',
    basque: 'eu',
    bengali: 'bn',
    bulgarian: 'bg',
    catalan: 'ca',
    chinese: 'zh',
    czech: 'cs',
    danish: 'da',
    dutch: 'nl',
    esperanto: 'eo',
    estonian: 'et',
    finnish: 'fi',
    galician: 'gl',
    german: 'de',
    greek: 'el',
    hebrew: 'he',
    hindi: 'hi',
    hungarian: 'hu',
    indonesian: 'id',
    irish: 'ga',
    italian: 'it',
    japanese: 'ja',
    korean: 'ko',
    kyrgyz: 'ky',
    latvian: 'lv',
    lithuanian: 'lt',
    malay: 'ms',
    norwegian: 'nb',
    persian: 'fa',
    polish: 'pl',
    portuguese: 'pt',
    romanian: 'ro',
    russian: 'ru',
    slovak: 'sk',
    slovenian: 'sl',
    spanish: 'es',
    swedish: 'sv',
    tagalog: 'tl',
    thai: 'th',
    turkish: 'tr',
    ukrainian: 'uk',
    urdu: 'ur',
    vietnamese: 'vi',
  }),
);
const sourceLanguage = supportedLanguages.get('french')!;
const LIBRETRANSLATE_URL = 'http://localhost:5000';
const CONCURRENCY_LIMIT = 20;

let dockerCmd = 'docker';

/**
 * Run a shell command
 */
function run(cmd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Detect if docker requires sudo
 */
async function detectDockerCmd() {
  try {
    await run('docker info');
  } catch {
    console.log('Docker requires sudo');
    dockerCmd = 'sudo docker';
  }
}

/**
 * Start LibreTranslate container
 */
async function startLibreTranslate() {
  console.log('Starting LibreTranslate container...');
  await detectDockerCmd();

  try {
    // Check if container already exists
    await run(`${dockerCmd} inspect libretranslate`);
    console.log('Container exists, starting...');
    await run(`${dockerCmd} start libretranslate`);
  } catch {
    console.log('Container does not exist, creating...');
    await run(`
      ${dockerCmd} run -d -p 5000:5000 \
      --name libretranslate \
      --oom-kill-disable \
      -e LT_UPDATE_MODELS=true \
      libretranslate/libretranslate
  `);
  }
}

/**
 * Wait until LibreTranslate API is ready
 */
async function waitForLibreTranslate() {
  console.log('Waiting for LibreTranslate to be ready...');

  while (true) {
    try {
      const res = await fetch(`${LIBRETRANSLATE_URL}/languages`);
      if (res.ok) {
        console.log('LibreTranslate is ready ✅');
        return;
      }
    } catch {
      console.log('LibreTranslate not ready yet, retrying...');
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
}

/**
 * Mask tags as HTML spans so the engine translates the inner text
 */
function maskPlaceholders(text: string): { maskedText: string; placeholders: Map<string, string> } {
  const placeholders = new Map<string, string>();
  let index = 0;

  const blockRegex = /\{#(\w+)\}([\s\S]*?)\{\/\1\}/g;

  let maskedText = text.replace(blockRegex, (match, tagName, content) => {
    const placeholderId = `b${index++}`; // b pour bloc
    placeholders.set(placeholderId, match);
    return `<span id="${placeholderId}">${content}</span>`;
  });

  const varRegex = /\{([^\/#].*?)\}/g;
  maskedText = maskedText.replace(varRegex, (match) => {
    const placeholderId = `v${index++}`; // v pour variable
    placeholders.set(placeholderId, match);
    return `<span id="${placeholderId}" translate="no"></span>`;
  });

  return { maskedText, placeholders };
}

/**
 * Restore tags from the translated HTML
 */
function restorePlaceholders(translatedHtml: string, placeholders: Map<string, string>): string {
  let result = translatedHtml;

  const sortedIds = Array.from(placeholders.keys()).sort((a, b) => b.length - a.length);

  for (const id of sortedIds) {
    const originalTag = placeholders.get(id)!;

    const spanRegex = new RegExp(`<span id=["']${id}["'][^>]*>([\\s\\S]*?)</span>`, 'g');

    if (id.startsWith('b')) {
      const tagMatch = originalTag.match(/^\{#(\w+)\}/);
      const tagName = tagMatch ? tagMatch[1] : '';

      result = result.replace(spanRegex, (match, translatedInner) => {
        return `{#${tagName}}${translatedInner}{/${tagName}}`;
      });
    } else {
      result = result.replace(spanRegex, originalTag);
    }
  }

  result = result.replace(/(\b\w{4,}\b)(?:\s+\1)+/gi, '$1');

  return result;
}

/**
 * Updated Translation Call
 */
async function translate(text: string, target: string) {
  const { maskedText, placeholders } = maskPlaceholders(text);

  const res = await fetch(`${LIBRETRANSLATE_URL}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: maskedText,
      source: sourceLanguage,
      target: supportedLanguages.get(target),
      format: 'html',
    }),
  });

  const data = await res.json();
  if (!data.translatedText) return text;

  return restorePlaceholders(data.translatedText, placeholders);
}

/**
 * Unescape helper
 */
function unescapeString(str: string): string {
  return str.replace(/(?<!\\)\\'/g, "'");
}

/**
 * Finds all translation keys in the project
 */
async function findKeys(dir = 'src') {
  const keys = new Set<string>();
  let content;
  const files = await readdir(dir, { withFileTypes: true });
  const pipeRegex = /(['"])(.*?)\1\s*\|\s*i18n/gm;
  const funcRegex = /(?:translate|translateSnapshot)\(\s*(['"])(.*?)\1/gm;

  for (const file of files) {
    const fullPath = join(dir, file.name);

    if (file.isDirectory()) {
      const childKeys = await findKeys(fullPath);
      for (const key of childKeys) {
        keys.add(key);
      }
    } else if (file.name.endsWith('.html')) {
      content = await readFile(fullPath, 'utf-8');
      for (const match of content.matchAll(pipeRegex)) {
        keys.add(unescapeString(match[2]));
      }
    } else if (file.name.endsWith('.ts')) {
      content = await readFile(fullPath, 'utf-8');
      for (const match of content.matchAll(funcRegex)) {
        keys.add(unescapeString(match[2]));
      }
    }
  }
  return keys;
}

/**
 * Loads existing translations from JSON files in the i18n directory
 * Returns a map of language containing arrays of translation keys
 */
async function loadTranslations(dir = 'src/assets/i18n') {
  const translations = new Map<string, Array<string>>();
  let content;
  const files = await readdir(dir, { withFileTypes: true });
  const regex = /^\s*"(.*?)"\s*:/gm;

  supportedLanguages.forEach((langCode, language) => {
    translations.set(language, new Array());
  });

  for (const file of files) {
    const language = file.name.split('.')[0];
    const fullPath = join(dir, file.name);

    if (file.isDirectory()) {
      const childKeys = await findKeys(fullPath);
      for (const key of childKeys) {
        translations.get(language)!.push(key);
      }
    } else if (file.name.endsWith('.json')) {
      content = await readFile(fullPath, 'utf-8');
      for (const match of content.matchAll(regex)) {
        translations.get(language)!.push(match[1]);
      }
    }
  }
  return translations;
}

import { mkdir, writeFile } from 'fs/promises';

/**
 * Merges new translations into existing files or creates new ones
 */
async function saveTranslations(
  language: string,
  newEntries: Record<string, string>,
  dir = 'src/assets/i18n',
) {
  const filePath = join(dir, `${language}.json`);
  let existingData: Record<string, string> = {};

  await mkdir(dir, { recursive: true });

  try {
    const content = await readFile(filePath, 'utf-8');
    existingData = JSON.parse(content);
  } catch {
    existingData = {};
  }

  const updatedData = { ...existingData, ...newEntries };

  const sortedData = Object.keys(updatedData)
    .sort()
    .reduce(
      (acc, key) => {
        acc[key] = updatedData[key];
        return acc;
      },
      {} as Record<string, string>,
    );

  await writeFile(filePath, JSON.stringify(sortedData, null, 2), 'utf-8');
}

/**
 * Main logic
 */
async function main() {
  console.log('Starting translation tool...');

  const dockerStart = startLibreTranslate();
  const [translations, keys] = await Promise.all([loadTranslations(), findKeys()]);

  await dockerStart;
  await waitForLibreTranslate();

  console.log('Translating missing keys...\n');

  const results = new Map<string, Record<string, string>>();
  supportedLanguages.forEach((_, lang) => results.set(lang, {}));

  const tasks: Array<{ key: string; language: string }> = [];
  for (const key of keys) {
    for (const [language, languageKeys] of translations) {
      if (!languageKeys.includes(key)) {
        tasks.push({ key, language });
      }
    }
  }

  const executeTask = async (task: { key: string; language: string }) => {
    try {
      const translated = await translate(task.key, task.language);
      console.log(`[${task.language}] ${task.key} → ${translated}`);
      results.get(task.language)![task.key] = translated;
    } catch (err) {
      console.error(`Failed to translate "${task.key}" to ${task.language}:`, err);
    }
  };

  for (let i = 0; i < tasks.length; i += CONCURRENCY_LIMIT) {
    const chunk = tasks.slice(i, i + CONCURRENCY_LIMIT);
    await Promise.all(chunk.map((task) => executeTask(task)));
  }

  console.log('\nSaving translations to files...');
  for (const [language, newEntries] of results) {
    if (Object.keys(newEntries).length > 0) {
      await saveTranslations(language, newEntries);
      console.log(`Updated ${language}.json`);
    } else {
      console.log(`No new keys for ${language}.`);
    }
  }

  console.log('\nStopping LibreTranslate container...');
  await run(`${dockerCmd} stop libretranslate`);
  console.log('LibreTranslate stopped');
}

main();
