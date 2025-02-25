export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  is_active: boolean;
  date_joined: Date;
}

export interface UserDto {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  is_active: boolean;
  is_superuser: boolean;
}
