import { Exercise } from './exercise';
import { User } from './user';

export interface Routine {
  id: number;
  name: string;
  description: string;
  day: string;
  user: User;
  photo: string;
  exercises: Exercise[];
  created: Date;
}

export interface RoutineDto {
  name: string;
  description: string;
  day: string;
  user: User;
  exercises: number[];
}
