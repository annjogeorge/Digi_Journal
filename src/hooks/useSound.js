import { useCallback, useRef } from 'react';

export function useSound(src, { volume = 0.5 } = {}) {
  const audioRef = useRef(null);

  const play = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.volume = volume;
    }
    audioRef.current.currentTime = 0; // rewind so rapid clicks replay from start
    audioRef.current.play().catch(() => {
      // Autoplay can be blocked before first user interaction — safe to ignore
    });
  }, [src, volume]);

  return play;
}