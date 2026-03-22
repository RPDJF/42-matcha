import { provideHttpClient } from '@angular/common/http';
import { Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { AuthState, AuthStateModel } from './auth.state';

describe('Authentification store', () => {
  let store: Store;
  let state: Signal<AuthStateModel>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore([AuthState]), provideHttpClient()],
    });

    store = TestBed.inject(Store);
    state = store.selectSignal(AuthState.getState);
  });

  it('should not crash', () => {
    expect(state).toBeDefined();
  });
});
