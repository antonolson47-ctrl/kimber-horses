/* ===================== MAIN: loop, input, layout, autosave, test hooks ===================== */
const saProbe = document.createElement('div'); saProbe.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);'; document.body.appendChild(saProbe);
function fit() { const nd = QS.get('dpr') ? +QS.get('dpr') : Math.min(window.devicePixelRatio || 1, 2); const w = Math.round(window.innerWidth), h = Math.round(window.innerHeight);
  if (nd !== DPR) sprClear(); DPR = nd; VW = w; VH = h; cv.style.width = w + 'px'; cv.style.height = h + 'px'; cv.width = Math.round(w * DPR); cv.height = Math.round(h * DPR);
  const cs = getComputedStyle(saProbe); SA = { t: parseFloat(cs.paddingTop) || 0, r: parseFloat(cs.paddingRight) || 0, b: parseFloat(cs.paddingBottom) || 0, l: parseFloat(cs.paddingLeft) || 0 };
  if (QS.get('sa')) { const [a, b, c, d] = QS.get('sa').split(',').map(Number); SA = { t: a, r: b, b: c, l: d }; }
  for (const k in SCROLL) { SCROLL[k].vel = 0; } }
window.addEventListener('resize', fit); window.addEventListener('orientationchange', () => setTimeout(fit, 120)); if (window.visualViewport) window.visualViewport.addEventListener('resize', fit);
function ptXY(e) { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
function fire(h, x, y) { if (!h) return; if (h.sfx !== 0 && h.fn) (h.id === 'back' || h.id.endsWith('Close') ? SFX.back : SFX.ui)(); if (h.fn) h.fn(x, y); }
cv.addEventListener('pointerdown', e => { e.preventDefault(); audioInit(); Voice.unlock(); try { cv.setPointerCapture(e.pointerId); } catch (er) { }
  if (fadeDir) return; const [x, y] = ptXY(e); const h = hitAt(x, y), sc = scrollAt(x, y);
  const p = { x0: x, y0: y, x, y, h, sc, moved: false, lt: performance.now(), ly: y, lx: x, vx: 0, vy: 0 }; PTR.set(e.pointerId, p);
  if (h) { if (h.hold) { if (!HELD.has(h.id)) HELDT[h.id] = performance.now(); HELD.add(h.id); } if (h.down) { h.down(x, y); p.h = null; } else PRESSED = h.id; }
  else if (!sc && scene && scene.ptr) { p.raw = true; scene.ptr('down', x, y, e.pointerId); }
  if (sc) sc.scroll.vel = 0; }, { passive: false });
cv.addEventListener('pointermove', e => { const p = PTR.get(e.pointerId); if (!p) return; const [x, y] = ptXY(e); const now = performance.now(); const dtm = Math.max(1, now - p.lt);
  const dx = x - p.lx, dy = y - p.ly; p.lx = x; p.ly = y; p.lt = now; if (p.raw && scene && scene.ptr) scene.ptr('move', x, y, e.pointerId);
  if (!p.moved && Math.hypot(x - p.x0, y - p.y0) > 10) { p.moved = true; if (p.sc && p.h && !p.h.hold) { PRESSED = null; } }
  if (p.moved && p.sc && !(p.h && p.h.hold)) { const st = p.sc.scroll; st.drag = true; const d = p.sc.horiz ? dx : dy; st.v -= d; const v = -d / dtm * 1000; st.vel = st.vel * 0.6 + v * 0.4; }
  if (p.h && p.h.hold) { const inside = x >= p.h.x - 20 && x <= p.h.x + p.h.w + 20 && y >= p.h.y - 20 && y <= p.h.y + p.h.h + 20; if (!inside) HELD.delete(p.h.id); else { if (!HELD.has(p.h.id)) HELDT[p.h.id] = performance.now(); HELD.add(p.h.id); } } }, { passive: false });
function endPtr(e, cancel) { const p = PTR.get(e.pointerId); if (!p) return; PTR.delete(e.pointerId); const [x, y] = ptXY(e); if (p.raw && scene && scene.ptr) scene.ptr(cancel ? 'cancel' : 'up', x, y, e.pointerId);
  if (p.h && p.h.hold) { let still = false; for (const q of PTR.values()) if (q.h && q.h.id === p.h.id) still = true; if (!still) HELD.delete(p.h.id); }
  if (p.sc) { p.sc.scroll.drag = false; if (performance.now() - p.lt > 80) p.sc.scroll.vel = 0; }
  if (!cancel && p.h && !p.h.hold && !(p.moved && p.sc) && PRESSED === p.h.id) { const cur = hitAt(x, y); if (cur && cur.id === p.h.id) fire(cur, x, y); else if (!p.sc && x >= p.h.x && x <= p.h.x + p.h.w && y >= p.h.y && y <= p.h.y + p.h.h) fire(p.h, x, y); }
  if (PRESSED === (p.h && p.h.id)) PRESSED = null; }
cv.addEventListener('pointerup', e => endPtr(e, false)); cv.addEventListener('pointercancel', e => endPtr(e, true)); cv.addEventListener('lostpointercapture', e => { if (PTR.has(e.pointerId)) endPtr(e, true); });
cv.addEventListener('wheel', e => { const [x, y] = ptXY(e); const sc = scrollAt(x, y); if (sc) { sc.scroll.v += sc.horiz ? (e.deltaX || e.deltaY) : e.deltaY; sc.scroll.vel = 0; e.preventDefault(); } }, { passive: false });
cv.addEventListener('contextmenu', e => e.preventDefault()); document.addEventListener('gesturestart', e => e.preventDefault()); document.addEventListener('dblclick', e => e.preventDefault());
window.addEventListener('keydown', e => { audioInit(); if (e.repeat && !['Backspace'].includes(e.key)) { if (scene && scene.name === 'race') e.preventDefault(); return; }
  if (Settings.open && e.key === 'Escape') { Settings.open = false; return; }
  let used = scene && scene.key ? scene.key(e.key, e) : false;
  if (!used && e.key === 'Escape') { const b = LAST.find(h => h.id === 'back'); if (b) fire(b); }
  if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace'].includes(e.key)) e.preventDefault(); });
window.addEventListener('keyup', e => { if (scene && scene.keyup) scene.keyup(e.key); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { save(); Voice.stop(); HELD.clear(); if (AC && AC.state === 'running') AC.suspend().catch(() => { }); if (scene && scene.name === 'race' && scene.phase === 'run') scene.paused = true; } else if (AC) { AC.resume().catch(() => { }); } });
window.addEventListener('pagehide', save);
// runtime icon + manifest (the GitHub Pages copy also ships real PNG icons)
function makeIconCanvas(sz) { const c = mkCanvas(sz, sz); drawInto(c, () => { const k = sz / 512; g.scale(k, k); g.fillStyle = lin(0, 0, 0, 512, [[0, '#b07bff'], [1, '#ff8fb1']]); g.fillRect(0, 0, 512, 512); ribbon(-20, 150, 532, 110, 18, 120, { sparkles: 8 }); drawHorse(250, 480, 1.25, { pose: 'proud', coat: { b: 'chestnut', p: 'blanket', m: { star: 1 } }, noShadow: true, outfit: outfitOf(null, { only: { bridle: 'H8', rosette: 'M4' } }) }); }); return c; }
function setIcons() { try { if (document.querySelector('link[rel="apple-touch-icon"]')) return; const c = makeIconCanvas(180); const l = document.createElement('link'); l.rel = 'apple-touch-icon'; l.href = c.toDataURL('image/png'); document.head.appendChild(l); const f = document.createElement('link'); f.rel = 'icon'; f.href = makeIconCanvas(64).toDataURL('image/png'); document.head.appendChild(f); } catch (e) { } }
// photo export: share sheet when available (iOS "Save Image"), else download
function savePhoto(drawFn, name) { const W = 1200, H = 1200; const c = mkCanvas(W, H); drawInto(c, () => drawFn(c, W, H)); SFX.stamp(); toast('Say cheese!', '#3f6fd8');
  c.toBlob(b => { if (!b) return; const file = typeof File !== 'undefined' ? new File([b], name, { type: 'image/png' }) : null;
    if (file && navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) { navigator.share({ files: [file], title: 'Kimber & the Rainbow Ribbon' }).catch(() => { }); return; }
    const url = URL.createObjectURL(b); const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 4000); }, 'image/png'); }
// main loop
let lastT = performance.now(), errCount = 0;
function frame(now) { requestAnimationFrame(frame); DT = Math.min(0.05, (now - lastT) / 1000); lastT = now; T += DT;
  try { HITS = []; BOXES = []; LAYER = 0; CLIPS.length = 0; g.setTransform(DPR, 0, 0, DPR, 0, 0); g.lineJoin = 'round'; g.lineCap = 'round'; g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    fadeUpdate(DT); if (scene.update) scene.update(DT); g.save(); scene.draw(); g.restore(); if (Settings.open && scene.name !== 'map') settingsModal(); fxUpdate(DT); fxDraw(); fadeDraw();
    LAST = HITS; LASTBOX = BOXES; saveT += DT; if (saveT > 15) { saveT = 0; save(); }
  } catch (e) { errCount++; if (window.__KH) __KH.errors.push(String(e && e.stack || e)); if (errCount < 5) console.error(e); } }
// test hooks (harmless for players)
window.__KH = { speed: 1, errors: [], get S() { return S; }, scene: () => scene && scene.name, hits: () => LAST.map(h => ({ id: h.id, x: h.x, y: h.y, w: h.w, h: h.h, layer: h.layer, bg: !!h.bg, scroll: !!h.scroll, hold: !!h.hold, clipped: !!h.clipped, act: !!(h.fn || h.down || h.hold) && !h.dis })), boxes: () => LASTBOX.map(b => ({ id: b.id, x: b.x, y: b.y, w: b.w, h: b.h, layer: b.layer })),
  go: (n, a) => go(SC[n], a, true), spr: () => [SPR.size, Math.round(SPRPX / 1e6)], tap: id => { const h = LAST.find(q => q.id === id); if (h && (h.fn || h.down)) { (h.down || h.fn)(); return true; } return false; }, aud: AUD, fading: () => fadeDir !== 0, race: () => scene && scene.name === 'race' ? { x: scene.x, len: scene.len, phase: scene.phase, bumps: scene.bumps, shoes: scene.shoes } : null, save: () => save(), reset: () => { S = freshSave(); save(); }, settings: o => { Object.assign(S.set, o); save(); }, vw: () => [VW, VH, SA], sc: () => scene, econ: () => ECON_TOTALS, inter: () => { const s = scene; if (!s) return null; if (s.name === 'carrot') { const G = s.geo(); return { intro: s.intro, left: s.left, caught: s.caught, flying: s.flying.length, whirl: !!s.whirl, horses: s.horses.map(H => { const p = s.hpos(H, G); return { mx: p.mouth[0], my: p.mouth[1], x: p.x, y: p.y }; }), hz: G.hz, hand: G.hand }; } if (s.name === 'bow') { const G = laneGeo(); return { intro: s.intro, left: s.left, hits: s.hits, drawing: s.draw0 >= 0, targets: s.live(G).map(([T, p]) => ({ x: p.x, y: p.y, r: p.r, dz: p.dz })) }; } if (s.name === 'drive') return { x: s.x, len: s.len, done: s.done, intro: s.intro, res: s.res }; return null; }, scroll: (id, v) => scrollTo(id, v), iconURL: n => makeIconCanvas(n).toDataURL('image/png') };
// boot
loadSave(); applyKimColors(); fit(); setIcons();
(document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1500))]) : Promise.resolve()).then(() => { sprClear(); });
go(SC.title, null, true); requestAnimationFrame(frame);
