import { useMemo } from 'react';
import { useSrsProgress } from '@/hooks/useSrsProgress';
import { computeVocabStats } from '@/lib/vocabStats';

export type { LevelStat } from '@/lib/vocabStats';

/**
 * Số liệu từ vựng dùng chung cho Trang chủ và thanh bên. Chỉ dùng bảng tra nhỏ (data/vocabIndex.ts) chứ không import
 * kho từ vựng, để file JS đầu tiên nhẹ; `nextId` là id của thẻ nên ôn tiếp (xem lib/vocabLoader.ts để lấy nội dung thẻ).
 */
export function useVocabStats() {
  const { progressMap } = useSrsProgress();
  return useMemo(() => computeVocabStats(progressMap), [progressMap]);
}
