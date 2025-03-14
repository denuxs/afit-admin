import { Catalog } from './catalog';
import { Comment } from './comment';

export interface Exercise {
  id: number;
  name: string;
  description: string;
  photo: string;
  equipment: Catalog | null;
  muscle: Catalog;
  exercises_count: number;
  sets: number;
  repts: number;
  weight: number;
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
  weight: number;
}
