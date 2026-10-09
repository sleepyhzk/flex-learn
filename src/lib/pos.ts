import type { Pos } from './types';

export const POS_LABEL: Record<Pos, string> = {
  n: 'danh từ (n)',
  v: 'động từ (v)',
  adj: 'tính từ (adj)',
  adv: 'trạng từ (adv)',
  prep: 'giới từ (prep)',
  conj: 'liên từ (conj)',
  pron: 'đại từ (pron)',
  det: 'từ hạn định (det)',
  phrase: 'cụm từ (phrase)',
};

/** Nhãn ngắn dùng trong danh sách. */
export const POS_SHORT: Record<Pos, string> = {
  n: 'n',
  v: 'v',
  adj: 'adj',
  adv: 'adv',
  prep: 'prep',
  conj: 'conj',
  pron: 'pron',
  det: 'det',
  phrase: 'phrase',
};
