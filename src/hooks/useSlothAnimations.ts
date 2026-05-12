import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSlothStore } from '@/stores/slothStore';
import { useGameStore } from '@/stores/gameStore';
import { WOBBLE_PARTS } from '@/types/game';
import type * as THREE from 'three';

export interface SlothRefs {
  groupRef: React.RefObject<THREE.Group | null>;
  bodyRef: React.RefObject<THREE.Group | null>;
  headRef: React.RefObject<THREE.Group | null>;
  leftArmRef: React.RefObject<THREE.Group | null>;
  rightArmRef: React.RefObject<THREE.Group | null>;
  leftLegRef: React.RefObject<THREE.Group | null>;
  rightLegRef: React.RefObject<THREE.Group | null>;
}

export function useSlothAnimations(refs: SlothRefs) {
  const timeRef = useRef(0);
  const wobblePartIdx = useRef(0);
  const wobbleTimer = useRef(0);

  useFrame((_, delta) => {
    const state = useSlothStore.getState();
    const { timeSpeed } = useGameStore.getState();
    const scaledDelta = delta * timeSpeed;
    timeRef.current += scaledDelta;
    const t = timeRef.current;

    const { headRef, bodyRef, leftArmRef, rightArmRef, leftLegRef, rightLegRef } = refs;

    // Reset all rotations to defaults first
    const resetPart = (ref: React.RefObject<THREE.Group | null>) => {
      if (ref.current) {
        ref.current.rotation.x *= 0.9;
        ref.current.rotation.z *= 0.9;
      }
    };

    switch (state.currentState) {
      case 'idle': {
        // Gentle breathing
        if (bodyRef.current) {
          bodyRef.current.scale.y = 1 + Math.sin(t * 0.5) * 0.015;
        }
        if (headRef.current) {
          headRef.current.rotation.x = Math.sin(t * 0.3) * 0.03;
        }
        resetPart(leftArmRef);
        resetPart(rightArmRef);
        resetPart(leftLegRef);
        resetPart(rightLegRef);
        break;
      }

      case 'walking':
      case 'walking_to_food': {
        const speed = state.currentState === 'walking_to_food' ? 2.0 : 1.5;
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = Math.sin(t * speed) * 0.3;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = Math.sin(t * speed + Math.PI) * 0.3;
        }
        if (leftLegRef.current) {
          leftLegRef.current.rotation.x = Math.sin(t * speed + Math.PI) * 0.2;
        }
        if (rightLegRef.current) {
          rightLegRef.current.rotation.x = Math.sin(t * speed) * 0.2;
        }
        if (bodyRef.current) {
          bodyRef.current.rotation.z = Math.sin(t * speed) * 0.04;
          bodyRef.current.scale.y = 1;
        }
        if (headRef.current) {
          headRef.current.rotation.x = Math.sin(t * speed * 0.5) * 0.05;
        }
        break;
      }

      case 'eating': {
        if (headRef.current) {
          headRef.current.rotation.x = -0.35 + Math.sin(t * 3) * 0.08;
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -0.4;
          leftArmRef.current.rotation.z = 0.15;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -0.4;
          rightArmRef.current.rotation.z = -0.15;
        }
        resetPart(leftLegRef);
        resetPart(rightLegRef);
        if (bodyRef.current) {
          bodyRef.current.rotation.x = -0.1;
          bodyRef.current.scale.y = 1;
        }
        break;
      }

      case 'sleeping_ground': {
        if (headRef.current) {
          headRef.current.rotation.x = 0.3;
          headRef.current.rotation.z = 0.15;
        }
        if (bodyRef.current) {
          bodyRef.current.scale.y = 1 + Math.sin(t * 0.3) * 0.02;
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = 0.1;
          leftArmRef.current.rotation.z = -0.2;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = 0.1;
          rightArmRef.current.rotation.z = 0.2;
        }
        resetPart(leftLegRef);
        resetPart(rightLegRef);
        break;
      }

      case 'sleeping_tree': {
        if (headRef.current) {
          headRef.current.rotation.x = 0.35;
          headRef.current.rotation.z = 0.1;
        }
        if (bodyRef.current) {
          bodyRef.current.scale.y = 1 + Math.sin(t * 0.3) * 0.02;
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -Math.PI * 0.6;
          leftArmRef.current.rotation.z = -0.2;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -Math.PI * 0.6;
          rightArmRef.current.rotation.z = 0.2;
        }
        if (leftLegRef.current) {
          leftLegRef.current.rotation.x = 0.3;
        }
        if (rightLegRef.current) {
          rightLegRef.current.rotation.x = 0.3;
        }
        break;
      }

      case 'hanging': {
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -Math.PI * 0.7;
          leftArmRef.current.rotation.z = -0.15;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -Math.PI * 0.7;
          rightArmRef.current.rotation.z = 0.15;
        }
        if (leftLegRef.current) {
          leftLegRef.current.rotation.x = 0.3;
        }
        if (rightLegRef.current) {
          rightLegRef.current.rotation.x = 0.3;
        }
        if (bodyRef.current) {
          bodyRef.current.rotation.z = Math.sin(t * 0.3) * 0.04;
          bodyRef.current.scale.y = 1;
        }
        if (headRef.current) {
          headRef.current.rotation.x = -0.1;
        }
        break;
      }

      case 'grabbed': {
        // Limp dangling
        if (headRef.current) {
          headRef.current.rotation.x = 0.3;
          headRef.current.rotation.z = Math.sin(t * 1.5) * 0.1;
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = 0.2;
          leftArmRef.current.rotation.z = -0.3 + Math.sin(t * 2) * 0.1;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = 0.2;
          rightArmRef.current.rotation.z = 0.3 + Math.sin(t * 2 + 1) * 0.1;
        }
        if (leftLegRef.current) {
          leftLegRef.current.rotation.x = 0.1;
          leftLegRef.current.rotation.z = Math.sin(t * 1.8 + 0.5) * 0.08;
        }
        if (rightLegRef.current) {
          rightLegRef.current.rotation.x = 0.1;
          rightLegRef.current.rotation.z = Math.sin(t * 1.8 + 1.5) * 0.08;
        }
        if (bodyRef.current) {
          bodyRef.current.rotation.x = 0;
          bodyRef.current.rotation.z = Math.sin(t) * 0.05;
          bodyRef.current.scale.y = 1;
        }
        break;
      }

      case 'falling': {
        // Flailing
        if (leftArmRef.current) {
          leftArmRef.current.rotation.z = Math.sin(t * 10) * 0.6;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.z = Math.sin(t * 10 + Math.PI) * 0.6;
        }
        if (leftLegRef.current) {
          leftLegRef.current.rotation.z = Math.sin(t * 8) * 0.4;
        }
        if (rightLegRef.current) {
          rightLegRef.current.rotation.z = Math.sin(t * 8 + Math.PI) * 0.4;
        }
        if (bodyRef.current) {
          bodyRef.current.scale.y = 1;
        }
        break;
      }

      case 'flipped': {
        // On back, slow flailing
        if (bodyRef.current) {
          bodyRef.current.rotation.x = Math.PI;
          bodyRef.current.scale.y = 1;
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.z = Math.sin(t * 2) * 0.5;
          leftArmRef.current.rotation.x = Math.sin(t * 1.5) * 0.3;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.z = Math.sin(t * 2 + 1) * 0.5;
          rightArmRef.current.rotation.x = Math.sin(t * 1.5 + 1) * 0.3;
        }
        if (leftLegRef.current) {
          leftLegRef.current.rotation.z = Math.sin(t * 2 + 0.5) * 0.3;
        }
        if (rightLegRef.current) {
          rightLegRef.current.rotation.z = Math.sin(t * 2 + 1.5) * 0.3;
        }
        if (headRef.current) {
          headRef.current.rotation.x = 0;
          headRef.current.rotation.z = Math.sin(t * 1.5) * 0.2;
        }
        break;
      }

      case 'getting_up': {
        const progress = Math.min(state.stateTimer / 2, 1);
        if (bodyRef.current) {
          bodyRef.current.rotation.x = Math.PI * (1 - progress);
          bodyRef.current.scale.y = 1;
        }
        resetPart(leftArmRef);
        resetPart(rightArmRef);
        resetPart(leftLegRef);
        resetPart(rightLegRef);
        if (headRef.current) {
          headRef.current.rotation.x = 0;
          headRef.current.rotation.z = 0;
        }
        break;
      }

      case 'wobbling': {
        wobbleTimer.current += scaledDelta;
        if (wobbleTimer.current > 0.5) {
          wobbleTimer.current = 0;
          wobblePartIdx.current = Math.floor(Math.random() * WOBBLE_PARTS.length);
          const remaining = state.wobbleCount - 1;
          if (remaining <= 0) {
            useSlothStore.getState().setState('idle');
            useSlothStore.getState().setWobbleCount(0);
          } else {
            useSlothStore.getState().setWobbleCount(remaining);
          }
        }

        // Wobble the selected part
        const partName = WOBBLE_PARTS[wobblePartIdx.current];
        const wobbleAmount = Math.sin(t * 15) * 0.3;
        const partRefMap = {
          head: headRef,
          body: bodyRef,
          leftArm: leftArmRef,
          rightArm: rightArmRef,
          leftLeg: leftLegRef,
          rightLeg: rightLegRef,
        };
        const wobbleRef = partRefMap[partName];
        if (wobbleRef?.current) {
          wobbleRef.current.rotation.z = wobbleAmount;
        }

        // Keep others still
        Object.entries(partRefMap).forEach(([name, ref]) => {
          if (name !== partName && ref?.current) {
            ref.current.rotation.z *= 0.9;
            ref.current.rotation.x *= 0.9;
          }
        });
        if (bodyRef.current) {
          bodyRef.current.scale.y = 1;
        }
        break;
      }

      case 'swimming': {
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = Math.sin(t * 1.2) * 0.5;
          leftArmRef.current.rotation.z = -0.3 + Math.cos(t * 1.2) * 0.2;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = Math.sin(t * 1.2 + Math.PI) * 0.5;
          rightArmRef.current.rotation.z = 0.3 + Math.cos(t * 1.2 + Math.PI) * 0.2;
        }
        if (leftLegRef.current) {
          leftLegRef.current.rotation.x = Math.sin(t * 1.5) * 0.2;
        }
        if (rightLegRef.current) {
          rightLegRef.current.rotation.x = Math.sin(t * 1.5 + Math.PI) * 0.2;
        }
        if (headRef.current) {
          headRef.current.rotation.x = -0.15;
          headRef.current.rotation.z = 0;
        }
        if (bodyRef.current) {
          bodyRef.current.rotation.x = -0.3;
          bodyRef.current.rotation.z = 0;
          bodyRef.current.scale.y = 1;
        }
        break;
      }

      case 'playing': {
        // Playful arm swings
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = Math.sin(t * 3) * 0.4;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = Math.sin(t * 3 + 1) * 0.5;
        }
        if (headRef.current) {
          headRef.current.rotation.z = Math.sin(t * 2) * 0.1;
        }
        resetPart(leftLegRef);
        resetPart(rightLegRef);
        if (bodyRef.current) {
          bodyRef.current.scale.y = 1;
          bodyRef.current.rotation.z = Math.sin(t * 2) * 0.05;
        }
        break;
      }
    }
  });
}
