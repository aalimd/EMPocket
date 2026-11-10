/* ══════════ EM-CPs search core ══════════
   Pure, dependency-free text-matching helpers used by the in-app search.
   Kept separate from app.js so the ranking and synonym rules can be unit
   tested in isolation (see tests/search-core.test.js).

   Design goals (from the content audit):
     • tolerate common misspellings and near-matches (fuzzy fallback),
     • understand synonyms and British/American spellings and abbreviations,
     • match on word boundaries so short queries stop hitting the middle of a
       word ("tpa" must not match "ou-tpa-tient"),
     • rank treatment content above background content.

   No DOM, no globals beyond this object; safe to load in strict mode.
*/
(function () {
    'use strict';

    /* Canonical concept → the surface forms a clinician might type.
       The first form is treated as canonical; every form maps to the same
       concept so a query using any form expands to all of them. */
    var SYNONYM_GROUPS = [
        ['adrenaline', 'epinephrine', 'epi'],
        ['salbutamol', 'albuterol'],
        ['paracetamol', 'acetaminophen', 'apap'],
        ['hyperkalemia', 'hyperkalaemia', 'high potassium'],
        ['hypokalemia', 'hypokalaemia', 'low potassium'],
        ['hyponatremia', 'hyponatraemia', 'low sodium'],
        ['hypernatremia', 'hypernatraemia', 'high sodium'],
        ['anemia', 'anaemia'],
        ['edema', 'oedema'],
        ['hemorrhage', 'haemorrhage', 'bleeding'],
        ['myocardial infarction', 'mi', 'heart attack', 'stemi', 'omi'],
        ['pulmonary embolism', 'pe'],
        ['deep vein thrombosis', 'dvt'],
        ['stroke', 'cva', 'cerebrovascular accident', 'brain attack'],
        ['status epilepticus', 'se', 'prolonged seizure'],
        ['overdose', 'od', 'poisoning', 'tox', 'intoxication'],
        ['shortness of breath', 'sob', 'dyspnea', 'dyspnoea', 'breathless'],
        ['chronic obstructive pulmonary disease', 'copd'],
        ['acute coronary syndrome', 'acs'],
        ['cardiac arrest', 'cpr', 'acls', 'code blue'],
        ['altered mental status', 'ams', 'confusion', 'delirium'],
        ['loss of consciousness', 'loc', 'syncope', 'fainting'],
        ['intravenous', 'iv'],
        ['intramuscular', 'im'],
        ['tenecteplase', 'tnk', 'tpa', 'alteplase', 'thrombolysis', 'thrombolytic'],
        ['rocuronium', 'roc'],
        ['succinylcholine', 'suxamethonium', 'sux'],
        ['sodium bicarbonate', 'bicarb', 'bicarbonate'],
        ['calcium gluconate', 'calcium chloride', 'calcium'],
        ['n-acetylcysteine', 'nac', 'acetylcysteine'],
        ['naloxone', 'narcan'],
        ['esmolol', 'labetalol', 'beta blocker', 'beta-blocker'],
        ['magnesium sulfate', 'magnesium sulphate', 'mgso4', 'magnesium'],
        ['dextrose', 'd10', 'd50', 'glucose'],
        ['normal saline', 'saline', 'crystalloid'],
        ['activated charcoal', 'charcoal'],
        ['urgent', 'emergent'],
        ['pediatric', 'paediatric'],
        ['hematology', 'haematology']
    ];

    /* Build a lookup: surface form → array of every form in its group. */
    var SYNONYM_LOOKUP = {};
    SYNONYM_GROUPS.forEach(function (group) {
        group.forEach(function (form) {
            SYNONYM_LOOKUP[form] = group;
        });
    });

    /* Fold to a comparable form: lowercase, strip diacritics and punctuation,
       collapse whitespace. Keeps Arabic and other scripts untouched. */
    function normalize(value) {
        var s = String(value == null ? '' : value).toLowerCase()
            .replace(/[\u2080-\u2089]/g, ch => String(ch.charCodeAt(0)-0x2080));
        /* Fold Latin accents (é→e) without decomposing Arabic: NFD-split a copy
           that only contains Latin, then rebuild non-Latin runs unchanged. */
        if (/[\u00c0-\u024f]/.test(s)) {
            s = s.replace(/[\u00c0-\u024f]/g, function (ch) {
                return ch.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            });
        }
        return s
            .replace(/[^a-z0-9\u0600-\u06ff\s-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    /* Expand a full query into the set of alternatives to try: the query
       itself plus, for single-concept queries, every synonym form. */
    function expandSynonyms(query) {
        var q = normalize(query);
        if (!q) return [];
        var forms = [q];
        if (SYNONYM_LOOKUP[q]) forms = forms.concat(SYNONYM_LOOKUP[q]);
        return forms.filter(function (f, i) { return forms.indexOf(f) === i; });
    }

    /* Levenshtein distance with a small early-exit bound. */
    function editDistance(a, b, max) {
        if (a === b) return 0;
        if (Math.abs(a.length - b.length) > max) return max + 1;
        var prev = [];
        for (var j = 0; j <= b.length; j++) prev[j] = j;
        for (var i = 1; i <= a.length; i++) {
            var curr = [i];
            var rowMin = i;
            for (var k = 1; k <= b.length; k++) {
                var cost = a[i - 1] === b[k - 1] ? 0 : 1;
                curr[k] = Math.min(prev[k] + 1, curr[k - 1] + 1, prev[k - 1] + cost);
                if (curr[k] < rowMin) rowMin = curr[k];
            }
            if (rowMin > max) return max + 1;
            prev = curr;
        }
        return prev[b.length];
    }

    /* Whole-word containment: the needle must sit on word boundaries inside
       the haystack. Prevents "tpa" matching "outpatient". */
    // Bound compiled word expressions; a query reuses each form across the entire index.
    const wordPatterns = new Map();
    function containsWord(haystack, needle) {
        if (!needle) return false;
        var escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        let pattern = wordPatterns.get(needle);
        if (!pattern) {
            pattern = new RegExp('(^|[^a-z0-9])' + escaped + '([^a-z0-9]|$)', 'i');
            if (wordPatterns.size >= 128) wordPatterns.delete(wordPatterns.keys().next().value);
            wordPatterns.set(needle, pattern);
        }
        return pattern.test(haystack);
    }

    /* Fuzzy fallback for a single token: does any word in the haystack sit
       within an edit distance that scales with token length?
       (≥6 chars: 2 edits; ≥4 chars: 1 edit; shorter: exact only.) */
    const fuzzyPairs = new Map();
    function fuzzyContainsWord(haystack, needle) {
        if (needle.length < 4) return false;
        var max = needle.length >= 6 ? 2 : 1;
        var words = haystack.split(/[^a-z0-9\u0600-\u06ff]+/i).filter(Boolean);
        for (var i = 0; i < words.length; i++) {
            if (Math.abs(words[i].length - needle.length) > max) continue;
            const key = needle + '\0' + words[i];
            let matched = fuzzyPairs.get(key);
            if (matched === undefined) {
                matched = editDistance(needle, words[i], max) <= max;
                if (fuzzyPairs.size >= 4096) fuzzyPairs.delete(fuzzyPairs.keys().next().value);
                fuzzyPairs.set(key, matched);
            }
            if (matched) return true;
        }
        return false;
    }

    /* Does `text` satisfy `query`? Multi-token queries require every token to
       match somewhere (AND). Each token may match exactly, on a word boundary,
       as a fuzzy near-match, or through a synonym of the full query. */
    function matches(text, query) {
        var hay = normalize(text);
        if (!hay) return false;
        var alternatives = expandSynonyms(query);
        var q = normalize(query);
        if (!q) return false;
        /* Try the whole (synonym-expanded) query first. */
        for (var a = 0; a < alternatives.length; a++) {
            if (containsWord(hay, alternatives[a])) return true;
        }
        /* Multi-token: require every token to be satisfied. */
        var tokens = q.split(' ').filter(Boolean);
        if (tokens.length > 1) {
            var ok = tokens.every(function (t) {
                var forms = SYNONYM_LOOKUP[t] ? [t].concat(SYNONYM_LOOKUP[t]) : [t];
                return forms.some(function (f) { return containsWord(hay, f) || fuzzyContainsWord(hay, f); });
            });
            if (ok) return true;
        }
        /* Single-token fuzzy fallback. */
        return alternatives.some(function (form) { return fuzzyContainsWord(hay, form); });
    }

    /* 0–100 relevance. Exact and prefix title hits score highest; treatment
       content is boosted so doses surface above background teaching. */
    function score(title, sub, query, kind) {
        var t = normalize(title);
        var s = normalize(sub || '');
        var q = normalize(query);
        if (!q) return 0;
        var forms = expandSynonyms(query).concat([q]);
        var best = 0;
        forms.forEach(function (f) {
            if (t === f) best = Math.max(best, 100);
            else if (t.indexOf(f) === 0 && containsWord(t, f)) best = Math.max(best, 88);
            else if (containsWord(t, f)) best = Math.max(best, 74);
            else if (containsWord(s, f)) best = Math.max(best, 48);
            else if (fuzzyContainsWord(t, f)) best = Math.max(best, 40);
            else if (fuzzyContainsWord(s, f)) best = Math.max(best, 26);
        });
        /* Treatment boost: dose/antidote/airway/vasopressor cards outrank
           plain teaching screens for the same query. */
        var k = normalize(kind || '');
        if (/dose|antidote|calculation|calculator|threshold|airway|vasopressor|drug/.test(k)) best += 12;
        return Math.min(best, 100);
    }

    /* Prepare once: queries intersect word postings instead of rescanning every
       paragraph and recomputing spelling distances for every result. */
    function createIndex(entries) {
        const words = text => text.split(/[^a-z0-9\u0600-\u06ff]+/i).filter(Boolean);
        const postings = new Map();
        const docs = entries.map((entry, id) => {
            const title = normalize(entry.title), sub = normalize(entry.sub);
            const text = title + ' ' + sub + ' ' + normalize(entry.kind);
            new Set(words(text)).forEach(word => {
                if (!postings.has(word)) postings.set(word, new Set());
                postings.get(word).add(id);
            });
            return { entry, title, text };
        });
        const vocabulary = [...postings.keys()];
        function phraseIds(phrase) {
            const parts = words(phrase);
            if (!parts.length) return new Set();
            const lists = parts.map(word => postings.get(word) || new Set()).sort((a,b)=>a.size-b.size);
            return new Set([...lists[0]].filter(id => lists.every(list=>list.has(id)) && containsWord(docs[id].text, phrase)));
        }
        function candidates(token, prefix, fuzzy) {
            const result = new Set();
            const add = ids => ids.forEach(id => result.add(id));
            expandSynonyms(token).forEach(form=>add(phraseIds(form)));
            if (prefix && token.length >= 3) vocabulary.forEach(word=>{if(word.startsWith(token))add(postings.get(word));});
            if (fuzzy && token.length >= 4 && !/\d/.test(token)) {
                const max = token.length >= 8 ? 2 : 1;
                vocabulary.forEach(word=>{
                    // Do not turn opposite states or numbers into spelling variants.
                    if (/\d/.test(word) || Math.abs(word.length-token.length)>max) return;
                    if ((token.startsWith('hyper') && word.startsWith('hypo')) ||
                        (token.startsWith('hypo') && word.startsWith('hyper'))) return;
                    if (editDistance(token,word,max)<=max)add(postings.get(word));
                });
            }
            return result;
        }
        function run(tokens, fuzzy) {
            const lists=tokens.map((token,i)=>candidates(token,i===tokens.length-1,fuzzy)).sort((a,b)=>a.size-b.size);
            if(!lists.length)return [];
            return [...lists[0]].filter(id=>lists.every(list=>list.has(id)));
        }
        function search(query) {
            const q=normalize(String(query||'').slice(0,120));
            if(q.length<2)return [];
            const tokens=words(q);
            let ids=run(tokens,false), approximate=false;
            // Full multiword synonyms also work when token-by-token expansion cannot.
            const phraseMatches=new Set(ids);
            expandSynonyms(q).forEach(form=>phraseIds(form).forEach(id=>phraseMatches.add(id)));
            ids=[...phraseMatches];
            if(!ids.length){ids=run(tokens,true);approximate=ids.length>0;}
            return ids.map(id=>{
                const d=docs[id], title=d.title;
                let rank=title===q?1000:
                    d.entry.kind==='Presentation' && expandSynonyms(q).some(form=>containsWord(title,form))?950:
                    containsWord(title,q)?(words(title).length<=8?850:560):title.startsWith(q)?800:
                    tokens.every(token=>containsWord(title,token))?700:
                    approximate && tokens.every(token=>containsWord(title,token)||fuzzyContainsWord(title,token))?650:
                    expandSynonyms(q).some(form=>containsWord(title,form))?600:300;
                const doseIntent=/\b(?:dose|doses|dosing|mg|mcg|kg|antidote)\b/.test(q);
                if(d.entry.kind==='Presentation')rank+=doseIntent?10:50;
                if(d.entry.quick && doseIntent)rank+=25;
                return {id,rank,hit:approximate?Object.assign({},d.entry,{approximate:true}):d.entry};
            }).sort((a,b)=>b.rank-a.rank||a.id-b.id).map(item=>item.hit);
        }
        return {search};
    }

    window.SEARCH_CORE = {
        createIndex: createIndex,
        normalize: normalize,
        expandSynonyms: expandSynonyms,
        editDistance: editDistance,
        containsWord: containsWord,
        fuzzyContainsWord: fuzzyContainsWord,
        matches: matches,
        score: score,
        synonymGroups: SYNONYM_GROUPS
    };
})();
