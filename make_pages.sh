#!/bin/bash
# Assemble the GitHub Pages site into ../kimber-horses-pages
set -e
cd "$(dirname "$0")"; python3 build.py
OUT=../kimber-horses-pages; mkdir -p $OUT
sed 's#<!--PWA-LINKS-->#<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png"><link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png"><link rel="manifest" href="manifest.webmanifest">#' KimberHorses.html > $OUT/index.html
grep -q 'manifest.webmanifest' $OUT/index.html
(cd test && node icons.js ../$OUT)
cat > $OUT/manifest.webmanifest <<'MAN'
{
  "name": "Kimber & the Rainbow Ribbon",
  "short_name": "Rainbow Ribbon",
  "description": "A horse adventure for Kimber: pick and name your horse, dress it in real tack from around the world, and race through seven lands to bring the Rainbow Ribbon home.",
  "start_url": "./",
  "scope": "./",
  "display": "fullscreen",
  "orientation": "any",
  "background_color": "#7446c4",
  "theme_color": "#7446c4",
  "icons": [
    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
MAN
touch $OUT/.nojekyll
rm -rf $OUT/src $OUT/test $OUT/screenshots $OUT/plan $OUT/build_assets $OUT/audio_src; mkdir -p $OUT/src $OUT/test $OUT/screenshots $OUT/build_assets $OUT/audio_src
cp src/* $OUT/src/; cp build.py make_pages.sh $OUT/; cp test/*.js test/package.json $OUT/test/; [ -f test/package-lock.json ] && cp test/package-lock.json $OUT/test/
cp screenshots/*.png $OUT/screenshots/ 2>/dev/null || true
# plan docs stay private (not published)
cp build_assets/*.woff $OUT/build_assets/; cp audio_src/*.mp3 $OUT/audio_src/
cp KimberHorses.html $OUT/KimberHorses.html
cp README.md $OUT/README.md; cp PROGRESS.md $OUT/PROGRESS.md
printf 'node_modules/\n' > $OUT/.gitignore
echo "pages assembled in $OUT"
