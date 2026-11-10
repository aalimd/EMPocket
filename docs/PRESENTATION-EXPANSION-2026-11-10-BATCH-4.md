# Selected presentation expansion, batch 4 — 10 November 2026

Scope: 32 additional points in eight further presentations, with selected safety
corrections. There are now 32 presentations with scoped additions; this is not a
complete clinical audit. Two dose tables have selected changes described below.

- Pediatric fever: NICE NG143, CPS young-infant guidance and NICE NG240.
  Caregiver concern, previous fever, comfort measures, return advice and LP safety.
- Pediatric respiratory distress: NICE NG9. Selective suction, feeding/apnea
  assessment and age/risk-specific bronchiolitis discharge criteria replace a
  single generic oxygen cutoff. The bronchiolitis criteria do not govern asthma
  or croup. Existing croup observation remains a separate local-protocol decision.
- Anaphylaxis: RCUK (2021, still referenced by 2025 guidance). Positioning (semi-recumbent only without cardiovascular instability),
  test limitations, escalation and autoinjector teaching. Existing IM dose standards
  are unchanged.
- Burns: ABA adult resuscitation (2024), ABA referral guidance and ANZCOR first aid.
  Cooling, clothing/jewelry, injury timing and referral. The adult starting
  calculation changes from the historical Parkland estimate to ABA's lower initial
  estimate, explicitly limited to ≥20% TBSA adults and individually titrated.
  Pediatric resuscitation remains a separate protocol. Singed hair alone no longer
  triggers automatic intubation; airway compromise/progression governs escalation.
- Heat/cold: AHA 2025 special circumstances. Cooling with parallel resuscitation,
  core monitoring, protection from exposure and escalation of instability.
- Alcohol withdrawal: ASAM (2020), UK acute-hospital guidance (updated 2026).
  Emergency glucose is not withheld. Assessment and dosing strategy are qualified.
  The thiamine row separates ASAM prophylaxis from UK suspected-Wernicke treatment
  and adds treatment duration, review and infusion-safety context. Other withdrawal
  drug doses are unchanged and are not claimed as a new comprehensive dose audit.
- Suicide-risk assessment: NICE NG225. Concurrent psychosocial care, participation,
  collaborative safety planning and aftercare. Disposition no longer uses a
  shorthand low-risk label as a substitute for individualized assessment.
- Constipation: ASCRS (2024). Outlet symptoms, colonoscopy selection, regimen and
  specialist follow-up. The source link is updated to its verified moved location.

Exact source URLs and review scopes are in `assets/evidence.js`; the historical
full-review date is retained. New source keys: `burnResuscitation`, `burnReferral`,
`burnCooling`, `rcukAnaphylaxis`, `wernickeUK`. The ASAM link is corrected to its
current guideline page. Recommendations were checked against accessible primary
text, official guidance or indexed extracts of the primary source.

Validation: targeted clinical regressions and source checks; search indexing;
phone-browser checks of all 32 expanded topics; full Node test suite; JavaScript
syntax and synchronized PWA release. Automated checks guard selected distinctions
and behavior, not the validity of every clinical statement.

Browser-test reliability: wait for actual reader boot after navigation/reload,
handle the educational notice in the test profile, and restore injected storage
failures/unsaved-note state after each test to prevent cascading failures.
