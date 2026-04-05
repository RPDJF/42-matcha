import french from '../../../../assets/i18n/french.json';

export const SUPPORTED_LANGUAGES = {
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
  english: 'en',
  esperanto: 'eo',
  estonian: 'et',
  finnish: 'fi',
  french: 'fr',
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
} as const;

// Type pour les noms : 'english' | 'french' | ...
export type LangName = keyof typeof SUPPORTED_LANGUAGES;

// Type pour les codes : 'en' | 'fr' | ...
export type LangCode = (typeof SUPPORTED_LANGUAGES)[LangName];
export type TranslationKey = keyof typeof french;
export type I18nCollection = Record<TranslationKey, string>;

export interface I18nUpdateLangPayload {
  langCode: LangCode;
  skipStorage?: boolean;
}
