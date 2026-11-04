/** Luật của trò Nối thẻ (kiểu Pikachu): hai thẻ nối được khi có đường đi qua ô trống, tối đa 2 chỗ rẽ. */

export interface Tile {
  /** Khóa duy nhất của thẻ trên bàn. */
  key: number;
  /** id từ vựng; thẻ từ và thẻ nghĩa của cùng một từ có cùng vid. */
  vid: number;
  /** 'w' = từ tiếng Anh, 'm' = nghĩa tiếng Việt. */
  kind: 'w' | 'm';
  text: string;
}

export interface Pos {
  r: number;
  c: number;
}

/** Bàn cờ có viền trống rộng 1 ô quanh bốn phía, nên thẻ nằm ở hàng 1..rows, cột 1..cols. */
export type Grid = (Tile | null)[][];

const DIRS: Pos[] = [
  { r: -1, c: 0 },
  { r: 1, c: 0 },
  { r: 0, c: -1 },
  { r: 0, c: 1 },
];

/** Đường nối ngắn dưới dạng các điểm gấp khúc (đầu, các góc rẽ, cuối), hoặc null nếu bị chắn. */
export function findPath(grid: Grid, a: Pos, b: Pos): Pos[] | null {
  const R = grid.length;
  const C = grid[0].length;
  const best = new Map<number, number>();
  const queue: { r: number; c: number; d: number; t: number; pts: Pos[] }[] = [{ r: a.r, c: a.c, d: -1, t: 0, pts: [a] }];
  for (let i = 0; i < queue.length; i++) {
    const s = queue[i];
    for (let nd = 0; nd < 4; nd++) {
      const turning = s.d !== -1 && nd !== s.d;
      const nt = turning ? s.t + 1 : s.t;
      if (nt > 2) continue;
      const nr = s.r + DIRS[nd].r;
      const nc = s.c + DIRS[nd].c;
      if (nr < 0 || nc < 0 || nr >= R || nc >= C) continue;
      const pts = turning ? [...s.pts, { r: s.r, c: s.c }] : s.pts;
      if (nr === b.r && nc === b.c) return [...pts, b];
      if (grid[nr][nc]) continue;
      const k = (nr * C + nc) * 4 + nd;
      const prev = best.get(k);
      if (prev !== undefined && prev <= nt) continue;
      best.set(k, nt);
      queue.push({ r: nr, c: nc, d: nd, t: nt, pts });
    }
  }
  return null;
}

/** Một cặp (từ, nghĩa) đang nối được, hoặc null nếu hết nước đi. */
export function findMove(grid: Grid): [Tile, Tile, Pos[]] | null {
  const words = new Map<number, { t: Tile; p: Pos }>();
  const means = new Map<number, { t: Tile; p: Pos }>();
  grid.forEach((row, r) =>
    row.forEach((t, c) => {
      if (t) (t.kind === 'w' ? words : means).set(t.vid, { t, p: { r, c } });
    })
  );
  for (const [vid, w] of words) {
    const m = means.get(vid);
    if (!m) continue;
    const path = findPath(grid, w.p, m.p);
    if (path) return [w.t, m.t, path];
  }
  return null;
}

export function tilesOf(grid: Grid): Tile[] {
  return grid.flat().filter((t): t is Tile => t !== null);
}

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Xếp ngẫu nhiên các thẻ vào bàn rows x cols (có viền), thử lại cho tới khi có ít nhất một nước đi. */
export function makeGrid(tiles: Tile[], rows: number, cols: number): Grid {
  const slots: Pos[] = [];
  for (let r = 1; r <= rows; r++) for (let c = 1; c <= cols; c++) slots.push({ r, c });
  let grid: Grid = [];
  for (let attempt = 0; attempt < 300; attempt++) {
    grid = Array.from({ length: rows + 2 }, () => Array<Tile | null>(cols + 2).fill(null));
    const spots = shuffled(slots).slice(0, tiles.length);
    shuffled(tiles).forEach((t, i) => {
      grid[spots[i].r][spots[i].c] = t;
    });
    if (findMove(grid)) return grid;
  }
  return grid;
}

/** Số cột, số hàng cho `n` thẻ: màn rộng nhiều cột hơn màn hẹp. */
export function layoutFor(n: number, wide: boolean): { rows: number; cols: number } {
  const cols = wide ? (n <= 12 ? 4 : n <= 20 ? 5 : 6) : n <= 24 ? 4 : 5;
  return { rows: Math.max(2, Math.ceil(n / cols)), cols };
}

/** Tọa độ tâm (theo đơn vị ô) của hàng/cột `i` trên bàn có `n` ô thẻ; ô viền chỉ rộng 0.4 ô. */
export function center(i: number, n: number): number {
  if (i === 0) return 0.2;
  if (i === n + 1) return n + 0.6;
  return i - 0.1;
}
