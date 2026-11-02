// Chạy sớm (trước khi vẽ trang) để không bị nháy sáng. Là file riêng thay vì <script> viết thẳng trong index.html
// để CSP không cần cho phép script inline ('unsafe-inline'). Giữ logic khớp với src/hooks/useTheme.ts và useBrightness.ts.
try {
  var t = localStorage.getItem('theme');
  if (t === 'dark' || (t !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
} catch (e) {}
try {
  var b = Number(localStorage.getItem('flex_brightness'));
  if (b >= 60 && b <= 130 && b !== 100) document.documentElement.style.filter = 'brightness(' + b / 100 + ')';
} catch (e) {}
