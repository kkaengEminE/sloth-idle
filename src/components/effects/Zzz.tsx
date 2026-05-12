import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import { useSlothStore } from '@/stores/slothStore';
import { COLORS } from '@/constants/colors';
import * as THREE from 'three';

export default function Zzz() {
  const ref1 = useRef<THREE.Group>(null);
  const ref2 = useRef<THREE.Group>(null);
  const ref3 = useRef<THREE.Group>(null);
  const state = useSlothStore((s) => s.currentState);
  const isSleeping = state === 'sleeping_ground' || state === 'sleeping_tree';

  useFrame((frameState) => {
    if (!isSleeping) return;
    const t = frameState.clock.elapsedTime;
    const refs = [ref1, ref2, ref3];
    refs.forEach((r, i) => {
      if (!r.current) return;
      const phase = (t * 0.5 + i * 0.7) % 2;
      r.current.position.y = 1.0 + phase * 0.4;
      r.current.position.x = Math.sin(t + i * 2) * 0.15;
      const scale = phase < 1.5 ? 0.4 + i * 0.15 : 0.4 + i * 0.15 - (phase - 1.5) * 2;
      r.current.scale.setScalar(Math.max(0.01, scale));
      const opacity = phase < 1.5 ? 1 : Math.max(0, 1 - (phase - 1.5) * 2);
      const child = r.current.children[0] as THREE.Mesh;
      if (child?.material) {
        (child.material as THREE.MeshBasicMaterial).opacity = opacity;
      }
    });
  });

  if (!isSleeping) return null;

  return (
    <>
      {[ref1, ref2, ref3].map((ref, i) => (
        <group key={i} ref={ref} position={[0, 1.0 + i * 0.2, 0]}>
          <Billboard>
            <Text
              fontSize={0.15}
              color={COLORS.zzz}
              anchorX="center"
              anchorY="middle"
              material-transparent
              material-opacity={1}
            >
              Z
            </Text>
          </Billboard>
        </group>
      ))}
    </>
  );
}
