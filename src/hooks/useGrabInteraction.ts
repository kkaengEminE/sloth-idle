import { useRef, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useSlothStore } from '@/stores/slothStore';
import { HOLD_THRESHOLD_MS, GRAB_HEIGHT } from '@/constants/physics';
import { detectDropZone, findNearestTree } from '@/utils/dropZoneDetector';
import { TREE_CONFIGS } from '@/constants/world';
import type { SlothRefs } from './useSlothAnimations';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const intersection = new THREE.Vector3();

export function useGrabInteraction(refs: SlothRefs) {
  const { camera } = useThree();
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDraggingRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });

  const onPointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      const startTime = Date.now();
      pointerRef.current = { x: e.pointer.x, y: e.pointer.y };

      holdTimerRef.current = setTimeout(() => {
        const sloth = useSlothStore.getState();
        sloth.setGrabbed(true);
        sloth.setState('grabbed');
        sloth.clearInteractions();
        sloth.resetClickCount();
        isDraggingRef.current = true;
      }, HOLD_THRESHOLD_MS);

      // Store start time for tap detection
      (e.nativeEvent as unknown as Record<string, unknown>).__slothDownTime = startTime;
    },
    [],
  );

  const onPointerUp = useCallback(
    (_e: ThreeEvent<PointerEvent>) => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }

      const sloth = useSlothStore.getState();

      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        sloth.setGrabbed(false);

        const pos = sloth.position;
        const zone = detectDropZone(pos);

        switch (zone) {
          case 'tree': {
            const treeIdx = findNearestTree(pos);
            const hangPoint = TREE_CONFIGS[treeIdx].hangPoint;
            sloth.setAttachedTree(treeIdx);
            sloth.setPosition([...hangPoint]);
            if (refs.groupRef.current) {
              refs.groupRef.current.position.set(hangPoint[0], hangPoint[1], hangPoint[2]);
            }
            sloth.setState('hanging');
            break;
          }
          case 'water': {
            sloth.setState('swimming');
            break;
          }
          default: {
            sloth.setState('falling');
            break;
          }
        }
        return;
      }

      // It was a tap (short press) - enqueue wobble
      if (sloth.currentState !== 'grabbed') {
        sloth.incrementClickCount();
        if (sloth.pendingClickCount === 1) {
          sloth.setLastClickTime(Date.now());
        }
      }
    },
    [refs],
  );

  // Drag: follow pointer
  useFrame((state) => {
    if (!isDraggingRef.current) return;
    const sloth = useSlothStore.getState();
    if (!sloth.isGrabbed) return;

    // Use pointer to raycast onto a horizontal plane at grab height
    plane.constant = -GRAB_HEIGHT;
    raycaster.setFromCamera(state.pointer, camera);
    raycaster.ray.intersectPlane(plane, intersection);

    if (intersection) {
      const newPos: [number, number, number] = [
        intersection.x,
        GRAB_HEIGHT,
        intersection.z,
      ];
      sloth.setPosition(newPos);
      if (refs.groupRef.current) {
        refs.groupRef.current.position.lerp(
          new THREE.Vector3(newPos[0], newPos[1], newPos[2]),
          0.3,
        );
      }
    }
  });

  return { onPointerDown, onPointerUp };
}
