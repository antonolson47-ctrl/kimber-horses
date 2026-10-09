const pw = require('playwright');
const devName = process.argv[2] || 'Pixel 7'; const dev = pw.devices[devName]; const engine = dev.defaultBrowserType === 'webkit' ? pw.webkit : pw.chromium;
const out = process.argv[3] || '/tmp/v/s';
(async () => { const b = await engine.launch(); const ctx = await b.newContext({ ...dev }); const p = await ctx.newPage(); const errs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', e => errs.push('pageerror: ' + e.message + ' ' + (e.stack||'').split('\n').slice(0,3).join('|')));
  await p.goto('file://' + __dirname + '/../KimberHorses.html' + (devName.startsWith('iPhone') ? '?sa=47,0,34,0' : '')); await p.waitForTimeout(1200);
  await p.evaluate(() => { localStorage.clear(); __KH.reset(); S.started = 1; S.horses = [newHorse(BREEDS[0].id, { b: 'bay', p: 'blanket', m: { star: 1 } }, 'Starlight')]; S.cur = 0; });
  const scenes = [['build'], ['shop'], ['garage'], ['drive'], ['carrot', { l: 1, slot: 0 }], ['bow', { l: 1, slot: 1 }], ['map'], ['ires', { kind: 'bow', l: 1, slot: 1, stars: 2, pay: 20, rows: [[1, 'Hit 5 of 8']], total: 50, bonus: 10, fact: 'yabusame', newFact: true }]];
  for (const [n, a] of scenes) { try { await p.evaluate(([n, a]) => __KH.go(n, a), [n, a]); await p.waitForTimeout(900); await p.screenshot({ path: out + '_' + n + '.png' }); console.log(n, 'scene=', await p.evaluate(() => __KH.scene())); } catch (e) { console.log('ERR', n, e.message); } }
  console.log('errors:', errs.slice(0, 8).join('\n')); await b.close(); })();
