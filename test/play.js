// Full playthrough bot: node play.js "<device>" [--quick]
const pw = require('playwright'); const fs = require('fs');
const devName = process.argv[2] || 'Pixel 7'; const QUICK = process.argv.includes('--quick'); const ROT = process.argv.includes('--rotate');
const dev = pw.devices[devName]; const engine = dev.defaultBrowserType === 'webkit' ? pw.webkit : pw.chromium;
const tag = devName.replace(/[^a-z0-9]+/gi, '_') + (process.argv.includes('--rotate') ? '_rotate' : ''); const shotDir = __dirname + '/../screenshots/' + tag; fs.mkdirSync(shotDir, { recursive: true });
const problems = []; const log = (...a) => console.log('[' + tag + ']', ...a);
(async () => {
  const b = await engine.launch(); const ctx = await b.newContext({ ...dev }); const p = await ctx.newPage(); const errs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', e => errs.push('pageerror: ' + e.message)); p.on('crash', () => { console.log('[' + tag + '] PAGE CRASH'); });
  const sa = devName.startsWith('iPhone') ? (devName.includes('landscape') ? '?sa=0,47,21,47' : '?sa=47,0,34,0') : ''; await p.goto('file://' + __dirname + '/../KimberHorses.html' + sa); await p.waitForTimeout(1200);
  await p.evaluate(() => { localStorage.clear(); __KH.reset(); });
  const sc = () => p.evaluate(() => __KH.scene());
  const settle = async () => { for (let i = 0; i < 40; i++) { if (!(await p.evaluate(() => __KH.fading()))) break; await p.waitForTimeout(50); } await p.waitForTimeout(120); };
  let shotN = 0; const shot = async name => { await p.screenshot({ path: `${shotDir}/${String(++shotN).padStart(2, '0')}_${name}.png` }); };
  const check = async (where) => { const r = await p.evaluate(() => { const H = __KH.hits(); const [VW, VH] = __KH.vw(); const m = Math.max(0, ...H.map(h => h.layer)); const top = H.filter(h => h.layer === m && !h.bg && !h.scroll); const out = [];
      for (const h of top) { if (h.x < -1 || h.y < -1 || h.x + h.w > VW + 1 || h.y + h.h > VH + 1) out.push('offscreen ' + h.id + ' ' + [h.x, h.y, h.w, h.h].map(Math.round)); if (!h.clipped && (h.w < 30 || h.h < 30)) out.push('small ' + h.id + ' ' + Math.round(h.w) + 'x' + Math.round(h.h)); }
      for (let i = 0; i < top.length; i++) for (let j = i + 1; j < top.length; j++) { const a = top[i], b = top[j]; const ix = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), iy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y); if (ix > 2 && iy > 2) out.push('overlap ' + a.id + ' & ' + b.id); }
      for (const bx of __KH.boxes()) { if (bx.layer !== m) continue; for (const h of top) { const ix = Math.min(bx.x + bx.w, h.x + h.w) - Math.max(bx.x, h.x), iy = Math.min(bx.y + bx.h, h.y + h.h) - Math.max(bx.y, h.y); if (ix > 4 && iy > 4) out.push('text overlap ' + bx.id + ' & ' + h.id); } }
      for (const bx of __KH.boxes()) if (bx.x < -1 || bx.y < -1 || bx.x + bx.w > VW + 1 || bx.y + bx.h > VH + 1) out.push('box offscreen ' + bx.id);
      return out; }); for (const x of r) { const s = where + ': ' + x; if (!problems.includes(s)) problems.push(s); } };
  const tap = async (id, opt = {}) => { await settle(); let h = null; for (let i = 0; i < 60; i++) { h = await p.evaluate(id => __KH.hits().filter(h => h.id === id).pop(), id); if (h && (h.act || opt.any)) break; await p.waitForTimeout(100); }
    if (!h) { const ids = await p.evaluate(() => __KH.hits().map(h => h.id).join(',')); throw new Error('no hit ' + id + ' in ' + (await sc()) + ' have: ' + ids); }
    await check(await sc()); await p.mouse.click(h.x + h.w / 2, h.y + h.h / 2); await p.waitForTimeout(opt.wait || 150); await settle(); };
  const waitScene = async (name, ms = 120000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if ((await sc()) === name) { await settle(); return; } await p.waitForTimeout(200); } throw new Error('timeout waiting for ' + name + ' (at ' + (await sc()) + ')'); };
  const holdId = async (id, ms) => { await settle(); const h = await p.evaluate(id => __KH.hits().filter(h => h.id === id).pop(), id); await p.mouse.move(h.x + h.w / 2, h.y + h.h / 2); await p.mouse.down(); await p.waitForTimeout(ms); await p.mouse.up(); await settle(); };
  const typeName = async s => { for (const ch of s.toUpperCase()) await tap(ch === ' ' ? 'kSpace' : 'k' + ch, { wait: 60 }); };
  async function story() { await waitScene('story'); await shot('story'); while ((await sc()) === 'story') { await tap('storyNext', { wait: 250 }); } }
  async function treatAndRace(l, r) { await waitScene('treat'); await check('treat'); if (l === 1 && r === 0) await shot('treat');
    const opts = await p.evaluate(() => __KH.hits().filter(h => h.id.startsWith('tr_')).map(h => h.id)); const need = l >= 4 ? 3 : 2;
    for (const id of opts.slice(0, need)) await tap(id, { wait: 400 }); await tap('hugMom', { wait: 300 }); for (let i = 0; i < 100; i++) { if (await p.evaluate(() => __KH.hits().some(h => h.id === 'rideGo' && h.act))) break; await p.waitForTimeout(100); } await shot('treat_ready_' + l + r); await tap('rideGo');
    await waitScene('race'); await p.evaluate(() => { __KH.speed = 5; __KH.settings({ helper: true }); });
    await p.waitForTimeout(600); if (l === 1 && r === 0 || l === 4 && r === 1 || l === 6 && r === 0 || l === 7 && r === 2) await shot('race_' + l + r);
    // hold gallop a bit to test the hold button
    const g = await p.evaluate(() => __KH.hits().find(h => h.id === 'gallop')); if (g) { await check('race'); await p.mouse.move(g.x + g.w / 2, g.y + g.h / 2); await p.mouse.down(); await p.waitForTimeout(700); await p.mouse.up(); }
    if (ROT && l === 2 && r === 0) { const vs = p.viewportSize(); await p.setViewportSize({ width: vs.height, height: vs.width }); await p.waitForTimeout(800); await shot('race_rotated'); await check('race rotated'); await p.setViewportSize(vs); await p.waitForTimeout(500); }
    let sawStop = false; const t0 = Date.now(); while ((await sc()) === 'race' && Date.now() - t0 < 150000) { const st = await p.evaluate(() => __KH.race()); if (st && st.phase === 'stop' && !sawStop) { sawStop = true; if (l === 1 && r === 0) { await p.evaluate(() => { __KH.speed = 1; }); await p.waitForTimeout(1600); await shot('race_stop'); await check('race stop'); await p.evaluate(() => { __KH.speed = 5; }); } } await p.waitForTimeout(300); }
    await waitScene('results'); await p.evaluate(() => { __KH.speed = 1; }); await p.waitForTimeout(1800); await check('results'); if (r === 0 && l <= 1) await shot('results_' + l + r); }
  // ---------- flow ----------
  await shot('title'); await check('title');
  await tap('play'); await story();
  await waitScene('coat'); await tap('br2'); await tap('br0'); await tap('co2'); await shot('coat'); await check('coat'); await tap('pickHorse');
  await waitScene('name'); await typeName('dumb'); await tap('kDone'); const msg = await p.evaluate(() => __KH.S.horses.length); if (msg !== 0) problems.push('kind filter let a mean name through');
  await shot('name_kind'); for (let i = 0; i < 4; i++) await tap('kBack', { wait: 50 }); await typeName('freckles'); await shot('name'); await tap('kDone');
  await story(); // p3 p4 -> treat
  await treatAndRace(0, 0); await tap('resNext'); await waitScene('grand'); await p.waitForTimeout(3800); await shot('grand0'); await check('grand'); await tap('grandCont'); await story(); await waitScene('map'); await shot('map'); await check('map');
  // tack room tour
  await tap('mTack'); await waitScene('tack'); await shot('tack'); await check('tack');
  const items = await p.evaluate(() => __KH.hits().filter(h => h.id.startsWith('it_')).map(h => h.id)); await tap(items[0]); await shot('tack_card'); await check('tack card');
  await p.evaluate(() => __KH.scroll('tmpCard', 250)); await p.waitForTimeout(300); await tap('col_0_1'); await shot('tack_card_scrolled'); await tap('cardClose'); for (const t of ['tab1', 'tab3']) { await tap(t); await check('tack ' + t); } await p.evaluate(() => __KH.scroll('tmpTabs', 9999)); await p.waitForTimeout(200); await tap('tab8'); await shot('tack_kimber'); await check('tack kimber'); await tap('kim_helmet2'); await p.evaluate(() => __KH.scroll('tmpTabs', 0)); await p.waitForTimeout(200); await tap('tab1'); const it2 = await p.evaluate(() => __KH.hits().filter(h => h.id.startsWith('it_')).map(h => h.id)); await tap(it2[0]); await check('tack card2');
  const wear = await p.evaluate(() => __KH.hits().some(h => h.id === 'wear')); if (wear) await tap('wear'); await tap('cardClose'); await tap('surprise'); await tap('back');
  await tap('mStable'); await waitScene('build'); await shot('build'); await check('build'); await tap('toHorses'); await waitScene('stable'); await shot('stable'); await check('stable'); await tap('back'); await waitScene('build'); await tap('toMap2'); await waitScene('map');
  await tap('mStick'); await waitScene('stickers'); await check('stickers'); await tap('back');
  await holdId('parentGate', 3300); await p.waitForTimeout(200); await shot('settings'); await check('settings'); await tap('setClose');
  if (QUICK) { await tap('land1', { wait: 300 }); await tap('ride0'); await treatAndRace(1, 0); }
  else {
    for (let l = 1; l <= 7; l++) { await waitScene('map'); await tap('land' + l, { wait: 300 }); await shot('land_panel_' + l); await check('land panel'); await tap('ride0');
      for (let r = 0; r < 3; r++) { await treatAndRace(l, r); if (r < 2) await p.evaluate(([l, r]) => { __KH.S.inter[r ? 'a' : 'c'][l - 1] = 2; }, [l, r]); await tap('resNext'); }
      await waitScene('grand'); await p.waitForTimeout(3800); if (l === 1 || l === 7) await shot('grand' + l); await check('grand'); await tap('grandCont'); await story();
      if (l === 3) { await waitScene('map'); await tap('mTack'); await waitScene('tack'); await tap('tab0'); const ids = await p.evaluate(() => __KH.hits().filter(h => h.id.startsWith('it_')).map(h => h.id)); await tap(ids[ids.length - 1]); await shot('tack_card_saddle'); await check('tack card saddle'); await tap('cardClose'); await tap('back'); }
    }
    await waitScene('parade'); await p.waitForTimeout(6000); await shot('parade_moving'); await p.waitForTimeout(6000); await shot('finale'); for (let i = 0; i < 120; i++) { if (await p.evaluate(() => __KH.hits().some(h => h.id === 'pDone'))) break; await p.waitForTimeout(250); } await shot('finale_buttons'); await check('finale'); await tap('pDone'); await waitScene('map'); await shot('map_end');
    const st = await p.evaluate(() => ({ races: __KH.S.stats.races, unlocked: Object.keys(__KH.S.unlocked).length, finale: __KH.S.prog.finale, aud: __KH.aud.counts }));
    log('stats', JSON.stringify({ races: st.races, unlocked: st.unlocked, finale: st.finale }));
    const a = st.aud; const starts = Object.keys(a).filter(k => k.startsWith('raceStart')).length, fins = Object.keys(a).filter(k => k.startsWith('raceFinish')).length;
    log('audio', 'raceStarts', starts, 'finishes', fins, 'whinny_charge', a.whinny_charge, 'whinny_victory', a.whinny_victory, 'music changes', a.music_change, 'speak', a.speak);
    if ((a.whinny_charge || 0) < starts) problems.push('missing charge whinny'); if ((a.whinny_victory || 0) < fins) problems.push('missing victory whinny');
  }
  const kerr = await p.evaluate(() => __KH.errors); errs.push(...kerr);
  log('errors', errs.length ? errs.slice(0, 10) : 'none'); log('problems', problems.length ? problems : 'none');
  fs.writeFileSync(shotDir + '/report.json', JSON.stringify({ errs, problems }, null, 1));
  await b.close(); process.exit(errs.length || problems.length ? 1 : 0);
})().catch(e => { console.error('[' + tag + '] FAIL', e.message); fs.writeFileSync(shotDir + '/report.json', JSON.stringify({ fail: e.message, problems }, null, 1)); process.exit(2); });
