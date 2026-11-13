/* ══════════ EM-CPs search index builder (Phase 2 extraction) ══════════
   Builds the searchable index previously constructed inside
   assets/app.js: every presentation section, the ECG guide, Explorer
   cases, short cases, learning items, symptom terms and the Quick
   drug/decision-rule cards. Pure with respect to its inputs — the
   caller (app.js) supplies the clinical data, the ECG record and the
   optional module singletons, so this file has no DOM and no app
   internals.

   Publishes window.EM_SEARCH_INDEX. The search UI (popup, keyboard,
   highlighting, routing) stays in app.js; ranking stays in
   assets/search-core.js. */
(function () {
    'use strict';

    const QUICK_SEARCH_CARDS = [
        { route: 'shift', term: 'Rapid Sequence Intubation (RSI)', target: 'airway-stridor', kind: 'Quick · airway dose',
          text: 'Rapid Sequence Intubation RSI induction paralytics ketamine 1-2 mg/kg IV etomidate 0.3 mg/kg rocuronium 1.2 mg/kg roc succinylcholine suxamethonium 1.5 mg/kg post-intubation sedation push-dose vasopressor' },
        { route: 'shift', term: 'Shock Vasopressors & Inotropes', target: 'shock', kind: 'Quick · vasopressor dose',
          text: 'Shock first-line vasopressors inotropes norepinephrine noradrenaline 0.05-0.5 mcg/kg/min target MAP 65 epinephrine adrenaline 0.05-0.5 mcg/kg/min dobutamine 2-20 mcg/kg/min' },
        { route: 'shift', term: 'High-Yield Antidotes & Hyperkalemia', target: 'overdose', kind: 'Quick · antidote dose',
          text: 'Antidotes hyperkalemia acetaminophen paracetamol N-acetylcysteine NAC acetylcysteine Rumack-Matthew opioid naloxone narcan 0.04-0.4 mg IV TCA tricyclic sodium bicarbonate 1-2 mEq/kg QRS calcium gluconate 10% 30 mL over 10 minutes calcium chloride insulin dextrose albuterol salbutamol nebulized potassium removal' },
        { route: 'shift', term: 'Anaphylaxis IM Epinephrine', target: 'anaphylaxis', kind: 'Quick · dose',
          text: 'Anaphylaxis first-line IM epinephrine adrenaline 0.3-0.5 mg adult child 0.01 mg/kg max 0.3 mg autoinjector 0.15 mg 0.3 mg RCUK age bands 0.15 0.3 0.5 mg crystalloid 10 mL/kg children' },
        { route: 'shift', term: 'Status Epilepticus Timed Escalation', target: 'seizures', kind: 'Quick · dose',
          text: 'Status epilepticus benzodiazepine midazolam 10 mg 5 mg 0.2 mg/kg lorazepam 0.1 mg/kg max 4 mg levetiracetam 60 mg/kg fosphenytoin 20 mg PE/kg valproate 40 mg/kg ESETT' },
        { route: 'shift', term: 'HEART Pathway & hs-Troponin', target: 'chest-pain', kind: 'Quick · decision rule',
          text: 'HEART pathway high-sensitivity troponin chest pain history ECG age risk factors rule-out 0-3 score-based pathway' },
        { route: 'shift', term: 'PERC Rule & PE Pretest', target: 'dyspnea', kind: 'Quick · decision rule',
          text: 'PERC rule pulmonary embolism pretest probability D-dimer age-adjusted YEARS CTPA Wells' },
        { route: 'shift', term: 'NEXUS & Canadian C-Spine', target: 'multiple-trauma', kind: 'Quick · decision rule',
          text: 'NEXUS Canadian C-Spine rule cervical spine clearance blunt trauma imaging rotation' },
        { route: 'shift', term: 'PECARN Pediatric Head Trauma', target: 'head-injury', kind: 'Quick · decision rule',
          text: 'PECARN pediatric head trauma rule CT head GCS altered mental status skull fracture scalp hematoma LOC mechanism' }
    ];

    function buildSearchIndex(data, ecg, extras) {
        extras = extras || {};
        const byId = extras.byId || {};
        const ecgTopicId = extras.ecgTopicId || 'ecg';
        const strip = extras.stripTags || function (s) { return String(s).replace(/<\/?[a-z][^>]*>/gi, ' ').replace(/\s+/g, ' ').trim(); };
        const idx = [];
        data.forEach(cp => {
            const isDiagnosis = cp.type === 'diagnosis';
            idx.push({ cpId: cp.id, target: isDiagnosis ? '' : 'how-to-think', title: cp.name, sub: cp.tag,
                kind: isDiagnosis ? 'Diagnosis guide' : 'Presentation' });
            (cp.approach || []).forEach(function (s) {
                idx.push({ cpId: cp.id, target: 'how-to-think', title: s, sub: 'Approach — ' + cp.name, kind: 'Approach' });
            });
            if(cp.overview)idx.push({cpId:cp.id,target:'how-to-think',title:strip(cp.overview),sub:cp.name+' — overview',kind:'Overview'});
            (cp.doses||[]).forEach(group=>group[1].forEach(line=>idx.push({
                cpId:cp.id,target:'doses',title:line,
                sub:group[0]+' — '+cp.name+(cp.doseScope?' — '+cp.doseScope:''),kind:'Dose reference'
            })));
            cp.dontMiss.forEach(d => idx.push({ cpId: cp.id, target: 'dont-miss', title: d[0], sub: d[2], kind: cp.name + ' · ' + d[1] }));
            cp.redFlags.forEach(r => idx.push({ cpId: cp.id, target: 'red-flags', title: r, sub: 'Red flag — ' + cp.name, kind: 'Red flag' }));
            cp.history.forEach(item => idx.push({ cpId: cp.id, target: 'history', title: item, sub: 'Focused history — ' + cp.name, kind: 'History' }));
            cp.exam.forEach(item => idx.push({ cpId: cp.id, target: 'exam', title: item, sub: 'Examination — ' + cp.name, kind: 'Exam' }));
            cp.workup.forEach(group => group[1].forEach(item => idx.push({ cpId: cp.id, target: 'workup', title: item, sub: group[0] + ' — ' + cp.name, kind: 'Workup' })));
            cp.disposition.forEach(item => idx.push({ cpId: cp.id, target: 'disposition', title: item[0], sub: item[1] + ' — ' + cp.name, kind: 'Disposition' }));
            cp.pitfalls.forEach(p => idx.push({ cpId: cp.id, target: 'pearls-pitfalls', title: p, sub: 'Pitfall — ' + cp.name, kind: 'Pitfall' }));
            (cp.pearls || []).forEach(p => idx.push({ cpId: cp.id, target: 'pearls-pitfalls', title: p, sub: 'Pearl — ' + cp.name, kind: 'Pearl' }));
        });
        if (ecg) {
            idx.push({ cpId: ecgTopicId, target: '', title: 'ECG Guide', sub: ecg.tag, kind: 'ECG' });
            idx.push({ cpId: ecgTopicId, target: '', title: ecg.title, sub: ecg.subtitle || ecg.tag, kind: 'ECG' });
            ecg.firstPass.forEach(function (s) {
                idx.push({ cpId: ecgTopicId, target: 'ecg-how', title: s, sub: 'ECG first-pass', kind: 'ECG' });
            });
            ecg.steps.forEach(function (s) {
                idx.push({ cpId: ecgTopicId, target: 'step-' + s.id, title: 'Step ' + s.num + ': ' + s.name, sub: s.summary, kind: 'ECG step' });
                (s.details||[]).forEach(detail=>idx.push({cpId:ecgTopicId,target:'step-'+s.id,title:strip(detail),sub:s.name,kind:'ECG detail'}));
                if (s.pearl) idx.push({ cpId: ecgTopicId, target: 'step-' + s.id, title: s.pearl, sub: s.name + ' · pearl', kind: 'ECG step' });
                if (s.pitfall) idx.push({ cpId: ecgTopicId, target: 'step-' + s.id, title: s.pitfall, sub: s.name + ' · pitfall', kind: 'ECG step' });
            });
            ecg.patterns.forEach(function (p) {
                idx.push({ cpId: ecgTopicId, target: p.id, title: p.name, sub: strip(p.criteria), kind: 'ECG pattern' });
                ['action','caution','significance'].forEach(field=>{
                    if(p[field])idx.push({cpId:ecgTopicId,target:p.id,title:strip(p[field]),sub:p.name,kind:'ECG '+field});
                });
                if (p.tag) idx.push({ cpId: ecgTopicId, target: p.id, title: p.tag, sub: p.name, kind: 'ECG pattern' });
            });
            ecg.redFlags.forEach(function (r) {
                idx.push({ cpId: ecgTopicId, target: 'ecg-red-flags', title: r, sub: 'ECG red flag', kind: 'ECG' });
            });
            ecg.pearls.forEach(function (p) {
                idx.push({ cpId: ecgTopicId, target: 'pearls-pitfalls', title: p, sub: 'ECG pearl', kind: 'ECG' });
            });
            ecg.pitfalls.forEach(function (p) {
                idx.push({ cpId: ecgTopicId, target: 'pearls-pitfalls', title: p, sub: 'ECG pitfall', kind: 'ECG' });
            });
        }
        if(extras.ecgExplorer&&Array.isArray(extras.ecgExplorer.cases))extras.ecgExplorer.cases.forEach(c=>idx.unshift({cpId:'ecg-explorer',target:c.id,title:c.name,sub:c.category+' · '+c.id.replace(/-/g,' ')+' · '+c.summary,kind:'Interactive ECG'}));
        if(extras.studentLearning&&Array.isArray(extras.studentLearning.cases))extras.studentLearning.cases.forEach(c=>idx.unshift({cpId:'study',target:'case-'+c.id,title:c.title,sub:'Short case · '+c.stem,kind:'Short case'}));
        if(extras.emLearning&&typeof extras.emLearning.searchItems==='function') idx.unshift(...extras.emLearning.searchItems());
        /* Symptom-first entry: index lay-named symptoms so a learner who does not
           yet know the diagnosis can search "blue lips" or "cannot breathe".
           Each term resolves to the presentation pathway that answers it. */
        if(extras.shiftTools && Array.isArray(extras.shiftTools.symptomTerms)){
            extras.shiftTools.symptomTerms.forEach(function(entry){
                const cp=byId[entry.cpId]; if(!cp) return;
                entry.terms.forEach(function(term){
                    idx.unshift({cpId:entry.cpId,target:'',title:term,sub:'Symptom · answers in '+cp.name,kind:'Symptom',symptom:true});
                });
            });
        }
        /* Quick drug and decision-rule cards: index their clinical content so
           "rocuronium", "calcium gluconate" or "adrenaline" reach the dose card. */
        QUICK_SEARCH_CARDS.forEach(function(card){
            idx.unshift({cpId:card.route,target:card.target,title:card.term,sub:card.text,kind:card.kind,quick:true});
        });
        return idx;
    }
    window.EM_SEARCH_INDEX = {
        QUICK_SEARCH_CARDS: QUICK_SEARCH_CARDS,
        buildSearchIndex: buildSearchIndex
    };
})();
