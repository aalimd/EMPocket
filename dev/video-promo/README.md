# EM Pocket — promo video

A 27.5-second, 1080×1920 (9:16) promo for Reels / TikTok / Shorts.

Everything on screen is the real app: the device mockup contains actual
screenshots of the running application. No stock footage, no invented UI.

```
build.py            the whole pipeline (python3 + ffmpeg)
assets/             generated RGBA layers (device bezel, shadow, screen mask, glows)
frames/             viewport captures (922×1310) of individual screens
frames-fp/          full-page captures (700 × N) used for the scrolling shots
build/plates/       the crops that scroll inside the device
build/              per-scene clips, background, joined cut, audio  (generated)
out/                em-pocket-promo.mp4  (the deliverable)
```

## What the video does

| # | Scene | Caption | Camera |
|---|-------|---------|--------|
| 0 | Title card | *The EM Pocket* — emergency medicine, offline | — |
| 1 | Library | 52 emergency presentations | scrolls the topic list |
| 2 | Chest Pain | A structured clinical approach | scrolls the pathway |
| 3 | Doses & targets | Drug, dose, route and target | scrolls to the dose card |
| 4 | Calculators | Eleven clinical calculators | scrolls the calculator index |
| 5 | Pediatric doses | Weight-based, in seconds | scrolls the weight-based table |
| 6 | Search | Type adrenaline, find epinephrine | slow zoom |
| 7 | ECG | A systematic seven-step method | scrolls the seven steps |
| 8 | Learn | Cases that evolve as you decide | scrolls the learning tools |
| 9 | Quick reference | The first five minutes, ready | scrolls the fast paths |
| 10 | Close | Free to use · Works offline · No account needed | — |

Production values: a real device mockup (rounded screen mask + bezel + soft
shadow, all generated with `geq`), an animated gradient backdrop with drifting
glows, kinetic captions that slide and fade in, a centre-out accent rule,
`xfade` transitions between scenes, and a synthesised sound bed (pad + soft
pulse + a whoosh on every cut).

## Rebuild

```bash
brew install ffmpeg          # ffmpeg-full is needed for drawtext
cd dev/video-promo
python3 build.py             # add --force to re-render existing scene clips
open out/em-pocket-promo.mp4
```

The build is incremental: assets, plates, the background and each scene clip are
skipped when they already exist, so editing one caption costs seconds, not
minutes.

## Changing things

* **Captions / order / timing** — the `SCENES` table in `build.py`. Headline
  sizes auto-fit; eyebrow text is automatically letter-spaced.
* **Which part of a page scrolls** — the `SCROLL` table: `(source, css_start,
  css_end)`. The page coordinates come from the section maps printed while
  capturing, so any section can be targeted.
* **Look** — colours (`ACCENT`, `INK`, `MINT`), device geometry
  (`SCR_W/SCR_H/DEV_X/DEV_Y`) and the caption baselines (`EYEBROW_Y`, `HEAD_Y`,
  `RULE_Y`) are constants at the top of `build.py`.
* **Music** — the bed is synthesised in `build_audio()`. Swap it for a licensed
  track by dropping `music.m4a` next to `build.py` and pointing the final mux at
  it instead of `build/audio.m4a`.

## Claims shown in the video

Checked against the app before publishing: **52** presentations (`CP_DATA`),
**12** topics carrying dose cards, **11** clinical calculators. If any of these
change in the app, update the video or the promo will over-claim.

## Regenerating the captures

The screenshots live in `frames/` and `frames-fp/`. If the UI changes, re-capture
them with the browser tools (serve the app on `127.0.0.1:8765`, hide
`.ios-tabbar` for the full-page plates, expand every `<details>`), then delete
`build/` and re-run `build.py`. Coordinates in `SCROLL` will need re-checking.
