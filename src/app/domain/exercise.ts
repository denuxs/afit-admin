import { Comment } from './comment';
import { Equipment } from './equipment';
import { Muscle } from './muscle';

export interface Exercise {
  id: number;
  name: string;
  description: string;
  photo: string;
  equipment: Equipment;
  muscle: Muscle;
  exercises_count: number;
  sets: number;
  repts: number;
  comments: Comment[];
  created: Date;
}

export interface ExerciseDto {
  name: string;
  description?: string;
  equipment: number;
  muscle: number;
  sets: number;
  repts: number;
}
