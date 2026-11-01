// Mind-map content and a pure two-sided tree layout. No DOM access: node tests.mjs imports this file.
const leaf=(t,...src)=>({t,src});
const group=(t,src,...c)=>({t,src,c});

export const mindmaps={
 diag:{title:'診斷心智圖',t:'高血鈉診斷\nNa >145 mmol/L',src:['KJIM','AAFP'],c:[
  group('確認真實性',[],
   group('偽高血鈉',['KJIM'],leaf('蛋白或脂質異常＋間接ISE','KJIM'),leaf('改直接ISE或測滲透壓','KJIM')),
   group('高血糖校正',['KJIM'],leaf('Na＋0.016–0.024×(血糖−100)','KJIM'))),
  group('分級與時間',[],
   group('嚴重度',['KJIM','SFE'],leaf('Yun：146–150／151–155／>155','KJIM'),leaf('SfE：146–149／150–159／>160','SFE')),
   group('發生時間',['KJIM'],leaf('急性：≤48小時，需佐證','KJIM'),leaf('慢性：>48小時或不明','KJIM'))),
  group('容量狀態',[],
   group('低容量：水＋鈉流失',['KJIM'],leaf('腸胃或皮膚流失','KJIM'),leaf('滲透性利尿、loop利尿劑','KJIM')),
   group('正常容量：純水流失',['KJIM'],leaf('呼吸與皮膚不顯性失水','KJIM'),leaf('AVP-D、AVP-R','KJIM'),leaf('飲水不足、低渴感','KJIM')),
   group('高容量：鈉增加',['KJIM'],leaf('高張NaCl、NaHCO₃','KJIM'),leaf('攝鹽、海水、高張灌食','KJIM'))),
  group('尿液分流',[],
   group('Uosm >800',['KJIM'],leaf('腎臟濃縮正常','KJIM'),leaf('腎外失水、飲水不足、鈉負荷','KJIM')),
   group('Uosm 300–800',['KJIM'],leaf('溶質>750–1000 mOsm/day：滲透性利尿','KJIM'),leaf('溶質較低：部分DI、腎功能不全','KJIM')),
   group('Uosm <300',['KJIM','SFE'],leaf('尿量>3 L/day或>40 mL/kg/day：低張性多尿','KJIM'),leaf('未多尿：恢復容量後重測','SFE')),
   group('尿Na',['KJIM'],leaf('<20：支持容量不足','KJIM'),leaf('>20：利尿劑、滲透性利尿也可能','KJIM')),
   group('EFWC',['KJIM'],leaf('明顯正值：腎臟持續失水','KJIM'),leaf('接近0：腸胃或不顯性失水','KJIM'))),
  group('AVP-D／AVP-R',[],
   group('已高血鈉',['KJIM','FENSKE'],leaf('不做限水或高張刺激','KJIM'),leaf('直接看DDAVP反應','KJIM')),
   group('DDAVP反應',['KJIM'],leaf('Uosm升≥50%：AVP-D','KJIM'),leaf('Uosm升<50%：AVP-R','KJIM'),leaf('>50%但未達800：部分反應','KJIM')),
   group('Copeptin',['AVPR','FENSKE','REFARDT'],leaf('基礎≥21.4 pmol/L：支持AVP-R','AVPR'),leaf('Na正常的多尿者：高張刺激>4.9為原發性多飲，≤4.9為AVP-D','FENSKE','REFARDT'))),
  group('可逆因素',[],
   leaf('K <3.0 mmol/L','KJIM'),leaf('Ca >11 mg/dL','KJIM'),leaf('鋰鹽、foscarnet、amphotericin B','KJIM'))
 ]},
 treat:{title:'治療心智圖',t:'高血鈉治療',src:['KJIM','SFE','AAFP'],c:[
  group('先處理急症',[],
   group('休克／低血壓',['KJIM','SFE'],leaf('0.9% NaCl或平衡晶體液','KJIM','SFE'),leaf('恢復灌流後才補自由水','SFE')),
   group('意識改變／抽搐',['KJIM'],leaf('依症狀與發生時間決定速度','KJIM')),
   group('已知AVP-D＋高血鈉',['SFE'],leaf('level 2–3照護','SFE'),leaf('盡快聯絡內分泌團隊','SFE'))),
  group('移除原因',[],
   leaf('停lactulose、利尿劑、致病藥物','KJIM'),leaf('控制腸胃流失、發燒、高血糖','KJIM'),leaf('解除阻塞；矯正低血鉀、高血鈣','KJIM'),leaf('停高張灌食與鈉來源','KJIM')),
  group('矯正速度',[],
   group('慢性或時間不明',['SFE','AAFP','KJIM'],leaf('≤0.5 mmol/L/h','SFE','KJIM'),leaf('24小時上限：SfE 10；AAFP、Yun 12','SFE','AAFP','KJIM'),leaf('避免<0.25 mmol/L/h','KJIM')),
   group('急性有症狀',['SFE'],leaf('第一小時5 mmol/L或至症狀改善','SFE'),leaf('24小時上限10 mmol/L','SFE')),
   group('急性有症狀的鈉負荷',['KJIM','GOSHIMA'],leaf('1–2 mmol/L/h，持續6–8小時','KJIM'),leaf('24小時內回到約145','KJIM','GOSHIMA')),
   group('超過目標',['AAFP','KJIM'],leaf('不要再把Na拉高','AAFP','KJIM'))),
  group('計算水量',[],
   group('總缺水',['KJIM','AAFP'],leaf('TBW×(Na/140−1)','KJIM','AAFP'),leaf('Yun：分48–72小時','KJIM'),leaf('AAFP表格：24小時','AAFP')),
   leaf('TBW：男0.6、女0.5，長者各扣0.05','KJIM'),
   leaf('每日給水＝矯正量＋不顯性＋持續流失','KJIM'),
   leaf('每公升ΔNa＝(輸液Na＋K−血Na)／(TBW＋1)','KJIM')),
  group('選擇輸液',[],
   leaf('低容量且穩定：D5W、0.2%或0.45% NaCl','KJIM'),leaf('正常容量：口服或鼻胃管給水、D5W','KJIM','AAFP'),leaf('高容量：D5W＋利尿劑維持負平衡','KJIM'),leaf('D5W量大可致高血糖與滲透性利尿','FICM'),leaf('含Na或K的輸液，自由水效果較低','KJIM')),
  group('監測調整',[],
   leaf('初期每2–4小時驗Na','STATPEARLS'),leaf('AVP-D：復甦期每4小時，之後至少每12小時','SFE'),leaf('矯正過慢：先查持續流失','KJIM'),leaf('DDAVP後防止矯正過快','SFE')),
  group('病因與特殊情境',[],
   group('AVP-D',['SFE'],leaf('DDAVP IV／IM 1–2 µg','SFE'),leaf('稀釋尿再現才考慮追加','SFE')),
   group('AVP-R',['KJIM','FICM'],leaf('停致病藥','KJIM','FICM'),leaf('amiloride 2.5–10 mg/day','KJIM'),leaf('thiazide：注意鋰濃度','KJIM','FICM')),
   group('長者 >300 mOsm/kg',['ESPEN'],leaf('外觀良好：鼓勵喝水','ESPEN'),leaf('外觀不適：SC／IV＋喝水','ESPEN')),
   group('無法耐受給水',['KDIGO'],leaf('評估RRT，可客製CRRT溶液','KDIGO')),
   group('神經重症',['NCS'],leaf('先確認是否為治療目標','NCS')))
 ]}
};

const FONT=[17,15,14,13],MAX=[10,10,14,17],PAD_X=[16,12,10,9],PAD_Y=[12,8,6,5],GAP_X=46,GAP_Y=8;
const units=ch=>/[\x00-\x7f]/.test(ch)?0.56:1;
export function wrap(text,max){ // Keeps ASCII runs whole, so doses and units do not break mid-token.
 const lines=[];
 for(const part of text.split('\n')){
  let line='',width=0;
  for(const token of part.match(/[\x21-\x7e]+|\s+|[^\x00-\x7f]/g)??[]){
   const w=[...token].reduce((a,c)=>a+units(c),0);
   if(width+w>max&&line.trim()){lines.push(line.trim());line='';width=0;}
   if(!line&&!token.trim())continue;
   line+=token;width+=w;
  }
  if(line.trim())lines.push(line.trim());
 }
 return lines;
}
export function layoutMap(map,collapsed=new Set()){
 const build=(node,id,depth,branch)=>{
  const level=Math.min(depth,3),fs=FONT[level],lines=wrap(depth===1?`${branch+1}. ${node.t}`:node.t,MAX[level]);
  const textW=Math.max(...lines.map(l=>[...l].reduce((a,c)=>a+units(c),0)))*fs;
  const kids=(node.c??[]);
  const out={id,t:node.t,src:node.src??[],depth,branch,fs,lines,w:Math.ceil(textW)+PAD_X[level]*2+(kids.length&&depth?18:0),h:Math.ceil(lines.length*fs*1.35)+PAD_Y[level]*2,hasKids:kids.length>0,collapsed:collapsed.has(id),kids:[]};
  if(!out.collapsed)out.kids=kids.map((k,i)=>build(k,`${id}.${i}`,depth+1,depth===0?i:branch));
  out.span=Math.max(out.h,out.kids.reduce((a,k)=>a+k.span,0)+GAP_Y*Math.max(0,out.kids.length-1));
  return out;
 };
 const root=build(map,'r',0,-1);
 let best=1,bestDiff=Infinity;
 for(let k=1;k<=root.kids.length;k++){
  const a=root.kids.slice(0,k).reduce((s,n)=>s+n.span,0),b=root.kids.slice(k).reduce((s,n)=>s+n.span,0),d=Math.abs(a-b);
  if(d<bestDiff){bestDiff=d;best=k;}
 }
 const sides=[[1,root.kids.slice(0,best)],[-1,root.kids.slice(best)]],nodes=[],links=[];
 root.x=-root.w/2;root.y=-root.h/2;root.side=0;nodes.push(root);
 for(const [side,top] of sides){
  const col=[];
  const measure=n=>{col[n.depth]=Math.max(col[n.depth]??0,n.w);n.kids.forEach(measure);};
  top.forEach(measure);
  const offset=d=>{let x=root.w/2+GAP_X;for(let i=1;i<d;i++)x+=col[i]+GAP_X;return x;};
  const place=(n,top,parent)=>{
   const off=offset(n.depth);
   n.side=side;n.x=side>0?off:-off-n.w;n.y=top+(n.span-n.h)/2;nodes.push(n);links.push({from:parent,to:n,side,branch:n.branch});
   let y=top+(n.span-(n.kids.reduce((a,k)=>a+k.span,0)+GAP_Y*Math.max(0,n.kids.length-1)))/2;
   for(const k of n.kids){place(k,y,n);y+=k.span+GAP_Y*1;}
  };
  const gap=GAP_Y*3,total=top.reduce((a,n)=>a+n.span,0)+gap*Math.max(0,top.length-1);
  let y=-total/2;
  for(const n of top){place(n,y,root);y+=n.span+gap;}
 }
 const pad=14,minX=Math.min(...nodes.map(n=>n.x)),minY=Math.min(...nodes.map(n=>n.y));
 for(const n of nodes){n.x+=pad-minX;n.y+=pad-minY;}
 return {nodes,links,width:Math.max(...nodes.map(n=>n.x+n.w))+pad,height:Math.max(...nodes.map(n=>n.y+n.h))+pad};
}
export function collapsibleIds(map){
 const out=[];
 const walk=(n,id,d)=>{if(n.c?.length){if(d>0)out.push(id);n.c.forEach((k,i)=>walk(k,`${id}.${i}`,d+1));}};
 walk(map,'r',0);
 return out;
}
