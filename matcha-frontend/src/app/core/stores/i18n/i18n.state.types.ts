import french from '../../../../assets/i18n/french.json';

export const SUPPORTED_LANGUAGES = {
  sq: 'albanian',
  ar: 'arabic',
  az: 'azerbaijani',
  eu: 'basque',
  bn: 'bengali',
  bg: 'bulgarian',
  ca: 'catalan',
  zh: 'chinese',
  cs: 'czech',
  da: 'danish',
  nl: 'dutch',
  en: 'english',
  eo: 'esperanto',
  et: 'estonian',
  fi: 'finnish',
  fr: 'french',
  gl: 'galician',
  de: 'german',
  el: 'greek',
  he: 'hebrew',
  hi: 'hindi',
  hu: 'hungarian',
  id: 'indonesian',
  ga: 'irish',
  it: 'italian',
  ja: 'japanese',
  ko: 'korean',
  ky: 'kyrgyz',
  lv: 'latvian',
  lt: 'lithuanian',
  ms: 'malay',
  nb: 'norwegian',
  fa: 'persian',
  pl: 'polish',
  pt: 'portuguese',
  ro: 'romanian',
  ru: 'russian',
  sk: 'slovak',
  sl: 'slovenian',
  es: 'spanish',
  sv: 'swedish',
  tl: 'tagalog',
  th: 'thai',
  tr: 'turkish',
  uk: 'ukrainian',
  ur: 'urdu',
  vi: 'vietnamese',
} as const;

// Type pour les noms : 'english' | 'french' | ...
export type LangName = (typeof SUPPORTED_LANGUAGES)[LangCode];

// Type pour les codes : 'en' | 'fr' | ...
export type LangCode = keyof typeof SUPPORTED_LANGUAGES;
export type TranslationKey = keyof typeof french;
export type I18nCollection = Record<TranslationKey, string>;

export interface I18nUpdateLangPayload {
  langCode: LangCode;
  skipStorage?: boolean;
}
