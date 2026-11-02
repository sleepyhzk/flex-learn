import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

/**
 * Bắt lỗi khi vẽ giao diện: thay vì trắng trang, hiện thông báo và cho tải lại.
 * Tiến độ học nằm trong localStorage và trên cloud nên tải lại không mất dữ liệu.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Flex Learn: lỗi giao diện', error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Có lỗi xảy ra</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Tiến độ học của bạn vẫn được giữ nguyên. Hãy tải lại trang để tiếp tục.</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Tải lại trang
        </button>
      </div>
    );
  }
}
