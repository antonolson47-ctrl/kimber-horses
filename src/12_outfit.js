/* ===================== TACK / OUTFIT LAYERS (drawn in horse space) ===================== */
// out = { items: {slot: itemId}, col: {itemId: [value per channel]}, rider: fn(pose), tailBag, tailBagCols }
const SLOT_ORDER = ['pad', 'chest', 'garland', 'mane', 'saddle', 'tail', 'bridle', 'mask', 'scarf', 'rosette', 'plume'];
function drawOutfit(out, pose, coat, legs, lw) {
  if (!out || !out.items) { if (out && out.rider) out.rider(pose); return; }
  for (const slot of SLOT_ORDER) { const id = out.items[slot]; if (!id || id === 'C6') continue; const it = ITEM_BY[id]; if (it && it.draw) it.draw(out.col[id] || it.ch.map(c => c.o[0]), pose, coat, lw, legs); }
  if (out.rider) out.rider(pose);
  if (out.items.chest === 'C6') ITEM_BY.C6.draw(out.col.C6 || ITEM_BY.C6.ch.map(c => c.o[0]), pose, coat, lw, legs);
}
const pal = v => Array.isArray(v) ? v : [v, v, v, v];
/* ---- saddles ---- */
function sWestern(leather, metal, o = {}) {
  const dk = shade(leather, -0.15);
  shape(() => { g.moveTo(-38, -160); g.quadraticCurveTo(-46, -150, -44, -112); g.quadraticCurveTo(-4, -100, 36, -112); g.quadraticCurveTo(40, -150, 32, -164); g.closePath(); }, leather, 3.2);
  if (o.piteado) clipTo(() => { g.moveTo(-38, -160); g.quadraticCurveTo(-46, -150, -44, -112); g.quadraticCurveTo(-4, -100, 36, -112); g.quadraticCurveTo(40, -150, 32, -164); g.closePath(); }, () => { g.strokeStyle = metal; g.lineWidth = 2; for (let k = 0; k < 4; k++) { g.beginPath(); for (let x = -40; x <= 36; x += 6) { const y = -150 + k * 10 + ((x / 6) % 2 ? -3 : 3); x === -40 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); } });
  shape(() => { g.moveTo(-36, -164); g.quadraticCurveTo(-40, -186, -26, -184); g.quadraticCurveTo(0, -168, 26, -174); g.quadraticCurveTo(34, -192, 44, -196); g.quadraticCurveTo(50, -186, 40, -166); g.quadraticCurveTo(0, -150, -36, -164); g.closePath(); }, leather, 3.2);
  if (o.charroHorn) { shape(() => RR(40, -210, 9, 16, 3), leather, 2.5); shape(() => E(44.5, -212, 13, 5), metal, 2.5); }
  else { shape(() => RR(40, -212, 9, 18, 3), o.plain ? dk : metal, 2.5); shape(() => E(44.5, -213, 9, 4), o.plain ? dk : metal, 2.5); }
  shape(() => { g.moveTo(-2, -160); g.lineTo(18, -160); g.lineTo(22, -104); g.lineTo(-4, -104); g.closePath(); }, dk, 3.2);
  if (o.conchos) for (const [x, y, r] of [[-36, -150, 5], [-40, -122, 5], [-14, -110, 5], [14, -110, 5], [32, -124, 5], [30, -150, 5], [8, -150, 4], [8, -126, 4]]) { shape(() => C(x, y, r), metal, 2); fillOnly(() => C(x - 1.2, y - 1.2, r * 0.4), '#fff'); }
  if (!o.plain) strokeOnly(() => { g.moveTo(-34, -170); g.quadraticCurveTo(0, -158, 36, -176); }, metal, 3);
  if (o.tapaderos) { shape(() => { g.moveTo(-8, -110); g.lineTo(26, -110); g.quadraticCurveTo(40, -96, 34, -78); g.lineTo(-6, -86); g.closePath(); }, dk, 2.6); strokeOnly(() => { g.moveTo(0, -100); g.lineTo(26, -98); }, shade(leather, 0.25), 2); }
  else shape(() => { g.moveTo(-4, -104); g.lineTo(24, -104); g.lineTo(26, -88); g.lineTo(-6, -88); g.closePath(); }, o.plain ? '#b9a07a' : metal, 2.5);
}
function sVaquera(leather, stripe) {
  shape(() => RR(18, -178, 22, 66, 6), stripe, 3.2);
  for (let x = 20; x <= 38; x += 4) strokeOnly(() => { g.moveTo(x, -112); g.lineTo(x, -100); }, stripe, 2.4);
  clipTo(() => RR(18, -178, 22, 66, 6), () => { g.fillStyle = '#f6f1e6'; g.fillRect(18, -160, 22, 5); g.fillRect(18, -136, 22, 5); g.fillStyle = '#2b2b33'; g.fillRect(18, -148, 22, 3); });
  shape(() => { g.moveTo(-40, -162); g.quadraticCurveTo(-48, -186, -30, -192); g.quadraticCurveTo(-26, -172, 0, -170); g.quadraticCurveTo(16, -170, 18, -178); g.lineTo(20, -150); g.quadraticCurveTo(-10, -146, -40, -150); g.closePath(); }, leather, 3.2);
  shape(() => { g.moveTo(-34, -170); g.quadraticCurveTo(-36, -186, -26, -180); g.quadraticCurveTo(-4, -168, 14, -176); g.quadraticCurveTo(22, -164, 12, -158); g.quadraticCurveTo(-12, -150, -34, -162); g.closePath(); }, '#f3e9d6', 3.2);
  seed = 8; for (let i = 0; i < 26; i++) { const x = R(-30, 12), y = R(-174, -158); strokeOnly(() => { g.arc(x, y, 2.2, 0, Math.PI * 1.4); }, '#d8cbb2', 1.6); }
  shape(() => { g.moveTo(-6, -150); g.lineTo(6, -150); g.lineTo(6, -104); g.lineTo(-6, -104); g.closePath(); }, leather, 2.5);
  shape(() => { g.moveTo(-14, -106); g.lineTo(14, -106); g.quadraticCurveTo(16, -90, 0, -88); g.quadraticCurveTo(-16, -90, -14, -106); g.closePath(); }, '#2b2b33', 2.5);
}
function sEnglish(brown, o = {}) {
  shape(() => { g.moveTo(-16, -160); g.quadraticCurveTo(-22, -120, -6, -108); g.lineTo(26, -108); g.quadraticCurveTo(34, -140, 30, -164); g.closePath(); }, shade(brown, -0.08), 3.2);
  shape(() => { g.moveTo(-36, -162); g.quadraticCurveTo(-40, -182, -26, -180); g.quadraticCurveTo(0, -164, 22, -172); g.quadraticCurveTo(34, -180, 36, -168); g.quadraticCurveTo(30, -156, 0, -156); g.quadraticCurveTo(-24, -154, -36, -162); g.closePath(); }, brown, 3.2);
  strokeOnly(() => { g.moveTo(-26, -172); g.quadraticCurveTo(0, -160, 26, -170); }, shade(brown, 0.25), 2.5);
  if (o.side) { shape(() => { g.moveTo(22, -172); g.quadraticCurveTo(26, -196, 40, -194); g.quadraticCurveTo(34, -184, 32, -170); g.closePath(); }, brown, 2.6); shape(() => { g.moveTo(18, -164); g.quadraticCurveTo(34, -168, 40, -154); g.quadraticCurveTo(30, -158, 22, -156); g.closePath(); }, shade(brown, -0.1), 2.4); return; }
  strokeOnly(() => { g.moveTo(10, -108); g.lineTo(10, -94); }, '#5a3420', 2.5); shape(() => { g.moveTo(1, -96); g.lineTo(19, -96); g.lineTo(16, -86); g.lineTo(4, -86); g.closePath(); }, '#d8dee6', 2);
}
function sMongolian(paint, stud) {
  shape(() => { g.moveTo(-30, -160); g.lineTo(-40, -196); g.quadraticCurveTo(-30, -204, -22, -194); g.lineTo(-16, -168); g.lineTo(18, -168); g.lineTo(26, -200); g.quadraticCurveTo(36, -206, 40, -196); g.lineTo(30, -160); g.closePath(); }, paint, 3.2);
  for (const [x, y] of [[-32, -190], [-28, -176], [32, -194], [30, -178], [0, -164]]) shape(() => C(x, y, 3.6), stud, 1.6);
  shape(() => RR(-26, -170, 50, 12, 5), '#2e86de', 2.5);
  shape(() => RR(-40, -158, 76, 40, 8), '#1f6f5c', 3.2); clipTo(() => RR(-40, -158, 76, 40, 8), () => { g.strokeStyle = '#f2c14e'; g.lineWidth = 2.5; for (let x = -34; x < 36; x += 14) { g.beginPath(); g.arc(x, -138, 5, 0, TAU); g.stroke(); } });
  strokeOnly(() => { g.moveTo(4, -120); g.lineTo(4, -108); }, INK, 3); shape(() => { g.moveTo(-6, -108); g.lineTo(14, -108); g.lineTo(10, -98); g.lineTo(-2, -98); g.closePath(); }, stud, 2);
}
function sRecado(sheep, trim) {
  shape(() => RR(-44, -160, 86, 44, 8), '#b84a3a', 3); clipTo(() => RR(-44, -160, 86, 44, 8), () => { g.fillStyle = '#f2d16b'; g.fillRect(-44, -140, 86, 4); g.fillStyle = '#2c2a3a'; g.fillRect(-44, -130, 86, 4); });
  shape(() => RR(-36, -170, 70, 22, 8), '#6b4128', 3);
  shape(() => { g.moveTo(-42, -168); g.quadraticCurveTo(-46, -190, -30, -186); g.quadraticCurveTo(0, -196, 30, -186); g.quadraticCurveTo(46, -190, 42, -168); g.quadraticCurveTo(0, -158, -42, -168); g.closePath(); }, sheep, 3);
  seed = 15; const curl = shade(sheep, sheep === '#2b2730' ? 0.25 : -0.15); for (let i = 0; i < 30; i++) { const x = R(-38, 38), y = R(-186, -170); strokeOnly(() => g.arc(x, y, 2.4, 0, Math.PI * 1.5), curl, 1.6); }
  strokeOnly(() => { g.moveTo(4, -116); g.lineTo(4, -100); }, '#4a2f1c', 2.6); shape(() => { g.moveTo(4, -102); g.lineTo(14, -86); g.lineTo(-6, -86); g.closePath(); }, trim, 2.2);
}
function sSchool(col) {
  shape(() => { g.moveTo(-36, -162); g.quadraticCurveTo(-42, -188, -24, -184); g.quadraticCurveTo(0, -166, 22, -176); g.quadraticCurveTo(36, -188, 40, -168); g.quadraticCurveTo(44, -146, 30, -116); g.lineTo(-10, -116); g.quadraticCurveTo(-30, -140, -36, -162); g.closePath(); }, col, 3.2);
  strokeOnly(() => { g.moveTo(-28, -170); g.quadraticCurveTo(0, -156, 30, -170); }, shade(col, -0.14), 2.5);
  strokeOnly(() => { g.moveTo(10, -116); g.lineTo(10, -96); }, '#b8a888', 2.5); shape(() => RR(2, -98, 16, 8, 3), '#e8c766', 2);
}
function sJapan(lac, trim) {
  shape(() => RR(-40, -158, 78, 36, 8), '#3a2d4a', 3); clipTo(() => RR(-40, -158, 78, 36, 8), () => { g.strokeStyle = trim; g.lineWidth = 1.6; for (let x = -36; x < 40; x += 10) { g.beginPath(); g.arc(x, -140, 4, 0, TAU); g.stroke(); } });
  shape(() => { g.moveTo(-40, -158); g.quadraticCurveTo(-50, -190, -38, -204); g.quadraticCurveTo(-28, -196, -24, -166); g.quadraticCurveTo(0, -162, 20, -166); g.quadraticCurveTo(24, -204, 36, -210); g.quadraticCurveTo(48, -196, 38, -158); g.closePath(); }, lac, 3.2);
  strokeOnly(() => { g.moveTo(-38, -200); g.quadraticCurveTo(-30, -188, -27, -168); g.moveTo(34, -206); g.quadraticCurveTo(26, -192, 23, -168); }, trim, 2.4);
  for (const [x, y] of [[-34, -186], [30, -192], [36, -176]]) shape(() => C(x, y, 2.6), '#f6f1e6', 1.2);
  strokeOnly(() => { g.moveTo(2, -124); g.lineTo(2, -108); }, '#7a2b2b', 3); shape(() => { g.moveTo(-8, -110); g.lineTo(10, -110); g.quadraticCurveTo(30, -102, 32, -92); g.lineTo(-6, -92); g.quadraticCurveTo(-12, -100, -8, -110); g.closePath(); }, lac, 2.4); strokeOnly(() => { g.moveTo(-4, -96); g.lineTo(28, -94); }, trim, 1.8);
  shape(() => { g.moveTo(-30, -122); g.quadraticCurveTo(-34, -106, -28, -96); g.quadraticCurveTo(-24, -106, -26, -122); g.closePath(); }, '#d23b3b', 1.8);
}
function sOttoman(velvet, gold) {
  shape(() => { g.moveTo(-38, -164); g.quadraticCurveTo(-44, -186, -28, -184); g.quadraticCurveTo(0, -170, 22, -176); g.quadraticCurveTo(28, -198, 38, -196); g.quadraticCurveTo(44, -184, 36, -164); g.quadraticCurveTo(0, -150, -38, -164); g.closePath(); }, velvet, 3.2);
  strokeOnly(() => { g.moveTo(-34, -172); g.quadraticCurveTo(0, -160, 34, -172); }, gold, 3);
  for (const [x, y, c] of [[-24, -172, '#e8304a'], [0, -166, '#2fa36b'], [24, -172, '#4cc3ff'], [33, -192, '#e8304a']]) { shape(() => C(x, y, 3.6), c, 1.6); fillOnly(() => C(x - 1, y - 1, 1.2), '#fff'); }
  shape(() => { g.moveTo(-10, -160); g.lineTo(26, -160); g.quadraticCurveTo(28, -130, 20, -112); g.lineTo(-4, -112); g.quadraticCurveTo(-12, -134, -10, -160); g.closePath(); }, shade(velvet, -0.15), 3);
  clipTo(() => { g.moveTo(-10, -160); g.lineTo(26, -160); g.quadraticCurveTo(28, -130, 20, -112); g.lineTo(-4, -112); g.quadraticCurveTo(-12, -134, -10, -160); g.closePath(); }, () => { g.strokeStyle = gold; g.lineWidth = 2; for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(8, -136, 6 + k * 6, 0, TAU); g.stroke(); } });
  strokeOnly(() => { g.moveTo(8, -112); g.lineTo(8, -100); }, gold, 3); shape(() => { g.moveTo(-6, -100); g.lineTo(22, -100); g.lineTo(18, -90); g.lineTo(-2, -90); g.closePath(); }, gold, 2.2);
}
/* ---- blankets & caparisons ---- */
function emblem(kind, x, y, s, col) {
  if (kind === 'star') shape(() => star(x, y, 9 * s), col, 2);
  else if (kind === 'flower') { for (let k = 0; k < 5; k++) { const a = k * TAU / 5; shape(() => C(x + Math.cos(a) * 5 * s, y + Math.sin(a) * 5 * s, 4 * s), col, 1.6); } shape(() => C(x, y, 3 * s), '#ffe27a', 1.4); }
  else if (kind === 'horseshoe') { strokeOnly(() => g.arc(x, y, 7 * s, Math.PI * 0.8, Math.PI * 2.2), INK, 6 * s); strokeOnly(() => g.arc(x, y, 7 * s, Math.PI * 0.8, Math.PI * 2.2), col, 3.4 * s); }
  else if (kind === 'moon') shape(() => { g.arc(x, y, 9 * s, 0.6, TAU - 0.6); g.arc(x + 5 * s, y, 7 * s, TAU - 0.9, 0.9, true); g.closePath(); }, col, 2);
  else if (kind === 'heart') shape(() => heart(x, y, 9 * s), col, 2);
}
const EMBLEM_COL = { star: '#ffffff', flower: '#ff8fb1', horseshoe: '#f2c14e', moon: '#fff3a8', heart: '#ff5a7a' };
function bCaparison(c1, c2, emb) {
  const cap = () => { g.moveTo(-104, -150); g.bezierCurveTo(-60, -168, -10, -156, 40, -166); g.bezierCurveTo(80, -170, 100, -140, 98, -112); g.lineTo(100, -48); for (let i = 0; i <= 10; i++) { const x = 100 - i * 20.8; g.quadraticCurveTo(x - 10.4, -34, x - 20.8, -48); } g.lineTo(-108, -120); g.closePath(); };
  shape(cap, c1, 3.2);
  clipTo(cap, () => { g.fillStyle = c2; g.fillRect(-4, -175, 120, 64); g.fillRect(-120, -111, 116, 80); g.fillStyle = shade(c1, -0.2); g.fillRect(-120, -175, 240, 6);
    g.fillStyle = 'rgba(255,255,255,.16)'; for (let x = -100; x < 100; x += 26) g.fillRect(x, -170, 3, 130); });
  shape(() => { g.moveTo(-52, -136); g.lineTo(-26, -136); g.lineTo(-26, -108); g.quadraticCurveTo(-39, -92, -52, -108); g.closePath(); }, '#fff', 2.5);
  emblem(emb, -39, -118, 0.9, emb === 'star' ? c1 : (EMBLEM_COL[emb] || c1));
  emblem(emb, 46, -86, 1.1, EMBLEM_COL[emb] === '#ffffff' ? c2 : EMBLEM_COL[emb]);
}
function bPad(col, o = {}) { const p = () => RR(-48, -168, 98, 70, 12); shape(p, col, 3.2);
  clipTo(p, () => { if (o.stars) { g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(-48, -168, 98, 20); seed = 44; for (let k = 0; k < 9; k++) { const x = R(-40, 44), y = R(-160, -106); sparkle(x, y, R(3, 6), k % 3 ? '#fff6c8' : '#ffffff'); } return; }
    g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 2; g.setLineDash([4, 4]); g.beginPath(); RR(-42, -162, 86, 58, 9); g.stroke(); g.setLineDash([]);
    g.strokeStyle = 'rgba(0,0,0,.08)'; for (let x = -40; x < 50; x += 12) { g.beginPath(); g.moveTo(x, -164); g.lineTo(x + 14, -102); g.stroke(); } }); }
function bShabrack(p) { const [a, b] = p; const s = () => RR(-48, -168, 98, 70, 12); shape(s, a, 3.2); clipTo(s, () => { g.fillStyle = b; g.fillRect(-48, -112, 98, 5); g.fillRect(-48, -122, 98, 4); g.fillRect(-48, -132, 98, 3); g.fillRect(40, -168, 4, 70); g.beginPath(); C(30, -118, 5); g.fill(); }); }
function bNavajo(p) { const [a, b, c, d] = p; const s = () => RR(-48, -168, 98, 70, 10); shape(s, a, 3.2);
  clipTo(s, () => { g.fillStyle = c; g.fillRect(-48, -152, 98, 8); g.fillRect(-48, -116, 98, 8); g.fillStyle = b; for (let x = -40; x < 50; x += 22) { g.beginPath(); g.moveTo(x, -134); g.lineTo(x + 8, -142); g.lineTo(x + 16, -134); g.lineTo(x + 8, -126); g.closePath(); g.fill(); } g.fillStyle = d; g.fillRect(-48, -104, 98, 4); g.fillRect(-48, -162, 98, 3); }); }
function bOtCloth(silk, gold) {
  const s = () => { g.moveTo(-56, -168); g.lineTo(52, -168); g.quadraticCurveTo(60, -120, 50, -86); g.quadraticCurveTo(0, -76, -54, -86); g.quadraticCurveTo(-64, -120, -56, -168); g.closePath(); };
  shape(s, silk, 3.2);
  clipTo(s, () => { g.strokeStyle = gold; g.lineWidth = 2.4; g.beginPath(); g.moveTo(-50, -94); g.quadraticCurveTo(0, -84, 46, -94); g.stroke();
    for (let k = 0; k < 5; k++) { const x = -38 + k * 19; g.beginPath(); g.moveTo(x, -100); g.bezierCurveTo(x - 8, -112, x + 6, -124, x, -134); g.stroke(); g.beginPath(); C(x, -136, 3); g.fillStyle = gold; g.fill(); } });
  for (let x = -48; x <= 46; x += 16) { strokeOnly(() => { g.moveTo(x, -84); g.lineTo(x, -74); }, gold, 2); shape(() => E(x, -70, 3, 5), gold, 1.4); }
}
function bPazyryk(felt, trim) {
  const s = () => { g.moveTo(-52, -166); g.lineTo(50, -166); g.lineTo(52, -102); for (let i = 0; i <= 8; i++) { const x = 52 - i * 13; g.quadraticCurveTo(x - 6.5, -92, x - 13, -102); } g.closePath(); };
  shape(s, felt, 3.2);
  clipTo(s, () => { g.fillStyle = shade(felt, -0.2); g.fillRect(-60, -166, 120, 6);
    for (const [cx, fl] of [[-24, 1], [24, -1]]) { g.save(); g.translate(cx, -132); g.scale(fl, 1);
      shape(() => { C(0, 0, 9); }, trim, 2); shape(() => { g.moveTo(7, -3); g.lineTo(16, 0); g.lineTo(7, 4); g.closePath(); }, '#fff3c4', 1.6);
      shape(() => { g.moveTo(-6, -6); g.bezierCurveTo(-18, -22, -2, -26, 2, -10); g.closePath(); }, trim, 1.8);
      shape(() => { g.moveTo(-8, 6); g.bezierCurveTo(-20, 14, -14, 22, 0, 12); g.closePath(); }, trim, 1.8);
      fillOnly(() => C(2, -2, 1.8), INK); g.restore(); } });
}
function bMarwari(main, gold) {
  const p = () => { g.moveTo(-70, -160); g.bezierCurveTo(-30, -168, 20, -156, 58, -162); g.lineTo(62, -86); g.lineTo(-74, -86); g.closePath(); };
  shape(p, main, 3.2);
  clipTo(p, () => { g.fillStyle = gold; g.fillRect(-80, -100, 150, 14); g.fillRect(-80, -175, 150, 10);
    for (let x = -62; x < 58; x += 16) for (let y = -150; y < -104; y += 16) { const xx = x + (y % 32 ? 8 : 0); g.beginPath(); C(xx, y, 4.2); g.fillStyle = '#fff6d6'; g.fill(); g.strokeStyle = gold; g.lineWidth = 2; g.stroke(); g.beginPath(); C(xx - 1, y - 1, 1.6); g.fillStyle = '#9fe7ff'; g.fill(); } });
  for (let x = -70; x <= 60; x += 13) { shape(() => { g.moveTo(x, -86); g.lineTo(x - 3, -74); g.lineTo(x + 3, -74); g.closePath(); }, gold, 1.5); shape(() => C(x, -71, 3.6), shade(main, 0.25), 1.5); }
}
/* ---- bridles & headgear ---- */
function bridleBase(pose, strap, metal, o = {}) {
  withNeck(pose, () => {
    const straps = () => { g.moveTo(80, -264); g.quadraticCurveTo(78, -236, 100, -216); g.quadraticCurveTo(112, -208, 126, -210); g.moveTo(80, -262); g.quadraticCurveTo(92, -270, 106, -266); g.moveTo(114, -228); g.quadraticCurveTo(136, -232, 156, -226); g.moveTo(114, -228); g.quadraticCurveTo(116, -214, 126, -210); };
    strokeOnly(straps, INK, 7.5); strokeOnly(straps, strap, 4.2);
    shape(() => C(126, -210, 5.5), metal, 2);
    if (o.conchos) for (const [x, y] of [[82, -244], [94, -267], [136, -230]]) shape(() => C(x, y, 4.2), metal, 1.8);
    if (o.double) { strokeOnly(() => { g.moveTo(98, -220); g.quadraticCurveTo(112, -200, 130, -200); }, INK, 6); strokeOnly(() => { g.moveTo(98, -220); g.quadraticCurveTo(112, -200, 130, -200); }, metal, 3); shape(() => C(130, -200, 4), metal, 1.8); }
    if (o.fringe) for (let k = 0; k < 9; k++) { const x = 84 + k * 2.6, y = -266 - k * 0.3; strokeOnly(() => { g.moveTo(x, y); g.quadraticCurveTo(x + 4, y + 8, x + 6, y + 16); }, Array.isArray(o.fringe) ? o.fringe[k % 2] : (k % 2 ? shade(o.fringe, -0.3) : o.fringe), 2.4); }
    if (o.beads) { const [a, b, c] = o.beads; const p = () => { g.moveTo(96, -266); g.lineTo(116, -260); g.lineTo(146, -226); g.lineTo(136, -218); g.lineTo(104, -248); g.closePath(); }; shape(p, a, 2.5); clipTo(p, () => { g.fillStyle = b; for (let k = 0; k < 4; k++) { g.beginPath(); C(108 + k * 10, -254 + k * 9.5, 3.5); g.fill(); } g.fillStyle = c; for (let k = 0; k < 4; k++) { g.beginPath(); C(108 + k * 10, -254 + k * 9.5, 1.4); g.fill(); } }); }
  });
}
function hAntler(pose, felt, gold) {
  withNeck(pose, () => {
    const mask = () => { g.moveTo(70, -262); g.quadraticCurveTo(96, -276, 118, -258); g.lineTo(152, -224); g.quadraticCurveTo(140, -214, 128, -220); g.lineTo(98, -228); g.quadraticCurveTo(74, -236, 70, -262); g.closePath(); };
    shape(mask, felt, 3); clipTo(mask, () => { g.strokeStyle = gold; g.lineWidth = 2.4; g.beginPath(); g.moveTo(80, -254); g.quadraticCurveTo(110, -258, 140, -228); g.stroke(); });
    for (const [bx, s] of [[86, 1], [100, 0.85]]) { const ant = () => { g.moveTo(bx, -268); g.quadraticCurveTo(bx - 12 * s, -300, bx - 4 * s, -330); g.moveTo(bx - 7 * s, -294); g.quadraticCurveTo(bx - 26 * s, -304, bx - 30 * s, -320); g.moveTo(bx - 6 * s, -312); g.quadraticCurveTo(bx + 12 * s, -322, bx + 14 * s, -338); g.moveTo(bx - 9 * s, -284); g.quadraticCurveTo(bx + 10 * s, -292, bx + 18 * s, -304); };
      strokeOnly(ant, INK, 8 * s); strokeOnly(ant, gold, 4.4 * s); }
  });
  withNeck(pose, () => { const ex = 102, ey = -238; shape(() => E(ex, ey, 11.5, 13.5, -0.1), '#fff', 2.6); fillOnly(() => C(ex + 3, ey + 1, 9.5), '#4a2a1f'); fillOnly(() => C(ex + 3.5, ey + 1.5, 5.5), '#1d1216'); fillOnly(() => C(ex + 6.5, ey - 3.5, 3.4), '#fff'); });
}
function hChanfron(pose, steel, gold) {
  withNeck(pose, () => {
    const p = () => { g.moveTo(84, -270); g.quadraticCurveTo(104, -278, 118, -262); g.lineTo(150, -226); g.quadraticCurveTo(146, -214, 136, -216); g.lineTo(104, -236); g.quadraticCurveTo(84, -250, 84, -270); g.closePath(); };
    shape(p, steel, 3); clipTo(p, () => { g.fillStyle = 'rgba(255,255,255,.45)'; g.beginPath(); E(110, -252, 14, 4, 0.75); g.fill(); g.strokeStyle = gold; g.lineWidth = 3; g.beginPath(); g.moveTo(88, -266); g.quadraticCurveTo(106, -272, 116, -260); g.lineTo(146, -226); g.stroke(); });
    shape(() => C(112, -246, 5), gold, 2); shape(() => { g.moveTo(108, -250); g.lineTo(116, -268); g.lineTo(118, -248); g.closePath(); }, steel, 2);
  });
  withNeck(pose, () => { const ex = 102, ey = -238; shape(() => E(ex, ey, 11.5, 13.5, -0.1), '#fff', 2.6); fillOnly(() => C(ex + 3, ey + 1, 9.5), '#4a2a1f'); fillOnly(() => C(ex + 3.5, ey + 1.5, 5.5), '#1d1216'); fillOnly(() => C(ex + 6.5, ey - 3.5, 3.4), '#fff'); });
}
function hKhadag(pose, col) {
  withNeck(pose, () => {
    const band = () => { g.moveTo(66, -246); g.quadraticCurveTo(80, -226, 100, -208); g.lineTo(108, -214); g.quadraticCurveTo(88, -232, 76, -252); g.closePath(); };
    shape(band, col, 2.6);
    const w = pose.wind || 0.1;
    shape(() => { g.moveTo(96, -210); g.bezierCurveTo(90 - w * 30, -190, 84 - w * 50, -176 + w * 10, 70 - w * 70, -168 + w * 20); g.lineTo(78 - w * 60, -160 + w * 22); g.bezierCurveTo(92 - w * 40, -172, 100 - w * 20, -190, 106, -212); g.closePath(); }, shade(col, 0.15), 2.4);
    shape(() => { g.moveTo(100, -210); g.bezierCurveTo(104 - w * 20, -186, 110 - w * 40, -172, 104 - w * 70, -156 + w * 30); g.lineTo(112 - w * 60, -152 + w * 28); g.bezierCurveTo(118 - w * 30, -172, 112, -190, 108, -212); g.closePath(); }, col, 2.4);
    strokeOnly(() => { g.moveTo(74, -240); g.quadraticCurveTo(86, -226, 98, -214); }, 'rgba(255,255,255,.6)', 1.5);
  });
}
/* ---- chest ---- */
function cBreast(leather, metal) {
  strokeOnly(() => { g.moveTo(-2, -150); g.quadraticCurveTo(50, -110, 92, -122); }, INK, 9); strokeOnly(() => { g.moveTo(-2, -150); g.quadraticCurveTo(50, -110, 92, -122); }, leather, 5);
  for (let t = 0.15; t < 1; t += 0.2) { const x = -2 + t * 94, y = -150 + t * 30 - Math.sin(t * Math.PI) * 14; shape(() => C(x, y, 4.2), metal, 1.8); }
  shape(() => { g.moveTo(86, -128); g.lineTo(100, -120); g.lineTo(92, -104); g.lineTo(80, -112); g.closePath(); }, metal, 2);
}
function cBeaded(p) { const [a, b, c] = pal(p);
  strokeOnly(() => { g.moveTo(30, -158); g.quadraticCurveTo(60, -140, 86, -132); }, INK, 11); strokeOnly(() => { g.moveTo(30, -158); g.quadraticCurveTo(60, -140, 86, -132); }, '#b3162a', 7);
  const s = () => { g.moveTo(74, -136); g.lineTo(100, -138); g.lineTo(102, -96); g.lineTo(87, -84); g.lineTo(72, -96); g.closePath(); };
  shape(s, a, 3.2);
  clipTo(s, () => { g.fillStyle = b; for (let y = -132; y < -90; y += 13) { g.beginPath(); g.moveTo(87, y); g.lineTo(96, y + 6); g.lineTo(87, y + 12); g.lineTo(78, y + 6); g.closePath(); g.fill(); } g.fillStyle = c; for (let y = -132; y < -90; y += 13) { g.beginPath(); C(87, y + 6, 2.2); g.fill(); } g.fillStyle = '#1f3b73'; g.fillRect(70, -140, 40, 4); });
  for (let x = 74; x <= 100; x += 5) strokeOnly(() => { g.moveTo(x, -92 + Math.abs(x - 87) * 0.4); g.lineTo(x + 1, -74 + Math.abs(x - 87) * 0.3); }, '#f3e2c4', 2);
  for (const x of [76, 87, 98]) shape(() => C(x, -72, 3.4), '#e2b04a', 1.5);
}
function cGoldzeug(gold) {
  strokeOnly(() => { g.moveTo(-2, -150); g.quadraticCurveTo(50, -112, 92, -122); }, INK, 10); strokeOnly(() => { g.moveTo(-2, -150); g.quadraticCurveTo(50, -112, 92, -122); }, gold, 6);
  for (let t = 0.12; t < 1; t += 0.17) { const x = -2 + t * 94, y = -150 + t * 30 - Math.sin(t * Math.PI) * 13; shape(() => star(x, y, 4.5, 4, 0.5), '#fff3b0', 1.4); }
  const cr = () => { g.moveTo(-34, -160); g.bezierCurveTo(-60, -162, -84, -156, -98, -142); };
  strokeOnly(cr, INK, 10); strokeOnly(cr, gold, 6);
  strokeOnly(() => { g.moveTo(-70, -158); g.quadraticCurveTo(-74, -128, -90, -108); }, INK, 8); strokeOnly(() => { g.moveTo(-70, -158); g.quadraticCurveTo(-74, -128, -90, -108); }, gold, 4.5);
  for (const [x, y] of [[-56, -161], [-80, -154], [-73, -134]]) shape(() => C(x, y, 4), '#fff3b0', 1.4);
}
function cBrasses() { strokeOnly(() => { g.moveTo(88, -150); g.lineTo(84, -90); }, '#3b2418', 9); for (const y of [-142, -124, -106]) { shape(() => C(86, y, 7), '#e8b84a', 2); strokeOnly(() => star(86, y, 4.5), '#9a6b16', 1.4); } strokeOnly(() => { g.moveTo(-2, -150); g.quadraticCurveTo(44, -118, 86, -128); }, '#3b2418', 7); }
function cTang(col, metal) {
  const strap = () => { g.moveTo(-2, -150); g.quadraticCurveTo(50, -112, 92, -122); };
  strokeOnly(strap, INK, 8); strokeOnly(strap, '#8a3b2a', 4.5);
  const cr = () => { g.moveTo(-34, -160); g.bezierCurveTo(-60, -162, -84, -156, -98, -142); };
  strokeOnly(cr, INK, 8); strokeOnly(cr, '#8a3b2a', 4.5);
  const leaf = (x, y) => { strokeOnly(() => { g.moveTo(x, y); g.lineTo(x, y + 8); }, INK, 1.5); shape(() => { g.moveTo(x, y + 6); g.quadraticCurveTo(x - 7, y + 14, x, y + 22); g.quadraticCurveTo(x + 7, y + 14, x, y + 6); g.closePath(); }, col, 1.6); fillOnly(() => C(x, y + 6, 2), metal); };
  for (let t = 0.2; t < 1; t += 0.2) { const x = -2 + t * 94, y = -150 + t * 30 - Math.sin(t * Math.PI) * 13; leaf(x, y); }
  for (const t of [0.25, 0.6]) { const x = -34 - t * 64, y = -160 + t * 14; leaf(x, y); }
  for (const x of [20, 60]) { strokeOnly(() => { g.moveTo(x, -128 + (x - 20) * 0.1); g.lineTo(x - 2, -108); }, '#e8304a', 3); }
}
function cDrums(p) { const [a, b] = p;
  const ban = () => { g.moveTo(40, -150); g.lineTo(96, -150); g.lineTo(98, -100); for (let i = 0; i <= 6; i++) { const x = 98 - i * 9.6; g.lineTo(x - 4.8, i % 2 ? -100 : -94); } g.lineTo(40, -100); g.closePath(); };
  shape(ban, a, 3); clipTo(ban, () => { g.fillStyle = b; g.fillRect(36, -150, 66, 6); g.fillRect(36, -108, 66, 8); g.beginPath(); star(68, -128, 10); g.fill(); });
  shape(() => { E(68, -152, 30, 9); }, '#dfe6ee', 3);
  shape(() => { g.moveTo(38, -152); g.quadraticCurveTo(40, -122, 68, -118); g.quadraticCurveTo(96, -122, 98, -152); g.closePath(); }, '#cfd8e2', 3);
  fillOnly(() => E(60, -138, 6, 10, 0.3), 'rgba(255,255,255,.6)'); shape(() => E(68, -153, 24, 6), '#f6f1e6', 2);
}
/* ---- mane & tail ---- */
function mBraids(pose, kind, col, col2) {
  withNeck(pose, () => {
    for (let i = 1; i < 8; i++) { const t = i / 8.6; const [x, y] = crestPt(t);
      if (kind === 'flights') { strokeOnly(() => { g.moveTo(x, y); g.lineTo(x - 4, y - 22); }, '#888', 1.5); shape(() => { g.moveTo(x - 4, y - 22); g.lineTo(x - 14, y - 30); g.lineTo(x - 3, y - 32); g.closePath(); }, i % 2 ? col : col2, 1.6); shape(() => C(x - 2, y + 1, 4.5), col, 1.6); }
      else if (kind === 'buttons') { shape(() => C(x - 3, y + 2, 7), col, 2.2); strokeOnly(() => { g.moveTo(x - 9, y + 1); g.lineTo(x + 3, y + 3); }, '#fff', 2.2); }
      else { shape(() => E(x - 3, y + 6, 4.5, 8, 0.4), col2, 2); fillOnly(() => C(x - 3, y + 2, 2.4), col); }
    }
  });
}
function tRibbon(pose, col) { const cs = col === 'rainbow' ? RIBBON : [col, col];
  const up = pose.tail === 'stream';
  g.save(); if (up) { g.translate(-112, -150); g.rotate(-0.9); g.translate(104, 140); }
  shape(() => { g.moveTo(-104, -140); g.lineTo(-118, -126); g.lineTo(-110, -122); g.closePath(); }, cs[1], 2); shape(() => { g.moveTo(-104, -140); g.lineTo(-96, -122); g.lineTo(-104, -120); g.closePath(); }, cs[3] || cs[0], 2); shape(() => C(-104, -140, 5), cs[0], 2);
  g.restore(); }
function tComet(pose) { const up = pose.tail === 'stream'; for (let k = 0; k < 6; k++) { const x = up ? -150 - k * 12 : -118 - k * 3, y = up ? -150 + Math.sin(k) * 8 : -110 + k * 14; sparkle(x, y, 6 - k * 0.6, k % 2 ? '#fff6a8' : '#ffffff'); fillOnly(() => C(x + 6, y + 4, 1.6), RIBBON[k % 7]); } }
function rRosette(pose, col) { withNeck(pose, () => { const cx = 80, cy = -252; const cs = col === 'rainbow' ? RIBBON : [col];
  shape(() => { g.moveTo(cx - 4, cy); g.lineTo(cx - 10, cy + 24); g.lineTo(cx - 3, cy + 18); g.lineTo(cx + 2, cy + 26); g.lineTo(cx + 5, cy); g.closePath(); }, shade(cs[0], -0.15), 1.8);
  for (let k = 0; k < 10; k++) { const a = k * TAU / 10; fillOnly(() => C(cx + Math.cos(a) * 7.5, cy + Math.sin(a) * 7.5, 4.2), cs[k % cs.length]); }
  shape(() => C(cx, cy, 5.5), '#fff', 1.6); fillOnly(() => star(cx, cy, 3.2), '#f2c14e'); }); }
/* ---- plumes ---- */
function pPlume(pose, cols, o = {}) { withNeck(pose, () => {
  for (let k = 0; k < 3; k++) { const a = -0.5 + k * 0.32 - pose.wind * 0.4; shape(() => { g.save(); g.translate(94, -268); g.rotate(a); g.moveTo(0, 0); g.bezierCurveTo(-14, -20, -10, -46, 0, -58); g.bezierCurveTo(10, -46, 14, -20, 0, 0); g.restore(); }, cols[k % cols.length], 2.4); }
  shape(() => C(94, -268, 6), '#f2c14e', 2); }); }
function pKalgi(pose, col) { withNeck(pose, () => {
  const a = -0.25 - pose.wind * 0.35;
  shape(() => { g.save(); g.translate(92, -270); g.rotate(a); g.moveTo(-3, 0); g.bezierCurveTo(-16, -30, -6, -60, 6, -76); g.bezierCurveTo(4, -52, 12, -28, 4, 0); g.closePath(); g.restore(); }, col, 2.4);
  strokeOnly(() => { g.save(); g.translate(92, -270); g.rotate(a); for (let k = 1; k < 7; k++) { g.moveTo(-2 + k * 0.6, -k * 10); g.lineTo(-10 + k, -k * 10 - 6); } g.restore(); }, shade(col, -0.2), 1.6);
  shape(() => RR(86, -276, 14, 10, 3), '#f2c14e', 2); shape(() => C(93, -271, 2.6), '#e8304a', 1.2);
  for (let k = 0; k < 4; k++) shape(() => C(82 + k * 6, -262 + k * 2, 2.4), '#fff6d6', 1);
}); }
function pCloud(pose) { withNeck(pose, () => { const w = pose.wind; for (let k = 0; k < 5; k++) { const x = 92 - w * 10 * k + (k % 2) * 6, y = -276 - k * 11; shape(() => { C(x, y, 9 - k * 0.6); C(x + 7, y + 3, 6); C(x - 7, y + 3, 6); }, '#ffffff', 2); } fillOnly(() => C(92, -320, 3), '#ffd93d'); for (let k = 0; k < 7; k++) strokeOnly(() => { g.moveTo(90 + k * 1.5, -272); g.quadraticCurveTo(80 - w * 30, -262 + k * 3, 70 - w * 40, -250 + k * 4); }, RIBBON[k], 2); shape(() => C(92, -270, 5), '#f2c14e', 1.6); }); }
/* ---- garlands ---- */
function gGarland(pose, cols, o = {}) {
  withNeck(pose, () => {
    for (let i = 0; i <= 12; i++) { const t = i / 12; const x = 18 + t * 74 + Math.sin(t * Math.PI) * 6, y = -164 + Math.sin(t * Math.PI) * 26 - t * 6;
      if (o.lei) { shape(() => C(x, y, 7), cols[i % 2], 1.8); for (let k = 0; k < 5; k++) { const a = k * TAU / 5 + i; fillOnly(() => C(x + Math.cos(a) * 3.5, y + Math.sin(a) * 3.5, 2.2), shade(cols[0], 0.3)); } }
      else if (o.thread) { shape(() => C(x, y, 6.5), cols[i % cols.length], 1.8); sparkle(x - 2, y - 2, 2.5); }
      else { shape(() => C(x, y, 7.5), cols[i % 2], 2); strokeOnly(() => g.arc(x, y, 3.8, 0.4, 5.2), shade(cols[0], -0.3), 1.4); }
      if (i % 3 === 1 && !o.thread) shape(() => E(x - 4, y + 7, 6, 3, 0.6), '#4caf50', 1.5); }
  });
}
/* ---- Kimber riding (side view, drawn in horse space) ---- */
function kimberRider(pose, o = {}) {
  const duck = o.duck ? 1 : 0;
  const lean = ((pose.wind > 0.6 ? 16 : 2) + duck * 26) * Math.PI / 180, wind = pose.wind;
  const helmet = o.helmet || KIM.helmet, shirt = o.shirt || KIM.shirt, shirtD = shade(shirt, -0.3);
  group([[() => { poly([[-10, -176], [12, -178], [30, -146], [18, -138]]); C(24, -142, 10); }, KIM.jod]], 2.8);
  group([[() => { poly([[16, -146], [32, -142], [24, -104], [10, -106]]); RR(8, -110, 30, 12, 6); }, KIM.boot]], 2.8);
  strokeOnly(() => { g.moveTo(14, -142); g.lineTo(28, -138); }, '#4a3a48', 2);
  if (o.skirt) shape(() => { g.moveTo(-14, -180); g.quadraticCurveTo(10, -186, 26, -170); g.quadraticCurveTo(40, -130, 36, -96); g.quadraticCurveTo(14, -90, -6, -100); g.quadraticCurveTo(-4, -140, -14, -180); g.closePath(); }, o.skirt, 2.8);
  g.save(); g.translate(0, -172); g.rotate(lean); g.translate(0, 172);
  const pt = () => { g.moveTo(-18, -268); g.bezierCurveTo(-40 - wind * 12, -274, -52 - wind * 16, -256, -58 - wind * 18, -232 + wind * 8); g.bezierCurveTo(-46 - wind * 8, -238 + wind * 4, -36, -246, -22, -250); g.closePath(); };
  shape(pt, KIM.hair, 2.8); strokeOnly(() => { g.moveTo(-26, -262); g.quadraticCurveTo(-44 - wind * 16, -260, -58 - wind * 26, -242 + wind * 12); }, KIM.hairSh, 2.2);
  shape(() => E(-20, -260, 5, 8, 0.3), KIM.scrunchie, 2.2);
  group([[() => { g.moveTo(-14, -176); g.quadraticCurveTo(-18, -210, -6, -226); g.lineTo(18, -226); g.quadraticCurveTo(28, -206, 20, -176); g.closePath(); }, shirt]], 2.8);
  strokeOnly(() => { g.moveTo(-14, -180); g.lineTo(20, -180); }, shirtD, 5);
  shape(() => { g.moveTo(4, -226); g.lineTo(12, -214); g.lineTo(20, -226); g.closePath(); }, '#fff', 2);
  shape(() => C(10, -258, 30), KIM.skin, 2.8);
  shape(() => E(-6, -254, 5, 7), KIM.skin, 2.4);
  fillOnly(() => { g.moveTo(-20, -262); g.quadraticCurveTo(-24, -244, -14, -236); g.quadraticCurveTo(-12, -252, -4, -262); g.closePath(); }, KIM.hair);
  shape(() => { g.moveTo(14, -272); g.quadraticCurveTo(30, -270, 40, -262); g.quadraticCurveTo(32, -262, 30, -256); g.quadraticCurveTo(24, -264, 14, -264); g.closePath(); }, KIM.hair, 2);
  shape(() => { g.moveTo(-22, -262); g.bezierCurveTo(-24, -300, 34, -306, 42, -266); g.quadraticCurveTo(12, -272, -22, -262); g.closePath(); }, helmet, 2.8);
  fillOnly(() => E(4, -290, 14, 5, -0.2), 'rgba(255,255,255,.28)');
  shape(() => { g.moveTo(34, -268); g.quadraticCurveTo(52, -270, 56, -262); g.quadraticCurveTo(46, -258, 36, -262); g.closePath(); }, shade(helmet, -0.25), 2.4);
  strokeOnly(() => { g.moveTo(-4, -262); g.quadraticCurveTo(0, -240, 18, -232); }, '#222', 2.4);
  fillOnly(() => E(28, -252, 4.5, 6), '#2b1d2a'); fillOnly(() => E(28.6, -251, 3, 4.2), KIM.eye); fillOnly(() => C(29.5, -254, 1.6), '#fff');
  strokeOnly(() => { g.moveTo(23, -261); g.quadraticCurveTo(28, -264, 33, -261); }, '#c79a3a', 2);
  strokeOnly(() => { g.moveTo(38, -242); g.quadraticCurveTo(34, -238, 29, -240); }, '#a2445a', 2.2);
  fillOnly(() => E(22, -242, 6, 3.6), 'rgba(255,120,140,.35)');
  strokeOnly(() => { g.moveTo(39, -254); g.quadraticCurveTo(43, -249, 39, -246); }, KIM.skinSh, 2);
  group([[() => { poly([[0, -222], [14, -224], [32, -196], [22, -190]]); C(27, -193, 7); }, shirt]], 2.6);
  group([[() => { poly([[24, -198], [30, -188], [52, -190], [50, -198]]); C(52, -194, 6.5); }, KIM.skin]], 2.6);
  g.restore();
  const hx = Math.cos(lean) * 52 - Math.sin(lean) * (-194 + 172), hy = -172 + Math.sin(lean) * 52 + Math.cos(lean) * (-194 + 172);
  const [bx, by] = neckPt(pose, 126, -210);
  strokeOnly(() => { g.moveTo(hx, hy); g.quadraticCurveTo((hx + bx) / 2, Math.max(hy, by) + 10, bx, by); }, '#5a3420', 3);
}
