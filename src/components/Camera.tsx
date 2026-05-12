import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useSlothStore } from '@/stores/slothStore';

const OFFSET = new THREE.Vector3(12, 12, 12);
const target = new THREE.Vector3();

export default function Camera() {
  const camRef = useRef<THREE.OrthographicCamera>(null);

  useFrame(() => {
    if (!camRef.current) return;
    const pos = useSlothStore.getState().position;
    target.set(pos[0] + OFFSET.x, pos[1] + OFFSET.y, pos[2] + OFFSET.z);
    camRef.current.position.lerp(target, 0.04);
    camRef.current.lookAt(pos[0], pos[1], pos[2]);
  });

  return (
    <OrthographicCamera
      ref={camRef}
      makeDefault
      zoom={45}
      position={[12, 12, 12]}
      near={0.1}
      far={100}
    />
  );
}
