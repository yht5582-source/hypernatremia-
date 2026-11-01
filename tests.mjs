// Engine tests: node tests.mjs
import assert from 'node:assert/strict';
import {plan,analyze,trend,adrogue,errors} from './clinical.js';
import {teachingCases,getTeachingCase,getTeachingTracking} from './tutorial.js';
import {sources,classify,rateGuide,waterEstimate,correctedNa,severity,efwc,solute,deficit,perLitre,demoCases,questions,shuffle,scoreQuiz} from './guideline.js';
import {mindmaps,layoutMap,wrap,collapsibleIds} from './mindmap.js';
let n=0;const ok=(name,fn)=>{fn();n++;};
const dh=getTeachingCase('dehydration');
ok('dehydration matches tutorial numbers',()=>{const p=plan(dh);assert.equal(p.tbw,27);assert.equal(p.target,152);assert.equal(Math.round(p.base),1421);assert.equal(Math.round(p.efwc),900);assert.equal(Math.round(p.rate),126);assert.ok(p.eligible);});
ok('unsafe teaching cases never produce a rate',()=>{for(const id of ['di','shock','sodium'])assert.equal(plan(getTeachingCase(id)).rate,null,id);});
ok('all teaching cases are valid',()=>{for(const id of Object.keys(teachingCases))assert.deepEqual(errors(getTeachingCase(id)),[],id);});
ok('oliguric Uosm 300–800 is not called osmotic diuresis',()=>{const t=analyze(getTeachingCase('shock')).causes.map(c=>c.title);assert.ok(t.includes('部分濃縮障礙或腎功能不全'));assert.ok(!t.some(x=>x.startsWith('滲透性利尿或')));});
ok('high solute excretion is osmotic diuresis',()=>{const t=analyze({...dh,urine:'4000',uosm:'500'}).causes.map(c=>c.title);assert.ok(t.includes('滲透性利尿'));});
ok('unknown losses block the rate',()=>{assert.equal(plan({...dh,insensible:''}).rate,null);});
ok('negative net water gives no rate',()=>{const p=plan({...dh,intake:'9000'});assert.ok(p.net<0);assert.equal(p.eligible,false);});
ok('target floors at 145',()=>{assert.equal(plan({...dh,na:'148'}).target,145);});
ok('Adrogué–Madias D5W litres ≈ free-water estimate',()=>{const d=adrogue(dh)[0];assert.equal(Math.round(d.perL*100)/100,-5.71);assert.ok(Math.abs(d.litres*1000-plan(dh).base)<100);});
ok('Adrogué–Madias: 0.45% needs more volume than D5W; KCl reduces effect',()=>{const [d,,h]=adrogue(dh);assert.ok(h.litres>d.litres);assert.ok(adrogue({...dh,infK:'20'})[0].litres>d.litres);});
ok('simulated tracking stays within limits',()=>{const t=getTeachingTracking();assert.deepEqual(trend({...dh,baselineTime:t.baselineTime},t.logs).warnings,[]);});
ok('fast drop warns',()=>{const t=getTeachingTracking();const logs=[{...t.logs[0],na:'156'}];assert.ok(trend({...dh,baselineTime:t.baselineTime},logs).warnings.some(w=>w.includes('0.5')));});
ok('>10 within 24 h warns',()=>{const t=getTeachingTracking();const logs=t.logs.map((l,i)=>({...l,na:[158,155,152,148][i]}));assert.ok(trend({...dh,baselineTime:t.baselineTime},logs).warnings.some(w=>w.includes('>10')));});
ok('log before baseline is invalid',()=>{const t=getTeachingTracking();assert.ok(trend({...dh,baselineTime:t.logs[1].time},t.logs).invalid);});
// Guideline engine
ok('severity bands follow Yun 2023',()=>{assert.equal(severity(145),null);assert.equal(severity(150),'輕度');assert.equal(severity(151),'中度');assert.equal(severity(155),'中度');assert.equal(severity(156),'重度');assert.equal(severity(191),'極重度');});
ok('glucose correction: Katz and Hillier',()=>{const c=correctedNa(150,600);assert.equal(c.katz,158);assert.equal(c.hillier,162);assert.equal(correctedNa(150,90),null);});
const code=i=>classify(i).code;
ok('classify: gates and branches',()=>{assert.equal(code({}),'needNa');assert.equal(code({na:'145'}),'normal');assert.equal(code({na:'155'}),'needUrine');assert.equal(code({na:'155',uosm:'900'}),'extrarenal');assert.equal(code({na:'155',volume:'hyper',uosm:'150',urine:'6000'}),'gain');});
ok('classify: Uosm 800 boundary stays in the middle band',()=>{assert.equal(code({na:'155',uosm:'800',urine:'4000'}),'osmotic');assert.equal(code({na:'155',uosm:'801',urine:'4000'}),'extrarenal');});
ok('classify: solute split',()=>{assert.equal(code({na:'155',uosm:'500',urine:'2000'}),'osmotic');assert.equal(code({na:'155',uosm:'400',urine:'2000'}),'osmoticPossible');assert.equal(code({na:'155',uosm:'350',urine:'1000'}),'partial');assert.equal(code({na:'155',uosm:'500'}),'needVolume');});
ok('classify: hypotonic polyuria and DDAVP 50% split',()=>{assert.equal(code({na:'155',uosm:'150',urine:'6000'}),'hypotonicPoly');assert.equal(code({na:'155',uosm:'150',urine:'1000',weight:'70'}),'lowNoPoly');assert.equal(code({na:'155',uosm:'200',urine:'4000',postUosm:'300'}),'avpd');assert.equal(code({na:'155',uosm:'200',urine:'4000',postUosm:'299'}),'avpr');assert.ok(classify({na:'155',uosm:'200',postUosm:'500'}).title.includes('未達完全'));});
ok('classify: 40 mL/kg/day counts as polyuria',()=>{assert.equal(code({na:'155',uosm:'150',urine:'2900',weight:'60'}),'hypotonicPoly');});
ok('rate: acute load, acute symptomatic, standard',()=>{assert.equal(rateGuide({na:'178',onset:'acute',sx:'yes',load:'yes'}).code,'acuteLoad');assert.equal(rateGuide({na:'170',onset:'acute',sx:'yes',load:'no'}).code,'acuteSx');for(const o of ['chronic','unknown'])assert.equal(rateGuide({na:'170',onset:o,sx:'yes',load:'yes'}).code,'standard');});
ok('rate: fast path needs proven acute onset and symptoms',()=>{assert.equal(rateGuide({na:'170',onset:'acute',sx:'no',load:'yes'}).code,'standard');});
ok('rate: targets never below 145 and range is 10–12',()=>{const r=rateGuide({na:'160',onset:'chronic',sx:'no',load:'no'});assert.equal(r.target24,150);assert.equal(r.target24Alt,148);assert.equal(r.floor24,154);assert.equal(rateGuide({na:'150',onset:'chronic'}).target24,145);});
ok('rate: shock always leads',()=>{assert.ok(rateGuide({na:'165',shock:'yes',onset:'chronic'}).first.includes('0.9%'));assert.equal(rateGuide({na:'165',shock:'no',onset:'chronic'}).first,null);});
ok('water estimate needs inputs and matches formula',()=>{assert.equal(waterEstimate({na:'160',weight:'70'}),null);const w=waterEstimate({na:'166',weight:'60',sex:'female',age:'50'});assert.equal(Math.round(w.deficit*10)/10,5.6);assert.equal(w.fixedLow,81);});
// Demo cases: stated numbers must match the engine
const dc=id=>demoCases.find(c=>c.id===id),txt=c=>c.steps.map(s=>s.a).join(' ');
ok('demo cases are valid calculator input',()=>{assert.equal(demoCases.length,5);for(const c of demoCases){assert.deepEqual(errors(c.values),[],c.id);assert.equal(c.steps.length,4,c.id);for(const k of c.src)assert.ok(sources[k],k);}});
ok('demo elder numbers',()=>{const p=plan(dc('elder').values);assert.equal(p.tbw,21.6);assert.equal(Math.round(p.deficit*10)/10,2.8);assert.equal(p.target,150);assert.equal(Math.round(p.base/10)/100,1.15);assert.equal(classify(dc('elder').values).code,'extrarenal');});
ok('demo lithium numbers',()=>{const v=dc('lithium').values,p=plan(v);assert.equal(Math.round(efwc(v.urine,v.una,v.uk,v.na)),3841);assert.equal(Math.round(p.base),1283);assert.equal(Math.round(p.net),5824);assert.equal(Math.round(p.rate),243);assert.ok(p.eligible);assert.equal(classify({...v,postUosm:'250'}).code,'avpr');assert.equal(Math.round((250-210)/210*100),19);assert.ok(txt(dc('lithium')).includes('19%'));});
ok('demo salt numbers and no routine rate',()=>{const v=dc('salt').values,p=plan(v);assert.equal(p.tbw,42);assert.equal(Math.round(perLitre(0,178,42)*10)/10,-4.1);assert.equal(Math.round(33/4.14),8);assert.equal(p.rate,null);assert.equal(rateGuide({...v,onset:v.duration,sx:'yes',load:'yes'}).code,'acuteLoad');});
ok('demo aki numbers and no routine rate',()=>{const v=dc('aki').values;assert.equal(solute(v.urine,v.uosm),1260);assert.equal(Math.round(efwc(v.urine,v.una,v.uk,v.na)),1421);assert.equal(plan(v).rate,null);assert.equal(classify(v).code,'gain');});
ok('demo avpd is blocked until perfusion confirmed',()=>{const v=dc('avpd').values;assert.equal(plan(v).rate,null);assert.equal(classify(v).code,'hypotonicPoly');});
// Exam
ok('exam has 20 complete questions',()=>{assert.equal(questions.length,20);assert.equal(new Set(questions.map(q=>q.id)).size,20);for(const q of questions){assert.equal(q.w.length,3,q.id);assert.equal(new Set([q.a,...q.w]).size,4,q.id);assert.ok(q.why.length>20,q.id);assert.ok(q.src.length>0,q.id);for(const k of q.src)assert.ok(sources[k],k);}});
ok('exam: correct option is not a length giveaway',()=>{const longest=questions.filter(q=>q.a.length>Math.max(...q.w.map(x=>x.length))).length;assert.ok(longest<=12,String(longest));});
ok('exam arithmetic matches the engine',()=>{const q=id=>questions.find(x=>x.id===id).a;assert.equal(correctedNa(150,600).hillier,162);assert.ok(q(3).includes('162'));assert.equal(solute(4000,450),1800);assert.ok(q(6).includes('1800'));assert.equal(efwc(3000,40,30,160),1687.5);assert.ok(q(8).includes('1690'));assert.equal(Math.round(deficit(30,166)*10)/10,5.6);assert.ok(q(9).includes('5.6'));assert.equal(Math.round(perLitre(0,160,42)*10)/10,-3.7);assert.ok(q(15).includes('3.7'));assert.equal(severity(153),'中度');assert.equal(classify({na:'158',uosm:'200',urine:'4000',postUosm:'240'}).code,'avpr');});
ok('scoreQuiz and shuffle',()=>{const a={};for(const q of questions)a[q.id]=q.a;assert.equal(scoreQuiz(a).correct,20);a[1]='x';const s=scoreQuiz(a);assert.equal(s.correct,19);assert.equal(s.by['診斷'].correct,7);assert.equal(scoreQuiz({}).answered,0);const q=questions[0],o=shuffle([q.a,...q.w]);assert.deepEqual([...o].sort(),[q.a,...q.w].sort());});
ok('all sources have citation, link and use',()=>{for(const [k,s] of Object.entries(sources)){assert.ok(/^https:/.test(s.url),k);assert.ok(s.cite&&s.use&&s.label,k);}});
// Mind maps
const walk=(m,fn)=>{fn(m);(m.c??[]).forEach(k=>walk(k,fn));};
ok('mind maps cover diagnosis and treatment with valid sources',()=>{assert.deepEqual(Object.keys(mindmaps),['diag','treat']);for(const m of Object.values(mindmaps)){assert.ok(m.c.length>=5);walk(m,x=>{for(const k of x.src??[])assert.ok(sources[k],k);if(!x.c?.length)assert.ok(x.src?.length>0,x.t);});}});
ok('mind map boxes never overlap, expanded or collapsed',()=>{for(const m of Object.values(mindmaps)){for(const col of [new Set(),new Set(collapsibleIds(m).filter(id=>id.split('.').length===2)),new Set(['r.0.0','r.2'])]){const {nodes,width,height}=layoutMap(m,col);for(const a of nodes){assert.ok(a.x>=0&&a.y>=0&&a.x+a.w<=width&&a.y+a.h<=height,a.t);for(const b of nodes)if(a!==b)assert.ok(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y,`${a.t} / ${b.t}`);}}}});
ok('collapsing hides descendants',()=>{const m=mindmaps.diag,all=layoutMap(m).nodes.length,one=layoutMap(m,new Set(['r.3'])).nodes;assert.ok(one.length<all);assert.ok(one.find(n=>n.id==='r.3').collapsed);assert.ok(!one.some(n=>n.id.startsWith('r.3.')));});
ok('wrap keeps ASCII tokens whole',()=>{const lines=wrap('DDAVP IV／IM 1–2 µg 稀釋尿再現才追加',8);assert.ok(lines.includes('DDAVP IV／')||lines.some(l=>l.includes('DDAVP')));assert.equal(lines.join('').replace(/\s/g,''),'DDAVPIV／IM1–2µg稀釋尿再現才追加');assert.deepEqual(wrap('高血鈉診斷\nNa >145 mmol/L',10)[0],'高血鈉診斷');});
ok('mind-map thresholds match the engine',()=>{assert.equal(classify({na:'155',uosm:'200',urine:'4000',postUosm:'300'}).code,'avpd');assert.equal(classify({na:'155',uosm:'801'}).code,'extrarenal');assert.equal(rateGuide({na:'160',onset:'chronic'}).perHour,'≤0.5 mmol/L/h');assert.equal(rateGuide({na:'178',onset:'acute',sx:'yes',load:'yes'}).perHour,'1–2 mmol/L/h，持續6–8小時');});
console.log(`${n} tests passed`);
