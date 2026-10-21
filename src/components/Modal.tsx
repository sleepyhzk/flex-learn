import { useEffect, useRef } from 'react';

/**
 * Hộp thoại phủ toàn màn hình: nền mờ, khóa cuộn trang phía sau, Esc để đóng, trả tiêu điểm về nút đã mở.
 * `dismissible = false`: chỉ đóng bằng nút bên trong (dùng cho bài đang làm dở, tránh bấm nhầm ra ngoài).
 */
export function Modal({
  onClose,
  dismissible = true,
  labelledBy,
  size = 'max-w-lg',
  children,
}: {
  onClose?: () => void;
  dismissible?: boolean;
  labelledBy?: string;
  size?: string;
  children: React.ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    box.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, []);

  useEffect(() => {
    if (!dismissible || !onClose) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dismissible, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (dismissible && onClose && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={box}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl outline-none dark:border-slate-800 dark:bg-slate-900 ${size}`}
      >
        {children}
      </div>
    </div>
  );
}
