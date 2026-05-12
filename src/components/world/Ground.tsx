import { COLORS } from '@/constants/colors';
import { GROUND_SIZE } from '@/constants/world';
import { useToonGradient } from '@/components/ToonMaterial';
import { useGameStore } from '@/stores/gameStore';
import { useSlothStore } from '@/stores/slothStore';
import { FOOD_NOTICE_RADIUS } from '@/constants/physics';
import { TEST_REACTION_DELAY_MS, BASE_REACTION_DELAY_MS } from '@/constants/timing';
import type { ThreeEvent } from '@react-three/fiber';

export default function Ground() {
  const gradient = useToonGradient();

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const point = e.point;
    const gameState = useGameStore.getState();
    const appleId = gameState.placeApple([point.x, 0.12, point.z]);

    // Check if sloth is nearby
    const slothState = useSlothStore.getState();
    const dx = slothState.position[0] - point.x;
    const dz = slothState.position[2] - point.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist <= FOOD_NOTICE_RADIUS && !slothState.targetAppleId) {
      const delay = gameState.testMode
        ? TEST_REACTION_DELAY_MS
        : BASE_REACTION_DELAY_MS;
      slothState.enqueueInteraction({
        type: 'food_notice',
        timestamp: Date.now(),
        resolveAt: Date.now() + delay / gameState.timeSpeed,
        data: { appleId, applePosition: [point.x, 0.12, point.z] },
      });
    }
  };

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
      onClick={handleClick}
    >
      <planeGeometry args={[GROUND_SIZE, GROUND_SIZE]} />
      <meshToonMaterial color={COLORS.ground} gradientMap={gradient} />
    </mesh>
  );
}
