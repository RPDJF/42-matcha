import { Routes } from '@angular/router';
import { appGuard } from './app.component.guard';
import { AuthentificationComponent } from './pages/authentification/authentification.component';
import { ChatsComponent } from './pages/chats/chats.component';
import { DiscoverComponent } from './pages/discover/discover.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { OnboardingComponent } from './pages/onboarding/onboarding-component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'register',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: AuthentificationComponent,
  },
  {
    path: '',
    canActivate: [appGuard],
    children: [
      {
        path: 'discover',
        component: DiscoverComponent,
      },
      {
        path: 'chats',
        component: ChatsComponent,
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
      },
      {
        path: 'onboarding',
        component: OnboardingComponent,
      },
    ],
  },
];
