// node preview.js <scene> [argJSON] [waitMs] : renders a scene on several viewports (chromium) for quick visual checks
const pw = require('playwright');
const [scene, argJ, waitS, pre] = process.argv.slice(2); const wait = +waitS || 3000;
const VPS = [['phoneP', 390, 664, 3, true], ['phoneL', 844, 390, 3, true], ['tabP', 810, 1080, 2, true], ['tabL', 1080, 810, 2, true]];
(async () => { const b = await pw.chromium.launch();
  for (const [n, w, h, dpr, mob] of VPS) { const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: mob, hasTouch: true }); const p = await ctx.newPage();
    await p.goto('file://' + __dirname + '/../KimberHorses.html' + (n.startsWith('phone') ? (n === 'phoneP' ? '?sa=47,0,34,0' : '?sa=0,47,21,47') : '')); await p.waitForTimeout(800);
    await p.evaluate(() => { const S = __KH.S; if (!S.horses.length) { SC.coat.enter({ first: true }); S.horses.push(newHorse(BREEDS[0].id, SC.coat.spec(), 'Freckles')); S.cur = 0; } __KH.save(); }); if (pre) await p.evaluate(pre);
    await p.evaluate(([s, a]) => __KH.go(s, a ? JSON.parse(a) : undefined), [scene, argJ || '']); await p.waitForTimeout(wait);
    await p.screenshot({ path: `/tmp/prev_${scene}_${n}.png` }); const e = await p.evaluate(() => __KH.errors); if (e.length) console.log(n, e[0]); await ctx.close(); }
  await b.close(); console.log('done'); })();
