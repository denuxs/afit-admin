import { Exercise } from './exercise';
import { User } from './user';

export interface Workout {
  id: number;
  day: string;
  name: string;
  description: string;
  exercises: Exercise[];
  user: User;
  created: Date;
  is_active: boolean;
}

export interface WorkoutDto {
  name: string;
  description?: string;
  user: number;
  day: number;
  is_active: boolean;
  exercises: {
    workout: number;
    exercise: number;
    sets: number;
    repts: number;
  };
}
