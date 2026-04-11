import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { UserPresenceState, UserPresenceStateModel } from './userPresence.state';

describe('Authentification store', () => {
  let store: Store;
  let state: Signal<UserPresenceStateModel>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore([UserPresenceState]), provideHttpClientTesting()],
    });

    store = TestBed.inject(Store);
    state = store.selectSignal(UserPresenceState.getState);
  });

  it('should not crash', () => {
    expect(state).toBeDefined();
  });
});
