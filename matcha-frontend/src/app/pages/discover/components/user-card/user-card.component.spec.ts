import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicUser } from '../../../../core/stores/user/user.state.types';
import { UserCardComponent } from './user-card.component';
import { provideStore } from '@ngxs/store';
import { I18nState } from '../../../../core/stores/i18n/i18n.state';

describe('UserCardComponent', () => {
  const mockUser: PublicUser = {
    age: 21,
    biography: "Caine's bio",
    city: 'Charrat',
    displayName: 'Caine',
    distance: 69,
    gender: 'male',
    interests: ['interest'],
    isAdmin: false,
    lastAlive: 90000,
    pictures: ['image'],
    rating: 4,
    sexuality: 'heterosexual',
    status: 'couple',
    userUUID: '238129dsad',
    avatar: 'avatar',
  };

  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent],
      providers: [provideStore([I18nState])],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('user', mockUser);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
