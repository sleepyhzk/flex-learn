/**
 * Tranh minh họa cho TOEIC Part 1 (vẽ bằng SVG, nội dung tĩnh do mình soạn nên an toàn khi chèn vào trang).
 * Mỗi hàm trả về chuỗi SVG khung 400 x 240.
 */

const SKIN = '#f2c9a5';
const PANTS = '#34425a';

const rect = (x: number, y: number, w: number, h: number, fill: string, rx = 0) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
const circle = (cx: number, cy: number, r: number, fill: string, stroke = '', sw = 0) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ''}/>`;
const ellipse = (cx: number, cy: number, rx: number, ry: number, fill: string) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
const line = (x1: number, y1: number, x2: number, y2: number, stroke: string, sw: number) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round"/>`;
const poly = (pts: string, fill: string) => `<polygon points="${pts}" fill="${fill}"/>`;

/** Đầu và tóc. */
const head = (x: number, y: number, hair = '#3a2b20') =>
  circle(x, y, 15, SKIN) + `<path d="M${x - 15} ${y} a15 15 0 0 1 30 0 z" fill="${hair}"/>`;

/** Người đứng: (x, y) là tâm đầu. */
const stander = (x: number, y: number, shirt: string, hair = '#3a2b20') =>
  rect(x - 14, y + 64, 12, 46, PANTS, 3) +
  rect(x + 2, y + 64, 12, 46, PANTS, 3) +
  rect(x - 16, y + 106, 16, 6, '#222') +
  rect(x + 0, y + 106, 16, 6, '#222') +
  rect(x - 17, y + 15, 34, 54, shirt, 9) +
  head(x, y, hair);

/** Cánh tay (từ vai đến tay) và bàn tay. */
const arm = (x1: number, y1: number, x2: number, y2: number, sleeve: string) =>
  line(x1, y1, x2, y2, sleeve, 9) + circle(x2, y2, 5, SKIN);

const wrap = (body: string, label: string) =>
  `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" style="width:100%;height:auto;display:block">${body}</svg>`;

// ---------------------------------------------------------------- các cảnh
const deskLaptop = () =>
  rect(0, 0, 400, 240, '#eaf1fb') +
  rect(0, 185, 400, 55, '#d3dcec') +
  rect(260, 40, 90, 70, '#cfe3f7', 4) + line(305, 40, 305, 110, '#eaf1fb', 3) + line(260, 75, 350, 75, '#eaf1fb', 3) +
  // ghế và người ngồi
  rect(118, 125, 14, 62, '#556070', 3) + rect(112, 160, 56, 8, '#556070', 3) + line(124, 168, 124, 195, '#556070', 4) +
  rect(135, 115, 34, 50, '#d9534f', 9) + head(152, 92, '#5a3a22') +
  rect(139, 160, 52, 12, PANTS, 5) + rect(180, 168, 12, 30, PANTS, 4) + rect(176, 194, 18, 6, '#222') +
  arm(158, 128, 205, 140, '#d9534f') +
  // bàn và laptop
  rect(180, 148, 190, 10, '#8a6a4a', 2) + rect(190, 158, 8, 40, '#7a5a3a') + rect(350, 158, 8, 40, '#7a5a3a') +
  rect(200, 142, 80, 6, '#9aa4b2', 2) + poly('212,142 270,142 266,100 216,100', '#27324a') + poly('217,140 265,140 262,104 220,104', '#8ec5ff') +
  // đèn bàn
  line(335, 148, 335, 112, '#444', 3) + line(335, 112, 318, 104, '#444', 3) + poly('306,102 326,98 322,112 304,112', '#f5c542');

const watering = () =>
  rect(0, 0, 400, 240, '#e6f4ea') +
  circle(340, 40, 20, '#ffe082') +
  rect(0, 185, 400, 55, '#9ad39a') +
  stander(110, 72, '#3b82c4', '#2b2b2b') +
  arm(124, 95, 172, 112, '#3b82c4') +
  // bình tưới
  rect(168, 106, 34, 28, '#6b8fb3', 5) + line(202, 116, 232, 98, '#6b8fb3', 6) + `<path d="M170 110 q-14 -4 -4 14" fill="none" stroke="#6b8fb3" stroke-width="4"/>` +
  circle(238, 108, 2.5, '#4aa3df') + circle(244, 120, 2.5, '#4aa3df') + circle(250, 133, 2.5, '#4aa3df') + circle(236, 124, 2.5, '#4aa3df') +
  // chậu cây
  [250, 300, 350].map((px) =>
    poly(`${px - 18},150 ${px + 18},150 ${px + 13},185 ${px - 13},185`, '#b5693c') +
    ellipse(px - 9, 138, 8, 16, '#3f9d4a') + ellipse(px + 9, 138, 8, 16, '#4caf50') + ellipse(px, 128, 7, 18, '#2e8b3c')
  ).join('');

const meeting = () =>
  rect(0, 0, 400, 240, '#f3ecf9') +
  rect(0, 190, 400, 50, '#dcd2ea') +
  rect(30, 30, 90, 60, '#cfe3f7', 4) + line(75, 30, 75, 90, '#f3ecf9', 3) +
  [[110, '#4a90d9', '#3a2b20'], [200, '#e07a5f', '#5a3a22'], [290, '#6aa84f', '#222']].map(([x, c, h]) =>
    rect((x as number) - 20, 110, 40, 60, c as string, 10) + head(x as number, 88, h as string)
  ).join('') +
  rect(60, 150, 280, 14, '#8a6a4a', 4) + rect(80, 164, 10, 40, '#7a5a3a') + rect(310, 164, 10, 40, '#7a5a3a') +
  rect(100, 144, 36, 7, '#fff', 1) + rect(180, 143, 40, 8, '#fff', 1) + rect(262, 144, 36, 7, '#fff', 1) +
  circle(160, 143, 7, '#f5f5f5', '#bbb', 1);

const bike = (x: number) =>
  circle(x - 24, 170, 17, 'none', '#333', 3.5) + circle(x + 24, 170, 17, 'none', '#333', 3.5) +
  `<path d="M${x - 24} 170 L${x - 4} 140 L${x + 18} 140 L${x + 24} 170 M${x - 4} 140 L${x + 2} 170 L${x - 24} 170 M${x + 18} 140 L${x + 14} 128" fill="none" stroke="#c0392b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>` +
  line(x + 8, 128, x + 20, 128, '#333', 4) + rect(x - 12, 130, 16, 5, '#333', 2);
const bicycles = () =>
  rect(0, 0, 400, 240, '#e8f3fb') +
  rect(0, 30, 400, 130, '#d9c9b8') + rect(30, 55, 60, 50, '#bcd7ee', 3) + rect(170, 55, 60, 50, '#bcd7ee', 3) + rect(310, 55, 60, 50, '#bcd7ee', 3) +
  rect(0, 160, 400, 80, '#c4c8cc') +
  [62, 160, 258, 350].map(bike).join('').replace(/x/g, 'x');

const cart = () =>
  rect(0, 0, 400, 240, '#fff3e0') +
  rect(0, 190, 400, 50, '#d7c8b0') +
  [30, 120, 210, 300].map((sx) => rect(sx, 40, 80, 8, '#8d6e63') + rect(sx, 90, 80, 8, '#8d6e63') + rect(sx + 5, 22, 28, 18, '#c8a27a') + rect(sx + 45, 70, 28, 20, '#c8a27a') + rect(sx + 8, 120 - 22, 26, 24, '#c8a27a')).join('') +
  stander(150, 78, '#2e7d6b', '#2b2b2b') +
  arm(166, 102, 200, 140, '#2e7d6b') +
  line(200, 140, 214, 150, '#555', 4) +
  rect(212, 150, 110, 12, '#7f8c8d', 2) + circle(228, 172, 9, '#333') + circle(306, 172, 9, '#333') +
  rect(224, 118, 46, 32, '#c8a27a', 2) + rect(272, 126, 40, 24, '#d9b48a', 2) + rect(236, 92, 36, 26, '#d9b48a', 2) +
  line(224, 134, 270, 134, '#a9835b', 2);

const cafeTable = () =>
  rect(0, 0, 400, 240, '#e3f2fd') +
  rect(0, 178, 400, 62, '#cfd8dc') +
  // dù
  `<path d="M90 90 Q200 -10 310 90 Z" fill="#e74c3c"/>` + `<path d="M200 28 L145 90 L200 90 Z" fill="#fdecea"/>` + `<path d="M200 28 L255 90 L200 90 Z" fill="#fdecea"/>` +
  line(200, 90, 200, 175, '#555', 5) +
  // bàn
  ellipse(200, 140, 70, 11, '#a1887f') + rect(194, 150, 12, 26, '#6d4c41') + ellipse(200, 178, 30, 5, '#6d4c41') +
  // hai tách cà phê
  ellipse(170, 136, 14, 4, '#fff') + rect(163, 124, 14, 12, '#fff', 3) + rect(163, 124, 14, 4, '#6f4e37', 2) +
  ellipse(232, 136, 14, 4, '#fff') + rect(225, 124, 14, 12, '#fff', 3) + rect(225, 124, 14, 4, '#6f4e37', 2) +
  // hai ghế trống
  rect(50, 120, 8, 66, '#455a64', 2) + rect(50, 150, 40, 8, '#455a64', 2) + rect(82, 158, 6, 28, '#455a64') + rect(50, 120, 30, 6, '#455a64', 2) +
  rect(342, 120, 8, 66, '#455a64', 2) + rect(310, 150, 40, 8, '#455a64', 2) + rect(312, 158, 6, 28, '#455a64') + rect(320, 120, 30, 6, '#455a64', 2);

const busStop = () =>
  rect(0, 0, 400, 240, '#e8f5e9') +
  rect(0, 40, 400, 120, '#c8e6c9') +
  rect(0, 178, 400, 62, '#78909c') + [20, 90, 160, 230, 300, 370].map((dx) => rect(dx, 212, 40, 5, '#eceff1')).join('') +
  rect(0, 168, 400, 10, '#b0bec5') +
  // biển bus
  line(60, 70, 60, 168, '#455a64', 5) + rect(40, 48, 40, 28, '#1e88e5', 5) + rect(48, 56, 24, 4, '#fff') + rect(48, 64, 18, 4, '#fff') +
  // người chờ
  stander(105, 62, '#e07a5f', '#3a2b20') + stander(138, 66, '#6aa84f', '#222') + stander(168, 64, '#8e6fc9', '#5a3a22') +
  // xe buýt
  rect(225, 92, 160, 76, '#f6c343', 8) + rect(235, 102, 30, 26, '#cfe8ff', 3) + rect(272, 102, 30, 26, '#cfe8ff', 3) + rect(309, 102, 30, 26, '#cfe8ff', 3) + rect(346, 102, 30, 26, '#cfe8ff', 3) +
  rect(225, 140, 160, 6, '#d99a1a') + circle(262, 170, 14, '#333') + circle(262, 170, 6, '#bbb') + circle(350, 170, 14, '#333') + circle(350, 170, 6, '#bbb');

const library = () =>
  rect(0, 0, 400, 240, '#f1e9e0') +
  rect(0, 192, 400, 48, '#d7c3a8') +
  [20, 150, 280].map((sx) => rect(sx, 20, 100, 170, '#8d6e63', 3) +
    [34, 82, 130].map((sy, k) => rect(sx + 6, sy, 88, 40, '#6d4c41') +
      ['#e57373', '#64b5f6', '#81c784', '#ffd54f', '#ba68c8', '#4db6ac', '#ff8a65', '#90a4ae'].slice(k, k + 7).map((c, i) => rect(sx + 8 + i * 12, sy + 6 + (i % 2) * 3, 9, 34 - (i % 2) * 3, c)).join('')
    ).join('')
  ).join('') +
  stander(200, 78, '#c0568a', '#4a2f1b') +
  arm(184, 100, 196, 128, '#c0568a') + arm(216, 100, 206, 128, '#c0568a') +
  poly('178,130 200,138 200,118 178,112', '#fff') + poly('222,130 200,138 200,118 222,112', '#f6f6f6') + line(200, 118, 200, 138, '#bbb', 1.5);

const cooking = () =>
  rect(0, 0, 400, 240, '#fff8e1') +
  rect(30, 30, 100, 56, '#ffe0b2', 4) + rect(270, 36, 90, 90, '#fff3cd', 4) + line(280, 56, 350, 56, '#e2c36b', 3) + line(280, 80, 350, 80, '#e2c36b', 3) +
  // đầu bếp
  rect(143, 108, 34, 62, '#fafafa', 9) + head(160, 88, '#2b2b2b') +
  rect(146, 60, 28, 12, '#fff', 2) + circle(150, 58, 10, '#fff') + circle(160, 54, 12, '#fff') + circle(172, 58, 10, '#fff') +
  // quầy bếp
  rect(0, 152, 400, 88, '#b0bec5') + rect(0, 152, 400, 10, '#90a4ae') +
  // chảo trên bếp
  rect(205, 142, 80, 10, '#546e7a', 2) + ellipse(245, 140, 34, 8, '#37474f') + line(278, 140, 330, 130, '#37474f', 7) +
  circle(236, 135, 5, '#ffb74d') + circle(250, 133, 5, '#e57373') + circle(258, 137, 4, '#8bc34a') +
  `<path d="M232 120 q-6 -10 0 -18 M248 118 q-6 -10 0 -18 M262 120 q-6 -10 0 -18" fill="none" stroke="#cfd8dc" stroke-width="3" stroke-linecap="round"/>` +
  arm(172, 124, 214, 134, '#fafafa') + line(214, 134, 226, 120, '#8d6e63', 4);

const presenting = () =>
  rect(0, 0, 400, 240, '#ede7f6') +
  rect(0, 192, 400, 48, '#d1c4e9') +
  rect(220, 36, 150, 110, '#fff', 4) + rect(220, 36, 150, 8, '#b39ddb') +
  rect(238, 100, 20, 34, '#7e57c2') + rect(268, 80, 20, 54, '#9575cd') + rect(298, 66, 20, 68, '#b39ddb') + rect(328, 52, 20, 82, '#5e35b1') +
  line(232, 138, 360, 138, '#bbb', 2) +
  stander(150, 72, '#2f6f9f', '#2b2b2b') +
  arm(166, 96, 206, 94, '#2f6f9f') + line(206, 94, 252, 80, '#8d6e63', 3) +
  arm(134, 96, 130, 130, '#2f6f9f');

const painting = () =>
  rect(0, 0, 400, 240, '#f9fbe7') +
  rect(190, 20, 190, 170, '#e1f0fb') + rect(190, 20, 120, 170, '#a9d4f5') +
  rect(0, 190, 400, 50, '#d9c9a8') +
  rect(30, 180, 50, 12, '#9e9e9e', 2) + rect(36, 176, 38, 6, '#6fb2e8') +
  stander(150, 76, '#e6a03c', '#2b2b2b') +
  arm(166, 100, 206, 74, '#e6a03c') + line(206, 74, 206, 58, '#777', 3) + rect(194, 40, 40, 14, '#6fb2e8', 4) +
  arm(134, 100, 130, 134, '#e6a03c') +
  // thang để bên cạnh
  line(325, 60, 305, 192, '#9a7b4f', 6) + line(355, 60, 345, 192, '#9a7b4f', 6) +
  [78, 108, 138, 168].map((ly) => line(319 + (ly - 60) * -0.05, ly, 352 - (ly - 60) * 0.05, ly, '#9a7b4f', 5)).join('');

const phoneCall = () =>
  rect(0, 0, 400, 240, '#e3f2fd') +
  rect(0, 192, 400, 48, '#cfd8dc') +
  rect(300, 60, 70, 54, '#bbdefb', 3) +
  rect(140, 108, 40, 60, '#7e57c2', 10) + head(160, 86, '#4a2f1b') +
  arm(172, 124, 176, 92, '#7e57c2') + rect(170, 76, 10, 22, '#263238', 5) +
  rect(30, 150, 340, 14, '#8a6a4a', 3) + rect(30, 164, 340, 40, '#a1887f') +
  rect(220, 112, 56, 38, '#37474f', 3) + rect(226, 118, 44, 26, '#90caf9') + rect(242, 150, 12, 6, '#555') +
  rect(300, 128, 30, 22, '#e0e0e0', 2) + rect(300, 124, 30, 4, '#bdbdbd');


const carrying = () =>
  rect(0, 0, 400, 240, '#f4f1ea') +
  rect(0, 190, 400, 50, '#d9cfbd') +
  rect(300, 40, 70, 150, '#c9b79c', 3) + rect(308, 50, 54, 138, '#b9a587', 2) + circle(352, 120, 4, '#f5c542') +
  rect(40, 130, 26, 60, '#8d5a3b', 4) + ellipse(53, 118, 22, 20, '#4caf50') + ellipse(42, 106, 14, 16, '#388e3c') +
  stander(190, 72, '#5b8def', '#5a3a22') +
  rect(160, 112, 62, 46, '#c8a27a', 4) + line(160, 130, 222, 130, '#a9835b', 3) +
  arm(176, 100, 164, 132, '#5b8def') + arm(206, 100, 218, 132, '#5b8def');

const fruitStand = () =>
  rect(0, 0, 400, 240, '#fff9e6') +
  rect(0, 188, 400, 52, '#d8c9a3') +
  [0, 1, 2, 3, 4, 5, 6, 7].map((i) => rect(i * 50, 18, 50, 42, i % 2 ? '#fff' : '#e74c3c')).join('') +
  poly('0,60 400,60 400,72 0,72', '#c0392b') +
  rect(210, 140, 170, 12, '#8a6a4a', 2) + rect(220, 152, 8, 40, '#7a5a3a') + rect(362, 152, 8, 40, '#7a5a3a') +
  rect(218, 112, 48, 28, '#a9835b', 3) + rect(272, 112, 48, 28, '#a9835b', 3) + rect(326, 112, 48, 28, '#a9835b', 3) +
  [226, 240, 254].map((cx) => circle(cx, 112, 9, '#e53935')).join('') +
  [280, 294, 308].map((cx) => circle(cx, 112, 9, '#fb8c00')).join('') +
  [334, 348, 362].map((cx) => circle(cx, 112, 9, '#c0d83a')).join('') +
  stander(130, 76, '#2e9d8f', '#2b2b2b') +
  arm(146, 100, 178, 118, '#2e9d8f') + circle(182, 116, 8, '#e53935') + arm(114, 100, 110, 134, '#2e9d8f');

const lineUp = () =>
  rect(0, 0, 400, 240, '#f0f4f8') +
  rect(0, 192, 400, 48, '#cfd8dc') +
  rect(30, 30, 90, 60, '#cfe3f7', 4) +
  stander(345, 66, '#e07a5f', '#4a2f1b') +
  rect(290, 134, 100, 58, '#8a6a4a', 3) + rect(296, 118, 34, 18, '#37474f', 3) + rect(300, 122, 26, 8, '#90caf9') +
  stander(90, 76, '#4a90d9', '#3a2b20') + stander(150, 76, '#6aa84f', '#222') + stander(210, 76, '#8e6fc9', '#5a3a22');

const windowClean = () =>
  rect(0, 0, 400, 240, '#e0f2f1') +
  rect(0, 190, 400, 50, '#b7c4c2') +
  rect(135, 20, 250, 172, '#d7ccc8') + rect(168, 38, 170, 118, '#8aa4b8', 4) + rect(174, 44, 158, 106, '#bbdefb', 2) +
  rect(174, 44, 70, 106, '#e8f7ff', 2) + line(253, 44, 253, 150, '#8aa4b8', 4) + line(174, 97, 332, 97, '#8aa4b8', 4) +
  stander(105, 78, '#546e7a', '#2b2b2b') +
  arm(120, 100, 186, 86, '#546e7a') + rect(178, 80, 34, 7, '#263238', 2) + arm(90, 100, 86, 134, '#546e7a') +
  rect(58, 168, 24, 22, '#90a4ae', 3) + ellipse(70, 168, 12, 3, '#4aa3df');

const handshake = () =>
  rect(0, 0, 400, 240, '#ede7f6') +
  rect(0, 192, 400, 48, '#d1c4e9') +
  rect(40, 36, 80, 60, '#cfe3f7', 4) + line(80, 36, 80, 96, '#ede7f6', 3) +
  rect(310, 140, 24, 52, '#8d5a3b', 4) + ellipse(322, 128, 20, 18, '#4caf50') +
  stander(150, 72, '#3b82c4', '#2b2b2b') + stander(250, 72, '#c0568a', '#4a2f1b') +
  arm(166, 98, 202, 118, '#3b82c4') + arm(234, 98, 206, 118, '#c0568a') + circle(204, 118, 7, SKIN);

const dock = () =>
  rect(0, 0, 400, 240, '#e1f5fe') +
  circle(330, 44, 22, '#ffe082') +
  poly('0,120 70,84 150,116 230,80 320,118 400,92 400,130 0,130', '#81c784') +
  rect(0, 126, 400, 114, '#4aa3df') +
  [30, 120, 210, 300].map((wx) => `<path d="M${wx} 150 q10 -6 20 0 t20 0" fill="none" stroke="#8fd0f5" stroke-width="2.5" stroke-linecap="round"/>`).join('') +
  [90, 200, 310].map((bx, i) => poly(`${bx - 36},168 ${bx + 36},168 ${bx + 26},186 ${bx - 26},186`, i === 1 ? '#e74c3c' : '#fafafa') + line(bx, 168, bx, 112, '#6d4c41', 3) + poly(`${bx + 3},116 ${bx + 3},164 ${bx + 34},164`, i === 1 ? '#fff' : '#ffe0b2')).join('') +
  rect(0, 200, 400, 40, '#a1887f') + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => line(i * 50, 200, i * 50, 240, '#8d6e63', 2)).join('') +
  [60, 200, 340].map((px) => rect(px - 5, 178, 10, 28, '#6d4c41', 2)).join('') +
  line(60, 182, 90, 172, '#d7ccc8', 2) + line(200, 182, 200, 172, '#d7ccc8', 2) + line(340, 182, 310, 172, '#d7ccc8', 2);

const sweeping = () =>
  rect(0, 0, 400, 240, '#f5f1e8') +
  rect(0, 188, 400, 52, '#d6cdb8') +
  rect(290, 130, 90, 10, '#8a6a4a', 2) + rect(298, 140, 6, 48, '#7a5a3a') + rect(366, 140, 6, 48, '#7a5a3a') +
  stander(140, 74, '#5d8a4a', '#2b2b2b') +
  line(176, 100, 214, 178, '#8d6e63', 4) + poly('204,172 232,176 238,192 202,192', '#c9a35b') +
  arm(156, 100, 176, 112, '#5d8a4a') + arm(124, 100, 190, 138, '#5d8a4a') +
  [250, 262, 274, 256, 268].map((lx, i) => ellipse(lx, 194 + (i % 2) * 4, 6, 3, i % 2 ? '#e67e22' : '#c0392b')).join('');

const stocking = () =>
  rect(0, 0, 400, 240, '#fff3e0') +
  rect(0, 192, 400, 48, '#d7c8b0') +
  rect(210, 20, 170, 172, '#8d6e63', 3) + rect(216, 26, 158, 160, '#a1887f') +
  [70, 120, 170].map((sy) => rect(210, sy, 170, 6, '#6d4c41')).join('') +
  [0, 1, 2, 3, 4, 5].map((i) => rect(222 + i * 24, 95, 18, 25, ['#e53935', '#43a047', '#fb8c00', '#1e88e5', '#8e24aa', '#fdd835'][i], 3)).join('') +
  [0, 1, 2, 3, 4, 5].map((i) => rect(222 + i * 24, 145, 18, 25, ['#fdd835', '#1e88e5', '#e53935', '#43a047', '#fb8c00', '#8e24aa'][i], 3)).join('') +
  [0, 1, 2].map((i) => rect(222 + i * 24, 45, 18, 25, ['#43a047', '#e53935', '#1e88e5'][i], 3)).join('') +
  rect(40, 150, 56, 40, '#c8a27a', 3) + line(40, 164, 96, 164, '#a9835b', 2) +
  stander(140, 78, '#d9534f', '#4a2f1b') +
  arm(156, 100, 198, 52, '#d9534f') + rect(194, 40, 18, 24, '#fdd835', 3) + arm(124, 100, 118, 134, '#d9534f');

const emptyRoom = () =>
  rect(0, 0, 400, 240, '#f3ecf9') +
  rect(0, 192, 400, 48, '#dcd2ea') +
  rect(110, 24, 180, 78, '#fff', 3) + rect(110, 24, 180, 5, '#b39ddb') + line(130, 50, 200, 50, '#9fa8da', 2) + line(130, 66, 240, 66, '#9fa8da', 2) +
  [120, 185, 250].map((cx) => rect(cx, 104, 30, 40, '#455a64', 5)).join('') +
  rect(60, 120, 28, 70, '#455a64', 4) + rect(312, 120, 28, 70, '#455a64', 4) +
  rect(90, 142, 220, 14, '#8a6a4a', 3) + rect(110, 156, 10, 40, '#7a5a3a') + rect(280, 156, 10, 40, '#7a5a3a') +
  rect(130, 136, 36, 7, '#fff', 1) + rect(230, 135, 36, 8, '#fff', 1) +
  [140, 200, 260].map((cx) => rect(cx - 18, 165, 36, 10, '#546e7a', 3) + rect(cx - 15, 175, 5, 20, '#546e7a') + rect(cx + 10, 175, 5, 20, '#546e7a')).join('');

const crosswalk = () =>
  rect(0, 0, 400, 240, '#e3f2fd') +
  rect(0, 40, 90, 130, '#cfd8dc') + rect(110, 60, 100, 110, '#d7ccc8') + rect(230, 30, 90, 140, '#c5cae9') + rect(330, 70, 70, 100, '#cfd8dc') +
  [0, 1, 2].map((i) => rect(20 + i * 30, 60, 14, 18, '#90caf9')).join('') + [0, 1, 2].map((i) => rect(250 + i * 28, 56, 14, 18, '#90caf9')).join('') +
  rect(0, 168, 400, 72, '#78909c') + rect(0, 160, 400, 10, '#b0bec5') +
  [0, 1, 2, 3, 4, 5, 6].map((i) => rect(60 + i * 46, 176, 24, 60, '#fafafa')).join('') +
  line(30, 70, 30, 165, '#455a64', 5) + rect(20, 70, 20, 40, '#263238', 4) + circle(30, 80, 5, '#e53935') + circle(30, 98, 5, '#43a047') +
  stander(160, 68, '#4a90d9', '#3a2b20') + stander(250, 70, '#e07a5f', '#2b2b2b');

const luggage = () =>
  rect(0, 0, 400, 240, '#e8eaf6') +
  rect(0, 192, 400, 48, '#c5cae9') +
  rect(100, 18, 200, 34, '#37474f', 4) + rect(114, 28, 60, 5, '#90caf9') + rect(114, 38, 90, 5, '#90caf9') +
  stander(140, 76, '#3b82c4', '#2b2b2b') +
  arm(156, 102, 192, 126, '#3b82c4') + arm(124, 102, 120, 136, '#3b82c4') +
  line(192, 126, 218, 136, '#555', 3) +
  rect(206, 136, 56, 52, '#c0392b', 6) + rect(206, 150, 56, 4, '#922b21') + rect(206, 168, 56, 4, '#922b21') +
  circle(216, 192, 5, '#222') + circle(252, 192, 5, '#222') +
  rect(300, 120, 70, 8, '#8a6a4a', 2) + rect(306, 128, 6, 62, '#7a5a3a') + rect(358, 128, 6, 62, '#7a5a3a');

const camera = () =>
  rect(0, 0, 400, 240, '#e8f5e9') +
  poly('0,150 90,100 180,140 270,96 400,150 400,190 0,190', '#a5d6a7') +
  rect(0, 188, 400, 52, '#9ad39a') +
  rect(50, 100, 14, 92, '#795548') + circle(57, 90, 30, '#43a047') +
  rect(330, 110, 14, 82, '#795548') + circle(337, 98, 28, '#388e3c') +
  stander(190, 72, '#8e6fc9', '#4a2f1b') +
  rect(176, 66, 28, 18, '#263238', 3) + circle(190, 75, 6, '#90caf9') +
  arm(172, 100, 178, 80, '#8e6fc9') + arm(208, 100, 202, 80, '#8e6fc9');

const bench = () =>
  rect(0, 0, 400, 240, '#e8f5e9') +
  rect(0, 188, 400, 52, '#d9c9a3') +
  rect(30, 90, 14, 100, '#795548') + circle(37, 78, 36, '#43a047') +
  rect(350, 100, 14, 90, '#795548') + circle(357, 88, 32, '#388e3c') +
  rect(110, 116, 180, 10, '#8d6e63', 2) + rect(120, 126, 6, 30, '#6d4c41') + rect(274, 126, 6, 30, '#6d4c41') +
  rect(110, 150, 180, 10, '#8d6e63', 2) + rect(120, 160, 8, 32, '#6d4c41') + rect(272, 160, 8, 32, '#6d4c41') +
  [[165, '#e07a5f', '#3a2b20'], [235, '#6aa84f', '#222']].map(([cx, shirt, hair]) =>
    rect((cx as number) - 17, 98, 34, 54, shirt as string, 9) + head(cx as number, 80, hair as string) +
    rect((cx as number) - 17, 146, 46, 12, PANTS, 5) + rect((cx as number) + 19, 154, 12, 34, PANTS, 4) + rect((cx as number) + 16, 188, 18, 6, '#222')
  ).join('');

const ladder = () =>
  rect(0, 0, 400, 240, '#fafafa') +
  rect(0, 192, 400, 48, '#d9d2c3') +
  rect(0, 0, 400, 10, '#e0e0e0') + line(280, 10, 280, 14, '#555', 3) + rect(268, 12, 24, 8, '#78909c', 2) + circle(280, 30, 11, '#ffd54f') +
  line(200, 192, 246, 44, '#9a7b4f', 6) + line(256, 192, 302, 44, '#9a7b4f', 6) +
  [66, 96, 126, 156, 186].map((ry) => { const t = (192 - ry) * (46 / 148); return line(200 + t, ry, 256 + t, ry, '#9a7b4f', 5); }).join('') +
  stander(252, 50, '#3b9d8f', '#2b2b2b') +
  arm(268, 76, 280, 42, '#3b9d8f') + arm(236, 76, 232, 110, '#3b9d8f');

export type SceneKey =
  | 'deskLaptop' | 'watering' | 'meeting' | 'bicycles' | 'cart' | 'cafeTable'
  | 'busStop' | 'library' | 'cooking' | 'presenting' | 'painting' | 'phoneCall'
  | 'carrying' | 'fruitStand' | 'lineUp' | 'windowClean' | 'handshake' | 'dock'
  | 'sweeping' | 'stocking' | 'emptyRoom' | 'crosswalk'
  | 'luggage' | 'camera' | 'bench' | 'ladder';

const LABEL: Record<SceneKey, string> = {
  deskLaptop: 'Tranh: người phụ nữ ngồi ở bàn làm việc',
  watering: 'Tranh: người đàn ông đang tưới cây',
  meeting: 'Tranh: ba người ngồi quanh bàn họp',
  bicycles: 'Tranh: những chiếc xe đạp đỗ trước tòa nhà',
  cart: 'Tranh: người đàn ông đẩy xe chở thùng hàng',
  cafeTable: 'Tranh: bàn cà phê ngoài trời không có người',
  busStop: 'Tranh: mọi người chờ ở trạm xe buýt',
  library: 'Tranh: người phụ nữ cầm sách trước kệ sách',
  cooking: 'Tranh: đầu bếp đang nấu ăn',
  presenting: 'Tranh: người đàn ông đứng cạnh màn hình biểu đồ',
  painting: 'Tranh: người đàn ông sơn tường',
  phoneCall: 'Tranh: người phụ nữ nghe điện thoại ở quầy',
  carrying: 'Tranh: người phụ nữ bê một thùng hàng',
  fruitStand: 'Tranh: người phụ nữ chọn trái cây ở quầy',
  lineUp: 'Tranh: mọi người xếp hàng trước quầy thu ngân',
  windowClean: 'Tranh: người đàn ông lau cửa sổ',
  handshake: 'Tranh: hai người bắt tay',
  dock: 'Tranh: những chiếc thuyền buộc ở bến',
  sweeping: 'Tranh: người đàn ông quét sân',
  stocking: 'Tranh: người phụ nữ xếp hàng lên kệ',
  emptyRoom: 'Tranh: phòng họp không có người',
  crosswalk: 'Tranh: hai người băng qua đường',
  luggage: 'Tranh: người đàn ông kéo vali',
  camera: 'Tranh: người phụ nữ chụp ảnh',
  bench: 'Tranh: hai người ngồi trên ghế băng',
  ladder: 'Tranh: người đàn ông đứng trên thang',
};

const BUILDERS: Record<SceneKey, () => string> = {
  deskLaptop, watering, meeting, bicycles, cart, cafeTable, busStop, library, cooking, presenting, painting, phoneCall,
  carrying, fruitStand, lineUp, windowClean, handshake, dock,
  sweeping, stocking, emptyRoom, crosswalk,
  luggage, camera, bench, ladder,
};

export function sceneSvg(key: SceneKey): string {
  return wrap(BUILDERS[key](), LABEL[key]);
}
