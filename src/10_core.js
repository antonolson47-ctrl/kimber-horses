'use strict';
/* ===================== CORE: canvas, drawing helpers (from the concept-art rig), utils, save ===================== */
const INK = '#3b2741';
const TAU = Math.PI * 2;
const cv = document.getElementById('cv');
let g = cv.getContext('2d');
let DPR = 1, VW = 390, VH = 844, T = 0, DT = 0;
let SA = { t: 0, r: 0, b: 0, l: 0 };
const QS = new URLSearchParams(location.search);
// deterministic art rng (used by coat patterns / scenery so art is stable frame to frame)
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const R = (a, b) => a + rnd() * (b - a);
function srng(s) { let x = (s >>> 0) || 1; return () => { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const pick = a => a[Math.floor(Math.random() * a.length)];
const easeOut = t => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
const easeInOut = t => { t = clamp(t, 0, 1); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const easeBack = t => { t = clamp(t, 0, 1); const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const F = { title: 'Lilita One', head: 'Fredoka', body: 'Andika', ui: 'Baloo 2' };
function font(px, fam = F.head, w = 600) { g.font = `${w} ${px}px "${fam}"`; }
// --- shapes (subpath builders: call inside a beginPath) ---
function E(x, y, rx, ry, rot = 0) { g.moveTo(x + Math.cos(rot) * rx, y + Math.sin(rot) * rx); g.ellipse(x, y, Math.max(0.01, rx), Math.max(0.01, ry), rot, 0, TAU); }
function C(x, y, r) { g.moveTo(x + r, y); g.arc(x, y, Math.max(0.01, r), 0, TAU); }
function RR(x, y, w, h, r) { r = Math.max(0, Math.min(r, w / 2, h / 2)); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function poly(pts) { g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); }
function shape(fn, fill, lw = 3, ink = INK) { g.beginPath(); fn(); if (lw) { g.lineWidth = lw; g.strokeStyle = ink; g.stroke(); } if (fill) { g.fillStyle = fill; g.fill(); } }
function fillOnly(fn, fill) { g.beginPath(); fn(); g.fillStyle = fill; g.fill(); }
function strokeOnly(fn, col, lw) { g.beginPath(); fn(); g.strokeStyle = col; g.lineWidth = lw; g.stroke(); }
// merged-outline group: stroke every part thick, then fill every part -> one clean outline around the union
function group(parts, lw = 3.2, ink = INK) {
  for (const p of parts) { g.beginPath(); p[0](); g.lineWidth = lw * 2; g.strokeStyle = p[2] || ink; g.stroke(); }
  for (const p of parts) { g.beginPath(); p[0](); g.fillStyle = p[1]; g.fill(); }
}
function clipTo(fn, draw) { g.save(); g.beginPath(); fn(); g.clip(); draw(); g.restore(); }
function lin(x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach(s => gr.addColorStop(s[0], s[1])); return gr; }
function rad(x, y, r0, r1, stops) { const gr = g.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(s => gr.addColorStop(s[0], s[1])); return gr; }
const _shc = new Map();
function shade(hex, amt) { const k = hex + amt; let r0 = _shc.get(k); if (r0) return r0;
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, gg = (n >> 8) & 255, b = n & 255;
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round((t - r) * p + r); gg = Math.round((t - gg) * p + gg); b = Math.round((t - b) * p + b);
  r0 = '#' + ((1 << 24) + (r << 16) + (gg << 8) + b).toString(16).slice(1); _shc.set(k, r0); return r0; }
function rgba(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
function text(s, x, y, px, col, o = {}) {
  font(px, o.fam || F.head, o.w || 600); g.textAlign = o.align || 'center'; g.textBaseline = o.base || 'middle';
  if (o.max) { const w = g.measureText(s).width; if (w > o.max) { px = px * o.max / w; font(px, o.fam || F.head, o.w || 600); } }
  if (o.stroke) { g.lineWidth = o.sw || px * 0.22; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); }
  if (o.shadow) { g.save(); g.fillStyle = o.shadow; g.fillText(s, x, y + (o.sd || px * 0.08)); g.restore(); }
  g.fillStyle = col; g.fillText(s, x, y); return px;
}
function measure(s, px, fam = F.head, w = 600) { font(px, fam, w); return g.measureText(s).width; }
function wrapLines(s, maxW, px, fam = F.body, w = 400) {
  font(px, fam, w); const out = [];
  for (const para of String(s).split('\n')) { const words = para.split(' '); let line = '';
    for (const wd of words) { const t = line ? line + ' ' + wd : wd; if (g.measureText(t).width > maxW && line) { out.push(line); line = wd; } else line = t; }
    out.push(line); }
  return out;
}
function wrap(s, x, y, maxW, px, col, lh = 1.3, o = {}) {
  const lines = wrapLines(s, maxW, px, o.fam || F.body, o.w || 400);
  g.textAlign = o.align || 'left'; g.textBaseline = 'top'; g.fillStyle = col; let yy = y;
  for (const l of lines) { if (o.stroke) { g.lineWidth = o.sw || px * 0.2; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(l, x, yy); } g.fillText(l, x, yy); yy += px * lh; }
  return yy;
}
function star(x, y, r, n = 5, inner = 0.45) { for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r * inner : r; const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.closePath(); }
function heart(x, y, s) { g.moveTo(x, y + s * 0.35); g.bezierCurveTo(x - s * 1.1, y - s * 0.35, x - s * 0.45, y - s * 1.05, x, y - s * 0.45); g.bezierCurveTo(x + s * 0.45, y - s * 1.05, x + s * 1.1, y - s * 0.35, x, y + s * 0.35); g.closePath(); }
function sparkle(x, y, r, col = '#fff') { g.fillStyle = col; g.beginPath(); g.moveTo(x, y - r); g.quadraticCurveTo(x + r * 0.15, y - r * 0.15, x + r, y); g.quadraticCurveTo(x + r * 0.15, y + r * 0.15, x, y + r); g.quadraticCurveTo(x - r * 0.15, y + r * 0.15, x - r, y); g.quadraticCurveTo(x - r * 0.15, y - r * 0.15, x, y - r); g.fill(); }
function groundShadow(x, y, rx, ry, a = 0.22) { g.fillStyle = `rgba(40,20,50,${a})`; g.beginPath(); E(x, y, rx, ry); g.fill(); }
function panel(x, y, w, h, r, fill, o = {}) {
  if (o.shadow !== false) { g.save(); g.shadowColor = 'rgba(40,20,60,.28)'; g.shadowBlur = o.blur || 14; g.shadowOffsetY = o.sy || 5; g.beginPath(); RR(x, y, w, h, r); g.fillStyle = fill; g.fill(); g.restore(); }
  else { g.beginPath(); RR(x, y, w, h, r); g.fillStyle = fill; g.fill(); }
  if (o.line !== false) { g.beginPath(); RR(x, y, w, h, r); g.lineWidth = o.lw || 3; g.strokeStyle = o.ink || INK; g.stroke(); }
}
// offscreen canvases
function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; }
function drawInto(c, fn, scale = 1) { const og = g; g = c.getContext('2d'); g.save(); g.setTransform(scale, 0, 0, scale, 0, 0); g.lineJoin = 'round'; g.lineCap = 'round'; try { fn(); } finally { g.restore(); g = og; } return c; }
// sprite cache (keyed; cleared on resize / DPR change)
const SPR = new Map();
let SPRPX = 0; const SPR_BUDGET = 36e6; // ~144 MB of canvas pixels: stays well under iOS Safari's canvas memory limit
function sprite(key, w, h, fn) { const k = key + '|' + DPR; let c = SPR.get(k);
  if (c) { SPR.delete(k); SPR.set(k, c); return c; }
  c = mkCanvas(w * DPR, h * DPR); drawInto(c, fn, DPR); SPR.set(k, c); SPRPX += c.width * c.height;
  while ((SPRPX > SPR_BUDGET || SPR.size > 700) && SPR.size > 1) { const [fk, fc] = SPR.entries().next().value; if (fc === c) break; SPR.delete(fk); SPRPX -= fc.width * fc.height; }
  return c; }
function sprClear() { SPR.clear(); SPRPX = 0; }
function blit(c, x, y, w, h) { g.drawImage(c, x, y, w, h); }

/* ---------- save ---------- */
const SAVE_KEY = 'kimber_rainbow_ribbon_v1';
function freshSave() {
  return { v: 1, started: false, horses: [], cur: 0, stalls: 3,
    prog: { prologue: [0], ch: Array.from({ length: 7 }, () => ({ races: [0, 0, 0], grand: false })), finale: false, seen: {} },
    shoes: 0, jarNext: 100, golden: 0, stickers: {}, rosettes: [], unlocked: {}, kim: { helmet: 0, polo: 0 },
    set: { music: 0.7, sfx: 0.9, voice: true, autoRead: true, helper: false, slow: false, swap: false, unlockAll: false, unlockLands: false },
    stats: { races: 0, jumps: 0, stops: 0, hugs: 0, inters: 0 }, last: Date.now(),
    wallet: 0, inter: { c: [0, 0, 0, 0, 0, 0, 0], a: [0, 0, 0, 0, 0, 0, 0] }, build: { own: {} }, shop: { built: 0, own: {} }, truck: { p: {}, tok: 0, day: '', rep: null, drives: 0 }, fix: { tok: 0, day: '' }, foal: null, facts: {} };
}
let S = freshSave();
function migrate(d) { const f = freshSave(); if (d.wallet === undefined) d.wallet = d.shoes || 0; for (const k of ['inter', 'build', 'shop', 'truck', 'fix']) if (d[k] && typeof d[k] === 'object') { for (const kk in f[k]) if (d[k][kk] === undefined) d[k][kk] = f[k][kk]; } for (const k in f) if (d[k] === undefined) d[k] = f[k]; for (const k in f.set) if (d.set[k] === undefined) d.set[k] = f.set[k]; for (const k in f.prog) if (d.prog[k] === undefined) d.prog[k] = f.prog[k]; for (const k in f.stats) if (d.stats[k] === undefined) d.stats[k] = f.stats[k]; return d; }
function loadSave() { try { const raw = localStorage.getItem(SAVE_KEY); if (raw) { const d = JSON.parse(raw); if (d && d.v === 1) S = migrate(d); } } catch (e) { S = freshSave(); } }
let saveT = 0;
function save() { try { S.last = Date.now(); localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { } }
const HORSE = () => S.horses[S.cur] || S.horses[0] || null;
