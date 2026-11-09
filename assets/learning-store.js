/* ══════════ EM-CPs learning store (Phase 2 extraction) ══════════
   Owns the reviewed / saved / notes / review-plan state previously
   embedded in assets/app.js. Storage key, intervals and failure
   semantics are unchanged: a failed note write keeps the previous
   stored and session copies, and unreadable storage is never
   overwritten with an incomplete record.

   Publishes window.EM_LEARNING_STORE. app.js keeps thin delegating
   wrappers so its renderers and EM_POCKET_UI exports are untouched.
   dueIds() needs to know which ids are real topics; app.js injects
   its topicRecord via setTopicExists() (defaults to accepting all). */
(function () {
    'use strict';

    const REVIEW_INTERVALS = [1, 3, 7, 14];
    const reviewState = {};
    let topicExists = null;
    function setTopicExists(fn) { topicExists = typeof fn === 'function' ? fn : null; }

    function reviewFor(id) {
        if (!reviewState[id]) reviewState[id] = { redFlags: {}, sections: {} };
        return reviewState[id];
    }
    function isRecord(value) {
        return !!value && typeof value === 'object' && !Array.isArray(value);
    }
    function normalizeLearning(value) {
        const data = isRecord(value) ? value : {};
        return {
            reviewed: isRecord(data.reviewed) ? data.reviewed : {},
            reviewPlan: isRecord(data.reviewPlan) ? data.reviewPlan : {},
            saved: isRecord(data.saved) ? data.saved : {},
            notes: isRecord(data.notes) ? data.notes : {}
        };
    }
    let learningMemory = normalizeLearning({});
    let learningStorageAvailable = true;
    let learningStorageReadable = false;
    function loadLearning() {
        if (!learningStorageAvailable) return learningMemory;
        let raw;
        try {
            raw = localStorage.getItem('em-cps-learning');
        } catch (e) {
            learningStorageAvailable = false;
            learningStorageReadable = false;
            return learningMemory;
        }
        learningStorageReadable = true;
        try { learningMemory = normalizeLearning(JSON.parse(raw || '{}')); }
        catch (e) { learningMemory = normalizeLearning({}); }
        return learningMemory;
    }
    function saveLearning(data, retry) {
        learningMemory = normalizeLearning(data);
        if (!learningStorageAvailable && !(retry && learningStorageReadable)) return false;
        try {
            localStorage.setItem('em-cps-learning', JSON.stringify(learningMemory));
            learningStorageAvailable = true;
            return true;
        } catch (e) {
            learningStorageAvailable = false;
            return false;
        }
    }
    function reviewedIds() {
        const ids = loadLearning().reviewed || {};
        return Object.keys(ids).filter(id => ids[id]);
    }
    function isReviewed(id) { return reviewedIds().indexOf(id) !== -1; }
    function isReviewDue(id) {
        const item = loadLearning().reviewPlan[id];
        return !!item && Number(item.dueAt) <= Date.now();
    }
    function setReviewed(id, value) {
        const learning = loadLearning();
        if (value) {
            const previous = learning.reviewPlan[id] || {};
            const stage = Math.min((Number(previous.stage) || 0) + 1, REVIEW_INTERVALS.length);
            learning.reviewed[id] = Date.now();
            learning.reviewPlan[id] = { stage: stage, dueAt: Date.now() + REVIEW_INTERVALS[stage - 1] * 86400000 };
        } else {
            delete learning.reviewed[id];
            delete learning.reviewPlan[id];
        }
        const persisted = saveLearning(learning);
        return { plan: learning.reviewPlan[id] || null, persisted: persisted };
    }
    function savedIds() {
        const saved = loadLearning().saved || {};
        return Object.keys(saved).filter(id => saved[id]);
    }
    function isSaved(id) { return savedIds().indexOf(id) !== -1; }
    function setSaved(id, value) {
        const learning = loadLearning();
        if (value) learning.saved[id] = Date.now(); else delete learning.saved[id];
        return saveLearning(learning);
    }
    function noteFor(id) {
        const notes = loadLearning().notes || {};
        return String(notes[id] || '');
    }
    function setNote(id, note) {
        const learning = loadLearning();
        const updated = Object.assign({}, learning, { notes: Object.assign({}, learning.notes) });
        if (note.trim()) updated.notes[id] = note.trim(); else delete updated.notes[id];
        const persisted = saveLearning(updated, true);
        // A failed note write remains a draft, so Discard can still restore the saved note.
        if (!persisted) learningMemory = learning;
        return persisted;
    }
    function dueIds() {
        const plan = loadLearning().reviewPlan || {};
        const now = Date.now();
        return Object.keys(plan).filter(id => (!topicExists || topicExists(id)) && Number(plan[id].dueAt) <= now);
    }
    function reviewLabel(id) {
        const item = (loadLearning().reviewPlan || {})[id];
        if (!item) return 'Not scheduled';
        if (Number(item.dueAt) <= Date.now()) return 'Due now';
        const days = Math.max(1, Math.ceil((Number(item.dueAt) - Date.now()) / 86400000));
        return 'Review in ' + days + 'd';
    }
    window.EM_LEARNING_STORE = {
        REVIEW_INTERVALS: REVIEW_INTERVALS,
        reviewState: reviewState,
        setTopicExists: setTopicExists,
        reviewFor: reviewFor,
        isRecord: isRecord,
        normalizeLearning: normalizeLearning,
        loadLearning: loadLearning,
        saveLearning: saveLearning,
        reviewedIds: reviewedIds,
        isReviewed: isReviewed,
        isReviewDue: isReviewDue,
        setReviewed: setReviewed,
        savedIds: savedIds,
        isSaved: isSaved,
        setSaved: setSaved,
        noteFor: noteFor,
        setNote: setNote,
        dueIds: dueIds,
        reviewLabel: reviewLabel
    };
})();
