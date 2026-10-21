import { useMemo } from 'react';
import { INITIAL_VOCAB, LEVEL_ORDER } from '@/data/vocabData';
import { useSrsProgress } from '@/hooks/useSrsProgress';
import { vocabKey } from '@/lib/vocabKey';
import { isDue } from '@/lib/srs';
import type { Level, VocabItem } from '@/lib/types';

export interface LevelStat {
  level: Level;
  total: number;
  /** Thuộc rồi: lần ôn gần nhất là "good" hoặc "easy". */
  known: number;
  /** Chưa thuộc / cần củng cố: lần ôn gần nhất là "hard". */
  hard: number;
  /** Chưa học: chưa có tiến độ. */
  fresh: number;
}

/**
 * Số liệu từ vựng dùng chung cho Trang chủ và thanh bên (một lần duyệt qua toàn bộ từ).
 * nextCard = thẻ đến hạn cũ nhất; nếu không còn thẻ đến hạn thì là từ mới đầu tiên.
 */
export function useVocabStats() {
  const { progressMap } = useSrsProgress();

  return useMemo(() => {
    const byLevel = new Map<Level, LevelStat>(
      LEVEL_ORDER.map((level) => [level, { level, total: 0, known: 0, hard: 0, fresh: 0 }])
    );
    let due = 0;
    let learned = 0;
    let oldestDue: VocabItem | null = null;
    let oldestDueDate = '';
    let firstFresh: VocabItem | null = null;

    for (const w of INITIAL_VOCAB) {
      const ls = byLevel.get(w.level);
      if (!ls) continue;
      ls.total += 1;
      const s = progressMap[vocabKey(w)];
      if (!s) {
        ls.fresh += 1;
        if (!firstFresh) firstFresh = w;
        continue;
      }
      learned += 1;
      if (s.lastQuality === 'hard') ls.hard += 1;
      else ls.known += 1;
      if (isDue(s.nextReview)) {
        due += 1;
        if (!oldestDue || s.nextReview < oldestDueDate) {
          oldestDue = w;
          oldestDueDate = s.nextReview;
        }
      }
    }

    const levels = [...byLevel.values()].filter((l) => l.total > 0);
    const totals = levels.reduce(
      (t, l) => ({ total: t.total + l.total, known: t.known + l.known, hard: t.hard + l.hard, fresh: t.fresh + l.fresh }),
      { total: 0, known: 0, hard: 0, fresh: 0 }
    );
    return {
      due,
      learned,
      fresh: INITIAL_VOCAB.length - learned,
      levels,
      totals,
      nextCard: (oldestDue ?? firstFresh) as VocabItem | null,
    };
  }, [progressMap]);
}
