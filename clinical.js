export const ranges={na:[100,220],weight:[20,300],age:[0,120],glucose:[20,1500],cr:[0.1,30],egfr:[0,180],sbp:[40,250],k:[1,10],ca:[3,20],uosm:[20,1800],urine:[0,20000],una:[0,400],uk:[0,300],serumOsm:[150,500],factor:[0.3,0.7],insensible:[0,5000],giLoss:[0,10000],urineLoss:[0,20000],intake:[0,20000],drop:[6,10]};
export const num=(s,k)=>s[k]===''||s[k]===undefined||s[k]===null?null:Number(s[k]);
export function errors(s){return Object.entries(ranges).filter(([k,[lo,hi]])=>num(s,k)!==null&&(!Number.isFinite(num(s,k))||num(s,k)<lo||num(s,k)>hi)).map(([k])=>k);}
export function tbwFactor(s){if(num(s,'factor')!==null)return num(s,'factor');if(!s.sex||num(s,'age')===null)return null;return +(s.sex==='male'?(num(s,'age')>=65?0.55:0.6):(num(s,'age')>=65?0.45:0.5)).toFixed(2);}
export function analyze(s){
 const na=num(s,'na'),w=num(s,'weight'),u=num(s,'urine'),os=num(s,'uosm'),gl=num(s,'glucose'),una=num(s,'una'),uk=num(s,'uk'),age=num(s,'age');
 const f=tbwFactor(s),tbw=f!==null&&w!==null?f*w:null,high=na!==null&&na>145,adult=age!==null&&age>=18;
 const poly=u!==null&&(u>3000||(w!==null&&u/w>40));
 const efwc=high&&u!==null&&una!==null&&uk!==null?u*(1-(una+uk)/na):null;
 const solute=u!==null&&os!==null?u/1000*os:null;
 const flags=s.flags||[],has=k=>flags.includes(k),causes=[];
 const add=(title,evidence,next)=>causes.push({title,evidence,next});
 if(high){
  if(has('poorIntake'))add('攝水不足','病史有飲水不足、吞嚥或取得水分困難。','確認實際飲水與管灌水量、口渴感、照護依賴及吞嚥安全。');
  if(has('gi')||has('fever'))add('腎外失水',has('gi')?'有腹瀉、嘔吐或引流病史。':'有發燒、流汗或呼吸道失水風險。','量測引流與腸胃流失；控制發燒，重新估算不顯性失水。');
  if(os!==null&&os<300&&poly)add('疑似尿崩症／低張性多尿',`Uosm ${os}，24小時尿量 ${u} mL，符合低張性多尿線索。`,'評估AVP缺乏或腎臟AVP阻抗；由專科安排DDAVP反應／copeptin。已有高血鈉時勿自行限水試驗。');
  else if(os!==null&&os<300)add('尿液濃縮反應不足',`Uosm ${os}；${u===null?'尚缺尿量。':'尚無明確多尿證據。'}`,'確認24小時尿量、腎功能與用藥；單一Uosm不能確診尿崩症。');
  else if(os!==null&&os<=800)add('滲透性利尿或部分濃縮障礙',`Uosm ${os} mOsm/kg${solute!==null?`；尿溶質排出約 ${Math.round(solute)} mOsm/day`:''}。`,'檢查尿糖、尿素、mannitol、利尿劑及解除阻塞後利尿；溶質排出>750–1000 mOsm/day支持滲透性利尿。');
  else if(os!==null)add('腎臟有濃縮反應',`Uosm ${os} >800。`,'優先尋找攝水不足、腎外失水或鈉負荷；高Uosm不排除尿素／葡萄糖引起的自由水流失。');
  if(gl!==null&&gl>180||has('osmotic'))add('滲透性利尿風險','有高血糖、mannitol或高尿素負荷線索。','檢驗尿糖及每日尿溶質；高血糖需同步評估DKA／HHS，治療時鈉與張力會改變。');
  if(has('sodium'))add('高張鈉負荷','有高張食鹽水、NaHCO₃或其他高鈉輸入。','查核輸入濃度、總鈉量與時間；確認是否急性、有症狀及容量過多。');
  if(has('lithium')||num(s,'k')!==null&&num(s,'k')<3||num(s,'ca')!==null&&num(s,'ca')>11)add('腎性濃縮障礙的可逆因素','鋰鹽、低血鉀或高血鈣線索。','檢討致病用藥，矯正K／Ca；尿崩症用藥需依病因、腎功能與容量個別決定。');
  if(has('diuretics')||has('recovery'))add('藥物或腎病恢復期失水','有利尿劑、解除阻塞或AKI恢復期線索。','追蹤尿量、尿電解質與自由水流失，檢討利尿需求。');
  if(!causes.length)add('原因尚未確定','目前資料不足以定位水分或鈉失衡來源。','補齊飲水與輸液紀錄、腎外失水病史、尿量及Uosm。');
 }
 const urgent=[];
 if(s.hemo==='shock'||num(s,'sbp')!==null&&num(s,'sbp')<90)urgent.push('低血壓／休克：先評估灌流並以等張晶體液復甦；穩定前不產生例行補水速度。');
 if(s.neuro==='yes')urgent.push('意識改變／抽搐：立即臨床評估與監測，並排除其他神經或代謝急症。');
 if(na!==null&&na>=160)urgent.push('Na ≥160：需加強監測，評估重症照護需求。');
 const blocks=[];
 if(errors(s).length)blocks.push('修正超出合理範圍的數值');
 if(!adult)blocks.push(age===null?'年齡（確認成人）':'本工具僅適用≥18歲成人');
 if(!high)blocks.push(na===null?'血清Na':'目前Na未達高血鈉定義');
 if(w===null)blocks.push('體重');
 if(f===null)blocks.push('TBW係數或性別與年齡');
 if(!s.duration)blocks.push('發生時間（可選不明）');
 if(!s.volume||s.volume==='unknown')blocks.push('容量狀態');
 if(s.hemo!=='stable')blocks.push('確認循環穩定');
 if(!s.neuro||s.neuro==='unknown')blocks.push('神經症狀評估');
 if(s.neuro==='yes')blocks.push('神經急症需專科評估');
 if(num(s,'sbp')!==null&&num(s,'sbp')<90)blocks.push('收縮壓<90，需先處理灌流');
 if(gl===null)blocks.push('血糖');
 if(gl!==null&&gl<70)blocks.push('低血糖：需先處理並重新評估');
 if(gl!==null&&gl>=250)blocks.push('血糖≥250：需先評估DKA／HHS並個別計畫');
 if(!s.renal)blocks.push('腎功能／AKI評估');
 if(num(s,'cr')===null&&num(s,'egfr')===null)blocks.push('Creatinine或eGFR');
 if(s.renal&&s.renal!=='stable'||num(s,'egfr')!==null&&num(s,'egfr')<30)blocks.push('AKI、重度腎功能障礙或透析：需個別化補水');
 if(u===null)blocks.push('24小時尿量');
 if(u!==null&&w!==null&&u/24/w<0.5)blocks.push('少尿：須先評估容量與腎功能');
 if(s.volume==='hyper')blocks.push('容量過多：需整合排鈉／利尿或RRT計畫');
 if(s.intentional==='yes')blocks.push('神經重症目標性高血鈉：需依專科目標');
 if(!s.intentional||s.intentional==='unknown')blocks.push('確認是否為目標性高血鈉');
 if(s.duration==='acute'&&has('sodium')&&s.neuro==='yes')blocks.push('急性有症狀鈉負荷：專科較快矯正路徑');
 const corrected=na!==null&&gl!==null&&gl>100?[na+1.6*(gl-100)/100,na+2.4*(gl-100)/100]:null;
 const deficit=high&&tbw!==null?tbw*(na/140-1):null;
 return {high,adult,poly,efwc,solute,tbw,f,causes,urgent,blocks:[...new Set(blocks)],corrected,deficit,tonicity:na!==null&&gl!==null?2*na+gl/18:null};
}
export function plan(s){
 const a=analyze(s),na=num(s,'na'),drop=num(s,'drop')??8;
 const target=a.high?Math.max(145,na-drop):null;
 const base=a.tbw!==null&&target!==null?a.tbw*(na/target-1)*1000:null;
 const lossKeys=['insensible','giLoss','urineLoss','intake'];
 const missing=lossKeys.filter(k=>num(s,k)===null);
 const net=base!==null&&!missing.length?base+num(s,'insensible')+num(s,'giLoss')+num(s,'urineLoss')-num(s,'intake'):null;
 const eligible=!a.blocks.length&&!missing.length&&net!==null&&net>=0&&s.lossReviewed==='yes';
 return {...a,target,base,net,missing,eligible,rate:eligible?net/24:null,actualDrop:target!==null?na-target:null};
}
export function trend(s,logs){
 const baseMs=Date.parse(s.baselineTime+'+08:00'),baseNa=num(s,'na');
 if(!Number.isFinite(baseMs)||baseNa===null)return {points:[],warnings:[]};
 if(baseMs>Date.now()+60000||logs.some(l=>Date.parse(l.time+'+08:00')<=baseMs))return {points:[],warnings:['起始採血時間須為過去時間，且早於所有追蹤時間；請修正時間後再判讀。'],invalid:true};
 const points=[{time:baseMs,na:baseNa},...logs.map(l=>({time:Date.parse(l.time+'+08:00'),na:Number(l.na)}))].sort((a,b)=>a.time-b.time);
 const warnings=[],intervals=points.slice(1).map((p,i)=>{const prev=points[i],hours=(p.time-prev.time)/3600000;const rate=(prev.na-p.na)/hours; if(rate>0.5)warnings.push('最近區間下降>0.5 mmol/L/hr，請即刻複核矯正速度及輸入／流失。');if(rate<0)warnings.push('血鈉上升：檢查持續失水、鈉負荷、給水是否足夠。');return {...p,hours,rate,drop:baseNa-p.na};});
 for(let i=1;i<points.length;i++)for(let j=0;j<i;j++){const h=(points[i].time-points[j].time)/3600000;if(h>0&&h<=24&&points[j].na-points[i].na>10)warnings.push('已測區間≤24小時下降>10 mmol/L，請立即複核計畫。');}
 if(intervals.length){const last=intervals.at(-1),elapsed=(last.time-baseMs)/3600000;if(elapsed>=12&&(baseNa-last.na)/elapsed<0.25&&last.na>145)warnings.push('整體矯正偏慢（<0.25 mmol/L/hr）：重新評估補水與流失；此為複核提示，勿依單一數值自動加速。');}
 return {points,intervals,warnings:[...new Set(warnings)]};
}
