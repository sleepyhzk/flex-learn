/**
 * Phím tắt toàn cục (nghe ở `window`) không được nuốt phím mà người dùng đang gõ vào ô nhập,
 * hay phím trong hộp thoại (vd. form đăng nhập mở đè lên một trò chơi): nếu không, Backspace, Enter, số 1-4
 * hoặc các chữ cái sẽ vừa gõ vào ô vừa điều khiển bài học phía sau, và Enter không gửi được form đăng nhập.
 */
function targetOf(e: KeyboardEvent): HTMLElement | null {
  const t = e.target;
  return t instanceof HTMLElement ? t : null;
}

/** Phím đang gõ vào ô nhập / danh sách chọn / vùng soạn thảo, hoặc nằm trong hộp thoại. */
export function isTypingTarget(e: KeyboardEvent): boolean {
  const t = targetOf(e);
  return !!t && (t.isContentEditable || !!t.closest('input, textarea, select, [role="dialog"]'));
}

/** Phím nằm trong một hộp thoại (dùng cho view có ô nhập riêng, vẫn phải nhận phím ở ô đó). */
export function inDialog(e: KeyboardEvent): boolean {
  return !!targetOf(e)?.closest('[role="dialog"]');
}
