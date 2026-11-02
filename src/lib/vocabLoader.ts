import { useEffect, useState } from 'react';
import { VOCAB_TOTAL } from '../data/vocabIndex.ts';
import type { VocabItem } from './types';

let pending: Promise<Map<number, VocabItem>> | null = null;

/** Tải kho từ vựng (file riêng, hàng trăm kB) lần đầu cần tới, rồi dùng lại. Lỗi mạng thì lần sau được thử lại. */
export function loadVocabById(): Promise<Map<number, VocabItem>> {
  if (!pending) {
    pending = import('@/data/vocabData').then((m) => {
      if (m.INITIAL_VOCAB.length !== VOCAB_TOTAL) {
        console.error('data/vocabIndex.ts đã lỗi thời so với kho từ vựng: chạy `npm run gen:vocab`.');
      }
      return new Map(m.INITIAL_VOCAB.map((w) => [w.id, w] as const));
    });
    pending.catch(() => {
      pending = null;
    });
  }
  return pending;
}

/** Lấy nội dung một từ theo id (tải kho từ vựng ở nền). */
export function useVocabItem(id: number | null): { item: VocabItem | null; loading: boolean; failed: boolean } {
  const [byId, setById] = useState<Map<number, VocabItem> | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    loadVocabById().then(
      (m) => alive && setById(m),
      () => alive && setFailed(true)
    );
    return () => {
      alive = false;
    };
  }, []);

  return {
    item: id !== null && byId ? (byId.get(id) ?? null) : null,
    loading: id !== null && !byId && !failed,
    failed,
  };
}
