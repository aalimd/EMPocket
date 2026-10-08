/* Presentation layer for The EM Pocket. All clinical teaching data and progress owners stay in their existing modules. */
(function () {
    'use strict';
    const ui = window.EM_POCKET_UI;
    if (!ui) return;
    const {stage,esc} = ui;
    const tracks = [
        ['first-shift','First emergency shift','Build an initial approach, recognise instability and communicate clearly.',['chest-pain','dyspnea','syncope','abdominal-pain']],
        ['circulation','Circulation & shock','Connect warning signs, reassessment and disposition.',['chest-pain','palpitations','syncope','shock']],
        ['breathing','Breathing','Compare respiratory presentations and escalation needs.',['dyspnea','hemoptysis','pediatric-respiratory-distress']],
        ['brain','Neurological presentations','Structure a time-sensitive assessment.',['headache','ams','seizures','weakness']],
        ['special-contexts','Special contexts','Revisit age, pregnancy and exposure-specific considerations.',['pregnancy-emergency','pediatric-fever','overdose','multiple-trauma']],
        ['ecg','ECG foundations','Learn the sequence, then compare findings in cases.',[]]
    ];
    const topics = () => window.CP_DATA || [];
    const byId = id => topics().find(t=>t.id===id);
    const notes = new WeakMap();
    let stableUrl = location.href, pending = null;
    let settingsReturn = null, returningFromSettings = null;
    const header = (k,title,text) => '<header class="design-header"><span class="study-kicker">'+esc(k)+'</span><h1 tabindex="-1">'+esc(title)+'</h1><p>'+esc(text)+'</p></header>';
    const action = (url,label,primary=false) => '<a class="design-action'+(primary?' primary':'')+'" href="'+esc(url)+'">'+esc(label)+' <span aria-hidden="true">→</span></a>';
    const card = (stat,title,text,url,label) => '<article class="design-card"><span class="design-stat">'+esc(stat)+'</span><h2>'+esc(title)+'</h2><p>'+esc(text)+'</p>'+action(url,label)+'</article>';
    function park() {
        if (location.hash.split('~')[0] === '#settings' && new URL(stableUrl).hash.split('~')[0] !== '#settings') {
            settingsReturn = { hash: new URL(stableUrl).hash || '#library', y: window.scrollY, title: stage.querySelector('h1')?.textContent || 'Library' };
        }
        ui.closeReadingPanel(false);
        const parking=document.getElementById('settingsParking');
        const install=document.getElementById('installBtn');if(install && parking && install.parentElement!==parking)parking.append(install);
        // Severity controls are shared with the reader: park them before replacing stage.
        const filters=document.querySelector('.context-filters');
        if(filters && stage.contains(filters)) {document.querySelector('.topbar').append(filters);filters.hidden=true;}
    }
    function dirty() { const n=stage.querySelector('#studyNote');return !!(n && notes.has(n) && n.value!==notes.get(n)); }
    function beforeRoute(continuation) {
        if(!dirty())return true;
        history.replaceState(null,'',stableUrl);
        pending=continuation;
        let dialog=document.getElementById('unsavedNoteDialog');
        if(!dialog) {
            dialog=document.createElement('dialog');dialog.id='unsavedNoteDialog';dialog.className='design-dialog';dialog.setAttribute('aria-labelledby','unsavedNoteTitle');
            dialog.innerHTML='<h2 id="unsavedNoteTitle">Save your learning note?</h2><p>You have changes that have not been saved.</p><div class="design-dialog-actions"><button class="design-action primary" type="button" data-note-save>Save &amp; continue</button><button class="design-action" type="button" data-note-discard>Discard changes</button><button class="design-action" type="button" data-note-stay>Keep editing</button></div>';
            document.body.append(dialog);
            const finish=save=>{const n=stage.querySelector('#studyNote');if(save)stage.querySelector('#saveNote')?.click();else if(n)n.value=notes.get(n);dialog.close();const next=pending;pending=null;if(next)next();};
            dialog.querySelector('[data-note-save]').onclick=()=>finish(true);
            dialog.querySelector('[data-note-discard]').onclick=()=>finish(false);
            const stay=()=>{pending=null;dialog.close();stage.querySelector('#studyNote')?.focus();};
            dialog.querySelector('[data-note-stay]').onclick=stay;
            dialog.addEventListener('cancel',e=>{e.preventDefault();stay();});
        }
        if(!dialog.open)dialog.showModal();
        return false;
    }
    function learn(target) {
        const short=window.STUDENT_LEARNING;
        if(target==='tracks') {
            stage.innerHTML=header('LEARN · GUIDED READING','Learning tracks','A reading order through existing presentations. Opening a topic does not mark it completed.')+
                '<div class="design-grid">'+tracks.map(([id,title,text,ids])=>card(id==='ecg'?'7 guide steps':ids.filter(byId).length+' presentations',title,text,'#learn~track-'+id,'Open track')).join('')+'</div>'+action('#learn~home','Back to Learn');
            return;
        }
        if(target.startsWith('track-')) {
            const track=tracks.find(t=>t[0]===target.slice(6));
            if(!track){stage.innerHTML=header('LEARN','Track not found','Choose an available learning track.')+action('#learn~tracks','Learning tracks');return;}
            stage.innerHTML=header('LEARN · READING TRACK',track[1],track[2])+(track[0]==='ecg'?'<ol class="design-track-list"><li>'+action('#ecg','Read the seven-step guide')+'</li><li>'+action('#ecg-explorer','Explore teaching cases')+'</li><li>'+action('#learn~visual-recordings','Compare recorded ECGs')+'</li></ol>':'<ol class="design-track-list">'+track[3].map(byId).filter(Boolean).map((cp,i)=>'<li><a href="#'+esc(cp.id)+'"><b>'+String(i+1).padStart(2,'0')+'</b><span><strong>'+esc(cp.name)+'</strong><small>'+esc(cp.tag)+'</small></span></a></li>').join('')+'</ol>')+'<div class="design-links">'+action('#learn~tracks','All tracks')+action('#learn~home','Learn')+'</div>';
            return;
        }
        if(target==='short') {
            stage.innerHTML=header('LEARN · RECALL PRACTICE','Short cases','Choose a fictional case. Answer the questions and read the explanation before rating your recall.')+'<div class="design-grid">'+(short?.cases||[]).map(c=>card(c.domain||'Recall practice',c.title||c.name,'Practise clinical reasoning with a short educational vignette.','#study~case-'+c.id,'Start case')).join('')+'</div>'+action('#learn~home','Back to Learn');
            return;
        }
        const p=short?.read()||{};
        const last=p.last && typeof p.last==='object'?p.last.route:p.last;
        const route=typeof last==='string'?last:'';
        const lastTopic=byId(route.split('~')[0]);
        let continueHtml='';
        // Read existing in-session decisions, without confusing an opened page with a completed activity.
        let sessions={};try{sessions=JSON.parse(sessionStorage.getItem('em-workspace-session-v1')||'{}');}catch(_){}
        const active=(window.EM_LEARNING_DATA?.cases||[]).find(c=>{const s=sessions[c.id];return s && !s.done && Number.isInteger(s.index) && s.index<c.steps.length;});
        if(active)continueHtml='<section class="design-continue"><span class="study-kicker">CASE IN PROGRESS · THIS BROWSER SESSION</span><h2>'+esc(active.title)+'</h2><p>Continue at decision '+(sessions[active.id].index+1)+' of '+active.steps.length+'.</p>'+action('#learn~case-'+active.id,'Continue case',true)+'</section>';
        else if(lastTopic)continueHtml='<section class="design-continue"><span class="study-kicker">LAST OPENED</span><h2>'+esc(lastTopic.name)+'</h2><p>Return to your last reading location. This does not imply completion.</p>'+action('#'+route,'Continue reading',true)+'</section>';
        stage.innerHTML=header('THE EM POCKET · ACTIVE LEARNING','Learn','Choose a reading track, practise a decision, or review what you have saved.')+continueHtml+
            '<div class="design-grid">'+card('6 evolving cases','Make a decision','Work through changing observations, decisions and reassessment.','#learn~practice','Choose a case')+card('12 short cases','Practise recall','Answer focused questions and check the reasoning.','#learn~short','Choose a short case')+card('6 reading tracks','Follow a track','Build a reading sequence through the existing library and ECG guide.','#learn~tracks','Browse tracks')+card('5 visual activities','Connect findings','Explore annotated diagrams and recorded ECGs with source and scope labels.','#learn~visuals','Explore visuals')+card('6 preparation modules','Prepare & discuss','Use structured exercises for supervised practice and communication.','#learn~skills','Open preparation')+card(ui.dueIds().length+' topics due','Review queue','Review intervals follow your marked reviews: 1, 3, 7 and 14 days.','#study~due','Open review queue')+'</div>'+ '<section class="design-section"><h2>Your learning tools</h2><div class="design-links">'+action('#study~saved','Saved topics · '+ui.savedIds().length)+action('#learn~progress','Progress & backup')+action('#ecg-hub','ECG learning')+'</div><p class="clinical-safety-note">Progress records your attempts and self-assessment on this device. It is not a measure of clinical competence.</p></section>';
    }
    function ecg() {
        stage.innerHTML=header('THE EM POCKET · ECG LEARNING','ECG','Start with a systematic approach, explore annotated teaching tracings, then compare recorded signals.')+'<div class="design-grid">'+card('7 steps · 18 patterns','Read the guide','Build a consistent interpretation sequence with 27 interactive figures.','#ecg','Open guide')+card('69 teaching cases','Explore cases','Locate findings, compare examples and test your interpretation. These tracings are simulated for teaching.','#ecg-explorer','Explore cases')+card('12 PTB-XL recordings','Read recorded ECGs','Inspect de-identified recorded signals with dataset attribution and recording metadata.','#learn~visual-recordings','Open recordings')+'</div><section class="settings-section"><h2>Read the signal with its context</h2><p>Teaching tracings and recorded ECGs have different sources. Check the source label, speed, gain and display calibration in each viewer. Browser size and zoom do not provide physical paper calibration.</p>'+action('#learn~visual-ecg-pairs','Compare ECG teaching patterns')+'</section>';
    }
    function search(query) {
        query=String(query||'').slice(0,120);
        stage.innerHTML=header('THE EM POCKET · SEARCH','Search','Find presentations, section headings, diagnoses, learning cases and ECG examples.')+'<form class="design-search-form"><label for="fullSearch">Search the local library</label><div><input id="fullSearch" type="search" maxlength="120" autocomplete="off" value="'+esc(query)+'"><button type="submit" class="design-action primary">Search</button></div></form><div class="design-search-filters" role="group" aria-label="Result type">'+[['all','All'],['library','Library'],['learn','Learn'],['ecg','ECG']].map(([value,label])=>'<button type="button" class="chip" data-search-type="'+value+'" aria-pressed="'+(value==='all')+'">'+label+'</button>').join('')+'</div><p class="design-search-count" role="status"></p><div class="design-search-results"></div><button type="button" class="design-action" data-search-more hidden>Show more results</button>';
        const hits=ui.findSearchHits(query);let type='all',shown=40;
        const category=h=>h.cpId==='learn'?'learn':['ecg','ecg-explorer'].includes(h.cpId)?'ecg':'library';
        function draw() {
            const selected=hits.filter(h=>type==='all'||category(h)===type);
            stage.querySelector('.design-search-count').textContent=query.length<2?'Enter at least two characters.':'Showing '+Math.min(shown,selected.length)+' of '+selected.length+' results for “'+query+'”';
            stage.querySelector('.design-search-results').innerHTML=selected.length?selected.slice(0,shown).map(h=>'<a class="search-result-card" href="#'+esc(h.cpId)+(h.target?'~'+esc(h.target):'')+'"><span class="design-stat">'+esc(h.kind)+'</span><h2>'+esc(h.title)+'</h2><p>'+esc(h.sub||'')+'</p></a>').join(''):'<div class="design-empty"><h2>'+ (query.length<2?'Start a search':'No matching results')+'</h2><p>'+ (query.length<2?'Use a topic, diagnosis, finding or activity name.':'Try another term or choose another result type.')+'</p></div>';
            stage.querySelector('[data-search-more]').hidden=shown>=selected.length;
        }
        stage.querySelector('form').onsubmit=e=>{e.preventDefault();location.hash='search~'+encodeURIComponent(stage.querySelector('#fullSearch').value.trim());};
        stage.querySelectorAll('[data-search-type]').forEach(b=>b.onclick=()=>{type=b.dataset.searchType;shown=40;stage.querySelectorAll('[data-search-type]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));draw();});
        stage.querySelector('[data-search-more]').onclick=()=>{shown+=40;draw();};draw();
    }
    function settings() {
        stage.innerHTML=header('THE EM POCKET · ON THIS DEVICE','Settings','Manage offline access, installation and your learning records on this device.')+'<section class="settings-section"><h2>Reading &amp; appearance</h2><p>Use Aa in the top bar to change text size, appearance and colour without leaving your page.</p><button type="button" class="design-action" data-display-options>Open display options</button></section><section class="settings-section"><h2>Offline access & installation</h2><p class="settings-offline" id="offlineStatus">'+esc(ui.offlineStatus)+'</p><p>After offline setup succeeds, presentations, learning activities and ECG data are available without a connection. External reference links require internet access.</p><div id="settingsInstall"></div><details><summary>Install instructions</summary><p>On iPhone or iPad, open this site in Safari, choose Share, then Add to Home Screen. On supported desktop and Android browsers, use the browser’s Install app option.</p></details></section><section class="settings-section"><h2>Your learning records</h2><p>Export a backup or review an import before adding missing records. Existing records and preferences are preserved.</p>'+action('#learn~progress','Progress & backup')+'</section><section class="settings-section"><h2>About The EM Pocket</h2><p>An independent, free emergency medicine learning reference. No account is required.</p><div class="design-links"><button type="button" class="design-action" data-clinical-notice>Clinical notice</button><a class="design-action" href="mailto:apps@aamd.sa?subject=The%20EM%20Pocket%20feedback">Send feedback</a><button type="button" class="design-action" data-print>Print / Save as PDF</button></div><p>Release 20261008-search-refocus-v38 · Content sources and review dates are listed with each presentation.</p></section>';
        const back=settingsReturn || {hash:'#library',y:0,title:'Library'};
        const backButton=document.createElement('button');backButton.type='button';backButton.className='back-btn settings-return';backButton.textContent='Back to '+back.title;
        backButton.onclick=()=>{returningFromSettings=back;location.hash=back.hash;};stage.prepend(backButton);
        stage.querySelector('[data-display-options]').onclick=e=>ui.openReadingPanel(e.currentTarget);
        const install=document.getElementById('installBtn');if(install)stage.querySelector('#settingsInstall').append(install);
        stage.querySelector('[data-clinical-notice]').onclick=()=>ui.showDisclaimer(true);
        stage.querySelector('[data-print]').onclick=()=>window.print();
    }
    function afterRoute() {
        const changed=stableUrl!==location.href;
        stableUrl=location.href;
        const n=stage.querySelector('#studyNote');
        if(n && !notes.has(n)) {
            notes.set(n,n.value);
            n.setAttribute('aria-describedby','noteStatus');
            const status=stage.querySelector('#noteStatus');if(status)status.setAttribute('role','status');
            n.addEventListener('input',()=>{if(status)status.textContent=n.value===notes.get(n)?'No unsaved changes.':'Unsaved changes · '+n.value.length+' / 800 characters';});
            stage.querySelector('#saveNote')?.addEventListener('click',()=>notes.set(n,n.value));
        }
        const route=location.hash.slice(1).split('~');
        if((['ecg','ecg-explorer'].includes(route[0])||route.join('~')==='learn~visual-recordings')&&!stage.querySelector('.ecg-local-nav')) {
            const nav=document.createElement('nav');nav.className='ecg-local-nav';nav.setAttribute('aria-label','ECG sections');
            nav.innerHTML=[['#ecg-hub','Overview'],['#ecg','Guide'],['#ecg-explorer','Cases'],['#learn~visual-recordings','Recordings']].map(([href,label])=>'<a href="'+href+'"'+(location.hash.split('~')[0]===href||(href==='#learn~visual-recordings'&&route.join('~')==='learn~visual-recordings')?' aria-current="page"':'')+'>'+label+'</a>').join('');stage.prepend(nav);
            ui.syncNav('ecg');
        }
        if(changed && ['learn','settings','ecg-hub','study','search'].includes(route[0])) {window.scrollTo({top:0});const heading=stage.querySelector('h1');if(heading && !document.querySelector('dialog[open]')){heading.tabIndex=-1;heading.focus({preventScroll:true});}}
        if(returningFromSettings) {
            const back=returningFromSettings;returningFromSettings=null;
            if(location.hash===back.hash)requestAnimationFrame(()=>{if(location.hash===back.hash){window.scrollTo({top:back.y,behavior:'instant'});stage.focus({preventScroll:true});}});
        }
        const filterLabel=document.querySelector('.context-filters .cf-label');
        const selection=document.querySelector('#filterChips [aria-pressed="true"]');
        if(filterLabel)filterLabel.textContent='Severity'+(selection&&selection.dataset.sev!=='all'?' · '+selection.textContent.trim():'');
    }
    window.addEventListener('beforeunload',e=>{if(dirty()){e.preventDefault();e.returnValue='';}});
    window.POCKET_DESIGN={park,beforeRoute,afterRoute,learn,ecg,settings,search,dirty};
}());
