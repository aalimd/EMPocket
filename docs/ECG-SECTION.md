# EM-CPs ECG section — programmer notes

Investigation snapshot for anyone working on the ECG guide. **Read this before changing drawings, millimetre labels, or ACS wording.**

- **App:** static PWA, no build step.
- **Local URL:** `http://localhost/EM-CPs/#ecg`
- **This document is not clinical protocol.** Educational reference only.
- **Date of review:** 2026-09-03.

---

## 1. Verdict (read this first)

| Layer | Status |
|---|---|
| Written teaching (`ECG_DATA` in `assets/data.js`) | Strong. ED-framed, 2025 ACC/AHA/ACEP-aligned on the big items (new LBBB is not a STEMI equivalent; aVR STE + diffuse STD is not automatic code STEMI; OMI equivalents exist). |
| “ECG images” | **There are no real ECG photographs.** Every figure is an original SVG cartoon in `assets/ecg-svg.js`. |
| Calibration SVG (`rate-calibration`) | Only figure that is internally to scale (8 SVG units ≈ 1 mm ≈ 40 ms / 0.1 mV). |
| Other 24 SVGs | Morphology mnemonics, **not** millimetre-accurate 12-leads. Do not teach learners to count boxes on them. |
| Real PNG library | Planned, not built. `assets/ecg/` contains only `README.txt`. Every `png` field is `null`. |

**Rule of thumb:** trust the **words** on the pattern cards. Treat the **pictures** as icons of a pattern name.

---

## 2. File map

```
EM-CPs/
├── index.html                 # loads ecg-svg.js, then data.js, then app.js
├── assets/
│   ├── data.js                # ECG_DATA (steps, patterns, pearls, refs)
│   ├── ecg-svg.js             # base window.ECG_SVG library (title, caption, png, svg)
│   ├── ecg-case-tracings.js   # focused-lead synthetic pattern-library ECG tracings
│   ├── app.js                 # routing #ecg, renderEcg(), ecgFigure(), tools
│   ├── app.css                # .ecg-fig, paper grid, lightbox, paper theme
│   └── ecg/
│       └── README.txt         # how to add real PNGs later
├── sw.js                      # must list new assets; bump CACHE_VERSION
└── docs/
    └── ECG-SECTION.md         # this file
```

Script order in `index.html` (must stay this order):

1. `assets/ecg-svg.js`
2. `assets/data.js`
3. `assets/app.js`

Cache busting: query token on every asset URL (example at review time: `?v=20260903-34`) **and** `CACHE_VERSION` in `sw.js`. Change both when you edit ECG files.

---

## 3. How the ECG view is wired

### Route

| Hash | What renders |
|---|---|
| `#ecg` | Full ECG guide |
| `#ecg~wellens` | Same page, jump to pattern `wellens` |
| `#ecg~step-omi-equivalents` | Jump to step `omi-equivalents` |
| `#ecg~ecg-red-flags` | Jump to red-flag section |

Entry points (all should keep working):

- Header **ECG** button (`#ecgBtn`), keyboard **E**
- Sidebar item `data-ecg="1"`
- Home banner `#ecgEntryBtn`
- Search hits with `cpId === 'ecg'`
- Related-chip from chest pain, palpitations, syncope, overdose, shock, etc.
- Manifest shortcut `./#ecg`
- Study queue topic id `ecg`

### Data contract

`window.ECG_DATA` (`assets/data.js`):

- `title`, `subtitle`, `tag`, `overview`
- `firstPass[]`, `redFlags[]`
- `steps[]` — `id`, `num`, `name`, `icon`, `summary`, `details[]`, `pearl`, `pitfall`
- `patterns[]` — `id`, `name`, `tag`, `category` (`omi` \| `rhythm` \| `toxic` \| `mimics`), `severity` (`critical` \| `emergent` \| `common`), `leads`, `criteria`, `significance`, `action`, `caution`
- `pearls[]`, `pitfalls[]`, `refs[]`, `related[]` (presentation ids)

`window.ECG_SVG` (`assets/ecg-svg.js`):

```js
'wellens': {
  title: '...',
  caption: '...',
  png: null,          // or 'assets/ecg/wellens.png?v=TOKEN'
  svg: '<svg ...>...</svg>'
}
```

**IDs must match** step/pattern `id` in `ECG_DATA`. `app.js` calls `ecgFigure(s.id)` and `ecgFigure(p.id)`. A missing key silently renders no figure (`ecgFigure` returns `''`).

Current inventory: **7 steps + 18 patterns = 25 SVGs**. No missing keys, no orphans.

### Render path (`assets/app.js`)

- `getEcg()` validates `ECG_DATA` and caches it.
- `renderEcg(target)` builds the page: hero, first-30-seconds rail, 7 collapsible steps (each with `ecgFigure(step.id)`), killer chips, pattern library (each card with `ecgFigure(pattern.id)`), recall, notes, related, refs.
- `ecgFigure(id)` prefers `png` (with SVG fallback on `img` error); otherwise injects SVG.
- `ecgSvgWithRef(svg)` appends a dashed “Normal ST-T” overlay group (hidden until the **Normal** tool is pressed).
- Tools on each figure: **Annotations**, **Normal**, **Enlarge** (lightbox).
- Hotspots (`.ecg-hot` with `data-wave`) exist on the calibration, axis, interval, voltage and ischemia method figures and on the pattern cards rebuilt as teaching comparators (`stemi-criteria`, `hyperacute-t`, `wellens`, `dewinter`). Inspector copy lives in `ECG_WAVE_INFO`. Any card can expose tappable wave buttons + inspector text with plain `data-wave` tags (no `.ecg-hot` needed).

### CSS paper grid (important)

`.ecg-media` paints an 8px / 40px line grid in CSS pixels. The SVG `viewBox` is typically `0 0 640 260` (or 320 / 400) and **stretches with the card**. The grid and the tracing **do not stay locked**. Learners cannot count small boxes on screen and get a real millimetre.

---

## 4. ID list (keep in sync)

Use these ids in `ECG_DATA`, `ECG_SVG`, deep links, search, and future PNGs `assets/ecg/<id>.png`.

### Steps

| id | Step |
|---|---|
| `rate-calibration` | 1 · Calibration, Leads & Rate |
| `rhythm-axis` | 2 · Rhythm Branch & Axis |
| `intervals` | 3 · Intervals (PR, QRS, QTc) |
| `hypertrophy` | 4 · Voltage, Chambers & Low Voltage |
| `ischemia-map` | 5 · Ischemia Map & Fifth UDMI Lead Criteria |
| `omi-equivalents` | 6 · OMI Equivalents |
| `toxic-metabolic-mimics` | 7 · Deadly Mimics, Toxic & Metabolic |

### Patterns

| id | category | severity |
|---|---|---|
| `stemi-criteria` | omi | critical |
| `hyperacute-t` | omi | critical |
| `wellens` | omi | critical |
| `dewinter` | omi | critical |
| `sgarbossa` | omi | critical |
| `posterior-omi` | omi | critical |
| `avr-lmca` | omi | critical |
| `hyperkalemia` | toxic | critical |
| `hypokalemia` | toxic | emergent |
| `hypothermia` | toxic | critical |
| `brugada` | mimics | critical |
| `pe-strain` | mimics | critical |
| `pericarditis-ber` | mimics | emergent |
| `tca-toxicity` | toxic | critical |
| `wpw` | rhythm | critical |
| `vt-vs-svt` | rhythm | critical |
| `complete-heart-block` | rhythm | critical |
| `electrical-alternans` | mimics | critical |

---

## 5. Written content — what is correct

Safe to leave as-is unless a guideline changes:

- Unstable patient first; do not delay defibrillation/cardioversion for a prettier 12-lead.
- Confirm 25 mm/s, 10 mm/mV, limb placement, V1/V2 in 4th ICS.
- Branch: rate · regular vs irregular · narrow vs wide.
- **New or presumed-new LBBB alone is not a STEMI equivalent** (2025 ACC/AHA/ACEP ACS). Use Smith-modified Sgarbossa + the patient.
- The **Fifth Universal Definition (2026)** uses new J-point STE in two contiguous leads: **≥1 mm in every standard lead except V2–V3**, where sex/age-specific thresholds apply. Millimetre criteria still activate most labs **and** miss a large fraction of occlusions (OMI skill).
- Smith-modified Sgarbossa: **any** of (1) concordant STE ≥1 mm, (2) concordant STD ≥1 mm in V1–V3, (3) discordant STE with ST/S ≤ −0.25.
- Isolated horizontal STD V1–V3 + upright T → posterior OMI until V7–V9 (STE ≥ 0.5 mm).
- aVR STE + widespread STD = severe subendocardial ischemia (LMCA / 3VD / demand). **Not automatic code STEMI if stable.**
- Wellens: pain-free, no stress test.
- de Winter: treat as anterior OMI.
- Pre-excited AF: no adenosine / BB / CCB / digoxin.
- Undifferentiated regular wide-complex tachycardia: treat as VT.
- HyperK: treat the tracing; calcium for wide QRS / sine / instability; do not cardiovert sine-wave as VT.
- Pericarditis vs OMI: territorial STE + reciprocal STD is OMI until proven otherwise.
- S1Q3T3 is neither sensitive nor specific; normal ECG does not exclude PE.

---

## 6. Written content — mixed messages (text only)

Fix these only if you are already editing copy. They are not drawing bugs.

| Topic | Conflict |
|---|---|
| QRS “normal” | Inspector (`ECG_WAVE_INFO.qrs`): **&lt;110 ms** (AHA 2009). Step text: often **&lt;120 ms** (complete BBB / ACLS). 110–119 ms is incomplete BBB / IVCD. |
| QTc upper limit | Inspector: **≥450 men / ≥460 women** (AHA). Intervals SVG caption: **&lt;450/470**. |
| HyperK bicarb | Pattern card: bicarbonate **if acidemic**. HyperK SVG caption: lists bicarb in the immediate bundle. |
| Step 5 criteria | Step 5 now uses a source-checked **Fifth UDMI (2026)** lead/threshold map, not a simulated tracing. It explicitly separates the ≥1 mm standard-lead rule, the V2–V3 sex/age exception, and posterior/right-sided supplemental-lead thresholds. |

---

## 7. Images — how they work

- Library: `window.ECG_SVG` in `assets/ecg-svg.js`.
- Header comment claims “640×260, paper scale approx 25 mm/s, 10 mm/mV.” **That scale is true only for `rate-calibration`.**
- Each figure is badged **Schematic** and credits LITFL as a place to see *real* 12-leads (`https://litfl.com/ecg-library/`). LITFL images are **not** bundled.
- `aria-hidden="true"` is set on the SVGs. Hotspots on the first two figures are therefore hidden from assistive tech even though they have `role="button"`.

### Calibration figure (the only to-scale drawing)

`rate-calibration` is built as:

- 8 SVG units ≈ 1 mm
- 1 mm ≈ 40 ms and 0.1 mV (25 mm/s, 10 mm/mV)

Checked internally:

| Label | Geometry | Result |
|---|---|---|
| CAL 1 mV × 200 ms | height 80 units, width 40 units | matches 8 u/mm |
| RR 75/min | 219 → 379 = 160 units | 800 ms |
| PR 160 ms | 338 → 370 = 32 units | 160 ms |
| QRS 85 ms | 370 → 387 = 17 units | 85 ms |
| QT ~345 ms | 370 → 439 = 69 units | 345 ms |
| QTc ~385 | Bazett 345 / √0.8 | ≈ 386 ms |

Do not “simplify” this path without re-checking those spans.

### Pattern-library figures

The 18 pattern-library cards are generated in `ecg-case-tracings.js` as compact, synthetic focused-lead tracings. Each uses one representative lead, adding a paired lead only when comparison is intrinsic to the finding (for example V2–V3 for Wellens or aVR/II for diffuse subendocardial ischaemia). They are educational simulations, not patient recordings; the nominal 25 mm/s and 10 mm/mV labels do not make the responsive screen grid measurable.

The seven method figures in `ecg-svg.js` retain their purpose-built schematic layout. Except for `rate-calibration`, do not use the responsive screen grid to count millimetres.

### “Normal” overlay quirk

`ecgSvgWithRef()` chooses overlay position with:

```js
svg.indexOf('viewBox="0 0 640') !== -1 ? ECG_NORMAL_REF_WIDE : ECG_NORMAL_REF
```

**Every** current SVG viewBox starts with `0 0 640`, so **every** figure gets `ECG_NORMAL_REF_WIDE` (parked at `x=534, y=148`). It is a tiny stock sinus ST-T, not a same-lead compare. It is hidden until the Normal button is pressed.

---

## 8. Image-by-image (for whoever redraws)

### Good enough as teaching cartoons

| id | What is right | Do not claim |
|---|---|---|
| `rate-calibration` | Scale, rate, intervals | — |
| `rhythm-axis` | Narrow vs wide vs irregular; I/aVF quadrants | Path has messy `H118,84` syntax. Axis box is a diagram, not a tracing. |
| `wellens` | Type A biphasic vs Type B deep symmetric inversion comparator; R preserved, pain-free note, hotspots + Wellens inspector button | Synthetic focused leads, not a measured 12-lead. |
| `dewinter` | V3 upsloping STD → tall T paired with reciprocal aVR STE; hotspots + de Winter inspector button | Synthetic focused leads, not a measured 12-lead. |
| `hyperacute-t` | 3-shape comparator in one V3 viewpoint (normal vs hyperacute vs hyperK tenting); apex/broad-base markers, hotspots + T-wave/Hyperacute/HyperK inspector buttons | Synthetic, not a measured 12-lead. Territorial confirmation lives in card text + inspector, not the drawing. |
| `stemi-criteria` | Inferior II/III/aVF convex STE + aVL mirror STD; connected baseline, J-dots, red/blue ST highlights, red mm calipers, contiguous bracket, MIRROR mnemonic, hover/tap hotspots + tappable Inferior-STE/Mirror-STD inspector buttons | Synthetic, not a measured 12-lead. |
| `brugada` | Coved STE → negative T; saddle ≠ Type 1 | Not a measured ≥2 mm. |
| `hyperkalemia` | Tented T → wide QRS → sine ladder | Tented T is not 6–8 mm on canvas. |
| `hypokalemia` | U after T | QU ms not to scale. |
| `wpw` | Short PR + delta, then irregular wide varying | — |
| `vt-vs-svt` | Regular wide ~170 | Caption mentions AV dissociation/fusion; **not drawn**. |
| `pe-strain` | Tachy + TWI; S1Q3T3 downplayed | Not a 12-lead. |

### Misleading — fix drawing or caption if you touch them

| id | Problem |
|---|---|
| `ischemia-map` | **Evidence map, not a patient tracing.** Its Fifth UDMI core criteria and supplemental posterior/right-sided thresholds are linked directly to the source documents in the app. |
| `intervals` | Marker lengths do **not** use the calibration time scale, but labels say “PR 160 ms”. Looks measured; is not. |
| `hypertrophy` | One tall R labeled Sokolow **SV1+RV5 ≥35 mm**. Sokolow is a **sum of two leads**. |
| `sgarbossa` | One unlabeled wide-QRS strip cannot show concordance vs discordance. Lead not specified (V1 LBBB is negative; lateral is positive). |
| `posterior-omi` | STD + upright T is the right idea. R/S &gt; 1 and 40 ms R are labeled, not drawn. No flipped posterior lead. |
| `avr-lmca` | One strip labeled “aVR + diffuse”: first beat **up** (aVR STE), later beats **down** (STD). Two leads mashed into one line. |
| `hypothermia` | Osborn-ish J + shiver: right idea. Caption 1–2 mm; spike is much larger. “HR 36” is a label, not a counted rate. |
| `tca-toxicity` | “Terminal R ≥3 mm in aVR” is a label on a generic wide QRS. |
| `complete-heart-block` | Weakest rhythm drawing. Dropped beat is a gap; P vs QRS rates are not countable. |
| `electrical-alternans` | Size alternates. Caption “5 vs 9 mm” is not true on any shared scale. |
| `pericarditis-ber` | Concave STE suggested. PR depression, Spodick, BER fish-hook mostly **labeled, not drawn**. No three-way compare. |
| `omi-equivalents` | Three mini-sketches. Fine as a legend, not as examples you could diagnose from. |
| `toxic-metabolic-mimics` | Sine-like scribble. Caption is the teaching. |

---

## 9. Adding real 12-lead PNGs later

Convention (see also `assets/ecg/README.txt`):

1. Save de-identified sRGB PNG as `assets/ecg/<id>.png` (README says ~1200px / ~100–200 KB; `ecg-svg.js` header says 1600px — pick one and document it).
2. Set `png: 'assets/ecg/<id>.png?v=TOKEN'` on that key in `ECG_SVG`.
3. Add the file to `OPTIONAL_ASSETS` in `sw.js`.
4. Bump `?v=` **everywhere** it appears (`index.html`, `sw.js`, `manifest.json`, `app.js` SW register) and increment `CACHE_VERSION`.

`ecgFigure()` already falls back to SVG if the `<img>` errors.

Until PNGs exist, **do not** remove the Schematic badge or imply these are patient tracings.

---

## 10. What not to break

- Do not activate the lab for isolated new LBBB in copy or captions.
- Do not call aVR STE + diffuse STD “automatic STEMI” in a stable patient.
- Do not send Wellens for an exercise stress test.
- Do not give AV-nodal blockers in pre-excited AF.
- Do not treat sine-wave hyperK as VT.
- Do not drop V7–V9 / V4R from posterior / inferior OMI.
- Do not “fix” Calibration path lengths without re-checking the table in §7.
- Keep `ecg-svg.js` loaded **before** `app.js`.
- Keep step/pattern ids kebab-case `[a-z0-9-]+` — `getEcg()` rejects anything else.

---

## 11. Suggested work if someone is assigned ECG next

Priority order, not a commitment:

1. Caption/disclaimer on every figure: **“Schematic, not to scale, not a 12-lead.”** (Calibration can say “to scale, single lead II.”)
2. Keep `ischemia-map` as an evidence map rather than a simulated ECG. If its criteria change, update the linked primary sources and the text together.
3. Stop putting millimetre and rate numbers on cartoons that are not on the Calibration scale (`intervals`, `electrical-alternans`, `hypothermia`, `hypertrophy`).
4. Align QRS and QTc cuts in inspector vs step vs caption.
5. Real de-identified 12-leads for the high-stakes patterns: Wellens, de Winter, posterior, Sgarbossa, hyperK sine, pre-excited AF, Brugada Type 1.
6. Fix Normal-overlay placement (do not key off `viewBox="0 0 640"`).
7. Accessibility: do not `aria-hidden` interactive SVGs that have buttons inside.

---

## 12. Quick test checklist

After any ECG change:

- [ ] `http://localhost/EM-CPs/#ecg` renders title + first-pass + 7 steps + 18 pattern cards
- [ ] `#ecg~wellens` jumps to the Wellens card
- [ ] Header ECG, sidebar, home banner, **E** key, search “Wellens” all open the guide
- [ ] Chest pain **See also** includes ECG from scratch
- [ ] Each visible card has a figure (or an explicit empty state)
- [ ] Print still shows figures (tools/lightbox hidden in `@media print`)
- [ ] Token `?v=` and `CACHE_VERSION` bumped; private-window load, no 404 on `ecg-svg.js`

Live check at review time: 25 `.ecg-fig`, 0 `.ecg-img`, LITFL link present, steps start collapsed (`section-card closed`).
