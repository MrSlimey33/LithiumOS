import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Calculator, FileText, Settings, Store, CloudSun, Camera, Wifi, Battery, Search, Lock, Mic, Image as ImageIcon, MessageSquare, Clock, Music, Terminal, Shield, Activity, LocateFixed, Radio, Box, Globe, Cpu, Palette, Navigation, Zap, Plus, ChevronRight, Share, Trash, Folder } from 'lucide-react';

const REG = {
  camera: { n: 'Lens', ic: Camera, c: 'bg-rose-50 text-rose-600', d: 0 },
  photos: { n: 'Gallery', ic: ImageIcon, c: 'bg-blue-50 text-blue-600', d: 0 },
  terminal: { n: 'Console', ic: Terminal, c: 'bg-slate-800 text-slate-100', d: 0 },
  media: { n: 'Synthesia', ic: Music, c: 'bg-emerald-50 text-emerald-600', d: 0 },
  browser: { n: 'Nexus', ic: Globe, c: 'bg-indigo-50 text-indigo-600', d: 0 },
  notes: { n: 'Notes', ic: FileText, c: 'bg-yellow-50 text-yellow-600', d: 0 },
  calc: { n: 'Compute', ic: Calculator, c: 'bg-amber-50 text-amber-600', d: 0 },
  clock: { n: 'Chrono', ic: Clock, c: 'bg-stone-50 text-stone-600', d: 0 },
  vault: { n: 'Vault', ic: Shield, c: 'bg-red-50 text-red-600', d: 0 },
  weather: { n: 'Atmo', ic: CloudSun, c: 'bg-sky-50 text-sky-600', d: 1 },
  cpu: { n: 'Metrics', ic: Activity, c: 'bg-teal-50 text-teal-600', d: 1 },
  canvas: { n: 'Canvas', ic: Palette, c: 'bg-fuchsia-50 text-fuchsia-600', d: 1 },
  memos: { n: 'Voice', ic: Mic, c: 'bg-orange-50 text-orange-600', d: 1 },
  store: { n: 'Market', ic: Store, c: 'bg-cyan-50 text-cyan-600', d: 0 },
  settings: { n: 'System', ic: Settings, c: 'bg-slate-100 text-slate-700', d: 0 },
  radar: { n: 'Radar', ic: LocateFixed, c: 'bg-emerald-50 text-emerald-600', d: 1 },
};

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const playSound = (t, e) => {
  if (e?.target?.closest('input') || audioCtx.state === 'suspended') return;
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination);
  if (t === 'click') { o.type='sine'; o.frequency.setValueAtTime(800, audioCtx.currentTime); o.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime+0.05); g.gain.setValueAtTime(0.05, audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime+0.05); o.start(); o.stop(audioCtx.currentTime+0.05); }
};

function useVDisk(key, init) {
  const [v, setV] = useState(() => { try { const item = window.localStorage.getItem('LITHIUM_' + key); return item ? JSON.parse(item) : init; } catch { return init; } });
  const setVal = (val) => { try { const valToStore = val instanceof Function ? val(v) : val; setV(valToStore); window.localStorage.setItem('LITHIUM_' + key, JSON.stringify(valToStore)); } catch(e){ console.error(e); } };
  return [v, setVal];
}

// --- WINDOW MANAGER ---
function Window({ w, focus, close, min, max, children }) {
  const [pos, setPos] = useState({ x: w.x, y: w.y });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  
  const startDrag = (e) => { focus(w.id); if (w.max) return; setDragging(true); offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }; };
  const onDrag = useCallback((e) => { 
    if (!dragging) return;
    const cw = window.innerWidth, ch = window.innerHeight;
    setPos({ x: Math.max(-w.w/2, Math.min(e.clientX - offset.current.x, cw - 50)), y: Math.max(28, Math.min(e.clientY - offset.current.y, ch - 80)) });
  }, [dragging, w.w]);
  
  const endDrag = useCallback(() => setDragging(false), []);
  useEffect(() => { if (dragging) { window.addEventListener('mousemove', onDrag); window.addEventListener('mouseup', endDrag); return () => { window.removeEventListener('mousemove', onDrag); window.removeEventListener('mouseup', endDrag); }; } }, [dragging, onDrag, endDrag]);
  
  if (w.min) return null;
  const Ic = w.ic;
  return (
    <div className="absolute bg-white/85 backdrop-blur-3xl shadow-[0_30px_80px_rgba(0,0,0,0.15)] border border-white flex flex-col overflow-hidden transition-all duration-300 rounded-2xl will-change-[width,height,left,top]" style={{ left: w.max ? 0 : pos.x, top: w.max ? 28 : pos.y, width: w.max ? '100%' : w.w, height: w.max ? 'calc(100% - 28px)' : w.h, zIndex: w.z, transitionProperty: dragging ? 'none' : 'width, height, left, top' }} onMouseDown={() => focus(w.id)}>
      <div className="h-12 bg-gradient-to-b from-white/90 to-white/40 border-b border-slate-200/50 flex items-center justify-between px-4 cursor-move shrink-0" onMouseDown={startDrag}>
        <div className="flex gap-2">
           <button onClick={(e)=>{e.stopPropagation(); close(w.id)}} className="w-3.5 h-3.5 rounded-full bg-rose-400 border border-rose-500 shadow-sm hover:bg-rose-500 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity" />
           <button onClick={(e)=>{e.stopPropagation(); min(w.id)}} className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-500 shadow-sm hover:bg-amber-500 opacity-80 hover:opacity-100 transition-opacity" />
           <button onClick={(e)=>{e.stopPropagation(); max(w.id)}} className="w-3.5 h-3.5 rounded-full bg-emerald-400 border border-emerald-500 shadow-sm hover:bg-emerald-500 opacity-80 hover:opacity-100 transition-opacity" />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 text-slate-600 font-semibold tracking-wide text-xs flex items-center gap-2"><Ic size={14}/> {REG[w.id].n}</div>
        <div className="w-12"/>
      </div>
      <div className="flex-1 overflow-hidden relative bg-white/50" onMouseDown={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

// --- CORE APPS ---
function DynamicApp({ app }) {
  const Ic = app.ic;
  return <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-slate-400 p-8 text-center shadow-inner"><Ic size={64} className="mb-6 text-slate-200 opacity-50 drop-shadow-md" /><p className="font-semibold text-xl text-slate-700">{app.n} Disabled</p><p className="text-sm mt-3 opacity-70 max-w-xs">This module requires further dependencies. Install via Market to initialize the logic core.</p></div>;
}

function SettingsApp({ ins, un, lock }) {
  return (
    <div className="w-full h-full bg-slate-50/80 text-slate-800 p-6 overflow-y-auto font-sans">
      <h2 className="text-3xl font-bold mb-8 tracking-tight flex items-center gap-3"><Settings className="text-slate-400"/> Preferences</h2>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8 flex items-center gap-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100 rounded-full blur-3xl -z-10 opacity-50" />
         <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-50 to-white flex items-center justify-center shrink-0 border border-rose-100 shadow-sm"><Cpu size={40} className="text-rose-400"/></div>
         <div><h3 className="font-bold text-2xl text-slate-900">Lithium Station</h3><p className="text-slate-500 font-medium">Kernel v4.2.1 • Memory 16GB</p></div>
      </div>
      <button onClick={(e)=>{playSound('click',e);lock()}} className="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold tracking-wide shadow-xl shadow-slate-900/10 hover:-translate-y-1 hover:shadow-slate-900/20 active:scale-[0.98] transition-all mb-10">Lock Workstation</button>
      <div className="mb-4 text-sm font-bold tracking-widest text-slate-400 uppercase">Installed Modules</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ins.map(id => {
          if (REG[id]?.d !== 1) return null;
          const Ic = REG[id].ic;
          return (
          <div key={id} className="bg-white rounded-2xl p-4 flex justify-between items-center shadow-sm border border-slate-100 hover:border-slate-300 transition-colors">
            <span className="font-semibold text-slate-700 flex items-center gap-3"><div className={`w-8 h-8 rounded-full flex items-center justify-center ${REG[id].c}`}><Ic size={16}/></div>{REG[id].n}</span>
            <button onClick={(e)=>{playSound('click',e); un(id)}} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 active:scale-95 transition-transform">Delete</button>
          </div>
          );
        })}
      </div>
    </div>
  );
}

function StoreApp({ ins, setIns, shake }) {
  return (
    <div className="w-full h-full bg-slate-50 text-slate-800 flex flex-col p-8">
      <h2 className="text-3xl font-bold mb-8 tracking-tight flex items-center gap-3"><Store className="text-indigo-400"/> Market</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto px-1 pb-10">
        {Object.keys(REG).filter(k => REG[k].d === 1 && !ins.includes(k)).map(id => {
          const Ic = REG[id].ic;
          return (
          <div key={id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center gap-3 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all">
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${REG[id].c} shadow-inner bg-opacity-50`}><Ic size={32}/></div>
            <span className="font-bold text-slate-700">{REG[id].n}</span>
            <button onClick={(e)=>{playSound('click',e); setIns([...ins, id]); shake();}} className="mt-3 text-xs font-bold tracking-widest bg-slate-900 text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition-colors active:scale-95 shadow-md">GET</button>
          </div>
          );
        })}
        {Object.keys(REG).filter(k => REG[k].d === 1 && !ins.includes(k)).length === 0 && <div className="col-span-full h-full flex flex-col items-center justify-center text-slate-400 font-medium"><Zap size={48} className="mb-4 opacity-50"/>All modules acquired!</div>}
      </div>
    </div>
  );
}

function NotesApp() {
  const [notes, setNotes] = useVDisk('notes_db', [{id:1, title:'lithium.doc', text:'Welcome to Lithium Station.\nEdit me!'}]);
  const [sel, setSel] = useState(1);
  const cur = notes.find(n=>n.id===sel) || notes[0];
  const update = (t) => setNotes(notes.map(n=>n.id===sel ? {...n, text:t} : n));
  const mkNew = () => { const id=Date.now(); setNotes([...notes, {id, title:'untitled', text:''}]); setSel(id); };
  return (
    <div className="w-full h-full bg-white flex h-full">
       <div className="w-64 bg-slate-50 border-r border-slate-100 flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center"><span className="font-bold text-slate-400 tracking-wider text-xs">ALL NOTES</span><button onClick={mkNew} className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors"><Plus size={16}/></button></div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
             {notes.map(n=>(<div key={n.id} onClick={()=>setSel(n.id)} className={`p-3 rounded-lg cursor-pointer text-sm font-semibold truncate transition-colors ${sel===n.id?'bg-amber-100 text-amber-800':'hover:bg-slate-100 text-slate-600'}`}>{n.title||'untitled'}</div>))}
          </div>
       </div>
       <div className="flex-1 flex flex-col relative px-8 py-6">
          <input value={cur?.title} onChange={e=>setNotes(notes.map(n=>n.id===sel?{...n,title:e.target.value}:n))} className="text-3xl font-bold text-slate-800 outline-none placeholder-slate-300 bg-transparent mb-6 transition-colors focus:text-slate-950" placeholder="Title..." />
          <textarea value={cur?.text} onChange={e=>update(e.target.value)} className="flex-1 resize-none bg-transparent outline-none text-slate-600 text-base leading-relaxed placeholder-slate-200 font-serif" placeholder="Start typing here..."/>
       </div>
    </div>
  );
}

function CanvasApp() {
  const cRef = useRef(null); const ctxRef = useRef(null); const [md, setMd] = useState(false);
  const [color, setColor] = useState('#f43f5e');
  useEffect(()=>{if(cRef.current){const c=cRef.current; c.width=c.offsetWidth; c.height=c.offsetHeight; ctxRef.current=c.getContext('2d');}},[]);
  const draw = (e)=>{if(!md||!ctxRef.current)return; const ctx=ctxRef.current; const r=cRef.current.getBoundingClientRect(); ctx.fillStyle=color; ctx.beginPath(); ctx.arc(e.clientX-r.left, e.clientY-r.top, 4, 0, Math.PI*2); ctx.fill();};
  return (
    <div className="w-full h-full bg-white flex flex-col relative">
       <div className="h-14 border-b border-slate-100 flex items-center px-4 gap-2 bg-slate-50 shadow-sm z-10">
          {['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#1e293b'].map(c=>(<div key={c} onClick={()=>setColor(c)} className={`w-8 h-8 rounded-full cursor-pointer border-[3px] shadow-sm transition-transform hover:scale-110 active:scale-95 ${color===c?'border-white ring-2 ring-slate-400 scale-110':'border-transparent'}`} style={{background:c}}/>))}
          <div className="mx-2 w-px h-6 bg-slate-200" />
          <button onClick={()=>{ctxRef.current?.clearRect(0,0,cRef.current.width,cRef.current.height)}} className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1 bg-white rounded-md border border-slate-200 shadow-sm active:bg-slate-100 transition-colors">CLEAR</button>
       </div>
       <canvas ref={cRef} onMouseDown={()=>setMd(true)} onMouseUp={()=>setMd(false)} onMouseLeave={()=>setMd(false)} onMouseMove={draw} className="flex-1 w-full bg-white cursor-crosshair" />
    </div>
  );
}

function MediaApp() {
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00]; 
  const [grid, setGrid] = useState(Array(6).fill().map(()=>Array(16).fill(false)));
  
  useEffect(()=>{
     let t;
     if (playing) { t = setInterval(()=>{ setStep(s=>(s+1)%16); }, 200); }
     return ()=>clearInterval(t);
  }, [playing]);

  useEffect(()=>{
     if (playing && audioCtx.state !== 'suspended') {
       grid.forEach((row, i) => {
         if(row[step]){
            const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.type='sine'; osc.frequency.value = notes[i];
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime+0.5);
            osc.start(); osc.stop(audioCtx.currentTime+0.5);
         }
       });
     }
  }, [step, playing, grid]); // eslint-disable-line

  const toggle = (r,c)=>{const ng=[...grid]; ng[r][c]=!ng[r][c]; setGrid(ng); if(ng[r][c])playSound('click',{});};
  
  return (
    <div className="w-full h-full bg-slate-900 text-slate-200 p-8 flex flex-col font-mono select-none overflow-y-auto">
       <div className="flex justify-between items-center mb-8">
          <div><h2 className="text-2xl font-bold text-white tracking-widest uppercase">Synthesia 4.0</h2><p className="text-emerald-400 text-xs mt-1">16-Step Audio Sequencer</p></div>
          <button onClick={()=>{setPlaying(!playing); if(audioCtx.state==='suspended')audioCtx.resume();}} className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${playing?'bg-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.4)]':'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]'}`}>
             {playing ? <Box size={24} className="text-white"/> : <Play size={24} className="text-white ml-1"/>}
          </button>
       </div>
       <div className="flex-1 flex flex-col gap-2">
         {grid.map((r,i)=>(
            <div key={i} className="flex gap-2">
               {r.map((v,j)=>(
                 <div key={j} onClick={()=>toggle(i,j)} className={`flex-1 aspect-[2/1] rounded-md border transition-all duration-75 cursor-pointer ${v?'bg-emerald-400 border-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.5)]':'bg-slate-800 border-slate-700 hover:bg-slate-700'} ${j===step&&playing?'ring-2 ring-white scale-110 z-10':''}`} />
               ))}
            </div>
         ))}
       </div>
    </div>
  );
}

function VaultApp() {
  const [keys] = useState(() => { const arr=[]; for(let i=0;i<window.localStorage.length;i++){ if(window.localStorage.key(i).startsWith('LITHIUM_')) arr.push(window.localStorage.key(i)); } return arr; });
  return (
    <div className="w-full h-full bg-white flex flex-col p-6">
       <div className="mb-6"><h2 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3"><Folder className="text-blue-500" size={32}/> VDisk Vault</h2><p className="text-slate-500 mt-1">Local Sandboxed Sandbox</p></div>
       <div className="grid grid-cols-3 gap-6">
         {keys.length===0 && <p className="col-span-3 text-slate-400 font-medium">No storage volumes found.</p>}
         {keys.map(k=>(
           <div key={k} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow">
             <Database size={24} className="text-slate-400" />
             <span className="font-semibold text-sm truncate text-slate-700">{k.replace('LITHIUM_','')}</span>
             <span className="text-xs text-slate-400 font-mono">{(window.localStorage.getItem(k).length/1024).toFixed(2)} KB</span>
           </div>
         ))}
       </div>
    </div>
  );
}

// Minimal versions of other apps...
function TerminalApp() {
  const [log, setLog] = useState(["> Lithium OS Kernel loaded.", "> Run 'help' for commands."]);
  const [inp, setInp] = useState('');
  const run = (e) => {
    if (e.key === 'Enter' && inp) {
      playSound('click', e); let res = `> ${inp}`;
      if(inp === 'clear') setLog([]); 
      else if(inp === 'help') setLog([...log, res, "Commands: clear, help, date, whoami"]);
      else if(inp === 'date') setLog([...log, res, new Date().toString()]);
      else if(inp === 'whoami') setLog([...log, res, "root@lithium"]);
      else { try { res += `\n< ${String(new Function('return ' + inp)())}`; } catch(err) { res += `\n< Err: ${err.message}`; } setLog([...log, res]); }
      setInp('');
    }
  };
  return (
    <div className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-[13px] p-4 flex flex-col">
      <div className="flex-1 overflow-y-auto whitespace-pre-wrap flex flex-col justify-end space-y-2 mb-2">
        {log.map((l,i) => <div key={i}>{l}</div>)}
      </div>
      <div className="flex border-t border-[#333] pt-2"><span className="mr-3 pl-1 text-emerald-400 font-bold">$</span><input autoFocus value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={run} className="flex-1 bg-transparent outline-none text-[#d4d4d4]" spellCheck="false" /></div>
    </div>
  );
}

function CalculatorApp() {
  const [calc, setCalc] = useState('0');
  const press = (b,e) => { playSound('click',e); if(b==='C')setCalc('0'); else if(b==='=')try{setCalc(String(new Function('return '+calc)()))}catch{setCalc('ERR')} else setCalc(calc==='0'||calc==='ERR'?b:calc+b); };
  return (
    <div className="w-full h-full bg-slate-50 flex flex-col p-4 font-sans select-none">
      <div className="bg-white rounded-2xl mb-4 flex-1 flex flex-col justify-end p-6 text-right border border-slate-200 shadow-inner overflow-hidden flex-shrink-0 min-h-[120px]">
         <span className="text-5xl font-light text-slate-800 tracking-tighter break-all">{calc}</span>
      </div>
      <div className="grid grid-cols-4 gap-3 text-xl font-medium h-64 shrink-0">
         {['C','/','*','-','7','8','9','+','4','5','6','=','1','2','3','0'].map(b => (
           <button key={b} onClick={(e)=>press(b,e)} className={`rounded-xl shadow-sm border border-slate-200 active:scale-90 transition-transform ${b==='='?'row-span-2 bg-rose-500 text-white border-rose-600':b==='C'?'bg-slate-200 text-rose-500':b==='0'?'col-span-3':'bg-white hover:bg-slate-50 text-slate-700'}`}>{b}</button>
         ))}
      </div>
    </div>
  );
}

function ClockApp() {
  const [t, setT] = useState(new Date()); useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
  return (
    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center relative shadow-inner">
       <div className="w-64 h-64 rounded-full relative flex items-center justify-center bg-slate-800 border-8 border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
         <div className="absolute w-2 h-20 bg-white rounded-full origin-bottom" style={{ transform: `translateY(-50%) rotate(${t.getHours()*30 + t.getMinutes()*0.5}deg)` }} />
         <div className="absolute w-1.5 h-28 bg-slate-300 rounded-full origin-bottom" style={{ transform: `translateY(-50%) rotate(${t.getMinutes()*6}deg)` }} />
         <div className="absolute w-0.5 h-32 bg-rose-500 rounded-full origin-bottom" style={{ transform: `translateY(-50%) rotate(${t.getSeconds()*6}deg)` }} />
         <div className="absolute w-4 h-4 bg-rose-500 rounded-full z-10 border-4 border-slate-900"/>
         {[...Array(12)].map((_,i)=><div key={i} className="absolute w-1 h-3 bg-slate-500 rounded-full" style={{transform:`rotate(${i*30}deg) translateY(-110px)`}}/>)}
       </div>
    </div>
  );
}

export default function LithiumOS() {
  const [time, setTime] = useState(new Date());
  const [locked, setLocked] = useState(false);
  const [wins, setWins] = useState([]);
  const [apps, setApps] = useVDisk('apps_core', Object.keys(REG).slice(0, 9));
  const [startOpen, setStartOpen] = useState(false);
  const [q, setQ] = useState('');
  
  // Custom context menu state
  const [ctxMenu, setCtxMenu] = useState({show:false, x:0, y:0, type:null, id:null});

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  
  const focusApp = useCallback((id) => setWins(ws => ws.map(w => w.id === id ? { ...w, z: Date.now(), min: false } : w).sort((a,b)=>a.z-b.z)), []);
  const launchApp = useCallback((id, e) => {
    if(e) playSound('click', e);
    setWins(ws => {
      const ex = ws.find(w => w.id === id);
      if (ex) return ws.map(w => w.id === id ? { ...w, z: Date.now(), min: false } : w).sort((a,b)=>a.z-b.z);
      return [...ws, { id, ic: REG[id].ic, z: Date.now(), min: false, max: false, x: 100 + ws.length*30, y: 100 + ws.length*30, w: Math.min(window.innerWidth-100, 800), h: Math.min(window.innerHeight-100, 550) }];
    });
    setStartOpen(false); setCtxMenu({show:false});
  }, []);
  
  const closeApp = (id) => setWins(ws => ws.filter(w => w.id !== id));
  const minApp = (id) => setWins(ws => ws.map(w => w.id === id ? { ...w, min: true } : w));
  const maxApp = (id) => setWins(ws => ws.map(w => w.id === id ? { ...w, max: !w.max } : w));

  const handleRightClick = (e, type, id) => {
    e.preventDefault(); e.stopPropagation();
    setCtxMenu({ show: true, x: e.clientX, y: Math.min(e.clientY, window.innerHeight - 150), type, id });
  };
  
  useEffect(()=>{
     const closeCtx = () => setCtxMenu({show:false});
     window.addEventListener('click', closeCtx);
     return () => window.removeEventListener('click', closeCtx);
  }, []);

  const renderApp = (id) => {
    switch(id) {
       case 'terminal': return <TerminalApp />;
       case 'calc': return <CalculatorApp />;
       case 'clock': return <ClockApp />;
       case 'store': return <StoreApp ins={apps} setIns={setApps} shake={()=>{}} />;
       case 'settings': return <SettingsApp ins={apps} un={(i) => setApps(apps.filter(x=>x!==i))} lock={()=>{setLocked(true);setWins([]);}} />;
       case 'notes': return <NotesApp />;
       case 'canvas': return <CanvasApp />;
       case 'media': return <MediaApp />;
       case 'vault': return <VaultApp />;
       default: return <DynamicApp app={REG[id]} />;
    }
  };

  return (
    <div className="absolute inset-0 bg-[#f8f9fb] overflow-hidden font-sans text-slate-800 flex flex-col text-sm select-none" onContextMenu={(e)=>handleRightClick(e, 'desktop', null)}>
      
      {/* MAC-STYLE MENUBAR */}
      <div className="h-7 bg-white/60 backdrop-blur-2xl border-b border-black/5 flex justify-between px-4 z-[200] text-slate-700 shadow-sm font-medium">
         <div className="flex gap-4 h-full items-center">
            <button className="flex items-center gap-2 hover:bg-white/50 px-2 rounded h-full transition-colors font-bold"><div className="w-3.5 h-3.5 bg-gradient-to-br from-slate-200 to-white shadow-sm border border-slate-300 rounded-sm flex items-center justify-center"><div className="w-1.5 h-1.5 bg-rose-400 rounded-sm"/></div>Lithium</button>
            <button className="hover:bg-white/50 px-2 h-full font-bold text-slate-900 transition-colors hidden sm:block">{wins.length > 0 && !wins[wins.length-1].min ? REG[wins[wins.length-1].id].n : 'Finder'}</button>
            <button className="hover:bg-white/50 px-2 h-full opacity-80 hidden md:block">File</button>
            <button className="hover:bg-white/50 px-2 h-full opacity-80 hidden md:block">Edit</button>
            <button className="hover:bg-white/50 px-2 h-full opacity-80 hidden md:block">Window</button>
            <button className="hover:bg-white/50 px-2 h-full opacity-80 hidden md:block" onClick={(e) => {e.stopPropagation(); setLocked(true); setWins([])}}>Sleep</button>
         </div>
         <div className="flex gap-4 h-full items-center px-2">
            <div className="flex gap-3 text-slate-500"><Wifi size={14}/><Battery size={15} /></div>
            <span className="font-semibold tracking-wide">{time.toLocaleString([], { weekday: 'short', month:'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
         </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop)' }}>
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[50px] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/40 to-white/10 pointer-events-none" />

        {/* DESKTOP ICONS */}
        <div className="absolute top-6 right-6 flex flex-col gap-6 z-0 items-end">
           {apps.slice(0, 5).map(id => {
             const a = REG[id]; if (!a) return null; const Ic = a.ic;
             return (
               <div key={`desktop-${id}`} className="flex flex-col items-center gap-1.5 cursor-pointer w-20 group" onDoubleClick={(e)=>launchApp(id, e)} onContextMenu={(e)=>handleRightClick(e, 'app', id)}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-active:scale-95 bg-white/80 backdrop-blur-xl border border-white`}><Ic size={28} className={a.c.split(' ')[1]} /></div>
                  <span className="text-[11px] font-bold text-slate-800 text-center drop-shadow-md bg-white/60 px-2 py-0.5 rounded backdrop-blur-md">{a.n}</span>
               </div>
             )
           })}
        </div>
        
        {/* WINDOWS */}
        {!locked && wins.map(w => (
          <Window key={w.id} w={w} focus={focusApp} close={closeApp} min={minApp} max={maxApp}>
            {renderApp(w.id)}
          </Window>
        ))}

        {/* FROSTED DOCK */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[150] flex items-end">
           <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[2rem] p-3 flex items-center gap-3 shadow-[0_30px_60px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
             <button onClick={(e)=>{playSound('click', e); setStartOpen(!startOpen);}} className="w-14 h-14 rounded-2xl bg-white shadow-xl border border-slate-100 flex items-center justify-center cursor-pointer hover:-translate-y-3 hover:scale-105 hover:bg-slate-50 transition-all font-bold">
                <Search size={24} className="text-slate-700" />
             </button>
             <div className="w-px h-10 bg-slate-300/50 mx-1 rounded-full"/>
             {apps.slice(0, 10).map(id => {
               const a = REG[id]; const isOpen = wins.find(w=>w.id===id); const Ic = a.ic;
               return (
                 <button key={`dock-${id}`} onClick={(e)=>{launchApp(id,e); if(isOpen&&isOpen.min)focusApp(id)}} className="relative w-14 h-14 rounded-2xl bg-white/90 backdrop-blur shadow-md border border-white flex items-center justify-center cursor-pointer hover:-translate-y-3 hover:scale-105 hover:bg-white hover:shadow-xl transition-all group">
                   <Ic size={26} className={a.c.split(' ')[1]} />
                   {isOpen && <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-800 shadow-sm"/>}
                 </button>
               )
             })}
           </div>
        </div>

        {/* CUSTOM RIGHT-CLICK OVERLAY MENU */}
        {ctxMenu.show && (
           <div className="fixed z-[300] bg-white/80 backdrop-blur-3xl border border-white/60 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] py-1.5 w-48 text-sm text-slate-700 overflow-hidden font-medium" style={{ left: ctxMenu.x, top: ctxMenu.y }}>
              {ctxMenu.type === 'desktop' && <>
                 <div className="px-4 py-1.5 hover:bg-rose-500 hover:text-white cursor-pointer transition-colors" onClick={()=>setWins([])}>Close All Windows</div>
                 <div className="px-4 py-1.5 hover:bg-rose-500 hover:text-white cursor-pointer transition-colors" onClick={()=>setLocked(true)}>Sleep System</div>
                 <div className="my-1 border-t border-slate-200/60" />
                 <div className="px-4 py-1.5 hover:bg-blue-500 hover:text-white cursor-pointer transition-colors">Change Workspace</div>
              </>}
              {ctxMenu.type === 'app' && <>
                 <div className="px-4 py-1.5 hover:bg-emerald-500 hover:text-white cursor-pointer transition-colors font-bold" onClick={()=>launchApp(ctxMenu.id, null)}>Open Module</div>
                 <div className="px-4 py-1.5 hover:bg-blue-500 hover:text-white cursor-pointer transition-colors text-slate-500" onClick={(e)=>e.stopPropagation()}>View Details</div>
                 <div className="my-1 border-t border-slate-200/60" />
                 <div className="px-4 py-1.5 hover:bg-rose-500 hover:text-white cursor-pointer transition-colors text-rose-600" onClick={()=>setApps(apps.filter(x=>x!==ctxMenu.id))}>Uninstall App</div>
              </>}
           </div>
        )}

        {/* LAUNCHPAD OVERYLAY */}
        {startOpen && !locked && (
           <div className="absolute inset-0 bg-white/70 backdrop-blur-[60px] z-[160] flex flex-col items-center justify-center p-12 transition-all duration-300">
              <div className="w-full max-w-2xl mb-20 relative flex justify-center">
                 <input autoFocus value={q} onChange={e=>setQ(e.target.value)} type="text" className="w-[90%] bg-white/60 backdrop-blur-xl border border-white/80 outline-none text-slate-800 text-3xl font-medium py-6 px-16 rounded-[2rem] text-center placeholder-slate-400 shadow-[0_20px_50px_rgba(0,0,0,0.05)] focus:bg-white transition-all ring-1 ring-slate-200/50" placeholder="Search Station..." />
                 <Search className="absolute left-[8%] top-1/2 -translate-y-1/2 text-slate-400" size={28}/>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-y-12 gap-x-8 max-w-5xl w-full">
                 {apps.filter(x => REG[x].n.toLowerCase().includes(q.toLowerCase())).map((id) => {
                   const app = REG[id]; if(!app) return null; const Ic = app.ic;
                   return (
                     <div key={`launch-${id}`} className="cursor-pointer group flex flex-col items-center gap-3" onClick={(e) => launchApp(id, e)}>
                       <div className={`w-24 h-24 flex items-center justify-center shadow-xl rounded-[2rem] transition-transform group-hover:scale-110 active:scale-95 bg-white border border-slate-100 hover:shadow-2xl`}><Ic size={44} className={app.c.split(' ')[1]} /></div>
                       <span className="text-sm font-bold text-slate-700 text-center tracking-wide">{app.n}</span>
                     </div>
                   );
                 })}
              </div>
              <button className="absolute top-12 left-12 w-14 h-14 rounded-full bg-white/50 flex items-center justify-center hover:bg-white shadow-sm border border-slate-200 transition-colors" onClick={()=>setStartOpen(false)}><Lock size={20} className="text-slate-400"/></button>
           </div>
        )}

        {/* LOCK SCREEN */}
        {locked && (
          <div className="absolute inset-0 z-[250] flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop)' }}>
            <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-3xl mix-blend-overlay" />
            <div className="z-10 flex flex-col items-center relative gap-8 py-20">
              <div className="text-center bg-white/10 p-12 rounded-[4rem] backdrop-blur-xl border border-white/20 shadow-2xl">
                 <h1 className="text-[10rem] leading-[0.8] font-semibold tracking-tighter text-slate-800 drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</h1>
                 <p className="text-3xl font-bold text-slate-600 tracking-wider mt-6">{time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="group w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.2)] cursor-pointer hover:scale-110 active:scale-95 transition-all mt-10 border-4 border-white/50 backdrop-blur-xl relative overflow-hidden" onClick={(e) => { playSound('unlock', e); setLocked(false); }}>
                 <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <Lock size={32} className="text-slate-700 relative z-10" />
              </div>
              <p className="text-sm font-bold mt-4 text-slate-600 tracking-[0.2em] uppercase origin-bottom">Fingerprint Required</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
