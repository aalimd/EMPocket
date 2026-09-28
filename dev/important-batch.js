'use strict';
/* Local QA helper for reducing !important in app.css in verified batches.
   Never deployed. Usage:
     node dev/important-batch.js list                 list rule indices that carry !important
     node dev/important-batch.js strip <i> [j ...]    strip !important in those rule indices
     node dev/important-batch.js strip-range <a> <b>  strip in the index range a..b
   Rules are enumerated with brace matching, so rules nested inside @media are
   counted too, and only the chosen rules are touched. */
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'assets', 'app.css');
const css = fs.readFileSync(file, 'utf8');

/* Yields every leaf rule with its absolute body range, recursing into at-rule
   blocks so an index always maps to one real rule rather than to a whole
   @media container. */
function* leafRules(source, from, to) {
    const end = to == null ? source.length : to;
    let i = from;
    while (i < end) {
        const open = source.indexOf('{', i);
        if (open === -1 || open >= end) return;
        let depth = 0, j = open;
        for (; j < end; j++) {
            if (source[j] === '{') depth++;
            else if (source[j] === '}') { depth--; if (!depth) break; }
        }
        let selStart = i;
        while (selStart > 0 && source[selStart - 1] !== '}' && source[selStart - 1] !== ';') selStart--;
        const sel = source.slice(selStart, open);
        if (/^\s*@/.test(sel) && /media|supports|layer|container/i.test(sel)) {
            yield* leafRules(source, open + 1, j);
        } else {
            yield { start: selStart, open, end: j, sel };
        }
        i = j + 1;
    }
}

const all = [...leafRules(css, 0, css.length)];
const withImportant = all.filter(r => /!important/.test(css.slice(r.open, r.end + 1)));

const mode = process.argv[2];

if (mode === 'list') {
    withImportant.forEach((r, n) => {
        const sel = r.sel.replace(/\s+/g, ' ').trim();
        const count = (css.slice(r.open, r.end).match(/!important/g) || []).length;
        console.log(String(n).padStart(4) + '  x' + String(count).padEnd(3) + sel.slice(0, 96));
    });
    console.log('total rules with !important: ' + withImportant.length);
    process.exit(0);
}

if (mode !== 'strip' && mode !== 'strip-range') {
    console.log('usage: list | strip <i...> | strip-range <a> <b>');
    process.exit(1);
}

let chosen;
if (mode === 'strip') {
    chosen = new Set(process.argv.slice(3).map(Number));
} else {
    const a = Number(process.argv[3]), b = Number(process.argv[4]);
    chosen = new Set();
    for (let k = a; k <= b; k++) chosen.add(k);
}

/* Splice from the end so earlier offsets stay valid. */
let out = css, removed = 0, touched = 0;
for (const n of [...chosen].sort((a, b) => b - a)) {
    const r = withImportant[n];
    if (!r) { console.error('no such rule index: ' + n); continue; }
    const body = css.slice(r.open, r.end + 1);
    if (!/!important/.test(body)) continue;
    const cleaned = body.replace(/\s*!important/g, '');
    removed += (body.match(/!important/g) || []).length;
    touched++;
    out = out.slice(0, r.open) + cleaned + out.slice(r.end + 1);
}
fs.writeFileSync(file, out);
console.log('stripped ' + removed + ' declarations from ' + touched + ' rules; ' +
    (out.match(/!important/g) || []).length + ' !important remain');
