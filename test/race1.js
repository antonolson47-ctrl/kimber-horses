const pw = require('playwright');
(async () => { const dn = process.argv[2] || 'iPhone 13'; const dev = pw.devices[dn]; const b = await (dev.defaultBrowserType === 'webkit' ? pw.webkit : pw.chromium).launch(); const ctx = await b.newContext({ ...dev }); const p = await ctx.newPage();
  p.on('crash', () => console.log('CRASH')); p.on('pageerror', e => console.log('pageerror', e.message)); p.on('console', m => console.log('console', m.type(), m.text()));
  await p.goto('file://' + __dirname + '/../KimberHorses.html'); await p.waitForTimeout(800);
  await p.evaluate(() => { const S = __KH.S; S.horses.push({ id: 'x', name: 'Test', breed: 'appaloosa', spec: { b: 'chestnut', p: 'blanket', m: { star: 1 } }, items: { saddle: 'S5', pad: 'B7', bridle: 'H8' }, col: {} }); S.started = true; S.treats = { hug: 1, apple: 1 }; __KH.go('race', { l: +(new URLSearchParams(location.search).get('l') || 1), r: 0 }); });
  for (let i = 0; i < 12; i++) { await p.waitForTimeout(1000); const r = await p.evaluate(() => [__KH.scene(), JSON.stringify(__KH.race()), __KH.errors.length]).catch(e => 'ERR ' + e.message); console.log(i, r); }
  await p.screenshot({ path: '/tmp/race1.png' }); await b.close(); })();
