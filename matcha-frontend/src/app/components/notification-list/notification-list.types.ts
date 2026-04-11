import { PublicUser } from '../../core/stores/user/user.state.types';

export interface NotificationItem {
  id: string;
  view: 'notification' | 'message';
  type: 'match' | 'message' | 'like' | 'visit';
  content: string;
  isRead?: boolean;
  createdAt: Date;
  user: PublicUser;
  badgeCount?: number;
  shouldDisplayIcon: boolean;
  shouldDisplayChatButton: boolean;
  shouldDisplayBadge: boolean;
}

export interface NotificationListFilter {
  type?: 'match' | 'message' | 'like' | 'visit';
  searchDisplayname?: string;
}
