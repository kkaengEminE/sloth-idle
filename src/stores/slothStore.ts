import { create } from 'zustand';
import type { SlothState, SlothStats, PendingInteraction } from '@/types/game';
import { SLOTH_INITIAL_POSITION } from '@/constants/world';
import { clamp } from '@/utils/mathHelpers';

interface SlothStoreState {
  position: [number, number, number];
  rotation: number;
  setPosition: (pos: [number, number, number]) => void;
  setRotation: (rot: number) => void;

  currentState: SlothState;
  previousState: SlothState;
  setState: (state: SlothState) => void;

  moveTarget: [number, number, number] | null;
  setMoveTarget: (target: [number, number, number] | null) => void;

  stats: SlothStats;
  updateStat: (stat: keyof SlothStats, delta: number) => void;
  setStat: (stat: keyof SlothStats, value: number) => void;

  pendingInteractions: PendingInteraction[];
  enqueueInteraction: (interaction: PendingInteraction) => void;
  removeResolvedInteractions: (now: number) => PendingInteraction[];
  clearInteractions: () => void;

  pendingClickCount: number;
  lastClickTime: number;
  incrementClickCount: () => void;
  resetClickCount: () => void;
  setLastClickTime: (t: number) => void;

  isGrabbed: boolean;
  setGrabbed: (grabbed: boolean) => void;

  targetAppleId: string | null;
  setTargetApple: (id: string | null) => void;

  attachedTreeIndex: number | null;
  setAttachedTree: (index: number | null) => void;

  wobbleCount: number;
  setWobbleCount: (n: number) => void;

  showExclamation: boolean;
  setShowExclamation: (v: boolean) => void;

  stateTimer: number;
  setStateTimer: (t: number) => void;
  addStateTimer: (dt: number) => void;
}

export const useSlothStore = create<SlothStoreState>((set, get) => ({
  position: [...SLOTH_INITIAL_POSITION],
  rotation: 0,
  setPosition: (pos) => set({ position: pos }),
  setRotation: (rot) => set({ rotation: rot }),

  currentState: 'idle',
  previousState: 'idle',
  setState: (state) =>
    set((s) => ({ currentState: state, previousState: s.currentState, stateTimer: 0 })),

  moveTarget: null,
  setMoveTarget: (target) => set({ moveTarget: target }),

  stats: {
    hunger: 80,
    thirst: 80,
    sleepiness: 80,
  },
  updateStat: (stat, delta) =>
    set((s) => ({
      stats: {
        ...s.stats,
        [stat]: clamp(s.stats[stat] + delta, 0, 100),
      },
    })),
  setStat: (stat, value) =>
    set((s) => ({
      stats: {
        ...s.stats,
        [stat]: clamp(value, 0, 100),
      },
    })),

  pendingInteractions: [],
  enqueueInteraction: (interaction) =>
    set((s) => ({
      pendingInteractions: [...s.pendingInteractions, interaction],
    })),
  removeResolvedInteractions: (now) => {
    const state = get();
    const ready = state.pendingInteractions.filter((i) => now >= i.resolveAt);
    if (ready.length > 0) {
      set({
        pendingInteractions: state.pendingInteractions.filter(
          (i) => now < i.resolveAt,
        ),
      });
    }
    return ready;
  },
  clearInteractions: () => set({ pendingInteractions: [] }),

  pendingClickCount: 0,
  lastClickTime: 0,
  incrementClickCount: () =>
    set((s) => ({ pendingClickCount: s.pendingClickCount + 1 })),
  resetClickCount: () => set({ pendingClickCount: 0 }),
  setLastClickTime: (t) => set({ lastClickTime: t }),

  isGrabbed: false,
  setGrabbed: (grabbed) => set({ isGrabbed: grabbed }),

  targetAppleId: null,
  setTargetApple: (id) => set({ targetAppleId: id }),

  attachedTreeIndex: null,
  setAttachedTree: (index) => set({ attachedTreeIndex: index }),

  wobbleCount: 0,
  setWobbleCount: (n) => set({ wobbleCount: n }),

  showExclamation: false,
  setShowExclamation: (v) => set({ showExclamation: v }),

  stateTimer: 0,
  setStateTimer: (t) => set({ stateTimer: t }),
  addStateTimer: (dt) => set((s) => ({ stateTimer: s.stateTimer + dt })),
}));
