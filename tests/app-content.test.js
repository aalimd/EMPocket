'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Exercise the actual pure renderer without starting the app or replacing its implementation.
const appSource = fs.readFileSync(path.join(__dirname, '../assets/app.js'), 'utf8');
const context = vm.createContext({ window: {} });
for (const name of ['esc', 'overviewHtml']) {
  const start = appSource.indexOf('\n    function ' + name + '(');
  assert.notEqual(start, -1, name + ' renderer exists');
  const end = appSource.indexOf('\n    function ', start + 1);
  vm.runInContext(appSource.slice(start, end), context);
}
vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets/data.js'), 'utf8'), context);
const presentations = vm.runInContext('CP_DATA', context);

test('overview paragraphs preserve every presentation’s clinical text, including parentheses and closing quotes', () => {
  for (const cp of presentations) {
    const html = context.overviewHtml(cp);
    const prose = html.match(/<div class="ov-prose">([\s\S]*?)<\/div>/)[1];
    const rendered = prose.replace(/<\/p>/g, ' ').replace(/<p>/g, '')
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    const normalize = text => text.replace(/\s+/g, ' ').trim();
    assert.equal(normalize(rendered), normalize(cp.overview), cp.id);
  }
});
