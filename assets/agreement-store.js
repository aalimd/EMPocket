/* ══════════ EM-CPs agreement store (Phase 2 extraction) ══════════
   Owns the educational-notice agreement state previously embedded in
   assets/app.js: the em-cps-disclaimer-agreed flag and its in-memory
   cache. Storage key and semantics are unchanged — once agreed in this
   session the flag stays agreed even if storage later fails, and the
   agreement is deliberately never part of learning backups.

   Publishes window.EM_AGREEMENT. The disclaimer dialog UI (show /
   hide / setup, focus trap, inert handling) stays in app.js. */
(function () {
    'use strict';

    const DISCLAIMER_STORAGE_KEY = 'em-cps-disclaimer-agreed';
    let disclaimerAgreedInMemory = false;
    function isDisclaimerAgreed() {
        if (disclaimerAgreedInMemory) return true;
        try { disclaimerAgreedInMemory = !!localStorage.getItem(DISCLAIMER_STORAGE_KEY); }
        catch (e) {}
        return disclaimerAgreedInMemory;
    }
    function setDisclaimerAgreed() {
        disclaimerAgreedInMemory = true;
        try { localStorage.setItem(DISCLAIMER_STORAGE_KEY, String(Date.now())); }
        catch (e) {}
    }
    window.EM_AGREEMENT = {
        STORAGE_KEY: DISCLAIMER_STORAGE_KEY,
        isAgreed: isDisclaimerAgreed,
        setAgreed: setDisclaimerAgreed
    };
})();
