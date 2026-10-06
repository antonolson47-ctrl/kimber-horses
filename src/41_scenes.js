/* ===================== SCENES: shared backdrop, title, parent corner, about, story ===================== */
function missingThreads() { const w = threadsWon(); return [0, 1, 2, 3, 4, 5, 6].filter(i => !w.includes(i)); }
// valley backdrop (static part cached); options: academy, night
function valleyBG(o = {}) { const W = VW, H = VH; const miss = o.full ? [] : (S.prog.ch.some(c => c.grand) || S.started ? missingThreads() : []);
  const key = 'bg' + W + 'x' + H + miss.join('') + (o.academy ? 'A' : '') + (o.gy || 0);
  const spr = sprite(key, W, H, () => {
    sky(W, H, '#8fd3ff', '#ffe9f4'); const sk = Math.min(W, H) / 600;
    sun(W * 0.82, H * 0.13, 30 * sk + 10);
    ribbon(-30, H * 0.26, W + 30, H * 0.17, 24 * sk + 6, 70 * sk + 20, { missing: miss, ghost: 0.14, sparkles: 14, seed: 3 });
    mountains(W, H * 0.5, '#c4b7f0', H, 3, sk * 1.3 + 0.3); mountains(W, H * 0.55, '#ab9be8', H, 5, sk + 0.3);
    hills(W, H * 0.6, '#b9e59a', 18 * sk + 4, 1, H); hills(W, H * 0.68, '#93d47a', 22 * sk + 4, 2.3, H);
    seed = 11; for (let i = 0; i < 9; i++) tree(R(0, W), H * 0.6 + R(4, 30), sk * R(0.5, 0.8) + 0.2, i % 2 ? '#5cbf6a' : '#4caf6a');
    if (o.academy) academy(W * (o.ax || 0.5), H * (o.ay || 0.66), Math.min(W / 1100, H / 900) * (o.as || 1));
    g.fillStyle = lin(0, H * 0.74, 0, H, [[0, '#7fcf6a'], [1, '#5fb85a']]); g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W + 10; x += 12) g.lineTo(x, H * 0.76 + Math.sin(x / 90) * 6); g.lineTo(W, H); g.fill();
    seed = 21; for (let i = 0; i < 30; i++) flower(R(0, W), H * 0.8 + R(0, H * 0.2), sk * 0.8 + 0.4, RIBBON[i % 7]);
  });
  blit(spr, 0, 0, W, H);
  for (let i = 0; i < 3; i++) { const sk = Math.min(W, H) / 600; const x = ((T * (8 + i * 4) + i * W / 2.3) % (W + 300)) - 150; cloud(x, H * (0.08 + i * 0.07), 0.6 * sk + 0.25, '#fff', 0.92); }
}
function logo(cx, cy, w) { const k = w / 520;
  g.save(); g.translate(cx, cy); g.scale(k, k);
  text('Kimber &', 0, -62, 54, '#fff', { fam: F.title, w: 400, stroke: '#7446c4', sw: 14 });
  const s = 'the Rainbow Ribbon'; font(78, F.title, 400); const tw = g.measureText(s).width; const sc = Math.min(1, 500 / tw);
  g.save(); g.scale(sc, sc); g.lineJoin = 'round'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 20; g.strokeStyle = INK; g.strokeText(s, 0, 16); g.lineWidth = 12; g.strokeStyle = '#fff'; g.strokeText(s, 0, 16);
  g.fillStyle = lin(-tw / 2, 0, tw / 2, 0, RIBBON.map((c, i) => [i / 6, c])); g.fillText(s, 0, 16); g.restore();
  text('Moonmeadow Riding Academy', 0, 78, 26, '#fff', { fam: F.ui, w: 800, stroke: '#7446c4', sw: 8 });
  g.restore(); }
/* ---------- title ---------- */
SC.title = { name: 'title',
  enter() { Music.play('title'); this.t = 0; },
  update(dt) { this.t += dt; },
  draw() { const L = lay(); valleyBG({ academy: true, ax: L.port ? 0.5 : 0.68, ay: 0.7, as: L.port ? 1.25 : 1.1 });
    const h = HORSE(); const port = L.port;
    // logo
    const lw = port ? Math.min(L.cw - 30, 560) : Math.min(L.cw * 0.48, 560); const lx = port ? VW / 2 : L.x0 + 20 + lw / 2; const ly = port ? L.y0 + lw * 0.27 + 14 : L.y0 + lw * 0.27 + 16;
    logo(lx, ly, lw); box('logo', lx - lw * 0.25, ly - lw * 0.17, lw * 0.5, lw * 0.1); box('logo2', lx - lw * 0.45, ly - lw * 0.06, lw * 0.9, lw * 0.23);
    // hero art: Kimber's horse + Kimber
    const hs = port ? Math.min(L.cw / 560, L.ch / 1300) : Math.min(L.cw / 1250, L.ch / 640); const gy = port ? VH * 0.76 : VH * 0.86; const hx = port ? VW * 0.56 : VW * 0.72;
    const bob = Math.sin(this.t * 2) * 2;
    if (h) drawHorseC(h, hx, gy, hs, { pose: 'proud' }); else drawHorse(hx, gy, hs, { pose: 'proud', coat: { b: 'chestnut', p: 'blanket', m: { star: 1 } }, outfit: outfitOf(null, { only: { saddle: 'S5', pad: 'B7', bridle: 'H8' } }) });
    drawKimber(hx - 175 * hs, gy + 4, hs * 1.05, { pose: 'wave', expr: 'happy' });
    if (h) { const nw = measure(h.name, 20 * L.u, F.title, 400) + 30; panel(hx - nw / 2 + 20 * hs, gy + 14 + bob * 0, nw, 34 * L.u, 17 * L.u, '#fff', { lw: 2.5 }); text(h.name, hx + 20 * hs, gy + 14 + 17 * L.u, 20 * L.u, '#7446c4', { fam: F.title, w: 400, max: nw - 16 }); }
    // buttons
    const bw = Math.min(port ? L.cw - 60 : L.cw * 0.4, 380), bh = clamp(66 * L.u, 62, 96); const bx = port ? VW / 2 - bw / 2 : lx - bw / 2; let by = port ? L.y1 - bh - 26 - bh * 0.75 : ly + lw * 0.3 + 20;
    if (!port) by = Math.min(by, L.y1 - bh * 2.1 - 20);
    btn('play', bx, by, bw, bh, S.started ? 'Let\u2019s Ride!' : 'Start the Adventure!', { col: '#ff6f91', fs: Math.min(bh * 0.4, 32), fn: () => { audioInit(); SFX.whinny('happy'); if (S.started) go(SC.map); else go(SC.story, { pages: ['p1', 'p2'], then: 'pickFirst' }); } });
    const sb = bh * 0.72, gap = 12; const sw2 = (bw - gap) / 2;
    btn('stableBtn', bx, by + bh + 12, sw2, sb, 'Stable', { col: '#2fa39a', disabled: !S.started, icon: (x, y, r) => icStable(x, y, r, '#fff'), fn: () => go(SC.stable) });
    btn('aboutBtn', bx + sw2 + gap, by + bh + 12, sw2, sb, 'About', { col: '#3f6fd8', icon: (x, y, r) => icInfo(x, y, r), fn: () => go(SC.about) });
    parentGateBtn(L);
    if (Voice.ok === false && !this.warned) { this.warned = 1; }
  } };
/* ---------- parent corner (3-second hold gate) ---------- */
let gateHold = 0;
function parentGateBtn(L, cx, cy) { const r = clamp(26 * L.u, 26, 36); cx = cx != null ? cx : L.x1 - r - 12; cy = cy != null ? cy : L.y0 + r + 12;
  gateHold = heldSecs('parentGate');
  ibtn('parentGate', cx, cy, r, (x, y, rr) => icGear(x, y, rr), { hold: true, ring: gateHold > 0 ? clamp(gateHold / 3, 0, 1) : null, label: 'Hold 3 sec', lfs: clamp(11 * L.u, 11, 14), lc: '#fff', lstroke: '#7446c4' });
  if (gateHold >= 3) { gateHold = 0; HELD.delete('parentGate'); Settings.open = true; SFX.chime(); } }
const Settings = { open: false, resetHold: 0, page: 'main' };
function settingsModal() { if (!Settings.open) return; const L = lay(); LAYER = 5; dim(0.5); backdropHit(null);
  const w = Math.min(L.cw - 24, 560), h = Math.min(L.ch - 24, 720), x = VW / 2 - w / 2, y = L.y0 + (L.ch - h) / 2;
  panel(x, y, w, h, 24, '#fff8f0', { lw: 3.5 });
  text('Parent Corner', x + 24, y + 34, 26, '#7446c4', { align: 'left', fam: F.title, w: 400, max: w - 110 });
  ibtn('setClose', x + w - 36, y + 34, 24, (cx, cy, r) => icClose(cx, cy, r, INK), { fn: () => { Settings.open = false; save(); } });
  const top = y + 66, ah = h - 66 - 14; const rowH = clamp(58 * L.u, 56, 70);
  const rows = [
    ['vol', 'Music', 'music'], ['vol', 'Sound effects', 'sfx'],
    ['tog', 'Read-aloud voice', 'voice'], ['tog', 'Read stories out loud automatically', 'autoRead'],
    ['tog', 'Helper hooves (jumps happen by themselves)', 'helper'], ['tog', 'Slower races', 'slow'], ['tog', 'Buttons on the other side (left-handed)', 'swap'],
    ['tog', 'Unlock all tack (to explore)', 'unlockAll'], ['tog', 'Open all lands', 'unlockLands'],
    ['info', 'About, credits & privacy'], ['reset', 'Start over (hold 3 seconds)'] ];
  const off = scrollArea('settings', x + 8, top, w - 16, ah, rows.length * rowH + 10);
  pushClip(x + 8, top, w - 16, ah);
  rows.forEach((r, i) => { const ry = top + i * rowH - off; if (ry > top + ah || ry + rowH < top) return; const fs = clamp(17 * L.u, 16, 20);
    if (i) strokeOnly(() => { g.moveTo(x + 20, ry); g.lineTo(x + w - 20, ry); }, 'rgba(59,39,65,.12)', 2);
    const cy = ry + rowH / 2;
    if (r[0] === 'vol') { text(r[1], x + 24, cy, fs, INK, { align: 'left', fam: F.ui, w: 800, max: w - 260 }); const v = S.set[r[2]]; const bx = x + w - 214;
      ibtn('vm_' + r[2], bx + 20, cy, 21, (cx2, cy2, rr) => strokeOnly(() => { g.moveTo(cx2 - rr * 0.6, cy2); g.lineTo(cx2 + rr * 0.6, cy2); }, INK, 4), { minHit: 46, fn: () => { S.set[r[2]] = Math.max(0, Math.round((v - 0.1) * 10) / 10); applyVol(); SFX.ding(2); save(); } });
      for (let k = 0; k < 10; k++) fillOnly(() => RR(bx + 48 + k * 11, cy - 4 - k * 1.3, 8, 8 + k * 2.6, 2), k < Math.round(v * 10) ? '#8a5cd6' : '#ddd');
      ibtn('vp_' + r[2], bx + 182, cy, 21, (cx2, cy2, rr) => strokeOnly(() => { g.moveTo(cx2 - rr * 0.6, cy2); g.lineTo(cx2 + rr * 0.6, cy2); g.moveTo(cx2, cy2 - rr * 0.6); g.lineTo(cx2, cy2 + rr * 0.6); }, INK, 4), { minHit: 46, fn: () => { S.set[r[2]] = Math.min(1, Math.round((v + 0.1) * 10) / 10); applyVol(); SFX.ding(5); save(); } }); }
    else if (r[0] === 'tog') { wrap(r[1], x + 24, cy - (wrapLines(r[1], w - 140, fs, F.ui, 800).length * fs * 1.15) / 2, w - 140, fs, INK, 1.15, { fam: F.ui, w: 800 }); const on = !!S.set[r[2]]; const tw = 62, th = 34, tx = x + w - tw - 24, ty = cy - th / 2;
      shape(() => RR(tx, ty, tw, th, th / 2), on ? '#6bd66b' : '#d6d0dc', 3); shape(() => C(on ? tx + tw - th / 2 : tx + th / 2, cy, th / 2 - 4), '#fff', 2.5);
      hit('tog_' + r[2], tx - 10, ry + 4, tw + 20, rowH - 8, { fn: () => { S.set[r[2]] = !on; if (r[2] === 'voice' && on) Voice.stop(); if (r[2] === 'voice' && !on) Voice.say('set', 'Read-aloud is on!'); save(); } }); }
    else if (r[0] === 'info') { btn('setAbout', x + 24, ry + 8, w - 48, rowH - 16, r[1], { col: '#3f6fd8', fs: fs, fn: () => { Settings.open = false; go(SC.about); } }); }
    else if (r[0] === 'reset') { Settings.resetHold = heldSecs('resetHold');
      btn('resetHold', x + 24, ry + 8, w - 48, rowH - 16, Settings.resetHold > 0 ? 'Keep holding\u2026 ' + Math.max(0, 3 - Settings.resetHold).toFixed(1) : r[1], { col: '#e8504a', fs: fs });
      const lh = LAST.find(q => q.id === 'resetHold'); const hh = HITS[HITS.length - 1]; if (hh && hh.id === 'resetHold') { hh.hold = true; hh.fn = null; }
      if (Settings.resetHold >= 3) { Settings.resetHold = 0; HELD.delete('resetHold'); const keep = S.set; S = freshSave(); S.set = keep; S.set.unlockAll = false; S.set.unlockLands = false; save(); Settings.open = false; applyKimColors(); toast('A fresh start!'); go(SC.title); } }
  });
  popClip(); scrollBar('settings', x + 8, top, w - 16, ah);
  LAYER = 0; }
/* ---------- about ---------- */
const ABOUT_TEXT = [
  ['Made for Kimber', 'Kimber & the Rainbow Ribbon was made just for Kimber, who loves horses (Appaloosas most of all!). The music is original, made by the game itself as you play.'],
  ['No ads. No purchases. No tracking.', 'This game never collects or sends any information. Progress is saved only on this device (in the browser\u2019s local storage). It works offline once it is loaded.'],
  ['Horse sounds', 'Horse whinnies (BigSoundBank #1541 and #1542), horse snort (#1543) and horse gallop (#0611) by Joseph Sardin, BigSoundBank.com. Released under CC0 (public domain). Thank you! If a sound can\u2019t play, the game makes its own horse sounds instead.'],
  ['Fonts', 'Lilita One, Fredoka, Andika and Baloo 2, under the SIL Open Font License.'],
  ['Read-aloud', 'Reading uses your device\u2019s own voice (the Web Speech API). Nothing is sent anywhere. You can turn it off in the Parent Corner.'],
  ['About the tack', 'The 43 Tack Room items are based on real riding traditions from around the world, with dates and places checked against museum collections and riding schools (for example the Smithsonian, the V&A, the State Hermitage Museum, Topkapı Palace and the Spanish Riding School). The five Academy items are pretend, made for this story.'],
  ['With respect', 'The Navajo-style blanket honors Diné (Navajo) weavers, and the Plateau-style beaded pieces honor Nimíipuu (Nez Perce) artists, the people who first bred the Appaloosa. Their simple patterns are inspired by museum pieces and do not copy any weaver\u2019s or family\u2019s design.'],
  ['Parents', 'Hold the gear button for 3 seconds to open the Parent Corner: volume, read-aloud, helper hooves, slower races, left-handed buttons, unlock everything, or start over.'],
];
SC.about = { name: 'about', enter() { scrollTo('about', 0); },
  draw() { const L = lay(); g.fillStyle = lin(0, 0, 0, VH, [[0, '#f3ecff'], [1, '#ffeef5']]); g.fillRect(0, 0, VW, VH);
    const tb = topBar('About', () => go(S.started ? SC.map : SC.title));
    const w = Math.min(L.cw - 28, 720), x = VW / 2 - w / 2, top = tb + 10, ah = L.y1 - top - 6; const fs = clamp(17 * L.u, 16, 21);
    let total = 20; const blocks = ABOUT_TEXT.map(([h, t]) => { const lines = wrapLines(t, w - 44, fs, F.body, 400); const bh = 52 + lines.length * fs * 1.35 + 14; total += bh + 14; return { h, lines, bh }; });
    total += 120;
    const off = scrollArea('about', 0, top, VW, ah, total); pushClip(0, top, VW, ah); let y = top + 14 - off;
    for (const b of blocks) { if (y + b.bh > top - 10 && y < top + ah + 10) { panel(x, y, w, b.bh, 18, '#fff', { lw: 2.5 }); text(b.h, x + 22, y + 28, fs * 1.15, '#7446c4', { align: 'left', fam: F.title, w: 400, max: w - 44 }); g.textAlign = 'left'; g.textBaseline = 'top'; font(fs, F.body, 400); g.fillStyle = INK; b.lines.forEach((l, i) => g.fillText(l, x + 22, y + 50 + i * fs * 1.35)); } y += b.bh + 14; }
    whirligig(VW / 2, y + 100, 0.7, { flags: 1 });
    popClip(); scrollBar('about', 0, top, VW - 4, ah); } };
/* ---------- story pages ---------- */
function storyArt(key, x, y, w, h, land, t) {
  g.save(); g.beginPath(); RR(x, y, w, h, 20); g.clip();
  const k = Math.min(w / 700, h / 520); const gy = y + h * 0.84;
  const bg = (top, bot, ground) => { g.fillStyle = lin(0, y, 0, y + h, [[0, top], [1, bot]]); g.fillRect(x, y, w, h); if (ground) { g.fillStyle = ground; g.fillRect(x, gy - 6 * k, w, h); } };
  const won = threadsWon(); const miss = [0, 1, 2, 3, 4, 5, 6].filter(i => !won.includes(i));
  if (key === 'arrive') { bg('#8fd3ff', '#ffe9f4'); ribbon(x - 20, y + h * 0.18, x + w + 20, y + h * 0.12, 16 * k, 60 * k, { sparkles: 10 }); hills(w + x, y + h * 0.62, '#b9e59a', 14 * k, 1, y + h); academy(x + w * 0.62, y + h * 0.8, 0.62 * k); g.fillStyle = '#93d47a'; g.fillRect(x, y + h * 0.8, w, h);
    drawKari(x + w * 0.22, gy, 0.72 * k, { pose: 'basket' }); drawKimber(x + w * 0.36, gy, 0.72 * k, { pose: 'wave' }); }
  else if (key === 'stable') { bg('#f3d3a6', '#e2b57f', '#c98f5a'); for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(150,90,50,.25)'; g.fillRect(x + i * w / 6, y, 3, h); }
    shape(() => RR(x + w * 0.1, y + h * 0.18, w * 0.8, h * 0.06, 6), '#8a5a3a', 3);
    drawHorse(x + w * 0.58, gy, 0.95 * k, { pose: 'munch', coat: { b: 'chestnut', p: 'blanket', m: { star: 1 } }, expr: 'closed' }); drawKimber(x + w * 0.3, gy, 0.85 * k, { pose: 'cheer' }); heartsDraw(x + w * 0.45, y + h * 0.3, k, t); }
  else if (key === 'scatter') { bg('#9fb5e8', '#e8dcef'); const fl = clamp(t / 2, 0, 1);
    for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + t * 0.6; const r = (60 + fl * 220) * k; const cx = x + w * 0.5 + Math.cos(a) * r, cy = y + h * 0.35 + Math.sin(a) * r * 0.5; const tr = () => { g.moveTo(x + w * 0.5, y + h * 0.35); g.quadraticCurveTo((x + w * 0.5 + cx) / 2 + 30 * k, (y + h * 0.35 + cy) / 2 - 40 * k, cx, cy); }; strokeOnly(tr, INK, 9 * k); strokeOnly(tr, RIBBON[i], 5.5 * k); sparkle(cx, cy, 7 * k); }
    hills(w + x, y + h * 0.72, '#b9c9a8', 12 * k, 1, y + h); whirligig(x + w * 0.5, y + h * 0.55, 1.1 * k, { t }); fadeColors(0.25 + fl * 0.3); }
  else if (key === 'hug') { bg('#ffe1ec', '#fff5e0', '#a8dc8f'); drawHorse(x + w * 0.72, gy, 0.8 * k, { pose: 'munch', coat: HORSE() ? horseCoat(HORSE()) : undefined, outfit: HORSE() ? outfitOf(HORSE()) : undefined }); apple(x + w * 0.86, gy - 30 * k, 10 * k); drawHug(x + w * 0.3, gy, 0.85 * k); heartsDraw(x + w * 0.3, y + h * 0.2, k, t); cake(x + w * 0.52, gy - 10 * k, 22 * k); }
  else if (key === 'land') { landVignette(land, x, y, w, h, k, t, landFaded(land)); }
  else if (key === 'cry' || key === 'invite') { bg('#c9b8ff', '#ffe9f4'); cloudCastle(x + w * 0.75, y + h * 0.62, 1.4 * k); cloud(x + w * 0.2, y + h * 0.9, 2.5 * k); cloud(x + w * 0.7, y + h * 0.95, 3 * k);
    const h0 = HORSE(); drawHorse(x + w * 0.3, gy, 0.75 * k, { pose: 'stand', coat: h0 ? horseCoat(h0) : undefined, outfit: h0 ? outfitOf(h0, { rider: true }) : undefined });
    whirligig(x + w * 0.66, gy - 10 * k, 1.0 * k, { t, sad: key === 'cry', flags: key === 'invite' }); if (key === 'invite') heartsDraw(x + w * 0.5, y + h * 0.25, k, t); }
  else if (key === 'weave') { bg('#8fd3ff', '#ffe9f4'); const p = clamp(t / 3, 0, 1); ribbon(x - 20, y + h * 0.3, x + w + 20, y + h * 0.2, 22 * k, 90 * k, { missing: [0, 1, 2, 3, 4, 5, 6].filter(i => i >= Math.floor(p * 7.99)), ghost: 0.15, sparkles: 20 });
    hills(w + x, y + h * 0.7, '#a8dc8f', 14 * k, 2, y + h); whirligig(x + w * 0.7, y + h * 0.62, 0.8 * k, { t }); const h0 = HORSE(); drawHorse(x + w * 0.3, gy, 0.7 * k, { pose: 'proud', coat: h0 ? horseCoat(h0) : undefined, outfit: h0 ? outfitOf(h0, { rider: true }) : undefined }); }
  else if (key === 'paradeIntro') { bg('#8fd3ff', '#ffe9f4', '#93d47a'); ribbon(x - 20, y + h * 0.18, x + w + 20, y + h * 0.1, 16 * k, 60 * k, { sparkles: 16 }); const h0 = HORSE();
    drawHorse(x + w * 0.45, gy, 0.8 * k, { pose: prancePose(t * 0.8), coat: h0 ? horseCoat(h0) : undefined, outfit: h0 ? outfitOf(h0, { rider: true }) : undefined }); drawKari(x + w * 0.85, gy, 0.7 * k, { pose: 'open' }); whirligig(x + w * 0.14, y + h * 0.42, 0.7 * k, { t, flags: 1 }); }
  g.restore(); strokeOnly(() => RR(x, y, w, h, 20), INK, 3.5); }
function heartsDraw(cx, cy, k, t) { for (let i = 0; i < 4; i++) { const p = (t * 0.6 + i / 4) % 1; g.save(); g.globalAlpha = 1 - p; shape(() => heart(cx + Math.sin(i * 2 + t) * 30 * k, cy - p * 60 * k + 40 * k, (10 + i * 2) * k), ['#ff6f91', '#ff9ab5'][i % 2], 2); g.restore(); } }
function landVignette(l, x, y, w, h, k, t, faded) { const sp = landSpr(l, Math.round(w), Math.round(h), faded); blit(sp, x, y, w, h); const th = LANDS[l].thread;
  if (th >= 0 && !threadsWon().includes(th)) { const cx = x + w * 0.62, cy = y + h * 0.38; const tr = () => { g.moveTo(cx - 70 * k, cy + 20 * k); g.bezierCurveTo(cx - 20 * k, cy - 50 * k + Math.sin(t * 2) * 10, cx + 20 * k, cy + 50 * k, cx + 70 * k, cy - 10 * k); }; g.save(); g.shadowColor = RIBBON[th]; g.shadowBlur = 20; strokeOnly(tr, INK, 12 * k); strokeOnly(tr, RIBBON[th], 7 * k); g.restore(); sparkle(cx + 70 * k, cy - 10 * k, 10 * k); sparkle(cx - 70 * k, cy + 20 * k, 8 * k); } }
const STORY_MUSIC = 'story';
SC.story = { name: 'story',
  enter(a) { this.a = a; this.i = 0; this.t = 0; Music.play(STORY_MUSIC); this.read(); },
  page() { return STORY[this.a.pages[this.i]]; },
  read() { this.t = 0; if (S.set.autoRead && S.set.voice) setTimeout(() => { if (scene === this) Voice.say('story', this.page().t); }, 350); },
  next() { if (this.i < this.a.pages.length - 1) { this.i++; SFX.ui(); Voice.stop(); this.read(); return; } Voice.stop(); storyThen(this.a.then); },
  prev() { if (this.i > 0) { this.i--; Voice.stop(); this.read(); } },
  update(dt) { this.t += dt; },
  key(k) { if (k === 'ArrowRight' || k === 'Enter' || k === ' ') this.next(); if (k === 'ArrowLeft') this.prev(); },
  draw() { const L = lay(); g.fillStyle = lin(0, 0, 0, VH, [[0, '#7446c4'], [1, '#b07bff']]); g.fillRect(0, 0, VW, VH);
    seed = 5; for (let i = 0; i < 40; i++) { const sx = R(0, VW), sy = R(0, VH); sparkle(sx, sy, R(2, 5) * (0.6 + 0.4 * Math.sin(T * 2 + i)), 'rgba(255,255,255,.7)'); }
    const p = this.page(); const pad = 14 * L.u; const fs = clamp(21 * L.u, 19, 30); const bh = clamp(60 * L.u, 58, 84);
    let ax, ay, aw, ah, tx, ty, tw, th;
    if (L.port) { aw = L.cw - pad * 2; ax = L.x0 + pad; ay = L.y0 + pad; const lines = wrapLines(p.t, aw - 40, fs, F.body, 700).length; th = lines * fs * 1.38 + 40 + 56 * L.u; ah = Math.min(aw * 0.95, L.ch - th - bh - pad * 4); tx = ax; tw = aw; ty = ay + ah + pad; }
    else { ah = L.ch - pad * 2 - bh - pad; aw = Math.min(ah * 1.35, L.cw * 0.58); ax = L.x0 + pad; ay = L.y0 + pad; tx = ax + aw + pad; tw = L.x1 - pad - tx; ty = ay; th = ah; }
    storyArt(p.art, ax, ay, aw, ah, p.land, this.t);
    if (L.port) th = Math.min(th, L.y1 - bh - pad * 2 - ty);
    panel(tx, ty, tw, th, 20, '#fffaf2', { lw: 3 });
    const sr = clamp(24 * L.u, 24, 34); speakBtn('storySpeak', tx + tw - sr - 10, ty + sr + 10, sr, () => p.t, { minHit: 56 });
    const lines = wrapLines(p.t, tw - 40 - (L.port ? 0 : 0), fs, F.body, 700); const lh = fs * 1.38; const textTop = ty + sr * 2 + 20; box('storyText', tx + 4, textTop - 4, tw - 8, th - (textTop - ty)); const visible = Math.max(1, Math.floor((th - (textTop - ty) - 10) / lh));
    let fs2 = fs, ll = lines; if (lines.length > visible) { fs2 = fs * Math.sqrt(visible / lines.length) * 0.98; ll = wrapLines(p.t, tw - 40, fs2, F.body, 700); }
    const sent = Voice.speaking === 'story' ? Voice.idx : -1;
    g.textAlign = 'left'; g.textBaseline = 'top'; font(fs2, F.body, 700); ll.forEach((l, i) => { g.fillStyle = INK; g.fillText(l, tx + 20, textTop + i * fs2 * 1.38); });
    // dots + nav
    const n = this.a.pages.length, by = L.y1 - bh - pad; for (let i = 0; i < n; i++) shape(() => C(VW / 2 + (i - (n - 1) / 2) * 22, by - 14, 6), i === this.i ? '#ffd93d' : 'rgba(255,255,255,.5)', 2);
    const nw = Math.min(260, L.cw * 0.45);
    if (this.i > 0) btn('storyBack', L.x0 + pad, by, Math.min(140, L.cw * 0.28), bh, 'Back', { col: '#9b8ab8', fn: () => this.prev() });
    btn('storyNext', L.x1 - pad - nw, by, nw, bh, this.i < n - 1 ? 'Next' : (this.a.lastLabel || 'Let\u2019s go!'), { col: '#ff6f91', fn: () => this.next() });
  } };
function storyThen(t) {
  if (t === 'pickFirst') { go(SC.coat, { first: true }); return; }
  if (t === 'prologueRace') { go(SC.treat, { l: 0, r: 0 }); return; }
  if (t === 'map') { go(SC.map); return; }
  if (t === 'parade') { go(SC.parade); return; }
  go(SC.map);
}
