import { Exercise } from './exercise';
import { User } from './user';

export interface Workout {
  id: number;
  day: string;
  day_display: string;
  name: string;
  level: string;
  level_display: string;
  description: string;
  exercises: Exercise[];
  user: User;
  order: number;
  created: Date;
  is_active: boolean;
}

export interface WorkoutList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Workout[];
}

export interface WorkoutDto {
  name: string;
  description?: string;
  user: number;
  day: number;
  level: string;
  is_active: boolean;
  exercises: {
    workout: number;
    exercise: number;
    sets: number;
    repts: number;
  };
}
