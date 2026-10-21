import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { AuthModal } from '@/components/AuthModal';
import { TopBar } from '@/components/TopBar';
import type { ViewKey } from '@/components/Sidebar';
import { HomeView } from '@/views/HomeView';
import { FlashcardView } from '@/views/FlashcardView';
import { DictionaryView } from '@/views/DictionaryView';
import { LessonsView } from '@/views/LessonsView';
import { SpellingView } from '@/views/SpellingView';
import { DictationView } from '@/views/DictationView';
import { ShadowingView } from '@/views/ShadowingView';
import { ConversationView } from '@/views/ConversationView';
import { GamesView } from '@/views/GamesView';
import { TestView } from '@/views/TestView';
import { useTheme } from '@/hooks/useTheme';
import { useBrightness } from '@/hooks/useBrightness';
import { useStudyTracker } from '@/hooks/useStudyTime';
import { useExtrasSync } from '@/hooks/useExtrasSync';
import { sfx } from '@/lib/sfx';

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
          {view === 'flashcards' && <FlashcardView />}
          {view === 'games' && <GamesView />}
          {view === 'test' && <TestView />}
          {view === 'lessons' && <LessonsView />}
          {view === 'conversation' && <ConversationView />}
          {view === 'spelling' && <SpellingView />}
          {view === 'shadowing' && <ShadowingView />}
          {view === 'dictation' && <DictationView />}
          {view === 'dictionary' && <DictionaryView />}
        </div>
      </main>
      <AuthModal />
    </div>
  );
}
