export interface User {
  id: number;
  username: string;
  photo: string;
  phone: number;
  age: number;
  password: string;
  gender: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  is_active: boolean;
  date_joined: Date;
  last_login: Date;
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
