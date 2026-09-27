const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/app.css'), 'utf8');

test('all 5 core routes have matching buttons in the iOS tabbar', () => {
    const requiredNavs = ['home', 'study', 'ecg', 'explorer', 'shift'];
    const tabbarMatch = html.match(/<nav class="ios-tabbar"[\s\S]*?<\/nav>/);
    assert.ok(tabbarMatch, 'index.html must contain .ios-tabbar element');
    const tabbarHtml = tabbarMatch[0];
    for (const nav of requiredNavs) {
        assert.ok(tabbarHtml.includes(`data-nav="${nav}"`), `Tab bar must contain data-nav="${nav}"`);
    }
});

test('iOS tabbar accounts for safe-area-inset-bottom and handles print media', () => {
    assert.ok(css.includes('env(safe-area-inset-bottom'), 'app.css must use env(safe-area-inset-bottom)');
    assert.match(css, /@media print[\s\S]*?\.ios-tabbar[\s\S]*?display:\s*none/i, 'Print media must hide .ios-tabbar');
});

test('toast is positioned above the mobile tabbar to prevent collisions', () => {
    assert.match(css, /(\.toast|#toast)[\s\S]*?bottom:\s*calc\([^)]*env\(safe-area-inset-bottom/i, 'Toast must be positioned above tabbar');
});
