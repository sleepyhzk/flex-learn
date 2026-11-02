import { Suspense, lazy, useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { AuthModal } from '@/components/AuthModal';
import { TopBar } from '@/components/TopBar';
import type { ViewKey } from '@/components/Sidebar';
import { HomeView } from '@/views/HomeView';
import { Loader2 } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useBrightness } from '@/hooks/useBrightness';
import { useStudyTracker } from '@/hooks/useStudyTime';
import { useExtrasSync } from '@/hooks/useExtrasSync';
import { sfx } from '@/lib/sfx';

/**
 * Mỗi mục tải riêng khi mở (code splitting): file JS đầu tiên chỉ còn trang chủ, thanh bên và dữ liệu từ vựng;
 * ngân hàng đề TOEIC, hội thoại... chỉ tải khi cần. Ngoài trang chủ, các mục còn lại được tải sẵn lúc rảnh (xem bên dưới).
 */
const loaders = {
  flashcards: () => import('@/views/FlashcardView').then((m) => ({ default: m.FlashcardView })),
  games: () => import('@/views/GamesView').then((m) => ({ default: m.GamesView })),
  test: () => import('@/views/TestView').then((m) => ({ default: m.TestView })),
  lessons: () => import('@/views/LessonsView').then((m) => ({ default: m.LessonsView })),
  conversation: () => import('@/views/ConversationView').then((m) => ({ default: m.ConversationView })),
  spelling: () => import('@/views/SpellingView').then((m) => ({ default: m.SpellingView })),
  shadowing: () => import('@/views/ShadowingView').then((m) => ({ default: m.ShadowingView })),
  dictation: () => import('@/views/DictationView').then((m) => ({ default: m.DictationView })),
  dictionary: () => import('@/views/DictionaryView').then((m) => ({ default: m.DictionaryView })),
};
const FlashcardView = lazy(loaders.flashcards);
const GamesView = lazy(loaders.games);
const TestView = lazy(loaders.test);
const LessonsView = lazy(loaders.lessons);
const ConversationView = lazy(loaders.conversation);
const SpellingView = lazy(loaders.spelling);
const ShadowingView = lazy(loaders.shadowing);
const DictationView = lazy(loaders.dictation);
const DictionaryView = lazy(loaders.dictionary);

function ViewFallback() {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[40vh] items-center justify-center text-slate-400">
      <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
      <span className="sr-only">Đang tải...</span>
    </div>
  );
}

export default function App() {
  const { theme, toggle } = useTheme();
  const { brightness, setBrightness, reset: resetBrightness } = useBrightness();
  const [view, setView] = useState<ViewKey>('home');
  // Đếm thời gian học cho streak (không tính trang chủ)
  useStudyTracker(view !== 'home');
  // Đồng bộ streak và tiến độ trò chơi lên Supabase (khi đã đăng nhập)
  useExtrasSync();
  // Thanh bên (máy tính): mở rộng hoặc thu gọn còn cột biểu tượng, nhớ lựa chọn lần sau
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('flex_sidebar') !== 'closed';
    } catch {
      return true;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('flex_sidebar', sidebarOpen ? 'open' : 'closed');
    } catch {
      // ignore
    }
  }, [sidebarOpen]);

  // Sau khi trang chủ đã hiện, tải sẵn các mục khác lúc trình duyệt rảnh để bấm chuyển mục là có ngay.
  // Bỏ qua khi người dùng bật tiết kiệm dữ liệu.
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    const run = () => {
      for (const load of Object.values(loaders)) void load().catch(() => undefined);
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback && w.cancelIdleCallback) {
      const id = w.requestIdleCallback(run, { timeout: 5000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(run, 3000);
    return () => window.clearTimeout(t);
  }, []);

  const go = (v: ViewKey) => {
    setView(v);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="relative min-h-screen bg-paper dark:bg-paper-dark">
      <Sidebar
        current={view}
        onNavigate={go}
        theme={theme}
        onToggleTheme={() => {
          sfx.chime();
          toggle();
        }}
        brightness={brightness}
        onBrightness={setBrightness}
        onResetBrightness={resetBrightness}
        open={sidebarOpen}
        onToggleOpen={() => {
          sfx.chime();
          setSidebarOpen((v) => !v);
        }}
      />
      {/* Chừa chỗ cho thanh trên (14) và thanh tab dưới (điện thoại), hoặc thanh bên (máy tính) */}
      <main className={`pb-24 pt-14 transition-[padding] duration-300 lg:pb-0 lg:pt-0 ${sidebarOpen ? 'lg:pl-44' : 'lg:pl-16'}`}>
        <TopBar onNavigate={go} />
        <div className={`mx-auto p-4 sm:p-6 lg:p-10 ${view === 'home' ? 'max-w-7xl' : !sidebarOpen ? 'max-w-6xl' : 'max-w-5xl'}`}>
          {view === 'home' && <HomeView onNavigate={go} />}
          <Suspense fallback={<ViewFallback />}>
            {view === 'flashcards' && <FlashcardView />}
            {view === 'games' && <GamesView />}
            {view === 'test' && <TestView />}
            {view === 'lessons' && <LessonsView />}
            {view === 'conversation' && <ConversationView />}
            {view === 'spelling' && <SpellingView />}
            {view === 'shadowing' && <ShadowingView />}
            {view === 'dictation' && <DictationView />}
            {view === 'dictionary' && <DictionaryView />}
          </Suspense>
        </div>
      </main>
      <AuthModal />
    </div>
  );
}
