import { Routes } from '@angular/router';
import { appGuard } from './app.component.guard';
import { LoginComponent } from './pages/authentification/login/login.component';
import { RegisterComponent } from './pages/authentification/register/register.component';
import { ChatsComponent } from './pages/chats/chats.component';
import { DiscoverComponent } from './pages/discover/discover.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { OnboardingComponent } from './pages/onboarding/onboarding-component';
import { ValidateComponent } from './pages/authentification/validate/validate.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'validate',
    component: ValidateComponent,
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
