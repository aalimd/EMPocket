/* Local-only acceptance tests for learning UI; restore any saved progress. */
(function(){
 if(!['localhost','127.0.0.1'].includes(location.hostname))return;
 const button=document.createElement('button');button.textContent='Run learning checks';button.id='runLearning';document.querySelector('#qa').append(button);
 const out=document.createElement('pre');out.id='learningResult';document.querySelector('#qa').append(out);
 button.onclick=async()=>{
  let checks=0;const errors=[],root=document.querySelector('#preview'),X=window.ECG_EXPLORER;
  const check=(v,m)=>{checks++;if(!v)throw Error(m);},click=(key)=>root.querySelector('[data-action="'+key+'"]').click();
  const tick=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  for(const c of X.cases){try{
   X.mount(root,{id:c.id});
   const item=X.build(c.id,false);
   for(let i=0;i<item.findings.length;i++){
    root.querySelector('[data-finding="'+i+'"]').click();click('locate-practice');
    check(!root.querySelector('.ecg-finding-marks'),'Location answer is exposed');check(!root.querySelector('.explorer-detail'),'Location detail exposes answer');
    const svg=root.querySelector('.explorer-canvas svg'),paper=root.querySelector('.explorer-paper');
    const tap=(x,y)=>{const p=svg.createSVGPoint();p.x=x;p.y=y;const q=p.matrixTransform(svg.getScreenCTM());svg.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:q.x,clientY:q.y}));};
    tap(0,0);check(root.querySelector('.explorer-location-feedback').textContent.includes('outside'),'Incorrect answer feedback');
    const [x,y,w,h]=item.findings[i].targets[0];tap(x+w/2,y+h/2);check(root.querySelector('.explorer-location-feedback').textContent.includes('Correct region'),'Correct answer feedback');
    paper.focus();paper.dispatchEvent(new KeyboardEvent('keydown',{bubbles:true,key:'ArrowRight'}));check(svg.querySelector('.explorer-cursor'),'Keyboard cursor');
    click('show-location');check(root.querySelector('.ecg-finding-marks ellipse'),'Answer location restored');check(document.activeElement===root.querySelector('[data-finding="'+i+'"]'),'Answer restores keyboard focus');
   }
   click('compare');check(root.querySelector('.explorer-comparison'),'Comparison control');
   const ref=root.querySelector('.explorer-reference-canvas svg');
   {check(ref,'Missing normal model');check(ref.getAttribute('viewBox')===root.querySelector('.explorer-canvas svg').getAttribute('viewBox'),'Matching comparison dimensions');
    const zoom=root.querySelector('[data-control="zoom"]');zoom.value='2';zoom.dispatchEvent(new Event('change',{bubbles:true}));
    check(root.querySelector('.explorer-reference-canvas').style.width==='200%','Linked zoom');
    await tick();const a=root.querySelector('.explorer-paper'),b=root.querySelector('.explorer-reference-paper');a.scrollLeft=80;a.dispatchEvent(new Event('scroll'));await tick();check(Math.abs(a.scrollLeft-b.scrollLeft)<2,'Linked horizontal scroll');
   }
   click('practice');check(!root.querySelector('.explorer-comparison'),'Practice leaked normal comparison');
   check(!root.querySelector('.ecg-finding-marks'),'Practice leaked highlights');
   click('reveal');check(root.querySelector('.explorer-practice-feedback').textContent.includes('not automatically graded'),'Honest answer feedback');
   check(root.scrollWidth<=root.clientWidth+2,'Page overflow');
  }catch(e){errors.push(c.id+': '+e.message);X.close();}out.textContent='Checking learning… '+c.id;await tick();}
  const saved=localStorage.getItem('em-ecg-learning-v1'),hash=location.hash;
  try{
   localStorage.removeItem('em-ecg-learning-v1');history.replaceState(null,'','#ecg-explorer');X.mount(root,{id:'normal'});
   click('complete');root.querySelector('[data-finding="2"]').click();click('save-review');
   X.mount(root);check(root.querySelector('[data-control="case"]').value==='normal','Resume case');check(root.querySelector('[data-finding="2"]').getAttribute('aria-pressed')==='true','Resume finding');check(root.querySelector('[data-action="complete"]').getAttribute('aria-pressed')==='true','Completion persisted');
   click('continue');check(root.querySelector('[data-control="case"]').value!=='normal','Continue moves to uncompleted case');click('review-next');check(root.querySelector('[data-control="case"]').value==='normal'&&root.querySelector('[data-finding="2"]').getAttribute('aria-pressed')==='true','Review queue restores exact finding');
  }catch(e){errors.push('Persistence: '+e.message);}finally{if(saved===null)localStorage.removeItem('em-ecg-learning-v1');else localStorage.setItem('em-ecg-learning-v1',saved);history.replaceState(null,'',location.pathname+location.search+hash);}
  X.mount(root);out.textContent=checks+' learning assertions; '+errors.length+' failures at '+innerWidth+'px.\n'+errors.join('\n');
 };
}());
