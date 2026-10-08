import {analyze,plan,trend} from './clinical.js';

// Teaching data are fictional. They are never automatically entered into patient mode.
const shared={drop:'8',lossReviewed:'no',route:'',factor:''};
export const teachingCases={
 dehydration:{
  title:'病例 1｜長者攝水不足',tag:'適合完整計算',tone:'normal',
  story:'75 歲女性，吞嚥不佳且連續 3 天飲水減少；口乾、尿量減少，但血壓和循環灌流穩定。',goal:'完成原因分析、第一天自由水補充估算與血鈉追蹤。',
  values:{age:'75',weight:'60',sex:'female',na:'160',glucose:'110',cr:'1.0',egfr:'60',sbp:'120',renal:'stable',duration:'chronic',volume:'hypo',hemo:'stable',neuro:'no',intentional:'no',urine:'1200',uosm:'900',una:'10',uk:'30',k:'4',ca:'9.2',serumOsm:'335',drop:'8',factor:'',insensible:'700',giLoss:'0',urineLoss:'900',intake:'0',lossReviewed:'yes',route:'d5w',flags:['poorIntake']},
  rationale:'尿液仍能濃縮（Uosm 900），加上飲水不足、尿 Na 10，優先考慮攝水不足造成的低血容量性高血鈉。低血容量應先確認血流動力學穩定。'
 },
 di:{
  title:'病例 2｜術後低張性多尿',tag:'先確認病因',tone:'caution',
  story:'38 歲女性，腦下垂體手術後多尿，每日 6 L；血 Na 162，Uosm 150，尚待確認 AVP 缺乏。',goal:'辨識低張性多尿，理解尿量及 DDAVP 反應可能讓補水需求快速改變。',
  values:{age:'38',weight:'68',sex:'female',na:'162',glucose:'110',cr:'0.9',egfr:'85',sbp:'122',renal:'stable',duration:'unknown',volume:'eu',hemo:'stable',neuro:'no',intentional:'no',urine:'6000',uosm:'150',una:'10',uk:'10',k:'4',ca:'9',serumOsm:'345',drop:'8',factor:'',insensible:'800',giLoss:'0',urineLoss:'',intake:'0',lossReviewed:'no',route:'d5w',flags:['brain']},
  rationale:'多尿加上 Uosm <300 mOsm/kg 支持低張性多尿，需鑑別 AVP 缺乏與腎臟 AVP 阻抗。治療後尿液自由水流失可能急降，因此不預先產生固定速度。'
 },
 shock:{
  title:'病例 3｜休克合併高血鈉',tag:'先復甦再補水',tone:'danger',
  story:'82 歲男性，腹瀉、飲水不足，血 Na 168，SBP 75 mmHg，合併 AKI、少尿。',goal:'確認安全阻擋機制：休克、AKI 與少尿時不得直接產生例行 D5W 速度。',
  values:{age:'82',weight:'55',sex:'male',na:'168',glucose:'135',cr:'2.2',egfr:'25',sbp:'75',renal:'aki',duration:'unknown',volume:'hypo',hemo:'shock',neuro:'no',intentional:'no',urine:'250',uosm:'700',una:'15',uk:'25',k:'4.1',ca:'9',serumOsm:'360',drop:'8',factor:'',insensible:'',giLoss:'',urineLoss:'',intake:'',lossReviewed:'no',route:'d5w',flags:['gi','poorIntake']},
  rationale:'優先處理休克及器官灌流：等張晶體液復甦、評估敗血症／胃腸道流失，並嚴密監測 Na、腎功能與尿量。'
 },
 sodium:{
  title:'病例 4｜急性鈉負荷',tag:'重症個別化',tone:'danger',
  story:'55 歲男性，大量高張鈉輸入後數小時內 Na 上升至 170，出現新發意識改變，容量可能過多。',goal:'辨識急性有症狀高血鈉與過量鈉輸入，不能直接套慢性高血鈉速度。',
  values:{age:'55',weight:'75',sex:'male',na:'170',glucose:'108',cr:'1.0',egfr:'75',sbp:'140',renal:'stable',duration:'acute',volume:'hyper',hemo:'stable',neuro:'yes',intentional:'no',urine:'2000',uosm:'800',una:'85',uk:'35',k:'4',ca:'9.1',serumOsm:'350',drop:'8',factor:'',insensible:'',giLoss:'',urineLoss:'',intake:'',lossReviewed:'no',route:'d5w',flags:['sodium']},
  rationale:'應立即停止多餘鈉輸入、處理神經急症及容量過多；矯正策略須由重症／腎臟專科個別化決定。'
 }
};
const headings=['基本評估','原因分析','補水計畫','治療追蹤'];
const columns=[
 [['na','血清 Na','mmol/L'],['weight','體重','kg'],['age','年齡','歲'],['sex','生理性別',''],['glucose','血糖','mg/dL'],['cr','Creatinine','mg/dL'],['egfr','eGFR','mL/min/1.73m²'],['sbp','收縮壓','mmHg'],['renal','腎功能／AKI',''],['duration','高血鈉時間',''],['volume','容量狀態',''],['hemo','灌流',''],['neuro','神經症狀',''],['intentional','目標性高血鈉','']],
 [['urine','24 小時尿量','mL/day'],['uosm','尿滲透壓 Uosm','mOsm/kg'],['una','尿 Na','mmol/L'],['uk','尿 K','mmol/L'],['k','血 K','mmol/L'],['ca','總血 Ca','mg/dL'],['serumOsm','實測血清滲透壓','mOsm/kg'],['flags','相關病史','']],
 [['drop','24 小時降鈉目標','mmol/L'],['factor','TBW 係數（空白=預設）',''],['insensible','不顯性自由水流失','mL/day'],['giLoss','腎外自由水流失','mL/day'],['urineLoss','尿液 EFWC','mL/day'],['intake','其他已提供自由水','mL/day'],['lossReviewed','輸入／流失已檢視',''],['route','給水方式','']]
];
const notes=[
 [['Na、血糖','確認高血鈉嚴重度；高血糖需校正 Na 並判斷張力，嚴重高血糖不可僅套一般補水公式。'],['體重、性別、年齡','估算全身總水量（TBW），不是測量值；肥胖、消瘦與體液流失會產生誤差。'],['血壓、容量、灌流','先找出休克／低血容量，灌流不穩須先用等張晶體液復甦。'],['腎功能與神經症狀','AKI、少尿、透析或新發神經症狀需個別化處理，不提供例行速度。']],
 [['24 小時尿量','與 Uosm 合併判斷多尿、少尿及是否符合尿崩症線索。'],['Uosm','高血鈉時 Uosm >800 通常表示有濃縮反應；<300 合併多尿提示 AVP 軸異常。'],['尿 Na＋K','用於計算 EFWC（尿液電解質自由水清除率），必須配合同時段尿量及血 Na。'],['病史','評估低飲水量、腎外失水、鈉負荷、利尿劑與神經病變，不應只憑尿液數值斷定原因。']],
 [['目標 Na','慢性或時間不明的高血鈉，此工具採第一天 6、8、10 mmol/L 的可選保守起始目標；真正速度依病況動態調整。'],['TBW 與淨補水','目標補水（L）=TBW×(Na目前/Na目標−1)，是靜態估算，不等於全部第一天液體量。'],['持續流失與已給自由水','加入尿液 EFWC、不顯性及腎外自由水損失，再扣除其他已給自由水；不可將未知值直接填 0。'],['D5W 速度','只在安全閘門及輸入完整後顯示起始估算，並須以 2–4 小時 Na、I/O、血糖和神經狀態再調整。']],
 [['採血時間','以台灣時間記錄實際抽血時間，不可填未來時間；起始與追蹤時間必須分開。'],['區間速度','(前次 Na−本次 Na)÷間隔小時；累積降幅與任意 ≤24 小時區段都要複核。'],['教學模擬','模擬追蹤不是病人資料，不要複製到病歷或當成處方。']]
];
const translations={male:'男性',female:'女性',stable:'穩定',aki:'AKI',acute:'48 小時內',chronic:'超過 48 小時',unknown:'不明',hypo:'低血容量',eu:'正常',hyper:'容量過多',shock:'休克',no:'否／無',yes:'是',d5w:'IV D5W',enteral:'口服／管灌',half:'0.45% NaCl',poorIntake:'飲水不足',brain:'腦部手術',gi:'腸胃流失',sodium:'高鈉負荷'};
const safe=x=>String(x==null?'':x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(x,d=1)=>x===null||x===undefined?'—':Number(x).toLocaleString('zh-TW',{maximumFractionDigits:d,minimumFractionDigits:d});
const display=(key,val)=>{if(key==='flags')return (val||[]).map(x=>translations[x]||x).join('＋')||'無';if(val===''||val===null||val===undefined)return '留空（尚未確認）';return translations[val]||String(val);};
const inputDate=ms=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(ms)).replace(' ','T');
export function getTeachingCase(id){const c=teachingCases[id];if(!c)return null;return {...shared,...c.values,flags:[...c.values.flags]};}
export function getTeachingTracking(){
 // Last sample always ends in the past, regardless of the current date.
 const start=Date.now()-26*3600000;
 return {baselineTime:inputDate(start),logs:[4,8,12,24].map((h,i)=>({time:inputDate(start+h*3600000),na:[159,157,156,152][i]}))};
}
export function createTutorial({host,getState,getStep,getLogs,onLoad,onNavigate,onTracking}){
 let opened=false,selected='dehydration',showWhy=true,feedback='';
 function render(){
  const current=teachingCases[selected],values=current.values,s=getState(),p=plan(s),a=analyze(s),st=getStep(),logs=getLogs();
  const rows=st<3?columns[st]:[];
  const matched=rows.filter(([k])=>JSON.stringify(s[k]??'')===JSON.stringify(values[k]??'')).length;
  const options=Object.entries(teachingCases).map(([id,c])=>'<option value="'+id+'" '+(id===selected?'selected':'')+'>'+safe(c.title)+'</option>').join('');
  const tabs=headings.map((v,i)=>'<button type="button" class="tutorial-tab '+(st===i?'selected':'')+'" data-guide-step="'+i+'" aria-current="'+(st===i?'step':'false')+'">'+(i+1)+' '+safe(v)+'</button>').join('');
  const help=notes[st].map(([t,d])=>'<details class="tutorial-help"><summary>'+safe(t)+' — 為什麼要填？</summary><p>'+safe(d)+'</p></details>').join('');
  const table=st===3
   ?'<p>完成基本評估後，可按「載入模擬追蹤」自動產生起始 Na 160，以及 4、8、12、24 小時的假設採血資料；圖表仍使用原本的追蹤演算法。</p>'
   :'<div class="tutorial-table-wrap"><table class="tutorial-table"><thead><tr><th>網頁欄位</th><th>示範輸入</th><th>目前資料</th></tr></thead><tbody>'+rows.map(([k,label,unit])=>{const v=values[k],live=s[k],same=JSON.stringify(live??'')===JSON.stringify(v??'');return '<tr><th scope="row">'+safe(label)+'</th><td>'+safe(display(k,v))+(unit?' <small>'+safe(unit)+'</small>':'')+'</td><td><span class="tutorial-match '+(same?'ok':'')+'">'+(same?'✓ 相符':'待核對')+'</span></td></tr>';}).join('')+'</tbody></table></div>';
  const numbers=selected==='dehydration'?'<div class="tutorial-expected"><h4>公式核對（此病例標準值）</h4><div class="tutorial-number-grid"><span>TBW <strong>27.0 L</strong></span><span>總自由水缺損 <strong>3.86 L</strong></span><span>尿液 EFWC <strong>900 mL/day</strong></span><span>首日目標 Na <strong>152 mmol/L</strong></span><span>矯正用淨水量 <strong>1,421 mL</strong></span><span>D5W 起始估算 <strong>126 mL/hr</strong></span></div><p class="tutorial-math">TBW=60×0.45=27 L；缺損=27×(160/140−1)=3.86 L；EFWC=1200×[1−(10+30)/160]=900 mL/day；首日淨補水=27×(160/152−1)×1000≈1421 mL；每日額外自由水=1421+700+0+900−0≈3021 mL；每小時≈126 mL。</p><p class="tutorial-note">以上計算結果僅用於教學。低血容量需先確認循環灌流已恢復，且每日失水估值應隨尿量、飲水及 Na 複查調整。</p></div>':'<div class="tutorial-expected caution"><h4>預期安全判讀</h4><p>'+safe(current.rationale)+'</p><p><strong>教學目標：</strong>辨識不適合直接依靜態公式開立 D5W 固定速度的情境。</p></div>';
  const observed=selected==='dehydration'?'<p class="tutorial-observed">目前計算：TBW '+fmt(a.tbw)+' L；尿液 EFWC '+fmt(a.efwc,0)+' mL/day；首日目標 Na '+fmt(p.target,0)+'；'+(p.eligible&&s.route==='d5w'?'D5W '+fmt(p.rate,0)+' mL/hr':'尚未符合產生輸注速度的條件')+'。</p>':'<p class="tutorial-observed">'+(a.blocks.length?'安全閘門：'+safe(a.blocks.slice(0,3).join('、')):'請依臨床條件個別評估')+'。</p>';
  const status=st===3?(logs.length?'已有 '+logs.length+' 筆追蹤資料':'尚未載入追蹤資料'):'與示範相符 '+matched+'/'+rows.length+' 項';
  host.innerHTML='<div class="tutorial-bar"><div><span class="tutorial-eyebrow">INTERACTIVE CLINICAL TRAINING</span><h2>示範病例與操作教學</h2><p>依序練習：填入資料 → 分析病因 → 核對補水公式 → 追蹤鈉變化。全為虛構教學資料。</p></div><button type="button" class="button secondary" data-guide-toggle aria-expanded="'+opened+'">'+(opened?'收合教學':'展開教學')+'</button></div>'
   +(opened?'<div class="tutorial-body"><div class="tutorial-top"><label for="tutorialCase">選擇病例</label><select id="tutorialCase">'+options+'</select><button type="button" class="button" data-guide-load>一鍵填入此病例</button></div><p class="tutorial-story">'+safe(current.story)+'</p><div class="tutorial-objective"><strong>'+safe(current.tag)+'</strong><span>'+safe(current.goal)+'</span></div><div class="tutorial-tabs" aria-label="教學步驟">'+tabs+'</div><div class="tutorial-panel"><div class="tutorial-panel-head"><h3>第 '+(st+1)+' 步：'+headings[st]+'</h3><span class="tutorial-status">'+status+'</span></div>'+table+observed+(st===2?numbers:'')+(st===3&&selected==='dehydration'?'<button type="button" class="button secondary" data-guide-tracking>載入 24 小時模擬採血資料</button>':'')+'<div class="tutorial-why"><button type="button" class="quiet" data-guide-why aria-expanded="'+showWhy+'">'+(showWhy?'收合欄位解釋':'展開欄位解釋')+'</button>'+(showWhy?help:'')+'</div><div class="tutorial-bottom"><span>先按「一鍵填入」，再切換步驟，對照左側欄位與右側即時判讀。</span>'+(st<3?'<button type="button" class="button" data-guide-step="'+(st+1)+'">下一步 →</button>':'<button type="button" class="button secondary" data-guide-step="0">回基本評估</button>')+'</div></div></div>':'');
 }
 host.addEventListener('click',event=>{
  const btn=event.target.closest('button');if(!btn)return;
  if(btn.hasAttribute('data-guide-toggle')){opened=!opened;render();}
  else if(btn.hasAttribute('data-guide-load')){opened=true;onLoad(selected);render();}
  else if(btn.hasAttribute('data-guide-step')){onNavigate(Number(btn.dataset.guideStep));render();}
  else if(btn.hasAttribute('data-guide-tracking')){if(selected==='dehydration'){onTracking();render();}}
  else if(btn.hasAttribute('data-guide-why')){showWhy=!showWhy;render();}
 });
 host.addEventListener('change',event=>{if(event.target.id==='tutorialCase'){selected=event.target.value;render();}});
 return {render,open(){opened=true;render();host.scrollIntoView({behavior:'smooth',block:'start'});}};
}
