/* Local-only responsive theme and icon regression audit. */
(() => {
  'use strict';
  if (!['localhost','127.0.0.1'].includes(location.hostname)) return;
  const button = document.createElement('button'); button.id='runThemes'; button.textContent='Run themes and icons';
  document.querySelector('.qa-row').append(button);
  button.onclick=async()=>{
    button.disabled=true;
    const out=document.querySelector('#result'), frame=document.querySelector('#app');
    const failures=[], contrasts=new Map(); let checks=0, icons=0;
    const pause=()=>new Promise(r=>setTimeout(r,45));
    const rgb=s=>(s.match(/[\d.]+/g)||[]).map(Number);
    const lum=c=>c.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
    const check=(ok,label)=>{checks++;if(!ok)failures.push(label);};
    const doc=frame.contentDocument, win=frame.contentWindow, saved=doc.documentElement.dataset.theme, savedView=win.sessionStorage.getItem('ecg-explorer-view');
    const stable=doc.createElement('style');stable.textContent='*,*::before,*::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}';doc.head.append(stable);
    try {
      for(const theme of ['light','dark']) for(const width of [320,390,768,1280]) {
        doc.documentElement.dataset.theme=theme;frame.style.width=width+'px';
        for(const route of ['home','ecg','ecg-explorer','study','study~case','shift',...window.CP_DATA.map(c=>c.id),...window.ECG_EXPLORER.cases.map(c=>'ecg-explorer~'+c.id)]) {
          win.location.hash=route==='home'?'':route;await pause();
          doc.querySelectorAll('.section-card.closed').forEach(e=>{e.classList.remove('closed');e.querySelector('.sec-head')?.setAttribute('aria-expanded','true');});
          const label=`${theme} ${width} ${route}`;
          check(doc.documentElement.scrollWidth<=width+2,label+' page overflow');
          for(const e of doc.querySelectorAll('.emoji-ico,.ui-icon,.mono-ico')) {
            if(!e.getClientRects().length||!e.getBoundingClientRect().width)continue;
            icons++;const b=e.getBoundingClientRect();
            check(b.width>0&&b.height>0&&!e.textContent.includes('\ufffd'),label+' invalid icon');
          }
          for(const e of doc.querySelectorAll('#stage button,#stage a,#stage p,#stage h1,#stage h2,#stage h3,#stage h4,#stage label,#stage li,#stage span')) {
            if(!e.getClientRects().length||e.closest('svg,.emoji-ico')||!Array.from(e.childNodes).some(n=>n.nodeType===3&&n.textContent.trim()))continue;
            const s=win.getComputedStyle(e);if(s.visibility==='hidden'||Number(s.opacity)<1||e.disabled)continue;
            let bg=[255,255,255];for(let p=e;p;p=p.parentElement){const c=rgb(win.getComputedStyle(p).backgroundColor);if(win.getComputedStyle(p).backgroundImage!=='none'){bg=null;break;}if(c.length===3||c[3]===1){bg=c;break;}}
            if(!bg)continue;const fg=rgb(s.color),ratio=(Math.max(lum(fg),lum(bg))+.05)/(Math.min(lum(fg),lum(bg))+.05);
            const required=parseFloat(s.fontSize)>=24||(parseFloat(s.fontSize)>=18.66&&Number(s.fontWeight)>=700)?3:4.5;
            if(ratio<required-.05){const key=theme+' '+e.tagName+'.'+e.className+' '+s.color+' / '+bg.join(',');if(!contrasts.has(key))contrasts.set(key,{route,text:e.textContent.trim().slice(0,65),ratio:ratio.toFixed(2)});}
          }
        }
        out.textContent=`Checking ${theme} ${width}px… ${checks} checks`;
      }
      out.textContent=JSON.stringify({checks,icons,failures,contrastCandidates:[...contrasts]},null,2);
    } finally {doc.documentElement.dataset.theme=saved;if(savedView===null)win.sessionStorage.removeItem('ecg-explorer-view');else win.sessionStorage.setItem('ecg-explorer-view',savedView);stable.remove();button.disabled=false;}
  };
})();
