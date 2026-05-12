import { useGameStore } from '@/stores/gameStore';
import { TIME_SPEEDS } from '@/types/game';

export default function TimeSpeedControl() {
  const timeSpeed = useGameStore((s) => s.timeSpeed);
  const setTimeSpeed = useGameStore((s) => s.setTimeSpeed);
  const testMode = useGameStore((s) => s.testMode);
  const toggleTestMode = useGameStore((s) => s.toggleTestMode);

  return (
    <div
      className="absolute bottom-4 right-4 pointer-events-auto bg-white/80 rounded-xl p-3 backdrop-blur-sm shadow-lg"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div className="text-xs text-gray-500 mb-1.5 font-medium">Speed</div>
      <div className="flex gap-1">
        {TIME_SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => setTimeSpeed(s)}
            className={`px-2 py-1 text-xs rounded-lg transition-colors ${
              timeSpeed === s
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
      <label className="flex items-center gap-1.5 mt-2 text-xs text-gray-500 cursor-pointer">
        <input
          type="checkbox"
          checked={testMode}
          onChange={toggleTestMode}
          className="rounded accent-amber-500"
        />
        Test mode (10s delays)
      </label>
    </div>
  );
}
