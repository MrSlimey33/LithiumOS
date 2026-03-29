import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Calculator, FileText, Settings, Store, CloudSun, Camera, Wifi, Battery, Search, Lock, Mic, Image as ImageIcon, Clock, Music, Terminal, Shield, Activity, LocateFixed, Globe, Palette, LogOut, ChevronLeft, X, Minus, Maximize2, Zap, Code2, Signal, Plus, Plane, Moon, Folder } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import All Apps
import { TerminalApp, NotesApp, CalculatorApp, SettingsApp, VaultApp, ClockApp } from './apps/SystemApps';
import { SynthesiaApp, CameraApp, MemosApp, PhotosApp, CanvasApp } from './apps/MediaApps';
import { WeatherApp, BrowserApp, CpuApp, RadarApp } from './apps/NetworkApps';
import { StoreApp, DeveloperStudioApp } from './apps/StoreApps';
import { MusicApp, FileExplorerApp } from './apps/ExperienceApps';

const REG = {
  terminal: { n: 'Console', ic: Terminal, c: 'from-slate-800 to-slate-900', t: 'text-slate-100', d: 0, comp: TerminalApp, menus: ['Shell', 'Edit', 'View', 'Search', 'Terminal'] },
  calc: { n: 'Compute', ic: Calculator, c: 'from-amber-400 to-orange-500', t: 'text-white', d: 0, comp: CalculatorApp, menus: ['Edit', 'View', 'Convert', 'Speech'] },
  notes: { n: 'Notes', ic: FileText, c: 'from-yellow-300 to-yellow-500', t: 'text-yellow-900', d: 0, comp: NotesApp, menus: ['File', 'Edit', 'Format', 'View', 'Share'] },
  settings: { n: 'System', ic: Settings, c: 'from-slate-300 to-slate-400', t: 'text-slate-800', d: 0, comp: SettingsApp, menus: ['System', 'Edit', 'View', 'Security'] },
  store: { n: 'Market', ic: Store, c: 'from-indigo-400 to-purple-500', t: 'text-white', d: 0, comp: StoreApp, menus: ['Market', 'Edit', 'Discover', 'Updates'] },
  devstudio: { n: 'Dev Studio', ic: Code2, c: 'from-blue-500 to-indigo-600', t: 'text-white', d: 0, comp: DeveloperStudioApp, menus: ['File', 'Edit', 'Selection', 'View', 'Go', 'Run'] },
  media: { n: 'Synthesia', ic: Music, c: 'from-emerald-400 to-teal-500', t: 'text-white', d: 0, comp: SynthesiaApp, menus: ['File', 'Edit', 'Track', 'Navigate', 'Record'] },
  vault: { n: 'Vault', ic: Shield, c: 'from-red-400 to-rose-600', t: 'text-white', d: 0, comp: VaultApp, menus: ['File', 'Edit', 'View', 'Go', 'Tools'] },
  clock: { n: 'Chrono', ic: Clock, c: 'from-stone-700 to-stone-900', t: 'text-slate-200', d: 0, comp: ClockApp, menus: ['Edit', 'View', 'Window'] },
  canvas: { n: 'Canvas', ic: Palette, c: 'from-fuchsia-400 to-pink-500', t: 'text-white', d: 1, comp: CanvasApp, menus: ['File', 'Edit', 'Image', 'Layer', 'Select', 'Filter'] },
  browser: { n: 'Nexus', ic: Globe, c: 'from-blue-400 to-cyan-500', t: 'text-white', d: 1, comp: BrowserApp, menus: ['File', 'Edit', 'View', 'History', 'Bookmarks', 'Profiles'] },
  camera: { n: 'Lens', ic: Camera, c: 'from-rose-300 to-pink-400', t: 'text-white', d: 1, comp: CameraApp, menus: ['File', 'Edit', 'Capture', 'Window'] },
  photos: { n: 'Gallery', ic: ImageIcon, c: 'from-sky-300 to-blue-500', t: 'text-white', d: 1, comp: PhotosApp, menus: ['File', 'Edit', 'Image', 'View', 'Window'] },
  weather: { n: 'Atmo', ic: CloudSun, c: 'from-cyan-300 to-sky-400', t: 'text-white', d: 1, comp: WeatherApp, menus: ['Location', 'Edit', 'View', 'Window'] },
  cpu: { n: 'Metrics', ic: Activity, c: 'from-teal-300 to-emerald-400', t: 'text-white', d: 1, comp: CpuApp, menus: ['File', 'Edit', 'View', 'Window'] },
  memos: { n: 'Voice', ic: Mic, c: 'from-orange-300 to-red-400', t: 'text-white', d: 1, comp: MemosApp, menus: ['File', 'Edit', 'Controls', 'Window'] },
  radar: { n: 'Radar', ic: LocateFixed, c: 'from-lime-400 to-green-500', t: 'text-white', d: 1, comp: RadarApp, menus: ['File', 'Edit', 'View', 'Network'] },
  music: { n: 'Music', ic: Music, c: 'from-fuchsia-500 to-indigo-600', t: 'text-white', d: 0, comp: MusicApp, menus: ['Library', 'Playback', 'View', 'Window'] },
  files: { n: 'Files', ic: Folder, c: 'from-amber-400 to-yellow-500', t: 'text-amber-900', d: 0, comp: FileExplorerApp, menus: ['Go', 'View', 'Edit', 'Tools'] },
};

let audioCtxInstance = null;
const getAudioCtx = () => {
  if (!audioCtxInstance) audioCtxInstance = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtxInstance;
};

const playSound = (type, e) => {
  try {
    const audioCtx = getAudioCtx();
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
  } catch {}
};

function useVDisk(key, init) {
  const [v, setV] = useState(() => { try { const item = window.localStorage.getItem('LITHIUM_' + key); return item ? JSON.parse(item) : init; } catch { return init; } });
  const setVal = (val) => { try { const valToStore = val instanceof Function ? val(v) : val; setV(valToStore); window.localStorage.setItem('LITHIUM_' + key, JSON.stringify(valToStore)); } catch(e){ console.error(e); } };
  return [v, setVal];
}

// ===== HYPER-KINETIC WINDOW (GLASS 4.0) =====
function Window({ w, focus, close, min, max, resize, children, constraintsRef, activeReg }) {
  if (w.min) return null;
  const Ic = w.ic;
  const reg = activeReg[w.id] || { n: 'Unknown' };
  
  // Refined Kinetic Drag & Resize
  const x = useMotionValue(w.x);
  const y = useMotionValue(w.y);
  
  // Sync motion values with state when dragging
  useEffect(() => {
    x.set(w.x);
    y.set(w.y);
  }, [w.x, w.y, x, y]);

  const rotateX = useTransform(y, [0, 1000], [4, -4]); 
  const rotateY = useTransform(x, [0, 1000], [-4, 4]);

  const handleResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = w.w;
    const startH = w.h;

    const onMove = (moveEvent) => {
      const nw = Math.max(400, startW + (moveEvent.clientX - startX));
      const nh = Math.max(300, startH + (moveEvent.clientX - startX) * (startH/startW)); // Aspect ratio or free? Let's do free.
      const nhFree = Math.max(300, startH + (moveEvent.clientY - startY));
      resize(w.id, nw, nhFree);
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
      animate={{ 
        opacity: 1, scale: 1, filter: 'blur(0px)',
        width: w.max ? '100%' : w.w, 
        height: w.max ? 'calc(100% - 100px)' : w.h, 
        x: w.max ? 0 : w.x, 
        y: w.max ? 50 : w.y,
        borderRadius: w.max ? '0px' : '28px'
      }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      drag={!w.max}
      dragConstraints={constraintsRef}
      dragMomentum={false}
      onDrag={(e, info) => {
        x.set(info.point.x);
        y.set(info.point.y);
      }}
      onDragStart={() => focus(w.id)}
      onMouseDown={() => focus(w.id)}
      style={{ zIndex: w.z, position: 'absolute', rotateX, rotateY, perspective: 1000, x, y }}
      className="flex flex-col overflow-hidden hyperglass-pro refractive-border"
    >
      <div className="h-12 flex items-center justify-between px-6 w-full cursor-grab active:cursor-grabbing shrink-0 select-none border-b border-white/5 bg-white/5">
        <div className="flex gap-3">
           <button onMouseDown={(e)=>{e.stopPropagation(); close(w.id)}} className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-lg shadow-rose-500/20 active:scale-90 transition-all" />
           <button onMouseDown={(e)=>{e.stopPropagation(); min(w.id)}} className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-lg shadow-amber-500/20 active:scale-90 transition-all" />
           <button onMouseDown={(e)=>{e.stopPropagation(); max(w.id)}} className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20 active:scale-90 transition-all" />
        </div>
        <div className="text-[10px] font-black tracking-[0.3em] uppercase text-white/50 flex items-center gap-3">
          <Ic size={12} className="opacity-40 animate-pulse-slow"/>{reg.n}
        </div>
        <div className="w-16" />
      </div>
      <div className="flex-1 overflow-hidden relative bg-black/60" onMouseDown={e => e.stopPropagation()}>{children}</div>
      
      {/* Resize Handle */}
      {!w.max && (
        <div 
          onMouseDown={handleResize}
          className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-50 flex items-center justify-center group"
        >
          <div className="w-1 h-1 bg-white/20 rounded-full group-hover:bg-cyan-400 transition-colors" />
        </div>
      )}
    </motion.div>
  );
}

// ===== KINETIC RAIL ITEM =====
function RailItem({ id, app, isOpen, onClick }) {
  const Ic = app.ic;
  return (
    <motion.button 
      whileHover={{ x: 10, scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick} 
      className="w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer relative group transition-all haptic-pulse"
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)`,
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}
    >
      <Ic size={24} className={app.t} />
      {isOpen && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" />}
      <div className="absolute left-20 opacity-0 group-hover:opacity-100 bg-black/95 text-white text-[9px] px-3 py-2 rounded-lg font-black tracking-widest uppercase border border-white/10 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-xl z-[600]">{app.n}</div>
    </motion.button>
  );
}

// ===== MAIN OS COMPONENT =====
export default function LithiumOS({ previewMode = false }) {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [locked, setLocked] = useState(false);
  const [wins, setWins] = useState([]);
  const [apps, setApps] = useVDisk('apps_core', Object.keys(REG).slice(0, 8));
  const [startOpen, setStartOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeMobileApp, setActiveMobileApp] = useState(null);
  const containerRef = useRef(null);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showTelemetry, setShowTelemetry] = useState(true);
  const [telemetry, setTelemetry] = useState({ bat: 100, net: 8.4, mem: 42 });
  
  const [extAppsMap, setExtAppsMap] = useState(() => {
     try { return JSON.parse(window.localStorage.getItem('LITHIUM_ext_apps') || '{}'); } catch(e) { return {}; }
  });

  useEffect(() => {
     const handleStorage = () => {
        try { setExtAppsMap(JSON.parse(window.localStorage.getItem('LITHIUM_ext_apps') || '{}')); } catch(e){}
     };
     window.addEventListener('storage', handleStorage);
     const interval = setInterval(handleStorage, 2000);
     return () => { window.removeEventListener('storage', handleStorage); clearInterval(interval); };
  }, []);

  const activeReg = useMemo(() => {
      const merged = { ...REG };
      for (const [id, extApp] of Object.entries(extAppsMap)) {
         merged[id] = {
            n: extApp.title,
            ic: LucideIcons[extApp.icon] || LucideIcons.Box,
            c: extApp.img,
            t: 'text-white',
            d: 1,
            comp: () => <iframe srcDoc={extApp.code} title={extApp.title} className="w-full h-full border-none bg-white" sandbox="allow-scripts allow-modals allow-forms allow-popups"/>,
            menus: ['Node', 'Navigate', 'View', 'Refresh']
         };
      }
      return merged;
  }, [extAppsMap]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
     const up = async () => {
        const t = { bat: 100, net: (Math.random() * 5 + 5).toFixed(1), mem: Math.floor(Math.random() * 20 + 30) };
        try {
           if(navigator.getBattery) {
              const b = await navigator.getBattery();
              t.bat = Math.floor(b.level * 100);
           }
           if(navigator.connection) {
              t.net = navigator.connection.downlink || t.net;
           }
        } catch(e){}
        setTelemetry(t);
     };
     up();
     const i = setInterval(up, 5000);
     return () => clearInterval(i);
  }, []);

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  
  const focusApp = useCallback((id) => {
    setWins(ws => ws.map(w => w.id === id ? { ...w, z: Date.now(), min: false } : w).sort((a,b)=>a.z-b.z));
  }, []);
  
  const launchApp = useCallback((id, e) => {
    if(e) playSound('open', e);
    if (isMobile) { setActiveMobileApp(id); setStartOpen(false); return; }
    
    setWins(ws => {
      const ex = ws.find(w => w.id === id);
      if (ex) return ws.map(w => w.id === id ? { ...w, z: Date.now(), min: false, max: false } : w).sort((a,b)=>a.z-b.z);
      const wWidth = Math.min(800, window.innerWidth - 80);
      const wHeight = Math.min(600, window.innerHeight - 150);
      const startX = Math.max(0, (window.innerWidth - wWidth) / 2 + ws.length * 20);
      const startY = Math.max(30, (window.innerHeight - wHeight) / 2 + ws.length * 20 - 40);
      const appData = activeReg[id] || REG[id] || {};
      return [...ws, { id, ic: appData.ic || LucideIcons.Box, z: Date.now(), min: false, max: false, x: startX, y: startY, w: wWidth, h: wHeight }];
    });
    setStartOpen(false);
  }, [isMobile, activeReg]);
  
  const closeApp = (id) => setWins(ws => ws.filter(w => w.id !== id));
  const minApp = (id) => setWins(ws => ws.map(w => w.id === id ? { ...w, min: true } : w));
  const maxApp = (id) => setWins(ws => ws.map(w => w.id === id ? { ...w, max: !w.max, x: w.max ? w.x : 0, y: w.max ? w.y : 28 } : w));
  const resizeApp = (id, w, h) => setWins(ws => ws.map(ow => ow.id === id ? { ...ow, w, h } : ow));

  const renderCurrentApp = (id) => {
    const AppComp = activeReg[id]?.comp;
    if (!AppComp) return <div className="p-8 text-center bg-white/50 w-full h-full text-slate-500">Module failed to load.</div>
    return <AppComp playSound={playSound} useVDisk={useVDisk} audioCtx={getAudioCtx()} ins={apps} setIns={setApps} un={(i) => setApps(apps.filter(x=>x!==i))} lock={()=>{setLocked(true);setWins([]); setActiveMobileApp(null)}} REG={activeReg} openDevStudio={()=>launchApp('devstudio', null)} />;
  };

  const handleLogout = () => {
     localStorage.removeItem('LITHIUM_CLOUD_ID');
     navigate('/login');
  };

  // ------------------- MOBILE RENDER -------------------
  if (isMobile && !previewMode) {
    return (
       <div className="absolute inset-0 bg-black overflow-hidden font-sans text-white select-none flex flex-col no-tap-highlight spatial-mesh">
          <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[300] flex items-center justify-center pointer-events-none">
             <motion.div 
               animate={{ width: showControlCenter ? 320 : 180, height: showControlCenter ? 400 : 36 }}
               className="bg-black border border-white/10 rounded-[2.5rem] shadow-2xl flex items-center justify-between px-6 overflow-hidden relative pointer-events-auto"
               onClick={() => !showControlCenter && setShowControlCenter(true)}
             >
                <AnimatePresence mode="wait">
                   {!showControlCenter ? (
                      <motion.div key="status-min" className="flex items-center justify-between w-full">
                         <span className="text-[11px] font-black">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                         <div className="flex items-center gap-3">
                           <Wifi size={12} className="opacity-40" />
                           <Battery size={14} className="text-emerald-500" />
                         </div>
                      </motion.div>
                   ) : (
                      <motion.div key="status-max" className="w-full flex flex-col gap-6 pt-8">
                         <div className="flex justify-between items-center px-2">
                            <h3 className="text-xl font-black italic">Command</h3>
                            <button onClick={(e) => { e.stopPropagation(); setShowControlCenter(false); }} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><X size={16}/></button>
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                            <div className="refraction-tile rounded-[2rem] p-5 aspect-square flex flex-col justify-between">
                               <Wifi size={24} className="text-blue-400" />
                               <span className="text-sm font-black">LITH_NET</span>
                            </div>
                            <div className="refraction-tile rounded-[2rem] p-5 aspect-square flex flex-col justify-between">
                               <Battery size={24} className="text-emerald-400" />
                               <span className="text-sm font-black">84%</span>
                            </div>
                         </div>
                         <button onClick={handleLogout} className="mt-4 w-full py-4 rounded-full bg-rose-500/10 text-rose-500 font-black text-[10px] uppercase tracking-widest border border-rose-500/20"><LogOut size={14} className="inline mr-2"/> Terminate Session</button>
                      </motion.div>
                   )}
                </AnimatePresence>
             </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {activeMobileApp ? (
              <motion.div key="app-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[150] bg-black flex flex-col overflow-hidden">
                 <div className="flex-1 overflow-hidden relative">{renderCurrentApp(activeMobileApp)}</div>
                 <div className="h-12 bg-black/50 backdrop-blur-xl flex items-center justify-center shrink-0 safe-bottom">
                    <motion.div whileTap={{ scale: 0.9 }} className="w-32 h-1.5 bg-white/30 rounded-full" onClick={() => setActiveMobileApp(null)}/>
                 </div>
              </motion.div>
            ) : (
              <motion.div key="home-layer" className="flex-1 relative z-10 flex flex-col px-6 pt-20 pb-40 overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-2 gap-4 mb-12">
                   <div className="refraction-tile rounded-[2.8rem] p-6 aspect-square flex flex-col justify-between">
                      <Clock size={24} className="text-white/40" />
                      <div className="text-5xl font-black shimmer-text">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                   </div>
                </div>
                <div className="grid grid-cols-4 gap-y-10 gap-x-4">
                   {apps.map(id => {
                      const a = activeReg[id] || REG[id];
                      if (!a) return null;
                      const Ic = a.ic;
                      return (
                         <div key={id} className="flex flex-col items-center gap-3" onClick={(e) => launchApp(id, e)}>
                            <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center bg-gradient-to-br ${a.c} ${a.t} border border-white/20`}><Ic size={28} /></div>
                            <span className="text-[9px] font-black uppercase text-white/50 text-center truncate w-full">{a.n}</span>
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
    <div className="w-screen h-screen bg-[#020205] overflow-hidden select-none font-sans text-white/90">
       <div className="absolute inset-0 spatial-mesh flex flex-row no-tap-highlight overflow-hidden isolate">
          <svg className="hidden"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter></svg>
          <div className="absolute inset-0 molecular-grain opacity-10 pointer-events-none z-[10]" />

          {/* 1. LEFT RAIL */}
          <motion.div initial={{ x: -100 }} animate={{ x: 0 }} className="w-20 h-full flex flex-col items-center py-8 gap-6 z-[400] hyperglass-pro border-r border-white/5 bg-black/40">
             <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg cursor-pointer haptic-pulse" onClick={() => setStartOpen(true)}><Zap size={24} className="text-white fill-white" /></motion.div>
             <div className="flex-1 flex flex-col gap-5 overflow-y-auto scrollbar-hide px-2">
                {apps.slice(0, 8).map((id) => <RailItem key={id} id={id} app={activeReg[id]} isOpen={wins.some(w => w.id === id)} onClick={() => launchApp(id)} />)}
             </div>
             <motion.button whileHover={{ scale: 1.1, backgroundColor: 'rgba(244, 63, 94, 0.1)' }} onClick={handleLogout} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-rose-500 border border-white/5 mt-4"><LogOut size={20} /></motion.button>
          </motion.div>

          {/* 2. MAIN WORKSPACE */}
          <div className="flex-1 relative flex flex-col overflow-hidden">
             {/* SYSTEM PILL */}
             <div className="h-20 flex items-center justify-center px-10 pointer-events-none z-[400]">
                <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="hyperglass-pro px-8 py-3 rounded-full pointer-events-auto flex items-center gap-8 border border-white/10 shadow-2xl">
                   <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white/50">NODE_LITH_PRO</span>
                   </div>
                   <div className="h-4 w-[1px] bg-white/10" />
                   <div className="flex flex-col items-center leading-none">
                      <span className="text-[13px] font-black text-white">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                      <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-1">{time.toLocaleDateString([], { weekday: 'short' })}</span>
                   </div>
                   <div className="h-4 w-[1px] bg-white/10" />
                   <div className="flex items-center gap-4 text-white/40">
                      <Wifi size={14} className={telemetry.net > 2 ? 'text-cyan-400' : ''}/>
                      <div className="flex items-center gap-1.5 cursor-pointer pointer-events-auto" onClick={() => setShowTelemetry(!showTelemetry)}>
                         <Battery size={16} className={telemetry.bat < 20 ? 'text-rose-500' : 'text-emerald-400'} />
                         <span className="text-[10px] font-black">{telemetry.bat}%</span>
                      </div>
                   </div>
                </motion.div>
             </div>

             {/* WINDOWS */}
             <div ref={containerRef} className="flex-1 relative isolate pointer-events-none p-10 overflow-hidden">
                <AnimatePresence>
                   {wins.map((w) => (
                      <div key={w.id} className="pointer-events-auto absolute inset-0">
                         <Window w={w} focus={focusApp} close={closeApp} min={minApp} max={maxApp} resize={resizeApp} constraintsRef={containerRef} activeReg={activeReg}>{renderCurrentApp(w.id)}</Window>
                      </div>
                   ))}
                </AnimatePresence>
             </div>

             {/* COMMAND DOCK */}
             <div className="h-24 flex items-center justify-center pb-6 z-[400]">
                <AnimatePresence>
                  {wins.length > 0 && (
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="hyperglass-pro px-6 py-2 rounded-2xl border border-white/10 flex items-center gap-4 shadow-2xl bg-black/40 backdrop-blur-3xl">
                       <div className="flex flex-col"><span className="text-[8px] font-black uppercase text-cyan-400/60">Active Shells</span><span className="text-[10px] font-bold text-white/40">{wins.length} Process</span></div>
                       <div className="w-[1px] h-6 bg-white/10 mx-2" />
                       <div className="flex items-center gap-3">
                          {wins.map(w => <motion.button key={`dock-${w.id}`} whileHover={{ y: -4 }} onClick={()=>focusApp(w.id)} className={`w-10 h-10 rounded-xl flex items-center justify-center border ${w.z === Math.max(...wins.map(x=>x.z)) ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-white/5 border-white/5 text-white/30'}`}><w.ic size={18} /></motion.button>)}
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>

          {/* 3. RIGHT RAIL */}
          <AnimatePresence>
             {showTelemetry && (
                <motion.div 
                  initial={{ x: 320, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  exit={{ x: 320, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="w-80 h-full p-8 flex flex-col gap-6 z-[400] hyperglass-pro border-l border-white/5 bg-black/20 shrink-0"
                >
                   <div className="flex justify-between items-center px-1">
                      <h3 className="text-[10px] font-black tracking-[0.5em] uppercase text-white/20">Telemetry</h3>
                      <button onClick={() => setShowTelemetry(false)} className="text-white/20 hover:text-white transition-colors"><X size={14}/></button>
                   </div>
                   <div className="space-y-5">
                      <div className="hyperglass-pro p-6 rounded-[2rem] border border-white/5 bg-white/[0.01]">
                         <div className="flex justify-between items-center mb-6"><span className="text-[9px] font-black text-cyan-400">ATMO.SERVICE</span><CloudSun size={18} className="text-white/20" /></div>
                         <div className="text-5xl font-black text-white">24°</div>
                      </div>
                      <div className="hyperglass-pro p-6 rounded-[2rem] border border-white/5 bg-white/[0.01]">
                         <div className="flex justify-between items-center mb-6"><span className="text-[9px] font-black text-rose-500">KERNEL.LOAD</span><Activity size={18} className="text-white/20" /></div>
                         <div className="flex items-end gap-2"><span className="text-5xl font-black text-white">{telemetry.mem}</span><span className="text-sm font-black text-white/20 mb-2 uppercase">Cycles</span></div>
                      </div>
                      <div className="hyperglass-pro p-6 rounded-[2rem] border border-white/5 bg-white/[0.01]">
                         <div className="flex justify-between items-center mb-4"><span className="text-[9px] font-black text-emerald-500 uppercase">Net Stream</span><Signal size={18} className="text-white/20" /></div>
                         <div className="flex items-center gap-3">
                            <span className="text-2xl font-black text-white">{telemetry.net}</span>
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Mb/s</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex-1" />
                   <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-between"><div className="flex items-center gap-3"><Shield size={16} className="text-emerald-500" /><span className="text-[9px] font-bold text-white/40 uppercase">Safe Mode</span></div><div className="w-2 h-2 rounded-full bg-emerald-500" /></div>
                </motion.div>
             )}
          </AnimatePresence>
       </div>

       {/* LAUNCHPAD OVERLAY */}
       <AnimatePresence>
          {startOpen && !locked && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[1000] flex flex-col items-center p-20 bg-[#020205]/95 backdrop-blur-[100px] overflow-hidden">
                <div className="w-full max-w-6xl h-full overflow-y-auto scrollbar-hide py-20 px-10">
                   <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-16 justify-items-center">
                      {Object.keys(activeReg).map((id) => {
                         const app = activeReg[id]; const Ic = app.ic || Search;
                         return (
                           <motion.div key={`neu-${id}`} whileHover={{ scale: 1.1, y: -15 }} whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-5 cursor-pointer group" onClick={() => launchApp(id)}>
                              <div className={`w-28 h-28 rounded-[35%] flex items-center justify-center bg-gradient-to-br ${app.c} border border-white/10 shadow-2xl transition-all group-hover:shadow-cyan-500/20`}>
                                 <Ic size={48} className={app.t} />
                              </div>
                              <span className="text-[11px] font-black tracking-[0.3em] uppercase text-white/30 group-hover:text-cyan-400 transition-colors text-center">{app.n}</span>
                           </motion.div>
                         );
                      })}
                   </div>
                </div>
                <motion.button whileHover={{ scale: 1.1, rotate: 90 }} onClick={() => setStartOpen(false)} className="fixed top-12 left-12 w-16 h-16 rounded-full hyperglass-pro flex items-center justify-center text-white/30 border border-white/10 shadow-2xl z-[1100]"><X size={32} /></motion.button>
             </motion.div>
          )}
       </AnimatePresence>

       {/* LOCK SCREEN OVERLAY */}
       <AnimatePresence>
          {locked && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[2000] flex flex-col items-center justify-center bg-[#020205]/60 backdrop-blur-[60px]">
               <div className="text-center relative z-10">
                  <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-[10rem] font-black text-white/90 leading-none">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</motion.h1>
                  <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-2xl font-bold text-cyan-400/60 uppercase tracking-[0.5em] mt-6">{time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</motion.p>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setLocked(false)} className="w-24 h-24 rounded-full hyperglass-pro flex items-center justify-center cursor-pointer border border-white/20 shadow-2xl mx-auto mt-12"><Lock size={32} className="text-white/60" /></motion.div>
               </div>
             </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
}
