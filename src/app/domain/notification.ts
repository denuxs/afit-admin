import { Comment } from './comment';
import { User } from './user';

export interface Notification {
  id: number;
  user: User;
  is_read: number;
  comment: Comment;
  created: Date;
}
