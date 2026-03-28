import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Calculator, FileText, Settings, Store, CloudSun, Camera, Wifi, Battery, Signal, ChevronLeft, Search, Lock, Mic, Play, Square, Image as ImageIcon, MessageSquare, Clock, Bluetooth, Moon, Sun, Music, Pause, Terminal, Shield, Activity, Zap, LocateFixed, Radio, Database, Box, Globe, Cpu, HeartPulse, Palette, Navigation, Plane } from 'lucide-react';

const REG = {
  camera: { n: 'Lens', ic: Camera, c: 'bg-rose-50 text-rose-600 border border-rose-100', d: 0 },
  photos: { n: 'Gallery', ic: ImageIcon, c: 'bg-blue-50 text-blue-600 border border-blue-100', d: 0 },
  terminal: { n: 'Console', ic: Terminal, c: 'bg-slate-800 text-slate-100 border border-slate-700', d: 0 },
  media: { n: 'Audio', ic: Music, c: 'bg-emerald-50 text-emerald-600 border border-emerald-100', d: 0 },
  browser: { n: 'Nexus', ic: Globe, c: 'bg-indigo-50 text-indigo-600 border border-indigo-100', d: 0 },
  comms: { n: 'Chat', ic: MessageSquare, c: 'bg-violet-50 text-violet-600 border border-violet-100', d: 0 },
  calc: { n: 'Compute', ic: Calculator, c: 'bg-amber-50 text-amber-600 border border-amber-100', d: 0 },
  clock: { n: 'Chrono', ic: Clock, c: 'bg-stone-50 text-stone-600 border border-stone-100', d: 0 },
  vault: { n: 'Vault', ic: Shield, c: 'bg-red-50 text-red-600 border border-red-100', d: 0 },
  weather: { n: 'Atmo', ic: CloudSun, c: 'bg-sky-50 text-sky-600 border border-sky-100', d: 0 },
  cpu: { n: 'Metrics', ic: Activity, c: 'bg-teal-50 text-teal-600 border border-teal-100', d: 0 },
  canvas: { n: 'Draw', ic: Palette, c: 'bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-100', d: 0 },
  memos: { n: 'Voice', ic: Mic, c: 'bg-orange-50 text-orange-600 border border-orange-100', d: 0 },
  notes: { n: 'Docs', ic: FileText, c: 'bg-yellow-50 text-yellow-600 border border-yellow-100', d: 0 },
  store: { n: 'Market', ic: Store, c: 'bg-cyan-50 text-cyan-600 border border-cyan-100', d: 0 },
  settings: { n: 'System', ic: Settings, c: 'bg-slate-100 text-slate-700 border border-slate-200', d: 0 },
  health: { n: 'Vitals', ic: HeartPulse, c: 'bg-rose-50 text-rose-600', d: 1 },
  radar: { n: 'Radar', ic: LocateFixed, c: 'bg-emerald-50 text-emerald-600', d: 1 },
  radio: { n: 'Tuner', ic: Radio, c: 'bg-amber-50 text-amber-600', d: 1 },
  nav: { n: 'Maps', ic: Navigation, c: 'bg-blue-50 text-blue-600', d: 1 },
  w1: { n: 'Utility 1', ic: Box, c: 'bg-slate-100 text-slate-500', d: 1 }, w2: { n: 'Utility 2', ic: Box, c: 'bg-slate-100 text-slate-500', d: 1 }, w3: { n: 'Utility 3', ic: Box, c: 'bg-slate-100 text-slate-500', d: 1 }, w4: { n: 'Utility 4', ic: Box, c: 'bg-slate-100 text-slate-500', d: 1 }, w5: { n: 'Utility 5', ic: Box, c: 'bg-slate-100 text-slate-500', d: 1 }, w6: { n: 'Utility 6', ic: Box, c: 'bg-slate-100 text-slate-500', d: 1 }, w7: { n: 'Utility 7', ic: Box, c: 'bg-slate-100 text-slate-500', d: 1 }, w8: { n: 'Utility 8', ic: Box, c: 'bg-slate-100 text-slate-500', d: 1 }, w9: { n: 'Utility 9', ic: Box, c: 'bg-slate-100 text-slate-500', d: 1 }, w10: { n: 'Utility 10', ic: Box, c: 'bg-slate-100 text-slate-500', d: 1 }
};

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const playSound = (type, e) => {
  if (e?.target?.closest('input') || audioCtx.state === 'suspended') return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);
  if (type === 'click') { osc.type = 'sine'; osc.frequency.setValueAtTime(800, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05); gain.gain.setValueAtTime(0.05, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05); osc.start(); osc.stop(audioCtx.currentTime + 0.05); }
};

function useVDisk(key, init) {
  const [v, setV] = useState(() => { try { const item = window.localStorage.getItem('LITHIUM_' + key); return item ? JSON.parse(item) : init; } catch(e) { return init; } });
  const setVal = (val) => { try { const valToStore = val instanceof Function ? val(v) : val; setV(valToStore); window.localStorage.setItem('LITHIUM_' + key, JSON.stringify(valToStore)); } catch(e){ console.error(e); } };
  return [v, setVal];
}

// --- DESKTOP WINDOW KERNEL ---
function Window({ w, focus, close, min, max, children }) {
  const [pos, setPos] = useState({ x: w.x, y: w.y });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const startDrag = (e) => { focus(w.id); if (w.max) return; setDragging(true); offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }; };
  const onDrag = useCallback((e) => { if (!dragging) return; setPos({ x: e.clientX - offset.current.x, y: Math.max(24, e.clientY - offset.current.y) }); }, [dragging]);
  const endDrag = useCallback(() => setDragging(false), []);
  useEffect(() => { if (dragging) { window.addEventListener('mousemove', onDrag); window.addEventListener('mouseup', endDrag); return () => { window.removeEventListener('mousemove', onDrag); window.removeEventListener('mouseup', endDrag); }; } }, [dragging, onDrag, endDrag]);
  
  if (w.min) return null;
  return (
    <div className="absolute bg-white/80 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-slate-200/60 flex flex-col overflow-hidden transition-all duration-300 rounded-2xl" style={{ left: w.max ? 0 : pos.x, top: w.max ? 24 : pos.y, width: w.max ? '100%' : w.w, height: w.max ? 'calc(100% - 24px)' : w.h, zIndex: w.z, transitionProperty: dragging ? 'none' : 'width, height, left, top' }} onMouseDown={() => focus(w.id)}>
      <div className="h-10 bg-slate-50/50 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 cursor-move shrink-0" onMouseDown={startDrag}>
        <div className="flex gap-2">
           <button onClick={(e)=>{e.stopPropagation(); close(w.id)}} className="w-3.5 h-3.5 rounded-full bg-rose-400 border border-rose-500 shadow-sm hover:bg-rose-500 transition-colors" />
           <button onClick={(e)=>{e.stopPropagation(); min(w.id)}} className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-500 shadow-sm hover:bg-amber-500 transition-colors" />
           <button onClick={(e)=>{e.stopPropagation(); max(w.id)}} className="w-3.5 h-3.5 rounded-full bg-emerald-400 border border-emerald-500 shadow-sm hover:bg-emerald-500 transition-colors" />
        </div>
        {(() => { const Ic = w.ic; return <div className="absolute left-1/2 -translate-x-1/2 text-slate-600 font-semibold tracking-wide text-xs flex items-center gap-2"><Ic size={14}/> {REG[w.id].n}</div> })()}
        <div className="w-12"/>
      </div>
      <div className="flex-1 overflow-hidden relative" onMouseDown={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

// --- APPS (Frosted/Lithium Theme) ---
function DynamicApp({ app }) {
  const Ic = app.ic;
  return <div className="w-full h-full bg-slate-50/90 flex flex-col items-center justify-center text-slate-400 p-8 text-center"><Ic size={48} className="mb-4 text-slate-300 opacity-50" /><p className="font-semibold text-lg text-slate-700">{app.n} Module Disabled</p><p className="text-sm mt-2 opacity-70">Install via Market to initialize.</p></div>;
}

function SettingsApp({ ins, un, lock }) {
  return (
    <div className="w-full h-full bg-slate-50/90 text-slate-800 p-6 overflow-y-auto font-sans">
      <h2 className="text-2xl font-bold mb-6 tracking-tight flex items-center gap-3"><Settings className="text-slate-400"/> System Preferences</h2>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 mb-6 flex items-center gap-6">
         <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0"><Cpu size={32} className="text-rose-400"/></div>
         <div><h3 className="font-bold text-lg">Lithium OS</h3><p className="text-slate-500 text-sm">Version 4.0 - Project Station</p></div>
      </div>
      <button onClick={(e)=>{playSound('click',e);lock()}} className="w-full bg-slate-800 text-white rounded-xl py-3 font-semibold shadow-sm hover:bg-slate-700 active:scale-[0.98] transition-all mb-8">Lock Workstation</button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ins.map(id => REG[id]?.d===1 && (
          <div key={id} className="bg-white rounded-xl p-3 flex justify-between items-center shadow-sm border border-slate-100">
            <span className="font-medium text-sm pl-2">{REG[id].n}</span>
            <button onClick={(e)=>{playSound('click',e); un(id)}} className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-100">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StoreApp({ ins, setIns, shake }) {
  return (
    <div className="w-full h-full bg-indigo-50/50 text-slate-800 flex flex-col p-6">
      <h2 className="text-2xl font-bold mb-6 tracking-tight flex items-center gap-3"><Store className="text-indigo-400"/> App Market</h2>
      <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto px-1 pb-10">
        {Object.keys(REG).filter(k => REG[k].d === 1 && !ins.includes(k)).map(id => {
          const Ic = REG[id].ic;
          return (
          <div key={id} className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:-translate-y-1 transition-transform">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${REG[id].c}`}><Ic size={24}/></div>
            <span className="font-bold text-sm text-slate-700">{REG[id].n}</span>
            <button onClick={(e)=>{playSound('click',e); setIns([...ins, id]); shake();}} className="mt-2 text-[10px] font-bold uppercase tracking-widest bg-indigo-600 text-white px-4 py-1.5 rounded-full hover:bg-indigo-700">Get</button>
          </div>
          );
        })}
        {Object.keys(REG).filter(k => REG[k].d === 1 && !ins.includes(k)).length === 0 && <p className="col-span-2 text-center text-slate-400 mt-10">All modules installed.</p>}
      </div>
    </div>
  );
}

function TerminalApp() {
  const [log, setLog] = useState(["> Lithium OS Kernel v4.0 loaded.", "> Ready for secure input."]);
  const [inp, setInp] = useState('');
  const run = (e) => {
    if (e.key === 'Enter' && inp) {
      playSound('click', e);
      let res = `> ${inp}`;
      try { res += `\n< ${String(new Function('return ' + inp)())}`; } catch(err) { res += `\n< Err: ${err.message}`; }
      if(inp === 'clear') setLog([]); else setLog([...log, res]);
      setInp('');
    }
  };
  return (
    <div className="w-full h-full bg-slate-900 text-slate-300 font-mono text-xs p-4 flex flex-col p-4 selection:bg-rose-500/50">
      <div className="flex-1 overflow-y-auto whitespace-pre-wrap flex flex-col justify-end space-y-1">
        {log.map((l,i) => <div key={i}>{l}</div>)}
      </div>
      <div className="flex mt-2 pt-2 border-t border-slate-700/50"><span className="mr-2 text-rose-400">$</span><input autoFocus value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={run} className="flex-1 bg-transparent outline-none text-rose-50 caret-rose-400" /></div>
    </div>
  );
}

function BrowserApp() {
  const [u, setU] = useState(''); const [src, setSrc] = useState('https://example.com');
  return (
    <div className="w-full h-full bg-white flex flex-col">
       <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-4 shrink-0 gap-3">
          <input value={u} onChange={e=>setU(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&u) setSrc(u.startsWith('http')?u:`https://${u}`)}} className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-xs outline-none text-slate-700 focus:border-indigo-400 transition-colors shadow-inner" placeholder="Search or enter web address" />
       </div>
       <iframe src={src} className="flex-1 w-full bg-white border-none" title="Browser" sandbox="allow-same-origin allow-scripts border-none" />
    </div>
  );
}

function CameraApp({ gal, setGal }) {
  const vRef = useRef(null); const cRef = useRef(null); const [err, setErr] = useState(false);
  useEffect(() => { const v = vRef.current; navigator.mediaDevices.getUserMedia({video:true}).then(s => {if(v)v.srcObject=s;}).catch(()=>setErr(true)); return ()=>{if(v && v.srcObject) v.srcObject.getTracks().forEach(t=>t.stop());}; }, []);
  const cap = () => { if(vRef.current&&cRef.current&&!err){const c=cRef.current, v=vRef.current; c.width=v.videoWidth; c.height=v.videoHeight; const ctx=c.getContext('2d'); ctx.drawImage(v,0,0); setGal([c.toDataURL('image/jpeg', 0.8), ...gal].slice(0, 5));} };
  return (
    <div className="w-full h-full bg-slate-900 flex flex-col overflow-hidden relative isolate">
       {err ? <div className="absolute inset-0 flex items-center justify-center text-rose-400 text-sm font-semibold p-6 text-center">Camera Access Denied</div> : <video ref={vRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover -z-10" />}
       <div className="absolute bottom-6 inset-x-0 flex justify-center"><button onClick={cap} className="w-16 h-16 rounded-full border-4 border-white/50 backdrop-blur-md bg-white/20 active:bg-white/80 active:scale-90 transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center justify-center"><div className="w-12 h-12 rounded-full bg-white mix-blend-overlay"/></button></div><canvas ref={cRef} className="hidden"/>
    </div>
  );
}

function PhotosApp({ gal }) {
  if (gal.length === 0) return <div className="w-full h-full bg-white flex items-center justify-center text-slate-400 text-sm font-medium">Gallery Empty</div>;
  return <div className="w-full h-full bg-white grid grid-cols-2 gap-0.5 overflow-y-auto content-start">{gal.map((img,i) => <img key={i} src={img} className="w-full aspect-square object-cover" alt="Memory" />)}</div>;
}

function CalculatorApp() {
  const [calc, setCalc] = useState('0');
  const press = (btn, e) => { playSound('click',e); if(btn==='C') setCalc('0'); else if(btn==='=') { try { setCalc(String(new Function('return ' + calc)())) } catch { setCalc('ERR') } } else setCalc(calc==='0'||calc==='ERR'?btn:calc+btn); };
  return (
    <div className="w-full h-full bg-slate-50 flex flex-col pb-4">
      <div className="flex-1 bg-white p-6 flex items-end justify-end text-right border-b border-slate-100 shadow-sm z-10 break-all text-4xl text-slate-800 font-light tracking-tight">{calc}</div>
      <div className="grid grid-cols-4 gap-2 pt-4 px-4 h-64 text-slate-700 text-lg font-medium">
         {['C','/','*','-','7','8','9','+','4','5','6','=','1','2','3','0'].map(b => (
           <button key={b} onClick={(e)=>press(b,e)} className={`rounded-xl shadow-sm border border-slate-200 active:scale-95 transition-transform ${b==='='?'row-span-2 bg-amber-500 text-white border-amber-600':b==='C'?'bg-rose-50 text-rose-500':b==='0'?'col-span-3':'bg-white hover:bg-slate-50'}`}>{b}</button>
         ))}
      </div>
    </div>
  );
}

function ClockApp() {
  const [t, setT] = useState(new Date()); useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
  return (
    <div className="w-full h-full bg-white flex flex-col items-center justify-center p-8 relative">
       <div className="w-48 h-48 rounded-full border-[6px] border-slate-100 relative shadow-inner flex items-center justify-center bg-white shadow-xl shadow-slate-200">
         <div className="absolute w-1.5 h-16 bg-slate-800 rounded-full origin-bottom" style={{ transform: `translateY(-50%) rotate(${t.getHours()*30 + t.getMinutes()*0.5}deg)` }} />
         <div className="absolute w-1 h-20 bg-slate-400 rounded-full origin-bottom" style={{ transform: `translateY(-50%) rotate(${t.getMinutes()*6}deg)` }} />
         <div className="absolute w-0.5 h-24 bg-rose-500 rounded-full origin-bottom" style={{ transform: `translateY(-50%) rotate(${t.getSeconds()*6}deg)` }} />
         <div className="absolute w-3 h-3 bg-rose-500 rounded-full z-10 border-2 border-white"/>
       </div>
    </div>
  );
}

function WeatherApp() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-sky-400 to-blue-500 text-white p-8 flex flex-col justify-between shadow-[inset_0_0_50px_rgba(0,0,0,0.1)]">
       <div><h3 className="text-2xl font-bold tracking-tight mb-1 drop-shadow-md">Lithium City</h3><p className="text-white/80 font-medium">Clear Conditions</p></div>
       <div className="self-center my-8 drop-shadow-xl"><CloudSun size={120} strokeWidth={1}/></div>
       <div className="flex justify-between items-end"><div className="text-6xl fontlight tracking-tighter drop-shadow-md">72°</div><div className="text-white/90 text-right font-medium"><p>H: 78° L: 62°</p><p>AQI: 24</p></div></div>
    </div>
  );
}

function CpuApp() {
  const [load, setLoad] = useState([50,40,60,30,80,20,50,40,60,30]);
  useEffect(() => { const i = setInterval(() => setLoad(p => [...p.slice(1,10), Math.random()*100]), 1000); return () => clearInterval(i); }, []);
  return (
    <div className="w-full h-full bg-teal-900 text-teal-100 p-6 flex flex-col font-mono text-xs">
       <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><Activity/> System Activity</h3>
       <div className="flex-1 flex items-end gap-1 mb-6 border-b border-teal-700 pb-2">
         {load.map((v,i) => <div key={i} className="flex-1 bg-teal-400/80 rounded-t shadow-[0_0_10px_rgba(45,212,191,0.5)] transition-all duration-300" style={{height: `${v}%`}}/>)}
       </div>
       <div className="grid grid-cols-2 gap-4"><div className="bg-teal-800 p-3 rounded-xl border border-teal-700">CPU LOAD<div className="text-xl font-bold mt-1 text-white">{Math.round(load[9])}%</div></div><div className="bg-teal-800 p-3 rounded-xl border border-teal-700">MEM USAGE<div className="text-xl font-bold mt-1 text-white">2.4 GB</div></div></div>
    </div>
  );
}

export default function LithiumOS() {
  const [time, setTime] = useState(new Date());
  const [locked, setLocked] = useState(false); // Default unlocked for desktop demo
  const [wins, setWins] = useState([]);
  
  const [gal, setGal] = useVDisk('gallery', []);
  const [apps, setApps] = useVDisk('apps', Object.keys(REG).slice(0, 10));
  const [startOpen, setStartOpen] = useState(false);
  const [q, setQ] = useState('');

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  
  const focusApp = useCallback((id) => setWins(ws => ws.map(w => w.id === id ? { ...w, z: Date.now(), min: false } : w).sort((a,b)=>a.z-b.z)), []);
  const launchApp = useCallback((id, e) => {
    if(e) playSound('click', e);
    setWins(ws => {
      const ex = ws.find(w => w.id === id);
      if (ex) return ws.map(w => w.id === id ? { ...w, z: Date.now(), min: false } : w).sort((a,b)=>a.z-b.z);
      return [...ws, { id, ic: REG[id].ic, z: Date.now(), min: false, max: false, x: 100 + ws.length*30, y: 100 + ws.length*30, w: 700, h: 500 }];
    });
    setStartOpen(false);
  }, []);
  const closeApp = (id) => setWins(ws => ws.filter(w => w.id !== id));
  const minApp = (id) => setWins(ws => ws.map(w => w.id === id ? { ...w, min: true } : w));
  const maxApp = (id) => setWins(ws => ws.map(w => w.id === id ? { ...w, max: !w.max } : w));

  const renderApp = (id) => {
    switch(id) {
       case 'camera': return <CameraApp gal={gal} setGal={setGal} />;
       case 'photos': return <PhotosApp gal={gal} />;
       case 'terminal': return <TerminalApp />;
       case 'browser': return <BrowserApp />;
       case 'calc': return <CalculatorApp />;
       case 'clock': return <ClockApp />;
       case 'store': return <StoreApp ins={apps} setIns={setApps} shake={()=>{}} />;
       case 'settings': return <SettingsApp ins={apps} un={(i) => setApps(apps.filter(x=>x!==i))} lock={()=>{setLocked(true);setWins([]);}} />;
       case 'weather': return <WeatherApp />;
       case 'cpu': return <CpuApp />;
       default: return <DynamicApp app={REG[id]} />;
    }
  };

  return (
    <div className="w-full h-full bg-slate-100 overflow-hidden font-sans text-slate-800 flex flex-col relative text-xs select-none">
      
      {/* MAC-STYLE TOP MENUBAR */}
      <div className="h-7 bg-white/60 backdrop-blur-2xl border-b border-white/40 flex items-center justify-between px-6 z-[150] shrink-0 text-slate-700">
         <div className="flex items-center gap-6 h-full font-semibold">
            <button className="flex items-center gap-2 hover:text-slate-900 cursor-pointer"><div className="w-3.5 h-3.5 bg-gradient-to-br from-slate-200 to-white shadow-sm border border-slate-300 rounded-sm flex items-center justify-center"><div className="w-1.5 h-1.5 bg-rose-400 rounded-sm"/></div>Lithium</button>
            <button className="hover:text-slate-900 cursor-pointer text-slate-900 font-bold">{wins.length > 0 && !wins[wins.length-1].min ? REG[wins[wins.length-1].id].n : 'Station'}</button>
            <button className="hover:text-slate-900 cursor-pointer hidden md:block opacity-80">File</button>
            <button className="hover:text-slate-900 cursor-pointer hidden md:block opacity-80">Edit</button>
            <button className="hover:text-slate-900 cursor-pointer hidden md:block opacity-80">View</button>
            <button className="hover:text-slate-900 cursor-pointer hidden md:block opacity-80">Window</button>
            <button className="hover:text-slate-900 cursor-pointer hidden md:block opacity-80">Help</button>
         </div>
         <div className="flex items-center gap-5 h-full cursor-pointer hover:text-slate-900 opacity-80">
            <div className="flex gap-2.5 items-center"><Wifi size={14}/><Battery size={15} /></div>
            <span className="font-semibold">{time.toLocaleTimeString([], { weekday: 'short', month:'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
         </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {/* DESKTOP BACKGROUND */}
        <div className="absolute inset-0 bg-[#f8f9fb]">
           <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-rose-100/50 blur-[150px] pointer-events-none" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-100/50 blur-[150px] pointer-events-none" />
        </div>

        {/* DESKTOP ICONS */}
        <div className="absolute top-6 left-6 flex flex-col gap-8 z-0">
           {apps.slice(0, 6).map(id => {
             const a = REG[id]; if (!a) return null; const Ic = a.ic;
             return (
               <div key={`desktop-${id}`} className="flex flex-col items-center justify-center gap-2 cursor-pointer w-20 group" onDoubleClick={(e)=>launchApp(id, e)}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-active:scale-95 bg-white border border-slate-200/50`}><Ic size={30} className={a.c.split(' ')[1]} /></div>
                  <span className="text-[11px] font-semibold text-slate-700 text-center bg-white/40 backdrop-blur-md px-3 py-1 rounded-full shadow-sm outline outline-1 outline-white/50">{a.n}</span>
               </div>
             )
           })}
        </div>
        
        {/* WINDOWS RUNTIME */}
        {!locked && wins.map(w => (
          <Window key={w.id} w={w} focus={focusApp} close={closeApp} min={minApp} max={maxApp}>
            {renderApp(w.id)}
          </Window>
        ))}

        {/* macOS STYLE DOCK */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[120] flex items-end">
           <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[2rem] p-2.5 flex items-center gap-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
             <button onClick={(e)=>{playSound('click', e); setStartOpen(!startOpen);}} className="w-[52px] h-[52px] rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center cursor-pointer hover:-translate-y-2 transition-transform group">
                <Search size={22} className="text-slate-600 group-hover:scale-110 transition-transform" />
             </button>
             <div className="w-px h-8 bg-slate-200/60 mx-1 rounded-full"/>
             {apps.slice(0, 8).map(id => {
               const a = REG[id]; const isOpen = wins.find(w=>w.id===id); const Ic = a.ic;
               return (
                 <button key={`dock-${id}`} onClick={(e)=>{launchApp(id,e); if(isOpen&&isOpen.min)focusApp(id)}} className="relative w-[52px] h-[52px] rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center cursor-pointer hover:-translate-y-2 transition-transform group">
                   <Ic size={24} className={a.c.split(' ')[1]} />
                   {isOpen && <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-400"/>}
                 </button>
               )
             })}
           </div>
        </div>

        {/* LAUNCHPAD FULLSCREEN OVERLAY */}
        {startOpen && !locked && (
           <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-3xl z-[130] flex flex-col items-center justify-center p-12 transition-all duration-300">
              <div className="w-full max-w-xl mb-16 relative flex justify-center">
                 <input autoFocus value={q} onChange={e=>setQ(e.target.value)} type="text" className="w-[80%] bg-white border border-slate-200 outline-none text-slate-800 text-2xl py-5 px-14 rounded-full text-center placeholder-slate-400 shadow-xl" placeholder="Search Station..." />
                 <Search className="absolute left-[15%] top-1/2 -translate-y-1/2 text-slate-400" size={24}/>
              </div>
              <div className="grid grid-cols-5 md:grid-cols-7 gap-y-12 gap-x-8 max-w-5xl w-full">
                 {apps.filter(x => REG[x].n.toLowerCase().includes(q.toLowerCase())).map((id) => {
                   const app = REG[id]; if(!app) return null; const Ic = app.ic;
                   return (
                     <div key={`launch-${id}`} className="cursor-pointer group flex flex-col items-center gap-3" onClick={(e) => launchApp(id, e)}>
                       <div className={`w-20 h-20 flex items-center justify-center shadow-xl rounded-[1.5rem] transition-transform group-hover:scale-110 active:scale-95 bg-white border border-slate-100`}><Ic size={36} className={app.c.split(' ')[1]} /></div>
                       <span className="text-sm font-semibold text-slate-700 text-center truncate">{app.n}</span>
                     </div>
                   );
                 })}
              </div>
              <button className="absolute top-10 right-10 text-slate-400 font-semibold uppercase tracking-widest hover:text-slate-800 text-sm" onClick={()=>setStartOpen(false)}>Close</button>
           </div>
        )}

        {/* LOCK SCREEN (LOGIN) */}
        {locked && (
          <div className="absolute inset-0 z-[200] flex flex-col items-center justify-center transition-all duration-700 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop)' }}>
            <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl" />
            <div className="z-10 flex flex-col items-center relative gap-8 -translate-y-12">
              <div className="text-center">
                 <h1 className="text-[8rem] leading-none font-medium tracking-tight text-slate-800 drop-shadow-xl">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</h1>
                 <p className="text-2xl font-medium text-slate-600 tracking-wide mt-2">{time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform mt-12 border border-slate-200" onClick={(e) => { playSound('unlock', e); setLocked(false); }}>
                 <Lock size={24} className="text-slate-700" />
              </div>
              <p className="text-sm font-semibold mt-4 text-slate-500 tracking-widest text-center uppercase">Click to unlock Desktop</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
