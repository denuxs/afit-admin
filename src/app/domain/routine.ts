import { Exercise } from './exercise';

export interface Routine {
  id: number;
  name: string;
  description: string;
  photo: string;
  exercises: Exercise[];
  created: Date;
}

export interface RoutineDto {
  name: string;
  description: string;
  exercises: number[];
}
