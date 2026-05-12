import type { TreeConfig } from '@/types/game';

export const GROUND_SIZE = 20;
export const GROUND_Y = 0;

export const WATER_ZONE = {
  center: [-4, -0.05, 4] as [number, number, number],
  radius: 2.5,
};

export const TREE_CONFIGS: TreeConfig[] = [
  { position: [4, 0, -3], hangPoint: [4, 3.2, -3], trunkHeight: 4 },
  { position: [-2, 0, -5], hangPoint: [-2, 2.8, -5], trunkHeight: 3.5 },
  { position: [6, 0, 3], hangPoint: [6, 3.5, 3], trunkHeight: 4.2 },
];

export const BALL_INITIAL_POSITION: [number, number, number] = [2, 0.2, 2];
export const SLOTH_INITIAL_POSITION: [number, number, number] = [0, 0.5, 0];
export const SLOTH_GROUND_Y = 0.5;
