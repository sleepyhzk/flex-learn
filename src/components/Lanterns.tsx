/**
 * Dây đèn lồng treo ở mép trên màn hình (chỉ máy tính, nằm sau nội dung).
 * Khối lặp rộng 118px: một đoạn dây hơi võng và một đèn lồng cùng cỡ.
 * Màu lấy từ biến CSS --ln-* (index.css) nên chế độ sáng là đèn san hô, chế độ tối là đèn đỏ.
 */
export function Lanterns() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="100%"
      height="92"
      className="pointer-events-none fixed inset-x-0 top-0 -z-10 hidden select-none lg:block"
    >
      <defs>
        <radialGradient id="lantern-body" cx="40%" cy="35%" r="75%">
          <stop offset="0%" style={{ stopColor: 'var(--ln-1)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--ln-2)' }} />
        </radialGradient>
        <g id="lantern">
          <rect x="-9" y="0" width="18" height="5" rx="2" style={{ fill: 'var(--ln-cap)' }} />
          <ellipse cx="0" cy="24" rx="19" ry="19" fill="url(#lantern-body)" />
          <ellipse cx="0" cy="24" rx="9" ry="19" fill="none" style={{ stroke: 'var(--ln-rib)' }} strokeOpacity="0.35" />
          <line x1="0" y1="5" x2="0" y2="43" style={{ stroke: 'var(--ln-rib)' }} strokeOpacity="0.3" />
          <rect x="-9" y="43" width="18" height="5" rx="2" style={{ fill: 'var(--ln-cap)' }} />
          <line x1="0" y1="48" x2="0" y2="58" style={{ stroke: 'var(--ln-cap)' }} strokeWidth="1.5" />
          <ellipse cx="0" cy="60" rx="2.5" ry="3" style={{ fill: 'var(--ln-cap)' }} />
          <path d="M-3 62 L-4 72 M0 63 L0 74 M3 62 L4 72" style={{ stroke: 'var(--ln-tassel)' }} strokeWidth="1.2" fill="none" />
        </g>
        <pattern id="lantern-tile" x="0" y="0" width="118.5" height="92" patternUnits="userSpaceOnUse">
          <path d="M0 2 Q59.25 9 118.5 2" fill="none" style={{ stroke: 'var(--ln-cord)' }} strokeWidth="1.5" />
          <line x1="59.25" y1="5.5" x2="59.25" y2="14" style={{ stroke: 'var(--ln-cord)' }} strokeWidth="1.2" />
          <use href="#lantern" x="59.25" y="14" />
        </pattern>
      </defs>
      <rect width="100%" height="92" fill="url(#lantern-tile)" />
    </svg>
  );
}
