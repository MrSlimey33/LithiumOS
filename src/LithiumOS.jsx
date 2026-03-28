import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, FileText, Settings, Store, CloudSun, Camera, Wifi, Battery, Search, Lock, Mic, Image as ImageIcon, Clock, Music, Terminal, Shield, Activity, LocateFixed, Globe, Palette, LogOut, ChevronLeft, X, Minus, Maximize2, Zap, Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import All Apps
import { TerminalApp, NotesApp, CalculatorApp, SettingsApp, VaultApp, ClockApp } from './apps/SystemApps';
import { SynthesiaApp, CameraApp, MemosApp, PhotosApp, CanvasApp } from './apps/MediaApps';
import { WeatherApp, BrowserApp, CpuApp, RadarApp } from './apps/NetworkApps';
import { StoreApp, DeveloperStudioApp } from './apps/StoreApps';

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
                 borderRadius: w.max ? '0px' : '20px'
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
      <div className="h-12 bg-gradient-to-b from-white/80 to-white/30 border-b border-white/40 flex items-center justify-between px-4 w-full cursor-grab active:cursor-grabbing shrink-0 backdrop-blur-md">
        <div className="flex gap-2">
           <button onMouseDown={(e)=>{e.stopPropagation(); playSound('click',e); close(w.id)}} className="w-3.5 h-3.5 rounded-full bg-rose-400 border border-rose-500 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center group"><X size={8} className="text-rose-900 opacity-0 group-hover:opacity-100 transition-opacity" /></button>
           <button onMouseDown={(e)=>{e.stopPropagation(); playSound('click',e); min(w.id)}} className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-500 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center group"><Minus size={8} className="text-amber-900 opacity-0 group-hover:opacity-100 transition-opacity"/></button>
           <button onMouseDown={(e)=>{e.stopPropagation(); playSound('click',e); max(w.id)}} className="w-3.5 h-3.5 rounded-full bg-emerald-400 border border-emerald-500 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center group"><Maximize2 size={8} className="text-emerald-900 opacity-0 group-hover:opacity-100 transition-opacity"/></button>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 text-slate-700 font-semibold tracking-wide text-xs flex items-center gap-2 drop-shadow-sm"><Ic size={12} className="opacity-70"/> {REG[w.id].n}</div>
        <div className="w-12"/>
      </div>
      <div className="flex-1 overflow-hidden relative bg-white/40 rounded-b-[20px]" onMouseDown={e => e.stopPropagation()}>{children}</div>
    </motion.div>
  );
}

function DropdownMenu({ title, options, close }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute top-full left-0 mt-1 w-48 bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl rounded-xl py-1 z-[300]"
    >
       <div className="px-3 pb-1 border-b border-slate-200/50 mb-1 font-bold text-xs text-slate-400 uppercase tracking-widest">{title} Menu</div>
       {options.map((opt, i) => (
          <div key={opt} onClick={close} className={`px-4 py-1.5 text-sm hover:bg-slate-100 cursor-pointer ${opt==='Quit App'?'text-rose-500 font-bold':'text-slate-700 font-medium'}`}>
             {opt}
          </div>
       ))}
    </motion.div>
  )
}

export default function LithiumOS({ previewMode = false }) {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [locked, setLocked] = useState(false);
  const [wins, setWins] = useState([]);
  const [apps, setApps] = useVDisk('apps_core', Object.keys(REG).slice(0, 8)); // 8 core apps
  const [startOpen, setStartOpen] = useState(false);
  const [q, setQ] = useState('');
  
  const [activeMenu, setActiveMenu] = useState(null); // String like 'File', 'Edit'

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
    
    // Inject props dynamically
    return <AppComp playSound={playSound} useVDisk={useVDisk} audioCtx={audioCtx} ins={apps} setIns={setApps} un={(i) => setApps(apps.filter(x=>x!==i))} lock={()=>{setLocked(true);setWins([]); setActiveMobileApp(null)}} REG={REG} openDevStudio={()=>launchApp('devstudio', null)} />;
  };

  const handleLogout = () => {
     localStorage.removeItem('LITHIUM_USER');
     navigate('/login');
  };

  // Click outside menu closes it
  useEffect(() => {
     const handleDocClick = () => setActiveMenu(null);
     window.addEventListener('click', handleDocClick);
     return () => window.removeEventListener('click', handleDocClick);
  }, []);

  // Determine Active App
  const activeWindow = wins.length > 0 && !wins[wins.length-1].min ? wins[wins.length-1] : null;
  const activeMenus = activeWindow ? REG[activeWindow.id].menus : ['File', 'Edit', 'View', 'Go', 'Window', 'Help'];
  const appName = activeWindow ? REG[activeWindow.id].n : 'Finder';

  // ------------------- MOBILE RENDER -------------------
  if (isMobile && !previewMode) {
    return (
       <div className="absolute inset-0 bg-slate-900 overflow-hidden font-sans text-slate-800 select-none flex flex-col pt-10 pb-8" style={{ backgroundImage: `url(${wallpapers[wallpaperIdx]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
         <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl mix-blend-overlay" />
         <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-6 z-50 text-white text-xs font-semibold drop-shadow-md">
            <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <div className="flex gap-2"><Wifi size={14}/><Battery size={14} /></div>
         </div>
         <AnimatePresence mode="wait">
           {activeMobileApp ? (
             <motion.div key="app" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="absolute inset-0 z-40 bg-white flex flex-col pt-[max(env(safe-area-inset-top),20px)]">
                <div className="h-14 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 z-50 shrink-0 shadow-sm">
                   <button onClick={() => setActiveMobileApp(null)} className="flex items-center gap-1 text-blue-500 font-semibold"><ChevronLeft size={20}/> Back</button>
                   <span className="font-bold text-slate-800 text-sm tracking-wide">{REG[activeMobileApp].n}</span>
                   <div className="w-16"/>
                </div>
                <div className="flex-1 overflow-hidden bg-slate-50 relative">{renderCurrentApp(activeMobileApp)}</div>
             </motion.div>
           ) : (
             <motion.div key="home" className="flex-1 relative z-10 flex flex-col p-6 overflow-y-auto scrollbar-hide pt-10">
               <h2 className="text-white text-3xl font-bold mb-8 drop-shadow-md">Lithium Center</h2>
               <div className="grid grid-cols-4 gap-y-8 gap-x-4">
                  {[...apps, 'devstudio'].filter((v,i,a)=>a.indexOf(v)===i).map(id => {
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
      <div className="h-8 bg-white/40 backdrop-blur-3xl border-b border-white/50 flex justify-between px-4 z-[200] text-slate-800 shadow-sm font-medium items-center relative select-none">
         <div className="flex items-center h-full text-[13px] font-semibold">
            {/* Logo Dropdown (App Menu) */}
            <div className="relative h-full flex items-center">
              <button onClick={(e)=>{e.stopPropagation(); setActiveMenu('logo')}} className={`flex items-center gap-2 px-3 h-full transition-colors drop-shadow-sm font-bold ${activeMenu === 'logo' ? 'bg-white/70 shadow-sm rounded-md my-1 h-6' : 'hover:bg-white/60 rounded-md my-1 h-6'}`}>
                 <div className="w-3.5 h-3.5 bg-gradient-to-br from-cyan-400 to-blue-500 shadow-sm rounded-sm flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-sm opacity-50"/></div>
                 {appName}
              </button>
              <AnimatePresence>
                 {activeMenu === 'logo' && <DropdownMenu title={appName} options={['About '+appName, 'Preferences...', 'Services', 'Hide', 'Quit App']} close={()=>{if(activeWindow) closeApp(activeWindow.id)}} />}
              </AnimatePresence>
            </div>
            
            {/* Dynamic Menus based on Active App */}
            {activeMenus.map((menu) => (
               <div key={menu} className="relative h-full flex items-center">
                 <button onClick={(e)=>{e.stopPropagation(); setActiveMenu(menu)}} className={`px-3 h-full drop-shadow-sm font-medium ${activeMenu === menu ? 'bg-white/70 shadow-sm rounded-md my-1 h-6 text-blue-600' : 'hover:bg-white/60 rounded-md my-1 h-6'}`}>{menu}</button>
                 <AnimatePresence>
                    {activeMenu === menu && <DropdownMenu title={menu} options={['New', 'Open', 'Save', 'Duplicate', 'Details']} close={()=>{setActiveMenu(null)}} />}
                 </AnimatePresence>
               </div>
            ))}
         </div>
         <div className="flex gap-4 h-full items-center px-2">
            {!previewMode && <button onClick={handleLogout} className="hover:bg-white/60 px-2 h-6 rounded-md my-1 flex items-center gap-2 opacity-80"><LogOut size={14}/> Quit OS</button>}
            <div className="flex gap-3 text-slate-600"><Wifi size={14}/><Battery size={15} /></div>
            <span className="font-bold tracking-wide drop-shadow-sm">{time.toLocaleString([], { weekday: 'short', month:'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
         </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${wallpapers[wallpaperIdx]})` }}>
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[20px] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/30 to-white/10 pointer-events-none" />

        {/* DESKTOP ICONS */}
        <div className="absolute top-8 right-8 flex flex-col gap-8 z-0 items-end">
           {apps.slice(0, 4).map(id => {
             const a = REG[id]; if (!a) return null; const Ic = a.ic;
             return (
               <motion.div drag dragMomentum={false} initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} key={`desktop-${id}`} className="flex flex-col items-center gap-2 cursor-pointer w-24 group relative" onDoubleClick={(e)=>launchApp(id, e)}>
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
               {renderCurrentApp(w.id)}
             </Window>
           ))}
        </AnimatePresence>

        {/* FROSTED DOCK */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[150] flex items-end">
           <div className="bg-white/30 backdrop-blur-3xl border border-white/50 rounded-[2.5rem] p-3 flex items-center gap-3 shadow-[0_40px_80px_rgba(0,0,0,0.2)] ring-1 ring-black/5">
             <motion.button style={{originY: 1}} whileHover={{ y: -8, scale: 1.15 }} whileTap={{ scale: 0.95 }} onClick={(e)=>{playSound('click', e); setStartOpen(!startOpen);}} className="w-16 h-16 rounded-[1.5rem] bg-white shadow-xl border border-white flex items-center justify-center cursor-pointer font-bold relative group z-50">
                <Search size={28} className="text-slate-800" />
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-xs px-3 py-1 rounded-full font-semibold transition-opacity pointer-events-none drop-shadow-md whitespace-nowrap">Search & Launch</div>
             </motion.button>
             <div className="w-[1.5px] h-12 bg-white/40 mx-2 rounded-full"/>
             {[...apps, 'devstudio'].filter((v,i,a)=>a.indexOf(v)===i).slice(0, 10).map((id, index) => {
               const a = REG[id]; const isOpen = wins.find(w=>w.id===id && !w.min); const Ic = a.ic;
               return (
                 <motion.button style={{originY: 1}} whileHover={{ y: -8, scale: 1.15 }} whileTap={{ scale: 0.95 }} key={`dock-${id}`} onClick={(e)=>{launchApp(id,e); if(isOpen&&isOpen.min)focusApp(id)}} className="relative w-16 h-16 rounded-[1.5rem] bg-transparent flex items-center justify-center cursor-pointer group z-40">
                   <div className={`absolute inset-0 rounded-[1.5rem] bg-gradient-to-br ${a.c} opacity-90 border border-white/40 shadow-[inset_0_2px_10px_rgba(255,255,255,0.3)] shadow-md group-hover:opacity-100 transition-opacity`} />
                   <Ic size={32} className={`relative z-10 ${a.t} drop-shadow-md`} />
                   {isOpen && <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_rgba(255,255,255,0.8)]"/>}
                   <div className="absolute -top-12 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-xs px-3 py-1 rounded-full font-semibold transition-opacity pointer-events-none drop-shadow-md whitespace-nowrap">{a.n}</div>
                 </motion.button>
               )
             })}
           </div>
        </div>

        {/* LAUNCHPAD OVERLAY */}
        <AnimatePresence>
           {startOpen && !locked && (
              <motion.div initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.3, ease: 'easeOut' }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-[80px] z-[160] flex flex-col items-center justify-center p-12 overflow-y-auto">
                 <div className="w-full max-w-3xl mb-16 relative flex justify-center mt-10 shrink-0">
                    <input autoFocus value={q} onChange={e=>setQ(e.target.value)} type="text" className="w-[90%] bg-white/10 backdrop-blur-3xl border border-white/20 outline-none text-white text-3xl font-medium py-6 px-16 rounded-[2.5rem] text-center shadow-[0_30px_60px_rgba(0,0,0,0.2)] focus:bg-white/20 transition-all focus:border-white/40 placeholder-white/30" placeholder="Search Kernel..." spellCheck="false" />
                    <Search className="absolute left-[8%] top-1/2 -translate-y-1/2 text-white/50" size={32}/>
                 </div>
                 <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-y-12 gap-x-8 max-w-5xl w-full pb-20">
                    {Object.keys(REG).filter(x => REG[x].n.toLowerCase().includes(q.toLowerCase())).map((id) => {
                      const app = REG[id]; const Ic = app.ic;
                      return (
                        <div key={`launch-${id}`} className="cursor-pointer group flex flex-col items-center gap-4" onClick={(e) => launchApp(id, e)}>
                          <div className={`w-24 h-24 flex items-center justify-center shadow-xl rounded-[2rem] transition-transform group-hover:scale-110 active:scale-95 bg-gradient-to-br ${app.c} border border-white/20 hover:shadow-2xl`}>
                             <Ic size={44} className={app.t} />
                          </div>
                          <span className="text-sm font-bold text-white text-center tracking-wide">{app.n}</span>
                        </div>
                      );
                    })}
                 </div>
                 <button className="fixed top-12 left-12 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 shadow-sm border border-white/20 transition-all group" onClick={()=>setStartOpen(false)}><X size={28} className="text-white group-hover:rotate-90 transition-transform"/></button>
              </motion.div>
           )}
        </AnimatePresence>

        {/* LOCK SCREEN */}
        <AnimatePresence>
           {locked && (
             <motion.div initial={{ opacity: 0, backdropFilter: 'blur(0px)' }} animate={{ opacity: 1, backdropFilter: 'blur(40px)' }} exit={{ opacity: 0, backdropFilter: 'blur(0px)' }} transition={{ duration: 0.5 }} className="absolute inset-0 z-[250] flex flex-col items-center justify-center bg-slate-900/60">
               <div className="z-10 flex flex-col items-center relative gap-8 py-20">
                 <div className="text-center">
                    <h1 className="text-[9rem] leading-[0.8] font-bold tracking-tighter text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</h1>
                    <p className="text-3xl font-bold text-slate-300 tracking-wider mt-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">{time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
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
