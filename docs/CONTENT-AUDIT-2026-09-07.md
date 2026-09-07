# Clinical content, ECG and code review — 7 September 2026

## Scope and outcome

Reviewed the teaching application, its 45 presentation records, seven ECG teaching steps, 18 ECG pattern cards, and 27 SVG library entries. The work combined source checks of high-risk and potentially outdated statements, correction of inconsistent advice, visual review, numerical ECG tests and browser regression checks. This is a targeted evidence review, not independent clinical certification of every sentence or drug dose. Existing work in the checkout was preserved.

## ECG changes and interpretation limits

- Enlarged the nine morphology schematics, added explicit feature labels and explanatory captions, and removed their misleading paper grids. These are **not to scale** and must not be used for interval, rate or voltage measurements.
- Corrected the WPW schematic's shortened PR/delta relationship; explained sinus pre-excitation versus pre-excited AF.
- Added comparisons for VT versus SVT, Mobitz I/II and 2:1/complete AV block, and pericarditis versus early repolarization versus coronary occlusion.
- Corrected a clipped hypertrophy label; preserved readable, horizontally scrollable figures on small screens with keyboard access.
- Retained calibrated modeled examples with shared waveform/grid geometry. Screen millimetres vary with display scaling; the waveform-to-grid ratio is what is calibrated.
- Clarified that aVR changes do not identify a left-main lesion, PE strain does not diagnose/exclude PE, electrical alternans alone does not prove tamponade, and negative posterior leads do not exclude occlusion.

The schematic IDs are `avr-lmca`, `hypokalemia`, `hypothermia`, `brugada`, `pe-strain`, `pericarditis-ber`, `tca-toxicity`, `wpw`, and `electrical-alternans`. Ten diagnoses have dynamic modeled tracings. Other entries teach measurement/criteria or provide the synthetic normal 12-lead. The 27-entry library includes supplementary examples beyond the guide's 25 unique figure references.

Every ECG remains synthetic. The figures illustrate selected morphology and cannot represent the variability of patient recordings. Real, licensed/de-identified ECG examples and independent ECG-specialist review remain appropriate before presenting this as a clinically validated ECG library.

## Main clinical corrections

| Area | Correction |
|---|---|
| Chest pain | A normal troponin alone does not rule out ACS; selected very-low hs-cTn results can support single-sample rule-out only in a validated pathway with appropriate timing. |
| PE/dyspnea | Use a validated D-dimer pathway; avoid mixing thresholds ad hoc. Selected low-risk PE can receive outpatient treatment after structured assessment. |
| Stroke | Updated thrombectomy advice to include selected large-core and basilar cases under 2026 pathways, rather than requiring perfusion mismatch in every late presentation. |
| Dizziness | Use timing/triggers; HINTS is for an appropriate ongoing vestibular syndrome with nystagmus and a trained examiner. Early negative MRI is not an absolute exclusion. |
| Headache | Qualified six-hour CT and Ottawa SAH rule populations; residual concern still needs further investigation. |
| DKA/HHS | Updated diagnostic/resolution criteria, emphasized blood ketones over the anion gap for resolution, individualized fluids and corrected cortisol sampling relative to steroids. |
| Pregnancy | Replaced blanket RhIg for every early loss with current ACOG guidance and explicit limits for ectopic pregnancy, trauma and later gestations. |
| Infection/pediatrics | Corrected fulminant CDI combination treatment, vaccine-related infant reassurance and timing of Kawasaki assessment. |
| Arrhythmia | Explicitly avoid IV amiodarone in pre-excited AF; clarify unsynchronized shock for sustained polymorphic VT and treat reversible causes alongside pacing/support. |
| Toxicology | Bicarbonate endpoints include pH/sodium limits. Acetaminophen advice distinguishes acute timed exposure from repeated/unknown-time exposure, and emphasizes laboratory/clinical NAC stopping criteria. |
| Other emergencies | Clarified acute liver failure, methylene-blue precautions, temperature-specific hypothermia resuscitation and LP timing in seizure workup. |

## Evidence trail

`assets/evidence.js` supplies explicit, clickable sources to the relevant presentation reference sections. Its review date applies to the selected teaching points, not every statement on those pages. Older guideline dates do not automatically mean obsolete guidance.

Principal sources checked:

- [ACC ED chest-pain pathway (2022)](https://www.jacc.org/doi/10.1016/j.jacc.2022.08.750), [Fifth Universal Definition of MI (2026)](https://www.jacc.org/doi/full/10.1016/j.jacc.2026.07.025), [AF guideline (2023)](https://www.ahajournals.org/doi/10.1161/CIR.0000000000001193).
- [AHA adult ALS (2025)](https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support) and [special circumstances (2025)](https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation).
- [AHA/ASA ischemic stroke guideline (2026)](https://www.ahajournals.org/doi/10.1161/STR.0000000000000513), [SAEM GRACE-3](https://www.saem.org/publications/grace/grace-3), [ACEP headache policy](https://www.acep.org/siteassets/sites/acep/media/clinical-policies/cp-headache.pdf).
- [Adult DKA/HHS consensus (2024)](https://doi.org/10.2337/dci24-0032), [Endocrine Society adrenal insufficiency guidance](https://www.endocrine.org/clinical-practice-guidelines/primary-adrenal-insufficiency).
- [Surviving Sepsis Campaign (2026)](https://sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-campaign-international-guidelines-for-management-of-sepsis-and-septic-shock-2026), [GINA (2026)](https://ginasthma.org/wp-content/uploads/2026/05/GINA-2026-Strategy-Report-WMS.pdf), [acute PE guideline (2026)](https://www.jacc.org/doi/10.1016/j.jacc.2025.11.005).
- [ACOG early pregnancy loss](https://www.acog.org/womens-health/faqs/early-pregnancy-loss), [IDSA CDI guidance](https://www.idsociety.org/practice-guideline/clostridioides-difficile-2021-focused-update/), [AHA Kawasaki statement (2024)](https://www.ahajournals.org/doi/epdf/10.1161/CIR.0000000000001295).
- [US/Canada acetaminophen consensus, corrected (2023)](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2808062).

Additional topic links in the registry cover NICE head injury, spinal cord compression, ectopic pregnancy and bronchiolitis; EAU infected obstruction; CDC PID/epididymitis; AES status epilepticus; and EBJIS septic arthritis. Drug choices and regional thresholds still require local formulary/protocol alignment. A complete jurisdiction-specific dose/formulary audit was not performed.

## Code and verification

- Escape quote characters in HTML output; recursively sanitize nested rich-text descendants before unwrapping disallowed containers. Executable elements/attributes are removed while permitted emphasis and ordinary clinical text are retained.
- Validate ECG duration, speed, gain and lead inputs; reject invalid/non-finite inputs instead of constructing misleading or unbounded drawings.
- Show visible failures for missing ECG rendering; remove unused schematic drawing constants.
- Add source-link validation and clinical consistency regression checks.
- Preserve usable network responses when cache storage fails, and return a valid error response when offline navigation has no cached shell.
- Advance the app/cache release token so installed copies can acquire the changed assets.

Verification: `node --test tests/*.test.js` (31 groups); browser fixture (226 checks: SVG parsing/label bounds, sanitizer/escaping and 49 routes at 320, 390, 768 and 1280 CSS-pixel widths). Visual checks included all library entries, enlarged normal 12-lead and the dynamic workbench at 390 px with speed/gain/window/caliper controls. Automated checks do not establish clinical validity. Live production hosting, physical-device printing, offline installation/upgrade on devices and a complete assistive-technology audit were not tested.

## Reproduce locally

Run a static server at the repository root and open `dev/audit.html` on localhost. The fixture removes the onboarding notice only from its isolated test document; it does not accept or persist an agreement. `dev/contact.html?page=0` through `page=6` provides visual contact sheets. Do not ship `dev/` or `tests/` to production.
