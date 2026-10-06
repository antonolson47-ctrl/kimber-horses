// node finalshots.js [url] : captures story, tack card, race, finale into screenshots/final (WebKit, iPhone 13 / iPad)
const pw = require('playwright'); const fs = require('fs');
const url = process.argv[2] || 'file://' + __dirname + '/../KimberHorses.html'; const out = __dirname + '/../screenshots/final'; fs.mkdirSync(out, { recursive: true });
(async () => { const b = await pw.webkit.launch(); const ctx = await b.newContext({ ...pw.devices['iPhone 13'] }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(url + (url.includes('?') ? '&' : '?') + 'sa=47,0,34,0'); await p.waitForTimeout(2500);
  await p.evaluate(() => { const S = __KH.S; if (!S.horses.length) { SC.coat.enter({ first: true }); S.horses.push(newHorse(BREEDS[0].id, SC.coat.spec(), 'Freckles')); S.cur = 0; S.started = true; } __KH.settings({ autoRead: false, helper: true }); __KH.save(); });
  const shot = async (n) => { await p.screenshot({ path: `${out}/${n}.png` }); console.log(`${out}/${n}.png`); };
  await p.evaluate(() => __KH.go('story', { pages: ['p4'], then: 'map' })); await p.waitForTimeout(3000); await shot('1_story');
  await p.evaluate(() => __KH.go('tack', { from: 'map' })); await p.waitForTimeout(2500); await p.evaluate(() => { SC.tack.card = 'S5'; }); await p.waitForTimeout(2500); await shot('2_tack_card');
  await p.evaluate(() => { __KH.S.treats = { apple: 1, cake: 1, hug: 1 }; __KH.go('race', { l: 1, r: 0 }); }); for (const X of [1800, 3000, 4200]) { for (let i = 0; i < 400; i++) { const r = await p.evaluate(() => __KH.race()); if (r && r.phase === 'run' && r.x > X) break; await p.waitForTimeout(100); } await shot('3_race_' + X); }
  await p.evaluate(() => __KH.go('parade')); for (let i = 0; i < 200; i++) { if (await p.evaluate(() => __KH.hits().some(h => h.id === 'pDone'))) break; await p.waitForTimeout(200); } await p.waitForTimeout(800); await shot('4_finale');
  console.log('errors', errs.concat(await p.evaluate(() => __KH.errors))); await b.close(); })();
