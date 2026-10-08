/* Export launcher PNGs from the editable SVG.
   RESVG_MODULE=/absolute/path/to/@resvg/resvg-js node dev/render-app-icons.cjs */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {Resvg} = require(process.env.RESVG_MODULE || '@resvg/resvg-js');
const assets = path.join(__dirname, '../assets');
const svg = fs.readFileSync(path.join(assets, 'icon.svg'), 'utf8');
for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512],
    ['apple-touch-icon.png', 180], ['icon-maskable-512.png', 512]]) {
    // Maskable launchers need an opaque canvas extending beyond the safe zone.
    const source = name.includes('maskable') ? svg.replace('rx="112"', 'rx="0"') : svg;
    fs.writeFileSync(path.join(assets, name), new Resvg(source, {
        fitTo: {mode: 'width', value: size}
    }).render().asPng());
}
