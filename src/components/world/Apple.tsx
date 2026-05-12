import { COLORS } from '@/constants/colors';
import { useToonGradient } from '@/components/ToonMaterial';
import { Outlines } from '@react-three/drei';
import type { AppleData } from '@/types/game';

interface AppleProps {
  apple: AppleData;
}

export default function Apple({ apple }: AppleProps) {
  const gradient = useToonGradient();

  if (apple.eaten) return null;

  return (
    <group position={apple.position}>
      {/* Apple body */}
      <mesh castShadow>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshToonMaterial color={COLORS.apple} gradientMap={gradient} />
        <Outlines thickness={0.015} color={COLORS.outline} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.01, 0.015, 0.06, 4]} />
        <meshToonMaterial color={COLORS.appleStem} gradientMap={gradient} />
      </mesh>
      {/* Leaf */}
      <mesh position={[0.03, 0.14, 0]} rotation={[0, 0, -0.3]}>
        <sphereGeometry args={[0.03, 6, 4]} />
        <meshToonMaterial color={COLORS.appleLeaf} gradientMap={gradient} />
      </mesh>
    </group>
  );
}
