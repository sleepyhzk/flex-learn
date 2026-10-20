import { useEffect, useRef } from 'react';
import { SCENES } from './wordVisualScenes';

/**
 * Hình động minh họa nghĩa của từ. Không có hình thì không hiện gì.
 * Người dùng bật "giảm chuyển động" trong hệ điều hành thì hình đứng yên ở khung đầu.
 */
export function WordVisual({ word, pos }: { word: string; pos: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const scene = SCENES[`${word}|${pos}`];

  useEffect(() => {
    const svg = ref.current;
    if (svg && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) svg.pauseAnimations();
  }, [word, pos]);

  if (!scene) return null;
  return (
    <div className="mb-5 flex justify-center">
      <svg
        ref={ref}
        viewBox="0 0 160 110"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-label={`Hình minh họa nghĩa của từ ${word}`}
        className="h-32 w-44 text-slate-700 dark:text-slate-300 sm:h-40 sm:w-56"
      >
        {scene()}
      </svg>
    </div>
  );
}
