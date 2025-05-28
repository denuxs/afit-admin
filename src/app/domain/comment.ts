import { User } from './user';

export interface Comment {
  id: number;
  content: string;
  created: Date;
  user: User;
}

export interface CommentDto {
  content: string;
  content_type: number;
  object_id: number;
  user: number;
}
