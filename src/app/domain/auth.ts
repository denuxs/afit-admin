import { User } from './user';

export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterDto {
  username: string;
  password: string;
}

export interface RegisterError {
  username?: string[];
  password?: string[];
}
