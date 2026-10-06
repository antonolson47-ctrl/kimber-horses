/* ===================== TACK ROOM: 8 tabs + Kimber, 48 items, info cards with color options ===================== */
function colorDot(x, y, r, v, ch, coat, on) {
  if (on) shape(() => C(x, y, r + 6), '#ffd93d', 3);
  if (ch && ch.emblem) { shape(() => C(x, y, r), '#3f6fd8', 2.5); emblem(v, x, y, r / 13, EMBLEM_COL[v]); }
  else if (v === 'rainbow' || Array.isArray(v)) { const cs = v === 'rainbow' ? RIBBON : v; const n = cs.length; for (let i = 0; i < n; i++) fillOnly(() => { g.moveTo(x, y); g.arc(x, y, r, -Math.PI / 2 + i * TAU / n, -Math.PI / 2 + (i + 1) * TAU / n); g.closePath(); }, cs[i]); strokeOnly(() => C(x, y, r), INK, 2.5); }
  else if (v === 'mane') { shape(() => C(x, y, r), coat.mane, 2.5); for (let k = -1; k <= 1; k++) strokeOnly(() => { g.moveTo(x + k * r * 0.4, y - r * 0.6); g.quadraticCurveTo(x + k * r * 0.4 + r * 0.3, y, x + k * r * 0.4, y + r * 0.6); }, shade(coat.mane === '#16131a' ? '#555555' : coat.mane, -0.3), 2); }
  else shape(() => C(x, y, r), v, 2.5);
  if (on) { fillOnly(() => C(x + r * 0.7, y - r * 0.7, r * 0.42), '#6bd66b'); icCheck(x + r * 0.7, y - r * 0.7, r * 0.3); }
}
function itemSpeech(it) { return it.n + '. ' + (it.honor ? it.honor + '. ' : '') + (it.pretend ? 'This one is pretend, made for Kimber\u2019s story. ' : 'Where: ' + it.where + '. When: ' + it.when + '. Who: ' + it.who + '. ') + it.text + (it.note ? ' ' + it.note : ''); }
SC.tack = { name: 'tack',
  enter(a) { this.from = (a && a.from) || (scene && scene.name === 'results' ? 'results' : scene && scene.name === 'stable' ? 'stable' : 'map'); this.card = null; this.tab = this.tab || 0; Music.play('tack'); scrollTo('tmpGrid', 0); this.t = 0; this.wearT = 0; },
  update(dt) { this.t += dt; this.wearT += dt; },
  key(k) { if (k === 'Escape' && this.card) { this.card = null; return true; } },
  back() { go(this.from === 'stable' ? SC.stable : SC.map); },
  wear(it) { const h = HORSE(); if (h.items[it.slot] === it.id) { if (it.slot === 'saddle' || it.slot === 'bridle') return; delete h.items[it.slot]; SFX.back(); } else { h.items[it.slot] = it.id; SFX.sparkle(); SFX.nicker(); this.wearT = 0; heartsUp(this.hx || VW / 2, this.hy || VH / 3, 5); } save(); },
  surprise() { const h = HORSE(); const slots = {}; for (const it of ITEMS) if (isUnlocked(it.id)) (slots[it.slot] = slots[it.slot] || []).push(it);
    h.items = {}; for (const s in slots) { if (s !== 'saddle' && s !== 'bridle' && Math.random() < 0.45) continue; if ((s === 'mask' || s === 'scarf') && Math.random() < 0.6) continue; const it = pick(slots[s]); h.items[s] = it.id; h.col[it.id] = it.ch.map(c => pick(c.o)); }
    if (!h.items.saddle) h.items.saddle = 'S5'; if (!h.items.bridle) h.items.bridle = 'H8'; save(); SFX.sparkle(); SFX.whinny('happy'); confetti(this.hx || VW / 2, this.hy || VH / 3, 40); },
  photo() { const h = HORSE(); savePhoto((c, W, H) => { tackRoom(0, 0, W, H, missingThreads()); rugPedestal(W / 2, H * 0.84, W * 0.36); drawHorse(W / 2 + 10, H * 0.84, W / 470, { pose: 'proud', coat: horseCoat(h), outfit: outfitOf(h, { rider: true }) }); bannerRibbon(W / 2, H * 0.08, W * 0.6, H * 0.08, '#8a5cd6', 'Kimber & ' + h.name, H * 0.045); text('Moonmeadow Riding Academy', W / 2, H * 0.95, H * 0.03, '#fff', { fam: F.title, w: 400, stroke: INK, sw: 6 }); }, 'Kimber-and-' + h.name + '.png'); },
  layout() { const L = lay(); const o = { L }; o.tb = Math.round(clamp(54 * L.u, 52, 78)) + L.y0; const tabH = clamp(50 * L.u, 50, 64);
    if (L.port) { o.px = 0; o.py = o.tb; o.pw = VW; o.ph = Math.round((L.y1 - o.tb) * (L.tab ? 0.4 : 0.36)); o.rx = L.x0 + 10; o.rw = L.cw - 20; o.tabY = o.py + o.ph + 8; o.tabH = tabH; o.gy = o.tabY + tabH + 8; o.gh = L.y1 - o.gy - 6; }
    else { o.px = 0; o.py = o.tb; o.pw = Math.round(L.x0 + L.cw * 0.42); o.ph = VH - o.tb; o.rx = o.pw + 10; o.rw = L.x1 - o.rx - 10; o.tabY = o.tb + 8; o.tabH = tabH; o.gy = o.tabY + tabH + 8; o.gh = L.y1 - o.gy - 6; }
    return o; },
  draw() { const o = this.layout(), L = o.L, u = L.u, h = HORSE(); if (!h) { go(SC.stable); return; }
    g.fillStyle = '#f6e6cc'; g.fillRect(0, 0, VW, VH);
    // preview
    tackRoom(o.px, o.py, o.pw, o.ph, missingThreads());
    const kimTab = this.tab === CATS.length; const hs = Math.min(o.pw / (kimTab ? 470 : 430), (o.ph - 24) / 390); const hx = o.px + o.pw / 2 + (kimTab ? 0 : 14 * hs), hy = o.py + o.ph - 18 * Math.max(0.6, hs);
    this.hx = hx; this.hy = hy - 180 * hs;
    rugPedestal(hx - 8 * hs, hy, 175 * hs);
    const bounce = this.wearT < 0.5 ? Math.sin(this.wearT * 12) * 4 * (1 - this.wearT * 2) : 0;
    drawHorseC(h, hx, hy - Math.abs(bounce), hs, { pose: 'proud', rider: kimTab });
    if (!kimTab && o.pw > 560 * hs + 40 && o.ph > 300) drawKimber(hx - 230 * hs, hy + 4, hs * 0.95, { pose: 'stand' });
    const nfs = clamp(17 * u, 15, 22); const nw = measure(h.name, nfs, F.title, 400) + 28; panel(o.px + 10 + (L.port ? 0 : L.x0), o.py + o.ph - nfs * 1.8 - 8, nw, nfs * 1.7, nfs * 0.85, '#fff', { lw: 2.5, shadow: false }); text(h.name, o.px + 10 + (L.port ? 0 : L.x0) + nw / 2, o.py + o.ph - nfs * 0.95 - 8, nfs, '#7446c4', { fam: F.title, w: 400 });
    // top bar
    const tb = topBar('Tack Room', () => this.back(), { col: '#8a5cd6', rightW: 150 * u });
    const ir = (tb - L.y0) * 0.36, icy = L.y0 + (tb - L.y0) / 2;
    ibtn('surprise', L.x1 - ir - 12, icy, ir, (x, y, r) => icDice(x, y, r), { fn: () => this.surprise(), minHit: 52 });
    ibtn('photo', L.x1 - ir - 12 - Math.max(ir * 2 + 12, 58), icy, ir, (x, y, r) => icCamera(x, y, r), { fn: () => this.photo(), minHit: 52 });
    // tabs
    const tabs = CATS.map(c => ({ n: c.n, col: c.col })).concat([{ n: 'Kimber', col: '#ff6f91' }]); const tfs = clamp(15 * u, 14, 19);
    const tw = tabs.map(t => measure(t.n, tfs, F.ui, 800) + 30); const tot = tw.reduce((a, b) => a + b + 8, 0);
    const toff = scrollArea('tmpTabs', o.rx - 4, o.tabY, o.rw + 8, o.tabH, tot + 8, true); pushClip(o.rx - 4, o.tabY, o.rw + 8, o.tabH); let x = o.rx - toff;
    tabs.forEach((t, i) => { const w = tw[i], on = i === this.tab; shape(() => RR(x, o.tabY + 2, w, o.tabH - 6, (o.tabH - 6) / 2), on ? t.col : '#fff', 3); text(t.n, x + w / 2, o.tabY + o.tabH / 2 - 1, tfs, on ? '#fff' : INK, { fam: F.ui, w: 800 });
      hit('tab' + i, x, o.tabY, w, o.tabH, { fn: () => { this.tab = i; scrollTo('tmpGrid', 0); SFX.ui(); } }); x += w + 8; });
    popClip();
    if (kimTab) this.kimberPanel(o); else this.grid(o);
    if (this.card) this.drawCard(o);
  },
  grid(o) { const L = o.L, u = L.u, h = HORSE(); const cat = CATS[this.tab]; const items = ITEMS.filter(i => i.cat === cat.id);
    const minT = L.tab ? 150 : 104; const cols = Math.max(2, Math.floor((o.rw + 10) / (minT + 10))); const tsz = (o.rw - (cols - 1) * 10) / cols; const nameH = clamp(34 * u, 32, 44); const th = tsz + nameH;
    const rows = Math.ceil(items.length / cols); const off = scrollArea('tmpGrid', o.rx - 4, o.gy, o.rw + 8, o.gh, rows * (th + 10) + 6);
    pushClip(o.rx - 4, o.gy, o.rw + 8, o.gh);
    items.forEach((it, i) => { const x = o.rx + (i % cols) * (tsz + 10), y = o.gy + Math.floor(i / cols) * (th + 10) - off; if (y > o.gy + o.gh || y + th < o.gy) return;
      const un = isUnlocked(it.id), wearing = h.items[it.slot] === it.id; const p = isPressed('it_' + it.id) ? 2 : 0;
      panel(x, y + p, tsz, th, 14, wearing ? '#e9ffe2' : un ? '#fff' : '#efe8f4', { lw: wearing ? 3.5 : 2.5, ink: wearing ? '#3c9a4a' : INK, shadow: false });
      itemThumb(it, h, x + 4, y + p + 4, tsz - 8, { locked: !un });
      if (!un) { icLock(x + tsz / 2, y + p + tsz / 2, tsz * 0.13); }
      const nfs = clamp(12.5 * u, 12, 16); const lines = wrapLines(un ? it.n : 'Locked', tsz - 10, nfs, F.ui, 800).slice(0, 2); lines.forEach((l, k) => text(l, x + tsz / 2, y + p + tsz + (lines.length === 1 ? nameH / 2 - 4 : 7 + k * nfs * 1.05), nfs, un ? INK : '#8a7a9a', { fam: F.ui, w: 800, max: tsz - 8 }));
      if (wearing) { shape(() => C(x + tsz - 14, y + p + 14, 12), '#6bd66b', 2.5); icCheck(x + tsz - 14, y + p + 14, 8); }
      if (it.pretend) { shape(() => RR(x + 6, y + p + 6, 58, 20, 10), '#b07bff', 2); text('Pretend', x + 35, y + p + 16.5, 11, '#fff', { fam: F.ui, w: 800 }); }
      if (S.newItems && S.newItems[it.id]) { shape(() => RR(x + 6, y + p + 6, 44, 20, 10), '#ff5a6e', 2); text('NEW', x + 28, y + p + 16.5, 11, '#fff', { fam: F.ui, w: 800 }); }
      hit('it_' + it.id, x, y, tsz, th, { fn: () => { this.card = it.id; scrollTo('tmpCard', 0); if (S.newItems) delete S.newItems[it.id]; SFX.ui(); } }); });
    popClip(); scrollBar('tmpGrid', o.rx - 4, o.gy, o.rw + 8, o.gh);
    if (rows * (th + 10) > o.gh + 20) { /* fade hint at bottom */ g.fillStyle = lin(0, o.gy + o.gh - 18, 0, o.gy + o.gh, [[0, 'rgba(246,230,204,0)'], [1, 'rgba(246,230,204,1)']]); g.fillRect(o.rx - 4, o.gy + o.gh - 18, o.rw + 8, 18); } },
  kimberPanel(o) { const L = o.L, u = L.u; const x = o.rx, w = o.rw; let y = o.gy + 4; const fs = clamp(18 * u, 16, 22); let r = clamp(22 * u, 22, 30);
    const fitH = rr => { const per = Math.max(1, Math.floor((w - 24) / (rr * 2 + 18))); return 16 + fs * 1.8 + [HELMET_COLS, POLO_COLS].reduce((a, l) => a + fs * 1.2 + rr + Math.ceil(l.length / per) * (rr * 2 + 18) + 8, 0); };
    while (r > 15 && fitH(r) > o.gh - 8) r -= 1;
    panel(x, y, w, o.gh - 8, 18, '#fff', { lw: 2.5 }); y += 16;
    text('Kimber rides English!', x + 18, y + fs * 0.6, fs * 1.1, '#ff6f91', { align: 'left', fam: F.title, w: 400, max: w - 36 }); y += fs * 1.8;
    for (const [label, list, key] of [['Riding helmet', HELMET_COLS, 'helmet'], ['Polo shirt', POLO_COLS, 'polo']]) {
      text(label + ': ' + list[S.kim[key]][1], x + 18, y + fs * 0.5, fs, INK, { align: 'left', fam: F.ui, w: 800, max: w - 36 }); y += fs * 1.2 + r;
      const per = Math.max(1, Math.floor((w - 24) / (r * 2 + 18))); list.forEach((c, i) => { const cx = x + 18 + r + 4 + (i % per) * (r * 2 + 18), cy = y + Math.floor(i / per) * (r * 2 + 18); colorDot(cx, cy, r, c[0], null, null, S.kim[key] === i); hit('kim_' + key + i, cx - r - 7, cy - r - 7, r * 2 + 14, r * 2 + 14, { fn: () => { S.kim[key] = i; applyKimColors(); save(); SFX.ding(i); } }); });
      y += Math.ceil(list.length / per) * (r * 2 + 18) + 8; }
    if (y + fs * 3 < o.gy + o.gh) wrap('Blonde ponytail, blue eyes, and a big smile. Ready to ride!', x + 18, y, w - 36, clamp(15 * u, 14, 18), '#6a5a78', 1.3, { fam: F.body, w: 400 }); },
  drawCard(o) { const L = o.L, u = L.u, h = HORSE(), coat = horseCoat(h); const it = ITEM_BY[this.card]; const un = isUnlocked(it.id); const wearing = h.items[it.slot] === it.id;
    LAYER = 2; let x, y, w, ht;
    if (L.port) { x = L.x0 + 8; w = L.cw - 16; y = Math.max(o.tb + 8, o.py + o.ph * (L.tab ? 0.7 : 0.82)); ht = L.y1 - y - 6; }
    else { x = o.rx - 6; w = o.rw + 12; y = o.tb + 8; ht = L.y1 - y - 6; }
    g.fillStyle = 'rgba(40,20,70,.25)'; g.fillRect(0, o.tb, VW, VH); hit('cardBackdrop', 0, 0, VW, VH, { fn: () => { this.card = null; }, bg: 1 });
    panel(x, y, w, ht, 22, '#fffaf2', { lw: 3.5 }); hit('cardBody', x, y, w, ht, { bg: 1 });
    const pad = 16, cr = clamp(22 * u, 22, 28); const fs = clamp(16 * u, 15, 20); const tfs = clamp(22 * u, 20, 28);
    ibtn('cardClose', x + w - cr - 10, y + cr + 10, cr, (cx, cy, r) => icClose(cx, cy, r, INK), { fn: () => { this.card = null; SFX.back(); }, minHit: 50 });
    if (un) speakBtn('cardSpeak', x + w - cr * 3 - 22, y + cr + 10, cr, () => itemSpeech(it), { minHit: 50 });
    const footH = clamp(62 * u, 58, 80); const cTop = y + 8, cH = ht - footH - 22;
    // content height pass
    const innerW = w - pad * 2; const titleLines = wrapLines(un ? it.n : 'Locked item', innerW - cr * 4 - 30, tfs, F.title, 400);
    const textLines = wrapLines(it.text, innerW, fs, F.body, 400); const noteLines = it.note ? wrapLines(it.note, innerW - 10, fs * 0.88, F.body, 400) : [];
    const thumb = Math.min(innerW * 0.38, L.tab ? 170 : 120); const mapW = Math.min(innerW - thumb - 14, 240), mapH = mapW * 0.5;
    const metaLines = it.pretend ? [] : [['pin', it.where], ['clock', it.when], ['star', it.who]].map(([k, s]) => [k, wrapLines(s, innerW - 40, fs, F.body, 700)]);
    let content = titleLines.length * tfs * 1.15 + 16 + (it.honor ? fs * 1.6 : 0) + thumb + 16 + metaLines.reduce((a, m) => a + m[1].length * fs * 1.3 + 8, 0) + textLines.length * fs * 1.35 + 14 + noteLines.length * fs * 1.2 + 14;
    const dotR = clamp(20 * u, 20, 26); const per = Math.max(1, Math.floor((innerW + 12) / (dotR * 2 + 16)));
    if (un) for (const ch of it.ch) content += fs * 1.6 + Math.ceil(ch.o.length / per) * (dotR * 2 + 16) + (ch.labels ? fs * 1.4 : 0); content += (it.fixed ? fs * 2.6 : 0) + 30;
    const off = scrollArea('tmpCard', x + 4, cTop, w - 8, cH, content); pushClip(x + 4, cTop, w - 8, cH);
    let cy = cTop + 10 - off; const lx = x + pad;
    g.textAlign = 'left'; g.textBaseline = 'top';
    titleLines.forEach((l, i) => text(l, lx, cy + tfs * 0.55 + i * tfs * 1.15, tfs, '#7446c4', { align: 'left', fam: F.title, w: 400 })); cy += titleLines.length * tfs * 1.15 + 10;
    if (it.honor) { text(it.honor, lx, cy + fs * 0.6, fs, '#b0408a', { align: 'left', fam: F.body, w: 700, max: innerW }); cy += fs * 1.6; }
    panel(lx, cy, thumb, thumb, 14, '#fff', { lw: 2.5, shadow: false }); itemThumb(it, h, lx + 3, cy + 3, thumb - 6, { locked: !un });
    if (it.pin && mapW > 80) { miniMap(lx + thumb + 14, cy + (thumb - mapH) / 2, mapW, mapH, it.pin); }
    else if (it.pretend) { shape(() => RR(lx + thumb + 14, cy + thumb / 2 - 18, 150, 36, 18), '#b07bff', 2.5); text('Pretend item', lx + thumb + 89, cy + thumb / 2, 16, '#fff', { fam: F.ui, w: 800 }); }
    cy += thumb + 16;
    for (const [k, lines] of metaLines) { const ic = k === 'pin' ? icPin : k === 'clock' ? icClock : icStar; ic(lx + 12, cy + fs * 0.65, fs * 0.62); g.textAlign = 'left'; g.textBaseline = 'top'; font(fs, F.body, 700); g.fillStyle = INK; lines.forEach((l, i) => g.fillText(l, lx + 32, cy + i * fs * 1.3)); cy += lines.length * fs * 1.3 + 8; }
    font(fs, F.body, 400); g.fillStyle = INK; g.textAlign = 'left'; g.textBaseline = 'top'; textLines.forEach((l, i) => g.fillText(l, lx, cy + 6 + i * fs * 1.35)); cy += textLines.length * fs * 1.35 + 14;
    if (noteLines.length) { font(fs * 0.88, F.body, 400); g.fillStyle = '#7a6a88'; noteLines.forEach((l, i) => g.fillText(l, lx + 6, cy + i * fs * 1.2)); cy += noteLines.length * fs * 1.2 + 14; }
    if (un) { for (let ci = 0; ci < it.ch.length; ci++) { const ch = it.ch[ci]; const cur = itemCols(h, it.id)[ci];
        text(ch.n + (ch.o.length > 1 ? '' : ' (only one, like the real one)'), lx, cy + fs * 0.7, fs, '#7446c4', { align: 'left', fam: F.ui, w: 800, max: innerW }); cy += fs * 1.6;
        ch.o.forEach((v, k) => { const dx = lx + dotR + 6 + (k % per) * (dotR * 2 + 16), dy = cy + dotR + 6 + Math.floor(k / per) * (dotR * 2 + 16); const on = JSON.stringify(v) === JSON.stringify(cur);
          colorDot(dx, dy, dotR, v, ch, coat, on); hit('col_' + ci + '_' + k, dx - dotR - 7, dy - dotR - 7, dotR * 2 + 14, dotR * 2 + 14, { fn: () => { const c = itemCols(h, it.id); c[ci] = v; h.col[it.id] = c; if (h.items[it.slot] !== it.id) h.items[it.slot] = it.id; this.wearT = 0; save(); SFX.ding(k + ci * 3); } }); });
        cy += Math.ceil(ch.o.length / per) * (dotR * 2 + 16);
        if (ch.labels) { const li = ch.o.findIndex(v => JSON.stringify(v) === JSON.stringify(cur)); text(ch.labels[Math.max(0, li)], lx, cy + fs * 0.5, fs * 0.95, INK, { align: 'left', fam: F.body, w: 700, max: innerW }); cy += fs * 1.4; } }
      if (it.fixed) { const fl = wrapLines(it.fixed, innerW - 20, fs * 0.9, F.body, 700); panel(lx, cy + 4, innerW, fl.length * fs * 1.2 + 16, 12, '#fff3c4', { lw: 2, shadow: false }); font(fs * 0.9, F.body, 700); g.fillStyle = INK; g.textAlign = 'left'; g.textBaseline = 'top'; fl.forEach((l, i) => g.fillText(l, lx + 10, cy + 12 + i * fs * 1.2)); cy += fl.length * fs * 1.2 + 24; } }
    popClip(); scrollBar('tmpCard', x + 4, cTop, w - 8, cH);
    // footer
    const fy = y + ht - footH - 12; strokeOnly(() => { g.moveTo(x + 12, fy - 6); g.lineTo(x + w - 12, fy - 6); }, 'rgba(59,39,65,.15)', 2);
    if (!un) { panel(x + pad, fy, w - pad * 2, footH, footH / 2, '#efe8f4', { lw: 2.5, shadow: false }); icLock(x + pad + footH * 0.55, fy + footH / 2, footH * 0.22); text('Win more races to unlock!', x + w / 2 + footH * 0.25, fy + footH / 2, clamp(17 * u, 15, 21), '#6a5a78', { fam: F.ui, w: 800, max: w - pad * 2 - footH * 1.4 }); }
    else { const must = it.slot === 'saddle' || it.slot === 'bridle';
      if (wearing && must) { panel(x + pad, fy, w - pad * 2, footH, footH / 2, '#e9ffe2', { lw: 2.5, ink: '#3c9a4a', shadow: false }); text('Wearing it! Pick another ' + it.slot + ' to swap.', x + w / 2, fy + footH / 2, clamp(16 * u, 14, 20), '#2c7a3a', { fam: F.ui, w: 800, max: w - pad * 2 - 20 }); }
      else btn('wear', x + pad, fy, w - pad * 2, footH, wearing ? 'Take off' : 'Wear it!', { col: wearing ? '#9b8ab8' : '#6bd66b', fn: () => this.wear(it) }); }
    LAYER = 0; } };
