import { useId, useState } from 'react';
import { Home, Layers, BookOpen, GraduationCap, Sun, Moon, Keyboard, MessageCircle, Volume2, LogIn, LogOut, Settings, Headphones, Mic, Gamepad2, ClipboardCheck, SunMedium, ChevronLeft, ChevronRight } from 'lucide-react';
import { BRIGHTNESS_DEFAULT, BRIGHTNESS_MAX, BRIGHTNESS_MIN } from '@/hooks/useBrightness';
import { VoiceSettings } from './VoiceSettings';
import { useAuth } from '@/hooks/useAuth';
import { useVocabStats } from '@/hooks/useVocabStats';
import { useDisplayName } from '@/hooks/useDisplayName';

export type ViewKey = 'home' | 'flashcards' | 'games' | 'test' | 'dictionary' | 'lessons' | 'spelling' | 'dictation' | 'shadowing' | 'conversation';

interface NavItem {
  key: ViewKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  section: 'learn' | 'practice';
}

const navItems: NavItem[] = [
  { key: 'home', label: 'Trang chủ', icon: Home, section: 'learn' },
  { key: 'flashcards', label: 'Flashcard', icon: Layers, section: 'learn' },
  { key: 'lessons', label: 'Từ vựng', icon: GraduationCap, section: 'learn' },
  { key: 'spelling', label: 'Chính tả', icon: Keyboard, section: 'learn' },
  { key: 'dictation', label: 'Nghe chép', icon: Headphones, section: 'learn' },
  { key: 'shadowing', label: 'Shadowing', icon: Mic, section: 'learn' },
  { key: 'games', label: 'Trò chơi', icon: Gamepad2, section: 'practice' },
  { key: 'test', label: 'Kiểm tra', icon: ClipboardCheck, section: 'practice' },
  { key: 'conversation', label: 'Giao tiếp', icon: MessageCircle, section: 'practice' },
  { key: 'dictionary', label: 'Tra cứu', icon: BookOpen, section: 'practice' },
];

const SECTIONS = [
  { id: 'learn', title: 'Học tập' },
  { id: 'practice', title: 'Thực hành' },
] as const;

interface SidebarProps {
  current: ViewKey;
  onNavigate: (view: ViewKey) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  brightness: number;
  onBrightness: (n: number) => void;
  onResetBrightness: () => void;
  /** Thanh bên (máy tính) đang mở hay ẩn. */
  open: boolean;
  onToggleOpen: () => void;
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 overflow-hidden">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-primary-600 to-primary-500 text-xs font-extrabold text-white shadow-sm shadow-primary-500/20">
        F
      </div>
      {!compact && (
        <h1 className="flex items-center gap-1 truncate text-xs font-bold leading-none tracking-tight text-slate-900 dark:text-white">
          Flex Learn
          <span className="h-1.5 w-1.5 rounded-full bg-success-500" aria-hidden="true" />
        </h1>
      )}
    </div>
  );
}

/** Tài khoản, giọng đọc, giao diện sáng/tối. Dùng cho thanh bên (máy tính) và bảng cài đặt (điện thoại). */
function SettingsPanel({
  theme,
  onToggleTheme,
  brightness,
  onBrightness,
  onResetBrightness,
  onOpenVoice,
  onAfterAction,
  compact = false,
}: {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  brightness: number;
  onBrightness: (n: number) => void;
  onResetBrightness: () => void;
  onOpenVoice: () => void;
  onAfterAction?: () => void;
  /** Dạng thu gọn: chỉ có biểu tượng (cột thanh bên khi thu gọn). */
  compact?: boolean;
}) {
  const auth = useAuth();
  const sliderId = useId();
  const [brightnessOpen, setBrightnessOpen] = useState(false);
  const row =
    'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[15px] text-slate-700 transition-colors hover:bg-primary-100/60 dark:text-slate-300 dark:hover:bg-slate-800';

  const brightnessControl = (
    <>
        <div className="flex items-center justify-between">
          <label htmlFor={sliderId} className="flex items-center gap-2.5">
            <SunMedium className="h-4 w-4" />
            Độ sáng
          </label>
          <span className="flex items-center gap-2">
            <span className="text-sm tabular-nums text-slate-500 dark:text-slate-400">{brightness}%</span>
            {brightness !== BRIGHTNESS_DEFAULT && (
              <button
                onClick={onResetBrightness}
                className="rounded-md px-1.5 py-0.5 text-xs font-medium text-primary-700 hover:bg-primary-100/70 dark:text-primary-300 dark:hover:bg-slate-800"
              >
                Đặt lại
              </button>
            )}
          </span>
        </div>
        <input
          id={sliderId}
          type="range"
          min={BRIGHTNESS_MIN}
          max={BRIGHTNESS_MAX}
          step={1}
          value={brightness}
          onChange={(e) => onBrightness(Number(e.target.value))}
          onDoubleClick={onResetBrightness}
          aria-valuetext={`${brightness} phần trăm`}
          className="mt-2 h-2 w-full cursor-pointer accent-primary-600"
        />
    </>
  );

  if (compact) {
    const ic =
      'flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-primary-100/60 dark:text-slate-300 dark:hover:bg-slate-800';
    return (
      <div className="flex flex-col items-center gap-1">
        {auth.enabled && !auth.loading &&
          (auth.user ? (
            <>
              <span
                title="Đã đăng nhập, tiến độ được lưu"
                className="mb-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary-200 text-sm font-bold uppercase text-primary-700 dark:bg-primary-200 dark:text-primary-300"
              >
                {(auth.user.email ?? '?').charAt(0)}
              </span>
              <button onClick={() => void auth.signOut()} className={ic} aria-label="Đăng xuất" title="Đăng xuất">
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <button onClick={() => auth.openAuth()} className={ic} aria-label="Đăng nhập để lưu tiến độ" title="Đăng nhập để lưu tiến độ">
              <LogIn className="h-5 w-5" />
            </button>
          ))}
        <button onClick={onOpenVoice} className={ic} aria-label="Giọng đọc" title="Giọng đọc">
          <Volume2 className="h-5 w-5" />
        </button>
        <div className="relative">
          <button
            onClick={() => setBrightnessOpen((v) => !v)}
            className={ic}
            aria-label="Độ sáng"
            aria-expanded={brightnessOpen}
            title={`Độ sáng ${brightness}%`}
          >
            <SunMedium className="h-5 w-5" />
          </button>
          {brightnessOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setBrightnessOpen(false)} aria-hidden="true" />
              <div className="absolute bottom-0 left-full z-50 ml-3 w-56 rounded-xl border border-slate-200 bg-white p-3 text-[15px] text-slate-700 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                {brightnessControl}
              </div>
            </>
          )}
        </div>
        <button onClick={onToggleTheme} className={ic} role="switch" aria-checked={theme === 'dark'} aria-label="Chế độ tối" title="Chế độ tối">
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {auth.enabled && !auth.loading &&
        (auth.user ? (
          <div className="mb-3 rounded-2xl border border-slate-200 bg-white px-2.5 py-2 shadow-[0_6px_16px_-10px_rgba(80,72,150,0.5)] dark:border-slate-700 dark:bg-slate-900">
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
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-700 via-primary-600 to-[#705ceb] dark:from-primary-600 dark:via-primary-600 dark:to-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_18px_-8px_rgba(26,34,69,0.7)] transition hover:brightness-110"
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
      <div className="rounded-xl px-3 py-2.5 text-[15px] text-slate-700 dark:text-slate-300">
        {brightnessControl}
      </div>
      <button onClick={onToggleTheme} className={row} role="switch" aria-checked={theme === 'dark'}>
        <span className="flex items-center gap-2.5">
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          Chế độ tối
        </span>
        <span className={`relative h-6 w-11 rounded-full shadow-inner transition-colors ${theme === 'dark' ? 'bg-[#8f84e8]' : 'bg-slate-300'}`}>
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${theme === 'dark' ? 'left-[22px]' : 'left-0.5'}`}
          />
        </span>
      </button>
    </div>
  );
}

function initials(name: string | null): string {
  if (!name) return 'KH';
  const parts = name.split(/\s+/).filter(Boolean);
  const first = parts[0]?.charAt(0) ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : (parts[0]?.charAt(1) ?? '');
  return (first + last).toUpperCase();
}

/** Chân thanh bên (máy tính, đang mở rộng): tài khoản, độ sáng, chế độ tối. */
function SidebarFooter({
  theme,
  onToggleTheme,
  brightness,
  onBrightness,
  onResetBrightness,
}: {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  brightness: number;
  onBrightness: (n: number) => void;
  onResetBrightness: () => void;
}) {
  const auth = useAuth();
  const name = useDisplayName();
  const sliderId = useId();
  const [bOpen, setBOpen] = useState(false);
  const iconBtn =
    'flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700';

  return (
    <div className="border-t border-slate-100 bg-slate-50/50 p-1.5 dark:border-slate-800/80 dark:bg-slate-800/30">
      {auth.enabled && !auth.loading && !auth.user && (
        <button
          onClick={() => auth.openAuth()}
          className="mb-1.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-primary-700 via-primary-600 to-[#705ceb] px-2 py-2 text-[11px] font-semibold text-white transition hover:brightness-110 dark:from-primary-600 dark:via-primary-600 dark:to-primary-500"
        >
          <LogIn className="h-3.5 w-3.5" />
          Đăng nhập để lưu tiến độ
        </button>
      )}
      <div className="relative flex items-center justify-between gap-1 rounded-xl border border-slate-200/60 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex min-w-0 items-center gap-1.5">
          <div className="relative shrink-0">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-tr from-primary-500 to-pink-500 text-[10px] font-bold text-white">
              {initials(name)}
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full border border-white dark:border-slate-800 ${auth.user ? 'bg-success-500' : 'bg-slate-300'}`}
              aria-hidden="true"
            />
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-[10.5px] font-bold leading-tight text-slate-900 dark:text-white">{name ?? 'Khách'}</h4>
            <span className={`block truncate text-[10px] font-medium leading-tight ${auth.user ? 'text-success-600 dark:text-success-400' : 'text-slate-500'}`}>
              {auth.user ? 'Online' : 'Lưu trên máy'}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center">
          <button onClick={() => setBOpen((v) => !v)} className={iconBtn} aria-label="Độ sáng" aria-expanded={bOpen} title={`Độ sáng ${brightness}%`}>
            <SunMedium className="h-3.5 w-3.5" />
          </button>
          <button onClick={onToggleTheme} className={iconBtn} role="switch" aria-checked={theme === 'dark'} aria-label="Đổi giao diện sáng/tối" title="Đổi giao diện sáng/tối">
            {theme === 'light' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5 text-amber-400" />}
          </button>
        </div>
        {bOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setBOpen(false)} aria-hidden="true" />
            <div className="absolute bottom-full left-0 z-50 mb-2 w-52 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <label htmlFor={sliderId} className="flex items-center gap-2">
                  <SunMedium className="h-3.5 w-3.5" />
                  Độ sáng
                </label>
                <span className="flex items-center gap-2">
                  <span className="tabular-nums text-slate-500">{brightness}%</span>
                  {brightness !== BRIGHTNESS_DEFAULT && (
                    <button onClick={onResetBrightness} className="rounded-md px-1.5 py-0.5 text-[11px] font-medium text-primary-700 hover:bg-primary-100/70 dark:text-primary-300 dark:hover:bg-slate-800">
                      Đặt lại
                    </button>
                  )}
                </span>
              </div>
              <input
                id={sliderId}
                type="range"
                min={BRIGHTNESS_MIN}
                max={BRIGHTNESS_MAX}
                step={1}
                value={brightness}
                onChange={(e) => onBrightness(Number(e.target.value))}
                onDoubleClick={onResetBrightness}
                aria-valuetext={`${brightness} phần trăm`}
                className="mt-2 h-2 w-full cursor-pointer accent-primary-600"
              />
            </div>
          </>
        )}
      </div>
      {auth.user && (
        <button
          onClick={() => void auth.signOut()}
          className="mt-1 flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <LogOut className="h-3 w-3" />
          Đăng xuất
        </button>
      )}
    </div>
  );
}

export function Sidebar({ current, onNavigate, theme, onToggleTheme, brightness, onBrightness, onResetBrightness, open, onToggleOpen }: SidebarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const { due } = useVocabStats();

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

      {/* Thanh bên (máy tính): gọn, thu gọn còn cột biểu tượng kèm tooltip */}
      <aside
        className={`fixed left-0 top-0 z-30 hidden h-screen flex-col justify-between border-r border-slate-200/80 bg-white transition-[width] duration-300 dark:border-slate-800 dark:bg-paper-sidedark lg:flex ${open ? 'w-44' : 'w-16'}`}
      >
        <div className={`flex min-h-0 flex-1 flex-col p-2 ${open ? 'overflow-y-auto overflow-x-hidden scrollbar-thin' : ''}`}>
          {open ? (
            <div className="mb-4 flex items-center justify-between px-1 pt-1">
              <Logo />
              <button
                onClick={onToggleOpen}
                className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-800"
                aria-label="Thu gọn thanh bên"
                title="Thu gọn thanh bên"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="mb-3 flex flex-col items-center gap-2 pt-1">
              <Logo compact />
              <button
                onClick={onToggleOpen}
                className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-800"
                aria-label="Mở rộng thanh bên"
                title="Mở rộng thanh bên"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <nav className="flex flex-col gap-3.5" aria-label="Điều hướng chính">
            {SECTIONS.map((sec, i) => (
              <div key={sec.id}>
                {open ? (
                  <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">{sec.title}</span>
                ) : (
                  i > 0 && <div className="mx-2 mb-2 border-t border-slate-100 dark:border-slate-800" />
                )}
                <ul className="mt-1 space-y-0.5">
                  {navItems
                    .filter((item) => item.section === sec.id)
                    .map((item) => {
                      const Icon = item.icon;
                      const active = current === item.key;
                      const badge = item.key === 'flashcards' ? due : 0;
                      const tip = badge > 0 ? `${item.label} (${badge})` : item.label;
                      return (
                        <li key={item.key}>
                          <button
                            onClick={() => onNavigate(item.key)}
                            aria-current={active ? 'page' : undefined}
                            aria-label={open ? undefined : tip}
                            className={`group relative flex w-full items-center rounded-lg px-2 py-1.5 text-xs transition-colors ${open ? 'gap-2' : 'justify-center'} ${
                              active
                                ? 'bg-primary-100 font-semibold text-primary-700 dark:bg-primary-950/60 dark:text-primary-200'
                                : 'font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
                            }`}
                          >
                            <Icon
                              className={`h-4 w-4 shrink-0 ${active ? '' : 'text-slate-400 group-hover:text-primary-500'}`}
                            />
                            {open && <span className="truncate">{item.label}</span>}
                            {badge > 0 &&
                              (open ? (
                                <span className="ml-auto rounded-full bg-primary-100 px-1.5 py-0.5 text-[10px] font-bold leading-none tabular-nums text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                                  {badge > 999 ? '999+' : badge}
                                </span>
                              ) : (
                                <span className="absolute right-1.5 top-1 h-2 w-2 rounded-full bg-primary-500" aria-hidden="true" />
                              ))}
                            {!open && (
                              <span
                                role="tooltip"
                                className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                              >
                                {tip}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        {open ? (
          <SidebarFooter
            theme={theme}
            onToggleTheme={onToggleTheme}
            brightness={brightness}
            onBrightness={onBrightness}
            onResetBrightness={onResetBrightness}
          />
        ) : (
          <div className="border-t border-slate-100 p-2 pb-3 dark:border-slate-800/80">
            <SettingsPanel
              theme={theme}
              onToggleTheme={onToggleTheme}
              brightness={brightness}
              onBrightness={onBrightness}
              onResetBrightness={onResetBrightness}
              onOpenVoice={() => setVoiceOpen(true)}
              compact
            />
          </div>
        )}
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
              brightness={brightness}
              onBrightness={onBrightness}
              onResetBrightness={onResetBrightness}
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
