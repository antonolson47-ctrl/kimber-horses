/* ===================== CARROT TOSS (interlude after race 1): swipe up to toss carrots to the pasture horses ===================== */
function pastureBG(l, t) { const W = VW, H = VH, A = LAND_ART[l] || LAND_ART[1]; const hz = Math.round(pastureHz());
  const sp = sprite('past' + l + 'x' + W + 'x' + H, W, H, () => { const s = clamp(Math.min(W / 700, H / 700), 0.35, 1.1);
    g.fillStyle = lin(0, 0, 0, hz, [[0, A.sky[0]], [1, A.sky[1]]]); g.fillRect(0, 0, W, hz + 40);
    if (A.night) { const rr = srng(7); for (let i = 0; i < 50; i++) sparkle(rr() * W, rr() * hz * 0.8, 1.5 + rr() * 3, '#fff'); shape(() => C(W * 0.82, H * 0.1, 26 * s + 6), '#fff6c8', 0); } else sun(W * 0.82, Math.min(H * 0.1, hz * 0.3), 22 * s + 6);
    if (!A.night) { cloud(W * 0.2, hz * 0.28, 0.5 * s + 0.2, '#fff', 0.9); cloud(W * 0.62, hz * 0.45, 0.4 * s + 0.15, '#fff', 0.85); }
    landFar(l, W, H, hz - 4);
    g.fillStyle = lin(0, hz, 0, H, [[0, A.ground], [1, A.ground2]]); g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W + 10; x += 12) g.lineTo(x, hz + 6 + Math.sin(x / 70) * 3); g.lineTo(W, H); g.fill();
    landProps(l, W, hz + 10, s * 0.42, 0);
    fence(-10, W + 10, hz + 40 * s + 8, 0.55 * s + 0.15, A.night ? '#d8dcff' : '#ffffff');
    const rr = srng(31 + l); for (let i = 0; i < 30; i++) { const yy = hz + 60 * s + rr() * (H - hz - 60 * s); flower(rr() * W, yy, 0.3 + (yy - hz) / H * 0.9, l === 6 ? '#cfd8ff' : RIBBON[i % 7]); }
    g.strokeStyle = 'rgba(40,90,40,.25)'; g.lineWidth = 2; for (let i = 0; i < 50; i++) { const x = rr() * W, y = hz + 40 + rr() * (H - hz); g.beginPath(); g.moveTo(x, y); g.lineTo(x - 3, y - 7); g.moveTo(x, y); g.lineTo(x + 3, y - 8); g.stroke(); } });
  blit(sp, 0, 0, W, H); }
function pastureHz() { return VH >= VW ? VH * 0.36 : VH * 0.34; }
const PASTURE_COATS = [{ b: 'palomino', p: 'solid', m: { blaze: 1 } }, { b: 'bay', p: 'solid', m: { star: 1, socks: [1, 0, 1, 0] } }, { b: 'grey', p: 'leopard' }, { b: 'black', p: 'solid', m: { stripe: 1 } }, { b: 'chestnut', p: 'tobiano' }, { b: 'buckskin', p: 'solid' }];
SC.carrot = { name: 'carrot',
  enter(a) { this.a = a = Object.assign({ l: 1, slot: 0 }, a || {}); const l = this.l = clamp(a.l, 1, 7); this.t = 0; this.intro = true; this.paused = false;
    this.total = 10 + Math.floor((l - 1) * 4 / 6) + perkCarrots(); this.left = this.total; this.caught = 0; this.combo = 0; this.best = 0; this.pay = 0; this.goldIdx = l >= 3 ? 3 + Math.floor(Math.random() * Math.max(1, this.total - 5)) : -1; this.goldGot = false;
    this.flying = []; this.fx = []; this.aim = null; this.endT = -1; this.ended = false; this.whirl = null; this.whirlUsed = false; this.whirlBack = false; this.helpUsed = false; this.thrown = 0; this.raise = 0;
    const own = HORSE(); this.horses = []; const n = l === 1 ? 3 : l < 5 ? 4 : 5; const xs = [0.2, 0.72, 0.46, 0.86, 0.1], ds = [0.55, 0.42, 0.1, 0.8, 0.85];
    for (let i = 0; i < n; i++) { const h = i === 0 && own ? own : { spec: PASTURE_COATS[(i + l) % PASTURE_COATS.length], items: {}, col: {} }; this.horses.push({ h, x: xs[i], d: ds[i], tx: xs[i], flip: xs[i] > 0.5, pose: 'stand', poseT: 0, wait: 1 + i, own: i === 0 && !!own }); }
    Music.play('pasture'); this.mom = MOM_CARROT[(l + S.stats.races) % MOM_CARROT.length];
    setTimeout(() => { if (scene === this && this.intro) Voice.say('carrotIntro', this.mom + ' Swipe up to toss a carrot. When a horse catches it, you earn horseshoes!'); }, 400); },
  geo() { const L = lay(); const hz = pastureHz(); const K = L.port ? Math.min(VH / 844 * 0.42, VW / 390 * 0.42) : Math.min(VH / 844 * 0.42 * 1.35, VW / 390 * 0.42); const gh = VH - hz;
    const kb = K * 1.85, kx = VW * 0.5, ky = L.y1 - 4; return { L, hz, K, gh, kb, kx, ky, hand: [kx + 46 * kb, ky - 194 * kb] }; },
  hpos(H, G) { const y = G.hz + 34 * G.K + H.d * (G.gh * 0.42), s = G.K * (0.55 + 0.6 * H.d); const P = POSES[H.pose] || POSES.stand; const [mx, my] = neckPt(P, 150, -200); const x = G.L.x0 + 40 + H.x * (G.L.cw - 80);
    return { x, y, s, mouth: [x + (H.flip ? -1 : 1) * mx * s, y + (my - (P.lift || 0)) * s], r: clamp(60 * G.K / 0.42 * (1 - (this.l - 1) * 0.04) * (0.6 + 0.5 * H.d), 26, 120) }; },
  aimTarget(sx, sy, x, y, G) { const dx = x - sx, dy = y - sy; if (Math.hypot(dx, dy) < 22) return [x, Math.min(y, G.hand[1] - 40)]; const k = 2.6; return [clamp(G.hand[0] + dx * k * 1.1, G.L.x0 + 10, G.L.x1 - 10), clamp(G.hand[1] + dy * k, G.hz + 10, G.hand[1] - 40)]; },
  ptr(type, x, y) { if (this.intro || this.paused || this.endT >= 0) return; const G = this.geo();
    if (type === 'down') { this.aim = { sx: x, sy: y, x, y }; this.raise = 1; }
    else if (type === 'move' && this.aim) { this.aim.x = x; this.aim.y = y; }
    else if (type === 'up' && this.aim) { const [tx, ty] = this.aimTarget(this.aim.sx, this.aim.sy, this.aim.x, this.aim.y, G); this.aim = null; this.throwAt(tx, ty, G); }
    else if (type === 'cancel') { this.aim = null; this.raise = 0; } },
  key(k) { if (this.intro && (k === 'Enter' || k === ' ')) { this.intro = false; return true; } if (k === ' ' || k === 'Enter') { const G = this.geo(); const H = this.horses[(this.thrown) % this.horses.length]; const p = this.hpos(H, G); this.throwAt(p.mouth[0], p.mouth[1], G); return true; } },
  throwAt(tx, ty, G) { if (this.left <= 0 || this.flying.length >= 2) { this.raise = 0; return; }
    const gold = this.total - this.left === this.goldIdx; this.left--; this.thrown++;
    // aim assist: nearest horse mouth inside its catch zone (Helper Hooves: always the nearest horse)
    let best = null, bd = 1e9; for (const H of this.horses) { const p = this.hpos(H, G); const d = Math.hypot(p.mouth[0] - tx, p.mouth[1] - ty); const lim = S.set.helper ? 1e9 : p.r * 1.25; if (d < lim && d < bd) { bd = d; best = H; } }
    const c = { x0: G.hand[0], y0: G.hand[1], tx, ty, t: 0, dur: 0.75, gold, H: best, lob: ty < G.hz + G.gh * 0.25 };
    if (this.l >= 4 && this.l <= 6 && !this.whirlUsed && this.thrown === 3) { this.whirlUsed = true; c.steal = true; }
    this.flying.push(c); this.raise = 2; this.raiseT = 0.35; SFX.toss(); },
  update(dt) { if (this.paused) return; this.t += dt; if (this.intro) return; const G = this.geo();
    if (this.raiseT > 0) { this.raiseT -= dt; if (this.raiseT <= 0 && !this.aim) this.raise = 0; }
    for (const H of this.horses) { H.poseT -= dt; if (H.poseT <= 0 && H.pose !== 'stand') H.pose = 'stand';
      if (this.l >= 2 && H.poseT <= 0) { H.wait -= dt; if (H.wait <= 0) { H.tx = clamp(H.x + (Math.random() - 0.5) * 0.4, 0.06, 0.94); H.wait = 2 + Math.random() * 3; } const sp = 0.05 + this.l * 0.008; const d = H.tx - H.x; if (Math.abs(d) > 0.005) { H.x += Math.sign(d) * Math.min(Math.abs(d), sp * dt); H.flip = d < 0; } } }
    // carrots in the air
    for (const c of this.flying) { c.t += dt / c.dur; if (c.H) { const p = this.hpos(c.H, G); c.tx += (p.mouth[0] - c.tx) * Math.min(1, dt * 6); c.ty += (p.mouth[1] - c.ty) * Math.min(1, dt * 6); }
      if (c.steal && c.t > 0.45 && !c.stolen) { c.stolen = true; const p = this.cpos(c); this.whirl = { x: p[0], y: p[1], t: 0, c, vx: VW > 500 ? 260 : 180 }; SFX.whoosh(); this.fx.push({ k: 'txt', x: p[0], y: p[1] - 40, s: 'Hey!', col: '#b06bff', t: 0 }); Voice.say('whirl', 'Hee hee! I love carrots!'); }
      if (c.stolen) continue;
      if (c.t >= 1) { c.done = true; this.land(c, G); } }
    this.flying = this.flying.filter(c => !c.done && !(c.stolen && c.gone));
    if (this.whirl) { const w = this.whirl; w.t += dt; w.x += w.vx * dt; w.y -= 40 * dt; if (w.t > 2.2) { if (!this.whirlBack) { this.fx.push({ k: 'txt', x: VW / 2, y: G.hz + 40, s: 'Sorry, I just love carrots!', col: '#b06bff', t: 0 }); this.combo = 0; } w.c.gone = true; w.c.done = true; this.whirl = null; } }
    for (const f of this.fx) f.t += dt; this.fx = this.fx.filter(f => f.t < 1.4);
    if (this.left <= 0 && !this.flying.length && !this.whirl && this.endT < 0) this.endT = 0;
    if (this.endT >= 0) { this.endT += dt; if (this.endT > 1.3 && !this.ended) { this.ended = true; this.finish(); } } },
  cpos(c) { const qx = (c.x0 + c.tx) / 2 - 20, qy = Math.min(c.y0, c.ty) - (c.lob ? 200 : 140) * (VH / 844); const t = clamp(c.t, 0, 1); return [(1 - t) * (1 - t) * c.x0 + 2 * t * (1 - t) * qx + t * t * c.tx, (1 - t) * (1 - t) * c.y0 + 2 * t * (1 - t) * qy + t * t * c.ty, qx, qy]; },
  land(c, G) { const H = c.H; if (H) { const p = this.hpos(H, G); const d = Math.hypot(p.mouth[0] - c.tx, p.mouth[1] - c.ty); if (d < p.r * 1.3) return this.catchBy(H, c, p); }
    // Whirligig helps once in the Sky Bridge (she's turning good!)
    if (this.l === 7 && !this.helpUsed) { this.helpUsed = true; let nb = null, nd = 1e9; for (const Hh of this.horses) { const p = this.hpos(Hh, G); const d = Math.hypot(p.mouth[0] - c.tx, p.mouth[1] - c.ty); if (d < nd) { nd = d; nb = Hh; } } if (nb) { this.fx.push({ k: 'txt', x: c.tx, y: c.ty - 50, s: 'Whoosh! I\u2019m helping!', col: '#b06bff', t: 0 }); return this.catchBy(nb, c, this.hpos(nb, G)); } }
    // miss: the nearest horse wanders over and munches it anyway (no sad sounds)
    this.combo = 0; SFX.miss(); let nb = null, nd = 1e9; for (const Hh of this.horses) { const p = this.hpos(Hh, G); const d = Math.abs(p.x - c.tx); if (d < nd) { nd = d; nb = Hh; } } if (nb) { nb.tx = clamp((c.tx - G.L.x0 - 40) / (G.L.cw - 80), 0.05, 0.95); nb.pose = 'munch'; nb.poseT = 1.6; }
    this.fx.push({ k: 'drop', x: c.tx, y: c.ty, t: 0, gold: c.gold }); },
  catchBy(H, c, p) { this.caught++; this.combo++; this.best = Math.max(this.best, this.combo); let pts = ECON.carrotCatch; const bonus = this.combo >= 7 ? 3 : this.combo >= 5 ? 2 : this.combo >= 3 ? 1 : 0; pts += bonus; if (c.gold) { pts += ECON.golden; this.goldGot = true; } if (c.back) pts += 3;
    this.pay += pts; H.pose = 'proud'; H.poseT = 0.9; SFX.crunch(); setTimeout(() => SFX.nicker(), 200); if (c.gold) SFX.chime(); else SFX.ding(Math.min(this.combo, 10));
    this.fx.push({ k: 'catch', x: p.mouth[0], y: p.mouth[1], t: 0, s: (c.gold ? 'GOLDEN! +' : 'CATCH! +') + pts, gold: c.gold }); if (this.combo >= 3) this.fx.push({ k: 'txt', x: VW / 2, y: this.geo().hz + 70, s: this.combo + ' in a row!', col: '#ffb02e', t: 0 }); heartsUp(p.mouth[0], p.mouth[1], 3); },
  tapWhirl(x, y) { const w = this.whirl; if (!w || this.whirlBack) return; this.whirlBack = true; SFX.sparkle(); Voice.say('whirl2', 'Okay, okay! Here you go!'); this.fx.push({ k: 'txt', x: w.x, y: w.y - 40, s: 'Okay! Here you go!', col: '#b06bff', t: 0 });
    const c = w.c; c.stolen = false; c.back = true; c.x0 = w.x; c.y0 = w.y; c.t = 0.35; c.dur = 0.6; if (!c.H) { let nb = null, nd = 1e9; const G = this.geo(); for (const H of this.horses) { const p = this.hpos(H, G); const d = Math.abs(p.x - w.x); if (d < nd) { nd = d; nb = H; } } c.H = nb; } if (c.H) { const p = this.hpos(c.H, this.geo()); c.tx = p.mouth[0]; c.ty = p.mouth[1]; }
    w.t = 1.6; },
  finish() { const pct = this.caught / this.total; const stars = 1 + (pct >= 0.6 ? 1 : 0) + (pct >= 0.85 || (this.goldGot && pct >= 0.6) || this.best >= 7 ? 1 : 0);
    const rows = [[1, this.caught + ' of ' + this.total + ' carrots caught!'], [this.best >= 3, 'Best combo: ' + this.best + ' in a row']]; if (this.goldIdx >= 0) rows.push([this.goldGot, this.goldGot ? 'Golden carrot caught!' : 'Golden carrot: try again!']); if (this.whirlUsed) rows.push([this.whirlBack, this.whirlBack ? 'Got the carrot back from Whirligig' : 'Whirligig snacked on one']);
    rows.push([stars >= 2, 'Star 2: catch 60% of the carrots']); finishInter(this, { kind: 'carrot', l: this.l, slot: 0, stars, pay: this.pay, rows, replay: this.a.replay }); },
  draw() { const G = this.geo(), L = G.L, u = L.u; pastureBG(this.l, this.t);
    // Mom with her basket by the fence
    const ks = G.K * 1.35; drawKari(L.x0 + 46 * ks + 8, G.hz + 60 * G.K + 120 * ks, ks, { pose: 'basket' }); carrotBasket(L.x0 + 120 * ks + 8, G.hz + 60 * G.K + 120 * ks, ks * 1.2, this.goldIdx >= 0 && !this.goldGot);
    const order = this.horses.slice().sort((a, b) => a.d - b.d);
    for (const H of order) { const p = this.hpos(H, G); drawHorseC(H.h, p.x, p.y, p.s, { pose: H.pose, flip: H.flip, expr: H.pose === 'munch' ? 'munch' : undefined, poseKey: H.pose });
      if (H.own) { const fs = clamp(13 * u, 12, 17); const nm = H.h.name || ''; if (nm) { const w = measure(nm, fs, F.title, 400) + 16; panel(p.x - w / 2, p.y + 6, w, fs * 1.5, fs * 0.75, '#fff', { lw: 2, shadow: false }); text(nm, p.x, p.y + 6 + fs * 0.78, fs, INK, { fam: F.title, w: 400 }); } }
      if (this.aim || this.flying.length) { g.save(); g.globalAlpha = 0.5 + 0.2 * Math.sin(this.t * 6); g.setLineDash([6, 6]); strokeOnly(() => C(p.mouth[0], p.mouth[1], p.r * 0.6), '#fff', 2.5); g.restore(); } }
    // the foal follows Kimber around the pasture
    if (S.foal) { const fx = G.kx - 150 * G.kb + Math.sin(this.t * 0.8) * 20 * G.kb, fy = G.ky - 6; drawFoal(fx, fy, G.kb * 0.62, { pose: Math.sin(this.t * 2) > 0.6 ? 'proud' : 'stand', label: true }); }
    // aim preview: dotted arc + landing ring
    if (this.aim) { const [tx, ty] = this.aimTarget(this.aim.sx, this.aim.sy, this.aim.x, this.aim.y, G); const h = G.hand; const qx = (h[0] + tx) / 2 - 20, qy = Math.min(h[1], ty) - 140 * (VH / 844);
      g.save(); g.setLineDash([2, 13]); strokeOnly(() => { g.moveTo(h[0], h[1]); g.quadraticCurveTo(qx, qy, tx, ty); }, 'rgba(255,255,255,.95)', 6); g.restore(); g.save(); g.setLineDash([8, 6]); strokeOnly(() => C(tx, ty, 24 * G.K / 0.42), '#fff', 3.5); g.restore(); }
    // carrots in flight
    for (const c of this.flying) { if (c.stolen) continue; const [x, y, qx, qy] = this.cpos(c); const t = clamp(c.t, 0, 1); const ang = Math.atan2(2 * (1 - t) * (qy - c.y0) + 2 * t * (c.ty - qy), 2 * (1 - t) * (qx - c.x0) + 2 * t * (c.tx - qx)); carrotArt(x, y, 40 * G.K / 0.42 * (1 - t * 0.35), ang + c.t * 6, c.gold); }
    if (this.whirl) { const w = this.whirl; whirligig(w.x, w.y, 0.3 * G.K / 0.42, { t: this.t }); if (!w.c.back) carrotArt(w.x + 20, w.y + 10, 30 * G.K / 0.42, 2.4, w.c.gold); const r = 60 * G.K / 0.42; if (!this.whirlBack) { g.save(); g.globalAlpha = 0.6 + 0.3 * Math.sin(this.t * 10); strokeOnly(() => C(w.x, w.y, r), '#fff3a8', 4); g.restore(); text('Tap her!', w.x, w.y - r - 10, clamp(16 * u, 14, 20), '#fff', { fam: F.title, w: 400, stroke: '#7a5ab8', sw: 5 }); hit('whirl', w.x - r, w.y - r, r * 2, r * 2, { down: () => this.tapWhirl() }); } }
    // fx
    for (const f of this.fx) { const a = 1 - clamp((f.t - 0.9) / 0.5, 0, 1); g.save(); g.globalAlpha = a;
      if (f.k === 'catch') { burst(f.x, f.y, 40 * G.K / 0.42 * easeBack(clamp(f.t * 3, 0, 1)), f.gold ? '#fff3a8' : 'rgba(255,255,255,.9)'); popText(f.x, f.y - 50 - f.t * 30, f.s, f.gold ? '#ffb02e' : '#ff6f91', clamp(24 * u, 20, 32)); }
      else if (f.k === 'drop') { carrotArt(f.x, f.y, 30 * G.K / 0.42, 0.2, f.gold); }
      else popText(f.x, f.y - f.t * 30, f.s, f.col, clamp(20 * u, 18, 28)); g.restore(); }
    // Kimber from behind
    kimberBack(G.kx, G.ky, G.kb, { raise: this.raise, sway: Math.sin(this.t * 2) * 4, carrot: this.raise === 1, gold: this.total - this.left === this.goldIdx });
    // HUD
    const top = interHud(L, 'Carrot Toss', '#ff9f43', this.pay, () => { this.paused = true; });
    const th = clamp(34 * u, 32, 44); const n = this.left, tw = Math.min(L.cw * 0.55, 26 + n * 17 * u); shape(() => RR(L.x0 + 12, top, tw, th, th / 2), '#fff', 2.5);
    for (let i = 0; i < n; i++) { const idx = this.total - this.left + i; carrotArt(L.x0 + 30 + i * 17 * u, top + th / 2, 22 * u, -0.9, idx === this.goldIdx); } box('tray', L.x0 + 12, top, tw, th);
    if (this.combo >= 2) { const cw = clamp(130 * u, 120, 170); shape(() => RR(L.x1 - cw - 12, top, cw, th, th / 2), '#ffd93d', 2.5); text('Combo x' + this.combo + '!', L.x1 - cw / 2 - 12, top + th / 2 + 1, clamp(17 * u, 16, 22), INK, { fam: F.title, w: 400 }); }
    if (!this.intro && this.thrown === 0 && !this.aim) { const hy = top + th + 12, fs = clamp(16 * u, 15, 21), s = 'Swipe up (or tap a horse) to toss!', w = measure(s, fs, F.ui, 800) + 30; shape(() => RR(VW / 2 - w / 2, hy, w, fs * 2.3, fs * 1.15), 'rgba(59,39,65,.78)', 0); text(s, VW / 2, hy + fs * 1.15, fs, '#fff', { fam: F.ui, w: 800 }); }
    if (this.intro) interIntro(this, L, 'Carrot Toss!', '#ff9f43', [
      [(cx, cy) => { strokeOnly(() => { g.moveTo(cx - 14, cy + 12); g.quadraticCurveTo(cx - 4, cy - 2, cx + 12, cy - 14); }, '#ff9f43', 4); fillOnly(() => { g.moveTo(cx + 16, cy - 18); g.lineTo(cx + 4, cy - 14); g.lineTo(cx + 12, cy - 6); g.closePath(); }, '#ff9f43'); shape(() => C(cx - 14, cy + 12, 7), KIM.skin, 2.4); }, this.mom + ' Swipe up (or tap a horse) to toss a carrot.'],
      [(cx, cy) => horseshoe(cx, cy + 2, 12), 'A horse catches it? Horseshoes! Catch lots in a row for a combo.'],
      ...(this.goldIdx >= 0 ? [[(cx, cy) => carrotArt(cx, cy, 34, -0.6, true), 'Catch the golden carrot for +10!']] : []),
      ...(this.l >= 4 && this.l <= 6 ? [[(cx, cy) => whirligig(cx, cy + 14, 0.13, { t: 0.4 }), 'Whirligig may swoop in. Tap her to get the carrot back!']] : []),
      [(cx, cy) => carrotArt(cx, cy, 30, -0.3), 'Tip from Mom: cut carrots long, not in round coins, so they\u2019re easy to chew.']], () => this.mom + ' Swipe up to toss a carrot. When a horse catches it, you earn horseshoes! Tip: cut carrots long, not in round coins, so they are easy to chew.', 'Let\u2019s toss!');
    if (this.paused) interPause(this, L);
  } };
const MOM_CARROT = ['The pasture horses are hungry!', 'Snack time for the horses!', 'Let\u2019s share some carrots, Kimber!', 'Who wants a crunchy carrot?'];
