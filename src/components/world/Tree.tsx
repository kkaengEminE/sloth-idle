import { COLORS } from '@/constants/colors';
import { useToonGradient } from '@/components/ToonMaterial';
import { Outlines } from '@react-three/drei';
import type { TreeConfig } from '@/types/game';

interface TreeProps {
  config: TreeConfig;
}

export default function Tree({ config }: TreeProps) {
  const gradient = useToonGradient();

  return (
    <group position={config.position}>
      {/* Trunk */}
      <mesh castShadow position={[0, config.trunkHeight / 2, 0]}>
        <cylinderGeometry args={[0.12, 0.18, config.trunkHeight, 8]} />
        <meshToonMaterial color={COLORS.treeBark} gradientMap={gradient} />
        <Outlines thickness={0.02} color={COLORS.outline} />
      </mesh>

      {/* Canopy - main sphere */}
      <mesh castShadow position={[0, config.trunkHeight + 0.3, 0]}>
        <sphereGeometry args={[1.3, 12, 12]} />
        <meshToonMaterial color={COLORS.treeLeaves} gradientMap={gradient} />
        <Outlines thickness={0.02} color={COLORS.outline} />
      </mesh>

      {/* Canopy - extra spheres for volume */}
      <mesh castShadow position={[0.5, config.trunkHeight + 0.1, 0.3]}>
        <sphereGeometry args={[0.8, 10, 10]} />
        <meshToonMaterial color={COLORS.treeLeavesLight} gradientMap={gradient} />
      </mesh>
      <mesh castShadow position={[-0.4, config.trunkHeight + 0.0, -0.3]}>
        <sphereGeometry args={[0.7, 10, 10]} />
        <meshToonMaterial color={COLORS.treeLeavesLight} gradientMap={gradient} />
      </mesh>

      {/* Branch for hanging - visual indicator */}
      <mesh
        castShadow
        position={[0, config.trunkHeight * 0.75, 0.6]}
        rotation={[0, 0, Math.PI / 6]}
      >
        <cylinderGeometry args={[0.04, 0.06, 1.2, 6]} />
        <meshToonMaterial color={COLORS.treeBark} gradientMap={gradient} />
        <Outlines thickness={0.015} color={COLORS.outline} />
      </mesh>
    </group>
  );
}
