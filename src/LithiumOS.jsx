import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Calculator, FileText, Settings, Store, CloudSun, Camera, Wifi, Battery, Search, Lock, Mic, Image as ImageIcon, Clock, Music, Terminal, Shield, Activity, LocateFixed, Globe, Palette, LogOut, ChevronLeft, X, Minus, Maximize2, Zap, Code2, Signal, Plus, Plane, Moon } from 'lucide-react';
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

// ===== ENHANCED WINDOW COMPONENT =====
function Window({ w, focus, close, min, max, children, constraintsRef }) {
  if (w.min) return null;
  const Ic = w.ic;
  const reg = REG[w.id];
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.85, y: 30, filter: 'blur(8px)' }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)',
                 width: w.max ? '100%' : w.w, 
                 height: w.max ? '100.2%' : w.h, 
                 x: w.max ? 0 : w.x, 
                 y: w.max ? 0 : w.y,
                 borderRadius: w.max ? '0px' : '16px'
      }}
      exit={{ opacity: 0, scale: 0.85, y: 30, filter: 'blur(8px)' }}
      transition={{ type: "spring", stiffness: 400, damping: 35, mass: 0.8 }}
      drag={!w.max}
      dragConstraints={constraintsRef}
      dragMomentum={false}
      dragElastic={0.05}
      onDragStart={() => focus(w.id)}
      onMouseDown={() => focus(w.id)}
      className="absolute flex flex-col overflow-hidden will-change-transform"
      style={{ 
        zIndex: w.z, 
        position: 'absolute',
        background: 'rgba(245, 245, 248, 0.78)',
        backdropFilter: 'blur(60px) saturate(180%)',
        WebkitBackdropFilter: 'blur(60px) saturate(180%)',
        boxShadow: `
          0 0 0 0.5px rgba(0,0,0,0.08),
          0 2px 8px rgba(0,0,0,0.06),
          0 12px 40px rgba(0,0,0,0.12),
          0 40px 100px rgba(0,0,0,0.08)
        `,
        border: '0.5px solid rgba(255,255,255,0.65)',
      }}
    >
      {/* Title Bar */}
      <div 
        className="h-12 flex items-center justify-between px-4 w-full cursor-grab active:cursor-grabbing shrink-0 select-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(245,245,250,0.5) 100%)',
          borderBottom: '0.5px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex gap-2 items-center">
           <button 
             onMouseDown={(e)=>{e.stopPropagation(); playSound('click',e); close(w.id)}} 
             className="w-3 h-3 rounded-full bg-[#ff5f57] flex items-center justify-center group hover:brightness-110 active:brightness-90 transition-all"
             style={{ boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.12)' }}
           >
             <X size={7} className="text-[#4a0002] opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={3} />
           </button>
           <button 
             onMouseDown={(e)=>{e.stopPropagation(); playSound('click',e); min(w.id)}} 
             className="w-3 h-3 rounded-full bg-[#febc2e] flex items-center justify-center group hover:brightness-110 active:brightness-90 transition-all"
             style={{ boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.12)' }}
           >
             <Minus size={7} className="text-[#995700] opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={3} />
           </button>
           <button 
             onMouseDown={(e)=>{e.stopPropagation(); playSound('click',e); max(w.id)}} 
             className="w-3 h-3 rounded-full bg-[#28c840] flex items-center justify-center group hover:brightness-110 active:brightness-90 transition-all"
             style={{ boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.12)' }}
           >
             <Plus size={7} className="text-[#006500] opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={3} />
           </button>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 text-[#3d3d44] font-semibold tracking-wide text-[11px] flex items-center gap-1.5 select-none">
          <Ic size={11} className="opacity-50"/>{reg.n}
        </div>
        <div className="w-14"/>
      </div>
      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative bg-white/50" style={{ borderRadius: w.max ? '0' : '0 0 16px 16px' }} onMouseDown={e => e.stopPropagation()}>{children}</div>
    </motion.div>
  );
}

// ===== PHYSICS DOCK ITEM =====
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
            inset 0 -1px 4px rgba(0,0,0,0.1),
            0 4px 16px rgba(0,0,0,0.15),
            0 1px 3px rgba(0,0,0,0.1)
          `,
        }}
      />
      <Ic className={`relative z-10 ${app.t} drop-shadow-sm`} style={{ width: '55%', height: '55%' }} />
      {isOpen && <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/90" style={{ boxShadow: '0 0 4px rgba(255,255,255,0.7)' }} />}
      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-[#1a1a2e]/95 text-white text-[10px] px-2.5 py-1 rounded-md font-semibold transition-opacity pointer-events-none whitespace-nowrap" style={{ backdropFilter: 'blur(12px)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>{app.n}</div>
    </motion.button>
  );
}

// ===== CONTEXT MENU =====
function DropdownMenu({ title, options, close }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -5, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="absolute top-full left-0 mt-0.5 w-52 py-1.5 z-[300]"
      style={{
        background: 'rgba(248, 248, 252, 0.92)',
        backdropFilter: 'blur(50px) saturate(200%)',
        WebkitBackdropFilter: 'blur(50px) saturate(200%)',
        borderRadius: '10px',
        border: '0.5px solid rgba(0,0,0,0.08)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15), 0 0 0 0.5px rgba(0,0,0,0.05)',
      }}
    >
       {options.map((opt) => (
          <div 
            key={opt} 
            onClick={close} 
            className={`mx-1.5 px-3 py-1 text-[13px] cursor-pointer rounded-md transition-colors ${opt==='Quit App'?'text-rose-500 font-semibold':'text-[#1d1d1f] font-medium'} hover:bg-blue-500 hover:text-white`}
          >
             {opt}
          </div>
       ))}
    </motion.div>
  )
}

// ===== MAIN OS COMPONENT =====
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

  const renderCurrentApp = (id) => {
    const AppComp = REG[id]?.comp;
    if (!AppComp) return <div className="p-8 text-center bg-white/50 w-full h-full text-slate-500">Module failed to load.</div>
    return <AppComp playSound={playSound} useVDisk={useVDisk} audioCtx={getAudioCtx()} ins={apps} setIns={setApps} un={(i) => setApps(apps.filter(x=>x!==i))} lock={()=>{setLocked(true);setWins([]); setActiveMobileApp(null)}} REG={REG} openDevStudio={()=>launchApp('devstudio', null)} />;
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
  const activeMenus = activeWindow ? REG[activeWindow.id].menus : ['File', 'Edit', 'View', 'Go', 'Window', 'Help'];
  const appName = activeWindow ? REG[activeWindow.id].n : 'Finder';

  // ------------------- MOBILE RENDER -------------------
  if (isMobile && !previewMode) {
    return (
       <div className="absolute inset-0 bg-[#0c0c0e] overflow-hidden font-sans text-slate-100 select-none flex flex-col no-tap-highlight" style={{ backgroundImage: `url(${wallpapers[wallpaperIdx]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 backdrop-blur-md bg-black/40" />
          
          {/* MOBILE STATUS BAR */}
          <div className="h-10 flex items-center justify-between px-6 z-[160] text-white text-[12px] font-bold tracking-tight safe-top" onClick={() => setShowControlCenter(true)}>
             <div className="flex items-center gap-1">
                <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                <Signal size={12} className="opacity-80"/>
             </div>
             <div className="flex gap-2 items-center">
                <Wifi size={14} className="opacity-80"/>
                <div className="flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded-full border border-white/20">
                   <span className="text-[10px]">84%</span>
                   <Battery size={14} className="text-emerald-400" />
                </div>
             </div>
          </div>

          <AnimatePresence mode="wait">
            {activeMobileApp ? (
              <motion.div key="app-layer" initial={{ x: '100%', filter: 'brightness(1.5)' }} animate={{ x: 0, filter: 'brightness(1)' }} exit={{ x: '100%', opacity: 0 }} transition={{ type: "spring", damping: 28, stiffness: 220, mass: 1 }} className="absolute inset-x-0 bottom-0 top-0 z-[150] bg-white flex flex-col shadow-2xl overflow-hidden">
                 <div className="h-14 bg-white/95 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-4 z-50 shrink-0 safe-top">
                    <button onClick={() => setActiveMobileApp(null)} className="flex items-center gap-0.5 text-blue-600 font-bold active:bg-blue-50 px-3 py-1.5 rounded-2xl transition-colors"><ChevronLeft size={22}/> Back</button>
                    <span className="font-extrabold text-slate-900 text-[15px] tracking-tight">{REG[activeMobileApp].n}</span>
                    <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900" onClick={() => setActiveMobileApp(null)}><X size={20}/></button>
                 </div>
                 <div className="flex-1 overflow-hidden bg-slate-50 relative">{renderCurrentApp(activeMobileApp)}</div>
                 <div className="h-8 bg-white flex items-center justify-center shrink-0 safe-bottom">
                    <div className="w-32 h-1.5 bg-slate-200 rounded-full active:bg-slate-400 transition-colors" onClick={() => setActiveMobileApp(null)}/>
                 </div>
              </motion.div>
            ) : (
              <motion.div key="home-layer" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.05, opacity: 0 }} className="flex-1 relative z-10 flex flex-col p-6 overflow-y-auto scrollbar-hide pt-4">
                
                {/* WIDGETS SECTION */}
                <div className="grid grid-cols-2 gap-4 mb-10 mt-4">
                   <motion.div whileTap={{ scale: 0.98 }} className="glass-dark aspect-square rounded-[2.5rem] p-5 flex flex-col justify-between">
                      <Clock size={24} className="text-blue-400" />
                      <div>
                         <div className="text-4xl font-bold tracking-tighter">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                         <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                      </div>
                   </motion.div>
                   <div className="flex flex-col gap-4">
                      <motion.div whileTap={{ scale: 0.98 }} className="glass-dark flex-1 rounded-[2.5rem] p-5 flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center"><CloudSun size={20} className="text-blue-400" /></div>
                         <div>
                            <div className="text-lg font-bold leading-none">24°C</div>
                            <div className="text-[10px] font-bold text-white/40 uppercase">Mostly Clear</div>
                         </div>
                      </motion.div>
                      <motion.div whileTap={{ scale: 0.98 }} className="glass-dark flex-1 rounded-[2.5rem] p-5 flex items-center gap-4 text-emerald-400">
                         <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center"><Activity size={20} /></div>
                         <div>
                            <div className="text-lg font-bold leading-none">8.4k</div>
                            <div className="text-[10px] font-bold text-white/40 uppercase">Kernels/s</div>
                         </div>
                      </motion.div>
                   </div>
                </div>

                <div className="mb-8 px-2 flex justify-between items-end">
                   <div>
                      <h2 className="text-3xl font-black tracking-tighter leading-none italic">Lithium</h2>
                      <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mt-1">Founders Edition v4.2</p>
                   </div>
                   <button onClick={() => setShowControlCenter(true)} className="w-10 h-10 rounded-full glass flex items-center justify-center text-white"><Settings size={18} /></button>
                </div>

                <div className="grid grid-cols-4 gap-y-8 gap-x-4 mb-32">
                   {Object.keys(REG).map(id => {
                      const a = REG[id]; const Ic = a.ic;
                      return (
                         <motion.div whileTap={{ scale: 0.9 }} key={id} className="flex flex-col items-center gap-2 group" onClick={(e) => launchApp(id, e)}>
                            <div className={`w-16 h-16 rounded-[1.6rem] flex items-center justify-center bg-gradient-to-br ${a.c} ${a.t} shadow-[0_12px_24px_rgba(0,0,0,0.4),inset_0_2px_10px_rgba(255,255,255,0.25)] border border-white/20 relative group-active:brightness-110 transition-all`}>
                               <Ic size={30} className="drop-shadow-lg" />
                               {id === 'devstudio' && <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-[#1a1a2e] flex items-center justify-center"><Zap size={10} className="text-white fill-white" /></div>}
                            </div>
                            <span className="text-[10px] font-bold text-white/80 text-center tracking-tight px-1 truncate w-full">{a.n}</span>
                         </motion.div>
                      )
                   })}
                </div>

                {/* MOBILE DOCK */}
                <div className="fixed bottom-8 left-6 right-6 h-24 glass rounded-[3rem] flex items-center justify-around px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] border-white/30 backdrop-blur-3xl">
                   {['browser', 'notes', 'terminal', 'vault'].map(id => {
                      const a = REG[id]; const Ic = a.ic;
                      return (
                        <motion.div whileTap={{ scale: 0.85, y: -8 }} key={`dock-${id}`} className={`w-16 h-16 rounded-[1.4rem] flex items-center justify-center bg-gradient-to-br ${a.c} ${a.t} shadow-xl border border-white/30 transition-transform`} onClick={(e) => launchApp(id, e)}>
                           <Ic size={28} className="drop-shadow-md" />
                        </motion.div>
                      )
                   })}
                </div>

                {/* VISUAL HOME INDICATOR */}
                <div className="fixed bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/20 rounded-full z-[110]" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* MOBILE CONTROL CENTER */}
          <AnimatePresence>
             {showControlCenter && (
                <motion.div 
                  initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
                  className="absolute inset-0 z-[200] glass-dark backdrop-blur-3xl p-8 pt-16 flex flex-col gap-8"
                >
                   <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-black italic tracking-tighter">Command Center</h3>
                      <button onClick={() => setShowControlCenter(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><X size={20}/></button>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-600 rounded-3xl p-6 flex flex-col justify-between aspect-square shadow-lg shadow-blue-500/20">
                         <Wifi size={32} />
                         <div>
                            <div className="text-lg font-bold">LITH_NET_5G</div>
                            <div className="text-xs font-bold opacity-60">Connected</div>
                         </div>
                      </div>
                      <div className="bg-slate-800 rounded-3xl p-6 flex flex-col justify-between aspect-square">
                         <Battery size={32} className="text-emerald-400" />
                         <div>
                            <div className="text-lg font-bold">84%</div>
                            <div className="text-xs font-bold opacity-40">Power Optimal</div>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-4 gap-4">
                      {[Signal, Plane, Search, Moon].map((Ic, i) => (
                         <div key={i} className="aspect-square rounded-2xl bg-white/5 flex items-center justify-center active:bg-white/20 transition-colors"><Ic size={24} className="text-white/60" /></div>
                      ))}
                   </div>

                   <div className="space-y-6 mt-4">
                      <div className="space-y-2">
                         <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase opacity-40">Brightness</div>
                         <div className="h-6 bg-white/10 rounded-full relative overflow-hidden">
                            <div className="absolute inset-y-0 left-0 bg-white/30 w-3/4 rounded-full" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase opacity-40">Audio Output</div>
                         <div className="h-6 bg-white/10 rounded-full relative overflow-hidden">
                            <div className="absolute inset-y-0 left-0 bg-blue-500/50 w-1/2 rounded-full" />
                         </div>
                      </div>
                   </div>

                   <button onClick={handleLogout} className="mt-auto w-full py-5 rounded-3xl bg-rose-500/20 text-rose-500 font-black tracking-tight border border-rose-500/30 active:scale-95 transition-transform flex items-center justify-center gap-3"><LogOut size={20}/> TERM_SESSION</button>
                </motion.div>
             )}
          </AnimatePresence>
       </div>
    );
  }

  // ------------------- DESKTOP RENDER -------------------
  return (
    <div className="absolute inset-0 overflow-hidden font-sans text-slate-800 flex flex-col text-sm select-none" ref={containerRef} style={{ background: '#e8e8ed' }}>
      {/* MENU BAR */}
      <div 
        className="h-[28px] flex justify-between px-3 z-[200] text-[#1d1d1f] items-center relative select-none"
        style={{
          background: 'rgba(245, 245, 248, 0.78)',
          backdropFilter: 'blur(60px) saturate(180%)',
          WebkitBackdropFilter: 'blur(60px) saturate(180%)',
          borderBottom: '0.5px solid rgba(0,0,0,0.08)',
          boxShadow: '0 0.5px 2px rgba(0,0,0,0.04)',
        }}
      >
         <div className="flex items-center h-full text-[13px]">
            <div className="relative h-full flex items-center">
              <button onClick={(e)=>{e.stopPropagation(); setActiveMenu('logo')}} className={`flex items-center gap-1.5 px-2 h-5 rounded-[4px] transition-colors font-bold ${activeMenu === 'logo' ? 'bg-blue-500 text-white' : 'hover:bg-black/5'}`}>
                 <div className="w-3.5 h-3.5 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-[3px] flex items-center justify-center" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }}><div className="w-1.5 h-1.5 bg-white rounded-[1px] opacity-60"/></div>
                 <span className="font-semibold">{appName}</span>
              </button>
              <AnimatePresence>
                 {activeMenu === 'logo' && <DropdownMenu title={appName} options={['About '+appName, 'Preferences...', 'Hide', 'Quit App']} close={()=>{if(activeWindow) closeApp(activeWindow.id); setActiveMenu(null);}} />}
              </AnimatePresence>
            </div>
            {activeMenus.map((menu) => (
               <div key={menu} className="relative h-full flex items-center">
                 <button onClick={(e)=>{e.stopPropagation(); setActiveMenu(menu)}} className={`px-2 h-5 rounded-[4px] transition-colors font-medium ${activeMenu === menu ? 'bg-blue-500 text-white' : 'hover:bg-black/5'}`}>{menu}</button>
                 <AnimatePresence>
                    {activeMenu === menu && <DropdownMenu title={menu} options={['New', 'Open', 'Save', 'Duplicate', 'Details']} close={()=>{setActiveMenu(null)}} />}
                 </AnimatePresence>
               </div>
            ))}
         </div>
          <div className="flex gap-3 h-full items-center px-1">
            {!previewMode && <button onClick={handleLogout} className="hover:bg-black/5 px-2 h-5 rounded-[4px] flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity text-[12px] font-medium"><LogOut size={12}/> Quit</button>}
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'control' ? null : 'control') }}
              className={`flex gap-2 px-2 h-5 rounded-[4px] items-center transition-colors ${activeMenu === 'control' ? 'bg-blue-500 text-white' : 'hover:bg-black/5 opacity-80 hover:opacity-100'}`}
            >
               <Wifi size={13}/><Battery size={14} />
            </button>
            <span className="font-medium text-[12px] tracking-tight opacity-90">{time.toLocaleString([], { weekday: 'short', month:'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          
          <AnimatePresence>
             {activeMenu === 'control' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute top-[32px] right-3 w-80 glass-dark rounded-2xl p-6 z-[300] shadow-2xl border-white/10"
                  onClick={e => e.stopPropagation()}
                >
                   <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-blue-600 rounded-2xl p-4 flex flex-col justify-between aspect-video">
                         <Wifi size={20} />
                         <span className="text-xs font-bold truncate">LITH_NET_5G</span>
                      </div>
                      <div className="bg-white/10 rounded-2xl p-4 flex flex-col justify-between aspect-video">
                         <Activity size={20} className="text-emerald-400" />
                         <span className="text-xs font-bold">8.4k K/s</span>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="space-y-1.5">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-40">Brightness</div>
                         <div className="h-4 bg-white/10 rounded-full relative overflow-hidden"><div className="absolute inset-y-0 left-0 bg-white/40 w-3/4 rounded-full" /></div>
                      </div>
                      <div className="space-y-1.5">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-40">Output Volume</div>
                         <div className="h-4 bg-white/10 rounded-full relative overflow-hidden"><div className="absolute inset-y-0 left-0 bg-blue-500/60 w-1/2 rounded-full" /></div>
                      </div>
                   </div>
                   <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-4 gap-2">
                       {[Music, Camera, Shield, Plane, Moon, Settings].map((Ic, i) => (
                          <button key={i} className="aspect-square rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"><Ic size={18} className="opacity-60" /></button>
                       ))}
                   </div>
                </motion.div>
             )}
          </AnimatePresence>
      </div>

      {/* DESKTOP AREA */}
      <div className="flex-1 relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${wallpapers[wallpaperIdx]})` }}>
        {/* Subtle overlay */}
        <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(0.5px)' }} />

        {/* DESKTOP ICONS */}
        <div className="absolute top-6 right-6 flex flex-col gap-6 z-0 items-end">
           {apps.slice(0, 4).map(id => {
             const a = REG[id]; if (!a) return null; const Ic = a.ic;
             return (
               <motion.div drag dragMomentum={false} initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} key={`desktop-${id}`} className="flex flex-col items-center gap-1.5 cursor-pointer w-20 group relative" onDoubleClick={(e)=>launchApp(id, e)}>
                  <div 
                    className="w-14 h-14 rounded-[13px] flex items-center justify-center transition-all group-active:scale-95"
                    style={{
                      background: 'rgba(255,255,255,0.35)',
                      backdropFilter: 'blur(20px)',
                      border: '0.5px solid rgba(255,255,255,0.5)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
                    }}
                  >
                    <Ic size={28} className="text-slate-800 opacity-75" />
                  </div>
                  <span className="text-[10px] font-semibold text-white text-center drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(8px)' }}>{a.n}</span>
               </motion.div>
             )
           })}
        </div>
        
        {/* WINDOWS */}
        <AnimatePresence>
           {!locked && wins.map(w => (
             <Window key={w.id} w={w} focus={focusApp} close={closeApp} min={minApp} max={maxApp} constraintsRef={containerRef}>
               {renderCurrentApp(w.id)}
             </Window>
           ))}
        </AnimatePresence>

        {/* FLOATING DOCK */}
        <motion.div
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[150] flex items-end"
        >
           <div 
             className="px-2.5 py-1.5 flex items-end gap-1.5"
             style={{
               background: 'rgba(245, 245, 250, 0.35)',
               backdropFilter: 'blur(40px) saturate(200%)',
               WebkitBackdropFilter: 'blur(40px) saturate(200%)',
               borderRadius: '20px',
               border: '0.5px solid rgba(255,255,255,0.45)',
               boxShadow: `
                 0 0 0 0.5px rgba(0,0,0,0.05),
                 0 8px 32px rgba(0,0,0,0.12),
                 0 30px 60px rgba(0,0,0,0.06)
               `,
             }}
           >
             <motion.button 
               style={{ originY: 1 }}
               whileHover={{ y: -6, scale: 1.08 }} 
               whileTap={{ scale: 0.95 }} 
               onClick={(e)=>{playSound('click', e); setStartOpen(!startOpen);}} 
               className="w-14 h-14 rounded-[22%] flex items-center justify-center cursor-pointer relative group z-50 shrink-0"
               style={{
                 background: 'rgba(255,255,255,0.9)',
                 boxShadow: 'inset 0 2px 6px rgba(255,255,255,0.5), 0 4px 16px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)',
                 border: '0.5px solid rgba(255,255,255,0.6)',
               }}
             >
                <Search size={26} className="text-slate-700" />
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-[#1a1a2e]/95 text-white text-[10px] px-2.5 py-1 rounded-md font-semibold transition-opacity pointer-events-none whitespace-nowrap" style={{ backdropFilter: 'blur(12px)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>Launchpad</div>
             </motion.button>              <div className="w-[0.5px] h-10 bg-black/10 mx-1 rounded-full self-center"/>
              {['browser', 'notes', 'files', 'music', 'terminal', 'vault', 'calc', 'devstudio', 'settings'].map((id) => {
                const a = REG[id]; 
                const isOpen = wins.find(w=>w.id===id && !w.min);
                return (
                  <DockItem 
                    key={`dock-${id}`} 
                    id={id} 
                    app={a} 
                    isOpen={isOpen}
                    mouseX={mouseX}
                    onClick={(e)=>{launchApp(id,e); if(isOpen&&isOpen.min)focusApp(id)}} 
                  />
                );
              })}
           </div>
        </motion.div>

        {/* LAUNCHPAD OVERLAY */}
        <AnimatePresence>
           {startOpen && !locked && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                transition={{ duration: 0.25 }} 
                className="absolute inset-0 z-[160] flex flex-col items-center justify-center p-12 overflow-y-auto"
                style={{
                  background: 'rgba(15, 15, 25, 0.55)',
                  backdropFilter: 'blur(80px) saturate(120%)',
                  WebkitBackdropFilter: 'blur(80px) saturate(120%)',
                }}
              >
                 <div className="w-full max-w-3xl mb-16 relative flex justify-center mt-10 shrink-0">
                    <input 
                      autoFocus value={q} onChange={e=>setQ(e.target.value)} type="text" spellCheck="false"
                      className="w-[90%] text-white text-2xl font-medium py-4 px-14 rounded-xl text-center outline-none placeholder-white/30" 
                      placeholder="Search Kernel..."
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '0.5px solid rgba(255,255,255,0.15)',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                      }}
                    />
                    <Search className="absolute left-[8%] top-1/2 -translate-y-1/2 text-white/40" size={26}/>
                 </div>
                 <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-y-10 gap-x-6 max-w-5xl w-full pb-20">
                    {Object.keys(REG).filter(x => REG[x].n.toLowerCase().includes(q.toLowerCase())).map((id) => {
                      const app = REG[id]; const Ic = app.ic;
                      return (
                        <div key={`launch-${id}`} className="cursor-pointer group flex flex-col items-center gap-3" onClick={(e) => launchApp(id, e)}>
                          <div 
                            className={`w-20 h-20 flex items-center justify-center rounded-[22%] transition-transform group-hover:scale-110 active:scale-95 bg-gradient-to-br ${app.c} border border-white/20`}
                            style={{ boxShadow: 'inset 0 2px 6px rgba(255,255,255,0.2), 0 8px 24px rgba(0,0,0,0.2)' }}
                          >
                             <Ic size={38} className={app.t} />
                          </div>
                          <span className="text-xs font-semibold text-white text-center tracking-wide">{app.n}</span>
                        </div>
                      );
                    })}
                 </motion.div>
                 <button className="fixed top-10 left-10 w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/10 transition-all group" style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)' }} onClick={()=>setStartOpen(false)}><X size={22} className="text-white/70 group-hover:text-white group-hover:rotate-90 transition-all"/></button>
              </motion.div>
           )}
        </AnimatePresence>

        {/* LOCK SCREEN */}
        <AnimatePresence>
           {locked && (
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               transition={{ duration: 0.5 }} 
               className="absolute inset-0 z-[250] flex flex-col items-center justify-center"
               style={{
                 background: 'rgba(10, 10, 20, 0.5)',
                 backdropFilter: 'blur(40px) saturate(120%)',
                 WebkitBackdropFilter: 'blur(40px) saturate(120%)',
               }}
             >
               <div className="z-10 flex flex-col items-center relative gap-8 py-20">
                 <div className="text-center">
                    <h1 className="text-[9rem] leading-[0.8] font-bold tracking-tighter text-white" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</h1>
                    <p className="text-3xl font-bold text-slate-300 tracking-wider mt-6" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                 </div>
                 <motion.div 
                   whileHover={{ scale: 1.08 }} 
                   whileTap={{ scale: 0.95 }} 
                   className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all mt-10 group" 
                   style={{
                     background: 'rgba(255,255,255,0.12)',
                     border: '0.5px solid rgba(255,255,255,0.3)',
                     backdropFilter: 'blur(20px)',
                     boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                   }}
                   onClick={(e) => { playSound('open', e); setLocked(false); }}
                 >
                    <Lock size={30} className="text-white/80 group-hover:text-white transition-colors" />
                 </motion.div>
                 <p className="text-[11px] font-semibold mt-2 text-white/40 tracking-[0.2em] uppercase">Click to Unlock</p>
               </div>
             </motion.div>
           )}
        </AnimatePresence>
      </div>
    </div>
  );
}
