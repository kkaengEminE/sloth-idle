import type { DropZone } from '@/types/game';
import { TREE_CONFIGS, WATER_ZONE } from '@/constants/world';
import { TREE_CANOPY_RADIUS, TREE_MIN_HANG_HEIGHT } from '@/constants/physics';

export function detectDropZone(position: [number, number, number]): DropZone {
  // Check trees
  for (const tree of TREE_CONFIGS) {
    const dx = position[0] - tree.position[0];
    const dz = position[2] - tree.position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < TREE_CANOPY_RADIUS && position[1] > TREE_MIN_HANG_HEIGHT) {
      return 'tree';
    }
  }

  // Check water
  const wx = position[0] - WATER_ZONE.center[0];
  const wz = position[2] - WATER_ZONE.center[2];
  const waterDist = Math.sqrt(wx * wx + wz * wz);
  if (waterDist < WATER_ZONE.radius) {
    return 'water';
  }

  return 'ground';
}

export function findNearestTree(position: [number, number, number]): number {
  let bestIdx = 0;
  let bestDist = Infinity;
  for (let i = 0; i < TREE_CONFIGS.length; i++) {
    const t = TREE_CONFIGS[i];
    const dx = position[0] - t.position[0];
    const dz = position[2] - t.position[2];
    const d = Math.sqrt(dx * dx + dz * dz);
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  }
  return bestIdx;
}
