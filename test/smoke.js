const pw = require('playwright');
(async () => {
  const b = await pw.chromium.launch();
  const ctx = await b.newContext({ ...pw.devices['Pixel 7'] });
  const p = await ctx.newPage(); const errs = [];
  p.on('console', m => { if (m.type() === 'error' || m.type()==='warning') errs.push(m.type()+': '+m.text()); }); p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await p.goto('file://' + __dirname + '/../KimberHorses.html'); await p.waitForTimeout(1500);
  await p.screenshot({ path: __dirname + '/../screenshots/smoke_title.png' });
  const k = await p.evaluate(() => ({ s: __KH.scene(), e: __KH.errors, hits: __KH.hits().length }));
  console.log(JSON.stringify(k), errs);
  await b.close();
})();
