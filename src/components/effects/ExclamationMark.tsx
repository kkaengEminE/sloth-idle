import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import { useSlothStore } from '@/stores/slothStore';
import { COLORS } from '@/constants/colors';
import * as THREE from 'three';

export default function ExclamationMark() {
  const groupRef = useRef<THREE.Group>(null);
  const show = useSlothStore((s) => s.showExclamation);

  useFrame((state) => {
    if (groupRef.current && show) {
      groupRef.current.position.y = 1.1 + Math.sin(state.clock.elapsedTime * 6) * 0.05;
    }
  });

  if (!show) return null;

  return (
    <group ref={groupRef} position={[0, 1.1, 0]}>
      <Billboard>
        {/* Stick part */}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[0.04, 0.15, 0.04]} />
          <meshBasicMaterial color={COLORS.exclamation} />
        </mesh>
        {/* Dot */}
        <mesh position={[0, -0.05, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color={COLORS.exclamation} />
        </mesh>
      </Billboard>
    </group>
  );
}
