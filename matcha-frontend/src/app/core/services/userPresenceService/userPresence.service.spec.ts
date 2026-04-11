import { TestBed } from '@angular/core/testing';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideStore } from '@ngxs/store';
import { UserState } from '../../stores/user/user.state';
import { UserPresenceService } from './userPresence.service';

describe('UserPresenceService', () => {
  let service: UserPresenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore([UserState]), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserPresenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
