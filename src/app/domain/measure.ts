import { User } from './user';

export interface Measure {
  id: number;
  user: User;
  comment: string;
  weight: number;
  chest: number;
  abdomen: number;
  back: number;
  arm_left: number;
  arm_right: number;
  leg_left: number;
  leg_right: number;
  waist: number;
  hips: number;
  photo_front: number;
  phot_back: number;
  created: Date;
}

export interface MeasureDto {
  user: number;
  // comment: string;
  // weight: number;
  // chest: number;
  abdomen: number;
  // back: number;
  // arm_left: number;
  // arm_right: number;
  // leg_left: number;
  // leg_right: number;
  // waist: number;
  // hips: number;
}
