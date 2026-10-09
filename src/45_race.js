/* ===================== RACE: side-scrolling gallop with jumps, ducks, forks, stops, Whirligig ===================== */
function ridge(W, y, amp, cyc, ph, col, H) { g.fillStyle = col; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 8) g.lineTo(x, y + amp * (0.62 * Math.sin(TAU * cyc * x / W + ph) + 0.38 * Math.sin(TAU * (cyc * 2 + 1) * x / W + ph * 1.7))); g.lineTo(W, H); g.closePath(); g.fill(); }
function peaks(W, y, col, H, n, hmin, hmax, sd, snow) { const rr = srng(sd); const pk = []; for (let i = 0; i < n; i++) pk.push([(i + rr() * 0.4) * W / n, hmin + rr() * (hmax - hmin), (0.7 + rr() * 0.5) * W / n]);
  for (const off of [-W, 0, W]) for (const [px, ph, pw] of pk) { const x = px + off; if (x + pw < 0 || x - pw > W) continue; shape(() => { g.moveTo(x - pw, y); g.lineTo(x, y - ph); g.lineTo(x + pw, y); g.closePath(); }, col, 0); if (snow) fillOnly(() => { g.moveTo(x - pw * 0.28, y - ph * 0.72); g.lineTo(x, y - ph); g.lineTo(x + pw * 0.28, y - ph * 0.72); g.lineTo(x + pw * 0.1, y - ph * 0.66); g.lineTo(x - pw * 0.08, y - ph * 0.74); g.closePath(); }, snow); } }
const LAND_ART = [
  { sky: ['#8fd3ff', '#ffe9f4'], far: '#c4b7f0', far2: '#b9e59a', ground: '#7fcf6a', ground2: '#5fb85a', path: '#e8c48a' },
  { sky: ['#8fd3ff', '#ffeef0'], far: '#c4b7f0', far2: '#a8dc8f', ground: '#7fcf6a', ground2: '#5fb85a', path: '#e8c48a' },
  { sky: ['#ffcf9e', '#fff1e2'], far: '#e8a87a', far2: '#d9b36a', ground: '#b8c25e', ground2: '#9aa84c', path: '#e2b77a' },
  { sky: ['#9fdcff', '#fff6d0'], far: '#c8d7a0', far2: '#f0cf5f', ground: '#cdbf58', ground2: '#b3a64a', path: '#ead39a' },
  { sky: ['#a8e6c8', '#effff4'], far: '#86c49a', far2: '#5fa86f', ground: '#5aa957', ground2: '#46914a', path: '#c9a878' },
  { sky: ['#8fd3ff', '#eafcff'], far: '#a7c6f0', far2: '#6fc7ef', ground: '#f0d898', ground2: '#e2c27a', path: '#f8e8bc' },
  { sky: ['#1d2150', '#4f428e'], far: '#3a3f7a', far2: '#2e3466', ground: '#4f5f9e', ground2: '#3e4c86', path: '#7f8ac0', night: 1 },
  { sky: ['#c3b0ff', '#ffe6f4'], far: '#e6dcff', far2: '#ffffff', ground: '#ffffff', ground2: '#efe6ff', path: '#e2d6ff', clouds: 1 },
];
function landFar(l, W, H, gyF) { const A = LAND_ART[l];
  if (l === 6) { peaks(W, gyF, '#4a4f8e', H, 5, H * 0.28, H * 0.45, 61, '#e6ecff'); peaks(W, gyF + 20, A.far, H, 7, H * 0.16, H * 0.3, 62, '#cfd8ff'); g.fillStyle = A.far2; g.fillRect(0, gyF + 18, W, H); }
  else if (l === 7) { for (let i = 0; i < 9; i++) { const x = (i + 0.5) * W / 9; cloud(x, gyF - 30 - (i % 3) * 30, 1.6 + (i % 2) * 0.5, '#ffffff', 0.85); } ridge(W, gyF + 10, 14, 3, 0.5, '#f4eeff', H); }
  else if (l === 5) { peaks(W, gyF - 20, A.far, H, 6, H * 0.12, H * 0.22, 51); g.fillStyle = lin(0, gyF - 22, 0, gyF + 40, [[0, '#7fd3f5'], [1, '#4fb5e5']]); g.fillRect(0, gyF - 22, W, H); g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 3; for (let i = 0; i < 18; i++) { const x = (i * 97) % W, y = gyF - 10 + (i % 4) * 9; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 26, y); g.stroke(); } }
  else { peaks(W, gyF - 10, A.far, H, 6, H * 0.12, H * 0.24, 40 + l); ridge(W, gyF + 6, 16, 2, l, A.far2, H); }
}
function landProps(l, W, gy, s, t) { const rr = srng(1000 + l * 77); const items = []; const n = Math.max(5, Math.round(W / (150 * s + 60)));
  for (let i = 0; i < n; i++) items.push([(i + rr() * 0.6) * W / n, rr(), rr()]);
  const once = (fn) => fn(W * 0.55);
  for (const off of [-W, 0, W]) for (const [px, a, b] of items) { const x = px + off; if (x < -200 * s || x > W + 200 * s) continue; const sc = s * (0.8 + a * 0.5);
    switch (l) {
      case 0: b < 0.4 ? tree(x, gy, sc * 1.4, '#5cbf6a') : b < 0.7 ? fence(x - 60 * s, x + 60 * s, gy, s * 1.1) : flower(x, gy, sc * 2, RIBBON[Math.floor(a * 7)]); break;
      case 1: b < 0.55 ? appleTree(x, gy, sc * 1.6) : b < 0.8 ? fence(x - 60 * s, x + 60 * s, gy, s * 1.1) : tree(x, gy, sc * 1.3); break;
      case 2: b < 0.3 ? corn(x, gy, sc * 1.3) : b < 0.5 ? scarecrow(x, gy, sc * 1.2) : b < 0.8 ? pumpkin(x, gy, sc * 1.6) : windmill(x, gy, sc * 1.2, 0); break;
      case 3: b < 0.6 ? (sunflower(x, gy, sc * 1.1), sunflower(x + 24 * s, gy, sc * 0.9)) : b < 0.8 ? beehive(x, gy, sc * 1.3) : windmill(x, gy, sc * 1.3, 1); break;
      case 4: b < 0.5 ? bigTree(x, gy, sc * 1.3) : b < 0.75 ? pine(x, gy, sc * 1.4, '#3f8a5a') : (fern(x, gy, sc * 1.2), mushroom(x + 20 * s, gy, sc * 1.3)); break;
      case 5: b < 0.25 ? lighthouse(x, gy - 4, sc * 1.2, 0) : b < 0.6 ? fern(x, gy, sc * 1.1, '#7fbf6a') : flower(x, gy, sc * 2, '#ffffff'); break;
      case 6: b < 0.6 ? pine(x, gy, sc * 1.5, '#2f5a6a', '#eef3ff') : lantern(x, gy, sc * 1.3, 0); break;
      case 7: b < 0.35 ? balloon(x, gy - 140 * s - a * 60 * s, sc * 1.4, RIBBON[Math.floor(a * 7)], 0) : b < 0.7 ? lavender(x, gy, sc * 1.6) : cloud(x, gy - 10 * s, sc * 0.9, '#ffffff'); break;
    } }
  if (l === 0) academy(W * 0.5, gy, s * 0.55, {}); if (l === 1) barn(W * 0.3, gy, s * 1.2); if (l === 7) cloudCastle(W * 0.4, gy - 20 * s, s * 0.9); }
// vignette sprite of a land (for map, stories, treat stop)
function landSpr(l, w, h, faded) { return sprite('land' + l + 'x' + w + 'x' + h + (faded ? 'F' : ''), w, h, () => { const A = LAND_ART[l]; const s = Math.min(w / 700, h / 520) ; g.fillStyle = lin(0, 0, 0, h, [[0, A.sky[0]], [1, A.sky[1]]]); g.fillRect(0, 0, w, h);
  if (A.night) { const rr = srng(9); for (let i = 0; i < 40; i++) sparkle(rr() * w, rr() * h * 0.5, 1.5 + rr() * 3, '#fff'); shape(() => C(w * 0.8, h * 0.15, 22 * s + 6), '#fff6c8', 0); } else sun(w * 0.82, h * 0.14, 20 * s + 8);
  const gy = h * 0.8; landFar(l, w, h, h * 0.62); landProps(l, w, gy, s * 0.9, 0);
  // landmarks
  const m = s * 1.1;
  if (l === 1) appleTree(w * 0.68, gy, m * 3.2, '#4fb85a'); if (l === 2) { barn(w * 0.68, gy, m * 1.6); pumpkin(w * 0.5, gy + 6, m * 3); }
  if (l === 3) { for (let i = 0; i < 5; i++) sunflower(w * (0.5 + i * 0.08), gy, m * (1.3 + (i % 2) * 0.3)); } if (l === 4) bigTree(w * 0.66, gy, m * 2.6, '#3f8a4a');
  if (l === 5) lighthouse(w * 0.7, gy, m * 2.0, 0); if (l === 6) { strokeOnly(() => { g.moveTo(w * 0.45, gy - 60 * m); g.quadraticCurveTo(w * 0.65, gy - 160 * m, w * 0.9, gy - 60 * m); }, '#ffe9a8', 10 * m); for (let i = 0; i < 6; i++) sparkle(w * (0.48 + i * 0.08), gy - 90 * m - Math.sin(i / 5 * Math.PI) * 50 * m, 8 * m, '#fff6c8'); }
  if (l === 7) cloudCastle(w * 0.68, gy - 30 * m, m * 1.5); if (l === 0) academy(w * 0.66, gy, m * 0.7);
  g.fillStyle = lin(0, gy - 6, 0, h, [[0, A.ground], [1, A.ground2]]); g.fillRect(0, gy - 4, w, h); g.fillStyle = A.path; g.fillRect(0, gy + 8 * s, w, 22 * s);
  if (!A.clouds) { const rr = srng(31 + l); for (let i = 0; i < 16; i++) flower(rr() * w, gy + 34 * s + rr() * (h - gy - 34 * s), s * 1.6, RIBBON[i % 7]); } if (faded) desatCtx(g, FADE); }); }
/* ---------- race state & generation ---------- */
const OB = { log: { w: 66, h: 56 }, hay: { w: 60, h: 58 }, crate: { w: 56, h: 50 }, leaf: { w: 60, h: 46 }, step: { w: 56, h: 60 }, branch: { w: 40, h: 0, duck: 1 }, puddle: { w: 80, h: 0, wet: 1 }, gap: { w: 64, h: 0, gap: 1 } };
function genRace(l, r) { const rng = srng(hashStr('race' + l + '-' + r)); const mech = LANDS[l].mech; const len = l === 0 ? 15000 : 25000 + l * 900 + r * 900;
  const stopsN = LANDS[l].races[r].stops; const stops = stopsN.map((n, i) => ({ x: Math.round(len * (i + 1) / (stopsN.length + 1)), name: n, done: false }));
  const pool = l === 0 ? ['log'] : l === 1 ? ['log', 'hay', 'log'] : l === 2 ? ['log', 'hay', 'leaf', 'crate'] : l === 3 ? ['log', 'hay', 'leaf', 'double'] : l === 4 ? ['log', 'branch', 'leaf', 'branch', 'double'] : l === 5 ? ['log', 'puddle', 'branch', 'puddle', 'hay'] : l === 6 ? ['log', 'branch', 'puddle', 'double', 'hay'] : ['gap', 'step', 'gap', 'branch', 'double'];
  const obs = [], picks = [], forks = []; let x = 1800; const gapBase = l === 0 ? 1700 : 1250 - l * 25 - r * 30;
  const nearStop = x => stops.some(s => Math.abs(s.x - x) < 900);
  if (l >= 2) { const fx = [0.16, 0.5, 0.84].slice(0, l === 2 ? 2 : 1 + (r % 2)); fx.forEach(f => forks.push({ x: Math.round(len * f), chosen: null })); }
  const nearFork = x => forks.some(f => x > f.x - 700 && x < f.x + 400);
  while (x < len - 1400) { if (nearStop(x) || nearFork(x)) { x += 400; continue; } let k = pool[Math.floor(rng() * pool.length)];
    if (k === 'double') { obs.push({ k: l === 7 ? 'step' : 'log', x }); obs.push({ k: l === 7 ? 'step' : 'hay', x: x + 600 }); x += 600; }
    else obs.push({ k, x });
    // horseshoes between obstacles
    const nx = x + gapBase + rng() * 700; const style = rng();
    if (style < 0.5) { for (let i = 0; i < 5; i++) picks.push({ k: 'shoe', x: x + 380 + i * 90, y: 70 }); }
    else if (OB[k === 'double' ? 'log' : k] && !OB[k === 'double' ? 'log' : k].duck && !OB[k === 'double' ? 'log' : k].wet) { for (let i = 0; i < 5; i++) { const p = i / 4; picks.push({ k: 'shoe', x: x - 150 + i * 75, y: 80 + Math.sin(p * Math.PI) * 120 }); } }
    else { for (let i = 0; i < 4; i++) picks.push({ k: 'shoe', x: x + 420 + i * 100, y: 70 + (i % 2) * 40 }); }
    x = nx; }
  for (const s of stops) for (let i = 0; i < 6; i++) picks.push({ k: 'shoe', x: s.x - 600 + i * 80, y: 70 + Math.sin(i) * 20 });
  obs.forEach(o => Object.assign(o, OB[o.k]));
  return { len, stops, obs, picks, forks }; }
const Race = { };
SC.race = { name: 'race',
  enter(a) { const l = a.l, r = a.r; this.l = l; this.r = r; const G = genRace(l, r); const tr = S.treats || {};
    Object.assign(this, G, { x: 0, v: 0, y: 0, airT: -1, duckT: 0, jumpReq: -9, duckReq: -9, meter: tr.apple ? 1 : 0.5, hearts: (tr.hug ? 3 : 0) + (tr.golden ? 1 : 0), bumps: 0, shoes: 0, caught: false, phase: 'count', t: 0, pt: 0, stopT: 0, slowT: 0, boostT: tr.apple ? 3 : 0, cyc: 0, stickers: [], fx: [], oops: 0, lastHoof: 0, paused: false, hint: null });
    this.tr = tr; racePerks(this); this.maxHearts = this.hearts; this.shoeTotal = this.picks.length; this.shoeNeed = Math.round(this.shoeTotal * 0.55);
    this.whirl = { d: 1400, on: l > 0, t: 0, giggle: 0, away: 0 };
    this.v0 = S.set.slow ? 400 : 520; this.J = tr.cake ? 0.86 : 0.78; this.JH = tr.cake ? 205 : 175;
    Music.play('land' + l); this.prepared = ''; this.prepare(); this.countBeep = 3; SFX.ding(0); AUD_LOG('raceStart_' + l + '_' + r);
    setTimeout(() => { if (scene === this && S.set.autoRead) Voice.say('tip', LANDS[l].tip); }, 200); },
  prepare() { const key = VW + 'x' + VH + DPR + outfitKey(HORSE(), { rider: true }); if (this.prepared === key) return; this.prepared = key; const L = lay();
    this.hs = L.port ? clamp(Math.min(VW / 760, VH / 1500), 0.32, 0.8) : clamp(Math.min(VH / 1000, VW / 1500), 0.3, 0.78); this.gy = Math.round(L.port ? VH * 0.62 : VH * 0.8); this.hx = Math.round(L.port ? VW * 0.26 : VW * 0.3);
    const h = HORSE(), s = this.hs; this.frames = []; this.dframes = [];
    for (let i = 0; i < 8; i++) { this.frames.push(horseSpr(h, gallopPose(i / 8), s, { rider: true, poseKey: 'g' + i, noShadow: true })); this.dframes.push(horseSpr(h, gallopPose(i / 8), s, { rider: true, duck: true, poseKey: 'g' + i, noShadow: true })); }
    this.jframe = horseSpr(h, JUMP_POSE, s, { rider: true, poseKey: 'jump', noShadow: true }); this.sframe = horseSpr(h, 'proud', s, { rider: true, noShadow: true });
    const W = Math.max(VW, 800), H = VH; this.TW = W; const gyF = this.gy - 40 * s;
    const fd = landFaded(this.l) && !LAND_ART[this.l].night; this.fd = fd; this.farT = sprite('far' + this.l + 'x' + W + 'x' + H + 'g' + this.gy + fd, W, H, () => { landFar(this.l, W, H, gyF); if (fd) desatCtx(g, FADE); });
    this.midT = sprite('mid' + this.l + 'x' + W + 'x' + H + 'g' + this.gy + fd, W, H, () => { landProps(this.l, W, this.gy - 14 * s, s * 0.9, 0); if (fd) desatCtx(g, FADE); }); },
  get prog() { return clamp(this.x / this.len, 0, 1); },
  jump() { if (this.phase !== 'run') return; this.jumpReq = this.t; },
  duck() { if (this.phase !== 'run') return; this.duckReq = this.t; },
  nextOb(filter) { for (const o of this.obs) { if (o.x + o.w < this.x - 40) continue; if (filter(o)) return o; } return null; },
  startJump() { this.airT = 0; this.jumpReq = -9; SFX.jump(); S.stats.jumps++; },
  bump(o, kind) { if (o.hit) return; o.hit = true; this.bumps++; this.oops = 1;
    if (this.hearts > 0) { this.hearts--; SFX.shield(); this.fx.push({ k: 'shield', t: 0 }); } else { this.slowT = 0.7; SFX.bump(); } },
  update(dt0) { const sp = (window.__KH && __KH.speed) || 1; let rem = dt0 * sp; while (rem > 0) { const dt = Math.min(rem, 1 / 60); rem -= dt; this.step(dt); if (scene !== this) return; } },
  step(dt) { if (this.paused) return; this.t += dt; this.prepare(); const w = this.whirl;
    if (this.phase === 'count') { const c = 3 - Math.floor(this.t / 0.75); if (c < this.countBeep && c > 0) { this.countBeep = c; SFX.ding(c === 1 ? 7 : 4); } if (this.t >= 2.25) { this.phase = 'run'; this.pt = 0; SFX.whinny('charge'); SFX.gallopBurst(); this.v = this.v0 * 0.6; } return; }
    if (this.phase === 'stop') { this.stopT += dt; this.v = Math.max(0, this.v - this.v0 * 2.2 * dt); this.x += this.v * dt; if (this.stopT > 3.2 && !this.stopHold) this.resume(); return; }
    if (this.phase === 'finish') { this.stopT += dt; this.v = Math.max(this.v0 * 0.25, this.v - this.v0 * 0.8 * dt); this.x += this.v * dt; this.cyc += dt * this.v / 430; if (this.stopT > 3.0) this.finishRace(); return; }
    // RUN
    this.pt += dt; const held = HELD.has('gallop') || this.keyGallop; const v0 = this.v0;
    const gal = held && this.meter > 0.02; if (gal) this.meter = Math.max(0, this.meter - dt / (4.2 * (this.drainK || 1))); else this.meter = Math.min(1, this.meter + dt * (this.refillK || 1) / (this.tr.carrot ? 5 : 9));
    this.galloping = gal; this.boostT = Math.max(0, this.boostT - dt); this.slowT = Math.max(0, this.slowT - dt); this.duckT = Math.max(0, this.duckT - dt); this.oops = Math.max(0, this.oops - dt * 1.5);
    let vt = gal || this.boostT > 0 ? v0 * 1.55 : v0; if (this.slowT > 0) vt = v0 * 0.45; this.v += (vt - this.v) * Math.min(1, dt * 3);
    this.x += this.v * dt; this.cyc += dt * this.v / 430;
    // hoofbeats
    const ph = this.cyc % 1; if (this.airT < 0 && ((this.lastPh < 0.02 && ph >= 0.02) || (this.lastPh < 0.52 && ph >= 0.52))) SFX.hoof(); this.lastPh = ph;
    // smart jump / duck
    const reach = this.v * this.J * 0.5;
    const nj = this.nextOb(o => !o.duck && !o.wet && o.x - this.x > -o.w);
    if (S.set.helper && nj && nj.x - this.x < reach + 30 && this.airT < 0) this.jumpReq = this.t;
    if (this.airT < 0 && this.t - this.jumpReq < 0.9) { if (!nj || nj.x - this.x > reach + this.v * 0.9) this.startJump(); else if (nj.x - this.x <= reach + 12) this.startJump(); }
    const nb = this.nextOb(o => o.duck);
    if (S.set.helper && nb && nb.x - this.x < this.v * 0.45) this.duckReq = this.t;
    if (this.t - this.duckReq < 0.9 && this.duckT <= 0) { if (!nb || nb.x - this.x > this.v * 1.0 || nb.x - this.x < this.v * 0.5) { this.duckT = 0.95; this.duckReq = -9; SFX.whoosh(); } }
    if (this.airT >= 0) { this.airT += dt; const p = this.airT / this.J; if (p >= 1) { this.airT = -1; this.y = 0; SFX.land(); } else this.y = this.JH * 4 * p * (1 - p); }
    // collisions
    for (const o of this.obs) { const dx = o.x - this.x; if (dx > 200) break; if (dx < -o.w - 120) continue;
      if (o.duck) { if (Math.abs(dx) < o.w + 40 && this.duckT <= 0 && !o.hit) { this.bump(o); } }
      else if (o.wet) { if (Math.abs(dx) < o.w && this.y < 20 && !o.splashed) { o.splashed = true; SFX.splash(); this.fx.push({ k: 'splash', x: o.x, t: 0 }); if (!this.tr.green) { this.slowT = 0.6; this.oops = 0.6; } } }
      else if (o.gap) { if (Math.abs(dx) < o.w - 20 && this.y < 12 && !o.hit) { this.bump(o); this.startJump(); } }
      else if (Math.abs(dx) < o.w + 36 && this.y < o.h * 0.75 && !o.hit) { this.bump(o); } }
    // pickups
    const hy = this.y + 150; for (const p of this.picks) { if (p.got) continue; const dx = p.x - this.x; if (dx > 200) continue; if (dx < -200) continue; if (Math.abs(dx) < 80 && Math.abs(p.y - hy) < 110) { p.got = true; this.shoes += p.k === 'star' ? 5 : 1; SFX.ding((this.shoes % 8)); if (p.k === 'star') SFX.sparkle(); this.meter = Math.min(1, this.meter + 0.04); } }
    // forks
    for (const f of this.forks) { if (!f.chosen && this.x > f.x - 60) this.chooseFork(f, 'meadow', true); }
    // stops
    for (const s of this.stops) if (!s.done && this.x >= s.x - 520) { s.done = true; this.phase = 'stop'; this.stopT = 0; this.stopX = s.x; this.stopName = s.name; this.stickers.push(s.name); S.stats.stops++; SFX.fanfare(); setTimeout(() => SFX.whinny('happy'), 500); Music.next(true); confetti(this.hx, this.gy - 200, 60); this.cheer = STOP_CHEERS[(S.stats.stops) % STOP_CHEERS.length]; w.away = 1; Voice.say('cheer', this.cheer); return; }
    // whirligig
    if (w.on && this.x > this.len * 0.1) { w.t += dt; w.giggle = Math.max(0, w.giggle - dt); if (!w.shown) { w.shown = 1; w.d = 1300; }
      if (w.away) w.d = Math.min(1500, w.d + v0 * 1.2 * dt); else if (this.v > v0 * 1.05) w.d -= (this.v - v0 * 1.2) * dt; else w.d += (800 - w.d) * Math.min(1, dt * 0.6);
      if (!w.away && w.d < 70 && this.x < this.len - 600) { if (!this.caught) { this.caught = true; this.shoes += 10; SFX.sparkle(); SFX.nicker(); toast('You caught up with Whirligig! +10', '#2fa39a'); confetti(this.hx + 80, this.gy - 220, 40); } w.giggle = 1.2; w.away = 1; setTimeout(() => { if (scene === this) this.whirl.away = 0; }, 6000 / ((window.__KH && __KH.speed) || 1)); } }
    if (this.x >= this.len) { this.phase = 'finish'; this.stopT = 0; SFX.whinny('victory'); SFX.fanfare(); confetti(this.hx, this.gy - 220, 90); AUD_LOG('raceFinish_' + this.l + '_' + this.r); }
    // fx
    for (const f of this.fx) f.t += dt; this.fx = this.fx.filter(f => f.t < 1);
    // tutorial hints
    if (this.l === 0) { const n = this.nextOb(o => o.x > this.x); this.hint = this.pt < 4 ? 'gallop' : (n && n.x - this.x < 900 && n.x - this.x > 0 && !S.prog.prologue[0]) ? 'jump' : null; }
  },
  resume() { this.phase = 'run'; this.stopHold = false; this.whirl.away = 0; this.whirl.d = Math.max(this.whirl.d, 1000); SFX.whinny('charge'); this.v = this.v0 * 0.7; this.boostT = 1.2; },
  chooseFork(f, which, auto) { if (f.chosen) return; f.chosen = which; if (!auto) SFX.ding(5); const x0 = f.x + 500;
    if (which === 'meadow') { for (let i = 0; i < 10; i++) this.picks.push({ k: 'shoe', x: x0 + i * 85, y: 70 + Math.sin(i * 0.8) * 40 }); this.shoeTotal += 0; }
    else { this.picks.push({ k: 'star', x: x0 + 400, y: 200 }); for (let i = 0; i < 4; i++) this.picks.push({ k: 'shoe', x: x0 + i * 100, y: 70 }); }
    this.picks.sort((a, b) => a.x - b.x); this.forkMsg = { t: 0, s: which === 'meadow' ? 'Horseshoe Meadow!' : 'Star Trail!' }; },
  finishRace() { const stars = 1 + (this.shoes >= this.shoeNeed ? 1 : 0) + (this.bumps <= 2 || this.caught ? 1 : 0);
    const res = awardRace(this.l, this.r, stars, this.shoes, this.stickers);
    go(SC.results, { l: this.l, r: this.r, raceName: LANDS[this.l].races[this.r].n, stars, shoes: this.shoes, shoeNeed: this.shoeNeed, shoeGoal: this.shoes >= this.shoeNeed, bumps: this.bumps, caught: this.caught, res }, true); },
  key(k, e, up) { if (k === ' ' || k === 'ArrowUp' || k === 'w') { if (!up) this.jump(); return true; } if (k === 'ArrowDown' || k === 's') { if (!up) this.duck(); return true; } if (k === 'Shift' || k === 'ArrowRight' || k === 'd') { this.keyGallop = !up; return true; } if ((k === 'p' || k === 'Escape') && !up) { this.paused = !this.paused; return true; } },
  keyup(k) { this.key(k, null, true); },
  /* ---------- draw ---------- */
  draw() { const L = lay(), u = L.u, l = this.l, s = this.hs, gy = this.gy, hx = this.hx; this.prepare(); const A0 = LAND_ART[l], fa = this.fd ? FADE : 0; const A = fa ? Object.assign({}, A0, { sky: A0.sky.map(c => desatHex(c, fa)), ground: desatHex(A0.ground, fa), ground2: desatHex(A0.ground2, fa), path: desatHex(A0.path, fa) }) : A0;
    const camX = this.x; const W = this.TW;
    // sky
    g.fillStyle = lin(0, 0, 0, gy, [[0, A.sky[0]], [1, A.sky[1]]]); g.fillRect(0, 0, VW, VH);
    if (A.night) { const rr = srng(5); for (let i = 0; i < 60; i++) { const x = rr() * VW, y = rr() * gy * 0.7; sparkle(x, y, (1.5 + rr() * 2.5) * (0.7 + 0.3 * Math.sin(T * 3 + i)), '#fff'); } shape(() => C(VW * 0.82, gy * 0.18, 26 * s + 10), '#fff6c8', 0); }
    else sun(VW * 0.85, gy * 0.15, 18 * s + 10);
    ribbon(-20, gy * 0.2, VW + 20, gy * 0.14, 12, 40 * s + 14, { missing: missingThreads(), ghost: 0.14, sparkles: 6, alpha: 0.85, ph: T * 0.3 });
    for (let i = 0; i < 3; i++) cloud(((i * VW / 2.2 - camX * 0.03 * s) % (VW + 300) + VW + 300) % (VW + 300) - 150, gy * (0.3 + i * 0.08), 0.5 + s * 0.5, '#fff', A.night ? 0.25 : 0.9);
    // parallax tiles
    const f1 = ((camX * s * 0.12) % W + W) % W; blit(this.farT, -f1, 0, W, VH); blit(this.farT, W - f1, 0, W, VH);
    const f2 = ((camX * s * 0.45) % W + W) % W; blit(this.midT, -f2, 0, W, VH); blit(this.midT, W - f2, 0, W, VH);
    // ground (with cloud gaps)
    const sx = wx => hx + (wx - camX) * s;
    const gaps = this.obs.filter(o => o.gap && Math.abs(sx(o.x) - VW / 2) < VW).map(o => [sx(o.x - o.w), sx(o.x + o.w)]);
    const drawGround = (x0, x1) => { g.fillStyle = lin(0, gy, 0, VH, [[0, A.ground], [1, A.ground2]]); g.fillRect(x0, gy - 4, x1 - x0, VH - gy + 4); g.fillStyle = A.path; g.fillRect(x0, gy + 6 * s, x1 - x0, 34 * s); strokeOnly(() => { g.moveTo(x0, gy - 4); g.lineTo(x1, gy - 4); }, shade(A.ground2, -0.15), 3); };
    let gx = 0; gaps.sort((a, b) => a[0] - b[0]); for (const [a, b] of gaps) { if (a > gx) drawGround(gx, a); gx = Math.max(gx, b); } if (gx < VW) drawGround(gx, VW);
    for (const [a, b] of gaps) { for (const px of [a, b]) shape(() => { C(px, gy + 6, 20 * s + 8); C(px, gy + 30 * s + 10, 18 * s + 6); }, '#ffffff', 2.6); }
    // ground detail (tufts) at parallax 1
    const step = 140; const first = Math.floor((camX - hx / s) / step) - 1; for (let i = first; i < first + VW / s / step + 3; i++) { const wx = i * step; const x = sx(wx) + ((i * 37) % 60) * s; const kind = ((i * 7919) >>> 0) % 5; const yy = gy + 52 * s + ((i * 13) % 5) * 12 * s;
      if (A.clouds) fillOnly(() => E(x, yy, 18 * s, 6 * s), '#efe6ff'); else if (kind < 2) { strokeOnly(() => { g.moveTo(x - 6 * s, yy); g.lineTo(x - 9 * s, yy - 14 * s); g.moveTo(x, yy); g.lineTo(x, yy - 18 * s); g.moveTo(x + 6 * s, yy); g.lineTo(x + 9 * s, yy - 14 * s); }, shade(A.ground2, -0.2), 2.5 * s + 1); } else if (kind === 2) flower(x, yy, s * 1.8, RIBBON[i % 7]); }
    if (L.port) { const ny0 = gy + 70 * s, nyr = VH - ny0; const st2 = 300; const k2 = 1.3; const f0 = Math.floor((camX * k2 - hx / s) / st2) - 1;
      for (let i = f0; i < f0 + VW / s / st2 + 3; i++) { const x = hx + (i * st2 - camX * k2) * s + ((i * 53) % 90) * s; const hsh = ((i * 2654435761) >>> 0) % 7; const y = ny0 + nyr * (0.25 + ((i * 17) % 5) / 10); nearProp(l, x, y, s * 1.5, hsh); } }
    // stops, forks, finish
    for (const st of this.stops) { const x = sx(st.x); if (x > -200 && x < VW + 200) stopArch(x, gy, s * 1.15, st.name, 'Celebration Stop!', null, LANDS[l].col === '#ffd93d' ? '#ffb02e' : LANDS[l].col); }
    for (const f of this.forks) { const x = sx(f.x); if (x > -100 && x < VW + 100) this.signpost(x, gy, s, f); }
    { const x = sx(this.len); if (x > -200 && x < VW + 300) { finishArch(x, gy, s * 1.2); drawKari(x + 170 * s, gy + 4, s * 0.85, { pose: 'open' }); } }
    // obstacles
    for (const o of this.obs) { const x = sx(o.x); if (x < -300 * s || x > VW + 300 * s) continue; const sh = o.hit && this.t % 0.2 < 0.1 ? 3 : 0;
      if (A.night) { g.save(); g.fillStyle = rad(x, gy - 40 * s, 10, 160 * s, [[0, 'rgba(255,230,140,.45)'], [1, 'rgba(255,230,140,0)']]); g.fillRect(x - 160 * s, gy - 200 * s, 320 * s, 240 * s); g.restore(); lantern(x - 110 * s, gy, s * 1.2, T); }
      switch (o.k) { case 'log': logJump(x + sh, gy, s); break; case 'hay': hayBale(x + sh, gy, s); break; case 'crate': pumpkinCrate(x + sh, gy, s); break; case 'leaf': leafPile(x + sh, gy, s); break; case 'step': cloudStep(x + sh, gy, s); break; case 'branch': branch(x + 40 * s, gy, s, 250); break; case 'puddle': puddle(x, gy + 10 * s, s); break; case 'gap': break; } }
    // pickups
    for (const p of this.picks) { if (p.got) continue; const x = sx(p.x); if (x < -40 || x > VW + 40) continue; const y = gy - p.y * s; if (p.k === 'star') starPickup(x, y, 26 * s + 6, T); else { g.save(); g.translate(x, y); g.rotate(Math.sin(T * 4 + p.x) * 0.2); horseshoe(0, 0, 16 * s + 4); g.restore(); } }
    // horse
    const fi = Math.floor(this.cyc * 8) % 8; let spr = this.phase === 'count' || (this.phase === 'stop' && this.v < 40) ? this.sframe : this.airT >= 0 ? this.jframe : (this.duckT > 0 ? this.dframes : this.frames)[fi];
    const hy = gy - this.y * s + (this.oops > 0 ? Math.sin(this.oops * 20) * 3 : 0);
    groundShadow(hx, gy, 105 * s * (1 - this.y / 500), 12 * s, this.airT >= 0 ? 0.14 : 0.22);
    if (this.galloping || this.boostT > 0) { for (let i = 0; i < 4; i++) { const yy = hy - (60 + i * 50) * s; strokeOnly(() => { g.moveTo(hx - 170 * s - i * 10, yy); g.lineTo(hx - 240 * s - i * 20, yy); }, 'rgba(255,255,255,.75)', 4); } }
    blit(spr, hx - 190 * s, hy - 350 * s, 380 * s, 374 * s);
    if (this.fx.some(f => f.k === 'shield')) { const f = this.fx.find(f => f.k === 'shield'); g.save(); g.globalAlpha = 1 - f.t; strokeOnly(() => E(hx, hy - 150 * s, 200 * s, 190 * s), '#ffb3c7', 8); shape(() => heart(hx, hy - 330 * s - f.t * 40, 16), '#ff6f91', 2.5); g.restore(); }
    for (const f of this.fx) if (f.k === 'splash') { const x = sx(f.x); for (let i = 0; i < 8; i++) { const a = -Math.PI * (0.15 + i * 0.1); fillOnly(() => C(x + Math.cos(a) * f.t * 120 * s, gy - Math.sin(a) * f.t * 120 * s + f.t * f.t * 200 * s, 6 * s + 2), 'rgba(140,210,255,.8)'); } }
    if (this.oops > 0.4 && this.phase === 'run') text('Oops!', hx + 40 * s, hy - 380 * s, 22 * u, '#fff', { fam: F.title, w: 400, stroke: INK, sw: 5 });
    // whirligig
    const w = this.whirl; if (w.on && w.shown && this.phase !== 'count') { const wx = hx + w.d * s, wy = gy - 230 * s + Math.sin(T * 2.5) * 14 * s; if (wx < VW + 60 * s) { whirligig(wx, wy, s * 0.95, { thread: LANDS[l].thread }); if (w.giggle > 0) text('Hee hee!', wx, wy - 150 * s, 18 * u, '#fff', { fam: F.title, w: 400, stroke: INK, sw: 5 }); }
      else if (!w.away) { const ay = gy - 230 * s; shape(() => { g.moveTo(VW - 8 - L.x0 * 0, ay); g.lineTo(VW - 30, ay - 16); g.lineTo(VW - 30, ay + 16); g.closePath(); }, '#c9b8ff', 2.5); } }
    if (A.night) { g.save(); g.fillStyle = rad(hx, gy - 120 * s, 120 * s, Math.max(VW, VH) * 0.8, [[0, 'rgba(10,10,40,0)'], [1, 'rgba(10,10,40,.45)']]); g.fillRect(0, 0, VW, VH); g.restore(); }
    // stop celebration overlay
    if (this.phase === 'stop') this.stopOverlay(L);
    if (this.phase === 'count') { const c = 3 - Math.floor(this.t / 0.75); const p = (this.t % 0.75) / 0.75; const R0c = clamp(52 * u, 48, 74); const tw = Math.min(L.cw - 30, 560, L.port ? 9999 : VW - 2 * (Math.max(L.x0, VW - L.x1) + R0c * 2.6 + 24)), tfs = clamp(17 * u, 15, 22); const lines = wrapLines(LANDS[l].tip, tw - 30, tfs, F.body, 700); const th = lines.length * tfs * 1.3 + 20; const hTop = gy - 335 * s; const tipY = Math.max(L.y0 + 60 + 80 * u, Math.min(VH * 0.36 + 70 * u, hTop - 12 - th)); const numY = Math.min(VH * 0.36, tipY - 52 * u); g.save(); g.translate(VW / 2, numY); const sc = 1.4 - p * 0.4; g.scale(sc, sc); text(c > 0 ? String(c) : 'GO!', 0, 0, 90 * u, '#fff', { fam: F.title, w: 400, stroke: '#7446c4', sw: 16 }); g.restore();
      panel(VW / 2 - tw / 2, tipY, tw, th, 16, '#fffaf2', { lw: 3 }); box('raceTip', VW / 2 - tw / 2, tipY, tw, th); lines.forEach((ln, i) => text(ln, VW / 2, tipY + 10 + tfs * 0.65 + i * tfs * 1.3, tfs, INK, { fam: F.body, w: 700 })); }
    if (this.phase === 'finish') { const p = clamp(this.stopT / 0.6, 0, 1); g.save(); g.translate(VW / 2, VH * 0.3); g.scale(easeBack(p), easeBack(p)); bannerRibbon(0, 0, Math.min(L.cw - 80, 420), 64 * Math.min(u, 1.3), '#ff6f91', 'You finished!', 34 * Math.min(u, 1.3)); g.restore(); }
    if (this.forkMsg) { this.forkMsg.t += DT; if (this.forkMsg.t < 1.6) text(this.forkMsg.s, VW / 2, VH * 0.3, 28 * u, '#fff', { fam: F.title, w: 400, stroke: '#7446c4', sw: 7 }); }
    this.hud(L); this.controls(L);
    if (this.paused) this.pauseModal(L);
  },
  signpost(x, gy, s, f) { g.save(); g.translate(x, gy); g.scale(s, s); shape(() => RR(-8, -200, 16, 200, 4), '#8a5a3a', 3);
    for (const [dy, lab, col, dir] of [[-190, 'Meadow', '#6bd66b', 1], [-130, 'Trail', '#ffb02e', 1]]) { shape(() => { g.moveTo(-70, dy); g.lineTo(60, dy); g.lineTo(84, dy + 20); g.lineTo(60, dy + 40); g.lineTo(-70, dy + 40); g.closePath(); }, (f.chosen === (lab === 'Meadow' ? 'meadow' : 'trail')) ? '#ffd93d' : col, 3); text(lab, 0, dy + 21, 20, INK, { fam: F.title, w: 400 }); }
    g.restore(); },
  stopOverlay(L) { const u = L.u, p = clamp(this.stopT / 0.5, 0, 1); g.save(); g.globalAlpha = 0.25 * p; g.fillStyle = '#fff'; g.fillRect(0, 0, VW, VH); g.restore();
    const by0 = L.y0 + 110 * Math.min(u, 1.3); g.save(); g.translate(VW / 2, by0); g.scale(easeBack(p), easeBack(p)); bannerRibbon(0, 0, Math.min(L.cw - 90, 440), 60 * Math.min(u, 1.3), '#ffb02e', this.cheer, 30 * Math.min(u, 1.3)); g.restore();
    const sp = clamp((this.stopT - 0.6) / 0.5, 0, 1); const r = Math.min(46 * Math.min(u, 1.4), (this.gy - 250 * this.hs - by0 - 90) / 2.6); const scx = L.port ? VW / 2 : L.x0 + L.cw * 0.72; if (sp > 0 && r > 18) { g.save(); g.translate(scx, by0 + r + 46 * Math.min(u, 1.3)); g.rotate((1 - sp) * 2); g.scale(easeBack(sp), easeBack(sp)); stickerArt(this.stopName, 0, 0, r, this.l, true); g.restore(); text('Sticker: ' + this.stopName, scx, by0 + r * 2 + 62 * Math.min(u, 1.3), 18 * Math.min(u, 1.3), '#fff', { fam: F.title, w: 400, stroke: INK, sw: 5, max: L.port ? L.cw - 30 : L.cw * 0.5 }); }
    if (this.stopT > 1.0) { const bw = Math.min(260, L.cw * 0.6), bh = clamp(60 * u, 56, 80); btn('stopGo', L.port ? VW / 2 - bw / 2 : L.x0 + L.cw * 0.72 - bw / 2, L.port ? this.gy + (L.y1 - this.gy) * 0.3 : this.gy - bh * 0.4, bw, bh, 'Keep going!', { col: '#6bd66b', fn: () => this.resume() }); } },
  hud(L) { const u = L.u; const top = L.y0 + 8; const hh = clamp(40 * u, 38, 54);
    ibtn('pause', L.x0 + hh / 2 + 10, top + hh / 2, hh / 2, (x, y, r) => icPause(x, y, r), { fn: () => { this.paused = true; SFX.ui(); }, minHit: 50 });
    // progress
    const px = L.x0 + hh + 24, pw = L.cw - hh - 24 - (110 * Math.min(u, 1.3)) - 20, py = top + hh / 2;
    shape(() => RR(px, py - 7, pw, 14, 7), 'rgba(255,255,255,.85)', 2.5); fillOnly(() => RR(px + 2, py - 5, Math.max(10, (pw - 4) * this.prog), 10, 5), LANDS[this.l].col);
    for (const st of this.stops) { const x = px + pw * st.x / this.len; shape(() => C(x, py, 8), st.done ? '#ffd93d' : '#fff', 2); }
    { const x = px + pw; shape(() => RR(x - 6, py - 14, 12, 28, 3), '#fff', 2); }
    const hxp = px + pw * this.prog; shape(() => C(hxp, py, 10), '#fff', 2.5); fillOnly(() => C(hxp, py, 5), '#ff6f91');
    if (this.whirl.on) { const wx = px + pw * clamp((this.x + this.whirl.d) / this.len, 0, 1); fillOnly(() => C(wx, py - 14, 5), '#c9b8ff'); strokeOnly(() => C(wx, py - 14, 5), INK, 2); }
    box('progress', px, py - 14, pw, 28);
    // hearts + shoes
    const rx = L.x1 - 10; shoeCounter(rx, top + 2, hh - 4, this.shoes);
    for (let i = 0; i < this.maxHearts; i++) { const hx2 = L.x1 - 20 - i * 26 * Math.min(u, 1.2), hy2 = top + hh + 18; shape(() => heart(hx2, hy2 + 4, 11 * Math.min(u, 1.2)), i < this.hearts ? '#ff6f91' : 'rgba(255,255,255,.6)', 2.2); }
    if (this.maxHearts) box('hearts', L.x1 - 20 - (this.maxHearts - 1) * 26 * Math.min(u, 1.2) - 14, top + hh + 4, (this.maxHearts - 1) * 26 * Math.min(u, 1.2) + 28, 28);
  },
  controls(L) { if (this.phase === 'finish' || this.phase === 'stop') return; const u = L.u; const R0 = clamp(52 * u, 48, 74); const swap = S.set.swap; const by = L.y1 - R0 - clamp(13 * u, 12, 17) * 1.5 - 8;
    const gxL = L.x0 + R0 + 18, gxR = L.x1 - R0 - 18; const gX = swap ? gxR : gxL, jX = swap ? gxL : gxR;
    const hudB = L.y0 + 60 * u + 40; const ctrlTop = by - R0 - (this.l >= 4 ? R0 * 2.1 : 0) - 20;
    if (this.phase === 'run') hit('jumpArea', swap ? 0 : VW / 2, hudB, VW / 2, Math.max(0, ctrlTop - hudB), { down: () => this.jump(), bg: 1, sfx: 0 });
    // gallop (hold)
    ibtn('gallop', gX, by, R0, (x, y, r) => { horseshoe(x, y - r * 0.15, r * 0.6, '#fff'); }, { col: this.galloping ? '#ffb02e' : '#ff8c2e', hold: true, ring: this.meter, label: 'GALLOP', lfs: clamp(13 * u, 12, 17), lc: '#fff', lstroke: INK });
    const hj = HITS[HITS.length - 1]; if (hj) hj.sfx = 0;
    ibtn('jump', jX, by, R0, (x, y, r) => { shape(() => { g.moveTo(x - r * 0.7, y + r * 0.35); g.lineTo(x, y - r * 0.55); g.lineTo(x + r * 0.7, y + r * 0.35); g.lineTo(x + r * 0.35, y + r * 0.35); g.lineTo(x, y - r * 0.05); g.lineTo(x - r * 0.35, y + r * 0.35); g.closePath(); }, '#fff', 2.5); }, { col: '#3f6fd8', label: 'JUMP', lfs: clamp(13 * u, 12, 17), lc: '#fff', lstroke: INK });
    const h2 = HITS[HITS.length - 1]; if (h2 && h2.id === 'jump') { h2.down = () => this.jump(); h2.sfx = 0; }
    if (this.l >= 4) { const dr = R0 * 0.78; ibtn('duck', jX + (swap ? R0 * 0.25 : -R0 * 0.25), by - R0 - dr - 26, dr, (x, y, r) => { shape(() => { g.moveTo(x - r * 0.7, y - r * 0.35); g.lineTo(x, y + r * 0.55); g.lineTo(x + r * 0.7, y - r * 0.35); g.lineTo(x + r * 0.35, y - r * 0.35); g.lineTo(x, y + r * 0.05); g.lineTo(x - r * 0.35, y - r * 0.35); g.closePath(); }, '#fff', 2.5); }, { col: '#2fa39a', label: 'DUCK', lfs: clamp(12 * u, 11, 16), lc: '#fff', lstroke: INK });
      const h3 = HITS[HITS.length - 1]; if (h3 && h3.id === 'duck') { h3.down = () => this.duck(); h3.sfx = 0; } }
    // forks: choice buttons
    const f = this.forks.find(f => !f.chosen && f.x - this.x < 2600 && f.x - this.x > 0);
    if (f && this.phase === 'run') { const bw = Math.min(200 * u, L.cw * 0.4), bh = clamp(54 * u, 52, 70); const y = L.y0 + 60 * u + (L.port ? 90 : 52); const cx = VW / 2;
      text('Pick a path!', cx, y - 14, 18 * u, '#fff', { fam: F.title, w: 400, stroke: INK, sw: 5 });
      btn('forkA', cx - bw - 8, y, bw, bh, 'Meadow', { col: '#6bd66b', fn: () => this.chooseFork(f, 'meadow') }); btn('forkB', cx + 8, y, bw, bh, 'Trail', { col: '#ffb02e', fn: () => this.chooseFork(f, 'trail') }); }
    // tutorial hints
    if (this.hint && this.phase === 'run') { const isJ = this.hint === 'jump'; const tx = isJ ? jX : gX; const ty = by - R0 - (this.l >= 4 && isJ ? R0 * 2 : 0) - 34; const pulse = 1 + Math.sin(T * 8) * 0.08; g.save(); g.translate(tx, ty); g.scale(pulse, pulse); const label = isJ ? 'Tap JUMP!' : 'Hold GALLOP!'; const tw = measure(label, 18 * u, F.title, 400) + 26; const bx = clamp(-tw / 2, L.x0 + 6 - tx, L.x1 - 6 - tx - tw); panel(bx, -20, tw, 34, 17, '#fff1a8', { lw: 2.5 }); text(label, bx + tw / 2, -3, 18 * u, INK, { fam: F.title, w: 400 }); g.restore(); }
  },
  pauseModal(L) { const u = L.u; LAYER = 4; dim(0.5); backdropHit(null); const w = Math.min(L.cw - 40, 380), bh = clamp(60 * u, 56, 80), ht = bh * 4 + 110, x = VW / 2 - w / 2, y = L.y0 + (L.ch - ht) / 2;
    panel(x, y, w, ht, 24, '#fffaf2', { lw: 3.5 }); text('Paused', VW / 2, y + 40, 30, '#7446c4', { fam: F.title, w: 400 });
    btn('pResume', x + 20, y + 76, w - 40, bh, 'Keep riding', { col: '#6bd66b', fn: () => { this.paused = false; } });
    btn('pRestart', x + 20, y + 86 + bh, w - 40, bh, 'Start again', { col: '#ffb02e', fn: () => { this.paused = false; go(SC.race, { l: this.l, r: this.r }, true); } });
    btn('pMusic', x + 20, y + 96 + bh * 2, w - 40, bh, S.set.music > 0 ? 'Music: on' : 'Music: off', { col: '#3f6fd8', fn: () => { S.set.music = S.set.music > 0 ? 0 : 0.7; applyVol(); save(); } });
    btn('pMap', x + 20, y + 106 + bh * 3, w - 40, bh, 'Back to the map', { col: '#9b8ab8', fn: () => { this.paused = false; go(SC.map); } });
    LAYER = 0; } };

function nearProp(l, x, y, s, k) { if (l === 7) { cloud(x, y, s * 0.7, '#ffffff', 0.95); return; }
  if (l === 6) { if (k < 3) pine(x, y, s * 0.9, '#2a4a5a', '#eef3ff'); else if (k < 5) lantern(x, y, s, 0); return; }
  if (l === 5 && k < 2) { shape(() => E(x, y - 8 * s, 30 * s, 12 * s), '#e8d4a0', 2); fillOnly(() => E(x - 8 * s, y - 12 * s, 8 * s, 3 * s), '#fff'); return; }
  if (k < 2) { shape(() => { C(x - 18 * s, y - 14 * s, 16 * s); C(x, y - 24 * s, 20 * s); C(x + 18 * s, y - 14 * s, 16 * s); E(x, y - 8 * s, 34 * s, 10 * s); }, l === 2 ? '#c9b04a' : l === 3 ? '#a8c25a' : '#5fb85a', 2.5); for (let j = 0; j < 4; j++) flower(x - 18 * s + j * 12 * s, y - 20 * s - (j % 2) * 10 * s, s * 0.9, RIBBON[(k + j) % 7]); }
  else if (k < 4) { for (let j = 0; j < 3; j++) flower(x + j * 16 * s, y - (j % 2) * 8 * s, s * 1.4, RIBBON[(k * 3 + j) % 7]); }
  else if (k === 4) fence(x - 50 * s, x + 50 * s, y, s * 0.9);
  else if (l === 2) pumpkin(x, y, s * 1.4); else if (l === 3) sunflower(x, y, s * 0.8); else if (l === 4) mushroom(x, y, s * 1.6); else strokeOnly(() => { g.moveTo(x - 8 * s, y); g.lineTo(x - 12 * s, y - 18 * s); g.moveTo(x, y); g.lineTo(x, y - 24 * s); g.moveTo(x + 8 * s, y); g.lineTo(x + 12 * s, y - 18 * s); }, '#3f8a4a', 3); }
