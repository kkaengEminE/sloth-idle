import { WANDER_RADIUS } from '@/constants/physics';
import { GROUND_SIZE, WATER_ZONE, SLOTH_GROUND_Y } from '@/constants/world';
import { clamp } from '@/utils/mathHelpers';

export function pickRandomWanderTarget(
  currentPos: [number, number, number],
): [number, number, number] {
  const angle = Math.random() * Math.PI * 2;
  const dist = Math.random() * WANDER_RADIUS;
  let x = currentPos[0] + Math.cos(angle) * dist;
  let z = currentPos[2] + Math.sin(angle) * dist;

  const halfGround = GROUND_SIZE / 2;
  x = clamp(x, -halfGround + 1, halfGround - 1);
  z = clamp(z, -halfGround + 1, halfGround - 1);

  // Avoid water zone
  const wx = x - WATER_ZONE.center[0];
  const wz = z - WATER_ZONE.center[2];
  const waterDist = Math.sqrt(wx * wx + wz * wz);
  if (waterDist < WATER_ZONE.radius + 0.8) {
    const awayAngle = Math.atan2(wz, wx);
    x = WATER_ZONE.center[0] + Math.cos(awayAngle) * (WATER_ZONE.radius + 1.5);
    z = WATER_ZONE.center[2] + Math.sin(awayAngle) * (WATER_ZONE.radius + 1.5);
    x = clamp(x, -halfGround + 1, halfGround - 1);
    z = clamp(z, -halfGround + 1, halfGround - 1);
  }

  return [x, SLOTH_GROUND_Y, z];
}
