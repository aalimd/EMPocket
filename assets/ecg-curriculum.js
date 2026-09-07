/* Essential ECG curriculum: authored teaching strips and existing reviewed panels. */
(function () {
 'use strict';
 const E=window.ECG_ENGINE, I=window.ECG_INTERACTIVE, lib=window.ECG_SVG;
 const sources={rhythm:{label:'AHA 2025 · Adult advanced life support',url:'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support'},block:{label:'AV block · clinical reference',url:'https://www.merckmanuals.com/professional/cardiovascular-disorders/specific-cardiac-arrhythmias/atrioventricular-block'},bbb:{label:'Bundle branch block · clinical reference',url:'https://www.msdmanuals.com/professional/cardiovascular-disorders/specific-cardiac-arrhythmias/bundle-branch-block-and-fascicular-block'},acs:{label:'ESC · Acute coronary syndromes',url:'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/acute-coronary-syndromes/'}};
 Object.assign(sources,{
  flutter:{label:'Atrial flutter · clinical reference',url:'https://www.merckmanuals.com/professional/cardiovascular-disorders/specific-cardiac-arrhythmias/atrial-flutter'},
  qt:{label:'Long QT and torsades · clinical reference',url:'https://www.merckmanuals.com/professional/cardiovascular-disorders/specific-cardiac-arrhythmias/torsades-de-pointes-ventricular-tachycardia'}
 });
 const cases=[];
 function add(id,name,category,summary,kind,lessons,source='rhythm',stem='') {cases.push({id,name,category,summary,kind,lessons,source,stem,guide:'step-rhythm-axis'});}
 // Lesson windows are milliseconds within the displayed lead, not screen coordinates.
 const L=(title,explanation,a=600,b=2400,lane=0)=>({title,explanation,a,b,lane});
 add('sinus-brady','Sinus bradycardia','Rhythms','A sinus rhythm at 45/min in this example. Rate alone does not establish the cause or clinical significance.','brady',[
 L('Slow regular ventricular rate','R–R intervals are about 1.33 seconds: 60,000 / 1,333 is approximately 45/min.',300,1900),L('P before every QRS','An upright lead-II P wave precedes every narrow QRS with the same PR interval.',320,620),L('Interpret perfusion and context','This rhythm may be physiological or secondary to disease or medication. Assess symptoms, blood pressure and perfusion.',0,6000)]);
 add('sinus-tachy','Sinus tachycardia','Rhythms','Regular sinus activity at 120/min. Look for a physiological or pathological driver rather than diagnosing the cause from rate alone.','tachy',[
 L('Regular 120/min rhythm','QRS complexes recur every 500 ms, corresponding to 120/min.',450,1550),L('Consistent P–QRS relationship','P waves precede the QRS with a fixed PR. At faster rates P can approach the preceding T wave.',800,1090),L('Narrow QRS','The modeled QRS is 90 ms. This example does not show a wide-complex tachycardia.',990,1100)]);
 add('flutter','Atrial flutter · 2:1 conduction','Rhythms','Continuous flutter activity at 300/min with a ventricular response of 150/min. A regular rate near 150 should prompt inspection for hidden flutter waves.','flutter',[
 L('Continuous flutter activity','Negative sawtooth activity repeats every 200 ms in this lead-II teaching strip. There is no normal isoelectric P–P baseline.',550,1150),L('Two atrial cycles per QRS','The atrial rate is twice the ventricular rate; one flutter wave can be obscured by QRS or T.',700,1500),L('Regular ventricular response','QRS complexes recur every 400 ms: a ventricular rate of 150/min.',450,1700)]);
 add('svt','Regular narrow-complex SVT','Rhythms','A regular narrow-complex tachycardia at 180/min. The strip illustrates SVT morphology without assigning an AVNRT or AVRT mechanism.','svt',[
 L('Fast regular QRS train','The R–R interval is approximately 333 ms, corresponding to 180/min.',450,1500),L('Narrow complexes','The modeled QRS is 80 ms. QRS width and regularity help organize the differential.',490,600),L('No separate visible sinus P','No distinct sinus P wave is visible in this teaching example. P may be buried or retrograde; this alone cannot identify the circuit.',590,800)]);
 add('junctional','Junctional escape rhythm','Rhythms','A regular narrow-complex escape rhythm at 40/min with no visible preceding P wave. Retrograde P waves may have different positions in real tracings.','junctional',[
 L('Slow narrow escape','The modeled ventricular interval is 1.5 seconds, corresponding to 40/min.',450,2200),L('No preceding sinus P','Inspect the baseline before QRS: no distinct sinus P is drawn. A complete ECG and clinical assessment are required.',260,590)]);
 add('first-degree','First-degree AV block','Conduction','Every P conducts, but the PR is prolonged to 280 ms. This is AV conduction delay without dropped ventricular beats.','first',[
 L('Prolonged PR','Measure from P onset to QRS onset: this model uses 280 ms, above the adult 200 ms threshold.',210,510),L('One P for each QRS','Each regular atrial impulse is followed by a QRS. No impulses are dropped in first-degree AV block.',200,2250)],'block');
 add('mobitz-i','Mobitz I · Wenckebach','Conduction','Progressive PR prolongation culminates in a nonconducted P wave, then the sequence resets.','mobitz1',[
 L('PR progressively lengthens','The conducted PR intervals are 160, 220 and 280 ms in this repeating group.',180,2140),L('P wave without QRS','The fourth P wave is not followed by a ventricular complex.',2520,3040),L('PR resets after the pause','The next conducted beat returns to the shortest PR of 160 ms.',3350,3800)],'block');
 add('mobitz-ii','Mobitz II AV block','Conduction','An on-time P wave suddenly fails to conduct while the PR intervals before and after it remain constant.','mobitz2',[
 L('Constant conducted PR','Conducted beats have the same 180 ms PR, without progressive lengthening.',180,1980),L('Abrupt dropped QRS','The fourth P wave occurs on schedule but has no following QRS. The atrial cycle remains constant.',2520,3040),L('PR unchanged after the block','The next conducted beat has the same PR as those before the dropped beat. Exclude mimics such as blocked atrial ectopy.',3350,3780)],'block');
 add('two-to-one','2:1 AV block','Conduction','Every alternate P wave is nonconducted. A 2:1 strip alone cannot reliably classify Mobitz I versus Mobitz II.','twoone',[
 L('Two P waves for each QRS','Atrial activity continues at 75/min while ventricular complexes occur at about 37.5/min.',180,2240),L('Alternate P is blocked','Inspect the isolated P between two conducted beats; it is not followed by QRS.',950,1360),L('Do not force a Mobitz label','Only one conducted PR is seen per pair, so progressive PR behavior cannot be assessed from this pattern alone.',180,3600)],'block');
 add('rbbb','Right bundle branch block','Conduction','Focused V1 and V6 views illustrate a broad QRS, terminal R′ in V1 and a broad terminal S in V6.','rbbb',[
 L('Broad rSR′ in V1','The QRS is 150 ms with a terminal positive R′ in the right precordial view.',480,670),L('Broad terminal S in V6','The lateral view has a widened terminal negative deflection. Read the lead views together.',480,670,1),L('Secondary repolarization','The terminal T direction opposes the late QRS direction in the right precordial example.',650,970)],'bbb');
 add('lbbb','Left bundle branch block','Conduction','Focused V1 and V6 views illustrate a broad predominantly negative right-precordial QRS and broad notched lateral R.','lbbb',[
 L('Broad negative QRS in V1','The QRS is 160 ms and predominantly negative in this right precordial lead.',480,680),L('Broad notched R in V6','The lateral QRS is broad and positive, with no initial septal q in this modeled view.',480,680,1),L('Discordant ST–T direction','Repolarization opposes the major QRS direction. New LBBB alone does not establish acute coronary occlusion.',660,980,1)],'bbb');
 add('long-qt','Prolonged QT','Intervals and ectopy','At 60/min, this example has QT 540 ms; the rate-corrected value is also 540 ms. The tracing does not distinguish acquired from congenital causes.','longqt',[
 L('QT to the end of T','Measure from QRS onset at 500 ms to T end at 1,040 ms. A separate U wave would not be included.',490,1050),L('Rate correction matters','The R–R is 1,000 ms here, so QT and QTc coincide. At other rates the correction formula affects interpretation.',490,1520),L('Assess reversible causes','Review medications, electrolytes and prior ECGs. QT prolongation raises concern for torsades risk but does not predict an individual event.',490,2050)],'rhythm');
 add('pvc','Premature ventricular complex','Intervals and ectopy','An early broad ventricular complex interrupts sinus rhythm and is followed by a full compensatory pause in this example.','pvc',[
 L('Early broad complex','The ectopic QRS arrives at 1,900 ms, earlier than the expected sinus beat at 2,100 ms; it is broad and has a different shape.',1880,2140),L('No preceding conducted P','No P wave is drawn immediately before the ectopic complex. The ventricular morphology differs from the sinus complexes.',1740,2150),L('Compensatory pause','The normal QRS before the PVC and the next normal QRS are 1,600 ms apart, twice the baseline 800 ms cycle.',1290,3020)]);
 add('pac','Premature atrial complex','Intervals and ectopy','An early atrial depolarization with a different P shape conducts through a narrow QRS and resets the rhythm.','pac',[
 L('Premature altered P','The early atrial wave before the 1,900 ms QRS has a different polarity in this example.',1700,1920),L('Narrow conducted QRS','The premature atrial impulse conducts with the same narrow ventricular morphology as the sinus beats.',1880,2020),L('Noncompensatory pause','The normal beats on either side are less than two baseline cycles apart because the atrial ectopy resets timing.',1290,2820)]);
 add('ventricular-paced','Ventricular paced rhythm','Conduction','Pacing stimuli precede broad ventricular complexes. Electrical capture is illustrated; mechanical capture requires clinical assessment.','paced',[
 L('Pacing stimulus','A narrow vertical stimulus precedes each QRS. Modern bipolar pacing spikes can be subtle on a real ECG.',465,540),L('Electrical capture','Each stimulus is followed by a broad complex in this example. Check every spike rather than assuming capture.',470,740),L('Secondary ST–T changes','The repolarization direction opposes the broad QRS. A paced ECG still requires ischemia assessment in the appropriate setting.',650,1010)]);
 add('vf','Ventricular fibrillation','Arrest rhythms','Disorganized ventricular activity with no repeating organized QRS. Assess the patient immediately and distinguish artifact.','vf',[
 L('Disorganized waveform','The amplitude, contour and interval vary without a repeating P–QRS–T sequence.',500,2300),L('No organized QRS train','There are no consistently identifiable ventricular complexes to count as a perfusing rhythm.',2500,4500),L('Clinical arrest assessment','In an unresponsive patient without a pulse, VF is a shockable arrest rhythm. ECG appearance must be correlated with the patient.',0,6000)]);
 add('torsades','Torsades de pointes pattern','Arrest rhythms','Prolonged QT in the initial sinus beats precedes a polymorphic ventricular run with waxing and waning amplitude.','torsades',[
 L('Prolonged QT before the run','The initial sinus beats have QT 540 ms at 60/min. Torsades is polymorphic VT associated with prolonged QT, not every polymorphic VT.',490,1050),L('Changing polarity and amplitude','The ventricular run changes direction and amplitude around the baseline. This is an illustrative rhythm strip.',3050,5900),L('No stable complexes for synchronization','Polymorphic VT is unstable; the AHA guidance calls for immediate unsynchronized shock rather than delaying for synchronization.',3200,5500)]);
 add('asystole','Asystole · verify the recording','Arrest rhythms','No discernible ventricular electrical activity is illustrated. Confirm the patient, electrodes, leads and gain before labeling asystole.','asystole',[
 L('No ventricular complexes','There is no organized ventricular activity in this idealized recording.',300,2200),L('Exclude technical causes and fine VF','Check another lead, electrode contact and gain; a flat line can also reflect a disconnected system.',2400,4400),L('Nonshockable arrest rhythm','When cardiac arrest with asystole is confirmed, follow the nonshockable arrest pathway. Defibrillation does not treat asystole.',0,6000)]);
 add('pea','Pulseless electrical activity · clinical case','Arrest rhythms','Organized electrical activity without a palpable pulse is PEA. There is no unique ECG shape that diagnoses PEA.','pea',[
 L('Organized electrical activity','The strip contains repeating narrow ventricular complexes. Their presence does not establish mechanical circulation.',450,2250),L('The absent pulse defines this case','The supplied clinical scenario, not the waveform alone, makes this PEA. The same electrical tracing could occur with a pulse.',2500,4600),L('Nonshockable arrest pathway','Confirmed PEA requires the nonshockable pathway and a search for reversible causes. Reassess the rhythm as care continues.',0,6000)],'rhythm','Clinical scenario: the patient is unresponsive, is not breathing normally, and has no palpable pulse.');
 cases.find(c=>c.id==='flutter').source='flutter';
 cases.find(c=>c.id==='long-qt').source='qt';
 const panels=[
 ['hyperacute-t','Hyperacute T-wave comparison','Ischemia','Compare normal, broad hyperacute and narrow peaked T morphology. Distribution, symptoms and serial change remain essential.'],
 ['sgarbossa','Modified Sgarbossa patterns','Ischemia','Concordant and excessive discordant ST changes support occlusion assessment in LBBB or ventricular pacing.'],
 ['posterior-omi','Posterior occlusion pattern','Ischemia','Anterior mirror changes are compared with a posterior V8 view; obtain the full supplemental lead set clinically.'],
 ['avr-lmca','Diffuse ST depression with aVR elevation','Ischemia','A global ischemia pattern that does not identify a specific coronary lesion. Consider ACS and supply–demand causes.'],
 ['hyperkalemia','Hyperkalemia · three appearances','Metabolic and toxic','Peaked T, conduction slowing and sine-wave appearances are alternatives, not a predictable sequence or potassium-level scale.'],
 ['hypokalemia','Hypokalemia pattern','Metabolic and toxic','Small T waves, ST depression and prominent separate U waves are illustrated. Confirm potassium with laboratory testing.'],
 ['hypothermia','Hypothermia · J wave','Metabolic and toxic','A J hump follows QRS. The ECG alone cannot establish body temperature or the cause of a J wave.'],
 ['tca-toxicity','Sodium-channel blockade pattern','Metabolic and toxic','Broad QRS and terminal R in aVR are clues in a compatible toxic exposure; assess the clinical context.'],
 ['vt-vs-svt','Monomorphic ventricular tachycardia','Rhythms','Wide ventricular tachycardia with modeled AV dissociation, capture and fusion beats. These features may be absent in real VT.'],
 ['complete-heart-block','Complete AV block','Conduction','Independent atrial activity continues while a slower ventricular escape rhythm provides ventricular activation.'],
 ['wpw','Ventricular pre-excitation · WPW pattern','Conduction','Short PR and delta upstroke illustrate sinus pre-excitation. This is not a tracing of pre-excited atrial fibrillation.'],
 ['brugada','Brugada type 1 pattern','Other important patterns','Coved right-precordial ST elevation followed by T inversion requires proper lead placement and exclusion of phenocopies.'],
 ['pe-strain','Right ventricular strain pattern','Other important patterns','S1Q3T3 and anterior T inversion are strain clues, neither diagnostic nor sufficiently sensitive to exclude pulmonary embolism.'],
 ['pericarditis-ber','Pericarditis pattern','Other important patterns','PR depression and ST elevation are illustrated in selected leads. Concavity alone cannot distinguish pericarditis from coronary occlusion.'],
 ['electrical-alternans','Electrical alternans','Other important patterns','Repeating changes in QRS amplitude are illustrated. This finding alone does not diagnose tamponade.'],
 ['hypertrophy','LVH voltage and low-voltage comparison','Other important patterns','Compare high-voltage and low-voltage examples. Voltage criteria alone do not establish anatomic hypertrophy.']
 ];
 panels.forEach(([id,name,category,summary])=>cases.push({id,name,category,summary,library:id,guide:id,source:category==='Ischemia'?'acs':null}));
 const interpolate=(t,points,smooth=false)=>{if(t<points[0][0]||t>points[points.length-1][0])return 0;for(let j=1;j<points.length;j++)if(t<=points[j][0]){const[a,x]=points[j-1],[b,y]=points[j];const u=(t-a)/(b-a);return x+(y-x)*(smooth?u*u*(3-2*u):u);}return 0;};
 function stripData(kind) {
  const data={kind,duration:6000,lanes:kind==='rbbb'||kind==='lbbb'?['V1','V6']:['II'],p:[],beats:[],rate:75};
  let rr=800,pr=160,qrs=90,qt=380;
  if(kind==='brady')rr=60000/45;if(kind==='tachy'){rr=500;qt=320;}if(kind==='flutter'){rr=400;qt=270;}if(kind==='svt'){rr=60000/180;qt=240;qrs=80;}if(kind==='junctional'||kind==='pea')rr=1500;
  if(kind==='first')pr=280;if(kind==='longqt'||kind==='torsades'){rr=1000;qt=540;}if(kind==='rbbb')qrs=150;if(kind==='lbbb')qrs=160;if(kind==='paced'){rr=1000;qrs=160;qt=440;}
  data.rate=60000/rr;
  if(['vf','asystole'].includes(kind))return data;
  if(['mobitz1','mobitz2','twoone'].includes(kind)){
   for(let n=0,p=200;p<6000;n++,p+=800){data.p.push({on:p,amp:.14});const blocked=kind==='twoone'?n%2===1:n%4===3;if(!blocked){const delay=kind==='mobitz1'?[160,220,280][n%4]:180;data.beats.push({on:p+delay,qrs,qt,pr:delay});}}
  }else{
   let times=[];for(let q=500;q<6000;q+=rr)times.push(q);
   if(kind==='pvc')times=[500,1300,1900,2900,3700,4500,5300];
   if(kind==='pac')times=[500,1300,1900,2700,3500,4300,5100,5900];
   if(kind==='torsades')times=[500,1500];
   times.forEach(q=>{const ectopic=kind==='pvc'&&q===1900;data.beats.push({on:q,qrs:ectopic?180:qrs,qt:ectopic?430:qt,ectopic,pr});if(!['svt','junctional','pea','flutter','paced'].includes(kind)&&!ectopic)data.p.push({on:q-pr,amp:kind==='pac'&&q===1900?-.16:.14});});
  }
  return data;
 }
 function voltage(t,data,lane) {
  const kind=data.kind;
  if(kind==='asystole')return 0;
  if(kind==='vf')return .42*Math.sin(t*.031+1.7*Math.sin(t*.0031))+.24*Math.sin(t*.049)+.13*Math.sin(t*.077+.4);
  if(kind==='torsades'&&t>=3000){const u=t-3000;return (.2+.75*Math.abs(Math.sin(u*Math.PI/1400)))*Math.sin(u*.026)*Math.cos(u*Math.PI/2800)+.12*Math.sin(u*.052);}
  let v=0;
  if(kind==='flutter'){const phase=((t%200)+200)%200;v+=interpolate(phase,[[0,0],[145,-.22],[200,0]]);}
  for(const p of data.p)v+=interpolate(t-p.on,[[0,0],[20,p.amp*.65],[40,p.amp],[60,p.amp*.65],[80,0]],true);
  for(const beat of data.beats){const d=t-beat.on,w=beat.qrs;let shape=[[0,0],[w*.18,-.12],[w*.4,1],[w*.7,-.25],[w,0]],ta=.28,st=0;
   if(beat.ectopic||kind==='paced'){shape=[[0,0],[w*.23,.3],[w*.55,1.2],[w*.8,.4],[w,0]];ta=-.35;}
   if(kind==='rbbb'){shape=lane===0?[[0,0],[25,.35],[50,-.4],[100,1.0],[150,0]]:[[0,0],[25,1],[55,0],[105,-.5],[150,0]];ta=lane===0?-.25:.25;}
   if(kind==='lbbb'){shape=lane===0?[[0,0],[25,.12],[85,-1.1],[160,0]]:[[0,0],[45,.95],[75,.7],[110,1.05],[160,0]];ta=lane===0?.3:-.3;st=lane===0?.1:-.1;}
   v+=interpolate(d,shape);v+=interpolate(d,[[w,0],[w+20,st],[w+60,st],[(w+beat.qt)/2,ta],[beat.qt,0]],true);
   if(kind==='paced')v+=interpolate(d,[[-14,0],[-12,1.5],[-10,0]]);
  }
  return v;
 }
 function renderStrip(record) {
  const data=stripData(record.kind),width=1312,height=100+data.lanes.length*270;
  let svg='<svg class="ecg-svg ecg-paper ecg-calibrated" viewBox="0 0 '+width+' '+height+'" role="img" aria-label="Synthetic teaching rhythm strip">'+E.renderPaperGrid(width,height)+'<text x="20" y="28" font-size="17">SYNTHETIC · 25 mm/s · 10 mm/mV · 6 seconds</text>';
  data.lanes.forEach((lead,lane)=>{const base=210+lane*270;svg+='<text x="20" y="'+(base-115)+'" font-size="22">'+lead+'</text>';let d='';for(let t=0;t<=6000;t+=2)d+=(t?' L':'M')+(80+t*.2).toFixed(2)+','+(base-voltage(t,data,lane)*80).toFixed(2);svg+='<path class="ecg-trace ecg-signal" d="'+d+'" fill="none" stroke="#111" stroke-width="2.5"/>';});
  svg+='<path d="M20,'+(height-20)+' v-80 h40 v80" fill="none" stroke="#111" stroke-width="2"/><text x="85" y="'+(height-25)+'" font-size="16">1 mV / 200 ms</text></svg>';
  const findings=record.lessons.map(f=>({title:f.title,explanation:f.explanation,targets:[[80+f.a*.2,70+f.lane*270,(f.b-f.a)*.2,235]]}));
  return {svg,width,height,data,findings,format:'Focused rhythm strip',caption:'Synthetic educational strip · 6 seconds · selected leads, not a full 12-lead.',scale:'25 mm/s · 10 mm/mV'};
 }
 function renderPanel(record) {
  const entry=lib[record.library];let drawing,findings;
  if(entry.traceSpec){drawing=I.render(entry.traceSpec,{duration:['vt-vs-svt','complete-heart-block'].includes(record.id)?10000:3000,viewer:true});
   findings=entry.findings.map(f=>({title:f.title,explanation:f.explanation,targets:drawing.rows.filter(r=>f.leads.includes(r.lane)).flatMap(r=>{
    let windows=[];const data=r.data;
    if(f.segment==='rhythm')windows=[[0,drawing.duration]];
    else if(f.segment==='atrial')windows=data.dissociated.atrialTimes.slice(0,5).map(p=>[p-55,p+55]);
    else windows=data.beatTimes.flatMap((q,i)=>{const beat=data.dissociated&&data.dissociated.ventricularBeats[i],j=beat?beat.qrsMs:data.qrsMs,end=beat?beat.qtMs:data.qtMs;if(f.segment==='capture'&&i!==data.dissociated.captureIdx&&i!==data.dissociated.fusionIdx)return [];let a=q,b=q+j;if(f.segment==='st'){a+=j;b=a+100;}if(f.segment==='t'){a+=j+80;b=q+end;}if(f.segment==='qrs-st')b+=100;if(f.segment==='qrs-t')b=q+end;if(f.segment==='p-qrs')a-=data.prMs||220;return [[a,b]];});
    return windows.filter(([a,b])=>a>=0&&b<=drawing.duration).slice(0,4).map(([a,b])=>[drawing.x+a*drawing.ux-3,r.top+28,(b-a)*drawing.ux+6,r.bottom-r.top-28]);
   })}));
  }else{const vb=entry.svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);drawing={svg:entry.svg,width:vb[2],height:vb[3]};findings=entry.findings.map(f=>({...f,targets:f.targets.map(t=>t.slice())}));}
  return {...drawing,findings,format:entry.traceSpec?'Focused ECG panel':entry.figureLabel,caption:entry.caption,scale:entry.traceSpec?'25 mm/s · 10 mm/mV':entry.paperScale?'Paper-scaled teaching diagram':'Teaching diagram · see caption for scale'};
 }
 window.ECG_CURRICULUM={cases,sources,build:record=>record.library?renderPanel(record):renderStrip(record),stripData,voltage};
}());
