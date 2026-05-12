import { forwardRef } from 'react';
import { COLORS } from '@/constants/colors';
import { useToonGradient } from '@/components/ToonMaterial';
import { Outlines } from '@react-three/drei';
import SlothClaws from './SlothClaws';
import * as THREE from 'three';

interface SlothArmProps {
  side: 'left' | 'right';
}

const SlothArm = forwardRef<THREE.Group, SlothArmProps>(({ side }, ref) => {
  const gradient = useToonGradient();
  const xPos = side === 'left' ? -0.32 : 0.32;

  return (
    <group ref={ref} position={[xPos, 0.15, 0]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.07, 0.35, 4, 8]} />
        <meshToonMaterial color={COLORS.slothFur} gradientMap={gradient} />
        <Outlines thickness={0.02} color={COLORS.outline} />
      </mesh>
      <SlothClaws position={[0, -0.28, 0]} />
    </group>
  );
});

SlothArm.displayName = 'SlothArm';

export default SlothArm;
