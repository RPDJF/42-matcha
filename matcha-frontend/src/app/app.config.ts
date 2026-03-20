import {
  ApplicationConfig,
  DOCUMENT,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngxs/store';
import { HydratableService } from './core/services/hydratableService/hydratableService';
import { I18nService } from './core/services/i18nService/i18n.service';
import { firstValueFrom, zip } from 'rxjs';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { I18nState } from './core/state/i18n/i18n.state';

function hydrateFactory() {
  const document = inject(DOCUMENT);
  document.body.classList.add('dark');
  const hydrationServices: Array<HydratableService> = [inject(I18nService)];

  return () => firstValueFrom(zip(hydrationServices.map((service) => service.hydrateService())));
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore([]),
    provideHttpClient(withFetch()),
    provideStore([I18nState]),
    {
      provide: provideAppInitializer,
      useFactory: hydrateFactory,
      multi: true,
    },
  ],
};
