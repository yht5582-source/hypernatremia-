import {CHECKED,sources,kindLabels,classify,rateGuide,waterEstimate,correctedNa,severity,demoCases,questions,shuffle,scoreQuiz} from './guideline.js?v=1.3.0';

const tabs=[['diag','診斷指引'],['treat','治療指引'],['special','特殊族群'],['cases','示範病例'],['quiz','20 題考題'],['evidence','證據來源'],['calc','計算導航']];
const root=document.querySelector('#guide-root'),calc=document.querySelector('#calc-root'),modes=document.querySelector('#modes');
const fmt=(x,d=0)=>x===null||x===undefined?'—':Number(x).toLocaleString('zh-TW',{maximumFractionDigits:d,minimumFractionDigits:d});
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const chip=id=>{const s=sources[id];return `<a class="src ${s.kind}" href="${s.url}" target="_blank" rel="noopener" title="${esc(s.cite)}">${esc(s.label)}</a>`;};
const chips=ids=>`<span class="srcs">${ids.map(chip).join('')}</span>`;
const table=(head,rows)=>`<div class="table-wrap"><table class="gl-table"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const steps=list=>`<ol class="pathway">${list.map(([t,b,ids])=>`<li><div><strong>${t}</strong><p>${b}</p>${ids?chips(ids):''}</div></li>`).join('')}</ol>`;
const notice=(body,kind='')=>`<div class="notice ${kind}">${body}</div>`;

let view='diag',input={onset:'unknown',shock:'no',sx:'no',load:'no',volume:''},answers={},qIndex=0,optionOrder={},caseId=demoCases[0].id,shown=false;

const num=(k,label,unit)=>`<label class="field"><span>${label}</span><div class="input-wrap"><input type="number" inputmode="decimal" step="any" min="0" data-gl="${k}" value="${esc(input[k]??'')}" placeholder="請輸入">${unit?`<em>${unit}</em>`:''}</div></label>`;
const pick=(k,label,opts)=>`<label class="field"><span>${label}</span><select data-gl="${k}">${opts.map(([v,t])=>`<option value="${v}" ${input[k]===v?'selected':''}>${t}</option>`).join('')}</select></label>`;
const framing=()=>notice(`<strong>指引現況</strong><p>截至 ${CHECKED}，未查到 KDIGO、ESICM、ERBP 或 Endocrine Society 發布的成人高血鈉專屬指引；ESE／ESICM／ERBP 2014 僅涵蓋低血鈉。本頁整合相關指引與綜述，每項建議都標明來源層級。來源不一致時會並列，不代為裁定。</p>`,'warn');

function diagView(){return `<div class="workspace guide-grid"><section class="surface"><h2 id="section-title">診斷指引</h2><p class="intro">成人血清Na&gt;145 mmol/L。依序確認真實性、容量、尿液反應與病因。</p>${framing()}
<h3 class="guide-title">八步診斷</h3>${steps([
['1. 排除偽高血鈉','低蛋白或脂質異常時，間接ISE可能失真。用直接ISE或滲透壓計確認。',['KJIM']],
['2. 校正血糖','高血糖時算校正Na：Na＋0.016×(血糖−100)（Katz）或＋0.024×(血糖−100)（Hillier）。',['KJIM']],
['3. 判斷容量','由病史與身體檢查分低、正常、高容量；同時確認灌流與神經狀態。',['KJIM']],
['4. 尿Na','&lt;20 mmol/L支持容量不足；滲透性利尿、利尿劑、解除阻塞及ATN恢復期即使缺容量也可能&gt;20。',['KJIM']],
['5. 尿量與Uosm','主分流步驟，見下表。尿量&gt;500 mL/day且Uosm未達800，表示腎臟反應不足。',['KJIM']],
['6. 尿液自由水清除','腎性失水時計算 EFWC＝尿量×[1−(尿Na＋尿K)/血Na]。明顯正值代表腎臟持續失水。',['KJIM']],
['7. AVP／copeptin','低張性多尿時，以DDAVP反應與copeptin鑑別。AVP本身不穩定，臨床上少用。',['KJIM','AVPR']],
['8. 其他電解質','K&lt;3.0 mmol/L或Ca&gt;11 mg/dL都可能損害腎臟濃縮能力。',['KJIM']]])}
<h3 class="guide-title">尿液分流</h3>${table(['Uosm（mOsm/kg）','再看','最可能','下一步'],[
['<strong>&gt;800</strong>','尿量常&lt;500 mL/day','飲水不足、腎外失水、鈉負荷','查飲水管道、流失與鈉輸入'],
['<strong>300–800</strong>','溶質排出&gt;750–1000 mOsm/day','滲透性利尿','查葡萄糖、尿素、mannitol、利尿劑、解除阻塞'],
['<strong>300–800</strong>','溶質排出&lt;750 mOsm/day','部分DI、合併容量不足的中樞性DI、腎功能不全','恢復容量後重測，評估DDAVP反應'],
['<strong>&lt;300</strong>','尿量&gt;3 L/day或&gt;40 mL/kg/day','低張性多尿：AVP-D或AVP-R','DDAVP反應、基礎copeptin']])}
<p class="hint">內分泌文獻對多尿常用&gt;50 mL/kg/24h，高血鈉綜述用&gt;40 mL/kg/day或&gt;3 L/day。${chips(['KJIM','AVPR'])}</p>
<h3 class="guide-title">AVP-D 與 AVP-R 的鑑別</h3>${table(['檢查','條件','判讀','注意'],[
['DDAVP反應','已高血鈉時可直接做','Uosm上升≥50%且尿量下降：AVP-D；上升&lt;50%：AVP-R；&gt;50%但未達800：部分反應 '+chips(['KJIM']),'給藥後尿量驟減，需同步調降給水'],
['基礎copeptin','未限水','≥21.4 pmol/L支持AVP-R '+chips(['AVPR']),'切點來自多尿評估研究'],
['高張食鹽水刺激copeptin','Na正常的多尿病人；每30分鐘驗Na','Na≥150時 &gt;4.9 pmol/L：原發性多飲；≤4.9：AVP-D。準確度96.5% '+chips(['FENSKE','REFARDT']),'<strong>已高血鈉者不做</strong>；需有監測能力的單位'],
['精胺酸刺激copeptin','Na正常的多尿病人','≤3.0 pmol/L傾向AVP-D；&gt;5.2傾向原發性多飲；整體準確度74.4% '+chips(['REFARDT']),'未達非劣性，不能取代高張食鹽水'],
['限水試驗','Na正常的多尿病人','準確度約77% '+chips(['FENSKE']),'<strong>已高血鈉者不做</strong>']])}
<p class="hint">命名：中樞性DI改稱 AVP deficiency（AVP-D），腎性DI改稱 AVP resistance（AVP-R）。${chips(['NAME'])}</p>
</section><aside class="tool" aria-label="診斷路徑判讀"><h2>診斷路徑判讀</h2><div class="grid two">${num('na','血清Na','mmol/L')}${num('glucose','血糖','mg/dL')}${num('weight','體重','kg')}${pick('volume','容量',[['','未確認'],['hypo','低'],['eu','正常'],['hyper','過多']])}${num('urine','24小時尿量','mL')}${num('uosm','Uosm','mOsm/kg')}${num('postUosm','DDAVP後Uosm','選填')}</div><div id="diag-result" aria-live="polite"></div></aside></div>`;}

function treatView(){return `<div class="workspace guide-grid"><section class="surface"><h2 id="section-title">治療指引</h2><p class="intro">先救灌流與神經急症，再依發生時間決定速度，最後才計算給水量。</p>
<h3 class="guide-title">六步處置</h3>${steps([
['1. 處理原因','停lactulose、利尿劑或致病藥物；控制腸胃流失、發燒與高血糖；解除阻塞；矯正低血鉀與高血鈣；停高張灌食。',['KJIM']],
['2. 判斷症狀與時間','48小時內為急性；超過48小時或時間不明，都按慢性處理。',['KJIM']],
['3. 計算水量','總缺水＝TBW×(Na/140−1)。TBW係數男0.6、女0.5，長者各扣0.05。每日給水＝矯正量＋不顯性流失＋持續流失。',['KJIM']],
['4. 選輸液','依灌流與容量選擇，見下表。能安全吞嚥時優先口服或鼻胃管給水。',['KJIM','SFE','AAFP']],
['5. 複驗調整','初期每2–4小時驗Na，每次重算速度、輸入與尿量。AVP-D復甦期至少每4小時。',['KJIM','SFE']],
['6. 治療DI','AVP-D用DDAVP；AVP-R停致病藥，可用thiazide、amiloride或NSAID。見特殊族群。',['KJIM','SFE']]])}
<h3 class="guide-title">矯正速度：各來源比較</h3>${table(['情境','速度','24小時上限','來源與層級'],[
['慢性或時間不明','≤0.5 mmol/L/h','10 mmol/L',chip('SFE')+' 指引，針對AVP-D'],
['成人（未分急慢性）','—','12 mmol/L',chip('AAFP')+' SORT B'],
['慢性或時間不明','&lt;0.5 mmol/L/h；避免&lt;0.25','12 mmol/L',chip('KJIM')+' 綜述'],
['急性有症狀','第一小時5 mmol/L或至症狀改善','10 mmol/L',chip('SFE')+' 指引，針對AVP-D'],
['急性有症狀的鈉負荷','1–2 mmol/L/h，持續6–8小時','24小時內回到約145',chip('KJIM')+chip('GOSHIMA')+' 綜述與個案'],
['兒童（足月新生兒起）','—','12 mmol/L',chip('NG29')+' 指引']])}
${notice('<strong>補水時程也不一致</strong><p>AAFP的表格列出總缺水量於24小時給完；Yun 2023則建議分48–72小時。Na偏高時，24小時補完可能超過同篇12 mmol/L的上限，因此本頁採Yun的分次補法，並以實測Na為準。</p>','warn')}
<h3 class="guide-title">依容量選擇輸液</h3>${table(['狀態','處置','來源'],[
['休克／低血壓','0.9% NaCl或平衡晶體液，不論Na多高，恢復灌流後再補自由水',chips(['KJIM','SFE'])],
['低容量、循環穩定','低張液（D5W、0.2%或0.45% NaCl）；含鈉輸液需另算其自由水比例',chips(['KJIM'])],
['正常容量','口服或鼻胃管給水，或D5W',chips(['KJIM','AAFP'])],
['高容量','停鈉來源；D5W補水併用利尿劑維持負平衡；無法耐受時評估RRT',chips(['KJIM','KDIGO'])]])}
${table(['輸液','Na（mmol/L）','每公升Na效果'],[['D5W','0','自由水最多；注意血糖'],['0.2% NaCl in D5W','34','約D5W的八成'],['0.45% NaCl','77','約D5W的一半'],['Ringer’s lactate','130','接近等張，不用於補自由水'],['0.9% NaCl','154','用於恢復灌流']])}
<p class="hint">Na含量來自 ${chip('SFE')}。每公升效果為 Adrogué–Madias 估算：(輸液Na＋K−血Na)／(TBW＋1)。加入KCl也會減少自由水效果；此公式在少尿或嚴重缺水時準確度較差。${chips(['KJIM'])}</p>
<h3 class="guide-title">矯正過快或過慢</h3>${steps([
['超過目標：不要再把Na拉高','AAFP（SORT B）與Yun都不建議重新提高Na。放慢給水、重算流失並追蹤神經狀態。',['AAFP','KJIM']],
['矯正過慢也有風險','&lt;0.25 mmol/L/h與較高死亡率相關（觀察性）。多數情況是低估持續流失，先查EFWC與腸胃流失。',['KJIM','FEIGIN']],
['RRT','無統一啟動條件。AKI或無法耐受給水時與腎臟科討論；CRRT可客製溶液以漸進矯正。',['KDIGO']]])}
</section><aside class="tool" aria-label="治療路徑判讀"><h2>治療路徑判讀</h2><div class="grid two">${num('na','血清Na','mmol/L')}${num('weight','體重','kg')}${num('age','年齡','歲')}${pick('sex','生理性別',[['','未選'],['male','男性'],['female','女性']])}${pick('onset','發生時間',[['unknown','不明'],['chronic','>48小時'],['acute','≤48小時（有佐證）']])}${pick('shock','休克／低血壓',[['no','否'],['yes','是']])}${pick('sx','意識改變／抽搐',[['no','否'],['yes','是']])}${pick('load','鈉負荷事件',[['no','否'],['yes','是']])}</div><div id="treat-result" aria-live="polite"></div></aside></div>`;}

function specialView(){return `<section class="surface wide"><h2 id="section-title">特殊族群</h2><p class="intro">下列情境的處置與一般路徑不同。藥物劑量來自國際文獻，尚未對照台灣仿單與健保規定，開立前請確認。</p>
<div class="cards">
<article class="gl-card"><h3>已知 AVP-D 住院</h3>${chips(['SFE'])}<ul><li>入院即標示；24小時都要能取得DDAVP；通知內分泌團隊。</li><li>可喝水者床邊備水，按時給藥。意識不佳者記錄出入量，Na至少每12小時。</li><li>維持輸液中，Na正常者至少每24小時驗一次，以防隱性低血鈉。</li><li>高血鈉是急症，放level 2–3照護。先恢復容量，再評估DDAVP。</li><li>劑量：口服／舌下100–200 µg；鼻噴10–20 µg；IM／IV 1–2 µg。尿量大且稀釋時才追加。</li><li>無渴感者同時有高血鈉與低血鈉風險。糖皮質素可能使尿量上升。</li></ul></article>
<article class="gl-card"><h3>AVP-R（腎性）</h3>${chips(['KJIM','AVPR','FICM'])}<ul><li>查鋰鹽、demeclocycline、foscarnet、amphotericin B、V2拮抗劑；低血鉀、高血鈣與腎病。</li><li>自由水是核心，不可限水。</li><li>藥物：amiloride 2.5–10 mg/day；可用thiazide、NSAID。</li><li>thiazide可能升高鋰濃度。鋰鹽性AVP-R停藥後可能數週至數月才恢復；停藥需考慮精神科影響。</li></ul></article>
<article class="gl-card"><h3>長者低攝水性脫水</h3>${chips(['ESPEN'])}<ul><li>所有長者都視為高風險，鼓勵足量飲水（GPP）。</li><li>篩檢以直接測得的血清滲透壓&gt;300 mOsm/kg，或計算值&gt;295 mmol/L為準。</li><li>外觀良好：鼓勵喝偏好的飲料（GPP）。</li><li>外觀不適：皮下或靜脈輸液，同時鼓勵喝水（Grade A，共識95%）。</li><li>皮膚彈性、口乾、尿色與尿比重不適合用來判斷水合。</li></ul></article>
<article class="gl-card"><h3>急性鈉負荷</h3>${chips(['KJIM','GOSHIMA'])}<ul><li>需有先前Na或明確事件佐證。</li><li>有症狀者可1–2 mmol/L/h，持續6–8小時，24小時內回到約145。</li><li>回顧的18例中，存活者多在8小時內≤160、24小時內≤150。此資料未做統計檢定。</li><li>D5W量大時監測血糖；僅3例接受透析，無明確啟動條件。</li></ul></article>
<article class="gl-card"><h3>神經重症的高張鈉治療</h3>${chips(['NCS'])}<ul><li>先確認高血鈉是否為治療目標。</li><li>SAH：建議依症狀給bolus，不建議目標鈉濃度（條件式，證據很低）。</li><li>文獻中的目標多為145–155 mEq/L，但資料有限。</li><li>本頁不提供退鈉速度，請由神經重症團隊決定。</li></ul></article>
<article class="gl-card"><h3>AKI 與 RRT</h3>${chips(['KDIGO','KJIM'])}<ul><li>NaHCO₃可能造成高血鈉，濃度高者尤其需要注意。</li><li>Loop併thiazide可能減輕loop利尿劑相關高血鈉。</li><li>CRRT可客製溶液以漸進矯正。</li><li>上述來自KDIGO 2026公開審查草案，定稿前可能修改。</li></ul></article>
<article class="gl-card"><h3>住院輸液相關高血鈉</h3>${chips(['CG174'])}<ul><li>NICE CG174條件：Na≥155 mmol/L、基線Na正常或偏低、輸液含0.9% NaCl，且無其他可能原因。</li></ul></article>
<article class="gl-card"><h3>兒童</h3>${chips(['NG29'])}<ul><li>本頁工具僅適用成人。</li><li>無脫水而用等張液：考慮改低張液（0.45% NaCl加葡萄糖）。</li><li>有脫水：缺水量分48小時補，起始用0.9% NaCl。</li><li>容量不明：驗尿Na與滲透壓。Na下降≤12 mmol/L/24h。</li><li>兒童計算可用<a href="https://yht5582-source.github.io/pediatric-dehydration-/" target="_blank" rel="noopener">小兒脫水計算工具</a>。</li></ul></article>
</div></section>`;}

function casesView(){
 const c=demoCases.find(x=>x.id===caseId);
 return `<section class="surface wide"><h2 id="section-title">示範病例</h2><p class="intro">虛構教學病例，標示為示例。先自己想，再展開答案。</p><div class="case-tabs" role="tablist">${demoCases.map((d,i)=>`<button role="tab" aria-selected="${d.id===caseId}" class="${d.id===caseId?'selected':''}" data-case="${d.id}">病例 ${i+1}｜${esc(d.title)}</button>`).join('')}</div>
 <article class="case"><div class="case-head"><span class="badge">示例</span><span class="badge soft">${esc(c.tag)}</span></div><p class="case-story">${esc(c.story)}</p>
 ${c.steps.map((s,i)=>`<details class="case-step"><summary>${i+1}. ${esc(s.q)}</summary><p>${esc(s.a)}</p></details>`).join('')}
 ${notice(`<strong>常見陷阱</strong><p>${esc(c.pitfall)}</p>`,'warn')}
 <p class="hint">依據 ${chips(c.src)}</p><div class="actions"><button class="button secondary" data-load-case="${c.id}">帶入計算導航</button></div></article>
 <p class="hint">計算導航內另有4個教學病例，可對照完整計算步驟。</p></section>`;
}

function optionsFor(q){return optionOrder[q.id]??=shuffle([q.a,...q.w]);}
function quizView(){
 const sc=scoreQuiz(answers),q=questions[qIndex],picked=answers[q.id];
 const dots=questions.map((x,i)=>{const st=answers[x.id]===undefined?'':answers[x.id]===x.a?'right':'wrong';return `<button class="dot ${st} ${i===qIndex?'now':''}" data-q="${i}" aria-label="第 ${i+1} 題${st==='right'?'，答對':st==='wrong'?'，答錯':''}">${i+1}</button>`;}).join('');
 const summary=sc.answered===sc.total?`<div class="quiz-score"><strong>${sc.correct} / ${sc.total}</strong><p>${Object.entries(sc.by).map(([k,v])=>`${k} ${v.correct}/${v.total}`).join('　')}</p><button class="button secondary" data-quiz="reset">重新測驗</button></div>`:'';
 return `<section class="surface wide quiz"><h2 id="section-title">20 題考題</h2><p class="intro">單選題，作答後立即看解析。選項順序每次隨機，成績不會儲存。</p><div class="dots">${dots}</div>${summary}
 <article class="question"><p class="q-meta">第 ${qIndex+1} 題／共 ${questions.length} 題 · ${esc(q.domain)}</p><h3>${esc(q.stem)}</h3><div class="options">${optionsFor(q).map(o=>{const cls=picked===undefined?'':o===q.a?'right':o===picked?'wrong':'dim';return `<button class="option ${cls}" data-answer="${esc(o)}" ${picked!==undefined?'disabled':''}>${esc(o)}${picked!==undefined&&o===q.a?'<span class="mark">正確答案</span>':picked===o?'<span class="mark">你的答案</span>':''}</button>`;}).join('')}</div>
 ${picked!==undefined?notice(`<strong>${picked===q.a?'答對':'答錯'}</strong><p>${esc(q.why)}</p>${chips(q.src)}`,picked===q.a?'':'warn'):''}
 <div class="actions"><button class="button secondary" data-q="${qIndex-1}" ${qIndex===0?'disabled':''}>上一題</button><button class="button" data-q="${qIndex+1}" ${qIndex===questions.length-1?'disabled':''}>下一題</button></div></article></section>`;
}

function evidenceView(){
 const groups=['guide','stmt','draft','review','trial','obs'];
 return `<section class="surface wide"><h2 id="section-title">證據來源</h2><p class="intro">查證日期 ${CHECKED}。</p>${framing()}
 <div class="legend">${groups.map(k=>`<span class="src ${k}">${kindLabels[k]}</span>`).join('')}</div>
 ${groups.map(k=>{const rows=Object.values(sources).filter(s=>s.kind===k);return `<h3 class="guide-title">${kindLabels[k]}</h3><ol class="refs">${rows.map(s=>`<li><a href="${s.url}" target="_blank" rel="noopener">${esc(s.cite)}</a><br><span class="hint">${esc(s.use)}</span></li>`).join('')}</ol>`;}).join('')}
 <h3 class="guide-title">矯正速度的觀察性研究</h3>${table(['研究','對象','結果'],[
 [chip('CHAUHAN'),'ICU，入院122人、院內發生327人','快速（&gt;0.5）對慢速：死亡aOR約1.3，兩組皆無顯著差異；無腦水腫歸因於快速矯正'],
 [chip('FEIGIN'),'Na≥155，n=4265','慢速對快速：30天死亡aOR 2.02（1.55–2.62）'],
 [chip('CHACON'),'入院高血鈉，n=37,913','慢速對快速：院內死亡aOR 0.63（0.59–0.67），但轉安寧aOR 1.57、轉護理機構aOR 1.60']])}
 <p>三篇方向不一致，且都可能受病情嚴重度與治療選擇干擾，無法據以訂定單一速度。</p>
 <h3 class="guide-title">本頁限制</h3><ul><li><strong>Endocrine Society 2016</strong>（Fleseriu，JCEM 101:3888）含AVP缺乏內容，但全文無法在查證時開啟，因此未引用其內容。</li><li>AAFP 2023 僅引用已核對的SORT表與公式表，其餘段落未納入。</li><li>NICE CG174 僅引用併發症條件。</li><li>不含台灣仿單與健保規定。</li></ul></section>`;
}

function renderResults(){
 const d=document.querySelector('#diag-result');
 if(d){
  const r=classify(input),c=correctedNa(input.na,input.glucose),sev=severity(input.na);
  d.innerHTML=`${sev?`<p class="tool-sev"><strong>${fmt(input.na)}</strong> mmol/L · ${sev}</p>`:''}${c&&Number(input.glucose)>=200?`<p class="hint">校正Na ${fmt(c.katz,1)}–${fmt(c.hillier,1)}</p>`:''}<div class="tool-out"><strong>${esc(r.title)}</strong><p>${esc(r.body)}</p>${r.next?`<p class="next">下一步：${esc(r.next)}</p>`:''}${chips(r.src)}</div><p class="hint">單一路徑提示，多重原因需由臨床判斷。</p>`;
 }
 const t=document.querySelector('#treat-result');
 if(t){
  const r=rateGuide(input),w=waterEstimate(input);
  t.innerHTML=`${r.first?notice(`<strong>優先</strong><p>${esc(r.first)}</p>`,'danger'):''}<div class="tool-out"><strong>${esc(r.title)}</strong>${r.perHour?`<p class="big-rate">${esc(r.perHour)}</p>`:''}${r.target24!==undefined?`<p>24小時後Na：${r.target24Alt!==undefined&&r.target24Alt!==r.target24?`不低於 ${r.target24Alt}–${r.target24}`:`約 ${r.target24}`} mmol/L</p>`:''}${r.lines.map(x=>`<p class="next">${esc(x)}</p>`).join('')}${chips(r.src)}</div>${w?`<div class="tool-out"><strong>水量估算</strong><p>TBW ${fmt(w.tbw,1)} L（係數 ${fmt(w.f,2)}）</p><p>總缺水 ${fmt(w.deficit,1)} L，分48–72小時</p><p>每公升Na變化：D5W ${fmt(w.d5wPerL,1)}；0.45% NaCl ${fmt(w.half,1)}</p><p class="next">文獻起始固定速度：D5W ${fmt(w.fixedLow)} mL/h（1.35 mL/kg/h）。另有每降1 mmol/L約需 ${fmt(w.per1mmol)} mL自由水的算法。</p>${chips(['KJIM'])}</div>`:'<p class="hint">輸入體重、年齡與性別後顯示水量估算。</p>'}<p class="hint">持續流失、少尿與AKI須另外評估，請用計算導航完成完整補水計畫。</p>`;
 }
}

function render(scroll=false){
 modes.innerHTML=tabs.map(([id,t],i)=>`<button data-mode="${id}" class="${id===view?'active':''}" ${id===view?'aria-current="page"':''}><span class="step-num">${String(i+1).padStart(2,'0')}</span><span>${t}</span></button>`).join('');
 const isCalc=view==='calc';
 calc.hidden=!isCalc;root.hidden=isCalc;
 if(!isCalc)root.innerHTML=`<main class="guide-main">${({diag:diagView,treat:treatView,special:specialView,cases:casesView,quiz:quizView,evidence:evidenceView})[view]()}</main>`;
 renderResults();
 if(scroll)modes.scrollIntoView({block:'start'});
}
function go(id,scroll=true){view=tabs.some(t=>t[0]===id)?id:'diag';history.replaceState(null,'','#'+view);render(scroll);}

document.addEventListener('input',e=>{const k=e.target.dataset?.gl;if(k){input[k]=e.target.value;renderResults();}});
document.addEventListener('click',e=>{
 const el=e.target.closest('button');if(!el)return;
 if(el.dataset.mode)go(el.dataset.mode,false);
 if(el.dataset.case){caseId=el.dataset.case;render();}
 if(el.dataset.loadCase){const c=demoCases.find(x=>x.id===el.dataset.loadCase);document.dispatchEvent(new CustomEvent('hn-load-case',{detail:{...c.values,flags:[...c.values.flags]}}));go('calc');}
 if(el.dataset.answer!==undefined){const q=questions[qIndex];if(answers[q.id]===undefined){answers[q.id]=el.dataset.answer;render();document.querySelector('.question .notice')?.focus?.();}}
 if(el.dataset.q!==undefined){qIndex=Number(el.dataset.q);render();}
 if(el.dataset.quiz==='reset'){answers={};optionOrder={};qIndex=0;render();}
});
go(location.hash.slice(1)||'diag',false);
