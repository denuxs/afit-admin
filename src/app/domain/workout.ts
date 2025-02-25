import { Routine } from './routine';

export interface Workout {
  id: number;
  day: string;
  name: string;
  routines: Routine[];
  created: Date;
}

export interface WorkoutDto {
  name: string;
}
