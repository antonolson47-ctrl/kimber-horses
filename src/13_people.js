/* ===================== PEOPLE: Kimber (blonde, blue eyes, rides English) and Mom Kari (dark brown hair) ===================== */
const KIM = { skin: '#f9dcc6', skinSh: '#efc2a6', hair: '#f4d06f', hairSh: '#d9a948', helmet: '#33407e', shirt: '#9b5de5', jod: '#f3e7cf', boot: '#2f2430', scrunchie: '#ff6fa5', eye: '#4f86d9' };
const KARI = { skin: '#f7d6bf', hair: '#3e2519', hairHi: '#5e3a28', top: '#fff2df', cardi: '#2fa39a', jeans: '#4a6fa5', shoe: '#7a4a3a', eye: '#6b4a32' };
const HELMET_COLS = [['#33407e', 'Navy'], ['#2a2630', 'Black'], ['#7446c4', 'Purple'], ['#ff6fa5', 'Pink'], ['#3aa0d8', 'Sky blue'], ['#2fa36b', 'Green']];
const POLO_COLS = [['#9b5de5', 'Purple'], ['#ff6f91', 'Pink'], ['#2fa39a', 'Teal'], ['#e8304a', 'Red'], ['#3f6fd8', 'Blue'], ['#f2b632', 'Yellow']];
function applyKimColors() { KIM.helmet = HELMET_COLS[S.kim.helmet % HELMET_COLS.length][0]; KIM.shirt = POLO_COLS[S.kim.polo % POLO_COLS.length][0]; }
// ---------- front view: Kimber standing ----------
function drawKimber(x, y, s, o = {}) {
  const expr = o.expr || 'happy', pose = o.pose || 'stand';
  g.save(); g.translate(x, y); g.scale(s, s);
  if (!o.noShadow) groundShadow(0, 0, 46, 8);
  // ponytail peeking (behind)
  shape(() => { g.moveTo(26, -196); g.bezierCurveTo(60, -196, 70, -160, 58, -128); g.bezierCurveTo(52, -146, 44, -160, 30, -172); g.closePath(); }, KIM.hair, 3);
  strokeOnly(() => { g.moveTo(36, -188); g.quadraticCurveTo(56, -176, 56, -144); }, KIM.hairSh, 2.4);
  shape(() => E(32, -190, 6, 9, 0.5), KIM.scrunchie, 2.4);
  // legs: jodhpurs + tall boots
  group([[() => { RR(-26, -78, 24, 50, 8); RR(2, -78, 24, 50, 8); }, KIM.jod]], 3);
  group([[() => { RR(-27, -46, 25, 44, 7); RR(2, -46, 25, 44, 7); E(-16, -3, 15, 7); E(16, -3, 15, 7); }, KIM.boot]], 3);
  fillOnly(() => { g.rect(-24, -40, 4, 30); g.rect(5, -40, 4, 30); }, 'rgba(255,255,255,.18)');
  // arms
  const armL = pose === 'wave' ? () => { poly([[-30, -128], [-22, -116], [-52, -150], [-58, -144]]); C(-56, -154, 9); } : pose === 'cheer' ? () => { poly([[-30, -128], [-22, -116], [-46, -170], [-56, -166]]); C(-52, -176, 9); } : () => { poly([[-34, -126], [-24, -122], [-30, -82], [-40, -84]]); C(-35, -78, 8); };
  const armR = pose === 'cheer' ? () => { poly([[30, -128], [22, -116], [46, -170], [56, -166]]); C(52, -176, 9); } : () => { poly([[34, -126], [24, -122], [30, -82], [40, -84]]); C(35, -78, 8); };
  group([[armL, KIM.shirt], [armR, KIM.shirt]], 3);
  const hands = pose === 'wave' ? [[-56, -156], [35, -78]] : pose === 'cheer' ? [[-52, -178], [52, -178]] : [[-35, -78], [35, -78]];
  for (const [hx, hy] of hands) shape(() => C(hx, hy, 8), KIM.skin, 3);
  // torso: polo shirt
  group([[() => { g.moveTo(-32, -132); g.quadraticCurveTo(-36, -100, -30, -74); g.lineTo(30, -74); g.quadraticCurveTo(36, -100, 32, -132); g.quadraticCurveTo(0, -142, -32, -132); g.closePath(); }, KIM.shirt]], 3);
  strokeOnly(() => { g.moveTo(-30, -80); g.lineTo(30, -80); }, '#3a2a48', 6); strokeOnly(() => { g.moveTo(-32, -124); g.lineTo(32, -124); }, shade(KIM.shirt, -0.18), 0.01);
  shape(() => { RR(-5, -82, 10, 7, 2); }, '#f2c14e', 2);
  shape(() => { g.moveTo(-12, -136); g.lineTo(0, -122); g.lineTo(12, -136); g.lineTo(0, -132); g.closePath(); }, '#fff', 2.5);
  // academy crest (horseshoe)
  strokeOnly(() => { g.arc(-15, -108, 6, Math.PI * 0.85, Math.PI * 2.15); }, '#f2c14e', 3);
  // neck + head
  shape(() => RR(-8, -146, 16, 14, 5), KIM.skinSh, 0);
  shape(() => E(0, -186, 44, 42), KIM.skin, 3);
  shape(() => E(-43, -182, 7, 10), KIM.skin, 2.6); shape(() => E(43, -182, 7, 10), KIM.skin, 2.6);
  // blonde bangs + side hair under helmet
  shape(() => { g.moveTo(-42, -204); g.quadraticCurveTo(-46, -176, -40, -162); g.quadraticCurveTo(-34, -186, -24, -200); g.quadraticCurveTo(-10, -186, 4, -198); g.quadraticCurveTo(16, -186, 30, -198); g.quadraticCurveTo(36, -184, 42, -164); g.quadraticCurveTo(48, -184, 42, -206); g.closePath(); }, KIM.hair, 2.6);
  // helmet
  shape(() => { g.moveTo(-46, -200); g.bezierCurveTo(-50, -262, 50, -262, 46, -200); g.quadraticCurveTo(0, -214, -46, -200); g.closePath(); }, KIM.helmet, 3);
  shape(() => { g.moveTo(-36, -204); g.quadraticCurveTo(0, -222, 36, -204); g.quadraticCurveTo(0, -196, -36, -204); g.closePath(); }, shade(KIM.helmet, -0.28), 2.4);
  fillOnly(() => E(-14, -240, 16, 6, -0.3), 'rgba(255,255,255,.3)');
  shape(() => C(0, -252, 4), shade(KIM.helmet, 0.2), 1.8);
  strokeOnly(() => { g.moveTo(-40, -196); g.quadraticCurveTo(-40, -160, -18, -150); g.moveTo(40, -196); g.quadraticCurveTo(40, -160, 18, -150); }, '#1f1f28', 2.6);
  // face
  drawKimFace(expr);
  g.restore();
}
function drawKimFace(expr) {
  const ey = -180;
  if (expr === 'closed' || expr === 'giggle') {
    strokeOnly(() => { g.moveTo(-24, ey); g.quadraticCurveTo(-16, ey - 8, -8, ey); g.moveTo(8, ey); g.quadraticCurveTo(16, ey - 8, 24, ey); }, '#2b1d2a', 3.4);
  } else {
    const ry = expr === 'wow' ? 11 : 10;
    for (const ex of [-16, 16]) { fillOnly(() => E(ex, ey, 7.5, ry), '#2b1d2a'); fillOnly(() => E(ex, ey + 2, 5.5, ry - 3), KIM.eye); fillOnly(() => E(ex, ey + 2, 3.4, ry - 5), '#1d1622'); fillOnly(() => C(ex + 2.5, ey - 4, 2.6), '#fff'); fillOnly(() => C(ex - 2.5, ey + 4, 1.2), '#fff'); }
    strokeOnly(() => { g.moveTo(-23, ey - 9); g.lineTo(-26, ey - 13); g.moveTo(23, ey - 9); g.lineTo(26, ey - 13); }, '#2b1d2a', 2.2);
  }
  // brows
  const by = expr === 'determined' ? -194 : -196;
  strokeOnly(() => { g.moveTo(-24, by + (expr === 'determined' ? -3 : 0)); g.quadraticCurveTo(-16, by - 4, -8, by + (expr === 'determined' ? 2 : 0)); g.moveTo(8, by + (expr === 'determined' ? 2 : 0)); g.quadraticCurveTo(16, by - 4, 24, by + (expr === 'determined' ? -3 : 0)); }, '#c99a3e', 2.8);
  fillOnly(() => { E(-28, -166, 8, 5); E(28, -166, 8, 5); }, 'rgba(255,120,140,.35)');
  strokeOnly(() => { g.moveTo(-2, -172); g.quadraticCurveTo(0, -168, 2, -172); }, KIM.skinSh, 2.4);
  if (expr === 'wow') shape(() => E(0, -158, 6, 8), '#7a2a3a', 2.4);
  else if (expr === 'determined') strokeOnly(() => { g.moveTo(-10, -160); g.quadraticCurveTo(0, -154, 10, -160); }, '#7a2a3a', 3);
  else shape(() => { g.moveTo(-13, -162); g.quadraticCurveTo(0, -146, 13, -162); g.quadraticCurveTo(0, -158, -13, -162); g.closePath(); }, '#9a3346', 2.4);
}
// ---------- front view: Mom Kari ----------
function drawKari(x, y, s, o = {}) {
  const pose = o.pose || 'stand', expr = o.expr || 'happy';
  g.save(); g.translate(x, y); g.scale(s, s);
  if (!o.noShadow) groundShadow(0, 0, 52, 9);
  // hair back (shoulder length)
  shape(() => { g.moveTo(-46, -238); g.bezierCurveTo(-62, -206, -58, -186, -44, -176); g.lineTo(44, -176); g.bezierCurveTo(58, -186, 62, -206, 46, -238); g.bezierCurveTo(40, -284, -40, -284, -46, -238); g.closePath(); }, KARI.hair, 3);
  // legs
  group([[() => { RR(-26, -100, 24, 92, 9); RR(2, -100, 24, 92, 9); }, KARI.jeans]], 3);
  group([[() => { E(-15, -6, 15, 7); E(15, -6, 15, 7); }, KARI.shoe]], 3);
  // arms
  if (pose === 'basket') {
    group([[() => { poly([[-38, -168], [-28, -164], [-30, -112], [-40, -114]]); C(-35, -108, 8); }, KARI.cardi], [() => { poly([[38, -168], [28, -164], [14, -122], [24, -116]]); C(18, -116, 8); }, KARI.cardi]], 3);
  } else if (pose === 'open') {
    group([[() => { poly([[-38, -170], [-30, -160], [-70, -196], [-76, -186]]); C(-76, -194, 9); }, KARI.cardi], [() => { poly([[38, -170], [30, -160], [70, -196], [76, -186]]); C(76, -194, 9); }, KARI.cardi]], 3);
  } else {
    group([[() => { poly([[-40, -168], [-30, -164], [-34, -104], [-44, -106]]); C(-39, -100, 8); }, KARI.cardi], [() => { poly([[40, -168], [30, -164], [34, -104], [44, -106]]); C(39, -100, 8); }, KARI.cardi]], 3);
  }
  // torso: cream top + open teal cardigan
  group([[() => { g.moveTo(-38, -172); g.quadraticCurveTo(-42, -130, -34, -96); g.lineTo(34, -96); g.quadraticCurveTo(42, -130, 38, -172); g.quadraticCurveTo(0, -182, -38, -172); g.closePath(); }, KARI.cardi]], 3);
  shape(() => { g.moveTo(-14, -176); g.lineTo(-12, -96); g.lineTo(12, -96); g.lineTo(14, -176); g.quadraticCurveTo(0, -164, -14, -176); g.closePath(); }, KARI.top, 2.4);
  strokeOnly(() => { g.moveTo(-6, -150); g.quadraticCurveTo(0, -144, 6, -150); }, '#e86a8a', 2.4); // little heart necklace line
  shape(() => heart(0, -140, 5), '#e86a8a', 1.6);
  if (pose === 'basket') {
    for (const [hx, hy] of [[-35, -108], [18, -116]]) shape(() => C(hx, hy, 8), KARI.skin, 3);
    drawBasket(-8, -96, 1);
  } else if (pose === 'open') { for (const [hx, hy] of [[-76, -194], [76, -194]]) shape(() => C(hx, hy, 8.5), KARI.skin, 3); }
  else for (const [hx, hy] of [[-39, -100], [39, -100]]) shape(() => C(hx, hy, 8), KARI.skin, 3);
  // head
  shape(() => RR(-8, -190, 16, 16, 5), '#ecc0a4', 0);
  shape(() => E(0, -226, 38, 40), KARI.skin, 3);
  shape(() => E(-37, -222, 6, 9), KARI.skin, 2.4); shape(() => E(37, -222, 6, 9), KARI.skin, 2.4);
  // hair front: side-swept dark brown with soft waves
  shape(() => { g.moveTo(-42, -228); g.bezierCurveTo(-48, -290, 50, -292, 44, -226); g.quadraticCurveTo(44, -200, 40, -186); g.quadraticCurveTo(34, -214, 28, -234); g.quadraticCurveTo(0, -238, -18, -252); g.quadraticCurveTo(-28, -232, -36, -218); g.quadraticCurveTo(-40, -196, -44, -190); g.quadraticCurveTo(-46, -210, -42, -228); g.closePath(); }, KARI.hair, 3);
  strokeOnly(() => { g.moveTo(-20, -266); g.quadraticCurveTo(6, -256, 30, -244); }, KARI.hairHi, 3);
  // face
  const ey = -220;
  if (expr === 'closed') strokeOnly(() => { g.moveTo(-21, ey); g.quadraticCurveTo(-14, ey - 7, -7, ey); g.moveTo(7, ey); g.quadraticCurveTo(14, ey - 7, 21, ey); }, '#2b1d2a', 3.2);
  else for (const ex of [-14, 14]) { fillOnly(() => E(ex, ey, 6, 8), '#2b1d2a'); fillOnly(() => E(ex, ey + 1.5, 4.2, 5.6), KARI.eye); fillOnly(() => C(ex + 2, ey - 3, 2), '#fff'); }
  strokeOnly(() => { g.moveTo(-21, -234); g.quadraticCurveTo(-14, -238, -7, -234); g.moveTo(7, -234); g.quadraticCurveTo(14, -238, 21, -234); }, '#3e2519', 2.6);
  fillOnly(() => { E(-24, -206, 7, 4.5); E(24, -206, 7, 4.5); }, 'rgba(255,120,140,.32)');
  strokeOnly(() => { g.moveTo(-2, -212); g.quadraticCurveTo(0, -208, 2, -212); }, '#e0a888', 2.2);
  shape(() => { g.moveTo(-12, -202); g.quadraticCurveTo(0, -188, 12, -202); g.quadraticCurveTo(0, -198, -12, -202); g.closePath(); }, '#b04456', 2.2);
  g.restore();
}
function drawBasket(x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  strokeOnly(() => { g.moveTo(-26, -10); g.quadraticCurveTo(0, -44, 26, -10); }, INK, 7); strokeOnly(() => { g.moveTo(-26, -10); g.quadraticCurveTo(0, -44, 26, -10); }, '#c98a4b', 4);
  shape(() => { C(-12, -12, 9); }, '#e8304a', 2.4); shape(() => { C(6, -14, 9); }, '#8bc34a', 2.4); strokeOnly(() => { g.moveTo(-12, -21); g.lineTo(-10, -26); }, INK, 2);
  shape(() => { g.moveTo(-30, -8); g.lineTo(30, -8); g.lineTo(24, 20); g.lineTo(-24, 20); g.closePath(); }, '#d99a55', 3);
  clipTo(() => { g.moveTo(-30, -8); g.lineTo(30, -8); g.lineTo(24, 20); g.lineTo(-24, 20); g.closePath(); }, () => { g.strokeStyle = '#a8692f'; g.lineWidth = 2; for (let k = -30; k < 30; k += 8) { g.beginPath(); g.moveTo(k, -8); g.lineTo(k + 4, 20); g.stroke(); } g.beginPath(); g.moveTo(-30, 4); g.lineTo(30, 4); g.stroke(); });
  shape(() => { g.moveTo(-30, -8); g.lineTo(30, -8); g.lineTo(28, -2); g.lineTo(-28, -2); g.closePath(); }, '#e86a8a', 2);
  g.restore();
}
// Mom's hug: Kari bends in and wraps Kimber (front view)
function drawHug(x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  groundShadow(0, 0, 95, 12);
  g.save(); g.translate(36, 0); g.rotate(-0.15); drawKari(0, 0, 1.08, { pose: 'stand', expr: 'closed', noShadow: true }); g.restore();
  drawKimber(-48, 0, 1.0, { expr: 'closed', noShadow: true });
  // Kimber's arm around Mom's waist
  group([[() => { g.moveTo(-22, -124); g.bezierCurveTo(-4, -122, 14, -116, 30, -106); g.lineTo(25, -96); g.bezierCurveTo(12, -104, -6, -110, -24, -110); g.closePath(); }, KIM.shirt]], 3);
  shape(() => C(30, -100, 8), KIM.skin, 3);
  // Mom's arm over Kimber's near shoulder (rest is behind her neck), hand on far shoulder
  group([[() => { g.moveTo(-4, -186); g.bezierCurveTo(-12, -168, -18, -148, -26, -134); g.lineTo(-12, -128); g.bezierCurveTo(-4, -146, 6, -164, 12, -180); g.closePath(); }, KARI.cardi]], 3);
  shape(() => E(-80, -130, 9, 8), KARI.skin, 3);
  shape(() => E(-20, -130, 9, 8), KARI.skin, 3);
  [[-20, -300, 12, '#ff6f91'], [30, -330, 9, '#ff9ab5'], [-62, -320, 8, '#ffb3c7'], [60, -296, 7, '#ff6f91']].forEach(([hx, hy, hs, col]) => shape(() => heart(hx, hy, hs), col, 2.4));
  g.restore();
}
