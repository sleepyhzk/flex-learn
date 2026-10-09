import { useState } from 'react';
import { Home, Layers, BookOpen, GraduationCap, Sun, Moon, Keyboard, MessageCircle, Volume2, LogIn, LogOut, Settings } from 'lucide-react';
import { VoiceSettings } from './VoiceSettings';
import { useAuth } from '@/hooks/useAuth';

export type ViewKey = 'home' | 'flashcards' | 'dictionary' | 'lessons' | 'spelling' | 'conversation';

interface NavItem {
  key: ViewKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { key: 'home', label: 'Trang chủ', icon: Home },
  { key: 'flashcards', label: 'Từ vựng', icon: Layers },
  { key: 'lessons', label: 'Bài học', icon: GraduationCap },
  { key: 'conversation', label: 'Giao tiếp', icon: MessageCircle },
  { key: 'spelling', label: 'Chính tả', icon: Keyboard },
  { key: 'dictionary', label: 'Tra cứu', icon: BookOpen },
];

interface SidebarProps {
  current: ViewKey;
  onNavigate: (view: ViewKey) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 font-display text-xl font-semibold text-white">
        F
      </div>
      <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">Flex Learn</span>
    </div>
  );
}

/** Tài khoản, giọng đọc, giao diện sáng/tối. Dùng cho thanh bên (máy tính) và bảng cài đặt (điện thoại). */
function SettingsPanel({
  theme,
  onToggleTheme,
  onOpenVoice,
  onAfterAction,
}: {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenVoice: () => void;
  onAfterAction?: () => void;
}) {
  const auth = useAuth();
  const row =
    'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800';

  return (
    <div className="space-y-1">
      {auth.enabled && !auth.loading &&
        (auth.user ? (
          <div className="mb-2 rounded-lg bg-slate-100 px-3 py-2.5 dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">Đã đăng nhập, tiến độ được lưu trên tài khoản</p>
            <p className="mt-0.5 truncate text-sm font-medium text-slate-900 dark:text-slate-100" title={auth.user.email ?? ''}>
              {auth.user.email}
            </p>
            <button
              onClick={() => {
                void auth.signOut();
                onAfterAction?.();
              }}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:underline dark:text-slate-400"
            >
              <LogOut className="h-3.5 w-3.5" />
              Đăng xuất
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              auth.openAuth();
              onAfterAction?.();
            }}
            className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            <LogIn className="h-4 w-4" />
            Đăng nhập để lưu tiến độ
          </button>
        ))}
      <button
        onClick={() => {
          onAfterAction?.();
          onOpenVoice();
        }}
        className={row}
      >
        <span className="flex items-center gap-2.5">
          <Volume2 className="h-4 w-4" />
          Giọng đọc
        </span>
      </button>
      <button onClick={onToggleTheme} className={row} role="switch" aria-checked={theme === 'dark'}>
        <span className="flex items-center gap-2.5">
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          Chế độ tối
        </span>
        <span className={`relative h-5 w-9 rounded-full transition-colors ${theme === 'dark' ? 'bg-primary-600' : 'bg-slate-300'}`}>
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${theme === 'dark' ? 'left-[18px]' : 'left-0.5'}`}
          />
        </span>
      </button>
    </div>
  );
}

export function Sidebar({ current, onNavigate, theme, onToggleTheme }: SidebarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  return (
    <>
      {/* Thanh trên (điện thoại) */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-paper-dark/90 lg:hidden">
        <Logo />
        <button
          onClick={() => setSheetOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Mở cài đặt và tài khoản"
        >
          <Settings className="h-5 w-5" />
        </button>
      </header>

      {/* Thanh bên (máy tính) */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-60 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-paper-dark lg:flex">
        <div className="px-5 py-6">
          <Logo />
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 scrollbar-thin" aria-label="Điều hướng chính">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = current === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                aria-current={active ? 'page' : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? 'bg-primary-50 font-semibold text-primary-700 dark:bg-primary-950/60 dark:text-primary-300'
                    : 'font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 p-3 dark:border-slate-800">
          <SettingsPanel theme={theme} onToggleTheme={onToggleTheme} onOpenVoice={() => setVoiceOpen(true)} />
        </div>
      </aside>

      {/* Thanh tab dưới (điện thoại) */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md dark:border-slate-800 dark:bg-paper-dark/95 lg:hidden"
        aria-label="Điều hướng chính"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = current === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center gap-0.5 pb-1.5 pt-2 text-[10px] font-medium transition-colors ${
                active ? 'text-primary-700 dark:text-primary-300' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <span className={`rounded-full px-4 py-1 transition-colors ${active ? 'bg-primary-50 dark:bg-primary-950/60' : ''}`}>
                <Icon className="h-5 w-5" />
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bảng cài đặt (điện thoại) */}
      {sheetOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setSheetOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Cài đặt và tài khoản"
            className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-xl dark:bg-slate-900"
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300 dark:bg-slate-700" />
            <SettingsPanel
              theme={theme}
              onToggleTheme={onToggleTheme}
              onOpenVoice={() => setVoiceOpen(true)}
              onAfterAction={() => setSheetOpen(false)}
            />
          </div>
        </div>
      )}

      <VoiceSettings open={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </>
  );
}
