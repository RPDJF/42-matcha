import { TestBed } from '@angular/core/testing';
import { CanActivateChildFn } from '@angular/router';

import { appGuard } from './app.component.guard';

describe('appComponentGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => appGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
