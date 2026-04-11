import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideStore } from '@ngxs/store';
import { I18nState } from '../../../../core/stores/i18n/i18n.state';
import { mockRandomPublicUser } from '../../../../helpers/mocks/ressource.mocks';
import { NotificationItem } from '../../notification-list.types';
import { NotificationComponent } from './notification.component';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationComponent],
      providers: [provideStore([I18nState])],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('notification', {
      user: mockRandomPublicUser(),
      type: 'match',
      content: 'You have a new match!',
      createdAt: new Date(),
      id: '1',
      isRead: false,
      view: 'notification',
      shouldDisplayBadge: true,
      shouldDisplayChatButton: false,
      shouldDisplayIcon: true,
      badgeCount: 1,
    } as NotificationItem);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
