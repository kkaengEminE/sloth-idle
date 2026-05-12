import { forwardRef, type ReactNode } from 'react';
import { COLORS } from '@/constants/colors';
import { useToonGradient } from '@/components/ToonMaterial';
import { Outlines } from '@react-three/drei';
import * as THREE from 'three';

interface SlothBodyProps {
  children?: ReactNode;
}

const SlothBody = forwardRef<THREE.Group, SlothBodyProps>(({ children }, ref) => {
  const gradient = useToonGradient();

  return (
    <group ref={ref}>
      {/* Torso */}
      <mesh castShadow>
        <capsuleGeometry args={[0.25, 0.5, 8, 16]} />
        <meshToonMaterial color={COLORS.slothFur} gradientMap={gradient} />
        <Outlines thickness={0.02} color={COLORS.outline} />
      </mesh>

      {/* Belly - lighter patch */}
      <mesh position={[0, -0.05, 0.22]}>
        <sphereGeometry args={[0.18, 10, 10]} />
        <meshToonMaterial color={COLORS.slothFurLight} gradientMap={gradient} />
      </mesh>

      {children}
    </group>
  );
});

SlothBody.displayName = 'SlothBody';

export default SlothBody;
