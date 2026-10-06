/* ===================== FINALE: the Midsummer Grand Parade ===================== */
SC.parade = { name: 'parade',
  enter() { this.t = 0; this.x = 0; this.bursts = []; this.nextBurst = 0.5; this.trophy = false; S.prog.finale = true; if (!S.rosettes.includes(8)) S.rosettes.push(8); save(); Music.play('parade'); SFX.whinny('victory'); this.prepared = ''; this.prepare(); AUD_LOG('parade'); },
  prepare() { const key = VW + 'x' + VH + DPR + outfitKey(HORSE(), { rider: true }) + S.horses.length; if (this.prepared === key) return; this.prepared = key; const L = lay();
    this.hs = L.port ? clamp(Math.min(VW / 780, VH / 1500), 0.32, 0.8) : clamp(Math.min(VH / 1000, VW / 1500), 0.3, 0.8); this.gy = Math.round(L.port ? VH * 0.62 : VH * 0.8); if (!L.port) { const bh = clamp(60 * L.u, 56, 80); this.gy = Math.round(Math.min(VH * 0.8, L.y1 - bh - 18 - 26 * this.hs)); const tB = L.y0 + 144 * Math.min(L.u, 1.3); this.hs = Math.max(0.2, Math.min(this.hs, (this.gy - tB - 6) / 350)); }
    const h = HORSE(), s = this.hs; this.frames = []; for (let i = 0; i < 8; i++) this.frames.push(horseSpr(h, prancePose(i / 8), s, { rider: true, poseKey: 'pr' + i }));
    this.follow = S.horses.filter((_, i) => i !== S.cur).slice(0, 3).map(fh => { const fr = []; for (let i = 0; i < 8; i++) fr.push(horseSpr(fh, prancePose(i / 8), s * 0.8, { poseKey: 'pr' + i })); return { h: fh, fr }; });
    const W = Math.max(VW, 800), H = VH; this.TW = W; this.farT = sprite('far0x' + W + 'x' + H + 'g' + this.gy, W, H, () => landFar(0, W, H, this.gy - 40 * s)); this.midT = sprite('pmid' + W + 'x' + H + 'g' + this.gy, W, H, () => { landProps(0, W, this.gy - 14 * s, s * 0.9, 0); }); },
  update(dt) { this.prepare(); this.t += dt; const moving = this.t < 9; if (moving) this.x += dt * 260; this.cyc = (this.cyc || 0) + dt * (moving ? 0.9 : 0.5);
    if (this.t > 9 && !this.trophy) { this.trophy = true; SFX.fanfare(); SFX.chime(); confetti(VW / 2, VH * 0.3, 120, 1.3); setTimeout(() => SFX.whinny('victory'), 600); Voice.say('finale', 'Kimber saved Moonmeadow! Hooray for Kimber and ' + (HORSE() ? HORSE().name : 'her horse') + '!'); }
    this.nextBurst -= dt; if (this.nextBurst <= 0) { this.nextBurst = this.t > 9 ? 0.45 : 0.9; this.bursts.push({ x: VW * (0.15 + Math.random() * 0.7), y: VH * (0.1 + Math.random() * 0.25), t: 0, c: RIBBON[Math.floor(Math.random() * 7)], n: 14 + Math.floor(Math.random() * 8) }); SFX.pop(); }
    for (const b of this.bursts) b.t += dt; this.bursts = this.bursts.filter(b => b.t < 1.6);
    if (Math.random() < dt * 1.5) confetti(Math.random() * VW, -10, 12, 0.4); },
  photo() { const h = HORSE(); savePhoto((c, W, H) => { g.fillStyle = lin(0, 0, 0, H, [[0, '#8fd3ff'], [1, '#ffe9f4']]); g.fillRect(0, 0, W, H); ribbon(-20, H * 0.2, W + 20, H * 0.14, 20, 90, { sparkles: 20 }); hills(W, H * 0.66, '#a8dc8f', 16, 1, H); g.fillStyle = '#7fcf6a'; g.fillRect(0, H * 0.8, W, H);
    drawHorse(W * 0.45, H * 0.86, W / 1500, { pose: prancePose(0.2), coat: horseCoat(h), outfit: outfitOf(h, { rider: true }) }); drawKari(W * 0.82, H * 0.86, W / 1500, { pose: 'open' }); whirligig(W * 0.15, H * 0.42, W / 1300, { flags: 1, t: 1 }); trophy(W * 0.66, H * 0.86, W / 700);
    bannerRibbon(W / 2, H * 0.08, W * 0.7, H * 0.08, '#ff6f91', 'Kimber saved Moonmeadow!', H * 0.045); }, 'Kimber-Grand-Parade.png'); },
  foreground(L, s, gy) { const top = gy + 52 * s, bot = VH; if (bot - top < 70) return; const sp = 190 * s; const wx = this.x * s * 1.15; const first = Math.floor(wx / sp) - 1; const fy = top + Math.min((bot - top) * 0.3, 110 * s + 24);
    // white fence with rainbow rosettes on every post
    const rail = (yy) => shape(() => RR(-10, yy, VW + 20, 9 * s + 2, 3), '#ffffff', 2); rail(fy - 30 * s); rail(fy);
    for (let i = first; i < first + VW / sp + 3; i++) { const x = i * sp - wx; shape(() => RR(x - 8 * s - 1, fy - 58 * s, 16 * s + 2, 80 * s, 4), '#ffffff', 2.2); g.save(); g.translate(x, fy - 64 * s); rosetteIcon(0, 0, 20 * s + 4, RIBBON[((i % 7) + 7) % 7], ''); g.restore(); }
    // flower beds in front
    const fsp = 64 * s; const ff = Math.floor(wx / fsp) - 1; for (let i = ff; i < ff + VW / fsp + 3; i++) { const x = i * fsp - wx + ((i * 37) % 23) * s; const yy = fy + 44 * s + ((((i * 13) % 5) + 5) % 5) * 9 * s; if (yy < bot - 4) flower(x, yy, s * 2.2 + 0.4, RIBBON[((i * 3) % 7 + 7) % 7]); } },
  draw() { const L = lay(), u = L.u, s = this.hs, gy = this.gy; this.prepare();
    g.fillStyle = lin(0, 0, 0, gy, [[0, '#8fd3ff'], [1, '#ffe9f4']]); g.fillRect(0, 0, VW, VH); sun(VW * 0.85, gy * 0.14, 20 * s + 10);
    ribbon(-20, gy * 0.22, VW + 20, gy * 0.13, 16, 70 * s + 26, { sparkles: 18, ph: T * 0.5, seed: 8 });
    const W = this.TW; const f1 = ((this.x * s * 0.12) % W + W) % W; blit(this.farT, -f1, 0, W, VH); blit(this.farT, W - f1, 0, W, VH); const f2 = ((this.x * s * 0.45) % W + W) % W; blit(this.midT, -f2, 0, W, VH); blit(this.midT, W - f2, 0, W, VH);
    g.fillStyle = lin(0, gy, 0, VH, [[0, '#7fcf6a'], [1, '#5fb85a']]); g.fillRect(0, gy - 4, VW, VH); g.fillStyle = '#f2d4a0'; g.fillRect(0, gy + 6 * s, VW, 40 * s);
    // rose petals on the path
    const step = 90; const first = Math.floor(this.x / step) - 1; for (let i = first; i < first + VW / s / step + 3; i++) { const x = (i * step - this.x) * s + ((i * 31) % 50) * s; fillOnly(() => E(x, gy + 20 * s + ((i * 7) % 4) * 6 * s, 6 * s + 1, 3 * s + 1, i), ['#ff8fb1', '#ffd93d', '#ffffff'][i % 3]); }
    // bunting
    for (let row = 0; row < 2; row++) { const y0 = L.y0 + 12 + row * 34 * u; const n = Math.ceil(VW / 40) + 1; strokeOnly(() => { g.moveTo(0, y0); g.quadraticCurveTo(VW / 2, y0 + 30 * u, VW, y0); }, INK, 2); for (let i = 0; i < n; i++) { const x = i * 40 + (row ? 20 : 0); const t2 = x / VW; const yy = y0 + 4 * t2 * (1 - t2) * 30 * u; shape(() => { g.moveTo(x - 12, yy); g.lineTo(x + 12, yy); g.lineTo(x, yy + 24); g.closePath(); }, RIBBON[(i + row * 3) % 7], 2); } }
    // fireworks
    for (const b of this.bursts) { const p = easeOut(b.t / 1.2); g.save(); g.globalAlpha = clamp(1.6 - b.t, 0, 1); for (let i = 0; i < b.n; i++) { const a = i * TAU / b.n; const r = p * 80 * Math.min(u, 1.5); strokeOnly(() => { g.moveTo(b.x + Math.cos(a) * r * 0.6, b.y + Math.sin(a) * r * 0.6 + b.t * 20); g.lineTo(b.x + Math.cos(a) * r, b.y + Math.sin(a) * r + b.t * 20); }, b.c, 4); sparkle(b.x + Math.cos(a) * r, b.y + Math.sin(a) * r + b.t * 20, 4, '#fff'); } g.restore(); }
    // hot-air balloons drifting in the sky (portrait has lots of sky)
    if (L.port) { const by0 = L.y0 + 150 * Math.min(u, 1.3); const span = gy - 360 * s - by0; if (span > 60) for (let i = 0; i < 3; i++) { const bx = ((i * 0.37 + 0.12) * VW - this.x * s * 0.05 * (1 + i * 0.3)) % (VW + 80); balloon(bx < -40 ? bx + VW + 80 : bx, by0 + span * (0.3 + 0.35 * ((i * 2) % 3) / 2), (0.9 + i * 0.15) * Math.min(u, 1.4), RIBBON[(i * 2 + 1) % 7], T + i); } }
    // procession
    const hx = L.port ? VW * 0.56 : VW * 0.5; const fi = Math.floor(this.cyc * 8) % 8;
    this.follow.forEach((f, i) => { const x = hx - (260 + i * 220) * s; if (x > -200 * s) blit(f.fr[(fi + i * 3) % 8], x - 190 * s * 0.8, gy - 350 * s * 0.8 - 6 * s, 380 * s * 0.8, 374 * s * 0.8); });
    blit(this.frames[fi], hx - 190 * s, gy - 350 * s, 380 * s, 374 * s);
    const titleB = L.y0 + 110 * Math.min(u, 1.3) + 34 * Math.min(u, 1.3); const wy = Math.max(titleB + 70 * s, gy - 470 * s); whirligig(hx + (wy > gy - 470 * s + 1 ? 200 : 40) * s, wy + Math.sin(T * 2) * 12 * s, s * 0.95, { flags: 1 });
    // Mom cheering at the side
    const kx = this.t < 9 ? VW + 120 * s - this.t * 260 * s * 0.5 : VW - (L.port ? 70 : 120) * s - L.x1 * 0 ; const momX = Math.max(hx + 230 * s, Math.min(L.x1 - 70 * s, kx)); drawKari(momX, gy + 30 * s, s * 0.85, { pose: 'open' }); if (Math.sin(T * 6) > 0.6) heartsUp(momX, gy - 200 * s, 1);
    this.foreground(L, s, gy);
    if (this.trophy) { const p = clamp((this.t - 9) / 0.7, 0, 1); const tx = hx - 250 * s, ty = gy + 20 * s; shape(() => RR(tx - 60 * s, ty - 40 * s, 120 * s, 40 * s, 6), '#b07bff', 3); g.save(); g.translate(tx, ty - 40 * s); g.scale(easeBack(p), easeBack(p)); trophy(0, 0, s * 1.2); g.restore();
      g.save(); g.translate(VW / 2, L.y0 + 110 * Math.min(u, 1.3)); g.scale(easeBack(p), easeBack(p)); bannerRibbon(0, 0, Math.min(L.cw - 90, 520), 62 * Math.min(u, 1.3), '#ff6f91', 'Kimber saved Moonmeadow!', 30 * Math.min(u, 1.3)); g.restore(); box('finaleBanner', VW / 2 - Math.min(L.cw - 90, 520) / 2, L.y0 + 110 * Math.min(u, 1.3) - 31 * Math.min(u, 1.3), Math.min(L.cw - 90, 520), 62 * Math.min(u, 1.3)); }
    else text('The Midsummer Grand Parade!', VW / 2, L.y0 + 110 * Math.min(u, 1.3), 28 * Math.min(u, 1.3), '#fff', { fam: F.title, w: 400, stroke: '#7446c4', sw: 8, max: L.cw - 30 });
    if (this.t > 10.5) { const bh = clamp(60 * u, 56, 80); const bw = Math.min((L.cw - 48) / 3, 220); const y = L.y1 - bh - 12; const x0 = VW / 2 - (bw * 3 + 24) / 2;
      btn('pPhoto', x0, y, bw, bh, 'Photo', { col: '#3f6fd8', icon: (x, y2, r) => icCamera(x, y2, r, '#fff'), fn: () => this.photo() });
      btn('pAgain', x0 + bw + 12, y, bw, bh, 'Again!', { col: '#ff6f91', fn: () => go(SC.parade, null, true) });
      btn('pDone', x0 + (bw + 12) * 2, y, bw, bh, 'Ride more', { col: '#6bd66b', fn: () => go(SC.map) }); }
  } };
