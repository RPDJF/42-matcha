import { Component, computed, input, model, output } from '@angular/core';
import { I18nPipe } from '../../core/pipes/i18n/i18n.pipe';
import { NotificationComponent } from './components/notification.component/notification.component';
import { NotificationItem, NotificationListFilter } from './notification-list.types';

@Component({
  selector: 'app-notification-list',
  imports: [NotificationComponent, I18nPipe],
  templateUrl: './notification-list.component.html',
  host: {
    class: 'w-full',
  },
})
export class NotificationListComponent {
  readonly notifications = model.required<NotificationItem[]>();
  readonly isLoading = input<boolean>(false);
  readonly filter = input<NotificationListFilter>();

  readonly openChat = output<string>();
  readonly openProfile = output<string>();

  readonly filteredNotifications = computed(() => {
    const filter = this.filter();
    let notifications = this.notifications();

    if (filter?.type)
      notifications = notifications.filter((notification) => notification.type === filter.type);
    if (filter?.searchDisplayname) {
      notifications = notifications.filter((notification) =>
        notification.relatedUser.displayName
          .toLowerCase()
          .includes(filter.searchDisplayname!.toLowerCase()),
      );
    }
    return notifications;
  });

  onNotificationClick(notification: NotificationItem) {
    // TODO: implement mark as read action
    this.notifications.update((notifications) => {
      const newNotifications = [...notifications];
      const currentNotification = newNotifications.find((n) => n.id === notification.id);
      if (!currentNotification) return notifications;
      currentNotification.isRead = true;
      return newNotifications;
    });

    switch (notification.type) {
      case 'message':
        this.openChat.emit(notification.relatedUser.userUUID);
        break;
      case 'match':
      case 'like':
      case 'visit':
        this.openProfile.emit(notification.relatedUser.userUUID);
        break;
    }
  }
}
