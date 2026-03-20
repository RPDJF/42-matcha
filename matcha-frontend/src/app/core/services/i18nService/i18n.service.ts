import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, isDevMode } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { I18nUpdateLang } from '../../state/i18n/i18n.actions';
import { I18nState } from '../../state/i18n/i18n.state';
import { I18nCollection, LangCode, TranslationKey } from '../../state/i18n/i18n.state.types';
import { HydratableService } from '../hydratableService/hydratableService';

@Injectable({
  providedIn: 'root',
})
export class I18nService extends HydratableService {
  #httpClient = inject(HttpClient);

  readonly #store = inject(Store);

  hydrateService(): Observable<void> {
    const LangCode =
      typeof window !== 'undefined'
        ? ((localStorage.getItem('lang') as LangCode) ?? 'french')
        : 'french';

    return this.#store.dispatch(
      new I18nUpdateLang({
        LangCode,
        skipStorage: true,
      }),
    );
  }

  public loadTranslate(code: LangCode) {
    return this.#httpClient.get<I18nCollection>(`assets/i18n/${code}.json`);
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
}
