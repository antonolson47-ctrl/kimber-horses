/* ===================== GAME HELPERS: horses, outfits, unlocks, cached renders ===================== */
function newHorse(breed, spec, name) { return { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name, breed, spec: JSON.parse(JSON.stringify(spec)), items: { saddle: 'S5', pad: 'B7', bridle: 'H8' }, col: {}, born: Date.now() }; }
const _coatC = new Map();
function horseCoat(h) { const spec = h ? h.spec : { b: 'chestnut', p: 'blanket', m: { star: 1 } }; const k = JSON.stringify(spec); let c = _coatC.get(k); if (!c) { c = makeCoat(spec); _coatC.set(k, c); } return c; }
function isUnlocked(id) { return !!(S.set.unlockAll || STARTER_ITEMS.includes(id) || S.unlocked[id]); }
function itemCols(h, id) { const it = ITEM_BY[id]; const c = h && h.col[id]; return it.ch.map((ch, i) => c && c[i] !== undefined ? c[i] : ch.o[0]); }
function outfitOf(h, o = {}) { const items = Object.assign({}, h ? h.items : {}); if (o.only) { for (const k in items) delete items[k]; Object.assign(items, o.only); } const col = {}; for (const s in items) col[items[s]] = itemCols(h, items[s]);
  const out = { items, col, tailBag: items.tail === 'M5', tailBagCols: items.tail === 'M5' ? col.M5[0] : null };
  if (o.rider) { const skirt = items.saddle === 'S6' ? col.S6[1] : null; out.rider = pose => kimberRider(pose, { duck: o.duck, skirt }); }
  return out; }
function outfitKey(h, o = {}) { return JSON.stringify([h ? h.spec : 0, h ? h.items : 0, h ? h.col : 0, o.rider ? KIM.helmet + KIM.shirt : 0, o.duck ? 1 : 0, o.only || 0, o.expr || '', threadsWon().length]); }
// cached full-horse render. bbox in horse units: x -190..190, y -350..24
function horseSpr(h, pose, s, o = {}) { const pk = typeof pose === 'string' ? pose : 'p' + (o.poseKey || JSON.stringify(pose)); const key = 'H' + pk + '|' + s.toFixed(3) + '|' + outfitKey(h, o);
  return sprite(key, 380 * s, 374 * s, () => drawHorse(190 * s, 350 * s, s, { pose, coat: horseCoat(h), outfit: outfitOf(h, o), expr: o.expr, noShadow: o.noShadow })); }
function drawHorseC(h, x, y, s, o = {}) { const spr = horseSpr(h, o.pose || 'stand', s, o); if (o.flip) { g.save(); g.translate(x, y); g.scale(-1, 1); blit(spr, -190 * s, -350 * s, 380 * s, 374 * s); g.restore(); } else blit(spr, x - 190 * s, y - 350 * s, 380 * s, 374 * s); }
// item thumbnail: the horse (current coat) wearing only that item, zoomed to the item
function itemThumb(it, h, x, y, sz, o = {}) {
  const c = itemCols(h, it.id); const coat = horseCoat(h); const lockd = o.locked;
  const key = 'T' + it.id + JSON.stringify(c) + JSON.stringify(h ? h.spec : 0) + (lockd ? 'L' : '') + Math.round(sz) + (it.id === 'A1' ? threadsWon().join('') : '');
  const spr = sprite(key, sz, sz, () => {
    const [cx, cy, k] = it.thumb || THUMB_C[it.slot]; const sc = sz / 170 * k;
    g.save(); g.translate(sz / 2, sz / 2); g.scale(sc, sc); g.translate(-cx, -cy);
    const only = {}; only[it.slot] = it.id; const out = outfitOf(h, { only });
    if (lockd) { g.globalAlpha = 1; drawHorse(0, 0, 1, { coat, noShadow: true, outfit: out, lw: 3 }); g.globalCompositeOperation = 'source-atop'; g.fillStyle = 'rgba(214,204,226,.86)'; g.fillRect(-400, -500, 800, 700); g.globalCompositeOperation = 'source-over'; }
    else drawHorse(0, 0, 1, { coat, noShadow: true, outfit: out, lw: 3.4 });
    g.restore(); });
  blit(spr, x, y, sz, sz);
}
function stallsOpen() { let n = 3; for (let i = 0; i < 3; i++) if (S.prog.ch[i].grand) n++; return n; }
// called once when a race finishes. returns {first, newItems, stars, shoesTotal, golden}
function awardRace(l, r, stars, shoes, stickers) {
  const prev = raceStars(l, r), first = prev === 0; const best = Math.max(prev, stars);
  if (l === 0) S.prog.prologue[0] = best; else S.prog.ch[l - 1].races[r] = best;
  const newItems = [];
  if (first) { for (const id of UNLOCK_QUEUE) { if (newItems.length >= 2) break; if (!S.unlocked[id] && !STARTER_ITEMS.includes(id)) { S.unlocked[id] = 1; newItems.push(id); } } }
  const before = S.shoes; const lucky = owns('k2') ? Math.round(shoes * 0.1) : 0; const golden = earn(shoes + lucky);
  for (const st of stickers) S.stickers[st] = 1;
  S.stats.races++; save();
  return { first, newItems, stars, best, golden, shoes, before, lucky };
}
function grandReady(l) { if (l === 0) return S.prog.prologue[0] > 0 && !S.prog.seen.grand0; return S.prog.ch[l - 1].races.every(x => x > 0) && !S.prog.ch[l - 1].grand; }
function awardGrand(l) { const out = { academy: null };
  if (l === 0) S.prog.seen.grand0 = 1; else { S.prog.ch[l - 1].grand = true; const a = ACADEMY_REWARD[l]; if (a) { S.unlocked[a] = 1; out.academy = a; } }
  if (!S.rosettes.includes(l)) S.rosettes.push(l); if (l >= 1) { S.truck.tok = Math.min(3, (S.truck.tok || 0) + 1); if (S.shop.built) S.fix.tok = Math.min(3, (S.fix.tok || 0) + 1); } save(); return out; }
function nextStoryFor(l) { return l < 7 ? 'c' + (l + 1) : null; }
function allRacesDone() { return S.prog.ch.every(c => c.grand); }
// faded-colors overlay for lands whose thread has not returned yet
function fadeColors(amount) { if (amount <= 0) return; g.save(); g.globalCompositeOperation = 'saturation'; g.fillStyle = `rgba(128,128,128,${amount})`; g.fillRect(0, 0, VW, VH); g.restore(); }
function desatCtx(cx, amt) { try { const c = cx.canvas; const d = cx.getImageData(0, 0, c.width, c.height), a = d.data; for (let i = 0; i < a.length; i += 4) { const l = a[i] * 0.3 + a[i + 1] * 0.59 + a[i + 2] * 0.11; a[i] += (l - a[i]) * amt; a[i + 1] += (l - a[i + 1]) * amt; a[i + 2] += (l - a[i + 2]) * amt; } cx.putImageData(d, 0, 0); } catch (e) { } }
function desatHex(hex, amt) { if (!amt) return hex; const n = parseInt(hex.slice(1), 16); let r = n >> 16, gg = (n >> 8) & 255, b = n & 255; const l = r * 0.3 + gg * 0.59 + b * 0.11; r = Math.round(r + (l - r) * amt); gg = Math.round(gg + (l - gg) * amt); b = Math.round(b + (l - b) * amt); return '#' + ((1 << 24) + (r << 16) + (gg << 8) + b).toString(16).slice(1); }
const FADE = 0.5; function landFaded(l) { return l > 0 && !landDone(l); }
function trophy(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s);
  shape(() => RR(-36, -16, 72, 16, 4), '#8a5a3a', 3); shape(() => RR(-26, -34, 52, 18, 4), '#a8693e', 3);
  shape(() => { g.moveTo(-8, -34); g.lineTo(8, -34); g.lineTo(5, -60); g.lineTo(-5, -60); g.closePath(); }, '#f2c14e', 3);
  for (const sx of [-1, 1]) strokeOnly(() => { g.moveTo(sx * 30, -120); g.bezierCurveTo(sx * 62, -122, sx * 58, -84, sx * 22, -80); }, INK, 9), strokeOnly(() => { g.moveTo(sx * 30, -120); g.bezierCurveTo(sx * 62, -122, sx * 58, -84, sx * 22, -80); }, '#f2c14e', 5);
  shape(() => { g.moveTo(-40, -132); g.lineTo(40, -132); g.bezierCurveTo(40, -86, 20, -62, 0, -60); g.bezierCurveTo(-20, -62, -40, -86, -40, -132); g.closePath(); }, '#f6c343', 3);
  fillOnly(() => E(-18, -112, 7, 16, 0.2), 'rgba(255,255,255,.55)'); shape(() => star(0, -100, 14), '#fff3a8', 2);
  ribbon(-50, -140, 50, -140, 3, 14, { sparkles: 3, seed: 9 }); g.restore(); }
// sticker art for a stop (name -> stable icon)
function stickerArt(name, x, y, r, landId, have) { const col = LANDS[landId].col;
  g.save(); if (!have) g.globalAlpha = 0.35;
  shape(() => { for (let k = 0; k < 16; k++) { const a = k * TAU / 16; const rr = k % 2 ? r : r * 0.9; k ? g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : g.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.closePath(); }, have ? '#fff' : '#eee', 2.5);
  shape(() => C(x, y, r * 0.74), have ? col : '#ccc', 2.5);
  const h = hashStr(name) % 6; const s = r / 40;
  g.save(); g.translate(x, y + r * 0.1); g.scale(s, s);
  if (!have) { icLock(0, -4, 16, '#fff'); }
  else if (h === 0) apple(0, 0, 14); else if (h === 1) horseshoe(0, 0, 14); else if (h === 2) shape(() => star(0, -2, 18), '#ffd93d', 2.5); else if (h === 3) shape(() => heart(0, 4, 17), '#ff6f91', 2.5); else if (h === 4) flower(0, 0, 2.2, '#ff8fb1'); else sunflower(0, 2, 1.0);
  g.restore(); g.restore(); }
