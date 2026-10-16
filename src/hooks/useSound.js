import { soundFx } from '../utils/soundEffects';

export function useSound(type = 'click') {
  return () => {
    soundFx.play(type);
  };
}