export interface User {
  id: number;
  username: string;
  fullname: string;
  avatar: string;
  company: number;
  password: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  date_joined: Date;
  last_login: Date;
}

export interface UserList {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

export interface UserDto {
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  is_active: boolean;
  company: number;
  // is_superuser: boolean;
}
