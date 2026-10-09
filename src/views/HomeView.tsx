import { Layers, BookOpen, GraduationCap, ArrowRight, Sparkles, TrendingUp, Keyboard, MessageCircle } from 'lucide-react';
import { INITIAL_VOCAB } from '@/data/vocabData';
import type { ViewKey } from '@/components/Sidebar';

interface HomeViewProps {
  onNavigate: (view: ViewKey) => void;
  totalWords: number;
  learnedCount: number;
  hardCount: number;
}

const featureCards: {
  key: ViewKey;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  {
    key: 'flashcards',
    title: 'Flashcard SRS',
    desc: 'Học từ vựng theo cấp độ A1, A2, B1 với thuật toán lặp lại ngắt quãng. Mỗi thẻ có phiên âm, nghĩa và câu ví dụ.',
    icon: Layers,
    color: 'from-primary-500 to-primary-700',
  },
  {
    key: 'lessons',
    title: 'Bài học & Bài tập',
    desc: `Toàn bộ ${INITIAL_VOCAB.length} từ vựng theo cấp độ và chủ đề (giao tiếp, TOEIC, an ninh mạng), kèm bài tập trắc nghiệm.`,
    icon: GraduationCap,
    color: 'from-sky-500 to-sky-700',
  },
  {
    key: 'conversation',
    title: 'Giao tiếp thường dùng',
    desc: 'Các câu giao tiếp cơ bản theo chủ đề (chào hỏi, mua sắm, ăn uống, hỏi đường...), chia theo cấp độ.',
    icon: MessageCircle,
    color: 'from-teal-500 to-teal-700',
  },
  {
    key: 'spelling',
    title: 'Luyện chính tả',
    desc: 'Trò chơi nhỏ: xem nghĩa tiếng Việt, gõ đúng từ tiếng Anh để ghi điểm. Có nghe phát âm và gợi ý phiên âm.',
    icon: Keyboard,
    color: 'from-indigo-500 to-indigo-700',
  },
  {
    key: 'dictionary',
    title: 'Tra cứu từ',
    desc: 'Tìm theo từ tiếng Anh hoặc nghĩa tiếng Việt, xem phiên âm, loại từ và câu ví dụ.',
    icon: BookOpen,
    color: 'from-cyan-500 to-cyan-700',
  },
];

export function HomeView({ onNavigate, totalWords, learnedCount, hardCount }: HomeViewProps) {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 p-8 text-white sm:p-12">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute bottom-0 right-8 -mb-12 h-32 w-32 rounded-full bg-white/5" />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Tự học tiếng Anh mỗi ngày
          </div>
          <h1 className="mb-3 text-3xl font-bold sm:text-4xl">Flex Learn</h1>
          <p className="max-w-xl text-white/85">
            {INITIAL_VOCAB.length} từ vựng cho giao tiếp hằng ngày, TOEIC và an ninh mạng. Flashcard thông minh, luyện chính tả, giao tiếp thực tế và tra cứu từ.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('flashcards')}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-700 transition-transform hover:scale-105"
            >
              Bắt đầu học
              <ArrowRight className="h-4 w-4" />
            </button>
            {hardCount > 0 && (
              <div className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-3 text-sm font-medium backdrop-blur-sm">
                <TrendingUp className="h-4 w-4" />
                {hardCount} từ cần ôn lại
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Tổng từ vựng</p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">{totalWords}</p>
          <p className="mt-1 text-xs text-gray-400">sẵn sàng học</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Đã học</p>
          <p className="mt-1 text-3xl font-bold text-success-600 dark:text-success-400">{learnedCount}</p>
          <p className="mt-1 text-xs text-gray-400">từ đã ghi nhận tiến độ</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Cần ôn lại</p>
          <p className="mt-1 text-3xl font-bold text-accent-600 dark:text-accent-400">{hardCount}</p>
          <p className="mt-1 text-xs text-gray-400">từ đánh dấu khó</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {featureCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.key}
              onClick={() => onNavigate(card.key)}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 text-left transition-all hover:border-gray-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-white`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{card.title}</h3>
              <p className="pr-8 text-sm text-gray-500 dark:text-gray-400">{card.desc}</p>
              <ArrowRight className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-gray-400 dark:text-gray-700 dark:group-hover:text-gray-500" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
