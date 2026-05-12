import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSlothStore } from '@/stores/slothStore';
import { useGameStore } from '@/stores/gameStore';
import { pickRandomWanderTarget } from '@/systems/wanderAI';
import {
  WANDER_PAUSE_MIN_MS,
  WANDER_PAUSE_MAX_MS,
  EAT_DURATION_MS,
  FLIPPED_DURATION_MS,
  GETTING_UP_DURATION_MS,
  SLEEP_DURATION_MS,
  PLAY_DURATION_MS,
} from '@/constants/timing';
import {
  FALL_SPEED,
  FOOD_NOTICE_RADIUS,
  FOOD_ARRIVE_RADIUS,
  BALL_NOTICE_RADIUS,
} from '@/constants/physics';
import { WATER_ZONE, SLOTH_GROUND_Y } from '@/constants/world';
import { randomInRange } from '@/utils/mathHelpers';
import type { SlothRefs } from './useSlothAnimations';

export function useSlothStateMachine(refs: SlothRefs) {
  const wanderPauseRef = useRef(randomInRange(WANDER_PAUSE_MIN_MS, WANDER_PAUSE_MAX_MS) / 1000);

  useFrame((_, delta) => {
    const sloth = useSlothStore.getState();
    const game = useGameStore.getState();
    const scaledDelta = delta * game.timeSpeed;

    if (sloth.currentState === 'grabbed') return;

    sloth.addStateTimer(scaledDelta);

    switch (sloth.currentState) {
      case 'idle': {
        // Check auto-sleep
        if (sloth.stats.sleepiness < 15) {
          sloth.setState('sleeping_ground');
          return;
        }

        // Check for ball play opportunity
        if (Math.random() < 0.001 * scaledDelta) {
          const ballPos = game.ballPosition;
          const dx = sloth.position[0] - ballPos[0];
          const dz = sloth.position[2] - ballPos[2];
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < BALL_NOTICE_RADIUS) {
            sloth.setMoveTarget([...ballPos]);
            sloth.setState('playing');
            return;
          }
        }

        // Wander
        if (sloth.stateTimer > wanderPauseRef.current) {
          const target = pickRandomWanderTarget(sloth.position);
          sloth.setMoveTarget(target);
          sloth.setState('walking');
          wanderPauseRef.current = randomInRange(WANDER_PAUSE_MIN_MS, WANDER_PAUSE_MAX_MS) / 1000;
        }
        break;
      }

      case 'walking': {
        if (!sloth.moveTarget) {
          sloth.setState('idle');
          wanderPauseRef.current = randomInRange(WANDER_PAUSE_MIN_MS, WANDER_PAUSE_MAX_MS) / 1000;
        }
        break;
      }

      case 'walking_to_food': {
        if (!sloth.moveTarget) {
          // Arrived at food
          const appleId = sloth.targetAppleId;
          if (appleId) {
            game.markAppleEaten(appleId);
            sloth.setState('eating');
          } else {
            sloth.setState('idle');
          }
        }
        break;
      }

      case 'eating': {
        if (sloth.stateTimer > EAT_DURATION_MS / 1000) {
          // Gain hunger
          sloth.updateStat('hunger', 25);

          // Check for more food
          const targetId = sloth.targetAppleId;
          sloth.setTargetApple(null);

          if (sloth.stats.hunger < 70) {
            // Look for nearby apples
            const apples = game.apples.filter((a) => !a.eaten && a.id !== targetId);
            for (const apple of apples) {
              const dx = sloth.position[0] - apple.position[0];
              const dz = sloth.position[2] - apple.position[2];
              const dist = Math.sqrt(dx * dx + dz * dz);
              if (dist < FOOD_NOTICE_RADIUS) {
                sloth.setTargetApple(apple.id);
                sloth.setMoveTarget([...apple.position]);
                sloth.setShowExclamation(true);
                setTimeout(() => {
                  useSlothStore.getState().setShowExclamation(false);
                }, 1500);
                sloth.setState('walking_to_food');
                return;
              }
            }
          }

          // Remove eaten apple
          if (targetId) {
            game.removeApple(targetId);
          }
          sloth.setState('idle');
        }
        break;
      }

      case 'falling': {
        // Move down
        const pos = sloth.position;
        const newY = pos[1] - FALL_SPEED * delta;
        if (newY <= SLOTH_GROUND_Y) {
          sloth.setPosition([pos[0], SLOTH_GROUND_Y, pos[2]]);
          if (refs.groupRef.current) {
            refs.groupRef.current.position.y = SLOTH_GROUND_Y;
          }
          sloth.setState('flipped');
        } else {
          sloth.setPosition([pos[0], newY, pos[2]]);
          if (refs.groupRef.current) {
            refs.groupRef.current.position.y = newY;
          }
        }
        break;
      }

      case 'flipped': {
        if (sloth.stateTimer > FLIPPED_DURATION_MS / 1000) {
          sloth.setState('getting_up');
        }
        break;
      }

      case 'getting_up': {
        if (sloth.stateTimer > GETTING_UP_DURATION_MS / 1000) {
          // Reset position to ground level
          const pos = sloth.position;
          sloth.setPosition([pos[0], SLOTH_GROUND_Y, pos[2]]);
          if (refs.groupRef.current) {
            refs.groupRef.current.position.y = SLOTH_GROUND_Y;
          }
          sloth.setState('idle');
        }
        break;
      }

      case 'sleeping_ground':
      case 'sleeping_tree': {
        // Restore sleepiness
        sloth.updateStat('sleepiness', 2 * scaledDelta);

        if (sloth.stateTimer > SLEEP_DURATION_MS / 1000 || sloth.stats.sleepiness >= 95) {
          if (sloth.currentState === 'sleeping_tree') {
            sloth.setState('hanging');
          } else {
            sloth.setState('idle');
          }
        }
        break;
      }

      case 'hanging': {
        // Check if should sleep
        if (sloth.stats.sleepiness < 30 && sloth.stateTimer > 5) {
          sloth.setState('sleeping_tree');
          return;
        }

        // Occasionally descend
        if (sloth.stateTimer > 15 && Math.random() < 0.002 * scaledDelta) {
          sloth.setAttachedTree(null);
          const pos = sloth.position;
          sloth.setPosition([pos[0], SLOTH_GROUND_Y, pos[2]]);
          if (refs.groupRef.current) {
            refs.groupRef.current.position.y = SLOTH_GROUND_Y;
          }
          sloth.setState('idle');
        }
        break;
      }

      case 'swimming': {
        // Restore thirst
        sloth.updateStat('thirst', 3 * scaledDelta);

        // Check if reached edge of water
        if (!sloth.moveTarget) {
          // Pick a point at the edge of the water
          const angle = Math.atan2(
            sloth.position[2] - WATER_ZONE.center[2],
            sloth.position[0] - WATER_ZONE.center[0],
          );
          const edgeX = WATER_ZONE.center[0] + Math.cos(angle) * (WATER_ZONE.radius + 0.5);
          const edgeZ = WATER_ZONE.center[2] + Math.sin(angle) * (WATER_ZONE.radius + 0.5);
          sloth.setMoveTarget([edgeX, SLOTH_GROUND_Y, edgeZ]);
        }

        // Check if we've left the water
        const wx = sloth.position[0] - WATER_ZONE.center[0];
        const wz = sloth.position[2] - WATER_ZONE.center[2];
        const waterDist = Math.sqrt(wx * wx + wz * wz);
        if (waterDist > WATER_ZONE.radius) {
          sloth.setMoveTarget(null);
          const pos = sloth.position;
          sloth.setPosition([pos[0], SLOTH_GROUND_Y, pos[2]]);
          if (refs.groupRef.current) {
            refs.groupRef.current.position.y = SLOTH_GROUND_Y;
          }
          sloth.setState('idle');
        }
        break;
      }

      case 'wobbling': {
        // Handled by animation system
        break;
      }

      case 'playing': {
        if (sloth.stateTimer > PLAY_DURATION_MS / 1000) {
          sloth.setMoveTarget(null);
          sloth.setState('idle');
        } else if (sloth.moveTarget) {
          // Walking toward ball
          const target = sloth.moveTarget;
          const dx = sloth.position[0] - target[0];
          const dz = sloth.position[2] - target[2];
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < FOOD_ARRIVE_RADIUS) {
            // Hit the ball
            const angle = Math.random() * Math.PI * 2;
            const newBallPos: [number, number, number] = [
              target[0] + Math.cos(angle) * 1.5,
              0.2,
              target[2] + Math.sin(angle) * 1.5,
            ];
            game.setBallPosition(newBallPos);
            sloth.setMoveTarget(newBallPos);
          }
        }
        break;
      }
    }
  });
}
