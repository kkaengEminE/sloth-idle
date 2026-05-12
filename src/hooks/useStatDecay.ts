import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSlothStore } from '@/stores/slothStore';
import { useGameStore } from '@/stores/gameStore';
import {
  STAT_DECAY_INTERVAL_MS,
  HUNGER_DECAY_RATE,
  THIRST_DECAY_RATE,
  SLEEPINESS_DECAY_RATE,
} from '@/constants/timing';

export function useStatDecay() {
  const accumulatorRef = useRef(0);

  useFrame((_, delta) => {
    const game = useGameStore.getState();
    const sloth = useSlothStore.getState();
    const scaledDelta = delta * game.timeSpeed * 1000;
    accumulatorRef.current += scaledDelta;

    if (accumulatorRef.current >= STAT_DECAY_INTERVAL_MS) {
      accumulatorRef.current -= STAT_DECAY_INTERVAL_MS;

      sloth.updateStat('hunger', -HUNGER_DECAY_RATE);
      sloth.updateStat('thirst', -THIRST_DECAY_RATE);

      // Sleepiness decays unless sleeping
      if (
        sloth.currentState !== 'sleeping_ground' &&
        sloth.currentState !== 'sleeping_tree'
      ) {
        sloth.updateStat('sleepiness', -SLEEPINESS_DECAY_RATE);
      }

      // Swimming restores thirst (additional to the per-frame restore in state machine)
      if (sloth.currentState === 'swimming') {
        sloth.updateStat('thirst', THIRST_DECAY_RATE * 2);
      }
    }
  });
}
