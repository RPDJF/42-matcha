import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { firstValueFrom } from 'rxjs';
import french from '../../../../assets/i18n/french.json';
import { I18nUpdateLang } from './i18n.actions';
import { I18nState, I18nStateModel } from './i18n.state';

const LANGUAGES_TO_TEST = [
  'albanian',
  'arabic',
  'azerbaijani',
  'basque',
  'bengali',
  'bulgarian',
  'catalan',
  'chinese',
  'czech',
  'danish',
  'dutch',
  'english',
  'esperanto',
  'estonian',
  'finnish',
  'galician',
  'german',
  'greek',
  'hebrew',
  'hindi',
  'hungarian',
  'indonesian',
  'irish',
  'italian',
  'japanese',
  'korean',
  'kyrgyz',
  'latvian',
  'lithuanian',
  'malay',
  'norwegian',
  'persian',
  'polish',
  'portuguese',
  'romanian',
  'russian',
  'slovak',
  'slovenian',
  'spanish',
  'swedish',
  'tagalog',
  'thai',
  'turkish',
  'ukrainian',
  'urdu',
  'vietnamese',
];

describe('I18n store', () => {
  let store: Store;
  let httpMock: HttpTestingController;

  const getKeys = (obj: any, prefix = ''): string[] => {
    return Object.keys(obj).reduce((res: string[], key) => {
      const path = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        res.push(...getKeys(obj[key], path));
      } else {
        res.push(path);
      }
      return res;
    }, []);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore([I18nState]), provideHttpClientTesting()],
    });

    store = TestBed.inject(Store);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('french should match french.json content after update', async () => {
    const dispatchPromise = firstValueFrom(
      store.dispatch(new I18nUpdateLang({ langCode: 'fr', skipStorage: true })),
    );

    // Intercept the HTTP call made by the state/service
    const req = httpMock.expectOne('assets/i18n/french.json');
    req.flush(french);

    await dispatchPromise;

    const expected: I18nStateModel = {
      lang: 'fr',
      i18n: french,
    };

    const actual = store.selectSnapshot(I18nState.getState);
    expect(actual).toEqual(expected);
  });

  describe('Translation Files Integrity', () => {
    const referenceKeys = getKeys(french).sort();

    LANGUAGES_TO_TEST.forEach((langName) => {
      it(`should have identical keys between french.json and ${langName}.json`, async () => {
        const module = await import(`../../../../assets/i18n/${langName}.json`);
        const content = module.default;
        const currentKeys = getKeys(content).sort();

        const missing = referenceKeys.filter((k) => !currentKeys.includes(k));
        const extra = currentKeys.filter((k) => !referenceKeys.includes(k));

        if (missing.length > 0 || extra.length > 0) {
          const msg = [
            `Mismatch in ${langName}.json:`,
            missing.length ? `Missing keys: [${missing.join(', ')}]` : '',
            extra.length ? `Extra keys (not in french): [${extra.join(', ')}]` : '',
          ]
            .filter(Boolean)
            .join('\n');

          throw new Error(msg);
        }

        expect(currentKeys).toEqual(referenceKeys);
      });
    });
  });
});
