import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import english from '../../../../assets/i18n/english.json';
import french from '../../../../assets/i18n/french.json';
import { I18nState, I18nStateModel } from './i18n.state';

const extractKeys = (obj: any) => {
  const keys = new Set<string>();
  for (const key of Object.entries(obj)) {
    keys.add(key[0]);
  }
  return keys;
};

const baseKeys = extractKeys(french);

let state: Signal<I18nStateModel>;

describe('I18n store', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore([I18nState]), provideHttpClientTesting()],
    });

    store = TestBed.inject(Store);
    state = store.selectSignal(I18nState.getState);
  });

  it('french should match french.json', () => {
    const expected: I18nStateModel = {
      lang: 'french',
      i18n: french,
    };
    const actual = store.selectSnapshot(I18nState.getState);
    expect(actual).toEqual(expected);
  });

  it('no missing english translations', () => {
    expect(extractKeys(english)).toEqual(baseKeys);
  });

  // it('should no contain french translations by default', () => {
  //   expect(state().lang).toEqual('english');
  //   expect(state().i18n).toEqual(english);
  // });

  // it('should update translations', (done) => {
  //   store.dispatch(new I18nUpdateLang('french')).subscribe(() => {
  //     expect(state().lang).toEqual('french');
  //     expect(state().i18n).toEqual(french);
  //     done();
  //   });
  // });
});
