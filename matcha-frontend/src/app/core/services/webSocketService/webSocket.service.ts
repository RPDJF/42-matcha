import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { WebSocketClientMessage, WebSocketServerMessage } from './webSocket.service.types';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  #webSocket?: WebSocket;
  readonly #messages: Subject<WebSocketServerMessage> = new Subject();
  readonly #errorMessages: Subject<Event> = new Subject();

  constructor() {
    this.#connect();
  }

  #connect(wasClosed?: boolean) {
    const connect = () => {
      this.#webSocket = new WebSocket(environment.CORE_WS_ENDPOINT);

      this.#webSocket.onmessage = (event) => {
        this.#messages.next(JSON.parse(event.data));
      };

      this.#webSocket.onerror = (error) => {
        this.#errorMessages.next(error);
      };

      this.#webSocket.onclose = () => {
        console.log('Websocket connection closed');
        this.#connect(true);
      };
    };

    if (wasClosed) {
      setTimeout(() => connect(), 3000);
    } else {
      connect();
    }
  }

  sendMessage(message: WebSocketClientMessage) {
    if (this.#webSocket?.readyState === WebSocket.OPEN) {
      this.#webSocket?.send(JSON.stringify(message));
    }
  }

  getMessages$(): Observable<WebSocketServerMessage> {
    return this.#messages.asObservable();
  }
}
