import { useEffect, useId, useState } from 'react';
import { Check, CheckCircle2, Circle, Eye, EyeOff, Loader2, X } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { useAuth } from '@/hooks/useAuth';
import type { AuthResult } from '@/hooks/useAuth';

type Mode = 'signin' | 'signup' | 'forgot' | 'recover';

/**
 * Thời hạn liên kết trong thư xác nhận / đặt lại mật khẩu, tính bằng phút, chỉ để hiển thị.
 * Phải khớp với Supabase: Authentication > Providers > Email > "Email OTP Expiration" (mặc định 3600 giây = 60 phút).
 * Muốn hiện 10 phút thì đặt thời hạn đó là 600 giây trong Supabase rồi sửa số này thành 10.
 */
const LINK_EXPIRY_MINUTES = 60;

const expiryText = (m: number) => (m >= 60 && m % 60 === 0 ? `${m / 60} giờ` : `${m} phút`);

/** Yêu cầu mật khẩu khi tạo tài khoản hoặc đặt mật khẩu mới. */
const PASSWORD_RULES: { key: string; label: string; test: (p: string) => boolean }[] = [
  { key: 'upper', label: 'Chữ hoa', test: (p) => /\p{Lu}/u.test(p) },
  { key: 'lower', label: 'Chữ thường', test: (p) => /\p{Ll}/u.test(p) },
  { key: 'digit', label: 'Chữ số', test: (p) => /\p{N}/u.test(p) },
  { key: 'special', label: 'Ký tự đặc biệt (vd. !?<>@#$%)', test: (p) => /[^\p{L}\p{N}\s]/u.test(p) },
  { key: 'length', label: 'Từ 8 ký tự trở lên', test: (p) => p.length >= 8 },
];

/** Email hợp lệ: có phần trước @, tên miền và đuôi (vd. .com). Chặt hơn kiểm tra mặc định của trình duyệt (vốn chấp nhận "a@b"). */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const fieldCls =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100';
const errorFieldCls = 'border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500/70';
const labelCls = 'mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

/** Ô nhập mật khẩu có nút mắt hiện/ẩn, kèm dòng báo lỗi bên dưới. */
function PasswordField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  autoComplete: string;
}) {
  const [shown, setShown] = useState(false);
  const errId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={shown ? 'text' : 'password'}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
          className={`${fieldCls} pr-14 ${error ? errorFieldCls : ''}`}
        />
        <button
          type="button"
          onClick={() => setShown((v) => !v)}
          aria-label={shown ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          aria-pressed={shown}
          title={shown ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
        >
          {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && (
        <p id={errId} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

/** Danh sách yêu cầu mật khẩu: đạt thì có dấu tích, chưa đạt thì vòng tròn rỗng. */
function PasswordChecklist({ password }: { password: string }) {
  return (
    <ul className="mt-3 space-y-1.5" aria-label="Yêu cầu mật khẩu">
      {PASSWORD_RULES.map((r) => {
        const ok = r.test(password);
        return (
          <li key={r.key} className={`flex items-center gap-2.5 text-sm ${ok ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
            {ok ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-slate-700 dark:text-slate-300" aria-hidden="true" />
            ) : (
              <Circle className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" aria-hidden="true" />
            )}
            {r.label}
            <span className="sr-only">{ok ? ' (đã đạt)' : ' (chưa đạt)'}</span>
          </li>
        );
      })}
    </ul>
  );
}

/** Khung xanh báo đã gửi thư. */
function SentNotice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div role="status" className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/40">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
        <Check className="h-4 w-4" strokeWidth={3} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{children}</p>
      </div>
    </div>
  );
}

export function AuthModal() {
  const auth = useAuth();
  const open = auth.modalOpen || auth.recovering;
  const emailId = useId();
  const passwordId = useId();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  /** Ô nào đã được chạm vào (rời khỏi ô hoặc bấm gửi) thì mới hiện lỗi của ô đó. */
  const [touched, setTouched] = useState({ email: false, password: false });
  /** Đã gửi thư (đăng ký hoặc đặt lại mật khẩu): thay form bằng khung xanh. */
  const [sent, setSent] = useState<{ kind: 'signup' | 'reset'; email: string } | null>(null);

  useEffect(() => {
    if (auth.recovering) setMode('recover');
  }, [auth.recovering]);

  useEffect(() => {
    if (!open) {
      setPassword('');
      setError('');
      setSent(null);
      setTouched({ email: false, password: false });
      setMode('signin');
    }
  }, [open]);

  if (!open || !auth.enabled) return null;

  const close = () => {
    if (!auth.recovering) auth.closeAuth();
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setError('');
    setSent(null);
    setTouched({ email: false, password: false });
  };

  const run = async (fn: () => Promise<AuthResult>, onOk?: (r: AuthResult) => void) => {
    setBusy(true);
    setError('');
    const r = await fn();
    setBusy(false);
    if (r.error) setError(r.error);
    else onOk?.(r);
  };

  const needsStrong = mode === 'signup' || mode === 'recover';
  const mailTrim = email.trim();
  const emailError =
    mode === 'recover'
    ? ''
    : mailTrim === ''
    ? 'Vui lòng nhập email.'
    : EMAIL_RE.test(mailTrim)
    ? ''
    : 'Vui lòng nhập email hợp lệ (ví dụ: ten@gmail.com).';
  const passwordError = mode === 'signin' && password === '' ? 'Vui lòng nhập mật khẩu.' : '';
  const shownEmailError = touched.email ? emailError : '';
  const shownPasswordError = touched.password ? passwordError : '';
  const strong = PASSWORD_RULES.every((r) => r.test(password));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const mail = email.trim();
   
    // Bấm gửi khi còn ô sai: hiện lỗi của mọi ô và đưa con trỏ về ô sai đầu tiên, không gọi máy chủ.
    setTouched({ email: true, password: true });
    if (emailError) return void document.getElementById(emailId)?.focus();
    if (passwordError) return void document.getElementById(passwordId)?.focus();
    if (needsStrong && !strong) return setError('Mật khẩu chưa đáp ứng đủ các yêu cầu bên dưới.');
    if (mode === 'signin') {
      void run(() => auth.signIn(mail, password));
    } else if (mode === 'signup') {
      void run(
        () => auth.signUp(mail, password),
        (r) => {
          if (r.mailSent) setSent({ kind: 'signup', email: mail });
        }
      );
    } else if (mode === 'forgot') {
      void run(
        () => auth.sendReset(mail),
        () => setSent({ kind: 'reset', email: mail })
      );
    } else {
      void run(() => auth.setNewPassword(password), () => auth.closeAuth());
    }
  };

  const title = mode === 'signin' ? 'Đăng nhập' : mode === 'signup' ? 'Bắt đầu' : mode === 'forgot' ? 'Quên mật khẩu' : 'Đặt mật khẩu mới';
  const subtitle =
    mode === 'signup'
      ? 'Tạo tài khoản mới'
      : mode === 'recover'
      ? 'Nhập mật khẩu mới cho tài khoản của bạn.'
      : mode === 'forgot'
      ? 'Nhập email, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.'
      : 'Đăng nhập để tiến độ học và dấu sao được lưu lại, dùng được trên mọi thiết bị.';
  const submitLabel = mode === 'signin' ? 'Đăng nhập' : mode === 'signup' ? 'Tạo tài khoản' : mode === 'forgot' ? 'Gửi liên kết' : 'Lưu mật khẩu';
  const showEmail = mode !== 'recover';
  const showPassword = mode !== 'forgot';
  const disabled = busy || (needsStrong && !strong);

  return (
    <Modal onClose={close} dismissible={!auth.recovering} labelledBy="auth-title" size="max-w-md">
      <div className="overflow-y-auto p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="auth-title" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h2>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
          {!auth.recovering && (
            <button
              onClick={close}
              className="-mr-2 -mt-1 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Đóng"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {sent ? (
          <div className="mt-6">
            <SentNotice title="Kiểm tra email của bạn">
              {sent.kind === 'signup'
                ? `Chúng tôi đã gửi liên kết hoàn tất đăng ký tới ${sent.email}. `
                : `Chúng tôi đã gửi liên kết đặt lại mật khẩu tới ${sent.email}. `}
              Liên kết hết hạn sau {expiryText(LINK_EXPIRY_MINUTES)}. Nếu không thấy thư, hãy kiểm tra cả mục Spam.
            </SentNotice>
            <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
              {sent.kind === 'signup' ? 'Đã có tài khoản? ' : 'Nhớ lại mật khẩu rồi? '}
              <button onClick={() => switchMode('signin')} className="font-semibold text-slate-900 underline underline-offset-2 hover:text-primary-700 dark:text-white dark:hover:text-primary-300">
                Đăng nhập
              </button>
            </p>
          </div>
        ) : (
          <>
            {(mode === 'signin' || mode === 'signup') && (
              <div className="mt-6">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void run(auth.signInWithGoogle)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <GoogleIcon />
                  Tiếp tục với Google
                </button>
                <div className="my-5 flex items-center gap-3 text-xs text-slate-500">
                  <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                  hoặc dùng email
                  <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            )}

            <form onSubmit={submit} noValidate className={`space-y-5 ${mode === 'signin' || mode === 'signup' ? '' : 'mt-6'}`}>
              {showEmail && (
                <div>
                  <label htmlFor={emailId} className={labelCls}>
                    Email
                  </label>
                  <input
                    id={emailId}
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    aria-invalid={shownEmailError ? true : undefined}
                    aria-describedby={shownEmailError ? `${emailId}-error` : undefined}
                    className={`${fieldCls} ${shownEmailError ? errorFieldCls : ''}`}
                  />
                  {shownEmailError && (
                    <p id={`${emailId}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                      {shownEmailError}
                    </p>
                  )}
                </div>
              )}
              {showPassword && (
                <div>
                  <PasswordField
                    id={passwordId}
                    label={mode === 'recover' ? 'Mật khẩu mới' : 'Mật khẩu'}
                    value={password}
                    onChange={(v) => {
                      setPassword(v);
                      setError('');
                    }}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    error={shownPasswordError}
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  />
                  {needsStrong && <PasswordChecklist password={password} />}
                </div>
              )}

              {error && (
                <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={disabled}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitLabel}
              </button>
            </form>

            <div className="mt-5 text-sm">
              {mode === 'signin' && (
                <div className="flex items-center justify-between">
                  <button onClick={() => switchMode('forgot')} className="text-slate-500 hover:underline dark:text-slate-400">
                    Quên mật khẩu?
                  </button>
                  <button onClick={() => switchMode('signup')} className="font-semibold text-primary-700 hover:underline dark:text-primary-300">
                    Tạo tài khoản
                  </button>
                </div>
              )}
              {mode === 'signup' && (
                <p className="text-center text-slate-600 dark:text-slate-300">
                  Đã có tài khoản?{' '}
                  <button onClick={() => switchMode('signin')} className="font-semibold text-slate-900 underline underline-offset-2 hover:text-primary-700 dark:text-white dark:hover:text-primary-300">
                    Đăng nhập
                  </button>
                </p>
              )}
              {mode === 'forgot' && (
                <button onClick={() => switchMode('signin')} className="font-semibold text-primary-700 hover:underline dark:text-primary-300">
                  ← Quay lại đăng nhập
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
