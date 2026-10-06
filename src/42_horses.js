/* ===================== SCENES: stable, coat picker, name entry ===================== */
function stallFrame(x, y, w, h, open) { panel(x, y, w, h, 16, open ? '#f3d9b0' : '#d9cbb8', { lw: 3 }); clipTo(() => RR(x, y, w, h, 16), () => { g.fillStyle = 'rgba(150,90,50,.18)'; for (let px = x + 18; px < x + w; px += 26) g.fillRect(px, y, 3, h); g.fillStyle = '#e8c48a'; g.fillRect(x, y + h * 0.82, w, h); for (let k = 0; k < 14; k++) { g.fillStyle = 'rgba(200,150,60,.5)'; g.fillRect(x + ((k * 37) % w), y + h * 0.84 + (k % 3) * 5, 14, 2); } });
  shape(() => RR(x + 6, y + 6, w - 12, 14, 7), '#8a5a3a', 2.5); }
SC.stable = { name: 'stable', enter() { Music.play('map'); },
  draw() { const L = lay(); g.fillStyle = lin(0, 0, 0, VH, [[0, '#f6e3c4'], [1, '#e8c79a']]); g.fillRect(0, 0, VW, VH);
    const tb = topBar('Stable', () => go(S.started && S.horses.length ? SC.map : SC.title), { col: '#2fa39a', rightW: 120 * L.u });
    shoeCounter(L.x1 - 12, L.y0 + (tb - L.y0) / 2 - 18 * L.u, 36 * L.u, S.shoes);
    const ab = clamp(64 * L.u, 60, 86); const top = tb + 12, bot = L.y1 - ab - 18; const cols = L.port ? 2 : 3, rows = 6 / cols; const gap = 12;
    const sw = (L.cw - 24 - gap * (cols - 1)) / cols, sh = Math.min((bot - top - gap * (rows - 1)) / rows, sw * 1.1); const gx = L.x0 + 12, gy = top + Math.max(0, (bot - top - (sh * rows + gap * (rows - 1))) / 2);
    const open = stallsOpen();
    for (let i = 0; i < 6; i++) { const cx = gx + (i % cols) * (sw + gap), cy = gy + Math.floor(i / cols) * (sh + gap); const isOpen = i < open; const h = S.horses[i];
      stallFrame(cx, cy, sw, sh, isOpen);
      if (h) { const s = Math.min(sw / 420, (sh - 50) / 380); drawHorseC(h, cx + sw / 2 + 6 * s, cy + sh * 0.84, s, { pose: i === S.cur ? 'proud' : 'stand' });
        const fs = clamp(17 * L.u, 15, 22), nw = Math.min(sw - 20, measure(h.name, fs, F.title, 400) + 30); panel(cx + sw / 2 - nw / 2, cy + sh - fs * 1.9, nw, fs * 1.6, fs * 0.8, i === S.cur ? '#ffd93d' : '#fff', { lw: 2.5, shadow: false }); text(h.name, cx + sw / 2, cy + sh - fs * 1.1, fs, INK, { fam: F.title, w: 400, max: nw - 14 });
        if (i === S.cur) { const r = clamp(16 * L.u, 15, 22); shape(() => star(cx + r + 8, cy + r + 24, r), '#ffd93d', 2.5); text('Riding', cx + r * 2 + 14, cy + r + 25, clamp(13 * L.u, 12, 17), INK, { align: 'left', fam: F.ui, w: 800 }); }
        hit('stall' + i, cx, cy, sw, sh, { fn: () => { if (S.cur !== i) { S.cur = i; save(); SFX.nicker(); toast('Riding ' + h.name + '!', '#2fa39a'); } else { SFX.nicker(); heartsUp(cx + sw / 2, cy + sh * 0.4, 6); } } }); }
      else if (isOpen) { const r = Math.min(sw, sh) * 0.2; shape(() => C(cx + sw / 2, cy + sh * 0.42, r), '#fff', 3); strokeOnly(() => { g.moveTo(cx + sw / 2 - r * 0.5, cy + sh * 0.42); g.lineTo(cx + sw / 2 + r * 0.5, cy + sh * 0.42); g.moveTo(cx + sw / 2, cy + sh * 0.42 - r * 0.5); g.lineTo(cx + sw / 2, cy + sh * 0.42 + r * 0.5); }, '#2fa39a', 6);
        text('New horse', cx + sw / 2, cy + sh * 0.42 + r + 22, clamp(18 * L.u, 16, 24), INK, { fam: F.title, w: 400, max: sw - 16 }); hit('stall' + i, cx, cy, sw, sh, { fn: () => go(SC.coat, { first: false }) }); }
      else { icLock(cx + sw / 2, cy + sh * 0.42, Math.min(sw, sh) * 0.14); text('Finish Chapter ' + (i - 2), cx + sw / 2, cy + sh * 0.68, clamp(15 * L.u, 13, 19), '#7a6a5a', { fam: F.ui, w: 800, max: sw - 16 }); }
    }
    const h = HORSE(); const bw = (L.cw - 24 - 24) / 3;
    btn('rename', L.x0 + 12, L.y1 - ab - 8, bw, ab, 'Rename', { col: '#9b8ab8', disabled: !h, fn: () => go(SC.name, { rename: S.cur }) });
    btn('toTack', L.x0 + 24 + bw, L.y1 - ab - 8, bw, ab, 'Tack Room', { col: '#8a5cd6', disabled: !h, fn: () => go(SC.tack) });
    btn('toMap', L.x0 + 36 + bw * 2, L.y1 - ab - 8, bw, ab, 'Ride!', { col: '#ff6f91', disabled: !h, fn: () => go(S.started ? SC.map : SC.title) });
  } };
/* ---------- coat picker ---------- */
SC.coat = { name: 'coat',
  enter(a) { this.a = a || {}; this.bi = 0; this.ci = 0; this.t = 0; scrollTo('tmpBreeds', 0); scrollTo('tmpCoats', 0); Music.play('map'); },
  update(dt) { this.t += dt; },
  spec() { const br = BREEDS[this.bi]; const cs = breedCoats(br); return cs[Math.min(this.ci, cs.length - 1)]; },
  draw() { const L = lay(); g.fillStyle = lin(0, 0, 0, VH, [[0, '#fff1d6'], [1, '#ffe0ec']]); g.fillRect(0, 0, VW, VH);
    const tb = topBar(this.a.first ? 'Pick your horse!' : 'A new horse!', this.a.first ? null : () => go(SC.stable), { col: '#ff8c2e' });
    const br = BREEDS[this.bi], coats = breedCoats(br), spec = this.spec(); const u = L.u;
    const bh = clamp(64 * u, 60, 86); const chipH = clamp(48 * u, 48, 62);
    let px, py, pw, ph, rx, rw, ry;
    if (L.port) { pw = L.cw; px = L.x0; py = tb; ph = Math.max(150, (L.y1 - tb) * 0.34); rx = L.x0 + 12; rw = L.cw - 24; ry = py + ph; }
    else { pw = L.cw * 0.44; px = L.x0; py = tb; ph = L.y1 - tb; rx = px + pw + 6; rw = L.x1 - rx - 12; ry = tb + 10; }
    // preview
    g.fillStyle = lin(0, py, 0, py + ph, [[0, '#ffe9c2'], [1, '#ffd29a']]); g.fillRect(px, py, pw, ph);
    const factH = L.port ? 0 : Math.max(110, ph * 0.36); const hs = Math.min(pw / 460, (ph - (L.port ? 64 : 70 + factH)) / 380); const hx = px + pw / 2 + 8 * hs, hy = py + ph - (L.port ? 30 : factH + 18);
    rugPedestal(hx - 10 * hs, hy, 170 * hs); drawHorse(hx, hy, hs, { pose: 'proud', coat: spec, outfit: outfitOf(null, { only: { saddle: 'S5', pad: 'B7', bridle: 'H8' } }) });
    const nfs = clamp(22 * u, 20, 30);
    const label = br.n + (br.star ? ' \u2605' : ''); text(label, px + pw / 2, py + 22 * u, nfs, '#c2410c', { fam: F.title, w: 400, stroke: '#fff', sw: 6, max: pw - 24 });
    text(coatName(spec) + '  \u00b7  ' + br.from, px + pw / 2, py + 22 * u + nfs * 1.05, clamp(14 * u, 13, 18), INK, { fam: F.ui, w: 800, stroke: '#fff', sw: 4, max: pw - 24 });
    box('coatLabel', px + 12, py + 22 * u - nfs / 2, pw - 24, nfs * 1.9);
    if (!L.port) { const fy = hy + 14, fh = L.y1 - fy - 8; this.fact(px + 12, fy, pw - 24, fh, br, L); }
    // breed chips
    const fsC = clamp(16 * u, 15, 20);
    if (L.port) { const rowY = ry + 8; const widths = BREEDS.map(b => measure(b.n + (b.star ? ' \u2605' : ''), fsC, F.ui, 800) + 30); const tot = widths.reduce((a, b) => a + b + 8, 0);
      const off = scrollArea('tmpBreeds', rx - 12, rowY, rw + 24, chipH, tot + 24, true); pushClip(rx - 12, rowY, rw + 24, chipH); let x = rx - off;
      BREEDS.forEach((b, i) => { const w = widths[i]; if (x + w > rx - 20 && x < rx + rw + 20) this.chip('br' + i, x, rowY, w, chipH, b.n + (b.star ? ' \u2605' : ''), i === this.bi, () => { this.bi = i; this.ci = 0; scrollTo('tmpCoats', 0); scrollTo('tmpFact', 0); SFX.nicker(); }, fsC); x += w + 8; });
      popClip();
      const cy = rowY + chipH + 10, cs = chipH * 1.35; const cTot = coats.length * (cs + 8); const off2 = scrollArea('tmpCoats', rx - 12, cy, rw + 24, cs, cTot + 24, true); pushClip(rx - 12, cy, rw + 24, cs);
      coats.forEach((c, i) => { const x2 = rx + i * (cs + 8) - off2; if (x2 + cs > rx - 20 && x2 < rx + rw + 20) this.coatChip('co' + i, x2, cy, cs, c, i === this.ci, () => { this.ci = i; SFX.ding(i); }); }); popClip();
      const fy = cy + cs + 10, fh = L.y1 - bh - 16 - fy; this.fact(rx, fy, rw, fh, br, L);
    } else { const listH = (L.y1 - ry - bh - 16) * 0.5; const cols = Math.max(2, Math.floor(rw / 170)); const cw = (rw - (cols - 1) * 8) / cols; const rowsN = Math.ceil(BREEDS.length / cols);
      const off = scrollArea('tmpBreeds', rx, ry, rw, listH, rowsN * (chipH + 8)); pushClip(rx, ry, rw, listH);
      BREEDS.forEach((b, i) => { const x = rx + (i % cols) * (cw + 8), y = ry + Math.floor(i / cols) * (chipH + 8) - off; if (y + chipH > ry - 4 && y < ry + listH + 4) this.chip('br' + i, x, y, cw, chipH, b.n + (b.star ? ' \u2605' : ''), i === this.bi, () => { this.bi = i; this.ci = 0; scrollTo('tmpCoats', 0); scrollTo('tmpFact', 0); SFX.nicker(); }, fsC); });
      popClip(); scrollBar('tmpBreeds', rx, ry, rw + 8, listH);
      const cy = ry + listH + 10, cs = Math.min(chipH * 1.35, L.y1 - bh - 16 - cy - 4); const per = Math.max(1, Math.floor((rw + 8) / (cs + 8))); const cTot = coats.length * (cs + 8);
      const off2 = scrollArea('tmpCoats', rx, cy, rw, cs, cTot, true); pushClip(rx, cy, rw, cs);
      coats.forEach((c, i) => { const x2 = rx + i * (cs + 8) - off2; if (x2 + cs > rx - 4 && x2 < rx + rw + 4) this.coatChip('co' + i, x2, cy, cs, c, i === this.ci, () => { this.ci = i; SFX.ding(i); }); }); popClip(); }
    btn('pickHorse', L.port ? L.x0 + 12 : rx, L.y1 - bh - 8, L.port ? L.cw - 24 : rw, bh, 'Choose this horse!', { col: '#ff6f91', fn: () => { SFX.whinny('happy'); go(SC.name, { breed: br.id, spec, first: this.a.first }); } });
  },
  chip(id, x, y, w, h, label, on, fn, fs) { const p = isPressed(id) ? 2 : 0; shape(() => RR(x, y + p, w, h - 4, (h - 4) / 2), on ? '#ff8c2e' : '#fff', 3); text(label, x + w / 2, y + p + h / 2 - 2, fs, on ? '#fff' : INK, { fam: F.ui, w: 800, max: w - 16 }); hit(id, x, y, w, h, { fn }); },
  coatChip(id, x, y, s, spec, on, fn) { shape(() => RR(x, y, s, s, 14), on ? '#ffd93d' : '#fff', on ? 4 : 3); const k = 'cc' + JSON.stringify(spec) + Math.round(s);
    const spr = sprite(k, s, s, () => { const sc = s / 330; drawHorse(s / 2 + 4 * sc, s * 0.9, sc, { pose: 'stand', coat: spec, noShadow: true, lw: 4 }); }); blit(spr, x, y, s, s); hit(id, x, y, s, s, { fn }); },
  fact(x, y, w, h, br, L) { if (h < 60) return; panel(x, y, w, h, 18, '#fff', { lw: 2.5 }); const sr = clamp(22 * L.u, 22, 30); const txt = br.n + '. From ' + br.from + '. ' + br.fact;
    speakBtn('factSpeak', x + w - sr - 10, y + sr + 8, sr, () => txt, { minHit: 52 });
    let fs = clamp(16 * L.u, 14, 20); let lines = wrapLines(br.fact, w - sr * 2 - 40, fs, F.body, 400); while (lines.length * fs * 1.3 > h - 24 && fs > 13) { fs -= 1; lines = wrapLines(br.fact, w - sr * 2 - 40, fs, F.body, 400); }
    const off = scrollArea('tmpFact', x + 4, y + 4, w - sr * 2 - 24, h - 8, lines.length * fs * 1.3 + 20); pushClip(x + 4, y + 4, w - sr * 2 - 24, h - 8);
    g.textAlign = 'left'; g.textBaseline = 'top'; font(fs, F.body, 400); g.fillStyle = INK; lines.forEach((l, i) => g.fillText(l, x + 16, y + 12 + i * fs * 1.3 - off)); popClip(); scrollBar('tmpFact', x + 4, y + 4, w - sr * 2 - 20, h - 8); box('fact', x + 4, y + 4, w - sr * 2 - 24, h - 8); } };
/* ---------- name entry ---------- */
const KB_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
SC.name = { name: 'name',
  enter(a) { this.a = a; this.v = a.rename != null ? S.horses[a.rename].name : ''; this.msg = ''; this.msgT = 0; Music.play('map'); this.idea = Math.floor(Math.random() * NAME_IDEAS.length);
    setTimeout(() => { if (scene === this) Voice.say('nameQ', a.rename != null ? 'Pick a new name.' : 'What\u2019s your horse\u2019s name?'); }, 300); },
  type(ch) { if (this.v.length >= 12) { SFX.no(); return; } if (ch === ' ' && (!this.v || this.v.endsWith(' '))) return; this.v += this.v.length === 0 || this.v.endsWith(' ') ? ch.toUpperCase() : ch.toLowerCase(); this.msg = ''; SFX.key(); },
  back() { this.v = this.v.slice(0, -1); SFX.key(); },
  done() { const n = this.v.trim(); if (!n) { this.msg = 'Type a name first!'; this.msgT = 0; SFX.no(); return; }
    if (!nameIsKind(n)) { this.msg = 'Hmm, let\u2019s pick a kind name for your horse!'; this.msgT = 0; SFX.no(); Voice.say('kind', this.msg); return; }
    const a = this.a;
    if (a.rename != null) { S.horses[a.rename].name = n; save(); toast('Hello, ' + n + '!', '#2fa39a'); go(SC.stable); return; }
    const h = newHorse(a.breed, a.spec, n); S.horses.push(h); S.cur = S.horses.length - 1; S.started = true; save(); SFX.whinny('happy'); confetti(VW / 2, VH * 0.3, 70);
    Voice.say('hello', 'Hello, ' + n + '!');
    if (a.first) go(SC.story, { pages: ['p3', 'p4'], then: 'prologueRace', lastLabel: 'To the paddock!' }); else { toast('Welcome, ' + n + '!', '#2fa39a'); go(SC.stable); } },
  key(k, e) { if (/^[a-zA-Z]$/.test(k)) this.type(k); else if (k === ' ') this.type(' '); else if (k === 'Backspace') this.back(); else if (k === 'Enter') this.done(); else if (k === '-' || k === "'") this.type(k); },
  update(dt) { this.msgT += dt; },
  draw() { const L = lay(); const u = L.u; g.fillStyle = lin(0, 0, 0, VH, [[0, '#e9f7ff'], [1, '#ffeef8']]); g.fillRect(0, 0, VW, VH);
    const re = this.a.rename != null; const h = re ? S.horses[this.a.rename] : null; const spec = re ? h.spec : this.a.spec;
    const tb = topBar(re ? 'New name' : 'Name your horse', () => go(re ? SC.stable : SC.coat, re ? undefined : { first: this.a.first }), { col: '#3f6fd8' });
    const keyH = clamp(Math.min(54 * u, (L.ch - 60) / (L.port ? 9 : 5.6)), 40, 70);
    let kx, kw, ky, fx, fw, fy, fieldH = clamp(58 * u, 50, 76);
    if (L.port) { kx = L.x0 + 6; kw = L.cw - 12; ky = L.y1 - keyH * 4 - 30; fx = L.x0 + 16; fw = L.cw - 32; const hsz = ky - tb - fieldH - keyH - 60; fy = tb + Math.max(0, hsz) + 24;
      if (hsz > 60) { const hs = Math.min(fw / 460, hsz / 360); drawHorse(VW / 2, tb + 14 + hsz, hs, { pose: 'proud', coat: spec, outfit: outfitOf(h, h ? {} : { only: { saddle: 'S5', pad: 'B7', bridle: 'H8' } }) }); } }
    else { kx = L.x0 + L.cw * 0.42; kw = L.x1 - kx - 8; ky = L.y1 - keyH * 4 - 30; fx = L.x0 + 14; fw = L.cw * 0.42 - 28; fy = tb + 14;
      const hsz = L.y1 - (fy + fieldH + 10 + clamp(44 * u, 44, 56)) - 18; if (hsz > 60) { const hs = Math.min(fw / 440, hsz / 360); drawHorse(fx + fw / 2, L.y1 - 6, hs, { pose: 'proud', coat: spec, outfit: outfitOf(h, h ? {} : { only: { saddle: 'S5', pad: 'B7', bridle: 'H8' } }) }); } }
    // field
    panel(fx, fy, fw, fieldH, fieldH / 2, '#fff', { lw: 3.5 }); const fs = clamp(30 * u, 26, 40);
    const shown = this.v || ''; text(shown, fx + fw / 2, fy + fieldH / 2 + 1, fs, '#7446c4', { fam: F.title, w: 400, max: fw - 40 });
    if (Math.floor(T * 2) % 2 === 0) { const tw = Math.min(measure(shown, fs, F.title, 400), fw - 40); fillOnly(() => RR(fx + fw / 2 + tw / 2 + 4, fy + fieldH * 0.22, 3, fieldH * 0.56, 1), '#7446c4'); }
    if (!shown) text('Tap the letters!', fx + fw / 2, fy + fieldH / 2, fs * 0.6, '#b0a8c0', { fam: F.ui, w: 800 });
    box('nameField', fx, fy, fw, fieldH);
    // message or ideas
    const iy = fy + fieldH + 10, ih = clamp(44 * u, 44, 56);
    if (this.msg && this.msgT < 4) { panel(fx, iy, fw, ih, ih / 2, '#fff1a8', { lw: 2.5 }); text(this.msg, fx + fw / 2, iy + ih / 2, clamp(15 * u, 13, 19), INK, { fam: F.ui, w: 800, max: fw - 20 }); }
    else { const n = L.port ? 3 : 2; const iw = (fw - (n - 1) * 8 - ih - 8) / n;
      for (let i = 0; i < n; i++) { const nm = NAME_IDEAS[(this.idea + i) % NAME_IDEAS.length]; btn('idea' + i, fx + i * (iw + 8), iy, iw, ih, nm, { col: '#ffb84d', fs: clamp(16 * u, 15, 20), fn: () => { this.v = nm; this.msg = ''; SFX.ding(i + 2); } }); }
      btn('ideaDice', fx + fw - ih, iy, ih, ih, '', { col: '#ffffff', icon: (x, y, r) => icDice(x, y, r * 1.2), fn: () => { this.idea = (this.idea + (L.port ? 3 : 2)) % NAME_IDEAS.length; SFX.ding(7); } }); }
    // keyboard
    panel(kx - 4, ky - 10, kw + 8, keyH * 4 + 36, 18, 'rgba(255,255,255,.7)', { lw: 2.5, shadow: false });
    const kw1 = (kw - 9 * 6) / 10; const kfs = clamp(keyH * 0.44, 18, 30);
    KB_ROWS.forEach((row, ri) => { const rw = row.length * kw1 + (row.length - 1) * 6 + (ri === 2 ? kw1 * 1.6 + 6 : 0); let x = kx + (kw - rw) / 2; const y = ky + ri * (keyH + 6);
      for (const ch of row) { this.kkey('k' + ch, x, y, kw1, keyH, ch, kfs, () => this.type(ch)); x += kw1 + 6; }
      if (ri === 2) this.kkey('kBack', x, y, kw1 * 1.6, keyH, '\u232b', kfs, () => this.back(), '#ffd6de'); });
    const y4 = ky + 3 * (keyH + 6); const dw = kw * 0.3; this.kkey('kSpace', kx, y4, kw - dw - 8, keyH, 'space', kfs * 0.8, () => this.type(' '));
    btn('kDone', kx + kw - dw, y4, dw, keyH, 'Done!', { col: '#6bd66b', fs: kfs * 0.9, fn: () => this.done() });
  },
  kkey(id, x, y, w, h, label, fs, fn, col = '#fff') { const p = isPressed(id) ? 2 : 0; g.fillStyle = 'rgba(59,39,65,.25)'; g.beginPath(); RR(x, y + 3, w, h - 1, 10); g.fill(); shape(() => RR(x, y + p, w, h - 3, 10), isPressed(id) ? '#ffe9a8' : col, 2.5); text(label, x + w / 2, y + p + h / 2 - 1, fs, INK, { fam: label.length > 1 ? F.ui : F.title, w: label.length > 1 ? 800 : 400, max: w - 6 }); hit(id, x, y, w, h, { fn, sfx: 0 }); } };
