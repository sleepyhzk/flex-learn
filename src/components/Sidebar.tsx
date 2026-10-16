import { useState } from 'react';
import { Home, Layers, BookOpen, GraduationCap, Sun, Moon, Keyboard, MessageCircle, Volume2, LogIn, LogOut, Settings, Headphones, Mic } from 'lucide-react';
import { VoiceSettings } from './VoiceSettings';
import { useAuth } from '@/hooks/useAuth';

export type ViewKey = 'home' | 'flashcards' | 'dictionary' | 'lessons' | 'spelling' | 'dictation' | 'shadowing' | 'conversation';

interface NavItem {
  key: ViewKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { key: 'home', label: 'Trang chủ', icon: Home },
  { key: 'flashcards', label: 'Flashcard', icon: Layers },
  { key: 'lessons', label: 'Từ vựng', icon: GraduationCap },
  { key: 'conversation', label: 'Giao tiếp', icon: MessageCircle },
  { key: 'spelling', label: 'Chính tả', icon: Keyboard },
  { key: 'dictation', label: 'Nghe chép', icon: Headphones },
  { key: 'shadowing', label: 'Shadowing', icon: Mic },
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
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-300 font-display text-xl font-bold text-[#8a5a3c] shadow-[0_6px_14px_-6px_rgba(120,80,40,0.55),inset_0_1px_0_rgba(255,255,255,0.6)] dark:from-primary-200 dark:to-primary-100 dark:text-primary-300">
        F
      </div>
      <span className="font-script text-[28px] font-semibold leading-none text-ink dark:text-slate-100">Flex Learn</span>
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
    'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[15px] text-slate-700 transition-colors hover:bg-primary-100/60 dark:text-slate-300 dark:hover:bg-slate-800';

  return (
    <div className="space-y-1">
      {auth.enabled && !auth.loading &&
        (auth.user ? (
          <div className="mb-3 rounded-2xl border border-slate-200 bg-white px-2.5 py-2 shadow-[0_6px_16px_-10px_rgba(110,75,40,0.5)] dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-2.5" title={auth.user.email ?? undefined}>
              <span
                aria-hidden="true"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-200 text-sm font-bold uppercase text-primary-700 dark:bg-primary-200 dark:text-primary-300"
              >
                {(auth.user.email ?? '?').charAt(0)}
              </span>
              <div className="min-w-0 flex-1 leading-tight">
                <p className="text-[13px] font-semibold text-ink dark:text-slate-100">Đã đăng nhập</p>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-400">Tiến độ được lưu</p>
              </div>
              <button
                onClick={() => {
                  void auth.signOut();
                  onAfterAction?.();
                }}
                className="flex-shrink-0 rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-primary-100/70 hover:text-ink dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                aria-label="Đăng xuất"
                title="Đăng xuất"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              auth.openAuth();
              onAfterAction?.();
            }}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-700 via-primary-600 to-[#a9705a] dark:from-primary-600 dark:via-primary-600 dark:to-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_18px_-8px_rgba(26,34,69,0.7)] transition hover:brightness-110"
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
        <span className={`relative h-6 w-11 rounded-full shadow-inner transition-colors ${theme === 'dark' ? 'bg-[#c29f81]' : 'bg-slate-300'}`}>
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${theme === 'dark' ? 'left-[22px]' : 'left-0.5'}`}
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
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-60 flex-col bg-paper-side shadow-[8px_0_30px_-14px_rgba(110,75,40,0.45)] dark:bg-paper-sidedark lg:flex">
        <div className="px-5 pb-5 pt-6">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pt-2 scrollbar-thin" aria-label="Điều hướng chính">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = current === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                aria-current={active ? 'page' : undefined}
                className={`relative flex w-full items-center gap-3.5 rounded-2xl px-4 py-3 text-[15px] transition-colors ${
                  active
                    ? "bg-primary-200 font-medium text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] before:absolute before:-left-3 before:top-1/2 before:h-8 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-ink dark:bg-primary-600 dark:text-white dark:shadow-none dark:before:bg-primary-300"
                    : 'text-slate-700 hover:bg-primary-100/60 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 pb-4">
          <SettingsPanel theme={theme} onToggleTheme={onToggleTheme} onOpenVoice={() => setVoiceOpen(true)} />
        </div>
      </aside>

      {/* Thanh tab dưới (điện thoại) */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex overflow-x-auto border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md [scrollbar-width:none] dark:border-slate-800 dark:bg-paper-dark/95 lg:hidden [&::-webkit-scrollbar]:hidden"
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
              className={`flex min-w-[4.5rem] flex-1 shrink-0 flex-col items-center gap-0.5 pb-1.5 pt-2 text-[10px] font-medium transition-colors ${
                active ? 'text-primary-700 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <span className={`rounded-full px-4 py-1 transition-colors ${active ? 'bg-primary-200 dark:bg-primary-600 dark:text-white' : ''}`}>
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
