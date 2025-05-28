import { User } from './user';

export interface Post {
  id: number;
  content: string;
  photo: string;
  user: User;
  created: Date;
}
