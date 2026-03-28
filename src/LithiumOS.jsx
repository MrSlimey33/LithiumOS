import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, FileText, Settings, Store, CloudSun, Camera, Wifi, Battery, Search, Lock, Mic, Image as ImageIcon, MessageSquare, Clock, Music, Terminal, Shield, Activity, LocateFixed, Box, Globe, Cpu, Palette, Zap, Plus, ChevronRight, Folder, X, Minus, Maximize2, LogOut, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const REG = {
  terminal: { n: 'Console', ic: Terminal, c: 'from-slate-800 to-slate-900', t: 'text-slate-100', d: 0 },
  calc: { n: 'Compute', ic: Calculator, c: 'from-amber-400 to-orange-500', t: 'text-white', d: 0 },
  notes: { n: 'Notes', ic: FileText, c: 'from-yellow-300 to-yellow-500', t: 'text-yellow-900', d: 0 },
  settings: { n: 'System', ic: Settings, c: 'from-slate-300 to-slate-400', t: 'text-slate-800', d: 0 },
  store: { n: 'Market', ic: Store, c: 'from-indigo-400 to-purple-500', t: 'text-white', d: 0 },
  media: { n: 'Synthesia', ic: Music, c: 'from-emerald-400 to-teal-500', t: 'text-white', d: 0 },
  vault: { n: 'Vault', ic: Shield, c: 'from-red-400 to-rose-600', t: 'text-white', d: 0 },
  clock: { n: 'Chrono', ic: Clock, c: 'from-stone-700 to-stone-900', t: 'text-slate-200', d: 0 },
  canvas: { n: 'Canvas', ic: Palette, c: 'from-fuchsia-400 to-pink-500', t: 'text-white', d: 1 },
  browser: { n: 'Nexus', ic: Globe, c: 'from-blue-400 to-cyan-500', t: 'text-white', d: 1 },
  camera: { n: 'Lens', ic: Camera, c: 'from-rose-300 to-pink-400', t: 'text-white', d: 1 },
  photos: { n: 'Gallery', ic: ImageIcon, c: 'from-sky-300 to-blue-500', t: 'text-white', d: 1 },
  weather: { n: 'Atmo', ic: CloudSun, c: 'from-cyan-300 to-sky-400', t: 'text-white', d: 1 },
  cpu: { n: 'Metrics', ic: Activity, c: 'from-teal-300 to-emerald-400', t: 'text-white', d: 1 },
  memos: { n: 'Voice', ic: Mic, c: 'from-orange-300 to-red-400', t: 'text-white', d: 1 },
  radar: { n: 'Radar', ic: LocateFixed, c: 'from-lime-400 to-green-500', t: 'text-white', d: 1 },
};

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const playSound = (type, e) => {
  if (e?.target?.closest('input') || audioCtx.state === 'suspended') return;
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination);
  if (type === 'click') { 
    o.type='sine'; o.frequency.setValueAtTime(800, audioCtx.currentTime); o.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime+0.05); 
    g.gain.setValueAtTime(0.05, audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime+0.05); 
    o.start(); o.stop(audioCtx.currentTime+0.05); 
  } else if (type === 'open') {
    o.type='sine'; o.frequency.setValueAtTime(300, audioCtx.currentTime); o.frequency.linearRampToValueAtTime(600, audioCtx.currentTime+0.1); 
    g.gain.setValueAtTime(0, audioCtx.currentTime); g.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime+0.05); g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime+0.2); 
    o.start(); o.stop(audioCtx.currentTime+0.2);
  }
};

function useVDisk(key, init) {
  const [v, setV] = useState(() => { try { const item = window.localStorage.getItem('LITHIUM_' + key); return item ? JSON.parse(item) : init; } catch { return init; } });
  const setVal = (val) => { try { const valToStore = val instanceof Function ? val(v) : val; setV(valToStore); window.localStorage.setItem('LITHIUM_' + key, JSON.stringify(valToStore)); } catch(e){ console.error(e); } };
  return [v, setVal];
}

// --- WINDOW MANAGER (Desktop) ---
function Window({ w, focus, close, min, max, children, constraintsRef }) {
  if (w.min) return null;
  const Ic = w.ic;
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0, 
                 width: w.max ? '100%' : w.w, 
                 height: w.max ? '100%' : w.h, 
                 x: w.max ? 0 : w.x, 
                 y: w.max ? 0 : w.y,
                 borderRadius: w.max ? '0px' : '24px'
      }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      drag={!w.max}
      dragConstraints={constraintsRef}
      dragMomentum={false}
      dragElastic={0.1}
      onDragStart={() => focus(w.id)}
      onMouseDown={() => focus(w.id)}
      className="absolute bg-white/70 backdrop-blur-[50px] shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-white/60 flex flex-col overflow-hidden will-change-transform z-10"
      style={{ zIndex: w.z, position: 'absolute' }}
    >
      <div className="h-14 bg-gradient-to-b from-white/80 to-white/30 border-b border-white/40 flex items-center justify-between px-5 w-full cursor-grab active:cursor-grabbing shrink-0 backdrop-blur-md">
        <div className="flex gap-2.5">
           <button onMouseDown={(e)=>{e.stopPropagation(); playSound('click',e); close(w.id)}} className="w-3.5 h-3.5 rounded-full bg-rose-400 border border-rose-500 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center group"><X size={8} className="text-rose-900 opacity-0 group-hover:opacity-100 transition-opacity" /></button>
           <button onMouseDown={(e)=>{e.stopPropagation(); playSound('click',e); min(w.id)}} className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-500 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center group"><Minus size={8} className="text-amber-900 opacity-0 group-hover:opacity-100 transition-opacity"/></button>
           <button onMouseDown={(e)=>{e.stopPropagation(); playSound('click',e); max(w.id)}} className="w-3.5 h-3.5 rounded-full bg-emerald-400 border border-emerald-500 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center group"><Maximize2 size={8} className="text-emerald-900 opacity-0 group-hover:opacity-100 transition-opacity"/></button>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 text-slate-700 font-semibold tracking-wide text-[13px] flex items-center gap-2 drop-shadow-sm"><Ic size={14} className="opacity-70"/> {REG[w.id].n}</div>
        <div className="w-12"/>
      </div>
      <div className="flex-1 overflow-hidden relative bg-white/40 rounded-b-[24px]" onMouseDown={e => e.stopPropagation()}>{children}</div>
    </motion.div>
  );
}

// --- CORE APPS ---
function TerminalApp() {
  const [log, setLog] = useState(["> Lithium OS Kernel loaded.", "> Run 'help' for commands.", "> Connecting to primary node... OK"]);
  const [inp, setInp] = useState('');
  const run = (e) => {
    if (e.key === 'Enter' && inp) {
      playSound('click', e); let res = `> ${inp}`;
      if(inp === 'clear') setLog([]); 
      else if(inp === 'help') setLog([...log, res, "Commands: clear, help, date, whoami, neofetch"]);
      else if(inp === 'date') setLog([...log, res, new Date().toString()]);
      else if(inp === 'whoami') setLog([...log, res, "root@lithium"]);
      else if(inp === 'neofetch') setLog([...log, res, "   .o+`\n  `ooo/\n `+oooo:\n`+oooooo:\n-+oooooo+:\n Lithium OS 4.0\n Kernel: Web Native\n UI: AeroComposite"]);
      else { try { res += `\n< ${String(new Function('return ' + inp)())}`; } catch(err) { res += `\n< Err: ${err.message}`; } setLog([...log, res]); }
      setInp('');
    }
  };
  return (
    <div className="w-full h-full bg-[#0d1117] text-[#58a6ff] font-mono text-[13px] p-5 flex flex-col relative overflow-hidden isolate">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
      <div className="flex-1 overflow-y-auto whitespace-pre-wrap flex flex-col justify-end space-y-2 mb-3 relative z-10 scrollbar-hide">
        {log.map((l,i) => <motion.div initial={{opacity:0, x:-5}} animate={{opacity:1, x:0}} key={i} className={l.startsWith('< Err') ? 'text-[#ff7b72]' : l.startsWith('<') ? 'text-[#3fb950]' : ''}>{l}</motion.div>)}
      </div>
      <div className="flex border-t border-[#30363d] pt-3 relative z-10"><span className="mr-3 text-[#3fb950] font-bold">root@station:~$</span><input autoFocus value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={run} className="flex-1 bg-transparent outline-none text-[#c9d1d9]" spellCheck="false" /></div>
    </div>
  );
}

function NotesApp() {
  const [notes, setNotes] = useVDisk('notes_db', [{id:1, title:'Idea Log', text:'Welcome to Lithium Notes.\nAuto-saved to your local VDisk.'}]);
  const [sel, setSel] = useState(1);
  const cur = notes.find(n=>n.id===sel) || notes[0];
  const update = (t) => setNotes(notes.map(n=>n.id===sel ? {...n, text:t} : n));
  const mkNew = () => { const id=Date.now(); setNotes([...notes, {id, title:'Untitled', text:''}]); setSel(id); };
  return (
    <div className="w-full h-full bg-slate-50/50 backdrop-blur-md flex h-full text-slate-800">
       <div className="w-64 bg-slate-100/50 border-r border-slate-200/50 flex flex-col backdrop-blur-xl shrink-0">
          <div className="p-5 flex justify-between items-center"><span className="font-bold text-slate-500 tracking-widest text-[10px] uppercase">All Notes</span><button onClick={mkNew} className="p-1.5 hover:bg-slate-200/80 rounded-lg text-slate-600 transition-colors shadow-sm bg-white/50"><Plus size={14}/></button></div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
             {notes.map(n=>(<div key={n.id} onClick={()=>setSel(n.id)} className={`p-3 rounded-xl cursor-pointer text-sm font-semibold truncate transition-all border ${sel===n.id?'bg-white border-slate-200 shadow-sm text-slate-900':'bg-transparent border-transparent hover:bg-white/40 text-slate-500 hover:text-slate-700'}`}>{n.title||'Untitled'}</div>))}
          </div>
       </div>
       <div className="flex-1 flex flex-col relative px-10 py-8 bg-white/60">
          <input value={cur?.title} onChange={e=>setNotes(notes.map(n=>n.id===sel?{...n,title:e.target.value}:n))} className="text-4xl font-bold tracking-tight text-slate-900 outline-none placeholder-slate-300 bg-transparent mb-8 transition-colors" placeholder="Note Title..." />
          <textarea value={cur?.text} onChange={e=>update(e.target.value)} className="flex-1 resize-none bg-transparent outline-none text-slate-700 text-lg leading-relaxed placeholder-slate-300 font-serif" placeholder="Start typing here..."/>
       </div>
    </div>
  );
}

function CalculatorApp() {
  const [calc, setCalc] = useState('0');
  const press = (b,e) => { 
    playSound('click',e); 
    if(b==='C')setCalc('0'); 
    else if(b==='=')try{setCalc(String(new Function('return '+calc)()).slice(0,12))}catch{setCalc('ERR')} 
    else setCalc(calc==='0'||calc==='ERR'?b:calc.length<12?calc+b:calc); 
  };
  return (
    <div className="w-full h-full bg-slate-100/80 flex flex-col p-6 font-sans select-none backdrop-blur-xl">
      <div className="bg-white/80 backdrop-blur rounded-[2rem] mb-6 flex-1 flex flex-col justify-end p-8 text-right border border-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden flex-shrink-0 min-h-[140px]">
         <span className="text-6xl font-light text-slate-800 tracking-tighter break-all">{calc}</span>
      </div>
      <div className="grid grid-cols-4 gap-4 text-2xl font-medium h-72 shrink-0">
         {['C','/','*','-','7','8','9','+','4','5','6','=','1','2','3','0'].map(b => (
           <button key={b} onClick={(e)=>press(b,e)} className={`rounded-[1.5rem] shadow-sm border active:scale-95 transition-all flex items-center justify-center ${b==='='?'row-span-2 bg-gradient-to-br from-orange-400 to-rose-500 text-white border-rose-500 shadow-rose-500/30 shadow-lg':b==='C'?'bg-slate-200/50 text-rose-500 border-slate-300/50 hover:bg-slate-200':b==='0'?'col-span-3 bg-white/90 border-white hover:bg-white':'bg-white/90 hover:bg-white text-slate-700 border-white'}`}>{b}</button>
         ))}
      </div>
    </div>
  );
}

function SettingsApp({ ins, un, lock }) {
  return (
    <div className="w-full h-full bg-slate-50/80 backdrop-blur-xl text-slate-800 p-8 overflow-y-auto font-sans relative">
      <h2 className="text-4xl font-bold mb-10 tracking-tight flex items-center gap-4 text-slate-900"><Settings className="text-slate-400" size={36}/> System Settings</h2>
      
      <div className="bg-white/90 backdrop-blur rounded-[2rem] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-white mb-10 flex items-center gap-8 relative overflow-hidden isolate">
         <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-100 rounded-full blur-[60px] -z-10 opacity-70" />
         <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-50 to-white flex items-center justify-center shrink-0 border border-cyan-100 shadow-md"><Cpu size={40} className="text-cyan-500"/></div>
         <div>
            <h3 className="font-bold text-3xl text-slate-900 mb-1">Lithium Station</h3>
            <p className="text-slate-500 font-medium text-lg">Kernel OS 4.2.0 • AeroComposite Engine</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
         <div className="bg-white/70 backdrop-blur p-6 rounded-3xl border border-white shadow-sm flex flex-col gap-4">
            <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2"><Lock size={18} className="text-rose-500"/> Security</h4>
            <button onClick={(e)=>{playSound('click',e);lock()}} className="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold tracking-wide shadow-xl shadow-slate-900/10 hover:-translate-y-1 hover:shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">Lock Workstation</button>
         </div>
         <div className="bg-white/70 backdrop-blur p-6 rounded-3xl border border-white shadow-sm flex flex-col gap-4">
            <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2"><Globe size={18} className="text-blue-500"/> Network</h4>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100"><span className="font-semibold text-slate-600 text-sm">LithiumNet</span><span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">Connected</span></div>
         </div>
      </div>

      <div className="mb-4 text-xs font-bold tracking-widest text-slate-400 uppercase">Installed Modules</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ins.map(id => {
          if (REG[id]?.d !== 1) return null;
          const Ic = REG[id].ic;
          return (
          <div key={`set-${id}`} className="bg-white/80 backdrop-blur rounded-2xl p-5 flex justify-between items-center shadow-sm border border-white">
            <span className="font-semibold text-slate-800 text-base flex items-center gap-4"><div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${REG[id].c} ${REG[id].t} shadow-inner drop-shadow-sm`}><Ic size={20}/></div>{REG[id].n}</span>
            <button onClick={(e)=>{playSound('click',e); un(id)}} className="px-5 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 active:scale-95 transition-transform border border-rose-100">Delete</button>
          </div>
          );
        })}
      </div>
    </div>
  );
}

function StoreApp({ ins, setIns }) {
  return (
    <div className="w-full h-full bg-slate-50/80 backdrop-blur-xl text-slate-800 flex flex-col p-8">
      <h2 className="text-4xl font-bold mb-10 tracking-tight flex items-center gap-4"><Store className="text-purple-500" size={36}/> Market</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto px-1 pb-10 scrollbar-hide">
        {Object.keys(REG).filter(k => REG[k].d === 1 && !ins.includes(k)).map(id => {
          const Ic = REG[id].ic;
          return (
          <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} key={`store-${id}`} className="bg-white/90 backdrop-blur p-8 rounded-[2rem] border border-white shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center gap-4 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all">
            <div className={`w-20 h-20 rounded-[1.8rem] flex items-center justify-center bg-gradient-to-br ${REG[id].c} ${REG[id].t} shadow-[inset_0_2px_10px_rgba(255,255,255,0.3)] shadow-md`}><Ic size={36}/></div>
            <span className="font-bold text-slate-800 text-lg">{REG[id].n}</span>
            <button onClick={(e)=>{playSound('click',e); setIns([...ins, id]);}} className="mt-4 text-xs font-bold tracking-widest bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-purple-600 transition-colors active:scale-95 shadow-xl hover:shadow-purple-500/30">GET CORE</button>
          </motion.div>
          );
        })}
        {Object.keys(REG).filter(k => REG[k].d === 1 && !ins.includes(k)).length === 0 && <div className="col-span-full h-full flex flex-col items-center justify-center text-slate-500 font-medium text-lg"><Zap size={56} className="mb-6 opacity-30"/>All modules acquired!</div>}
      </div>
    </div>
  );
}

function DefaultApp({ app }) {
  const Ic = app.ic;
  return <div className="w-full h-full bg-white/50 backdrop-blur-xl flex flex-col items-center justify-center text-slate-500 p-8 text-center text-lg"><Ic size={80} className="mb-8 text-slate-300 drop-shadow-sm" /><p className="font-bold text-2xl text-slate-800">Module Initialized</p><p className="mt-4 opacity-70 max-w-sm leading-relaxed">{app.n} relies on experimental dependencies not available in the current kernel preview.</p></div>;
}

// --- MAIN OS SYSTEM ---
export default function LithiumOS({ previewMode = false }) {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [locked, setLocked] = useState(false);
  const [wins, setWins] = useState([]);
  const [apps, setApps] = useVDisk('apps_core', Object.keys(REG).slice(0, 9));
  const [startOpen, setStartOpen] = useState(false);
  const [q, setQ] = useState('');
  
  // Mobile check
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeMobileApp, setActiveMobileApp] = useState(null);

  const containerRef = useRef(null);
  const [wallpaperIdx] = useState(Math.floor(Math.random() * 3));
  const wallpapers = [
     'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
     'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2564&auto=format&fit=crop',
     'https://images.unsplash.com/photo-1614850715649-1d0106293cb1?q=80&w=2564&auto=format&fit=crop'
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  
  const focusApp = useCallback((id) => setWins(ws => ws.map(w => w.id === id ? { ...w, z: Date.now(), min: false } : w).sort((a,b)=>a.z-b.z)), []);
  const launchApp = useCallback((id, e) => {
    if(e) playSound('open', e);
    
    if (isMobile) {
      setActiveMobileApp(id);
      setStartOpen(false);
      return;
    }

    setWins(ws => {
      const ex = ws.find(w => w.id === id);
      if (ex) return ws.map(w => w.id === id ? { ...w, z: Date.now(), min: false, max: false } : w).sort((a,b)=>a.z-b.z);
      // Ensure we don't open too large
      const wWidth = Math.min(800, window.innerWidth - 80);
      const wHeight = Math.min(600, window.innerHeight - 150);
      const startX = Math.max(0, (window.innerWidth - wWidth) / 2 + ws.length * 20);
      const startY = Math.max(30, (window.innerHeight - wHeight) / 2 + ws.length * 20 - 40);

      return [...ws, { id, ic: REG[id].ic, z: Date.now(), min: false, max: false, x: startX, y: startY, w: wWidth, h: wHeight }];
    });
    setStartOpen(false);
  }, [isMobile]);
  
  const closeApp = (id) => setWins(ws => ws.filter(w => w.id !== id));
  const minApp = (id) => setWins(ws => ws.map(w => w.id === id ? { ...w, min: true } : w));
  const maxApp = (id) => setWins(ws => ws.map(w => w.id === id ? { ...w, max: !w.max, x: w.max ? w.x : 0, y: w.max ? w.y : 28 } : w));

  const renderAppObj = (id) => {
    switch(id) {
       case 'terminal': return <TerminalApp />;
       case 'calc': return <CalculatorApp />;
       case 'store': return <StoreApp ins={apps} setIns={setApps} />;
       case 'settings': return <SettingsApp ins={apps} un={(i) => setApps(apps.filter(x=>x!==i))} lock={()=>{setLocked(true);setWins([]); setActiveMobileApp(null)}} />;
       case 'notes': return <NotesApp />;
       default: return <DefaultApp app={REG[id]} />;
    }
  };

  const handleLogout = () => {
     localStorage.removeItem('LITHIUM_USER');
     navigate('/login');
  };

  // ------------------- MOBILE RENDER -------------------
  if (isMobile && !previewMode) {
    return (
       <div className="absolute inset-0 bg-slate-900 overflow-hidden font-sans text-slate-800 select-none flex flex-col pt-10 pb-8" style={{ backgroundImage: `url(${wallpapers[wallpaperIdx]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
         <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl mix-blend-overlay" />
         
         {/* STATUS BAR */}
         <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-6 z-50 text-white text-xs font-semibold drop-shadow-md">
            <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <div className="flex gap-2"><Wifi size={14}/><Battery size={14} /></div>
         </div>

         <AnimatePresence mode="wait">
           {activeMobileApp ? (
             <motion.div 
               key="app"
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               transition={{ type: "spring", bounce: 0, duration: 0.4 }}
               className="absolute inset-0 z-40 bg-white flex flex-col"
             >
                <div className="h-14 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 z-50 shrink-0 shadow-sm">
                   <button onClick={() => setActiveMobileApp(null)} className="flex items-center gap-1 text-blue-500 font-semibold"><ChevronLeft size={20}/> Back</button>
                   <span className="font-bold text-slate-800 text-sm tracking-wide">{REG[activeMobileApp].n}</span>
                   <div className="w-16"/>
                </div>
                <div className="flex-1 overflow-hidden bg-slate-50 relative">
                   {renderAppObj(activeMobileApp)}
                </div>
             </motion.div>
           ) : (
             <motion.div key="home" className="flex-1 relative z-10 flex flex-col p-6 overflow-y-auto scrollbar-hide pt-10">
               <h2 className="text-white text-3xl font-bold mb-8 drop-shadow-md">Lithium Center</h2>
               <div className="grid grid-cols-4 gap-y-8 gap-x-4">
                  {apps.map(id => {
                     const a = REG[id]; const Ic = a.ic;
                     return (
                        <div key={id} className="flex flex-col items-center gap-2" onClick={(e) => launchApp(id, e)}>
                           <div className={`w-[4.5rem] h-[4.5rem] rounded-3xl flex items-center justify-center bg-gradient-to-br ${a.c} ${a.t} shadow-lg shadow-black/20 active:scale-95 transition-transform border border-white/20`}><Ic size={32}/></div>
                           <span className="text-[11px] font-semibold text-white text-center drop-shadow-md tracking-wide">{a.n}</span>
                        </div>
                     )
                  })}
               </div>
             </motion.div>
           )}
         </AnimatePresence>
       </div>
    );
  }

  // ------------------- DESKTOP RENDER -------------------
  return (
    <div className="absolute inset-0 bg-[#f8f9fb] overflow-hidden font-sans text-slate-800 flex flex-col text-sm select-none" ref={containerRef}>
      
      {/* MAC-STYLE MENUBAR */}
      <div className="h-8 bg-white/40 backdrop-blur-2xl border-b border-white/40 flex justify-between px-5 z-[200] text-slate-700 shadow-sm font-medium items-center">
         <div className="flex gap-5 h-full items-center text-[13px] font-semibold">
            <button className="flex items-center gap-2 hover:bg-white/60 px-2 rounded h-full transition-colors drop-shadow-sm"><div className="w-3.5 h-3.5 bg-gradient-to-br from-cyan-400 to-blue-500 shadow-sm rounded-sm flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-sm opacity-50"/></div></button>
            <button className="hover:bg-white/60 px-2 h-full text-slate-900 transition-colors drop-shadow-sm">{wins.length > 0 && !wins[wins.length-1].min ? REG[wins[wins.length-1].id].n : 'Finder'}</button>
            <button className="hover:bg-white/60 px-2 h-full opacity-80">File</button>
            <button className="hover:bg-white/60 px-2 h-full opacity-80">Edit</button>
            <button className="hover:bg-white/60 px-2 h-full opacity-80">View</button>
            <button className="hover:bg-white/60 px-2 h-full opacity-80" onClick={(e) => {e.stopPropagation(); setLocked(true); setWins([])}}>Sleep</button>
         </div>
         <div className="flex gap-5 h-full items-center px-2">
            {!previewMode && <button onClick={handleLogout} className="hover:bg-white/60 px-2 h-full flex items-center gap-2 opacity-80"><LogOut size={14}/> Quit</button>}
            <div className="flex gap-3 text-slate-600"><Wifi size={14}/><Battery size={15} /></div>
            <span className="font-bold tracking-wide drop-shadow-sm">{time.toLocaleString([], { weekday: 'short', month:'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
         </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${wallpapers[wallpaperIdx]})` }}>
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[20px] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 to-white/10 pointer-events-none" />

        {/* DESKTOP ICONS */}
        <div className="absolute top-8 right-8 flex flex-col gap-8 z-0 items-end">
           {apps.slice(0, 4).map(id => {
             const a = REG[id]; if (!a) return null; const Ic = a.ic;
             return (
               <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} key={`desktop-${id}`} className="flex flex-col items-center gap-2 cursor-pointer w-24 group" onDoubleClick={(e)=>launchApp(id, e)}>
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.1)] group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] transition-all group-active:scale-95 bg-white/40 backdrop-blur-2xl border border-white/60 group-hover:bg-white/60`}><Ic size={32} className="text-slate-800 opacity-80" /></div>
                  <span className="text-[12px] font-bold text-white text-center drop-shadow-md bg-black/20 px-3 py-1 rounded-full backdrop-blur-md">{a.n}</span>
               </motion.div>
             )
           })}
        </div>
        
        {/* WINDOWS */}
        <AnimatePresence>
           {!locked && wins.map(w => (
             <Window key={w.id} w={w} focus={focusApp} close={closeApp} min={minApp} max={maxApp} constraintsRef={containerRef}>
               {renderAppObj(w.id)}
             </Window>
           ))}
        </AnimatePresence>

        {/* FROSTED DOCK */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[150] flex items-end">
           <div className="bg-white/30 backdrop-blur-3xl border border-white/50 rounded-[2.5rem] p-3 flex items-center gap-3 shadow-[0_40px_80px_rgba(0,0,0,0.2)] ring-1 ring-black/5">
             <motion.button whileHover={{ y: -8, scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={(e)=>{playSound('click', e); setStartOpen(!startOpen);}} className="w-[4.5rem] h-[4.5rem] rounded-3xl bg-white shadow-xl border border-white flex items-center justify-center cursor-pointer font-bold relative group">
                <Search size={28} className="text-slate-800" />
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-xs px-3 py-1 rounded-full font-semibold transition-opacity pointer-events-none drop-shadow-md whitespace-nowrap">Search & Launch</div>
             </motion.button>
             <div className="w-[1.5px] h-12 bg-white/40 mx-2 rounded-full"/>
             {apps.slice(0, 8).map(id => {
               const a = REG[id]; const isOpen = wins.find(w=>w.id===id && !w.min); const Ic = a.ic;
               return (
                 <motion.button whileHover={{ y: -8, scale: 1.1 }} whileTap={{ scale: 0.95 }} key={`dock-${id}`} onClick={(e)=>{launchApp(id,e); if(isOpen&&isOpen.min)focusApp(id)}} className="relative w-[4.5rem] h-[4.5rem] rounded-3xl bg-transparent flex items-center justify-center cursor-pointer group">
                   <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${a.c} opacity-90 border border-white/40 shadow-inner group-hover:opacity-100 transition-opacity`} />
                   <Ic size={32} className={`relative z-10 ${a.t} drop-shadow-md`} />
                   {isOpen && <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_rgba(255,255,255,0.8)]"/>}
                   <div className="absolute -top-12 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-xs px-3 py-1 rounded-full font-semibold transition-opacity pointer-events-none drop-shadow-md whitespace-nowrap">{a.n}</div>
                 </motion.button>
               )
             })}
           </div>
        </div>

        {/* LAUNCHPAD OVERYLAY */}
        <AnimatePresence>
           {startOpen && !locked && (
              <motion.div 
                 initial={{ opacity: 0, scale: 1.05 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 1.05 }}
                 transition={{ duration: 0.3, ease: 'easeOut' }}
                 className="absolute inset-0 bg-slate-900/60 backdrop-blur-[80px] z-[160] flex flex-col items-center justify-center p-12"
              >
                 <div className="w-full max-w-3xl mb-20 relative flex justify-center">
                    <input autoFocus value={q} onChange={e=>setQ(e.target.value)} type="text" className="w-[90%] bg-white/10 backdrop-blur-3xl border border-white/20 outline-none text-white text-3xl font-medium py-6 px-16 rounded-[2.5rem] text-center shadow-[0_30px_60px_rgba(0,0,0,0.2)] focus:bg-white/20 transition-all focus:border-white/40 placeholder-white/30" placeholder="Search Kernel..." spellCheck="false" />
                    <Search className="absolute left-[8%] top-1/2 -translate-y-1/2 text-white/50" size={32}/>
                 </div>
                 <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-y-12 gap-x-8 max-w-5xl w-full">
                    {apps.filter(x => REG[x].n.toLowerCase().includes(q.toLowerCase())).map((id) => {
                      const app = REG[id]; if(!app) return null; const Ic = app.ic;
                      return (
                        <div key={`launch-${id}`} className="cursor-pointer group flex flex-col items-center gap-4" onClick={(e) => launchApp(id, e)}>
                          <div className={`w-24 h-24 flex items-center justify-center shadow-xl rounded-[2rem] transition-transform group-hover:scale-110 active:scale-95 bg-gradient-to-br ${app.c} border border-white/20 hover:shadow-2xl`}><Ic size={44} className={app.t} /></div>
                          <span className="text-sm font-bold text-white text-center tracking-wide drop-shadow-md">{app.n}</span>
                        </div>
                      );
                    })}
                 </div>
                 <button className="absolute top-12 left-12 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 shadow-sm border border-white/20 transition-all group" onClick={()=>setStartOpen(false)}><X size={28} className="text-white group-hover:rotate-90 transition-transform"/></button>
              </motion.div>
           )}
        </AnimatePresence>

        {/* LOCK SCREEN */}
        <AnimatePresence>
           {locked && (
             <motion.div 
               initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
               animate={{ opacity: 1, backdropFilter: 'blur(40px)' }}
               exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
               transition={{ duration: 0.5 }}
               className="absolute inset-0 z-[250] flex flex-col items-center justify-center bg-slate-900/60"
             >
               <div className="z-10 flex flex-col items-center relative gap-8 py-20">
                 <div className="text-center">
                    <h1 className="text-[9rem] leading-[0.8] font-bold tracking-tighter text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</h1>
                    <p className="text-3xl font-bold text-slate-300 tracking-wider mt-6 drop-shadow-md">{time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                 </div>
                 <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.3)] cursor-pointer transition-all mt-10 border border-white/40 backdrop-blur-xl group" onClick={(e) => { playSound('open', e); setLocked(false); }}>
                    <Lock size={36} className="text-white group-hover:text-cyan-300 transition-colors" />
                 </motion.div>
                 <p className="text-sm font-bold mt-4 text-white/60 tracking-[0.2em] uppercase origin-bottom">Double Tap to Unlock</p>
               </div>
             </motion.div>
           )}
        </AnimatePresence>
      </div>
    </div>
  );
}
