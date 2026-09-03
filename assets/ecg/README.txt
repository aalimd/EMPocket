EM-CPs future real ECG tracings.

Convention: assets/ecg/<id>.png (1200px wide, sRGB, de-identified, ~100-200KB).
IDs: rate-calibration, rhythm-axis, intervals, hypertrophy, ischemia-map, omi-equivalents, toxic-metabolic-mimics, stemi-criteria, hyperacute-t, wellens, dewinter, sgarbossa, posterior-omi, avr-lmca, hyperkalemia, hypokalemia, hypothermia, brugada, pe-strain, pericarditis-ber, tca-toxicity, wpw, vt-vs-svt, complete-heart-block, electrical-alternans.

When adding:
1. Save PNG here.
2. In assets/ecg-svg.js set png: 'assets/ecg/<id>.png?v=TOKEN'.
3. Add file to OPTIONAL_ASSETS in sw.js.
4. Bump ?v= token everywhere + CACHE_VERSION.
