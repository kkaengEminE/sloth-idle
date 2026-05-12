export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function distance2D(
  a: [number, number] | [number, number, number],
  b: [number, number] | [number, number, number],
): number {
  const dx = a[0] - b[0];
  const dz = (a.length === 3 ? a[2] : a[1]) - (b.length === 3 ? b[2] : b[1]);
  return Math.sqrt(dx * dx + dz * dz);
}

export function distance3D(
  a: [number, number, number],
  b: [number, number, number],
): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}
