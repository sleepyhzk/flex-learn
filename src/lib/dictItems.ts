import { INITIAL_VOCAB } from '@/data/vocabData';
import { CONVERSATION_SENTENCES } from '@/data/conversationData';
import { vocabKey, speechText } from '@/lib/vocabKey';
import type { Level } from '@/lib/types';
import type { Topic } from '@/data/vocabTopics';

export type Source = 'word' | 'example' | 'conversation';

/** Một mục nghe chép: `answer` là đáp án, `speak` là chuỗi đưa cho giọng đọc. */
export interface DictItem {
  key: string;
  answer: string;
  speak: string;
  meaning: string;
  level: Level;
  topic?: Topic;
  starKey?: string;
  ipa?: string;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildItems(source: Source): DictItem[] {
  if (source === 'conversation') {
    return CONVERSATION_SENTENCES.map((c) => ({
      key: `c${c.id}`,
      answer: c.english,
      speak: c.english,
      meaning: c.vietnamese,
      level: c.level,
    }));
  }
  return INITIAL_VOCAB.map((w) => ({
    key: `${source}-${vocabKey(w)}`,
    answer: source === 'word' ? w.word : w.example,
    speak: source === 'word' ? speechText(w) : w.example,
    meaning: source === 'word' ? w.meaning : w.exampleVi,
    level: w.level,
    topic: w.topic,
    starKey: vocabKey(w),
    ipa: source === 'word' ? w.ipa : undefined,
  }));
}

