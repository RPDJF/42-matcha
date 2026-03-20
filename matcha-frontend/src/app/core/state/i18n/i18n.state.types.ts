import french from '../../../../assets/i18n/french.json';

export type LangCode = 'english' | 'french';
export type TranslationKey = keyof typeof french;
export type I18nCollection = Record<TranslationKey, string>;

export interface I18nUpdateLangPayload {
  LangCode: LangCode;
  skipStorage?: boolean;
}
