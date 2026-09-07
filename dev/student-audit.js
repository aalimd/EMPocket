/* Local student journeys; restore only the progress keys this test changes. */
(function(){
 if(!['localhost','127.0.0.1'].includes(location.hostname))return;
 const run=document.createElement('button');run.id='runStudent';run.textContent='Run student journeys';document.querySelector('.qa-row').append(run);
 run.onclick=async()=>{
  const frame=document.querySelector('#app'),w=frame.contentWindow,d=frame.contentDocument,out=document.querySelector('#result');let count=0;const failures=[];
  const check=(v,label)=>{count++;if(!v)throw Error(label);};const tick=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  const route=async s=>{w.location.hash=s;await tick();};
  const storage=['em-student-progress','em-cps-learning'].map(k=>[k,w.localStorage.getItem(k)]);
  const session=w.sessionStorage.getItem('ecg-explorer-view');
  try{
   await route('study~case');const S=w.STUDENT_LEARNING;check(!!S,'Student module loaded');
   const positions=new Set();
   for(let i=0;i<S.cases.length;i++){
    const select=d.querySelector('[data-practice-case]');select.value=i;select.dispatchEvent(new w.Event('change',{bubbles:true}));await tick();
    check(d.querySelector('[data-vignette]').dataset.vignette===S.cases[i].id,'Selected case');
    check(d.querySelector('.case-complete').hidden,'No early completion');
    const fields=[...d.querySelectorAll('[data-question]')];
    for(const [j,field]of fields.entries()){
     check(!field.querySelector('.quiz-feedback').textContent,'No early feedback');const buttons=[...field.querySelectorAll('[data-choice]')];positions.add(buttons.findIndex(b=>b.dataset.choice==='best'));
     buttons.find(b=>b.dataset.choice===(j?'best':'alt0')).click();
     check(field.querySelector('.quiz-feedback').textContent.includes(S.cases[i].questions[j].options.find(o=>o.id===(j?'best':'alt0')).why),'Specific feedback');
     check([...field.querySelectorAll('[data-choice]')].every(b=>b.disabled),'Attempt locked');
     if(!j)check(d.querySelector('.case-complete').hidden,'Both attempts required');
    }
    check(!d.querySelector('.case-complete').hidden,'Completion available');d.querySelector('[data-confidence="again"]').click();check(S.read().ratings['case:'+S.cases[i].id].value==='again','Case self-rating');
   }
   check(positions.size>1,'Correct positions vary');
   await route('chest-pain');check(!d.querySelector('#section-how-to-think').classList.contains('closed'),'Reasoning open');check(d.querySelector('.student-glossary'),'Glossary');check(d.querySelector('#reviewBtn').hidden,'No premature review button');
   d.querySelectorAll('[data-reveal]').forEach(b=>b.click());check(!d.querySelector('.recall-confidence').hidden,'Recall self-rating unlocked');d.querySelector('[data-confidence="partly"]').click();check(S.read().ratings['topic:chest-pain'].value==='partly','Topic self-rating');
   await route('ecg-explorer~mobitz-i');check(d.querySelector('[data-control="case"]').value==='mobitz-i','Case deep link');
   const paper=d.querySelector('.explorer-paper');check(paper.scrollWidth<=paper.clientWidth+2,'Whole ECG fits');
   d.querySelector('[data-finding="1"]').click();check(d.querySelector('.explorer-detail svg'),'Explanation includes target');check(d.querySelector('.explorer-detail .ecg-finding-marks'),'Detail red marks');
   await route('ecg');await route('ecg-explorer');check(d.querySelector('[data-control="case"]').value==='mobitz-i','Return keeps case');check(d.querySelector('[data-finding="1"]').getAttribute('aria-pressed')==='true','Return keeps finding');
   d.querySelector('[data-action="practice"]').click();check(!w.location.hash.includes('mobitz'),'Practice URL hides diagnosis');d.querySelector('[data-action="reveal"]').click();d.querySelector('[data-confidence="again"]').click();check(S.read().ratings['ecg:mobitz-i'].value==='again','ECG rating');
   await route('home');check(d.querySelector('.student-start').textContent.includes('Revisit your weak areas'),'Weak areas shown');check(!d.querySelector('.topbar .context-filters'),'Filter separate from reading');
   const input=d.querySelector('#searchInput');input.value='Mobitz';input.dispatchEvent(new w.Event('input',{bubbles:true}));await new Promise(r=>setTimeout(r,350));check([...d.querySelectorAll('.res-item')].some(x=>x.dataset.id==='ecg-explorer'&&x.dataset.target==='mobitz-i'),'Search finds interactive case');
   input.value='RBBB';input.dispatchEvent(new w.Event('input',{bubbles:true}));await new Promise(r=>setTimeout(r,350));check([...d.querySelectorAll('.res-item')].some(x=>x.dataset.target==='rbbb'),'Search supports ECG abbreviation');
   const ids=[...d.querySelectorAll('[id]')].map(n=>n.id);check(new Set(ids).size===ids.length,'Unique document IDs');
  }catch(e){failures.push(e.message);}finally{for(const[k,v]of storage){if(v===null)w.localStorage.removeItem(k);else w.localStorage.setItem(k,v);}if(session===null)w.sessionStorage.removeItem('ecg-explorer-view');else w.sessionStorage.setItem('ecg-explorer-view',session);}
  out.textContent=count+' student journey assertions; '+failures.length+' failures.\n'+failures.join('\n');
 };
}());
