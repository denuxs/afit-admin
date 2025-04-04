import { Catalog } from './catalog';
import { Comment } from './comment';

export interface Exercise {
  id: number;
  name: string;
  description: string;
  image: string;
  equipment: Catalog | null;
  muscle: Catalog;
  exercises_count: number;
  comments: Comment[];
  created: Date;
  user: number;
}

export interface ExerciseDto {
  name: string;
  description?: string;
  equipment: number;
  muscle: number;
  user: number;
}
