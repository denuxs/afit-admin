import { User } from './user';

export interface Measure {
  id: number;
  comment: string;
  user: User;
  created: Date;
  is_active: boolean;
  measures: {
    abdomen: number;
    arm_left: number;
    arm_right: number;
    back: number;
    chest: number;
    forearm: number;
    glutes: number;
    hips: number;
    leg_left: number;
    leg_right: number;
    waist: number;
    weight: number;
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
  client: number;
  is_active: boolean;
  measures: {
    abdomen: number;
    arm_left: number;
    arm_right: number;
    back: number;
    chest: number;
    forearm: number;
    glutes: number;
    hips: number;
    leg_left: number;
    leg_right: number;
    waist: number;
    weight: number;
  };
}
