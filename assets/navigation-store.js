/* ══════════ EM-CPs navigation store (Phase 2 extraction) ══════════
   Owns the back-context state machine previously embedded in
   assets/app.js: Back returns to the destination that opened the
   current screen (Library, Search, Learn or Quick), never always to
   the first page, and re-focuses the card that opened it when that
   card survives the re-render. Topics and the ECG guide never
   overwrite this context — they only record which card opened them.

   Publishes window.EM_NAVIGATION. app.js keeps goBack() (it needs
   applyRoute) and thin delegating wrappers with the same names, so
   renderers and the router are untouched; if this script failed to
   load, Back degrades to always returning to the Library. */
(function () {
    'use strict';

    const BACK_DESTINATIONS = {
        library: { hash: '#library', label: 'Library' },
        search: { hash: '#search', label: 'Search' },
        learn: { hash: '#learn~home', label: 'Learn' },
        study: { hash: '#learn~home', label: 'Learn' },
        shift: { hash: '#shift', label: 'Quick' },
        ecg: { hash: '#ecg-hub', label: 'ECG' },
        explorer: { hash: '#ecg-explorer', label: 'Explorer' }
    };
    let backContext = { hash: '#library', originHash: '#library', label: 'Library' };
    let backSource = null;
    let lastClick = null;
    function recordBackContext(key, hash) {
        const dest = BACK_DESTINATIONS[key] || BACK_DESTINATIONS.library;
        backContext = { hash: hash || dest.hash, originHash: location.hash || '#library', label: dest.label };
    }
    function captureBackSource() {
        backSource = null; // A direct or unrelated navigation must not reuse an earlier card.
        if (!lastClick || lastClick.hash !== backContext.originHash) return;
        const el = lastClick.el;
        if (!el || !el.closest) return;
        const card = el.closest('[data-id]');
        if (card && /^[a-z0-9-]+$/.test(card.dataset.id || '')) {
            backSource = { selector: '[data-id="' + card.dataset.id + '"]', y: lastClick.scrollY };
            return;
        }
        const link = el.closest('a[href^="#"]');
        if (!link) return;
        const raw = (link.getAttribute('href') || '').slice(1);
        if (/^[a-z0-9-]+(?:~[a-z0-9-]+)?$/.test(raw)) backSource = { selector: 'a[href="#' + raw + '"]', y: lastClick.scrollY };
    }
    function restoreBackFocus(stage) {
        const source = backSource;
        backSource = null;
        let el = null;
        if (source && source.selector) {
            try { el = stage.querySelector(source.selector); } catch (e) { el = null; }
        }
        if (source && Number.isFinite(source.y)) window.scrollTo({ top: source.y });
        if (el && el.focus) { el.focus({ preventScroll: true }); return; }
        const fallback = document.getElementById('presentationLibraryTitle') || (stage && stage.querySelector('h1')) || stage;
        if (fallback && fallback.focus) { try { fallback.focus({ preventScroll: true }); } catch (e) {} }
    }
    function backDestination() {
        if ((location.hash || '#library') === backContext.hash) return { hash: '#library', label: 'Library' };
        return { hash: backContext.hash, label: backContext.label };
    }
    function rememberClick(el, hash, scrollY) {
        lastClick = { el: el, hash: hash, scrollY: scrollY };
    }

    window.EM_NAVIGATION = {
        BACK_DESTINATIONS: BACK_DESTINATIONS,
        recordBackContext: recordBackContext,
        captureBackSource: captureBackSource,
        restoreBackFocus: restoreBackFocus,
        backDestination: backDestination,
        rememberClick: rememberClick,
        /* Read-only snapshots for diagnostics and tests. */
        context: function () { return { hash: backContext.hash, originHash: backContext.originHash, label: backContext.label }; }
    };
})();
