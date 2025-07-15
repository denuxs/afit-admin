import { User } from './user';

export interface Client {
  id: number;
  user: User;
  fullname: string;
  phone: number;
  coach: User;
  age: number;
  gender: string;
  weight: string;
  height: string;
}

export interface ClientList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Client[];
}
