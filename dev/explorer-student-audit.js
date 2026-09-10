/* Local-only acceptance checks for the optional student workflow. */
(function(){
 if(!['localhost','127.0.0.1'].includes(location.hostname))return;
 const button=document.createElement('button');button.id='runStudentExplorer';button.textContent='Run student workflow checks';document.querySelector('#qa').append(button);
 const out=document.createElement('pre');out.id='studentExplorerResult';document.querySelector('#qa').append(out);
 button.onclick=async()=>{
  const X=window.ECG_EXPLORER,root=document.querySelector('#preview'),errors=[];let checks=0;
  const keys=['em-ecg-learning-v1','em-ecg-practice-v1','em-student-progress'],saved=keys.map(k=>localStorage.getItem(k)),hash=location.hash;
  const check=(v,m)=>{checks++;if(!v)throw Error(m);};
  const click=(action,host=root)=>host.querySelector('[data-action="'+action+'"]').click();
  const tick=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  const input=(selector,value,host=root)=>{const field=host.querySelector(selector);field.value=value;field.dispatchEvent(new Event('input',{bubbles:true}));};
  try{
   localStorage.removeItem('em-ecg-practice-v1');history.replaceState(null,'','#ecg-explorer');X.mount(root,{id:'normal'});
   check(!root.querySelector('.explorer-path').open,'Path is optional and initially collapsed');
   for(let i=0;i<X.pathways.length;i++){
    root.querySelector('[data-path="'+i+'"]').click();
    check(X.pathways[i].ids.includes(root.querySelector('[data-control="case"]').value),'Stage starts in its own cases');
    click('next');check(X.pathways[i].ids.includes(root.querySelector('[data-control="case"]').value),'Next stays within stage');
   }
   root.querySelector('[data-path="0"]').click();click('continue');
   check(root.querySelector('[data-control="case"]').value!=='normal'&&root.querySelector('.explorer-path-current'),'Continue advances along the learning path');
   click('exit-path');check(!root.querySelector('.explorer-path-current'),'Leave path');
   X.mount(root,{id:'normal'});
   check(root.querySelector('.explorer-finding-list').compareDocumentPosition(root.querySelector('.explorer-explanation'))&Node.DOCUMENT_POSITION_FOLLOWING,'Findings precede detail');
   click('finding-next');check(root.querySelector('[data-finding="1"]').getAttribute('aria-pressed')==='true','Next finding updates selection');
   click('finding-previous');check(root.querySelector('[data-finding="0"]').getAttribute('aria-pressed')==='true','Previous finding updates selection');
   const model=X.build('normal'),multiple=model.findings.findIndex(f=>f.targets.length>1);root.querySelector('[data-finding="'+multiple+'"]').click();
   let mark=root.querySelector('.explorer-canvas [data-region="1"]');mark.focus();mark.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
   check(root.querySelector('.explorer-detail > p').textContent.includes('region 2'),'Keyboard opens second region');
   check(!root.querySelector('.explorer-detail [tabindex]'),'Detail has no duplicate interactive marks');
   let svg=root.querySelector('.explorer-canvas svg'),[x,y,w,h]=model.findings[multiple].targets[0],point=svg.createSVGPoint();point.x=x+w/2;point.y=y+h/2;point=point.matrixTransform(svg.getScreenCTM());
   svg.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:point.x,clientY:point.y}));check(root.querySelector('.explorer-detail > p').textContent.includes('region 1'),'Tap opens corresponding region');
   click('focus');click('whole');check(root.querySelector('[data-control="zoom"]').value==='1','Whole ECG restores fit');
   click('practice');click('hint');check(!root.textContent.includes('Normal sinus rhythm'),'Hint conceals diagnosis');check(!root.querySelector('[data-region]'),'Practice has no answer targets');
   click('reveal');check(X.readPractice().length===0,'Blank reveal is not an attempt');
   click('mixed-practice');const current=root.querySelector('[data-control="case"]').value;
   root.querySelector('.explorer-checklist').open=true;await tick();input('[data-observation="rhythm"]','My timing observation');input('[data-control="answer"]','My interpretation');
   click('enlarge');await tick();const dialog=document.querySelector('dialog');
   check(dialog.querySelector('[data-observation="rhythm"]').value==='My timing observation','Checklist survives enlarged view');
   check(dialog.querySelector('.explorer-checklist').open,'Checklist open state preserved');
   click('reveal',dialog);check(X.readPractice().includes(current),'Written observation records attempt');
   check(!X.readProgress().completed.includes(current)||JSON.parse(saved[0]||'{}').completed?.includes(current),'Attempt does not mark case complete');
   click('close',dialog);await tick();check(root.querySelector('[data-control="answer"]').value==='My interpretation','Answer synchronized after dialog');
   click('mixed-practice');check(root.querySelector('[data-control="case"]').value!==current,'Practice advances');
   check(root.querySelector('[data-observation="rhythm"]').value===''&&root.querySelector('[data-control="answer"]').value==='','New case resets all observations');
   check(!root.querySelector('.explorer-hint p'),'New case resets hint');
   X.mount(root,{id:'practice'});check(X.readPractice().includes(current),'Attempt survives remount');
   const originalSet=Storage.prototype.setItem;
   try{
    Storage.prototype.setItem=function(key,value){if(key==='em-ecg-practice-v1')throw Error('Test storage unavailable');return originalSet.call(this,key,value);};
    X.mount(root,{id:'normal'});click('practice');input('[data-control="answer"]','My reading');click('reveal');
    check(root.querySelector('.explorer-practice-status').textContent.includes('storage unavailable'),'Failed storage is disclosed');
    click('mixed-practice');check(root.querySelector('[data-control="case"]').value!=='normal','Practice still advances without storage');
    const sessionCount=root.querySelector('.explorer-practice-status').textContent.split(' / ')[0];
    X.mount(root,{id:'practice'});check(root.querySelector('.explorer-practice-status').textContent.startsWith(sessionCount+' / '),'Session attempts survive navigation when storage is unavailable');
   }finally{Storage.prototype.setItem=originalSet;}
   check(root.scrollWidth<=root.clientWidth+2,'No explorer overflow');
  }catch(e){errors.push(e.message);}finally{X.close();X.savePractice([]);keys.forEach((k,i)=>saved[i]===null?localStorage.removeItem(k):localStorage.setItem(k,saved[i]));history.replaceState(null,'',location.pathname+location.search+hash);X.mount(root);}
  out.textContent=checks+' student workflow assertions; '+errors.length+' failures.\n'+errors.join('\n');
 };
}());
