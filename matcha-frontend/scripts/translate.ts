import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const supportedLanguages = ['french', 'english'];

/**
 * Unescapes a string by replacing escaped characters with their actual values
 */
function unescapeString(str: string): string {
  return str.replace(/(?<!\\)\\'/g, "'");
}
/**
 * Finds all translation keys in the project by looking for:
 * - HTML files: keys used with the i18n pipe (e.g., {{ 'key' | i18n }})
 * - TypeScript files: keys used with translate or translateSnapshot functions (e.g., translate('key'))
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

  supportedLanguages.forEach((language) => {
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

/**
 * Compares the keys found in the project with the existing translations and identifies missing translations for each language
 * Returns a map of language containing arrays of missing translation keys
 */
async function generateMissingTranslations() {
  const missingTranslation = new Map<string, Array<string>>();

  const translations$ = loadTranslations();
  const keys$ = findKeys();
  const translations = await translations$;
  const keys = await keys$;

  supportedLanguages.forEach((language) => {
    missingTranslation.set(language, new Array());
  });

  keys.forEach((key) => {
    for (const [language, languageKeys] of translations) {
      if (!languageKeys.some((val) => val === key)) {
        missingTranslation.get(language)!.push(key);
      }
    }
  });
  return missingTranslation;
}

console.log('For now, this tool only finds missing translations');
console.log('At some point, it will auto translate keys');
console.log('Finding missing translations...');

generateMissingTranslations().then((missingTranslations) => {
  // TODO: Auto translate missing keys using an API like Google Translate or DeepL
  console.log(missingTranslations);
});
