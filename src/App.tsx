import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { AuthModal } from '@/components/AuthModal';
import type { ViewKey } from '@/components/Sidebar';
import { HomeView } from '@/views/HomeView';
import { FlashcardView } from '@/views/FlashcardView';
import { DictionaryView } from '@/views/DictionaryView';
import { LessonsView } from '@/views/LessonsView';
import { SpellingView } from '@/views/SpellingView';
import { ConversationView } from '@/views/ConversationView';
import { useTheme } from '@/hooks/useTheme';

export default function App() {
  const { theme, toggle } = useTheme();
  const [view, setView] = useState<ViewKey>('home');

  const go = (v: ViewKey) => {
    setView(v);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen bg-paper dark:bg-paper-dark">
      <Sidebar current={view} onNavigate={go} theme={theme} onToggleTheme={toggle} />
      {/* Chừa chỗ cho thanh trên (14) và thanh tab dưới (điện thoại), hoặc thanh bên (máy tính) */}
      <main className="pb-24 pt-14 lg:pb-0 lg:pl-60 lg:pt-0">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {view === 'home' && <HomeView onNavigate={go} />}
          {view === 'flashcards' && <FlashcardView />}
          {view === 'lessons' && <LessonsView />}
          {view === 'conversation' && <ConversationView />}
          {view === 'spelling' && <SpellingView />}
          {view === 'dictionary' && <DictionaryView />}
        </div>
      </main>
      <AuthModal />
    </div>
  );
}
