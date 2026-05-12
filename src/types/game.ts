export type SlothState =
  | 'idle'
  | 'walking'
  | 'walking_to_food'
  | 'eating'
  | 'sleeping_ground'
  | 'sleeping_tree'
  | 'hanging'
  | 'swimming'
  | 'grabbed'
  | 'falling'
  | 'flipped'
  | 'getting_up'
  | 'wobbling'
  | 'playing';

export type WobblePart =
  | 'head'
  | 'body'
  | 'leftArm'
  | 'rightArm'
  | 'leftLeg'
  | 'rightLeg';

export const WOBBLE_PARTS: WobblePart[] = [
  'head',
  'leftArm',
  'rightArm',
  'body',
  'leftLeg',
  'rightLeg',
];

export type DropZone = 'ground' | 'tree' | 'water';

export interface TreeConfig {
  position: [number, number, number];
  hangPoint: [number, number, number];
  trunkHeight: number;
}

export interface SlothStats {
  hunger: number; // 0-100, 100 = full
  thirst: number; // 0-100, 100 = quenched
  sleepiness: number; // 0-100, 100 = well-rested
}

export interface PendingInteraction {
  type: 'click' | 'food_notice';
  timestamp: number;
  resolveAt: number;
  data?: {
    clickCount?: number;
    appleId?: string;
    applePosition?: [number, number, number];
  };
}

export interface AppleData {
  id: string;
  position: [number, number, number];
  eaten: boolean;
}

export type TimeSpeed = 0.5 | 1 | 2 | 5 | 10 | 30;

export const TIME_SPEEDS: TimeSpeed[] = [0.5, 1, 2, 5, 10, 30];
