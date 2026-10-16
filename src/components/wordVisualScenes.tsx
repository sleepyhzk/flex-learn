import type { ReactNode } from 'react';

/**
 * Hình minh họa động cho nghĩa của từ (hiện ở thẻ Flashcard khi bấm "Xem nghĩa").
 *
 * Mỗi hình là một cảnh SVG khung 160 x 110, chuyển động bằng SMIL (animate / animateTransform)
 * nên không cần thêm CSS hay thư viện. Nét vẽ dùng `currentColor` (đổi theo chế độ sáng/tối),
 * các màu đồ vật (mặt trời, nước, lửa...) là màu cố định.
 *
 * Khóa của bảng SCENES là `từ|loại từ`, giống file senses.ts. Muốn thêm hình cho một từ:
 * thêm một dòng vào bảng SCENES ở cuối file, dùng các khối dựng sẵn (Swing, Slide, Pulse, Spin, Fall, Stick).
 */

const INK = 'currentColor';
const SKIN = '#f5cfa0';
const SUN = '#f6b93b';
const WATER = '#6fb1e6';
const LEAF = '#62b36f';
const RED = '#e5655c';
const CLOUD = '#cfd9e6';
const WOOD = '#b98457';
const FACE = '#f9d776';
const MOUTH = '#8b2f3a';

type Kids = { children?: ReactNode };
type Num = number | string;

const FOREVER = 'indefinite';
// Chuyển động mượt vào-ra: có 3 mốc giá trị (a -> b -> a)
const SPLINE = { calcMode: 'spline', keyTimes: '0;.5;1', keySplines: '.45 0 .55 1;.45 0 .55 1' } as const;
const HOLD = { calcMode: 'spline', keyTimes: '0;.3;.7;1', keySplines: '.45 0 .55 1;0 0 1 1;.45 0 .55 1' } as const;

/** Quay qua lại quanh điểm (cx, cy). Góc dương = quay theo chiều kim đồng hồ. */
function Swing({ cx, cy, a, b, dur = 1, begin = 0, children }: { cx: number; cy: number; a: number; b: number; dur?: number; begin?: number } & Kids) {
  return (
    <g>
      <animateTransform
        attributeName="transform"
        type="rotate"
        values={`${a} ${cx} ${cy};${b} ${cx} ${cy};${a} ${cx} ${cy}`}
        dur={`${dur}s`}
        begin={`${begin}s`}
        repeatCount={FOREVER}
        {...SPLINE}
      />
      {children}
    </g>
  );
}

/** Tịnh tiến qua lại 0 -> (dx, dy) -> 0. */
function Slide({ dx = 0, dy = 0, dur = 2, begin = 0, children }: { dx?: number; dy?: number; dur?: number; begin?: number } & Kids) {
  return (
    <g>
      <animateTransform
        attributeName="transform"
        type="translate"
        values={`0 0;${dx} ${dy};0 0`}
        dur={`${dur}s`}
        begin={`${begin}s`}
        repeatCount={FOREVER}
        {...SPLINE}
      />
      {children}
    </g>
  );
}

/** Phóng to / thu nhỏ quanh tâm (cx, cy). from/to có thể là "sx sy". hold = dừng lại ở hai đầu. */
function Pulse({ cx, cy, from = 1, to = 1.15, dur = 1, begin = 0, hold = false, children }: { cx: number; cy: number; from?: Num; to?: Num; dur?: number; begin?: number; hold?: boolean } & Kids) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <g>
        <animateTransform
          attributeName="transform"
          type="scale"
          values={hold ? `${from};${to};${to};${from}` : `${from};${to};${from}`}
          dur={`${dur}s`}
          begin={`${begin}s`}
          repeatCount={FOREVER}
          {...(hold ? HOLD : SPLINE)}
        />
        <g transform={`translate(${-cx} ${-cy})`}>{children}</g>
      </g>
    </g>
  );
}

/** Quay tròn liên tục quanh (cx, cy). */
function Spin({ cx, cy, dur = 4, reverse = false, children }: { cx: number; cy: number; dur?: number; reverse?: boolean } & Kids) {
  return (
    <g>
      <animateTransform
        attributeName="transform"
        type="rotate"
        from={`${reverse ? 360 : 0} ${cx} ${cy}`}
        to={`${reverse ? 0 : 360} ${cx} ${cy}`}
        dur={`${dur}s`}
        repeatCount={FOREVER}
      />
      {children}
    </g>
  );
}

/** Trôi từ vị trí gốc đến (dx, dy), hiện dần rồi mờ đi, lặp lại. begin âm = lệch pha để khỏi trống lúc đầu. */
function Fall({ dx = 0, dy = 0, dur = 2, begin = 0, children }: { dx?: number; dy?: number; dur?: number; begin?: number } & Kids) {
  return (
    <g opacity="0">
      <animateTransform attributeName="transform" type="translate" from="0 0" to={`${dx} ${dy}`} dur={`${dur}s`} begin={`${begin}s`} repeatCount={FOREVER} />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.7;1" dur={`${dur}s`} begin={`${begin}s`} repeatCount={FOREVER} />
      {children}
    </g>
  );
}

const Ground = ({ y = 96 }: { y?: number }) => <line x1="18" y1={y} x2="142" y2={y} opacity=".3" />;

/** Mặt đất chạy lùi về sau (cảm giác đang chạy / đi). */
const MovingGround = ({ dur = 0.5 }: { dur?: number }) => (
  <line x1="14" y1="96" x2="146" y2="96" strokeDasharray="8 8" opacity=".35">
    <animate attributeName="stroke-dashoffset" from="0" to="16" dur={`${dur}s`} repeatCount={FOREVER} />
  </line>
);

const Cloud = ({ x = 0, y = 0, s = 1, fill = CLOUD }: { x?: number; y?: number; s?: number; fill?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill} stroke="none">
    <circle cx="-18" cy="4" r="13" />
    <circle cx="2" cy="-4" r="17" />
    <circle cx="22" cy="5" r="12" />
    <rect x="-31" y="4" width="64" height="13" rx="6.5" />
  </g>
);

const Sparkle = ({ x, y, r = 7, fill = SUN }: { x: number; y: number; r?: number; fill?: string }) => (
  <polygon
    fill={fill}
    stroke="none"
    points={`${x},${y - r} ${x + r * 0.28},${y - r * 0.28} ${x + r},${y} ${x + r * 0.28},${y + r * 0.28} ${x},${y + r} ${x - r * 0.28},${y + r * 0.28} ${x - r},${y} ${x - r * 0.28},${y - r * 0.28}`}
  />
);

const starPoints = (cx: number, cy: number, R: number, r: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const t = (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? R : r;
    return `${(cx + Math.cos(t) * rad).toFixed(1)},${(cy + Math.sin(t) * rad).toFixed(1)}`;
  }).join(' ');

const HEART = 'M80 88 C28 54 46 18 80 44 C114 18 132 54 80 88 Z';
const Heart = ({ x, y, s, fill = RED }: { x: number; y: number; s: number; fill?: string }) => (
  <path d={HEART} fill={fill} stroke="none" transform={`translate(${x} ${y}) scale(${s}) translate(-80 -58)`} />
);

const Note = ({ x, y, ch = '♪', size = 18 }: { x: number; y: number; ch?: string; size?: number }) => (
  <text x={x} y={y} fontSize={size} fontWeight="700" fill={INK} stroke="none">
    {ch}
  </text>
);

// ---------- Người que ----------
// Gốc tọa độ ở hông. Góc chi = 0 là thõng xuống, dương = quay theo chiều kim đồng hồ
// (thõng xuống -> sang trái -> giơ lên), âm = ra phía trước khi người quay mặt sang phải.
type Limb = number | { a: number; b: number; dur?: number; begin?: number };

function LimbLine({ py, len, v }: { py: number; len: number; v: Limb }) {
  if (typeof v === 'number') return <line x1="0" y1={py} x2="0" y2={py + len} transform={`rotate(${v} 0 ${py})`} />;
  return (
    <Swing cx={0} cy={py} a={v.a} b={v.b} dur={v.dur} begin={v.begin}>
      <line x1="0" y1={py} x2="0" y2={py + len} />
    </Swing>
  );
}

function Stick({ armL = 8, armR = -8, legL = 6, legR = -6, lean = 0, face = 1 }: { armL?: Limb; armR?: Limb; legL?: Limb; legR?: Limb; lean?: number; face?: 1 | -1 }) {
  return (
    <g>
      <LimbLine py={0} len={28} v={legL} />
      <LimbLine py={0} len={28} v={legR} />
      <g transform={`rotate(${lean} 0 0)`}>
        <line x1="0" y1="-27" x2="0" y2="0" />
        <circle cx="0" cy="-36" r="9" fill={SKIN} />
        <circle cx={3.5 * face} cy="-37" r="1.4" fill={INK} stroke="none" />
        <LimbLine py={-22} len={22} v={armL} />
        <LimbLine py={-22} len={22} v={armR} />
      </g>
    </g>
  );
}

// ---------- Khuôn mặt ----------
function FaceBase({ fill = FACE, children }: { fill?: string } & Kids) {
  return (
    <g>
      <circle cx="80" cy="54" r="32" fill={fill} />
      {children}
    </g>
  );
}
const DotEyes = ({ y = 48 }: { y?: number }) => (
  <g fill={INK} stroke="none">
    <circle cx="68" cy={y} r="3.5" />
    <circle cx="92" cy={y} r="3.5" />
  </g>
);
const HappyEyes = () => (
  <g>
    <path d="M61 51 q7 -9 14 0" />
    <path d="M85 51 q7 -9 14 0" />
  </g>
);
const Tear = ({ x, y, begin = 0, dy = 30, dur = 1.2 }: { x: number; y: number; begin?: number; dy?: number; dur?: number }) => (
  <Fall dy={dy} dur={dur} begin={begin}>
    <path d={`M${x} ${y} q4 6 0 9 q-4 -3 0 -9 Z`} fill={WATER} stroke="none" />
  </Fall>
);

// ---------- Cảnh dựng sẵn dùng lại ----------
function Door({ opening }: { opening: boolean }) {
  return (
    <g>
      <rect x="53" y="17" width="54" height="79" fill="#ffe7a8" stroke="none" />
      <Pulse cx={53} cy={0} from={opening ? '1 1' : '.15 1'} to={opening ? '.15 1' : '1 1'} dur={4} hold>
        <rect x="53" y="17" width="54" height="79" className="fill-primary-300" strokeWidth="2.5" />
        <rect x="60" y="26" width="40" height="26" rx="2" strokeWidth="2" opacity=".55" />
        <circle cx="98" cy="62" r="3.2" fill={SUN} stroke="none" />
      </Pulse>
      <rect x="50" y="14" width="60" height="82" rx="2" />
      <Ground />
    </g>
  );
}

function Car({ wheel = 0.5, bob = 0.2, lines = false }: { wheel?: number; bob?: number; lines?: boolean }) {
  const hub = (cx: number) => (
    <Spin cx={cx} cy={76} dur={wheel}>
      <line x1={cx} y1="70" x2={cx} y2="82" stroke="#f4eadb" strokeWidth="2" />
      <line x1={cx - 6} y1="76" x2={cx + 6} y2="76" stroke="#f4eadb" strokeWidth="2" />
    </Spin>
  );
  return (
    <g>
      <MovingGround dur={wheel * 1.2} />
      {lines &&
        [50, 61, 72].map((y, i) => (
          <Fall key={y} dx={-34} dur={0.55} begin={-i * 0.18}>
            <line x1="32" y1={y} x2="46" y2={y} opacity=".6" />
          </Fall>
        ))}
      <Slide dy={-1.6} dur={bob}>
        <path d="M34 72 V62 Q34 56 40 56 H58 L70 40 H104 L116 56 H124 Q128 56 128 62 V72 Z" fill={RED} strokeWidth="2.5" />
        <path d="M63 56 L71 43 H84 V56 Z M89 56 V43 H102 L110 56 Z" fill="#cfe6f7" strokeWidth="2" />
        <circle cx="56" cy="76" r="10" fill={INK} />
        <circle cx="106" cy="76" r="10" fill={INK} />
        {hub(56)}
        {hub(106)}
      </Slide>
    </g>
  );
}

function Thermo({ hot }: { hot: boolean }) {
  const color = hot ? RED : WATER;
  const t = { calcMode: 'spline', keyTimes: '0;.5;1', keySplines: '.45 0 .55 1;.45 0 .55 1' } as const;
  const body = (
    <g>
      <rect x="72" y="14" width="16" height="64" rx="8" strokeWidth="3" />
      <circle cx="80" cy="84" r="13" fill={color} strokeWidth="3" />
      <rect x="76" y="46" width="8" height="38" fill={color} stroke="none">
        <animate attributeName="y" values={hot ? '60;24;60' : '44;66;44'} dur="3s" repeatCount={FOREVER} {...t} />
        <animate attributeName="height" values={hot ? '24;60;24' : '40;18;40'} dur="3s" repeatCount={FOREVER} {...t} />
      </rect>
      {[26, 36, 46, 56, 66].map((y) => (
        <line key={y} x1="94" y1={y} x2={y % 20 === 6 ? 102 : 99} y2={y} strokeWidth="2" opacity=".5" />
      ))}
    </g>
  );
  if (hot) {
    return (
      <g>
        {body}
        {[40, 120, 30].map((x, i) => (
          <Fall key={i} dy={-24} dur={1.6} begin={-i * 0.55}>
            <path d={`M${x} ${74 - i * 6} q5 -6 0 -12 t0 -12`} stroke={RED} strokeWidth="3" />
          </Fall>
        ))}
        <Pulse cx={124} cy={26} from={0.8} to={1.15} dur={1.6}>
          <circle cx="124" cy="26" r="9" fill={SUN} stroke="none" />
        </Pulse>
      </g>
    );
  }
  const flake = (x: number, y: number, i: number) => (
    <Fall key={i} dx={-4} dy={34} dur={2.4} begin={-i * 0.6}>
      <g transform={`translate(${x} ${y})`} stroke="#7fb3e6" strokeWidth="2">
        <line x1="-5" y1="0" x2="5" y2="0" />
        <line x1="-2.5" y1="-4.3" x2="2.5" y2="4.3" />
        <line x1="-2.5" y1="4.3" x2="2.5" y2="-4.3" />
      </g>
    </Fall>
  );
  return (
    <g>
      <Slide dx={1.6} dur={0.16}>
        {body}
      </Slide>
      {[flake(38, 22, 0), flake(122, 34, 1), flake(50, 52, 2), flake(112, 14, 3)]}
    </g>
  );
}

function Resize({ grow }: { grow: boolean }) {
  return (
    <g>
      <Pulse cx={80} cy={54} from={grow ? 0.3 : 1.2} to={grow ? 1.2 : 0.3} dur={3} hold>
        <circle cx="80" cy="54" r="24" className="fill-primary-300" strokeWidth="2.5" />
      </Pulse>
      {[45, 135, 225, 315].map((a) => {
        const r = (a * Math.PI) / 180;
        const x = 80 + Math.sin(r) * 46;
        const y = 54 - Math.cos(r) * 40;
        const k = grow ? 1 : -1;
        return (
          <g key={a} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
            <Slide dx={Math.sin(r) * 8 * k} dy={-Math.cos(r) * 8 * k} dur={1.5}>
              <polygon points="0,-6 -5,4 5,4" transform={`rotate(${grow ? a : a + 180})`} fill={INK} stroke="none" />
            </Slide>
          </g>
        );
      })}
    </g>
  );
}

function UpDown({ up }: { up: boolean }) {
  const k = up ? -1 : 1;
  return (
    <g>
      <Ground />
      <Slide dy={k * 56} dur={1.8}>
        <circle cx="62" cy={up ? 82 : 26} r="11" className="fill-primary-400" strokeWidth="2.5" />
      </Slide>
      {[0, 1, 2].map((i) => (
        <Fall key={i} dy={k * 22} dur={1.5} begin={-i * 0.5}>
          <path d={up ? 'M108 62 l10 -10 l10 10' : 'M108 46 l10 10 l10 -10'} strokeWidth="4" />
        </Fall>
      ))}
    </g>
  );
}

function SitStand({ target }: { target: 'sit' | 'stand' }) {
  const sit = target === 'sit';
  const fade = (visibleFirst: boolean) => ({
    values: visibleFirst ? '1;1;0;0' : '0;0;1;1',
    keyTimes: '0;.35;.45;1',
  });
  const standing = (
    <g>
      <animate attributeName="opacity" {...fade(sit)} dur="4s" repeatCount={FOREVER} />
      <g transform="translate(76 66)">
        <Stick armL={14} armR={-14} legL={7} legR={-7} />
      </g>
    </g>
  );
  const sitting = (
    <g>
      <animate attributeName="opacity" {...fade(!sit)} dur="4s" repeatCount={FOREVER} />
      <circle cx="72" cy="42" r="9" fill={SKIN} />
      <circle cx="75.5" cy="41" r="1.4" fill={INK} stroke="none" />
      <line x1="72" y1="51" x2="72" y2="74" />
      <line x1="72" y1="74" x2="98" y2="74" />
      <line x1="98" y1="74" x2="98" y2="94" />
      <line x1="72" y1="57" x2="90" y2="70" />
    </g>
  );
  return (
    <g>
      <Ground />
      <g strokeWidth="3.5" stroke={WOOD}>
        <line x1="62" y1="48" x2="62" y2="78" />
        <line x1="62" y1="78" x2="106" y2="78" />
        <line x1="64" y1="78" x2="64" y2="94" />
        <line x1="104" y1="78" x2="104" y2="94" />
      </g>
      {standing}
      {sitting}
    </g>
  );
}

function Bird({ flying }: { flying: boolean }) {
  const bird = (
    <g>
      <polygon points="58,58 42,52 42,66" fill="#c9822c" strokeWidth="2" />
      <ellipse cx="80" cy="60" rx="22" ry="12" fill="#e8a24a" strokeWidth="2.5" />
      <circle cx="102" cy="52" r="8" fill="#e8a24a" strokeWidth="2.5" />
      <polygon points="109,50 119,54 109,57" fill={SUN} strokeWidth="1.5" />
      <circle cx="104" cy="50" r="1.6" fill={INK} stroke="none" />
      {flying ? (
        <Swing cx={80} cy={56} a={-30} b={28} dur={0.4}>
          <path d="M82 54 Q66 20 40 28 Q60 38 78 62 Z" fill="#c9822c" strokeWidth="2.5" />
        </Swing>
      ) : (
        <path d="M82 56 Q66 40 50 46 Q64 54 78 64 Z" fill="#c9822c" strokeWidth="2.5" />
      )}
    </g>
  );
  if (!flying) {
    return (
      <g>
        <line x1="26" y1="88" x2="134" y2="88" stroke={WOOD} strokeWidth="5" />
        <line x1="76" y1="70" x2="76" y2="86" />
        <line x1="88" y1="70" x2="88" y2="86" />
        <Swing cx={80} cy={86} a={-2} b={2} dur={1.6}>
          {bird}
        </Swing>
      </g>
    );
  }
  return (
    <g>
      {[0, 1].map((i) => (
        <Fall key={i} dx={-90} dur={4.2} begin={-i * 2.1}>
          <Cloud x={150} y={i ? 90 : 24} s={0.5} fill="#e4eaf2" />
        </Fall>
      ))}
      <Slide dy={-7} dur={1.4}>
        {bird}
      </Slide>
    </g>
  );
}

// ---------- Bảng hình ----------
export const SCENES: Record<string, () => ReactNode> = {
  // ---- thiên nhiên ----
  'sun|n': () => (
    <g>
      <Spin cx={80} cy={54} dur={16}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const t = (i * 45 * Math.PI) / 180;
          return <line key={i} x1={80 + Math.cos(t) * 28} y1={54 + Math.sin(t) * 28} x2={80 + Math.cos(t) * 40} y2={54 + Math.sin(t) * 40} stroke={SUN} strokeWidth="5" />;
        })}
      </Spin>
      <Pulse cx={80} cy={54} from={1} to={1.08} dur={2}>
        <circle cx="80" cy="54" r="20" fill={SUN} stroke="none" />
      </Pulse>
    </g>
  ),
  'rain|n': () => (
    <g>
      <Cloud x={80} y={32} s={1.4} fill="#aebccd" />
      {[50, 64, 78, 92, 106].map((x, i) => (
        <Fall key={x} dx={-7} dy={46} dur={1.1} begin={-i * 0.23}>
          <line x1={x} y1="58" x2={x - 3} y2="67" stroke={WATER} strokeWidth="3.5" />
        </Fall>
      ))}
    </g>
  ),
  'snow|n': () => (
    <g>
      <Cloud x={80} y={32} s={1.4} fill="#aebccd" />
      {[52, 66, 80, 94, 108, 73].map((x, i) => (
        <Fall key={i} dx={i % 2 ? 8 : -8} dy={44} dur={2.6} begin={-i * 0.45}>
          <circle cx={x} cy="60" r="3.4" fill="#f2f7fc" stroke="#8fb0d0" strokeWidth="1.2" />
        </Fall>
      ))}
    </g>
  ),
  'wind|n': () => (
    <g stroke="#86abd0" strokeWidth="4">
      {[
        { d: 'M26 36 H88 a9 9 0 1 0 -9 -9', b: 0 },
        { d: 'M20 58 H112 a10 10 0 1 1 -10 10', b: -0.7 },
        { d: 'M32 80 H90 a8 8 0 1 0 -8 -8', b: -1.4 },
      ].map((l) => (
        <Fall key={l.d} dx={36} dur={2.1} begin={l.b}>
          <path d={l.d} fill="none" />
        </Fall>
      ))}
    </g>
  ),
  'cloud|n': () => (
    <g>
      <Slide dx={16} dur={5}>
        <Cloud x={66} y={44} s={1.5} fill="#bccadb" />
      </Slide>
      <Slide dx={-16} dur={6}>
        <Cloud x={100} y={76} s={1} fill="#dfe6ee" />
      </Slide>
    </g>
  ),
  'moon|n': () => (
    <g>
      <defs>
        <mask id="wv-moon">
          <rect x="0" y="0" width="160" height="110" fill="#fff" />
          <circle cx="94" cy="44" r="24" fill="#000" />
        </mask>
      </defs>
      <Slide dy={-4} dur={4}>
        <circle cx="74" cy="56" r="32" fill="#f4d56a" stroke="none" mask="url(#wv-moon)" />
      </Slide>
      <Pulse cx={116} cy={30} from={0.4} to={1.2} dur={1.6}>
        <Sparkle x={116} y={30} r={8} />
      </Pulse>
      <Pulse cx={126} cy={72} from={1.1} to={0.4} dur={2.1}>
        <Sparkle x={126} y={72} r={6} />
      </Pulse>
      <Pulse cx={36} cy={26} from={0.5} to={1.1} dur={1.9}>
        <Sparkle x={36} y={26} r={6} />
      </Pulse>
    </g>
  ),
  'star|n': () => (
    <g>
      <Swing cx={80} cy={56} a={-8} b={8} dur={2.4}>
        <Pulse cx={80} cy={56} from={0.92} to={1.12} dur={1.2}>
          <polygon points={starPoints(80, 56, 36, 15)} fill={SUN} strokeWidth="3" />
        </Pulse>
      </Swing>
      <Pulse cx={28} cy={30} from={0.3} to={1.1} dur={1.5}>
        <Sparkle x={28} y={30} r={8} />
      </Pulse>
      <Pulse cx={134} cy={36} from={1.1} to={0.3} dur={1.8}>
        <Sparkle x={134} y={36} r={7} />
      </Pulse>
      <Pulse cx={124} cy={88} from={0.3} to={1} dur={2.2}>
        <Sparkle x={124} y={88} r={6} />
      </Pulse>
    </g>
  ),
  'fire|n': () => (
    <g>
      <g stroke={WOOD} strokeWidth="8">
        <line x1="48" y1="92" x2="112" y2="80" />
        <line x1="48" y1="80" x2="112" y2="92" />
      </g>
      <Pulse cx={80} cy={84} from="1 1" to="0.9 1.12" dur={0.7}>
        <path d="M80 14 C98 38 112 50 104 74 C100 88 60 88 56 74 C50 56 66 46 70 32 C74 40 77 38 80 14 Z" fill="#f0793f" stroke="none" />
        <path d="M80 38 C92 54 98 64 92 78 C88 88 72 88 68 78 C62 64 74 54 80 38 Z" fill={SUN} stroke="none" />
        <path d="M80 60 C86 68 88 74 84 80 C82 84 78 84 76 80 C72 74 76 68 80 60 Z" fill="#fde68a" stroke="none" />
      </Pulse>
      {[62, 98, 80].map((x, i) => (
        <Fall key={x} dx={i === 1 ? 6 : -6} dy={-30} dur={1.5} begin={-i * 0.5}>
          <circle cx={x} cy="44" r="2.6" fill={SUN} stroke="none" />
        </Fall>
      ))}
    </g>
  ),
  'flower|n': () => (
    <g>
      <Ground />
      <Pulse cx={80} cy={96} from={0.2} to={1} dur={4.5} hold>
        <path d="M80 96 V50" stroke={LEAF} strokeWidth="4.5" />
        <path d="M80 80 q-20 -4 -26 -20 q20 0 26 20 Z" fill={LEAF} stroke="none" />
        <path d="M80 72 q20 -4 26 -20 q-20 0 -26 20 Z" fill={LEAF} stroke="none" />
        <g fill="#f48fb1" stroke="none">
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const t = (i * 60 * Math.PI) / 180;
            return <circle key={i} cx={80 + Math.cos(t) * 12} cy={40 + Math.sin(t) * 12} r="8" />;
          })}
        </g>
        <circle cx="80" cy="40" r="7" fill={SUN} stroke="none" />
      </Pulse>
    </g>
  ),
  'tree|n': () => (
    <g>
      <Ground />
      <rect x="73" y="58" width="14" height="38" fill={WOOD} stroke="none" />
      <Swing cx={80} cy={80} a={-3} b={3} dur={3}>
        <g fill={LEAF} stroke="none">
          <circle cx="62" cy="48" r="20" />
          <circle cx="98" cy="48" r="20" />
          <circle cx="80" cy="30" r="22" />
          <circle cx="80" cy="54" r="22" />
        </g>
      </Swing>
      <Fall dx={-22} dy={56} dur={3.4}>
        <path d="M112 46 q8 6 0 12 q-8 -6 0 -12 Z" fill="#e0833b" stroke="none" />
      </Fall>
    </g>
  ),
  'heart|n': () => (
    <g>
      <Pulse cx={80} cy={58} from={1} to={1.17} dur={0.8}>
        <path d={HEART} fill={RED} stroke="none" />
        <ellipse cx="62" cy="42" rx="6" ry="3.4" fill="#fff" opacity=".55" stroke="none" transform="rotate(-30 62 42)" />
      </Pulse>
      <Fall dx={-10} dy={-34} dur={2} begin={-0.2}>
        <Heart x={36} y={46} s={0.28} fill="#f08a91" />
      </Fall>
      <Fall dx={10} dy={-34} dur={2.4} begin={-1.2}>
        <Heart x={126} y={50} s={0.22} fill="#f08a91" />
      </Fall>
    </g>
  ),
  'clock|n': () => (
    <g>
      <circle cx="80" cy="56" r="36" strokeWidth="4" />
      {Array.from({ length: 12 }, (_, i) => {
        const t = (i * 30 * Math.PI) / 180;
        const r1 = i % 3 === 0 ? 27 : 30;
        return <line key={i} x1={80 + Math.sin(t) * r1} y1={56 - Math.cos(t) * r1} x2={80 + Math.sin(t) * 33} y2={56 - Math.cos(t) * 33} strokeWidth="2.5" />;
      })}
      <Spin cx={80} cy={56} dur={96}>
        <line x1="80" y1="56" x2="80" y2="38" strokeWidth="5" />
      </Spin>
      <Spin cx={80} cy={56} dur={8}>
        <line x1="80" y1="56" x2="80" y2="30" strokeWidth="3" />
      </Spin>
      <Spin cx={80} cy={56} dur={3}>
        <line x1="80" y1="60" x2="80" y2="28" stroke={RED} strokeWidth="1.8" />
      </Spin>
      <circle cx="80" cy="56" r="3.2" fill={INK} stroke="none" />
    </g>
  ),
  'rise|v': () => (
    <g>
      <defs>
        <clipPath id="wv-rise">
          <rect x="0" y="0" width="160" height="80" />
        </clipPath>
      </defs>
      <g clipPath="url(#wv-rise)">
        <Slide dy={-48} dur={4.5}>
          <g stroke={SUN} strokeWidth="4">
            {[-60, -30, 0, 30, 60].map((a) => {
              const t = ((a - 90) * Math.PI) / 180;
              return <line key={a} x1={80 + Math.cos(t) * 28} y1={92 + Math.sin(t) * 28} x2={80 + Math.cos(t) * 38} y2={92 + Math.sin(t) * 38} />;
            })}
          </g>
          <circle cx="80" cy="92" r="21" fill={SUN} stroke="none" />
        </Slide>
      </g>
      <line x1="14" y1="80" x2="146" y2="80" strokeWidth="3.5" />
      <path d="M26 96 H134" opacity=".25" />
    </g>
  ),
  'fall|v': () => (
    <g>
      <Ground />
      <Fall dx={0} dy={72} dur={1.7} begin={-0.3}>
        <circle cx="52" cy="12" r="8" fill={RED} stroke="none" />
        <path d="M52 5 q1 -4 4 -5" strokeWidth="2.5" />
      </Fall>
      <Fall dx={-26} dy={74} dur={3.4}>
        <Swing cx={108} cy={14} a={-38} b={38} dur={1.1}>
          <path d="M108 6 q11 8 0 17 q-11 -9 0 -17 Z" fill="#e0833b" stroke="none" />
        </Swing>
      </Fall>
    </g>
  ),

  // ---- hành động ----
  'run|v': () => (
    <g>
      <MovingGround dur={0.4} />
      {[40, 52, 64].map((y, i) => (
        <Fall key={y} dx={-22} dur={0.6} begin={-i * 0.2}>
          <line x1="40" y1={y} x2="58" y2={y} opacity=".55" />
        </Fall>
      ))}
      <Slide dy={-4} dur={0.25}>
        <g transform="translate(86 66)">
          <Stick lean={12} armL={{ a: 55, b: -55, dur: 0.5 }} armR={{ a: -55, b: 55, dur: 0.5 }} legL={{ a: -50, b: 50, dur: 0.5 }} legR={{ a: 50, b: -50, dur: 0.5 }} />
        </g>
      </Slide>
    </g>
  ),
  'walk|v': () => (
    <g>
      <MovingGround dur={1} />
      <g transform="translate(80 66)">
        <Stick lean={3} armL={{ a: 20, b: -20, dur: 1.2 }} armR={{ a: -20, b: 20, dur: 1.2 }} legL={{ a: -24, b: 24, dur: 1.2 }} legR={{ a: 24, b: -24, dur: 1.2 }} />
      </g>
    </g>
  ),
  'jump|v': () => (
    <g>
      <Pulse cx={80} cy={97} from={1} to={0.5} dur={1.1}>
        <ellipse cx="80" cy="97" rx="15" ry="3" fill={INK} opacity=".25" stroke="none" />
      </Pulse>
      <Slide dy={-26} dur={1.1}>
        <g transform="translate(80 66)">
          <Stick armL={150} armR={-150} legL={10} legR={-10} />
        </g>
      </Slide>
    </g>
  ),
  'open|v': () => <Door opening />,
  'close|v': () => <Door opening={false} />,
  'swim|v': () => (
    <g>
      <Slide dx={8} dur={3}>
        <circle cx="82" cy="54" r="9" fill={SKIN} />
        <circle cx="86" cy="53" r="1.4" fill={INK} stroke="none" />
        <Spin cx={72} cy={62} dur={1.3}>
          <line x1="72" y1="62" x2="72" y2="40" />
          <circle cx="72" cy="40" r="2.6" fill={SKIN} />
        </Spin>
      </Slide>
      <g stroke="none" fill={WATER} opacity=".6">
        <path d="M-40 62 q10 -8 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 V110 H-40 Z">
          <animateTransform attributeName="transform" type="translate" from="0 0" to="-40 0" dur="2s" repeatCount={FOREVER} />
        </path>
      </g>
    </g>
  ),
  'fly|v': () => <Bird flying />,
  'bird|n': () => <Bird flying={false} />,
  'sleep|v': () => (
    <g>
      <line x1="20" y1="84" x2="140" y2="84" strokeWidth="4" />
      <line x1="20" y1="66" x2="20" y2="96" strokeWidth="4" />
      <line x1="140" y1="84" x2="140" y2="96" strokeWidth="4" />
      <rect x="26" y="64" width="32" height="14" rx="7" fill="#e9eef6" strokeWidth="2" />
      <circle cx="44" cy="60" r="10" fill={SKIN} />
      <path d="M39 59 q3 3 6 0" strokeWidth="2" />
      <Pulse cx={96} cy={84} from="1 1" to="1 1.1" dur={2.4}>
        <rect x="52" y="62" width="82" height="22" rx="7" className="fill-primary-300" strokeWidth="2.5" />
      </Pulse>
      {[
        { s: 12, b: 0 },
        { s: 16, b: -0.8 },
        { s: 20, b: -1.6 },
      ].map((z) => (
        <Fall key={z.s} dx={16} dy={-26} dur={2.4} begin={z.b}>
          <text x="58" y="50" fontSize={z.s} fontWeight="700" fill={INK} stroke="none">
            Z
          </text>
        </Fall>
      ))}
    </g>
  ),
  'sit|v': () => <SitStand target="sit" />,
  'stand|v': () => <SitStand target="stand" />,
  'read|v': () => (
    <g>
      <path d="M80 38 Q54 28 24 38 V84 Q54 74 80 84 Z" fill="#fffaf0" strokeWidth="3" />
      <path d="M80 38 Q106 28 136 38 V84 Q106 74 80 84 Z" fill="#fffaf0" strokeWidth="3" />
      <g strokeWidth="2" opacity=".45">
        <path d="M34 50 Q54 44 72 50" />
        <path d="M34 60 Q54 54 72 60" />
        <path d="M34 70 Q54 64 72 70" />
        <path d="M88 50 Q106 44 126 50" />
        <path d="M88 60 Q106 54 126 60" />
      </g>
      <g transform="translate(80 0)">
        <g>
          <animateTransform attributeName="transform" type="scale" values="1 1;-1 1" keyTimes="0;1" dur="1.8s" repeatCount={FOREVER} />
          <g transform="translate(-80 0)">
            <path d="M80 38 Q106 28 136 38 V84 Q106 74 80 84 Z" fill="#fffaf0" strokeWidth="3" />
            <path d="M92 50 Q108 44 126 50 M92 60 Q108 54 126 60" strokeWidth="2" opacity=".45" />
          </g>
        </g>
      </g>
    </g>
  ),
  'write|v': () => (
    <g>
      <path d="M30 80 q10 -14 20 0 t20 0 t20 0 t20 0" strokeWidth="3.5" pathLength="100" strokeDasharray="100">
        <animate attributeName="stroke-dashoffset" values="100;0;0" keyTimes="0;.8;1" dur="3.4s" repeatCount={FOREVER} />
      </path>
      <g>
        <animateMotion path="M0 0 q10 -14 20 0 t20 0 t20 0 t20 0" dur="3.4s" calcMode="linear" keyPoints="0;1;1" keyTimes="0;.8;1" repeatCount={FOREVER} />
        <g transform="translate(37.7 73.6) rotate(-40)">
          <rect x="0" y="-5" width="32" height="10" rx="2" fill={SUN} strokeWidth="2" />
          <polygon points="0,-5 -11,0 0,5" fill={SKIN} strokeWidth="2" />
          <polygon points="-11,0 -7,-2.2 -7,2.2" fill={INK} stroke="none" />
        </g>
      </g>
    </g>
  ),
  'drink|v': () => (
    <g>
      <Pulse cx={80} cy={92} from="1 1" to="1 .22" dur={4} hold>
        <path d="M59 38 H101 L98 92 H62 Z" fill={WATER} opacity=".7" stroke="none" />
      </Pulse>
      {[70, 84, 76].map((x, i) => (
        <Fall key={x} dy={-28} dur={1.8} begin={-i * 0.6}>
          <circle cx={x} cy="86" r="2.4" fill="#fff" stroke="none" />
        </Fall>
      ))}
      <path d="M54 22 H106 L99 94 H61 Z" strokeWidth="3.5" />
      <path d="M96 6 L86 74" stroke={RED} strokeWidth="4.5" />
    </g>
  ),
  'wake|v': () => (
    <g>
      <Slide dx={2.4} dur={0.12}>
        <circle cx="80" cy="62" r="28" fill="#fffaf0" strokeWidth="3.5" />
        <circle cx="58" cy="30" r="9" className="fill-primary-300" strokeWidth="3" />
        <circle cx="102" cy="30" r="9" className="fill-primary-300" strokeWidth="3" />
        <line x1="66" y1="88" x2="58" y2="98" strokeWidth="4" />
        <line x1="94" y1="88" x2="102" y2="98" strokeWidth="4" />
        <line x1="80" y1="62" x2="80" y2="44" strokeWidth="3.5" />
        <line x1="80" y1="62" x2="94" y2="66" strokeWidth="3.5" />
        <circle cx="80" cy="62" r="3" fill={INK} stroke="none" />
      </Slide>
      <g stroke={SUN} strokeWidth="3.5">
        <path d="M30 40 q-9 18 0 36">
          <animate attributeName="opacity" values="0;1;0" dur=".5s" repeatCount={FOREVER} />
        </path>
        <path d="M130 40 q9 18 0 36">
          <animate attributeName="opacity" values="0;1;0" dur=".5s" repeatCount={FOREVER} />
        </path>
        <path d="M18 34 q-9 24 0 48">
          <animate attributeName="opacity" values="1;0;1" dur=".5s" repeatCount={FOREVER} />
        </path>
        <path d="M142 34 q9 24 0 48">
          <animate attributeName="opacity" values="1;0;1" dur=".5s" repeatCount={FOREVER} />
        </path>
      </g>
    </g>
  ),
  'dance|v': () => (
    <g>
      <Ground />
      <Fall dx={-6} dy={-28} dur={2} begin={-0.3}>
        <Note x={30} y={60} ch="♪" />
      </Fall>
      <Fall dx={6} dy={-28} dur={2.2} begin={-1.3}>
        <Note x={124} y={64} ch="♫" size={20} />
      </Fall>
      <Swing cx={80} cy={94} a={-6} b={6} dur={0.7}>
        <g transform="translate(80 66)">
          <Stick armL={{ a: 105, b: 160, dur: 0.7 }} armR={{ a: -160, b: -105, dur: 0.7 }} legL={{ a: 0, b: 16, dur: 0.7 }} legR={{ a: 0, b: -16, dur: 0.7, begin: -0.35 }} />
        </g>
      </Swing>
    </g>
  ),
  'push|v': () => (
    <g>
      <Ground />
      <Slide dx={16} dur={2.6}>
        <g transform="translate(50 66)">
          <Stick lean={18} armL={-82} armR={-72} legL={{ a: 30, b: 18, dur: 1.3 }} legR={{ a: -22, b: -10, dur: 1.3 }} />
        </g>
        <rect x="74" y="50" width="38" height="46" className="fill-primary-300" strokeWidth="3" />
        <path d="M74 50 L112 96 M112 50 L74 96" strokeWidth="2" opacity=".35" />
      </Slide>
    </g>
  ),
  'pull|v': () => (
    <g>
      <Ground />
      <Slide dx={16} dur={2.6}>
        <rect x="14" y="50" width="38" height="46" className="fill-primary-300" strokeWidth="3" />
        <path d="M14 50 L52 96 M52 50 L14 96" strokeWidth="2" opacity=".35" />
        <path d="M52 62 Q70 70 90 52" stroke={WOOD} strokeWidth="3.5" />
        <g transform="translate(106 66)">
          <Stick face={-1} lean={16} armL={72} armR={82} legL={{ a: -30, b: -16, dur: 1.3 }} legR={{ a: 22, b: 10, dur: 1.3 }} />
        </g>
      </Slide>
    </g>
  ),
  'throw|v': () => (
    <g>
      <Ground />
      <g transform="translate(46 66)">
        <LimbLine py={0} len={28} v={14} />
        <LimbLine py={0} len={28} v={-14} />
        <line x1="0" y1="-27" x2="0" y2="0" />
        <circle cx="0" cy="-36" r="9" fill={SKIN} />
        <circle cx="3.5" cy="-37" r="1.4" fill={INK} stroke="none" />
        <LimbLine py={-22} len={22} v={-40} />
        <g>
          <animateTransform attributeName="transform" type="rotate" values="165 0 -22;165 0 -22;-105 0 -22;165 0 -22" keyTimes="0;.4;.5;1" dur="2.4s" calcMode="linear" repeatCount={FOREVER} />
          <line x1="0" y1="-22" x2="0" y2="0" />
        </g>
      </g>
      <circle cx="0" cy="0" r="5.5" fill={RED} stroke="none" opacity="0">
        <animateMotion path="M67 38 Q104 -8 146 82" dur="2.4s" begin="1.2s" calcMode="linear" keyPoints="0;1;1" keyTimes="0;.45;1" repeatCount={FOREVER} />
        <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;.02;.42;.5;1" dur="2.4s" begin="1.2s" repeatCount={FOREVER} />
      </circle>
    </g>
  ),
  'kick|v': () => (
    <g>
      <Ground />
      <g transform="translate(58 66)">
        <LimbLine py={0} len={28} v={0} />
        <line x1="0" y1="-27" x2="0" y2="0" />
        <circle cx="0" cy="-36" r="9" fill={SKIN} />
        <circle cx="3.5" cy="-37" r="1.4" fill={INK} stroke="none" />
        <LimbLine py={-22} len={22} v={-35} />
        <LimbLine py={-22} len={22} v={40} />
        <g>
          <animateTransform attributeName="transform" type="rotate" values="22 0 0;22 0 0;-62 0 0;22 0 0" keyTimes="0;.35;.45;1" dur="2.4s" calcMode="linear" repeatCount={FOREVER} />
          <line x1="0" y1="0" x2="0" y2="28" />
        </g>
      </g>
      <circle cx="96" cy="89" r="6" fill="#fff" strokeWidth="2.5">
        <animateMotion path="M0 0 Q30 -52 56 -4" dur="2.4s" begin="1.0s" calcMode="linear" keyPoints="0;1;1;0;0" keyTimes="0;.4;.7;.7;1" repeatCount={FOREVER} />
        <animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0;.4;.55;.69;.7;1" dur="2.4s" begin="1.0s" repeatCount={FOREVER} />
      </circle>
    </g>
  ),
  'climb|v': () => (
    <g>
      <g stroke={WOOD} strokeWidth="4">
        <line x1="62" y1="6" x2="62" y2="104" />
        <line x1="98" y1="6" x2="98" y2="104" />
        {[16, 30, 44, 58, 72, 86, 100].map((y) => (
          <line key={y} x1="62" y1={y} x2="98" y2={y} strokeWidth="3" />
        ))}
      </g>
      <Slide dy={-48} dur={3.4}>
        <g transform="translate(80 92) scale(.6)">
          <Stick armL={{ a: 150, b: 185, dur: 1 }} armR={{ a: -185, b: -150, dur: 1 }} legL={{ a: 18, b: -22, dur: 1 }} legR={{ a: -22, b: 18, dur: 1 }} />
        </g>
      </Slide>
    </g>
  ),

  // ---- cảm xúc ----
  'happy|adj': () => (
    <g>
      <Slide dy={-6} dur={0.7}>
        <FaceBase>
          <HappyEyes />
          <path d="M62 64 q18 18 36 0" />
          <g fill="#f4a0a0" opacity=".65" stroke="none">
            <circle cx="56" cy="62" r="5" />
            <circle cx="104" cy="62" r="5" />
          </g>
        </FaceBase>
      </Slide>
      <Pulse cx={30} cy={30} from={0.3} to={1.1} dur={1.2}>
        <Sparkle x={30} y={30} r={7} />
      </Pulse>
      <Pulse cx={130} cy={34} from={1.1} to={0.3} dur={1.4}>
        <Sparkle x={130} y={34} r={6} />
      </Pulse>
      <Pulse cx={124} cy={88} from={0.3} to={1} dur={1.6}>
        <Sparkle x={124} y={88} r={5} />
      </Pulse>
    </g>
  ),
  'sad|adj': () => (
    <g>
      <Swing cx={80} cy={96} a={-3} b={3} dur={3}>
        <FaceBase fill="#f3e29a">
          <DotEyes y={50} />
          <path d="M60 44 L75 38 M100 44 L85 38" strokeWidth="2.5" />
          <path d="M64 74 q16 -14 32 0" />
        </FaceBase>
      </Swing>
      <Tear x={96} y={56} dy={26} dur={1.8} />
    </g>
  ),
  'cry|v': () => (
    <g>
      <Slide dx={1.2} dur={0.2}>
        <FaceBase fill="#f3e29a">
          <path d="M61 50 q7 6 14 0 M85 50 q7 6 14 0" />
          <path d="M60 42 L75 37 M100 42 L85 37" strokeWidth="2.5" />
          <Pulse cx={80} cy={74} from="1 1" to="1 1.35" dur={0.5}>
            <path d="M66 75 q14 -13 28 0 q-14 -5 -28 0 Z" fill={MOUTH} strokeWidth="2.5" />
          </Pulse>
        </FaceBase>
      </Slide>
      <Tear x={68} y={56} begin={0} />
      <Tear x={68} y={56} begin={-0.6} />
      <Tear x={92} y={56} begin={-0.3} />
      <Tear x={92} y={56} begin={-0.9} />
    </g>
  ),
  'laugh|v': () => (
    <g>
      <Swing cx={80} cy={96} a={-7} b={7} dur={0.3}>
        <FaceBase>
          <HappyEyes />
          <path d="M60 62 q20 30 40 0 Z" fill={MOUTH} strokeWidth="2.5" />
          <ellipse cx="80" cy="74" rx="8" ry="3.6" fill="#e8727e" stroke="none" />
        </FaceBase>
      </Swing>
      <Tear x={48} y={50} dy={14} dur={0.9} />
      <Tear x={112} y={50} dy={14} dur={0.9} begin={-0.45} />
    </g>
  ),
  'smile|v': () => (
    <g>
      <FaceBase>
        <DotEyes y={47} />
        <path d="M66 64 q14 6 28 0" fill="none">
          <animate attributeName="d" values="M66 64 q14 6 28 0;M62 62 q18 18 36 0;M66 64 q14 6 28 0" keyTimes="0;.5;1" dur="2.6s" repeatCount={FOREVER} calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1" />
        </path>
        <Pulse cx={56} cy={62} from={0.6} to={1.1} dur={2.6}>
          <circle cx="56" cy="62" r="5" fill="#f4a0a0" opacity=".65" stroke="none" />
        </Pulse>
        <Pulse cx={104} cy={62} from={0.6} to={1.1} dur={2.6}>
          <circle cx="104" cy="62" r="5" fill="#f4a0a0" opacity=".65" stroke="none" />
        </Pulse>
      </FaceBase>
    </g>
  ),
  'angry|adj': () => (
    <g>
      <Slide dx={2} dur={0.12}>
        <FaceBase fill="#f19a8e">
          <path d="M57 38 L76 47 M103 38 L84 47" strokeWidth="4.5" />
          <g fill={INK} stroke="none">
            <circle cx="69" cy="53" r="3.4" />
            <circle cx="91" cy="53" r="3.4" />
          </g>
          <path d="M65 76 q15 -10 30 0" />
        </FaceBase>
      </Slide>
      <Fall dx={-6} dy={-28} dur={1.4}>
        <circle cx="44" cy="32" r="6" fill="#dfe3ea" stroke="none" />
      </Fall>
      <Fall dx={6} dy={-28} dur={1.4} begin={-0.7}>
        <circle cx="116" cy="32" r="6" fill="#dfe3ea" stroke="none" />
      </Fall>
    </g>
  ),
  'tired|adj': () => (
    <g>
      <Swing cx={80} cy={96} a={-4} b={9} dur={3.4}>
        <FaceBase fill="#efe0a4">
          <path d="M61 51 h14 M85 51 h14" strokeWidth="3.5" />
          <path d="M62 57 q6 4 12 0 M86 57 q6 4 12 0" strokeWidth="2" opacity=".5" />
          <Pulse cx={80} cy={72} from="1 .5" to="1 1.25" dur={2.6}>
            <ellipse cx="80" cy="72" rx="7" ry="6" fill={MOUTH} strokeWidth="2.5" />
          </Pulse>
        </FaceBase>
      </Swing>
    </g>
  ),
  'sing|v': () => (
    <g>
      <Swing cx={80} cy={96} a={-4} b={4} dur={1.2}>
        <FaceBase>
          <HappyEyes />
          <Pulse cx={80} cy={70} from="1 .5" to="1.1 1.25" dur={0.6}>
            <ellipse cx="80" cy="70" rx="9" ry="8" fill={MOUTH} strokeWidth="2.5" />
          </Pulse>
        </FaceBase>
      </Swing>
      <Fall dx={14} dy={-24} dur={2} begin={0}>
        <Note x={118} y={56} ch="♪" />
      </Fall>
      <Fall dx={14} dy={-24} dur={2} begin={-1}>
        <Note x={122} y={72} ch="♫" size={20} />
      </Fall>
      <Fall dx={-14} dy={-24} dur={2.4} begin={-0.5}>
        <Note x={30} y={64} ch="♪" size={16} />
      </Fall>
    </g>
  ),

  // ---- tính từ / trạng từ ----
  'big|adj': () => <Resize grow />,
  'small|adj': () => <Resize grow={false} />,
  'tall|adj': () => (
    <g>
      <Ground />
      <rect x="56" y="74" width="26" height="22" className="fill-primary-300" strokeWidth="2.5">
        <animate attributeName="y" values="74;16;74" dur="3.4s" repeatCount={FOREVER} {...SPLINE} />
        <animate attributeName="height" values="22;80;22" dur="3.4s" repeatCount={FOREVER} {...SPLINE} />
      </rect>
      <Slide dy={-58} dur={3.4}>
        <polygon points="69,60 61,70 77,70" fill={INK} stroke="none" />
      </Slide>
      <g transform="translate(116 82) scale(.5)">
        <Stick />
      </g>
    </g>
  ),
  'fast|adj': () => <Car wheel={0.22} bob={0.18} lines />,
  'slow|adj': () => (
    <g>
      <Ground y={94} />
      <Slide dx={14} dur={5}>
        <rect x="26" y="82" width="90" height="12" rx="6" fill="#dcc29a" strokeWidth="2.5" />
        <circle cx="116" cy="76" r="10" fill="#dcc29a" strokeWidth="2.5" />
        <Swing cx={113} cy={68} a={-8} b={8} dur={2}>
          <line x1="113" y1="68" x2="110" y2="50" strokeWidth="2.5" />
          <circle cx="110" cy="48" r="3" fill={INK} stroke="none" />
        </Swing>
        <Swing cx={120} cy={69} a={8} b={-8} dur={2.4}>
          <line x1="120" y1="69" x2="124" y2="50" strokeWidth="2.5" />
          <circle cx="124" cy="48" r="3" fill={INK} stroke="none" />
        </Swing>
        <circle cx="66" cy="64" r="24" fill={WOOD} strokeWidth="3" />
        <path d="M66 64 m0 0 a4 4 0 1 1 4 4 a8 8 0 1 1 -8 -8 a13 13 0 1 1 13 13 a19 19 0 1 1 -19 -19" strokeWidth="2.5" stroke="#f4e3c8" />
      </Slide>
    </g>
  ),
  'car|n': () => <Car wheel={1.6} bob={1.4} />,
  'hot|adj': () => <Thermo hot />,
  'cold|adj': () => <Thermo hot={false} />,
  'up|adv': () => <UpDown up />,
  'down|adv': () => <UpDown up={false} />,
};
