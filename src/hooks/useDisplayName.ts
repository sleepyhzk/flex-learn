import { useAuth } from '@/hooks/useAuth';

/** Tên hiển thị của người dùng đã đăng nhập (họ tên Google, hoặc phần trước @ của email). null nếu chưa đăng nhập. */
export function useDisplayName(): string | null {
  const { user } = useAuth();
  if (!user) return null;
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  for (const k of ['full_name', 'name']) {
    const v = meta[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return user.email ? user.email.split('@')[0] : null;
}
