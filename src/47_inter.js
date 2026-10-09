/* ===================== INTERLUDES + HORSESHOE POUCH: economy, perks, fun facts, shared art, interlude results ===================== */
// ---------- extra original SFX (all synthesized) ----------
Object.assign(SFX, {
  toss() { AUD_LOG('toss'); if (!audioOK()) return; noise(aNow(), 'bandpass', 700, 1.2, 0.22, 0.12, BUS.sfx, { f2: 1800 }); },
  thwip() { AUD_LOG('thwip'); if (!audioOK()) return; const t = aNow(); osc(t, 'triangle', 190, 0.12, 0.16, BUS.sfx, { f2: 90 }); noise(t, 'highpass', 2500, 0.7, 0.18, 0.1, BUS.sfx, { f2: 5000 }); },
  thunk() { AUD_LOG('thunk'); if (!audioOK()) return; const t = aNow(); osc(t, 'sine', 160, 0.16, 0.3, BUS.sfx, { f2: 70 }); noise(t, 'lowpass', 900, 0.8, 0.08, 0.2, BUS.sfx); },
  miss() { if (!audioOK()) return; noise(aNow(), 'lowpass', 500, 0.7, 0.18, 0.1, BUS.sfx); },
  honk() { AUD_LOG('honk'); if (!audioOK()) return; const t = aNow(); osc(t, 'square', 392, 0.28, 0.06, BUS.sfx, { lp: 1400 }); osc(t, 'square', 494, 0.28, 0.05, BUS.sfx, { lp: 1400 }); },
  neighHorn() { AUD_LOG('neighHorn'); if (!audioOK()) return; const t = aNow(); osc(t, 'square', 523, 0.16, 0.05, BUS.sfx, { lp: 1600 }); osc(t + 0.17, 'square', 659, 0.16, 0.05, BUS.sfx, { lp: 1600 }); synthWhinny(t + 0.3, 1.15); },
  engine() { if (!audioOK()) return; const t = aNow(); osc(t, 'sawtooth', 70, 0.5, 0.05, BUS.sfx, { lp: 400, f2: 110 }); },
  hammer() { AUD_LOG('hammer'); if (!audioOK()) return; const t = aNow(); [0, 0.22, 0.44].forEach(d => { osc(t + d, 'square', 1400, 0.05, 0.05, BUS.sfx, { lp: 3000 }); noise(t + d, 'bandpass', 3000, 2, 0.06, 0.12, BUS.sfx); }); },
  coins() { if (!audioOK()) return; const t = aNow(); for (let i = 0; i < 6; i++) osc(t + i * 0.06, 'triangle', 1200 + i * 160, 0.12, 0.05, BUS.sfx); },
});
Object.assign(THEME_CFG, {
  pasture: { bpm: 116, root: 67, mode: 'maj', feel: 'hoedown', lead: 'marimba', lead2: 'whistle' },
  lane: { bpm: 140, root: 62, mode: 'mix', feel: 'hoedown', lead: 'flute', lead2: 'pluck' },
  garage: { bpm: 124, root: 64, mode: 'maj', feel: 'pop', lead: 'pluck', lead2: 'brass' },
  build: { bpm: 108, root: 65, mode: 'maj', feel: 'waltz', lead: 'bells', soft: 1 },
});
// ---------- economy (see PROGRESS.md "Economy math") ----------
const ECON = { interFinish: l => 10 + 2 * l, newStar: 5, carrotCatch: 3, golden: 10, hit: 3, bull: 5, balloon: 3, mover: 4, streak: 3, fixit: 15, dayMs: 864e5 };
function today() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
// every horseshoe goes into the spendable pouch (S.wallet) AND the lifetime Lucky Jar (S.shoes)
function earn(n) { n = Math.max(0, Math.round(n)); S.wallet = (S.wallet || 0) + n; S.shoes += n; let golden = 0; while (S.shoes >= S.jarNext) { S.jarNext += 100; S.golden++; golden++; } return golden; }
function spend(n) { if ((S.wallet || 0) < n) return false; S.wallet -= n; save(); return true; }
function owns(id) { return !!((S.build && S.build.own[id]) || (S.shop && S.shop.own[id]) || (S.truck && S.truck.p && S.truck.p[id])); }
// ---------- Kimber's stable: 7 levels, cores + luxuries ----------
const BUILD = [
  { lv: 1, name: 'Run-in Shed', core: null, lux: [['mats', 'Rubber Mats', 50, 0, 'Comfy mats'], ['haynet', 'Hay Net', 60, 1, '+1 carrot to toss'], ['board', 'Name Board', 30, 0, 'Your horse\u2019s name'], ['bucket', 'Sparkle Bucket', 40, 0, 'Sparkly water']] },
  { lv: 2, name: 'Cozy Barn', core: ['c2', 'Cozy Barn', 300, () => raceStars(1, 0) > 0, 'Ride Race 1 of Chapter 1'], lux: [['brush', 'Brush Station', 80, 1, 'Speedy start +1 s'], ['flowers', 'Flower Boxes', 60, 0, 'Rainbow flowers'], ['paint', 'Fence Paint', 70, 0, 'Rainbow fence'], ['cat', 'Barn Cat Bed', 50, 0, 'A sleepy barn cat']] },
  { lv: 3, name: 'Wash Bay', core: ['c3', 'Wash Bay', 380, () => landDone(1), 'Finish Chapter 1'], lux: [['hose', 'Bubble Hose', 100, 0, 'Bubbly baths'], ['fans', 'Fans & Misters', 160, 1, 'Gallop refills 10% faster'], ['hayloft', 'Hayloft Doors', 120, 1, '+1 carrot to toss'], ['vane', 'Weather Vane', 80, 0, 'A golden star vane']] },
  { lv: 4, name: 'Tack Room Wing', core: ['c4', 'Tack Room Wing', 420, () => landDone(2), 'Finish Chapter 2'], lux: [['racks', 'Saddle Racks', 90, 0, 'Shiny racks'], ['autobrush', 'Auto Brushes', 180, 1, 'Start races 25% gallop'], ['dispenser', 'Treat Dispenser', 200, 1, 'Free carrot every race'], ['plates', 'Brass Nameplates', 70, 0, 'Names on every door']] },
  { lv: 5, name: 'Indoor Arena', core: ['c5', 'Indoor Arena', 420, () => landDone(3), 'Finish Chapter 3'], lux: [['bunting', 'Mirrors & Bunting', 80, 0, 'Rainbow bunting'], ['heatwater', 'Warm Water Bowls', 180, 1, '+1 heart shield'], ['targets', 'Practice Targets', 140, 1, '+1 arrow'], ['starry', 'Starry Ceiling', 100, 0, 'Stars overhead']] },
  { lv: 6, name: 'Foal Nursery', core: ['c6', 'Foal Nursery', 450, () => landDone(4), 'Finish Chapter 4'], lux: [['spa', 'Horse Spa', 220, 1, 'Gallop lasts 10% longer'], ['straw', 'Soft Straw Beds', 80, 0, 'Fluffy beds'], ['cam', 'Horse-cam', 120, 0, 'Wave at the camera!'], ['chand', 'Chandeliers', 160, 0, 'Tiny crystal lights']] },
  { lv: 7, name: 'Show Hall', core: ['c7', 'Show Hall', 480, () => landDone(5), 'Finish Chapter 5'], lux: [['wall', 'Trophy Wall', 140, 0, 'Your rosettes glow'], ['arch', 'Rainbow Arch Doors', 180, 0, 'Rainbow doors'], ['golden', 'Golden Archway', 240, 1, '+10% game horseshoes'], ['suite', 'Suite Paint', 120, 0, 'Pastel suites']] },
  { lv: 8, name: 'Grand Rainbow Stable', core: ['c8', 'Rainbow Trail', 520, () => landDone(6), 'Finish Chapter 6'], lux: [] },
];
function stableLevel() { let lv = 1; for (const b of BUILD) if (b.core && S.build.own[b.core[0]]) lv = b.lv; return Math.min(lv, 7) + (S.build.own.c8 ? 1 : 0); }
function nextCore() { for (const b of BUILD) if (b.core && !S.build.own[b.core[0]]) return b; return null; }
// Mom Kari's Tack & Farrier Shop
const SHOP_BUILD = 300;
const SHOP = [
  ['k1', 'Rainbow Shoes', 120, 1, '+1 heart shield', 'Shoes'], ['k2', 'Lucky Shoes', 180, 1, '+10% race horseshoes', 'Shoes'], ['k3', 'Grippy Shoes', 140, 1, 'Splash-proof', 'Shoes'], ['k4', 'Sparkle Shoes', 80, 0, 'Sparkly hoof trail', 'Shoes'],
  ['k5', 'Mom-Sewn Surprise', 150, 0, '2 new tack pieces', 'Tack'], ['k6', 'Sewing Corner', 120, 0, 'Unlocks more sewing', 'Tack'], ['k7', 'Thread-of-Seven Surprise', 160, 0, '2 more tack pieces', 'Tack', 'k6'], ['k8', 'Paint & Dye Station', 100, 0, 'A rainbow paint wall', 'Tack'],
];
const ECON_TOTALS = (() => { let core = 0, lux = 0; for (const b of BUILD) { if (b.core) core += b.core[2]; for (const x of b.lux) lux += x[2]; } let shop = SHOP_BUILD; for (const x of SHOP) shop += x[2]; return { core, lux, shop, all: core + lux + shop }; })();
// ---------- perks ----------
function perkCarrots() { return (owns('haynet') ? 1 : 0) + (owns('hayloft') ? 1 : 0); }
function perkArrows() { return owns('targets') ? 1 : 0; }
function interMult() { return owns('golden') ? 1.1 : 1; }
function racePerks(sc) { const tr = Object.assign({}, sc.tr || {}); if (owns('dispenser')) tr.carrot = true; if (owns('k3')) tr.green = true; sc.tr = tr;
  if (owns('brush')) sc.boostT += 1; if (owns('autobrush')) sc.meter = Math.min(1, sc.meter + 0.25); if (owns('comfy') && sc.r === 0) sc.meter = 1;
  if (owns('heatwater')) sc.hearts++; if (owns('k1')) sc.hearts++; sc.refillK = owns('fans') ? 1.1 : 1; sc.drainK = owns('spa') ? 1.1 : 1; sc.sparkleHooves = owns('k4'); }
// ---------- mandatory interludes between races ----------
// slot 0 (after race 1) = Carrot Toss, slot 1 (after race 2) = Bow & Gallop
function interKey(slot) { return slot === 0 ? 'c' : 'a'; }
function interStars(l, slot) { if (l < 1 || !S.inter) return 0; return S.inter[interKey(slot)][l - 1] || 0; }
function interDone(l, slot) { return l === 0 || slot > 1 || interStars(l, slot) > 0; }
function interName(slot) { return slot === 0 ? 'Carrot Toss' : 'Bow & Gallop'; }
function interScene(slot) { return slot === 0 ? SC.carrot : SC.bow; }
// ---------- Horseback archery fun facts (web-checked Oct 2026; see PROGRESS.md for sources) ----------
const FACTS = [
  { id: 'mongolia', t: 'Horseback Archery in Mongolia', pin: [104, 47], where: 'Mongolia, on the wide grassy steppe', when: 'Hundreds of years ago, and still today', who: 'Mongolian herders and riders',
    s: 'Mongolian riders were famous for shooting a bow from a galloping horse. Every summer, Mongolia\u2019s big Naadam festival celebrates three favorite games: wrestling, horse racing and archery.' },
  { id: 'yabusame', t: 'Yabusame (Japan)', pin: [139.5, 35.3], where: 'Kamakura, Japan, at Tsurugaoka Hachimangu shrine', when: 'Since the year 1187, and still today', who: 'Riders in old-time samurai hunting clothes',
    s: 'A rider gallops down a track about 250 meters long and shoots at three square wooden targets. Riders let go of the reins and steer with their legs! It is a ceremony that prays for good harvests and peace.' },
  { id: 'korea', t: 'Korea\u2019s Horseback Archers', pin: [126, 41], where: 'Goguryeo, an old kingdom in Korea and northeast China', when: 'About 1,500 years ago', who: 'Goguryeo riders',
    s: 'A famous painting in an old tomb called Muyongchong shows riders twisting around in the saddle to shoot. Legend says Jumong, who founded Goguryeo, had a name that means \u201cskilled archer.\u201d Horseback archery is still practiced in Korea today.' },
  { id: 'scythian', t: 'The Scythians', pin: [36, 47], where: 'The grasslands north of the Black Sea', when: 'About 2,500 years ago', who: 'Scythian nomads who lived on horseback',
    s: 'Scythian riders carried a gorytos: one case that held the bow AND the arrows, worn on the left hip. Some were covered in beautiful gold patterns!' },
  { id: 'parthian', t: 'The Parthian Shot', pin: [55, 35], where: 'Parthia, in ancient Iran', when: 'About 2,000 years ago', who: 'Parthian riders',
    s: 'A Parthian rider could gallop away, twist around in the saddle and shoot backward! Stirrups weren\u2019t invented yet, so they balanced with their legs. The trick is still called the \u201cParthian shot.\u201d' },
  { id: 'magyar', t: 'The Magyars of Hungary', pin: [19, 47], where: 'The Carpathian Basin, today\u2019s Hungary', when: 'Around the year 895', who: 'Magyar (Hungarian) riders',
    s: 'The Magyars rode into the land that became Hungary around the year 895. Writers back then said they were amazing horseback archers, and Hungarians are still proud of it today.' },
  { id: 'plains', t: 'Comanche & the Plains Nations', pin: [-99, 34], where: 'The Southern Plains (Texas, Oklahoma and nearby)', when: 'From the late 1600s on', who: 'The Comanche (N\u0289m\u0289n\u0289\u0289, \u201cThe People\u201d) and other Plains Nations',
    say: 'Comanche and the Plains Nations. When horses came to the Great Plains, the Comanche, who call themselves Numunuu, The People, became some of the best riders in the world. Kids learned to ride before age six, and riders could even hang off the side of a galloping horse. The Lakota, Cheyenne and Kiowa were amazing riders too, and the Comanche Nation is still in Oklahoma today.',
    s: 'When horses came to the Great Plains, the Comanche became some of the best riders in the world. Kids learned to ride before age six, and riders could hang off the side of a galloping horse! Lakota, Cheyenne and Kiowa riders were amazing too, and the Comanche Nation is still in Oklahoma today.' },
  { id: 'ottoman', t: 'The Turkish Bow', pin: [29, 41], where: 'Istanbul, in the Ottoman Empire (today\u2019s T\u00fcrkiye)', when: 'About 300 to 500 years ago', who: 'Ottoman bow makers and archers',
    s: 'Turkish bows were made of a maple wood core, horn and sinew glued in layers: short, curvy and super strong. Archers practiced at Okmeydan\u0131, the \u201cArrow Field\u201d in Istanbul, where stone markers recorded the longest shots!' },
  { id: 'today', t: 'Horseback Archery Today', pin: [19, 47], where: 'Hungary first, then all over the world', when: 'Since the 1980s', who: 'Riders of all ages',
    s: 'In the 1980s, archers in Hungary brought horseback archery back as a sport. Riders gallop down a track about 99 meters long and shoot forward, sideways and backward. Today people compete in Korea, the USA, Europe and many more places!' },
];
const FACT_BY = Object.fromEntries(FACTS.map(f => [f.id, f]));
const LAND_FACT = [null, 'mongolia', 'yabusame', 'korea', 'scythian', 'parthian', 'magyar', 'plains'];
function nextFact(l) { const own = LAND_FACT[l]; if (own && !S.facts[own]) return own; const left = FACTS.filter(f => !S.facts[f.id]); if (left.length) return left[0].id; return FACTS[(S.stats.races + l) % FACTS.length].id; }
function factText(f) { return f.say || (f.t + '. ' + f.s); }
// fun fact card (same layout as the Tack Room history cards)
function factCard(x, y, w, h, f, u) { panel(x, y, w, h, 22, '#fffaf2', { lw: 3.5 }); const fs = clamp(15 * u, 13.5, 21);
  text('Fun fact!', x + 20, y + fs * 1.6, fs, '#ff6f91', { align: 'left', fam: F.ui, w: 800 });
  text(f.t, x + 20, y + fs * 3.2, fs * 1.55, '#7446c4', { align: 'left', fam: F.title, w: 400, max: w - 90 });
  speakBtn('factSpk', x + w - 36, y + 38, clamp(22 * u, 22, 30), () => factText(f), { minHit: 52 });
  const compact = h < 440; const th = compact ? 0 : clamp(h * 0.22, 70, 130), pw = Math.min(w * 0.36, th * 1.5); const py = y + fs * 4.4;
  if (!compact) { panel(x + 18, py, pw, th, 14, '#ffffff', { lw: 2.5, shadow: false });
  clipTo(() => RR(x + 18, py, pw, th, 14), () => { g.fillStyle = lin(0, py, 0, py + th, [[0, '#cfeeff'], [1, '#fff6e0']]); g.fillRect(x + 18, py, pw, th); hills(x + 18 + pw, py + th * 0.78, '#a8dc8f', 4, f.id.length, py + th + 4); realBow(x + 18 + pw * 0.38, py + th / 2, th * 0.8, false); arrowArt(x + 18 + pw * 0.62, py + th * 0.88, x + 18 + pw * 0.86, py + th * 0.14, th / 150); });
  miniMap(x + 30 + pw, py, w - pw - 48, th, f.pin); }
  let cy = py + th + fs * (compact ? 0.4 : 1.1); const rows = [[icPin, f.where], [icClock, f.when], [icStar, f.who]];
  rows.forEach(([ic, s]) => { ic(x + 32, cy + fs * 0.55, fs * 0.62); cy = wrap(s, x + 52, cy, w - 72, fs, INK, 1.2, { fam: F.body, w: 700 }) + fs * 0.45; });
  strokeOnly(() => { g.moveTo(x + 20, cy); g.lineTo(x + w - 20, cy); }, '#eadff0', 2); cy += fs * 0.6;
  let bfs = fs; let lines = wrapLines(f.s, w - 40, bfs, F.body, 400); while (cy + lines.length * bfs * 1.3 > y + h - 12 && bfs > 10) { bfs -= 0.5; lines = wrapLines(f.s, w - 40, bfs, F.body, 400); }
  clipTo(() => g.rect(x, y, w, h - 6), () => lines.forEach((ln, i) => text(ln, x + 20, cy + bfs * 0.7 + i * bfs * 1.3, bfs, INK, { align: 'left', fam: F.body, w: 400 }))); }
// ---------- shared art ----------
function carrotArt(x, y, len, rot, gold) {
  g.save(); g.translate(x, y); g.rotate(rot); const c = gold ? '#ffcf3a' : '#ff8a2a', L = len;
  for (const [a, l] of [[-0.5, 0.42], [0, 0.5], [0.5, 0.42]]) shape(() => E(-L * 0.5 - Math.cos(a) * l * L * 0.45, Math.sin(a) * l * L * 0.45, l * L * 0.45, L * 0.07, a), gold ? '#9be06b' : '#5cbf6a', Math.max(1.2, L * 0.045));
  shape(() => { g.moveTo(-L * 0.5, -L * 0.15); g.quadraticCurveTo(L * 0.15, -L * 0.13, L * 0.5, 0); g.quadraticCurveTo(L * 0.15, L * 0.13, -L * 0.5, L * 0.15); g.quadraticCurveTo(-L * 0.58, 0, -L * 0.5, -L * 0.15); g.closePath(); }, c, Math.max(1.4, L * 0.05));
  for (const k of [-0.2, 0.05, 0.28]) strokeOnly(() => { g.moveTo(L * k, -L * 0.1 * (1 - k)); g.lineTo(L * k + L * 0.04, -L * 0.02); }, shade(c, -0.3), Math.max(1, L * 0.03));
  if (gold) { sparkle(L * 0.1, -L * 0.3, L * 0.14); sparkle(-L * 0.25, L * 0.28, L * 0.1); }
  g.restore(); }
function popText(x, y, label, col = '#ff6f91', px = 26, rot = -0.08) { g.save(); g.translate(x, y); g.rotate(rot); text(label, 0, 0, px, '#fff', { fam: F.title, w: 400, stroke: shade(col, -0.35), sw: px * 0.28 }); g.restore(); }
function burst(x, y, r, col = '#fff3a8') { g.save(); g.translate(x, y); for (let i = 0; i < 10; i++) { g.rotate(TAU / 10); fillOnly(() => { g.moveTo(r * 0.45, -r * 0.08); g.lineTo(r, 0); g.lineTo(r * 0.45, r * 0.08); g.closePath(); }, col); } g.restore(); }
// a NORMAL arrow: wooden shaft, three feather fletchings, nock, and a steel field point. From nock (x0,y0) to point (x1,y1).
function arrowArt(x0, y0, x1, y1, w = 1, o = {}) { const a = Math.atan2(y1 - y0, x1 - x0), ca = Math.cos(a), sa = Math.sin(a), len = Math.hypot(x1 - x0, y1 - y0);
  const ph = Math.min(len * 0.14, 18 * w); const sx = x1 - ca * ph, sy = y1 - sa * ph;
  strokeOnly(() => { g.moveTo(x0, y0); g.lineTo(sx, sy); }, INK, 5 * w); strokeOnly(() => { g.moveTo(x0, y0); g.lineTo(sx, sy); }, '#c9925a', 2.8 * w); strokeOnly(() => { g.moveTo(x0 + ca * 4 * w, y0 + sa * 4 * w); g.lineTo(sx, sy); }, 'rgba(255,240,210,.55)', 0.9 * w);
  // fletching (feathers) near the nock
  const fl = Math.min(len * 0.26, 30 * w), f0 = 5 * w; const cols = o.fletch || ['#ff5a6e', '#ffffff', '#ff5a6e'];
  for (const s of [-1, 1]) shape(() => { const bx = x0 + ca * f0, by = y0 + sa * f0, ex = x0 + ca * (f0 + fl), ey = y0 + sa * (f0 + fl); g.moveTo(bx, by); g.quadraticCurveTo(bx - sa * s * 9 * w, by + ca * s * 9 * w, bx + ca * fl * 0.25 - sa * s * 8 * w, by + sa * fl * 0.25 + ca * s * 8 * w); g.lineTo(ex, ey); g.closePath(); }, s < 0 ? cols[0] : cols[2], Math.max(1, 1.5 * w));
  strokeOnly(() => { g.moveTo(x0 + ca * f0, y0 + sa * f0); g.lineTo(x0 + ca * (f0 + fl), y0 + sa * (f0 + fl)); }, cols[1], 2.2 * w);
  shape(() => RR(x0 - 2.5 * w, y0 - 2.5 * w, 5 * w, 5 * w, 2 * w), '#3b3640', Math.max(0.8, w));
  // steel field point
  shape(() => { g.moveTo(x1, y1); g.lineTo(sx - sa * 3.6 * w, sy + ca * 3.6 * w); g.lineTo(sx - ca * 2 * w, sy - sa * 2 * w); g.lineTo(sx + sa * 3.6 * w, sy - ca * 3.6 * w); g.closePath(); }, '#c3cbd6', Math.max(1, 1.6 * w));
  strokeOnly(() => { g.moveTo(x1 - ca * 2 * w, y1 - sa * 2 * w); g.lineTo(sx, sy); }, 'rgba(255,255,255,.8)', 1 * w); }
// a short recurve (composite) bow, grip at (gx,gy); hand = nock point when drawn
function realBow(gx, gy, h, drawn, hand) {
  const top = [gx - 6 * h / 330, gy - h * 0.5], bot = [gx - 14 * h / 330, gy + h * 0.5]; const k = h / 330;
  const limb = (sgn) => { g.moveTo(gx, gy); g.bezierCurveTo(gx + 26 * k, gy + sgn * h * 0.22, gx + 18 * k, gy + sgn * h * 0.42, gx - (4 + (sgn > 0 ? 8 : 0)) * k, gy + sgn * h * 0.46); g.quadraticCurveTo(gx - (16 + (sgn > 0 ? 6 : 0)) * k, gy + sgn * h * 0.48, gx - (6 + (sgn > 0 ? 8 : 0)) * k, gy + sgn * h * 0.5); };
  const ns = drawn && hand ? hand : [gx - 4 * k, gy];
  strokeOnly(() => { g.moveTo(top[0], top[1]); g.lineTo(ns[0], ns[1]); g.lineTo(bot[0], bot[1]); }, '#fff', Math.max(1.2, 2.4 * k));
  for (const sgn of [-1, 1]) { strokeOnly(() => limb(sgn), INK, Math.max(3, 13 * k)); strokeOnly(() => limb(sgn), '#9b4a2a', Math.max(2, 8 * k)); strokeOnly(() => limb(sgn), 'rgba(255,217,61,.85)', Math.max(0.8, 2 * k)); }
  shape(() => RR(gx - 8 * k, gy - 22 * k, 18 * k, 44 * k, 6 * k), '#5a3420', Math.max(1.2, 2.5 * k)); }
// Kimber seen from behind (same colors as drawKimber)
function kimberBack(x, y, s, o = {}) {
  g.save(); g.translate(x, y); g.scale(s, s); groundShadow(0, 0, 46, 8);
  group([[() => { RR(-26, -78, 24, 50, 8); RR(2, -78, 24, 50, 8); }, KIM.jod]], 3);
  group([[() => { RR(-27, -46, 25, 44, 7); RR(2, -46, 25, 44, 7); E(-16, -3, 15, 7); E(16, -3, 15, 7); }, KIM.boot]], 3);
  const raise = o.raise || 0;
  const armR = raise === 1 ? () => { poly([[30, -128], [22, -118], [52, -168], [62, -160]]); C(58, -170, 9); } : raise === 2 ? () => { poly([[30, -128], [22, -118], [40, -186], [50, -184]]); C(46, -192, 9); } : () => { poly([[34, -126], [24, -122], [30, -82], [40, -84]]); C(35, -78, 8); };
  const armL = o.leftOut ? () => { poly([[-30, -128], [-24, -118], [-58, -110], [-60, -120]]); C(-62, -115, 8); } : () => { poly([[-34, -126], [-24, -122], [-30, -82], [-40, -84]]); C(-35, -78, 8); };
  group([[armL, KIM.shirt], [armR, KIM.shirt]], 3);
  const hands = [o.leftOut ? [-64, -115] : [-35, -78], raise === 1 ? [60, -172] : raise === 2 ? [46, -194] : [35, -78]];
  for (const [hx, hy] of hands) shape(() => C(hx, hy, 8), KIM.skin, 3);
  if (o.carrot && raise === 1) carrotArt(60, -186, 34, -1.2, o.gold);
  group([[() => { g.moveTo(-32, -132); g.quadraticCurveTo(-36, -100, -30, -74); g.lineTo(30, -74); g.quadraticCurveTo(36, -100, 32, -132); g.quadraticCurveTo(0, -142, -32, -132); g.closePath(); }, KIM.shirt]], 3);
  strokeOnly(() => { g.moveTo(-30, -80); g.lineTo(30, -80); }, '#3a2a48', 6);
  shape(() => { g.moveTo(-14, -138); g.quadraticCurveTo(0, -130, 14, -138); g.lineTo(12, -132); g.quadraticCurveTo(0, -126, -12, -132); g.closePath(); }, shade(KIM.shirt, -0.15), 2.2);
  shape(() => RR(-8, -148, 16, 14, 5), KIM.skinSh, 0);
  shape(() => E(-43, -182, 7, 10), KIM.skin, 2.6); shape(() => E(43, -182, 7, 10), KIM.skin, 2.6);
  shape(() => { g.moveTo(-42, -204); g.quadraticCurveTo(-46, -164, -20, -150); g.quadraticCurveTo(0, -146, 20, -150); g.quadraticCurveTo(46, -164, 42, -204); g.closePath(); }, KIM.hair, 3);
  strokeOnly(() => { g.moveTo(-24, -196); g.quadraticCurveTo(-22, -172, -12, -158); g.moveTo(22, -196); g.quadraticCurveTo(20, -172, 12, -158); }, KIM.hairSh, 2.2);
  const sw = o.sway || 0;
  shape(() => { g.moveTo(-9, -186); g.bezierCurveTo(-16 + sw, -160, -14 + sw * 1.5, -132, -2 + sw * 2, -110); g.bezierCurveTo(8 + sw * 1.5, -130, 12 + sw, -160, 9, -186); g.closePath(); }, KIM.hair, 3);
  strokeOnly(() => { g.moveTo(0, -180); g.quadraticCurveTo(-2 + sw, -150, 0 + sw * 2, -118); }, KIM.hairSh, 2.2);
  shape(() => E(0, -188, 11, 7), KIM.scrunchie, 2.4);
  shape(() => { g.moveTo(-46, -198); g.bezierCurveTo(-50, -262, 50, -262, 46, -198); g.quadraticCurveTo(0, -208, -46, -198); g.closePath(); }, KIM.helmet, 3);
  fillOnly(() => E(-16, -238, 16, 6, -0.3), 'rgba(255,255,255,.3)');
  strokeOnly(() => { g.moveTo(-40, -200); g.quadraticCurveTo(-42, -176, -36, -160); g.moveTo(40, -200); g.quadraticCurveTo(42, -176, 36, -160); }, '#1f1f28', 2.6);
  shape(() => C(0, -252, 4), shade(KIM.helmet, 0.2), 1.8);
  g.restore();
  return hands.map(([hx, hy]) => [x + hx * s, y + hy * s]); }
function carrotBasket(x, y, s, gold) { g.save(); g.translate(x, y); g.scale(s, s);
  for (let i = 0; i < 5; i++) carrotArt(-20 + i * 10, -18 - (i % 2) * 6, 34, -1.2 + i * 0.12, gold && i === 2);
  shape(() => { g.moveTo(-32, -10); g.lineTo(32, -10); g.lineTo(26, 20); g.lineTo(-26, 20); g.closePath(); }, '#d99a55', 3);
  clipTo(() => { g.moveTo(-32, -10); g.lineTo(32, -10); g.lineTo(26, 20); g.lineTo(-26, 20); g.closePath(); }, () => { g.strokeStyle = '#a8692f'; g.lineWidth = 2; for (let k = -32; k < 32; k += 8) { g.beginPath(); g.moveTo(k, -10); g.lineTo(k + 4, 20); g.stroke(); } g.beginPath(); g.moveTo(-32, 4); g.lineTo(32, 4); g.stroke(); });
  shape(() => { g.moveTo(-32, -10); g.lineTo(32, -10); g.lineTo(30, -4); g.lineTo(-30, -4); g.closePath(); }, '#e86a8a', 2);
  g.restore(); }
// ---------- the foal ----------
function foalH() { return S.foal ? { spec: S.foal.spec, items: {}, name: S.foal.name, col: {} } : null; }
function drawFoal(x, y, s, o = {}) { const f = foalH(); if (!f) return; if (o.pose && typeof o.pose === 'object') { drawHorse(x, y, s * 0.56, Object.assign({}, o, { coat: horseCoat(f) })); }
  else drawHorseC(f, x, y, s * 0.56, Object.assign({ pose: 'stand' }, o));
  if (o.label) { const fs = clamp(12 * s * 2.4, 11, 18); const w = measure(f.name, fs, F.title, 400) + 16; panel(x - w / 2, y + 4, w, fs * 1.5, fs * 0.75, '#ffd6e6', { lw: 2, shadow: false }); text(f.name, x, y + 4 + fs * 0.78, fs, INK, { fam: F.title, w: 400 }); } }
function foalSpec() { const h = HORSE(); const sp = h ? JSON.parse(JSON.stringify(h.spec)) : { b: 'chestnut', p: 'blanket', m: { star: 1 } }; sp.m = Object.assign({}, sp.m || {}, { star: 1 }); return sp; }
// ---------- shared interlude HUD + pause ----------
function interHud(L, title, col, shoes, onPause) { const u = L.u; const r = clamp(22 * u, 22, 30), cy = L.y0 + r + 8;
  ibtn('pause', L.x0 + 12 + r, cy, r, (x, y, rr) => icPause(x, y, rr), { fn: onPause, minHit: 52 });
  const fs = clamp(20 * u, 18, 28); const tw = measure(title, fs, F.title, 400) + 36; shape(() => RR(VW / 2 - tw / 2, cy - fs * 0.95, tw, fs * 1.9, fs * 0.95), col, 3); text(title, VW / 2, cy + 1, fs, '#fff', { fam: F.title, w: 400, stroke: shade(col, -0.4), sw: 5 });
  shoeCounter(L.x1 - 12, cy - r * 0.86, r * 1.72, shoes); return cy + r + 8; }
function interPause(sc, L) { const u = L.u; LAYER = 4; dim(0.5); backdropHit(null); const w = Math.min(L.cw - 40, 380), bh = clamp(60 * u, 56, 80), ht = bh * 3 + 100, x = VW / 2 - w / 2, y = L.y0 + (L.ch - ht) / 2;
  panel(x, y, w, ht, 24, '#fffaf2', { lw: 3.5 }); text('Paused', VW / 2, y + 40, clamp(26 * u, 24, 34), '#7446c4', { fam: F.title, w: 400 });
  btn('pResume', x + 20, y + 70, w - 40, bh, 'Keep playing', { col: '#6bd66b', fn: () => { sc.paused = false; } });
  btn('pRestart', x + 20, y + 80 + bh, w - 40, bh, 'Start again', { col: '#ffb02e', fn: () => { sc.paused = false; go(sc, sc.a, true); } });
  btn('pMap', x + 20, y + 90 + bh * 2, w - 40, bh, 'Back to the map', { col: '#9b8ab8', fn: () => { sc.paused = false; go(SC.map); } }); LAYER = 0; }
// intro card shown before each interlude (read aloud)
function interIntro(sc, L, title, col, rows, say, goLabel) { const u = L.u; LAYER = 3; dim(0.35); backdropHit(null); const fs = clamp(17 * u, 15, 23);
  const w = Math.min(L.cw - 24, 560); let need = fs * 4; const lines = rows.map(r => wrapLines(r[1], w - 100, fs, F.body, 700)); lines.forEach(ls => need += Math.max(fs * 2.4, ls.length * fs * 1.3 + 12)); const bh = clamp(60 * u, 56, 80); const ht = Math.min(L.ch - 20, need + bh + 40);
  const x = VW / 2 - w / 2, y = L.y0 + Math.max(10, (L.ch - ht) / 2 + (L.port ? L.ch * 0.08 : 0)); card(x, y, w, ht, title, col, { fill: '#fffaf2', fs: clamp(22 * u, 20, 28) });
  speakBtn('introSpk', x + w - 34, y + 34, clamp(22 * u, 22, 28), say, { minHit: 52 });
  let cy = y + fs * 2.6; rows.forEach(([ic, s], i) => { ic(x + 40, cy + fs * 0.7); lines[i].forEach((ln, k) => text(ln, x + 72, cy + fs * 0.7 + k * fs * 1.3, fs, INK, { align: 'left', fam: F.body, w: 700 })); cy += Math.max(fs * 2.4, lines[i].length * fs * 1.3 + 12); });
  btn('interGo', x + 24, y + ht - bh - 16, w - 48, bh, goLabel, { col: '#ff6f91', fn: () => { sc.intro = false; sc.t = 0; Voice.stop(); SFX.whinny('happy'); } }); LAYER = 0; }
// ---------- interlude results ----------
// a = { kind:'carrot'|'bow', l, slot, stars, pay, rows:[[ok,text]], replay }
function finishInter(sc, a) { const k = interKey(a.slot), i = a.l - 1; const prev = S.inter[k][i] || 0; const newStars = Math.max(0, a.stars - prev); S.inter[k][i] = Math.max(prev, a.stars);
  const base = a.pay + ECON.interFinish(a.l); const bonus = newStars * ECON.newStar; const total = Math.round((base + bonus) * interMult()); const golden = earn(total);
  S.stats.inters = (S.stats.inters || 0) + 1; let fact = null; if (a.kind === 'bow') { fact = nextFact(a.l); a.newFact = !S.facts[fact]; S.facts[fact] = 1; }
  save(); go(SC.ires, Object.assign(a, { total, bonus, golden, fact, finish: ECON.interFinish(a.l), first: prev === 0 })); }
SC.ires = { name: 'ires',
  enter(a) { this.a = a; this.t = 0; this.showFact = a.kind === 'bow' && a.newFact; Music.play('title');
    const line = (a.stars >= 3 ? 'Wow! Three stars! ' : a.stars === 2 ? 'Great job! ' : 'Nice try! ') + 'You earned ' + a.total + ' horseshoes!';
    setTimeout(() => { if (scene === this) Voice.say('ires', this.showFact ? line + ' Here\u2019s a fun fact. ' + factText(FACT_BY[a.fact]) : line); }, 500); },
  update(dt) { const pt = this.t; this.t += dt; for (let i = 0; i < 3; i++) { const at = 0.4 + i * 0.4; if (pt < at && this.t >= at && i < this.a.stars) { SFX.ding(i * 4); confetti(VW / 2 + (i - 1) * 70, VH * 0.25, 18); } } if (pt < 1.6 && this.t >= 1.6) SFX.coins(); },
  nextLabel() { const a = this.a; return a.l > 0 && a.slot + 1 < 3 ? 'Next race' : 'Map'; },
  next() { const a = this.a; if (a.slot + 1 < LANDS[a.l].races.length && raceOpen(a.l, a.slot + 1)) go(SC.treat, { l: a.l, r: a.slot + 1 }); else go(SC.map); },
  draw() { const a = this.a, L = lay(), u = L.u; if (a.kind === 'carrot') pastureBG(a.l, 0); else laneBGfull(a.l, 0); g.fillStyle = 'rgba(116,70,196,.28)'; g.fillRect(0, 0, VW, VH);
    const fs = clamp(17 * u, 15, 23); const short = L.ch < 520; const bh = short ? 50 : clamp(60 * u, 56, 80); const two = !L.port; const w = Math.min(L.cw - 24, two ? 980 : 600); const x = VW / 2 - w / 2;
    const cardW = two ? w * 0.52 : w; const ht = short ? L.ch - 40 : Math.min(L.ch - 24, fs * 1.65 * a.rows.length + bh * 2 + 230 * Math.min(1.2, u)); const y = L.y0 + (L.ch - ht) / 2;
    panel(x, y, cardW, ht, 26, '#fffaf2', { lw: 3.5 }); bannerRibbon(x + cardW / 2, y + 8, Math.min(cardW * 0.8, 360), clamp(46 * u, 44, 60), a.kind === 'carrot' ? '#ff9f43' : '#4cc3ff', interName(a.slot) + ' done!', clamp(21 * u, 18, 27));
    let cy = y + clamp(46 * u, 44, 60) + 14; const sr = short ? 17 : clamp(26 * u, 24, 38);
    for (let i = 0; i < 3; i++) { const sx = x + cardW / 2 + (i - 1) * sr * 2.6; const on = i < a.stars && this.t > 0.4 + i * 0.4; const k = on ? easeBack(clamp((this.t - 0.4 - i * 0.4) / 0.35, 0, 1)) : 1; g.save(); g.translate(sx, cy + sr); g.scale(k, k); shape(() => star(0, 0, sr), on ? '#ffd93d' : '#f0e8f4', 3.5); g.restore(); }
    cy += sr * 2 + 14;
    if (!short) a.rows.forEach(([ok, s]) => { if (ok) { shape(() => C(x + 34, cy + fs * 0.7, fs * 0.6), '#6bd66b', 2); icCheck(x + 34, cy + fs * 0.7, fs * 0.42); } else shape(() => C(x + 34, cy + fs * 0.7, fs * 0.6), '#eee', 2); text(s, x + 56, cy + fs * 0.7, fs, ok ? INK : '#8a7a9a', { align: 'left', fam: F.ui, w: 800, max: cardW - 80 }); cy += fs * 1.65; });
    cy += short ? 0 : 6; const ph = short ? 44 : clamp(56 * u, 52, 76); shape(() => RR(x + 20, cy, cardW - 40, ph, 18), '#fff3c4', 3); horseshoe(x + 52, cy + ph / 2 + 1, ph * 0.26);
    const shown = Math.round(a.total * clamp((this.t - 1.2) / 0.8, 0, 1)); text('+' + shown, x + 82, cy + ph / 2, ph * 0.55, '#b8860b', { align: 'left', fam: F.title, w: 400, stroke: '#fff', sw: 6 });
    text('horseshoes', x + 92 + measure('+' + a.total, ph * 0.55, F.title, 400), cy + ph / 2 + 2, fs, INK, { align: 'left', fam: F.ui, w: 800, max: cardW - 140 - measure('+' + a.total, ph * 0.55, F.title, 400) });
    box('iresPay', x + 20, cy, cardW - 40, ph); cy += ph + 6;
    const sub = (a.bonus ? '+' + a.bonus + ' new-star bonus \u00b7 ' : '') + 'Pouch: ' + S.wallet; text(sub, x + cardW / 2, cy + fs * 0.6, fs * 0.85, '#7a6a8a', { fam: F.ui, w: 800, max: cardW - 40 });
    if (a.golden) text('Lucky Jar full! A golden apple!', x + cardW / 2, cy + fs * 1.8, fs * 0.85, '#b8860b', { fam: F.ui, w: 800, max: cardW - 40 });
    const by = y + ht - bh - 14, bw = (cardW - 52) / 2;
    if (short) { const b3 = (cardW - 56) / 3; btn('iresStable', x + 20, by, b3, bh, 'Stable', { col: '#2fa39a', fn: () => go(SC.build) }); btn('iresAgain', x + 28 + b3, by, b3, bh, 'Again', { col: '#8a5cd6', fn: () => go(interScene(a.slot), { l: a.l, slot: a.slot, replay: true }) }); btn('iresNext', x + 36 + b3 * 2, by, b3, bh, this.nextLabel(), { col: '#ff6f91', fn: () => this.next() }); } else {
    btn('iresStable', x + 20, by - bh - 10, cardW - 40, bh, 'Spend at my Stable', { col: '#2fa39a', icon: (ix, iy, r) => icStable(ix, iy, r, '#fff'), fn: () => go(SC.build) });
    btn('iresAgain', x + 20, by, bw, bh, 'Play again', { col: '#8a5cd6', fn: () => go(interScene(a.slot), { l: a.l, slot: a.slot, replay: true }) });
    btn('iresNext', x + 32 + bw, by, bw, bh, this.nextLabel(), { col: '#ff6f91', fn: () => this.next() }); }
    // right side (landscape): the horse munching / fact card
    if (two) { const rx = x + cardW + 14, rw = w - cardW - 14; if (a.kind === 'bow') { factCard(rx, y, rw, ht, FACT_BY[a.fact], u); } else { const h = HORSE(); const gy = y + ht - 20, k = Math.min(rw / 520, ht / 520); if (h) drawHorseC(h, rx + rw * 0.45, gy, k, { pose: 'munch', expr: 'munch' }); carrotArt(rx + rw * 0.45 + 146 * k, gy - 186 * k, 40 * k, 0.2); if (S.foal) drawFoal(rx + rw * 0.8, gy, k, { pose: 'stand', flip: true }); heartsDraw(rx + rw * 0.6, y + ht * 0.3, k, this.t); } }
    else if (a.kind === 'bow') btn('iresFact', x + 20, Math.min(y + ht + 10, L.y1 - bh - 6), cardW - 40, bh, 'Fun fact!', { col: '#4cc3ff', fn: () => { this.showFact = true; Voice.say('fact', factText(FACT_BY[a.fact])); } });
    else { const h = HORSE(); const k = Math.min(L.cw / 900, (L.y1 - (y + ht)) / 380); if (h && k > 0.18) { drawHorseC(h, VW * 0.4, L.y1 - 6, k, { pose: 'munch', expr: 'munch' }); if (S.foal) drawFoal(VW * 0.72, L.y1 - 6, k, { pose: 'stand', flip: true }); } }
    if (this.showFact && L.port) { LAYER = 3; dim(0.45); backdropHit(() => { this.showFact = false; }); const fw = Math.min(L.cw - 24, 560), fh = Math.min(L.ch - bh - 60, 640, fw * 0.6 + 230); const fx = VW / 2 - fw / 2, fy = L.y0 + (L.ch - fh - bh - 14) / 2;
      factCard(fx, fy, fw, fh, FACT_BY[a.fact], u); hit('factBody', fx, fy, fw, fh, { bg: 1 }); btn('factOk', fx + 20, fy + fh + 12, fw - 40, bh, 'Cool!', { col: '#6bd66b', fn: () => { this.showFact = false; Voice.stop(); } }); LAYER = 0; }
  } };
