import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideStore } from '@ngxs/store';
import { firstValueFrom, zip } from 'rxjs';
import { routes } from './app.routes';
import { HydratableService } from './core/services/hydratableService/hydratableService';
import { I18nService } from './core/services/i18nService/i18n.service';
import { UserService } from './core/services/userService/user.service';
import { AuthState } from './core/stores/auth/auth.state';
import { I18nState } from './core/stores/i18n/i18n.state';
import { UserState } from './core/stores/user/user.state';
import { UserPresenceState } from './core/stores/userPresence/userPresence.state';

function hydrateFactory() {
  const hydrationServices: Array<HydratableService> = [inject(I18nService), inject(UserService)];

  return firstValueFrom(zip(hydrationServices.map((service) => service.hydrateService())));
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore([]),
    provideHttpClient(withFetch()),
    provideStore([I18nState, UserState, AuthState, UserPresenceState]),
    provideAppInitializer(hydrateFactory),
  ],
};
