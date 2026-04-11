import { Routes } from '@angular/router';
import { AuthentificationComponent } from './pages/authentification/authentification.component';
import { ChatsComponent } from './pages/chats/chats.component';
import { DiscoverComponent } from './pages/discover/discover.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'discover',
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
