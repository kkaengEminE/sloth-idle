import { create } from 'zustand';
import type { AppleData, TimeSpeed } from '@/types/game';

interface GameState {
  phase: 'playing';

  timeSpeed: TimeSpeed;
  setTimeSpeed: (speed: TimeSpeed) => void;

  testMode: boolean;
  toggleTestMode: () => void;

  apples: AppleData[];
  placeApple: (position: [number, number, number]) => string;
  removeApple: (id: string) => void;
  markAppleEaten: (id: string) => void;

  ballPosition: [number, number, number];
  setBallPosition: (pos: [number, number, number]) => void;
}

let appleIdCounter = 0;

export const useGameStore = create<GameState>((set) => ({
  phase: 'playing',

  timeSpeed: 1,
  setTimeSpeed: (speed) => set({ timeSpeed: speed }),

  testMode: true,
  toggleTestMode: () => set((s) => ({ testMode: !s.testMode })),

  apples: [],
  placeApple: (position) => {
    const id = `apple-${++appleIdCounter}`;
    set((s) => ({
      apples: [...s.apples, { id, position, eaten: false }],
    }));
    return id;
  },
  removeApple: (id) =>
    set((s) => ({
      apples: s.apples.filter((a) => a.id !== id),
    })),
  markAppleEaten: (id) =>
    set((s) => ({
      apples: s.apples.map((a) =>
        a.id === id ? { ...a, eaten: true } : a,
      ),
    })),

  ballPosition: [2, 0.2, 2],
  setBallPosition: (pos) => set({ ballPosition: pos }),
}));
