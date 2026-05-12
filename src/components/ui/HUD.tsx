import GameTitle from './GameTitle';
import StatsPanel from './StatsPanel';
import TimeSpeedControl from './TimeSpeedControl';

export default function HUD() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <GameTitle />
      <StatsPanel />
      <TimeSpeedControl />
    </div>
  );
}
