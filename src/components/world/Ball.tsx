import { COLORS } from '@/constants/colors';
import { useToonGradient } from '@/components/ToonMaterial';
import { Outlines } from '@react-three/drei';
import { useGameStore } from '@/stores/gameStore';

export default function Ball() {
  const gradient = useToonGradient();
  const ballPosition = useGameStore((s) => s.ballPosition);

  return (
    <mesh position={ballPosition} castShadow>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshToonMaterial color={COLORS.ball} gradientMap={gradient} />
      <Outlines thickness={0.02} color={COLORS.outline} />
    </mesh>
  );
}
