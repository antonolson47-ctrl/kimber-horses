# Kimber & the Rainbow Ribbon

A horse adventure made for Kimber. Play it here: **https://antonolson47-ctrl.github.io/kimber-horses/**

Whirligig, a lonely little whirlwind, has spun the Rainbow Ribbon over Moonmeadow Riding Academy into seven threads. Kimber and her horse race through seven lands to bring every color home. Before every race, Mom Kari is waiting with apples, cake and a big hug. At the end, everyone (Whirligig too) rides in the Midsummer Grand Parade.

## What's inside
- **Pick and name your horse:** 26 breeds, with the Appaloosa first and seven Appaloosa coat patterns. Kimber names every horse herself (a kind-words filter keeps names friendly). The stable holds up to 6 horses.
- **The Tack Room:** 43 real pieces of tack from around the world (saddles, blankets, bridles, chest pieces, mane and tail, plumes, flowers), plus 5 pretend Academy treasures. Every item has an info card (where, when, who, a story, and a map pin) and color choices. Kimber's helmet and polo colors can be changed too. There is also a Surprise button and a photo button.
- **7 lands, 22 races:** each race has two celebration stops (with stickers) and a Grand Stop at the end of each land. New skills come one at a time: logs, forks in the path, double jumps, ducking, puddles, a night ride and cloud steps.
- **Mom's treat stop before every race:** pick the treats, then hug Mom to get a 3-heart shield.
- **Horse sounds:** a charging whinny at every start and a victory neigh at every finish. These are CC0 recordings, with synthesized backups.
- **Music:** an original soundtrack that the game generates as you play. It changes section every few bars and goes up a key at every celebration stop, and each land has its own theme.
- **Read-aloud:** stories, cards and Mom's lines can be read aloud with the device's own voice (tap the speaker button).
- **Saving and privacy:** progress saves on the device by itself. There are no ads, no purchases and no data collection. It works offline once it has loaded.
- **Parent Corner:** hold the gear button for 3 seconds. It has volume, read-aloud, helper hooves (automatic jumps), slower races, left-handed buttons, unlock everything, and start over.

## Add it to the Home Screen
- **iPhone or iPad (Safari):** Share, then Add to Home Screen.
- **Android (Chrome):** the menu, then Add to Home screen or Install app.

## Build
`python3 build.py` builds `KimberHorses.html`, a single file with the fonts and sounds inlined. `./make_pages.sh` assembles the GitHub Pages copy. Tests (Playwright) are in `test/`; for example, `node test/play.js "iPhone 13"` plays the whole game.

## Credits
- Horse whinnies, snort and gallop: Joseph Sardin, BigSoundBank.com (#1541, #1542, #1543, #0611), CC0.
- Fonts: Lilita One, Fredoka, Andika and Baloo 2 (SIL Open Font License).
- The art and music are original and drawn in code.
