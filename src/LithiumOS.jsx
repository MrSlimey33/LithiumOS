import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Calculator, FileText, Settings, Store, CloudSun, Camera, Wifi, Battery, Search, Lock, Mic, Image as ImageIcon, Clock, Music, Terminal, Shield, Activity, LocateFixed, Globe, Palette, LogOut, ChevronLeft, X, Minus, Maximize2, Zap, Code2, Signal, Plus, Plane, Moon, Folder } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import All Apps
import TerminalApp from './apps/LinuxTerminal';
import { NotesApp, CalculatorApp, SettingsApp, VaultApp, ClockApp } from './apps/SystemApps';
import { SynthesiaApp, CameraApp, MemosApp, PhotosApp, CanvasApp } from './apps/MediaApps';
import { WeatherApp, BrowserApp, CpuApp, RadarApp } from './apps/NetworkApps';
import { StoreApp, DeveloperStudioApp } from './apps/StoreApps';
import { MusicApp, FileExplorerApp } from './apps/ExperienceApps';

const REG = {
  terminal: { n: 'Terminal', ic: Terminal, c: 'from-slate-900 to-black', t: 'text-cyan-400', d: 0, comp: TerminalApp, menus: ['Terminal', 'Edit', 'View', 'Search'] },
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

// ─── WINDOW COMPONENT V5.0 ───
function Window({ w, focus, close, min, max, children, constraintsRef, activeReg }) {
  if (w.min) return null;
  const Ic = w.ic;
  const reg = activeReg[w.id] || { n: 'Unknown' };
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(20px)' }}
      animate={{ 
        opacity: 1, scale: 1, y: 0, filter: 'blur(0px)',
        width: w.max ? '100%' : w.w, 
        height: w.max ? 'calc(100% - 28px)' : w.h, 
        x: w.max ? 0 : w.x, 
        y: w.max ? 28 : w.y,
        borderRadius: w.max ? '0px' : '14px'
      }}
      exit={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
      transition={{ type: "spring", stiffness: 350, damping: 30, mass: 0.8 }}
      drag={!w.max}
      dragConstraints={constraintsRef}
      dragMomentum={false}
      onDragStart={() => focus(w.id)}
      onMouseDown={() => focus(w.id)}
      className="absolute flex flex-col overflow-hidden will-change-transform shadow-2xl border border-white/10"
      style={{ 
        zIndex: w.z, 
        background: 'var(--q-window-bg)',
        backdropFilter: 'blur(40px) saturate(180%)',
        boxShadow: 'var(--q-window-shadow)',
        borderRadius: w.max ? '0' : '14px'
      }}
    >
      {/* Title Bar */}
      <div 
        className="h-10 flex items-center justify-between px-4 w-full cursor-grab active:cursor-grabbing shrink-0 select-none border-b border-white/5 bg-black/20"
      >
        <div className="flex gap-2.5 items-center">
           <button 
             onMouseDown={(e)=>{e.stopPropagation(); close(w.id)}} 
             className="w-3.5 h-3.5 rounded-full bg-white/5 hover:bg-red-500/80 transition-all flex items-center justify-center group border border-white/5"
           >
             <X size={8} className="text-white opacity-0 group-hover:opacity-100" />
           </button>
           <button 
             onMouseDown={(e)=>{e.stopPropagation(); min(w.id)}} 
             className="w-3.5 h-3.5 rounded-full bg-white/5 hover:bg-amber-500/80 transition-all flex items-center justify-center group border border-white/5"
           >
             <Minus size={8} className="text-white opacity-0 group-hover:opacity-100" />
           </button>
           <button 
             onMouseDown={(e)=>{e.stopPropagation(); max(w.id)}} 
             className="w-3.5 h-3.5 rounded-full bg-white/5 hover:bg-emerald-500/80 transition-all flex items-center justify-center group border border-white/5"
           >
             <Plus size={8} className="text-white opacity-0 group-hover:opacity-100" />
           </button>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 text-white/40 font-bold uppercase tracking-widest text-[9px] flex items-center gap-2">
          <Ic size={10} className="text-white/20"/> {reg.n}
        </div>
        <div className="w-16" />
      </div>
      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative bg-black/10" onMouseDown={e => e.stopPropagation()}>
        {children}
      </div>
      <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-[inherit]" />
    </motion.div>
  );
}

// ─── DOCK ITEM V5.0 ───
function DockItem({ id, app, isOpen, onClick, mouseX }) {
  const Ic = app.ic;
  const ref = useRef(null);
  
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });
  
  const widthSync = useTransform(distance, [-200, -80, 0, 80, 200], [56, 56, 76, 56, 56]);
  const width = useSpring(widthSync, { mass: 0.2, stiffness: 200, damping: 15 });
  const ySync = useTransform(distance, [-200, -80, 0, 80, 200], [0, -2, -14, -2, 0]);
  const y = useSpring(ySync, { mass: 0.2, stiffness: 200, damping: 15 });
  
  return (
    <motion.button 
      ref={ref}
      style={{ width, height: width, y }}
      onClick={onClick} 
      className="relative flex items-center justify-center cursor-pointer group z-40 shrink-0"
    >
      <motion.div 
        className={`absolute inset-0 rounded-[22%] bg-gradient-to-br ${app.c} border border-white/30`}
        style={{
          boxShadow: `
            inset 0 2px 6px rgba(255,255,255,0.25), 
            0 8px 16px rgba(0,0,0,0.3)
          `,
        }}
      />
      <Ic className={`relative z-10 ${app.t} drop-shadow-sm`} style={{ width: '55%', height: '55%' }} />
      {isOpen && <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/90 shadow-white shadow-sm" />}
      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-black/90 text-white text-[10px] px-2.5 py-1 rounded-md font-semibold transition-opacity pointer-events-none whitespace-nowrap border border-white/10" style={{ backdropFilter: 'blur(12px)' }}>{app.n}</div>
    </motion.button>
  );
}

// ─── DROPDOWN MENU ───
function DropdownMenu({ title, options, close }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -5, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="absolute top-full left-0 mt-1 w-52 py-2 z-[300] q-glass border-white/10 rounded-xl shadow-2xl"
    >
       {options.map((opt) => (
          <div 
            key={opt} 
            onClick={close} 
            className={`mx-1.5 px-3 py-1.5 text-[12px] cursor-pointer rounded-lg transition-colors ${opt.includes('Quit')?'text-rose-500 font-bold':'text-white/80 font-medium'} hover:bg-white/10 hover:text-white`}
          >
             {opt}
          </div>
       ))}
    </motion.div>
  )
}

// ─── MAIN OS COMPONENT ───
export default function LithiumOS({ previewMode = false }) {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [locked, setLocked] = useState(false);
  const [wins, setWins] = useState([]);
  const [apps, setApps] = useVDisk('apps_core', Object.keys(REG).slice(0, 8));
  const [startOpen, setStartOpen] = useState(false);
  const [q, setQ] = useState('');
  const [activeMenu, setActiveMenu] = useState(null); 
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeMobileApp, setActiveMobileApp] = useState(null);
  const containerRef = useRef(null);
  const [wallpaperIdx] = useState(Math.floor(Math.random() * 3));
  const mouseX = useMotionValue(Infinity);
  const [showControlCenter, setShowControlCenter] = useState(false);
  
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
  
  const focusApp = useCallback((id) => {
    setWins(ws => ws.map(w => w.id === id ? { ...w, z: Date.now(), min: false } : w).sort((a,b)=>a.z-b.z));
    setActiveMenu(null);
  }, []);
  
  const launchApp = useCallback((id, e) => {
    if(e) playSound('open', e);
    if (isMobile) { setActiveMobileApp(id); setStartOpen(false); return; }
    
    setWins(ws => {
      const ex = ws.find(w => w.id === id);
      if (ex) {
        setActiveMenu(null);
        return ws.map(w => w.id === id ? { ...w, z: Date.now(), min: false, max: false } : w).sort((a,b)=>a.z-b.z);
      }
      const wWidth = Math.min(900, window.innerWidth - 80);
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

  const renderCurrentApp = (id) => {
    const AppComp = activeReg[id]?.comp;
    if (!AppComp) return <div className="p-8 text-center bg-white/5 w-full h-full text-white/40">Module failed to load.</div>
    return <AppComp playSound={playSound} useVDisk={useVDisk} audioCtx={getAudioCtx()} ins={apps} setIns={setApps} un={(i) => setApps(apps.filter(x=>x!==i))} lock={()=>{setLocked(true);setWins([]); setActiveMobileApp(null)}} REG={activeReg} openDevStudio={()=>launchApp('devstudio', null)} />;
  };

  const handleLogout = () => {
     localStorage.removeItem('LITHIUM_CLOUD_ID');
     navigate('/login');
  };

  useEffect(() => {
     const handleDocClick = () => setActiveMenu(null);
     window.addEventListener('click', handleDocClick);
     return () => window.removeEventListener('click', handleDocClick);
  }, []);

  const activeWindow = wins.length > 0 && !wins[wins.length-1].min ? wins[wins.length-1] : null;
  const activeMenus = activeWindow && activeReg[activeWindow.id] ? activeReg[activeWindow.id].menus : ['File', 'Edit', 'View', 'Go', 'Window', 'Help'];
  const appName = activeWindow && activeReg[activeWindow.id] ? activeReg[activeWindow.id].n : 'Finder';

  if (isMobile && !previewMode) {
    return (
       <div className="absolute inset-0 bg-black overflow-hidden font-sans text-white select-none flex flex-col no-tap-highlight spatial-mesh">
          {/* SPATIAL STATUS HUB */}
          <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[300] flex items-center justify-center pointer-events-none">
             <motion.div 
               initial={{ width: 120, height: 36, opacity: 0 }} animate={{ width: showControlCenter ? 320 : 180, height: showControlCenter ? 400 : 36, opacity: 1 }}
               className="bg-black border border-white/10 rounded-[2.5rem] shadow-2xl flex items-center justify-between px-6 overflow-hidden relative pointer-events-auto"
               onClick={() => !showControlCenter && setShowControlCenter(true)}
             >
                <AnimatePresence mode="wait">
                   {!showControlCenter ? (
                      <motion.div key="status-min" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-between w-full">
                         <div className="flex items-center gap-2">
                           <span className="text-[11px] font-black tracking-tighter">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                         </div>
                         <div className="flex items-center gap-3">
                           <Wifi size={12} className="opacity-40" />
                           <Battery size={14} className="text-emerald-500" />
                         </div>
                      </motion.div>
                   ) : (
                      <motion.div key="status-max" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col gap-6 pt-8">
                         <div className="flex justify-between items-center px-2">
                            <h3 className="text-xl font-black italic tracking-tighter">Command</h3>
                            <button onClick={(e) => { e.stopPropagation(); setShowControlCenter(false); }} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><X size={16}/></button>
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                            <div className="refraction-tile rounded-[2rem] p-5 flex flex-col justify-between aspect-square">
                               <Wifi size={24} className="text-cyan-400" />
                               <div>
                                  <div className="text-sm font-black truncate">LITH_NET</div>
                                  <div className="text-[10px] font-bold opacity-40 uppercase">Linked</div>
                               </div>
                            </div>
                            <div className="refraction-tile rounded-[2rem] p-5 flex flex-col justify-between aspect-square">
                               <Battery size={24} className="text-emerald-400" />
                               <div>
                                  <div className="text-sm font-black">84%</div>
                                  <div className="text-[10px] font-bold opacity-40 uppercase">Optimal</div>
                               </div>
                            </div>
                         </div>
                         <button onClick={handleLogout} className="mt-4 w-full py-4 rounded-full bg-rose-500/10 text-rose-500 font-black tracking-tight border border-rose-500/20 active:scale-95 transition-transform flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest"><LogOut size={14}/> Terminate</button>
                      </motion.div>
                   )}
                </AnimatePresence>
             </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {activeMobileApp ? (
              <motion.div key="app-layer" initial={{ scale: 0.9, opacity:0, filter: 'blur(20px)' }} animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute inset-0 z-[150] bg-black flex flex-col overflow-hidden">
                 <div className="flex-1 overflow-hidden relative">{renderCurrentApp(activeMobileApp)}</div>
                 <div className="h-12 bg-black/50 backdrop-blur-xl flex items-center justify-center shrink-0 safe-bottom">
                    <motion.div whileTap={{ scale: 0.9 }} className="w-32 h-1.5 bg-white/30 rounded-full" onClick={() => setActiveMobileApp(null)}/>
                 </div>
              </motion.div>
            ) : (
              <motion.div key="home-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 relative z-10 flex flex-col px-6 pt-20 pb-40 overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-2 gap-4 mb-12">
                   <motion.div whileTap={{ scale: 0.98 }} className="refraction-tile rounded-[2.8rem] p-6 flex flex-col justify-between aspect-square">
                      <Clock size={24} className="text-white/40" />
                      <div>
                         <div className="text-5xl font-black tracking-tighter shimmer-text leading-none">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                         <div className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40 mt-2">{time.toLocaleDateString([], { weekday: 'short', day: 'numeric' })}</div>
                      </div>
                   </motion.div>
                   <div className="grid grid-rows-2 gap-4">
                      <motion.div whileTap={{ scale: 0.98 }} className="refraction-tile rounded-[2rem] p-5 flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shadow-lg"><CloudSun size={20} className="text-blue-400" /></div>
                         <div className="text-lg font-black tracking-tighter">24°</div>
                      </motion.div>
                      <motion.div whileTap={{ scale: 0.98 }} className="refraction-tile rounded-[2rem] p-5 flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shadow-lg"><Activity size={20} className="text-emerald-400" /></div>
                         <div className="text-lg font-black tracking-tighter">8.4k</div>
                      </motion.div>
                   </div>
                </div>
                <div className="grid grid-cols-4 gap-y-10 gap-x-4">
                   {apps.map(id => {
                      const a = activeReg[id];
                      if (!a) return null;
                      const Ic = a.ic || LucideIcons.Box;
                      return (
                         <motion.div whileTap={{ scale: 0.85 }} key={id} className="flex flex-col items-center gap-3 group" onClick={(e) => launchApp(id, e)}>
                            <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center bg-gradient-to-br ${a.c} ${a.t} shadow-2xl border border-white/20 relative group-active:brightness-125 transition-all`}>
                               <Ic size={28} className="drop-shadow-xl" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/50 text-center truncate w-full">{a.n}</span>
                         </motion.div>
                      )
                   })}
                </div>
                <div className="fixed bottom-10 left-6 right-6 h-28 refraction-tile rounded-[3.5rem] flex items-center justify-around px-6 z-[100] border-white/20">
                   {['browser', 'notes', 'terminal', 'vault'].map(id => {
                      const a = activeReg[id];
                      if(!a) return null;
                      const Ic = a.ic;
                      return (
                        <motion.div whileTap={{ scale: 0.85, y: -10 }} key={`dock-${id}`} className={`w-16 h-16 rounded-[1.6rem] flex items-center justify-center bg-gradient-to-br ${a.c} ${a.t} shadow-2xl border border-white/20 transition-all`} onClick={(e) => launchApp(id, e)}>
                           <Ic size={28} className="drop-shadow-lg" />
                        </motion.div>
                      )
                   })}
                </div>
                <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-40 h-1.5 bg-white/10 rounded-full z-[110]" />
              </motion.div>
            )}
          </AnimatePresence>
       </div>
    );
  }

  // ─── DESKTOP RENDER ───
  return (
    <div className="absolute inset-0 overflow-hidden font-sans text-white/90 flex flex-col text-sm select-none spatial-mesh" ref={containerRef}>
      {/* MENU BAR */}
      <div 
        className="h-7 flex justify-between px-4 z-[200] items-center relative select-none border-b border-white/5 bg-black/40 backdrop-blur-3xl"
      >
         <div className="flex items-center h-full text-[12px]">
            <div className="relative h-full flex items-center mr-4">
              <button 
                onClick={(e)=>{e.stopPropagation(); setActiveMenu('logo')}} 
                className={`flex items-center gap-2 px-2 h-5 rounded-md transition-all font-black ${activeMenu === 'logo' ? 'bg-white/10 text-cyan-400' : 'hover:bg-white/5'}`}
              >
                 <Zap size={14} className="fill-cyan-500 text-cyan-500" />
                 <span className="tracking-tighter uppercase">{appName === 'Finder' ? 'Lithium' : appName}</span>
              </button>
              <AnimatePresence>
                 {activeMenu === 'logo' && <DropdownMenu title="Lithium" options={['About Lithium', 'System Preferences', 'Lock Screen', 'Log Out']} close={()=>{if(activeWindow) closeApp(activeWindow.id); setActiveMenu(null);}} />}
              </AnimatePresence>
            </div>
            {activeMenus.map((menu) => (
               <div key={menu} className="relative h-full flex items-center">
                 <button onClick={(e)=>{e.stopPropagation(); setActiveMenu(menu)}} className={`px-2 h-5 rounded-md transition-all font-bold tracking-tight text-white/60 ${activeMenu === menu ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'}`}>{menu}</button>
                 <AnimatePresence>
                    {activeMenu === menu && <DropdownMenu title={menu} options={['New Window', 'Preferences', 'Help Center']} close={()=>{setActiveMenu(null)}} />}
                 </AnimatePresence>
               </div>
            ))}
         </div>
          <div className="flex gap-4 h-full items-center px-1">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowControlCenter(!showControlCenter) }}
              className={`flex gap-2 px-2.5 h-5 rounded-md items-center transition-all ${showControlCenter ? 'bg-white/10 text-cyan-400' : 'hover:bg-white/5 text-white/60'}`}
            >
               <Wifi size={13}/><Battery size={14} className="text-emerald-500" />
            </button>
            <span className="font-bold text-[11px] tracking-widest uppercase text-white/40">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          
          <AnimatePresence>
             {showControlCenter && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute top-9 right-4 w-80 q-glass rounded-2xl p-6 z-[300] shadow-2xl border-white/10"
                  onClick={e => e.stopPropagation()}
                >
                   <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-cyan-600 rounded-2xl p-4 flex flex-col justify-between aspect-[1.8/1] shadow-lg shadow-cyan-600/20">
                         <Wifi size={20} />
                         <span className="text-[10px] font-black uppercase tracking-widest">LITH_NET_5G</span>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-4 flex flex-col justify-between aspect-[1.8/1] border border-white/10">
                         <Activity size={20} className="text-emerald-400" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Optimal</span>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="space-y-2">
                         <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/30">Brightness</div>
                         <div className="h-4 bg-white/5 rounded-full relative overflow-hidden ring-1 ring-white/5"><div className="absolute inset-y-0 left-0 bg-white/20 w-3/4" /></div>
                      </div>
                      <div className="space-y-2">
                         <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/30">Volume</div>
                         <div className="h-4 bg-white/5 rounded-full relative overflow-hidden ring-1 ring-white/5"><div className="absolute inset-y-0 left-0 bg-cyan-500/50 w-1/2" /></div>
                      </div>
                   </div>
                   <button onClick={handleLogout} className="mt-8 w-full py-3.5 rounded-xl bg-rose-500/10 text-rose-500 font-black tracking-[0.2em] border border-rose-500/20 active:scale-95 transition-transform text-[9px] uppercase">Terminate Link</button>
                </motion.div>
             )}
          </AnimatePresence>
      </div>

      {/* DESKTOP AREA */}
      <div className="flex-1 relative overflow-hidden" style={{ background: 'var(--q-void)' }}>
        <div className="absolute inset-0 noise-overlay opacity-[0.03]" />
        <div className="absolute inset-0 grid-pattern opacity-[0.02]" />

        {/* DESKTOP ICONS */}
        <div className="absolute top-8 right-8 flex flex-col gap-8 z-0 items-end">
           {apps.slice(0, 4).map(id => {
             const a = activeReg[id]; if (!a) return null; const Ic = a.ic;
             return (
               <motion.div drag dragMomentum={false} initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} key={`desktop-${id}`} className="flex flex-col items-center gap-2 cursor-pointer w-20 group" onDoubleClick={(e)=>launchApp(id, e)}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${a.c} border border-white/20 shadow-2xl transition-all group-hover:scale-110 group-active:scale-95`}>
                    <Ic size={28} className={`${a.t} drop-shadow-lg`} />
                  </div>
                  <span className="text-[10px] font-bold text-white/40 group-hover:text-white/80 transition-colors uppercase tracking-widest">{a.n}</span>
               </motion.div>
             )
           })}
        </div>
        
        {/* WINDOWS */}
        <AnimatePresence>
           {!locked && wins.map(w => (
             <Window key={w.id} w={w} focus={focusApp} close={closeApp} min={minApp} max={maxApp} constraintsRef={containerRef} activeReg={activeReg}>
               {renderCurrentApp(w.id)}
             </Window>
           ))}
        </AnimatePresence>

        {/* FLOATING DOCK */}
        <motion.div
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[150] flex items-end"
        >
           <div className="px-4 py-3 flex items-end gap-3 dock-glass rounded-[2.5rem]">
              <motion.button 
                whileHover={{ y: -6, scale: 1.08 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={(e)=>{playSound('click', e); setStartOpen(!startOpen);}} 
                className="w-14 h-14 rounded-[1.6rem] flex items-center justify-center cursor-pointer relative group z-50 shrink-0 border border-white/10 bg-white/5 shadow-2xl"
                style={{ originY: 1 }}
              >
                 <Search size={26} className="text-white/70" />
                 <div className="absolute -top-12 opacity-0 group-hover:opacity-100 bg-black/90 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold tracking-widest uppercase transition-opacity pointer-events-none border border-white/20 shadow-2xl" style={{ backdropFilter: 'blur(12px)' }}>Kernel</div>
              </motion.button>
              <div className="w-[1px] h-8 bg-white/10 mx-1 rounded-full self-center mb-3"/>
              {apps.slice(0, 8).map((id) => {
                const a = activeReg[id]; 
                if (!a) return null;
                const isOpen = wins.find(w=>w.id===id && !w.min);
                return <DockItem key={`dock-${id}`} id={id} app={a} isOpen={isOpen} mouseX={mouseX} onClick={(e)=>{launchApp(id,e); if(isOpen&&isOpen.min)focusApp(id)}} />;
              })}
           </div>
        </motion.div>

        {/* LAUNCHPAD */}
        <AnimatePresence>
           {startOpen && !locked && (
              <motion.div 
                initial={{ opacity: 0, backdropFilter: 'blur(0px)' }} animate={{ opacity: 1, backdropFilter: 'blur(80px)' }} exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                className="absolute inset-0 z-[160] flex flex-col items-center justify-center p-12 bg-black/60"
              >
                 <div className="w-full max-w-2xl mb-20 relative">
                    <input 
                      autoFocus value={q} onChange={e=>setQ(e.target.value)} type="text"
                      className="w-full bg-white/5 border border-white/10 text-white text-3xl font-black py-6 px-16 rounded-[2rem] text-center outline-none focus:border-cyan-500/50 transition-all placeholder-white/20 tracking-tighter shadow-2xl" 
                      placeholder="SEARCH SYSTEM"
                    />
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={32}/>
                 </div>
                 <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-y-12 gap-x-8 max-w-5xl w-full">
                    {Object.keys(activeReg).filter(x => activeReg[x].n.toLowerCase().includes(q.toLowerCase())).map((id) => {
                      const app = activeReg[id]; const Ic = app.ic || LucideIcons.Box;
                      return (
                        <div key={`launch-${id}`} className="cursor-pointer group flex flex-col items-center gap-4" onClick={(e) => launchApp(id, e)}>
                          <div className={`w-20 h-20 flex items-center justify-center rounded-[2rem] transition-all group-hover:scale-110 active:scale-90 bg-gradient-to-br ${app.c} border border-white/20 shadow-2xl relative overflow-hidden`}>
                             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                             <Ic size={38} className={app.t} />
                          </div>
                          <span className="text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-widest text-center">{app.n}</span>
                        </div>
                      );
                    })}
                 </motion.div>
                 <button className="fixed top-12 left-12 w-14 h-14 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-all group" onClick={()=>setStartOpen(false)}><X size={24} className="text-white/40 group-hover:text-white group-hover:rotate-90 transition-all"/></button>
              </motion.div>
           )}
        </AnimatePresence>

        {/* LOCK SCREEN */}
        <AnimatePresence>
           {locked && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[250] flex flex-col items-center justify-center bg-black/40 backdrop-blur-[100px] saturate-150">
               <div className="z-10 flex flex-col items-center gap-12">
                  <div className="text-center">
                     <h1 className="text-[10rem] leading-none font-black tracking-tighter text-white shimmer-text">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</h1>
                     <p className="text-2xl font-black text-white/40 uppercase tracking-[0.4em] mt-8">{time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 180 }} whileTap={{ scale: 0.9 }} 
                    className="w-24 h-24 rounded-full flex items-center justify-center bg-white/10 border border-white/20 backdrop-blur-3xl shadow-2xl mt-12 group transition-all"
                    onClick={() => setLocked(false)}
                  >
                     <Lock size={32} className="text-white group-hover:text-cyan-400 transition-colors" />
                  </motion.button>
               </div>
             </motion.div>
           )}
        </AnimatePresence>
      </div>
    </div>
  );
}
