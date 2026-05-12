import { useSlothStore } from '@/stores/slothStore';

interface StatBarProps {
  label: string;
  value: number;
  color: string;
}

function StatBar({ label, value, color }: StatBarProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-16 text-gray-600 font-medium text-xs">{label}</span>
      <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs text-gray-500 w-8">{Math.round(value)}</span>
    </div>
  );
}

export default function StatsPanel() {
  const stats = useSlothStore((s) => s.stats);
  const currentState = useSlothStore((s) => s.currentState);

  return (
    <div
      className="absolute top-4 left-4 pointer-events-auto space-y-1.5 bg-white/80 rounded-xl p-3 backdrop-blur-sm shadow-lg"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <StatBar label="Hunger" value={stats.hunger} color="#E53935" />
      <StatBar label="Thirst" value={stats.thirst} color="#4FC3F7" />
      <StatBar label="Sleep" value={stats.sleepiness} color="#9C27B0" />
      <div className="text-[10px] text-gray-400 pt-1 border-t border-gray-100">
        State: {currentState}
      </div>
    </div>
  );
}
