export const palette={root:'#9eb4d3',actor:'#b3a9c6',doc:'#b0c0d6',fact:'#adc9c1',issue:'#d5c39f',ai:'#9f8bff',group:'#aebed3'};
const pl=(n,f)=>`${n} ${n%10===1&&n%100!==11?f[0]:[2,3,4].includes(n%10)&&![12,13,14].includes(n%100)?f[1]:f[2]}`;
export function createTree(state){
 const people=[...new Set(state.claims.map(c=>c.person).filter(Boolean))];
 const tree={root:{id:'root',title:state.caseTitle||'Дело № 024 / 2026',sub:state.analyzing?'ИИ строит карту дела…':(state.caseDescription||''),type:'root',kind:'ДЕЛО',children:[...(people.length?['people']:[]),'docs','sources',...(state.events?.length?['chrono']:[]),...(state.evidence?.length?['evidence']:[]),...(state.norms?.length?['norms']:[]),...(state.ai||state.aiLive?['ai']:[])]},people:{id:'people',title:'Участники',sub:pl(people.length,['участник','участника','участников']),type:'actor',kind:'РАЗДЕЛ',children:[]},docs:{id:'docs',title:'Документы',sub:'',type:'doc',kind:'РАЗДЕЛ',children:[]},sources:{id:'sources',title:'Источники',sub:'',type:'doc',kind:'РАЗДЕЛ',children:[]},timeline:{id:'timeline',title:'События',sub:'Сведения из материалов дела',type:'fact',kind:'РАЗДЕЛ',children:[]},findings:{id:'findings',title:'Вопросы для проверки',sub:`${state.findings.length} возможных расхождения`,type:'issue',kind:'РАЗДЕЛ',children:[]}};
 function addClaim(c,id){const d=state.documents.find(d=>d.id===c.docId);tree[id]={id,title:c.text,sub:c.time?`${c.time} · ${c.person}`:c.person,type:'fact',kind:'СВЕДЕНИЯ ИЗ ДОКУМЕНТА',claim:c,children:[]};if(d){const source=id+':source';tree[id].children=[source];tree[source]={id:source,title:d.name,sub:'Источник цитаты',type:'doc',kind:'ИСТОЧНИК',document:d,children:[]}}}
 people.forEach((p,i)=>{const id='person:'+i;tree.people.children.push(id);tree[id]={id,title:p,sub:(state.people||[]).find(x=>x.name===p)?.role||'Участник',type:'actor',kind:'УЧАСТНИК',person:p,children:[]}});
 const uploaded=Array.isArray(state.docs);
 const addFile=(d,inDocs)=>{const id='doc:'+d.id;if(inDocs)tree.docs.children.push(id);else tree.sources.children.push(id);tree[id]={id,title:d.name,sub:d.type||'Загруженный файл',type:'doc',kind:inDocs?'ДОКУМЕНТ':'ИСТОЧНИК',document:d,children:[]};const fragments=(state.fragments||[]).filter(f=>f.docId===d.id);fragments.forEach((f,i)=>{let parent=id;if(fragments.length>8){const group=id+':block:'+Math.floor(i/8);if(!tree[group]){const start=Math.floor(i/8)*8;tree[group]={id:group,title:`${start+1}–${Math.min(start+8,fragments.length)} — фрагменты`,sub:'Фрагменты текста',type:'doc',kind:'РАЗДЕЛ ТЕКСТА',children:[]};tree[id].children.push(group)}parent=group}const fid=id+':fragment:'+i;tree[parent].children.push(fid);tree[fid]={id:fid,title:f.text.replace(/\s+/g,' ').slice(0,85)+(f.text.length>85?'…':''),sub:`${i+1}-й фрагмент`,type:'fact',kind:'ФРАГМЕНТ',fragment:f,children:[]}})};
 if(uploaded){
  state.documents.forEach(d=>addFile(d,false));
  tree['src-add']={id:'src-add',title:'+ Добавить источник',sub:'Файл TXT или MD',type:'doc',kind:'ДЕЙСТВИЕ',children:[]};tree.sources.children.push('src-add');
  state.docs.forEach(l=>{const id='ldoc:'+l.id;tree.docs.children.push(id);tree[id]={id,title:l.title,sub:l.kind||'Документ',type:'doc',kind:'ДОКУМЕНТ',ldoc:l,children:[]}});
  tree.sources.sub=pl(state.documents.length,['источник','источника','источников']);
 }else{
  state.documents.forEach(d=>addFile(d,true));
  (state.people||[]).filter(p=>p.photo).forEach((p,i)=>{const id='pdoc:'+i;tree.docs.children.push(id);tree[id]={id,title:'Паспорт: '+p.name,sub:'Документ лица',type:'doc',kind:'ДОКУМЕНТ ЛИЦА',pdoc:p,children:[]}});
  (state.sources||[]).forEach(s=>{const id='src:'+s.id;tree.sources.children.push(id);tree[id]={id,title:s.name,sub:s.kind,type:'doc',kind:'ИСТОЧНИК',source:s,children:[]}});
  tree.sources.sub=pl((state.sources||state.documents).length,['источник','источника','источников']);
 }
 tree.docs.sub=pl(tree.docs.children.length,['документ','документа','документов']);
 if(state.events?.length){
  tree.timeline.sub='Что произошло и на каких источниках основано';
  tree.chrono={chain:true,id:'chrono',title:'Хронология',sub:pl(state.events.length,['событие','события','событий'])+' по порядку',type:'fact',kind:'РАЗДЕЛ',children:[]};
  state.events.forEach((event,i)=>{const cid='chrono:'+event.id;tree.chrono.children.push(cid);tree[cid]={id:cid,title:event.title,sub:event.time,type:'fact',kind:'СОБЫТИЕ '+(i+1),event,children:[]}});
  state.events.forEach(event=>{const id='event:'+event.id;tree.timeline.children.push(id);tree[id]={id,title:event.title,sub:event.time,type:'fact',kind:'СОБЫТИЕ',event,children:[]};
  });
 }else{
  [...state.claims].filter(c=>c.time).sort((a,b)=>a.time.localeCompare(b.time)).forEach(c=>{const id='time:'+c.id;tree.timeline.children.push(id);addClaim(c,id)});
 }
 if(state.evidence?.length){tree.evidence={id:'evidence',title:'Доказательства',sub:pl(state.evidence.length,['материал','материала','материалов']),type:'issue',kind:'РАЗДЕЛ',children:[]};state.evidence.forEach(v=>{const id='evidence:'+v.id;tree.evidence.children.push(id);tree[id]={id,title:v.title,sub:v.sub||'Доказательство',type:'issue',kind:'ДОКАЗАТЕЛЬСТВО',evidence:v,children:[]}})}
 if(state.norms?.length){tree.norms={id:'norms',title:'Нормы права',sub:pl(state.norms.length,['норма','нормы','норм']),type:'group',kind:'РАЗДЕЛ',children:[]};state.norms.forEach(n=>{const id='norm:'+n.id;tree.norms.children.push(id);tree[id]={id,title:n.title,sub:n.ref,type:'group',kind:'НОРМА ПРАВА',norm:n,children:[]}})}
 if(state.ai||state.aiLive){tree.ai={id:'ai',title:'ИИ-юрист',sub:'Разбор дела и чат',type:'ai',kind:'ИИ',children:[]}}
 state.findings.forEach(f=>{const id='finding:'+f.id;tree.findings.children.push(id);tree[id]={id,title:f.title,sub:'Сопоставить источники',type:'issue',kind:'ВОЗМОЖНОЕ РАСХОЖДЕНИЕ',finding:f,children:[]};f.claimIds.map(id=>state.claims.find(c=>c.id===id)).filter(Boolean).forEach(c=>{const cid=id+':'+c.id;tree[id].children.push(cid);addClaim(c,cid)})});return tree;
}
export function layout(tree,opened){
 const nodes=[],edges=[],H=122,GAP=150,STEP=336;let cursor=0;
 function walk(id,depth,dir){const d=tree[id];if(!d)return;const children=opened.has(id)?d.children:[];const cn=children.map(ch=>walk(ch,depth+1,dir)).filter(Boolean);const y=cn.length?(cn[0].y+cn.at(-1).y)/2:cursor++*GAP;const n={...d,x:dir>0?depth*STEP:-depth*STEP+24,y,width:244,height:H};nodes.push(n);if(d.chain&&cn.length){edges.push([n,cn[0]]);cn.slice(1).forEach((c,k)=>edges.push([cn[k],c,'chain']))}else cn.forEach(c=>edges.push([n,c]));return n}
 const rootD=tree.root,kids=opened.has('root')?rootD.children:[];
 const half=Math.ceil(kids.length/2),rightIds=kids.slice(0,half),leftIds=kids.slice(half);
 const group=(ids,dir)=>{cursor=0;const start=nodes.length;const tops=ids.map(i=>walk(i,1,dir)).filter(Boolean);const mine=nodes.slice(start);if(!mine.length)return {tops,mine,c:0,h:0};const lo=Math.min(...mine.map(n=>n.y)),hi=Math.max(...mine.map(n=>n.y+H));return {tops,mine,c:(lo+hi)/2,h:hi-lo}};
 const R=group(rightIds,1),L=group(leftIds,-1);
 const C=Math.max(R.h,L.h,H)/2;
 for(const g of [R,L])if(g.mine.length){const s=C-g.c;g.mine.forEach(n=>{n.y+=s})}
 const root={...rootD,x:0,y:C-H/2,width:268,height:H};nodes.push(root);
 [...R.tops,...L.tops].forEach(t=>edges.push([root,t]));
 const minX=Math.min(...nodes.map(n=>n.x)),minY=Math.min(...nodes.map(n=>n.y));
 nodes.forEach(n=>{n.x-=minX;n.y-=minY});
 return {nodes,edges,width:Math.max(...nodes.map(n=>n.x+n.width)),height:Math.max(...nodes.map(n=>n.y+n.height))};
}
