#!/usr/bin/env python3
"""Concatenate src/* into the single self-contained KimberHorses.html (fonts + CC0 audio inlined as data URLs)."""
import base64, glob, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
def b64(p): return base64.b64encode(open(p, 'rb').read()).decode()
fonts = [('Lilita One', 'LilitaOne', 400), ('Andika', 'Andika-Regular', 400), ('Andika', 'Andika-Bold', 700), ('Baloo 2', 'Baloo2', '400 800'), ('Fredoka', 'Fredoka', '300 700')]
css = ''.join("@font-face{font-family:'%s';src:url(data:font/woff;base64,%s) format('woff');font-weight:%s;font-display:block}\n" % (fam, b64('build_assets/%s.woff' % f), w) for fam, f, w in fonts)
audio = {'neighA': '1541', 'neighB': '1542', 'snort': '1543', 'gallop': '0611'}
ajs = 'const CLIPS_B64 = {' + ','.join("%s:'%s'" % (k, b64('audio_src/%s.mp3' % v)) for k, v in audio.items()) + '};\n'
parts = sorted(glob.glob('src/*'))
out = []
for p in parts:
    s = open(p, encoding='utf-8').read()
    if p.endswith('00_head.html'): s = s.replace('/*FONTS*/', css)
    if p.endswith('.js'): s = '/* ---- %s ---- */\n' % os.path.basename(p) + s
    if p.endswith('25_audio.js'): s = ajs + s
    out.append(s)
html = '\n'.join(out)
open('KimberHorses.html', 'w', encoding='utf-8').write(html)
print('built KimberHorses.html (%d bytes)' % len(html.encode()))
