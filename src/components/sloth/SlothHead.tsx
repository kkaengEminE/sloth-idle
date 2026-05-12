import { forwardRef } from 'react';
import { COLORS } from '@/constants/colors';
import { useToonGradient } from '@/components/ToonMaterial';
import { Outlines } from '@react-three/drei';
import * as THREE from 'three';

const SlothHead = forwardRef<THREE.Group>((_props, ref) => {
  const gradient = useToonGradient();

  return (
    <group ref={ref} position={[0, 0.55, 0.05]}>
      {/* Main head sphere */}
      <mesh castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshToonMaterial color={COLORS.slothFur} gradientMap={gradient} />
        <Outlines thickness={0.02} color={COLORS.outline} />
      </mesh>

      {/* Face patch - lighter area */}
      <mesh position={[0, -0.02, 0.18]}>
        <circleGeometry args={[0.15, 16]} />
        <meshToonMaterial color={COLORS.slothFace} gradientMap={gradient} />
      </mesh>

      {/* Eye mask patches - dark circles around eyes */}
      <mesh position={[-0.08, 0.03, 0.19]}>
        <circleGeometry args={[0.055, 10]} />
        <meshToonMaterial color={COLORS.slothEyeMask} gradientMap={gradient} />
      </mesh>
      <mesh position={[0.08, 0.03, 0.19]}>
        <circleGeometry args={[0.055, 10]} />
        <meshToonMaterial color={COLORS.slothEyeMask} gradientMap={gradient} />
      </mesh>

      {/* Eyes - small dark spheres */}
      <mesh position={[-0.08, 0.03, 0.2]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color={COLORS.slothEyes} />
      </mesh>
      <mesh position={[0.08, 0.03, 0.2]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color={COLORS.slothEyes} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, -0.04, 0.21]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshBasicMaterial color={COLORS.slothNose} />
      </mesh>

      {/* Slight smile */}
      <mesh position={[0, -0.07, 0.2]} rotation={[0.1, 0, 0]}>
        <torusGeometry args={[0.03, 0.005, 4, 12, Math.PI]} />
        <meshBasicMaterial color={COLORS.slothNose} />
      </mesh>
    </group>
  );
});

SlothHead.displayName = 'SlothHead';

export default SlothHead;
