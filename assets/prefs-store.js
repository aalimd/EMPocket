/* ══════════ EM-CPs reading-prefs store (Phase 2 extraction) ══════════
   Owns the display-preference state previously embedded in
   assets/app.js: theme, accent, text scale, bold and sidebar. Storage
   key (em-cps-prefs), normalization and failure semantics are
   unchanged, and this module is the single source of truth for the
   accent list and scale steps — assets/em-learning.js reads them at
   runtime (with literal fallbacks) to validate prefs in backups.

   Publishes window.EM_PREFS. app.js keeps thin delegating wrappers
   and the whole reading-panel UI; the pre-paint bootstrap in
   index.html still applies the saved prefs before first paint. */
(function () {
    'use strict';

    function isRecord(value) { return !!value && typeof value === 'object' && !Array.isArray(value); }

    const SCALE_STEPS = [0.85, 1, 1.12, 1.25, 1.4];
    const ACCENTS = ['emerald', 'ocean', 'violet', 'rose', 'amber', 'teal'];
    const ACCENT_LABELS = { emerald: 'Emerald green', ocean: 'Ocean blue', violet: 'Violet purple', rose: 'Rose red', amber: 'Amber orange', teal: 'Teal cyan' };
    function normalizeAccent(v) {
        return ACCENTS.indexOf(v) !== -1 ? v : 'emerald';
    }
    function nearestScale(v) {
        const n = Number(v) || 1;
        let best = 1, distance = Infinity;
        SCALE_STEPS.forEach(function (s) {
            const difference = Math.abs(s - n);
            if (difference < distance) { distance = difference; best = s; }
        });
        return best;
    }
    function normalizePrefs(value) {
        const prefs = isRecord(value) ? value : {};
        return {
            theme: prefs.theme === 'dark' ? 'dark' : 'light',
            accent: normalizeAccent(prefs.accent),
            scale: nearestScale(prefs.scale),
            bold: typeof prefs.bold === 'boolean' ? prefs.bold : false,
            sidebar: prefs.sidebar === true
        };
    }
    let prefsMemory = normalizePrefs({});
    let prefsStorageAvailable = true;
    function loadPrefs() {
        if (!prefsStorageAvailable) return prefsMemory;
        let raw;
        try {
            raw = localStorage.getItem('em-cps-prefs');
        } catch (e) {
            prefsStorageAvailable = false;
            return prefsMemory;
        }
        try { prefsMemory = normalizePrefs(JSON.parse(raw || '{}')); }
        catch (e) { prefsMemory = normalizePrefs({}); }
        return prefsMemory;
    }
    function savePrefs(prefs) {
        prefsMemory = normalizePrefs(prefs);
        if (!prefsStorageAvailable) return false;
        try {
            localStorage.setItem('em-cps-prefs', JSON.stringify(prefsMemory));
            return true;
        } catch (e) {
            prefsStorageAvailable = false;
            return false;
        }
    }
    window.EM_PREFS = {
        STORAGE_KEY: 'em-cps-prefs',
        SCALE_STEPS: SCALE_STEPS,
        ACCENTS: ACCENTS,
        ACCENT_LABELS: ACCENT_LABELS,
        normalizeAccent: normalizeAccent,
        nearestScale: nearestScale,
        normalizePrefs: normalizePrefs,
        loadPrefs: loadPrefs,
        savePrefs: savePrefs,
        isRecord: isRecord,
        storageAvailable: function () { return prefsStorageAvailable; }
    };
})();
