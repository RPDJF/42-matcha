import { Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { SidemenuState, SidemenuStateModel } from './sidemenu.state';

describe('Authentification store', () => {
  let store: Store;
  let state: Signal<SidemenuStateModel>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore([SidemenuState])],
    });

    store = TestBed.inject(Store);
    state = store.selectSignal(SidemenuState.getState);
  });

  it('should not crash', () => {
    expect(state).toBeDefined();
  });
});
