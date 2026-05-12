import { useFrame } from '@react-three/fiber';
import { useSlothStore } from '@/stores/slothStore';
import { useGameStore } from '@/stores/gameStore';
import { WOBBLE_DELAY_MS } from '@/constants/timing';
import { EXCLAMATION_DURATION_MS } from '@/constants/timing';

export function useDelayedReactions() {
  useFrame(() => {
    const now = Date.now();
    const sloth = useSlothStore.getState();
    const game = useGameStore.getState();

    if (sloth.currentState === 'grabbed') return;

    // Check for pending click reactions
    if (sloth.pendingClickCount > 0 && sloth.lastClickTime > 0) {
      const elapsed = now - sloth.lastClickTime;
      const delay = WOBBLE_DELAY_MS / game.timeSpeed;
      if (elapsed >= delay && sloth.currentState === 'idle') {
        const count = sloth.pendingClickCount;
        sloth.resetClickCount();
        sloth.setLastClickTime(0);
        sloth.setWobbleCount(count);
        sloth.setState('wobbling');
        return;
      }
    }

    // Check for resolved food interactions
    const ready = sloth.removeResolvedInteractions(now);
    if (ready.length === 0) return;

    // Process food notices (prioritize over clicks)
    const foodNotice = ready.find((i) => i.type === 'food_notice');
    if (foodNotice && foodNotice.data?.appleId && sloth.currentState === 'idle') {
      // Check if apple still exists and not eaten
      const apple = game.apples.find(
        (a) => a.id === foodNotice.data!.appleId && !a.eaten,
      );
      if (apple) {
        sloth.setTargetApple(apple.id);
        sloth.setMoveTarget([...apple.position]);
        sloth.setShowExclamation(true);
        setTimeout(() => {
          useSlothStore.getState().setShowExclamation(false);
        }, EXCLAMATION_DURATION_MS);
        sloth.setState('walking_to_food');
      }
    }
  });
}
