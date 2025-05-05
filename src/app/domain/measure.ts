import { User } from './user';

export interface Measure {
  id: number;
  comment: string;
  user: User;
  created: Date;
  is_active: boolean;
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

export interface MeasureList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Measure[];
}
export interface MeasureDto {
  comment: string;
  user: number;
  is_active: boolean;
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
