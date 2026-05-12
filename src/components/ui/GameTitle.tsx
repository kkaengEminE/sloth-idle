export default function GameTitle() {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center select-none">
      <h1
        className="text-2xl font-bold text-amber-800 drop-shadow-md"
        style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
      >
        Sloth Idle
      </h1>
      <p className="text-xs text-amber-600/70">...eventually</p>
    </div>
  );
}
