import { Client } from './client';
import { Routine } from './routine';
import { User } from './user';

export interface Workout {
  id: number;
  // day: string;
  // day_display: string;
  title: string;
  // level: string;
  // level_display: string;
  description: string;
  routines: Routine[];
  user: User;
  client: Client;
  // order: number;
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
  title: string;
  description?: string;
  user: number;
  // day: number;
  // level: string;
  // is_active: boolean;
  // exercises: {
  //   workout: number;
  //   exercise: number;
  //   sets: number;
  //   repts: number;
  // };
}
