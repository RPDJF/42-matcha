import { inject, Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { filter } from 'rxjs';
import { UserPresenceUpdatePresence } from '../../stores/userPresence/userPresence.actions';
import { WebSocketService } from '../webSocketService/webSocket.service';
import { WebSocketClientPresenceMessage } from '../webSocketService/webSocket.service.types';

@Injectable({
  providedIn: 'root',
})
export class UserPresenceService {
  readonly #store = inject(Store);
  readonly #websocketService = inject(WebSocketService);
  readonly #onWsPresenceMessage$ = this.#websocketService.messages$.pipe(
    filter((message) => message.type === 'presence'),
  );

  constructor() {
    this.#onWsPresenceMessage$.subscribe((message) => {
      this.#store.dispatch(
        new UserPresenceUpdatePresence(message.payload.userUUID, message.payload.presence),
      );
    });
  }

  #updateWsTrackedUsers(action: WebSocketClientPresenceMessage['action'], userUUIDs: string[]) {
    this.#websocketService.sendMessage({
      type: 'presence',
      payload: {
        action,
        userUUIDs: userUUIDs,
      },
    });
  }

  setTrackedUsers(userUUIDs: string[]) {
    this.#updateWsTrackedUsers('reset', userUUIDs);
  }

  addTrackedUser(userUUIDs: string[]) {
    this.#updateWsTrackedUsers('append', userUUIDs);
  }

  removeTrackedUser(userUUIDs: string[]) {
    this.#updateWsTrackedUsers('remove', userUUIDs);
  }
}
