import { Message } from '../../../pages/chats/components/conversation.component/conversation.component.types';
import { UserPresence } from '../../stores/userPresence/userPresence.types';

export type WebSocketServerMessage =
  | { type: 'pong' }
  | { type: 'presence'; payload: WebSocketPresenceMessage }
  | { type: 'message'; payload: WebSocketMessageMessage };

export interface WebSocketPresenceMessage {
  userUUID: string;
  presence: UserPresence;
}

export type WebSocketMessageMessage = Message;

export type WebSocketClientMessage = { type: 'ping' };
