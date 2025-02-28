import { Routine } from './routine';
import { User } from './user';

export interface Workout {
  id: number;
  day: string;
  name: string;
  routines: Routine[];
  user: User;
  created: Date;
}

export interface WorkoutDto {
  name: string;
  user: number;
  day: number;
  routines: [];
}
