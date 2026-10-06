/* ===================== SCENES: valley map, Mom's treat stop, results, Grand Stop, sticker book ===================== */
function landIcon(l, cx, cy, r, open) { const sp = landSpr(l, 220, 220, open && landFaded(l)); g.save(); g.beginPath(); C(cx, cy, r); g.clip(); blit(sp, cx - r * 1.25, cy - r * 1.1, r * 2.5, r * 2.5); if (!open) { g.fillStyle = 'rgba(90,80,110,.55)'; g.fillRect(cx - r, cy - r, r * 2, r * 2); } g.restore(); strokeOnly(() => C(cx, cy, r), INK, 4); strokeOnly(() => C(cx, cy, r - 4), '#fff', 3); }
SC.map = { name: 'map', panel: null,
  enter() { Music.play('map'); this.panel = null; this.t = 0; const cur = this.suggest(); this.scrollToNode = cur; },
  update(dt) { this.t += dt; },
  suggest() { for (let l = 0; l <= 7; l++) { if (!landOpen(l)) return Math.max(0, l - 1); if (!landDone(l)) return l; } return 7; },
  key(k) { if (k === 'Escape' && this.panel != null) { this.panel = null; return true; } },
  draw() { const L = lay(), u = L.u; const port = L.port;
    // background valley (scrolling)
    const tb = topBar('Moonmeadow Valley', () => go(SC.title), { col: '#7446c4', rightW: 130 * u }); shoeCounter(L.x1 - 12, L.y0 + (tb - L.y0) / 2 - 18 * u, 36 * u, S.shoes);
    const bb = clamp(70 * u, 66, 92); const top = tb, bot = L.y1 - bb - 8; let nodeR = clamp(46 * u, 44, 70); const below = clamp(16 * u, 15, 21) * 2.25 + 12 * u + 6; let amp = 0, c0 = 0; if (!port) { const H = bot - top; nodeR = Math.max(30, Math.min(nodeR, (H - below - 16) / 2)); const slack = Math.max(0, H - 16 - 2 * nodeR - below); amp = Math.min(H * 0.2, slack / 2); c0 = top + 8 + nodeR + slack / 2; } const sp = nodeR * 3.4;
    const n = 8; const len = port ? sp * n + nodeR * 2 : sp * n + nodeR * 2; const area = port ? bot - top : L.cw;
    const off = port ? scrollArea('map', 0, top, VW, bot - top, len) : scrollArea('map', 0, top, VW, bot - top, len + L.x0 * 2, true);
    if (this.scrollToNode != null) { const st = SCROLL.map; const target = this.scrollToNode * sp - area / 2 + nodeR + sp / 2; st.v = clamp(target, 0, Math.max(0, len - area)); this.scrollToNode = null; }
    pushClip(0, top, VW, bot - top);
    const pos = i => port ? [VW / 2 + Math.sin(i * 1.3 + 0.4) * (L.cw * 0.26), bot - nodeR * 1.4 - i * sp + off - 10] : [L.x0 + nodeR * 1.6 + i * sp - off, c0 + Math.sin(i * 1.3 + 0.4) * amp];
    // ground
    g.fillStyle = lin(0, top, 0, bot, [[0, '#bfe9a8'], [1, '#8fd27a']]); g.fillRect(0, top, VW, bot - top);
    seed = 99; for (let k = 0; k < 60; k++) { const ux = R(0, 1), uy = R(0, 1); const x = port ? ux * VW : ux * (len + 200) - off, y = port ? bot - uy * len + off : top + uy * (bot - top); if (x < -40 || x > VW + 40 || y < top - 60 || y > bot + 60) continue; const kind = k % 4; if (kind === 0) tree(x, y, 0.55 * u, '#5cbf6a'); else if (kind === 1) flower(x, y, 1.1 * u, RIBBON[k % 7]); else if (kind === 2) appleTree(x, y, 0.45 * u); else flower(x, y, 0.9 * u, '#fff'); }
    // path
    const pts = []; for (let i = 0; i < n; i++) pts.push(pos(i));
    const path = () => { g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < n; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i]; g.bezierCurveTo(port ? ax : (ax + bx) / 2, port ? (ay + by) / 2 : ay, port ? bx : (ax + bx) / 2, port ? (ay + by) / 2 : by, bx, by); } };
    strokeOnly(path, '#c99a62', nodeR * 0.62); strokeOnly(path, '#f2d4a0', nodeR * 0.46); g.setLineDash([10, 14]); strokeOnly(path, '#fff', 4); g.setLineDash([]);
    for (let i = 0; i < n; i++) { const [x, y] = pts[i]; if (x < -nodeR * 3 || x > VW + nodeR * 3 || y < top - nodeR * 3 || y > bot + nodeR * 3) continue;
      const open = landOpen(i), done = landDone(i), Ld = LANDS[i]; const p = isPressed('land' + i) ? 3 : 0;
      if (open && !done && i === this.suggest()) { g.save(); g.globalAlpha = 0.35 + 0.25 * Math.sin(this.t * 4); shape(() => C(x, y + p, nodeR + 12), Ld.col, 0); g.restore(); }
      landIcon(i, x, y + p, nodeR, open);
      if (!open) icLock(x, y + p, nodeR * 0.32, '#fff');
      if (done && i > 0) { g.save(); g.translate(x + nodeR * 0.75, y - nodeR * 0.7 + p); rosetteIcon(0, 0, nodeR * 0.28, RIBBON[Ld.thread], ''); g.restore(); }
      if (done && i === 0) { g.save(); g.translate(x + nodeR * 0.75, y - nodeR * 0.7 + p); rosetteIcon(0, 0, nodeR * 0.28, '#3f6fd8', '1'); g.restore(); }
      const lfs = clamp(16 * u, 15, 21); const lab = (i === 0 ? '' : i + '. ') + Ld.n; const lw2 = Math.min(measure(lab, lfs, F.title, 400) + 28, port ? L.cw * 0.6 : sp - 8); const ly = y + nodeR + lfs * 0.9 + 4;
      panel(x - lw2 / 2, ly - lfs * 0.8, lw2, lfs * 1.6, lfs * 0.8, open ? Ld.col : '#b9b0c6', { lw: 2.5, shadow: false }); text(lab, x, ly + 1, lfs, '#fff', { fam: F.title, w: 400, stroke: shade(open ? Ld.col : '#b9b0c6', -0.45), sw: 4, max: lw2 - 14 });
      const nr = Ld.races.length; for (let r = 0; r < nr; r++) { const sx = x + (r - (nr - 1) / 2) * 30 * u, sy = ly + lfs * 1.35; const st = raceStars(i, r); shape(() => star(sx, sy, 10 * u), st > 0 ? '#ffd93d' : '#fff', 2); if (st > 0) text(String(st), sx, sy + 1, 9 * u, INK, { fam: F.title, w: 400 }); }
      if (i === S.cur * 0 + this.suggest() && HORSE()) { const hs = nodeR / 420; drawHorseC(HORSE(), x - nodeR * 1.15, y + nodeR * 0.95, hs * 1.4, { pose: 'stand', rider: true }); }
      hit('land' + i, x - nodeR, y - nodeR, nodeR * 2, nodeR * 2 + lfs * 2.4, { fn: () => { if (!open) { SFX.no(); toast('Finish ' + LANDS[i - 1].n + ' first!', '#9b8ab8'); return; } this.panel = i; SFX.ui(); } }); }
    popClip();
    // bottom bar
    g.fillStyle = 'rgba(255,255,255,.85)'; g.fillRect(0, bot, VW, VH - bot); strokeOnly(() => { g.moveTo(0, bot); g.lineTo(VW, bot); }, INK, 3);
    const gr = clamp(24 * u, 24, 32); const bw = (L.cw - 24 - 12 * 3 - gr * 2 - 8) / 3; const by = bot + (L.y1 - bot - bb) / 2 + 4;
    btn('mStable', L.x0 + 12, by, bw, bb - 8, 'Stable', { col: '#2fa39a', fs: clamp(18 * u, 16, 24), fn: () => go(SC.stable) });
    btn('mTack', L.x0 + 24 + bw, by, bw, bb - 8, 'Tack Room', { col: '#8a5cd6', fs: clamp(18 * u, 16, 24), badge: S.newItems ? Object.keys(S.newItems).length || 0 : 0, fn: () => go(SC.tack) });
    btn('mStick', L.x0 + 36 + bw * 2, by, bw, bb - 8, 'Stickers', { col: '#ff8c2e', fs: clamp(18 * u, 16, 24), fn: () => go(SC.stickers) });
    parentGateBtn(L, L.x1 - gr - 8, by + (bb - 8) / 2 - 6);
    // finale button
    if (allRacesDone()) { const fw = Math.min(L.cw - 40, 380), fh = clamp(60 * u, 56, 80); btn('toParade', VW / 2 - fw / 2, tb + 12, fw, fh, S.prog.finale ? 'Watch the Grand Parade!' : 'The Grand Parade!', { col: '#ff6f91', fn: () => go(SC.story, { pages: ['f1', 'f2', 'f3', 'f4'], then: 'parade', lastLabel: 'Parade time!' }) }); }
    if (this.panel != null) this.landPanel(this.panel, L);
    settingsModal();
  },
  landPanel(l, L) { const u = L.u, Ld = LANDS[l]; LAYER = 3; dim(0.45); backdropHit(() => { this.panel = null; });
    const w = Math.min(L.cw - 20, 560); const rowH = clamp(74 * u, 70, 96); const n = Ld.races.length; const tipLines = wrapLines(Ld.tip, w - 48, clamp(16 * u, 15, 20), F.body, 700);
    const gReady = grandReady(l); const ht = Math.min(L.ch - 16, 92 + tipLines.length * 22 * u + n * (rowH + 10) + (gReady || landDone(l) ? rowH + 10 : 0) + 30); const x = VW / 2 - w / 2, y = L.y0 + (L.ch - ht) / 2;
    panel(x, y, w, ht, 24, '#fffaf2', { lw: 3.5 }); hit('panelBody', x, y, w, ht, { bg: 1 });
    shape(() => RR(x, y, w, 70, 24), Ld.col, 0); fillOnly(() => g.rect(x, y + 40, w, 30), Ld.col); strokeOnly(() => RR(x, y, w, ht, 24), INK, 3.5);
    text(Ld.n, x + 22, y + 36, clamp(24 * u, 22, 30), '#fff', { align: 'left', fam: F.title, w: 400, stroke: shade(Ld.col, -0.45), sw: 6, max: w - 100 });
    ibtn('panelClose', x + w - 34, y + 35, 22, (cx, cy, r) => icClose(cx, cy, r, INK), { fn: () => { this.panel = null; SFX.back(); }, minHit: 50 });
    const tfs = clamp(16 * u, 15, 20); let cy = y + 86; g.textAlign = 'left'; g.textBaseline = 'top'; font(tfs, F.body, 700); g.fillStyle = INK; tipLines.forEach((t, i) => g.fillText(t, x + 24, cy + i * tfs * 1.35)); cy += tipLines.length * tfs * 1.35 + 12;
    for (let r = 0; r < n; r++) { const open = raceOpen(l, r), st = raceStars(l, r); panel(x + 14, cy, w - 28, rowH, 16, open ? '#fff' : '#eee8f2', { lw: 2.5, shadow: false });
      text(Ld.races[r].n, x + 30, cy + rowH * 0.36, clamp(18 * u, 16, 22), open ? INK : '#9a8aa8', { align: 'left', fam: F.title, w: 400, max: w - 200 });
      for (let k = 0; k < 3; k++) shape(() => star(x + 40 + k * 26, cy + rowH * 0.7, 10), k < st ? '#ffd93d' : '#fff', 2);
      if (open) btn('ride' + r, x + w - 28 - 120, cy + 10, 120, rowH - 20, st ? 'Again' : 'Ride!', { col: st ? '#2fa39a' : '#ff6f91', fn: () => { this.panel = null; go(SC.treat, { l, r }); } });
      else icLock(x + w - 28 - 60, cy + rowH / 2, 16);
      cy += rowH + 10; }
    if (gReady) btn('grandGo', x + 14, cy, w - 28, rowH, 'Grand Stop: ' + Ld.grand + '!', { col: '#ffb02e', fn: () => { this.panel = null; go(SC.grand, { l }); } });
    else if (landDone(l)) { panel(x + 14, cy, w - 28, rowH, 16, '#e9ffe2', { lw: 2.5, shadow: false }); text(l === 0 ? 'First Rosette won!' : 'The ' + THREAD_NAMES[Ld.thread] + ' thread is home!', x + w / 2, cy + rowH / 2, clamp(18 * u, 16, 22), '#2c7a3a', { fam: F.title, w: 400, max: w - 60 }); }
    LAYER = 0; } };
/* ---------- Mom's treat stop ---------- */
const TREATS = {
  apple: { n: 'Red apple', who: 'horse', fx: 'Speedy start!', col: '#ff5a6e' },
  cake: { n: 'Cake', who: 'kimber', fx: 'Bouncy jumps!', col: '#ff9ab5' },
  carrot: { n: 'Carrot', who: 'horse', fx: 'Gallop power fills faster!', col: '#ff8c2e' },
  green: { n: 'Green apple', who: 'horse', fx: 'Splash-proof!', col: '#6bd66b' },
  golden: { n: 'Golden apple', who: 'horse', fx: 'One extra heart!', col: '#f2c14e' },
};
function treatIcon(k, x, y, r) { if (k === 'apple') apple(x, y, r); else if (k === 'green') apple(x, y, r, '#7bd36b'); else if (k === 'golden') goldenApple(x, y, r); else if (k === 'cake') cake(x, y + r * 0.2, r * 1.1);
  else { g.save(); g.translate(x, y); g.rotate(-0.6); shape(() => { g.moveTo(-r * 0.25, -r); g.lineTo(r * 0.25, -r); g.lineTo(0, r * 1.1); g.closePath(); }, '#ff8c2e', 2.5); for (const a of [-0.4, 0, 0.4]) strokeOnly(() => { g.moveTo(0, -r); g.lineTo(Math.sin(a) * r * 0.6, -r * 1.5); }, '#4caf6a', 4); g.restore(); } }
SC.treat = { name: 'treat',
  enter(a) { this.a = a; this.l = a.l; this.t = 0; this.picked = []; this.hugged = false; this.hugT = -1; this.eat = null; this.line = MOM_LINES[(S.stats.races + S.stats.hugs * 3) % MOM_LINES.length]; this.fact = S.stats.races % 4 === 3 ? MOM_FACTS[(S.stats.races >> 2) % MOM_FACTS.length] : null;
    const l = a.l; this.bonus = []; if (l >= 4) this.bonus.push('carrot'); if (l >= 5) this.bonus.push('green'); if (S.golden > 0) this.bonus.push('golden'); this.opts = ['apple', 'cake'].concat(this.bonus); this.bonusReq = l >= 4; this.need = 2 + (this.bonusReq ? 1 : 0);
    Music.play('treat'); const say = this.line + (this.fact ? ' ' + this.fact : '') + ' Feed the apple and the cake' + (this.bonusReq ? ', pick one bonus treat' : '') + ', then give Mom a hug!';
    setTimeout(() => { if (scene === this && S.set.autoRead) Voice.say('mom', say); }, 400); },
  update(dt) { this.t += dt; if (this.eat) { this.eat.t += dt; if (this.eat.t > 1.3) this.eat = null; } if (this.hugT >= 0) { this.hugT += dt; if (this.hugT > 2.2) { this.hugT = -1; } } },
  ready() { return ['apple', 'cake'].every(k => this.picked.includes(k)) && (!this.bonusReq || this.picked.some(k => this.bonus.includes(k))); },
  pickT(k) { if (this.picked.includes(k)) return; if (this.bonus.includes(k) && this.picked.some(p => this.bonus.includes(p))) { SFX.no(); toast('Just one bonus treat!', '#ff8c2e'); return; } this.picked.push(k); this.eat = { k, t: 0 }; SFX.crunch(); if (TREATS[k].who === 'horse') setTimeout(() => SFX.nicker(), 500); if (k === 'golden') S.golden--; save(); },
  hug() { if (this.hugged) return; this.hugged = true; this.hugT = 0; S.stats.hugs++; save(); SFX.chime(); heartsUp(VW * 0.3, VH * 0.4, 12); Voice.say('hug', 'Love you, Kimber! Go have fun!'); },
  ride() { S.treats = {}; for (const k of this.picked) S.treats[k] = 1; S.treats.hug = 1; go(SC.race, { l: this.l, r: this.a.r }); },
  draw() { const L = lay(), u = L.u, l = this.l, h = HORSE(); const port = L.port;
    const tb = topBar('Mom\u2019s Treat Stop', () => go(SC.map), { col: '#ff6f91' });
    const needT = clamp(19 * u, 17, 24) * 1.5 + 24 + 92 + 8 + clamp(64 * u, 60, 84) * 2 + 34; const trayH = port ? Math.min(L.ch * 0.62, Math.max(L.ch * 0.4, needT)) : L.ch - (tb - L.y0); const sx = port ? 0 : L.x0 + L.cw * 0.56, sy = port ? L.y1 - trayH : tb, sw = port ? VW : VW - sx, sh = port ? VH - sy : VH - tb;
    // scene
    const scW = port ? VW : sx, scH = (port ? sy : VH) - tb; landVignette(l, 0, tb, scW, scH, Math.min(scW / 700, scH / 520), this.t, landFaded(l));
    const k = Math.min(scW / 820, scH / 430); const gy = tb + scH * 0.93;
    const eatH = this.eat && TREATS[this.eat.k].who === 'horse' && this.eat.t < 1.1;
    const hx = scW * 0.72;
    if (h) drawHorseC(h, hx, gy, k * 1.0, { pose: eatH ? 'munch' : 'proud', expr: eatH ? 'munch' : undefined });
    if (this.hugT >= 0 && this.hugT < 2.2) { drawHug(scW * 0.28, gy, k * 1.0); }
    else { drawKari(scW * 0.16, gy, k * 0.95, { pose: 'basket' }); drawKimber(scW * 0.37, gy, k * 0.88, { pose: this.eat && this.eat.k === 'cake' ? 'cheer' : 'stand', expr: 'happy' }); }
    if (this.eat) { const e = this.eat, p = clamp(e.t / 0.6, 0, 1); const toH = TREATS[e.k].who === 'horse'; const tx = lerp(VW / 2, toH ? hx + 120 * k : scW * 0.37, easeInOut(p)), ty = lerp(sy + 60, toH ? gy - 220 * k : gy - 190 * k, easeInOut(p)) - Math.sin(p * Math.PI) * 60;
      if (e.t < 0.7) treatIcon(e.k, tx, ty, 22 * k + 8); else { for (let i = 0; i < 6; i++) { const a = i + e.t * 4; fillOnly(() => C(tx + Math.cos(a) * (e.t - 0.6) * 60, ty + Math.sin(a) * (e.t - 0.6) * 40, 3), toH ? '#ff5a6e' : '#ffe0a8'); } text(toH ? 'Crunch!' : 'Yum!', tx, ty - 30, 22 * u, '#fff', { fam: F.title, w: 400, stroke: INK, sw: 5 }); } }
    // Mom's bubble
    if (this.hugT < 0) { const bw = Math.min(scW * 0.6, 420), bfs = clamp(17 * u, 15, 22); const lines = wrapLines(this.line + (this.fact ? ' ' + this.fact : ''), bw - 30, bfs, F.body, 700).slice(0, 4); const bh = lines.length * bfs * 1.25 + 24; const bx = Math.max(L.x0 + 8, scW * 0.05), by = tb + 10;
      bubble(bx, by, bw, bh, scW * 0.17, Math.min(gy - 250 * k, by + bh + 40), lines, bfs); speakBtn('momSpeak', bx + bw + 30, by + 26, 22, () => this.line + (this.fact ? ' ' + this.fact : ''), { minHit: 50 }); box('momBubble', bx, by, bw, bh); }
    // tray
    g.fillStyle = 'rgba(255,250,242,.96)'; g.fillRect(sx, sy, sw, sh); strokeOnly(() => { if (port) { g.moveTo(0, sy); g.lineTo(VW, sy); } else { g.moveTo(sx, tb); g.lineTo(sx, VH); } }, INK, 3);
    const px = sx + (port ? L.x0 : 0) + 12, pw = (port ? L.cw : L.x1 - sx) - 24; let py = sy + 12;
    const hfs = clamp(19 * u, 17, 24); text((this.bonusReq ? 'Apple, cake + 1 bonus treat' : this.bonus.length ? 'Apple + cake (bonus is optional)' : 'Feed the apple and cake') + '  ' + Math.min(this.picked.length, this.need) + '/' + this.need, px, py + hfs * 0.6, hfs, '#c2410c', { align: 'left', fam: F.title, w: 400, max: pw }); py += hfs * 1.5;
    const n = this.opts.length, rideH = clamp(64 * u, 60, 84); const hugH = rideH; const tight = !port && (L.y1 - py - hugH - rideH - 30) / Math.ceil(n / (n > 3 ? 2 : 1)) < 84; const avail = tight ? L.y1 - py - rideH - 22 : L.y1 - py - hugH - rideH - 30;
    const cols = port ? n : tight ? Math.min(n, 3) : (n > 3 ? 2 : 1); const rowsN = Math.ceil(n / cols); const tw = (pw - (cols - 1) * 10) / cols, th = Math.min(avail / rowsN - 8, port ? 140 : 110);
    this.opts.forEach((k2, i) => { const x = px + (i % cols) * (tw + 10), y = py + Math.floor(i / cols) * (th + 8); const on = this.picked.includes(k2); const T2 = TREATS[k2]; const p = isPressed('tr_' + k2) ? 2 : 0;
      panel(x, y + p, tw, th, 16, on ? '#e9ffe2' : '#fff', { lw: on ? 3.5 : 2.5, ink: on ? '#3c9a4a' : INK, shadow: false });
      const ir = Math.min(th * 0.22, tw * 0.2, 26); const vert = port || th > 90 || tw < 150;
      if (vert) { treatIcon(k2, x + tw / 2, y + p + th * 0.32, ir); text(T2.n, x + tw / 2, y + p + th * 0.64, clamp(14 * u, 12, 18), INK, { fam: F.ui, w: 800, max: tw - 8 }); text(T2.fx, x + tw / 2, y + p + th * 0.84, clamp(11.5 * u, 11, 15), '#6a5a78', { fam: F.ui, w: 700, max: tw - 8 }); }
      else { treatIcon(k2, x + ir + 14, y + p + th / 2, ir); text(T2.n, x + ir * 2 + 26, y + p + th * 0.36, clamp(15 * u, 13, 18), INK, { align: 'left', fam: F.ui, w: 800, max: tw - ir * 2 - 34 }); text(T2.fx, x + ir * 2 + 26, y + p + th * 0.68, clamp(12 * u, 11, 15), '#6a5a78', { align: 'left', fam: F.ui, w: 700, max: tw - ir * 2 - 34 }); }
      if (on) { shape(() => C(x + tw - 14, y + p + 14, 11), '#6bd66b', 2.5); icCheck(x + tw - 14, y + p + 14, 7); }
      hit('tr_' + k2, x, y, tw, th, { fn: () => this.pickT(k2) }); });
    py += rowsN * (th + 8) + 4;
    const ready = this.ready(); const left = ['apple', 'cake'].filter(k => !this.picked.includes(k)).map(k => TREATS[k].n.toLowerCase());
    const hw2 = tight ? pw / 2 - 5 : pw; btn('hugMom', px, py, hw2, hugH, this.hugged ? 'Hugged! \u2665' : 'Hug Mom!', { col: this.hugged ? '#ffb3c7' : '#ff6f91', icon: (x, y, r) => shape(() => heart(x, y + r * 0.3, r * 0.9), '#fff', 2), fn: () => this.hug() });
    const okRide = ready && this.hugged && this.hugT < 0 || (ready && this.hugged && this.hugT > 1.0);
    btn('rideGo', tight ? px + pw / 2 + 5 : px, tight ? py : py + hugH + 10, hw2, rideH, okRide ? 'Ride!' : (!ready ? (tight ? 'Feed treats' : 'Feed the treats first') : (tight ? 'Hug first' : 'Hug Mom first')), { col: '#6bd66b', disabled: !okRide, onDisabled: () => { SFX.no(); toast(!ready ? (left.length ? 'Feed the ' + left.join(' and ') + '!' : 'Pick a bonus treat!') : 'Hug Mom first!', '#ff6f91'); }, fn: () => this.ride() });
  } };
/* ---------- results ---------- */
SC.results = { name: 'results',
  enter(a) { this.a = a; this.t = 0; Music.play('title'); if (a.res.newItems.length) { S.newItems = S.newItems || {}; a.res.newItems.forEach(id => S.newItems[id] = 1); save(); }
    setTimeout(() => { if (scene === this) Voice.say('res', (STOP_CHEERS[S.stats.races % STOP_CHEERS.length]) + ' You got ' + a.stars + (a.stars === 1 ? ' star' : ' stars') + '!' + (a.res.newItems.length ? ' New tack in the Tack Room!' : '')); }, 500); },
  update(dt) { const pt = this.t; this.t += dt; for (let i = 0; i < 3; i++) { const at = 0.5 + i * 0.45; if (pt < at && this.t >= at && i < this.a.stars) { SFX.ding(i * 4); confetti(VW / 2 + (i - 1) * 70, VH * 0.25, 20); } } },
  draw() { const a = this.a, L = lay(), u = L.u; valleyBG({}); g.fillStyle = 'rgba(116,70,196,.25)'; g.fillRect(0, 0, VW, VH);
    const two = !L.port && L.ch < 600; const w = Math.min(L.cw - 20, two ? 900 : 640), x = VW / 2 - w / 2; const cX = x, cW = two ? w * 0.56 : w, rX = two ? x + w * 0.56 - 6 : x, rW = two ? w * 0.44 + 6 : w, cM = cX + cW / 2; const bh = clamp(62 * u, 58, 84); const ht = Math.min(L.ch - 20, 640); const y = L.y0 + (L.ch - ht) / 2;
    panel(x, y, w, ht, 26, '#fffaf2', { lw: 3.5 });
    bannerRibbon(VW / 2, y + 8, Math.min(w * 0.7, 380), clamp(46 * u, 44, 60), '#ff6f91', a.raceName + ' done!', clamp(22 * u, 18, 28));
    let cy = y + 50 * u + 20; const sr = clamp(30 * u, 28, 44);
    for (let i = 0; i < 3; i++) { const at = 0.5 + i * 0.45; const p = clamp((this.t - at) / 0.35, 0, 1); const on = i < a.stars && p > 0; const sx = cM + (i - 1) * sr * 2.6; g.save(); g.translate(sx, cy + sr); const sc = on ? easeBack(p) : 1; g.scale(sc, sc); shape(() => star(0, 0, sr), on ? '#ffd93d' : '#f0e8f4', 3.5); g.restore(); }
    cy += sr * 2 + 16; const fs = clamp(17 * u, 15, 22);
    const why = ['Finished the race!', a.shoeGoal ? a.shoes + ' horseshoes (goal: ' + a.shoeNeed + ')' : 'Star 2: get ' + a.shoeNeed + ' horseshoes (you got ' + a.shoes + ')', a.bumps <= 2 || a.caught ? (a.caught ? 'Caught up with Whirligig!' : a.bumps === 0 ? 'No bumps at all!' : 'Only ' + a.bumps + ' bump' + (a.bumps === 1 ? '' : 's') + '!') : 'Star 3: 2 bumps or fewer, or catch Whirligig'];
    why.forEach((s, i) => { const ok = i === 0 || (i === 1 ? a.shoeGoal : (a.bumps <= 2 || a.caught)); (ok ? (xx, yy, r) => { shape(() => C(xx, yy, r), '#6bd66b', 2); icCheck(xx, yy, r * 0.7); } : (xx, yy, r) => shape(() => C(xx, yy, r), '#eee', 2))(x + 34, cy + fs * 0.7, fs * 0.6); text(s, x + 56, cy + fs * 0.7, fs, ok ? INK : '#8a7a9a', { align: 'left', fam: F.ui, w: 800, max: cW - 80 }); cy += fs * 1.6; });
    cy += 4; horseshoe(x + 34, cy + fs * 0.7, fs * 0.55); text('+' + a.shoes + ' horseshoes  (jar: ' + S.shoes + ')', x + 56, cy + fs * 0.7, fs, INK, { align: 'left', fam: F.ui, w: 800, max: cW - 80 }); cy += fs * 1.7;
    if (a.res.golden) { goldenApple(x + 34, cy + fs * 0.7, fs * 0.6); text('Horseshoe jar full! A golden apple!', x + 56, cy + fs * 0.7, fs, '#b8860b', { align: 'left', fam: F.ui, w: 800, max: cW - 80 }); cy += fs * 1.7; }
    const cy0 = cy; if (two) cy = y + 50 * u + 20; box('resInfo', x + 20, y + 50 * u + 20, cW - 40, cy0 - (y + 50 * u + 20)); const left = y + ht - bh * 2 - 34 - cy; const NM = rX + rW / 2;
    if (a.res.newItems.length && left > 60) { text('New in the Tack Room!', NM, cy + fs * 0.7, fs * 1.1, '#8a5cd6', { fam: F.title, w: 400 }); cy += fs * 1.6; const ts = Math.min(left - fs * 3.2, 120, (rW - 60) / 2 - 10); const h = HORSE(); const NI = a.res.newItems;
      if (ts < 64) { const cw2 = (rW - 40) / NI.length, tz = clamp(left - fs * 1.6 - 6, 34, 64); NI.forEach((id, i) => { const it = ITEM_BY[id]; const tx = rX + 20 + i * cw2; panel(tx, cy, tz, tz, 10, '#fff', { lw: 2, shadow: false }); itemThumb(it, h, tx + 2, cy + 2, tz - 4); const nl = wrapLines(it.n, cw2 - tz - 16, fs * 0.8, F.ui, 800).slice(0, 2); nl.forEach((ln, j) => text(ln, tx + tz + 8, cy + tz / 2 + (j - (nl.length - 1) / 2) * fs * 0.95, fs * 0.8, INK, { align: 'left', fam: F.ui, w: 800, max: cw2 - tz - 14 })); }); }
      else NI.forEach((id, i) => { const it = ITEM_BY[id]; const tx = NM + (i - (a.res.newItems.length - 1) / 2) * (ts + 30) - ts / 2; panel(tx, cy, ts, ts, 14, '#fff', { lw: 2.5, shadow: false }); itemThumb(it, h, tx + 3, cy + 3, ts - 6); text(it.n, tx + ts / 2, cy + ts + fs * 0.75, fs * 0.8, INK, { fam: F.ui, w: 800, max: ts + 26 }); }); }
    const by = y + ht - bh - 14; const gR = grandReady(a.l); const nextR = a.r + 1 < LANDS[a.l].races.length && raceOpen(a.l, a.r + 1) ? a.r + 1 : -1;
    const bw = (rW - 28 - 12) / 2; const bx0 = rX;
    btn('resTack', bx0 + 14, by - bh - 10, rW - 28, bh, 'Tack Room', { col: '#8a5cd6', badge: a.res.newItems.length, fn: () => go(SC.tack, { from: 'map' }) });
    btn('resMap', bx0 + 14, by, bw, bh, 'Map', { col: '#2fa39a', fn: () => go(SC.map) });
    if (gR) btn('resNext', bx0 + 26 + bw, by, bw, bh, 'Grand Stop!', { col: '#ffb02e', fn: () => go(SC.grand, { l: a.l }) });
    else if (nextR >= 0) btn('resNext', bx0 + 26 + bw, by, bw, bh, 'Next race', { col: '#ff6f91', fn: () => go(SC.treat, { l: a.l, r: nextR }) });
    else btn('resNext', bx0 + 26 + bw, by, bw, bh, 'Ride again', { col: '#ff6f91', fn: () => go(SC.treat, { l: a.l, r: a.r }) });
  } };
/* ---------- Grand Stop ---------- */
SC.grand = { name: 'grand',
  enter(a) { this.l = a.l; this.t = 0; this.wasDone = landDone(a.l) && a.l > 0; this.res = awardGrand(a.l); Music.play('grand'); SFX.fanfare(); setTimeout(() => SFX.whinny('victory'), 900); this.whoosh = false;
    const Ld = LANDS[a.l]; this.msg = a.l === 0 ? 'You won your First Rosette! Now the real adventure begins.' : 'You reached ' + Ld.grand + ' and won back the ' + THREAD_NAMES[Ld.thread] + ' thread! The colors are coming back!';
    setTimeout(() => { if (scene === this) Voice.say('grand', this.msg); }, 1600); },
  update(dt) { this.t += dt; if (this.t > 1.2 && !this.whoosh) { this.whoosh = true; SFX.whoosh(); } if (this.t > 3.2 && !this.pop) { this.pop = true; confetti(VW / 2, VH * 0.3, 90, 1.2); SFX.pop(); SFX.chime(); } },
  cont() { const l = this.l; if (l === 7) go(SC.story, { pages: ['f1', 'f2', 'f3', 'f4'], then: 'parade', lastLabel: 'Parade time!' }); else go(SC.story, { pages: [nextStoryFor(l)], then: 'map', lastLabel: 'To the map!' }); },
  draw() { const L = lay(), u = L.u, l = this.l, Ld = LANDS[l]; const port = L.port;
    const artH = port ? L.ch * 0.55 : L.ch; const artW = port ? VW : L.x0 + L.cw * 0.58;
    landVignette(l, 0, 0, artW, (port ? L.y0 : 0) + artH, Math.min(artW / 700, artH / 520), this.t);
    const k = Math.min(artW / 760, artH / 520); const gy = (port ? L.y0 : 0) + artH * 0.93; const h = HORSE();
    if (h) drawHorseC(h, artW * 0.4, gy, k * 0.95, { pose: this.t > 3.2 ? 'proud' : 'stand', rider: true });
    if (l > 0) { const th = Ld.thread; const p = clamp((this.t - 1.2) / 2, 0, 1); const sx = artW * 0.7, sy = gy - 200 * k, ex = artW * 0.5, ey = (port ? L.y0 : 0) + 30;
      const cx = lerp(sx, ex, easeInOut(p)), cy = lerp(sy, ey, easeInOut(p)) - Math.sin(p * Math.PI) * 80 * k; const tr = () => { g.moveTo(cx - 60 * k, cy + 10); g.bezierCurveTo(cx - 20 * k, cy - 30 * k + Math.sin(this.t * 5) * 8, cx + 20 * k, cy + 30 * k, cx + 60 * k, cy - 6); };
      if (p < 1) { strokeOnly(tr, INK, 12 * k); strokeOnly(tr, RIBBON[th], 7 * k); sparkle(cx + 60 * k, cy - 6, 10 * k); }
      if (this.t < 1.6) whirligig(artW * 0.78 + this.t * 140 * k, gy - 140 * k - this.t * 60 * k, 0.8 * k, { thread: this.t < 1.2 ? th : null });
      const rest = clamp((this.t - 3.0) / 1.5, 0, 1); if (!this.wasDone) { const amt = 0.55 * (1 - rest); if (amt > 0) { g.save(); g.beginPath(); g.rect(0, 0, artW, (port ? L.y0 : 0) + artH); g.clip(); fadeColors(amt); g.restore(); } }
      if (p >= 1) { g.save(); g.globalAlpha = clamp((this.t - 3.2) / 0.5, 0, 1); ribbon(-20, (port ? L.y0 : 0) + 40 * k, artW + 20, (port ? L.y0 : 0) + 24 * k, 10 * k, 56 * k, { missing: [0, 1, 2, 3, 4, 5, 6].filter(i => !threadsWon().includes(i)), ghost: 0.15, sparkles: 12 }); g.restore(); } }
    // card
    const cx = port ? L.x0 + 10 : artW + 10, cy = port ? (L.y0 + artH + 10) : L.y0 + 10, cw = port ? L.cw - 20 : L.x1 - artW - 20, ch = port ? L.y1 - cy - 10 : L.ch - 20;
    panel(cx, cy, cw, ch, 22, '#fffaf2', { lw: 3.5 });
    const rp = clamp((this.t - 3.2) / 0.5, 0, 1); const rr = clamp(Math.min(cw, ch) * 0.1, 22, 46);
    g.save(); g.translate(cx + cw / 2, cy + rr + 18); g.scale(easeBack(rp), easeBack(rp)); rosetteIcon(0, 0, rr, l === 0 ? '#3f6fd8' : RIBBON[Ld.thread], l === 0 ? '1st' : ''); g.restore();
    let yy = cy + rr * 3.6 + 16; const fs = clamp(18 * u, 16, 24);
    text(l === 0 ? 'First Rosette!' : Ld.grand + '!', cx + cw / 2, yy, fs * 1.3, '#c2410c', { fam: F.title, w: 400, max: cw - 30 }); yy += fs * 1.2;
    yy = wrap(this.msg, cx + 20, yy, cw - 40 - 50, fs, INK, 1.35, { fam: F.body, w: 700 }); speakBtn('grandSpeak', cx + cw - 36, cy + 36, 22, () => this.msg, { minHit: 50 });
    if (this.res.academy && yy + 120 < cy + ch - 80) { const it = ITEM_BY[this.res.academy]; const ts = Math.min(100, cy + ch - 90 - yy - 10); panel(cx + 20, yy + 8, ts, ts, 14, '#fff', { lw: 2.5, shadow: false }); itemThumb(it, h, cx + 23, yy + 11, ts - 6); text('New Academy treasure:', cx + 34 + ts, yy + 8 + ts * 0.35, fs * 0.85, '#7446c4', { align: 'left', fam: F.ui, w: 800, max: cw - ts - 60 }); text(it.n, cx + 34 + ts, yy + 8 + ts * 0.65, fs, INK, { align: 'left', fam: F.title, w: 400, max: cw - ts - 60 }); }
    const bh = clamp(62 * u, 58, 84); btn('grandCont', cx + 16, cy + ch - bh - 14, cw - 32, bh, this.t > 3.2 ? 'Continue' : '\u2026', { col: '#ff6f91', disabled: this.t < 3.2, fn: () => this.cont() });
  } };
/* ---------- sticker book ---------- */
SC.stickers = { name: 'stickers', enter() { Music.play('map'); scrollTo('tmpStick', 0); },
  draw() { const L = lay(), u = L.u; g.fillStyle = lin(0, 0, 0, VH, [[0, '#fff3dc'], [1, '#ffe6f0']]); g.fillRect(0, 0, VW, VH);
    const tb = topBar('Sticker Book', () => go(SC.map), { col: '#ff8c2e' }); const top = tb + 6, ah = L.y1 - top;
    const r = clamp(34 * u, 32, 48); const per = Math.max(3, Math.floor((L.cw - 20) / (r * 2 + 30))); const cellW = (L.cw - 20) / per; const fs = clamp(13 * u, 12, 16);
    const secs = LANDS.map((Ld, l) => { const stops = []; Ld.races.forEach(rc => rc.stops.forEach(s => stops.push(s))); return { l, Ld, stops }; });
    let total = r * 3 + 60; for (const s of secs) total += 50 + Math.ceil(s.stops.length / per) * (r * 2 + fs * 3 + 14);
    const off = scrollArea('tmpStick', 0, top, VW, ah, total + 20); pushClip(0, top, VW, ah); let y = top + 14 - off;
    text('Hall of Ribbons', L.x0 + 16, y + 16, clamp(22 * u, 20, 28), '#7446c4', { align: 'left', fam: F.title, w: 400 }); y += 40;
    const rw = (L.cw - 20) / 8; for (let l = 0; l < 8; l++) { const has = S.rosettes.includes(l); const rx = L.x0 + 10 + rw * (l + 0.5); g.save(); if (!has) g.globalAlpha = 0.25; rosetteIcon(rx, y + r * 0.6, Math.min(r * 0.6, rw * 0.32), l === 0 ? '#3f6fd8' : RIBBON[LANDS[l].thread], l === 0 ? '1' : String(l)); g.restore(); }
    y += r * 2.4;
    for (const s of secs) { text(s.Ld.n, L.x0 + 16, y + 18, clamp(19 * u, 17, 24), s.Ld.col === '#ffd93d' ? '#c29a00' : shade(s.Ld.col, -0.2), { align: 'left', fam: F.title, w: 400, max: L.cw - 32 }); y += 40;
      s.stops.forEach((st, i) => { const cx = L.x0 + 10 + cellW * (i % per + 0.5), cy = y + Math.floor(i / per) * (r * 2 + fs * 3 + 14) + r; if (cy < top - r * 2 || cy > top + ah + r * 2) return; const have = !!S.stickers[st]; stickerArt(st, cx, cy, r, s.l, have); const lines = wrapLines(have ? st : '???', cellW - 6, fs, F.ui, 800).slice(0, 2); lines.forEach((ln, k) => text(ln, cx, cy + r + fs * 0.9 + k * fs * 1.1, fs, have ? INK : '#9a8aa8', { fam: F.ui, w: 800, max: cellW - 4 })); });
      y += Math.ceil(s.stops.length / per) * (r * 2 + fs * 3 + 14) + 10; }
    popClip(); scrollBar('tmpStick', 0, top, VW - 4, ah); } };
