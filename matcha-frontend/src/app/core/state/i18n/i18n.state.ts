import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, of, tap } from 'rxjs';
import french from '../../../../assets/i18n/french.json';
import { I18nService } from '../../../core/services/i18nService/i18n.service';
import { I18nUpdateLang } from './i18n.actions';
import { I18nCollection, LangCode, TranslationKey } from './i18n.state.types';

export interface I18nStateModel {
  lang: LangCode;
  i18n: I18nCollection;
}

@State<I18nStateModel>({
  name: 'i18n',
  defaults: {
    lang: 'french',
    i18n: french,
  },
})
@Injectable()
export class I18nState {
  #i18nService = inject(I18nService);

  @Selector()
  static getState(state: I18nStateModel) {
    return state;
  }

  @Selector()
  static getLang(state: I18nStateModel) {
    return state.lang;
  }

  @Selector()
  static getI18n(state: I18nStateModel) {
    return state.i18n;
  }

  @Selector()
  static getTranslation(state: I18nStateModel) {
    return (key: TranslationKey) => state.i18n[key];
  }

  @Action(I18nUpdateLang)
  updateLang(ctx: StateContext<I18nStateModel>, { payload }: I18nUpdateLang) {
    return this.#i18nService.loadTranslate(payload.LangCode).pipe(
      tap((language) => {
        ctx.setState({ lang: payload.LangCode, i18n: language });
        if (!payload.skipStorage) localStorage.setItem('lang', payload.LangCode);
      }),
      catchError((err) => {
        console.error(`Failed to load ${payload.LangCode} translations`, err);
        return of({});
      }),
    );
  }
}
