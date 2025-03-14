import { User } from './user';

export interface Measure {
  id: number;
  abdomen: number;
  arm_left: number;
  arm_right: number;
  back: number;
  chest: number;
  comment: string;
  created: Date;
  forearm: number;
  glutes: number;
  height: number;
  hips: number;
  leg_left: number;
  leg_right: number;
  photo_back: string;
  photo_front: string;
  photo_left: string;
  user: User;
  waist: number;
  weight: number;
}

export interface MeasureDto {
  abdomen: number;
  arm_left: number;
  arm_right: number;
  back: number;
  chest: number;
  comment: string;
  forearm: number;
  glutes: number;
  height: number;
  hips: number;
  leg_left: number;
  leg_right: number;
  user: number;
  waist: number;
  weight: number;
}
