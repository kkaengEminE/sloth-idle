import { forwardRef } from 'react';
import { COLORS } from '@/constants/colors';
import { useToonGradient } from '@/components/ToonMaterial';
import { Outlines } from '@react-three/drei';
import SlothClaws from './SlothClaws';
import * as THREE from 'three';

interface SlothLegProps {
  side: 'left' | 'right';
}

const SlothLeg = forwardRef<THREE.Group, SlothLegProps>(({ side }, ref) => {
  const gradient = useToonGradient();
  const xPos = side === 'left' ? -0.18 : 0.18;

  return (
    <group ref={ref} position={[xPos, -0.45, 0]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.08, 0.25, 4, 8]} />
        <meshToonMaterial color={COLORS.slothFur} gradientMap={gradient} />
        <Outlines thickness={0.02} color={COLORS.outline} />
      </mesh>
      <SlothClaws position={[0, -0.22, 0]} />
    </group>
  );
});

SlothLeg.displayName = 'SlothLeg';

export default SlothLeg;
