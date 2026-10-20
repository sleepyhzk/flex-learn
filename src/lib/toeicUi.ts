import { useCallback, useEffect, useRef, useState } from 'react';
import { PARTS } from '@/data/toeicData';
import type { PartKey } from '@/data/toeicData';
import { speakEnglish, stopSpeaking } from '@/lib/speech';

export const LETTERS = ['A', 'B', 'C', 'D'];
export const partLabel = (p: PartKey) => PARTS.find((x) => x.key === p)!.title.split(' · ')[0];

// ------------------------------------------------------------------ phát âm theo chuỗi
export function useSequencePlayer() {
  const timer = useRef<number | undefined>(undefined);
  const [playing, setPlaying] = useState(false);

  const stop = useCallback(() => {
    window.clearTimeout(timer.current);
    stopSpeaking();
    setPlaying(false);
  }, []);

  const play = useCallback(
    (texts: string[], gap = 700) => {
      stop();
      setPlaying(true);
      const step = (i: number) => {
        if (i >= texts.length) {
          setPlaying(false);
          return;
        }
        speakEnglish(texts[i], { onEnd: () => (timer.current = window.setTimeout(() => step(i + 1), gap)) });
      };
      step(0);
    },
    [stop]
  );

  useEffect(() => stop, [stop]);
  return { play, stop, playing };
}
