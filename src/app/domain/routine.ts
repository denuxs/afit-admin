import { Exercise } from './exercise';

export interface Routine {
  id: number;
  name: string;
  photo: string;
  exercises: Exercise[];
  created: Date;
}

export interface RoutineDto {
  name: string;
}
