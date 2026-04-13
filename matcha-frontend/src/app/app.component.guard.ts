import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { UserState } from './core/stores/user/user.state';

function enforceAuthentification(store: Store, router: Router) {
  return store.selectSnapshot(UserState.getMe) ? null : router.parseUrl('/login');
}

function enforceUserOnboarding(store: Store, router: Router) {
  return store.selectSnapshot(UserState.isProfileComplete) ? null : router.parseUrl('/onboarding');
}

export const appGuard: CanActivateChildFn = (childRoute, state) => {
  const store = inject(Store);
  const router = inject(Router);

  switch (state.url.split('?')[0].split('/')[1]) {
    case 'discover':
    case 'chats':
    case 'notifications':
    case 'settings':
      return enforceAuthentification(store, router) || enforceUserOnboarding(store, router) || true;
    case 'onboarding':
      return enforceAuthentification(store, router) || true;
    default:
      return false;
  }
  return false;
};
