import { useEffect, useRef } from 'react';
import { SCENES } from './wordVisualScenes';

/**
 * Hình động minh họa nghĩa của từ. Không có hình thì không hiện gì.
 * Người dùng bật "giảm chuyển động" trong hệ điều hành thì hình đứng yên ở khung đầu.
 *
 * `play = false`: hình đứng yên ở khung đầu (dùng lúc thẻ đang lật hoặc đang úp mặt).
 * Hoạt ảnh SMIL không chạy trên GPU mà bắt trình duyệt vẽ lại SVG ở mỗi khung hình; nếu để chạy
 * trong lúc thẻ đang xoay 3D thì mỗi khung hình phải vẽ lại cả mặt thẻ (kèm bóng đổ lớn) nên bị giật.
 */
export function WordVisual({ word, pos, play = true }: { word: string; pos: string; play?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const scene = SCENES[`${word}|${pos}`];

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!play || reduce) {
      svg.pauseAnimations();
      svg.setCurrentTime(0); // về khung đầu để lần sau chạy lại từ đầu
    } else {
      svg.unpauseAnimations();
    }
  }, [word, pos, play]);

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
