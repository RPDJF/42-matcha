import { provideHttpClient } from '@angular/common/http';
import { Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { UserState, UserStateModel } from './user.state';

describe('User store', () => {
  let store: Store;
  let state: Signal<UserStateModel>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore([UserState]), provideHttpClient()],
    });

    store = TestBed.inject(Store);
    state = store.selectSignal(UserState.getState);
  });

  it('should not crash', () => {
    expect(state).toBeDefined();
  });
});
