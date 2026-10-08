'use strict';
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'../..');
const loader=fs.readFileSync(path.join(root,'assets/app.css'),'utf8');
const modules=[...loader.matchAll(/@import url\('\.\/([^'?]+)\?v=[^']+'\)/g)].map(m=>path.join(root,'assets',m[1]));
module.exports={loader,modules,css:loader+'\n'+modules.map(p=>fs.readFileSync(p,'utf8')).join('\n')};
