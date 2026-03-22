import { Routes } from '@angular/router';
import { AuthentificationComponent } from './pages/authentification/authentification.component/authentification.component';

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
];
