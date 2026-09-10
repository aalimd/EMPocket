/* ══════════ EM-CPs app logic ══════════ */
(function () {
    'use strict';

    const REQUIRED_ARRAY_FIELDS = ['approach', 'dontMiss', 'history', 'exam', 'workup', 'redFlags', 'disposition', 'pitfalls', 'refs'];
    const seenDataIds = new Set();
    const DATA = (Array.isArray(window.CP_DATA) ? window.CP_DATA : []).filter(function (cp) {
        if (!cp || typeof cp.id !== 'string' || !/^[a-z0-9-]+$/.test(cp.id) || seenDataIds.has(cp.id) ||
            typeof cp.name !== 'string' || typeof cp.icon !== 'string' || typeof cp.tag !== 'string' || typeof cp.overview !== 'string' ||
            !REQUIRED_ARRAY_FIELDS.every(function (field) { return Array.isArray(cp[field]); }) ||
            !['approach', 'history', 'exam', 'redFlags', 'pitfalls', 'refs'].every(function (field) {
                return cp[field].every(function (item) { return typeof item === 'string'; });
            }) ||
            !cp.dontMiss.every(function (item) {
                return Array.isArray(item) && item.length >= 3 && item.every(function (part) { return typeof part === 'string'; }) &&
                    ['critical', 'emergent', 'common'].indexOf(item[1]) !== -1;
            }) ||
            !cp.workup.every(function (item) {
                return Array.isArray(item) && typeof item[0] === 'string' && Array.isArray(item[1]) &&
                    item[1].every(function (part) { return typeof part === 'string'; });
            }) ||
            !cp.disposition.every(function (item) {
                return Array.isArray(item) && item.length >= 2 && typeof item[0] === 'string' && typeof item[1] === 'string';
            })) return false;
        seenDataIds.add(cp.id);
        return true;
    });
    const BY_ID = {};
    DATA.forEach(function (cp) { BY_ID[cp.id] = cp; });

    function announce(msg) {
        var el = document.getElementById('ariaLive');
        if (!el) {
            el = document.createElement('div');
            el.id = 'ariaLive';
            el.setAttribute('aria-live', 'polite');
            el.setAttribute('aria-atomic', 'true');
            el.className = 'sr-only';
            document.body.appendChild(el);
        }
        el.textContent = '';
        requestAnimationFrame(function () { el.textContent = msg; });
    }

    const GROUPS = [
        { title: 'Cardiorespiratory & vascular', ids: ['chest-pain', 'dyspnea', 'hemoptysis', 'cyanosis', 'shock', 'palpitations', 'edema', 'limb-ischemia'] },
        { title: 'Neurologic', ids: ['headache', 'dizziness', 'ams', 'coma', 'seizures', 'weakness', 'syncope', 'diplopia', 'focal-neurologic-deficit'] },
        { title: 'Abdomen, pelvis & GU', ids: ['abdominal-pain', 'gib', 'nausea-vomiting', 'diarrhea', 'constipation', 'jaundice', 'pelvic-pain', 'vaginal-bleeding', 'scrotal-pain', 'flank-pain', 'urinary-retention', 'back-pain'] },
        { title: 'Airway, allergy, skin & pediatrics', ids: ['airway-stridor', 'anaphylaxis', 'rash', 'fever', 'pediatric-fever', 'pediatric-respiratory-distress', 'sore-throat', 'red-eye', 'joint-pain'] },
        { title: 'Toxic, metabolic & environmental', ids: ['overdose', 'suicidal', 'hyperglycemia', 'heat-cold'] },
        { title: 'Trauma, pregnancy & older adults', ids: ['multiple-trauma', 'pregnancy-emergency', 'falls-geriatric-trauma'] }
    ];
    const RELATED = {
        'chest-pain': ['dyspnea', 'syncope', 'shock', 'nausea-vomiting', 'limb-ischemia'],
        'dyspnea': ['chest-pain', 'shock', 'cyanosis', 'hemoptysis'],
        'limb-ischemia': ['chest-pain', 'shock', 'back-pain', 'fever'],
        'abdominal-pain': ['pelvic-pain', 'scrotal-pain', 'nausea-vomiting', 'gib', 'diarrhea'],
        'headache': ['dizziness', 'red-eye', 'seizures', 'ams', 'diplopia'],
        'ams': ['coma', 'seizures', 'overdose', 'syncope', 'fever', 'heat-cold', 'hyperglycemia'],
        'syncope': ['chest-pain', 'seizures', 'gib', 'shock'],
        'weakness': ['back-pain', 'seizures', 'ams', 'diplopia'],
        'gib': ['shock', 'abdominal-pain', 'syncope'],
        'fever': ['pediatric-fever', 'shock', 'sore-throat', 'ams', 'heat-cold', 'limb-ischemia'],
        'dizziness': ['headache', 'syncope', 'diplopia'],
        'back-pain': ['weakness', 'abdominal-pain', 'constipation'],
        'red-eye': ['headache', 'diplopia', 'sore-throat'],
        'joint-pain': ['fever', 'back-pain'],
        'coma': ['ams', 'seizures', 'overdose', 'shock'],
        'pelvic-pain': ['vaginal-bleeding', 'abdominal-pain', 'scrotal-pain'],
        'vaginal-bleeding': ['pelvic-pain', 'shock', 'abdominal-pain'],
        'scrotal-pain': ['abdominal-pain', 'pelvic-pain'],
        'seizures': ['ams', 'coma', 'overdose', 'headache'],
        'sore-throat': ['fever', 'dyspnea', 'chest-pain'],
        'hemoptysis': ['dyspnea', 'chest-pain', 'shock'],
        'shock': ['chest-pain', 'dyspnea', 'gib', 'fever', 'overdose', 'limb-ischemia', 'hyperglycemia'],
        'nausea-vomiting': ['abdominal-pain', 'diarrhea', 'chest-pain', 'headache', 'constipation', 'hyperglycemia'],
        'diarrhea': ['nausea-vomiting', 'abdominal-pain', 'constipation'],
        'constipation': ['abdominal-pain', 'diarrhea', 'back-pain', 'nausea-vomiting'],
        'jaundice': ['abdominal-pain', 'fever', 'overdose'],
        'cyanosis': ['dyspnea', 'shock', 'overdose'],
        'overdose': ['ams', 'coma', 'seizures', 'suicidal', 'heat-cold'],
        'pediatric-fever': ['fever', 'seizures', 'sore-throat'],
        'suicidal': ['overdose', 'ams', 'heat-cold'],
        'hyperglycemia': ['ams', 'nausea-vomiting', 'shock', 'abdominal-pain'],
        'heat-cold': ['ams', 'coma', 'fever', 'overdose'],
        'diplopia': ['headache', 'red-eye', 'weakness', 'dizziness'],
        'palpitations': ['chest-pain', 'syncope', 'dyspnea', 'shock'],
        'focal-neurologic-deficit': ['headache', 'dizziness', 'weakness', 'diplopia', 'ams'],
        'airway-stridor': ['dyspnea', 'sore-throat', 'anaphylaxis', 'pediatric-respiratory-distress'],
        'rash': ['fever', 'anaphylaxis', 'joint-pain', 'overdose'],
        'flank-pain': ['abdominal-pain', 'pelvic-pain', 'scrotal-pain', 'fever'],
        'urinary-retention': ['back-pain', 'weakness', 'fever', 'flank-pain'],
        'edema': ['dyspnea', 'chest-pain', 'shock', 'limb-ischemia'],
        'anaphylaxis': ['airway-stridor', 'dyspnea', 'rash', 'overdose'],
        'multiple-trauma': ['shock', 'coma', 'back-pain', 'limb-ischemia'],
        'falls-geriatric-trauma': ['syncope', 'weakness', 'coma', 'multiple-trauma'],
        'pregnancy-emergency': ['pelvic-pain', 'vaginal-bleeding', 'dyspnea', 'abdominal-pain'],
        'pediatric-respiratory-distress': ['dyspnea', 'airway-stridor', 'pediatric-fever', 'anaphylaxis']
    };

    const stage = document.getElementById('stage');
    const SEV_ICON = { critical: '🔴', emergent: '🟠', common: '🟢' };
    const SEV_LABEL = { critical: 'Critical', emergent: 'Emergent', common: 'Common' };
    /* Distinct per-presentation icons — original `cp.icon` emoji kept in data.js, never deleted.
       Each subject keeps its own icon (🫀🫁🧠…). System chrome (home/ecg/theme/bolt) stays mono SVG. */
    function monoSvg(inner) {
        return '<svg class="mono-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
    }
    const GROUP_SVG = {
        generic: monoSvg('<path d="M4 6h16M4 12h16M4 18h10"/>'),
        ecg: monoSvg('<path d="M2 12h5l3-8 4 16 3-8h5"/>'),
        home: monoSvg('<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-8H9v8H4a1 1 0 0 1-1-1z"/>'),
        bolt: monoSvg('<path d="m13 2-9 12h7l-1 8 10-12h-7z"/>')
    };
    const THEME_SVG = {
        moon: monoSvg('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'),
        sun: monoSvg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>')
    };
    function iconForId(id) {
        if (id === 'ecg') return GROUP_SVG.ecg;
        try {
            var cp = (typeof BY_ID !== 'undefined' && BY_ID[id]) ? BY_ID[id] : null;
            if (cp && cp.icon) return '<span class="emoji-ico" aria-hidden="true">' + esc(cp.icon) + '</span>';
        } catch (e) {}
        return GROUP_SVG.generic;
    }
    function iconFor(cp) {
        if (cp && cp.id === 'ecg') return GROUP_SVG.ecg;
        if (cp && cp.icon) { try { return '<span class="emoji-ico" aria-hidden="true">' + esc(cp.icon) + '</span>'; } catch (e) {} }
        return iconForId(cp && cp.id);
    }
    function sevDot(sev) { return '<span class="sev-dot sev-' + sev + '" aria-hidden="true"></span>'; }
    let currentId = null;
    let severityFilter = 'all';
    let searchCursor = -1;
    let deferredInstallPrompt = null;
    let sidebarReturnFocus = null;
    const reviewState = {};
    let patientFilter = 'all';
    let libraryFiltersOpen = false;
    let caseCursor = 0;
    let offlineStatus = ('serviceWorker' in navigator && navigator.serviceWorker.controller) ? 'Works offline' :
        ('serviceWorker' in navigator ? 'Offline setup pending' : 'Online access');
    const REVIEW_INTERVALS = [1, 3, 7, 14];
    const PATIENT_CONTEXTS = {
        pediatric: ['pediatric-fever', 'pediatric-respiratory-distress', 'airway-stridor', 'fever', 'rash', 'seizures', 'abdominal-pain', 'headache'],
        pregnancy: ['pregnancy-emergency', 'pelvic-pain', 'vaginal-bleeding', 'abdominal-pain', 'dyspnea', 'chest-pain', 'headache', 'overdose'],
        geriatric: ['falls-geriatric-trauma', 'ams', 'syncope', 'abdominal-pain', 'chest-pain', 'dyspnea', 'headache', 'weakness', 'back-pain'],
        immunocompromised: ['fever', 'pediatric-fever', 'dyspnea', 'abdominal-pain', 'headache', 'rash', 'sore-throat'],
        trauma: ['multiple-trauma', 'falls-geriatric-trauma', 'back-pain', 'headache', 'weakness', 'limb-ischemia', 'chest-pain']
    };
    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function rich(s) {
        const allowed = { STRONG: 1, EM: 1, BR: 1 };
        // Parse into an inert template, then sanitize descendants before unwrapping.
        const template = document.createElement('template');
        template.innerHTML = String(s);
        const wrap = template.content;
        (function clean(node) {
            Array.from(node.childNodes).forEach(function (child) {
                if (child.nodeType === 8) { node.removeChild(child); return; }
                if (child.nodeType !== 1) return;
                if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'SVG', 'MATH', 'TEMPLATE'].indexOf(child.tagName) !== -1) {
                    node.removeChild(child); return;
                }
                clean(child);
                if (!allowed[child.tagName]) {
                    while (child.firstChild) node.insertBefore(child.firstChild, child);
                    node.removeChild(child);
                    return;
                }
                Array.from(child.attributes).forEach(function (a) { child.removeAttribute(a.name); });
            });
        }(wrap));
        return template.innerHTML;
    }

    const ECG_TOPIC_ID = 'ecg';
    const ECG_CAT_LABEL = { omi: 'OMI / STEMI', rhythm: 'Rhythm', toxic: 'Toxic-metabolic', mimics: 'Mimics' };
    const ECG_FROM_PRESENTATIONS = {
        'chest-pain': 1, 'palpitations': 1, 'syncope': 1, 'overdose': 1, 'shock': 1,
        'dyspnea': 1, 'ams': 1, 'coma': 1, 'heat-cold': 1, 'weakness': 1, 'hyperglycemia': 1
    };
    let ecgCategory = 'all';
    let ecgFocusId = null;
    let _ecgCache = undefined;

    function getEcg() {
        if (_ecgCache !== undefined) return _ecgCache;
        const raw = window.ECG_DATA;
        if (!raw || typeof raw !== 'object' || typeof raw.title !== 'string' ||
            !Array.isArray(raw.steps) || !Array.isArray(raw.patterns)) {
            _ecgCache = null;
            return null;
        }
        const steps = raw.steps.filter(function (s) {
            return s && typeof s.id === 'string' && /^[a-z0-9-]+$/.test(s.id) &&
                typeof s.name === 'string' && typeof s.summary === 'string' &&
                Array.isArray(s.details) && s.details.every(function (d) { return typeof d === 'string'; });
        });
        const seen = {};
        const patterns = raw.patterns.filter(function (p) {
            if (!p || typeof p.id !== 'string' || !/^[a-z0-9-]+$/.test(p.id) || seen[p.id]) return false;
            if (typeof p.name !== 'string' || typeof p.criteria !== 'string' || typeof p.action !== 'string') return false;
            if (['critical', 'emergent', 'common'].indexOf(p.severity) === -1) return false;
            if (['omi', 'rhythm', 'toxic', 'mimics'].indexOf(p.category) === -1) return false;
            seen[p.id] = 1;
            return true;
        });
        if (!steps.length || !patterns.length) {
            _ecgCache = null;
            return null;
        }
        _ecgCache = {
            title: raw.title,
            subtitle: typeof raw.subtitle === 'string' ? raw.subtitle : '',
            tag: typeof raw.tag === 'string' ? raw.tag : 'Read the patient first — then read the tracing.',
            overview: typeof raw.overview === 'string' ? raw.overview : '',
            firstPass: Array.isArray(raw.firstPass) ? raw.firstPass.filter(function (x) { return typeof x === 'string'; }) : [],
            redFlags: Array.isArray(raw.redFlags) ? raw.redFlags.filter(function (x) { return typeof x === 'string'; }) : [],
            steps: steps,
            patterns: patterns,
            pearls: Array.isArray(raw.pearls) ? raw.pearls.filter(function (x) { return typeof x === 'string'; }) : [],
            pitfalls: Array.isArray(raw.pitfalls) ? raw.pitfalls.filter(function (x) { return typeof x === 'string'; }) : [],
            refs: Array.isArray(raw.refs) ? raw.refs.filter(function (x) { return typeof x === 'string'; }) : [],
            related: Array.isArray(raw.related) ? raw.related.filter(function (id) { return BY_ID[id]; }) : []
        };
        return _ecgCache;
    }
    function topicRecord(id) {
        if (id === ECG_TOPIC_ID) return { id: ECG_TOPIC_ID, name: 'Emergency ECG Guide', icon: '📈', tag: 'Systematic ECG interpretation' };
        return BY_ID[id] || null;
    }
    function stripTags(s) {
        return String(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }
    function evidenceHtml(id) {
        const evidence = window.CLINICAL_EVIDENCE;
        const keys = evidence && evidence.topics[id];
        if (!Array.isArray(keys)) return '';
        const links = keys.map(function (key) {
            const source = evidence.sources[key];
            if (!source || !/^https:\/\//.test(source[1])) return '';
            return '<li><a href="' + esc(source[1]) + '" target="_blank" rel="noopener noreferrer">' + esc(source[0]) + '</a></li>';
        }).join('');
        return '<p class="evidence-note">Selected guidance · source check ' + esc(evidence.checked) + '. Links address specific teaching points; apply the full guideline and local protocol.</p><ul class="refs">' + links + '</ul>';
    }
    function toast(msg) {
        const t = document.getElementById('toast');
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(t._h);
        t._h = setTimeout(() => t.classList.remove('show'), 2200);
    }
    function setTitle(name) {
        document.title = name ? name + ' — EM Pocket' : 'EM Pocket — Emergency Medicine Reference';
    }
    function setStageContext(label, labelledBy) {
        stage.removeAttribute('aria-live');
        stage.removeAttribute('aria-labelledby');
        stage.removeAttribute('aria-label');
        if (labelledBy) stage.setAttribute('aria-labelledby', labelledBy);
        else if (label) stage.setAttribute('aria-label', label);
    }
    function setOfflineStatus(status) {
        offlineStatus = status;
        const badge = document.getElementById('offlineStatus');
        if (badge) badge.textContent = status;
    }
    function orderedIds() {
        const seen = {};
        const out = [];
        GROUPS.forEach(g => g.ids.forEach(id => {
            if (BY_ID[id] && !seen[id]) { seen[id] = 1; out.push(id); }
        }));
        DATA.forEach(cp => {
            if (!seen[cp.id]) { seen[cp.id] = 1; out.push(cp.id); }
        });
        return out;
    }
    function cpMatchesFilter(cp) {
        if (severityFilter === 'all') return true;
        return cp.dontMiss.some(d => d[1] === severityFilter);
    }
    function severityCount(cp) {
        return cp.dontMiss.filter(d => severityFilter === 'all' ? d[1] === 'critical' : d[1] === severityFilter).length;
    }
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
    function loadLearning() {
        if (!learningStorageAvailable) return learningMemory;
        let raw;
        try {
            raw = localStorage.getItem('em-cps-learning');
        } catch (e) {
            learningStorageAvailable = false;
            return learningMemory;
        }
        try { learningMemory = normalizeLearning(JSON.parse(raw || '{}')); }
        catch (e) { learningMemory = normalizeLearning({}); }
        return learningMemory;
    }
    function saveLearning(data) {
        learningMemory = normalizeLearning(data);
        if (!learningStorageAvailable) return false;
        try {
            localStorage.setItem('em-cps-learning', JSON.stringify(learningMemory));
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
    function reviewActionLabel(id) {
        if (!isReviewed(id)) return 'Mark reviewed';
        return isReviewDue(id) ? 'Complete review' : '✓ Review scheduled';
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
        if (note.trim()) learning.notes[id] = note.trim(); else delete learning.notes[id];
        return saveLearning(learning);
    }
    function dueIds() {
        const plan = loadLearning().reviewPlan || {};
        const now = Date.now();
        return Object.keys(plan).filter(id => topicRecord(id) && Number(plan[id].dueAt) <= now);
    }
    function reviewLabel(id) {
        const item = (loadLearning().reviewPlan || {})[id];
        if (!item) return 'Not scheduled';
        if (Number(item.dueAt) <= Date.now()) return 'Due now';
        const days = Math.max(1, Math.ceil((Number(item.dueAt) - Date.now()) / 86400000));
        return 'Review in ' + days + 'd';
    }
    function patientMatches(cp) {
        return patientFilter === 'all' || (PATIENT_CONTEXTS[patientFilter] || []).indexOf(cp.id) !== -1;
    }
    function dispClass(title) {
        const t = String(title).toLowerCase();
        if (t.indexOf('discharge') === 0) return 'd-discharge';
        if (t.indexOf('admit') === 0 || t.indexOf('urgent') === 0) return 'd-admit';
        return 'd-icu';
    }

    /* ---------- sidebar ---------- */
    function buildSidebar() {
        const list = document.getElementById('sideList');
        list.innerHTML = '<button type="button" class="side-item side-home" data-home="1"><i class="ico" aria-hidden="true">' + GROUP_SVG.home + '</i>All presentations<span class="side-count">' + DATA.length + '</span></button>' +
            GROUPS.map((g, groupIndex) => {
            const items = g.ids.map(id => BY_ID[id]).filter(Boolean);
            if (!items.length) return '';
            return '<details class="side-group"' + (groupIndex === 0 ? ' open' : '') + '><summary class="side-label">' + esc(g.title) + ' <span class="side-count">' + items.length + '</span></summary>' +
                items.map(cp =>
                    '<button type="button" class="side-item" data-id="' + cp.id + '"><i class="ico" aria-hidden="true">' + iconFor(cp) + '</i>' + esc(cp.name) + '</button>'
                ).join('') + '</details>';
        }).join('');
        list.addEventListener('click', (e) => {
            const btn = e.target.closest('.side-item');
            if (!btn) return;
            if (btn.dataset.home) { showHome(); closeSidebar(); }
            else if (btn.dataset.ecg) { showEcg(); closeSidebar(); }
            else if (btn.dataset.explorer) { showExplorer(); closeSidebar(); }
            else { showPresentation(btn.dataset.id); closeSidebar(); }
        });
    }
    function markActive(id) {
        document.querySelectorAll('.side-item').forEach(b =>
            b.classList.toggle('active',
                id === 'ecg-explorer' ? !!b.dataset.explorer : id === ECG_TOPIC_ID ? !!b.dataset.ecg : (id ? b.dataset.id === id : !!b.dataset.home)));
        document.querySelectorAll('.side-group').forEach(group => {
            const active = !!group.querySelector('.side-item.active');
            group.classList.toggle('has-active', active);
            if (active) group.open = true;
        });
    }
    function sidebarIsMobile() {
        return window.matchMedia && window.matchMedia('(max-width: 920px)').matches;
    }
    function syncSidebarAccessibility() {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;
        const mobile = sidebarIsMobile();
        const hiddenMenu = (mobile && !sidebar.classList.contains('open')) ||
            (!mobile && document.documentElement.classList.contains('sidebar-collapsed'));
        try {
            if ('inert' in sidebar) sidebar.inert = hiddenMenu;
            else if (hiddenMenu) sidebar.setAttribute('inert', '');
            else sidebar.removeAttribute('inert');
        } catch (e) {}
        sidebar.setAttribute('aria-hidden', hiddenMenu ? 'true' : 'false');
        // Fallback for browsers without native inert: remove from tab order when hidden on mobile
        try {
            const focusables = sidebar.querySelectorAll('button, summary, [href], input, select, textarea, [tabindex]');
            focusables.forEach(function (el) {
                if (hiddenMenu) {
                    if (el.dataset.prevTabindex === undefined) el.dataset.prevTabindex = el.getAttribute('tabindex') || '';
                    el.setAttribute('tabindex', '-1');
                } else if (el.dataset.prevTabindex !== undefined) {
                    if (el.dataset.prevTabindex) el.setAttribute('tabindex', el.dataset.prevTabindex);
                    else el.removeAttribute('tabindex');
                    delete el.dataset.prevTabindex;
                }
            });
        } catch (e) {}
    }
    // :has() fallback — mirror :checked state to .is-checked for older Firefox/Safari
    function syncCheckedFallback(root) {
        try {
            (root || document).querySelectorAll('.rf-item input, .disclaimer-agree-label input').forEach(function (input) {
                const label = input.closest('.rf-item, .disclaimer-agree-label');
                if (label) label.classList.toggle('is-checked', !!input.checked);
            });
        } catch (e) {}
    }
    function openSidebar() {
        if (sidebarIsMobile()) sidebarReturnFocus = document.activeElement;
        document.getElementById('sidebar').classList.add('open');
        document.getElementById('sideBackdrop').classList.add('show');
        document.getElementById('burgerBtn').setAttribute('aria-expanded', 'true');
        syncSidebarAccessibility();
        if (sidebarIsMobile()) requestAnimationFrame(() => {
            const first = document.querySelector('.side-item.side-home');
            if (first) first.focus();
        });
    }
    function closeSidebar(restoreFocus) {
        const sidebar = document.getElementById('sidebar');
        const wasOpen = sidebar.classList.contains('open');
        sidebar.classList.remove('open');
        document.getElementById('sideBackdrop').classList.remove('show');
        document.getElementById('burgerBtn').setAttribute('aria-expanded', 'false');
        syncSidebarAccessibility();
        if (restoreFocus && wasOpen && sidebarIsMobile() && sidebarReturnFocus) sidebarReturnFocus.focus();
    }
    function sidebarCollapsed() {
        return document.documentElement.classList.contains('sidebar-collapsed');
    }
    function syncSidebarToggle() {
        const collapsed = sidebarCollapsed();
        const collapseBtn = document.getElementById('collapseBtn');
        if (collapseBtn) {
            collapseBtn.setAttribute('aria-expanded', String(!collapsed));
            collapseBtn.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
            collapseBtn.title = collapsed ? 'Expand sidebar' : 'Collapse sidebar';
        }
        if (!sidebarIsMobile()) {
            const burger = document.getElementById('burgerBtn');
            if (burger) burger.setAttribute('aria-expanded', String(!collapsed));
        }
    }
    function setSidebarCollapsed(collapsed) {
        document.documentElement.classList.toggle('sidebar-collapsed', !!collapsed);
        try {
            const p = loadPrefs();
            p.sidebar = !!collapsed;
            savePrefs(p);
        } catch (e) {}
        syncSidebarToggle();
        syncSidebarAccessibility();
    }

    function cardHtml(cp) {
        const count = severityCount(cp);
        const label = severityFilter === 'all' ? 'critical' : SEV_LABEL[severityFilter].toLowerCase();
        return '<button type="button" class="cp-card" data-id="' + cp.id + '">' +
            '<span class="cp-count">' + count + ' ' + label + '</span>' +
            '<div class="cp-ico" aria-hidden="true">' + iconFor(cp) + '</div>' +
            '<h3>' + esc(cp.name) + '</h3><p>' + esc(cp.tag) + '</p>' +
            (isReviewed(cp.id) ? '<span class="cp-reviewed">✓ ' + esc(reviewLabel(cp.id)) + '</span>' : '') +
            (isSaved(cp.id) ? '<span class="cp-saved">★ Saved</span>' : '') + '</button>';
    }
    function bindCards(root) {
        root.querySelectorAll('.cp-card').forEach(card =>
            card.addEventListener('click', () => showPresentation(card.dataset.id)));
    }

    /* ---------- home view ---------- */
    function syncNav(view) {
        const homeBtn = document.getElementById('homeBtn');
        if (homeBtn) {
            homeBtn.classList.toggle('on-home', view === 'home');
            homeBtn.classList.toggle('active-nav', view === 'home');
            homeBtn.setAttribute('aria-current', view === 'home' ? 'page' : 'false');
        }
        [['studyBtn', 'study'], ['shiftBtn', 'shift'], ['ecgBtn', 'ecg'], ['explorerBtn', 'explorer']].forEach(function (pair) {
            const el = document.getElementById(pair[0]);
            if (!el) return;
            const on = view === pair[1];
            el.classList.toggle('on-home', on);
            el.classList.toggle('active-nav', on);
            el.setAttribute('aria-current', on ? 'page' : 'false');
        });
    }

    function studyDashboardHtml() {
        const due = dueIds();
        const saved = savedIds();
        return '<section class="study-dashboard study-dashboard-compact" aria-label="Personal study tools">' +
            '<div class="study-stats"><button type="button" class="study-stat" data-study="due"><strong>' + due.length + '</strong><span>due now</span></button>' +
            '<button type="button" class="study-stat" data-study="saved"><strong>' + saved.length + '</strong><span>saved topics</span></button>' +
            '<button type="button" class="study-stat" data-study="case"><strong>Practice</strong><span>Work through a case</span></button></div></section>';
    }

    function patientFiltersHtml() {
        const filters = [['all', 'All patients'], ['pediatric', 'Pediatric'], ['pregnancy', 'Pregnancy'], ['geriatric', 'Older adult'], ['immunocompromised', 'Immunocompromised'], ['trauma', 'Trauma']];
        return '<div class="patient-filter" role="group" aria-label="Patient context filter"><span>Patient context</span>' + filters.map(function (f) {
            return '<button type="button" class="patient-chip' + (patientFilter === f[0] ? ' active' : '') + '" data-patient="' + f[0] + '" aria-pressed="' + (patientFilter === f[0]) + '">' + f[1] + '</button>';
        }).join('') + '</div>';
    }

    function renderHome() {
        currentId = null;
        markActive(null);
        syncNav('home');
        setTitle(null);
        setStageContext('All emergency medicine presentations');
        if (!DATA.length) {
            stage.innerHTML = '<p class="empty-filter">Could not load presentations. Confirm <code>assets/data.js</code> uploaded with index.html.</p>';
            return;
        }
        const groupsHtml = GROUPS.map(g => {
            const items = g.ids.map(id => BY_ID[id]).filter(cp => cp && cpMatchesFilter(cp) && patientMatches(cp));
            if (!items.length) return '';
            return '<section class="home-group">' +
                '<h3 class="group-title">' + esc(g.title) + ' <span>' + items.length + '</span></h3>' +
                '<div class="cp-grid">' + items.map(cardHtml).join('') + '</div></section>';
        }).join('');
        const visibleCount = DATA.filter(cp => cpMatchesFilter(cp) && patientMatches(cp)).length;
        stage.innerHTML =
            '<section class="home-intro">' +
            '<span class="study-kicker">EM POCKET · STUDENT LIBRARY</span>' +
            '<h1>Build your clinical reasoning</h1>' +
            '<p>Choose a presentation. Learn the approach, recognise the red flags, then test your recall.</p>' +
            '<div class="home-actions"><button type="button" class="home-start" data-browse-library="1">Browse presentations <span aria-hidden="true">↓</span></button>' +
            (getEcg() ? '<button type="button" class="home-ecg" id="ecgEntryBtn">Learn ECGs <span aria-hidden="true">→</span></button>' : '') +
            '</div><div class="home-meta"><span>' + DATA.length + ' presentations</span><span>' + reviewedIds().length + ' reviewed</span><span id="offlineStatus">' + esc(offlineStatus) + '</span></div></section>' +
            studyDashboardHtml() +
            '<section class="presentation-library" id="presentationLibrary" aria-labelledby="presentationLibraryTitle" tabindex="-1">' +
            '<div class="library-head"><div><h2 id="presentationLibraryTitle">Presentation library</h2><p>' + visibleCount + ' of ' + DATA.length + ' presentations · grouped by clinical system</p></div>' +
            '<details class="library-filters"' + (libraryFiltersOpen ? ' open' : '') + '><summary>Filter by patient context' + (patientFilter !== 'all' ? ' · active' : '') + '</summary>' + patientFiltersHtml() + '</details></div>' +
            (groupsHtml || '<p class="empty-filter">No presentations match these filters. Try another patient context or severity.</p>') + '</section>';
        bindCards(stage);
        const ecgEntry = document.getElementById('ecgEntryBtn');
        if (ecgEntry) ecgEntry.addEventListener('click', function () { showEcg(); });
        stage.querySelector('[data-browse-library]').addEventListener('click', () => {
            const library = document.getElementById('presentationLibrary');
            library.focus({ preventScroll: true });
            library.scrollIntoView({ block: 'start', behavior: 'smooth' });
        });
        stage.querySelector('.library-filters').addEventListener('toggle', function () { libraryFiltersOpen = this.open; });
        stage.querySelectorAll('.patient-chip').forEach(btn => btn.addEventListener('click', function () {
            patientFilter = btn.dataset.patient;
            renderHome();
            const selected = stage.querySelector('[data-patient="' + patientFilter + '"]');
            if (selected) selected.focus({ preventScroll: true });
        }));
        stage.querySelectorAll('[data-study]').forEach(btn => btn.addEventListener('click', function () {
            if (btn.dataset.study === 'case') showStudy('case');
            else showStudy(btn.dataset.study);
        }));
        window.scrollTo({ top: 0 });
        announce('Home — ' + DATA.length + ' presentations');
    }

    function showHome() {
        if (location.hash) {
            history.pushState(null, '', location.pathname + location.search);
        }
        renderHome();
    }

    /* ---------- study queue and case practice ---------- */
    function topicListHtml(ids, empty) {
        const unique = ids.filter((id, index) => topicRecord(id) && ids.indexOf(id) === index);
        if (!unique.length) return '<p class="study-empty">' + esc(empty) + '</p>';
        return '<div class="study-topic-list">' + unique.map(function (id) {
            const cp = topicRecord(id);
            return '<button type="button" class="study-topic" data-id="' + cp.id + '"' + (cp.id === ECG_TOPIC_ID ? ' data-ecg="1"' : '') + '><span class="study-topic-ico" aria-hidden="true">' + iconFor(cp) + '</span><div><strong>' + esc(cp.name) + '</strong><small>' + esc(isReviewed(cp.id) ? reviewLabel(cp.id) : 'Not yet reviewed') + (noteFor(cp.id) ? ' · note saved' : '') + '</small></div><b>→</b></button>';
        }).join('') + '</div>';
    }
    function caseHtml() {
        return window.STUDENT_LEARNING.render(caseCursor);
    }

    function quizQuestion(number, question, options, correct) {
        return '<fieldset class="quiz-question"><legend><span>' + number + '</span>' + esc(question) + '</legend><div class="quiz-options">' + options.map(function (option, i) {
            return '<button type="button" class="quiz-option" data-correct="' + (i === correct) + '">' + esc(option) + '</button>';
        }).join('') + '</div><p class="quiz-feedback" aria-live="polite"></p></fieldset>';
    }
    function renderStudy(view) {
        currentId = null;
        markActive('study'); syncNav('study'); setTitle('Study');
        setStageContext('Personal study space');
        if(view&&view.indexOf('case-')===0){const i=window.STUDENT_LEARNING.cases.findIndex(c=>c.id===view.slice(5));if(i>=0)caseCursor=i;view='case';}
        const chosen = view === 'saved' ? 'saved' : view === 'case' ? 'case' : 'due';
        const body = chosen === 'case' ? caseHtml() :
            '<section class="study-page"><div class="study-page-head"><button type="button" class="back-btn" data-home="1">← All presentations</button><span class="study-kicker">PERSONAL STUDY SPACE</span><h1>' + (chosen === 'due' ? 'Review queue' : 'Saved topics') + '</h1><p>' + (chosen === 'due' ? 'Topics return after 1, 3, 7, and 14 days of review. Complete a review to move it to the next interval.' : 'Use saved topics for weak areas, upcoming rotations, or cases you want to discuss.') + '</p></div>' +
            topicListHtml(chosen === 'due' ? dueIds() : savedIds(), chosen === 'due' ? 'Nothing is due yet. Mark a topic reviewed to start its spaced-review schedule.' : 'No saved topics yet. Save one from any presentation.') + '</section>';
        stage.innerHTML = '<nav class="study-tabs" aria-label="Study views"><button type="button" data-study="due" aria-current="' + (chosen === 'due' ? 'page' : 'false') + '" class="' + (chosen === 'due' ? 'active' : '') + '">Review queue <span>' + dueIds().length + '</span></button><button type="button" data-study="saved" aria-current="' + (chosen === 'saved' ? 'page' : 'false') + '" class="' + (chosen === 'saved' ? 'active' : '') + '">Saved</button><button type="button" data-study="case" aria-current="' + (chosen === 'case' ? 'page' : 'false') + '" class="' + (chosen === 'case' ? 'active' : '') + '">Practice case</button></nav>' + body;
        stage.querySelectorAll('[data-home]').forEach(btn => btn.addEventListener('click', showHome));
        stage.querySelectorAll('[data-study]').forEach(btn => btn.addEventListener('click', () => showStudy(btn.dataset.study)));
        stage.querySelectorAll('[data-next-case]').forEach(btn => btn.addEventListener('click', () => { caseCursor += 1; renderStudy('case'); }));
        stage.querySelectorAll('.study-topic, .review-btn[data-id]').forEach(btn => btn.addEventListener('click', () => {
            if (btn.dataset.ecg || btn.dataset.id === ECG_TOPIC_ID) showEcg();
            else showPresentation(btn.dataset.id);
        }));
        window.STUDENT_LEARNING.bindPractice(stage);
        const chooseCase=stage.querySelector('[data-practice-case]');
        if(chooseCase)chooseCase.addEventListener('change',()=>{caseCursor=Number(chooseCase.value);renderStudy('case');});
        const retryCase=stage.querySelector('[data-retry-case]');
        if(retryCase)retryCase.addEventListener('click',()=>renderStudy('case'));
        announce('Study: '+chosen);
        window.scrollTo({ top: 0 });
        stage.focus({ preventScroll: true });
    }
    function showStudy(view) {
        const route = 'study~' + (view || 'due');
        if ((location.hash || '').replace('#', '') === route) renderStudy(view || 'due');
        else location.hash = route;
    }

    /* ---------- shift-ready view ---------- */
    function shiftHtml(cp) {
        const immediateWorkup = (cp.workup && cp.workup[0]) ? cp.workup[0][1].slice(0, 4) : [];
        const critical = cp.dontMiss.filter(d => d[1] === 'critical').slice(0, 5);
        const escalation = (cp.disposition || []).slice(-2);
        return '<section class="shift-sheet"><div class="shift-sheet-head"><div><span>FOCUSED SHIFT VIEW</span><h1>' + esc(cp.name) + '</h1><p>' + esc(cp.tag) + '</p></div><button type="button" class="review-btn" data-full-id="' + cp.id + '">Open full pathway</button></div>' +
            '<div class="shift-warning">Educational first-pass aid. Reassess the patient, confirm doses and use local protocols.</div>' +
            '<div class="shift-grid"><section><h2>1 · First minutes</h2><ol>' + (cp.approach || []).slice(0, 3).map(x => '<li>' + esc(x) + '</li>').join('') + '</ol></section>' +
            '<section class="shift-red"><h2>2 · Escalate now if</h2><ul>' + (cp.redFlags || []).slice(0, 6).map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></section>' +
            '<section><h2>3 · Immediate workup</h2><ul>' + immediateWorkup.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></section>' +
            '<section><h2>4 · Don’t miss</h2><ul>' + critical.map(x => '<li><strong>' + esc(x[0]) + '</strong><br><small>' + esc(x[2]) + '</small></li>').join('') + '</ul></section>' +
            '<section class="shift-disposition"><h2>5 · Disposition lane</h2>' + escalation.map(x => '<div><strong>' + esc(x[0]) + '</strong><p>' + esc(x[1]) + '</p></div>').join('') + '</section></div></section>';
    }
    function renderShift(id) {
        if (!DATA.length) {
            currentId = null;
            markActive('shift'); syncNav('shift'); setTitle('Shift view');
            setStageContext('Focused shift view');
            stage.innerHTML = '<section class="study-page"><div class="study-page-head"><button type="button" class="back-btn" data-home="1">← All presentations</button><h1>Shift view unavailable</h1><p>Presentation data could not be loaded. Confirm <code>assets/data.js</code> is available, then refresh.</p></div></section>';
            stage.querySelector('[data-home]').addEventListener('click', showHome);
            return;
        }
        const cp = BY_ID[id] || BY_ID[currentId] || DATA[0];
        currentId = cp.id; markActive(cp.id); syncNav('shift'); setTitle('Shift view · ' + cp.name);
        setStageContext('Focused shift view for ' + cp.name);
        stage.innerHTML = '<div class="shift-topline"><button type="button" class="back-btn" data-home="1">← All presentations</button><label for="shiftSelect">Presentation</label><select id="shiftSelect">' + orderedIds().map(function (pid) { const item = BY_ID[pid]; return '<option value="' + item.id + '"' + (item.id === cp.id ? ' selected' : '') + '>' + esc(item.name) + '</option>'; }).join('') + '</select></div>' + shiftHtml(cp);
        document.getElementById('shiftSelect').addEventListener('change', function () { showShift(this.value); });
        stage.querySelector('[data-home]').addEventListener('click', showHome);
        stage.querySelector('[data-full-id]').addEventListener('click', function () { showPresentation(this.dataset.fullId); });
        window.scrollTo({ top: 0 });
    }
    function showShift(id) {
        const fallbackId = id || currentId || (DATA[0] && DATA[0].id);
        const route = 'shift' + (fallbackId ? '~' + fallbackId : '');
        if ((location.hash || '').replace('#', '') === route) renderShift((route.split('~')[1]));
        else location.hash = route;
    }

    /* ---------- presentation view ---------- */
    function sectionCard(icon, title, bodyHtml, closed, key) {
        const sectionId = 'section-' + (key || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
        return '<section class="section-card ' + (closed ? 'closed' : '') + '" id="' + sectionId + '" data-section="' + (key || '') + '">' +
            '<button class="sec-head" type="button" aria-expanded="' + (!closed) + '" aria-controls="' + sectionId + '-body"><span class="sec-ico">' + icon + '</span>' +
            '<span>' + title + '</span><span class="arrow">▼</span></button>' +
            '<div class="sec-body" id="' + sectionId + '-body">' + bodyHtml + '</div></section>';
    }

    function firstMinutesHtml(cp) {
        const steps = (cp.approach || []).slice(0, 3);
        return '<aside class="case-rail" aria-label="First five minutes">' +
            '<div class="case-rail-title"><span aria-hidden="true">' + GROUP_SVG.bolt + '</span><div><strong>First 5 minutes</strong><small>Start here, then work the case</small></div></div>' +
            '<ol class="case-steps">' + steps.map((step, i) =>
                '<li><span>' + (i + 1) + '</span>' + esc(step) + '</li>').join('') + '</ol>' +
            '</aside>';
    }

    function presentationTocHtml() {
        const sections = [['how-to-think', 'Approach'], ['dont-miss', 'Don’t miss'], ['red-flags', 'Red flags'], ['history', 'Assessment'], ['workup', 'Workup'], ['disposition', 'Disposition'], ['study', 'Recall & notes']];
        return '<nav class="presentation-toc" aria-label="Presentation sections">' + sections.map(item =>
            '<button type="button" class="section-jump" data-jump="' + item[0] + '">' + esc(item[1]) + '</button>').join('') + '</nav>';
    }

    function personalPlanHtml(cp) {
        const note = noteFor(cp.id);
        return '<section class="personal-plan" aria-label="Personal study notes"><div><span class="study-kicker">PRIVATE TO THIS DEVICE</span><h2>Your learning note</h2><p>Capture a weak point, a teaching pearl, or a question to take to your next shift.</p></div><div class="personal-controls"><button type="button" class="save-topic' + (isSaved(cp.id) ? ' active' : '') + '" id="saveTopic" aria-pressed="' + isSaved(cp.id) + '">' + (isSaved(cp.id) ? '★ Saved topic' : '☆ Save topic') + '</button><span class="review-status">' + esc(isReviewed(cp.id) ? reviewLabel(cp.id) : 'Review schedule starts when marked reviewed') + '</span></div><label for="studyNote">Private note</label><textarea id="studyNote" rows="3" maxlength="800" placeholder="Example: I need to revisit the disposition threshold…">' + esc(note) + '</textarea><div class="note-actions"><button type="button" class="rf-clear" id="saveNote">Save note</button><span id="noteStatus"></span></div></section>';
    }

    function learningLoopHtml(cp) {
        const firstAction = (cp.approach || [])[0] || 'Stabilize the patient, then use the local pathway.';
        const threats = cp.dontMiss.filter(d => d[1] === 'critical').slice(0, 3).map(d => d[0]);
        return '<section class="learning-loop" aria-label="Rapid recall practice">' +
            '<div class="learning-head"><div><span class="learning-kicker">PRACTICE REFRESHER</span><h2>Rapid recall</h2><p>Test your first action and the dangerous diagnoses before revealing the answer.</p></div>' +
            '<button type="button" class="review-btn" id="reviewBtn" aria-pressed="' + isReviewed(cp.id) + '">' + reviewActionLabel(cp.id) + '</button></div>' +
            '<div class="recall-grid">' +
            '<div class="recall-card"><span>01 · First move</span><p>Before you scroll, what needs to happen first?</p><button type="button" class="reveal-btn" data-reveal="action">Reveal answer</button><div class="reveal-answer" id="recall-action" hidden>' + esc(firstAction) + '</div></div>' +
            '<div class="recall-card"><span>02 · Immediate threats</span><p>Name at least two diagnoses that cannot wait.</p><button type="button" class="reveal-btn" data-reveal="threats">Reveal answer</button><div class="reveal-answer" id="recall-threats" hidden>' + esc(threats.join(' · ') || 'Use the presentation’s red flags and local escalation pathway.') + '</div></div>' +
            '</div></section>';
    }

    function overviewHtml(cp) {
        const steps = Array.isArray(cp.approach) ? cp.approach : [];
        const overview = String(cp.overview || '').trim();
        const sentenceEnd = overview.search(/[.!?]\s/);
        // Split once and preserve the remainder, including punctuation inside quotes or parentheses.
        const lead = sentenceEnd < 0 ? overview : overview.slice(0, sentenceEnd + 1);
        const rest = sentenceEnd < 0 ? '' : overview.slice(sentenceEnd + 1).trim();
        return '<div class="ov">' +
            '<p class="ov-job"><span class="ov-kicker">The job</span>' + esc(cp.tag) + '</p>' +
            (steps.length
                ? '<ol class="ov-steps">' + steps.map((s, i) =>
                    '<li><span class="ov-n" aria-hidden="true">' + (i + 1) + '</span><span class="ov-s">' + esc(s) + '</span></li>'
                ).join('') + '</ol>'
                : '') +
            '<div class="ov-prose">' +
            (lead ? '<p>' + esc(lead) + '</p>' : '') +
            (rest ? '<p>' + esc(rest) + '</p>' : '') +
            '</div></div>';
    }

    function clusterGrid(items) {
        return '<div class="cluster-grid">' + (items || []).map(function (h) {
            const s = String(h);
            const cut = s.indexOf(': ');
            if (cut > 0 && cut < 52) {
                return '<div class="cluster"><h4>' + esc(s.slice(0, cut)) + '</h4><p>' + esc(s.slice(cut + 2)) + '</p></div>';
            }
            return '<div class="cluster"><p>' + esc(s) + '</p></div>';
        }).join('') + '</div>';
    }

    function dxCards(cp) {
        const items = cp.dontMiss.filter(d => severityFilter === 'all' || d[1] === severityFilter);
        if (!items.length) return '<p style="font-size:.84rem;color:var(--ink-soft);padding:6px 0">No diagnoses in this severity tier.</p>';
        return '<div class="dx-grid">' + items.map(d => {
            const name = d[0], sev = d[1], key = d[2];
            return '<div class="dx-card sev-' + sev + '"><h4>' + sevDot(sev) + esc(name) +
                ' <span class="sev-tag">' + (SEV_LABEL[sev] || sev) + '</span></h4>' +
                '<div class="dx-key"><strong>Key:</strong> ' + esc(key) + '</div></div>';
        }).join('') + '</div>';
    }

    function relatedHtml(id, closed) {
        const ids = (RELATED[id] || []).filter(x => BY_ID[x]);
        const ecgChip = (getEcg() && ECG_FROM_PRESENTATIONS[id])
            ? '<button type="button" class="related-chip" data-ecg="1">' + GROUP_SVG.ecg + 'ECG Guide</button>'
            : '';
        if (!ids.length && !ecgChip) return '';
        return sectionCard('🔗', 'See also',
            '<div class="related">' + ids.map(rid => {
                const r = BY_ID[rid];
                return '<button type="button" class="related-chip" data-id="' + r.id + '">' + iconFor(r) + esc(r.name) + '</button>';
            }).join('') + ecgChip + '</div>', closed, 'see-also');
    }

    function pagerHtml(id) {
        const ids = orderedIds();
        const i = ids.indexOf(id);
        const prev = i > 0 ? BY_ID[ids[i - 1]] : null;
        const next = i >= 0 && i < ids.length - 1 ? BY_ID[ids[i + 1]] : null;
        return '<div class="pager">' +
            (prev
                ? '<button type="button" class="pager-btn" data-id="' + prev.id + '">← ' + esc(prev.name) + '</button>'
                : '<span></span>') +
            (next
                ? '<button type="button" class="pager-btn" data-id="' + next.id + '">' + esc(next.name) + ' →</button>'
                : '<span></span>') +
            '</div>';
    }

    function renderPresentation(id, target, preservePosition) {
        const cp = DATA.find(d => d.id === id);
        if (!cp) return showHome();
        const state = reviewFor(id);
        currentId = id;
        markActive(id);
        syncNav('presentation');
        setTitle(cp.name);
        setStageContext(null, 'presentationTitle');

        const rfItems = cp.redFlags.map((rf, i) =>
            '<label class="rf-item"><input type="checkbox" data-rf="' + i + '"' + (state.redFlags[i] ? ' checked' : '') + '><span>' + esc(rf) + '</span></label>').join('');
        const isClosed = function (key, fallback) {
            return Object.prototype.hasOwnProperty.call(state.sections, key) ? state.sections[key] : !!fallback;
        };
        const dxTitle = severityFilter === 'all' ? 'Don’t-Miss Diagnoses' : 'Don’t-Miss Diagnoses · ' + SEV_LABEL[severityFilter] + ' only';

        stage.innerHTML =
            '<div class="cp-hero">' +
            '<button type="button" class="back-btn" id="backBtn">← All presentations</button>' +
            '<div class="cp-ico-lg" aria-hidden="true">' + iconFor(cp) + '</div>' +
            '<h1 id="presentationTitle" tabindex="-1">' + esc(cp.name) + '</h1><p class="tag">' + esc(cp.tag) + '</p></div>' +

            presentationTocHtml() +
            sectionCard('🧭', 'How to think', overviewHtml(cp), isClosed('how-to-think', false), 'how-to-think') +
            firstMinutesHtml(cp) +

            sectionCard('🚨', dxTitle, dxCards(cp), isClosed('dont-miss'), 'dont-miss') +

            sectionCard('🚩', 'Interactive Red-Flag Checklist',
                '<div class="rf-box"><div class="rf-banner" id="rfBanner"></div>' +
                '<p style="font-size:.78rem;color:var(--ink-soft);margin-bottom:6px">' +
                'Tick what your patient has — the banner updates as you go.</p><div class="rf-tools"><button type="button" class="rf-clear" id="clearRedFlags">Clear selected</button><button type="button" class="rf-clear" id="copyReview">Copy review</button></div>' + rfItems +
                '<div class="rf-progress"><i id="rfBar"></i></div></div>', isClosed('red-flags'), 'red-flags') +

            sectionCard('🗣️', 'Focused History', clusterGrid(cp.history), isClosed('history', true), 'history') +

            sectionCard('🩺', 'Examination Clusters', clusterGrid(cp.exam), isClosed('exam', true), 'exam') +

            sectionCard('🧪', 'Workup',
                '<div class="wu-grid">' + cp.workup.map(w =>
                    '<div class="wu-col"><h4>' + esc(w[0]) + '</h4><ul>' +
                    w[1].map(i => '<li>' + esc(i) + '</li>').join('') + '</ul></div>').join('') + '</div>' +
                '<details class="medication-safety"><summary>Medication safety reminder</summary><p>Use this as a first-pass prompt; verify all medications, doses, concentrations, contraindications, weight, pregnancy status, and local protocols before administration.</p><p>Check indication, allergy, route, renal/hepatic risk, interactions, monitoring, and local formulary.</p></details>', isClosed('workup'), 'workup') +

            sectionCard('🏥', 'Disposition Pathway',
                '<div class="disp-grid">' + cp.disposition.map(d => {
                    const cls = dispClass(d[0]);
                    return '<div class="disp-col ' + cls + '"><h4>' + esc(d[0]) +
                        '</h4><ul><li>' + esc(d[1]) + '</li></ul></div>';
                }).join('') + '</div><p class="clinical-safety-note">Use objective reassessment and the local pathway.</p>', isClosed('disposition'), 'disposition') +

            sectionCard('💡', 'Pearls & Pitfalls',
                '<div class="pp-grid"><div class="pp-box pearls"><h4>Clinical Pearls</h4><ul class="plain-list">' +
                (Array.isArray(cp.pearls) && cp.pearls.length
                    ? cp.pearls.map(p => '<li>' + esc(p) + '</li>')
                    : cp.dontMiss.filter(d => d[1] === 'critical').slice(0, 4).map(d =>
                        '<li><strong>' + esc(d[0]) + ':</strong> ' + esc(d[2]) + '</li>')
                ).join('') +
                '</ul></div><div class="pp-box pitfalls"><h4>Pitfalls</h4><ul class="plain-list">' +
                cp.pitfalls.map(p => '<li>' + esc(p) + '</li>').join('') +
                '</ul></div></div>', isClosed('pearls-pitfalls', true), 'pearls-pitfalls') +

            '<section class="presentation-study-group" id="section-study" aria-label="Recall and notes" tabindex="-1">' + learningLoopHtml(cp) + personalPlanHtml(cp) + '</section>' +

            relatedHtml(id, isClosed('see-also')) +

            sectionCard('📚', 'References',
                evidenceHtml(cp.id) + '<ul class="refs">' + cp.refs.map(r => '<li>' + esc(r) + '</li>').join('') + '</ul>', isClosed('references', true), 'references') +

            pagerHtml(id);

        document.getElementById('backBtn').addEventListener('click', showHome);
        stage.querySelectorAll('.sec-head').forEach(h =>
            h.addEventListener('click', () => {
                const card = h.closest('.section-card');
                const closed = !card.classList.contains('closed');
                card.classList.toggle('closed', closed);
                h.setAttribute('aria-expanded', String(!closed));
                state.sections[card.dataset.section] = closed;
            }));
        stage.querySelectorAll('.related-chip, .pager-btn').forEach(btn =>
            btn.addEventListener('click', () => {
                if (btn.dataset.ecg) showEcg();
                else showPresentation(btn.dataset.id);
            }));
        stage.querySelectorAll('.case-action, .section-jump').forEach(btn =>
            btn.addEventListener('click', () => jumpToSection(btn.dataset.jump, true)));
        stage.querySelectorAll('.reveal-btn').forEach(btn => btn.addEventListener('click', () => {
            const answer = document.getElementById('recall-' + btn.dataset.reveal);
            const hidden = answer.hidden;
            answer.hidden = !hidden;
            btn.textContent = hidden ? 'Hide answer' : 'Reveal answer';
        }));
        const reviewBtn = document.getElementById('reviewBtn');
        if (reviewBtn) reviewBtn.addEventListener('click', () => {
            const alreadyScheduled = isReviewed(cp.id);
            if (alreadyScheduled && !isReviewDue(cp.id)) {
                const removal = setReviewed(cp.id, false);
                reviewBtn.setAttribute('aria-pressed', 'false');
                reviewBtn.textContent = reviewActionLabel(cp.id);
                const status = document.querySelector('.review-status');
                if (status) status.textContent = 'Review schedule starts when marked reviewed';
                toast('Removed from your review schedule.' + (removal.persisted ? '' : ' This change lasts for this session only.'));
                return;
            }
            const result = setReviewed(cp.id, true);
            reviewBtn.setAttribute('aria-pressed', 'true');
            reviewBtn.textContent = reviewActionLabel(cp.id);
            const status = document.querySelector('.review-status');
            if (status) status.textContent = reviewLabel(cp.id);
            const days = result.plan ? REVIEW_INTERVALS[Math.max(0, Number(result.plan.stage) - 1)] : 1;
            const message = alreadyScheduled ? 'Review complete — next review in ' + days + ' days.' : 'Reviewed — it will return in 1 day.';
            toast(message + (result.persisted ? '' : ' Saved for this session only.'));
        });
        const saveTopic = document.getElementById('saveTopic');
        if (saveTopic) saveTopic.addEventListener('click', () => {
            const saved = !isSaved(cp.id);
            const persisted = setSaved(cp.id, saved);
            saveTopic.classList.toggle('active', saved);
            saveTopic.setAttribute('aria-pressed', String(saved));
            saveTopic.textContent = saved ? '★ Saved topic' : '☆ Save topic';
            toast((saved ? 'Saved to your study list.' : 'Removed from saved topics.') + (persisted ? '' : ' This change lasts for this session only.'));
        });
        const saveNote = document.getElementById('saveNote');
        if (saveNote) saveNote.addEventListener('click', () => {
            const persisted = setNote(cp.id, document.getElementById('studyNote').value);
            const status = document.getElementById('noteStatus');
            if (status) status.textContent = persisted ? 'Saved on this device.' : 'Saved for this session only.';
            toast(persisted ? 'Learning note saved.' : 'Learning note saved for this session only.');
        });
        setupRedFlags(cp, state);
        if (target) jumpToSection(target, true);
        else if (preservePosition) { /* Filtering keeps the clinician in the same reading position. */ }
        else {
            window.scrollTo({ top: 0 });
            stage.focus({ preventScroll: true });
            announce('Viewing ' + cp.name);
        }
    }

    function jumpToSection(target, fromSearch) {
        const card = document.getElementById('section-' + target);
        if (!card) return;
        const parent = card.classList.contains('section-card') ? card : card.closest('.section-card');
        if (parent && parent.classList.contains('closed')) {
            parent.classList.remove('closed');
            const phead = parent.querySelector('.sec-head');
            if (phead) phead.setAttribute('aria-expanded', 'true');
            if (currentId) reviewFor(currentId).sections[parent.dataset.section || target] = false;
        }
        const head = card.querySelector('.sec-head');
        const topbar = document.querySelector('.topbar');
        const topbarOffset = (topbar ? topbar.offsetHeight : 0) + 12;
        const targetTop = card.getBoundingClientRect().top + window.scrollY - topbarOffset;
        window.scrollTo({ top: Math.max(0, targetTop), behavior: fromSearch ? 'auto' : 'smooth' });
        card.classList.add('section-focus');
        clearTimeout(card._focusTimer);
        card._focusTimer = setTimeout(() => card.classList.remove('section-focus'), 1800);
        const focusEl = head || card;
        if (fromSearch && focusEl && focusEl.focus) focusEl.focus({ preventScroll: true });
    }

    function showPresentation(id, target) {
        const route = id + (target ? '~' + target : '');
        if ((location.hash || '').replace('#', '') === route) {
            renderPresentation(id, target);
        } else {
            location.hash = route;
        }
    }

    function ecgSvgWithRef(svg, skipReference) {
        // References are generated from the same lead/time geometry by the viewer.
        // Interactive groups must remain exposed to assistive technology.
        if (!svg) return '';
        return svg.indexOf('ecg-hot') >= 0 ? svg.replace('aria-hidden="true"', 'role="group"') : svg;
    }
    var ECG_WAVE_INFO = {
        p: ["P wave — atrial depolarisation","Inspect P shape and its relationship to each QRS. Sinus P waves are usually upright in I and II and inverted in aVR. Adult P duration is normally <120 ms. Abnormal P-wave size or shape can suggest atrial abnormality, but does not measure chamber size or replace echocardiography."],
        pr: ["PR interval — P onset to QRS onset","Adult PR is normally 120–200 ms. A consistently prolonged PR with 1:1 conduction is first-degree AV block. A short PR with a delta wave and widened QRS suggests ventricular pre-excitation. Interpret a short PR without a delta wave with P morphology and rhythm; it does not establish an accessory pathway."],
        qrs: ["QRS complex — ventricular depolarisation","Measure QRS onset to end. Adult QRS is usually under 110 ms; at least 120 ms is wide. Bundle-branch block requires the appropriate lead morphology as well as duration. Ventricular rhythms, pacing, pre-excitation, electrolytes and drugs can also widen QRS. A narrow QRS usually reflects rapid His-Purkinje conduction but does not prove supraventricular origin."],
        st: ["ST segment — measure acute STE at the J point","The J point is the end of QRS. Use it for acute ST-elevation thresholds, with the correct lead, age and sex criteria. Compare the baseline, adjacent leads, reciprocal changes and prior ECG. ST shape alone cannot distinguish occlusion, pericarditis or early repolarisation. New or dynamic ST-T changes require clinical assessment and serial ECGs."],
        t: ["T wave — inspect shape and lead distribution","T-wave polarity and amplitude vary by lead. New regional, bulky T waves may be hyperacute; narrow peaked T waves may suggest hyperkalemia. Neither shape proves its cause. Deep symmetric or positive-then-negative T waves in V2–V3 after resolved ischemic pain suggest Wellens. Compare serial ECGs, symptoms, electrolytes, QRS and QT."],
        qt: ["QT interval — QRS onset to T-wave end","Use a lead with a clear T-wave end and exclude a separate U wave. Read the selected diagram labels; examples differ. State the correction formula: Bazett uses QT/√RR in seconds, overcorrects at fast rates and undercorrects at slow rates. AHA practical prolonged-QTc thresholds are ≥450 ms in men and ≥460 ms in women; >500 ms raises torsades risk. Wide QRS requires adjusted QT or JT assessment."],
        cal: ["Calibration — 1 mV / 200 ms reference","At 25 mm/s and 10 mm/mV, a small box represents 40 ms and 0.1 mV. Confirm speed and gain before measuring. Screen size and zoom change physical on-screen millimetres while preserving waveform-to-grid scale. Voltage alone does not establish anatomical hypertrophy; low voltage or alternans needs clinical correlation and, when indicated, echocardiography."],
        narrow: ["Narrow QRS — usually supraventricular conduction","A narrow QRS usually reflects activation through the His-Purkinje system. Determine the rhythm from atrial activity, P-to-QRS relationships and RR regularity, not width alone. Sinus, atrial, AV-nodal and junctional rhythms may all be narrow."],
        wide: ["Wide QRS — ≥120 ms","Consider ventricular rhythm, bundle-branch block, pacing, pre-excitation, electrolyte disturbance and sodium-channel blockade. AV dissociation, capture or fusion beats and suitable morphology favour VT. Treat an undifferentiated wide-complex tachycardia as VT; instability requires immediate emergency management."],
        psinus: ["Sinus P — inspect atrial-to-ventricular timing","Look for P waves with sinus morphology, usually upright in II and inverted in aVR. Assess whether each P conducts and whether PR is stable. Sinus rhythm can be slow or fast, and sinus atrial activity can coexist with AV block. Absent obvious P waves alone does not diagnose AF."],
        axis: ["Frontal QRS axis — I, aVF and II","Positive I and aVF indicate an axis between 0° and +90°. With positive I and negative aVF, use lead II: a positive II can still be normal (−30° to 0°); negative II supports left-axis deviation. Right or extreme axes have several causes and do not identify a fascicular block alone."],
        reg: ["Regularity — compare successive RR intervals","Use several RR intervals. For irregular rhythms, count QRS complexes over a known duration: 6 seconds ×10 or 10 seconds ×6 estimates beats/min. Truly irregular RR with no organised P waves supports AF; exclude ectopy, variable atrial conduction and artifact."],
        v1: ['V1 deep S wave \u2014 7.5 mm displayed at 5 mm/mV = 15 mm standard equivalent', 'Lead V1 sits over the septum and right ventricle: the normal small septal r reflects left-to-right septal depolarisation, then the deep S reflects the left ventricle depolarising away. This tracing uses half gain (5 mm/mV), so the displayed 7.5 mm S equals 15 mm at standard 10 mm/mV gain. A tall R wave in V1 instead raises RVH, posterior infarction, right bundle-branch block, pre-excitation, or lead-placement concerns.'],
        v5: ['V5 tall R wave \u2014 11 mm displayed at 5 mm/mV = 22 mm standard equivalent', 'Lead V5 faces the lateral left ventricle: a tall R with downsloping ST depression and asymmetric T inversion is a pressure-overload strain pattern, not primary ischaemia by itself. At half gain, the displayed 11 mm R equals 22 mm standard; S in V1 plus R in V5 is therefore 15 + 22 = 37 mm, meeting Sokolow\u2013Lyon. Voltage remains a screening clue and must be interpreted with the patient, old ECG, and echo when needed.'],
        chambers: ['Chamber-pattern clues \u2014 supportive ECG findings, not chamber-size diagnoses', 'RAE pattern: a peaked P wave at least 2.5 mm in lead II. LAE pattern: a notched P wave at least 120 ms in II, or a terminal negative V1 P component at least 1 mm deep and 40 ms wide. RVH pattern: dominant R in V1 (R/S >1 and R >7 mm), right-axis deviation, and sometimes anterior/inferior strain. These patterns are neither sensitive nor specific enough to replace echocardiography.'],
        lowv: ['Low voltage \u2014 QRS under 5 mm in every limb lead, under 10 mm in every chest lead', 'Here 3 mm complexes with preserved timing \u2014 low voltage narrows nothing and widens nothing, it only shrinks. A single small complex does not make the diagnosis: assess every lead in the relevant set and confirm gain first. Causes include effusion/tamponade, emphysema, obesity, anasarca, infiltrative/restrictive disease, and hypothyroidism. Low voltage with new electrical alternans and sinus tachycardia warrants immediate POCUS/echo for pericardial effusion and tamponade physiology.'],
        ant: ['Anterior STE — V2–V3 are the only sex/age-specific standard leads', 'Fifth UDMI J-point thresholds in two contiguous leads: V2–V3 2.5 mm in men under 40, 2.0 mm in men 40 and over, 1.5 mm in women; every other standard lead uses 1.0 mm. Interpret with symptoms, reciprocal findings, prior ECG, and serial change.'],
        inf: ['Inferior STE — 1 mm standard-lead rule; add right-sided leads', 'Fifth UDMI uses 1.0 mm at the J point in all standard leads other than V2–V3, including II, III, aVF, I, aVL, and V4–V6. Inferior STE with reciprocal STD in aVL should prompt V3R–V6R, especially V4R, to assess RV involvement.'],
        mirror: ['Mirror STD in aVL — reciprocal of inferior OMI, not a second ischaemia', 'ST depression in aVL that mirrors inferior STE is reciprocal change seen from the opposite wall. MIRROR mnemonic — inferior UP (II, III, aVF), aVL DOWN. Territorial STE plus mirror STD means OMI until proven otherwise and greatly increases specificity: pericarditis shows diffuse STE with no reciprocal STD except aVR/V1. Use right-sided leads to assess RV involvement; compare prior and serial ECGs. V4R does not independently confirm inferior occlusion.'],
        hyperacute: ["Hyperacute T — regional, bulky and disproportionate","Look for broad T waves that are large relative to their QRS, especially when new in adjacent leads or changing over time. They may precede ST elevation. There is no universal height cutoff and morphology alone does not prove occlusion. Assess reciprocal changes, electrolytes and mimics; escalate promptly when symptoms and ECG suggest ongoing ischemia."],
        hyperk: ["Hyperkalemia — inspect P, PR, QRS and T together","Possible findings include peaked T waves, diminished or absent P waves, PR prolongation and QRS widening. Changes do not follow a reliable sequence and a normal ECG does not exclude dangerous hyperkalemia. Check potassium and the clinical setting urgently; treat life-threatening changes under the local emergency protocol. Coronary ischemia may coexist."],
        wellens: ["Wellens — anterior T changes after resolved ischemic pain","V2–V3 show positive-then-negative biphasic T waves or deep symmetric inversion, with preserved R waves, little STE and no pathological Q waves. This high-risk pattern is strongly associated with LAD disease; ECG does not prove the exact lesion or current artery patency. Arrange urgent cardiology assessment. Recurrent pain or T-wave pseudonormalisation needs immediate reassessment. Avoid exercise stress testing."],
        dewinter: ['de Winter — upsloping STD into tall T; anterior OMI without STE', 'de Winter shows 1–3 mm upsloping J-point ST depression in the precordial leads continuing into tall, prominent, symmetric T waves, with STE in aVR common but not required — about 2% of anterior LAD occlusions, with the mortality of anterior STEMI. The pattern can evolve into frank anterior STE or appear only on the first tracing. Immediate cath-lab activation; treat as anterior OMI, not nonspecific ischemia.'],
        ischa: ['Ischaemia without STE — contiguous STD, T-wave, or Q-wave change', 'Fifth UDMI ischemic findings include new horizontal or downsloping STD of at least 0.5 mm in two contiguous leads and new or dynamic T-wave inversion of at least 1 mm in two contiguous leads. Broad symmetric hyperacute T waves disproportionate to the QRS are also concerning. Serial ECGs and troponin are required; no STE does not rule out occlusion.'],
        post: ['Posterior ischemia — confirm the anterior mirror with V7–V9', 'Fifth UDMI flags STD of at least 1 mm in V1, V2, and/or V3, especially with a dominant R in V1/V2, as a posterior MI clue. Record V7–V9 in the V6 horizontal plane; STE of at least 0.5 mm supports posterior infarction (1 mm gives greater specificity in men under 40).'],
        sgSte: ["Modified Sgarbossa 1 — concordant STE ≥1 mm","With LBBB or ventricular pacing, look for ≥1 mm J-point elevation in a lead with a predominantly positive QRS. This is a positive modified Sgarbossa finding. In a compatible ischemic presentation, use an urgent reperfusion pathway; the finding alone does not prove coronary occlusion."],
        sgStd: ["Modified Sgarbossa 2 — STD ≥1 mm in V1–V3","ST depression ≥1 mm in V1, V2 or V3 with LBBB or ventricular pacing is a positive modified Sgarbossa finding. It warrants urgent evaluation for occlusion in a compatible presentation. A negative rule does not exclude acute coronary occlusion."],
        sgDis: ["Modified Sgarbossa 3 — excessive discordant STE","With a predominantly negative QRS, look for ≥1 mm J-point elevation at least 25% of the preceding S-wave depth (signed ST/S ≤ −0.25). The proportional criterion improves on a fixed 5 mm threshold alone. Interpret with symptoms, prior ECGs and serial change."],
        rr: ["RR interval — ventricular cycle length","For a regular rhythm, rate = 60,000/RR in milliseconds. At 25 mm/s, 300 divided by the number of large boxes is a shortcut. For irregular rhythms, count QRS complexes over a longer known strip duration. Determine rhythm from atrial activity and atrioventricular relationships as well as regularity."]
    };
    function ecgWaveText(w) {
        var info = ECG_WAVE_INFO[w];
        if (!info) return '';
        return '<strong>' + esc(info[0]) + '</strong> \u2014 ' + esc(info[1]);
    }
    function ecgFigure(id) {
        try {
            var lib = window.ECG_SVG || {};
            var entry = lib[id];
            if (!entry || (!entry.svg && !entry.png)) return '<p class="empty-filter" role="status">ECG figure unavailable. Use the written criteria and a reviewed tracing.</p>';
            var title = String(entry.title || id);
            var caption = String(entry.caption || 'Teaching diagram; not a patient recording.');
            var sourceHtml = Array.isArray(entry.sources) && entry.sources.length
                ? '<figcaption><span class="ecg-schem">' + esc(entry.figureLabel || 'Evidence map') + '</span>' + esc(entry.sourceNote || 'Criteria shown are source-checked; this is not a patient ECG tracing.') + ' Sources: ' + entry.sources.map(function (source) {
                    return '<a href="' + esc(source.url) + '" target="_blank" rel="noopener">' + esc(source.label) + '</a>';
                }).join(' · ') + '.</figcaption>'
                : '<figcaption><span class="ecg-schem">' + esc(entry.figureLabel || 'Schematic · not to scale') + '</span>' + esc(caption) + '</figcaption>';
            var tools = '<div class="ecg-tools" role="group" aria-label="Diagram tools for ' + esc(title) + '">'
                + '<button type="button" class="ecg-tool"' + (id === 'normal-12lead' ? ' hidden' : '') + ' data-ecg-tool="anno" data-ecg-fig-btn="' + esc(id) + '" aria-pressed="true" title="Show or hide measurement labels">Annotations</button>'
                + (entry.hasReference ? '<button type="button" class="ecg-tool" data-ecg-tool="compare" aria-pressed="false" title="Modeled same-lead normal reference at matching QRS onset times">Normal reference</button>' : '')
                + '<button type="button" class="ecg-tool" data-ecg-tool="expand" data-ecg-fig-btn="' + esc(id) + '" title="Enlarge the ECG, inspect findings and use available measurement tools">Explore ECG</button>'
                + '</div>';
            var hasHot = entry.svg && entry.svg.indexOf('ecg-hot') !== -1;
            var waveOrder = ['cal','p','pr','qrs','st','t','qt','rr','narrow','wide','psinus','axis','reg','v1','v5','chambers','lowv','ant','inf','mirror','hyperacute','hyperk','wellens','dewinter','sgSte','sgStd','sgDis','post','ischa'];
            var waveNames = {cal:'CAL 1mV',p:'P wave',pr:'PR',qrs:'QRS',st:'ST',t:'T wave',qt:'QT',rr:'RR rate',narrow:'Narrow QRS',wide:'Wide QRS',psinus:'Sinus P',axis:'Axis',reg:'Regularity',v1:'V1 S wave',v5:'V5 R wave',chambers:'Chamber clues',lowv:'Low voltage',ant:'Anterior STE',inf:'Inferior STE',mirror:'Mirror STD',hyperacute:'Hyperacute T',hyperk:'HyperK clue',wellens:'Wellens LAD',dewinter:'de Winter LAD',sgSte:'Concordant STE',sgStd:'Concordant STD',sgDis:'STE/S ≥25%',post:'Posterior mirror',ischa:'Ischaemia STD/TWI'};
            var waves = [];
            try { waveOrder.forEach(function (w) { if ((entry.svg || '').indexOf('data-wave="' + w + '"') !== -1) waves.push(w); }); } catch (e1) {}
            var figHint = hasHot ? 'Hover or tap: ' + waves.map(function (w) { return waveNames[w] || w.toUpperCase(); }).join(' \u00b7 ') + '.' : '';
            var inspector = waves.length ? '<div class="ecg-inspector" data-hint="' + esc(figHint) + '" aria-live="polite">' + esc(figHint || 'Select a wave to read its explanation.') + '</div>' : '';
            var waveBtns = waves.length ? '<div class="ecg-wavebtns" role="group" aria-label="Waves and intervals in ' + esc(title) + '">' + waves.map(function (w) { return '<button type="button" class="ecg-wavebtn" data-ecg-wavebtn="' + w + '" aria-pressed="false">' + esc(waveNames[w] || w.toUpperCase()) + '</button>'; }).join('') + '</div>' : '';
            if (entry.png) {
                var pngSrc = String(entry.png).replace(/"/g, '%22');
                var alt = esc(title + ' — ' + caption).replace(/"/g, '&quot;');
                return '<figure class="ecg-fig" data-ecg-fig="' + esc(id) + '"><div class="ecg-media">'
                    + '<img class="ecg-img" src="' + pngSrc + '" alt="' + alt + '" loading="lazy" decoding="async" onerror="this.style.display=\'none\';var w=this.parentNode.querySelector(\'.ecg-svg-wrap\');if(w) w.hidden=false;">'
                    + '<div class="ecg-svg-wrap" hidden>' + ecgSvgWithRef(entry.svg, entry.noCompare) + '</div></div>'
                    + sourceHtml + tools
                    + waveBtns + inspector + '</figure>';
            }
            var panelSelect = '', cardSvg = entry.svg;
            if (entry.previewPanels && entry.previewPanels.length) {
                var fullView = cardSvg.match(/viewBox="([^"]+)"/)[1];
                panelSelect = '<label class="ecg-panel-select">Focus <select aria-label="Diagram focus" data-ecg-panel><option value="' + esc(fullView) + '" selected>Whole diagram</option>' + entry.previewPanels.map(function (p) { return '<option value="' + esc(p.viewBox) + '">' + esc(p.title) + '</option>'; }).join('') + '</select></label>';
            }
            return '<figure class="ecg-fig" data-ecg-fig="' + esc(id) + '">' + panelSelect + '<div class="ecg-media"' + ' tabindex="0" role="region" aria-label="ECG figure; scroll horizontally to inspect"' + '><div class="ecg-svg-wrap">' + ecgSvgWithRef(cardSvg, entry.noCompare) + '</div></div>'
                + sourceHtml + tools
                + waveBtns + inspector + '</figure>';
        } catch (e) { console.error('ECG figure failed:', id, e); return '<p class="empty-filter" role="status">ECG figure could not be rendered. Reload or use the written criteria.</p>'; }
    }
    function openEcgLightbox(figId, returnTo) {
        if (window.ECG_INTERACTIVE) {
            var figure = returnTo && returnTo.closest('.ecg-fig');
            window.ECG_INTERACTIVE.open(figId, returnTo, { wave: figure && figure.getAttribute('data-sel') });
            return;
        }
        try {
            closeEcgLightbox();
            var lib = window.ECG_SVG || {};
            var entry = lib[figId];
            if (!entry) return;
            var title = String(entry.title || figId);
            var box = document.createElement('div');
            box.className = 'ecg-lightbox';
            box.id = 'ecgLightbox';
            box.setAttribute('role', 'dialog');
            box.setAttribute('aria-modal', 'true');
            box.setAttribute('aria-label', title + ' — enlarged diagram');
            box.innerHTML = '<div class="ecg-lightbox-card"><div class="ecg-lightbox-head"><strong>' + esc(title) + '</strong>'
                + '<button type="button" class="ecg-lightbox-close" aria-label="Close enlarged diagram">Close</button></div>'
                + '<div class="ecg-lightbox-media">' + ecgSvgWithRef(entry.svg, entry.noCompare).split(' tabindex="0" role="button"').join('') + '</div>'
                + '</div>';
            box._returnTo = returnTo || document.activeElement;
            box.addEventListener('click', function (e) {
                if (e.target === box || e.target.closest('.ecg-lightbox-close')) closeEcgLightbox();
            });
            document.body.appendChild(box);
            document.body.style.overflow = 'hidden';
            var btn = box.querySelector('.ecg-lightbox-close');
            if (btn) btn.focus();
        } catch (e) {}
    }
    function closeEcgLightbox() {
        if (window.ECG_INTERACTIVE) window.ECG_INTERACTIVE.close();
        try {
            var box = document.getElementById('ecgLightbox');
            if (!box) return;
            var ret = box._returnTo;
            box.remove();
            if (!document.getElementById('disclaimerOverlay') || document.getElementById('disclaimerOverlay').hidden) document.body.style.overflow = '';
            if (ret && ret.focus) ret.focus();
        } catch (e) {}
    }
    function ecgDetailList(details) {
        return '<ul class="ecg-details">' + (details || []).map(function (line) {
            const t = String(line);
            const sub = t.charAt(0) === '•';
            return '<li' + (sub ? ' class="ecg-sub"' : '') + '>' + rich(sub ? t.replace(/^•\s*/, '') : t) + '</li>';
        }).join('') + '</ul>';
    }
    function ecgPatternVisible(p) {
        if (ecgFocusId && p.id === ecgFocusId) return true;
        if (severityFilter !== 'all' && p.severity !== severityFilter) return false;
        if (ecgCategory !== 'all' && p.category !== ecgCategory) return false;
        return true;
    }
    function bindEcgLearning() {
        stage.querySelectorAll('.reveal-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const answer = document.getElementById('recall-' + btn.dataset.reveal);
                if (!answer) return;
                const hidden = answer.hidden;
                answer.hidden = !hidden;
                btn.textContent = hidden ? 'Hide answer' : 'Reveal answer';
            });
        });
        const reviewBtn = document.getElementById('reviewBtn');
        if (reviewBtn) reviewBtn.addEventListener('click', function () {
            const alreadyScheduled = isReviewed(ECG_TOPIC_ID);
            if (alreadyScheduled && !isReviewDue(ECG_TOPIC_ID)) {
                const removal = setReviewed(ECG_TOPIC_ID, false);
                reviewBtn.setAttribute('aria-pressed', 'false');
                reviewBtn.textContent = reviewActionLabel(ECG_TOPIC_ID);
                const status = document.querySelector('.review-status');
                if (status) status.textContent = 'Review schedule starts when marked reviewed';
                toast('Removed from your review schedule.' + (removal.persisted ? '' : ' This change lasts for this session only.'));
                return;
            }
            const result = setReviewed(ECG_TOPIC_ID, true);
            reviewBtn.setAttribute('aria-pressed', 'true');
            reviewBtn.textContent = reviewActionLabel(ECG_TOPIC_ID);
            const status = document.querySelector('.review-status');
            if (status) status.textContent = reviewLabel(ECG_TOPIC_ID);
            const days = result.plan ? REVIEW_INTERVALS[Math.max(0, Number(result.plan.stage) - 1)] : 1;
            const message = alreadyScheduled ? 'Review complete — next review in ' + days + ' days.' : 'Reviewed — it will return in 1 day.';
            toast(message + (result.persisted ? '' : ' Saved for this session only.'));
        });
        const saveTopic = document.getElementById('saveTopic');
        if (saveTopic) saveTopic.addEventListener('click', function () {
            const saved = !isSaved(ECG_TOPIC_ID);
            const persisted = setSaved(ECG_TOPIC_ID, saved);
            saveTopic.classList.toggle('active', saved);
            saveTopic.setAttribute('aria-pressed', String(saved));
            saveTopic.textContent = saved ? '★ Saved topic' : '☆ Save topic';
            toast((saved ? 'Saved to your study list.' : 'Removed from saved topics.') + (persisted ? '' : ' This change lasts for this session only.'));
        });
        const saveNote = document.getElementById('saveNote');
        if (saveNote) saveNote.addEventListener('click', function () {
            const persisted = setNote(ECG_TOPIC_ID, document.getElementById('studyNote').value);
            const status = document.getElementById('noteStatus');
            if (status) status.textContent = persisted ? 'Saved on this device.' : 'Saved for this session only.';
            toast(persisted ? 'Learning note saved.' : 'Learning note saved for this session only.');
        });
    }
    function resolveEcgJump(ecg, target) {
        if (!target) return '';
        if (target.indexOf('ecg-') === 0) return target;
        if (ecg.steps.some(function (s) { return s.id === target; })) return 'ecg-step-' + target;
        if (target.indexOf('step-') === 0) return 'ecg-' + target;
        if (ecg.patterns.some(function (p) { return p.id === target; })) return 'ecg-pattern-' + target;
        if (target === 'patterns') return 'ecg-patterns';
        if (target === 'red-flags') return 'ecg-red-flags';
        return target;
    }
    function renderEcg(target) {
        const ecg = getEcg();
        currentId = null;
        markActive(ECG_TOPIC_ID);
        syncNav('ecg');
        if (!ecg) {
            setTitle('ECG');
            setStageContext('Emergency ECG interpretation');
            stage.innerHTML = '<section class="study-page"><div class="study-page-head"><button type="button" class="back-btn" data-home="1">← All presentations</button><h1>ECG guide unavailable</h1><p>Confirm <code>assets/data.js</code> includes <code>ECG_DATA</code>, then refresh.</p></div></section>';
            stage.querySelector('[data-home]').addEventListener('click', showHome);
            return;
        }
        const patternTarget = (ecg.patterns.filter(function (p) { return p.id === target; })[0] || {}).id || null;
        ecgFocusId = patternTarget || null;
        setTitle('ECG Guide');
        setStageContext(null, 'ecgTitle');
        const first = ecg.firstPass[0] || 'Treat the unstable patient before decorating the 12-lead.';
        const killers = ecg.patterns.filter(function (p) { return p.severity === 'critical'; }).slice(0, 5).map(function (p) { return p.name; });
        const fakeCp = topicRecord(ECG_TOPIC_ID);
        const stepNav = '<nav class="ecg-step-nav" aria-label="Seven-step method">' +
            ecg.steps.map(function (s) {
                return '<button type="button" class="ecg-step-chip" data-jump="ecg-step-' + s.id + '"><span>' + s.num + '</span>' + esc(s.name) + '</button>';
            }).join('') +
            '<button type="button" class="ecg-step-chip" data-jump="ecg-patterns">Patterns</button></nav>';
        const firstPassHtml = '<aside class="case-rail" aria-label="First thirty seconds">' +
            '<div class="case-rail-title"><span aria-hidden="true">' + GROUP_SVG.bolt + '</span><div><strong>First 30 seconds</strong><small>Shift-first pass, then the 7-step method</small></div></div>' +
            '<ol class="case-steps">' + ecg.firstPass.map(function (step, i) {
                return '<li><span>' + (i + 1) + '</span>' + esc(step) + '</li>';
            }).join('') + '</ol>' +
            '<div class="case-actions">' +
            '<button type="button" class="case-action primary" data-jump="ecg-red-flags">Red flags</button>' +
            '<button type="button" class="case-action" data-jump="ecg-step-' + ecg.steps[0].id + '">Start 7-step</button>' +
            '<button type="button" class="case-action" data-jump="ecg-patterns">Pattern library</button>' +
            '<button type="button" class="case-action" id="openDynamicEcg">ECG workbench</button>' +
            '</div></aside>';
        const killerHtml = '<details class="ecg-pattern-index"><summary>Jump to a pattern</summary><div class="ecg-killers" aria-label="Killer patterns">' +
            ecg.patterns.filter(function (p) { return p.severity === 'critical'; }).map(function (p) {
                return '<button type="button" class="ecg-killer" data-ecg-pattern="' + p.id + '"><strong>' + esc(p.name) + '</strong><small>' + esc(p.tag) + '</small></button>';
            }).join('') + '</div></details>';
        const stepsHtml = ecg.steps.map(function (s) {
            return sectionCard(s.icon || '📈', 'Step ' + s.num + ' · ' + s.name,
                '<p class="ecg-summary">' + esc(s.summary) + '</p>' +
                ecgFigure(s.id) + (s.id === 'rate-calibration' ? ecgFigure('normal-12lead') : '') +
                ecgDetailList(s.details) +
                '<div class="pp-grid ecg-pp"><div class="pp-box pearls"><h4>Pearl</h4><p>' + esc(s.pearl || '') + '</p></div>' +
                '<div class="pp-box pitfalls"><h4>Pitfall</h4><p>' + esc(s.pitfall || '') + '</p></div></div>',
                s.num !== 1, 'ecg-step-' + s.id);
        }).join('');
        const cats = [['all', 'All patterns']].concat(Object.keys(ECG_CAT_LABEL).map(function (k) { return [k, ECG_CAT_LABEL[k]]; }));
        const filters = '<div class="ecg-filters" role="group" aria-label="ECG pattern category">' +
            cats.map(function (c) {
                return '<button type="button" class="chip' + (ecgCategory === c[0] ? ' active' : '') + '" data-ecg-cat="' + c[0] + '" aria-pressed="' + String(ecgCategory === c[0]) + '">' + esc(c[1]) + '</button>';
            }).join('') + '</div>';
        const visible = ecg.patterns.filter(ecgPatternVisible);
        const patternsHtml = '<div class="ecg-pattern-grid">' + (visible.length ? visible.map(function (p) {
            return '<article class="ecg-pattern sev-' + p.severity + '" id="section-ecg-pattern-' + p.id + '" data-section="ecg-pattern-' + p.id + '" tabindex="-1">' +
                '<header><span class="sev-tag">' + sevDot(p.severity) + esc(SEV_LABEL[p.severity] || '') + '</span>' +
                '<span class="ecg-cat">' + esc(ECG_CAT_LABEL[p.category] || p.category) + '</span></header>' +
                '<h3>' + esc(p.name) + '</h3>' +
                '<p class="ecg-tagline">' + esc(p.tag) + '</p>' +
                ecgFigure(p.id) +
                (Array.isArray(p.comparison) ? '<div class="ecg-comparison"><h4>Distinguish the patterns</h4><dl>' + p.comparison.map(function (row) { return '<dt>' + esc(row[0]) + '</dt><dd>' + esc(row[1]) + '</dd>'; }).join('') + '</dl></div>' : '') +
                (p.leads ? '<p class="ecg-leads"><strong>Leads:</strong> ' + rich(p.leads) + '</p>' : '') +
                '<p><strong>Criteria:</strong> ' + rich(p.criteria) + '</p>' +
                (p.significance ? '<p><strong>Why it matters:</strong> ' + rich(p.significance) + '</p>' : '') +
                '<div class="ecg-action"><strong>Action:</strong> ' + rich(p.action) + '</div>' +
                (p.caution ? '<p class="ecg-caution"><strong>Caution:</strong> ' + rich(p.caution) + '</p>' : '') +
                '</article>';
        }).join('') : '<p class="empty-filter">No patterns in this filter. Choose All, or another severity/category.</p>') + '</div>';
        const recallHtml = '<section class="learning-loop" aria-label="ECG rapid recall">' +
            '<div class="learning-head"><div><span class="learning-kicker">PRACTICE REFRESHER</span><h2>Rapid recall</h2><p>Test your first action and the dangerous patterns before revealing the answer.</p></div>' +
            '<button type="button" class="review-btn" id="reviewBtn" aria-pressed="' + isReviewed(ECG_TOPIC_ID) + '">' + reviewActionLabel(ECG_TOPIC_ID) + '</button></div>' +
            '<div class="recall-grid">' +
            '<div class="recall-card"><span>01 · First move</span><p>The patient is hypotensive with a wide-complex tachycardia. What happens before a prettier 12-lead?</p><button type="button" class="reveal-btn" data-reveal="ecg-action">Reveal answer</button><div class="reveal-answer" id="recall-ecg-action" hidden>' + esc(first) + '</div></div>' +
            '<div class="recall-card"><span>02 · Killer patterns</span><p>Name three ECG patterns that should change management in the next minutes.</p><button type="button" class="reveal-btn" data-reveal="ecg-threats">Reveal answer</button><div class="reveal-answer" id="recall-ecg-threats" hidden>' + esc(killers.join(' · ')) + '</div></div>' +
            '</div></section>';
        const related = ecg.related.length
            ? sectionCard('🔗', 'See also',
                '<div class="related">' + ecg.related.map(function (rid) {
                    const r = BY_ID[rid];
                    return '<button type="button" class="related-chip" data-id="' + r.id + '">' + iconFor(r) + esc(r.name) + '</button>';
                }).join('') + '</div>', true, 'ecg-related')
            : '';

        stage.innerHTML =
            '<div class="cp-hero">' +
            '<button type="button" class="back-btn" id="backBtn">← All presentations</button>' +
            '<div class="cp-ico-lg" aria-hidden="true">' + GROUP_SVG.ecg + '</div>' +
            '<h1 id="ecgTitle" tabindex="-1">ECG interpretation</h1>' +
            '<p class="tag">' + esc(ecg.tag) + '</p>' +
            (ecg.subtitle ? '<p class="ecg-subhead">' + esc(ecg.subtitle) + '</p>' : '') +
            '</div>' +
            stepNav +
            '<p class="student-safety">'+esc(ecg.firstPass[0])+'</p><details class="reference-firstpass"><summary>Urgent ECG assessment · reference checklist</summary>'+firstPassHtml+'</details>'+
            stepsHtml +
            killerHtml +
            sectionCard('🗂️', 'Pattern library',
                '<p class="ecg-summary">Choose a category, or use the severity filter above.</p>' +
                filters + patternsHtml, true, 'ecg-patterns') +
            sectionCard('🧭', 'How to think',
                '<div class="ov"><p class="ov-job"><span class="ov-kicker">The job</span>' + esc(ecg.tag) + '</p>' +
                '<ol class="ov-steps">' + ecg.firstPass.map(function (s, i) {
                    return '<li><span class="ov-n" aria-hidden="true">' + (i + 1) + '</span><span class="ov-s">' + esc(s) + '</span></li>';
                }).join('') + '</ol>' +
                (ecg.overview ? '<div class="ov-prose"><p>' + esc(ecg.overview) + '</p></div>' : '') + '</div>',
                true, 'ecg-how') +
            sectionCard('🚩', 'ECG red flags',
                '<div class="rf-box"><p class="ecg-summary">These findings should move the patient to a different lane now.</p><ul class="plain-list">' +
                ecg.redFlags.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></div>',
                false, 'ecg-red-flags') +
            sectionCard('💡', 'Pearls & Pitfalls',
                '<div class="pp-grid"><div class="pp-box pearls"><h4>Clinical Pearls</h4><ul class="plain-list">' +
                ecg.pearls.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') +
                '</ul></div><div class="pp-box pitfalls"><h4>Pitfalls</h4><ul class="plain-list">' +
                ecg.pitfalls.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') +
                '</ul></div></div>', true, 'pearls-pitfalls') +
            '<section class="presentation-study-group" id="section-study" aria-label="Recall and notes" tabindex="-1">' + recallHtml + personalPlanHtml(fakeCp) + '</section>' +
            related +
            sectionCard('📚', 'References',
                evidenceHtml('ecg') + '<ul class="refs">' + ecg.refs.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul>'
                + '<p class="ecg-litfl">Diagrams above are original teaching drawings. For real 12-lead tracings see <a href="https://litfl.com/ecg-library/" target="_blank" rel="noopener">LITFL ECG Library</a> — free for non-profit education with credit to litfl.com (CC BY-NC-SA 4.0).</p>',
                true, 'ecg-references');

        document.getElementById('backBtn').addEventListener('click', showHome);
        document.getElementById('openDynamicEcg').addEventListener('click', function () { openEcgLightbox('stemi-criteria', this); });
        stage.querySelectorAll('[data-ecg-panel]').forEach(function (select) {
            function focusPanel() {
                var svg = select.closest('.ecg-fig').querySelector('.ecg-media svg');
                if (!svg) return;
                svg.setAttribute('viewBox', select.value);
                // Equivalent inspector buttons remain available below the crop.
                svg.querySelectorAll('.ecg-hot').forEach(function (hot) { hot.setAttribute('tabindex', select.selectedIndex ? '-1' : '0'); });
            }
            select.addEventListener('change', focusPanel);
            focusPanel();
        });
        stage.querySelectorAll('.sec-head').forEach(function (h) {
            h.addEventListener('click', function () {
                const card = h.closest('.section-card');
                const closed = !card.classList.contains('closed');
                card.classList.toggle('closed', closed);
                h.setAttribute('aria-expanded', String(!closed));
            });
        });
        stage.querySelectorAll('[data-jump]').forEach(function (btn) {
            btn.addEventListener('click', function () { jumpToSection(btn.dataset.jump, true); });
        });
        stage.querySelectorAll('.related-chip').forEach(function (btn) {
            btn.addEventListener('click', function () { showPresentation(btn.dataset.id); });
        });
        stage.querySelectorAll('[data-ecg-pattern]').forEach(function (btn) {
            btn.addEventListener('click', function () { showEcg(btn.dataset.ecgPattern); });
        });
        stage.querySelectorAll('[data-ecg-cat]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                ecgCategory = btn.dataset.ecgCat;
                showEcg('patterns');
            });
        });
        bindEcgLearning();
        if (!target) {
            window.scrollTo({ top: 0 });
            stage.focus({ preventScroll: true });
            announce('Viewing emergency ECG Guide');
        } else {
            announce('Viewing emergency ECG — ' + stripTags(target));
            requestAnimationFrame(function () { jumpToSection(resolveEcgJump(ecg, target), true); });
        }
    }
    function showEcg(target) {
        const route = 'ecg' + (target ? '~' + target : '');
        if ((location.hash || '').replace('#', '') === route) renderEcg(target);
        else location.hash = route;
    }

    function showExplorer(id) {
        const route='ecg-explorer'+(typeof id==='string'?'~'+id:'');
        if (location.hash === '#'+route) renderExplorer(typeof id==='string'?id:undefined);
        else location.hash = route;
    }
    function renderExplorer(id) {
        currentId = null;
        markActive('ecg-explorer'); syncNav('explorer'); setTitle('ECG Explorer');
        setStageContext('ECG Explorer');
        stage.innerHTML = '<section class="ecg-explorer"></section>';
        try {
            window.ECG_EXPLORER.mount(stage.firstElementChild,{id});
        } catch (error) {
            console.error('ECG Explorer could not open', error);
            stage.innerHTML = '<section role="alert"><h1>ECG Explorer could not open</h1><p>Reload to try again. Your saved progress will be kept.</p><button type="button" data-explorer-reload>Reload Explorer</button><button type="button" data-explorer-home>Back to library</button></section>';
            stage.querySelector('[data-explorer-reload]').onclick = () => location.reload();
            stage.querySelector('[data-explorer-home]').onclick = showHome;
        }
        window.scrollTo({ top: 0 });
        stage.focus({ preventScroll: true }); announce('Viewing ECG Explorer');
    }

    function applyRoute(preservePosition) {
        const route = (location.hash || '').replace('#', '').split('~');
        const id = route[0], target = route[1];
        if (id === 'study') renderStudy(target || 'due');
        else if (id === 'shift') renderShift(target);
        else if (id === 'ecg-explorer') renderExplorer(target);
        else if (id === ECG_TOPIC_ID) renderEcg(target);
        else if (id && BY_ID[id]) renderPresentation(id, target, preservePosition);
        else renderHome();
    }

    function refreshActiveRoute() {
        const position = window.scrollY;
        applyRoute(true);
        window.scrollTo({ top: position });
    }

    /* ---------- red flag checklist ---------- */
    function setupRedFlags(cp, state) {
        const boxes = stage.querySelectorAll('input[data-rf]');
        const banner = document.getElementById('rfBanner');
        const bar = document.getElementById('rfBar');
        const total = boxes.length;
        if (!total) return;
        function update() {
            const checked = stage.querySelectorAll('input[data-rf]:checked').length;
            try {
                boxes.forEach(function (b) {
                    const label = b.closest('.rf-item');
                    if (label) label.classList.toggle('is-checked', !!b.checked);
                });
            } catch (e) {}
            if (bar) bar.style.width = (checked / total * 100) + '%';
            if (checked >= 3) {
                banner.className = 'rf-banner show level-high';
                banner.textContent = '🚨 ' + checked + ' red flags — ' + cp.name +
                    ': this patient needs immediate escalation. Time-critical workup; consider senior/consultant involvement.';
            } else if (checked > 0) {
                banner.className = 'rf-banner show level-mid';
                banner.textContent = '⚠️ ' + checked + ' red flag' + (checked > 1 ? 's' : '') +
                    ' present — proceed with the workup pathway above and re-assess.';
            } else {
                banner.className = 'rf-banner';
            }
        }
        boxes.forEach(b => b.addEventListener('change', () => {
            state.redFlags[b.dataset.rf] = b.checked;
            update();
        }));
        const clear = document.getElementById('clearRedFlags');
        if (clear) clear.addEventListener('click', () => {
            boxes.forEach(b => { b.checked = false; });
            state.redFlags = {};
            update();
            toast('Red-flag checklist cleared for this session.');
        });
        const copy = document.getElementById('copyReview');
        if (copy) copy.addEventListener('click', async () => {
            const selected = Array.from(boxes).filter(b => b.checked).map(b => cp.redFlags[Number(b.dataset.rf)]);
            const summary = 'EM Pocket educational review — ' + cp.name + '\nSelected red flags: ' +
                (selected.length ? selected.map(x => '• ' + x).join('\n') : 'None selected') +
                '\n\nUse clinical judgment and local protocols.';
            try {
                await navigator.clipboard.writeText(summary);
                toast('Session review copied to your clipboard.');
            } catch (e) {
                toast('Could not copy this review. Select the checklist text manually.');
            }
        });
        update();
    }

    /* ---------- search ---------- */
    function buildSearchIndex() {
        const idx = [];
        DATA.forEach(cp => {
            idx.push({ cpId: cp.id, target: 'how-to-think', title: cp.name, sub: cp.tag, kind: 'Presentation' });
            (cp.approach || []).forEach(function (s) {
                idx.push({ cpId: cp.id, target: 'how-to-think', title: s, sub: 'Approach — ' + cp.name, kind: 'Approach' });
            });
            cp.dontMiss.forEach(d => idx.push({ cpId: cp.id, target: 'dont-miss', title: d[0], sub: d[2], kind: cp.name + ' · ' + d[1] }));
            cp.redFlags.forEach(r => idx.push({ cpId: cp.id, target: 'red-flags', title: r, sub: 'Red flag — ' + cp.name, kind: 'Red flag' }));
            cp.history.forEach(item => idx.push({ cpId: cp.id, target: 'history', title: item, sub: 'Focused history — ' + cp.name, kind: 'History' }));
            cp.exam.forEach(item => idx.push({ cpId: cp.id, target: 'exam', title: item, sub: 'Examination — ' + cp.name, kind: 'Exam' }));
            cp.workup.forEach(group => group[1].forEach(item => idx.push({ cpId: cp.id, target: 'workup', title: item, sub: group[0] + ' — ' + cp.name, kind: 'Workup' })));
            cp.disposition.forEach(item => idx.push({ cpId: cp.id, target: 'disposition', title: item[0], sub: item[1] + ' — ' + cp.name, kind: 'Disposition' }));
            cp.pitfalls.forEach(p => idx.push({ cpId: cp.id, target: 'pearls-pitfalls', title: p, sub: 'Pitfall — ' + cp.name, kind: 'Pitfall' }));
            (cp.pearls || []).forEach(p => idx.push({ cpId: cp.id, target: 'pearls-pitfalls', title: p, sub: 'Pearl — ' + cp.name, kind: 'Pearl' }));
        });
        const ecg = getEcg();
        if (ecg) {
            idx.push({ cpId: ECG_TOPIC_ID, target: '', title: 'ECG Guide', sub: ecg.tag, kind: 'ECG' });
            idx.push({ cpId: ECG_TOPIC_ID, target: '', title: ecg.title, sub: ecg.subtitle || ecg.tag, kind: 'ECG' });
            ecg.firstPass.forEach(function (s) {
                idx.push({ cpId: ECG_TOPIC_ID, target: 'ecg-how', title: s, sub: 'ECG first-pass', kind: 'ECG' });
            });
            ecg.steps.forEach(function (s) {
                idx.push({ cpId: ECG_TOPIC_ID, target: 'step-' + s.id, title: 'Step ' + s.num + ': ' + s.name, sub: s.summary, kind: 'ECG step' });
                if (s.pearl) idx.push({ cpId: ECG_TOPIC_ID, target: 'step-' + s.id, title: s.pearl, sub: s.name + ' · pearl', kind: 'ECG step' });
                if (s.pitfall) idx.push({ cpId: ECG_TOPIC_ID, target: 'step-' + s.id, title: s.pitfall, sub: s.name + ' · pitfall', kind: 'ECG step' });
            });
            ecg.patterns.forEach(function (p) {
                idx.push({ cpId: ECG_TOPIC_ID, target: p.id, title: p.name, sub: stripTags(p.criteria), kind: 'ECG pattern' });
                if (p.tag) idx.push({ cpId: ECG_TOPIC_ID, target: p.id, title: p.tag, sub: p.name, kind: 'ECG pattern' });
            });
            ecg.redFlags.forEach(function (r) {
                idx.push({ cpId: ECG_TOPIC_ID, target: 'ecg-red-flags', title: r, sub: 'ECG red flag', kind: 'ECG' });
            });
            ecg.pearls.forEach(function (p) {
                idx.push({ cpId: ECG_TOPIC_ID, target: 'pearls-pitfalls', title: p, sub: 'ECG pearl', kind: 'ECG' });
            });
            ecg.pitfalls.forEach(function (p) {
                idx.push({ cpId: ECG_TOPIC_ID, target: 'pearls-pitfalls', title: p, sub: 'ECG pitfall', kind: 'ECG' });
            });
        }
        if(window.ECG_EXPLORER)window.ECG_EXPLORER.cases.forEach(c=>idx.unshift({cpId:'ecg-explorer',target:c.id,title:c.name,sub:c.category+' · '+c.id.replace(/-/g,' ')+' · '+c.summary,kind:'Interactive ECG'}));
        return idx;
    }
    const SEARCH_INDEX = buildSearchIndex();

    function ensureResultsPop() {
        let pop = document.querySelector('.results-pop');
        if (!pop) {
            pop = document.createElement('div');
            pop.className = 'results-pop';
            pop.id = 'searchResults';
            pop.setAttribute('role', 'listbox');
            document.querySelector('.searchwrap').appendChild(pop);
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.searchwrap')) hideSearchResults(pop);
            });
        }
        return pop;
    }

    function hideSearchResults(pop) {
        const results = pop || document.querySelector('.results-pop');
        if (results) {
            results.style.display = 'none';
            results.querySelectorAll('[role="option"]').forEach(option => option.setAttribute('aria-selected', 'false'));
        }
        const input = document.getElementById('searchInput');
        if (input) {
            input.setAttribute('aria-expanded', 'false');
            input.removeAttribute('aria-activedescendant');
        }
        searchCursor = -1;
    }

    function paintSearchCursor(pop) {
        const items = pop.querySelectorAll('.res-item[data-id]');
        items.forEach((el, i) => {
            const active = i === searchCursor;
            el.classList.toggle('active', active);
            el.setAttribute('aria-selected', String(active));
        });
        const input = document.getElementById('searchInput');
        if (input) {
            if (searchCursor >= 0 && items[searchCursor]) input.setAttribute('aria-activedescendant', items[searchCursor].id);
            else input.removeAttribute('aria-activedescendant');
        }
        if (searchCursor >= 0 && items[searchCursor]) items[searchCursor].scrollIntoView({ block: 'nearest' });
    }

    function runSearch(q) {
        const pop = ensureResultsPop();
        searchCursor = -1;
        const input = document.getElementById('searchInput');
        if (input) input.removeAttribute('aria-activedescendant');
        const clearBtn = document.getElementById('searchClearBtn');
        if (clearBtn) clearBtn.hidden = !q;
        if (!q || q.length < 2) { hideSearchResults(pop); return; }
        const ql = q.toLowerCase();
        const hits = SEARCH_INDEX.filter(x =>
            x.title.toLowerCase().indexOf(ql) !== -1 ||
            (x.sub && x.sub.toLowerCase().indexOf(ql) !== -1)
        ).sort((a,b)=>{const score=x=>{const title=x.title.toLowerCase();return title===ql?100:title.startsWith(ql)&&(!title[ql.length]||/[^a-z0-9]/.test(title[ql.length]))?80:title.includes(ql)?40:20;};return score(b)-score(a);}).slice(0, 12);
        pop.innerHTML = hits.length
            ? hits.map((h, i) =>
                '<button type="button" class="res-item" id="search-result-' + i + '" data-id="' + h.cpId + '" data-target="' + h.target + '" role="option" aria-selected="false">' +
                '<div><div class="r-title">' + esc(h.title) + '</div>' +
                '<div class="r-sub">' + (h.sub ? esc(h.sub) : '') + '</div></div>' +
                '<span class="r-tag">' + esc(h.kind) + '</span></button>').join('')
            : '<div class="res-item"><div class="r-sub">No results for \u201C' + esc(q) + '\u201D</div></div>';
        pop.style.display = 'block';
        if (input) input.setAttribute('aria-expanded', 'true');
        if (hits.length) {
            announce(hits.length + ' result' + (hits.length !== 1 ? 's' : '') + ' found');
        } else {
            announce('No results found');
        }
        pop.querySelectorAll('.res-item[data-id]').forEach(el =>
            el.addEventListener('click', () => {
                hideSearchResults(pop);
                openSearchHit(el.dataset.id, el.dataset.target);
            }));
    }
    function openSearchHit(id, target) {
        if (id === 'ecg-explorer') showExplorer(target);
        else if (id === ECG_TOPIC_ID) showEcg(target || '');
        else showPresentation(id, target);
    }

    /* ---------- reading prefs: theme, accent, size, bold ---------- */
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
    function applyPrefs(p) {
        const r = document.documentElement;
        const dark = p.theme === 'dark';
        const accent = normalizeAccent(p.accent);
        r.setAttribute('data-theme', dark ? 'dark' : 'light');
        r.setAttribute('data-accent', accent);
        if (p.bold !== false) r.setAttribute('data-weight', 'bold');
        else r.removeAttribute('data-weight');
        r.classList.toggle('sidebar-collapsed', p.sidebar === true);
        syncSidebarToggle();
        const scale = nearestScale(p.scale);
        r.style.setProperty('--type-scale', String(scale));
        const themeBtn = document.getElementById('themeBtn');
        const boldBtn = document.getElementById('boldBtn');
        const label = document.getElementById('fontLabel');
        if (themeBtn) {
            themeBtn.setAttribute('aria-pressed', dark ? 'true' : 'false');
            themeBtn.innerHTML = '<span class="theme-ico" aria-hidden="true">' + (dark ? THEME_SVG.sun : THEME_SVG.moon) + '</span>';
            themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
            themeBtn.title = dark ? 'Light mode' : 'Dark mode';
        }
        if (boldBtn) boldBtn.setAttribute('aria-pressed', p.bold !== false ? 'true' : 'false');
        if (label) label.textContent = Math.round(scale * 100) + '%';
        try {
            document.querySelectorAll('.accent-dot').forEach(function (dot) {
                const on = dot.getAttribute('data-accent') === accent;
                dot.setAttribute('aria-pressed', on ? 'true' : 'false');
            });
        } catch (e) {}
        const meta = document.getElementById('themeColor');
        if (meta) {
            meta.setAttribute('content', dark ? '#151d27' : '#ffffff');
        }
    }
    function bindPrefs() {
        let p = loadPrefs();
        applyPrefs(p);
        const themeBtn = document.getElementById('themeBtn');
        const boldBtn = document.getElementById('boldBtn');
        const up = document.getElementById('fontUp');
        const down = document.getElementById('fontDown');
        if (themeBtn) themeBtn.addEventListener('click', function () {
            p = loadPrefs();
            p.theme = (document.documentElement.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
            savePrefs(p); applyPrefs(p);
        });
        if (boldBtn) boldBtn.addEventListener('click', function () {
            p = loadPrefs();
            p.bold = !p.bold;
            savePrefs(p); applyPrefs(p);
        });
        if (up) up.addEventListener('click', function () {
            p = loadPrefs();
            const i = SCALE_STEPS.indexOf(nearestScale(p.scale));
            p.scale = SCALE_STEPS[Math.min(SCALE_STEPS.length - 1, i + 1)];
            savePrefs(p); applyPrefs(p);
        });
        if (down) down.addEventListener('click', function () {
            p = loadPrefs();
            const i = SCALE_STEPS.indexOf(nearestScale(p.scale));
            p.scale = SCALE_STEPS[Math.max(0, i - 1)];
            savePrefs(p); applyPrefs(p);
        });
        document.querySelectorAll('.accent-dot').forEach(function (dot) {
            dot.addEventListener('click', function () {
                p = loadPrefs();
                p.accent = normalizeAccent(dot.getAttribute('data-accent'));
                savePrefs(p); applyPrefs(p);
                toast('App color: ' + (ACCENT_LABELS[p.accent] || p.accent) + '.');
            });
        });
    }

    /* ---------- severity filter ---------- */
    function bindFilters() {
        document.querySelectorAll('#filterChips .chip').forEach(chip => {
            chip.setAttribute('aria-pressed', String(chip.classList.contains('active')));
            chip.addEventListener('click', () => {
                document.querySelectorAll('#filterChips .chip').forEach(c => {
                    c.classList.remove('active');
                    c.setAttribute('aria-pressed', 'false');
                });
                chip.classList.add('active');
                chip.setAttribute('aria-pressed', 'true');
                severityFilter = chip.dataset.sev;
                refreshActiveRoute();
            });
        });
    }

    /* ---------- educational disclaimer modal ---------- */
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
    function showDisclaimer(isReviewOnly) {
        const overlay = document.getElementById('disclaimerOverlay');
        const check = document.getElementById('disclaimerCheck');
        const btn = document.getElementById('disclaimerAcceptBtn');
        if (!overlay || !check || !btn) return;

        overlay.hidden = false;
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        const btnText = btn.querySelector('span');
        if (isReviewOnly && isDisclaimerAgreed()) {
            check.checked = true;
            btn.disabled = false;
            if (btnText) btnText.textContent = 'Acknowledged & Return to App';
        } else {
            check.checked = false;
            btn.disabled = true;
            if (btnText) btnText.textContent = 'Accept & Enter EM Pocket';
        }

        requestAnimationFrame(() => {
            const title=document.getElementById('disclaimerTitle');
            if(title){title.tabIndex=-1;title.focus({preventScroll:true});}
            const body=overlay.querySelector('.disclaimer-body');if(body)body.scrollTop=0;
        });
    }
    function hideDisclaimer() {
        const overlay = document.getElementById('disclaimerOverlay');
        if (!overlay) return;
        overlay.hidden = true;
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        // Do not focus the search field here: on phones that opens the keyboard
        // immediately after the learner accepts the disclaimer.
        if (stage && stage.focus) stage.focus({ preventScroll: true });
    }
    function setupDisclaimer() {
        const overlay = document.getElementById('disclaimerOverlay');
        const check = document.getElementById('disclaimerCheck');
        const btn = document.getElementById('disclaimerAcceptBtn');
        const linkBtn = document.getElementById('disclaimerLinkBtn');
        if (!overlay || !check || !btn) return;

        check.addEventListener('change', () => {
            btn.disabled = !check.checked;
            try {
                const label = check.closest('.disclaimer-agree-label');
                if (label) label.classList.toggle('is-checked', !!check.checked);
            } catch (e) {}
        });

        btn.addEventListener('click', () => {
            if (!check.checked) return;
            setDisclaimerAgreed();
            hideDisclaimer();
            toast('Educational terms acknowledged. Welcome to EM Pocket.');
        });

        if (linkBtn) {
            linkBtn.addEventListener('click', () => {
                showDisclaimer(true);
                closeSidebar();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (overlay.hidden) return;
            const focusable = overlay.querySelectorAll('button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
            const items = Array.from(focusable);
            if (e.key === 'Tab' && items.length) {
                const first = items[0], last = items[items.length - 1];
                if (e.shiftKey && (document.activeElement === first || document.activeElement.id === 'disclaimerTitle')) {
                    e.preventDefault(); last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault(); first.focus();
                }
            } else if (e.key === 'Escape') {
                if (isDisclaimerAgreed()) {
                    hideDisclaimer();
                } else {
                    toast('You must review and agree to the educational notice before proceeding.');
                }
            }
        });

        if (!isDisclaimerAgreed()) {
            showDisclaimer(false);
        }
    }

    /* Legacy browser polyfills (IE11 / old Edge): Element.matches + Element.closest */
    try {
        if (typeof Element !== 'undefined' && Element.prototype) {
            if (!Element.prototype.matches) {
                Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
                    var matches = (this.document || this.ownerDocument).querySelectorAll(s);
                    var i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) {}
                    return i > -1;
                };
            }
            if (!Element.prototype.closest) {
                Element.prototype.closest = function (s) {
                    var el = this;
                    while (el && el.nodeType === 1) {
                        if (el.matches(s)) return el;
                        el = el.parentElement || el.parentNode;
                    }
                    return null;
                };
            }
        }
    } catch (e) {}
    try {
        document.addEventListener('click', function (e) {
            var btn = e.target && e.target.closest ? e.target.closest('[data-ecg-tool]') : null;
            if (!btn) return;
            var fig = btn.closest('.ecg-fig');
            if (!fig) return;
            var tool = btn.getAttribute('data-ecg-tool');
            if (tool === 'anno') {
                var hide = !fig.classList.contains('hide-anno');
                fig.classList.toggle('hide-anno', hide);
                btn.setAttribute('aria-pressed', String(!hide));
                btn.textContent = hide ? 'Show labels' : 'Annotations';
            } else if (tool === 'compare') {
                var on = !fig.classList.contains('show-reference');
                fig.classList.toggle('show-reference', on);
                btn.setAttribute('aria-pressed', String(on));
            } else if (tool === 'expand') {
                openEcgLightbox(fig.getAttribute('data-ecg-fig'), btn);
            }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeEcgLightbox();
        });
    } catch (e) {}
    (function () {
        var HINT = 'Hover or tap a wave \u2014 P \u00b7 PR \u00b7 QRS \u00b7 ST \u00b7 T \u00b7 QT \u00b7 CAL \u00b7 RR.';
        function clearSelection(figure) {
            figure.removeAttribute('data-sel');
            figure.querySelectorAll('.ecg-inline-marks').forEach(function (mark) { mark.remove(); });
            figure.querySelectorAll('.ecg-hot').forEach(function (hot) { hot.classList.remove('on'); hot.setAttribute('aria-pressed', 'false'); });
            figure.querySelectorAll('[data-ecg-wavebtn]').forEach(function (button) { button.setAttribute('aria-pressed', 'false'); });
            var inspector = figure.querySelector('.ecg-inspector');
            if (inspector) inspector.textContent = inspector.getAttribute('data-hint') || HINT;
        }
        function figBox(hot) { try { return hot.closest('.ecg-fig').querySelector('.ecg-inspector'); } catch (e) { return null; } }
        function showWave(hot) {
            if (!hot) return;
            var figure = hot.closest('.ecg-fig');
            if (!figure) return;
            var svg = hot.ownerSVGElement;
            var bounds = (hot.querySelector('.ecg-hotzone') || hot).getBBox(), matrix = svg.getCTM() && hot.getCTM();
            var authored = (hot.getAttribute('data-marker-bounds') || '').trim().split(/\s+/).map(Number);
            if (authored.length === 4 && authored.every(Number.isFinite) && authored[2] > 0 && authored[3] > 0) {
                bounds = { x: authored[0], y: authored[1], width: authored[2], height: authored[3] };
            }
            if (matrix) {
                matrix = svg.getCTM().inverse().multiply(matrix);
                var corners = [[bounds.x, bounds.y], [bounds.x + bounds.width, bounds.y], [bounds.x, bounds.y + bounds.height], [bounds.x + bounds.width, bounds.y + bounds.height]].map(function (xy) {
                    var point = svg.createSVGPoint(); point.x = xy[0]; point.y = xy[1]; return point.matrixTransform(matrix);
                });
                var xs = corners.map(function (p) { return p.x; }), ys = corners.map(function (p) { return p.y; });
                bounds = { x: Math.min.apply(null, xs), y: Math.min.apply(null, ys), width: Math.max.apply(null, xs) - Math.min.apply(null, xs), height: Math.max.apply(null, ys) - Math.min.apply(null, ys) };
            }
            var focus = figure.querySelector('[data-ecg-panel]');
            if (focus && focus.selectedIndex) {
                function contains(value) {
                    var v = value.split(/\s+/).map(Number);
                    return bounds.x >= v[0] && bounds.y >= v[1] && bounds.x + bounds.width <= v[0] + v[2] && bounds.y + bounds.height <= v[1] + v[3];
                }
                if (!contains(focus.value)) {
                    var match = Array.from(focus.options).slice(1).find(function (option) { return contains(option.value); });
                    focus.value = (match || focus.options[0]).value;
                    focus.dispatchEvent(new Event('change'));
                }
            }
            figure.querySelectorAll('.ecg-inline-marks').forEach(function (mark) { mark.remove(); });
            if (bounds.width > 0 && bounds.height > 0) {
                var mark = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
                mark.setAttribute('class', 'ecg-inline-marks');
                mark.setAttribute('cx', bounds.x + bounds.width / 2); mark.setAttribute('cy', bounds.y + bounds.height / 2);
                mark.setAttribute('rx', bounds.width / 2); mark.setAttribute('ry', bounds.height / 2);
                svg.appendChild(mark);
            }
            var box = figBox(hot);
            var dh = null; try { dh = box ? box.getAttribute('data-hint') : null; } catch (e3) {}
            if (box) box.innerHTML = ecgWaveText(hot.getAttribute('data-wave')) || dh || HINT;
            try { hot.closest('.ecg-fig').setAttribute('data-sel', hot.getAttribute('data-wave')); } catch (e0) {}
            try { hot.closest('.ecg-fig').querySelectorAll('.ecg-hot').forEach(function (h) { h.classList.toggle('on', h === hot); h.setAttribute('aria-pressed', String(h === hot)); }); } catch (e) {}
            try { var wv = hot.getAttribute('data-wave'); hot.closest('.ecg-fig').querySelectorAll('[data-ecg-wavebtn]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-ecg-wavebtn') === wv)); }); } catch (e2) {}
        }
        document.addEventListener('mouseover', function (e) { var h = e.target && e.target.closest ? e.target.closest('.ecg-hot') : null; if (h) showWave(h); });
        document.addEventListener('focusin', function (e) { var h = e.target && e.target.closest ? e.target.closest('.ecg-hot') : null; if (h) showWave(h); });
        document.addEventListener('keydown', function (e) { var h = e.target && e.target.closest ? e.target.closest('.ecg-hot') : null; if (h && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); showWave(h); } });
        document.addEventListener('click', function (e) { var h = e.target && e.target.closest ? e.target.closest('.ecg-hot') : null; if (h) showWave(h); });
        document.addEventListener('click', function (e) {
            var button = e.target.closest && e.target.closest('[data-ecg-wavebtn]');
            if (!button) return;
            var figure = button.closest('.ecg-fig'), wave = button.getAttribute('data-ecg-wavebtn');
            if (!figure) return;
            if (figure.getAttribute('data-sel') === wave) { clearSelection(figure); return; }
            // Always clear the previous visual, including when the next item is text-only.
            clearSelection(figure);
            var hot = figure.querySelector('.ecg-hot[data-wave="' + wave + '"]');
            if (hot) showWave(hot);
            else {
                figure.setAttribute('data-sel', wave);
                button.setAttribute('aria-pressed', 'true');
                var inspector = figure.querySelector('.ecg-inspector');
                if (inspector) inspector.innerHTML = ecgWaveText(wave) || HINT;
            }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') document.querySelectorAll('.ecg-fig[data-sel]').forEach(clearSelection);
        });
    })();
    /* ---------- global wiring ---------- */
    // Global :has() fallback — keeps .is-checked in sync for all browsers
    try {
        document.addEventListener('change', function (e) {
            const input = e.target && e.target.matches ? e.target : null;
            if (!input || !input.matches || !input.matches('.rf-item input, .disclaimer-agree-label input')) return;
            const label = input.closest('.rf-item, .disclaimer-agree-label');
            if (label) label.classList.toggle('is-checked', !!input.checked);
        });
    } catch (e) {}
    function init() {
        setupDisclaimer();
        buildSidebar();
        syncSidebarAccessibility();
        bindFilters();
        bindPrefs();
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            stage.focus({ preventScroll: true });
            stage.scrollIntoView({ block: 'start' });
        });
        function goHome() { showHome(); closeSidebar(); }
        const brand = document.getElementById('brandBtn');
        if (brand) brand.addEventListener('click', goHome);
        const homeBtn = document.getElementById('homeBtn');
        if (homeBtn) homeBtn.addEventListener('click', goHome);
        const studyBtn = document.getElementById('studyBtn');
        if (studyBtn) studyBtn.addEventListener('click', () => showStudy('due'));
        const shiftBtn = document.getElementById('shiftBtn');
        if (shiftBtn) shiftBtn.addEventListener('click', () => showShift(currentId));
        document.getElementById('explorerBtn').addEventListener('click', showExplorer);
        const ecgBtn = document.getElementById('ecgBtn');
        if (ecgBtn) {
            if (!getEcg()) ecgBtn.hidden = true;
            else ecgBtn.addEventListener('click', () => showEcg());
        }

        document.getElementById('burgerBtn').addEventListener('click', () => {
            if (sidebarIsMobile()) openSidebar();
            else setSidebarCollapsed(!sidebarCollapsed());
        });
        const collapseBtn = document.getElementById('collapseBtn');
        if (collapseBtn) collapseBtn.addEventListener('click', () => {
            if (sidebarIsMobile()) closeSidebar(true);
            else setSidebarCollapsed(!sidebarCollapsed());
        });
        document.getElementById('sideBackdrop').addEventListener('click', () => closeSidebar(true));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebarIsMobile() &&
                document.getElementById('sidebar').classList.contains('open')) closeSidebar(true);
        });
        window.addEventListener('resize', () => {
            if (!sidebarIsMobile()) {
                document.getElementById('sidebar').classList.remove('open');
                document.getElementById('sideBackdrop').classList.remove('show');
                sidebarReturnFocus = null;
            } else {
                document.getElementById('burgerBtn').setAttribute('aria-expanded', 'false');
            }
            syncSidebarToggle();
            syncSidebarAccessibility();
        });
        document.addEventListener('keydown', (e) => {
            const sidebar = document.getElementById('sidebar');
            if (e.key !== 'Tab' || !sidebarIsMobile() || !sidebar.classList.contains('open')) return;
            const focusable = sidebar.querySelectorAll('button:not([disabled]), summary, [href], input:not([disabled])');
            const items = Array.from(focusable).filter(el => el.getClientRects().length);
            if (!items.length) return;
            const first = items[0], last = items[items.length - 1];
            if (e.shiftKey && (document.activeElement === first || document.activeElement.id === 'disclaimerTitle')) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        });
        const toolsToggle = document.getElementById('toolsToggle');
        const topbarTools = document.getElementById('topbarTools');
        if (toolsToggle && topbarTools) {
            toolsToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const open = !topbarTools.classList.contains('open');
                topbarTools.classList.toggle('open', open);
                document.body.classList.toggle('tools-open', open);
                toolsToggle.setAttribute('aria-expanded', String(open));
                toolsToggle.setAttribute('aria-label', open ? 'Close reading settings' : 'Open reading settings');
            });
            document.addEventListener('click', (e) => {
                if (topbarTools.classList.contains('open') && !topbarTools.contains(e.target) && e.target !== toolsToggle && !toolsToggle.contains(e.target)) {
                    topbarTools.classList.remove('open');
                    document.body.classList.remove('tools-open');
                    toolsToggle.setAttribute('aria-expanded', 'false');
                    toolsToggle.setAttribute('aria-label', 'Open reading settings');
                }
            });
        }

        const installBtn = document.getElementById('installBtn');
        function isInstalled() {
            return window.matchMedia && window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        }
        function isIosDevice() {
            return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        }
        if (installBtn && !isInstalled() && isIosDevice()) installBtn.hidden = false;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredInstallPrompt = e;
            if (installBtn && !isInstalled()) installBtn.hidden = false;
        });
        if (installBtn) installBtn.addEventListener('click', async () => {
            if (!deferredInstallPrompt) {
                if (isIosDevice()) toast('To install on iPhone or iPad: open this site in Safari, tap Share, then Add to Home Screen.');
                else toast('Use your browser menu and choose Install app to add EM Pocket to your device.');
                return;
            }
            deferredInstallPrompt.prompt();
            try { await deferredInstallPrompt.userChoice; } catch (e) {}
            deferredInstallPrompt = null;
            installBtn.hidden = true;
        });
        window.addEventListener('appinstalled', () => {
            deferredInstallPrompt = null;
            if (installBtn) installBtn.hidden = true;
            toast('EM Pocket is installed and ready for offline use.');
        });
        window.addEventListener('offline', () => toast('You’re offline — saved EM Pocket content remains available.'));
        window.addEventListener('online', () => toast('You’re back online.'));

        const input = document.getElementById('searchInput');
        const clearBtn = document.getElementById('searchClearBtn');
        input.addEventListener('input', () => runSearch(input.value.trim()));
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                input.value = '';
                runSearch('');
                input.focus();
            });
        }
        input.addEventListener('keydown', (e) => {
            const pop = document.querySelector('.results-pop');
            const items = pop ? pop.querySelectorAll('.res-item[data-id]') : [];
            if (e.key === 'Escape') {
                input.value = '';
                if (clearBtn) clearBtn.hidden = true;
                input.blur();
                hideSearchResults(pop);
                return;
            }
            if (pop && pop.style.display === 'block' && items.length) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    searchCursor = Math.min(items.length - 1, searchCursor + 1);
                    paintSearchCursor(pop);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    searchCursor = Math.max(0, searchCursor - 1);
                    paintSearchCursor(pop);
                } else if (e.key === 'Enter' && searchCursor >= 0) {
                    e.preventDefault();
                    const selected = items[searchCursor];
                    hideSearchResults(pop);
                    openSearchHit(selected.dataset.id, selected.dataset.target);
                }
            }
        });

        document.getElementById('printBtn').addEventListener('click', () => {
            const route = (location.hash || '').replace('#', '').split('~')[0];
            if (currentId || route === ECG_TOPIC_ID) window.print();
            else toast('Open a presentation or the ECG guide first, then export it as PDF.');
        });

        document.addEventListener('keydown', (e) => {
            if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
            const tag = (e.target && e.target.tagName) || '';
            const overlay = document.getElementById('disclaimerOverlay');
            const sidebar = document.getElementById('sidebar');
            if (overlay && !overlay.hidden) return;
            if (document.getElementById('ecgWorkbench') || document.getElementById('ecgLightbox')) return;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
            if (sidebarIsMobile() && sidebar.classList.contains('open') && e.key !== 'Escape') return;
            if (e.key === '/') { e.preventDefault(); input.focus(); }
            if (e.key === 'Escape') {
                const pop = document.querySelector('.results-pop');
                const tools = document.getElementById('topbarTools');
                if (pop && pop.style.display === 'block') {
                    hideSearchResults(pop);
                    input.value = '';
                    if (clearBtn) clearBtn.hidden = true;
                    input.focus();
                    return;
                }
                if (tools && tools.classList.contains('open')) {
                    tools.classList.remove('open');
                    document.body.classList.remove('tools-open');
                    toolsToggle.setAttribute('aria-expanded', 'false');
                    toolsToggle.setAttribute('aria-label', 'Open reading settings');
                    toolsToggle.focus();
                    return;
                }
                closeSidebar(true);
                return;
            }
            if (e.key === 'h' || e.key === 'H') { e.preventDefault(); showHome(); }
            if (e.key === 's' || e.key === 'S') { e.preventDefault(); showStudy('due'); }
            if (e.key === 'v' || e.key === 'V') { e.preventDefault(); showShift(currentId); }
            if ((e.key === 'e' || e.key === 'E') && getEcg()) { e.preventDefault(); showEcg(); }
            const routeName = (location.hash || '').replace('#', '').split('~')[0];
            if (routeName === ECG_TOPIC_ID && (e.key === '[' || e.key === ']')) {
                const ecg = getEcg();
                if (ecg && ecg.steps.length) {
                    const t = (location.hash || '').replace('#', '').split('~')[1] || '';
                    let idx = ecg.steps.findIndex(function (s) { return s.id === t || ('step-' + s.id) === t; });
                    if (e.key === ']') idx = idx < 0 ? 0 : Math.min(ecg.steps.length - 1, idx + 1);
                    else idx = idx < 0 ? 0 : Math.max(0, idx - 1);
                    showEcg('step-' + ecg.steps[idx].id);
                }
            } else if (currentId && routeName !== 'shift' && (e.key === '[' || e.key === ']')) {
                const ids = orderedIds();
                const i = ids.indexOf(currentId);
                if (e.key === '[' && i > 0) showPresentation(ids[i - 1]);
                if (e.key === ']' && i < ids.length - 1) showPresentation(ids[i + 1]);
            }
        });

        window.addEventListener('hashchange', () => applyRoute());
        applyRoute();

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                const hadController = !!navigator.serviceWorker.controller;
                navigator.serviceWorker.register('./sw.js?v=20260910-verified-r4').then((registration) => {
                    navigator.serviceWorker.ready.then(() => setOfflineStatus('Works offline'));
                    if (registration.waiting) toast('An updated offline bundle is ready. Refresh when convenient.');
                    registration.addEventListener('updatefound', () => {
                        const worker = registration.installing;
                        if (worker) worker.addEventListener('statechange', () => {
                            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                                toast('An updated offline bundle is ready. Refresh when convenient.');
                            }
                            if (worker.state === 'redundant' && !navigator.serviceWorker.controller) {
                                setOfflineStatus('Online only');
                                toast('Offline setup could not be completed. The app remains available online.');
                            }
                        });
                    });
                    navigator.serviceWorker.addEventListener('controllerchange', () => {
                        setOfflineStatus('Works offline');
                        if (hadController) toast('Offline content updated. Refresh to use the latest interface.');
                    }, { once: true });
                }).catch(function () {
                    setOfflineStatus('Online only');
                    toast('Offline setup could not be completed. The app remains available online.');
                });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
