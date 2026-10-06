# Kimber & the Rainbow Ribbon: build progress

Anton approved the plan on Oct 6, 2026, 11:13 AM CT. The build follows `plan/GAME_PLAN.md` and the concept art in `plan/`.

## Decisions (from Anton)
- Title and academy name approved. Whirligig is a gentle troublemaker who gets forgiven.
- Kimber: blue eyes, blonde, rides English, so the starting saddle is S5 English Hunt.
- Read-aloud uses the Web Speech API, with a toggle, started on a user tap (iOS).
- Defaults: respectful Nez Perce and Navajo cards; CC0 BigSoundBank horse sounds plus synth backups, credited on the About screen; a stable with several horses; Kimber names each horse, with a kind-words filter.
- Publish to antonolson47-ctrl/kimber-horses on GitHub Pages (approved).

## Layout
- `src/`: source parts, built by `build.py` into `KimberHorses.html` (single file, fonts and audio inlined)
- `build_assets/`: subset woff fonts (OFL)
- `audio_src/`: CC0 clips (BigSoundBank #1541, #1542, #1543, #0611), trimmed to mp3
- `test/`: Playwright tests (WebKit iPhone/iPad, Chromium Pixel)
- `make_pages.sh`: assembles `../kimber-horses-pages`

## Status log
- [x] Assets: CC0 clips downloaded and encoded (44 KB total); fonts subset to woff (185 KB)
- [x] Core, art library, data (src/10-20)
- [x] Scenes: title, story, stable/coat picker, name entry, tack room, map, treat stop, race, results, grand stop, finale, stickers, about, parent corner (src/40-46, 90_main.js); builds to KimberHorses.html
- [x] Audio: sfx, CC0 clips, music engine, speech (src/25_audio.js); UI framework (src/30_ui.js)
- [ ] Tests: playthroughs on iPhone and iPad (both orientations) and Pixel
- [ ] Publish

- Oct 6, 11:45 AM CT: First build runs clean. Quick Pixel 7 playthrough (title, story, coat, name with kind filter, prologue race, grand stop, map, tack room and card, stable, stickers, parent gate, ch1 race) has no errors or overlaps. Bot: `test/play.js "<device>" [--quick] [--rotate]`.

- 11:43 AM CT: Parent-gate/reset holds now use real elapsed time (works on slow devices). Faded-land desaturation baked into cached sprites (no per-frame full-screen composite → faster on iPhone). Treat stop now always includes Mom's apple AND cake (+1 bonus pick from Land 4). Test bot scrolls the tack card before tapping colours. Re-running quick WebKit tests.
- 11:56 AM CT: Quick runs clean on all 5 configs (iPhone 13 ±landscape, iPad gen7 ±landscape, Pixel 7). Fixed: Kimber colour panel fit, landscape map node sizing, icon-button hit overlap, countdown tip no longer covers horse, race buttons' labels on-screen, results "new items" compact layout. Full playthroughs running.
- 12:28 PM CT: Full playthrough round 1: all 7 lands + Grand Parade completed on all 5 configs, 0 JS errors, whinny at every start/finish (22/22). Found & fixed: fork buttons overlapping duck (moved to sky), cramped landscape treat tiles (tight layout, Hug/Ride side by side), results card overlap in phone landscape (two-column), parade finale (richer foreground fence/rosettes/flowers/balloons, landscape clear of buttons), bot waited too short for finale buttons. Round 2 running.
- 12:54 PM CT: Round 2 full runs stopped (interrupted; Pixel 7 round 2 finished clean apart from text-box check false positives, now tightened). Running QUICK tests on all 5 configs before publishing.
- 12:54 PM CT: Round 2 full results before stop: iPhone 13, iPhone 13 landscape, iPhone 13 with mid-race rotation, Pixel 7 all completed 7 lands + parade, 0 errors, 22/22 whinny starts/finishes. Only new-check findings: padded text boxes (tightened) and race tip vs duck button in phone landscape (tip now narrower). iPad round 2 was cut off (round 1 iPad portrait clean).
- 12:58 PM CT: QUICK tests clean on all 5 configs (0 errors, 0 overlaps; title logo box split to fix a check false positive). Publishing now.
