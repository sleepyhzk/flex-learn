import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { toLocalDateString } from '@/lib/srs';
import { IDLE_MS, addStudySeconds, computeStudyStats, flushStudy, getStudySnapshot, subscribeStudy } from '@/lib/studyTime';

const ACTIVITY_EVENTS = ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart'] as const;

/**
 * Đếm thời gian học: mỗi giây cộng 1 khi đang ở một mục học (không phải trang chủ),
 * tab đang hiển thị và có tiêu điểm, và người dùng có thao tác trong vòng 60 giây qua.
 */
export function useStudyTracker(active: boolean) {
  useEffect(() => {
    let last = Date.now();
    const mark = () => {
      last = Date.now();
    };
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, mark, { passive: true }));

    const tick = window.setInterval(() => {
      if (!active) return;
      if (document.visibilityState !== 'visible' || !document.hasFocus()) return;
      if (Date.now() - last > IDLE_MS) return;
      addStudySeconds(toLocalDateString(), 1);
    }, 1000);
    const save = window.setInterval(flushStudy, 5000);
    document.addEventListener('visibilitychange', flushStudy);
    window.addEventListener('pagehide', flushStudy);

    return () => {
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, mark));
      window.clearInterval(tick);
      window.clearInterval(save);
      document.removeEventListener('visibilitychange', flushStudy);
      window.removeEventListener('pagehide', flushStudy);
      flushStudy();
    };
  }, [active]);
}

export function useStudyStats() {
  const map = useSyncExternalStore(subscribeStudy, getStudySnapshot);
  return useMemo(() => computeStudyStats(map), [map]);
}
