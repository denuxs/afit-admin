export const GENDERS = [
  {
    name: 'Masculino',
    id: 'male',
  },
  {
    name: 'Femenino',
    id: 'female',
  },
];

export const ROLES = [
  {
    name: 'Admin',
    id: 'admin',
  },
  {
    name: 'Entrenador',
    id: 'coach',
  },
  {
    name: 'Cliente',
    id: 'client',
  },
];

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
  role: string;
  coach: number;
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
