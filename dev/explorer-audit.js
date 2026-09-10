/* Local regression fixture: actual controls, no simulated diagnosis logic. */
(async function(){
 if(!['localhost','127.0.0.1'].includes(location.hostname))return;
 const root=document.querySelector('#preview'),out=document.querySelector('#qaResult');
 document.querySelector('#runExplorer').onclick=async()=>{
  let count=0;const errors=[];const check=(v,m)=>{count++;if(!v)throw Error(m);};
  const change=(host,key,value)=>{const input=host.querySelector('[data-control="'+key+'"]');input.value=value;input.dispatchEvent(new Event('change',{bubbles:true}));check(host.querySelector('[data-control="'+key+'"]')===input,'Native '+key+' picker retained');};
  const click=(host,key)=>host.querySelector('[data-action="'+key+'"]').click();
  const validate=host=>{const svg=host.querySelector('svg');check(!svg.querySelector('parsererror'),'SVG parse');check(svg.querySelector('rect[fill="#fff1f2"]'),'Pink paper');check(!/NaN|Infinity/.test(svg.outerHTML),'Finite SVG');check(host.scrollWidth<=host.clientWidth+2,'Outer overflow');const seen=new Set();for(const node of document.querySelectorAll('[id]')){check(!seen.has(node.id),'Duplicate ID '+node.id);seen.add(node.id);} };
  const tick=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  for(const record of window.ECG_EXPLORER.cases){
   try{
    window.ECG_EXPLORER.mount(root);change(root,'case',record.id);await tick();validate(root);
    check(root.querySelector('.explorer-findings h2').textContent===record.name,'Correct diagnosis');
    const n=root.querySelectorAll('[data-finding]').length;
    for(let i=0;i<n;i++){root.querySelector('[data-finding="'+i+'"]').click();check(root.querySelector('.ecg-finding-marks ellipse'),'Finding circle');check(root.querySelector('.explorer-explanation p').textContent.length>30,'Explanation');click(root,'focus');check(root.querySelector('[data-control="zoom"]').value==='2','Focus zoom');}
    const multiple=window.ECG_EXPLORER.build(record.id,false).findings.findIndex(f=>f.targets.length>1);
    if(multiple>=0){
     root.querySelector('[data-finding="'+multiple+'"]').click();click(root,'region');click(root,'focus');
     const paper=root.querySelector('.explorer-paper'),mark=root.querySelectorAll('.explorer-canvas .ecg-finding-marks ellipse')[1];
     const expected=Math.min(paper.scrollWidth-paper.clientWidth,Math.max(0,mark.getBoundingClientRect().left-paper.getBoundingClientRect().left+paper.scrollLeft-40));
     check(Math.abs(paper.scrollLeft-expected)<2,'Focus follows the selected marked region');
    }
    click(root,'highlights');check(!root.querySelector('.ecg-finding-marks'),'Hide highlights');click(root,'highlights');
    click(root,'practice');check(!root.querySelector('.explorer-finding-list'),'Hidden findings');check(!root.querySelector('.ecg-finding-marks'),'No answer marks');check(!root.textContent.includes(record.name),'No diagnosis leak');
    const answer=root.querySelector('textarea');answer.value='My interpretation';answer.dispatchEvent(new Event('input',{bubbles:true}));
    click(root,'enlarge');await tick();let dialog=document.querySelector('dialog');check(dialog.open,'Native enlarged dialog');check(!dialog.textContent.includes(record.name),'No enlarged answer leak');validate(dialog.firstElementChild);
    click(dialog,'reveal');check(dialog.querySelector('.explorer-findings h2').textContent===record.name,'Reveal diagnosis');check(dialog.querySelector('textarea').value==='My interpretation','Answer retained');
    click(dialog,'close');await tick();check(!document.querySelector('dialog'),'Closed dialog');check(root.querySelector('.explorer-findings h2').textContent===record.name,'Enlarged state retained');check(document.activeElement===root.querySelector('[data-action="enlarge"]'),'Focus restored');
    click(root,'next');check(root.querySelector('[data-action="reveal"]'),'Next button conceals practice case');click(root,'previous');check(root.querySelector('[data-control="case"]').value===record.id,'Previous reverses navigation');
    const next=window.ECG_EXPLORER.cases.find(c=>c.id!==record.id);change(root,'case',next.id);check(root.querySelector('[data-action="reveal"]'),'Next practice case concealed');check(root.querySelector('textarea').value==='','Answer reset');validate(root);
   }catch(e){errors.push(record.id+': '+e.message);window.ECG_EXPLORER.close();}
  }
  window.ECG_EXPLORER.mount(root);out.textContent=count+' assertions; '+errors.length+' failures at '+innerWidth+'px.\n'+errors.join('\n');
 };
}());
