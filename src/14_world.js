/* ===================== WORLD: scenery, props, icons, Whirligig (from the concept-art rig + land props) ===================== */
const RIBBON = ['#ff5a6e', '#ff9f43', '#ffd93d', '#6bd66b', '#4cc3ff', '#5b6cff', '#b06bff'];
function sky(W, H, top = '#8fd3ff', bot = '#ffe9f4') { g.fillStyle = lin(0, 0, 0, H, [[0, top], [1, bot]]); g.fillRect(0, 0, W, H); }
function sun(x, y, r) { g.fillStyle = rad(x, y, r * 0.3, r * 2.4, [[0, 'rgba(255,248,200,.9)'], [1, 'rgba(255,248,200,0)']]); g.beginPath(); C(x, y, r * 2.4); g.fill(); shape(() => C(x, y, r), '#fff3a8', 0); }
function cloud(x, y, s, col = '#fff', a = 1) { g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s); g.fillStyle = 'rgba(120,140,200,.18)'; g.beginPath(); E(0, 14, 62, 12); g.fill(); g.fillStyle = col; g.beginPath(); C(-34, 0, 24); C(-6, -14, 30); C(26, -4, 26); C(48, 6, 18); E(4, 8, 60, 16); g.fill(); g.restore(); }
// the Rainbow Ribbon: 7 colored threads across the sky. missing = indexes that have been scattered
function ribbon(x0, y0, x1, y1, amp, w, o = {}) {
  const n = 7, sw = w / n;
  for (let i = 0; i < n; i++) {
    const missing = o.missing && o.missing.includes(i);
    g.save(); g.globalAlpha = missing ? (o.ghost || 0.12) : (o.alpha || 0.95);
    g.strokeStyle = RIBBON[i]; g.lineWidth = sw + 0.6; g.lineCap = 'butt';
    g.beginPath(); const off = (i - 3) * sw;
    for (let t = 0; t <= 1.0001; t += 0.02) { const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI * 2 + (o.ph || 0)) * amp + off; t ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.stroke(); g.restore();
  }
  // sparkles
  seed = o.seed || 4; for (let k = 0; k < (o.sparkles || 10); k++) { const t = rnd(); sparkle(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + Math.sin(t * Math.PI * 2 + (o.ph || 0)) * amp + R(-w, w), R(3, 7), 'rgba(255,255,255,.9)'); }
}
function hills(W, y, col, amp, ph, H) { g.fillStyle = col; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W + 10; x += 10) g.lineTo(x, y + Math.sin(x / 140 + ph) * amp + Math.sin(x / 57 + ph * 2) * amp * 0.3); g.lineTo(W, H); g.closePath(); g.fill(); }
function mountains(W, y, col, H, sd = 2, k = 1) { seed = sd; g.fillStyle = col; g.beginPath(); g.moveTo(0, H); let x = -40; g.lineTo(x, y); while (x < W + 60) { const w = R(90, 170) * k, h = R(50, 120) * k; g.lineTo(x + w / 2, y - h); g.lineTo(x + w, y); x += w * 0.8; } g.lineTo(W + 60, H); g.closePath(); g.fill();
  // snow caps
}
function tree(x, y, s, col = '#5cbf6a') { g.save(); g.translate(x, y); g.scale(s, s); shape(() => RR(-6, -40, 12, 42, 4), '#8a5a3a', 2.4); shape(() => { C(0, -62, 30); C(-22, -46, 20); C(22, -46, 20); }, col, 2.6); fillOnly(() => C(-8, -72, 9), 'rgba(255,255,255,.25)'); for (const [ax, ay] of [[-12, -52], [10, -64], [16, -44]]) shape(() => C(ax, ay, 4.5), '#ff5a6e', 1.6); g.restore(); }
function flower(x, y, s, col) { g.save(); g.translate(x, y); g.scale(s, s); strokeOnly(() => { g.moveTo(0, 0); g.lineTo(0, -14); }, '#3f9a4c', 2); for (let k = 0; k < 5; k++) { const a = k * TAU / 5; fillOnly(() => C(Math.cos(a) * 4.5, -16 + Math.sin(a) * 4.5, 3.8), col); } fillOnly(() => C(0, -16, 2.6), '#ffe27a'); g.restore(); }
function sunflower(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); strokeOnly(() => { g.moveTo(0, 0); g.lineTo(0, -46); }, '#3f8a3c', 4); fillOnly(() => E(-8, -24, 8, 4, 0.5), '#4caf50'); for (let k = 0; k < 12; k++) { const a = k * TAU / 12; fillOnly(() => E(Math.cos(a) * 10, -50 + Math.sin(a) * 10, 7, 3.5, a), '#ffc928'); } shape(() => C(0, -50, 7.5), '#7a4a1e', 1.6); g.restore(); }
function fence(x0, x1, y, s = 1, col = '#ffffff') {
  for (let x = x0; x <= x1; x += 60 * s) shape(() => RR(x - 4 * s, y - 34 * s, 8 * s, 36 * s, 3 * s), col, 2);
  shape(() => { RR(x0 - 6, y - 28 * s, x1 - x0 + 12, 6 * s, 3); RR(x0 - 6, y - 14 * s, x1 - x0 + 12, 6 * s, 3); }, col, 2);
}
function academy(x, y, s, o = {}) {
  g.save(); g.translate(x, y); g.scale(s, s);
  const stone = o.dim ? '#d9cfd8' : '#f6ead9', roof = o.dim ? '#7c6f9a' : '#8a5cd6', roof2 = shade(roof, -0.18);
  // wings
  for (const side of [-1, 1]) {
    g.save(); g.scale(side, 1);
    shape(() => { RR(60, -120, 150, 120, 6); }, stone, 3);
    shape(() => { g.moveTo(50, -116); g.lineTo(220, -116); g.lineTo(190, -160); g.lineTo(76, -160); g.closePath(); }, roof, 3);
    for (const dx of [88, 150]) { shape(() => { g.moveTo(dx - 20, 0); g.lineTo(dx - 20, -50); g.arc(dx, -50, 20, Math.PI, 0); g.lineTo(dx + 20, 0); g.closePath(); }, '#c26b3e', 2.6); strokeOnly(() => { g.moveTo(dx - 20, -42); g.lineTo(dx + 20, -2); g.moveTo(dx + 20, -42); g.lineTo(dx - 20, -2); }, '#f3d7b6', 3); strokeOnly(() => { g.moveTo(dx, -70); g.lineTo(dx, 0); }, '#8a4a2a', 2); }
    for (const dx of [88, 150]) shape(() => C(dx, -96, 9), o.night ? '#ffe28a' : '#9fdcff', 2.4);
    // pennant tower
    shape(() => RR(196, -170, 34, 170, 4), stone, 3); shape(() => { g.moveTo(190, -168); g.lineTo(236, -168); g.lineTo(213, -222); g.closePath(); }, roof2, 3);
    strokeOnly(() => { g.moveTo(213, -222); g.lineTo(213, -244); }, INK, 2.4); shape(() => { g.moveTo(213, -244); g.lineTo(236, -238); g.lineTo(213, -232); g.closePath(); }, RIBBON[side > 0 ? 0 : 4], 2);
    g.restore();
  }
  // main hall
  shape(() => RR(-70, -190, 140, 190, 8), stone, 3);
  shape(() => { g.moveTo(-82, -186); g.lineTo(82, -186); g.lineTo(0, -270); g.closePath(); }, roof, 3);
  shape(() => { g.moveTo(-34, 0); g.lineTo(-34, -70); g.arc(0, -70, 34, Math.PI, 0); g.lineTo(34, 0); g.closePath(); }, '#a85a34', 3);
  strokeOnly(() => { g.moveTo(0, -104); g.lineTo(0, 0); }, '#7a3a20', 2.4);
  // horseshoe crest + round window
  shape(() => C(0, -140, 22), o.night ? '#ffe28a' : '#bfe8ff', 3);
  strokeOnly(() => { g.arc(0, -138, 12, Math.PI * 0.85, Math.PI * 2.15); }, '#f2c14e', 6);
  // bell tower + ribbon mast
  shape(() => RR(-18, -312, 36, 46, 4), stone, 3); shape(() => { g.moveTo(-26, -310); g.lineTo(26, -310); g.lineTo(0, -350); g.closePath(); }, roof2, 3);
  shape(() => C(0, -292, 8), '#f2c14e', 2.4);
  strokeOnly(() => { g.moveTo(0, -350); g.lineTo(0, -380); }, INK, 3);
  // weathervane horse silhouette
  g.save(); g.translate(0, -384); g.scale(0.09, 0.09); g.fillStyle = INK; g.beginPath(); H_body(); g.fill(); g.beginPath(); H_neck(); g.fill(); g.beginPath(); H_skull(); g.fill(); g.beginPath(); H_muzzle(); g.fill(); g.restore();
  // ivy & flower boxes
  for (const dx of [-60, 60]) { shape(() => RR(dx - 14, -40, 28, 10, 3), '#c26b3e', 2); for (let k = -1; k <= 1; k++) shape(() => C(dx + k * 8, -44, 4.5), RIBBON[(k + 1 + (dx > 0 ? 3 : 0)) % 7], 1.5); }
  if (o.sign) { shape(() => RR(-96, -228, 192, 34, 12), '#fff7e6', 3); text(o.sign, 0, -211, 17, '#6a3fb5', { fam: F.title, w: 400 }); }
  g.restore();
}
// --- icons ---
function apple(x, y, r, col = '#e8304a') { shape(() => { g.moveTo(x, y - r * 0.6); g.bezierCurveTo(x - r * 1.3, y - r * 1.2, x - r * 1.2, y + r * 1.1, x, y + r * 0.9); g.bezierCurveTo(x + r * 1.2, y + r * 1.1, x + r * 1.3, y - r * 1.2, x, y - r * 0.6); g.closePath(); }, col, Math.max(1.6, r * 0.14)); fillOnly(() => E(x - r * 0.4, y - r * 0.2, r * 0.22, r * 0.34, 0.3), 'rgba(255,255,255,.55)'); strokeOnly(() => { g.moveTo(x, y - r * 0.6); g.lineTo(x + r * 0.1, y - r * 1.1); }, INK, Math.max(1.6, r * 0.14)); shape(() => E(x + r * 0.45, y - r * 1.0, r * 0.38, r * 0.18, -0.4), '#5cbf4a', Math.max(1.2, r * 0.1)); }
function cake(x, y, r) { // strawberry layer cake slice
  shape(() => { g.moveTo(x - r, y + r * 0.6); g.lineTo(x + r, y + r * 0.6); g.lineTo(x + r, y - r * 0.2); g.lineTo(x - r, y - r * 0.6); g.closePath(); }, '#ffe2b8', Math.max(1.6, r * 0.12));
  fillOnly(() => { g.rect(x - r + 1, y + r * 0.02, r * 2 - 2, r * 0.16); }, '#ff7aa2');
  shape(() => { g.moveTo(x - r, y - r * 0.6); g.lineTo(x + r, y - r * 0.2); g.lineTo(x + r, y - r * 0.4); g.quadraticCurveTo(x, y - r * 0.9, x - r, y - r * 0.85); g.closePath(); }, '#fff', Math.max(1.6, r * 0.12));
  shape(() => { heart(x - r * 0.2, y - r * 0.75, r * 0.32); }, '#e8304a', Math.max(1.2, r * 0.1));
}
function horseshoe(x, y, r, col = '#f2c14e') { g.save(); g.lineCap = 'round'; strokeOnly(() => { g.arc(x, y, r, Math.PI * 0.8, Math.PI * 2.2); }, INK, r * 0.62); strokeOnly(() => { g.arc(x, y, r, Math.PI * 0.8, Math.PI * 2.2); }, col, r * 0.38); for (const a of [1.0, 1.4, 1.75, 2.05]) fillOnly(() => C(x + Math.cos(a * Math.PI) * r, y + Math.sin(a * Math.PI) * r, r * 0.07), shade(col, -0.4)); g.restore(); }
function hugIcon(x, y, r) { shape(() => heart(x, y + r * 0.2, r), '#ff6f91', Math.max(1.6, r * 0.12)); fillOnly(() => E(x - r * 0.35, y - r * 0.25, r * 0.18, r * 0.26, 0.5), 'rgba(255,255,255,.6)'); }
// --- banner ribbon for titles ---
function bannerRibbon(cx, cy, w, h, col, label, px) {
  const tail = h * 0.6;
  shape(() => { g.moveTo(cx - w / 2 - tail, cy - h / 2 + 8); g.lineTo(cx - w / 2 + 6, cy - h / 2 + 8); g.lineTo(cx - w / 2 + 6, cy + h / 2 + 8); g.lineTo(cx - w / 2 - tail, cy + h / 2 + 8); g.lineTo(cx - w / 2 - tail * 0.6, cy + 8); g.closePath(); g.moveTo(cx + w / 2 + tail, cy - h / 2 + 8); g.lineTo(cx + w / 2 - 6, cy - h / 2 + 8); g.lineTo(cx + w / 2 - 6, cy + h / 2 + 8); g.lineTo(cx + w / 2 + tail, cy + h / 2 + 8); g.lineTo(cx + w / 2 + tail * 0.6, cy + 8); g.closePath(); }, shade(col, -0.2), 3);
  shape(() => RR(cx - w / 2, cy - h / 2, w, h, 8), col, 3);
  text(label, cx, cy + 1, px, '#fff', { fam: F.title, w: 400, stroke: shade(col, -0.45), sw: px * 0.18 });
}
// --- Whirligig: a playful, lonely little whirlwind (animated) ---
function whirligig(x, y, s, o = {}) {
  g.save(); g.translate(x, y); g.scale(s, s);
  const t = o.t != null ? o.t : T;
  for (let k = 0; k < 5; k++) { const ry = 16 + k * 4, rx = 22 + k * 16, yy = -k * 26, a0 = t * (3 + k * 0.4) + k; g.save(); g.globalAlpha = 0.85;
    const arc = () => g.ellipse(Math.sin(k + t * 2) * 6, yy, rx, ry, 0, a0, a0 + Math.PI * 1.7); strokeOnly(arc, INK, 7); strokeOnly(arc, k % 2 ? '#a8f0e8' : '#c9b8ff', 4); g.restore(); }
  const bob = Math.sin(t * 3) * 3;
  shape(() => { C(0, -78 + bob, 30); C(-24, -68 + bob, 20); C(24, -68 + bob, 20); }, '#eef9ff', 3);
  for (const e of [-11, 11]) { if (o.sad) { fillOnly(() => E(e, -80 + bob, 5, 6), INK); fillOnly(() => C(e + 1.5, -83 + bob, 1.8), '#fff'); fillOnly(() => E(e + 2, -66 + bob + ((t * 30) % 14), 2.5, 4), '#7fd0ff'); }
    else { fillOnly(() => E(e, -80 + bob, 5, 7), INK); fillOnly(() => C(e + 1.5, -83 + bob, 2), '#fff'); } }
  if (o.sad) strokeOnly(() => { g.moveTo(-7, -60 + bob); g.quadraticCurveTo(0, -67 + bob, 7, -60 + bob); }, INK, 2.6);
  else shape(() => { g.moveTo(-8, -66 + bob); g.quadraticCurveTo(0, -56 + bob, 8, -66 + bob); g.closePath(); }, '#ff7aa2', 2.2);
  fillOnly(() => { E(-20, -70 + bob, 5, 3); E(20, -70 + bob, 5, 3); }, 'rgba(255,120,160,.45)');
  seed = 17; for (let k = 0; k < 7; k++) { const a = R(0, TAU) + t * 2.2, rr = R(40, 90); shape(() => E(Math.cos(a) * rr, -60 + Math.sin(a) * rr * 0.5, 7, 3.5, a), k % 2 ? '#7bd36b' : '#ffb84d', 1.6); }
  if (o.thread != null) { const c = RIBBON[o.thread]; const th = () => { g.moveTo(26, -60 + bob); g.bezierCurveTo(60, -40, 80, -90, 120 + Math.sin(t * 4) * 8, -70); }; strokeOnly(th, INK, 9); strokeOnly(th, c, 5.5); sparkle(120 + Math.sin(t * 4) * 8, -70, 7); }
  if (o.flags) { for (let k = 0; k < 3; k++) { const fx = -50 + k * 50, fy = -120 - (k % 2) * 16 + Math.sin(t * 3 + k) * 4; strokeOnly(() => { g.moveTo(fx, fy); g.lineTo(fx, fy + 34); }, INK, 2.5); shape(() => { g.moveTo(fx, fy); g.quadraticCurveTo(fx + 14, fy + 4 + Math.sin(t * 8 + k) * 3, fx + 26, fy + 2); g.lineTo(fx + 22, fy + 10); g.lineTo(fx + 26, fy + 18); g.quadraticCurveTo(fx + 12, fy + 16, fx, fy + 16); g.closePath(); }, RIBBON[(k * 2) % 7], 2); } }
  g.restore();
}
// ---- tack room interior ----
function tackRoom(x, y, w, h, missing) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.fillStyle = lin(0, y, 0, y + h, [[0, '#f3d3a6'], [1, '#e2b57f']]); g.fillRect(x, y, w, h);
  g.strokeStyle = 'rgba(150,90,50,.25)'; g.lineWidth = 2; for (let px = x; px < x + w; px += 44) { g.beginPath(); g.moveTo(px, y); g.lineTo(px, y + h); g.stroke(); }
  const k = clamp(Math.min(w / 660, h / 600), 0.42, 1.2);
  const ww = 240 * k, wh = 150 * k, wx = x + w * 0.5 - ww / 2, wy = y + 40 * k;
  const win = () => { g.moveTo(wx, wy + wh); g.lineTo(wx, wy + ww / 2); g.arc(wx + ww / 2, wy + ww / 2, ww / 2, Math.PI, 0); g.lineTo(wx + ww, wy + wh); g.closePath(); };
  if (wy + wh < y + h * 0.7) {
    clipTo(win, () => { g.save(); g.translate(wx, wy); sky(ww, wh, '#8fd3ff', '#ffe9f4'); ribbon(-20, ww * 0.42, ww + 20, ww * 0.34, 10 * k, 26 * k, { missing, ghost: 0.18, sparkles: 4 }); hills(ww, wh - 40 * k, '#a8dc8f', 8 * k, 1, wh + 10); hills(ww, wh - 18 * k, '#7cc96b', 6 * k, 3, wh + 10); g.restore(); });
    strokeOnly(win, '#8a5a3a', 10 * k);
    strokeOnly(() => { g.moveTo(wx + ww / 2, wy); g.lineTo(wx + ww / 2, wy + wh); g.moveTo(wx, wy + wh * 0.6); g.lineTo(wx + ww, wy + wh * 0.6); }, '#8a5a3a', 6 * k);
  }
  for (let i = 0; i < 16; i++) { const bx = x + 10 + i * (w / 13.5); if (bx > x + w) break; shape(() => { g.moveTo(bx, y + 18 * k); g.lineTo(bx + 30 * k, y + 18 * k); g.lineTo(bx + 15 * k, y + 46 * k); g.closePath(); }, RIBBON[i % 7], 2); }
  strokeOnly(() => { g.moveTo(x, y + 18 * k); g.lineTo(x + w, y + 18 * k); }, INK, 2);
  if (w > 300) for (const [rx, ry, c] of [[x + 50 * k, y + 120 * k, '#4cc3ff'], [x + w - 60 * k, y + 130 * k, '#ff5a6e']]) { g.save(); g.translate(rx, ry); g.scale(k, k); rosetteIcon(0, 0, 16, c, '1st'); g.restore(); }
  g.fillStyle = '#c98f5a'; g.fillRect(x, y + h * 0.78, w, h); g.strokeStyle = 'rgba(110,60,30,.25)'; g.lineWidth = 2; for (let py = y + h * 0.78; py < y + h; py += 16) { g.beginPath(); g.moveTo(x, py); g.lineTo(x + w, py); g.stroke(); }
  g.restore();
}
function rosetteIcon(x, y, r, c, label) { shape(() => { g.moveTo(x - r * 0.56, y); g.lineTo(x - r * 0.9, y + r * 2.5); g.lineTo(x, y + r * 1.9); g.lineTo(x + r * 0.9, y + r * 2.5); g.lineTo(x + r * 0.56, y); g.closePath(); }, shade(c, -0.15), 2); g.fillStyle = c; g.beginPath(); for (let k = 0; k < 12; k++) { const a = k * TAU / 12; C(x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.44); } g.fill(); shape(() => C(x, y, r * 0.75), '#fff', 2); if (label) text(label, x, y + 1, r * 0.62, INK, { fam: F.title, w: 400 }); }
function rugPedestal(cx, cy, rx) { shape(() => E(cx, cy + 6, rx, rx * 0.2), '#7a3fb5', 3); shape(() => E(cx, cy, rx, rx * 0.2), '#b07bff', 3); strokeOnly(() => { g.ellipse(cx, cy, rx * 0.82, rx * 0.15, 0, 0, TAU); }, '#ffd93d', 3); }
function headSil(alpha = 0.18) { g.save(); g.globalAlpha = alpha; g.fillStyle = '#8a6a5a'; for (const f of [H_neck, H_skull, H_muzzle, H_bridge, H_earN]) { g.beginPath(); f(); g.fill(); } g.restore(); }
function bodySil(alpha = 0.14) { g.save(); g.globalAlpha = alpha; g.fillStyle = '#8a6a5a'; g.beginPath(); H_body(); g.fill(); g.restore(); }
// tiny world map with a pin (stylized continents)
function miniMap(x, y, w, h, pin) {
  panel(x, y, w, h, 12, '#bfe6ff', { lw: 2.5, shadow: false });
  clipTo(() => RR(x, y, w, h, 12), () => {
    g.fillStyle = '#9edb8a'; const sx = w / 360, sy = h / 160; const P = (lon, lat) => [x + (lon + 180) * sx, y + (80 - lat) * sy];
    const blobs = [[[-165, 68], [-100, 72], [-60, 55], [-80, 25], [-97, 17], [-118, 32], [-125, 48]], [[-80, 10], [-35, -5], [-40, -22], [-70, -55], [-75, -15]], [[-10, 36], [-10, 58], [25, 70], [60, 70], [140, 70], [170, 62], [140, 40], [120, 22], [100, 8], [78, 8], [60, 25], [35, 30], [10, 38]], [[-17, 15], [10, 37], [33, 31], [51, 12], [40, -15], [20, -35], [10, -5]], [[114, -22], [153, -27], [146, -39], [116, -34]], [[-24, 64], [-14, 66], [-14, 63]], [[-6, 50], [2, 51], [-3, 58]], [[130, 31], [141, 41], [136, 35]]];
    for (const b of blobs) { g.beginPath(); b.forEach(([lo, la], i) => { const [px, py] = P(lo, la); i ? g.lineTo(px, py) : g.moveTo(px, py); }); g.closePath(); g.fill(); }
    if (pin) { const [px, py] = P(pin[0], pin[1]); const pr = clamp(w / 14, 6, 11); g.fillStyle = 'rgba(255,90,110,.25)'; g.beginPath(); C(px, py, pr * 1.2); g.fill(); shape(() => { g.moveTo(px, py); g.bezierCurveTo(px - pr * 0.9, py - pr, px - pr * 0.8, py - pr * 2.2, px, py - pr * 2.2); g.bezierCurveTo(px + pr * 0.8, py - pr * 2.2, px + pr * 0.9, py - pr, px, py); g.closePath(); }, '#ff5a6e', 2); fillOnly(() => C(px, py - pr * 1.5, pr * 0.3), '#fff'); }
  });
}
/* ---------- land props ---------- */
function appleTree(x, y, s, col = '#5cbf6a', fruit = '#ff5a6e') { g.save(); g.translate(x, y); g.scale(s, s); shape(() => RR(-6, -40, 12, 42, 4), '#8a5a3a', 2.4); shape(() => { C(0, -62, 30); C(-22, -46, 20); C(22, -46, 20); }, col, 2.6); fillOnly(() => C(-8, -72, 9), 'rgba(255,255,255,.25)'); if (fruit) for (const [ax, ay] of [[-12, -52], [10, -64], [16, -44], [-20, -38]]) shape(() => C(ax, ay, 4.5), fruit, 1.6); g.restore(); }
function pine(x, y, s, col = '#3f9a6a', snow) { g.save(); g.translate(x, y); g.scale(s, s); shape(() => RR(-5, -16, 10, 18, 3), '#7a4a2e', 2.2); for (let k = 0; k < 3; k++) { const yy = -14 - k * 22, w = 30 - k * 7; shape(() => { g.moveTo(-w, yy); g.lineTo(w, yy); g.lineTo(0, yy - 34); g.closePath(); }, col, 2.4); if (snow) fillOnly(() => { g.moveTo(-w * 0.45, yy - 18); g.lineTo(0, yy - 34); g.lineTo(w * 0.45, yy - 18); g.quadraticCurveTo(0, yy - 14, -w * 0.45, yy - 18); g.closePath(); }, '#fff'); } g.restore(); }
function pumpkin(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); shape(() => { E(-8, -12, 12, 12); E(8, -12, 12, 12); E(0, -13, 11, 13); }, '#ff8c2e', 2.2); strokeOnly(() => { g.moveTo(-4, -24); g.quadraticCurveTo(-6, -12, -4, -1); g.moveTo(4, -24); g.quadraticCurveTo(6, -12, 4, -1); }, '#d96a1a', 1.6); shape(() => RR(-2, -30, 4, 8, 2), '#4f8a3a', 1.6); g.restore(); }
function scarecrow(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); strokeOnly(() => { g.moveTo(0, 0); g.lineTo(0, -70); g.moveTo(-26, -52); g.lineTo(26, -52); }, '#8a5a3a', 5); shape(() => RR(-14, -60, 28, 30, 6), '#4a7fc8', 2.2); shape(() => C(0, -72, 11), '#f3d9a4', 2.2); shape(() => { g.moveTo(-16, -78); g.lineTo(16, -78); g.lineTo(8, -96); g.lineTo(-8, -96); g.closePath(); }, '#c98a3a', 2.2); fillOnly(() => { C(-4, -73, 1.6); C(4, -73, 1.6); }, INK); strokeOnly(() => { g.moveTo(-4, -67); g.quadraticCurveTo(0, -64, 4, -67); }, INK, 1.4); g.restore(); }
function corn(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); strokeOnly(() => { g.moveTo(0, 0); g.lineTo(0, -60); }, '#9a8a3a', 3); for (let k = 0; k < 4; k++) fillOnly(() => E(k % 2 ? 8 : -8, -16 - k * 12, 10, 3, k % 2 ? -0.6 : 0.6), '#c9b84a'); shape(() => E(4, -40, 3.5, 8, 0.2), '#ffd23f', 1.4); g.restore(); }
function windmill(x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); shape(() => { g.moveTo(-10, 0); g.lineTo(10, 0); g.lineTo(4, -80); g.lineTo(-4, -80); g.closePath(); }, '#d9d4cf', 2.4); g.save(); g.translate(0, -82); g.rotate((t || 0) * 1.5); for (let k = 0; k < 4; k++) { g.rotate(TAU / 4); shape(() => { g.moveTo(-3, 0); g.lineTo(3, 0); g.lineTo(6, -40); g.lineTo(-6, -40); g.closePath(); }, '#f6f1e6', 2); } g.restore(); shape(() => C(0, -82, 4), '#e8304a', 1.6); g.restore(); }
function beehive(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); shape(() => RR(-14, -8, 28, 8, 2), '#8a5a3a', 2); for (let k = 0; k < 4; k++) shape(() => E(0, -14 - k * 9, 15 - k * 2.6, 6), '#f2b632', 2); fillOnly(() => C(0, -14, 3), INK); g.restore(); }
function fern(x, y, s, col = '#4caf6a') { g.save(); g.translate(x, y); g.scale(s, s); for (let k = -2; k <= 2; k++) { const a = k * 0.35; g.save(); g.rotate(a); shape(() => { g.moveTo(0, 0); g.quadraticCurveTo(-8, -20, 0, -40); g.quadraticCurveTo(8, -20, 0, 0); g.closePath(); }, col, 1.8); g.restore(); } g.restore(); }
function mushroom(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); shape(() => RR(-4, -12, 8, 12, 3), '#f6ead9', 1.8); shape(() => { g.moveTo(-13, -10); g.quadraticCurveTo(0, -30, 13, -10); g.closePath(); }, '#ff5a6e', 1.8); fillOnly(() => { C(-5, -16, 2.2); C(5, -18, 1.8); C(0, -22, 1.6); }, '#fff'); g.restore(); }
function bigTree(x, y, s, col = '#3f9a5a') { g.save(); g.translate(x, y); g.scale(s, s); shape(() => { g.moveTo(-10, 0); g.lineTo(-7, -70); g.lineTo(7, -70); g.lineTo(10, 0); g.closePath(); }, '#7a4a2e', 2.4); shape(() => { C(0, -96, 34); C(-28, -78, 24); C(28, -78, 24); C(0, -70, 26); }, col, 2.6); fillOnly(() => C(-10, -108, 10), 'rgba(255,255,255,.18)'); g.restore(); }
function lighthouse(x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); shape(() => { g.moveTo(-14, 0); g.lineTo(14, 0); g.lineTo(9, -80); g.lineTo(-9, -80); g.closePath(); }, '#fff', 2.4); clipTo(() => { g.moveTo(-14, 0); g.lineTo(14, 0); g.lineTo(9, -80); g.lineTo(-9, -80); g.closePath(); }, () => { g.fillStyle = '#e8304a'; g.fillRect(-20, -26, 40, 12); g.fillRect(-20, -56, 40, 12); }); shape(() => RR(-11, -96, 22, 16, 3), '#ffe28a', 2.2); shape(() => { g.moveTo(-13, -96); g.lineTo(13, -96); g.lineTo(0, -110); g.closePath(); }, '#e8304a', 2.2); g.fillStyle = 'rgba(255,240,160,.25)'; g.beginPath(); g.moveTo(0, -88); g.lineTo(120, -110 + Math.sin(t || 0) * 20); g.lineTo(120, -66 + Math.sin(t || 0) * 20); g.closePath(); g.fill(); g.restore(); }
function lantern(x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); strokeOnly(() => { g.moveTo(0, 0); g.lineTo(0, -52); g.lineTo(10, -52); }, '#5a4a6a', 3); g.fillStyle = rad(10, -40, 2, 30, [[0, 'rgba(255,230,140,.7)'], [1, 'rgba(255,230,140,0)']]); g.beginPath(); C(10, -40, 30); g.fill(); shape(() => RR(4, -50, 12, 16, 4), '#ffd56a', 2); g.restore(); }
function lavender(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); for (let k = -2; k <= 2; k++) { strokeOnly(() => { g.moveTo(0, 0); g.lineTo(k * 4, -26); }, '#6a9a5a', 1.6); fillOnly(() => E(k * 4, -30, 2.6, 7), '#a77bdc'); } g.restore(); }
function balloon(x, y, s, c, t) { g.save(); g.translate(x, y + Math.sin((t || 0) * 1.5 + x) * 4); g.scale(s, s); strokeOnly(() => { g.moveTo(-6, 6); g.lineTo(-5, 18); g.moveTo(6, 6); g.lineTo(5, 18); }, INK, 1.4); shape(() => RR(-7, 16, 14, 10, 2), '#a8693e', 1.6); shape(() => { g.moveTo(0, 8); g.bezierCurveTo(-26, -6, -22, -40, 0, -40); g.bezierCurveTo(22, -40, 26, -6, 0, 8); g.closePath(); }, c, 2.2); clipTo(() => { g.moveTo(0, 8); g.bezierCurveTo(-26, -6, -22, -40, 0, -40); g.bezierCurveTo(22, -40, 26, -6, 0, 8); g.closePath(); }, () => { g.fillStyle = 'rgba(255,255,255,.45)'; g.fillRect(-4, -42, 8, 52); }); g.restore(); }
function barn(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); shape(() => { g.moveTo(-50, 0); g.lineTo(-50, -50); g.lineTo(-30, -74); g.lineTo(30, -74); g.lineTo(50, -50); g.lineTo(50, 0); g.closePath(); }, '#d23b3b', 2.6); shape(() => RR(-16, -40, 32, 40, 2), '#fff', 2.2); strokeOnly(() => { g.moveTo(-16, -40); g.lineTo(16, 0); g.moveTo(16, -40); g.lineTo(-16, 0); }, '#d23b3b', 3); shape(() => RR(-8, -64, 16, 12, 2), '#fff', 2); g.restore(); }
function cloudCastle(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); cloud(0, 10, 1.4, '#fff'); for (const [tx, th] of [[-40, 70], [0, 100], [40, 70]]) { shape(() => RR(tx - 14, -th, 28, th, 4), '#f1e6ff', 2.6); shape(() => { g.moveTo(tx - 18, -th); g.lineTo(tx + 18, -th); g.lineTo(tx, -th - 30); g.closePath(); }, '#b06bff', 2.6); shape(() => { g.moveTo(tx, -th - 30); g.lineTo(tx, -th - 44); g.lineTo(tx + 14, -th - 38); g.closePath(); }, RIBBON[(tx / 40 + 3) % 7 | 0], 1.6); } shape(() => { g.moveTo(-10, 0); g.lineTo(-10, -26); g.arc(0, -26, 10, Math.PI, 0); g.lineTo(10, 0); g.closePath(); }, '#ffd93d', 2.2); g.restore(); }
/* ---------- race obstacles & pickups ---------- */
function logJump(x, gy, s, o = {}) { g.save(); g.translate(x, gy); g.scale(s, s); groundShadow(0, 4, 70, 9);
  for (const px of [-52, 52]) shape(() => { g.moveTo(px - 10, 4); g.lineTo(px - 4, -54); g.lineTo(px + 4, -54); g.lineTo(px + 10, 4); g.closePath(); }, '#9a6a44', 3);
  shape(() => RR(-66, -46, 132, 22, 11), '#b27a4c', 3); shape(() => E(66, -35, 7, 11), '#e8c49a', 2.5); strokeOnly(() => { g.ellipse(66, -35, 3, 6, 0, 0, TAU); }, '#9a6a44', 1.5);
  shape(() => RR(-60, -18, 120, 20, 5), '#ffffff', 3); for (let k = 0; k < 8; k++) flower(-52 + k * 15, -14, 1, o.flowers || RIBBON[k % 7]);
  g.restore(); }
function hayBale(x, gy, s) { g.save(); g.translate(x, gy); g.scale(s, s); groundShadow(0, 4, 66, 9); shape(() => RR(-60, -56, 120, 58, 10), '#f2cd5c', 3); g.strokeStyle = '#c99a2a'; g.lineWidth = 2; for (let k = 0; k < 9; k++) { g.beginPath(); g.moveTo(-54 + k * 13, -50); g.lineTo(-58 + k * 13, -4); g.stroke(); } strokeOnly(() => { g.moveTo(-22, -56); g.lineTo(-22, 2); g.moveTo(22, -56); g.lineTo(22, 2); }, '#b0392b', 3); g.restore(); }
function pumpkinCrate(x, gy, s) { g.save(); g.translate(x, gy); g.scale(s, s); groundShadow(0, 4, 66, 9); shape(() => RR(-56, -36, 112, 38, 4), '#b07a4a', 3); strokeOnly(() => { g.moveTo(-56, -18); g.lineTo(56, -18); }, '#8a5a32', 3); for (const px of [-30, 0, 30]) pumpkin(px, -32, 1.3); g.restore(); }
function leafPile(x, gy, s) { g.save(); g.translate(x, gy); g.scale(s, s); groundShadow(0, 4, 70, 9); seed = 61; for (let k = 0; k < 40; k++) { const a = R(0, Math.PI), r = R(0, 1); const px = Math.cos(a) * 60 * r, py = -Math.sin(a) * 46 * r; shape(() => E(px, py, 8, 4, R(0, 3)), ['#ff8c2e', '#e8504a', '#ffc23a', '#c96a2a'][k % 4], 1.4); } g.restore(); }
function branch(x, gy, s, h) { g.save(); g.translate(x, gy); g.scale(s, s); shape(() => { g.moveTo(-14, 0); g.lineTo(-10, -h - 60); g.lineTo(10, -h - 60); g.lineTo(14, 0); g.closePath(); }, '#7a4a2e', 3); shape(() => { g.moveTo(-6, -h - 10); g.quadraticCurveTo(-120, -h - 20, -190, -h); g.lineTo(-188, -h - 14); g.quadraticCurveTo(-120, -h - 34, -6, -h - 30); g.closePath(); }, '#8a5a3a', 3); for (let k = 0; k < 7; k++) shape(() => E(-40 - k * 22, -h - 10 + (k % 2) * 8, 13, 8, 0.3), k % 2 ? '#4caf6a' : '#6bd66b', 2); shape(() => { C(0, -h - 90, 44); C(-36, -h - 66, 30); C(30, -h - 70, 30); }, '#3f9a5a', 3); g.restore(); }
function puddle(x, gy, s) { g.save(); g.translate(x, gy); g.scale(s, s); shape(() => E(0, 6, 90, 14), '#6fc7ef', 2.6); fillOnly(() => { E(-30, 4, 22, 4); E(30, 8, 14, 3); }, 'rgba(255,255,255,.6)'); g.restore(); }
function cloudGap(x, gy, s) { g.save(); g.translate(x, gy); g.scale(s, s); g.fillStyle = 'rgba(180,160,230,.55)'; g.fillRect(-70, -6, 140, 80); for (const px of [-74, 74]) { shape(() => { C(px, 0, 22); C(px + (px < 0 ? -18 : 18), 6, 18); }, '#ffffff', 2.6); } sparkle(0, -30, 7, '#fff'); g.restore(); }
function cloudStep(x, gy, s) { g.save(); g.translate(x, gy); g.scale(s, s); groundShadow(0, 4, 60, 8, 0.12); shape(() => { C(-30, -20, 24); C(0, -34, 30); C(30, -20, 24); E(0, -8, 56, 14); }, '#ffffff', 3); fillOnly(() => E(-10, -40, 12, 5), 'rgba(200,180,255,.5)'); g.restore(); }
function stopArch(x, gy, s, label, sub, flowerFn, col = '#ffd93d') {
  g.save(); g.translate(x, gy); g.scale(s, s);
  for (const px of [-90, 90]) { shape(() => RR(px - 9, -190, 18, 200, 6), '#8a5a3a', 3); for (let k = 0; k < 6; k++) (flowerFn || ((fx, fy) => sunflower(fx, fy, 0.62)))(px + (k % 2 ? 8 : -8), -24 - k * 30, k); }
  strokeOnly(() => { g.moveTo(-96, -186); g.quadraticCurveTo(0, -240, 96, -186); }, INK, 18); strokeOnly(() => { g.moveTo(-96, -186); g.quadraticCurveTo(0, -240, 96, -186); }, col, 12);
  for (let k = 0; k < 9; k++) { const t = k / 8, ax = -96 + t * 192, ay = -186 - Math.sin(t * Math.PI) * 27; shape(() => C(ax, ay, 7), RIBBON[k % 7], 2); }
  shape(() => RR(-84, -176, 168, 52, 14), '#fff8e6', 3);
  text(label, 0, -160, 20, '#c2410c', { fam: F.title, w: 400, max: 156 }); text(sub, 0, -138, 14, INK, { fam: F.ui, w: 800, max: 156 });
  for (const [bx, by, c] of [[-112, -250, '#ff5a6e'], [-96, -270, '#4cc3ff'], [104, -262, '#b06bff'], [118, -244, '#6bd66b']]) { strokeOnly(() => { g.moveTo(bx, by + 18); g.quadraticCurveTo(bx + 6, by + 50, (bx < 0 ? -92 : 92), -190); }, INK, 1.5); shape(() => E(bx, by, 14, 18), c, 2.5); fillOnly(() => E(bx - 5, by - 6, 4, 6, 0.4), 'rgba(255,255,255,.6)'); }
  g.restore();
}
function finishArch(x, gy, s) { g.save(); g.translate(x, gy); g.scale(s, s);
  for (const px of [-100, 100]) shape(() => RR(px - 10, -230, 20, 240, 6), '#f6f1e6', 3);
  shape(() => RR(-120, -250, 240, 50, 10), '#fff', 3); clipTo(() => RR(-120, -250, 240, 50, 10), () => { for (let i = 0; i < 24; i++) for (let j = 0; j < 5; j++) if ((i + j) % 2) { g.fillStyle = INK; g.fillRect(-120 + i * 10, -250 + j * 10, 10, 10); } });
  shape(() => RR(-70, -242, 140, 34, 10), '#ff5a6e', 3); text('FINISH', 0, -224, 22, '#fff', { fam: F.title, w: 400, stroke: '#9a1a2a', sw: 4 });
  g.restore(); }
function goldenApple(x, y, r) { apple(x, y, r, '#f2c14e'); sparkle(x + r, y - r, r * 0.5); }
function starPickup(x, y, r, t) { g.save(); g.translate(x, y); g.rotate(Math.sin((t || 0) * 3) * 0.2); shape(() => star(0, 0, r), '#ffd93d', Math.max(2, r * 0.14)); fillOnly(() => E(-r * 0.25, -r * 0.25, r * 0.2, r * 0.12, -0.6), 'rgba(255,255,255,.7)'); g.restore(); }
/* ---------- UI icons (drawn, no emoji) ---------- */
function icSpeaker(x, y, r, col = INK) { shape(() => { g.moveTo(x - r * 0.7, y - r * 0.28); g.lineTo(x - r * 0.35, y - r * 0.28); g.lineTo(x + r * 0.1, y - r * 0.7); g.lineTo(x + r * 0.1, y + r * 0.7); g.lineTo(x - r * 0.35, y + r * 0.28); g.lineTo(x - r * 0.7, y + r * 0.28); g.closePath(); }, col, 0); strokeOnly(() => { g.arc(x + r * 0.15, y, r * 0.45, -0.8, 0.8); g.moveTo(x + r * 0.15 + Math.cos(-0.9) * r * 0.8, y + Math.sin(-0.9) * r * 0.8); g.arc(x + r * 0.15, y, r * 0.8, -0.9, 0.9); }, col, Math.max(2, r * 0.16)); }
function icPin(x, y, r, col = '#ff5a6e') { shape(() => { g.moveTo(x, y + r); g.bezierCurveTo(x - r * 0.9, y, x - r * 0.8, y - r, x, y - r); g.bezierCurveTo(x + r * 0.8, y - r, x + r * 0.9, y, x, y + r); g.closePath(); }, col, Math.max(1.5, r * 0.15)); fillOnly(() => C(x, y - r * 0.3, r * 0.3), '#fff'); }
function icClock(x, y, r) { shape(() => C(x, y, r), '#fff', Math.max(1.5, r * 0.15)); strokeOnly(() => { g.moveTo(x, y); g.lineTo(x, y - r * 0.6); g.moveTo(x, y); g.lineTo(x + r * 0.45, y + r * 0.2); }, INK, Math.max(1.5, r * 0.15)); }
function icStar(x, y, r, col = '#ffd93d') { shape(() => star(x, y, r), col, Math.max(1.5, r * 0.14)); }
function icLock(x, y, r, col = '#8a7a9a') { strokeOnly(() => { g.arc(x, y - r * 0.2, r * 0.45, Math.PI, 0); }, col, r * 0.22); shape(() => RR(x - r * 0.7, y - r * 0.2, r * 1.4, r * 1.05, r * 0.2), col, 0); fillOnly(() => C(x, y + r * 0.3, r * 0.14), '#fff'); }
function icBack(x, y, r, col = INK) { strokeOnly(() => { g.moveTo(x + r * 0.25, y - r * 0.5); g.lineTo(x - r * 0.3, y); g.lineTo(x + r * 0.25, y + r * 0.5); }, col, r * 0.28); }
function icHome(x, y, r, col = INK) { shape(() => { g.moveTo(x - r * 0.75, y - r * 0.05); g.lineTo(x, y - r * 0.75); g.lineTo(x + r * 0.75, y - r * 0.05); g.lineTo(x + r * 0.5, y - r * 0.05); g.lineTo(x + r * 0.5, y + r * 0.65); g.lineTo(x - r * 0.5, y + r * 0.65); g.lineTo(x - r * 0.5, y - r * 0.05); g.closePath(); }, col, 0); fillOnly(() => RR(x - r * 0.15, y + r * 0.2, r * 0.3, r * 0.45, 2), '#fff'); }
function icPause(x, y, r, col = INK) { fillOnly(() => { g.rect(x - r * 0.45, y - r * 0.5, r * 0.32, r); g.rect(x + r * 0.13, y - r * 0.5, r * 0.32, r); }, col); }
function icGear(x, y, r, col = INK) { g.save(); g.translate(x, y); g.fillStyle = col; g.beginPath(); for (let k = 0; k < 8; k++) { const a = k * TAU / 8; g.save(); g.rotate(a); g.rect(-r * 0.18, -r, r * 0.36, r * 0.4); g.restore(); } C(0, 0, r * 0.72); g.fill(); g.fillStyle = '#fff'; g.beginPath(); C(0, 0, r * 0.3); g.fill(); g.restore(); }
function icCamera(x, y, r, col = INK) { shape(() => { RR(x - r * 0.8, y - r * 0.45, r * 1.6, r * 1.05, r * 0.2); RR(x - r * 0.3, y - r * 0.65, r * 0.6, r * 0.3, 3); }, col, 0); shape(() => C(x, y + r * 0.08, r * 0.32), '#fff', 0); fillOnly(() => C(x, y + r * 0.08, r * 0.16), col); }
function icMap(x, y, r, col = INK) { shape(() => { g.moveTo(x - r * 0.8, y - r * 0.55); g.lineTo(x - r * 0.27, y - r * 0.7); g.lineTo(x + r * 0.27, y - r * 0.55); g.lineTo(x + r * 0.8, y - r * 0.7); g.lineTo(x + r * 0.8, y + r * 0.55); g.lineTo(x + r * 0.27, y + r * 0.7); g.lineTo(x - r * 0.27, y + r * 0.55); g.lineTo(x - r * 0.8, y + r * 0.7); g.closePath(); }, col, 0); strokeOnly(() => { g.moveTo(x - r * 0.27, y - r * 0.7); g.lineTo(x - r * 0.27, y + r * 0.55); g.moveTo(x + r * 0.27, y - r * 0.55); g.lineTo(x + r * 0.27, y + r * 0.7); }, '#fff', Math.max(1.5, r * 0.1)); }
function icDice(x, y, r, col = INK) { shape(() => RR(x - r * 0.7, y - r * 0.7, r * 1.4, r * 1.4, r * 0.3), col, 0); fillOnly(() => { C(x - r * 0.33, y - r * 0.33, r * 0.14); C(x, y, r * 0.14); C(x + r * 0.33, y + r * 0.33, r * 0.14); }, '#fff'); }
function icCheck(x, y, r, col = '#fff') { strokeOnly(() => { g.moveTo(x - r * 0.5, y); g.lineTo(x - r * 0.12, y + r * 0.4); g.lineTo(x + r * 0.55, y - r * 0.45); }, col, r * 0.28); }
function icClose(x, y, r, col = '#fff') { strokeOnly(() => { g.moveTo(x - r * 0.4, y - r * 0.4); g.lineTo(x + r * 0.4, y + r * 0.4); g.moveTo(x + r * 0.4, y - r * 0.4); g.lineTo(x - r * 0.4, y + r * 0.4); }, col, r * 0.26); }
function icInfo(x, y, r) { shape(() => C(x, y, r), '#4cc3ff', Math.max(2, r * 0.18)); text('i', x, y + r * 0.08, r * 1.3, '#fff', { fam: F.title, w: 400 }); }
function icStable(x, y, r, col = INK) { shape(() => { g.moveTo(x - r * 0.85, y - r * 0.1); g.lineTo(x, y - r * 0.8); g.lineTo(x + r * 0.85, y - r * 0.1); g.lineTo(x + r * 0.7, y - r * 0.1); g.lineTo(x + r * 0.7, y + r * 0.7); g.lineTo(x - r * 0.7, y + r * 0.7); g.lineTo(x - r * 0.7, y - r * 0.1); g.closePath(); }, col, 0); fillOnly(() => RR(x - r * 0.35, y + r * 0.05, r * 0.7, r * 0.65, 2), '#fff'); strokeOnly(() => { g.moveTo(x - r * 0.35, y + r * 0.05); g.lineTo(x + r * 0.35, y + r * 0.7); g.moveTo(x + r * 0.35, y + r * 0.05); g.lineTo(x - r * 0.35, y + r * 0.7); }, col, Math.max(1.5, r * 0.1)); }
function icSaddle(x, y, r, col = INK) { g.save(); g.translate(x, y + r * 0.1); g.scale(r / 46, r / 46); g.translate(0, 140); sEnglish('#8a4f2a'); g.restore(); }
function icSticker(x, y, r) { shape(() => C(x, y, r), '#ffd93d', Math.max(2, r * 0.14)); shape(() => star(x, y, r * 0.6), '#ff6f91', Math.max(1.5, r * 0.1)); }
