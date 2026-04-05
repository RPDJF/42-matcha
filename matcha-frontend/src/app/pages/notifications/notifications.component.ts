import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RadioButtonGroupComponent } from '../../components/forms/inputs/radio-button-group/radio-button-group.component';
import { RadioButtonComponent } from '../../components/forms/inputs/radio-button-group/radio-button/radio-button.component';
import { LayoutHeaderComponent } from '../../components/layout/layout-header/layout-header.component';
import { NotificationListComponent } from '../../components/notification-list/notification-list.component';
import { NotificationItem } from '../../components/notification-list/notification-list.types';
import { RESEARCH_FILTERS_LIMITS } from '../../core/consts/researchFiltersLimits.consts';
import { I18nPipe } from '../../core/pipes/i18n/i18n.pipe';
import { ButtonLinkDirective } from '../../directives/buttons/button-link.directive';
import { appFormBase } from '../../directives/forms/form-base.directive';

type UserStatusFilter = 'all' | 'online' | 'new';

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
  readonly showFilters = signal<boolean>(false);
  readonly researchFiltersLimits = RESEARCH_FILTERS_LIMITS;

  readonly filtersFormGroup = new FormGroup({
    userStatus: new FormControl<UserStatusFilter>('all', [Validators.required]),
  });

  onReadAllClick(event: Event) {
    event.preventDefault();
    // TODO: implement read all notifications
  }

  onNotificationClick(event: Event) {
    // TODO: implement notification click
  }

  onChatClick(event: Event) {
    // TODO: implement chat click
  }

  // TODO: remove mock and use real values
  readonly mockUser: NotificationItem[] = [
    {
      id: '0',
      view: 'message',
      type: 'message',
      content: 'Salut, ça te dirait de discuter ?',
      createdAt: new Date(), // now
      relatedUser: {
        age: 20,
        biography:
          "Incroyable hôte de l'incroyable cirque digital | Responsable du divertissement des humains | Je cherche des copains",
        displayName: 'Caine',
        gender: 'female',
        interests: ['Aventures', 'Humains', 'Cirque'],
        isAdmin: false,
        lastAlive: 29809,
        pictures: ['error'],
        rating: 4,
        sexuality: 'bisexual',
        status: 'free',
        userUUID: 'jfh473264238gd',
        avatar:
          'https://i.ytimg.com/vi/aAg3bwzSuLk/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAbUo54f58ng1XF1-V6KrD_vmVNSw',
        city: 'Charrat',
        distance: 9999,
      },
      shouldDisplayBadge: true,
      shouldDisplayChatButton: true,
      shouldDisplayIcon: true,
      badgeCount: 1,
      isRead: false,
    },
    {
      id: '1',
      view: 'notification',
      type: 'message',
      content: 'Salut, ça te dirait de discuter ?',
      createdAt: new Date(new Date().getTime() - 5 * 60 * 1000), // 5 minutes ago
      relatedUser: {
        age: 20,
        biography:
          "Incroyable hôte de l'incroyable cirque digital | Responsable du divertissement des humains | Je cherche des copains",
        displayName: 'Caine',
        gender: 'female',
        interests: ['Aventures', 'Humains', 'Cirque'],
        isAdmin: false,
        lastAlive: 29809,
        pictures: ['error'],
        rating: 4,
        sexuality: 'bisexual',
        status: 'free',
        userUUID: 'jfh473264238gd',
        avatar:
          'https://i.ytimg.com/vi/aAg3bwzSuLk/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAbUo54f58ng1XF1-V6KrD_vmVNSw',
        city: 'Charrat',
        distance: 9999,
      },
      shouldDisplayBadge: true,
      shouldDisplayChatButton: true,
      shouldDisplayIcon: true,
      badgeCount: 1,
      isRead: false,
    },
    {
      id: '2',
      view: 'message',
      type: 'message',
      content: 'Salut, ça te dirait de discuter ?',
      createdAt: new Date(), // now
      relatedUser: {
        age: 20,
        biography:
          "Incroyable hôte de l'incroyable cirque digital | Responsable du divertissement des humains | Je cherche des copains",
        displayName: 'Caine',
        gender: 'female',
        interests: ['Aventures', 'Humains', 'Cirque'],
        isAdmin: false,
        lastAlive: 29809,
        pictures: ['error'],
        rating: 4,
        sexuality: 'bisexual',
        status: 'free',
        userUUID: 'jfh473264238gd',
        avatar:
          'https://i.ytimg.com/vi/aAg3bwzSuLk/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAbUo54f58ng1XF1-V6KrD_vmVNSw',
        city: 'Charrat',
        distance: 9999,
      },
      shouldDisplayBadge: true,
      shouldDisplayChatButton: true,
      shouldDisplayIcon: true,
      badgeCount: 100,
      isRead: false,
    },
    {
      id: '3',
      view: 'notification',
      type: 'message',
      content: 'Salut, ça te dirait de discuter ?',
      createdAt: new Date(new Date().getTime() - 5 * 60 * 1000), // 5 minutes ago
      relatedUser: {
        age: 20,
        biography:
          "Incroyable hôte de l'incroyable cirque digital | Responsable du divertissement des humains | Je cherche des copains",
        displayName: 'Caine',
        gender: 'female',
        interests: ['Aventures', 'Humains', 'Cirque'],
        isAdmin: false,
        lastAlive: 29809,
        pictures: ['error'],
        rating: 4,
        sexuality: 'bisexual',
        status: 'free',
        userUUID: 'jfh473264238gd',
        avatar:
          'https://i.ytimg.com/vi/aAg3bwzSuLk/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAbUo54f58ng1XF1-V6KrD_vmVNSw',
        city: 'Charrat',
        distance: 9999,
      },
      shouldDisplayBadge: true,
      shouldDisplayChatButton: true,
      shouldDisplayIcon: true,
      badgeCount: 100,
      isRead: false,
    },
    {
      id: '4',
      view: 'message',
      type: 'message',
      content: 'Salut, ça te dirait de discuter ?',
      createdAt: new Date(), // now
      relatedUser: {
        age: 20,
        biography:
          "Incroyable hôte de l'incroyable cirque digital | Responsable du divertissement des humains | Je cherche des copains",
        displayName: 'Caine',
        gender: 'female',
        interests: ['Aventures', 'Humains', 'Cirque'],
        isAdmin: false,
        lastAlive: 29809,
        pictures: ['error'],
        rating: 4,
        sexuality: 'bisexual',
        status: 'free',
        userUUID: 'jfh473264238gd',
        avatar:
          'https://i.ytimg.com/vi/aAg3bwzSuLk/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAbUo54f58ng1XF1-V6KrD_vmVNSw',
        city: 'Charrat',
        distance: 9999,
      },
      shouldDisplayBadge: true,
      shouldDisplayChatButton: true,
      shouldDisplayIcon: true,
      isRead: false,
    },
    {
      id: '5',
      view: 'notification',
      type: 'message',
      content: 'Salut, ça te dirait de discuter ?',
      createdAt: new Date(new Date().getTime() - 5 * 60 * 1000), // 5 minutes ago
      relatedUser: {
        age: 20,
        biography:
          "Incroyable hôte de l'incroyable cirque digital | Responsable du divertissement des humains | Je cherche des copains",
        displayName: 'Caine',
        gender: 'female',
        interests: ['Aventures', 'Humains', 'Cirque'],
        isAdmin: false,
        lastAlive: 29809,
        pictures: ['error'],
        rating: 4,
        sexuality: 'bisexual',
        status: 'free',
        userUUID: 'jfh473264238gd',
        avatar:
          'https://i.ytimg.com/vi/aAg3bwzSuLk/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAbUo54f58ng1XF1-V6KrD_vmVNSw',
        city: 'Charrat',
        distance: 9999,
      },
      shouldDisplayBadge: true,
      shouldDisplayChatButton: true,
      shouldDisplayIcon: true,
      isRead: false,
    },
    {
      id: '6',
      view: 'message',
      type: 'message',
      content: 'Salut, ça te dirait de discuter ?',
      createdAt: new Date(), // now
      relatedUser: {
        age: 20,
        biography:
          "Incroyable hôte de l'incroyable cirque digital | Responsable du divertissement des humains | Je cherche des copains",
        displayName: 'Caine',
        gender: 'female',
        interests: ['Aventures', 'Humains', 'Cirque'],
        isAdmin: false,
        lastAlive: 29809,
        pictures: ['error'],
        rating: 4,
        sexuality: 'bisexual',
        status: 'free',
        userUUID: 'jfh473264238gd',
        avatar:
          'https://i.ytimg.com/vi/aAg3bwzSuLk/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAbUo54f58ng1XF1-V6KrD_vmVNSw',
        city: 'Charrat',
        distance: 9999,
      },
      shouldDisplayBadge: true,
      shouldDisplayChatButton: true,
      shouldDisplayIcon: true,
      isRead: false,
      badgeCount: 0,
    },
    {
      id: '7',
      view: 'notification',
      type: 'message',
      content: 'Salut, ça te dirait de discuter ?',
      createdAt: new Date(new Date().getTime() - 5 * 60 * 1000), // 5 minutes ago
      relatedUser: {
        age: 20,
        biography:
          "Incroyable hôte de l'incroyable cirque digital | Responsable du divertissement des humains | Je cherche des copains",
        displayName: 'Caine',
        gender: 'female',
        interests: ['Aventures', 'Humains', 'Cirque'],
        isAdmin: false,
        lastAlive: 29809,
        pictures: ['error'],
        rating: 4,
        sexuality: 'bisexual',
        status: 'free',
        userUUID: 'jfh473264238gd',
        avatar:
          'https://i.ytimg.com/vi/aAg3bwzSuLk/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAbUo54f58ng1XF1-V6KrD_vmVNSw',
        city: 'Charrat',
        distance: 9999,
      },
      shouldDisplayBadge: true,
      shouldDisplayChatButton: true,
      shouldDisplayIcon: true,
      isRead: false,
      badgeCount: 0,
    },
  ];
}
