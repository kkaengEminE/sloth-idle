import { useFrame } from '@react-three/fiber';
import { useSlothStore } from '@/stores/slothStore';
import { useGameStore } from '@/stores/gameStore';
import { WALK_SPEED, WALK_TO_FOOD_SPEED, SWIM_SPEED, FOOD_ARRIVE_RADIUS } from '@/constants/physics';
import { WATER_ZONE } from '@/constants/world';
import type { SlothRefs } from './useSlothAnimations';

export function useSlothMovement(refs: SlothRefs) {
  useFrame((_, delta) => {
    const sloth = useSlothStore.getState();
    const game = useGameStore.getState();

    const movingStates = ['walking', 'walking_to_food', 'swimming', 'playing'];
    if (!movingStates.includes(sloth.currentState)) return;

    const target = sloth.moveTarget;
    if (!target) return;

    const speed =
      sloth.currentState === 'walking_to_food'
        ? WALK_TO_FOOD_SPEED
        : sloth.currentState === 'swimming'
          ? SWIM_SPEED
          : WALK_SPEED;

    const pos = sloth.position;
    const dx = target[0] - pos[0];
    const dz = target[2] - pos[2];
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < FOOD_ARRIVE_RADIUS) {
      sloth.setMoveTarget(null);
      return;
    }

    const scaledSpeed = speed * delta * game.timeSpeed;
    const nx = dx / dist;
    const nz = dz / dist;

    const stepDist = Math.min(scaledSpeed, dist);
    let newY = pos[1];

    // If swimming, stay at water level
    if (sloth.currentState === 'swimming') {
      newY = WATER_ZONE.center[1] - 0.15;
    }

    const newPos: [number, number, number] = [
      pos[0] + nx * stepDist,
      newY,
      pos[2] + nz * stepDist,
    ];

    sloth.setPosition(newPos);
    sloth.setRotation(Math.atan2(nx, nz));

    // Update Three.js group
    if (refs.groupRef.current) {
      refs.groupRef.current.position.set(newPos[0], newPos[1], newPos[2]);
      refs.groupRef.current.rotation.y = Math.atan2(nx, nz);
    }
  });
}
