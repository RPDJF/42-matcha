import { Routes } from '@angular/router';
import { LoginComponent } from './pages/authentification/login/login.component';
import { RegisterComponent } from './pages/authentification/register/register.component';
import { ChatsComponent } from './pages/chats/chats.component';
import { DiscoverComponent } from './pages/discover/discover.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { ValidateComponent } from './pages/authentification/validate/validate.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'discover',
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
];
