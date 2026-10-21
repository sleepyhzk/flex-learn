import { useEffect, useState, useSyncExternalStore } from 'react';
import { Bell, CalendarDays, Volume2, VolumeX } from 'lucide-react';
import { getSpeechSettings, listEnglishVoices, onVoicesChanged } from '@/lib/speech';
import { isSfxOn, setSfxOn, sfx, subscribeSfx } from '@/lib/sfx';
import { useVocabStats } from '@/hooks/useVocabStats';
import { VoiceSettings } from './VoiceSettings';
import type { ViewKey } from './Sidebar';

const WEEKDAY = ['CHỦ NHẬT', 'THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU', 'THỨ BẢY'];

/** Nhãn ngắn của giọng đang dùng, vd "US - Aria". */
function voiceLabel(): string {
  const ranked = listEnglishVoices();
  const { voiceURI } = getSpeechSettings();
  const v = (voiceURI ? ranked.find((r) => r.voice.voiceURI === voiceURI) : undefined) ?? ranked[0];
  if (!v) return 'Mặc định';
  const region = v.voice.lang.replace('_', '-').split('-')[1]?.toUpperCase() ?? 'EN';
  const short =
    v.voice.name
      .replace(/^(Microsoft|Google)\s+/i, '')
      .replace(/\(.*?\)/g, '')
      .replace(/\bonline\b/gi, '')
      .replace(/\b(US|UK|English|United States|United Kingdom)\b/gi, '')
      .replace(/[-–]/g, ' ')
      .trim()
      .split(/\s+/)[0] || 'Mặc định';
  return `${region} - ${short}`;
}

/** Thanh trên (chỉ máy tính): ngày hôm nay và giọng đọc. */
export function TopBar({ onNavigate }: { onNavigate: (view: ViewKey) => void }) {
  const { due } = useVocabStats();
  const sfxOn = useSyncExternalStore(subscribeSfx, isSfxOn);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [label, setLabel] = useState(voiceLabel);
  useEffect(() => onVoicesChanged(() => setLabel(voiceLabel())), []);

  const now = new Date();
  const dateText = `${WEEKDAY[now.getDay()]}, ${now.getDate()} THÁNG ${now.getMonth() + 1}`;

  return (
    <>
      <header className="sticky top-0 z-20 hidden items-center justify-between border-b border-slate-200/60 bg-white/70 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-paper-dark/70 lg:flex lg:px-10">
        <span className="flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">
          <CalendarDays className="h-3.5 w-3.5" />
          {dateText}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setVoiceOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-slate-100 px-3 py-1.5 text-xs text-slate-500 transition-colors hover:bg-primary-100 hover:text-primary-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Volume2 className="h-3.5 w-3.5 text-primary-500" />
            <span>
              Giọng đọc: <b>{label}</b>
            </span>
          </button>
          <button
            onClick={() => {
              setSfxOn(!sfxOn);
              if (!sfxOn) window.setTimeout(sfx.chime, 0);
            }}
            role="switch"
            aria-checked={sfxOn}
            aria-label="Âm thanh hiệu ứng"
            title={sfxOn ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng'}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {sfxOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
          <button
            onClick={() => {
              sfx.chime();
              onNavigate('flashcards');
            }}
            aria-label={due > 0 ? `${due} thẻ cần ôn, mở Flashcard` : 'Mở Flashcard'}
            title={due > 0 ? `${due} thẻ cần ôn` : 'Flashcard'}
            className="relative rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <Bell className="h-5 w-5" />
            {due > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />}
          </button>
        </div>
      </header>
      <VoiceSettings
        open={voiceOpen}
        onClose={() => {
          setVoiceOpen(false);
          setLabel(voiceLabel());
        }}
      />
    </>
  );
}
