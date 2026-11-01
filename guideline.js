// Guideline synthesis, decision engine, demo cases and exam questions. No DOM access: node tests.mjs imports this file.
import {tbwFactor} from './clinical.js?v=1.3.0';

export const CHECKED='2026-11-01';
// kind: guide=guideline/guidance, stmt=position statement, review=narrative review, trial=diagnostic or treatment trial, obs=observational, draft=public-review draft
export const sources={
 SFE:{label:'SfE 2018',kind:'guide',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC6013691/',cite:'Baldeweg SE, et al. Society for Endocrinology Clinical Guidance: inpatient management of cranial diabetes insipidus. Endocr Connect 2018;7(7):G8–G11.',use:'已知AVP-D住院成人：灌流、監測、DDAVP、矯正速度。不涵蓋初次診斷、垂體術後及孕期。'},
 NG29:{label:'NICE NG29',kind:'guide',url:'https://www.nice.org.uk/guidance/ng29/chapter/Recommendations',cite:'NICE NG29. Intravenous fluid therapy in children and young people in hospital, section 1.6.',use:'足月新生兒至青少年輸液中發生的高血鈉。'},
 CG174:{label:'NICE CG174',kind:'guide',url:'https://www.nice.org.uk/guidance/cg174/chapter/Recommendations',cite:'NICE CG174. Intravenous fluid therapy in adults in hospital.',use:'成人輸液相關高血鈉併發症的認定條件。'},
 ESPEN:{label:'ESPEN 2022',kind:'guide',url:'https://pubmed.ncbi.nlm.nih.gov/35306388/',cite:'Volkert D, et al. ESPEN practical guideline: clinical nutrition and hydration in geriatrics. Clin Nutr 2022;41(4):958–989.',use:'長者低攝水性脫水的預防與治療。'},
 NCS:{label:'NCS 2020',kind:'guide',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC7272487/',cite:'Cook AM, et al. Guidelines for the acute treatment of cerebral edema in neurocritical care patients. Neurocrit Care 2020;32:647–666.',use:'神經重症的高張鈉治療策略。'},
 KDIGO:{label:'KDIGO 2026草案',kind:'draft',url:'https://kdigo.org/wp-content/uploads/2026/03/KDIGO-2026-AKI-AKD-Guideline-Public-Review-Draft-March-2026.pdf',cite:'KDIGO 2026 AKI/AKD guideline, public review draft, March 2026.',use:'AKI中碳酸氫鈉、利尿劑與CRRT調鈉的注意事項；尚非定稿。'},
 NAME:{label:'命名工作組 2022',kind:'stmt',url:'https://doi.org/10.1530/EC-22-0378',cite:'Working Group for Renaming Diabetes Insipidus. Changing the name of diabetes insipidus: a position statement. Endocr Connect 2022;11(11):e220378.',use:'AVP-D／AVP-R新命名。'},
 AAFP:{label:'AAFP 2023',kind:'review',url:'https://www.aafp.org/pubs/afp/issues/2023/1100/sodium-disorders-hyponatremia-hypernatremia.html',cite:'Miller NE, Rushlow D, Stacey SK. Diagnosis and management of sodium disorders. Am Fam Physician 2023;108(5):476–486.',use:'學會期刊綜述，含SORT分級：成人24小時12 mEq/L（B級）。'},
 KJIM:{label:'Yun 2023',kind:'review',url:'https://www.kjim.org/journal/view.php?number=170760',cite:'Yun G, Baek SH, Kim S. Evaluation and management of hypernatremia in adults. Korean J Intern Med 2023;38(3):290–302.',use:'八步診斷與六步治療架構、公式與閾值。'},
 FICM:{label:'FICM 2022',kind:'review',url:'https://ficm.ac.uk/documents/how-would-you-treat-lithium-induced-nephrogenic-di',cite:'Faculty of Intensive Care Medicine. Case of the Month #6: Diabetes insipidus. How would you treat lithium induced nephrogenic DI? 2022.',use:'英國重症醫學院教學資料：鋰鹽腎性DI的給水、用藥與注意事項。'},
 AVPR:{label:'Refardt 2023綜述',kind:'review',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC11162367/',cite:'Refardt J, Atila C, Christ-Crain M. New insights on diagnosis and treatment of AVP deficiency. Rev Endocr Metab Disord 2024;25(3):639–649.',use:'多尿定義、copeptin判讀與檢測流程。'},
 GOSHIMA:{label:'Goshima 2022',kind:'review',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC8878611/',cite:'Goshima T, et al. Treatment of acute hypernatremia caused by sodium overload in adults: a systematic review. Medicine 2022;101(8):e28945.',use:'急性鈉負荷：18例個案的系統性回顧，未做統計檢定。'},
 FENSKE:{label:'Fenske 2018',kind:'trial',url:'https://pubmed.ncbi.nlm.nih.gov/30067922/',cite:'Fenske W, et al. A copeptin-based approach in the diagnosis of diabetes insipidus. N Engl J Med 2018;379:428–439.',use:'高張食鹽水刺激copeptin 96.5%對限水試驗76.6%。'},
 REFARDT:{label:'Refardt 2023',kind:'trial',url:'https://pubmed.ncbi.nlm.nih.gov/37966286/',cite:'Refardt J, et al. Arginine or hypertonic saline-stimulated copeptin to diagnose AVP deficiency. N Engl J Med 2023;389:1877–1887.',use:'精胺酸74.4%對高張食鹽水95.6%，未達非劣性。'},
 CHAUHAN:{label:'Chauhan 2019',kind:'obs',url:'https://pubmed.ncbi.nlm.nih.gov/30948456/',cite:'Chauhan K, et al. Rate of correction of hypernatremia and health outcomes in critically ill patients. CJASN 2019;14:656–663.',use:'ICU世代：快速矯正未增加死亡率或腦水腫。'},
 FEIGIN:{label:'Feigin 2023',kind:'obs',url:'https://pubmed.ncbi.nlm.nih.gov/37768662/',cite:'Feigin E, et al. Rate of correction and all-cause mortality in patients with severe hypernatremia. JAMA Netw Open 2023;6(9):e2335415.',use:'n=4265：慢速矯正30天死亡率較高。'},
 CHACON:{label:'Chacon-Palma 2025',kind:'obs',url:'https://pubmed.ncbi.nlm.nih.gov/40152929/',cite:'Chacon-Palma G, et al. Relationship between rate of hypernatremia correction and outcomes in hospitalized patients. Kidney360 2025;6(8):1305–1316.',use:'n=37,913：慢速院內死亡率較低，但出院去向較差。'},
 NCT:{label:'NCT04949139',kind:'trial',url:'https://clinicaltrials.gov/study/NCT04949139',cite:'Rapid intermittent vs slow continuous correction in severe hypernatremia. ClinicalTrials.gov NCT04949139.',use:'隨機試驗，178人，2025-02完成；登錄處尚無結果，也未在PubMed查到論文。'}
};
export const kindLabels={guide:'指引',stmt:'立場聲明',draft:'草案',review:'綜述',trial:'試驗',obs:'觀察研究'};

const n=v=>v===''||v===undefined||v===null||!Number.isFinite(Number(v))?null:Number(v);

export function correctedNa(na,glucose){ // Katz 0.016, Hillier 0.024 per mg/dL above 100
 if(n(na)===null||n(glucose)===null||n(glucose)<=100)return null;
 return {katz:n(na)+0.016*(n(glucose)-100),hillier:n(na)+0.024*(n(glucose)-100)};
}
export function severity(na){
 const v=n(na);if(v===null||v<=145)return null;
 return v>190?'極重度':v>155?'重度':v>150?'中度':'輕度';
}
export function efwc(urine,una,uk,na){
 if([urine,una,uk,na].some(x=>n(x)===null)||n(na)<=0)return null;
 return n(urine)*(1-(n(una)+n(uk))/n(na));
}
export function solute(urine,uosm){return n(urine)===null||n(uosm)===null?null:n(urine)/1000*n(uosm);}
export function deficit(tbw,na){return tbw*(n(na)/140-1);}
export function perLitre(infusateNaK,na,tbw){return (infusateNaK-n(na))/(tbw+1);}

// Diagnostic pathway. Returns one primary branch; concurrent causes stay the clinician's call.
export function classify(i){
 const na=n(i.na),uosm=n(i.uosm),urine=n(i.urine),w=n(i.weight),post=n(i.postUosm),out=[];
 if(na===null)return {code:'needNa',title:'請輸入血清Na',body:'確認>145 mmol/L後才進入路徑。',src:[]};
 if(na<=145)return {code:'normal',title:'目前未達高血鈉',body:'高血鈉定義為血清Na>145 mmol/L。',src:['KJIM','AAFP']};
 const poly=urine!==null&&(urine>3000||(w!==null&&urine/w>40)),sol=solute(urine,uosm);
 if(i.volume==='hyper')return {code:'gain',title:'高張鈉負荷（高容量）',body:'查核高張食鹽水、NaHCO₃、高張管灌、鈉攝入與透析液。先停止鈉來源。',next:'給自由水並用利尿劑維持負平衡；少尿或無法耐受時評估RRT。',src:['KJIM']};
 if(uosm===null)return {code:'needUrine',title:'需要尿液資料',body:'送Uosm、尿Na、尿K，並記錄24小時尿量。',next:'尿液結果決定路徑，治療不必等待。',src:['KJIM']};
 if(uosm>800)return {code:'extrarenal',title:'腎臟濃縮正常：腎外失水、飲水不足或鈉負荷',body:`Uosm ${uosm}>800，腎臟對AVP反應正常。`,next:'查飲水管道、口渴、腸胃與不顯性流失；檢視鈉輸入。',src:['KJIM']};
 if(uosm<300){
  if(post!==null){
   const pct=(post-uosm)/uosm*100;
   if(pct>=50)return {code:'avpd',title:post<800?'支持AVP缺乏（中樞性），反應未達完全':'支持AVP缺乏（中樞性）',body:`DDAVP後Uosm ${uosm}→${post}，上升${Math.round(pct)}%（≥50%）。${post<800?'未達800，可能為部分反應。':''}`,next:'找病因並會診內分泌科。給DDAVP後尿量會驟減，需同步下調給水。',src:['KJIM','SFE'],pct};
   return {code:'avpr',title:'支持AVP阻抗（腎性）',body:`DDAVP後Uosm ${uosm}→${post}，上升${Math.round(pct)}%（<50%）。`,next:'查鋰鹽等藥物、低血鉀、高血鈣與腎病；補充自由水並處理可逆因素。',src:['KJIM','AVPR'],pct};
  }
  if(poly)return {code:'hypotonicPoly',title:'低張性多尿：疑似AVP缺乏或AVP阻抗',body:`Uosm ${uosm}<300，尿量 ${urine} mL/day。`,next:'已高血鈉時不做限水試驗；直接測DDAVP反應，可同時留基礎copeptin。',src:['KJIM','AVPR']};
  return {code:'lowNoPoly',title:'Uosm偏低但未見多尿',body:urine===null?'尚缺24小時尿量。':`尿量 ${urine} mL/day。有效循環量不足時，AVP-D病人可能不多尿。`,next:'確認灌流與容量，恢復容量後重測尿量與Uosm。',src:['SFE','KJIM']};
 }
 if(sol===null)return {code:'needVolume',title:'Uosm 300–800：需要24小時尿量',body:'可能是部分DI、合併容量不足的中樞性DI，或滲透性利尿。',next:'用總溶質排出量（Uosm×尿量）分流。',src:['KJIM']};
 if(sol>=1000)return {code:'osmotic',title:'滲透性利尿',body:`溶質排出約 ${Math.round(sol)} mOsm/day（≥1000）。`,next:'查血糖、尿素、mannitol、利尿劑與解除阻塞後利尿；用EFWC估持續流失。',src:['KJIM']};
 if(sol>=750)return {code:'osmoticPossible',title:'可能滲透性利尿（灰區）',body:`溶質排出約 ${Math.round(sol)} mOsm/day（750–1000）。`,next:'依臨床線索查溶質來源，並考慮部分DI。',src:['KJIM']};
 return {code:'partial',title:'部分濃縮障礙或腎功能不全',body:`溶質排出約 ${Math.round(sol)} mOsm/day（<750），不支持滲透性利尿。`,next:'評估AKI／CKD，部分AVP缺乏或阻抗；少尿時先確認容量與灌流。',src:['KJIM']};
}

// Correction-rate pathway. Sources disagree, so caps are returned as a range, not one number.
export function rateGuide(i){
 const na=n(i.na);
 if(na===null)return {code:'needNa',title:'請輸入血清Na',lines:[],src:[]};
 if(na<=145)return {code:'normal',title:'目前未達高血鈉',lines:[],src:[]};
 const first=i.shock==='yes'?'先用0.9% NaCl或平衡晶體液恢復灌流，不論Na多高；穩定後才開始算自由水。':null;
 const t=c=>Math.max(145,na-c);
 if(i.onset==='acute'&&i.sx==='yes'&&i.load==='yes')return {code:'acuteLoad',first,title:'急性有症狀的鈉負荷：快速矯正',perHour:'1–2 mmol/L/h，持續6–8小時',target24:145,lines:['24小時內回到約145 mmol/L。','依據是綜述與個案回顧，沒有試驗；需重症與腎臟科共同處置。'],src:['KJIM','GOSHIMA']};
 if(i.onset==='acute'&&i.sx==='yes')return {code:'acuteSx',first,title:'急性有症狀：第一小時較快，再回到上限內',perHour:'第一小時5 mmol/L（或至症狀改善）',capLow:10,target24:t(10),lines:['24小時總下降上限10 mmol/L（SfE，針對AVP-D）。','鈉負荷以外的急性病例，各來源速度不一致。'],src:['SFE']};
 return {code:'standard',first,title:i.onset==='acute'?'急性但無或僅輕微症狀：控制下矯正':'慢性或時間不明：控制下矯正',perHour:'≤0.5 mmol/L/h',capLow:10,capHigh:12,target24:t(10),target24Alt:t(12),floor24:t(6),lines:['24小時下降上限：SfE 10 mmol/L；AAFP與Yun 12 mmol/L。',`低於約0.25 mmol/L/h（24小時<6）可能過慢，24小時後Na約應≤${t(6)}。`,...(i.sx==='yes'?['慢性但有神經症狀：SfE未定義此情境；同步排除其他神經急症並提高監測層級。']:[])],src:['SFE','AAFP','KJIM']};
}

export function waterEstimate(i){
 const w=n(i.weight),f=tbwFactor(i);
 if(w===null||f===null||n(i.na)===null||n(i.na)<=145)return null;
 const tbw=f*w;
 return {f,tbw,deficit:deficit(tbw,i.na),d5wPerL:perLitre(0,i.na,tbw),half:perLitre(77,i.na,tbw),fixedLow:1.35*w,per1mmol:3*w};
}

// Fictional demo cases. values follow the same shape as tutorial.js and can be loaded into the calculator.
const base={drop:'8',factor:'',insensible:'',giLoss:'',urineLoss:'',intake:'',lossReviewed:'no',route:'',intentional:'no',flags:[]};
export const demoCases=[
 {id:'elder',title:'長者低攝水性脫水',tag:'ESPEN＋慢性路徑',src:['ESPEN','KJIM','SFE','AAFP'],
  story:'84 歲女性，住養護機構，失智且吞嚥偏慢。一週來進食飲水減少，今天較嗜睡。血壓 122/70，心跳 96。Na 158，血糖 120，Cr 1.1，48 kg，Uosm 850，尿量 500 mL/day。',
  values:{...base,age:'84',sex:'female',weight:'48',na:'158',glucose:'120',cr:'1.1',egfr:'45',sbp:'122',renal:'stable',duration:'unknown',volume:'hypo',hemo:'stable',neuro:'no',urine:'500',uosm:'850',una:'15',uk:'40',k:'4.2',ca:'9.0',serumOsm:'330',flags:['poorIntake']},
  steps:[
   {q:'原因是什麼？',a:'Uosm 850>800，尿量少，腎臟濃縮正常，歸入飲水不足或腎外失水路徑。'},
   {q:'補水量怎麼估？',a:'TBW＝48×0.45＝21.6 L。總缺水＝21.6×(158/140−1)≈2.8 L，分48–72小時補。首日下降8 mmol/L到150，所需淨水量約1.15 L，另加持續流失。'},
   {q:'給水途徑與速度？',a:'血壓穩定但人不舒服：ESPEN建議皮下或靜脈輸液，同時鼓勵喝水。速度≤0.5 mmol/L/h，24小時下降≤10–12 mmol/L。'},
   {q:'之後要做什麼？',a:'初期每2–4小時驗Na。出院前處理吞嚥、飲水提醒與照護者衛教。ESPEN指出皮膚彈性、口乾與尿色不適合用來判斷長者水合狀態。'}
  ],pitfall:'把總缺水量2.8 L全部排進24小時，會超過同一份計畫的下降上限。'},
 {id:'avpd',title:'已知AVP-D，禁食後漏用DDAVP',tag:'SfE住院路徑',src:['SFE','NAME'],
  story:'46 歲男性，已知AVP缺乏合併垂體低下，平日用DDAVP與hydrocortisone。因膽囊炎住院禁食兩天，DDAVP漏開。血壓 94/60、心跳 118，72 kg，Na 156，尿量 7 L/day，Uosm 120。',
  values:{...base,age:'46',sex:'male',weight:'72',na:'156',glucose:'130',cr:'1.3',egfr:'65',sbp:'94',renal:'stable',duration:'unknown',volume:'hypo',hemo:'unknown',neuro:'no',urine:'7000',uosm:'120',una:'15',uk:'10',k:'3.9',ca:'9.1',serumOsm:'325',flags:['brain']},
  steps:[
   {q:'照護層級？',a:'SfE：AVP-D合併高血鈉視為急症，放在level 2–3或同等高依賴照護，並盡快聯絡內分泌團隊。'},
   {q:'先給什麼？',a:'容量不足時先用0.9% NaCl恢復血壓與心跳，優先處理補液，再評估DDAVP。此病人同時需要依急性病調整糖皮質素。'},
   {q:'DDAVP怎麼給？',a:'已知AVP-D且大量稀釋尿：IV或IM 1–2 µg，密切觀察。等高尿量、約100 mOsm/kg的稀釋尿再出現，才考慮下一劑，以免併用大量輸液造成矯正過快。'},
   {q:'怎麼監測？',a:'復甦期每4小時驗Na，之後至少每12小時，直到臨床與生化穩定。可安全吞嚥時盡早改口服或鼻胃管給水，較能緩衝Na快速變化。'}
  ],pitfall:'只看血鈉就給D5W，忽略灌流。另外，AVP-D合併腎上腺低下時，補糖皮質素會增加自由水排泄，尿量可能再上升。'},
 {id:'lithium',title:'長期鋰鹽，腸胃炎後高血鈉',tag:'AVP-R路徑',src:['KJIM','AVPR','FICM'],
  story:'58 歲女性，雙相情緒障礙，服鋰鹽15年，平日多尿。腸胃炎後兩天無法喝水，血壓穩定。62 kg，Na 151，尿量 5 L/day，Uosm 210，尿Na 20，尿K 15，K 3.8，Ca 9.4。給DDAVP 2 µg後Uosm 250。',
  values:{...base,age:'58',sex:'female',weight:'62',na:'151',glucose:'105',cr:'1.0',egfr:'62',sbp:'118',renal:'stable',duration:'chronic',volume:'eu',hemo:'stable',neuro:'no',urine:'5000',uosm:'210',una:'20',uk:'15',k:'3.8',ca:'9.4',serumOsm:'312',insensible:'700',giLoss:'0',urineLoss:'3841',intake:'0',lossReviewed:'yes',route:'d5w',flags:['lithium','gi']},
  steps:[
   {q:'DDAVP反應怎麼解讀？',a:'Uosm 210→250，只上升19%（<50%），支持AVP阻抗。基礎copeptin ≥21.4 pmol/L也支持，但此切點來自未併發高血鈉情境的研究，不能取代臨床判斷。'},
   {q:'持續流失有多少？',a:'EFWC＝5000×[1−(20+15)/151]≈3841 mL/day，比首日矯正所需的約1.28 L還多。忽略它，Na就降不下來。'},
   {q:'給水估算？',a:'首日需求約 1283＋700＋3841≈5824 mL，平均約243 mL/h。若全用D5W，葡萄糖約290 g／日，需監測血糖；能喝水時優先口服。'},
   {q:'長期處理？',a:'與精神科討論鋰鹽，停藥後尿崩可能數週至數月才恢復。可用amiloride 2.5–10 mg/day，必要時併thiazide；thiazide可能使鋰濃度上升，需監測。'}
  ],pitfall:'再多給DDAVP並不能解決AVP-R，還會讓判斷與給水計畫更混亂。'},
 {id:'salt',title:'急性食鹽中毒合併抽搐',tag:'急性鈉負荷',src:['KJIM','GOSHIMA','KDIGO'],
  story:'34 歲男性，3 小時前喝下濃鹽水催吐，到院時抽搐。上週Na 139。70 kg，Na 178，血糖 110，尿量尚未量得，血壓 150/90。',
  values:{...base,age:'34',sex:'male',weight:'70',na:'178',glucose:'110',cr:'1.0',egfr:'90',sbp:'150',renal:'stable',duration:'acute',volume:'hyper',hemo:'stable',neuro:'yes',uosm:'',flags:['sodium']},
  steps:[
   {q:'這和慢性高血鈉有什麼不同？',a:'有先前Na佐證，48小時內發生，腦部還來不及適應。Yun 2023建議此情境快速矯正，不套慢性速度。'},
   {q:'目標速度？',a:'1–2 mmol/L/h，持續6–8小時，24小時內回到約145。Goshima回顧的存活者多在8小時內≤160、24小時內≤150。'},
   {q:'估算D5W量？',a:'TBW＝42 L。每公升D5W約降(0−178)/43≈4.1 mmol/L；降到145約需8 L，未計持續流失。需監測血糖，並頻繁驗Na調整。'},
   {q:'透析角色？',a:'Goshima的18例僅3例接受血液透析，未提供明確啟動條件。腎衰竭或容量過多無法給水時，與腎臟科討論個別化的RRT，並設定透析液Na。'}
  ],pitfall:'套用0.5 mmol/L/h上限會延誤治療。這條路徑只適用於有佐證的急性鈉負荷。'},
 {id:'aki',title:'AKI恢復期，水腫卻高血鈉',tag:'高容量路徑',src:['KJIM','KDIGO'],
  story:'67 歲男性，敗血症 AKI 恢復期，全身水腫，持續用furosemide，並曾用NaHCO₃。80 kg，Na 152，尿量 3 L/day，Uosm 420，尿Na 60，尿K 20。血壓穩定，意識清楚，鼻胃管灌食中。',
  values:{...base,age:'67',sex:'male',weight:'80',na:'152',glucose:'150',cr:'2.0',egfr:'32',sbp:'128',renal:'aki',duration:'chronic',volume:'hyper',hemo:'stable',neuro:'no',urine:'3000',uosm:'420',una:'60',uk:'20',k:'3.7',ca:'8.8',serumOsm:'322',flags:['diuretics','recovery','sodium']},
  steps:[
   {q:'水腫也會高血鈉嗎？',a:'會。全身鈉過多時可同時缺自由水。先檢視NaHCO₃、輸液與灌食的鈉負荷。'},
   {q:'尿液在流失自由水嗎？',a:'溶質排出420×3＝1260 mOsm/day，屬溶質性利尿。EFWC＝3000×[1−80/152]≈1421 mL/day，是持續的自由水流失。'},
   {q:'怎麼處理？',a:'經鼻胃管給水或D5W補自由水，同時用利尿劑維持負平衡。KDIGO 2026草案提到loop併thiazide可能減輕loop利尿劑相關高血鈉。'},
   {q:'何時想到CRRT？',a:'少尿、肺水腫或無法容納給水時評估RRT。KDIGO 2026草案指出，dysnatremia可能需要客製CRRT溶液以漸進矯正。'}
  ],pitfall:'看到水腫就停止給水，或只追加利尿劑而不補自由水，都會讓Na繼續上升。'}
];

// a=correct option, w=wrong options. Options are shuffled at render time.
export const questions=[
 {id:1,domain:'診斷',stem:'一位成人血清Na 153 mmol/L。依Yun 2023的絕對濃度分級，屬於哪一級？',a:'中度（151–155）',w:['輕度（146–150）','重度（>155）','極重度（>190）'],why:'Yun 2023：146–150輕度、151–155中度、>155重度、>190極重度。SfE 2018採不同切點（146–149、150–159、>160），閱讀時要確認出處。',src:['KJIM','SFE']},
 {id:2,domain:'診斷',stem:'ICU病人白蛋白明顯偏低，檢驗室以間接ISE報告Na 148，與臨床不符。下一步最合適的是？',a:'以血氣機等直接ISE複驗，或測血清滲透壓',w:['立即開始D5W並每2小時驗Na','安排DDAVP試驗','直接視為AVP阻抗'],why:'八步診斷第一步是排除偽高血鈉。間接ISE在蛋白或脂質異常時較易失真，應用直接ISE或滲透壓計確認。',src:['KJIM']},
 {id:3,domain:'診斷',stem:'Na 150，血糖 600 mg/dL。依Hillier係數，校正後Na約為多少？',a:'162 mmol/L',w:['150 mmol/L','158 mmol/L','174 mmol/L'],why:'校正Na＝Na＋0.024×(血糖−100)＝150＋12＝162。Katz係數0.016則為158。',src:['KJIM']},
 {id:4,domain:'診斷',stem:'高血鈉長者尿量 450 mL/day，Uosm 900 mOsm/kg。最能解釋的是？',a:'腎臟濃縮正常，優先找飲水不足或腎外失水',w:['完全性AVP缺乏','AVP阻抗','滲透性利尿'],why:'Uosm>800代表腎臟對高張狀態反應正常；應考慮原發性低渴感、腎外失水或鈉負荷。',src:['KJIM']},
 {id:5,domain:'診斷',stem:'Na 162，尿量 6 L/day，Uosm 150。下一步哪一項不恰當？',a:'先做限水試驗確認尿液濃縮能力',w:['給DDAVP並觀察Uosm變化','留基礎copeptin','持續記錄尿量與自由水流失'],why:'已經高血鈉就已有足夠的滲透刺激，再限水只會增加風險。應直接評估DDAVP反應，可配合基礎copeptin。',src:['KJIM','AVPR']},
 {id:6,domain:'診斷',stem:'Uosm 450，24小時尿量 4 L，尿糖陽性。這個尿液型態最符合？',a:'滲透性利尿，溶質排出約1800 mOsm/day',w:['部分AVP缺乏，溶質排出約112 mOsm/day','飲水不足，腎臟濃縮正常','完全性AVP阻抗'],why:'總溶質排出＝Uosm×尿量（L）＝1800，超過750–1000 mOsm/day的閾值，支持滲透性利尿。',src:['KJIM']},
 {id:7,domain:'診斷',stem:'低張性多尿病人給DDAVP後，Uosm由200升至240 mOsm/kg，尿量未明顯下降。最可能的是？',a:'AVP阻抗（腎性）',w:['AVP缺乏（中樞性）','原發性多飲','假性高血鈉'],why:'上升僅20%。中樞性通常上升至少50%並伴隨尿量下降；腎性則無明顯變化。',src:['KJIM']},
 {id:8,domain:'診斷',stem:'尿量 3000 mL/day，尿Na 40，尿K 30，血Na 160。尿液自由水清除（EFWC）約為？',a:'約1690 mL/day',w:['約1310 mL/day','約2250 mL/day','約3000 mL/day'],why:'EFWC＝3000×[1−(40+30)/160]＝1687.5 mL/day。計算時只用尿Na＋尿K，不用Uosm。',src:['KJIM']},
 {id:9,domain:'治療',stem:'60 kg女性、非長者，Na 166 mmol/L。總自由水缺損約為？',a:'5.6 L',w:['3.3 L','6.7 L','11.1 L'],why:'TBW＝0.5×60＝30 L；30×(166/140−1)≈5.6 L。男性用0.6，長者各扣0.05。',src:['KJIM']},
 {id:10,domain:'治療',stem:'Na 165，血壓 75/40，四肢冰冷。第一瓶輸液應選？',a:'0.9% NaCl或平衡晶體液',w:['D5W','0.45% NaCl','3% NaCl'],why:'休克時不論Na多高，先用等張晶體液恢復灌流。SfE也要求容量不足時先給0.9% NaCl，再考慮自由水。',src:['KJIM','SFE']},
 {id:11,domain:'治療',stem:'慢性高血鈉、無症狀。下列矯正目標最符合現有來源？',a:'≤0.5 mmol/L/h，24小時下降上限10–12 mmol/L',w:['1–2 mmol/L/h，24小時內回到145','第一小時下降5 mmol/L','24小時下降上限3–4 mmol/L'],why:'SfE：≤0.5 mmol/L/h且≤10/24h。AAFP與Yun：12/24h。低於0.25 mmol/L/h可能過慢。',src:['SFE','AAFP','KJIM']},
 {id:12,domain:'治療',stem:'成人高血鈉24小時內降了14 mmol/L，目前意識清楚無新症狀。最恰當的處置是？',a:'不要刻意把Na再拉高；放慢給水並密切追蹤',w:['立刻給3% NaCl拉回Na','給DDAVP並改用0.9% NaCl將Na回升','立即開始血液透析'],why:'AAFP（SORT B）與Yun都不建議超過目標時再次拉高Na。此處與低血鈉過度矯正的處理不同。',src:['AAFP','KJIM']},
 {id:13,domain:'治療',stem:'確實3小時前大量攝鹽，Na 178併抽搐。矯正策略最符合文獻的是？',a:'1–2 mmol/L/h持續6–8小時，24小時內回到約145',w:['≤0.5 mmol/L/h，避免腦水腫','先限水再觀察','每日下降不超過6 mmol/L'],why:'急性有症狀的鈉負荷，腦部尚未適應。Yun 2023建議此速度；Goshima的個案回顧方向一致，但屬低等級證據。',src:['KJIM','GOSHIMA']},
 {id:14,domain:'治療',stem:'水腫病人因NaHCO₃累積出現高血鈉，腎功能尚可。處置原則是？',a:'停鈉來源，給自由水併用利尿劑維持負平衡',w:['給0.9% NaCl補足容量','完全限水以減輕水腫','只給利尿劑，不補自由水'],why:'高容量性高血鈉是鈉過多合併相對缺水。D5W補自由水，同時用利尿劑排鈉。',src:['KJIM']},
 {id:15,domain:'治療',stem:'70 kg男性，TBW 42 L，Na 160。依Adrogué–Madias，1 L D5W預估使Na變化約多少？',a:'下降3.7 mmol/L',w:['下降1.9 mmol/L','下降5.3 mmol/L','下降7.4 mmol/L'],why:'ΔNa＝(0−160)/(42+1)≈−3.72。1 L 0.45% NaCl僅約−1.93。此公式未計持續流失，少尿或嚴重缺水時準確度較差。',src:['KJIM']},
 {id:16,domain:'特殊族群',stem:'已知AVP-D病人急性病住院，高血鈉正在輸液復甦。依SfE 2018，Na監測頻率至少應為？',a:'復甦期每4小時，之後至少每12小時至穩定',w:['每24小時','每72小時','僅在出現症狀時'],why:'SfE：復甦期q4h，之後不少於q12h直到穩定。若Na正常、在維持輸液，則至少每24小時，以防隱性低血鈉。',src:['SFE']},
 {id:17,domain:'特殊族群',stem:'低張性多尿、血鈉正常的成人，接受高張食鹽水刺激copeptin檢查。Na達標時copeptin 8 pmol/L，最支持？',a:'原發性多飲',w:['AVP缺乏','AVP阻抗','檢查無效，一律改限水試驗'],why:'Fenske 2018以>4.9 pmol/L判定原發性多飲，準確度96.5%，優於限水試驗的76.6%。此檢查不適用於已經高血鈉的病人。',src:['FENSKE','REFARDT']},
 {id:18,domain:'特殊族群',stem:'長期服鋰鹽出現腎性AVP阻抗，需要藥物減少尿量。下列敘述何者正確？',a:'Amiloride常被使用；併用thiazide時需監測鋰濃度',w:['高劑量DDAVP是公認第一線','應嚴格限水以減少尿量','NSAID完全沒有降尿量效果'],why:'先評估可否停藥。藥物以amiloride、thiazide為主，也可能用NSAID；thiazide可能升高鋰濃度。限水對此類病人很危險。高劑量DDAVP與indomethacin有人使用，但都不算第一線。',src:['KJIM','FICM']},
 {id:19,domain:'特殊族群',stem:'長者血清滲透壓 310 mOsm/kg，外觀不適。依ESPEN 2022，應如何處置？',a:'提供皮下或靜脈輸液，同時鼓勵喝水',w:['只鼓勵喝偏好的飲料','先看皮膚彈性與尿色再決定','等滲透壓>340再介入'],why:'ESPEN：>300 mOsm/kg（或計算值>295 mmol/L）且外觀良好者鼓勵喝水；外觀不適者則同時提供SC／IV輸液（Grade A）。',src:['ESPEN']},
 {id:20,domain:'證據',stem:'關於成人高血鈉矯正速度的證據，下列敘述何者最正確？',a:'觀察性研究結果互相矛盾，缺乏隨機試驗結論',w:['KDIGO已有專章規定固定速度','隨機試驗已證實0.5 mmol/L/h最安全','多項大型研究一致顯示快速矯正增加死亡'],why:'Feigin 2023顯示慢速死亡率較高，Chacon-Palma 2025顯示慢速院內死亡率較低，Chauhan 2019則無差異。NCT04949139已完成，但截至查證日尚無公開結果。',src:['FEIGIN','CHACON','CHAUHAN','NCT']}
];

export function shuffle(list,random=Math.random){
 const out=[...list];
 for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}
 return out;
}
export function scoreQuiz(answers){
 const by={};let correct=0;
 for(const q of questions){
  by[q.domain]??={correct:0,total:0};by[q.domain].total++;
  if(answers[q.id]===q.a){correct++;by[q.domain].correct++;}
 }
 return {correct,total:questions.length,by,answered:questions.filter(q=>answers[q.id]!==undefined).length};
}
