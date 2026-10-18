import { useEffect, useState } from 'react';

export const BRIGHTNESS_MIN = 60;
export const BRIGHTNESS_MAX = 130;
export const BRIGHTNESS_DEFAULT = 100;
const KEY = 'flex_brightness';

function clamp(n: number): number {
  if (!Number.isFinite(n)) return BRIGHTNESS_DEFAULT;
  return Math.min(BRIGHTNESS_MAX, Math.max(BRIGHTNESS_MIN, Math.round(n)));
}

function apply(value: number) {
  // Ở mức 100% bỏ hẳn bộ lọc để không tạo thêm lớp xử lý đồ họa không cần thiết.
  document.documentElement.style.filter = value === BRIGHTNESS_DEFAULT ? '' : `brightness(${value / 100})`;
}

/** Độ sáng toàn trang (60% đến 130%), lưu ở localStorage, áp dụng bằng CSS filter lên thẻ html. */
export function useBrightness() {
  const [brightness, setBrightness] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw === null ? BRIGHTNESS_DEFAULT : clamp(Number(raw));
    } catch {
      return BRIGHTNESS_DEFAULT;
    }
  });

  useEffect(() => {
    apply(brightness);
    try {
      localStorage.setItem(KEY, String(brightness));
    } catch {
      // ignore
    }
  }, [brightness]);

  return {
    brightness,
    setBrightness: (n: number) => setBrightness(clamp(n)),
    reset: () => setBrightness(BRIGHTNESS_DEFAULT),
  };
}
