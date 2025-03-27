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
}

export interface WorkoutDto {
  name: string;
  description?: string;
  user: number;
  day: number;
  exercises: {
    workout: number;
    exercise: number;
    sets: number;
    repts: number;
  };
}
