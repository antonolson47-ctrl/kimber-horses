/* ===================== BOW & GALLOP (interlude after race 2): first-person horseback archery at targets only ===================== */
function laneGeo() { const L = lay(); const vpx = VW / 2, vpy = Math.round(L.port ? VH * 0.39 : VH * 0.42); const F = Math.max(VW, VH * 0.55) / 3.6; const k = L.port ? Math.min(VW / 390, VH / 844 * 1.25) : Math.min(VW / 390, VH / 844 * 1.15); return { L, vpx, vpy, F, k, camH: 2.2, ox: VW / 2 - 205 * k, oy: VH - 844 * k }; }
function laneProj(G, X, Y, dz) { const p = G.F / dz; return [G.vpx + X * p, G.vpy + (G.camH - Y) * p, p]; }
function laneBGfull(l, camZ) { const W = VW, H = VH, A = LAND_ART[l] || LAND_ART[1]; const G = laneGeo(); const vpy = G.vpy, vpx = G.vpx;
  const sp = sprite('lane' + l + 'x' + W + 'x' + H, W, H, () => { const s = clamp(Math.min(W / 700, H / 700), 0.35, 1.1);
    g.fillStyle = lin(0, 0, 0, vpy, [[0, A.sky[0]], [1, A.sky[1]]]); g.fillRect(0, 0, W, vpy + 30);
    if (A.night) { const rr = srng(5); for (let i = 0; i < 50; i++) sparkle(rr() * W, rr() * vpy * 0.85, 1.5 + rr() * 3, '#fff'); shape(() => C(W * 0.18, vpy * 0.25, 22 * s + 6), '#fff6c8', 0); } else { sun(W * 0.18, vpy * 0.3, 20 * s + 6); cloud(W * 0.75, vpy * 0.28, 0.45 * s + 0.15, '#fff', 0.9); cloud(W * 0.4, vpy * 0.5, 0.32 * s + 0.12, '#fff', 0.85); }
    landFar(l, W, H, vpy - 2);
    g.fillStyle = lin(0, vpy, 0, H, [[0, A.ground], [1, A.ground2]]); g.fillRect(0, vpy, W, H - vpy);
    fillOnly(() => { g.moveTo(vpx - 4, vpy); g.lineTo(vpx + 4, vpy); g.lineTo(W * 0.5 + G.F * 3.2, H); g.lineTo(W * 0.5 - G.F * 3.2, H); g.closePath(); }, lin(0, vpy, 0, H, [[0, A.path], [1, shade(A.path, -0.12)]]));
    for (const side of [-1, 1]) for (const Y of [1.0, 0.55]) { strokeOnly(() => { const [x0, y0] = laneProj(G, side * 4.2, Y, 60), [x1, y1] = laneProj(G, side * 4.2, Y, 0.9); g.moveTo(x0, y0); g.lineTo(x1, y1); }, A.night ? '#d8dcff' : '#ffffff', 3); } });
  blit(sp, 0, 0, W, H);
  // moving posts + grass tufts give the gallop its speed
  const step = 2.5; for (let z = Math.ceil(camZ / step) * step + step * 24; z > camZ + 0.8; z -= step) { const dz = z - camZ; for (const side of [-1, 1]) { const [x, yT, p] = laneProj(G, side * 4.2, 1.15, dz), [, yB] = laneProj(G, side * 4.2, 0, dz); if (x < -40 || x > W + 40) continue; strokeOnly(() => { g.moveTo(x, yT); g.lineTo(x, yB); }, INK, Math.max(1.5, p * 0.16)); strokeOnly(() => { g.moveTo(x, yT); g.lineTo(x, yB); }, A.night ? '#d8dcff' : '#fff', Math.max(1, p * 0.1)); }
    const [mx, my, p2] = laneProj(G, ((z * 7.31) % 5) - 2.5, 0, dz); fillOnly(() => E(mx, my, p2 * 0.12, p2 * 0.03), 'rgba(120,80,40,.25)'); } }
// first-person horse neck from the saddle, drawn in a 390x844 design space
function horseFromSaddle(h, bob) { const c = horseCoat(h), Wd = 390, Hd = 844, y0 = 600 + bob;
  const neck = () => { g.moveTo(80, Hd + 10); g.bezierCurveTo(110, 760, 140, y0 + 60, 160, y0 + 20); g.lineTo(252, y0 + 20); g.bezierCurveTo(270, y0 + 60, 300, 760, 330, Hd + 10); g.closePath(); };
  shape(neck, lin(0, y0, 0, Hd, [[0, shade(c.base, 0.06)], [1, shade(c.base, -0.12)]]), 3.2); fillOnly(() => E(206, 790, 60, 70), 'rgba(255,255,255,.08)');
  for (const [ex, rot] of [[172, -0.25], [240, 0.25]]) { g.save(); g.translate(ex, y0 + 22); g.rotate(rot + Math.sin(bob * 0.3) * 0.04); shape(() => { g.moveTo(-14, 0); g.quadraticCurveTo(-10, -44, 0, -56); g.quadraticCurveTo(10, -44, 14, 0); g.closePath(); }, c.base, 3); fillOnly(() => { g.moveTo(-6, -2); g.quadraticCurveTo(-4, -34, 0, -44); g.quadraticCurveTo(4, -34, 6, -2); g.closePath(); }, '#e7a98a'); g.restore(); }
  const mane = () => { g.moveTo(198, y0 + 30); g.bezierCurveTo(200, y0 + 120, 204, 760, 196, Hd + 10); g.lineTo(262, Hd + 10); for (let kk = 10; kk >= 0; kk--) { const t = kk / 10, yy = y0 + 30 + t * (Hd - y0 - 20), xx = 214 + t * 10 + 14 + t * 34; g.quadraticCurveTo(xx + 10, yy + 12, xx - (kk % 2) * 8, yy); } g.closePath(); };
  shape(mane, c.mane, 3); for (let kk = 0; kk < 7; kk++) strokeOnly(() => { const yy = y0 + 70 + kk * 30; g.moveTo(206, yy); g.quadraticCurveTo(222 + kk * 3, yy + 6, 232 + kk * 5, yy + 18); }, shade(c.mane, 0.25), 2);
  shape(() => { g.moveTo(194, y0 + 18); g.quadraticCurveTo(206, y0 - 6, 220, y0 + 18); g.quadraticCurveTo(212, y0 + 40, 200, y0 + 36); g.closePath(); }, c.mane, 2.4);
  strokeOnly(() => { g.moveTo(150, y0 + 40); g.quadraticCurveTo(206, y0 + 22, 262, y0 + 40); }, INK, 9); strokeOnly(() => { g.moveTo(150, y0 + 40); g.quadraticCurveTo(206, y0 + 22, 262, y0 + 40); }, '#7a4a2a', 5.5);
  for (let kk = 0; kk < 6; kk++) fillOnly(() => C(160 + kk * 18, y0 + 34 - Math.sin((kk / 5) * Math.PI) * 8, 3), '#b98aff');
  strokeOnly(() => { g.moveTo(130, Hd); g.quadraticCurveTo(206, 700 + bob, 286, Hd); }, INK, 9); strokeOnly(() => { g.moveTo(130, Hd); g.quadraticCurveTo(206, 700 + bob, 286, Hd); }, '#7a4a2a', 5); shape(() => E(206, 756 + bob * 0.5, 12, 8), '#7a4a2a', 2.5); }
function limbD(x0, y0, x1, y1, w, col) { strokeOnly(() => { g.moveTo(x0, y0); g.lineTo(x1, y1); }, INK, w + 6); strokeOnly(() => { g.moveTo(x0, y0); g.lineTo(x1, y1); }, col, w); }
function kimArmL(gx, gy) { const sx = -10, sy = 790, dx = gx - sx, dy = gy - sy, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
  limbD(sx, sy, gx - ux * 10, gy - uy * 10, 40, KIM.skin); limbD(sx + ux * d * 0.55, sy + uy * d * 0.55, sx + ux * d * 0.8, sy + uy * d * 0.8, 44, '#ff6fa5');
  strokeOnly(() => { const px = sx + ux * d * 0.62, py = sy + uy * d * 0.62; g.moveTo(px - uy * 18, py + ux * 18); g.lineTo(px + uy * 18, py - ux * 18); }, '#fff', 2.5);
  limbD(-60, sy + 60, sx + ux * 60, sy + uy * 60, 66, KIM.shirt);
  shape(() => E(gx - 2, gy + 4, 18, 24, 0.2), KIM.skin, 3); strokeOnly(() => { g.moveTo(gx - 12, gy - 6); g.lineTo(gx + 10, gy - 4); g.moveTo(gx - 12, gy + 6); g.lineTo(gx + 10, gy + 8); g.moveTo(gx - 12, gy + 18); g.lineTo(gx + 8, gy + 19); }, KIM.skinSh, 2); }
function kimHandR(x, y) { limbD(420, 820, x + 14, y + 22, 44, KIM.skin); limbD(460, 860, 370, 790, 70, KIM.shirt);
  shape(() => E(x + 4, y + 16, 22, 26, -0.4), KIM.skin, 3); strokeOnly(() => { g.moveTo(x - 10, y + 6); g.lineTo(x + 10, y + 2); g.moveTo(x - 12, y + 18); g.lineTo(x + 8, y + 14); }, KIM.skinSh, 2); }
function targetArt(x, y, r, o = {}) { if (!o.noStand) { const leg = () => { g.moveTo(x - r * 0.6, y + r * 0.6); g.lineTo(x - r * 0.9, y + r * 2.2); g.moveTo(x + r * 0.6, y + r * 0.6); g.lineTo(x + r * 0.9, y + r * 2.2); }; strokeOnly(leg, INK, r * 0.2 + 2); strokeOnly(leg, '#a8692f', r * 0.12 + 1);
    strokeOnly(() => { g.moveTo(x + r * 0.8, y - r * 0.6); g.lineTo(x + r * 0.8, y - r * 1.7); }, INK, Math.max(1.5, r * 0.06)); fillOnly(() => { g.moveTo(x + r * 0.8, y - r * 1.7); g.lineTo(x + r * 1.5, y - r * 1.5); g.lineTo(x + r * 0.8, y - r * 1.3); g.closePath(); }, o.flag || '#ff6f91'); }
  const rings = ['#ffffff', '#4cc3ff', '#ff5a6e', '#ffd93d']; shape(() => C(x, y, r), '#fff', Math.max(1.6, r * 0.07)); rings.forEach((c, i) => fillOnly(() => C(x, y, r * (1 - i * 0.22) - r * 0.05), c)); fillOnly(() => C(x, y, r * 0.12), '#ffb02e');
  if (o.glow) { g.save(); g.setLineDash([r * 0.3, r * 0.2]); strokeOnly(() => C(x, y, r * 1.28), '#fff3a8', 4); g.restore(); strokeOnly(() => C(x, y, r * 1.4), 'rgba(255,243,168,.45)', 8); } }
function balloonArt(x, y, r, col) { strokeOnly(() => { g.moveTo(x, y + r); g.quadraticCurveTo(x + r * 0.3, y + r * 2, x, y + r * 3); }, INK, 1.5); shape(() => E(x, y, r * 0.85, r), col, Math.max(1.5, r * 0.1)); fillOnly(() => E(x - r * 0.3, y - r * 0.35, r * 0.18, r * 0.3, 0.4), 'rgba(255,255,255,.6)'); fillOnly(() => { g.moveTo(x - r * 0.15, y + r); g.lineTo(x + r * 0.15, y + r); g.lineTo(x, y + r * 1.15); g.closePath(); }, col); }
function lanternTarget(x, y, r) { fillOnly(() => C(x, y, r * 1.8), 'rgba(255,226,138,.25)'); shape(() => RR(x - r * 0.75, y - r, r * 1.5, r * 2, r * 0.4), '#ff9f43', Math.max(1.5, r * 0.08)); fillOnly(() => C(x, y, r * 0.55), '#fff3a8'); strokeOnly(() => { g.moveTo(x, y - r); g.lineTo(x, y - r * 1.6); }, INK, Math.max(1, r * 0.08)); targetArt(x, y, r * 0.5, { noStand: 1 }); }
const BOW_TYPES = [null, ['easel'], ['easel'], ['easel', 'pop'], ['easel', 'pop', 'balloon'], ['easel', 'balloon', 'mover'], ['lantern', 'mover', 'balloon'], ['cloud', 'balloon', 'mover']];
SC.bow = { name: 'bow',
  enter(a) { this.a = a = Object.assign({ l: 1, slot: 1 }, a || {}); const l = this.l = clamp(a.l, 1, 7); this.t = 0; this.intro = true; this.paused = false;
    this.arrows = 8 + Math.floor((l - 1) / 3) + perkArrows(); this.left = this.arrows; this.camZ = 0; this.speed = S.set.slow ? 2.4 : 3.0; this.hits = 0; this.bulls = 0; this.pops = 0; this.streak = 0; this.pay = 0; this.fly = []; this.fx = []; this.draw0 = -1; this.ret = null; this.endT = -1; this.ended = false;
    const types = BOW_TYPES[l]; this.targets = []; const n = this.arrows; const rr = srng(77 + l * 13 + (a.replay ? Math.floor(Math.random() * 999) : 0));
    for (let i = 0; i < n; i++) { const k = types[i % types.length]; const side = l === 1 ? -1 : (rr() < 0.5 ? -1 : 1); this.targets.push({ k, z: 14 + i * 6.5, X: side * (2.2 + rr() * 0.8), Y: k === 'balloon' || k === 'cloud' ? 2.0 + rr() * 0.6 : 1.5, r: k === 'balloon' ? 0.55 : 0.8, ph: rr() * 6, col: RIBBON[Math.floor(rr() * 7)], hit: false, stuck: null }); }
    if (l === 7) this.targets.push({ k: 'bubble', z: 14 + n * 6.5, X: 0.3, Y: 2.6, r: 0.6, ph: 0, hit: false, bonus: true });
    this.len = this.targets[this.targets.length - 1].z + 2; Music.play('lane'); this.mom = 'Let\u2019s see your archery, Kimber!';
    setTimeout(() => { if (scene === this && this.intro) Voice.say('bowIntro', this.mom + ' Your horse gallops by itself. Hold to pull the bow, slide to aim, and let go to shoot the targets.'); }, 400); },
  tpos(T, G) { const dz = T.z - this.camZ; if (dz < 0.6) return null; let X = T.X; if (T.k === 'mover') X += Math.sin(this.t * 1.6 + T.ph) * 0.9; let Y = T.Y; if (T.k === 'balloon' || T.k === 'cloud' || T.k === 'bubble') Y += Math.sin(this.t * 2 + T.ph) * 0.12; let up = 1; if (T.k === 'pop') up = clamp((16 - dz) / 3, 0, 1); const [x, y, p] = laneProj(G, X, Y, dz); return { x, y, r: T.r * p, dz, up }; },
  live(G) { const out = []; for (const T of this.targets) { if (T.hit) continue; const p = this.tpos(T, G); if (!p || p.up < 0.6 || p.dz > 22) continue; out.push([T, p]); } return out; },
  nearest(x, y, G) { let best = null, bd = 1e9; for (const [T, p] of this.live(G)) { const d = Math.hypot(p.x - x, p.y - y) - p.r; if (d < bd) { bd = d; best = [T, p, d]; } } return best; },
  ptr(type, x, y) { if (this.intro || this.paused || this.endT >= 0) return; const G = laneGeo();
    if (type === 'down') { if (this.left <= 0) return; this.draw0 = this.t; const nb = this.nearest(VW / 2, G.vpy + G.F * 0.3, G); this.lock = nb ? nb[0] : null; this.base = nb ? [nb[1].x, nb[1].y] : [G.vpx, G.vpy + G.F * 0.12]; this.off = [0, 0]; this.f0 = [x, y]; this.ret = this.base.slice(); SFX.ui(); }
    else if (type === 'move' && this.draw0 >= 0) { this.off = [(x - this.f0[0]) * 1.4, (y - this.f0[1]) * 1.4]; }
    else if (type === 'up' && this.draw0 >= 0) this.shoot(G);
    else if (type === 'cancel') this.draw0 = -1; },
  key(k) { if (this.intro && (k === 'Enter' || k === ' ')) { this.intro = false; return true; } if (k === ' ' && this.draw0 < 0) { this.ptr('down', VW / 2, VH / 2); return true; } },
  keyup(k) { if (k === ' ' && this.draw0 >= 0) this.ptr('up', VW / 2, VH / 2); },
  power() { return this.draw0 < 0 ? 0 : clamp((this.t - this.draw0) / 0.6, 0, 1); },
  shoot(G) { const pw = Math.max(0.2, this.power()); this.draw0 = -1; if (this.left <= 0) return; this.left--; SFX.thwip();
    const ret = this.ret || [G.vpx, G.vpy]; let T = null, bull = false; const nb = this.lock && !this.lock.hit ? [this.lock, this.tpos(this.lock, G)] : null;
    if (nb && nb[1]) { const d = Math.hypot(nb[1].x - ret[0], nb[1].y - ret[1]); if (d < nb[1].r * 1.6 + 26 || S.set.helper) { if (pw >= 0.3 || nb[1].dz < 7) { T = nb[0]; bull = pw >= 0.85 && d < nb[1].r * 0.8 && (T.k === 'easel' || T.k === 'pop' || T.k === 'mover'); } } }
    const k = G.k; this.fly.push({ T, bull, t: 0, x0: G.ox + 150 * k, y0: G.oy + 460 * k, tx: ret[0], ty: ret[1], ox: T ? ret[0] - nb[1].x : 0, oy: T ? ret[1] - nb[1].y : 0, pw }); },
  update(dt) { if (this.paused) return; this.t += dt; if (this.intro) return; const G = laneGeo();
    if (this.endT < 0) this.camZ += this.speed * dt;
    // reticle follows the locked target + finger offset; aim assist re-locks to the nearest target
    if (this.draw0 >= 0) { let lp = this.lock ? this.tpos(this.lock, G) : null; if (this.lock && (!lp || this.lock.hit)) { this.lock = null; lp = null; } const base = lp ? [lp.x, lp.y] : this.base; let r = [base[0] + this.off[0], base[1] + this.off[1]];
      if (S.set.helper) { const nb = this.nearest(G.vpx, G.vpy + G.F * 0.3, G); if (nb) { this.lock = nb[0]; r = [nb[1].x, nb[1].y]; this.off = [0, 0]; } }
      else { const nb = this.nearest(r[0], r[1], G); if (nb && nb[0] !== this.lock && nb[2] < (lp ? Math.hypot(lp.x - r[0], lp.y - r[1]) - lp.r : 1e9)) { this.lock = nb[0]; this.base = [nb[1].x, nb[1].y]; this.off = [r[0] - nb[1].x, r[1] - nb[1].y]; } }
      this.ret = [clamp(r[0], 8, VW - 8), clamp(r[1], G.L.y0 + 60, VH - 40)]; }
    for (const f of this.fly) { f.t += dt / 0.24; if (f.T) { const p = this.tpos(f.T, G); if (p) { f.tx = p.x + f.ox * 0.4; f.ty = p.y + f.oy * 0.4; } }
      if (f.t >= 1 && !f.done) { f.done = true; this.impact(f, G); } }
    this.fly = this.fly.filter(f => !f.done || f.t < 1.6); for (const f of this.fx) f.t += dt; this.fx = this.fx.filter(f => f.t < 1.3);
    const allPassed = this.targets.every(T => T.hit || T.z - this.camZ < 0.6); if ((this.left <= 0 || allPassed) && !this.fly.some(f => !f.done) && this.endT < 0 && this.draw0 < 0) this.endT = 0;
    if (this.endT >= 0) { this.endT += dt; if (this.endT > 1.4 && !this.ended) { this.ended = true; this.finish(); } } },
  impact(f, G) { const T = f.T; if (!T || T.hit) { this.streak = 0; SFX.miss(); this.fx.push({ k: 'miss', x: f.tx, y: f.ty, t: 0 }); return; }
    T.hit = true; this.hits++; this.streak++; let pts = T.k === 'balloon' ? ECON.balloon : T.k === 'mover' ? ECON.mover : T.k === 'bubble' ? 8 : T.k === 'lantern' || T.k === 'cloud' ? 3 : ECON.hit; if (f.bull) { pts = ECON.bull + (T.k === 'mover' ? 1 : 0); this.bulls++; }
    if (T.k === 'balloon' || T.k === 'bubble') { this.pops++; SFX.pop(); } else SFX.thunk(); if (T.bonus) { SFX.sparkle(); Voice.say('whirlB', 'Hee hee! Nice shot, Kimber!'); }
    let s = (f.bull ? 'BULLSEYE! +' : T.k === 'balloon' ? 'POP! +' : 'HIT! +') + pts; this.pay += pts;
    if (this.streak > 0 && this.streak % 3 === 0) { this.pay += ECON.streak; this.fx.push({ k: 'banner', s: this.streak + ' in a row! +' + ECON.streak, t: 0 }); SFX.chime(); } else SFX.ding(this.streak * 2);
    const p = this.tpos(T, G); if (p) { this.fx.push({ k: 'hit', x: p.x, y: p.y, r: p.r, s, bull: f.bull, t: 0, T }); T.stuck = T.k === 'balloon' || T.k === 'bubble' ? null : [f.ox * 0.4 / p.r, f.oy * 0.4 / p.r]; } },
  finish() { const n = this.targets.filter(T => !T.bonus).length, hits = this.targets.filter(T => T.hit && !T.bonus).length; const pct = hits / n;
    const stars = 1 + (pct >= 0.6 ? 1 : 0) + (pct >= 0.85 || this.bulls >= 3 ? 1 : 0);
    const rows = [[1, hits + ' of ' + n + ' targets hit'], [this.bulls > 0, this.bulls + ' bullseye' + (this.bulls === 1 ? '' : 's') + (this.pops ? ' \u00b7 ' + this.pops + ' pop' + (this.pops === 1 ? '' : 's') : '')], [stars >= 2, 'Star 2: hit 60% of the targets'], [stars >= 3, 'Star 3: hit 85% or 3 bullseyes']];
    finishInter(this, { kind: 'bow', l: this.l, slot: 1, stars, pay: this.pay, rows, replay: this.a.replay }); },
  drawTarget(T, p) { const sc = p.up; if (T.k === 'balloon') return balloonArt(p.x, p.y, p.r, T.col); if (T.k === 'bubble') { fillOnly(() => C(p.x, p.y, p.r), 'rgba(200,230,255,.45)'); strokeOnly(() => C(p.x, p.y, p.r), '#fff', Math.max(2, p.r * 0.08)); sparkle(p.x - p.r * 0.3, p.y - p.r * 0.3, p.r * 0.25); whirligig(p.x + p.r * 1.6, p.y - p.r * 0.4, p.r / 160, { t: this.t }); return; }
    if (T.k === 'lantern') return lanternTarget(p.x, p.y, p.r);
    if (T.k === 'cloud') { cloud(p.x, p.y + p.r * 0.6, p.r / 45, '#fff', 0.95); return targetArt(p.x, p.y, p.r * 0.8, { noStand: 1 }); }
    if (T.k === 'mover') { strokeOnly(() => { const [ax, ay] = laneProj(laneGeo(), T.X - 1.1, 0.9, p.dz), [bx, by] = laneProj(laneGeo(), T.X + 1.1, 0.9, p.dz); g.moveTo(ax, ay); g.lineTo(bx, by); }, '#a8692f', Math.max(2, p.r * 0.12)); }
    g.save(); g.translate(p.x, p.y + p.r * 2.2 * (1 - sc)); g.scale(1, sc); targetArt(0, 0, p.r, { flag: T.col, glow: this.draw0 >= 0 && this.lock === T, noStand: T.k === 'mover' }); g.restore(); },
  draw() { const G = laneGeo(), L = G.L, u = L.u, k = G.k; laneBGfull(this.l, this.camZ);
    const vis = []; for (const T of this.targets) { const p = this.tpos(T, G); if (p && p.dz < 26) vis.push([T, p]); } vis.sort((a, b) => b[1].dz - a[1].dz);
    for (const [T, p] of vis) { if (T.hit && (T.k === 'balloon' || T.k === 'bubble')) continue; this.drawTarget(T, p); if (T.hit && T.stuck) { const sx = p.x + T.stuck[0] * p.r, sy = p.y + T.stuck[1] * p.r; arrowArt(sx + p.r * 0.55, sy + p.r * 0.75, sx, sy, Math.max(0.35, p.r / 34)); } }
    // arrows in flight (normal arrows, shrinking into the distance)
    for (const f of this.fly) { if (f.done) continue; const t = clamp(f.t, 0, 1), x = lerp(f.x0, f.tx, t), y = lerp(f.y0, f.ty, t) - Math.sin(t * Math.PI) * 30 * k; const a = Math.atan2(f.ty - f.y0, f.tx - f.x0); const len = lerp(150, 26, t) * k; arrowArt(x - Math.cos(a) * len, y - Math.sin(a) * len, x, y, lerp(1.2, 0.4, t) * k); }
    for (const f of this.fx) { const a = 1 - clamp((f.t - 0.8) / 0.5, 0, 1); g.save(); g.globalAlpha = a;
      if (f.k === 'hit') { burst(f.x, f.y, (f.r + 30) * easeBack(clamp(f.t * 3, 0, 1)), f.bull ? 'rgba(255,243,168,.95)' : 'rgba(255,255,255,.85)'); if (f.T.k === 'balloon' || f.T.k === 'bubble') for (let i = 0; i < 6; i++) { const an = i * TAU / 6; fillOnly(() => E(f.x + Math.cos(an) * (f.r + f.t * 40), f.y + Math.sin(an) * (f.r + f.t * 40), 6, 3, an), f.T.col || '#ff6f91'); } popText(clamp(f.x, 90, VW - 90), f.y - f.r - 30 - f.t * 30, f.s, f.bull ? '#ffb02e' : '#ff6f91', clamp(26 * u, 22, 36)); }
      else if (f.k === 'miss') popText(f.x, f.y - f.t * 20, 'So close!', '#9b8ab8', clamp(18 * u, 16, 24));
      else if (f.k === 'banner') { const w = clamp(200 * u, 190, 280), hh = clamp(42 * u, 40, 56), by = L.y0 + 130 * u; shape(() => RR(VW / 2 - w / 2, by, w, hh, hh / 2), '#ffd93d', 2.5); text(f.s, VW / 2, by + hh / 2 + 1, clamp(19 * u, 18, 26), INK, { fam: F.title, w: 400, max: w - 16 }); } g.restore(); }
    // first-person overlay: horse neck, bow, Kimber's arms (design space 390x844)
    const bob = Math.sin(this.t * TAU * 2.3) * 6 * (this.endT < 0 && !this.intro ? 1 : 0.2); const drawing = this.draw0 >= 0; const pw = this.power();
    g.save(); g.translate(G.ox, G.oy); g.scale(k, k);
    horseFromSaddle(HORSE(), bob);
    const rd = this.ret ? [(this.ret[0] - G.ox) / k, (this.ret[1] - G.oy) / k] : [205, 380]; const gx = drawing ? 132 + (rd[0] - 205) * 0.12 : 92, gy = (drawing ? 480 + (rd[1] - 380) * 0.1 : 560) + bob * 0.6;
    const hand = [lerp(gx + 20, 236, pw), lerp(gy + 20, 600, pw) + bob * 0.4];
    realBow(gx, gy, drawing ? 320 : 290, drawing, hand); if (drawing || this.left > 0 && !this.fly.some(f => f.t < 0.3)) { const a = Math.atan2(gy - hand[1], gx - hand[0]); const tip = [gx + Math.cos(a) * 40, gy + Math.sin(a) * 40]; arrowArt(hand[0], hand[1], tip[0], tip[1], 1.1); }
    kimArmL(gx, gy); kimHandR(hand[0], hand[1] - 10);
    if (drawing) { strokeOnly(() => C(hand[0] + 6, hand[1] + 8, 44), 'rgba(255,255,255,.5)', 8); strokeOnly(() => g.arc(hand[0] + 6, hand[1] + 8, 44, -Math.PI / 2, -Math.PI / 2 + TAU * pw), pw >= 1 ? '#6bd66b' : '#ffd93d', 8); }
    g.restore();
    if (drawing && this.ret) { const [rx, ry] = this.ret; strokeOnly(() => { C(rx, ry, 12); g.moveTo(rx, ry - 20); g.lineTo(rx, ry - 8); g.moveTo(rx, ry + 8); g.lineTo(rx, ry + 20); g.moveTo(rx - 20, ry); g.lineTo(rx - 8, ry); g.moveTo(rx + 8, ry); g.lineTo(rx + 20, ry); }, INK, 5); strokeOnly(() => { C(rx, ry, 12); g.moveTo(rx, ry - 20); g.lineTo(rx, ry - 8); g.moveTo(rx, ry + 8); g.lineTo(rx, ry + 20); g.moveTo(rx - 20, ry); g.lineTo(rx - 8, ry); g.moveTo(rx + 8, ry); g.lineTo(rx + 20, ry); }, '#fff', 3); }
    // HUD
    const top = interHud(L, 'Bow & Gallop', '#4cc3ff', this.pay, () => { this.paused = true; this.draw0 = -1; }); const th = clamp(34 * u, 32, 44);
    const aw = 24 + this.arrows * 15 * u; shape(() => RR(L.x0 + 12, top, aw, th, th / 2), '#fff', 2.5); for (let i = 0; i < this.arrows; i++) { const ax = L.x0 + 26 + i * 15 * u; g.save(); g.globalAlpha = i < this.left ? 1 : 0.22; arrowArt(ax, top + th - 6, ax, top + 5, 0.55); g.restore(); } box('quiver', L.x0 + 12, top, aw, th);
    const pw2 = Math.min(clamp(170 * u, 150, 240), L.cw - aw - 40); const prog = clamp(this.camZ / this.len, 0, 1); shape(() => RR(L.x1 - pw2 - 12, top + th / 2 - 8, pw2, 16, 8), '#fff', 2.5); fillOnly(() => RR(L.x1 - pw2 - 10, top + th / 2 - 6, (pw2 - 4) * prog, 12, 6), '#4cc3ff'); horseshoe(L.x1 - pw2 - 10 + (pw2 - 4) * prog, top + th / 2, 7);
    if (!this.intro && this.left === this.arrows && !drawing) { const hy = top + th + 12, fs = clamp(16 * u, 15, 21), s = 'Hold to pull \u00b7 slide to aim \u00b7 let go!', w = measure(s, fs, F.ui, 800) + 30; shape(() => RR(VW / 2 - w / 2, hy, w, fs * 2.3, fs * 1.15), 'rgba(59,39,65,.78)', 0); text(s, VW / 2, hy + fs * 1.15, fs, '#fff', { fam: F.ui, w: 800 }); }
    if (this.intro) interIntro(this, L, 'Bow & Gallop!', '#4cc3ff', [
      [(cx, cy) => { g.save(); g.translate(cx, cy); realBow(0, 0, 40, false); g.restore(); }, this.mom + ' Your horse gallops by itself down the lane.'],
      [(cx, cy) => targetArt(cx, cy, 13, { noStand: 1 }), 'Hold to pull the bow, slide to aim, let go to shoot. Full pull = bullseye power!'],
      [(cx, cy) => horseshoe(cx, cy + 2, 12), 'Hit targets for horseshoes. 3 in a row = bonus!'],
      [(cx, cy) => arrowArt(cx - 16, cy + 12, cx + 16, cy - 12, 0.6), 'Safety first: we only ever shoot at targets. Real archery needs a grown-up coach and a safe range.']],
      () => this.mom + ' Your horse gallops by itself down the lane. Hold to pull the bow, slide to aim, and let go to shoot. Hit targets for horseshoes. Safety first: we only ever shoot at targets, and real archery needs a grown-up coach and a safe range.', 'Let\u2019s ride!');
    if (this.paused) interPause(this, L);
  } };
