(function(){
  const BLOCK_MIN=15, PER_HOUR=60/BLOCK_MIN, HOURS=24, BLOCKS=HOURS*PER_HOUR; // 96
  const START_HOUR=4; // operational day start at 04:00
  const CATS=[
    {id:'sleep', name:'Sleep',  emoji:'🛌', color:'#1f3b73', cls:'cat-sleep'},
    {id:'deep',  name:'Deep Work', emoji:'🚀', color:'#0e7a5f', cls:'cat-deep'},
    {id:'work',  name:'Work',  emoji:'💼', color:'#2563eb', cls:'cat-work'},
    {id:'study', name:'Study', emoji:'📚', color:'#7c3aed', cls:'cat-study'},
    {id:'ex',    name:'Exercise', emoji:'🏃', color:'#dc2626', cls:'cat-ex'},
    {id:'admin', name:'Admin', emoji:'🧾', color:'#6b7280', cls:'cat-admin'},
    {id:'meet',  name:'Meetings', emoji:'🗣️', color:'#f59e0b', cls:'cat-meet'},
    {id:'break', name:'Break', emoji:'☕', color:'#06b6d4', cls:'cat-break'}
  ];
  const els={
    grid:document.getElementById('grid'),
    legend:document.querySelector('.legend'),
    dayTitle:document.getElementById('dayTitle'),
    subtitle:document.getElementById('subtitle'),
    tzBadge:document.getElementById('tzBadge'),
    nowbar:document.getElementById('nowbar'),
    totals:document.getElementById('totals'),
    prevBtn:document.getElementById('prevBtn'),
    todayBtn:document.getElementById('todayBtn'),
    nextBtn:document.getElementById('nextBtn'),
    exportBtn:document.getElementById('exportBtn'),
    importFile:document.getElementById('importFile'),
    clearBtn:document.getElementById('clearBtn'),
    hint:document.getElementById('hint'),
    printBtn:document.getElementById('printBtn')
  };
  let state={
    selectedCat:CATS[1].id, // default Deep Work
    opStart:getOpStart(new Date()),
    data:{} // index -> {cat, note}
  };

  function getOpStart(now){
    const d=new Date(now);
    const start=new Date(d.getFullYear(), d.getMonth(), d.getDate(), START_HOUR, 0, 0, 0);
    if(d < start) start.setDate(start.getDate()-1);
    return start;
  }
  function opKey(dt){ // storage key
    const y=dt.getFullYear(), m=String(dt.getMonth()+1).padStart(2,'0'), da=String(dt.getDate()).padStart(2,'0');
    return `schedule-v2-${y}-${m}-${da}@${String(START_HOUR).padStart(2,'0')}`;
  }
  function save(){
    localStorage.setItem(opKey(state.opStart), JSON.stringify(state.data));
    updateTotals();
  }
  function load(){
    const raw=localStorage.getItem(opKey(state.opStart));
    state.data= raw ? JSON.parse(raw) : {};
  }
  function fmtHM(d){
    return d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  }
  function fmtDate(d){
    const day=d.toLocaleDateString([], {weekday:'long', year:'numeric', month:'long', day:'numeric'});
    const next=new Date(d.getTime()+24*60*60*1000);
    const span = `${fmtHM(d)} → ${fmtHM(next)}`;
    return {day, span};
  }
  function buildLegend(){
    const frag=document.createDocumentFragment();
    CATS.forEach(cat=>{
      const b=document.createElement('div');
      b.className='cat';
      b.dataset.cat=cat.id;
      b.innerHTML=`<span class="swatch" style="background:${cat.color}"></span><span>${cat.emoji} ${cat.name}</span>`;
      b.addEventListener('click',()=>{
        state.selectedCat=cat.id;
        document.querySelectorAll('.legend .cat').forEach(x=>x.classList.toggle('active', x.dataset.cat===state.selectedCat));
      });
      frag.appendChild(b);
    });
    els.legend.appendChild(frag);
    // set default active
    document.querySelectorAll('.legend .cat').forEach(x=>x.classList.toggle('active', x.dataset.cat===state.selectedCat));
  }
  function clearGrid(){
    els.grid.innerHTML='';
  }
  function buildGrid(){
    clearGrid();
    // header info
    const {day, span}=fmtDate(state.opStart);
    els.dayTitle.textContent=day;
    els.subtitle.textContent=span + ' (96 × 15-min)';
    els.tzBadge.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local time';
    // blocks
    for(let h=0; h<HOURS; h++){
      const hourStart = new Date(state.opStart.getTime() + h*60*60*1000);
      const hourLabel = document.createElement('div');
      hourLabel.className='hour';
      hourLabel.textContent=hourStart.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
      els.grid.appendChild(hourLabel);
      for(let q=0; q<PER_HOUR; q++){
        const idx = h*PER_HOUR + q;
        const start = new Date(state.opStart.getTime() + idx*BLOCK_MIN*60*1000);
        const end   = new Date(start.getTime() + BLOCK_MIN*60*1000);
        const cell=document.createElement('div');
        cell.className='block future';
        cell.tabIndex=0;
        cell.dataset.index=idx;
        cell.dataset.startISO=start.toISOString();
        cell.title = `${fmtHM(start)} – ${fmtHM(end)}`;
        cell.innerHTML = `<div class="fill"></div><div class="timebadge">${fmtHM(start)}</div><div class="label"></div>`;
        cell.addEventListener('click', onAssign);
        cell.addEventListener('dblclick', onNote);
        cell.addEventListener('keydown', (e)=>{
          if(e.key==='Delete'){ clearCell(cell); e.preventDefault(); }
          if(e.key==='Enter'){ onNote(e); e.preventDefault(); }
        });
        els.grid.appendChild(cell);
      }
    }
    // apply saved state and time shading
    applyState();
    updateNowDecorations();
    updateTotals();
  }
  function getCatById(id){ return CATS.find(c=>c.id===id); }

  function setCellCat(cell, catId){
    cell.classList.remove(...Array.from(cell.classList).filter(c=>c.startsWith('cat-')));
    const noteEl=cell.querySelector('.label');
    if(!catId){
      delete state.data[cell.dataset.index];
      noteEl.textContent='';
      cell.classList.remove('has-note');
    }else{
      const cat = getCatById(catId);
      cell.classList.add(cat.cls);
      state.data[cell.dataset.index] = state.data[cell.dataset.index] || {};
      state.data[cell.dataset.index].cat = catId;
    }
  }
  function setCellNote(cell, text){
    const i = cell.dataset.index;
    const noteEl = cell.querySelector('.label');
    if(text && text.trim().length){
      state.data[i] = state.data[i] || {};
      state.data[i].note = text.trim();
      noteEl.textContent = state.data[i].note;
      cell.classList.add('has-note');
    }else{
      if(state.data[i]) delete state.data[i].note;
      noteEl.textContent = '';
      cell.classList.remove('has-note');
    }
  }
  function clearCell(cell){
    setCellCat(cell, null);
    setCellNote(cell, '');
    cell.classList.remove('cat-sleep','cat-deep','cat-work','cat-study','cat-ex','cat-admin','cat-meet','cat-break');
    save();
    updateTotals();
  }
  function onAssign(e){
    const cell=e.currentTarget;
    if(e.shiftKey){ clearCell(cell); return; }
    setCellCat(cell, state.selectedCat);
    // set a short default note when first assigned? Keep empty to stay fast.
    save();
    updateTotals();
  }
  function onNote(e){
    const cell=e.currentTarget;
    const curr = (state.data[cell.dataset.index]?.note) || '';
    const txt = prompt('Note for this 15-minute block:', curr);
    if(txt===null) return;
    setCellNote(cell, txt);
    save();
  }

  function applyState(){
    Object.entries(state.data).forEach(([idx, val])=>{
      const cell = els.grid.querySelector(`.block[data-index="${idx}"]`);
      if(!cell) return;
      if(val.cat) setCellCat(cell, val.cat);
      if(val.note) setCellNote(cell, val.note);
    });
  }
  function nowIndexFor(start, now){
    const delta = now - start;
    if(delta < 0) return -1;
    const idx = Math.floor(delta / (BLOCK_MIN*60*1000));
    return idx >= BLOCKS ? -1 : idx;
  }
  function updateNowDecorations(){
    const now=new Date();
    // progress bar across operational day
    const p = Math.max(0, Math.min(1, (now - state.opStart) / (24*60*60*1000)));
    if(els.nowbar) els.nowbar.style.width = (p*100).toFixed(2) + '%';

    const idx = nowIndexFor(state.opStart, now);
    const cells = els.grid.querySelectorAll('.block');
    cells.forEach(c=>{
      const i = Number(c.dataset.index);
      c.classList.remove('past','current','future');
      if(idx === -1){ // outside day, mark future if before, past if after
        if(now < state.opStart) c.classList.add('future'); else c.classList.add('past');
      }else{
        if(i < idx) c.classList.add('past');
        else if(i === idx) c.classList.add('current');
        else c.classList.add('future');
      }
    });
  }
  function updateTotals(){
    const totals = {};
    Object.keys(state.data).forEach(k=>{
      const c = state.data[k].cat;
      if(!c) return;
      totals[c] = (totals[c]||0) + 1; // blocks
    });
    els.totals.innerHTML='';
    const frag = document.createDocumentFragment();
    CATS.forEach(cat=>{
      const count = totals[cat.id]||0;
      if(count===0) return;
      const chip = document.createElement('div');
      chip.className='total-chip';
      const hours = (count*BLOCK_MIN/60).toFixed(count%4===0?0:2);
      chip.innerHTML = `<span class="swatch" style="background:${cat.color}"></span><span>${cat.emoji} ${cat.name}</span><span>${hours}h</span>`;
      frag.appendChild(chip);
    });
    els.totals.appendChild(frag);
  }

  function openPrintView(){
    const printData = {
      opStart: state.opStart.toISOString(),
      data: state.data,
      dayInfo: fmtDate(state.opStart)
    };
    // Store data in localStorage for the print page
    localStorage.setItem('aktimetable-print-data', JSON.stringify(printData));
    
    const printUrl = 'print.html';
    const printWindow = window.open(printUrl, '_blank');
    
    // Also try postMessage as fallback
    if(printWindow){
      const checkLoaded = () => {
        try {
          if(printWindow.document.readyState === 'complete') {
            printWindow.postMessage(printData, '*');
          } else {
            setTimeout(checkLoaded, 100);
          }
        } catch(e) {
          // Cross-origin or other error, data should be available via localStorage
        }
      };
      setTimeout(checkLoaded, 100);
    }
  }

  // navigation
  els.prevBtn.addEventListener('click', ()=>{
    state.opStart = new Date(state.opStart.getTime() - 24*60*60*1000);
    load(); buildGrid(); save();
  });
  els.todayBtn.addEventListener('click', ()=>{
    state.opStart = getOpStart(new Date());
    load(); buildGrid();
  });
  els.nextBtn.addEventListener('click', ()=>{
    state.opStart = new Date(state.opStart.getTime() + 24*60*60*1000);
    load(); buildGrid(); save();
  });

  // export/import/clear/print
  els.exportBtn.addEventListener('click', ()=>{
    const payload = {
      version:2,
      opStartISO: state.opStart.toISOString(),
      startHour: START_HOUR,
      blockMinutes: BLOCK_MIN,
      data: state.data
    };
    const blob=new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    const {day}=fmtDate(state.opStart);
    a.download = `plan_${day.replaceAll(' ','_')}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });
  els.importFile.addEventListener('change', async (e)=>{
    const file = e.target.files?.[0]; if(!file) return;
    try{
      const txt = await file.text();
      const json = JSON.parse(txt);
      if(!json || typeof json!=='object') throw new Error('Invalid file');
      if(json.opStartISO){
        state.opStart = new Date(json.opStartISO);
      }
      state.data = json.data || {};
      buildGrid(); save();
    }catch(err){
      alert('Import failed: ' + err.message);
    }finally{
      e.target.value='';
    }
  });
  els.clearBtn.addEventListener('click', ()=>{
    if(!confirm('Clear all assignments for this operational day?')) return;
    state.data = {};
    save(); buildGrid();
  });
  if(els.printBtn){
    els.printBtn.addEventListener('click', openPrintView);
  }

  // tick
  setInterval(updateNowDecorations, 15*1000); // smooth enough
  window.addEventListener('visibilitychange', ()=>{ if(!document.hidden) updateNowDecorations(); });

  // init
  buildLegend();
  load();
  buildGrid();

  // Expose state and functions for print page
  window.aktimetableData = {
    CATS, state, fmtDate, fmtHM, BLOCK_MIN, PER_HOUR, HOURS
  };
})();