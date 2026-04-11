import { Message } from '../../../pages/chats/components/conversation.component/conversation.component.types';
import { UserPresence } from '../../stores/userPresence/userPresence.types';

export type WebSocketServerMessage =
  | { type: 'pong' }
  | { type: 'presence'; payload: WebSocketServerPresenceMessage }
  | { type: 'message'; payload: WebSocketServerMessageMessage };

export interface WebSocketServerPresenceMessage {
  userUUID: string;
  presence: UserPresence;
}

export type WebSocketServerMessageMessage = Message;

export type WebSocketClientMessage =
  | { type: 'ping' }
  | { type: 'presence'; payload: WebSocketClientPresenceMessage };

export interface WebSocketClientPresenceMessage {
  action: 'append' | 'reset' | 'remove';
  userUUIDs: string[];
}
