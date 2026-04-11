import { Component, inject, input } from '@angular/core';
import { Store } from '@ngxs/store';
import { AvatarComponent } from '../../../../components/avatar/avatar.component';
import { IconComponent } from '../../../../components/icon/icon.component';
import { I18nPipe } from '../../../../core/pipes/i18n/i18n.pipe';
import { UserPresenceState } from '../../../../core/stores/userPresence/userPresence.state';
import { ConversationData } from './conversation.component.types';

@Component({
  selector: 'app-conversation',
  imports: [IconComponent, I18nPipe, AvatarComponent],
  templateUrl: './conversation.component.html',
  host: {
    class: 'grow',
  },
})
export class ConversationComponent {
  readonly #store = inject(Store);

  readonly conversationData = input.required<ConversationData | undefined>();
  readonly presences = this.#store.selectSignal(UserPresenceState.getPresences);

  isUserOnline(userUUID: string) {
    return this.#store.selectSignal(UserPresenceState.getPresenceByUUID(userUUID));
  }
}
