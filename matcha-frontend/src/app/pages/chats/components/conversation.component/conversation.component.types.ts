import { PublicUser } from '../../../../core/stores/user/user.state.types';

export interface Message {
  conversationUUID: string;
  userUUID: string;
  messageUUID: string;
  message: string;
  attachments?: {
    type: 'image';
    url: string;
  }[];
  createdAt: number;
}

export interface ConversationData {
  user: PublicUser;
  messages: Message[];
}
