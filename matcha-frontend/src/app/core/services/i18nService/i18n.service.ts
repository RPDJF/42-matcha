import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, isDevMode } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { I18nUpdateLang } from '../../stores/i18n/i18n.actions';
import { I18nState } from '../../stores/i18n/i18n.state';
import {
  I18nCollection,
  SUPPORTED_LANGUAGES,
  TranslationKey,
} from '../../stores/i18n/i18n.state.types';
import { HydratableService } from '../hydratableService/hydratableService';
import { LangCode } from './../../stores/i18n/i18n.state.types';

@Injectable({
  providedIn: 'root',
})
export class I18nService extends HydratableService {
  readonly #httpClient = inject(HttpClient);

  readonly #store = inject(Store);

  #getBrowserLanguage(): LangCode {
    const browserCode = globalThis.navigator.language?.split('-')?.at(0) ?? 'en';
    const isSupported = Object.keys(SUPPORTED_LANGUAGES).includes(browserCode as LangCode);

    return (isSupported ? browserCode : 'en') as LangCode;
  }

  hydrateService(): Observable<void> {
    const langCode =
      (typeof window !== 'undefined' ? (localStorage.getItem('lang') as LangCode) : undefined) ||
      this.#getBrowserLanguage() ||
      'en';

    return this.#store.dispatch(
      new I18nUpdateLang({
        langCode: langCode,
        skipStorage: true,
      }),
    );
  }

  public loadTranslate(langCode: LangCode) {
    const langName = SUPPORTED_LANGUAGES[langCode];
    return this.#httpClient.get<I18nCollection>(`assets/i18n/${langName}.json`);
  }

  #sanityCheck(key: TranslationKey, value: string) {
    if (!value) {
      if (!isDevMode()) {
        console.error(
          `❌ missing translation for "${key}" in ${this.#store.selectSnapshot(I18nState.getLang)} !`,
        );
      }
      return `❌ !${key}`;
    }
    return value;
  }

  public translate(
    key: TranslationKey,
    replace?: Record<string, string | { toString: () => string }>,
  ) {
    return computed(() => {
      let translation = this.#sanityCheck(
        key,
        this.#store.selectSignal(I18nState.getI18n)()[key]?.replaceAll('\n', '<br>'),
      );

      if (replace)
        for (const [key, value] of Object.entries(replace)) {
          translation = translation.replaceAll(`{${key}}`, value.toString());
        }
      return translation;
    });
  }

  public translateSnapshot(
    key: TranslationKey,
    replace?: Record<string, string | { toString: () => string }>,
  ) {
    return this.translate(key, replace)();
  }

  public getCurrentLang() {
    return this.#store.selectSnapshot(I18nState.getLang);
  }
}
