import { ComponentFixture, TestBed } from '@angular/core/testing';

import { mockPublicUsers } from '../../helpers/mocks/ressource.mocks';
import { NotificationListComponent } from './notification-list.component';
import { NotificationItem } from './notification-list.types';
import { provideStore } from '@ngxs/store';
import { I18nState } from '../../core/stores/i18n/i18n.state';

describe('NotificationList', () => {
  let component: NotificationListComponent;
  let fixture: ComponentFixture<NotificationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationListComponent],
      providers: [provideStore([I18nState])],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput(
      'notifications',
      mockPublicUsers(12).map(
        (user, index) =>
          ({
            id: index.toString(),
            type: ['match', 'message', 'like', 'visit'][index % 4] as any,
            relatedUser: user,
            isRead: false,
            content: `Notification content ${index}`,
            createdAt: new Date(new Date().getTime() - index * 5 * 60 * 1000),
            view: 'notification',
            shouldDisplayBadge: index % 4 === 0,
            shouldDisplayChatButton: index % 4 === 1,
            shouldDisplayIcon: index % 4 !== 1,
            badgeCount: index % 5 === 0 ? 100 : index % 5,
          }) as NotificationItem,
      ),
    );
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
