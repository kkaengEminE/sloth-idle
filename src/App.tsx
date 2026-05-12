import Scene from '@/components/Scene';
import HUD from '@/components/ui/HUD';

export default function App() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <Scene />
      <HUD />
    </div>
  );
}
