import { Component, computed, contentChild, inject, input } from '@angular/core';
import { Store } from '@ngxs/store';
import { PublicUser } from '../../core/stores/user/user.state.types';
import { UserPresenceState } from '../../core/stores/userPresence/userPresence.state';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.component.html',
})
export class AvatarComponent {
  readonly #store = inject(Store);
  readonly user = input.required<PublicUser>();

  readonly size = input<'md' | 'sm'>('md');
  readonly displayBadge = input<boolean>(true);

  readonly badgeElement = contentChild('badge');

  readonly #presenceSignal = computed(() => {
    if (!this.displayBadge()) {
      return undefined;
    }

    const user = this.user();

    return this.#store.selectSignal(UserPresenceState.getPresenceByUUID(user.userUUID));
  });

  readonly presence = computed(() => this.#presenceSignal()?.());
}
