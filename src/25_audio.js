/* ===================== AUDIO: CC0 horse clips + synthesized backups, original procedural music, read-aloud ===================== */
let AC = null, BUS = {}, NZ = null, CLIP = {};
const AUD = { counts: {}, log: [] };
function AUD_LOG(n) { AUD.counts[n] = (AUD.counts[n] || 0) + 1; AUD.log.push(n); if (AUD.log.length > 300) AUD.log.shift(); }
const aNow = () => AC ? AC.currentTime : 0;
function audioOK() { return AC && AC.state === 'running'; }
function mkNoise(c) { const len = c.sampleRate * 2, b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; return b; }
function b64buf(s) { const bin = atob(s), n = bin.length, u = new Uint8Array(n); for (let i = 0; i < n; i++) u[i] = bin.charCodeAt(i); return u.buffer; }
function audioInit() {
  if (!AC) { try { const Ctor = window.AudioContext || window.webkitAudioContext; if (!Ctor) return; AC = new Ctor(); buildGraph(); AUD_LOG('audioInit');
      try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { }
      for (const k in CLIPS_B64) { try { const p = AC.decodeAudioData(b64buf(CLIPS_B64[k]), b => { CLIP[k] = b; }, () => { }); if (p && p.catch) p.catch(() => { }); } catch (e) { } }
    } catch (e) { AC = null; return; } }
  if (AC.state === 'suspended' || AC.state === 'interrupted') { try { const p = AC.resume(); if (p && p.catch) p.catch(() => { }); } catch (e) { } }
  if (!AUD.unlocked) { try { const b = AC.createBuffer(1, 1, 22050), s = AC.createBufferSource(); s.buffer = b; s.connect(AC.destination); s.start(0); AUD.unlocked = true; } catch (e) { } }
}
function buildGraph() { const c = AC, B = {};
  B.master = c.createGain(); B.lim = c.createDynamicsCompressor(); B.lim.threshold.value = -8; B.lim.ratio.value = 6; B.master.connect(B.lim); B.lim.connect(c.destination);
  B.sfx = c.createGain(); B.sfx.connect(B.master); B.music = c.createGain(); B.music.connect(B.master); B.duck = c.createGain(); B.duck.connect(B.music);
  B.verb = c.createConvolver(); const n = Math.floor(c.sampleRate * 1.6), ir = c.createBuffer(2, n, c.sampleRate); for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3); } B.verb.buffer = ir; B.verbOut = c.createGain(); B.verbOut.gain.value = 0.18; B.verb.connect(B.verbOut); B.verbOut.connect(B.master);
  B.mverb = c.createGain(); B.mverb.gain.value = 0.35; B.duck.connect(B.mverb); B.mverb.connect(B.verb);
  BUS = B; NZ = mkNoise(c); applyVol(); }
function applyVol() { if (!AC) return; const t = AC.currentTime; BUS.sfx.gain.setTargetAtTime(S.set.sfx, t, 0.02); BUS.music.gain.setTargetAtTime(S.set.music * 0.42, t, 0.05); BUS.master.gain.setTargetAtTime(0.9, t, 0.02); }
function duckMusic(on) { if (!AC) return; BUS.duck.gain.setTargetAtTime(on ? 0.35 : 1, AC.currentTime, 0.12); }
function env(gn, t, a, peak, d) { const p = gn.gain; p.setValueAtTime(0.0001, t); p.linearRampToValueAtTime(peak, t + a); p.exponentialRampToValueAtTime(0.0001, t + a + d); }
function osc(t, type, f, dur, gain, out, o = {}) { const ot = AC.createOscillator(), gn = AC.createGain(); ot.type = type; ot.frequency.setValueAtTime(f, t); if (o.f2) ot.frequency.exponentialRampToValueAtTime(o.f2, t + (o.ft || dur)); if (o.det) ot.detune.value = o.det;
  let node = ot; if (o.lp) { const fl = AC.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.setValueAtTime(o.lp, t); if (o.lp2) fl.frequency.exponentialRampToValueAtTime(o.lp2, t + dur * 0.6); fl.Q.value = o.q || 0.8; ot.connect(fl); node = fl; }
  if (o.vib) { const v = AC.createOscillator(), vg = AC.createGain(); v.frequency.value = o.vib; vg.gain.value = f * (o.vd || 0.012); v.connect(vg); vg.connect(ot.frequency); v.start(t); v.stop(t + dur + (o.a || 0.005) + 0.1); }
  env(gn, t, o.a || 0.005, gain, dur); node.connect(gn); gn.connect(out); ot.start(t); ot.stop(t + dur + (o.a || 0.005) + 0.1); return gn; }
function noise(t, ftype, f, q, dur, gain, out, o = {}) { const s = AC.createBufferSource(); s.buffer = NZ; const fl = AC.createBiquadFilter(); fl.type = ftype; fl.frequency.setValueAtTime(f, t); if (o.f2) fl.frequency.exponentialRampToValueAtTime(o.f2, t + dur); fl.Q.value = q; const gn = AC.createGain(); env(gn, t, o.a || 0.002, gain, dur); s.connect(fl); fl.connect(gn); gn.connect(out); s.start(t, Math.random() * 1.5); s.stop(t + dur + 0.1); }
function playClip(k, rate = 1, gain = 1) { if (!CLIP[k]) return false; const s = AC.createBufferSource(); s.buffer = CLIP[k]; s.playbackRate.value = rate; const gn = AC.createGain(); gn.gain.value = gain; s.connect(gn); gn.connect(BUS.sfx); gn.connect(BUS.verb); s.start(); return true; }
// synthesized whinny backup: formant-filtered saw, pitch rises then trills down
function synthWhinny(t, k = 1) { const o = AC.createOscillator(); o.type = 'sawtooth'; const f0 = 520 * k; o.frequency.setValueAtTime(f0 * 0.7, t); o.frequency.linearRampToValueAtTime(f0 * 1.5, t + 0.18); o.frequency.linearRampToValueAtTime(f0 * 1.25, t + 0.5); o.frequency.exponentialRampToValueAtTime(f0 * 0.55, t + 1.1);
  const tr = AC.createOscillator(), tg = AC.createGain(); tr.frequency.value = 22; tg.gain.setValueAtTime(0, t); tg.gain.linearRampToValueAtTime(f0 * 0.12, t + 0.3); tr.connect(tg); tg.connect(o.frequency);
  const gn = AC.createGain(); gn.gain.setValueAtTime(0.0001, t); gn.gain.linearRampToValueAtTime(0.32, t + 0.06); gn.gain.setValueAtTime(0.28, t + 0.8); gn.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
  for (const [f, q, kk] of [[900, 5, 1], [1700, 7, 0.6], [2900, 8, 0.3]]) { const b = AC.createBiquadFilter(); b.type = 'bandpass'; b.frequency.value = f * k; b.Q.value = q; const kg = AC.createGain(); kg.gain.value = kk * 2.5; o.connect(b); b.connect(kg); kg.connect(gn); }
  gn.connect(BUS.sfx); gn.connect(BUS.verb); o.start(t); tr.start(t); o.stop(t + 1.3); tr.stop(t + 1.3); noise(t, 'bandpass', 1400, 1, 0.9, 0.05, BUS.sfx); }
const SFX = {
  whinny(kind = 'charge') { AUD_LOG('whinny_' + kind); if (!audioOK()) return; const t = aNow(); duckMusic(true); setTimeout(() => duckMusic(false), 1400);
    const ok = kind === 'victory' ? playClip('neighB', 1, 1) : kind === 'happy' ? playClip('neighA', 1.12, 0.8) : playClip('neighA', 1, 1);
    if (!ok) synthWhinny(t, kind === 'happy' ? 1.15 : kind === 'victory' ? 0.95 : 1); else AUD_LOG('clip_' + kind); },
  gallopBurst() { AUD_LOG('gallopBurst'); if (!audioOK()) return; if (!playClip('gallop', 1, 0.9)) for (let i = 0; i < 8; i++) SFX.hoof(aNow() + i * 0.11); },
  hoof(t) { if (!audioOK()) return; t = t || aNow(); osc(t, 'sine', 140, 0.08, 0.22, BUS.sfx, { f2: 60 }); noise(t, 'lowpass', 900, 0.7, 0.05, 0.12, BUS.sfx); },
  nicker() { AUD_LOG('nicker'); if (!audioOK()) return; if (playClip('snort', 1.25, 0.7)) return; const t = aNow(); for (let i = 0; i < 4; i++) osc(t + i * 0.07, 'sawtooth', 160 - i * 8, 0.06, 0.08, BUS.sfx, { lp: 700 }); },
  snort() { AUD_LOG('snort'); if (!audioOK()) return; if (playClip('snort', 1, 0.8)) return; noise(aNow(), 'bandpass', 600, 0.8, 0.35, 0.25, BUS.sfx, { f2: 300 }); },
  crunch() { AUD_LOG('crunch'); if (!audioOK()) return; const t = aNow(); for (let i = 0; i < 4; i++) noise(t + i * 0.09, 'bandpass', 2400 - i * 200, 1.4, 0.06, 0.22, BUS.sfx); },
  ding(n = 0) { if (!audioOK()) return; const t = aNow(), f = 880 * Math.pow(2, (n % 12) / 12); osc(t, 'sine', f, 0.25, 0.12, BUS.sfx); osc(t, 'sine', f * 2.76, 0.12, 0.04, BUS.sfx); },
  jump() { AUD_LOG('jump'); if (!audioOK()) return; noise(aNow(), 'bandpass', 500, 0.9, 0.25, 0.12, BUS.sfx, { f2: 1600 }); },
  land() { if (!audioOK()) return; SFX.hoof(); SFX.hoof(aNow() + 0.06); },
  bump() { AUD_LOG('bump'); SFX.snort(); if (!audioOK()) return; osc(aNow(), 'sine', 200, 0.15, 0.2, BUS.sfx, { f2: 90 }); },
  shield() { AUD_LOG('shield'); if (!audioOK()) return; const t = aNow(); [784, 988, 1175].forEach((f, i) => osc(t + i * 0.05, 'triangle', f, 0.3, 0.08, BUS.sfx)); },
  splash() { if (!audioOK()) return; noise(aNow(), 'highpass', 1500, 0.6, 0.35, 0.18, BUS.sfx); },
  pop() { if (!audioOK()) return; const t = aNow(); for (let i = 0; i < 6; i++) noise(t + i * 0.04, 'bandpass', 3000 + Math.random() * 2000, 2, 0.05, 0.1, BUS.sfx); },
  fanfare() { AUD_LOG('fanfare'); if (!audioOK()) return; const t = aNow(); [[0, 523], [0.12, 659], [0.24, 784], [0.42, 1047]].forEach(([d, f]) => { osc(t + d, 'sawtooth', f, d > 0.4 ? 0.6 : 0.14, 0.07, BUS.sfx, { lp: 2400 }); osc(t + d, 'square', f / 2, d > 0.4 ? 0.6 : 0.14, 0.03, BUS.sfx, { lp: 1200 }); }); },
  chime() { AUD_LOG('chime'); if (!audioOK()) return; const t = aNow(); [523, 659, 784, 1047, 1319].forEach((f, i) => { osc(t + i * 0.08, 'sine', f, 1.0, 0.07, BUS.sfx); osc(t + i * 0.08, 'sine', f * 2, 0.4, 0.02, BUS.sfx); }); },
  sparkle() { if (!audioOK()) return; const t = aNow(); for (let i = 0; i < 5; i++) osc(t + i * 0.05, 'sine', 1400 + i * 300, 0.15, 0.04, BUS.sfx); },
  ui() { if (!audioOK()) return; osc(aNow(), 'triangle', 660, 0.07, 0.07, BUS.sfx, { f2: 880 }); },
  back() { if (!audioOK()) return; osc(aNow(), 'triangle', 600, 0.07, 0.06, BUS.sfx, { f2: 420 }); },
  key() { if (!audioOK()) return; osc(aNow(), 'sine', 900 + Math.random() * 200, 0.05, 0.06, BUS.sfx); },
  no() { if (!audioOK()) return; osc(aNow(), 'square', 220, 0.12, 0.05, BUS.sfx, { lp: 900, f2: 180 }); },
  whoosh() { AUD_LOG('whoosh'); if (!audioOK()) return; noise(aNow(), 'bandpass', 300, 0.8, 0.8, 0.2, BUS.sfx, { f2: 2400 }); },
  stamp() { if (!audioOK()) return; osc(aNow(), 'sine', 180, 0.12, 0.25, BUS.sfx, { f2: 80 }); SFX.sparkle(); },
};
/* ---------- MUSIC: original procedural "Hoofbeat Pop" (every theme is generated from its own seed; no borrowed tunes) ---------- */
const MODES = { maj: [0, 2, 4, 5, 7, 9, 11], mix: [0, 2, 4, 5, 7, 9, 10], dor: [0, 2, 3, 5, 7, 9, 10] };
const PROGS = ['0 0 3 4 0 0 3 4', '0 5 3 4 0 5 3 4', '0 3 0 4 0 3 4 0', '5 3 0 4 5 3 0 4', '0 4 5 3 0 4 3 4', '3 4 0 5 3 4 0 0', '0 1 3 4 0 1 4 4', '0 3 5 4 0 3 4 0', '3 0 4 5 3 0 4 4'];
const RHY = ['10101010', '10101100', '11101010', '10111010', '10001010', '11011010', '10101110', '10100010', '11101110', '10110110'];
const THEME_CFG = {
  title: { bpm: 126, root: 60, mode: 'maj', feel: 'pop', lead: 'pluck', lead2: 'bells' },
  map: { bpm: 112, root: 62, mode: 'maj', feel: 'pop', lead: 'marimba', soft: 1 },
  tack: { bpm: 104, root: 65, mode: 'maj', feel: 'waltz', lead: 'bells', soft: 1 },
  story: { bpm: 84, root: 60, mode: 'maj', feel: 'calm', lead: 'harp', soft: 1 },
  treat: { bpm: 104, root: 67, mode: 'maj', feel: 'calm', lead: 'pluck', soft: 1 },
  land0: { bpm: 128, root: 60, mode: 'maj', feel: 'pop', lead: 'pluck' },
  land1: { bpm: 142, root: 62, mode: 'maj', feel: 'hoedown', lead: 'fiddle', lead2: 'pluck' },
  land2: { bpm: 134, root: 60, mode: 'mix', feel: 'hoedown', lead: 'whistle', lead2: 'pluck' },
  land3: { bpm: 136, root: 65, mode: 'maj', feel: 'pop', lead: 'whistle', lead2: 'bells' },
  land4: { bpm: 128, root: 67, mode: 'maj', feel: 'pop', lead: 'flute', lead2: 'marimba' },
  land5: { bpm: 132, root: 64, mode: 'maj', feel: 'pop', lead: 'marimba', lead2: 'bells' },
  land6: { bpm: 130, root: 62, mode: 'dor', feel: 'pop', lead: 'bells', lead2: 'flute', pad: 1 },
  land7: { bpm: 138, root: 65, mode: 'maj', feel: 'pop', lead: 'harp', lead2: 'whistle', pad: 1 },
  parade: { bpm: 116, root: 60, mode: 'maj', feel: 'march', lead: 'brass', lead2: 'bells' },
  grand: { bpm: 120, root: 62, mode: 'maj', feel: 'march', lead: 'brass', lead2: 'bells' },
};
const THEMES = {};
function genTheme(id) { if (THEMES[id]) return THEMES[id]; const cfg = THEME_CFG[id]; const rr = srng(hashStr('kimber-' + id)); const pk = a => a[Math.floor(rr() * a.length)];
  const beats = cfg.feel === 'waltz' ? 3 : 4, spb = beats * 2; // 8th-note slots per bar
  const sections = [];
  for (let s = 0; s < 4; s++) { const chords = pk(PROGS).split(' ').map(Number); const mk = () => { const r = pk(RHY).slice(0, spb).padEnd(spb, '0'); return r; };
    const r1 = mk(), r2 = mk(), r3 = mk(); let last = 4 + Math.floor(rr() * 3);
    const barMel = (bar, rh, contour) => { const ch = chords[bar]; const out = []; for (let i = 0; i < spb; i++) { if (rh[i] === '1') { const strong = i % (beats === 3 ? 2 : 4) === 0; let n;
          if (strong) { const tones = [ch, ch + 2, ch + 4, ch + 7, ch + 9].filter(x => x >= 2 && x <= 11); n = tones.reduce((a, b) => Math.abs(b - last) < Math.abs(a - last) ? b : a, tones[0]); }
          else n = clamp(last + (contour[(i + bar) % contour.length]), 1, 12);
          last = n; out.push(n); } else out.push(i === 0 ? null : '-'); }
      return out; };
    const c1 = [1, 1, -1, 2, -1, -1, 1], c2 = [-1, -1, 2, 1, -2, 1, 1], c3 = [2, -1, -1, 1, 1, -2, 1];
    const mel = [barMel(0, r1, c1), barMel(1, r2, c1), barMel(2, r1, c1), barMel(3, r2, c2), barMel(4, r3, c3), barMel(5, r2, c3), barMel(6, r1, c1)];
    const fin = []; for (let i = 0; i < spb; i++) fin.push(i === 0 ? chords[7] + 7 : i === 2 ? chords[7] + 4 : i === 4 ? chords[7] + (chords[7] === 0 ? 7 : 2) : '-'); mel.push(fin);
    sections.push({ chords, mel }); }
  return (THEMES[id] = Object.assign({ id, beats, spb, sections }, cfg)); }
const Music = { th: null, name: '', sec: 0, bar: 0, step: 0, nextT: 0, tr: 0, timer: null, secBars: 8, pending: 0,
  play(id) { if (this.name === id && this.th) return; this.name = id; this.th = genTheme(id); this.sec = 0; this.bar = 0; this.step = 0; this.tr = 0; this.nextT = aNow() + 0.08; AUD_LOG('music_' + id); this.ensure(); },
  stop() { this.th = null; this.name = ''; },
  next(keyUp) { if (!this.th) return; this.pending = keyUp ? 2 : 1; AUD_LOG('music_change'); },
  ensure() { if (!this.timer) this.timer = setInterval(() => this.tick(), 25); },
  tick() { if (!this.th || !audioOK()) { if (AC) this.nextT = Math.max(this.nextT, aNow()); return; } const th = this.th, dt = 60 / th.bpm / 2;
    while (this.nextT < aNow() + 0.12) { this.playStep(this.nextT, dt); this.nextT += dt; this.step++;
      if (this.step >= th.spb) { this.step = 0; this.bar++;
        if (this.pending) { if (this.pending === 2) this.tr = (this.tr + 2) % 7; this.sec = (this.sec + 1) % 4; this.bar = 0; this.pending = 0; }
        else if (this.bar >= this.secBars) { this.bar = 0; this.sec = (this.sec + 1) % 4; if (this.sec === 0) this.tr = (this.tr + (th.soft ? 0 : 1)) % 5; } } } },
  playStep(t, dt) { const th = this.th, sec = th.sections[this.sec], bar = this.bar % 8, st = this.step, sc = MODES[th.mode];
    const deg = n => { const o = Math.floor(n / 7), d = ((n % 7) + 7) % 7; return th.root + this.tr + sc[d] + 12 * o; };
    const mf = m => 440 * Math.pow(2, (m - 69) / 12); const out = BUS.duck; const soft = th.soft ? 0.6 : 1;
    const ch = sec.chords[bar]; const beat = st / 2, onBeat = st % 2 === 0;
    // melody
    const mn = sec.mel[bar][st]; if (typeof mn === 'number') { let len = 1; for (let i = st + 1; i < th.spb && sec.mel[bar][i] === '-'; i++) len++; inst(th.lead, t, mf(deg(mn)), dt * len * 0.95, 0.16 * soft, out); if (th.lead2 && this.bar % 2 === 1 && this.sec % 2 === 1) inst(th.lead2, t, mf(deg(mn) + 12), dt * len * 0.9, 0.05 * soft, out); }
    // bass
    const root = mf(deg(ch) - 24);
    if (th.feel === 'waltz') { if (st === 0) inst('bass', t, root, dt * 1.8, 0.16, out); if (st === 2 || st === 4) { for (const k of [2, 4]) inst('bells', t, mf(deg(ch + k)), dt * 1.2, 0.035, out); } }
    else if (th.feel === 'hoedown') { if (onBeat) inst('bass', t, beat % 2 === 0 ? root : mf(deg(ch + 4) - 24), dt * 0.9, 0.2, out); else for (const k of [0, 2, 4]) inst('pluck', t, mf(deg(ch + k) - 12), dt * 0.6, 0.035, out); }
    else if (th.feel === 'calm') { if (st === 0) { inst('bass', t, root, dt * 3, 0.12, out); for (const k of [0, 2, 4]) inst('pad', t, mf(deg(ch + k) - 12), dt * th.spb * 0.95, 0.025, out); } if (st === 3 || st === 6) inst('harp', t, mf(deg(ch + (st === 3 ? 2 : 4))), dt * 2, 0.05, out); }
    else if (th.feel === 'march') { if (onBeat) inst('bass', t, beat % 2 === 0 ? root : mf(deg(ch + 4) - 24), dt * 0.9, 0.2, out); if (!onBeat) for (const k of [0, 2, 4]) inst('brass', t, mf(deg(ch + k) - 12), dt * 0.5, 0.025, out); }
    else { if (st === 0 || st === 3 || st === 4 || st === 6) inst('bass', t, root * (st === 6 ? 1.5 : 1), dt * 0.9, 0.18, out); if (st === 2 || st === 6) for (const k of [0, 2, 4]) inst('pluck', t, mf(deg(ch + k) - 12), dt * 0.7, 0.03, out); if (th.pad && st === 0) for (const k of [0, 2, 4]) inst('pad', t, mf(deg(ch + k)), dt * th.spb, 0.016, out); }
    // drums
    if (th.feel === 'calm') { if (st === 4) drum('shk', t, out, 0.4); return; }
    if (th.feel === 'waltz') { if (st === 0) drum('k', t, out, 0.5); if (st === 2 || st === 4) drum('shk', t, out, 0.5); return; }
    if (th.feel === 'march') { if (st === 0 || st === 4) drum('k', t, out); if (st === 2 || st === 6) drum('s', t, out); if (this.bar % 4 === 3 && st >= 4) { drum('s', t, out, 0.5); drum('s', t + dt / 2, out, 0.4); } else drum('h', t, out, 0.5); return; }
    if (st === 0 || st === 4 || (th.feel === 'hoedown' && (st === 2 || st === 6))) drum('k', t, out, th.feel === 'hoedown' ? 0.8 : 1);
    if (st === 2 || st === 6) { drum('s', t, out, 0.8); drum('c', t, out, 0.6); }
    drum('h', t, out, onBeat ? 0.6 : 0.35); if (th.feel !== 'hoedown') drum('h', t + dt / 2, out, 0.2);
    if (this.bar === 7 && st >= 5) drum('s', t + dt / 2, out, 0.5); }
};
function inst(k, t, f, d, gain, out) {
  switch (k) {
    case 'pluck': osc(t, 'sawtooth', f, Math.min(d, 0.35), gain * 0.8, out, { lp: 4200, lp2: 700 }); osc(t, 'triangle', f, Math.min(d, 0.3), gain * 0.5, out); break;
    case 'fiddle': osc(t, 'sawtooth', f, d, gain * 0.6, out, { lp: 2600, a: 0.03, vib: 6, vd: 0.01 }); break;
    case 'whistle': osc(t, 'sine', f * 2, d, gain * 0.7, out, { a: 0.02, vib: 5.5, vd: 0.008 }); break;
    case 'flute': osc(t, 'sine', f, d, gain, out, { a: 0.04, vib: 5, vd: 0.008 }); osc(t, 'triangle', f * 2, d, gain * 0.15, out, { a: 0.05 }); break;
    case 'marimba': osc(t, 'sine', f, Math.min(d, 0.4), gain, out); osc(t, 'sine', f * 4, 0.08, gain * 0.25, out); break;
    case 'bells': osc(t, 'sine', f * 2, Math.min(d * 1.5, 0.9), gain * 0.7, out); osc(t, 'sine', f * 5.52, 0.2, gain * 0.15, out); break;
    case 'harp': osc(t, 'triangle', f, Math.max(0.5, d), gain, out); osc(t, 'sine', f * 2, 0.3, gain * 0.3, out); break;
    case 'brass': osc(t, 'sawtooth', f, d, gain * 0.7, out, { lp: 1800, a: 0.03 }); osc(t, 'square', f, d, gain * 0.2, out, { lp: 1200, a: 0.03 }); break;
    case 'bass': osc(t, 'triangle', f, d, gain, out); osc(t, 'square', f, d * 0.6, gain * 0.15, out, { lp: 500 }); break;
    case 'pad': osc(t, 'sawtooth', f, d, gain, out, { lp: 900, a: 0.4, det: -6 }); osc(t, 'sawtooth', f, d, gain, out, { lp: 900, a: 0.4, det: 6 }); break;
  } }
function drum(k, t, out, v = 1) {
  if (k === 'k') osc(t, 'sine', 130, 0.18, 0.5 * v, out, { f2: 45, ft: 0.12 });
  else if (k === 's') { noise(t, 'bandpass', 1900, 0.9, 0.12, 0.16 * v, out); osc(t, 'triangle', 190, 0.08, 0.1 * v, out); }
  else if (k === 'c') { for (let i = 0; i < 3; i++) noise(t + i * 0.011, 'bandpass', 1300, 1.5, 0.05, 0.08 * v, out); }
  else if (k === 'h') noise(t, 'highpass', 7500, 0.7, 0.035, 0.06 * v, out);
  else if (k === 'shk') noise(t, 'highpass', 5000, 0.7, 0.07, 0.05 * v, out, { a: 0.02 });
}
/* ---------- read-aloud (Web Speech API; first use always comes from a tap, which iOS Safari requires) ---------- */
const Voice = { ok: typeof speechSynthesis !== 'undefined' && typeof SpeechSynthesisUtterance !== 'undefined', speaking: null, unlocked: false, voice: null, idx: -1, parts: [],
  unlock() { if (!this.ok || this.unlocked) return; try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); this.unlocked = true; AUD_LOG('voiceUnlock'); } catch (e) { } },
  pick() { if (!this.ok) return null; if (this.voice) return this.voice; const vs = speechSynthesis.getVoices() || []; const en = vs.filter(v => /^en(-|_)?(US|GB|AU|CA)?/i.test(v.lang));
    const pref = ['Samantha', 'Karen', 'Moira', 'Tessa', 'Google US English', 'Microsoft Aria', 'Microsoft Jenny', 'Allison', 'Ava', 'Susan', 'Zira']; for (const p of pref) { const v = en.find(x => x.name.includes(p)); if (v) return (this.voice = v); }
    return (this.voice = en.find(v => v.localService) || en[0] || null); },
  say(id, txt) { AUD_LOG('speak'); if (!this.ok || !S.set.voice) return; try { if (speechSynthesis.speaking || speechSynthesis.pending) speechSynthesis.cancel();
      const parts = String(txt).replace(/\s+/g, ' ').match(/[^.!?]+[.!?"\u201d]*\s*/g) || [txt]; this.parts = parts; this.speaking = id; this.idx = 0; duckMusic(true); const v = this.pick();
      parts.forEach((p, i) => { const u = new SpeechSynthesisUtterance(p.trim()); u.rate = 0.92; u.pitch = 1.08; u.lang = (v && v.lang) || 'en-US'; if (v) u.voice = v;
        u.onstart = () => { if (this.speaking === id) this.idx = i; }; u.onend = u.onerror = () => { if (i === parts.length - 1 && this.speaking === id) { this.speaking = null; this.idx = -1; duckMusic(false); } }; speechSynthesis.speak(u); });
      this.unlocked = true; } catch (e) { this.speaking = null; } },
  toggle(id, txt) { if (this.speaking === id) this.stop(); else this.say(id, txt); },
  stop() { if (!this.ok) return; try { if (this.speaking) { speechSynthesis.cancel(); duckMusic(false); } } catch (e) { } this.speaking = null; this.idx = -1; },
};
if (Voice.ok && speechSynthesis.addEventListener) speechSynthesis.addEventListener('voiceschanged', () => { Voice.voice = null; });
