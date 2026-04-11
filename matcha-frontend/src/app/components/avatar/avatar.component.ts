import { Component, computed, inject, input, OnDestroy, OnInit, viewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { PublicUser } from '../../core/stores/user/user.state.types';
import { UserPresenceState } from '../../core/stores/userPresence/userPresence.state';
import {
  UserPresenceAddTrackedUsers,
  UserPresenceRemoveTrackedUsers,
} from './../../core/stores/userPresence/userPresence.actions';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.component.html',
})
export class AvatarComponent implements OnInit, OnDestroy {
  readonly #store = inject(Store);
  readonly user = input.required<PublicUser>();

  readonly size = input<'md' | 'sm'>('md');
  readonly displayBadge = input<boolean>(true);

  readonly presenceBadgeRef = viewChild('presenceBadge');

  readonly #presenceSignal = computed(() => {
    if (!this.displayBadge()) {
      return undefined;
    }

    const user = this.user();

    return this.#store.selectSignal(UserPresenceState.getPresenceByUUID(user.userUUID));
  });

  readonly presence = computed(() => this.#presenceSignal()?.());

  ngOnInit(): void {
    requestAnimationFrame(() => {
      if (this.presenceBadgeRef()) {
        this.#store.dispatch(new UserPresenceAddTrackedUsers([this.user().userUUID]));
      }
    });
  }

  ngOnDestroy(): void {
    if (this.presenceBadgeRef()) {
      this.#store.dispatch(new UserPresenceRemoveTrackedUsers([this.user().userUUID]));
    }
  }
}
