/** Khung tiêu đề đầu trang (thẻ trắng: ô biểu tượng, tiêu đề, mô tả, phần phụ bên phải). Dùng cho Trò chơi và Kiểm tra. */
export function PageHeader({
  icon: Icon,
  title,
  description,
  eyebrow,
  aside,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: React.ReactNode;
  eyebrow?: { icon: React.ComponentType<{ className?: string }>; text: string };
  aside?: React.ReactNode;
}) {
  const Eyebrow = eyebrow?.icon;
  return (
    <header className="flex flex-col justify-between gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 sm:p-6 lg:flex-row lg:items-center">
      <div className="max-w-xl space-y-2">
        {eyebrow && Eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-lg bg-primary-50 px-2.5 py-1 text-[11px] font-bold text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">
            <Eyebrow className="h-3.5 w-3.5" />
            {eyebrow.text}
          </span>
        )}
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 shadow-sm dark:bg-primary-950/80 dark:text-primary-300">
            <Icon className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-[26px]">{title}</h1>
        </div>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:text-[13px]">{description}</p>
      </div>
      {aside}
    </header>
  );
}
