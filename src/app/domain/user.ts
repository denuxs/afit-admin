export interface User {
  id: number;
  username: string;
  photo: string;
  phone: number;
  age: number;
  password: string;
  gender: string;
  weight: string;
  height: string;
  experience_level: string;
  first_name: string;
  last_name: string;
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
  phone: string;
  age: string;
  first_name: string;
  last_name: string;
  gender: string;
  password: string;
  is_active: boolean;
  // is_superuser: boolean;
}
