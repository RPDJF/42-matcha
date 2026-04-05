import { Component, input } from '@angular/core';
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
  readonly notifications = input.required<NotificationItem[]>();
  readonly isLoading = input<boolean>(false);
}
