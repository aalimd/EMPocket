/* Local-only header geometry checks; no saved preference changes. */
(()=>{
  if(!['localhost','127.0.0.1'].includes(location.hostname))return;
  const button=document.createElement('button');button.id='runHeader';button.textContent='Check header visibility';document.querySelector('.qa-row').append(button);
  button.onclick=async()=>{
    const frame=document.querySelector('#app'),doc=frame.contentDocument,win=frame.contentWindow,html=doc.documentElement;
    const saved={theme:html.dataset.theme,weight:html.dataset.weight,scale:html.style.getPropertyValue('--type-scale'),width:frame.style.width};
    const style=doc.createElement('style');style.textContent='*,*::before,*::after{transition:none!important;animation:none!important}';doc.head.append(style);
    let checks=0;const failures=[];button.disabled=true;
    const inside=(a,b)=>a.left>=b.left-1&&a.right<=b.right+1&&a.top>=b.top-1&&a.bottom<=b.bottom+1;
    const overlap=(a,b)=>Math.min(a.right,b.right)>Math.max(a.left,b.left)+1&&Math.min(a.bottom,b.bottom)>Math.max(a.top,b.top)+1;
    const check=(ok,label)=>{checks++;if(!ok)failures.push(label);};
    try{
      for(const width of [320,390,400,600,700,701,768,920,921,1024,1280])for(const theme of ['light','dark'])for(const scale of [1,1.3]){
        frame.style.width=width+'px';html.dataset.theme=theme;html.dataset.weight='bold';html.style.setProperty('--type-scale',scale);
        for(let n=0;win.innerWidth!==width&&n<120;n++)await new Promise(r=>requestAnimationFrame(r));
        await new Promise(r=>win.requestAnimationFrame(()=>win.requestAnimationFrame(r)));
        const tag=`${width}px ${theme} ${scale}`,head=doc.querySelector('.topbar').getBoundingClientRect(),search=doc.querySelector('.searchwrap').getBoundingClientRect();
        const visible=el=>el.getBoundingClientRect().width>0&&win.getComputedStyle(el).visibility!=='hidden';
        const buttons=[...doc.querySelectorAll('[data-nav]')].filter(visible);check(buttons.length===4,tag+' four visible destinations');
        const nav=doc.querySelector(width<=920?'.ios-tabbar':'.sidebar').getBoundingClientRect();
        const settings=doc.querySelector('#toolsToggle').getBoundingClientRect();
        check(inside(search,head)&&inside(settings,head),tag+' search and settings fit header');
        check(!overlap(search,settings),tag+' settings clear of search');
        for(const b of buttons){
          const rect=b.getBoundingClientRect(),icon=b.querySelector('svg'),ir=icon.getBoundingClientRect(),label=b.getBoundingClientRect();
          check(ir.width>=16&&ir.height>=16&&win.getComputedStyle(icon).display!=='none',tag+' '+b.id+' icon visible');
          check(inside(ir,rect)&&inside(label,rect),tag+' '+b.id+' contents fit button '+JSON.stringify({button:rect.toJSON(),icon:ir.toJSON(),label:label.toJSON()}));
          check(inside(rect,nav)&&rect.right<=width+1,tag+' '+b.dataset.nav+' fits navigation');
          check(!overlap(rect,search),tag+' '+b.id+' clear of search');
        }
        for(let i=1;i<buttons.length;i++)check(!overlap(buttons[i-1].getBoundingClientRect(),buttons[i].getBoundingClientRect()),tag+' adjacent buttons separated');
      }
      document.querySelector('#result').textContent=JSON.stringify({checks,failures},null,2);
    }finally{html.dataset.theme=saved.theme;html.dataset.weight=saved.weight;html.style.setProperty('--type-scale',saved.scale);frame.style.width=saved.width;style.remove();button.disabled=false;}
  };
})();
