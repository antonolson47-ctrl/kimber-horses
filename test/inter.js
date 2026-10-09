// Interludes + building touch playthrough: node inter.js "<device>"
const pw = require('playwright'); const fs = require('fs');
const devName = process.argv[2] || 'Pixel 7'; const dev = pw.devices[devName]; const WK = dev.defaultBrowserType === 'webkit'; const engine = WK ? pw.webkit : pw.chromium;
const tag = devName.replace(/[^a-z0-9]+/gi, '_'); const shotDir = __dirname + '/../screenshots/interludes_final/' + tag; fs.mkdirSync(shotDir, { recursive: true });
const problems = []; const log = (...a) => console.log('[' + tag + ']', ...a); const T0 = Date.now();
(async () => {
  const b = await engine.launch(); const ctx = await b.newContext({ ...dev }); const p = await ctx.newPage(); const errs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', e => errs.push('pageerror: ' + e.message + ' ' + String(e.stack || '').split('\n').slice(0, 3).join(' | ')));
  const cdp = WK ? null : await ctx.newCDPSession(p);
  await p.goto('file://' + __dirname + '/../KimberHorses.html' + (devName.startsWith('iPhone') ? '?sa=47,0,34,0' : '')); await p.waitForTimeout(1200);
  await p.evaluate(() => { localStorage.clear(); __KH.reset(); });
  const sc = () => p.evaluate(() => __KH.scene()); const W = () => p.waitForTimeout.bind(p);
  const settle = async () => { for (let i = 0; i < 40; i++) { if (!(await p.evaluate(() => __KH.fading()))) break; await p.waitForTimeout(50); } await p.waitForTimeout(120); };
  let shotN = 0; const shot = async name => { const f = `${shotDir}/${String(++shotN).padStart(2, '0')}_${name}.png`; await p.screenshot({ path: f }); return f; };
  // ---- real touch input ----
  const ev = (type, x, y) => p.evaluate(([type, x, y]) => { const r = cv.getBoundingClientRect(); cv.dispatchEvent(new PointerEvent(type, { pointerId: 11, pointerType: 'touch', isPrimary: true, clientX: x + r.left, clientY: y + r.top, bubbles: true, cancelable: true, pressure: type === 'pointerup' ? 0 : 0.5 })); }, [type, x, y]);
  const tdown = async (x, y) => cdp ? cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] }) : ev('pointerdown', x, y);
  const tmove = async (x, y) => cdp ? cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y, id: 1 }] }) : ev('pointermove', x, y);
  const tup = async (x, y) => cdp ? cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }) : ev('pointerup', x, y);
  const swipe = async (x0, y0, x1, y1, ms = 240, n = 8) => { await tdown(x0, y0); for (let i = 1; i <= n; i++) { await p.waitForTimeout(ms / n); await tmove(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n); } await tup(x1, y1); };
  const tapXY = (x, y) => p.touchscreen.tap(x, y);
  const getHit = id => p.evaluate(id => __KH.hits().filter(h => h.id === id).pop(), id);
  const tap = async (id, opt = {}) => { await settle(); let h = null; for (let i = 0; i < (opt.tries || 60); i++) { h = await getHit(id); if (h && (h.act || opt.any)) break; await p.waitForTimeout(100); }
    if (!h) { const ids = await p.evaluate(() => __KH.hits().map(h => h.id).join(',')); throw new Error('no hit ' + id + ' in ' + (await sc()) + ' have: ' + ids); }
    await tapXY(h.x + h.w / 2, h.y + h.h / 2); await p.waitForTimeout(opt.wait || 160); await settle(); };
  const has = id => p.evaluate(id => __KH.hits().some(h => h.id === id && h.act), id);
  const waitScene = async (name, ms = 120000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if ((await sc()) === name) { await settle(); return; } await p.waitForTimeout(200); } throw new Error('timeout waiting for ' + name + ' (at ' + (await sc()) + ')'); };
  const typeName = async s => { for (const ch of s.toUpperCase()) await tap(ch === ' ' ? 'kSpace' : 'k' + ch, { wait: 60 }); };
  async function story() { await waitScene('story'); while ((await sc()) === 'story') await tap('storyNext', { wait: 250 }); }
  async function treatAndRace(l, r) { await waitScene('treat'); const opts = await p.evaluate(() => __KH.hits().filter(h => h.id.startsWith('tr_')).map(h => h.id)); const need = l >= 4 ? 3 : 2;
    for (const id of opts.slice(0, need)) await tap(id, { wait: 400 }); await tap('hugMom', { wait: 300 }); for (let i = 0; i < 100; i++) { if (await has('rideGo')) break; await p.waitForTimeout(100); } await tap('rideGo');
    await waitScene('race'); await p.evaluate(() => { __KH.speed = 5; __KH.settings({ helper: true }); });
    const t0 = Date.now(); while ((await sc()) === 'race' && Date.now() - t0 < 150000) { const st = await p.evaluate(() => __KH.race()); if (st && st.phase === 'stop') { const ids = await p.evaluate(() => __KH.hits().filter(h => /^(stop|ans|opt|pick)/.test(h.id) && h.act).map(h => h.id)); if (ids.length) { await p.evaluate(() => { __KH.speed = 1; }); await tap(ids[0], { wait: 300 }); await p.evaluate(() => { __KH.speed = 5; }); } } await p.waitForTimeout(250); }
    await waitScene('results'); await p.evaluate(() => { __KH.speed = 1; }); await p.waitForTimeout(1800); }
  // byKey picks a visible tile in a horizontal sheet, swiping it into view with a real touch swipe
  async function tile(id, area) { for (let i = 0; i < 14; i++) { const h = await getHit(id); const [VW] = await p.evaluate(() => __KH.vw()); if (h && h.x >= 0 && h.x + h.w <= VW) return tap(id); const a = await p.evaluate(n => { const H = __KH.hits().filter(h => h.id.startsWith(n)); return H.length ? { y: H[0].y + H[0].h / 2 } : null; }, area); const dir = h && h.x < 0 ? 1 : -1; await swipe(220 - dir * 90, a.y, 220 + dir * 90, a.y, 260); await p.waitForTimeout(500); } throw new Error('cannot reach tile ' + id); }

  async function carrot(shotPrefix) { await waitScene('carrot'); await p.waitForTimeout(600); await shot(shotPrefix + '_intro'); await tap('interGo'); let n = 0, caughtShot = false, prevC = 0;
    const t0 = Date.now(); while ((await sc()) === 'carrot' && Date.now() - t0 < 120000) { const st = await p.evaluate(() => __KH.inter()); if (!st) break;
      if (st.caught > prevC && !caughtShot) { caughtShot = true; await shot(shotPrefix + '_catch'); } prevC = st.caught;
      if (st.left > 0 && st.flying === 0) { const H = st.horses[n % st.horses.length]; const [VW, VH] = await p.evaluate(() => __KH.vw());
        if (n % 2 === 0) await tapXY(H.mx, H.my); else { const hx = VW / 2, hy = VH * 0.86; await swipe(hx, hy, hx + (H.mx - hx) / 2.6, hy + (H.my - hy) / 2.6, 200); }
        n++; await p.waitForTimeout(250); if (n === 3 && !caughtShot) await shot(shotPrefix + '_flying'); } else await p.waitForTimeout(120); }
    const st = await p.evaluate(() => __KH.S.inter); log('carrot done, throws', n, 'stars', JSON.stringify(st)); }
  async function bow(shotPrefix) { await waitScene('bow'); await p.waitForTimeout(600); await shot(shotPrefix + '_intro'); await tap('interGo'); let n = 0, hitShot = false, prevH = 0;
    const t0 = Date.now(); while ((await sc()) === 'bow' && Date.now() - t0 < 150000) { const st = await p.evaluate(() => __KH.inter()); if (!st) break;
      if (st.hits > prevH && !hitShot) { hitShot = true; await p.waitForTimeout(450); await shot(shotPrefix + '_hit'); } prevH = st.hits;
      if (st.left > 0 && !st.drawing && st.targets.some(t => t.dz < 12)) { const [VW, VH] = await p.evaluate(() => __KH.vw()); const x = VW * 0.5, y = VH * 0.62; await tdown(x, y); await p.waitForTimeout(350); if (n === 1) await shot(shotPrefix + '_drawing'); await tmove(x + 4, y + 3); await p.waitForTimeout(400); await tup(x + 4, y + 3); n++; await p.waitForTimeout(700); }
      else await p.waitForTimeout(150); }
    log('bow done, shots', n, 'stars', JSON.stringify(await p.evaluate(() => __KH.S.inter))); }
  async function ires(prefix) { await waitScene('ires'); await p.waitForTimeout(1500); if (await has('factOk')) { await shot(prefix + '_funfact'); await tap('factOk'); await p.waitForTimeout(300); } await shot(prefix + '_results'); if (await has('iresFact')) { await tap('iresFact'); await p.waitForTimeout(500); await shot(prefix + '_funfact_again'); await tap('factOk'); } }

  const LATE = process.argv.includes('--late');
  if (LATE) { await p.evaluate(() => { S.started = 1; S.horses = [newHorse('appaloosa', { b: 'bay', p: 'blanket', m: { star: 1 } }, 'Freckles')]; S.cur = 0; S.prog.prologue[0] = 2; S.prog.ch[0].races = [2, 2, 2]; S.prog.ch[0].grand = 1; S.started = true; S.inter.c[0] = 3; S.inter.a[0] = 3; S.wallet = 440; S.truck.tok = 1; __KH.save(); __KH.go('build'); }); }
  else {
  // ---------- prologue ----------
  await tap('play'); await story();
  await waitScene('coat'); await tap('br2'); await tap('co2'); await tap('pickHorse');
  await waitScene('name'); await typeName('freckles'); await tap('kDone');
  await story(); await treatAndRace(0, 0); await tap('resNext'); await waitScene('grand'); await p.waitForTimeout(3500); await tap('grandCont'); await story(); await waitScene('map'); log('prologue done, wallet', await p.evaluate(() => __KH.S.wallet));
  // ---------- chapter 1 with both interludes ----------
  await tap('land1', { wait: 300 }); await shot('land_panel'); await tap('ride0'); await treatAndRace(1, 0); await shot('race_results_to_carrot');
  const lbl = await p.evaluate(() => __KH.sc().name); await tap('resNext'); await carrot('carrot'); await ires('carrot'); await tap('iresNext');
  await treatAndRace(1, 1); await tap('resNext'); await bow('archery'); await ires('archery'); await tap('iresNext');
  await treatAndRace(1, 2); await tap('resNext'); await waitScene('grand'); await p.waitForTimeout(3500); await tap('grandCont'); await story(); await waitScene('map');
  log('chapter 1 done, wallet', await p.evaluate(() => __KH.S.wallet), 'interludes', JSON.stringify(await p.evaluate(() => __KH.S.inter)));
  // replay Carrot Toss from the map land panel
  await tap('land1', { wait: 300 }); await tap('inter0'); await carrot('replay_carrot'); await waitScene('ires'); await tap('iresStable');
  }
  // ---------- stable: buy an upgrade with earned horseshoes ----------
  await waitScene('build'); await p.waitForTimeout(800); await shot('stable_early');
  const w = await p.evaluate(() => __KH.S.wallet); const want = w >= 300 ? 'b_c2' : 'b_haynet'; await tile(want, 'b_'); await p.waitForTimeout(300); await shot('stable_buy_modal'); await tap('buyYes'); await p.waitForTimeout(2600); await shot('stable_bought');
  log('bought', want, 'wallet', w, '->', await p.evaluate(() => __KH.S.wallet), 'own', JSON.stringify(await p.evaluate(() => __KH.S.build.own)));
  // ---------- garage (opens after the Chapter 1 Grand Stop) ----------
  await tap('toGarage'); await waitScene('garage'); await p.waitForTimeout(600);
  const pickOpt = async (ci, oi) => { for (let i = 0; i < 8; i++) { const h = await getHit('gcat' + ci); const [VW] = await p.evaluate(() => __KH.vw()); if (h && h.x >= 0 && h.x + h.w <= VW) break; const a = await getHit('scroll_tmpGcat'); const dir = h && h.x < 0 ? 1 : -1; await swipe(VW / 2 - dir * 100, a.y + a.h / 2, VW / 2 + dir * 100, a.y + a.h / 2, 250); await p.waitForTimeout(500); } await tap('gcat' + ci); const ids = await p.evaluate(() => __KH.hits().filter(h => h.id.startsWith('opt_') && h.act).map(h => h.id)); const id = ids[Math.min(oi, ids.length - 1)]; if (id) await tap(id); };
  await pickOpt(0, 1); await pickOpt(1, 1); await pickOpt(3, 2); await shot('garage_ch1');
  await tap('showOff'); await waitScene('drive'); await p.waitForTimeout(500); await tap('interGo').catch(async () => { const ids = await p.evaluate(() => __KH.hits().map(h => h.id)); log('drive intro ids', ids); });
  { const t0 = Date.now(); let k = 0; while (Date.now() - t0 < 90000) { const st = await p.evaluate(() => __KH.inter()); if (!st || st.done) break; if (await has('honk')) { await tap(k % 2 ? 'honk' : 'bounce', { wait: 60 }); k++; if (k === 8) await shot('drive'); } await p.waitForTimeout(250); }
    await p.waitForTimeout(1500); await shot('drive_results'); log('drive', JSON.stringify(await p.evaluate(() => __KH.inter()))); }
  await tap('dGarage'); await waitScene('garage');
  // ---------- inject later-chapter progress (Ch1-4 done + horseshoes) to reach the Nursery, Mom's shop and more truck parts ----------
  await p.evaluate(() => { const S = __KH.S; for (let l = 2; l <= 4; l++) { const c = S.prog.ch[l - 1]; for (let r = 0; r < 3; r++) c.races[r] = Math.max(c.races[r] || 0, 2); c.grand = c.grand || 1; S.inter.c[l - 1] = S.inter.c[l - 1] || 2; S.inter.a[l - 1] = S.inter.a[l - 1] || 2; } S.wallet += 2600; S.shoes += 2600; __KH.save(); });
  log('injected', JSON.stringify(await p.evaluate(() => ({ w: __KH.S.wallet, ch: __KH.S.prog.ch.map(c => c.grand) }))));
  await p.evaluate(() => __KH.go('garage')); await waitScene('garage'); await p.waitForTimeout(400);
  await pickOpt(0, 2); await pickOpt(1, 3); await pickOpt(2, 3); await pickOpt(3, 5); await pickOpt(4, 3); await pickOpt(5, 0); await pickOpt(5, 1); await pickOpt(5, 2); await pickOpt(5, 3); await pickOpt(6, 0); await pickOpt(6, 1);
  await p.waitForTimeout(500); await shot('tacomo_custom');
  // ---------- build core upgrades to the Foal Nursery ----------
  await tap('back'); await waitScene('build');
  for (const c of ['c2', 'c3', 'c4', 'c5', 'c6']) { if (await p.evaluate(c => !!__KH.S.build.own[c], c)) continue; await tile('b_' + c, 'b_'); await tap('buyYes'); await p.waitForTimeout(2600); if (c === 'c6') break; }
  await waitScene('name'); await p.waitForTimeout(700); await shot('foal_naming'); await typeName('clover'); await shot('foal_named'); await tap('kDone'); await waitScene('build'); await p.waitForTimeout(1200); await shot('stable_upgraded_foal');
  for (const id of ['b_mats', 'b_chandelier', 'b_heatwater']) { const h = await getHit(id); if (h) { await tap(id); if (await has('buyYes')) { await tap('buyYes'); await p.waitForTimeout(2200); } } }
  await tap('inside'); await p.waitForTimeout(800); await shot('stable_inside'); await tap('inside');
  log('foal', JSON.stringify(await p.evaluate(() => __KH.S.foal && __KH.S.foal.name)), 'level', await p.evaluate(() => stableLevel()));
  // ---------- Mom's shop ----------
  await tap('toShop'); await waitScene('shop'); await shot('shop_unbuilt'); await tap('buildShop'); await tap('buyYes'); await p.waitForTimeout(2500);
  const sids = await p.evaluate(() => __KH.hits().filter(h => h.id.startsWith('s_') && h.act).map(h => h.id)); if (sids[0]) { await tap(sids[0]); if (await has('buyYes')) await tap('buyYes'); await p.waitForTimeout(2600); }
  await shot('moms_shop');
  const tabs = await p.evaluate(() => __KH.hits().filter(h => h.id.startsWith('stab')).map(h => h.id)); if (tabs[2]) { await tap(tabs[2]); await p.waitForTimeout(400); await shot('shop_fixit'); if (await has('fixGo')) { await tap('fixGo'); await p.waitForTimeout(600); for (let i = 0; i < 6; i++) { const h = await getHit('spot' + i); if (h) await tapXY(h.x + h.w / 2, h.y + h.h / 2); await p.waitForTimeout(150); } await p.waitForTimeout(600); await shot('shop_fixit_done'); } }
  await tap('back'); await waitScene('build'); await tap('toMap2'); await waitScene('map'); await p.waitForTimeout(800); await shot('map_foal');
  // foal follows in the Show-Off drive and the race stop
  await tap('mStable'); await waitScene('build'); await tap('toGarage'); await waitScene('garage'); await tap('showOff'); await waitScene('drive'); await tap('interGo'); await p.waitForTimeout(2500); await shot('drive_foal'); await tap('pause'); await tap('pGarage').catch(() => {});
  const kerr = await p.evaluate(() => __KH.errors); errs.push(...kerr);
  log('errors', errs.length ? errs.slice(0, 10) : 'none'); log('time', Math.round((Date.now() - T0) / 1000) + 's');
  fs.writeFileSync(shotDir + '/report.json', JSON.stringify({ errs, problems }, null, 1)); await b.close(); process.exit(errs.length ? 1 : 0);
})().catch(e => { console.error('[' + tag + '] FAIL', e.message); process.exit(2); });
