import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSlothStore } from '@/stores/slothStore';
import * as THREE from 'three';

interface Particle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  life: number;
}

export default function DustPoof() {
  const groupRef = useRef<THREE.Group>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const currentState = useSlothStore((s) => s.currentState);
  const prevStateRef = useRef(currentState);

  useEffect(() => {
    if (prevStateRef.current === 'falling' && currentState === 'flipped') {
      const pos = useSlothStore.getState().position;
      const newParticles: Particle[] = [];
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        newParticles.push({
          pos: new THREE.Vector3(pos[0], 0.05, pos[2]),
          vel: new THREE.Vector3(
            Math.cos(angle) * (0.5 + Math.random() * 0.5),
            0.3 + Math.random() * 0.3,
            Math.sin(angle) * (0.5 + Math.random() * 0.5),
          ),
          life: 1.0,
        });
      }
      setParticles(newParticles);
    }
    prevStateRef.current = currentState;
  }, [currentState]);

  useFrame((_, delta) => {
    if (particles.length === 0) return;
    let anyAlive = false;
    particles.forEach((p, i) => {
      p.life -= delta * 2;
      if (p.life <= 0) return;
      anyAlive = true;
      p.pos.add(p.vel.clone().multiplyScalar(delta));
      p.vel.y -= 2 * delta;
      const mesh = meshRefs.current[i];
      if (mesh) {
        mesh.position.copy(p.pos);
        const s = p.life * 0.1;
        mesh.scale.setScalar(s);
        (mesh.material as THREE.MeshBasicMaterial).opacity = p.life;
      }
    });
    if (!anyAlive) setParticles([]);
  });

  if (particles.length === 0) return null;

  return (
    <group ref={groupRef}>
      {particles.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el; }}
        >
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial
            color="#C8B89A"
            transparent
            opacity={1}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
