import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Camera from './Camera';
import Lighting from './Lighting';
import Ground from './world/Ground';
import Trees from './world/Trees';
import Water from './world/Water';
import Ball from './world/Ball';
import Apple from './world/Apple';
import Sloth from './sloth/Sloth';
import { useGameStore } from '@/stores/gameStore';

function Apples() {
  const apples = useGameStore((s) => s.apples);
  return (
    <>
      {apples.map((a) => (
        <Apple key={a.id} apple={a} />
      ))}
    </>
  );
}

export default function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#87CEEB']} />
      <fog attach="fog" args={['#B8D8F0', 30, 60]} />
      <Camera />
      <Lighting />
      <Suspense fallback={null}>
        <Ground />
        <Trees />
        <Water />
        <Ball />
        <Apples />
        <Sloth />
      </Suspense>
    </Canvas>
  );
}
