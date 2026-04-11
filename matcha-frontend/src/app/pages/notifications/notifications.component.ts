import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, tap } from 'rxjs';
import { RadioButtonGroupComponent } from '../../components/forms/inputs/radio-button-group/radio-button-group.component';
import { RadioButtonComponent } from '../../components/forms/inputs/radio-button-group/radio-button/radio-button.component';
import { LayoutHeaderComponent } from '../../components/layout/layout-header/layout-header.component';
import { NotificationListComponent } from '../../components/notification-list/notification-list.component';
import { NotificationItem } from '../../components/notification-list/notification-list.types';
import { RESEARCH_FILTERS_LIMITS } from '../../core/consts/researchFiltersLimits.consts';
import { I18nPipe } from '../../core/pipes/i18n/i18n.pipe';
import { ButtonLinkDirective } from '../../directives/buttons/button-link.directive';
import { appFormBase } from '../../directives/forms/form-base.directive';
import { generateRandomPublicUsers } from '../../helpers/mocks/users.mock';
import { NotificationListFilter } from './../../components/notification-list/notification-list.types';

@Component({
  selector: 'app-notifications',
  imports: [
    LayoutHeaderComponent,
    I18nPipe,
    appFormBase,
    RadioButtonGroupComponent,
    RadioButtonComponent,
    ReactiveFormsModule,
    ButtonLinkDirective,
    NotificationListComponent,
  ],
  templateUrl: './notifications.component.html',
  host: {
    class: 'h-full',
  },
})
export class NotificationsComponent {
  readonly researchFiltersLimits = RESEARCH_FILTERS_LIMITS;

  readonly filtersFormGroup = new FormGroup({
    notificationsFilter: new FormControl<NotificationItem['type'] | 'all'>('all', [
      Validators.required,
    ]),
  });

  readonly filter = toSignal(
    this.filtersFormGroup.controls.notificationsFilter.valueChanges.pipe(
      map((val) => (val === 'all' ? undefined : val)),
      map((val) => val ?? undefined),
      map(
        (val) =>
          ({
            type: val,
          }) as NotificationListFilter,
      ),
      tap((val) => console.log('filter changed:', val)),
    ),
    {
      initialValue: undefined,
    },
  );

  onReadAllClick(event: Event) {
    event.preventDefault();
    // TODO: implement read all notifications
    this.mockNotifications.forEach((notification) => (notification.isRead = true));
  }

  onNotificationClick(event: Event) {
    // TODO: implement notification click
  }

  onChatClick(event: Event) {
    // TODO: implement chat click
  }

  // TODO: remove mock and use real values
  readonly mockNotifications: NotificationItem[] = generateRandomPublicUsers(96)
    .map(
      (user, index) =>
        ({
          id: index.toString(),
          view: 'notification',
          type: ['message', 'like', 'match', 'visit'][index % 4] as NotificationItem['type'],
          content: 'Salut, ça te dirait de discuter ?',
          createdAt: new Date(new Date().getTime() - index * 5 * 60 * 1000),
          user: user,
          shouldDisplayIcon: true,
          shouldDisplayChatButton: true,
          shouldDisplayBadge: true,
          badgeCount: index % 5 === 0 ? 100 : index % 5,
          isRead: index % 3 === 0,
        }) as NotificationItem,
    )
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
