import { COLORS } from '@/constants/colors';
import { useToonGradient } from '@/components/ToonMaterial';

interface ClawsProps {
  position: [number, number, number];
}

export default function SlothClaws({ position }: ClawsProps) {
  const gradient = useToonGradient();

  return (
    <group position={position}>
      {[-0.025, 0, 0.025].map((xOff, i) => (
        <mesh key={i} position={[xOff, 0, 0]} rotation={[0.2, 0, 0]}>
          <coneGeometry args={[0.012, 0.06, 4]} />
          <meshToonMaterial color={COLORS.slothClaws} gradientMap={gradient} />
        </mesh>
      ))}
    </group>
  );
}
