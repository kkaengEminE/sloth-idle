export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.45} color="#fff8e8" />
      <directionalLight
        position={[8, 14, 6]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-bias={-0.001}
      />
      <hemisphereLight args={['#87CEEB', '#558B2F', 0.3]} position={[0, 10, 0]} />
    </>
  );
}
