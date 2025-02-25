import { User } from './user';

export interface Comment {
  id: number;
  name: string;
  body: string;
  created: Date;
  user: User;
}

export interface CommentDto {
  body: string;
  content_type: number;
  object_id: number;
  user: number;
}
