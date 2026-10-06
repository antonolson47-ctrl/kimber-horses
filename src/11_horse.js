/* ===================== HORSE RIG (side view, faces right; ground y=0, ~280 wide, ~300 tall) ===================== */
const POSES = {
  stand: { nf: [2, 0, 4], ff: [-5, 0, 3], nh: [-12, 8, 12], fh: [-4, 5, 8], neck: 0, lift: 0, tail: 'hang', wind: 0.1 },
  proud: { nf: [8, 4, 6], ff: [-6, 0, 3], nh: [-14, 8, 12], fh: [-2, 5, 8], neck: -6, lift: 0, tail: 'swish', wind: 0.25 },
  gallop: { nf: [58, 88, 100], ff: [30, -60, -30], nh: [-42, -68, -82], fh: [-18, -30, -45], neck: 14, lift: 26, tail: 'stream', wind: 1 },
  gather: { nf: [-10, -70, -40], ff: [20, 30, 40], nh: [30, -20, 0], fh: [10, 20, 30], neck: 6, lift: 18, tail: 'stream', wind: 0.8 },
  munch: { nf: [2, 0, 4], ff: [-5, 0, 3], nh: [-12, 8, 12], fh: [-4, 5, 8], neck: 22, lift: 0, tail: 'swish', wind: 0.2 },
};
const mixA = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
// a smooth 4-beat-ish gallop cycle built from the two key poses
function gallopPose(t) {
  const A = POSES.gallop, B = POSES.gather, ph = { nh: 0, fh: 0.12, nf: 0.5, ff: 0.62 };
  const leg = k => mixA(A[k], B[k], 0.5 + 0.5 * Math.cos(TAU * (t + ph[k])));
  return { nf: leg('nf'), ff: leg('ff'), nh: leg('nh'), fh: leg('fh'), neck: 10 + 5 * Math.sin(TAU * t), lift: 16 + 11 * Math.sin(TAU * (t + 0.3)), tail: 'stream', wind: 1 };
}
// parade prance: diagonal pairs lift in turn
function prancePose(t) {
  const st = POSES.proud; const a = Math.max(0, Math.sin(TAU * t)), b = Math.max(0, -Math.sin(TAU * t));
  const fore = [40, -55, -20], hind = [12, -34, -16];
  return { nf: mixA(st.nf, fore, a), fh: mixA(st.fh, hind, a), ff: mixA(st.ff, fore, b), nh: mixA(st.nh, hind, b), neck: -8 + 3 * Math.sin(TAU * t * 2), lift: 3 * Math.abs(Math.sin(TAU * t)), tail: 'swish', wind: 0.35 };
}
const JUMP_POSE = { nf: [-30, -95, -60], ff: [-18, -85, -50], nh: [40, -30, -10], fh: [30, -20, 0], neck: 4, lift: 0, tail: 'stream', wind: 0.9 };
/* ---------- coats ---------- */
const BASES = {
  chestnut: { n: 'Chestnut', base: '#b9673a', mane: '#7c3b1f' },
  sorrel: { n: 'Flaxen chestnut', base: '#c8763d', mane: '#f0d9a2' },
  bay: { n: 'Bay', base: '#8a4b2a', mane: '#1f1712', points: true },
  brown: { n: 'Brown', base: '#5a3a2a', mane: '#1d1512', points: true },
  black: { n: 'Black', base: '#2a2630', mane: '#16131a' },
  palomino: { n: 'Palomino', base: '#e2b35c', mane: '#fbf1da' },
  buckskin: { n: 'Buckskin', base: '#d8ae6c', mane: '#231a15', points: true },
  golden: { n: 'Golden buckskin', base: '#e8b54f', mane: '#4a2e18', points: true, sheen: true },
  grey: { n: 'Grey', base: '#eceae6', mane: '#f7f6f3' },
  dapple: { n: 'Dapple grey', base: '#aeb4bd', mane: '#e9ebef', dapple: true },
  dun: { n: 'Dun', base: '#c9a77a', mane: '#3a2a22', dun: true, points: true },
  fjord: { n: 'Brown dun', base: '#e3cfa4', mane: '#f6ecd6', dun: true },
  blueroan: { n: 'Blue roan', base: '#6f7380', mane: '#26232b', roan: true, points: true },
  redroan: { n: 'Red roan', base: '#b98676', mane: '#6b3524', roan: true },
  darkfoal: { n: 'Dark foal (turns white)', base: '#4b4650', mane: '#2b2730' },
};
const PATTERNS = { solid: 'Solid', leopard: 'Leopard', fewspot: 'Few-Spot', blanket: 'Spotted Blanket', snowcap: 'Snowcap', snowflake: 'Snowflake', frost: 'Frost', varnish: 'Varnish Roan', tobiano: 'Tobiano', overo: 'Overo', tovero: 'Tovero' };
const APPY = { leopard: 1, fewspot: 1, blanket: 1, snowcap: 1, snowflake: 1, frost: 1, varnish: 1 };
// spec: { b: base key, p: pattern key, m: { star, blaze, socks:[nf,ff,nh,fh], feather, ears:'curl', mane:'roach'|'long' } }
function makeCoat(spec) {
  const B = BASES[spec.b] || BASES.bay, p = spec.p || 'solid', m = spec.m || {};
  const c = { base: B.base, mane: B.mane, pattern: p, spot: shade(B.base, -0.28), white: '#fbf7f0', hoof: 'dark', star: !!m.star, blaze: !!m.blaze, socks: m.socks || null,
    points: !!B.points, dun: !!B.dun, roan: !!B.roan, sheen: !!B.sheen, dapple: !!B.dapple, feather: !!m.feather, ears: m.ears || '', maneStyle: m.mane || (spec.b === 'fjord' ? 'roach' : ''), appy: !!APPY[p] };
  const sp = spec.b === 'black' ? '#3b2b2b' : spec.b === 'grey' ? '#8a8a94' : B.base;
  if (p === 'leopard') { c.base = '#f8f3ea'; c.spot = sp; c.mane = shade(B.mane, B.mane === '#f7f6f3' ? -0.1 : 0.25); c.points = false; c.dun = false; }
  if (p === 'fewspot') { c.base = '#faf6ef'; c.spot = sp; c.mane = '#d9cfc2'; c.points = false; c.dun = false; }
  if (p === 'blanket' || p === 'snowflake' || p === 'varnish' || p === 'frost') c.spot = p === 'blanket' ? shade(B.base === '#eceae6' ? '#8a8a94' : B.base, -0.22) : '#fbf7f0';
  if (p === 'tovero') { c.points = false; }
  if (c.appy) c.hoof = 'stripe';
  if (c.socks && !c.appy) c.hoof = 'light';
  if (c.dapple) c.pattern = p === 'solid' ? 'dapple' : p;
  return c;
}
function legJoints(at, ang, L) { const pts = [at]; let [x, y] = at; for (let i = 0; i < 3; i++) { const a = ang[i] * Math.PI / 180; x += Math.sin(a) * L[i]; y += Math.cos(a) * L[i]; pts.push([x, y]); } return pts; }
function legParts(pts, W) {
  const parts = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1]; const dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy) || 1; const nx = -dy / d, ny = dx / d;
    const wa = W[i] / 2, wb = W[i + 1] / 2;
    parts.push(() => poly([[ax + nx * wa, ay + ny * wa], [bx + nx * wb, by + ny * wb], [bx - nx * wb, by - ny * wb], [ax - nx * wa, ay - ny * wa]]));
    parts.push(() => C(bx, by, wb));
  }
  parts.push(() => C(pts[0][0], pts[0][1], W[0] / 2));
  return parts;
}
function hoofPath(pts) { const [ax, ay] = pts[2], [bx, by] = pts[3]; const a = Math.atan2(bx - ax, by - ay);
  return () => { g.save(); g.translate(bx, by); g.rotate(-a); g.moveTo(-7.5, -4); g.lineTo(7.5, -4); g.lineTo(10, 9); g.quadraticCurveTo(0, 12, -10, 9); g.closePath(); g.restore(); }; }
function H_body() { g.moveTo(-70, -154); g.bezierCurveTo(-30, -164, 8, -150, 40, -160); g.bezierCurveTo(72, -162, 94, -140, 90, -116); g.bezierCurveTo(88, -94, 74, -82, 55, -80); g.bezierCurveTo(20, -74, -22, -74, -55, -80); g.bezierCurveTo(-82, -84, -102, -100, -102, -124); g.bezierCurveTo(-102, -144, -90, -156, -70, -154); g.closePath(); }
function H_neck() { g.moveTo(12, -152); g.bezierCurveTo(26, -196, 44, -228, 70, -246); g.lineTo(112, -206); g.bezierCurveTo(102, -172, 96, -140, 88, -112); g.closePath(); }
function H_skull() { E(92, -240, 37, 33, -0.25); }
function H_muzzle() { E(134, -208, 28, 23, 0.45); }
function H_bridge() { poly([[68, -262], [112, -262], [158, -222], [142, -188], [102, -204], [62, -222]]); }
let EAR_CURL = false;
function H_earN() { if (EAR_CURL) { g.moveTo(74, -262); g.bezierCurveTo(60, -290, 78, -314, 98, -304); g.quadraticCurveTo(84, -298, 94, -264); g.closePath(); return; } g.moveTo(74, -262); g.quadraticCurveTo(66, -292, 80, -304); g.quadraticCurveTo(96, -284, 94, -264); g.closePath(); }
function H_earF() { if (EAR_CURL) { g.moveTo(110, -262); g.bezierCurveTo(124, -290, 106, -314, 88, -306); g.quadraticCurveTo(104, -298, 92, -266); g.closePath(); return; } g.moveTo(92, -266); g.quadraticCurveTo(92, -296, 108, -304); g.quadraticCurveTo(118, -282, 110, -262); g.closePath(); }
function withNeck(pose, fn) { g.save(); g.translate(30, -150); g.rotate(pose.neck * Math.PI / 180); g.translate(-30, 150); fn(); g.restore(); }
const NK = (pose, f) => () => withNeck(pose, f);
function neckPt(pose, x, y) { const a = pose.neck * Math.PI / 180, dx = x - 30, dy = y + 150; return [30 + dx * Math.cos(a) - dy * Math.sin(a), -150 + dx * Math.sin(a) + dy * Math.cos(a)]; }

function drawHorse(x, y, s, o = {}) {
  const pose = typeof o.pose === 'object' ? Object.assign({}, o.pose) : Object.assign({}, POSES[o.pose || 'stand'], o.poseOver || {});
  const coat = o.coat && o.coat.base ? o.coat : makeCoat(o.coat || { b: 'chestnut', p: 'blanket', m: { star: true } });
  const out = o.outfit || {};
  g.save(); g.translate(x, y); g.scale(s * (o.flip ? -1 : 1), s);
  if (!o.noShadow) groundShadow(0, 0, 105, 12, pose.lift ? 0.14 : 0.22);
  g.translate(0, -pose.lift);
  const lw = o.lw || 3.2;
  EAR_CURL = coat.ears === 'curl';
  const L1 = [44, 38, 16], L2 = [48, 40, 16];
  const legs = { nf: legJoints([62, -108], pose.nf, L1), ff: legJoints([44, -108], pose.ff, L1), nh: legJoints([-72, -112], pose.nh, L2), fh: legJoints([-56, -110], pose.fh, L2) };
  const WF = [24, 17, 14, 13], WH = [32, 19, 14, 13];
  const farCol = shade(coat.pattern === 'leopard' || coat.pattern === 'fewspot' || coat.pattern === 'tovero' ? '#d9d2c6' : coat.base, -0.18);
  if (out.tailBag) drawTailBag(pose, coat, lw, out); else drawTail(pose, coat, lw);
  const farParts = [...legParts(legs.ff, WF), ...legParts(legs.fh, WH)].map(p => [p, farCol]);
  group(farParts, lw);
  if (coat.points) for (const L of [legs.ff, legs.fh]) legParts([[L[1][0] * 0.4 + L[2][0] * 0.6, L[1][1] * 0.4 + L[2][1] * 0.6], L[2], L[3]], [15, 14, 13]).forEach(p => fillOnly(p, shade(coat.mane, -0.1)));
  hooves([legs.ff, legs.fh], coat, lw, true);
  if (coat.socks) socks([legs.ff, legs.fh], [coat.socks[1], coat.socks[3]], shade(coat.white, -0.12));
  if (coat.feather) feathers([legs.ff, legs.fh], coat, true);
  drawFarEar(pose, coat, lw);
  const nearLegParts = [...legParts(legs.nf, WF), ...legParts(legs.nh, WH)];
  const coatParts = [H_body, NK(pose, H_neck), NK(pose, H_skull), NK(pose, H_muzzle), NK(pose, H_bridge), NK(pose, H_earN), ...nearLegParts];
  group(coatParts.map(p => [p, coat.base]), lw);
  drawPattern(coatParts, coat, pose, legs);
  if (coat.socks) socks([legs.nf, legs.nh], [coat.socks[0], coat.socks[2]], coat.white);
  clipTo(H_body, () => {
    g.fillStyle = lin(0, -165, 0, -75, [[0, 'rgba(255,255,255,.22)'], [0.45, 'rgba(255,255,255,0)'], [0.75, 'rgba(60,20,40,0)'], [1, 'rgba(60,20,40,.22)']]); g.fillRect(-110, -170, 210, 100);
    g.fillStyle = 'rgba(60,20,40,.12)'; g.beginPath(); E(-70, -100, 30, 22, 0.5); g.fill();
    if (coat.sheen) { g.fillStyle = 'rgba(255,250,220,.45)'; g.beginPath(); E(-10, -146, 80, 9, -0.05); g.fill(); g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); E(-40, -148, 30, 4, -0.05); g.fill(); }
  });
  if (coat.sheen) withNeck(pose, () => clipTo(H_neck, () => { g.fillStyle = 'rgba(255,250,220,.4)'; g.beginPath(); E(50, -200, 10, 40, 0.6); g.fill(); }));
  hooves([legs.nf, legs.nh], coat, lw, false);
  if (coat.feather) feathers([legs.nf, legs.nh], coat, false);
  withNeck(pose, () => {
    fillOnly(() => { if (EAR_CURL) { g.moveTo(78, -268); g.quadraticCurveTo(72, -292, 88, -301); g.quadraticCurveTo(84, -284, 89, -268); g.closePath(); } else { g.moveTo(78, -268); g.quadraticCurveTo(74, -288, 81, -297); g.quadraticCurveTo(90, -283, 89, -268); g.closePath(); } }, '#e9a7a0');
    clipTo(H_muzzle, () => {
      g.fillStyle = coat.appy ? 'rgba(232,170,160,.55)' : 'rgba(60,30,40,.18)'; g.beginPath(); E(148, -202, 20, 16, 0.4); g.fill();
      if (coat.appy) { g.fillStyle = 'rgba(90,50,60,.35)'; g.beginPath(); C(146, -196, 2.5); C(140, -204, 2); C(152, -208, 2.2); C(156, -198, 1.8); g.fill(); }
    });
    if (coat.star && !coat.blaze) fillOnly(() => { star(104, -250, 8, 4, 0.4); }, coat.white);
    if (coat.blaze) clipTo(() => { H_skull(); H_muzzle(); H_bridge(); }, () => fillOnly(() => { g.moveTo(98, -262); g.quadraticCurveTo(108, -262, 112, -250); g.lineTo(150, -210); g.quadraticCurveTo(146, -196, 136, -200); g.lineTo(100, -240); g.closePath(); }, coat.white));
    drawFace(coat, o.expr || 'happy');
  });
  drawMane(pose, coat, lw);
  drawOutfit(out, pose, coat, legs, lw);
  g.restore();
  EAR_CURL = false;
  return { pose, legs };
}
function hooves(legsList, coat, lw, far) {
  for (const L of legsList) {
    const hp = hoofPath(L);
    shape(hp, far ? '#5d5056' : '#6e5f66', lw);
    if (coat.hoof === 'stripe') clipTo(hp, () => { g.fillStyle = far ? '#c9bfae' : '#efe4cf'; const [bx, by] = L[3]; for (let k = -12; k < 14; k += 7) { g.fillRect(bx + k, by - 6, 3, 20); } });
    else if (coat.hoof === 'light') clipTo(hp, () => { g.fillStyle = '#e8dcc6'; g.fillRect(L[3][0] - 14, L[3][1] - 8, 28, 24); });
  }
}
function socks(legsList, flags, col) {
  legsList.forEach((L, i) => { if (!flags[i]) return; const parts = legParts([L[1], L[2], L[3]].map((p, k) => k === 0 ? [L[1][0] + (L[2][0] - L[1][0]) * 0.45, L[1][1] + (L[2][1] - L[1][1]) * 0.45] : p), [15, 14, 13]); parts.forEach(p => fillOnly(p, col)); });
}
function feathers(legsList, coat, far) {
  const col = coat.socks ? (far ? '#e6e0d6' : '#fbf7f0') : shade(coat.mane, far ? -0.05 : 0.1);
  for (const L of legsList) { const [ax, ay] = L[2], [bx, by] = L[3]; const ang = Math.atan2(bx - ax, by - ay);
    g.save(); g.translate(bx, by); g.rotate(-ang);
    shape(() => { g.moveTo(-9, -18); g.quadraticCurveTo(-16, -4, -14, 6); g.quadraticCurveTo(-8, 2, -6, 8); g.quadraticCurveTo(0, 2, 4, 9); g.quadraticCurveTo(10, 2, 14, 7); g.quadraticCurveTo(14, -6, 9, -18); g.closePath(); }, col, 2.4);
    g.restore(); }
}
function drawFarEar(pose, coat, lw) { withNeck(pose, () => shape(H_earF, shade(coat.pattern === 'leopard' || coat.pattern === 'fewspot' ? '#d9d2c6' : coat.base, -0.18), lw)); }
function drawFace(coat, expr) {
  const ex = 102, ey = -238;
  if (expr === 'closed') { strokeOnly(() => { g.moveTo(ex - 10, ey); g.quadraticCurveTo(ex, ey + 8, ex + 10, ey); }, INK, 3); }
  else {
    shape(() => E(ex, ey, 11.5, 13.5, -0.1), '#fff', 2.6);
    fillOnly(() => C(ex + 3, ey + 1, 9.5), '#4a2a1f');
    fillOnly(() => C(ex + 3.5, ey + 1.5, 5.5), '#1d1216');
    fillOnly(() => C(ex + 6.5, ey - 3.5, 3.4), '#fff'); fillOnly(() => C(ex - 0.5, ey + 5, 1.6), '#fff');
    strokeOnly(() => { g.moveTo(ex - 13, ey - 4); g.quadraticCurveTo(ex - 2, ey - 18, ex + 12, ey - 8); }, INK, 3.2);
    strokeOnly(() => { g.moveTo(ex - 11, ey - 9); g.lineTo(ex - 17, ey - 14); g.moveTo(ex - 6, ey - 12); g.lineTo(ex - 10, ey - 19); }, INK, 2.4);
  }
  g.fillStyle = 'rgba(255,120,140,.28)'; g.beginPath(); E(114, -218, 9, 6, 0.3); g.fill();
  strokeOnly(() => { g.moveTo(150, -220); g.quadraticCurveTo(156, -214, 152, -207); }, INK, 2.8);
  if (expr === 'munch') shape(() => E(146, -194, 9, 5 + 3 * Math.abs(Math.sin(T * 14)), 0.2), '#a8445a', 2.4);
  else strokeOnly(() => { g.moveTo(134, -195); g.quadraticCurveTo(144, -188, 154, -196); }, INK, 2.6);
}
function crestPt(t) { const P = [[72, -252], [46, -230], [26, -196], [14, -154]]; const u = 1 - t;
  return [u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0], u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1]]; }
function manePath(pose, long) {
  return () => withNeck(pose, () => {
    const N = 7; const w = pose.wind; const pts = []; const k = long ? 1.6 : 1;
    for (let i = 0; i <= N; i++) pts.push(crestPt(i / N));
    g.moveTo(pts[0][0] + 6, pts[0][1] + 4);
    for (let i = 0; i < N; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
      const len = (18 + 6 * Math.sin(i * 1.7) + w * 12) * k; const ox = -len * (0.7 + w * 0.5), oy = len * (0.5 - w * 0.55) + (long ? (1 - w) * 14 : 0);
      g.quadraticCurveTo(x0 + ox, y0 + oy - 4, x1 - 2 + ox * 0.35, y1 + oy * 0.4); g.lineTo(x1, y1); }
    g.lineTo(pts[N][0] + 10, pts[N][1] + 4);
    for (let i = N; i > 0; i--) { const [x, y] = pts[i]; g.lineTo(x + 9, y + 3); }
    g.closePath();
  });
}
function drawMane(pose, coat, lw) {
  if (coat.maneStyle === 'roach') { // Norwegian Fjord: short upright mane, dark stripe in the middle
    withNeck(pose, () => { const path = () => { const p0 = crestPt(0); g.moveTo(p0[0] + 4, p0[1] + 2); for (let i = 0; i <= 10; i++) { const [x, y] = crestPt(i / 10); g.lineTo(x - 7, y - 9); } for (let i = 10; i >= 0; i--) { const [x, y] = crestPt(i / 10); g.lineTo(x + 6, y + 3); } g.closePath(); };
      shape(path, coat.mane, lw); strokeOnly(() => { for (let i = 0; i <= 10; i++) { const [x, y] = crestPt(i / 10); i ? g.lineTo(x - 2, y - 3) : g.moveTo(x - 2, y - 3); } }, '#3a2a22', 3.4); });
  } else {
    shape(manePath(pose, coat.maneStyle === 'long'), coat.mane, lw);
    withNeck(pose, () => { g.strokeStyle = shade(coat.mane, coat.mane === '#16131a' ? 0.18 : 0.25); g.lineWidth = 2.5; for (let i = 1; i < 7; i++) { const [x, y] = crestPt(i / 7.5); g.beginPath(); g.moveTo(x - 2, y); g.quadraticCurveTo(x - 10 - pose.wind * 8, y + 4, x - 14 - pose.wind * 14, y + 10 - pose.wind * 8); g.stroke(); } });
  }
  withNeck(pose, () => shape(() => { g.moveTo(84, -268); g.quadraticCurveTo(100, -276, 110, -262); g.quadraticCurveTo(116, -250, 120, -246); g.quadraticCurveTo(104, -248, 96, -256); g.quadraticCurveTo(90, -248, 84, -250); g.quadraticCurveTo(80, -258, 84, -268); g.closePath(); }, coat.mane, lw));
}
function tailPath(pose) {
  return () => {
    if (pose.tail === 'stream') { g.moveTo(-96, -148); g.bezierCurveTo(-128, -170, -150, -150, -176, -158); g.bezierCurveTo(-170, -146, -186, -132, -192, -124); g.bezierCurveTo(-160, -116, -150, -134, -128, -126); g.bezierCurveTo(-118, -120, -106, -124, -100, -126); g.closePath(); }
    else if (pose.tail === 'swish') { g.moveTo(-96, -146); g.bezierCurveTo(-132, -150, -140, -100, -128, -60); g.bezierCurveTo(-124, -44, -140, -34, -150, -30); g.bezierCurveTo(-120, -24, -104, -46, -104, -80); g.bezierCurveTo(-104, -100, -100, -120, -98, -128); g.closePath(); }
    else { g.moveTo(-96, -146); g.bezierCurveTo(-124, -146, -126, -100, -120, -60); g.bezierCurveTo(-118, -44, -126, -32, -132, -26); g.bezierCurveTo(-106, -26, -100, -50, -100, -80); g.bezierCurveTo(-100, -104, -98, -120, -98, -128); g.closePath(); }
  };
}
function drawTail(pose, coat, lw) {
  const tp = tailPath(pose); shape(tp, coat.mane, lw);
  clipTo(tp, () => { g.strokeStyle = shade(coat.mane, 0.22); g.lineWidth = 2.5; for (let k = 0; k < 4; k++) { g.beginPath(); if (pose.tail === 'stream') { g.moveTo(-104, -142 + k * 4); g.bezierCurveTo(-130, -156 + k * 6, -150, -140 + k * 5, -182, -146 + k * 6); } else { g.moveTo(-104 - k * 4, -136); g.bezierCurveTo(-114 - k * 3, -100, -110 - k * 4, -70, -118 - k * 4, -36); } g.stroke(); } });
}
// Spanish Riding School capriole horses: tail braided short and tucked into a tail bag
function drawTailBag(pose, coat, lw, out) {
  const up = pose.tail === 'stream';
  g.save(); g.translate(-98, -142); g.rotate(up ? -1.1 : 0.15);
  shape(() => { RR(-8, -4, 16, 26, 7); }, coat.mane, lw);
  const cs = out.tailBagCols || ['#b3162a', '#f2c14e'];
  shape(() => { g.moveTo(-11, 18); g.lineTo(11, 18); g.lineTo(9, 58); g.quadraticCurveTo(0, 66, -9, 58); g.closePath(); }, cs[0], lw);
  clipTo(() => { g.moveTo(-11, 18); g.lineTo(11, 18); g.lineTo(9, 58); g.quadraticCurveTo(0, 66, -9, 58); g.closePath(); }, () => { g.fillStyle = cs[1]; g.fillRect(-12, 24, 24, 4); g.fillRect(-12, 48, 24, 4); });
  shape(() => C(0, 18, 5), cs[1], 2);
  g.restore();
}
/* ---------- coat patterns (per-part clip to avoid winding holes) ---------- */
function spotsList(n, box, rmin, rmax, sd) { seed = sd; const a = []; for (let i = 0; i < n; i++) a.push([R(box[0], box[2]), R(box[1], box[3]), R(rmin, rmax), R(0, 3)]); return a; }
function blanketShape() { g.moveTo(-115, -182); g.lineTo(24, -182); g.bezierCurveTo(16, -158, 20, -140, 4, -130); g.bezierCurveTo(-12, -120, -26, -116, -44, -112); g.bezierCurveTo(-66, -108, -84, -98, -96, -92); g.lineTo(-116, -96); g.closePath(); }
function drawPattern(parts, coat, pose, legs) {
  const P = coat.pattern;
  const each = draw => parts.forEach(p => clipTo(p, draw));
  if (P === 'blanket' || P === 'snowcap') {
    clipTo(H_body, () => {
      fillOnly(blanketShape, coat.white);
      g.fillStyle = coat.white; seed = 31; for (let i = 0; i < 26; i++) { const t = i / 26; g.beginPath(); C(20 - t * 118 + R(-5, 5), -168 + t * 74 + R(-5, 5) + (t > 0.3 ? (t - 0.3) * -10 : 0), R(2, 4.5)); g.fill(); }
      if (P === 'blanket') { g.fillStyle = coat.spot; for (const [sx, sy, r, a] of spotsList(16, [-100, -158, 0, -86], 4, 8.5, 5)) clipTo(blanketShape, () => { g.beginPath(); E(sx, sy, r * 1.15, r, a); g.fill(); }); }
    });
  } else if (P === 'leopard' || P === 'fewspot') {
    const spots = P === 'leopard' ? spotsList(70, [-110, -300, 160, 0], 4, 8.5, 9) : spotsList(12, [-100, -170, 80, -90], 2.5, 4.5, 4);
    each(() => { g.fillStyle = coat.spot; g.beginPath(); for (const [sx, sy, r, a] of spots) E(sx, sy, r * 1.2, r, a); g.fill(); });
    if (P === 'fewspot') each(() => { g.fillStyle = rgba(coat.spot, 0.3); for (const L of [legs.nf, legs.nh]) { g.beginPath(); C(L[1][0], L[1][1], 10); C(L[2][0], L[2][1] + 4, 9); g.fill(); } g.beginPath(); E(-60, -96, 26, 14, 0.4); g.fill(); });
  } else if (P === 'snowflake') {
    const flakes = spotsList(90, [-110, -175, 95, -70], 1.6, 3.6, 12);
    clipTo(H_body, () => { g.fillStyle = coat.spot; g.beginPath(); seed = 77; for (const [sx, sy, r] of flakes) { if (sx > 40 && rnd() < 0.5) continue; C(sx, sy, r); } g.fill(); });
    const nf = spotsList(18, [10, -300, 160, -150], 1.4, 2.6, 13); each(() => { g.fillStyle = 'rgba(251,247,240,.75)'; g.beginPath(); for (const [sx, sy, r] of nf) C(sx, sy, r); g.fill(); });
  } else if (P === 'frost') {
    const dots = spotsList(300, [-105, -170, 30, -90], 0.9, 2.2, 23);
    clipTo(H_body, () => { g.fillStyle = 'rgba(251,247,240,.85)'; g.beginPath(); for (const [sx, sy, r] of dots) { if (sy > -120 + (sx + 105) * 0.25) continue; C(sx, sy, r); } g.fill(); g.fillStyle = 'rgba(251,247,240,.28)'; g.beginPath(); E(-50, -146, 52, 16, 0); g.fill(); });
  } else if (P === 'varnish') {
    const dots = spotsList(520, [-110, -310, 165, 0], 0.8, 1.8, 21);
    each(() => { g.fillStyle = 'rgba(239,226,212,.75)'; g.beginPath(); for (const [sx, sy, r] of dots) { if (sy < -200 && sx > 100) continue; C(sx, sy, r); } g.fill(); });
    clipTo(H_body, () => { g.fillStyle = 'rgba(239,226,212,.45)'; g.beginPath(); E(-30, -125, 60, 32, 0); g.fill(); });
  } else if (P === 'tobiano') {
    clipTo(H_body, () => fillOnly(() => { g.moveTo(-40, -175); g.bezierCurveTo(-30, -130, -60, -110, -40, -70); g.lineTo(30, -70); g.bezierCurveTo(10, -110, 40, -130, 20, -175); g.closePath(); g.moveTo(-90, -175); g.bezierCurveTo(-80, -140, -100, -120, -95, -100); g.lineTo(-115, -100); g.lineTo(-115, -175); g.closePath(); }, coat.white));
    withNeck(pose, () => clipTo(H_neck, () => fillOnly(() => { g.moveTo(20, -160); g.bezierCurveTo(50, -190, 60, -170, 92, -130); g.lineTo(92, -100); g.lineTo(10, -100); g.closePath(); }, coat.white)));
  } else if (P === 'overo') {
    clipTo(H_body, () => fillOnly(() => { g.moveTo(-70, -78); g.bezierCurveTo(-74, -104, -50, -120, -30, -112); g.bezierCurveTo(-14, -132, 16, -126, 24, -108); g.bezierCurveTo(44, -112, 62, -100, 58, -78); g.closePath(); }, coat.white));
    withNeck(pose, () => clipTo(() => { H_skull(); H_muzzle(); H_bridge(); }, () => fillOnly(() => { g.moveTo(92, -266); g.lineTo(118, -262); g.lineTo(164, -214); g.lineTo(140, -180); g.lineTo(100, -214); g.closePath(); }, coat.white)));
  } else if (P === 'tovero') {
    each(() => { g.fillStyle = coat.white; g.fillRect(-200, -400, 400, 420); });
    clipTo(H_body, () => { fillOnly(() => { E(74, -122, 30, 34, 0); E(-78, -132, 26, 22, 0.3); }, coat.base); });
    withNeck(pose, () => clipTo(H_skull, () => fillOnly(() => { E(84, -262, 30, 18, 0); }, coat.base)));
    withNeck(pose, () => fillOnly(H_earN, coat.base));
  }
  if (coat.dapple || P === 'dapple') clipTo(H_body, () => { seed = 3; for (let i = 0; i < 22; i++) { const x = R(-100, 80), y = R(-160, -90), r = R(5, 10); g.strokeStyle = 'rgba(120,128,140,.55)'; g.lineWidth = 4; g.beginPath(); C(x, y, r); g.stroke(); } g.fillStyle = 'rgba(255,255,255,.25)'; g.beginPath(); E(-20, -150, 70, 14, 0); g.fill(); });
  if (coat.roan) { const dots = spotsList(380, [-110, -175, 100, -70], 0.8, 1.7, 41); clipTo(H_body, () => { g.fillStyle = 'rgba(235,235,240,.55)'; g.beginPath(); for (const [sx, sy, r] of dots) C(sx, sy, r); g.fill(); }); }
  if (coat.dun) { clipTo(H_body, () => strokeOnly(() => { g.moveTo(-96, -146); g.bezierCurveTo(-60, -158, -20, -160, 14, -154); }, shade(coat.base, -0.45), 4)); for (const L of [legs.nf]) { g.strokeStyle = rgba(shade(coat.base, -0.5), 0.5); g.lineWidth = 2; for (let k = 0; k < 3; k++) { const yy = L[1][1] - 18 + k * 6; g.beginPath(); g.moveTo(L[1][0] - 8, yy); g.lineTo(L[1][0] + 8, yy + 2); g.stroke(); } } }
  if (coat.points) for (const L of [legs.nf, legs.nh]) legParts([[L[1][0] * 0.4 + L[2][0] * 0.6, L[1][1] * 0.4 + L[2][1] * 0.6], L[2], L[3]], [15, 14, 13]).forEach(p => fillOnly(p, coat.mane));
}
