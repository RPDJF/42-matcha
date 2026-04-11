import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideStore } from '@ngxs/store';
import { UserPresenceState } from '../../core/stores/userPresence/userPresence.state';
import { getRandomPublicUser } from '../../helpers/mocks/users.mock';
import { AvatarComponent } from './avatar.component';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarComponent],
      providers: [provideStore([UserPresenceState])],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarComponent);
    fixture.componentRef.setInput('user', getRandomPublicUser());
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
