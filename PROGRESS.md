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
- 12:59 PM CT: Repo antonolson47-ctrl/kimber-horses created (public) and pushed; Pages enabled from main /.
- 1:03 PM CT: LIVE: https://antonolson47-ctrl.github.io/kimber-horses/ returns 200 (manifest + KimberHorses.html too). WebKit iPhone 13 check on the live site: story, tack card, race (helper hooves), Grand Parade finale all render, 0 errors. Final screenshots in screenshots/final/ (1_story, 2_tack_card, 3_race, 4_finale).

## Interludes + Stable + Kari's buildings (PLAN ONLY, awaiting Anton's approval)
- Oct 9, 7:50 AM CT: Started plan/mockups for Carrot Toss, Horseback Archery, Stable building, Kari's Tack & Farrier Shop AND Truck & Trailer Garage (Anton wants both). Read GAME_PLAN, PROGRESS, src art code. Panels will be drawn with the game's own drawing code (KimberHorses.html loaded in Playwright, frame loop stopped, custom compositions) -> plan/mockups/interludes/. Nothing built or published.
- 7:49 AM CT: Carrot Toss panels (3) and Bow & Gallop archery panels (3) rendered and reviewed. Renderer: plan/mockups/interludes/src/render.cjs + panels.js. Anton update: BOTH Kari buildings (Tack & Farrier Shop + Truck & Trailer Garage); garage = FREE customizing of Kari's silver ~1999 "Toyoda Tacomo" compact pickup, show-off/test-drive mini-challenge pays DOUBLE horseshoes. Next: stable panels, shop panel, garage panel, docs.
- 7:53 AM CT: All 10 panels rendered and reviewed: carrot_1_intro, carrot_2_catch, carrot_3_results, archery_1_gallop_draw, archery_2_hit, archery_3_results_fact, stable_1_early, stable_2_grand, kari_1_tack_farrier_shop, kari_2_truck_trailer_garage. Fixed: archery arms/mane, target overlap, fact-card overflow, stable labels and level pill, shop tile text overlap, garage snorkel/bubble, mockup prices matched to the plan.
- 7:53 AM CT: Wrote plan/INTERLUDES_STABLE_PLAN.md (flow, horseshoe economy, both interludes with ramps, stars, replays and fun facts; 7-level stable tree with costs and pacing; Mom's Tack & Farrier Shop + FREE Toyoda Tacomo garage with a 2x Show-Off Drive; 5 questions) and plan/INTERLUDES_SUMMARY_FOR_ANTON.md. WAITING FOR ANTON'S APPROVAL; nothing built or published.

## BUILD: Interludes + Stable + Mom's buildings (Anton APPROVED Oct 9, 8:28 AM CT)
Decisions: one MANDATORY interlude between each pair of races (Carrot after R1, Archery after R2), replayable from map; one pouch incl. race shoes, harder economy (math below); garage 2x capped/diminishing; NORMAL-looking arrows (targets only); Foal Nursery -> name a foal (same naming flow), foal follows; archery fun facts worldwide (web-verified).
- 8:30 AM CT: Build started. Reading code (flow, map, stable, name, audio, tests).
- 8:36 AM CT: Measured race pickups (each 1, star 5, Whirligig catch +10): 36 in prologue, then 77–105 per race. A 2-star run is about 50–60, so the plan's costs (built on ~30 per race) get rescaled. Fun facts web-checked: yabusame (mlit.go.jp, gov-online.go.jp), Goguryeo Muyongchong mural (art-and-archaeology.com, ijkaa.org), modern Hungarian sport (hungarikum.hu, wfea.world), Comanche (tshaonline, thestoryoftexas, nps.gov), Parthian shot and gorytos (Wikipedia), Ottoman bow and Okmeydanı (dergipark), Naadam (UNESCO). File plan: 47_inter.js (economy, perks, facts, shared art, interlude results), 48_carrot.js, 49_archery.js, 50_build.js (stable + Mom's shop), 51_garage.js.

### Economy math (written 9:02 AM CT, Oct 9) — one pouch for everything
Race horseshoes, interlude horseshoes and garage-drive horseshoes all go into `S.wallet` (the pouch). `S.shoes` keeps counting lifetime horseshoes for the Lucky Jar golden apples. Old saves: wallet = old jar total (migrate), so nobody loses anything.

**Income per activity (typical 2-star play; Helper mode collects a bit more)**
| Activity | Horseshoes | Notes |
|---|---|---|
| Race | ~60% of pickups: 46–63 per race (Ch1 ≈ 46/52/55) | measured pickups per race 77–105; Lucky Shoes craft adds +10% |
| Carrot Toss (first time, 2★) | ~43 (Ch1) → ~64 (Ch7) | 3 per catch, combo +1/+2/+3 at 3/5/7, golden carrot 10, finish 10+2×chapter, +5 per NEW star |
| Bow & Gallop (first time, 2★) | ~44 (Ch1) → ~59 (Ch7) | 3 per hit, bullseye 5, balloon 3, mover 4, streak +3 per 3 in a row, finish 10+2×chapter, +5 per NEW star |
| Interlude replay | ~33–54 | same as above without the new-star bonus |
| Show-Off Drive with a 2× token | ~70–90 | road + fan cheers + splashes + style (capped at 20), ×2 |
| Show-Off Drive without a token | 1× first, then ½×, then ¼× the same day | anti-farm: diminishing returns reset each day |
| Mom's Fix-it polish | 15 | 1 token per Grand Stop (once the shop exists) + 1 free per day, max 3 banked |

**2× drive tokens (not farmable):** 1 the first time you open the garage, +1 per Chapter Grand Stop (max 3 banked) and 1 free per day. Every other drive that day pays 1×, then ½×, then ¼×.

**Costs**
- Stable core levels (one unlocks per chapter): Cozy Barn 300 (after Ch1 race 1), Wash Bay 380 (Ch1 done), Tack Room Wing 420 (Ch2), Indoor Arena 420 (Ch3), Foal Nursery 450 (Ch4), Show Hall 480 (Ch5), Rainbow Trail 520 (Ch6). Cumulative: 300 / 680 / 1,100 / 1,520 / 1,970 / 2,450 / 2,970.
- Luxuries (4 per level, 30–240 each): 3,200 total.
- Mom's Tack & Farrier Shop: 300 to build + 8 crafts (80–180) = 1,350.
- Everything = 7,520.

**Cumulative earnings by chapter vs. core costs (no replays, ~2★, 1 token drive per chapter, no daily bonus)**
| Ch | races | Carrot Toss | Bow & Gallop | token drive | Fix-it | chapter total | cumulative earned | cumulative core cost | gap |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 154 | 43 | 44 | 75 | 0 | 316 | 338 | 680 | -342 |
| 2 | 157 | 45 | 46 | 75 | 0 | 323 | 661 | 1100 | -439 |
| 3 | 148 | 50 | 48 | 75 | 15 | 336 | 997 | 1520 | -523 |
| 4 | 155 | 55 | 53 | 75 | 15 | 353 | 1350 | 1970 | -620 |
| 5 | 167 | 57 | 55 | 75 | 15 | 369 | 1719 | 2450 | -731 |
| 6 | 167 | 59 | 57 | 75 | 15 | 373 | 2092 | 2970 | -878 |
| 7 | 183 | 64 | 59 | 75 | 15 | 396 | 2488 | 2970 | -482 |
(Prologue adds ~22. Measured in the real touch test: 379 in the pouch after Ch1 with 3★ interludes and Helper mode, which is a bit above the 2★ estimate.)

**What it means**
- Main buildings: playing straight through buys about one level per chapter, one chapter late. Staying on schedule takes about 2–3 replays per chapter (a race ≈ 50, an interlude ≈ 40, a daily drive ≈ 75). Total core shortfall by the finale ≈ 480 ≈ 10–12 replays.
- Luxuries + Mom's shop (4,550 more) need about 90+ replays or daily drives: a long tail for after the story, not a giveaway.
- Perks are small and capped (+1 carrot, +1 arrow, +1 heart, slower meter drain, Golden Stalls ×1.1 on interludes, Lucky Shoes +10% race horseshoes), so upgrades can't snowball.

### Build log (Oct 9, CT)
- 8:37 AM: Patched 10_core (freshSave + migrate: wallet = old jar), 20_data (raceOpen needs the interlude), 40_game (earn() pouch, Lucky Shoes, grand gives drive/fix tokens), 45_race (racePerks, drain/refill), 44_flow (interlude routing on results, map interlude buttons, Stable -> SC.build, pouch counter, foal on map/treat/grand), 42_horses (foal naming mode), 90_main (raw touch hooks for scenes, __KH.sc/inter).
- 8:45 AM: First build: 0 errors. Smoke on all new scenes OK.
- 8:50 AM: Fixes: replay bug (`ended` never reset -> 2nd Carrot Toss hung), garage gating -> after Ch1, stray c8 line removed, Stock option locked, shop bubble off-screen, foal drawn before it existed in ires.
- 9:00 AM: Art fixes: bigger paddock (characters no longer cover wing labels), Show-Off Drive scenery (land backdrop, fence, flowers, bigger rig, foal galloping alongside), foal naming shows mom horse + foal, Rubber Mats icon, bow rests lower-left so it doesn't hide targets, land-panel interlude buttons (title no longer squished), shorter fun-fact modal, compact landscape results + fact card that fits.
- 9:02 AM: Economy math written (above). Migration test with an old save: wallet 260 = old jar, 0 errors.
- 9:15 AM: Final touch test running on Pixel 7 (Chromium), iPhone 13 + iPad gen 7 (WebKit). An earlier full pass had 0 errors on all three.
- 9:26 AM CT: Final touch test passed on all 3 devices (0 errors); old play.js --quick passes on Pixel 7 + iPhone 13. Publishing.
