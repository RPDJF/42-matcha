import { PublicUser } from '../../../../core/stores/user/user.state.types';

export interface Message {
  conversationUUID: string;
  userUUID: string;
  messageUUID: string;
  message: string;
  attachments?: {
    type: string;
    url: string;
  }[];
  createdAt: number;
}

export interface ConversationData {
  conversationUUID: string;
  user: PublicUser;
  messages: Message[];
}
