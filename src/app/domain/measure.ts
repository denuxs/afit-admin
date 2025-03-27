import { User } from './user';

export interface Measure {
  id: number;
  comment: string;
  user: User;
  created: Date;
  measures: {
    weight: number;
    back: number;
    chest: number;
    abdomen: number;
    arm_left: number;
    arm_right: number;
    forearm: number;
    hips: number;
    leg_left: number;
    leg_right: number;
    waist: number;
    glutes: number;
  };
}

export interface MeasureDto {
  comment: string;
  user: number;
  measures: {
    weight: number;
    back: number;
    chest: number;
    abdomen: number;
    arm_left: number;
    arm_right: number;
    forearm: number;
    hips: number;
    leg_left: number;
    leg_right: number;
    waist: number;
    glutes: number;
  };
}
