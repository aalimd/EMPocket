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
    const SEV_LABEL = { critical: 'Critical', emergent: 'Emergent', common: 'Common' };
    /* Locally embedded Material Symbols Rounded, Apache-2.0. Refresh with dev/refresh-icons.py. */
    function monoSvg(inner) {
        return '<svg class="mono-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor" stroke="none">' + inner + '</svg>';
    }
    const GROUP_SVG = {
        generic: monoSvg('<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M680-320q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-440q0-17-11.5-28.5T680-480q-17 0-28.5 11.5T640-440q0 17 11.5 28.5T680-400ZM480-40q-17 0-28.5-11.5T440-80v-76q0-21 10-39.5t28-29.5q32-19 54-26.5t59-13.5q12-2 24 .5t20 11.5l45 53 44-53q8-10 20-12t24 0q37 6 59 13.5t54 26.5q18 11 28.5 29.5T920-156v76q0 17-11.5 28.5T880-40H480Zm39-80h123l-54-66q-18 5-35 13t-34 17v36Zm199 0h122v-36q-16-10-33-17.5T772-186l-54 66Zm-76 0Zm76 0Zm-38-320ZM200-200v-560 137-17 440Zm0 80q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v200q-16-20-35-38t-45-24v-138H200v560h166q-3 11-4.5 22t-1.5 22v36H200Zm120-480h240q26-20 57-30t63-10q0-17-11.5-28.5T640-680H320q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm0 160h160q0-21 4.5-41t12.5-39H320q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0 160h98q11-9 23.5-16t25.5-13v-11q0-16-8.5-28T427-360H320q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280Z"/></g>'),
        ecg: monoSvg('<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M80-720q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v80q0 17-11.5 28.5T840-600q-17 0-28.5-11.5T800-640v-80H160v80q0 17-11.5 28.5T120-600q-17 0-28.5-11.5T80-640v-80Zm80 560q-33 0-56.5-23.5T80-240v-80q0-17 11.5-28.5T120-360q17 0 28.5 11.5T160-320v80h640v-80q0-17 11.5-28.5T840-360q17 0 28.5 11.5T880-320v80q0 33-23.5 56.5T800-160H160Zm240-120q11 0 21-5.5t15-16.5l124-248 44 88q5 11 15 16.5t21 5.5h200q17 0 28.5-11.5T880-480q0-17-11.5-28.5T840-520H665l-69-138q-5-11-15-15.5t-21-4.5q-11 0-21 4.5T524-658L400-410l-44-88q-5-11-15-16.5t-21-5.5H120q-17 0-28.5 11.5T80-480q0 17 11.5 28.5T120-440h175l69 138q5 11 15 16.5t21 5.5Zm80-200Z"/></g>'),
        home: monoSvg('<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M440-400h80q17 0 28.5-11.5T560-440q0-17-11.5-28.5T520-480h-80q-17 0-28.5 11.5T400-440q0 17 11.5 28.5T440-400Zm0-120h240q17 0 28.5-11.5T720-560q0-17-11.5-28.5T680-600H440q-17 0-28.5 11.5T400-560q0 17 11.5 28.5T440-520Zm0-120h240q17 0 28.5-11.5T720-680q0-17-11.5-28.5T680-720H440q-17 0-28.5 11.5T400-680q0 17 11.5 28.5T440-640ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-520q0-17 11.5-28.5T120-720q17 0 28.5 11.5T160-680v520h520q17 0 28.5 11.5T720-120q0 17-11.5 28.5T680-80H160Zm160-720v480-480Z"/></g>'),
        bolt: monoSvg('<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="m422-232 207-248H469l29-227-185 267h139l-30 208Zm-62-128H236q-24 0-35.5-21.5T203-423l299-430q10-14 26-19.5t33 .5q17 6 25 21t6 32l-32 259h155q26 0 36.5 23t-6.5 43L416-100q-11 13-27 17t-31-3q-15-7-23.5-21.5T328-139l32-221Zm111-110Z"/></g>'),
        learn: monoSvg('<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 97q-14 0-26.5-3.5T430-194q-39-23-82-34.5T260-240q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-45 0-88 11.5T530-194q-11 6-23.5 9.5T480-181ZM280-494Zm280-115q0-9 6.5-18.5T581-640q29-10 58-15t61-5q20 0 39.5 2.5T778-651q9 2 15.5 10t6.5 18q0 17-11 25t-28 4q-14-3-29.5-4.5T700-600q-26 0-51 5t-48 13q-18 7-29.5-1T560-609Zm0 220q0-9 6.5-18.5T581-420q29-10 58-15t61-5q20 0 39.5 2.5T778-431q9 2 15.5 10t6.5 18q0 17-11 25t-28 4q-14-3-29.5-4.5T700-380q-26 0-51 4.5T601-363q-18 7-29.5-.5T560-389Zm0-110q0-9 6.5-18.5T581-530q29-10 58-15t61-5q20 0 39.5 2.5T778-541q9 2 15.5 10t6.5 18q0 17-11 25t-28 4q-14-3-29.5-4.5T700-490q-26 0-51 5t-48 13q-18 7-29.5-1T560-499Z"/></g>')
    };
    const THEME_SVG = {
        moon: monoSvg('<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-120q-151 0-255.5-104.5T120-480q0-138 90-239.5T440-838q13-2 23 3.5t16 14.5q6 9 6.5 21t-7.5 23q-17 26-25.5 55t-8.5 61q0 90 63 153t153 63q31 0 61.5-9t54.5-25q11-7 22.5-6.5T819-479q10 5 15.5 15t3.5 24q-14 138-117.5 229T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></g>'),
        sun: monoSvg('<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM80-440q-17 0-28.5-11.5T40-480q0-17 11.5-28.5T80-520h80q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440H80Zm720 0q-17 0-28.5-11.5T760-480q0-17 11.5-28.5T800-520h80q17 0 28.5 11.5T920-480q0 17-11.5 28.5T880-440h-80ZM480-760q-17 0-28.5-11.5T440-800v-80q0-17 11.5-28.5T480-920q17 0 28.5 11.5T520-880v80q0 17-11.5 28.5T480-760Zm0 720q-17 0-28.5-11.5T440-80v-80q0-17 11.5-28.5T480-200q17 0 28.5 11.5T520-160v80q0 17-11.5 28.5T480-40ZM226-678l-43-42q-12-11-11.5-28t11.5-29q12-12 29-12t28 12l42 43q11 12 11 28t-11 28q-11 12-27.5 11.5T226-678Zm494 495-42-43q-11-12-11-28.5t11-27.5q11-12 27.5-11.5T734-282l43 42q12 11 11.5 28T777-183q-12 12-29 12t-28-12Zm-42-495q-12-11-11.5-27.5T678-734l42-43q11-12 28-11.5t29 11.5q12 12 12 29t-12 28l-43 42q-12 11-28 11t-28-11ZM183-183q-12-12-12-29t12-28l43-42q12-11 28.5-11t27.5 11q12 11 11.5 27.5T282-226l-42 43q-11 12-28 11.5T183-183Zm297-297Z"/></g>')
    };
    const STAR_SVG = {
        outline: '<svg class="save-ico bookmark-ico" data-icon="bookmark" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" fill="currentColor" stroke="none"><g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="m480-240-168 72q-40 17-76-6.5T200-241v-519q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v519q0 43-36 66.5t-76 6.5l-168-72Zm0-88 200 86v-518H280v518l200-86Zm0-432H280h400-200Z"/></g></svg>',
        filled: '<svg class="save-ico bookmark-ico filled" data-icon="bookmark_fill1" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" fill="currentColor" stroke="none"><g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="m480-240-168 72q-40 17-76-6.5T200-241v-519q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v519q0 43-36 66.5t-76 6.5l-168-72Z"/></g></svg>'
    };
    function saveButtonContent(saved) {
        return (saved ? STAR_SVG.filled : STAR_SVG.outline) + '<span>' + (saved ? 'Saved topic' : 'Save topic') + '</span>';
    }
    const CHEVRON_BACK_SVG = '<svg class="ios-back-ico" data-icon="chevron_left" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" fill="currentColor" stroke="none"><g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="m432-480 156 156q11 11 11 28t-11 28q-11 11-28 11t-28-11L348-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 28-11t28 11q11 11 11 28t-11 28L432-480Z"/></g></svg>';
    function backButtonHtml(extraAttr, label) {
        const text = label || ('Back to ' + backDestination().label);
        return '<button type="button" class="back-btn ios-nav-back"' + (extraAttr ? ' ' + extraAttr : '') + '>' + CHEVRON_BACK_SVG + '<span>' + esc(text) + '</span></button>';
    }

    /* One 24 px optical family for clinical topics, framework sections and controls. */
    function semanticSvg(pathMarkup, cls, extraAttr) {
        return '<svg class="ui-icon' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor" stroke="none"' + (extraAttr ? ' ' + extraAttr : '') + '>' + pathMarkup + '</svg>';
    }

    const SEMANTIC_ICONS = {
        'cardio': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-756q34-40 81-62t99-22q88 0 149.5 56T879-640q1 17-10.5 28.5T840-599q-17 1-28.5-10.5T799-638q-6-54-44.5-88T660-760q-40 0-75.5 20T529-688q-9 14-22.5 21t-27.5 7q-14 0-27-7t-21-21q-20-32-55.5-52T300-760q-56 0-94.5 34T161-638q-1 17-12.5 28.5T120-599q-17-1-28.5-12.5T81-640q8-88 69.5-144T300-840q52 0 99 22t81 62Zm0 623q-14 0-28-5t-25-16q-43-38-79.5-72.5T279-292q-14-14-12.5-29.5T279-348q11-11 26.5-12.5T335-349q30 29 65.5 62.5T480-214q44-39 79.5-72.5T625-349q14-14 29.5-11.5T681-347q11 11 12 27t-13 30q-32 30-68.5 64T533-154q-11 11-25 16t-28 5Zm-38-187q13 0 22.5-7.5T478-347l54-163 35 52q5 8 14 13t19 5h280q17 0 28.5-11.5T920-480q0-17-11.5-28.5T880-520H623l-69-102q-6-9-15.5-13.5T518-640q-13 0-22.5 7.5T482-613l-54 162-34-51q-5-8-14-13t-19-5H80q-17 0-28.5 11.5T40-480q0 17 11.5 28.5T80-440h257l69 102q6 9 15.5 13.5T442-320Zm38-167Z"/></g>',
        'pulm': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="m480-504-75 76q-12 12-28.5 12T348-428q-12-12-12-28.5t12-28.5l92-91v-264q0-17 11.5-28.5T480-880q17 0 28.5 11.5T520-840v264l92 91q12 12 12 28.5T612-428q-12 12-28.5 12T555-428l-75-76ZM200-120q-51 0-85.5-34.5T80-240v-153q0-8 1.5-14.5T85-421l100-267q12-33 42-52.5t65-19.5q45 0 76.5 32.5T400-649v29q0 17-11.5 28.5T360-580q-17 0-28.5-11.5T320-620v-29q0-13-9-22t-21-9q-10 0-18.5 5.5T260-660L160-392v152q0 17 11.5 28.5T200-200h120q17 0 28.5-11.5T360-240v-40q0-17 11.5-28.5T400-320q17 0 28.5 11.5T440-280v40q0 51-35 85.5T320-120H200Zm559 0H639q-50 0-85-34.5T519-240v-40q0-17 11.5-28.5T559-320q17 0 28.5 11.5T599-280v40q0 17 11.5 28.5T639-200h120q17 0 28.5-11.5T799-240v-152L699-660q-4-9-12-14.5t-18-5.5q-13 0-21.5 9t-8.5 22v29q0 17-11.5 28.5T599-580q-17 0-28.5-11.5T559-620v-29q0-46 31.5-78.5T667-760q35 0 64.5 19.5T774-688l100 267q2 7 3.5 13.5T879-393v153q0 51-35 85.5T759-120ZM348-428Zm264 0Z"/></g>',
        'vascular': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M80-640v-80q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v180q0 17-11.5 28.5T840-500q-17 0-28.5-11.5T800-540v-180H160v80q0 17-11.5 28.5T120-600q-17 0-28.5-11.5T80-640Zm200 360q-11 0-21-5.5T244-302l-68-138h-55q-17 0-28.5-11.5T81-480q0-17 11.5-28.5T121-520h80q11 0 20.5 6t14.5 16l44 88 124-248q5-10 15-15t21-5q11 0 21 5t15 15l67 134q-18 11-34.5 23T478-474l-38-76-124 248q-5 11-15 16.5t-21 5.5ZM160-160q-33 0-56.5-23.5T80-240v-80q0-17 11.5-28.5T120-360q17 0 28.5 11.5T160-320v80h215q17 0 28.5 11.5T415-200q0 17-11.5 28.5T375-160H160Zm320-320ZM680-80q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80Zm85-257q6-6 6-14t-6-14q-6-6-14-6t-14 6l-63 62q-6 6-6 14.5t6 14.5q6 6 14.5 6t14.5-6l62-63Z"/></g>',
        'critical': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M410-190v-168l-146 84q-25 14-53 7t-42-33q-14-25-7-53t32-42l146-85-146-84q-25-14-32-42.5t7-53.5q14-25 42-32t53 7l146 84v-169q0-29 20.5-49.5T480-840q29 0 49.5 20.5T550-770v169l146-84q25-14 53-7t42 32q14 25 6.5 53.5T765-564l-145 84 146 85q25 14 32 42t-7 54q-14 25-42 32t-53-7l-146-84v168q0 29-20.5 49.5T480-120q-29 0-49.5-20.5T410-190Z"/></g>',
        'neuro': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M390-120q-51 0-88-35.5T260-241q-60-8-100-53t-40-106q0-21 5.5-41.5T142-480q-11-18-16.5-38t-5.5-42q0-61 40-105.5t99-52.5q3-51 41-86.5t90-35.5q26 0 48.5 10t41.5 27q18-17 41-27t49-10q52 0 89.5 35t40.5 86q59 8 99.5 53T840-560q0 22-5.5 42T818-480q11 18 16.5 38.5T840-400q0 62-40.5 106.5T699-241q-5 50-41.5 85.5T570-120q-25 0-48.5-9.5T480-156q-19 17-42 26.5t-48 9.5Zm130-590v460q0 21 14.5 35.5T570-200q20 0 34.5-16t15.5-36q-21-8-38.5-21.5T550-306q-10-14-7.5-30t16.5-26q14-10 30-7.5t26 16.5q11 16 28 24.5t37 8.5q33 0 56.5-23.5T760-400q0-5-.5-10t-2.5-10q-17 10-36.5 15t-40.5 5q-17 0-28.5-11.5T640-440q0-17 11.5-28.5T680-480q33 0 56.5-23.5T760-560q0-33-23.5-56T680-640q-11 18-28.5 31.5T613-587q-16 6-31-1t-20-23q-5-16 1.5-31t22.5-20q15-5 24.5-18t9.5-30q0-21-14.5-35.5T570-760q-21 0-35.5 14.5T520-710Zm-80 460v-460q0-21-14.5-35.5T390-760q-21 0-35.5 14.5T340-710q0 16 9 29.5t24 18.5q16 5 23 20t2 31q-6 16-21 23t-31 1q-21-8-38.5-21.5T279-640q-32 1-55.5 24.5T200-560q0 33 23.5 56.5T280-480q17 0 28.5 11.5T320-440q0 17-11.5 28.5T280-400q-21 0-40.5-5T203-420q-2 5-2.5 10t-.5 10q0 33 23.5 56.5T280-320q20 0 37-8.5t28-24.5q10-14 26-16.5t30 7.5q14 10 16.5 26t-7.5 30q-14 19-32 33t-39 22q1 20 16 35.5t35 15.5q21 0 35.5-14.5T440-250Zm40-230Z"/></g>',
        'gi': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M120-320q0-50 35-85t85-35h80q50 0 85-35t35-85q0-17-11.5-28.5T400-600q-33 0-56.5-23.5T320-680v-160q0-17 11.5-28.5T360-880q17 0 28.5 11.5T400-840v160q50 0 85 35t35 85q0 83-58.5 141.5T320-360h-80q-17 0-28.5 11.5T200-320v200q0 17-11.5 28.5T160-80q-17 0-28.5-11.5T120-120v-200Zm160 160q0-50 35-85t85-35h160q83 0 141.5-58.5T760-480v-40q0-83-58.5-141.5T560-720q-33 0-56.5-23.5T480-800v-40q0-17 11.5-28.5T520-880q17 0 28.5 11.5T560-840v40q117 0 198.5 81.5T840-520v40q0 117-81.5 198.5T560-200H400q-17 0-28.5 11.5T360-160v40q0 17-11.5 28.5T320-80q-17 0-28.5-11.5T280-120v-40Zm-80 80v-240q0-17 11.5-28.5T240-360h80q83 0 141.5-58.5T520-560q0-50-35-85t-85-35v-200 200q50 0 85 35t35 85q0 83-58.5 141.5T320-360h-80q-17 0-28.5 11.5T200-320v240Z"/></g>',
        'gu': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M440-120v40q0 17-11.5 28.5T400-40q-17 0-28.5-11.5T360-80v-41q-25-5-43-22.5T294-187l-13-80q-6-37 18-65t61-28v-47q-10 4-19.5 5.5T320-400q-100 0-170-70T80-640v-40q0-100 70-170t170-70q50 0 85 35t35 85q0 50-35 85t-85 35h-40q-17 0-28.5-11.5T240-720q0-17 11.5-28.5T280-760h40q17 0 28.5-11.5T360-800q0-17-11.5-28.5T320-840q-66 0-113 47t-47 113v40q0 66 47 113t113 47q17 0 28.5-11.5T360-520q0-17-11.5-28.5T320-560h-40q-17 0-28.5-11.5T240-600q0-17 11.5-28.5T280-640h40q50 0 85 35t35 85v160h80v-160q0-50 35-85t85-35h40q17 0 28.5 11.5T720-600q0 17-11.5 28.5T680-560h-40q-17 0-28.5 11.5T600-520q0 17 11.5 28.5T640-480q66 0 113-47t47-113v-40q0-66-47-113t-113-47q-17 0-28.5 11.5T600-800q0 17 11.5 28.5T640-760h40q17 0 28.5 11.5T720-720q0 17-11.5 28.5T680-680h-40q-50 0-85-35t-35-85q0-50 35-85t85-35q100 0 170 70t70 170v40q0 100-70 170t-170 70q-11 0-20.5-1.5T600-407v47q37 0 61 28t18 65l-13 80q-5 26-23 43.5T600-121v41q0 17-11.5 28.5T560-40q-17 0-28.5-11.5T520-80v-40h-80Zm-80-160 13 80h214l13-80H360Zm0 0 13 80-13-80Z"/></g>',
        'msk': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-72q-46 0-115.5-14T264-115q-11-5-17.5-15t-6.5-22v-40h-40q-17 0-28.5-11.5T160-232v-60q0-17 11.5-28.5T200-332h40v-80h-40q-17 0-28.5-11.5T160-452v-60q0-17 11.5-28.5T200-552h40v-80h-40q-17 0-28.5-11.5T160-672v-60q0-17 11.5-28.5T200-772h40v-60q0-22 18-33t38-3q1 0 55 18t129 18q75 0 129-18t55-18q20-8 38 3.5t18 32.5v60h40q17 0 28.5 11.5T800-732v60q0 17-11.5 28.5T760-632h-40v80h40q17 0 28.5 11.5T800-512v60q0 17-11.5 28.5T760-412h-40v80h40q17 0 28.5 11.5T800-292v60q0 17-11.5 28.5T760-192h-40v40q0 12-6.5 22T696-115q-31 15-100.5 29T480-72Zm0-534q38 0 80.5-7t79.5-20v-143q-38 11-79.5 17.5T480-752q-38 0-79.5-6.5T320-776v143q36 13 79 20t81 7Zm0 228q37 0 79.5-7t80.5-21v-144q-44 12-83.5 18t-76.5 6q-39 0-80-6t-80-18v144q38 14 80.5 21t79.5 7Zm0 226q38 0 80.5-7t79.5-20v-143q-38 11-79.5 17.5T480-298q-38 0-79.5-6.5T320-322v143q36 13 79 20t81 7Z"/></g>',
        'airway': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-480ZM80-640v-80q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v180q0 17-11.5 28.5T840-500q-17 0-28.5-11.5T800-540v-180H160v80q0 17-11.5 28.5T120-600q-17 0-28.5-11.5T80-640Zm80 480q-33 0-56.5-23.5T80-240v-80q0-17 11.5-28.5T120-360q17 0 28.5 11.5T160-320v80h180q17 0 28.5 11.5T380-200q0 17-11.5 28.5T340-160H160Zm120-120q-11 0-21-5.5T244-302l-68-138h-55q-17 0-28.5-11.5T81-480q0-17 11.5-28.5T121-520h80q11 0 20.5 6t14.5 16l44 88 124-248q5-10 15-15t21-5q11 0 21 5t15 15l79 159q-21 2-39.5 9T481-470l-41-80-124 248q-5 11-15 16.5t-21 5.5ZM500-40q-25 0-42.5-17.5T440-100v-132q0-8 1.5-15t3.5-14l48-127q9-23 29.5-37.5T568-440h72v-40q0-17 11.5-28.5T680-520q17 0 28.5 11.5T720-480v40h72q25 0 45.5 14.5T867-388l48 127q2 7 3.5 14t1.5 15v132q0 25-17.5 42.5T860-40h-80q-25 0-42.5-17.5T720-100v-20q0-17 11.5-28.5T760-160q17 0 28.5 11.5T800-120h40v-113l-48-127h-72v37l38 39q11 12 11 28.5T758-228q-11 11-28 11t-28-11l-22-22-22 22q-11 11-27.5 11.5T602-228q-11-11-11-28t11-28l38-39v-37h-72l-48 127v113h40q0-17 11.5-28.5T600-160q17 0 28.5 11.5T640-120v20q0 25-17.5 42.5T580-40h-80Zm180-200Zm-78-44 38-39v-37 37l-38 39Zm156 0-38-39v-37 37l38 39Z"/></g>',
        'ent': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M469-320h91q17 0 28.5-11.5T600-360q0-17-11.5-28.5T560-400h-83l5-44q2-15 13-25.5t26-10.5h119q17 0 28.5-11.5T680-520q0-17-11.5-28.5T640-560H522q-47 0-81 31t-39 77l-34 328q-2 17 10 30.5T408-80q15 0 26.5-10.5T448-116l21-204Zm-229 68q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v40q0 17-11.5 28.5T560-80q-17 0-28.5-11.5T520-120v-80q0-17 11.5-28.5T560-240h120v-160q0-17 11.5-28.5T720-440h68l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v168q0 17-11.5 28.5T280-80q-17 0-28.5-11.5T240-120v-132Zm254-188Z"/></g>',
        'derm': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M120-120q-17 0-28.5-11.5T80-160v-320q0-33 23.5-56.5T160-560h160q8 0 15.5 3t13 8.5q5.5 5.5 8.5 13t3 15.5v40q0 50 35 85t85 35q50 0 85-35t35-85v-40q0-8 3-15.5t8.5-13q5.5-5.5 13-8.5t15.5-3h160q33 0 56.5 23.5T880-480v320q0 17-11.5 28.5T840-120H120Zm40-80h640v-280H680q0 83-58.5 141.5T480-280q-83 0-141.5-58.5T280-480H160v280Zm320-240q-17 0-28.5-11.5T440-480q0-109 25-215t109-175q13-11 29-9.5t27 14.5q11 13 9.5 29T625-809q-70 59-87.5 148T520-480q0 17-11.5 28.5T480-440ZM230-340q13 0 21.5-8.5T260-370q0-13-8.5-21.5T230-400q-13 0-21.5 8.5T200-370q0 13 8.5 21.5T230-340Zm40 100q13 0 21.5-8.5T300-270q0-13-8.5-21.5T270-300q-13 0-21.5 8.5T240-270q0 13 8.5 21.5T270-240Zm460-100q13 0 21.5-8.5T760-370q0-13-8.5-21.5T730-400q-13 0-21.5 8.5T700-370q0 13 8.5 21.5T730-340ZM160-200h640-640Z"/></g>',
        'peds': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M580-490q-21 0-35.5-14.5T530-540q0-21 14.5-35.5T580-590q21 0 35.5 14.5T630-540q0 21-14.5 35.5T580-490Zm-200 0q-21 0-35.5-14.5T330-540q0-21 14.5-35.5T380-590q21 0 35.5 14.5T430-540q0 21-14.5 35.5T380-490Zm100 210q-60 0-108.5-33T300-400h360q-23 54-71.5 87T480-280Zm0 160q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82h-12q-6 0-12 2-6 6-8 13t-2 15q0 21 14.5 35.5T496-680q9 0 16.5-3t15.5-3q12 0 20 9t8 21q0 23-21.5 29.5T496-620q-45 0-77.5-32.5T386-730v-6q0-3 1-8-83 30-135 101t-52 163q0 116 82 198t198 82Zm0-280Z"/></g>',
        'toxic': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M345-120q-94 0-159.5-65.5T120-345q0-45 17-86t49-73l270-270q32-32 73-49t86-17q94 0 159.5 65.5T840-615q0 45-17 86t-49 73L504-186q-32 32-73 49t-86 17Zm266-286 107-106q20-20 31-47t11-56q0-60-42.5-102.5T615-760q-29 0-56 11t-47 31L406-611l205 205ZM345-200q29 0 56-11t47-31l106-107-205-205-107 106q-20 20-31 47t-11 56q0 60 42.5 102.5T345-200Z"/></g>',
        'psych': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="m434-410 4 32q1 8 6.5 13t13.5 5h44q8 0 13.5-5t6.5-13l4-32q8-3 14.5-7t11.5-9l30 13q7 3 14 1t11-9l22-38q4-7 2.5-14t-7.5-12l-26-19q2-8 2-16t-2-16l26-19q6-5 7.5-12t-2.5-14l-22-38q-4-7-11-9t-14 1l-30 13q-5-5-11.5-9t-14.5-7l-4-32q-1-8-6.5-13t-13.5-5h-44q-8 0-13.5 5t-6.5 13l-4 32q-8 3-14.5 7t-11.5 9l-30-13q-7-3-14-1t-11 9l-22 38q-4 7-2.5 14t7.5 12l26 19q-2 8-2 16t2 16l-26 19q-6 5-7.5 12t2.5 14l22 38q4 7 11 9t14-1l30-13q5 5 11.5 9t14.5 7Zm46-50q-25 0-42.5-17.5T420-520q0-25 17.5-42.5T480-580q25 0 42.5 17.5T540-520q0 25-17.5 42.5T480-460ZM240-252q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v40q0 17-11.5 28.5T560-80q-17 0-28.5-11.5T520-120v-80q0-17 11.5-28.5T560-240h120v-160q0-17 11.5-28.5T720-440h68l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v168q0 17-11.5 28.5T280-80q-17 0-28.5-11.5T240-120v-132Zm254-188Z"/></g>',
        'endocrine': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M400-280q17 0 28.5-11.5T440-320q0-45-21.5-82.5T360-462v142q0 17 11.5 28.5T400-280Zm160 0q17 0 28.5-11.5T600-320v-142q-37 22-58.5 59.5T520-320q0 17 11.5 28.5T560-280Zm-400-46v-418q-18-20-33.5-42T98-833q-7-14 0-27.5t22-19.5q15-6 30-1t23 19q47 84 128.5 133T480-680q95 0 174.5-47T782-854q10-16 25.5-24.5T840-880q16 7 21 23t-3 31q-12 23-26.5 43T800-744v418q0 35 16.5 64.5T862-213q13 8 18 23t0 30q-5 16-18.5 23.5t-27.5.5q-53-28-83.5-78.5T720-326v-348q-53 35-113.5 54.5T480-600q-66 0-127-19.5T240-674v348q0 61-31 111.5T125-136q-14 7-27-.5T80-160q-5-15 0-30t18-23q29-18 45.5-48t16.5-65Zm240 126q-50 0-85-35t-35-85v-213q0-15 11.5-24t25.5-5l17 4q46 11 83.5 38.5T480-454q25-38 62.5-65.5T626-558l17-4q14-4 25.5 5t11.5 24v213q0 50-35 85t-85 35q-23 0-43.5-8.5T480-231q-16 14-36.5 22.5T400-200Zm160-120Zm-160 0Z"/></g>',
        'environ': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-80q-83 0-141.5-58.5T280-280q0-48 21-89.5t59-70.5v-320q0-50 35-85t85-35q50 0 85 35t35 85v320q38 29 59 70.5t21 89.5q0 83-58.5 141.5T480-80Zm-40-440h80v-40h-40v-40h40v-80h-40v-40h40v-40q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240Z"/></g>',
        'trauma': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M410-190v-168l-146 84q-25 14-53 7t-42-33q-14-25-7-53t32-42l146-85-146-84q-25-14-32-42.5t7-53.5q14-25 42-32t53 7l146 84v-169q0-29 20.5-49.5T480-840q29 0 49.5 20.5T550-770v169l146-84q25-14 53-7t42 32q14 25 6.5 53.5T765-564l-145 84 146 85q25 14 32 42t-7 54q-14 25-42 32t-53-7l-146-84v168q0 29-20.5 49.5T480-120q-29 0-49.5-20.5T410-190Z"/></g>',
        'obgyn': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M400-120v-160h-40q-17 0-28.5-11.5T320-320v-240q0-50 35-85t85-35q50 0 85 35t35 85q36 15 58 48t22 72v120q0 17-11.5 28.5T600-280h-80v160q0 17-11.5 28.5T480-80h-40q-17 0-28.5-11.5T400-120Zm40-600q-33 0-56.5-23.5T360-800q0-33 23.5-56.5T440-880q33 0 56.5 23.5T520-800q0 33-23.5 56.5T440-720Z"/></g>',
        'infect': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-120q-83 0-141.5-58.5T280-320q0-48 21-89.5t59-70.5v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q38 29 59 70.5t21 89.5q0 83-58.5 141.5T480-120Zm0-80q50 0 85-35t35-85q0-29-12.5-54T552-416l-32-24v-280q0-17-11.5-28.5T480-760q-17 0-28.5 11.5T440-720v280l-32 24q-23 17-35.5 42T360-320q0 50 35 85t85 35Zm0-120Z"/></g>',
        'generic': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M680-320q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-440q0-17-11.5-28.5T680-480q-17 0-28.5 11.5T640-440q0 17 11.5 28.5T680-400ZM480-40q-17 0-28.5-11.5T440-80v-76q0-21 10-39.5t28-29.5q32-19 54-26.5t59-13.5q12-2 24 .5t20 11.5l45 53 44-53q8-10 20-12t24 0q37 6 59 13.5t54 26.5q18 11 28.5 29.5T920-156v76q0 17-11.5 28.5T880-40H480Zm39-80h123l-54-66q-18 5-35 13t-34 17v36Zm199 0h122v-36q-16-10-33-17.5T772-186l-54 66Zm-76 0Zm76 0Zm-38-320ZM200-200v-560 137-17 440Zm0 80q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v200q-16-20-35-38t-45-24v-138H200v560h166q-3 11-4.5 22t-1.5 22v36H200Zm120-480h240q26-20 57-30t63-10q0-17-11.5-28.5T640-680H320q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm0 160h160q0-21 4.5-41t12.5-39H320q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0 160h98q11-9 23.5-16t25.5-13v-11q0-16-8.5-28T427-360H320q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280Z"/></g>',
        'home': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M440-400h80q17 0 28.5-11.5T560-440q0-17-11.5-28.5T520-480h-80q-17 0-28.5 11.5T400-440q0 17 11.5 28.5T440-400Zm0-120h240q17 0 28.5-11.5T720-560q0-17-11.5-28.5T680-600H440q-17 0-28.5 11.5T400-560q0 17 11.5 28.5T440-520Zm0-120h240q17 0 28.5-11.5T720-680q0-17-11.5-28.5T680-720H440q-17 0-28.5 11.5T400-680q0 17 11.5 28.5T440-640ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-520q0-17 11.5-28.5T120-720q17 0 28.5 11.5T160-680v520h520q17 0 28.5 11.5T720-120q0 17-11.5 28.5T680-80H160Zm160-720v480-480Z"/></g>',
        'learn': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 97q-14 0-26.5-3.5T430-194q-39-23-82-34.5T260-240q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-45 0-88 11.5T530-194q-11 6-23.5 9.5T480-181ZM280-494Zm280-115q0-9 6.5-18.5T581-640q29-10 58-15t61-5q20 0 39.5 2.5T778-651q9 2 15.5 10t6.5 18q0 17-11 25t-28 4q-14-3-29.5-4.5T700-600q-26 0-51 5t-48 13q-18 7-29.5-1T560-609Zm0 220q0-9 6.5-18.5T581-420q29-10 58-15t61-5q20 0 39.5 2.5T778-431q9 2 15.5 10t6.5 18q0 17-11 25t-28 4q-14-3-29.5-4.5T700-380q-26 0-51 4.5T601-363q-18 7-29.5-.5T560-389Zm0-110q0-9 6.5-18.5T581-530q29-10 58-15t61-5q20 0 39.5 2.5T778-541q9 2 15.5 10t6.5 18q0 17-11 25t-28 4q-14-3-29.5-4.5T700-490q-26 0-51 5t-48 13q-18 7-29.5-1T560-499Z"/></g>',
        'ecg': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M80-720q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v80q0 17-11.5 28.5T840-600q-17 0-28.5-11.5T800-640v-80H160v80q0 17-11.5 28.5T120-600q-17 0-28.5-11.5T80-640v-80Zm80 560q-33 0-56.5-23.5T80-240v-80q0-17 11.5-28.5T120-360q17 0 28.5 11.5T160-320v80h640v-80q0-17 11.5-28.5T840-360q17 0 28.5 11.5T880-320v80q0 33-23.5 56.5T800-160H160Zm240-120q11 0 21-5.5t15-16.5l124-248 44 88q5 11 15 16.5t21 5.5h200q17 0 28.5-11.5T880-480q0-17-11.5-28.5T840-520H665l-69-138q-5-11-15-15.5t-21-4.5q-11 0-21 4.5T524-658L400-410l-44-88q-5-11-15-16.5t-21-5.5H120q-17 0-28.5 11.5T80-480q0 17 11.5 28.5T120-440h175l69 138q5 11 15 16.5t21 5.5Zm80-200Z"/></g>',
        'practice': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M560-360q17 0 29.5-12.5T602-402q0-17-12.5-29.5T560-444q-17 0-29.5 12.5T518-402q0 17 12.5 29.5T560-360Zm0-128q11 0 20.5-8t11.5-21q2-12 8.5-22t23.5-27q30-30 40-48.5t10-43.5q0-45-31.5-73.5T560-760q-33 0-60 15t-43 43q-6 10-1 21t17 16q11 5 21.5 1t17.5-14q9-13 21-19.5t27-6.5q24 0 39 13.5t15 36.5q0 14-8 26.5T578-596q-29 25-37 38.5T531-518q-1 12 7.5 21t21.5 9ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-520q0-17 11.5-28.5T120-720q17 0 28.5 11.5T160-680v520h520q17 0 28.5 11.5T720-120q0 17-11.5 28.5T680-80H160Zm160-720v480-480Z"/></g>',
        'due': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M520-496v-144q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v159q0 8 3 15.5t9 13.5l132 132q11 11 28 11t28-11q11-11 11-28t-11-28L520-496ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></g>',
        'saved': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="m480-240-168 72q-40 17-76-6.5T200-241v-519q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v519q0 43-36 66.5t-76 6.5l-168-72Zm0-88 200 86v-518H280v518l200-86Zm0-432H280h400-200Z"/></g>',
        'check': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="m382-354 339-339q12-12 28-12t28 12q12 12 12 28.5T777-636L410-268q-12 12-28 12t-28-12L182-440q-12-12-11.5-28.5T183-497q12-12 28.5-12t28.5 12l142 143Z"/></g>',
        'completed': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="m424-408-86-86q-11-11-28-11t-28 11q-11 11-11 28t11 28l114 114q12 12 28 12t28-12l226-226q11-11 11-28t-11-28q-11-11-28-11t-28 11L424-408Zm56 328q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></g>',
        'chevron-right': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z"/></g>',
        'chevron-left': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="m432-480 156 156q11 11 11 28t-11 28q-11 11-28 11t-28-11L348-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 28-11t28 11q11 11 11 28t-11 28L432-480Z"/></g>',
        'chevron-down': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-362q-8 0-15-2.5t-13-8.5L268-557q-11-11-11-28t11-28q11-11 28-11t28 11l156 156 156-156q11-11 28-11t28 11q11 11 11 28t-11 28L508-373q-6 6-13 8.5t-15 2.5Z"/></g>',
        'chest-pain': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-756q34-40 81-62t99-22q88 0 149.5 56T879-640q1 17-10.5 28.5T840-599q-17 1-28.5-10.5T799-638q-6-54-44.5-88T660-760q-40 0-75.5 20T529-688q-9 14-22.5 21t-27.5 7q-14 0-27-7t-21-21q-20-32-55.5-52T300-760q-56 0-94.5 34T161-638q-1 17-12.5 28.5T120-599q-17-1-28.5-12.5T81-640q8-88 69.5-144T300-840q52 0 99 22t81 62Zm0 623q-14 0-28-5t-25-16q-43-38-79.5-72.5T279-292q-14-14-12.5-29.5T279-348q11-11 26.5-12.5T335-349q30 29 65.5 62.5T480-214q44-39 79.5-72.5T625-349q14-14 29.5-11.5T681-347q11 11 12 27t-13 30q-32 30-68.5 64T533-154q-11 11-25 16t-28 5Zm-38-187q13 0 22.5-7.5T478-347l54-163 35 52q5 8 14 13t19 5h280q17 0 28.5-11.5T920-480q0-17-11.5-28.5T880-520H623l-69-102q-6-9-15.5-13.5T518-640q-13 0-22.5 7.5T482-613l-54 162-34-51q-5-8-14-13t-19-5H80q-17 0-28.5 11.5T40-480q0 17 11.5 28.5T80-440h257l69 102q6 9 15.5 13.5T442-320Zm38-167Z"/></g>',
        'dyspnea': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="m480-504-75 76q-12 12-28.5 12T348-428q-12-12-12-28.5t12-28.5l92-91v-264q0-17 11.5-28.5T480-880q17 0 28.5 11.5T520-840v264l92 91q12 12 12 28.5T612-428q-12 12-28.5 12T555-428l-75-76ZM200-120q-51 0-85.5-34.5T80-240v-153q0-8 1.5-14.5T85-421l100-267q12-33 42-52.5t65-19.5q45 0 76.5 32.5T400-649v29q0 17-11.5 28.5T360-580q-17 0-28.5-11.5T320-620v-29q0-13-9-22t-21-9q-10 0-18.5 5.5T260-660L160-392v152q0 17 11.5 28.5T200-200h120q17 0 28.5-11.5T360-240v-40q0-17 11.5-28.5T400-320q17 0 28.5 11.5T440-280v40q0 51-35 85.5T320-120H200Zm559 0H639q-50 0-85-34.5T519-240v-40q0-17 11.5-28.5T559-320q17 0 28.5 11.5T599-280v40q0 17 11.5 28.5T639-200h120q17 0 28.5-11.5T799-240v-152L699-660q-4-9-12-14.5t-18-5.5q-13 0-21.5 9t-8.5 22v29q0 17-11.5 28.5T599-580q-17 0-28.5-11.5T559-620v-29q0-46 31.5-78.5T667-760q35 0 64.5 19.5T774-688l100 267q2 7 3.5 13.5T879-393v153q0 51-35 85.5T759-120ZM348-428Zm264 0Z"/></g>',
        'hemoptysis': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="m480-504-75 76q-12 12-28.5 12T348-428q-12-12-12-28.5t12-28.5l92-91v-264q0-17 11.5-28.5T480-880q17 0 28.5 11.5T520-840v264l92 91q12 12 12 28.5T612-428q-12 12-28.5 12T555-428l-75-76ZM200-120q-51 0-85.5-34.5T80-240v-153q0-8 1.5-14.5T85-421l100-267q12-33 42-52.5t65-19.5q45 0 76.5 32.5T400-649v29q0 17-11.5 28.5T360-580q-17 0-28.5-11.5T320-620v-29q0-13-9-22t-21-9q-10 0-18.5 5.5T260-660L160-392v152q0 17 11.5 28.5T200-200h120q17 0 28.5-11.5T360-240v-40q0-17 11.5-28.5T400-320q17 0 28.5 11.5T440-280v40q0 51-35 85.5T320-120H200Zm559 0H639q-50 0-85-34.5T519-240v-40q0-17 11.5-28.5T559-320q17 0 28.5 11.5T599-280v40q0 17 11.5 28.5T639-200h120q17 0 28.5-11.5T799-240v-152L699-660q-4-9-12-14.5t-18-5.5q-13 0-21.5 9t-8.5 22v29q0 17-11.5 28.5T599-580q-17 0-28.5-11.5T559-620v-29q0-46 31.5-78.5T667-760q35 0 64.5 19.5T774-688l100 267q2 7 3.5 13.5T879-393v153q0 51-35 85.5T759-120ZM348-428Zm264 0Z"/></g>',
        'cyanosis': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-80q-137 0-228.5-94T160-408q0-62 28-124t70-119q42-57 91-107t91-87q8-8 18.5-11.5T480-860q11 0 21.5 3.5T520-845q42 37 91 87t91 107q42 57 70 119t28 124q0 140-91.5 234T480-80Zm0-80q104 0 172-70.5T720-408q0-73-60.5-165T480-774Q361-665 300.5-573T240-408q0 107 68 177.5T480-160Zm0-320Zm-80 240h160q17 0 28.5-11.5T600-280q0-17-11.5-28.5T560-320H400q-17 0-28.5 11.5T360-280q0 17 11.5 28.5T400-240Zm40-200v40q0 17 11.5 28.5T480-360q17 0 28.5-11.5T520-400v-40h40q17 0 28.5-11.5T600-480q0-17-11.5-28.5T560-520h-40v-40q0-17-11.5-28.5T480-600q-17 0-28.5 11.5T440-560v40h-40q-17 0-28.5 11.5T360-480q0 17 11.5 28.5T400-440h40Z"/></g>',
        'shock': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M80-640v-80q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v180q0 17-11.5 28.5T840-500q-17 0-28.5-11.5T800-540v-180H160v80q0 17-11.5 28.5T120-600q-17 0-28.5-11.5T80-640Zm200 360q-11 0-21-5.5T244-302l-68-138h-55q-17 0-28.5-11.5T81-480q0-17 11.5-28.5T121-520h80q11 0 20.5 6t14.5 16l44 88 124-248q5-10 15-15t21-5q11 0 21 5t15 15l67 134q-18 11-34.5 23T478-474l-38-76-124 248q-5 11-15 16.5t-21 5.5ZM160-160q-33 0-56.5-23.5T80-240v-80q0-17 11.5-28.5T120-360q17 0 28.5 11.5T160-320v80h215q17 0 28.5 11.5T415-200q0 17-11.5 28.5T375-160H160Zm320-320ZM680-80q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80Zm85-257q6-6 6-14t-6-14q-6-6-14-6t-14 6l-63 62q-6 6-6 14.5t6 14.5q6 6 14.5 6t14.5-6l62-63Z"/></g>',
        'palpitations': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M360-160q-19 0-34-11t-22-28l-92-241H80q-17 0-28.5-11.5T40-480q0-17 11.5-28.5T80-520h160q13 0 22.5 7t14.5 19l83 218 184-485q7-17 22-28t34-11q19 0 34 11t22 28l92 241h132q17 0 28.5 11.5T920-480q0 17-11.5 28.5T880-440H720q-13 0-22.5-7T683-466l-83-218-184 485q-7 17-22 28t-34 11Z"/></g>',
        'edema': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-80q-137 0-228.5-94T160-408q0-62 28-124t70-119q42-57 91-107t91-87q8-8 18.5-11.5T480-860q11 0 21.5 3.5T520-845q42 37 91 87t91 107q42 57 70 119t28 124q0 140-91.5 234T480-80Zm0-80q104 0 172-70.5T720-408q0-73-60.5-165T480-774Q361-665 300.5-573T240-408q0 107 68 177.5T480-160Zm0-320Zm11 280q12-1 20.5-9.5T520-230q0-14-9-22.5t-23-7.5q-41 3-87-22.5T343-375q-2-11-10.5-18t-19.5-7q-14 0-23 10.5t-6 24.5q17 91 80 130t127 35Z"/></g>',
        'limb-ischemia': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M315-240q-77 0-117-57t-38-128l-18-27q-11-17-36.5-77T80-680q0-103 51-171.5T260-920q85 0 132.5 75.5T440-680q0 58-16 107t-28 79l8 13q8 14 22 44.5t14 63.5q0 57-35.5 95T315-240ZM210-496l110-22q13-32 26.5-73t13.5-89q0-60-27.5-110T260-840q-45 0-72.5 50T160-680q0 63 17.5 111.5T210-496Zm105 176q19 0 32-14t13-39q0-17-8-35t-16-32l-96 20q0 40 17.5 70t57.5 30ZM645-40q-54 0-89.5-38T520-173q0-33 14-63.5t22-44.5l8-13q-12-30-28-79t-16-107q0-89 47.5-164.5T700-720q78 0 129 68.5T880-480q0 91-25.5 150.5T818-253l-18 28q1 71-38.5 128T645-40Zm105-256q15-24 32.5-72T800-480q0-60-27.5-110T700-640q-45 0-72.5 50T600-480q0 48 13.5 88.5T640-318l110 22ZM645-120q40 0 57.5-30t17.5-70l-96-20q-8 14-16 32t-8 35q0 20 12.5 36.5T645-120Z"/></g>',
        'headache': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M390-120q-51 0-88-35.5T260-241q-60-8-100-53t-40-106q0-21 5.5-41.5T142-480q-11-18-16.5-38t-5.5-42q0-61 40-105.5t99-52.5q3-51 41-86.5t90-35.5q26 0 48.5 10t41.5 27q18-17 41-27t49-10q52 0 89.5 35t40.5 86q59 8 99.5 53T840-560q0 22-5.5 42T818-480q11 18 16.5 38.5T840-400q0 62-40.5 106.5T699-241q-5 50-41.5 85.5T570-120q-25 0-48.5-9.5T480-156q-19 17-42 26.5t-48 9.5Zm130-590v460q0 21 14.5 35.5T570-200q20 0 34.5-16t15.5-36q-21-8-38.5-21.5T550-306q-10-14-7.5-30t16.5-26q14-10 30-7.5t26 16.5q11 16 28 24.5t37 8.5q33 0 56.5-23.5T760-400q0-5-.5-10t-2.5-10q-17 10-36.5 15t-40.5 5q-17 0-28.5-11.5T640-440q0-17 11.5-28.5T680-480q33 0 56.5-23.5T760-560q0-33-23.5-56T680-640q-11 18-28.5 31.5T613-587q-16 6-31-1t-20-23q-5-16 1.5-31t22.5-20q15-5 24.5-18t9.5-30q0-21-14.5-35.5T570-760q-21 0-35.5 14.5T520-710Zm-80 460v-460q0-21-14.5-35.5T390-760q-21 0-35.5 14.5T340-710q0 16 9 29.5t24 18.5q16 5 23 20t2 31q-6 16-21 23t-31 1q-21-8-38.5-21.5T279-640q-32 1-55.5 24.5T200-560q0 33 23.5 56.5T280-480q17 0 28.5 11.5T320-440q0 17-11.5 28.5T280-400q-21 0-40.5-5T203-420q-2 5-2.5 10t-.5 10q0 33 23.5 56.5T280-320q20 0 37-8.5t28-24.5q10-14 26-16.5t30 7.5q14 10 16.5 26t-7.5 30q-14 19-32 33t-39 22q1 20 16 35.5t35 15.5q21 0 35.5-14.5T440-250Zm40-230Z"/></g>',
        'dizziness': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M469-320h91q17 0 28.5-11.5T600-360q0-17-11.5-28.5T560-400h-83l5-44q2-15 13-25.5t26-10.5h119q17 0 28.5-11.5T680-520q0-17-11.5-28.5T640-560H522q-47 0-81 31t-39 77l-34 328q-2 17 10 30.5T408-80q15 0 26.5-10.5T448-116l21-204Zm-229 68q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v40q0 17-11.5 28.5T560-80q-17 0-28.5-11.5T520-120v-80q0-17 11.5-28.5T560-240h120v-160q0-17 11.5-28.5T720-440h68l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v168q0 17-11.5 28.5T280-80q-17 0-28.5-11.5T240-120v-132Zm254-188Z"/></g>',
        'ams': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M491-339q70 0 119-45t49-109q0-57-36.5-96.5T534-629q-47 0-79.5 30T422-525q0 19 6.5 37.5T451-455q16 14 32 11.5t26-13.5q10-11 11.5-26.5T508-512q-2-2-4-5t-2-7q0-11 9-17.5t23-6.5q20 0 33 16.5t13 39.5q0 31-25.5 52.5T492-418q-47 0-79.5-38T380-549q0-19 4.5-37t13.5-34q8-15 8-31.5T394-680q-12-12-29-11.5T339-677q-20 28-30 60t-10 67q0 88 56 149.5T491-339Zm-251 87q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v40q0 17-11.5 28.5T560-80q-17 0-28.5-11.5T520-120v-80q0-17 11.5-28.5T560-240h120v-160q0-17 11.5-28.5T720-440h68l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v168q0 17-11.5 28.5T280-80q-17 0-28.5-11.5T240-120v-132Zm254-188Z"/></g>',
        'coma': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M400-400q-17 0-28.5-11.5T360-440v-160q0-33 23.5-56.5T440-680h280q66 0 113 47t47 113v80q0 17-11.5 28.5T840-400H400Zm40-200v120-120Zm400 320H120q-17 0-28.5-11.5T80-320q0-17 11.5-28.5T120-360h720q17 0 28.5 11.5T880-320q0 17-11.5 28.5T840-280ZM200-400q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T240-520q0-17-11.5-28.5T200-560q-17 0-28.5 11.5T160-520q0 17 11.5 28.5T200-480Zm240 0h360v-40q0-33-23.5-56.5T720-600H440v120Zm-240-40Z"/></g>',
        'seizures': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M390-120q-51 0-88-35.5T260-241q-60-8-100-53t-40-106q0-21 5.5-41.5T142-480q-11-18-16.5-38t-5.5-42q0-61 40-105.5t99-52.5q3-51 41-86.5t90-35.5q26 0 48.5 10t41.5 27q18-17 41-27t49-10q52 0 89.5 35t40.5 86q59 8 99.5 53T840-560q0 22-5.5 42T818-480q11 18 16.5 38.5T840-400q0 62-40.5 106.5T699-241q-5 50-41.5 85.5T570-120q-25 0-48.5-9.5T480-156q-19 17-42 26.5t-48 9.5Zm130-590v460q0 21 14.5 35.5T570-200q20 0 34.5-16t15.5-36q-21-8-38.5-21.5T550-306q-10-14-7.5-30t16.5-26q14-10 30-7.5t26 16.5q11 16 28 24.5t37 8.5q33 0 56.5-23.5T760-400q0-5-.5-10t-2.5-10q-17 10-36.5 15t-40.5 5q-17 0-28.5-11.5T640-440q0-17 11.5-28.5T680-480q33 0 56.5-23.5T760-560q0-33-23.5-56T680-640q-11 18-28.5 31.5T613-587q-16 6-31-1t-20-23q-5-16 1.5-31t22.5-20q15-5 24.5-18t9.5-30q0-21-14.5-35.5T570-760q-21 0-35.5 14.5T520-710Zm-80 460v-460q0-21-14.5-35.5T390-760q-21 0-35.5 14.5T340-710q0 16 9 29.5t24 18.5q16 5 23 20t2 31q-6 16-21 23t-31 1q-21-8-38.5-21.5T279-640q-32 1-55.5 24.5T200-560q0 33 23.5 56.5T280-480q17 0 28.5 11.5T320-440q0 17-11.5 28.5T280-400q-21 0-40.5-5T203-420q-2 5-2.5 10t-.5 10q0 33 23.5 56.5T280-320q20 0 37-8.5t28-24.5q10-14 26-16.5t30 7.5q14 10 16.5 26t-7.5 30q-14 19-32 33t-39 22q1 20 16 35.5t35 15.5q21 0 35.5-14.5T440-250Zm40-230Z"/></g>',
        'weakness': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-720q-33 0-56.5-23.5T400-800q0-33 23.5-56.5T480-880q33 0 56.5 23.5T560-800q0 33-23.5 56.5T480-720ZM360-120v-480q-49-4-99-11t-98-18q-17-4-27.5-19t-5.5-32q5-17 21-25t34-4q70 15 145.5 22t149.5 7q74 0 149.5-7T775-709q18-4 34 4t21 25q5 17-5.5 32T797-629q-48 11-98 18t-99 11v480q0 17-11.5 28.5T560-80q-17 0-28.5-11.5T520-120v-200h-80v200q0 17-11.5 28.5T400-80q-17 0-28.5-11.5T360-120Z"/></g>',
        'syncope': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="m492-248-121-90q-11-8-19-20.5T341-385l-45-199-88 76 24 112q4 17-5.5 31T200-348q-17 3-31-6t-17-26l-23-111q-5-21 2-41.5t23-34.5l144-128q23-20 54.5-16.5T413-696q32 14 66.5 20t69.5 1q24-4 46-14t42-24q14-10 30.5-8.5T695-707q11 13 8.5 29.5T687-651q-23 16-47 28.5T589-602q-33 9-66.5 9.5T456-600l28 124 115-22q16-3 31.5.5T660-484l147 104q14 10 16.5 26.5T815-323q-10 13-25.5 15.5T760-314l-140-98-144 28 68 50q18 14 26.5 35t4.5 44l-28 154q-3 17-17 26.5T499-68q-17-3-26-17t-6-31l25-132ZM320-740q-33 0-56.5-23.5T240-820q0-33 23.5-56.5T320-900q33 0 56.5 23.5T400-820q0 33-23.5 56.5T320-740Z"/></g>',
        'diplopia': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-134 0-244.5-72T61-462q-5-9-7.5-18.5T51-500q0-10 2.5-19.5T61-538q64-118 174.5-190T480-800q134 0 244.5 72T899-538q5 9 7.5 18.5T909-500q0 10-2.5 19.5T899-462q-64 118-174.5 190T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></g>',
        'focal-neurologic-deficit': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M390-120q-51 0-88-35.5T260-241q-60-8-100-53t-40-106q0-21 5.5-41.5T142-480q-11-18-16.5-38t-5.5-42q0-61 40-105.5t99-52.5q3-51 41-86.5t90-35.5q26 0 48.5 10t41.5 27q18-17 41-27t49-10q52 0 89.5 35t40.5 86q59 8 99.5 53T840-560q0 22-5.5 42T818-480q11 18 16.5 38.5T840-400q0 62-40.5 106.5T699-241q-5 50-41.5 85.5T570-120q-25 0-48.5-9.5T480-156q-19 17-42 26.5t-48 9.5Zm130-590v460q0 21 14.5 35.5T570-200q20 0 34.5-16t15.5-36q-21-8-38.5-21.5T550-306q-10-14-7.5-30t16.5-26q14-10 30-7.5t26 16.5q11 16 28 24.5t37 8.5q33 0 56.5-23.5T760-400q0-5-.5-10t-2.5-10q-17 10-36.5 15t-40.5 5q-17 0-28.5-11.5T640-440q0-17 11.5-28.5T680-480q33 0 56.5-23.5T760-560q0-33-23.5-56T680-640q-11 18-28.5 31.5T613-587q-16 6-31-1t-20-23q-5-16 1.5-31t22.5-20q15-5 24.5-18t9.5-30q0-21-14.5-35.5T570-760q-21 0-35.5 14.5T520-710Zm-80 460v-460q0-21-14.5-35.5T390-760q-21 0-35.5 14.5T340-710q0 16 9 29.5t24 18.5q16 5 23 20t2 31q-6 16-21 23t-31 1q-21-8-38.5-21.5T279-640q-32 1-55.5 24.5T200-560q0 33 23.5 56.5T280-480q17 0 28.5 11.5T320-440q0 17-11.5 28.5T280-400q-21 0-40.5-5T203-420q-2 5-2.5 10t-.5 10q0 33 23.5 56.5T280-320q20 0 37-8.5t28-24.5q10-14 26-16.5t30 7.5q14 10 16.5 26t-7.5 30q-14 19-32 33t-39 22q1 20 16 35.5t35 15.5q21 0 35.5-14.5T440-250Zm40-230Z"/></g>',
        'abdominal-pain': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M120-320q0-50 35-85t85-35h80q50 0 85-35t35-85q0-17-11.5-28.5T400-600q-33 0-56.5-23.5T320-680v-160q0-17 11.5-28.5T360-880q17 0 28.5 11.5T400-840v160q50 0 85 35t35 85q0 83-58.5 141.5T320-360h-80q-17 0-28.5 11.5T200-320v200q0 17-11.5 28.5T160-80q-17 0-28.5-11.5T120-120v-200Zm160 160q0-50 35-85t85-35h160q83 0 141.5-58.5T760-480v-40q0-83-58.5-141.5T560-720q-33 0-56.5-23.5T480-800v-40q0-17 11.5-28.5T520-880q17 0 28.5 11.5T560-840v40q117 0 198.5 81.5T840-520v40q0 117-81.5 198.5T560-200H400q-17 0-28.5 11.5T360-160v40q0 17-11.5 28.5T320-80q-17 0-28.5-11.5T280-120v-40Zm-80 80v-240q0-17 11.5-28.5T240-360h80q83 0 141.5-58.5T520-560q0-50-35-85t-85-35v-200 200q50 0 85 35t35 85q0 83-58.5 141.5T320-360h-80q-17 0-28.5 11.5T200-320v240Z"/></g>',
        'gib': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-80q-137 0-228.5-94T160-408q0-62 28-124t70-119q42-57 91-107t91-87q8-8 18.5-11.5T480-860q11 0 21.5 3.5T520-845q42 37 91 87t91 107q42 57 70 119t28 124q0 140-91.5 234T480-80Zm0-80q104 0 172-70.5T720-408q0-73-60.5-165T480-774Q361-665 300.5-573T240-408q0 107 68 177.5T480-160Zm0-320Zm-80 240h160q17 0 28.5-11.5T600-280q0-17-11.5-28.5T560-320H400q-17 0-28.5 11.5T360-280q0 17 11.5 28.5T400-240Zm40-200v40q0 17 11.5 28.5T480-360q17 0 28.5-11.5T520-400v-40h40q17 0 28.5-11.5T600-480q0-17-11.5-28.5T560-520h-40v-40q0-17-11.5-28.5T480-600q-17 0-28.5 11.5T440-560v40h-40q-17 0-28.5 11.5T360-480q0 17 11.5 28.5T400-440h40Z"/></g>',
        'nausea-vomiting': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M120-320q0-50 35-85t85-35h80q50 0 85-35t35-85q0-17-11.5-28.5T400-600q-33 0-56.5-23.5T320-680v-160q0-17 11.5-28.5T360-880q17 0 28.5 11.5T400-840v160q50 0 85 35t35 85q0 83-58.5 141.5T320-360h-80q-17 0-28.5 11.5T200-320v200q0 17-11.5 28.5T160-80q-17 0-28.5-11.5T120-120v-200Zm160 160q0-50 35-85t85-35h160q83 0 141.5-58.5T760-480v-40q0-83-58.5-141.5T560-720q-33 0-56.5-23.5T480-800v-40q0-17 11.5-28.5T520-880q17 0 28.5 11.5T560-840v40q117 0 198.5 81.5T840-520v40q0 117-81.5 198.5T560-200H400q-17 0-28.5 11.5T360-160v40q0 17-11.5 28.5T320-80q-17 0-28.5-11.5T280-120v-40Zm-80 80v-240q0-17 11.5-28.5T240-360h80q83 0 141.5-58.5T520-560q0-50-35-85t-85-35v-200 200q50 0 85 35t35 85q0 83-58.5 141.5T320-360h-80q-17 0-28.5 11.5T200-320v240Z"/></g>',
        'diarrhea': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M120-320q0-50 35-85t85-35h80q50 0 85-35t35-85q0-17-11.5-28.5T400-600q-33 0-56.5-23.5T320-680v-160q0-17 11.5-28.5T360-880q17 0 28.5 11.5T400-840v160q50 0 85 35t35 85q0 83-58.5 141.5T320-360h-80q-17 0-28.5 11.5T200-320v200q0 17-11.5 28.5T160-80q-17 0-28.5-11.5T120-120v-200Zm160 160q0-50 35-85t85-35h160q83 0 141.5-58.5T760-480v-40q0-83-58.5-141.5T560-720q-33 0-56.5-23.5T480-800v-40q0-17 11.5-28.5T520-880q17 0 28.5 11.5T560-840v40q117 0 198.5 81.5T840-520v40q0 117-81.5 198.5T560-200H400q-17 0-28.5 11.5T360-160v40q0 17-11.5 28.5T320-80q-17 0-28.5-11.5T280-120v-40Zm-80 80v-240q0-17 11.5-28.5T240-360h80q83 0 141.5-58.5T520-560q0-50-35-85t-85-35v-200 200q50 0 85 35t35 85q0 83-58.5 141.5T320-360h-80q-17 0-28.5 11.5T200-320v240Z"/></g>',
        'constipation': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M120-320q0-50 35-85t85-35h80q50 0 85-35t35-85q0-17-11.5-28.5T400-600q-33 0-56.5-23.5T320-680v-160q0-17 11.5-28.5T360-880q17 0 28.5 11.5T400-840v160q50 0 85 35t35 85q0 83-58.5 141.5T320-360h-80q-17 0-28.5 11.5T200-320v200q0 17-11.5 28.5T160-80q-17 0-28.5-11.5T120-120v-200Zm160 160q0-50 35-85t85-35h160q83 0 141.5-58.5T760-480v-40q0-83-58.5-141.5T560-720q-33 0-56.5-23.5T480-800v-40q0-17 11.5-28.5T520-880q17 0 28.5 11.5T560-840v40q117 0 198.5 81.5T840-520v40q0 117-81.5 198.5T560-200H400q-17 0-28.5 11.5T360-160v40q0 17-11.5 28.5T320-80q-17 0-28.5-11.5T280-120v-40Zm-80 80v-240q0-17 11.5-28.5T240-360h80q83 0 141.5-58.5T520-560q0-50-35-85t-85-35v-200 200q50 0 85 35t35 85q0 83-58.5 141.5T320-360h-80q-17 0-28.5 11.5T200-320v240Z"/></g>',
        'jaundice': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M120-320q0-50 35-85t85-35h80q50 0 85-35t35-85q0-17-11.5-28.5T400-600q-33 0-56.5-23.5T320-680v-160q0-17 11.5-28.5T360-880q17 0 28.5 11.5T400-840v160q50 0 85 35t35 85q0 83-58.5 141.5T320-360h-80q-17 0-28.5 11.5T200-320v200q0 17-11.5 28.5T160-80q-17 0-28.5-11.5T120-120v-200Zm160 160q0-50 35-85t85-35h160q83 0 141.5-58.5T760-480v-40q0-83-58.5-141.5T560-720q-33 0-56.5-23.5T480-800v-40q0-17 11.5-28.5T520-880q17 0 28.5 11.5T560-840v40q117 0 198.5 81.5T840-520v40q0 117-81.5 198.5T560-200H400q-17 0-28.5 11.5T360-160v40q0 17-11.5 28.5T320-80q-17 0-28.5-11.5T280-120v-40Zm-80 80v-240q0-17 11.5-28.5T240-360h80q83 0 141.5-58.5T520-560q0-50-35-85t-85-35v-200 200q50 0 85 35t35 85q0 83-58.5 141.5T320-360h-80q-17 0-28.5 11.5T200-320v240Z"/></g>',
        'pelvic-pain': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M318-232q0-23 6.5-45.5T345-320q8-11 12-23.5t4-26.5q0-16-6-30l-12-28q-10-19-16.5-39t-6.5-41v-152q0-25-17.5-42.5T260-720q-21 0-37 14t-21 34q34 13 56 43.5t22 68.5q0 50-35 85t-85 35q-50 0-85-35t-35-85q0-40 23-71t59-43q5-54 44.5-90t93.5-36q7 0 14 .5t14 2.5q44-23 92.5-33t99.5-10q50 0 98.5 10t92.5 33q7-2 14-2.5t14-.5q55 0 94.5 36t44.5 90q36 12 59 43t23 71q0 50-35 85t-85 35q-50 0-85-35t-35-85q0-38 22-68.5t56-43.5q-5-20-21-34t-38-14q-25 0-42 17.5T640-660v152q0 21-7 41t-16 39q-7 14-12.5 28t-5.5 30q0 14 4 26.5t12 23.5q13 20 20 42.5t7 45.5q0 19-4.5 37T625-160l-11 22q-8 21-31 24.5l-23 3.5q-14-14-20-30.5t2-33.5l11-22q5-8 7-17t2-19q0-12-4-23t-10-21q-14-20-21.5-44t-7.5-49q0-23 6.5-43.5T543-453q6-14 11.5-27.5T560-508v-152q0-24 7.5-45.5T589-745q-26-8-53.5-11.5T480-760q-28 0-55.5 3.5T371-745q14 18 21.5 39.5T400-660v152q0 14 5 28t12 27q10 20 17 40.5t7 43.5q0 25-7.5 48.5T412-276q-7 10-10.5 21t-3.5 23q0 10 2 19t7 17l11 22q8 15 2.5 30.5T400-120q-15 8-30.5 2.5T346-138l-11-22q-9-17-13-35t-4-37ZM160-520q17 0 28.5-11.5T200-560q0-17-11.5-28.5T160-600q-17 0-28.5 11.5T120-560q0 17 11.5 28.5T160-520Zm640 0q17 0 28.5-11.5T840-560q0-17-11.5-28.5T800-600q-17 0-28.5 11.5T760-560q0 17 11.5 28.5T800-520Zm0-40Zm-640 0Z"/></g>',
        'vaginal-bleeding': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M318-232q0-23 6.5-45.5T345-320q8-11 12-23.5t4-26.5q0-16-6-30l-12-28q-10-19-16.5-39t-6.5-41v-152q0-25-17.5-42.5T260-720q-21 0-37 14t-21 34q34 13 56 43.5t22 68.5q0 50-35 85t-85 35q-50 0-85-35t-35-85q0-40 23-71t59-43q5-54 44.5-90t93.5-36q7 0 14 .5t14 2.5q44-23 92.5-33t99.5-10q50 0 98.5 10t92.5 33q7-2 14-2.5t14-.5q55 0 94.5 36t44.5 90q36 12 59 43t23 71q0 50-35 85t-85 35q-50 0-85-35t-35-85q0-38 22-68.5t56-43.5q-5-20-21-34t-38-14q-25 0-42 17.5T640-660v152q0 21-7 41t-16 39q-7 14-12.5 28t-5.5 30q0 14 4 26.5t12 23.5q13 20 20 42.5t7 45.5q0 19-4.5 37T625-160l-11 22q-8 21-31 24.5l-23 3.5q-14-14-20-30.5t2-33.5l11-22q5-8 7-17t2-19q0-12-4-23t-10-21q-14-20-21.5-44t-7.5-49q0-23 6.5-43.5T543-453q6-14 11.5-27.5T560-508v-152q0-24 7.5-45.5T589-745q-26-8-53.5-11.5T480-760q-28 0-55.5 3.5T371-745q14 18 21.5 39.5T400-660v152q0 14 5 28t12 27q10 20 17 40.5t7 43.5q0 25-7.5 48.5T412-276q-7 10-10.5 21t-3.5 23q0 10 2 19t7 17l11 22q8 15 2.5 30.5T400-120q-15 8-30.5 2.5T346-138l-11-22q-9-17-13-35t-4-37ZM160-520q17 0 28.5-11.5T200-560q0-17-11.5-28.5T160-600q-17 0-28.5 11.5T120-560q0 17 11.5 28.5T160-520Zm640 0q17 0 28.5-11.5T840-560q0-17-11.5-28.5T800-600q-17 0-28.5 11.5T760-560q0 17 11.5 28.5T800-520Zm0-40Zm-640 0Z"/></g>',
        'scrotal-pain': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M440-120v40q0 17-11.5 28.5T400-40q-17 0-28.5-11.5T360-80v-41q-25-5-43-22.5T294-187l-13-80q-6-37 18-65t61-28v-47q-10 4-19.5 5.5T320-400q-100 0-170-70T80-640v-40q0-100 70-170t170-70q50 0 85 35t35 85q0 50-35 85t-85 35h-40q-17 0-28.5-11.5T240-720q0-17 11.5-28.5T280-760h40q17 0 28.5-11.5T360-800q0-17-11.5-28.5T320-840q-66 0-113 47t-47 113v40q0 66 47 113t113 47q17 0 28.5-11.5T360-520q0-17-11.5-28.5T320-560h-40q-17 0-28.5-11.5T240-600q0-17 11.5-28.5T280-640h40q50 0 85 35t35 85v160h80v-160q0-50 35-85t85-35h40q17 0 28.5 11.5T720-600q0 17-11.5 28.5T680-560h-40q-17 0-28.5 11.5T600-520q0 17 11.5 28.5T640-480q66 0 113-47t47-113v-40q0-66-47-113t-113-47q-17 0-28.5 11.5T600-800q0 17 11.5 28.5T640-760h40q17 0 28.5 11.5T720-720q0 17-11.5 28.5T680-680h-40q-50 0-85-35t-35-85q0-50 35-85t85-35q100 0 170 70t70 170v40q0 100-70 170t-170 70q-11 0-20.5-1.5T600-407v47q37 0 61 28t18 65l-13 80q-5 26-23 43.5T600-121v41q0 17-11.5 28.5T560-40q-17 0-28.5-11.5T520-80v-40h-80Zm-80-160 13 80h214l13-80H360Zm0 0 13 80-13-80Z"/></g>',
        'flank-pain': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M320-280q-100 0-170-70T80-520v-80q0-100 70-170t170-70q50 0 85 35t35 85q0 50-35 85t-85 35h-40q-17 0-28.5-11.5T240-640q0-17 11.5-28.5T280-680h40q17 0 28.5-11.5T360-720q0-17-11.5-28.5T320-760q-66 0-113 47t-47 113v80q0 66 47 113t113 47q17 0 28.5-11.5T360-400q0-17-11.5-28.5T320-440h-40q-17 0-28.5-11.5T240-480q0-17 11.5-28.5T280-520h40q50 0 85 35t35 85v240q0 17-11.5 28.5T400-120q-17 0-28.5-11.5T360-160v-127q-10 4-19.5 5.5T320-280Zm320 0q-11 0-20.5-1.5T600-287v127q0 17-11.5 28.5T560-120q-17 0-28.5-11.5T520-160v-240q0-50 35-85t85-35h40q17 0 28.5 11.5T720-480q0 17-11.5 28.5T680-440h-40q-17 0-28.5 11.5T600-400q0 17 11.5 28.5T640-360q66 0 113-47t47-113v-80q0-66-47-113t-113-47q-17 0-28.5 11.5T600-720q0 17 11.5 28.5T640-680h40q17 0 28.5 11.5T720-640q0 17-11.5 28.5T680-600h-40q-50 0-85-35t-35-85q0-50 35-85t85-35q100 0 170 70t70 170v80q0 100-70 170t-170 70ZM160-520v-80 80Zm640-80v80-80Z"/></g>',
        'urinary-retention': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M440-120v40q0 17-11.5 28.5T400-40q-17 0-28.5-11.5T360-80v-41q-25-5-43-22.5T294-187l-13-80q-6-37 18-65t61-28v-47q-10 4-19.5 5.5T320-400q-100 0-170-70T80-640v-40q0-100 70-170t170-70q50 0 85 35t35 85q0 50-35 85t-85 35h-40q-17 0-28.5-11.5T240-720q0-17 11.5-28.5T280-760h40q17 0 28.5-11.5T360-800q0-17-11.5-28.5T320-840q-66 0-113 47t-47 113v40q0 66 47 113t113 47q17 0 28.5-11.5T360-520q0-17-11.5-28.5T320-560h-40q-17 0-28.5-11.5T240-600q0-17 11.5-28.5T280-640h40q50 0 85 35t35 85v160h80v-160q0-50 35-85t85-35h40q17 0 28.5 11.5T720-600q0 17-11.5 28.5T680-560h-40q-17 0-28.5 11.5T600-520q0 17 11.5 28.5T640-480q66 0 113-47t47-113v-40q0-66-47-113t-113-47q-17 0-28.5 11.5T600-800q0 17 11.5 28.5T640-760h40q17 0 28.5 11.5T720-720q0 17-11.5 28.5T680-680h-40q-50 0-85-35t-35-85q0-50 35-85t85-35q100 0 170 70t70 170v40q0 100-70 170t-170 70q-11 0-20.5-1.5T600-407v47q37 0 61 28t18 65l-13 80q-5 26-23 43.5T600-121v41q0 17-11.5 28.5T560-40q-17 0-28.5-11.5T520-80v-40h-80Zm-80-160 13 80h214l13-80H360Zm0 0 13 80-13-80Z"/></g>',
        'back-pain': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-72q-46 0-115.5-14T264-115q-11-5-17.5-15t-6.5-22v-40h-40q-17 0-28.5-11.5T160-232v-60q0-17 11.5-28.5T200-332h40v-80h-40q-17 0-28.5-11.5T160-452v-60q0-17 11.5-28.5T200-552h40v-80h-40q-17 0-28.5-11.5T160-672v-60q0-17 11.5-28.5T200-772h40v-60q0-22 18-33t38-3q1 0 55 18t129 18q75 0 129-18t55-18q20-8 38 3.5t18 32.5v60h40q17 0 28.5 11.5T800-732v60q0 17-11.5 28.5T760-632h-40v80h40q17 0 28.5 11.5T800-512v60q0 17-11.5 28.5T760-412h-40v80h40q17 0 28.5 11.5T800-292v60q0 17-11.5 28.5T760-192h-40v40q0 12-6.5 22T696-115q-31 15-100.5 29T480-72Zm0-534q38 0 80.5-7t79.5-20v-143q-38 11-79.5 17.5T480-752q-38 0-79.5-6.5T320-776v143q36 13 79 20t81 7Zm0 228q37 0 79.5-7t80.5-21v-144q-44 12-83.5 18t-76.5 6q-39 0-80-6t-80-18v144q38 14 80.5 21t79.5 7Zm0 226q38 0 80.5-7t79.5-20v-143q-38 11-79.5 17.5T480-298q-38 0-79.5-6.5T320-322v143q36 13 79 20t81 7Z"/></g>',
        'red-eye': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-134 0-244.5-72T61-462q-5-9-7.5-18.5T51-500q0-10 2.5-19.5T61-538q64-118 174.5-190T480-800q134 0 244.5 72T899-538q5 9 7.5 18.5T909-500q0 10-2.5 19.5T899-462q-64 118-174.5 190T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></g>',
        'joint-pain': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M411-249Zm337-73q-15-5-23-20t-3-30q6-17 20.5-24.5T773-398l120 40q16 5 23.5 19.5T918-307q-5 15-19.5 22.5T868-282l-120-40Zm12-118q-17 0-28.5-11.5T720-480q0-17 11.5-28.5T760-520h120q17 0 28.5 11.5T920-480q0 17-11.5 28.5T880-440H760Zm13-122q-16 5-31-2t-20-23q-5-17 2.5-31.5T748-638l120-40q16-5 30.5 2.5T918-652q5 15-2 30t-23 20l-120 40ZM285-400q-52 0-88.5-36.5T160-525q0-26 10-48.5t27-39.5l83-84v-143q0-17 11.5-28.5T320-880q17 0 28.5 11.5T360-840v160q0 8-3.5 15.5T348-651l-95 95q-6 6-9.5 14t-3.5 17q0 18 13.5 31.5T285-480q12 0 19-4t19-14q22-18 43.5-27t43.5-9q22 0 43.5 9t43.5 27q12 10 19 14t19 4q19 0 32-13.5t13-31.5q0-9-3.5-17.5T567-557l-95-95q-5-6-8.5-13t-3.5-15v-160q0-17 11.5-28.5T500-880q17 0 28.5 11.5T540-840v142l84 84q17 17 26.5 40t9.5 49q0 52-36 88.5T535-400q-33 0-53.5-12.5T447-437q-15-12-23.5-14.5T410-454q-9 0-18.5 6T374-437q-14 12-34.5 24.5T285-400Zm255 146v134q0 17-11.5 28.5T500-80q-17 0-28.5-11.5T460-120v-150q0-8 3.5-15.5T472-299l95-95q6-6 9.5-14t3.5-17q0-10-3.5-18t-9.5-14l57-57q17 17 26.5 40t9.5 49q0 26-9.5 48T624-338l-84 84Zm-260 0-83-84q-17-17-27-39t-10-48q0-26 10-49t27-40l57 57q-7 6-10.5 14t-3.5 18q0 9 3.5 17t9.5 14l95 95q5 6 8.5 13.5T360-270v150q0 17-11.5 28.5T320-80q-17 0-28.5-11.5T280-120v-134Zm130-398Z"/></g>',
        'sore-throat': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M469-320h91q17 0 28.5-11.5T600-360q0-17-11.5-28.5T560-400h-83l5-44q2-15 13-25.5t26-10.5h119q17 0 28.5-11.5T680-520q0-17-11.5-28.5T640-560H522q-47 0-81 31t-39 77l-34 328q-2 17 10 30.5T408-80q15 0 26.5-10.5T448-116l21-204Zm-229 68q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v40q0 17-11.5 28.5T560-80q-17 0-28.5-11.5T520-120v-80q0-17 11.5-28.5T560-240h120v-160q0-17 11.5-28.5T720-440h68l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v168q0 17-11.5 28.5T280-80q-17 0-28.5-11.5T240-120v-132Zm254-188Z"/></g>',
        'airway-stridor': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M469-320h91q17 0 28.5-11.5T600-360q0-17-11.5-28.5T560-400h-83l5-44q2-15 13-25.5t26-10.5h119q17 0 28.5-11.5T680-520q0-17-11.5-28.5T640-560H522q-47 0-81 31t-39 77l-34 328q-2 17 10 30.5T408-80q15 0 26.5-10.5T448-116l21-204Zm-229 68q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v40q0 17-11.5 28.5T560-80q-17 0-28.5-11.5T520-120v-80q0-17 11.5-28.5T560-240h120v-160q0-17 11.5-28.5T720-440h68l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v168q0 17-11.5 28.5T280-80q-17 0-28.5-11.5T240-120v-132Zm254-188Z"/></g>',
        'anaphylaxis': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M760-60q-15 0-28-7t-21-19q-121-22-213.5-108T368-406q-86 40-140.5 116T162-121q-2 17-13.5 29T120-80q-17 0-28.5-12.5T82-122q11-121 83-218.5T350-486q-21-115-3.5-207.5T420-843q2-24 19-40.5t41-16.5q25 0 42.5 17.5T540-840q0 25-17.5 42.5T480-780h-4q-2 0-5-1-22 25-35 61.5T419-638q20-20 46.5-34.5T524-695q30-8 64.5-10.5t72.5.5q8-8 18-11.5t21-3.5q25 0 42.5 17.5T760-660q0 25-17.5 42.5T700-600q-14 0-27.5-6.5T651-625q-33-2-63.5.5T533-614q-39 13-61.5 38T443-512q28-5 47.5-6.5T576-520q8-10 19.5-15t24.5-5q25 0 42.5 17.5T680-480q0 25-17.5 42.5T620-420q-13 0-24.5-5T576-440q-63 0-83 1.5t-45 6.5q13 34 51 52t99 20q29 2 62.5-1t67.5-9q8-14 22-22t30-8q25 0 42.5 17.5T840-340q0 25-17.5 42.5T780-280q-10 0-18.5-3t-16.5-9q-34 6-66.5 9.5T617-279q-29 0-55-3t-49-9q38 49 92.5 82.5T720-164q8-8 18.5-12t21.5-4q25 0 42.5 17.5T820-120q0 25-17.5 42.5T760-60Z"/></g>',
        'rash': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M120-120q-17 0-28.5-11.5T80-160v-320q0-33 23.5-56.5T160-560h160q8 0 15.5 3t13 8.5q5.5 5.5 8.5 13t3 15.5v40q0 50 35 85t85 35q50 0 85-35t35-85v-40q0-8 3-15.5t8.5-13q5.5-5.5 13-8.5t15.5-3h160q33 0 56.5 23.5T880-480v320q0 17-11.5 28.5T840-120H120Zm40-80h640v-280H680q0 83-58.5 141.5T480-280q-83 0-141.5-58.5T280-480H160v280Zm320-240q-17 0-28.5-11.5T440-480q0-109 25-215t109-175q13-11 29-9.5t27 14.5q11 13 9.5 29T625-809q-70 59-87.5 148T520-480q0 17-11.5 28.5T480-440ZM230-340q13 0 21.5-8.5T260-370q0-13-8.5-21.5T230-400q-13 0-21.5 8.5T200-370q0 13 8.5 21.5T230-340Zm40 100q13 0 21.5-8.5T300-270q0-13-8.5-21.5T270-300q-13 0-21.5 8.5T240-270q0 13 8.5 21.5T270-240Zm460-100q13 0 21.5-8.5T760-370q0-13-8.5-21.5T730-400q-13 0-21.5 8.5T700-370q0 13 8.5 21.5T730-340ZM160-200h640-640Z"/></g>',
        'fever': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-120q-83 0-141.5-58.5T280-320q0-48 21-89.5t59-70.5v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q38 29 59 70.5t21 89.5q0 83-58.5 141.5T480-120Zm0-80q50 0 85-35t35-85q0-29-12.5-54T552-416l-32-24v-280q0-17-11.5-28.5T480-760q-17 0-28.5 11.5T440-720v280l-32 24q-23 17-35.5 42T360-320q0 50 35 85t85 35Zm0-120Z"/></g>',
        'overdose': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M345-120q-94 0-159.5-65.5T120-345q0-45 17-86t49-73l270-270q32-32 73-49t86-17q94 0 159.5 65.5T840-615q0 45-17 86t-49 73L504-186q-32 32-73 49t-86 17Zm266-286 107-106q20-20 31-47t11-56q0-60-42.5-102.5T615-760q-29 0-56 11t-47 31L406-611l205 205ZM345-200q29 0 56-11t47-31l106-107-205-205-107 106q-20 20-31 47t-11 56q0 60 42.5 102.5T345-200Z"/></g>',
        'suicidal': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="m434-410 4 32q1 8 6.5 13t13.5 5h44q8 0 13.5-5t6.5-13l4-32q8-3 14.5-7t11.5-9l30 13q7 3 14 1t11-9l22-38q4-7 2.5-14t-7.5-12l-26-19q2-8 2-16t-2-16l26-19q6-5 7.5-12t-2.5-14l-22-38q-4-7-11-9t-14 1l-30 13q-5-5-11.5-9t-14.5-7l-4-32q-1-8-6.5-13t-13.5-5h-44q-8 0-13.5 5t-6.5 13l-4 32q-8 3-14.5 7t-11.5 9l-30-13q-7-3-14-1t-11 9l-22 38q-4 7-2.5 14t7.5 12l26 19q-2 8-2 16t2 16l-26 19q-6 5-7.5 12t2.5 14l22 38q4 7 11 9t14-1l30-13q5 5 11.5 9t14.5 7Zm46-50q-25 0-42.5-17.5T420-520q0-25 17.5-42.5T480-580q25 0 42.5 17.5T540-520q0 25-17.5 42.5T480-460ZM240-252q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v40q0 17-11.5 28.5T560-80q-17 0-28.5-11.5T520-120v-80q0-17 11.5-28.5T560-240h120v-160q0-17 11.5-28.5T720-440h68l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v168q0 17-11.5 28.5T280-80q-17 0-28.5-11.5T240-120v-132Zm254-188Z"/></g>',
        'hyperglycemia': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M576-80q-35 0-67-14.5T454-136L250-374q-11-14-9.5-30.5T256-432l18-13q20-15 45-16t46 13l55 35v-387q0-17 11.5-28.5T460-840q17 0 28.5 11.5T500-800v460q0 24-21 35t-41-2l-56-36 144 169q6 7 14 10.5t17 3.5h203q33 0 56.5-23.5T840-240v-280q0-17 11.5-28.5T880-560q17 0 28.5 11.5T920-520v280q0 66-47 113T760-80H576Zm24-600q17 0 28.5 11.5T640-640v160q0 17-11.5 28.5T600-440q-17 0-28.5-11.5T560-480v-160q0-17 11.5-28.5T600-680Zm140 40q17 0 28.5 11.5T780-600v120q0 17-11.5 28.5T740-440q-17 0-28.5-11.5T700-480v-120q0-17 11.5-28.5T740-640Zm-560 80q-59 0-99.5-40.5T40-698q0-34 13.5-59t63.5-82l33-37q12-14 30-14t30 14l33 38q51 59 64 83t13 57q0 57-41 97.5T180-560Zm0-80q25 0 42.5-17t17.5-41q0-17-8.5-30.5T185-784l-5-5-5 5q-32 36-43.5 54T120-698q0 24 17 41t43 17Zm0-58Zm660 538H526h314Z"/></g>',
        'heat-cold': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-80q-83 0-141.5-58.5T280-280q0-48 21-89.5t59-70.5v-320q0-50 35-85t85-35q50 0 85 35t35 85v320q38 29 59 70.5t21 89.5q0 83-58.5 141.5T480-80Zm-40-440h80v-40h-40v-40h40v-80h-40v-40h40v-40q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240Z"/></g>',
        'multiple-trauma': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M410-190v-168l-146 84q-25 14-53 7t-42-33q-14-25-7-53t32-42l146-85-146-84q-25-14-32-42.5t7-53.5q14-25 42-32t53 7l146 84v-169q0-29 20.5-49.5T480-840q29 0 49.5 20.5T550-770v169l146-84q25-14 53-7t42 32q14 25 6.5 53.5T765-564l-145 84 146 85q25 14 32 42t-7 54q-14 25-42 32t-53-7l-146-84v168q0 29-20.5 49.5T480-120q-29 0-49.5-20.5T410-190Z"/></g>',
        'falls-geriatric-trauma': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M540-740q-33 0-56.5-23.5T460-820q0-33 23.5-56.5T540-900q33 0 56.5 23.5T620-820q0 33-23.5 56.5T540-740Zm160 350q-8 0-14-6t-6-14v-19q-54-23-84-51.5T543-557q-11 28-17.5 68.5T521-412l72 102q4 5 5.5 11t1.5 12v207q0 17-11.5 28.5T560-40q-17 0-28.5-11.5T520-80v-160l-71-102-8 130q0 4-8 22L344-72q-10 14-26 16t-30-8q-14-10-16-26t8-30l80-107v-213q0-31 5-67.5t15-67.5l-60 33v102q0 17-11.5 28.5T280-400q-17 0-28.5-11.5T240-440v-125q0-11 5-20.5t15-14.5l156-88q25-14 43.5-21.5T494-717q25 0 45.5 21.5T587-628q32 54 58 81t56 41q11-8 19-11t19-3q25 0 43 18t18 42v400q0 8-6 14t-14 6q-8 0-14-6t-6-14v-400q0-8-6-14t-14-6q-8 0-14 6t-6 14v50q0 8-6 14t-14 6Z"/></g>',
        'pregnancy-emergency': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M400-120v-160h-40q-17 0-28.5-11.5T320-320v-240q0-50 35-85t85-35q50 0 85 35t35 85q36 15 58 48t22 72v120q0 17-11.5 28.5T600-280h-80v160q0 17-11.5 28.5T480-80h-40q-17 0-28.5-11.5T400-120Zm40-600q-33 0-56.5-23.5T360-800q0-33 23.5-56.5T440-880q33 0 56.5 23.5T520-800q0 33-23.5 56.5T440-720Z"/></g>',
        'pediatric-fever': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M580-490q-21 0-35.5-14.5T530-540q0-21 14.5-35.5T580-590q21 0 35.5 14.5T630-540q0 21-14.5 35.5T580-490Zm-200 0q-21 0-35.5-14.5T330-540q0-21 14.5-35.5T380-590q21 0 35.5 14.5T430-540q0 21-14.5 35.5T380-490Zm100 210q-60 0-108.5-33T300-400h360q-23 54-71.5 87T480-280Zm0 160q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82h-12q-6 0-12 2-6 6-8 13t-2 15q0 21 14.5 35.5T496-680q9 0 16.5-3t15.5-3q12 0 20 9t8 21q0 23-21.5 29.5T496-620q-45 0-77.5-32.5T386-730v-6q0-3 1-8-83 30-135 101t-52 163q0 116 82 198t198 82Zm0-280Z"/></g>',
        'pediatric-respiratory-distress': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M580-490q-21 0-35.5-14.5T530-540q0-21 14.5-35.5T580-590q21 0 35.5 14.5T630-540q0 21-14.5 35.5T580-490Zm-200 0q-21 0-35.5-14.5T330-540q0-21 14.5-35.5T380-590q21 0 35.5 14.5T430-540q0 21-14.5 35.5T380-490Zm100 210q-60 0-108.5-33T300-400h360q-23 54-71.5 87T480-280Zm0 160q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82h-12q-6 0-12 2-6 6-8 13t-2 15q0 21 14.5 35.5T496-680q9 0 16.5-3t15.5-3q12 0 20 9t8 21q0 23-21.5 29.5T496-620q-45 0-77.5-32.5T386-730v-6q0-3 1-8-83 30-135 101t-52 163q0 116 82 198t198 82Zm0-280Z"/></g>',
        'how-to-think': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="m434-410 4 32q1 8 6.5 13t13.5 5h44q8 0 13.5-5t6.5-13l4-32q8-3 14.5-7t11.5-9l30 13q7 3 14 1t11-9l22-38q4-7 2.5-14t-7.5-12l-26-19q2-8 2-16t-2-16l26-19q6-5 7.5-12t-2.5-14l-22-38q-4-7-11-9t-14 1l-30 13q-5-5-11.5-9t-14.5-7l-4-32q-1-8-6.5-13t-13.5-5h-44q-8 0-13.5 5t-6.5 13l-4 32q-8 3-14.5 7t-11.5 9l-30-13q-7-3-14-1t-11 9l-22 38q-4 7-2.5 14t7.5 12l26 19q-2 8-2 16t2 16l-26 19q-6 5-7.5 12t2.5 14l22 38q4 7 11 9t14-1l30-13q5 5 11.5 9t14.5 7Zm46-50q-25 0-42.5-17.5T420-520q0-25 17.5-42.5T480-580q25 0 42.5 17.5T540-520q0 25-17.5 42.5T480-460ZM240-252q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v40q0 17-11.5 28.5T560-80q-17 0-28.5-11.5T520-120v-80q0-17 11.5-28.5T560-240h120v-160q0-17 11.5-28.5T720-440h68l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v168q0 17-11.5 28.5T280-80q-17 0-28.5-11.5T240-120v-132Zm254-188Z"/></g>',
        'dont-miss': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-120q-33 0-56.5-23.5T400-200q0-33 23.5-56.5T480-280q33 0 56.5 23.5T560-200q0 33-23.5 56.5T480-120Zm0-240q-33 0-56.5-23.5T400-440v-320q0-33 23.5-56.5T480-840q33 0 56.5 23.5T560-760v320q0 33-23.5 56.5T480-360Z"/></g>',
        'red-flags': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M280-400v240q0 17-11.5 28.5T240-120q-17 0-28.5-11.5T200-160v-600q0-17 11.5-28.5T240-800h287q14 0 25 9t14 23l10 48h184q17 0 28.5 11.5T800-680v320q0 17-11.5 28.5T760-320H553q-14 0-25-9t-14-23l-10-48H280Zm306 0h134v-240H543q-14 0-25-9t-14-23l-10-48H280v240h257q14 0 25 9t14 23l10 48Zm-86-160Z"/></g>',
        'first-minutes': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="m422-232 207-248H469l29-227-185 267h139l-30 208Zm-62-128H236q-24 0-35.5-21.5T203-423l299-430q10-14 26-19.5t33 .5q17 6 25 21t6 32l-32 259h155q26 0 36.5 23t-6.5 43L416-100q-11 13-27 17t-31-3q-15-7-23.5-21.5T328-139l32-221Zm111-110Z"/></g>',
        'history': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M680-320q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-440q0-17-11.5-28.5T680-480q-17 0-28.5 11.5T640-440q0 17 11.5 28.5T680-400ZM480-40q-17 0-28.5-11.5T440-80v-76q0-21 10-39.5t28-29.5q32-19 54-26.5t59-13.5q12-2 24 .5t20 11.5l45 53 44-53q8-10 20-12t24 0q37 6 59 13.5t54 26.5q18 11 28.5 29.5T920-156v76q0 17-11.5 28.5T880-40H480Zm39-80h123l-54-66q-18 5-35 13t-34 17v36Zm199 0h122v-36q-16-10-33-17.5T772-186l-54 66Zm-76 0Zm76 0Zm-38-320ZM200-200v-560 137-17 440Zm0 80q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v200q-16-20-35-38t-45-24v-138H200v560h166q-3 11-4.5 22t-1.5 22v36H200Zm120-480h240q26-20 57-30t63-10q0-17-11.5-28.5T640-680H320q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm0 160h160q0-21 4.5-41t12.5-39H320q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0 160h98q11-9 23.5-16t25.5-13v-11q0-16-8.5-28T427-360H320q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280Z"/></g>',
        'exam': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M540-80q-108 0-184-76t-76-184v-23q-86-14-143-80.5T80-600v-200q0-17 11.5-28.5T120-840h80q0-17 11.5-28.5T240-880q17 0 28.5 11.5T280-840v80q0 17-11.5 28.5T240-720q-17 0-28.5-11.5T200-760h-40v160q0 66 47 113t113 47q66 0 113-47t47-113v-160h-40q0 17-11.5 28.5T400-720q-17 0-28.5-11.5T360-760v-80q0-17 11.5-28.5T400-880q17 0 28.5 11.5T440-840h80q17 0 28.5 11.5T560-800v200q0 90-57 156.5T360-363v23q0 75 52.5 127.5T540-160q75 0 127.5-52.5T720-340v-67q-35-13-57.5-43.5T640-520q0-50 35-85t85-35q50 0 85 35t35 85q0 39-22.5 69.5T800-407v67q0 108-76 184T540-80Zm220-400q17 0 28.5-11.5T800-520q0-17-11.5-28.5T760-560q-17 0-28.5 11.5T720-520q0 17 11.5 28.5T760-480Zm0-40Z"/></g>',
        'workup': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-80q-83 0-141.5-58.5T280-280v-360q-33 0-56.5-23.5T200-720v-80q0-33 23.5-56.5T280-880h400q33 0 56.5 23.5T760-800v80q0 33-23.5 56.5T680-640v360q0 83-58.5 141.5T480-80ZM280-720h400v-80H280v80Zm200 560q50 0 85-35t35-85h-80q-17 0-28.5-11.5T480-320q0-17 11.5-28.5T520-360h80v-80h-80q-17 0-28.5-11.5T480-480q0-17 11.5-28.5T520-520h80v-120H360v360q0 50 35 85t85 35ZM280-720v-80 80Z"/></g>',
        'disposition': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M320-160q-117 0-198.5-81.5T40-440q0-107 70.5-186.5T287-718l-36-38q-11-12-11-28t11-27q12-12 29-12t28 11l104 104q12 12 12 28t-12 28L309-549q-12 12-28.5 12T252-549q-11-12-11-28.5t11-27.5l31-31q-71 14-117 69t-46 127q0 83 58.5 141.5T320-240h80q17 0 28.5 11.5T440-200q0 17-11.5 28.5T400-160h-80Zm240-360q-17 0-28.5-11.5T520-560v-200q0-17 11.5-28.5T560-800h280q17 0 28.5 11.5T880-760v200q0 17-11.5 28.5T840-520H560Zm0 360q-17 0-28.5-11.5T520-200v-200q0-17 11.5-28.5T560-440h280q17 0 28.5 11.5T880-400v200q0 17-11.5 28.5T840-160H560Zm40-80h200v-120H600v120Z"/></g>',
        'pearls-pitfalls': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM360-200q-17 0-28.5-11.5T320-240q0-17 11.5-28.5T360-280h240q17 0 28.5 11.5T640-240q0 17-11.5 28.5T600-200H360Zm-30-120q-69-41-109.5-110T180-580q0-125 87.5-212.5T480-880q125 0 212.5 87.5T780-580q0 81-40.5 150T630-320H330Zm24-80h252q45-32 69.5-79T700-580q0-92-64-156t-156-64q-92 0-156 64t-64 156q0 54 24.5 101t69.5 79Zm126 0Z"/></g>',
        'see-also': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M280-280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h120q17 0 28.5 11.5T440-640q0 17-11.5 28.5T400-600H280q-50 0-85 35t-35 85q0 50 35 85t85 35h120q17 0 28.5 11.5T440-320q0 17-11.5 28.5T400-280H280Zm80-160q-17 0-28.5-11.5T320-480q0-17 11.5-28.5T360-520h240q17 0 28.5 11.5T640-480q0 17-11.5 28.5T600-440H360Zm200 160q-17 0-28.5-11.5T520-320q0-17 11.5-28.5T560-360h120q50 0 85-35t35-85q0-50-35-85t-85-35H560q-17 0-28.5-11.5T520-640q0-17 11.5-28.5T560-680h120q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H560Z"/></g>',
        'references': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 97q-14 0-26.5-3.5T430-194q-39-23-82-34.5T260-240q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-45 0-88 11.5T530-194q-11 6-23.5 9.5T480-181ZM280-494Zm280-115q0-9 6.5-18.5T581-640q29-10 58-15t61-5q20 0 39.5 2.5T778-651q9 2 15.5 10t6.5 18q0 17-11 25t-28 4q-14-3-29.5-4.5T700-600q-26 0-51 5t-48 13q-18 7-29.5-1T560-609Zm0 220q0-9 6.5-18.5T581-420q29-10 58-15t61-5q20 0 39.5 2.5T778-431q9 2 15.5 10t6.5 18q0 17-11 25t-28 4q-14-3-29.5-4.5T700-380q-26 0-51 4.5T601-363q-18 7-29.5-.5T560-389Zm0-110q0-9 6.5-18.5T581-530q29-10 58-15t61-5q20 0 39.5 2.5T778-541q9 2 15.5 10t6.5 18q0 17-11 25t-28 4q-14-3-29.5-4.5T700-490q-26 0-51 5t-48 13q-18 7-29.5-1T560-499Z"/></g>',
        'study': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M200-400q-17 0-28.5-11.5T160-440q0-17 11.5-28.5T200-480h200q17 0 28.5 11.5T440-440q0 17-11.5 28.5T400-400H200Zm0-160q-17 0-28.5-11.5T160-600q0-17 11.5-28.5T200-640h360q17 0 28.5 11.5T600-600q0 17-11.5 28.5T560-560H200Zm0-160q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h360q17 0 28.5 11.5T600-760q0 17-11.5 28.5T560-720H200Zm320 520v-66q0-8 3-15.5t9-13.5l209-208q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L655-172q-6 6-13.5 9t-15.5 3h-66q-17 0-28.5-11.5T520-200Zm300-223-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z"/></g>',
        'ecg-patterns': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M80-720q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v80q0 17-11.5 28.5T840-600q-17 0-28.5-11.5T800-640v-80H160v80q0 17-11.5 28.5T120-600q-17 0-28.5-11.5T80-640v-80Zm80 560q-33 0-56.5-23.5T80-240v-80q0-17 11.5-28.5T120-360q17 0 28.5 11.5T160-320v80h640v-80q0-17 11.5-28.5T840-360q17 0 28.5 11.5T880-320v80q0 33-23.5 56.5T800-160H160Zm240-120q11 0 21-5.5t15-16.5l124-248 44 88q5 11 15 16.5t21 5.5h200q17 0 28.5-11.5T880-480q0-17-11.5-28.5T840-520H665l-69-138q-5-11-15-15.5t-21-4.5q-11 0-21 4.5T524-658L400-410l-44-88q-5-11-15-16.5t-21-5.5H120q-17 0-28.5 11.5T80-480q0 17 11.5 28.5T120-440h175l69 138q5 11 15 16.5t21 5.5Zm80-200Z"/></g>',
        'ecg-how': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-440q-17 0-28.5-11.5T440-480q0-17 11.5-28.5T480-520q17 0 28.5 11.5T520-480q0 17-11.5 28.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320ZM297-277l250-117q6-3 11-8t8-11l117-250q5-10-2.5-17.5T663-683L413-566q-6 3-11 8t-8 11L277-297q-5 10 2.5 17.5T297-277Z"/></g>',
        'ecg-red-flags': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M280-400v240q0 17-11.5 28.5T240-120q-17 0-28.5-11.5T200-160v-600q0-17 11.5-28.5T240-800h287q14 0 25 9t14 23l10 48h184q17 0 28.5 11.5T800-680v320q0 17-11.5 28.5T760-320H553q-14 0-25-9t-14-23l-10-48H280Zm306 0h134v-240H543q-14 0-25-9t-14-23l-10-48H280v240h257q14 0 25 9t14 23l10 48Zm-86-160Z"/></g>',
        'ecg-references': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 97q-14 0-26.5-3.5T430-194q-39-23-82-34.5T260-240q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-45 0-88 11.5T530-194q-11 6-23.5 9.5T480-181ZM280-494Zm280-115q0-9 6.5-18.5T581-640q29-10 58-15t61-5q20 0 39.5 2.5T778-651q9 2 15.5 10t6.5 18q0 17-11 25t-28 4q-14-3-29.5-4.5T700-600q-26 0-51 5t-48 13q-18 7-29.5-1T560-609Zm0 220q0-9 6.5-18.5T581-420q29-10 58-15t61-5q20 0 39.5 2.5T778-431q9 2 15.5 10t6.5 18q0 17-11 25t-28 4q-14-3-29.5-4.5T700-380q-26 0-51 4.5T601-363q-18 7-29.5-.5T560-389Zm0-110q0-9 6.5-18.5T581-530q29-10 58-15t61-5q20 0 39.5 2.5T778-541q9 2 15.5 10t6.5 18q0 17-11 25t-28 4q-14-3-29.5-4.5T700-490q-26 0-51 5t-48 13q-18 7-29.5-1T560-499Z"/></g>',
        'ecg-related': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M280-280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h120q17 0 28.5 11.5T440-640q0 17-11.5 28.5T400-600H280q-50 0-85 35t-35 85q0 50 35 85t85 35h120q17 0 28.5 11.5T440-320q0 17-11.5 28.5T400-280H280Zm80-160q-17 0-28.5-11.5T320-480q0-17 11.5-28.5T360-520h240q17 0 28.5 11.5T640-480q0 17-11.5 28.5T600-440H360Zm200 160q-17 0-28.5-11.5T520-320q0-17 11.5-28.5T560-360h120q50 0 85-35t35-85q0-50-35-85t-85-35H560q-17 0-28.5-11.5T520-640q0-17 11.5-28.5T560-680h120q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H560Z"/></g>',
        'patient-all': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M40-240q-17 0-28.5-11.5T0-280v-23q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H40Zm240 0q-17 0-28.5-11.5T240-280v-25q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v25q0 17-11.5 28.5T680-240H280Zm500 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v23q0 17-11.5 28.5T920-240H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"/></g>',
        'patient-pediatric': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M580-490q-21 0-35.5-14.5T530-540q0-21 14.5-35.5T580-590q21 0 35.5 14.5T630-540q0 21-14.5 35.5T580-490Zm-200 0q-21 0-35.5-14.5T330-540q0-21 14.5-35.5T380-590q21 0 35.5 14.5T430-540q0 21-14.5 35.5T380-490Zm100 210q-60 0-108.5-33T300-400h360q-23 54-71.5 87T480-280Zm0 160q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82h-12q-6 0-12 2-6 6-8 13t-2 15q0 21 14.5 35.5T496-680q9 0 16.5-3t15.5-3q12 0 20 9t8 21q0 23-21.5 29.5T496-620q-45 0-77.5-32.5T386-730v-6q0-3 1-8-83 30-135 101t-52 163q0 116 82 198t198 82Zm0-280Z"/></g>',
        'patient-pregnancy': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M400-120v-160h-40q-17 0-28.5-11.5T320-320v-240q0-50 35-85t85-35q50 0 85 35t35 85q36 15 58 48t22 72v120q0 17-11.5 28.5T600-280h-80v160q0 17-11.5 28.5T480-80h-40q-17 0-28.5-11.5T400-120Zm40-600q-33 0-56.5-23.5T360-800q0-33 23.5-56.5T440-880q33 0 56.5 23.5T520-800q0 33-23.5 56.5T440-720Z"/></g>',
        'patient-geriatric': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M540-740q-33 0-56.5-23.5T460-820q0-33 23.5-56.5T540-900q33 0 56.5 23.5T620-820q0 33-23.5 56.5T540-740Zm160 350q-8 0-14-6t-6-14v-19q-54-23-84-51.5T543-557q-11 28-17.5 68.5T521-412l72 102q4 5 5.5 11t1.5 12v207q0 17-11.5 28.5T560-40q-17 0-28.5-11.5T520-80v-160l-71-102-8 130q0 4-8 22L344-72q-10 14-26 16t-30-8q-14-10-16-26t8-30l80-107v-213q0-31 5-67.5t15-67.5l-60 33v102q0 17-11.5 28.5T280-400q-17 0-28.5-11.5T240-440v-125q0-11 5-20.5t15-14.5l156-88q25-14 43.5-21.5T494-717q25 0 45.5 21.5T587-628q32 54 58 81t56 41q11-8 19-11t19-3q25 0 43 18t18 42v400q0 8-6 14t-14 6q-8 0-14-6t-6-14v-400q0-8-6-14t-14-6q-8 0-14 6t-6 14v50q0 8-6 14t-14 6Z"/></g>',
        'patient-immunocompromised': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M521-80q-60 0-150-16.5T227-154q-30-23-63-72t-60.5-107Q76-391 58-449t-18-99q0-85 58-138.5T222-783q60-39 133-68t151-29q78 0 141.5 30T774-777q15 10 39 30t47.5 50q23.5 30 41 70.5T920-534q2 74-30.5 154.5t-88 147Q746-166 673-123T521-80Zm-1-80q62 0 120.5-36T744-287.5q45-55.5 71.5-121T840-532q-2-69-41-113t-70-65q-51-35-105-62.5T506-800q-66 0-130 26t-116 61q-39 26-90 66.5T119-552q0 32 15.5 82t39 100q23.5 50 50.5 92.5t50 59.5q36 27 111 42.5T520-160Zm-106-80q54 0 89-38t35-86q0-22-9-43.5T500-447q-22-20-36-44t-21-53q-10-44-43.5-70T324-640q-49 0-86.5 37.5T200-516q0 39 16.5 87t45.5 90q29 42 68 70.5t84 28.5Zm0-80q-27 0-51-22.5T320.5-396Q302-427 291-460.5T280-516q0-17 13.5-30.5T324-560q12 0 24.5 8.5T366-526q11 42 29.5 75.5T446-388q6 5 9 12t3 14q0 16-12 29t-32 13Zm236-120q17 0 28.5-11.5T690-480v-10l10 5q15 8 30.5 3.5T754-500q9-14 5-30.5T740-555l-10-5 10-5q15-8 18.5-24t-4.5-31q-8-14-23.5-18t-30.5 4l-10 5v-11q0-17-11.5-28.5T650-680q-17 0-28.5 11.5T610-640v11l-9-5q-14-8-30-3.5T546-619q-8 14-4.5 31t19.5 24l9 4-9 6q-14 9-18.5 24.5T546-500q8 15 24.5 19t30.5-4l9-5v10q0 17 11.5 28.5T650-440Zm-168-40Z"/></g>',
        'patient-trauma': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-254 330-104q-23 23-56 23t-56-23L104-218q-23-23-23-56t23-56l150-150-150-150q-23-23-23-56t23-56l114-114q23-23 56-23t56 23l150 150 150-150q23-23 56-23t56 23l114 114q23 23 23 56t-23 56L706-480l150 150q23 23 23 56t-23 56L742-104q-23 23-56 23t-56-23L480-254Zm0-266q17 0 28.5-11.5T520-560q0-17-11.5-28.5T480-600q-17 0-28.5 11.5T440-560q0 17 11.5 28.5T480-520Zm-170-16 114-114-150-150-114 114 150 150Zm90 96q17 0 28.5-11.5T440-480q0-17-11.5-28.5T400-520q-17 0-28.5 11.5T360-480q0 17 11.5 28.5T400-440Zm80 80q17 0 28.5-11.5T520-400q0-17-11.5-28.5T480-440q-17 0-28.5 11.5T440-400q0 17 11.5 28.5T480-360Zm80-80q17 0 28.5-11.5T600-480q0-17-11.5-28.5T560-520q-17 0-28.5 11.5T520-480q0 17 11.5 28.5T560-440Zm-24 130 150 150 114-114-150-150-114 114ZM339-621Zm282 282Z"/></g>',
        'rate-calibration': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M400-840q-17 0-28.5-11.5T360-880q0-17 11.5-28.5T400-920h160q17 0 28.5 11.5T600-880q0 17-11.5 28.5T560-840H400Zm80 440q17 0 28.5-11.5T520-440v-160q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600v160q0 17 11.5 28.5T480-400Zm0 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l28-28q11-11 28-11t28 11q11 11 11 28t-11 28l-28 28q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z"/></g>',
        'rhythm-axis': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-440q-17 0-28.5-11.5T440-480q0-17 11.5-28.5T480-520q17 0 28.5 11.5T520-480q0 17-11.5 28.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320ZM297-277l250-117q6-3 11-8t8-11l117-250q5-10-2.5-17.5T663-683L413-566q-6 3-11 8t-8 11L277-297q-5 10 2.5 17.5T297-277Z"/></g>',
        'intervals': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M160-240q-33 0-56.5-23.5T80-320v-320q0-33 23.5-56.5T160-720h640q33 0 56.5 23.5T880-640v320q0 33-23.5 56.5T800-240H160Zm0-80h640v-320H680v120q0 17-11.5 28.5T640-480q-17 0-28.5-11.5T600-520v-120h-80v120q0 17-11.5 28.5T480-480q-17 0-28.5-11.5T440-520v-120h-80v120q0 17-11.5 28.5T320-480q-17 0-28.5-11.5T280-520v-120H160v320Zm160-160Zm160 0Zm160 0Zm-160 0Z"/></g>',
        'hypertrophy': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M680-160q-17 0-28.5-11.5T640-200v-200q0-17 11.5-28.5T680-440h80q17 0 28.5 11.5T800-400v200q0 17-11.5 28.5T760-160h-80Zm-240 0q-17 0-28.5-11.5T400-200v-560q0-17 11.5-28.5T440-800h80q17 0 28.5 11.5T560-760v560q0 17-11.5 28.5T520-160h-80Zm-240 0q-17 0-28.5-11.5T160-200v-360q0-17 11.5-28.5T200-600h80q17 0 28.5 11.5T320-560v360q0 17-11.5 28.5T280-160h-80Z"/></g>',
        'ischemia-map': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M200-520q-33 0-56.5-23.5T120-600v-160q0-33 23.5-56.5T200-840h160q33 0 56.5 23.5T440-760v160q0 33-23.5 56.5T360-520H200Zm0 400q-33 0-56.5-23.5T120-200v-160q0-33 23.5-56.5T200-440h160q33 0 56.5 23.5T440-360v160q0 33-23.5 56.5T360-120H200Zm400-400q-33 0-56.5-23.5T520-600v-160q0-33 23.5-56.5T600-840h160q33 0 56.5 23.5T840-760v160q0 33-23.5 56.5T760-520H600Zm0 400q-33 0-56.5-23.5T520-200v-160q0-33 23.5-56.5T600-440h160q33 0 56.5 23.5T840-360v160q0 33-23.5 56.5T760-120H600ZM200-600h160v-160H200v160Zm400 0h160v-160H600v160Zm0 400h160v-160H600v160Zm-400 0h160v-160H200v160Zm400-400Zm0 240Zm-240 0Zm0-240Z"/></g>',
        'omi-equivalents': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M360-160q-19 0-34-11t-22-28l-92-241H80q-17 0-28.5-11.5T40-480q0-17 11.5-28.5T80-520h160q13 0 22.5 7t14.5 19l83 218 184-485q7-17 22-28t34-11q19 0 34 11t22 28l92 241h132q17 0 28.5 11.5T920-480q0 17-11.5 28.5T880-440H720q-13 0-22.5-7T683-466l-83-218-184 485q-7 17-22 28t-34 11Z"/></g>',
        'toxic-metabolic-mimics': '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-80q-83 0-141.5-58.5T280-280v-360q-33 0-56.5-23.5T200-720v-80q0-33 23.5-56.5T280-880h400q33 0 56.5 23.5T760-800v80q0 33-23.5 56.5T680-640v360q0 83-58.5 141.5T480-80ZM280-720h400v-80H280v80Zm200 560q50 0 85-35t35-85h-80q-17 0-28.5-11.5T480-320q0-17 11.5-28.5T520-360h80v-80h-80q-17 0-28.5-11.5T480-480q0-17 11.5-28.5T520-520h80v-120H360v360q0 50 35 85t85 35ZM280-720v-80 80Z"/></g>'
    };
    if (typeof window !== 'undefined') window.EM_ICONS = { svg: semanticSvg, map: SEMANTIC_ICONS };

    const TOPIC_CATS = {
        'chest-pain': 'cardio', 'palpitations': 'cardio', 'syncope': 'cardio',
        'dyspnea': 'pulm', 'hemoptysis': 'pulm', 'cyanosis': 'pulm',
        'shock': 'critical', 'limb-ischemia': 'vascular', 'edema': 'vascular',
        'headache': 'neuro', 'dizziness': 'neuro', 'ams': 'neuro', 'coma': 'neuro', 'seizures': 'neuro', 'weakness': 'neuro', 'diplopia': 'neuro', 'focal-neurologic-deficit': 'neuro',
        'abdominal-pain': 'gi', 'gib': 'gi', 'nausea-vomiting': 'gi', 'diarrhea': 'gi', 'constipation': 'gi', 'jaundice': 'gi',
        'pelvic-pain': 'gu', 'vaginal-bleeding': 'obgyn', 'scrotal-pain': 'gu', 'flank-pain': 'gu', 'urinary-retention': 'gu',
        'back-pain': 'msk', 'joint-pain': 'msk',
        'airway-stridor': 'airway', 'anaphylaxis': 'critical', 'rash': 'derm',
        'fever': 'infect', 'sore-throat': 'ent', 'red-eye': 'ent',
        'pediatric-fever': 'peds', 'pediatric-respiratory-distress': 'peds',
        'overdose': 'toxic', 'suicidal': 'psych', 'hyperglycemia': 'endocrine', 'heat-cold': 'environ',
        'multiple-trauma': 'trauma', 'falls-geriatric-trauma': 'trauma', 'pregnancy-emergency': 'obgyn',
        'ecg': 'ecg', 'ecg-explorer': 'ecg', 'learn': 'learn', 'study': 'learn'
    };
    function catFor(id) {
        return (id && TOPIC_CATS[id]) ? TOPIC_CATS[id] : 'generic';
    }
    function groupTitleFor(id) {
        var group = GROUPS.find(function (g) { return g.ids.indexOf(id) >= 0; });
        return group ? group.title : '';
    }

    function catIconKey(cat, id) {
        if (id && SEMANTIC_ICONS[id]) return id;
        return cat || 'generic';
    }

    function iconFor(cp) {
        if (!cp) return '<span class="ios-icon-badge cat-generic" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS['generic'], 'badge-svg') + '</span>';
        const id = cp.id;
        const cat = catFor(id);
        const iconKey = catIconKey(cat, id);
        const svgContent = SEMANTIC_ICONS[iconKey] || SEMANTIC_ICONS[cat] || SEMANTIC_ICONS['generic'];
        return '<span class="ios-icon-badge cat-' + cat + '" data-id="' + id + '" aria-hidden="true">' + semanticSvg(svgContent, 'badge-svg') + '</span>';
    }

    function iconForId(id) {
        if (id === 'ecg' || id === 'ecg-explorer') return '<span class="ios-icon-badge cat-ecg" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS['ecg'], 'badge-svg') + '</span>';
        if (id === 'learn' || id === 'study') return '<span class="ios-icon-badge cat-learn" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS['practice'], 'badge-svg') + '</span>';
        var cp = BY_ID[id] || (Array.isArray(window.CP_DATA) ? window.CP_DATA.find(function (c) { return c.id === id; }) : null);
        if (cp) return iconFor(cp);
        return '<span class="ios-icon-badge cat-generic" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS['generic'], 'badge-svg') + '</span>';
    }

    function getGroupSvg(title) {
        const map = {
            'Cardiorespiratory & vascular': 'cardio',
            'Neurologic': 'neuro',
            'Abdomen, pelvis & GU': 'gi',
            'Airway, allergy, skin & pediatrics': 'pulm',
            'Toxic, metabolic & environmental': 'toxic',
            'Trauma, pregnancy & older adults': 'trauma'
        };
        const key = map[title] || 'generic';
        return semanticSvg(SEMANTIC_ICONS[key] || SEMANTIC_ICONS['generic'], 'group-svg');
    }

    function getSectionSvg(safeKey) {
        if (!safeKey) return semanticSvg(SEMANTIC_ICONS['history'], 'sec-svg');
        if (safeKey.startsWith('ecg-step-')) {
            const step = safeKey.replace('ecg-step-', '');
            if (SEMANTIC_ICONS[step]) return semanticSvg(SEMANTIC_ICONS[step], 'sec-svg');
        }
        if (SEMANTIC_ICONS[safeKey]) return semanticSvg(SEMANTIC_ICONS[safeKey], 'sec-svg');
        return semanticSvg(SEMANTIC_ICONS['history'], 'sec-svg');
    }

    function sectionBadgeClass(safeKey) {
        if (!safeKey) return 'sec-badge-generic';
        if (safeKey === 'dont-miss' || safeKey === 'red-flags' || safeKey === 'first-minutes' || safeKey === 'ecg-red-flags') return 'sec-badge-critical';
        if (safeKey.startsWith('ecg-step-') || safeKey === 'ecg-patterns') return 'sec-badge-ecg';
        if (safeKey === 'how-to-think' || safeKey === 'pearls-pitfalls') return 'sec-badge-pearl';
        if (safeKey === 'references') return 'sec-badge-ref';
        return 'sec-badge-' + safeKey;
    }

    function sevDot(sev) { return '<span class="sev-dot sev-' + sev + '" aria-hidden="true"></span>'; }
    let currentId = null;
    let severityFilter = 'all';
    let searchCursor = -1;
    let deferredInstallPrompt = null;
    let sidebarReturnFocus = null;
    /* Back returns to the destination that opened the current screen (Library, Search,
       Learn or Quick), never always to the first page, and re-focuses the card that
       opened it when that card survives the re-render. Topics and the ECG guide never
       overwrite this context — they only record which card opened them. */
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
    function restoreBackFocus() {
        const source = backSource;
        backSource = null;
        let el = null;
        if (source && source.selector) {
            try { el = stage.querySelector(source.selector); } catch (e) { el = null; }
        }
        if (source && source.y) window.scrollTo({ top: source.y });
        if (el && el.focus) { el.focus({ preventScroll: true }); return; }
        const fallback = document.getElementById('presentationLibraryTitle') || stage.querySelector('h1') || stage;
        if (fallback && fallback.focus) { try { fallback.focus({ preventScroll: true }); } catch (e) {} }
    }
    function backDestination() {
        if ((location.hash || '#library') === backContext.hash) return { hash: '#library', label: 'Library' };
        return { hash: backContext.hash, label: backContext.label };
    }
    function goBack() {
        const dest = backDestination().hash;
        const open = () => {
            history.pushState(null, '', location.pathname + location.search + dest);
            applyRoute(false, true);
            restoreBackFocus();
        };
        if (!window.POCKET_DESIGN || window.POCKET_DESIGN.beforeRoute(open)) open();
    }
    const reviewState = {};
    let patientFilter = 'all';
    let libraryFiltersOpen = false;
    let librarySystem = 'all';
    let caseCursor = 0;
    let offlineStatus = ('serviceWorker' in navigator && navigator.serviceWorker.controller) ? 'Ready for offline use' :
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
        if (id === ECG_TOPIC_ID) return { id: ECG_TOPIC_ID, name: 'Emergency ECG Guide', icon: 'ecg', tag: 'Systematic ECG interpretation' };
        return BY_ID[id] || null;
    }
    function stripTags(s) {
        return String(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }
    function evidenceHtml(id) {
        const evidence = window.CLINICAL_EVIDENCE;
        const keys = evidence && evidence.topics[id];
        if (!Array.isArray(keys)) return '<p class="evidence-note">Foundational references below. No separate topic-specific guideline check is recorded here.</p>';
        const links = keys.map(function (key) {
            const source = evidence.sources[key];
            if (!source || !/^https:\/\//.test(source[1])) return '';
            return '<li><a href="' + esc(source[1]) + '" target="_blank" rel="noopener noreferrer">' + esc(source[0]) + '</a></li>';
        }).join('');
        return '<p class="evidence-note">Selected guidance · source check ' + esc(evidence.checked) + '. These '+keys.length+' source links support selected teaching points, not a complete review of this topic. Check population, setting and local protocol before applying a recommendation.</p><ul class="refs">' + links + '</ul>';
    }
    function toast(msg) {
        const t = document.getElementById('toast');
        t.textContent = msg;
        t.classList.add('show');
        t.style.pointerEvents = '';
        clearTimeout(t._h);
        t._h = setTimeout(() => t.classList.remove('show'), 2200);
    }
    function toastWithAction(msg, actionLabel, onAction) {
        const t = document.getElementById('toast');
        t.textContent = msg + ' ';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = actionLabel;
        btn.style.cssText = 'margin-left:8px;padding:6px 12px;border-radius:999px;border:1px solid var(--accent);background:var(--accent);color:var(--on-fill);font:inherit;font-size:.8rem;cursor:pointer;';
        btn.addEventListener('click', () => {
            t.classList.remove('show');
            if (onAction) onAction();
        });
        t.appendChild(btn);
        t.classList.add('show');
        t.style.pointerEvents = 'auto';
        clearTimeout(t._h);
        t._h = setTimeout(() => { t.classList.remove('show'); t.style.pointerEvents = ''; }, 8000);
    }
    function setTitle(name) {
        document.title = name ? name + ' · The EM Pocket' : 'The EM Pocket — Emergency Medicine Reference';
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
    /* The scheduled state is a state, not a different action, so it reuses the
       same button and the `completed` icon rather than a text tick. */
    function reviewActionLabel(id) {
        if (!isReviewed(id)) return 'Mark reviewed';
        if (isReviewDue(id)) return 'Complete review';
        return semanticSvg(SEMANTIC_ICONS['completed']) + '<span>Review scheduled</span>';
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
    function saveCurrentNote() {
        const note = stage.querySelector('#studyNote');
        if (!note || !note.dataset.noteTopic) return false;
        const persisted = setNote(note.dataset.noteTopic, note.value);
        const status = stage.querySelector('#noteStatus');
        if (status) status.textContent = persisted ? 'Saved on this device.' : 'Could not save on this device. Your draft is still here.';
        if (persisted) note.dispatchEvent(new Event('note-saved'));
        toast(persisted ? 'Learning note saved.' : 'Could not save your note. Keep this page open or copy your draft.');
        return persisted;
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
        list.innerHTML = [['home','Library','home'],['study','Learn','references'],['ecg','ECG','ecg'],['shift','Quick','first-minutes']].map(([key,label,icon]) =>
            '<button type="button" class="side-item" data-nav="'+key+'"><i class="ico" aria-hidden="true">'+(key==='home'?GROUP_SVG.home:semanticSvg(SEMANTIC_ICONS[icon] || SEMANTIC_ICONS.generic))+'</i>'+label+'</button>').join('') +
            '<div class="side-divider"></div><div class="side-secondary"><a class="side-btn" href="#library~saved">Saved topics</a><a class="side-btn" href="#learn~progress">Progress &amp; backup</a><a class="side-btn" href="#settings">Settings &amp; offline</a></div>';
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
        const hiddenMenu = mobile; // Mobile uses the four-destination bottom navigation.
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
            if (burger) {
                burger.setAttribute('aria-expanded', String(!collapsed));
                burger.setAttribute('aria-label', collapsed ? 'Expand presentations sidebar' : 'Collapse presentations sidebar');
                burger.title = collapsed ? 'Expand sidebar' : 'Collapse sidebar';
            }
        } else {
            const burger = document.getElementById('burgerBtn');
            if (burger) {
                burger.setAttribute('aria-label', 'Open presentations menu');
                burger.title = 'Open presentations menu';
            }
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
        return '<button type="button" class="cp-card" data-id="' + cp.id + '" data-cat="' + catFor(cp.id) + '">' +
            '<div class="cp-ico" data-cat="' + catFor(cp.id) + '" data-id="' + cp.id + '" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS[catIconKey(catFor(cp.id), cp.id)] || SEMANTIC_ICONS['generic'], 'badge-svg') + '</div>' +
            '<div class="cp-info"><h3 class="cp-name">' + esc(cp.name) + '</h3><p class="cp-desc">' + esc(cp.tag) + '</p><span class="cp-count">' + count + ' ' + label + ' diagnoses</span></div>' +
            (isReviewed(cp.id) ? '<span class="cp-reviewed">' + semanticSvg(SEMANTIC_ICONS['completed'], 'review-check') + ' ' + esc(reviewLabel(cp.id)) + '</span>' : '') +
            (isSaved(cp.id) ? '<span class="cp-saved">' + STAR_SVG.filled + ' Saved</span>' : '') +
            '<span class="cp-disclosure" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS['chevron-right']) + '</span>' +
            '</button>';
    }
    function bindCards(root) {
        root.querySelectorAll('.cp-card').forEach(card =>
            card.addEventListener('click', () => showPresentation(card.dataset.id)));
    }

    /* ---------- home view ---------- */
    function syncNav(view) {
        /* Reading a topic is part of the Presentations library, so the source tab stays
           lit (iOS keeps the originating tab selected until the user leaves the section).
           Every learn sub-view reports 'study' because it lives in the Practice workspace. */
        const activeNavKey = view === 'presentation' ? 'home' : view === 'ecg-explorer' ? 'ecg' : view;
        document.body.dataset.view = view;
        document.querySelectorAll('[data-nav]').forEach(function (el) {
            const on = (el.getAttribute('data-nav') === activeNavKey);
            el.classList.toggle('on-home', on);
            el.classList.toggle('active-nav', on);
            el.classList.toggle('active', on);
            if (on) el.setAttribute('aria-current', 'page');
            else el.removeAttribute('aria-current');
        });
    }


    function studyDashboardHtml() {
        const due = dueIds();
        const saved = savedIds();
        return '<section class="study-dashboard study-dashboard-compact" aria-label="Personal study tools">' +
            '<div class="study-stats">' +
            '<button type="button" class="study-stat" data-study="due"><span class="stat-emoji stat-icon" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS['due']) + '</span><strong>' + due.length + '</strong><span>due now</span></button>' +
            '<button type="button" class="study-stat" data-study="saved"><span class="stat-emoji stat-icon" aria-hidden="true">' + STAR_SVG.filled + '</span><strong>' + saved.length + '</strong><span>saved topics</span></button>' +
            '<button type="button" class="study-stat" data-study="evolving"><span class="stat-emoji stat-icon" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS['practice']) + '</span><strong>Practice</strong><span>Work through a case</span></button>' +
            '</div></section>';
    }

    const PATIENT_FILTER_OPTIONS = [
            ['all', 'All patients', 'patient-all'],
            ['pediatric', 'Pediatric', 'patient-pediatric'],
            ['pregnancy', 'Pregnancy', 'patient-pregnancy'],
            ['geriatric', 'Older adult', 'patient-geriatric'],
            ['immunocompromised', 'Immunocompromised', 'patient-immunocompromised'],
            ['trauma', 'Trauma', 'patient-trauma']
    ];
    function patientFiltersHtml() {
        return '<div class="patient-filter" role="group" aria-label="Patient context filter"><span>Patient context</span>' + PATIENT_FILTER_OPTIONS.map(function (f) {
            return '<button type="button" class="patient-chip' + (patientFilter === f[0] ? ' active' : '') + '" data-patient="' + f[0] + '" aria-pressed="' + (patientFilter === f[0]) + '"><span class="chip-emoji chip-icon" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS[f[2]]) + '</span>' + f[1] + '</button>';
        }).join('') + '</div>';
    }

    function libraryItems() {
        const group = GROUPS.find(g => g.title === librarySystem);
        return DATA.filter(cp => cpMatchesFilter(cp) && patientMatches(cp) && (!group || group.ids.includes(cp.id)));
    }

    function renderHome(preservePosition) {
        const position = window.scrollY;
        recordBackContext('library');
        currentId = null;
        markActive(null);
        syncNav('home');
        setTitle(null);
        setStageContext('Presentation library');
        if (!DATA.length) {
            stage.innerHTML = '<p class="empty-filter">Could not load presentations. Confirm <code>assets/data.js</code> uploaded with index.html.</p>';
            return;
        }
        const visible = libraryItems();
        const groupsHtml = GROUPS.map(g => {
            const items = g.ids.map(id => BY_ID[id]).filter(cp => cp && visible.includes(cp));
            if (!items.length) return '';
            const cat = catFor(items[0].id);
            return '<section class="home-group" data-cat="' + cat + '">' +
                '<h3 class="group-title"><span class="ios-icon-badge ios-emoji-badge group-badge cat-' + cat + '" aria-hidden="true">' + getGroupSvg(g.title) + '</span>' + esc(g.title) + ' <span>' + items.length + '</span></h3>' +
                '<div class="cp-grid">' + items.map(cardHtml).join('') + '</div></section>';
        }).join('');
        const visibleCount = visible.length;
        const filtered = librarySystem !== 'all' || patientFilter !== 'all' || severityFilter !== 'all';
        const activeFilters = [librarySystem, patientFilter, severityFilter].filter(v => v !== 'all').length;
        stage.innerHTML =
            '<section class="home-intro library-only"><span class="study-kicker">THE EM POCKET · REFERENCE</span><h1>Library</h1><p>Find an emergency presentation and explore its approach, warning signs, workup and disposition.</p><div class="home-meta"><span>' + DATA.length + ' presentations</span><span id="offlineStatus">' + esc(offlineStatus) + '</span></div></section>' +
            '<section class="presentation-library" id="presentationLibrary" aria-labelledby="presentationLibraryTitle" tabindex="-1">' +
            '<div class="library-head"><div><h2 id="presentationLibraryTitle">Presentation library</h2><p>' + visibleCount + ' of ' + DATA.length + ' presentations · grouped by clinical system</p></div>' +
            '<a class="design-action" href="#library~saved">Saved topics · ' + savedIds().length + '</a></div><div class="library-toolbar"><label class="library-system">Clinical system<select id="librarySystem">' +
            '<option value="all"' + (librarySystem === 'all' ? ' selected' : '') + '>All clinical systems</option>' +
            GROUPS.map(g => '<option value="' + esc(g.title) + '"' + (librarySystem === g.title ? ' selected' : '') + '>' + esc(g.title) + '</option>').join('') + '</select></label>' +
            '<div class="library-filter-controls"><details class="library-filters"' + (libraryFiltersOpen ? ' open' : '') + '><summary>Patient context' + (patientFilter !== 'all' ? ' · ' + esc(PATIENT_FILTER_OPTIONS.find(f => f[0] === patientFilter)[1]) : '') + '</summary>' + patientFiltersHtml() + '</details></div></div>' +
            (filtered ? '<div class="library-filter-status" role="status"><span>Filters · ' + activeFilters + ' active · ' + visibleCount + ' presentations</span><button type="button" data-reset-library>Reset filters</button></div>' : '') +
            (groupsHtml || '<div class="empty-filter"><h3>No matching presentations</h3><p>Clear the filters to return to the full library.</p></div>') + '</section>';
        bindCards(stage);
        stage.querySelectorAll('[data-browse-library]').forEach(btn => btn.addEventListener('click', (e) => {
            if (btn.tagName === 'A') e.preventDefault();
            const library = document.getElementById('presentationLibrary');
            if (library) {
                library.focus({ preventScroll: true });
                library.scrollIntoView({ block: 'start', behavior: 'smooth' });
            }
        }));
        stage.querySelector('.library-filters').addEventListener('toggle', function () { if (this.isConnected) libraryFiltersOpen = this.open; });
        stage.querySelector('#librarySystem').addEventListener('change', function () {
            librarySystem = this.value;
            renderHome(true);
            stage.querySelector('#librarySystem').focus({ preventScroll: true });
        });
        const reset = stage.querySelector('[data-reset-library]');
        if (reset) reset.addEventListener('click', function () {
            librarySystem = patientFilter = severityFilter = 'all';
            document.querySelectorAll('#filterChips .chip').forEach(chip => {
                const active = chip.dataset.sev === 'all';
                chip.classList.toggle('active', active);
                chip.setAttribute('aria-pressed', String(active));
            });
            renderHome(true);
            stage.querySelector('#librarySystem').focus({ preventScroll: true });
        });
        stage.querySelectorAll('.patient-chip').forEach(btn => btn.addEventListener('click', function () {
            patientFilter = btn.dataset.patient;
            libraryFiltersOpen = false;
            renderHome(true);
            const selected = stage.querySelector('.library-filters > summary');
            if (selected) selected.focus({ preventScroll: true });
        }));
        stage.querySelectorAll('[data-study]').forEach(btn => btn.addEventListener('click', function () {
            if (btn.dataset.study === 'evolving') { location.hash = 'learn~practice'; return; }
            if (btn.dataset.study === 'case') showStudy('case');
            else showStudy(btn.dataset.study);
        }));
        window.scrollTo({ top: preservePosition ? position : 0 });
        announce('Library — ' + visibleCount + ' of ' + DATA.length + ' presentations');
    }

    function showHome() {
        const open = () => { history.pushState(null, '', location.pathname + location.search + '#library'); if(window.POCKET_DESIGN)window.POCKET_DESIGN.park(); renderHome(); if(window.POCKET_DESIGN)window.POCKET_DESIGN.afterRoute(); };
        if (!window.POCKET_DESIGN || window.POCKET_DESIGN.beforeRoute(open)) open();
    }

    /* ---------- study queue and case practice ---------- */
    function topicListHtml(ids, empty) {
        const unique = ids.filter((id, index) => topicRecord(id) && ids.indexOf(id) === index);
        if (!unique.length) return '<p class="study-empty">' + esc(empty) + '</p>';
        return '<div class="study-topic-list">' + unique.map(function (id) {
            const cp = topicRecord(id);
            return '<button type="button" class="study-topic" data-id="' + cp.id + '"' + (cp.id === ECG_TOPIC_ID ? ' data-ecg="1"' : '') + '><span class="study-topic-ico" data-cat="' + catFor(cp.id) + '" data-id="' + cp.id + '" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS[catIconKey(catFor(cp.id), cp.id)] || SEMANTIC_ICONS['generic'], 'badge-svg') + '</span><div><strong>' + esc(cp.name) + '</strong><small>' + esc(isReviewed(cp.id) ? reviewLabel(cp.id) : 'Not yet reviewed') + (noteFor(cp.id) ? ' · note saved' : '') + '</small></div><b>→</b></button>';
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
    function renderStudy(view, opts) {
        currentId = null;
        const nav = (opts && opts.nav) || 'study';
        const title = (opts && opts.title) || 'Study';
        if (nav === 'home') { recordBackContext('library', '#library~saved'); markActive(null); }
        else { recordBackContext('study', location.hash || '#study~due'); markActive('study'); }
        syncNav(nav); setTitle(title);
        setStageContext((opts && opts.stageContext) || 'Personal study space');
        if(view&&view.indexOf('case-')===0){const i=window.STUDENT_LEARNING.cases.findIndex(c=>c.id===view.slice(5));if(i>=0)caseCursor=i;view='case';}
        const chosen = view === 'saved' ? 'saved' : view === 'case' ? 'case' : 'due';
        const body = chosen === 'case' ? caseHtml() :
            '<section class="study-page"><div class="study-page-head">' + backButtonHtml('data-home="1"') + '<span class="study-kicker">PERSONAL STUDY SPACE</span><h1>' + (chosen === 'due' ? 'Review queue' : 'Saved topics') + '</h1><p>' + (chosen === 'due' ? 'Topics return after 1, 3, 7, and 14 days of review. Complete a review to move it to the next interval.' : 'Use saved topics for weak areas, upcoming rotations, or cases you want to discuss.') + '</p></div>' +
            topicListHtml(chosen === 'due' ? dueIds() : savedIds(), chosen === 'due' ? 'Nothing is due yet. Mark a topic reviewed to start its spaced-review schedule.' : 'No saved topics yet. Save one from any presentation.') + '</section>';
        stage.innerHTML = '<nav class="study-tabs" aria-label="Personal study navigation"><a href="#learn~practice">Practice</a><button type="button" data-study="due"' + (chosen === 'due' ? ' aria-current="page"' : '') + ' class="' + (chosen === 'due' ? 'active' : '') + '" aria-label="Review queue">Review <span>' + dueIds().length + '</span></button><button type="button" data-study="saved"' + (chosen === 'saved' ? ' aria-current="page"' : '') + ' class="' + (chosen === 'saved' ? 'active' : '') + '" aria-label="Saved topics">Saved</button><a href="#learn~progress">Progress</a></nav>' + body;
        stage.querySelectorAll('[data-home]').forEach(btn => btn.addEventListener('click', goBack));
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
        announce(nav === 'home' ? title : 'Study: ' + chosen);
        window.scrollTo({ top: 0 });
        stage.focus({ preventScroll: true });
    }
    function showStudy(view) {
        const route = 'study~' + (view || 'due');
        if ((location.hash || '').replace('#', '') === route) renderStudy(view || 'due');
        else location.hash = route;
    }

    function practiceTarget(id) {
        if (window.STUDENT_LEARNING && window.STUDENT_LEARNING.practiceFor) return window.STUDENT_LEARNING.practiceFor(id);
        return { href: '#learn~practice', label: 'Practice' };
    }

    /* ---------- shift-ready view ---------- */
    const SHIFT_STEP_KEYS = ['first-minutes', 'red-flags', 'workup', 'dont-miss', 'disposition'];
    function shiftHtml(cp) {
        const immediateWorkup = (cp.workup || []).flatMap(w => w[1].map(item => w[0] + ': ' + item));
        const critical = cp.dontMiss;
        const escalation = (cp.disposition || []);
        const practice = practiceTarget(cp.id);
        const step = function (n, title) {
            const iconKey = SHIFT_STEP_KEYS[n - 1] || 'generic';
            return '<h2><span class="shift-step-n">' + n + '</span><span class="ios-icon-badge ios-emoji-badge shift-step-badge" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS[iconKey] || SEMANTIC_ICONS['generic'], 'badge-svg') + '</span><span class="shift-step-t">' + title + '</span></h2>';
        };
        return '<section class="shift-sheet" data-cat="' + catFor(cp.id) + '">' +
            '<div class="shift-sheet-head">' +
            '<div class="shift-head-main">' +
            '<span class="ios-icon-badge ios-emoji-badge shift-hero-badge cat-' + catFor(cp.id) + '" data-id="' + cp.id + '" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS[catIconKey(catFor(cp.id), cp.id)] || SEMANTIC_ICONS['generic'], 'badge-svg') + '</span>' +
            '<div><span class="shift-kicker">' + semanticSvg(SEMANTIC_ICONS['first-minutes'], 'kicker-svg') + ' QUICK REFERENCE</span><h1>' + esc(cp.name) + '</h1><p>' + esc(cp.tag) + '</p></div>' +
            '</div>' +
            '<div class="shift-head-actions">' +
            '<button type="button" class="handover-btn" id="copyHandoverBtn" title="Copy educational reference"><span class="btn-icon btn-emoji" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS['references'], 'btn-svg') + '</span><span>Copy reference</span></button>' +
            '<button type="button" class="review-btn" data-full-id="' + cp.id + '"><span class="btn-icon btn-emoji" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS['generic'], 'btn-svg') + '</span><span>Open full pathway</span></button>' +
            '<a class="review-btn" href="' + esc(practice.href) + '"><span>' + esc(practice.label) + '</span></a>' +
            '</div></div>' +
            '<div class="shift-warning"><span class="ios-icon-badge ios-emoji-badge warning-badge" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS['red-flags'], 'warning-svg') + '</span><span>Educational reference. All approach, red-flag, workup, differential and disposition items from this presentation are shown. Use the full pathway for history, examination and sources.</span></div>' +
            '<div class="shift-grid"><section>' + step(1, 'Approach') + '<ol>' + (cp.approach || []).map(x => '<li>' + esc(x) + '</li>').join('') + '</ol></section>' +
            '<section class="shift-red">' + step(2, 'Escalate now if') + '<ul>' + (cp.redFlags || []).map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></section>' +
            '<section>' + step(3, 'Workup') + '<ul>' + immediateWorkup.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></section>' +
            '<section class="shift-crit">' + step(4, 'Don’t miss') + '<ul>' + critical.map(x => '<li><strong>' + esc(x[0]) + '</strong><br><small>' + esc(x[2]) + '</small></li>').join('') + '</ul></section>' +
            '<section class="shift-disposition">' + step(5, 'Disposition lane') + escalation.map(x => '<div><strong>' + esc(x[0]) + '</strong><p>' + esc(x[1]) + '</p></div>').join('') + '</section></div></section>';
    }
    /* Clipboard access is unavailable on insecure origins and can be denied by the
       browser, so fall back to the legacy copy path and finally to a selectable
       field. Never claim the summary was copied unless it actually was. */
    function legacyCopyText(text) {
        let ta = null;
        try {
            ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;opacity:0;';
            document.body.append(ta);
            ta.focus();
            ta.select();
            ta.setSelectionRange(0, text.length);
            return document.execCommand('copy');
        } catch (e) {
            return false;
        } finally {
            if (ta) ta.remove();
        }
    }

    function manualCopyField(text) {
        const box = stage.querySelector('#handoverFallback');
        if (!box) return;
        box.innerHTML = '<label for="handoverFallbackText">Clipboard blocked — copy the reference manually</label>' +
            '<textarea id="handoverFallbackText" rows="6" readonly></textarea>';
        const field = box.querySelector('textarea');
        field.value = text;
        field.focus();
        field.setSelectionRange(0, text.length);
        box.hidden = false;
    }

    function copyHandoverSummary(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
                toast('Educational reference copied to clipboard.');
            }).catch(function () {
                if (legacyCopyText(text)) toast('Educational reference copied to clipboard.');
                else { toast('Clipboard blocked. Select the text and copy it manually.'); manualCopyField(text); }
            });
            return;
        }
        if (legacyCopyText(text)) { toast('Educational reference copied to clipboard.'); return; }
        toast('Clipboard unavailable in this browser. Copy the reference manually.');
        manualCopyField(text);
    }

    function setupHandoverCopy(cp) {
        const copyBtn = stage.querySelector('#copyHandoverBtn');
        if (!copyBtn) return;
        copyBtn.addEventListener('click', function () {
            const rfText = (cp.redFlags || []).join('; ');
            const immediateWorkup = (cp.workup || []).flatMap(w => w[1].map(item => w[0] + ': ' + item));
            const text = 'The EM Pocket educational reference (not a patient handover): ' + cp.name + '\n' +
                'Red Flags: ' + (rfText || 'None listed') + '\n' +
                'Approach: ' + ((cp.approach || []).join('; ') || 'Standard resuscitation') + '\n' +
                'Workup: ' + (immediateWorkup.join('; ') || 'Per protocol') + '\n' +
                'Important diagnoses: ' + cp.dontMiss.map(d=>d[0]+': '+d[2]).join('; ') + '\n' +
                'Disposition: ' + cp.disposition.map(d=>d[0]+': '+d[1]).join('; ') + '\n' +
                'Sources: ' + cp.refs.join('; ') + '\nEducational reference. Apply clinical judgment and local protocols.';
            copyHandoverSummary(text);
        });
    }

    function renderShift(id) {
        recordBackContext('shift');
        if (!DATA.length) {
            currentId = null;
            markActive('shift'); syncNav('shift'); setTitle('Quick');
            setStageContext('Quick reference');
            stage.innerHTML = '<section class="study-page"><div class="study-page-head">' + backButtonHtml('data-home="1"') + '<h1>Quick view unavailable</h1><p>Presentation data could not be loaded. Confirm <code>assets/data.js</code> is available, then refresh.</p></div></section>';
            stage.querySelector('[data-home]').addEventListener('click', goBack);
            return;
        }
        if (!id || !BY_ID[id]) {
            currentId=null; syncNav('shift');setTitle('Quick');setStageContext('Quick reference');
            stage.innerHTML='<header class="design-header"><span class="study-kicker">THE EM POCKET · FOCUSED REFERENCE</span><h1>Quick</h1><p>Choose a presentation to see its approach, red flags, workup, important diagnoses and disposition together.</p></header><section class="settings-section"><label for="quickPresentation">Presentation</label><select id="quickPresentation"><option value="">Choose a presentation…</option>'+DATA.map(cp=>'<option value="'+cp.id+'">'+esc(cp.name)+'</option>').join('')+'</select><p class="clinical-safety-note">Educational reference. Read the full pathway for history, examination, supporting sources and context.</p></section>';
            stage.querySelector('#quickPresentation').onchange=function(){if(this.value)showShift(this.value);};window.scrollTo({top:0});return;
        }
        const cp = BY_ID[id];
        currentId = cp.id; markActive(cp.id); syncNav('shift'); setTitle('Quick · ' + cp.name);
        setStageContext('Quick reference for ' + cp.name);
        stage.innerHTML = '<div class="shift-topline">' +
            backButtonHtml('data-home="1"') +
            '<div class="shift-select-wrap">' +
            '<span class="ios-icon-badge ios-emoji-badge shift-select-badge cat-' + catFor(cp.id) + '" data-id="' + cp.id + '" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS[catIconKey(catFor(cp.id), cp.id)] || SEMANTIC_ICONS['generic'], 'badge-svg') + '</span>' +
            '<label for="shiftSelect" class="sr-only">Presentation</label>' +
            '<select id="shiftSelect">' + orderedIds().map(function (pid) {
                const item = BY_ID[pid];
                return '<option value="' + item.id + '"' + (item.id === cp.id ? ' selected' : '') + '>' + esc(item.name) + '</option>';
            }).join('') + '</select>' +
            '</div></div>' + shiftHtml(cp) +
            '<div class="handover-fallback" id="handoverFallback" hidden></div>';
        document.getElementById('shiftSelect').addEventListener('change', function () { showShift(this.value); });
        stage.querySelector('[data-home]').addEventListener('click', goBack);
        stage.querySelector('[data-full-id]').addEventListener('click', function () { showPresentation(this.dataset.fullId); });
        setupHandoverCopy(cp);
        window.scrollTo({ top: 0 });
        announce('Quick view: ' + cp.name);
        stage.focus({ preventScroll: true });
    }

    function showShift(id) {
        const fallbackId = id || currentId;
        const route = 'shift' + (fallbackId ? '~' + fallbackId : '');
        if ((location.hash || '').replace('#', '') === route) renderShift((route.split('~')[1]));
        else location.hash = route;
    }

    /* Marks the rail entry for whichever section currently owns the viewport.
       Re-created per render; the previous observer is disconnected first so
       navigating between presentations cannot leave two running. */
    let railObserver = null;
    function observeRail() {
        if (railObserver) { railObserver.disconnect(); railObserver = null; }
        const rail = document.querySelector('.pres-rail');
        if (!rail || !('IntersectionObserver' in window)) return;
        const links = {};
        rail.querySelectorAll('.rail-jump').forEach(function (b) { links[b.dataset.jump] = b; });
        const targets = Object.keys(links)
            .map(function (k) { return document.getElementById('section-' + k); })
            .filter(Boolean);
        if (!targets.length) return;
        const visible = new Set();
        railObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) visible.add(e.target.id.replace('section-', ''));
                else visible.delete(e.target.id.replace('section-', ''));
            });
            // Topmost visible section wins, so the marker never sits below the fold.
            let active = null;
            for (const t of targets) {
                const key = t.id.replace('section-', '');
                if (visible.has(key)) { active = key; break; }
            }
            if (!active && window.scrollY < 40) active = targets[0].id.replace('section-', '');
            Object.keys(links).forEach(function (k) {
                const on = k === active;
                links[k].classList.toggle('current', on);
                if (on) links[k].setAttribute('aria-current', 'true');
                else links[k].removeAttribute('aria-current');
            });
        }, { rootMargin: '-88px 0px -62% 0px', threshold: 0 });
        targets.forEach(function (t) { railObserver.observe(t); });
    }

    /* The header height is needed by the sticky reading progress bar and the
       desktop section rail. Write it to :root so there is one source of truth:
       setting it on a single element left .pres-rail-wrap reading a stale
       hard-coded value. The bar is not laid out yet on some paths, so keep the
       last known value when there is nothing to measure. */
    let lastTopbarH = 0;
    function syncTopbarHeight() {
        const topbar = document.querySelector('.topbar');
        const h = topbar ? topbar.offsetHeight : 0;
        if (!h || h === lastTopbarH) return;
        lastTopbarH = h;
        document.documentElement.style.setProperty('--topbar-h', h + 'px');
        document.documentElement.style.setProperty('--topbar-height', h + 'px');
    }

    /* Reading progress. Module scope: registered by init() on scroll/resize and
       called directly by renderPresentation() once the rail is in the DOM. */
    let readBarFrame = 0;
    function syncReadProgress() {
        readBarFrame = 0;
        syncTopbarHeight();
        const bar = document.getElementById('readBar');
        if (!bar) return;
        const doc = document.documentElement;
        const span = doc.scrollHeight - window.innerHeight;
        const pct = span > 8 ? Math.min(100, Math.max(0, (window.scrollY / span) * 100)) : 0;
        bar.style.width = pct.toFixed(2) + '%';
    }

    /* ---------- presentation view ---------- */
    function sectionCard(icon, title, bodyHtml, closed, key) {
        const sectionId = 'section-' + (key || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
        const safeKey = key || '';
        const badgeClass = sectionBadgeClass(safeKey);
        const iconMarkup = '<span class="ios-icon-badge ios-emoji-badge sec-badge ' + badgeClass + '" aria-hidden="true">' + getSectionSvg(safeKey) + '</span>';
        /* The heading wraps the button rather than living inside it: a heading
           nested in a button is invalid ARIA and is not reliably exposed. This is
           the standard accordion pattern and closes the h1 -> h4 jump in the
           document outline without touching any existing heading. */
        return '<section class="section-card ' + (closed ? 'closed' : '') + '" id="' + sectionId + '" data-section="' + safeKey + '">' +
            '<h2 class="sec-heading"><button class="sec-head" type="button" aria-expanded="' + (!closed) + '" aria-controls="' + sectionId + '-body">' +
            '<span class="sec-ico" data-section-ico="' + safeKey + '" aria-hidden="true">' + iconMarkup + '</span>' +
            '<span class="sec-title">' + title + '</span>' +
            '<span class="arrow"><svg class="sec-chevron" data-icon="expand_more" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" fill="currentColor" stroke="none"><g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none"><path d="M480-362q-8 0-15-2.5t-13-8.5L268-557q-11-11-11-28t11-28q11-11 28-11t28 11l156 156 156-156q11-11 28-11t28 11q11 11 11 28t-11 28L508-373q-6 6-13 8.5t-15 2.5Z"/></g></svg></span></button></h2>' +
            '<div class="sec-body" id="' + sectionId + '-body">' + bodyHtml + '</div></section>';
    }

    function firstMinutesHtml(cp) {
        const steps = (cp.approach || []).slice(0, 3);
        return '<aside class="case-rail" aria-label="First five minutes">' +
            '<div class="case-rail-title"><span class="ios-icon-badge ios-emoji-badge rail-ico" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS['first-minutes']) + '</span><div><strong>First 5 minutes</strong><small>Start here, then work the case</small></div></div>' +
            '<ol class="case-steps">' + steps.map((step, i) =>
                '<li><span>' + (i + 1) + '</span>' + esc(step) + '</li>').join('') + '</ol>' +
            '</aside>';
    }

    const RAIL_SECTIONS = [
        ['how-to-think', 'Approach', 'how'],
        ['dont-miss', 'Don’t miss', 'critical'],
        ['red-flags', 'Red flags', 'critical'],
        ['history', 'Focused history', ''],
        ['exam', 'Examination', ''],
        ['workup', 'Workup', ''],
        ['disposition', 'Disposition', ''],
        ['pearls-pitfalls', 'Pearls & pitfalls', ''],
        ['study', 'Recall & notes', ''],
        ['see-also', 'See also', ''],
        ['references', 'References', '']
    ];
    /* The step rail scrolls horizontally. The full step names total ~1900px, so
       chips carry a short label and keep the full name as a tooltip. */
    const ECG_STEP_SHORT = {
        'rate-calibration': 'Rate & leads',
        'rhythm-axis': 'Rhythm & axis',
        'intervals': 'Intervals',
        'hypertrophy': 'Chambers',
        'ischemia-map': 'Ischemia map',
        'omi-equivalents': 'OMI mimics',
        'toxic-metabolic-mimics': 'Toxic mimics'
    };

    function stepShortName(step) {
        return ECG_STEP_SHORT[step.id] || step.name;
    }

    /* The step rail is a horizontal scroller far wider than a phone. Drive a
       progress bar from its scroll position, drop the trailing fade once the end
       is reached, and keep the active step in view. */
    function setupStepRail() {
        const rail = stage.querySelector('.ecg-step-nav');
        if (!rail) return;
        const bar = document.getElementById('stepRailProgress');
        function sync() {
            const max = rail.scrollWidth - rail.clientWidth;
            const ratio = max > 4 ? rail.scrollLeft / max : 1;
            rail.classList.toggle('at-end', max <= 4 || ratio > 0.985);
            if (bar) {
                const fill = bar.querySelector('i');
                const pct = Math.round(Math.min(1, Math.max(0.08, rail.clientWidth / rail.scrollWidth)) * 100);
                if (fill) fill.style.width = pct + '%';
            }
        }
        rail.addEventListener('scroll', sync, { passive: true });
        sync();
        if (rail.scrollWidth > rail.clientWidth + 4) {
            rail.dataset.scrollable = 'true';
        }
    }

    function scrollStepChipIntoView(chip) {
        const rail = chip && chip.closest('.ecg-step-nav');
        if (!rail || rail.scrollWidth <= rail.clientWidth + 4) return;
        const left = chip.offsetLeft - (rail.clientWidth - chip.offsetWidth) / 2;
        rail.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    }

    function presentationTocHtml() {
        const sections = RAIL_SECTIONS.filter(function (s) { return s[0] !== 'exam' && s[0] !== 'pearls-pitfalls' && s[0] !== 'see-also' && s[0] !== 'references'; })
            .map(function (s) { return [s[0], s[1]]; });
        return '<nav class="presentation-toc" aria-label="Presentation sections">' + sections.map(item =>
            '<button type="button" class="section-jump" data-jump="' + item[0] + '">' + esc(item[1]) + '</button>').join('') + '</nav>';
    }
    /* Persistent map for wide screens. Markup only — the click behaviour is the
       same jumpToSection() the horizontal chips already use, and the current
       position is marked by an observer rather than by polling. */
    function presentationRailHtml() {
        return '<nav class="pres-rail" aria-label="Sections">' +
            '<span class="pres-rail-label">On this page</span>' +
            RAIL_SECTIONS.map(function (s) {
                return '<button type="button" class="rail-jump' + (s[2] ? ' rail-' + s[2] : '') + '" data-jump="' + s[0] + '">' +
                    '<span class="rail-dot" aria-hidden="true"></span>' + esc(s[1]) + '</button>';
            }).join('') + '</nav>';
    }

    function personalPlanHtml(cp) {
        const note = noteFor(cp.id);
        return '<section class="personal-plan" aria-label="Personal study notes"><div><span class="study-kicker">PRIVATE TO THIS DEVICE</span><h2>Your learning note</h2><p>Capture a weak point, a teaching pearl, or a question to take to your next shift.</p></div><div class="personal-controls"><button type="button" class="save-topic' + (isSaved(cp.id) ? ' active' : '') + '" id="saveTopic" aria-pressed="' + isSaved(cp.id) + '">' + saveButtonContent(isSaved(cp.id)) + '</button><span class="review-status">' + esc(isReviewed(cp.id) ? reviewLabel(cp.id) : 'Review schedule starts when marked reviewed') + '</span></div><label for="studyNote">Private note</label><textarea id="studyNote" data-note-topic="' + esc(cp.id) + '" rows="3" maxlength="800" placeholder="Example: I need to revisit the disposition threshold…">' + esc(note) + '</textarea><div class="note-actions"><button type="button" class="rf-clear" id="saveNote">Save note</button><span id="noteStatus"></span></div></section>';
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
                return '<div class="cluster"><h3>' + esc(s.slice(0, cut)) + '</h3><p>' + esc(s.slice(cut + 2)) + '</p></div>';
            }
            return '<div class="cluster"><p>' + esc(s) + '</p></div>';
        }).join('') + '</div>';
    }

    function dxCards(cp) {
        const items = cp.dontMiss.filter(d => severityFilter === 'all' || d[1] === severityFilter);
        if (!items.length) return '<p style="font-size:.84rem;color:var(--ink-soft);padding:6px 0">No diagnoses in this severity tier.</p>';
        return '<div class="dx-grid">' + items.map(d => {
            const name = d[0], sev = d[1], key = d[2];
            return '<div class="dx-card sev-' + sev + '"><h3>' + sevDot(sev) + esc(name) +
                ' <span class="sev-tag">' + (SEV_LABEL[sev] || sev) + '</span></h3>' +
                '<div class="dx-key"><strong>Key:</strong> ' + esc(key) + '</div></div>';
        }).join('') + '</div>';
    }

    function relatedHtml(id, closed) {
        const ids = (RELATED[id] || []).filter(x => BY_ID[x]);
        const ecgChip = (getEcg() && ECG_FROM_PRESENTATIONS[id])
            ? '<button type="button" class="related-chip" data-ecg="1"><span class="chip-ico" data-cat="ecg" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS['ecg'], 'badge-svg') + '</span>ECG Guide</button>'
            : '';
        if (!ids.length && !ecgChip) return '';
        return sectionCard('', 'See also',
            '<div class="related">' + ids.map(rid => {
                const r = BY_ID[rid];
                return '<button type="button" class="related-chip" data-id="' + r.id + '"><span class="chip-ico" data-cat="' + catFor(r.id) + '" data-id="' + r.id + '" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS[catIconKey(catFor(r.id), r.id)] || SEMANTIC_ICONS['generic'], 'badge-svg') + '</span>' + esc(r.name) + '</button>';
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

        const groupTitle = groupTitleFor(cp.id);
        const breadcrumbHtml = groupTitle
            ? '<nav class="breadcrumbs" aria-label="Topic path"><span class="crumb-group">' + esc(groupTitle) + '</span><span class="crumb-sep" aria-hidden="true">›</span><span class="crumb-current" aria-current="page">' + esc(cp.name) + '</span></nav>'
            : '';

        stage.innerHTML =
            '<div class="pres-layout" data-cat="' + catFor(cp.id) + '">' +
            '<div class="pres-rail-wrap">' + presentationRailHtml() + '</div>' +
            '<div class="pres-main">' +
            breadcrumbHtml +
            '<div class="cp-hero-nav">' +
            backButtonHtml('id="backBtn"') +
            '</div>' +
            '<div class="cp-hero" data-cat="' + catFor(cp.id) + '">' +
            '<div class="cp-hero-inner">' +
            '<div class="cp-ico-lg" data-cat="' + catFor(cp.id) + '" data-id="' + cp.id + '" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS[catIconKey(catFor(cp.id), cp.id)] || SEMANTIC_ICONS['generic'], 'badge-svg') + '</div>' +
            '<div class="cp-hero-text">' +
            (groupTitle ? '<div class="cp-hero-badge-row"><span class="cp-cat-badge" data-cat="' + catFor(cp.id) + '">' + esc(groupTitle) + '</span></div>' : '') +
            '<h1 id="presentationTitle" tabindex="-1">' + esc(cp.name) + '</h1>' +
            '</div></div>' +
            '<p class="tag">' + esc(cp.tag) + '</p></div>' +

            presentationTocHtml() +
            sectionCard('', 'How to think', overviewHtml(cp), isClosed('how-to-think', false), 'how-to-think') +
            firstMinutesHtml(cp) +

            sectionCard('', dxTitle, '<div class="severity-slot" data-severity-slot></div>' + dxCards(cp), isClosed('dont-miss'), 'dont-miss') +

            sectionCard('', 'Interactive Red-Flag Checklist',
                '<div class="rf-box"><div class="rf-banner" id="rfBanner"></div>' +
                '<p style="font-size:.78rem;color:var(--ink-soft);margin-bottom:6px">' +
                'Select warning signs for educational review. Selections stay in this session and are not a patient record or a severity score.</p><div class="rf-tools"><button type="button" class="rf-clear" id="clearRedFlags">Clear selected</button><button type="button" class="rf-clear" id="copyReview">Copy review</button></div>' + rfItems +
                '<div class="rf-progress"><i id="rfBar"></i></div></div>', isClosed('red-flags'), 'red-flags') +

            sectionCard('', 'Focused History', clusterGrid(cp.history), isClosed('history', true), 'history') +

            sectionCard('', 'Examination Clusters', clusterGrid(cp.exam), isClosed('exam', true), 'exam') +

            sectionCard('', 'Workup',
                '<div class="wu-grid">' + cp.workup.map(w =>
                    '<div class="wu-col"><h3>' + esc(w[0]) + '</h3><ul>' +
                    w[1].map(i => '<li>' + esc(i) + '</li>').join('') + '</ul></div>').join('') + '</div>' +
                '<details class="medication-safety"><summary>Medication safety reminder</summary><p>Use this as a first-pass prompt; verify all medications, doses, concentrations, contraindications, weight, pregnancy status, and local protocols before administration.</p><p>Check indication, allergy, route, renal/hepatic risk, interactions, monitoring, and local formulary.</p></details>', isClosed('workup'), 'workup') +

            sectionCard('', 'Disposition Pathway',
                '<div class="disp-grid">' + cp.disposition.map(d => {
                    const cls = dispClass(d[0]);
                    return '<div class="disp-col ' + cls + '"><h3>' + esc(d[0]) +
                        '</h3><ul><li>' + esc(d[1]) + '</li></ul></div>';
                }).join('') + '</div><p class="clinical-safety-note">Use objective reassessment and the local pathway.</p>' + (window.EM_LEARNING ? window.EM_LEARNING.reassessmentHtml(cp) : ''), isClosed('disposition'), 'disposition') +

            sectionCard('', 'Pearls & Pitfalls',
                '<div class="pp-grid"><div class="pp-box pearls"><h3>Clinical Pearls</h3><ul class="plain-list">' +
                (Array.isArray(cp.pearls) && cp.pearls.length
                    ? cp.pearls.map(p => '<li>' + esc(p) + '</li>')
                    : cp.dontMiss.filter(d => d[1] === 'critical').slice(0, 4).map(d =>
                        '<li><strong>' + esc(d[0]) + ':</strong> ' + esc(d[2]) + '</li>')
                ).join('') +
                '</ul></div><div class="pp-box pitfalls"><h3>Pitfalls</h3><ul class="plain-list">' +
                cp.pitfalls.map(p => '<li>' + esc(p) + '</li>').join('') +
                '</ul></div></div>', isClosed('pearls-pitfalls', true), 'pearls-pitfalls') +

            '<section class="presentation-study-group" id="section-study" aria-label="Recall and notes" tabindex="-1">' + learningLoopHtml(cp) + personalPlanHtml(cp) + '</section>' +

            relatedHtml(id, isClosed('see-also')) +

            sectionCard('', 'References',
                evidenceHtml(cp.id) + (window.EM_LEARNING ? window.EM_LEARNING.evidenceContext(cp.id) : '') + '<ul class="refs">' + cp.refs.map(r => '<li>' + esc(r) + '</li>').join('') + '</ul>', isClosed('references', true), 'references') +

            pagerHtml(id) +
            '</div></div>';

        document.getElementById('backBtn').addEventListener('click', goBack);
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
        stage.querySelectorAll('.case-action, .section-jump, .rail-jump').forEach(btn =>
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
                reviewBtn.innerHTML = reviewActionLabel(cp.id);
                const status = document.querySelector('.review-status');
                if (status) status.textContent = 'Review schedule starts when marked reviewed';
                toast('Removed from your review schedule.' + (removal.persisted ? '' : ' This change lasts for this session only.'));
                return;
            }
            const result = setReviewed(cp.id, true);
            reviewBtn.setAttribute('aria-pressed', 'true');
            reviewBtn.innerHTML = reviewActionLabel(cp.id);
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
            saveTopic.innerHTML = saveButtonContent(saved);
            toast((saved ? 'Saved to your study list.' : 'Removed from saved topics.') + (persisted ? '' : ' This change lasts for this session only.'));
        });
        const saveNote = document.getElementById('saveNote');
        if (saveNote) saveNote.addEventListener('click', saveCurrentNote);
        setupRedFlags(cp, state);
        const readBar = document.getElementById('readBar');
        if (readBar) {
            readBar.style.width = '0%';
            window.requestAnimationFrame(syncReadProgress);
        }
        /* The rail is rebuilt inside stage.innerHTML on every render, including
           preservePosition re-renders from the severity filter, so the observer must
           re-attach unconditionally or it would watch detached nodes and the
           highlight would freeze. */
        observeRail();
        if (target) {
            if (jumpToSection(target, true) === false) showSectionUnavailable('#' + id);
        }
        else if (preservePosition) { /* Filtering keeps the clinician in the same reading position. */ }
        else {
            window.scrollTo({ top: 0 });
            stage.focus({ preventScroll: true });
            announce('Viewing ' + cp.name);
        }
    }

    function jumpToSection(target, fromSearch) {
        const card = document.getElementById('section-' + target);
        if (!card) return false;
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
        const chip = stage.querySelector('.ecg-step-chip[data-jump="' + target + '"]');
        if (chip) {
            chip.classList.add('active');
            chip.setAttribute('aria-current', 'true');
            scrollStepChipIntoView(chip);
        }
        return true;
    }

    function showPresentation(id, target) {
        const route = id + (target ? '~' + target : '');
        if ((location.hash || '').replace('#', '') === route) {
            const render=()=>{if(window.POCKET_DESIGN)window.POCKET_DESIGN.park();renderPresentation(id,target);if(window.POCKET_DESIGN)window.POCKET_DESIGN.afterRoute();};
            if(!window.POCKET_DESIGN || window.POCKET_DESIGN.beforeRoute(render))render();
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
                reviewBtn.innerHTML = reviewActionLabel(ECG_TOPIC_ID);
                const status = document.querySelector('.review-status');
                if (status) status.textContent = 'Review schedule starts when marked reviewed';
                toast('Removed from your review schedule.' + (removal.persisted ? '' : ' This change lasts for this session only.'));
                return;
            }
            const result = setReviewed(ECG_TOPIC_ID, true);
            reviewBtn.setAttribute('aria-pressed', 'true');
            reviewBtn.innerHTML = reviewActionLabel(ECG_TOPIC_ID);
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
            saveTopic.innerHTML = saveButtonContent(saved);
            toast((saved ? 'Saved to your study list.' : 'Removed from saved topics.') + (persisted ? '' : ' This change lasts for this session only.'));
        });
        const saveNote = document.getElementById('saveNote');
        if (saveNote) saveNote.addEventListener('click', saveCurrentNote);
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
            stage.innerHTML = '<section class="study-page"><div class="study-page-head">' + backButtonHtml('data-home="1"') + '<h1>ECG guide unavailable</h1><p>Confirm <code>assets/data.js</code> includes <code>ECG_DATA</code>, then refresh.</p></div></section>';
            stage.querySelector('[data-home]').addEventListener('click', goBack);
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
                /* Short label for the rail: the full step name is the heading
                   inside the section, so the chip only needs to identify it. */
                return '<button type="button" class="ecg-step-chip" data-jump="ecg-step-' + s.id + '" title="' + esc(s.name) + '"><span>' + s.num + '</span>' + esc(stepShortName(s)) + '</button>';
            }).join('') +
            '<button type="button" class="ecg-step-chip" data-jump="ecg-patterns">Patterns</button></nav>' +
            '<div class="step-rail-meter" id="stepRailProgress" aria-hidden="true"><i></i></div>';
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
            return sectionCard('', 'Step ' + s.num + ' · ' + s.name,
                '<p class="ecg-summary">' + esc(s.summary) + '</p>' +
                ecgFigure(s.id) + (s.id === 'rate-calibration' ? ecgFigure('normal-12lead') : '') +
                ecgDetailList(s.details) +
                '<div class="pp-grid ecg-pp"><div class="pp-box pearls"><h4>Pearl</h4><p>' + esc(s.pearl || '') + '</p></div>' +
                '<div class="pp-box pitfalls"><h4>Pitfall</h4><p>' + esc(s.pitfall || '') + '</p></div></div>',
                s.num !== 1, 'ecg-step-' + s.id);
        }).join('');
        const ECG_CAT_ICON_KEYS = {
            'all': 'patient-all',
            'stemi': 'first-minutes',
            'ischemia': 'cardio',
            'rhythm': 'ecg',
            'conduction': 'rhythm-axis',
            'metabolic': 'toxic'
        };
        const cats = [['all', 'All patterns']].concat(Object.keys(ECG_CAT_LABEL).map(function (k) { return [k, ECG_CAT_LABEL[k]]; }));
        const filters = '<div class="ecg-filters" role="group" aria-label="ECG pattern category">' +
            cats.map(function (c) {
                const iconKey = ECG_CAT_ICON_KEYS[c[0]] || 'generic';
                return '<button type="button" class="chip' + (ecgCategory === c[0] ? ' active' : '') + '" data-ecg-cat="' + c[0] + '" aria-pressed="' + String(ecgCategory === c[0]) + '"><span class="chip-emoji chip-icon" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS[iconKey] || SEMANTIC_ICONS['generic']) + '</span>' + esc(c[1]) + '</button>';
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
            '<div class="learning-head"><div><span class="learning-kicker">RAPID RECALL REFRESHER</span><h2><span class="ios-icon-badge ios-emoji-badge sec-badge-sm" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS['pearls-pitfalls']) + '</span>Rapid recall</h2><p>Test your first action and the dangerous patterns before revealing the answer.</p></div>' +
            '<button type="button" class="review-btn" id="reviewBtn" aria-pressed="' + isReviewed(ECG_TOPIC_ID) + '">' + reviewActionLabel(ECG_TOPIC_ID) + '</button></div>' +
            '<div class="recall-grid">' +
            '<div class="recall-card"><span>01 · First move</span><p>The patient is hypotensive with a wide-complex tachycardia. What happens before a prettier 12-lead?</p><button type="button" class="reveal-btn" data-reveal="ecg-action">Reveal answer</button><div class="reveal-answer" id="recall-ecg-action" hidden>' + esc(first) + '</div></div>' +
            '<div class="recall-card"><span>02 · Killer patterns</span><p>Name three ECG patterns that should change management in the next minutes.</p><button type="button" class="reveal-btn" data-reveal="ecg-threats">Reveal answer</button><div class="reveal-answer" id="recall-ecg-threats" hidden>' + esc(killers.join(' · ')) + '</div></div>' +
            '</div></section>';
        const related = ecg.related.length
            ? sectionCard('', 'See also',
                '<div class="related">' + ecg.related.map(function (rid) {
                    const r = BY_ID[rid];
                    return '<button type="button" class="related-chip" data-id="' + r.id + '"><span class="chip-ico" data-cat="' + catFor(r.id) + '" data-id="' + r.id + '" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS[catIconKey(catFor(r.id), r.id)] || SEMANTIC_ICONS['generic'], 'badge-svg') + '</span>' + esc(r.name) + '</button>';
                }).join('') + '</div>', true, 'ecg-related')
            : '';

        stage.innerHTML =
            '<div class="cp-hero-nav">' +
            backButtonHtml('id="backBtn"') +
            '</div>' +
            '<div class="cp-hero" data-cat="ecg">' +
            '<div class="cp-hero-inner">' +
            '<div class="cp-ico-lg" data-cat="ecg" data-id="ecg" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS['ecg'], 'badge-svg') + '</div>' +
            '<div class="cp-hero-text">' +
            '<div class="cp-hero-badge-row"><span class="cp-cat-badge" data-cat="ecg">Cardiovascular · Diagnostic</span></div>' +
            '<h1 id="ecgTitle" tabindex="-1">ECG interpretation</h1>' +
            '</div></div>' +
            '<p class="tag">' + esc(ecg.tag) + '</p>' +
            (ecg.subtitle ? '<p class="ecg-subhead">' + esc(ecg.subtitle) + '</p>' : '') +
            '</div>' +
            stepNav +
            '<p class="student-safety">'+esc(ecg.firstPass[0])+'</p><details class="reference-firstpass"><summary>Urgent ECG assessment · reference checklist</summary>'+firstPassHtml+'</details>'+
            stepsHtml +
            killerHtml +
            '<div class="severity-slot" data-severity-slot></div>' +
            sectionCard('', 'Pattern library',
                '<p class="ecg-summary">Choose a category. Severity narrows this library.</p>' +
                filters + patternsHtml, true, 'ecg-patterns') +
            sectionCard('', 'How to think',
                '<div class="ov"><p class="ov-job"><span class="ov-kicker">The job</span>' + esc(ecg.tag) + '</p>' +
                '<ol class="ov-steps">' + ecg.firstPass.map(function (s, i) {
                    return '<li><span class="ov-n" aria-hidden="true">' + (i + 1) + '</span><span class="ov-s">' + esc(s) + '</span></li>';
                }).join('') + '</ol>' +
                (ecg.overview ? '<div class="ov-prose"><p>' + esc(ecg.overview) + '</p></div>' : '') + '</div>',
                true, 'ecg-how') +
            sectionCard('', 'ECG red flags',
                '<div class="rf-box"><p class="ecg-summary">These findings should move the patient to a different lane now.</p><ul class="plain-list">' +
                ecg.redFlags.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></div>',
                false, 'ecg-red-flags') +
            sectionCard('', 'Pearls & Pitfalls',
                '<div class="pp-grid"><div class="pp-box pearls"><h4>Clinical Pearls</h4><ul class="plain-list">' +
                ecg.pearls.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') +
                '</ul></div><div class="pp-box pitfalls"><h4>Pitfalls</h4><ul class="plain-list">' +
                ecg.pitfalls.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') +
                '</ul></div></div>', true, 'pearls-pitfalls') +
            '<section class="presentation-study-group" id="section-study" aria-label="Recall and notes" tabindex="-1">' + recallHtml + personalPlanHtml(fakeCp) + '</section>' +
            related +
            sectionCard('', 'References',
                evidenceHtml('ecg') + '<ul class="refs">' + ecg.refs.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul>'
                + '<p class="ecg-litfl">Diagrams above are original teaching drawings. For real 12-lead tracings see <a href="https://litfl.com/ecg-library/" target="_blank" rel="noopener">LITFL ECG Library</a> — free for non-profit education with credit to litfl.com (CC BY-NC-SA 4.0).</p>',
                true, 'ecg-references');

        document.getElementById('backBtn').addEventListener('click', goBack);
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
        setupStepRail();
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
            requestAnimationFrame(function () { if (jumpToSection(resolveEcgJump(ecg, target), true) === false) showSectionUnavailable('#ecg'); });
        }
    }
    function showEcg(target) {
        const route = 'ecg' + (target ? '~' + target : '');
        if ((location.hash || '').replace('#', '') === route) {const render=()=>{if(window.POCKET_DESIGN)window.POCKET_DESIGN.park();renderEcg(target);if(window.POCKET_DESIGN)window.POCKET_DESIGN.afterRoute();};if(!window.POCKET_DESIGN || window.POCKET_DESIGN.beforeRoute(render))render();}
        else location.hash = route;
    }

    function showExplorer(id) {
        const route='ecg-explorer'+(typeof id==='string'?'~'+id:'');
        if (location.hash === '#'+route) renderExplorer(typeof id==='string'?id:undefined);
        else location.hash = route;
    }
    function renderExplorer(id) {
        recordBackContext('explorer');
        currentId = null;
        markActive('ecg-explorer'); syncNav('ecg'); setTitle('ECG Explorer');
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

    function applyRoute(preservePosition, approved) {
        closeReadingPanel(false);
        const requested = location.href;
        const design = window.POCKET_DESIGN;
        if (design && !approved && !design.beforeRoute(() => { history.replaceState(null, '', requested); applyRoute(preservePosition, true); })) return;
        if (design) design.park();
        const route = (location.hash || '').replace('#', '').split('~');
        const id = route[0], target = route[1];
        if (id === 'search' && design) {recordBackContext('search', location.hash);currentId=null;syncNav('home');setTitle('Search');setStageContext('Search results');let query='';try{query=decodeURIComponent(route.slice(1).join('~')||'');}catch(_){}design.search(query);}
        else if (id === 'settings' && design) { currentId=null; syncNav('settings'); setTitle('Settings'); setStageContext('Settings and offline'); design.settings(); }
        else if (id === 'learn' && window.EM_LEARNING) {
            recordBackContext('learn', location.hash);
            currentId=null; markActive('study'); syncNav(target==='visual-recordings'?'ecg':'study'); setTitle(target==='visual-recordings'?'Recorded ECGs':'Learn'); setStageContext(target==='visual-recordings'?'Recorded ECG learning':'Learning workspace');
            if(design && (!target || ['home','tracks','short'].includes(target) || target.startsWith('track-'))) design.learn(target || 'home');
            else window.EM_LEARNING.mount(stage,target||'practice');
            announce('Learning workspace');
        }
        else if (id === 'library') { if (target === 'saved') { recordBackContext('library', '#library~saved'); renderStudy('saved', { nav: 'home', title: 'Saved topics', stageContext: 'Saved topics in your library' }); } else renderHome(preservePosition); }
        else if (id === 'ecg-hub' && design) { recordBackContext('ecg'); currentId=null; syncNav('ecg'); setTitle('ECG'); setStageContext('ECG learning'); design.ecg(); }
        else if (id === 'study') renderStudy(target || 'due');
        else if (id === 'shift') renderShift(target);
        else if (id === 'ecg-explorer') renderExplorer(target);
        else if (id === ECG_TOPIC_ID) { captureBackSource(); renderEcg(target); }
        else if (id && BY_ID[id]) { captureBackSource(); renderPresentation(id, target, preservePosition); }
        else if (!id || id === 'presentationLibrary') renderHome();
        else renderUnavailablePage();
        if(design)design.afterRoute();
    }

    function renderUnavailablePage() {
        currentId = null;
        syncNav('home');
        setTitle('This page is unavailable');
        setStageContext('This page is unavailable');
        stage.innerHTML = '<section class="design-empty unavailable-route">' +
            '<h1 tabindex="-1">This page is unavailable</h1>' +
            '<p>This link does not match a presentation, section or learning page. Open the library or search to find what you need.</p>' +
            '<div class="design-links"><a class="design-action primary" href="#library">Open the library</a>' +
            '<a class="design-action" href="#search">Search The EM Pocket</a></div></section>';
        const heading = stage.querySelector('h1');
        if (heading && heading.focus) heading.focus({ preventScroll: true });
        window.scrollTo({ top: 0 });
        announce('This page is unavailable');
    }

    function showSectionUnavailable(fallbackHash) {
        const host = stage.querySelector('.pres-main') || stage;
        const notice = document.createElement('div');
        notice.className = 'design-empty route-notice';
        notice.setAttribute('role', 'status');
        notice.innerHTML = '<strong>This section is unavailable in this topic.</strong> ' +
            '<span>Choose a section from the list, or search for it. <a href="' + esc(fallbackHash) + '">View all sections</a> · <a href="#search">Search The EM Pocket</a></span>';
        const anchor = host.querySelector('.cp-hero-nav');
        if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(notice, anchor.nextSibling);
        else host.insertBefore(notice, host.firstChild);
        const title = document.getElementById('presentationTitle') || document.getElementById('ecgTitle') || stage.querySelector('h1') || stage;
        if (title && title.focus) { try { title.focus({ preventScroll: true }); } catch (e) {} }
        announce('This section is unavailable in this topic.');
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
            if (checked > 0) {
                banner.className = 'rf-banner show level-mid';
                banner.textContent = checked + ' warning sign' + (checked > 1 ? 's' : '') + ' selected. Assess each finding and the patient’s condition; a single serious finding may need immediate escalation. The count is not a severity score.';
            } else {
                banner.className = 'rf-banner';
                banner.textContent = '';
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
            const summary = 'The EM Pocket educational review — ' + cp.name + '\nSelected red flags: ' +
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
        if(window.EM_LEARNING) idx.unshift(...window.EM_LEARNING.searchItems());
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

    function findSearchHits(q) {
        if(!q || q.length<2)return [];
        const ql = q.toLowerCase();
        return SEARCH_INDEX.filter(x =>
            x.title.toLowerCase().indexOf(ql) !== -1 ||
            (x.sub && x.sub.toLowerCase().indexOf(ql) !== -1)
        ).sort((a,b)=>{const score=x=>{const title=x.title.toLowerCase();return title===ql?100:title.startsWith(ql)&&(!title[ql.length]||/[^a-z0-9]/.test(title[ql.length]))?80:title.includes(ql)?40:20;};return score(b)-score(a);});
    }

    function runSearch(q) {
        const pop = ensureResultsPop();
        searchCursor = -1;
        const input = document.getElementById('searchInput');
        if (input) input.removeAttribute('aria-activedescendant');
        const clearBtn = document.getElementById('searchClearBtn');
        if (clearBtn) clearBtn.hidden = !q;
        if (!q || q.length < 2) { hideSearchResults(pop); return; }
        const allHits=findSearchHits(q);
        const hits=allHits.slice(0,12);
        pop.innerHTML = hits.length
            ? hits.map((h, i) =>
                '<button type="button" class="res-item" id="search-result-' + i + '" data-id="' + h.cpId + '" data-target="' + h.target + '" role="option" aria-selected="false">' +
                '<span class="res-ico" data-cat="' + catFor(h.cpId) + '" data-id="' + h.cpId + '" aria-hidden="true">' + semanticSvg(SEMANTIC_ICONS[catIconKey(catFor(h.cpId), h.cpId)] || SEMANTIC_ICONS['generic'], 'badge-svg') + '</span>' +
                '<div class="res-body"><div class="r-title">' + esc(h.title) + '</div>' +
                '<div class="r-sub">' + (h.sub ? esc(h.sub) : '') + '</div></div>' +
                '<span class="r-tag">' + esc(h.kind) + '</span></button>').join('')
            : '<div class="res-item res-empty"><div class="r-sub">No results for \u201C' + esc(q) + '\u201D</div><div class="res-empty-actions"><button type="button" class="btn" data-search-action="clear">Clear search</button><button type="button" class="btn" data-search-action="browse">Browse library</button></div></div>';
        if(allHits.length>12)pop.insertAdjacentHTML('beforeend','<button type="button" class="res-item search-all" id="search-result-12" role="option" aria-selected="false" data-id="search" data-target="'+esc(q)+'">View all '+allHits.length+' results →</button>');
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
        pop.querySelectorAll('[data-search-action]').forEach(el =>
            el.addEventListener('click', () => {
                hideSearchResults(pop);
                if (el.dataset.searchAction === 'clear') {
                    input.value = '';
                    if (clearBtn) clearBtn.hidden = true;
                    input.focus();
                    return;
                }
                if ((location.hash || '#library').slice(1).split('~')[0] === 'library') {
                    const library = document.getElementById('presentationLibrary');
                    if (library) {
                        library.focus({ preventScroll: true });
                        library.scrollIntoView({ block: 'start', behavior: 'smooth' });
                    }
                } else {
                    location.hash = 'library';
                }
            }));
    }
    function openSearchHit(id, target) {
        if (id === 'search') location.hash='search~'+encodeURIComponent(target);
        else if (id === 'learn') location.hash='learn~'+target;
        else if (id === 'ecg-explorer') showExplorer(target);
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
    // Keep the first visible character in place when text reflows behind the panel.
    function readingAnchor() {
        const header = document.querySelector('.topbar').getBoundingClientRect().bottom;
        const edge = header + 12;
        for (const element of stage.querySelectorAll('p, li, h1, h2, h3, h4')) {
            const box = element.getBoundingClientRect();
            if (!box.height || box.bottom <= edge || box.top >= innerHeight) continue;
            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
            let node;
            while ((node = walker.nextNode())) {
                if (!node.textContent.trim()) continue;
                const range = document.createRange();
                range.selectNodeContents(node);
                const bounds = range.getBoundingClientRect();
                if (!bounds.height || bounds.bottom <= edge || bounds.top >= innerHeight) continue;
                let low = 0, high = node.length - 1;
                while (low < high) {
                    const mid = Math.floor((low + high) / 2);
                    range.setStart(node, mid); range.setEnd(node, mid + 1);
                    if (range.getBoundingClientRect().bottom <= edge) low = mid + 1;
                    else high = mid;
                }
                range.setStart(node, low); range.setEnd(node, low + 1);
                return { range, top: range.getBoundingClientRect().top, header };
            }
        }
        return { y: window.scrollY };
    }
    function restoreReadingAnchor(anchor) {
        if (!anchor) return;
        if (!anchor.range || !anchor.range.startContainer.isConnected) {
            if (Number.isFinite(anchor.y)) window.scrollTo({ top: anchor.y, behavior: 'instant' });
            return;
        }
        const header = document.querySelector('.topbar').getBoundingClientRect().bottom;
        const delta = anchor.range.getBoundingClientRect().top - anchor.top - (header - anchor.header);
        window.scrollTo({ top: window.scrollY + delta, behavior: 'instant' });
    }
    function positionReadingPanel() {
        const panel = document.getElementById('readingPanel');
        if (!panel || !panel.open) return;
        const button = document.getElementById('toolsToggle').getBoundingClientRect();
        panel.style.setProperty('--reading-panel-top', Math.round(button.bottom + 12) + 'px');
        panel.style.setProperty('--reading-panel-right', Math.max(16, innerWidth - button.right) + 'px');
    }
    let readingReturnFocus = null;
    function closeReadingPanel(restoreFocus = true) {
        const panel = document.getElementById('readingPanel');
        if (!panel || !panel.open) return;
        if (!restoreFocus) readingReturnFocus = null;
        panel.close();
    }
    function openReadingPanel(opener) {
        const panel = document.getElementById('readingPanel');
        if (!panel || panel.open || document.querySelector('dialog[open]')) return;
        hideSearchResults();
        document.querySelectorAll('.context-filters[open], .library-filters[open]').forEach(el => { el.open = false; });
        readingReturnFocus = opener || document.getElementById('toolsToggle');
        document.getElementById('readingStatus').textContent = prefsStorageAvailable ? 'Changes apply immediately.' : 'Changes apply for this session. Device storage is unavailable.';
        document.body.classList.add('reading-panel-open');
        panel.showModal();
        document.getElementById('toolsToggle').setAttribute('aria-expanded', 'true');
        positionReadingPanel();
    }
    function bindReadingPanel() {
        const panel = document.getElementById('readingPanel');
        if (!panel) return;
        const trigger = document.getElementById('toolsToggle');
        trigger.addEventListener('click', () => openReadingPanel(trigger));
        for (const id of ['readingClose', 'readingDone']) document.getElementById(id).addEventListener('click', () => closeReadingPanel());
        document.getElementById('readingSettings').addEventListener('click', () => closeReadingPanel(false));
        panel.addEventListener('cancel', event => { event.preventDefault(); closeReadingPanel(); });
        panel.addEventListener('close', () => {
            document.body.classList.remove('reading-panel-open');
            trigger.setAttribute('aria-expanded', 'false');
            const previous = readingReturnFocus; readingReturnFocus = null;
            if (previous && previous.isConnected) previous.focus({ preventScroll: true });
        });
        const outside = event => {
            const box = panel.getBoundingClientRect();
            return event.target === panel && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom);
        };
        let backdropPress = false;
        panel.addEventListener('pointerdown', event => { backdropPress = outside(event); });
        panel.addEventListener('pointercancel', () => { backdropPress = false; });
        panel.addEventListener('click', event => { if (backdropPress && outside(event)) closeReadingPanel(); backdropPress = false; });
        panel.addEventListener('keydown', event => {
            if (event.key !== 'Tab') return;
            const items = [...panel.querySelectorAll('button:not([disabled]), a[href]')].filter(el => el.getClientRects().length);
            const first = items[0], last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        });
        window.addEventListener('resize', positionReadingPanel, { passive: true });
        window.addEventListener('beforeprint', () => closeReadingPanel(false));
    }
    function changeReadingPrefs(p) {
        const panel = document.getElementById('readingPanel');
        const anchor = panel && panel.open ? readingAnchor() : null;
        const saved = savePrefs(p);
        applyPrefs(p);
        restoreReadingAnchor(anchor);
        positionReadingPanel();
        document.getElementById('readingStatus').textContent = saved ? 'Saved on this device.' : 'Applied for this session. Device storage is unavailable.';
    }
    function applyPrefs(p) {
        const r = document.documentElement;
        const dark = p.theme === 'dark';
        const accent = normalizeAccent(p.accent);
        r.setAttribute('data-theme', dark ? 'dark' : 'light');
        r.setAttribute('data-accent', accent);
        if (p.bold === true) r.setAttribute('data-weight', 'bold');
        else r.removeAttribute('data-weight');
        r.classList.toggle('sidebar-collapsed', p.sidebar === true);
        syncSidebarToggle();
        const scale = nearestScale(p.scale);
        r.style.setProperty('--type-scale', String(scale));
        const themeBtn = document.getElementById('themeBtn');
        const themeLight = document.getElementById('themeLight');
        const boldBtn = document.getElementById('boldBtn');
        const label = document.getElementById('fontLabel');
        if (themeBtn) {
            themeBtn.setAttribute('aria-pressed', dark ? 'true' : 'false');
            themeBtn.innerHTML = THEME_SVG.moon + '<span>Dark</span>';
            themeBtn.setAttribute('aria-label', 'Dark appearance');
        }
        if (themeLight) { themeLight.innerHTML = THEME_SVG.sun + '<span>Light</span>'; themeLight.setAttribute('aria-label', 'Light appearance'); themeLight.setAttribute('aria-pressed', String(!dark)); }
        if (boldBtn) boldBtn.setAttribute('aria-pressed', p.bold === true ? 'true' : 'false');
        if (label) label.textContent = Math.round(scale * 100) + '%';
        const fontDown = document.getElementById('fontDown');
        const fontUp = document.getElementById('fontUp');
        if (fontDown) fontDown.disabled = scale === SCALE_STEPS[0];
        if (fontUp) fontUp.disabled = scale === SCALE_STEPS[SCALE_STEPS.length - 1];
        try {
            document.querySelectorAll('.accent-dot').forEach(function (dot) {
                const on = dot.getAttribute('data-accent') === accent;
                dot.setAttribute('aria-pressed', on ? 'true' : 'false');
            });
        } catch (e) {}
        const meta = document.getElementById('themeColor');
        if (meta) {
            meta.setAttribute('content', dark ? '#101917' : '#f6f8f7');
        }
    }
    function bindPrefs() {
        let p = loadPrefs();
        applyPrefs(p);
        const themeBtn = document.getElementById('themeBtn');
        const themeLight = document.getElementById('themeLight');
        const boldBtn = document.getElementById('boldBtn');
        const up = document.getElementById('fontUp');
        const down = document.getElementById('fontDown');
        if (themeBtn) themeBtn.addEventListener('click', function () {
            p = loadPrefs();
            p.theme = 'dark';
            changeReadingPrefs(p);
        });
        if (themeLight) themeLight.addEventListener('click', function () { p = loadPrefs(); p.theme = 'light'; changeReadingPrefs(p); });
        if (boldBtn) boldBtn.addEventListener('click', function () {
            p = loadPrefs();
            p.bold = !p.bold;
            changeReadingPrefs(p);
        });
        if (up) up.addEventListener('click', function () {
            p = loadPrefs();
            const i = SCALE_STEPS.indexOf(nearestScale(p.scale));
            p.scale = SCALE_STEPS[Math.min(SCALE_STEPS.length - 1, i + 1)];
            changeReadingPrefs(p);
        });
        if (down) down.addEventListener('click', function () {
            p = loadPrefs();
            const i = SCALE_STEPS.indexOf(nearestScale(p.scale));
            p.scale = SCALE_STEPS[Math.max(0, i - 1)];
            changeReadingPrefs(p);
        });
        document.querySelectorAll('.accent-dot').forEach(function (dot) {
            dot.addEventListener('click', function () {
                p = loadPrefs();
                p.accent = normalizeAccent(dot.getAttribute('data-accent'));
                changeReadingPrefs(p);
                document.getElementById('readingStatus').textContent = (ACCENT_LABELS[p.accent] || p.accent) + (prefsStorageAvailable ? ' · Saved on this device.' : ' · Applied for this session.');
            });
        });
    }

    /* ---------- severity filter ---------- */
    function bindFilters() {
        document.querySelectorAll('#filterChips .chip').forEach(chip => {
            chip.setAttribute('aria-pressed', String(chip.classList.contains('active')));
            chip.addEventListener('click', () => {
                const change = () => {
                    document.querySelectorAll('#filterChips .chip').forEach(c => {
                        const active = c === chip;
                        c.classList.toggle('active', active);
                        c.setAttribute('aria-pressed', String(active));
                    });
                    severityFilter = chip.dataset.sev;
                    refreshActiveRoute();
                    const filters = document.querySelector('.context-filters');
                    filters.open = false;
                    filters.querySelector('summary').focus({ preventScroll: true });
                };
                const design = window.POCKET_DESIGN;
                if (!design || design.beforeRoute(change)) change();
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
        if (overlay.showModal && !overlay.open) overlay.showModal();
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        ['.main', '.sidebar'].forEach(function (sel) {
            const node = document.querySelector(sel);
            if (!node) return;
            try {
                if ('inert' in node) node.inert = true;
                else node.setAttribute('inert', '');
            } catch (e) {}
        });

        const btnText = btn.querySelector('span');
        if (isReviewOnly && isDisclaimerAgreed()) {
            check.checked = true;
            btn.disabled = false;
            if (btnText) btnText.textContent = 'Acknowledged & Return to App';
        } else {
            check.checked = false;
            btn.disabled = true;
            if (btnText) btnText.textContent = 'Accept & Enter The EM Pocket';
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
        if (overlay.close && overlay.open) overlay.close();
        overlay.hidden = true;
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        ['.main', '.sidebar'].forEach(function (sel) {
            const node = document.querySelector(sel);
            if (!node) return;
            try {
                if ('inert' in node) node.inert = false;
                else node.removeAttribute('inert');
            } catch (e) {}
        });
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

        overlay.addEventListener('cancel', e => { e.preventDefault(); if(isDisclaimerAgreed())hideDisclaimer(); });
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
            toast('Educational terms acknowledged. Welcome to The EM Pocket.');
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
        /* Remember which element the clinician used to leave a destination, so Back can
           focus that same card or result again after the destination re-renders. */
        document.addEventListener('click', function (e) {
            const el = e.target && e.target.closest ? e.target : null;
            if (el) lastClick = { el: el, hash: location.hash || '#library', scrollY: window.scrollY };
        }, true);
        buildSidebar();
        syncSidebarAccessibility();
        bindFilters();
        bindPrefs();
        bindReadingPanel();
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            stage.focus({ preventScroll: true });
            stage.scrollIntoView({ block: 'start' });
        });
        function goHome() { showHome(); closeSidebar(); }
        const brand = document.getElementById('brandBtn');
        if (brand) brand.addEventListener('click', goHome);
        document.querySelectorAll('[data-nav]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const navKey = btn.getAttribute('data-nav');
                if (navKey === 'ecg' && !getEcg()) { toast('ECG guide data is unavailable on this device.'); return; }
                /* Any navigation dismisses the drawer and the ECG overlay, otherwise the
                   new view would render behind them with the page still scroll-locked. */
                closeSidebar();
                if (document.getElementById('ecgLightbox') || document.getElementById('ecgWorkbench')) closeEcgLightbox();
                if (navKey === 'home') showHome();
                else if (navKey === 'study') { location.hash = 'learn~home'; }
                else if (navKey === 'shift') showShift(currentId);
                else if (navKey === 'explorer') showExplorer();
                else if (navKey === 'ecg') location.hash = 'ecg-hub';
            });
        });

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
        const backdrop = document.getElementById('sideBackdrop');
        if (backdrop) {
            backdrop.setAttribute('role', 'button');
            backdrop.setAttribute('tabindex', '0');
            backdrop.setAttribute('aria-label', 'Close presentations menu');
            backdrop.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); closeSidebar(true); }
            });
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebarIsMobile() &&
                document.getElementById('sidebar').classList.contains('open')) closeSidebar(true);
        });
        window.addEventListener('scroll', () => {
            if (readBarFrame) return;
            readBarFrame = window.requestAnimationFrame(syncReadProgress);
        }, { passive: true });
        /* Measure the header straight away and whenever it changes size. A
           notch inset, a rotation or the label swap on resize all alter its
           height, and the sticky progress bar and the section rail follow it. */
        syncTopbarHeight();
        window.addEventListener('resize', syncTopbarHeight, { passive: true });
        if (window.ResizeObserver) {
            const topbarEl = document.querySelector('.topbar');
            if (topbarEl) new ResizeObserver(syncTopbarHeight).observe(topbarEl);
        }
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
                else toast('Use your browser menu and choose Install app to add The EM Pocket to your device.');
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
            toast('The EM Pocket is installed and ready for offline use.');
        });
        window.addEventListener('offline', () => toast('You’re offline — saved The EM Pocket content remains available.'));
        window.addEventListener('online', () => toast('You’re back online.'));

        const input = document.getElementById('searchInput');
        const clearBtn = document.getElementById('searchClearBtn');
        let searchTimer = 0;
        let searchPending = false;
        input.addEventListener('focus', () => {
            const value = input.value.trim();
            if (value.length < 2 || document.querySelector('dialog[open]')) return;
            clearTimeout(searchTimer);
            searchPending = false;
            runSearch(value);
        });
        input.addEventListener('input', () => {
            clearTimeout(searchTimer);
            const value = input.value.trim();
            searchPending = true;
            searchTimer = setTimeout(() => { searchPending = false; runSearch(value); }, 120);
        });
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                clearTimeout(searchTimer);
                searchPending = false;
                input.value = '';
                runSearch('');
                input.focus();
            });
        }
        input.addEventListener('keydown', (e) => {
            if (e.isComposing || e.keyCode === 229) return;
            if (e.key === 'Enter') {
                clearTimeout(searchTimer);
                if (searchPending) {
                    searchPending = false;
                    runSearch(input.value.trim());
                }
            }
            const pop = document.querySelector('.results-pop');
            const items = pop ? pop.querySelectorAll('.res-item[data-id]') : [];
            if (e.key === 'Escape') {
                clearTimeout(searchTimer);
                searchPending = false;
                input.value = '';
                if (clearBtn) clearBtn.hidden = true;
                hideSearchResults(pop);
                input.blur();
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
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    const selected = searchCursor >= 0 ? items[searchCursor] : items[0];
                    hideSearchResults(pop);
                    openSearchHit(selected.dataset.id, selected.dataset.target);
                }
            } else if (e.key === 'Enter' && input.value.trim().length >= 2) {
                e.preventDefault();
                runSearch(input.value.trim());
                const fresh = document.querySelector('.results-pop');
                const first = fresh ? fresh.querySelector('.res-item[data-id]') : null;
                if (first) {
                    hideSearchResults(fresh);
                    openSearchHit(first.dataset.id, first.dataset.target);
                }
            }
        });
        document.querySelector('.searchwrap').addEventListener('focusout', (e) => {
            if (e.currentTarget.contains(e.relatedTarget)) return;
            clearTimeout(searchTimer);
            searchPending = false;
            hideSearchResults();
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
            if (document.querySelector('dialog[open]')) return;
            if (document.getElementById('ecgWorkbench') || document.getElementById('ecgLightbox')) return;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
            if (sidebarIsMobile() && sidebar.classList.contains('open') && e.key !== 'Escape') return;
            if (e.key === '/') { e.preventDefault(); input.focus(); }
            if (e.key === 'Escape') {
                const pop = document.querySelector('.results-pop');
                if (pop && pop.style.display === 'block') {
                    hideSearchResults(pop);
                    input.value = '';
                    if (clearBtn) clearBtn.hidden = true;
                    input.focus();
                    return;
                }
                closeSidebar(true);
                return;
            }
            if (e.key === 'h' || e.key === 'H') { e.preventDefault(); showHome(); }
            if (e.key === 's' || e.key === 'S') { e.preventDefault(); location.hash='learn~home'; }
            if (e.key === 'v' || e.key === 'V') { e.preventDefault(); showShift(currentId); }
            if ((e.key === 'e' || e.key === 'E') && getEcg()) { e.preventDefault(); location.hash='ecg-hub'; }
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
                navigator.serviceWorker.register('./sw.js?v=20261008-note-save-guard-v40').then((registration) => {
                    navigator.serviceWorker.ready.then(() => setOfflineStatus('Ready for offline use'));
                    const applyUpdate = () => {
                        if(window.POCKET_DESIGN && !window.POCKET_DESIGN.beforeRoute(() => window.location.reload()))return;
                        const waiting = registration.waiting;
                        if (waiting) {
                            try { waiting.postMessage({ type: 'SKIP_WAITING' }); } catch (e) {}
                        }
                        window.location.reload();
                    };
                    if (registration.waiting) toastWithAction('New version available', 'Refresh', applyUpdate);
                    registration.addEventListener('updatefound', () => {
                        const worker = registration.installing;
                        if (worker) worker.addEventListener('statechange', () => {
                            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                                toastWithAction('New version available', 'Refresh', applyUpdate);
                            }
                            if (worker.state === 'redundant' && !navigator.serviceWorker.controller) {
                                setOfflineStatus('Online only');
                                toast('Offline setup could not be completed. The app remains available online.');
                            }
                        });
                    });
                    navigator.serviceWorker.addEventListener('controllerchange', () => {
                        setOfflineStatus('Ready for offline use');
                        if (hadController) toast('Offline content updated. Refresh to use the latest interface.');
                    }, { once: true });
                }).catch(function () {
                    setOfflineStatus('Online only');
                    toast('Offline setup could not be completed. The app remains available online.');
                });
            });
        }
    }

    window.EM_POCKET_UI = { stage, esc, dueIds, savedIds, reviewedIds, noteFor, saveCurrentNote, toast, findSearchHits, setStageContext, syncNav, showDisclaimer, openReadingPanel, closeReadingPanel, get offlineStatus(){return offlineStatus;} };
    if (document.readyState !== 'complete') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
