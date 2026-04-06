import { Component, computed, input, model, output } from '@angular/core';
import { NotificationComponent } from './components/notification.component/notification.component';
import { NotificationItem } from './notification-list.types';

@Component({
  selector: 'app-notification-list',
  imports: [NotificationComponent],
  templateUrl: './notification-list.component.html',
  host: {
    class: 'w-full',
  },
})
export class NotificationListComponent {
  readonly notifications = model.required<NotificationItem[]>();
  readonly isLoading = input<boolean>(false);
  readonly filter = input<{
    type?: 'match' | 'message' | 'like' | 'visit';
  }>();

  readonly openChat = output<string>();
  readonly openProfile = output<string>();

  readonly filteredNotifications = computed(() => {
    const notifications = this.notifications();

    if (!this.filter()?.type) return notifications;
    return notifications.filter((notification) => notification.type === this.filter()?.type);
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
