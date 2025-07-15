import { Comment } from './comment';
import { User } from './user';

export interface Notification {
  id: number;
  user: User;
  is_read: number;
  comment: Comment;
  created: string;
}

export interface NotificationList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
}
