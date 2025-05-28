import { Exercise } from './exercise';
import { User } from './user';

export interface Routine {
  id: number;
  title: string;
  level: string;
  level_display: string;
  description: string;
  exercises: Exercise[];
  user: User;
  // order: number;
  created: Date;
  is_active: boolean;
}

export interface RoutineList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Routine[];
}

export interface RoutineDto {
  title: string;
  description?: string;
  user: number;
  level: string;
  is_active: boolean;
  exercises: {
    routine: number;
    exercise: number;
    sets: number;
    repts: number;
  };
}
