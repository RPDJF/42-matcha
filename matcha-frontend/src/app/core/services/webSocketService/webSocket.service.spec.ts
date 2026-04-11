import { TestBed } from '@angular/core/testing';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideStore } from '@ngxs/store';
import { UserState } from '../../stores/user/user.state';
import { WebSocketService } from './webSocket.service';

describe('WebSocketService', () => {
  let service: WebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore([UserState]), provideHttpClientTesting()],
    });
    service = TestBed.inject(WebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
