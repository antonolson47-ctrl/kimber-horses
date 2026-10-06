/* ===================== UI: immediate-mode hit regions, buttons, scrolling, modals, FX ===================== */
let HITS = [], LAST = [], BOXES = [], LASTBOX = [], LAYER = 0, CLIPS = [];
const PTR = new Map(); const HELD = new Set(); const HELDT = {};
function heldSecs(id) { return HELD.has(id) && HELDT[id] ? (performance.now() - HELDT[id]) / 1000 : 0; } let PRESSED = null;
const SCROLL = {};
function lay() { const W = VW, H = VH, port = H >= W, mn = Math.min(W, H), tab = mn >= 600; const u = clamp(mn / 390, 0.82, tab ? 1.7 : 1.15);
  return { W, H, port, tab, u, x0: SA.l, y0: SA.t, x1: W - SA.r, y1: H - SA.b, cw: W - SA.l - SA.r, ch: H - SA.t - SA.b }; }
function curClip() { return CLIPS.length ? CLIPS[CLIPS.length - 1] : null; }
function interRect(a, b) { const x = Math.max(a.x, b.x), y = Math.max(a.y, b.y), x2 = Math.min(a.x + a.w, b.x + b.w), y2 = Math.min(a.y + a.h, b.y + b.h); return x2 > x && y2 > y ? { x, y, w: x2 - x, h: y2 - y } : null; }
function hit(id, x, y, w, h, o = {}) { let r = { x, y, w, h }; const c = curClip(); if (c) { r = interRect(r, c); if (!r) return; if (r.w < w - 1 || r.h < h - 1) r.clipped = 1; }
  HITS.push(Object.assign({ id, layer: LAYER }, r, o)); }
function box(id, x, y, w, h) { let r = { x, y, w, h }; const c = curClip(); if (c) { r = interRect(r, c); if (!r) return; } BOXES.push(Object.assign({ id, layer: LAYER }, r)); }
function pushClip(x, y, w, h) { const c = curClip(); let r = { x, y, w, h }; if (c) r = interRect(r, c) || { x, y, w: 0, h: 0 }; CLIPS.push(r); g.save(); g.beginPath(); g.rect(r.x, r.y, r.w, r.h); g.clip(); }
function popClip() { CLIPS.pop(); g.restore(); }
function topLayer(list) { let m = 0; for (const h of list) if (h.layer > m) m = h.layer; return m; }
function hitAt(x, y, list = LAST) { const m = topLayer(list); for (let i = list.length - 1; i >= 0; i--) { const h = list[i]; if (h.layer !== m || h.scroll) continue; if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) return h; } return null; }
function scrollAt(x, y) { const m = topLayer(LAST); for (let i = LAST.length - 1; i >= 0; i--) { const h = LAST[i]; if (!h.scroll || h.layer !== m) continue; if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) return h; } return null; }
function isPressed(id) { return PRESSED === id; }
// scroll area: returns current offset; content drawn translated by -offset
function scrollArea(id, x, y, w, h, contentLen, horiz) {
  const st = SCROLL[id] || (SCROLL[id] = { v: 0, vel: 0, drag: false }); st.max = Math.max(0, contentLen - (horiz ? w : h));
  if (!st.drag) { st.v += st.vel * DT; st.vel *= Math.pow(0.04, DT); if (Math.abs(st.vel) < 5) st.vel = 0; }
  if (st.v < 0) { st.v = st.drag ? st.v : lerp(st.v, 0, 0.3); if (!st.drag && st.v > -0.5) st.v = 0; }
  if (st.v > st.max) { st.v = st.drag ? st.v : lerp(st.v, st.max, 0.3); if (!st.drag && st.v - st.max < 0.5) st.v = st.max; }
  hit('scroll_' + id, x, y, w, h, { scroll: st, horiz: !!horiz });
  return st.v;
}
function scrollBar(id, x, y, w, h, horiz) { const st = SCROLL[id]; if (!st || st.max <= 1) return; const len = horiz ? w : h, tot = len + st.max, frac = len / tot, pos = clamp(st.v / st.max, 0, 1);
  g.fillStyle = 'rgba(59,39,65,.25)'; if (horiz) { g.beginPath(); RR(x + pos * (w - w * frac), y + h - 6, w * frac, 4, 2); g.fill(); } else { g.beginPath(); RR(x + w - 6, y + pos * (h - h * frac), 4, h * frac, 2); g.fill(); } }
function scrollTo(id, v) { const st = SCROLL[id]; if (st) { st.v = clamp(v, 0, st.max || 0); st.vel = 0; } else SCROLL[id] = { v: Math.max(0, v), vel: 0 }; }
/* ---------- drawing widgets ---------- */
function btn(id, x, y, w, h, label, o = {}) {
  const col = o.col || '#8a5cd6', p = isPressed(id) && !o.disabled ? 3 : 0, r = o.r != null ? o.r : Math.min(h / 2, 26);
  g.save(); if (o.disabled) g.globalAlpha = 0.5;
  g.save(); g.shadowColor = 'rgba(40,20,60,.3)'; g.shadowBlur = 8; g.shadowOffsetY = 4; g.beginPath(); RR(x, y + 4, w, h - 2, r); g.fillStyle = shade(col, -0.3); g.fill(); g.restore();
  g.beginPath(); RR(x, y + p, w, h - 4, r); g.fillStyle = lin(0, y, 0, y + h, [[0, shade(col, 0.22)], [1, col]]); g.fill(); g.lineWidth = Math.max(2.5, h * 0.05); g.strokeStyle = INK; g.stroke();
  g.beginPath(); RR(x + r * 0.5, y + p + 4, w - r, Math.max(4, h * 0.18), Math.max(2, h * 0.09)); g.fillStyle = 'rgba(255,255,255,.28)'; g.fill();
  const fs = o.fs || Math.min(h * 0.42, 28); let tx = x + w / 2;
  if (o.icon) { const ir = Math.min(h * 0.3, 20); const lw2 = label ? measure(label, fs, F.title, 400) : 0; const tot = ir * 2 + (label ? 8 + lw2 : 0); const ix = x + w / 2 - tot / 2 + ir; o.icon(ix, y + p + h / 2 - 2, ir); tx = ix + ir + 8 + lw2 / 2; if (label) text(label, tx, y + p + h / 2 - 1, fs, o.tc || '#fff', { fam: F.title, w: 400, stroke: o.ts || shade(col, -0.45), sw: fs * 0.2, max: w - tot + lw2 - 10 }); }
  else if (label) text(label, tx, y + p + h / 2 - 1, fs, o.tc || '#fff', { fam: F.title, w: 400, stroke: o.ts || shade(col, -0.45), sw: fs * 0.2, max: w - 16 });
  if (o.badge) { shape(() => C(x + w - 6, y + 6, 11), '#ff5a6e', 2.2); text(String(o.badge), x + w - 6, y + 7, 13, '#fff', { fam: F.title, w: 400 }); }
  g.restore();
  if (!o.noHit) hit(id, x, y, w, h, { fn: o.disabled ? (o.onDisabled || null) : o.fn, sfx: o.sfx, dis: !!o.disabled });
}
function ibtn(id, cx, cy, r, icon, o = {}) {
  const col = o.col || '#ffffff', p = isPressed(id) ? 2 : 0;
  g.save(); g.shadowColor = 'rgba(40,20,60,.28)'; g.shadowBlur = 6; g.shadowOffsetY = 3; g.beginPath(); C(cx, cy + 2, r); g.fillStyle = shade(col, -0.25); g.fill(); g.restore();
  shape(() => C(cx, cy + p, r), col, Math.max(2.5, r * 0.1));
  if (o.ring != null) { strokeOnly(() => g.arc(cx, cy + p, r + 4, -Math.PI / 2, -Math.PI / 2 + TAU * o.ring), '#ff9f43', 5); }
  icon(cx, cy + p, r * 0.62);
  if (o.label) text(o.label, cx, cy + r + (o.lfs || 12) * 0.9, o.lfs || 12, o.lc || INK, { fam: F.ui, w: 800, stroke: o.lstroke, sw: 4 });
  if (!o.noHit) { const pad = Math.max(0, (o.minHit || 0) / 2 - r); let hx = cx - r - pad, hy = cy - r - pad, hw = (r + pad) * 2, hh = hw; if (pad > 0) { const nx = Math.max(0, hx), ny = Math.max(0, hy); hw -= nx - hx; hh -= ny - hy; hx = nx; hy = ny; hw = Math.min(hw, VW - hx); hh = Math.min(hh, VH - hy); } hit(id, hx, hy, hw, hh, { fn: o.fn, hold: o.hold }); }
}
function speakBtn(id, cx, cy, r, getText, o = {}) { ibtn(id, cx, cy, r, (x, y, rr) => icSpeaker(x, y, rr, Voice.speaking === id ? '#ff6f91' : '#3a6fd0'), Object.assign({ col: '#ffffff', fn: () => Voice.toggle(id, typeof getText === 'function' ? getText() : getText) }, o)); }
function card(x, y, w, h, title, col = '#8a5cd6', o = {}) { panel(x, y, w, h, o.r || 22, o.fill || '#ffffff', { lw: 3 }); if (title) { const fs = o.fs || 19; const tw = measure(title, fs, F.title, 400) + 34; shape(() => RR(x + 18, y - fs * 0.85, Math.min(w - 36, tw), fs * 1.8, fs * 0.9), col, 3); text(title, x + 35, y + 1, fs, '#fff', { align: 'left', fam: F.title, w: 400, max: w - 70 }); } }
function bubble(x, y, w, h, tx, ty, lines, px = 20, col = '#fff') {
  shape(() => RR(x, y, w, h, Math.min(22, h / 2)), col, 3.5);
  const bx0 = clamp(tx - w * 0.08, x + 18, x + w - 40), bx1 = bx0 + Math.min(30, w * 0.15); const below = ty > y + h;
  const by = below ? y + h - 2 : y + 2;
  fillOnly(() => { g.moveTo(bx0, by); g.lineTo(tx, ty); g.lineTo(bx1, by); g.closePath(); }, col);
  strokeOnly(() => { g.moveTo(bx0, below ? y + h : y); g.lineTo(tx, ty); g.lineTo(bx1, below ? y + h : y); }, INK, 3.5);
  const lh = px * 1.25, top = y + h / 2 - (lines.length * lh) / 2 + lh / 2;
  lines.forEach((l, i) => text(l, x + w / 2, top + i * lh, px, INK, { fam: F.body, w: 700, max: w - 20 }));
}
function dim(a = 0.45) { g.fillStyle = `rgba(40,20,70,${a})`; g.fillRect(0, 0, VW, VH); }
function backdropHit(fn) { hit('backdrop', 0, 0, VW, VH, { fn, bg: 1 }); }
/* ---------- toasts & confetti ---------- */
const FX = { parts: [], toasts: [] };
function toast(msg, col = '#7446c4', dur = 2.2) { FX.toasts.push({ msg, col, t: 0, dur }); if (FX.toasts.length > 3) FX.toasts.shift(); }
function confetti(x, y, n = 60, spread = 1) { for (let i = 0; i < n; i++) { const a = Math.random() * TAU, v = (200 + Math.random() * 420) * spread; FX.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 260 * spread, r: 4 + Math.random() * 5, c: RIBBON[i % 7], rot: Math.random() * 6, vr: (Math.random() - 0.5) * 12, t: 0, life: 1.6 + Math.random() * 1.2, k: Math.random() < 0.3 ? 'heart' : Math.random() < 0.5 ? 'star' : 'rect' }); } }
function heartsUp(x, y, n = 8) { for (let i = 0; i < n; i++) FX.parts.push({ x: x + (Math.random() - 0.5) * 60, y, vx: (Math.random() - 0.5) * 60, vy: -120 - Math.random() * 120, r: 8 + Math.random() * 8, c: ['#ff6f91', '#ff9ab5', '#ffb3c7'][i % 3], rot: 0, vr: 0, t: 0, life: 1.6, k: 'heart', float: 1 }); }
function fxUpdate(dt) { for (const p of FX.parts) { p.t += dt; if (!p.float) { p.vy += 700 * dt; p.vx *= Math.pow(0.5, dt); } p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; } FX.parts = FX.parts.filter(p => p.t < p.life && p.y < VH + 40); for (const t of FX.toasts) t.t += dt; FX.toasts = FX.toasts.filter(t => t.t < t.dur); }
function fxDraw() {
  for (const p of FX.parts) { g.save(); g.globalAlpha = clamp((p.life - p.t) / 0.4, 0, 1); g.translate(p.x, p.y); g.rotate(p.rot);
    if (p.k === 'heart') shape(() => heart(0, 0, p.r), p.c, 1.5); else if (p.k === 'star') shape(() => star(0, 0, p.r), p.c, 1.2); else { g.fillStyle = p.c; g.fillRect(-p.r, -p.r * 0.45, p.r * 2, p.r * 0.9); } g.restore(); }
  const L = lay(); let y = L.y0 + 118 * Math.min(L.u, 1.3);
  for (const t of FX.toasts) { const a = clamp(Math.min(t.t / 0.2, (t.dur - t.t) / 0.3), 0, 1); g.save(); g.globalAlpha = a; const fs = 17 * Math.min(L.u, 1.3); const w = Math.min(L.cw - 20, measure(t.msg, fs, F.title, 400) + 40); panel(VW / 2 - w / 2, y - 22, w, 44, 22, t.col, { lw: 3 }); text(t.msg, VW / 2, y, fs, '#fff', { fam: F.title, w: 400, max: w - 20 }); g.restore(); y += 52; }
}
/* ---------- scenes ---------- */
let scene = null, nextScene = null, fadeT = 0, fadeDir = 0, sceneArg = null;
const SC = {};
function go(sc, arg, instant) { if (instant || !scene) { swapScene(sc, arg); return; } nextScene = sc; sceneArg = arg; fadeDir = 1; }
function swapScene(sc, arg) { if (scene && scene.exit) scene.exit(); scene = sc; Voice.stop(); for (const k in SCROLL) if (k.startsWith('tmp')) delete SCROLL[k]; HELD.clear(); PRESSED = null; if (sc.enter) sc.enter(arg); AUD_LOG('scene_' + sc.name); }
function fadeUpdate(dt) { if (fadeDir === 1) { fadeT += dt / 0.22; if (fadeT >= 1) { fadeT = 1; swapScene(nextScene, sceneArg); nextScene = null; fadeDir = -1; } } else if (fadeDir === -1) { fadeT -= dt / 0.25; if (fadeT <= 0) { fadeT = 0; fadeDir = 0; } } }
function fadeDraw() { if (fadeT > 0) { g.fillStyle = `rgba(116,70,196,${fadeT})`; g.fillRect(0, 0, VW, VH); } }
// common top bar: back button + title + optional right content; returns bar height
function topBar(title, back, o = {}) {
  const L = lay(), h = Math.round(clamp(54 * L.u, 52, 78)) + L.y0;
  g.fillStyle = lin(0, 0, 0, h, [[0, o.col || '#8a5cd6'], [1, shade(o.col || '#8a5cd6', -0.12)]]); g.fillRect(0, 0, VW, h); strokeOnly(() => { g.moveTo(0, h); g.lineTo(VW, h); }, INK, 3);
  const r = (h - L.y0) * 0.38, cy = L.y0 + (h - L.y0) / 2;
  if (back) ibtn('back', L.x0 + 10 + r, cy, r, (x, y, rr) => icBack(x, y, rr), { fn: back, minHit: 56 });
  const fs = clamp(26 * L.u, 22, 36); const tl = back ? L.x0 + 22 + r * 2 : L.x0 + 14;
  const right = o.rightW || 0;
  text(title, o.center ? VW / 2 : tl, cy + 1, fs, '#fff', { align: o.center ? 'center' : 'left', fam: F.title, w: 400, stroke: shade(o.col || '#8a5cd6', -0.5), sw: 6, max: (o.center ? VW - 2 * (tl + right) : VW - tl - right - 16 - L.x0) });
  return h;
}
function shoeCounter(x, y, h, n) { const w = measure(String(n), h * 0.55, F.title, 400) + h * 1.5; panel(x - w, y, w, h, h / 2, '#fff', { lw: 2.5, shadow: false }); horseshoe(x - w + h * 0.55, y + h * 0.56, h * 0.26); text(String(n), x - h * 0.4, y + h / 2 + 1, h * 0.55, INK, { fam: F.title, w: 400, align: 'right' }); return w; }
