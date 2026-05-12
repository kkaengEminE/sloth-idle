import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { COLORS } from '@/constants/colors';
import { WATER_ZONE } from '@/constants/world';
import { useToonGradient } from '@/components/ToonMaterial';
import * as THREE from 'three';

export default function Water() {
  const gradient = useToonGradient();
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        WATER_ZONE.center[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={WATER_ZONE.center}
      receiveShadow
    >
      <circleGeometry args={[WATER_ZONE.radius, 32]} />
      <meshToonMaterial
        color={COLORS.water}
        gradientMap={gradient}
        transparent
        opacity={0.75}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
