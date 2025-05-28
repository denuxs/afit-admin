import { User } from './user';

export interface Client {
  id: number;
  user: User;
  fullname: string;
  photo: string;
  phone: number;
  age: number;
  gender: string;
  weight: string;
  height: string;
  experience_level: string;
}

export interface ClientList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Client[];
}
