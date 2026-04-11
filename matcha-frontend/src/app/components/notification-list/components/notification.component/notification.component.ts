import { Component, computed, inject, input, output } from '@angular/core';
import { I18nPipe } from '../../../../core/pipes/i18n/i18n.pipe';
import { I18nService } from '../../../../core/services/i18nService/i18n.service';
import { ButtonLightPrimaryDirective } from '../../../../directives/buttons/button-light-primary.directive';
import { AvatarComponent } from '../../../avatar/avatar.component';
import { IconComponent } from '../../../icon/icon.component';
import { NotificationItem } from '../../notification-list.types';

@Component({
  selector: 'app-notification',
  imports: [I18nPipe, ButtonLightPrimaryDirective, IconComponent, AvatarComponent],
  templateUrl: './notification.component.html',
})
export class NotificationComponent {
  readonly #i18nService = inject(I18nService);

  readonly notification = input.required<NotificationItem>();
  readonly click = output<void>();

  readonly notificationTitle = computed(() => {
    const notification = this.notification();

    if (notification.view === 'message') {
      return notification.user.displayName;
    }

    switch (notification.type) {
      case 'match':
        return this.#i18nService.translate(
          '{displayName} est une correspondance ! Commencez à discuter maintenant',
          {
            displayName: notification.user.displayName,
          },
        )();
      case 'like':
        return this.#i18nService.translate('{displayName} a liké votre profil', {
          displayName: notification.user.displayName,
        })();
      case 'visit':
        return this.#i18nService.translate('{displayName} a vu votre profil', {
          displayName: notification.user.displayName,
        })();
      case 'message':
        return this.#i18nService.translate('{displayName} vous a envoyé un message', {
          displayName: notification.user.displayName,
        })();
      default:
        throw new Error(`Unknown notification type: ${notification.type}`);
    }
  });

  readonly dateLabel = computed(() => {
    const notification = this.notification();

    const now = new Date();
    const createdAt = new Date(notification.createdAt);
    const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat(this.#i18nService.getCurrentLang(), {
      numeric: 'auto',
      style: notification.view === 'message' ? 'narrow' : undefined,
    });

    if (diffInSeconds < 60) {
      return rtf.format(0, 'second');
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return rtf.format(-minutes, 'minute');
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return rtf.format(-hours, 'hour');
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return rtf.format(-days, 'day');
    }
  });

  readonly notificationSubtitle = computed(() => {
    const notification = this.notification();

    if (notification.view === 'message') {
      return notification.content;
    }

    return this.dateLabel();
  });

  readonly notificationSideText = computed(() => this.dateLabel());
}
