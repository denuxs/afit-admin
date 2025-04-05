import { Catalog } from './catalog';
import { Comment } from './comment';

export interface Exercise {
  id: number;
  name: string;
  description: string;
  image: string;
  user: number;
  equipment: Catalog;
  muscle: Catalog;
  comments: Comment[];
  created: Date;
}

export interface ExerciseDto {
  name: string;
  description: string;
  equipment: number;
  muscle: number;
  user: number;
}
