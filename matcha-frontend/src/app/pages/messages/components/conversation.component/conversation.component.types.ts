import { PublicUser } from '../../../../core/stores/user/user.state.types';

export interface Message {
  message: string;
  attachments?: string[];
  createdAt: number;
  relatedUserUUID: string;
}

export interface ConversationData {
  relatedUser: PublicUser;
  messages: Message[];
}
