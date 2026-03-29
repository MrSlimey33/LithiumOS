import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Wind, Droplets, MapPin, Search, Activity, Cpu as CpuIcon, MemoryStick, Radar, Satellite, Globe, Zap, Shield, ArrowUpRight, RefreshCw, Box } from 'lucide-react';

export function WeatherApp() {
  const [city] = useState("CYBERIA-01");
  const [temp] = useState(14);
  const [cond] = useState("Quantum Flux");
  
  return (
    <div className="w-full h-full bg-q-void text-white p-10 flex flex-col relative overflow-hidden backdrop-blur-3xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse-glow" />
      <div className="absolute inset-0 spatial-mesh opacity-10 pointer-events-none" />
      
      <div className="flex justify-between items-start z-10 relative border-b border-white/10 pb-10">
        <div>
           <div className="flex items-center gap-3 mb-2"><MapPin size={20} className="text-cyan-400"/> <span className="font-black tracking-tighter text-3xl italic uppercase">{city}</span></div>
           <div className="text-[10px] font-black tracking-[0.5em] uppercase text-white/20">Orbital Sector 7</div>
        </div>
        <div className="text-sm font-black tracking-widest uppercase bg-white/5 border border-white/10 px-6 py-2 rounded-full text-white/60">{cond}</div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center z-10 relative">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[12rem] font-black tracking-tighter leading-none mb-6 shimmer-text italic"
        >
          {temp}°
        </motion.h1>
        <div className="flex items-center gap-10 bg-white/5 backdrop-blur-3xl px-10 py-5 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3"><CloudRain size={20} className="text-cyan-400"/><span className="font-black text-sm uppercase italic tracking-widest">20% Prec.</span></div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex items-center gap-3"><Wind size={20} className="text-violet-400"/><span className="font-black text-sm uppercase italic tracking-widest">12ms Velocity</span></div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex items-center gap-3"><Droplets size={20} className="text-emerald-400"/><span className="font-black text-sm uppercase italic tracking-widest">68% Atom Sat.</span></div>
        </div>
      </div>
      
      <div className="w-full q-glass rounded-[2.5rem] p-8 z-10 relative mt-4 border-white/10">
        <div className="flex justify-between items-center px-4">
           {['Now', '02:00', '04:00', '06:00', '08:00', '10:00'].map((t,i) => (
              <div key={i} className="flex flex-col items-center gap-4 group cursor-pointer">
                 <span className="text-[10px] font-black text-white/20 group-hover:text-white transition-colors">{t}</span>
                 {i % 2 === 0 ? <CloudRain size={20} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(0,212,255,0.4)]"/> : <Zap size={20} className="text-violet-400 drop-shadow-[0_0_10px_rgba(139,92,246,0.4)]"/>}
                 <span className="text-lg font-black tracking-tighter">{temp - (i)}°</span>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}

export function BrowserApp() {
  const [url, setUrl] = useState("https://lithiumos.com");
  const [inputUrl, setInputUrl] = useState(url);
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
     let active = true;
     setLoading(true);
     fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
      .then(r => r.json())
      .then(d => { 
         if(active) {
            let content = d.contents;
            if (content) {
               const base = new URL(url).origin;
               content = content.replace(/href="\//g, `href="${base}/`).replace(/src="\//g, `src="${base}/`);
            } else {
               content = "<style>body{background:#08090d;color:#e8eaed;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;}h1{font-weight:900;letter-spacing:-0.05em;}</style><h1>CONGESTION IN ARCHITECTURE.</h1>";
            }
            setHtml(content); 
            setLoading(false); 
         }
      })
      .catch((e) => { 
         if(active) { 
            setHtml(`<style>body{background:#08090d;color:#f43f5e;font-family:sans-serif;padding:3rem;}h1{font-weight:900;letter-spacing:-0.05em;}</style><h1>NODE DISCONNECTED.</h1><p>${e.message}</p>`); 
            setLoading(false); 
         } 
      });
     return () => active = false;
  }, [url]);

  const handleGo = (e) => {
    e.preventDefault();
    let dest = inputUrl.trim();
    if (!dest.startsWith('http')) dest = 'https://' + dest;
    setUrl(dest);
  };

  return (
    <div className="w-full h-full bg-q-void flex flex-col font-sans overflow-hidden">
      <div className="h-20 bg-black/40 backdrop-blur-3xl border-b border-white/10 flex items-center px-8 gap-6 shrink-0 relative z-10">
         <div className="flex gap-4">
            <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-white/40 group transition-all">
               <ArrowUpRight size={18} className="rotate-[225deg] group-active:scale-90" />
            </button>
            <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-white/40 group transition-all">
               <ArrowUpRight size={18} className="group-active:scale-90" />
            </button>
         </div>
         <form onSubmit={handleGo} className="flex-1 relative flex items-center group">
            <input 
              type="text" value={inputUrl} onChange={e=>setInputUrl(e.target.value)} disabled={loading} 
              className="w-full bg-white/5 border border-white/5 focus:bg-black/40 focus:border-cyan-500/30 rounded-2xl py-3 px-12 text-sm font-bold text-white outline-none transition-all placeholder-white/10 tracking-wide" 
              spellCheck="false" placeholder="Navigate Frequency..." 
            />
            <Globe className="absolute left-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" size={18} />
            {loading && <div className="absolute right-4 w-5 h-5 border-2 border-white/10 border-t-cyan-500 rounded-full animate-spin"/>}
         </form>
         <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/40">
            <RefreshCw size={18} className={loading ? 'animate-spin text-cyan-400' : ''} />
         </button>
      </div>
      <div className="flex-1 bg-white relative overflow-hidden">
         <iframe srcDoc={html} className="w-full h-full border-none bg-white" sandbox="allow-scripts allow-same-origin allow-popups" title="browser" />
         {loading && (
            <div className="absolute inset-0 bg-q-void flex flex-col items-center justify-center gap-6 z-[100]">
               <div className="w-20 h-20 border-4 border-white/5 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_30px_rgba(0,212,255,0.2)]" />
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400 animate-pulse">Synchronizing Node...</p>
            </div>
         )}
      </div>
    </div>
  );
}

export function CpuApp() {
  const [data, setData] = useState([]);
  const [activeThread, setActiveThread] = useState(0);

  useEffect(() => {
    const inter = setInterval(() => {
      setData(prev => {
        const nd = [...prev, Math.floor(Math.random() * 40) + 20];
        if (nd.length > 60) nd.shift();
        return nd;
      });
    }, 400);
    return () => clearInterval(inter);
  }, []);

  return (
    <div className="w-full h-full bg-black/60 backdrop-blur-3xl flex flex-col p-10 text-white font-mono overflow-hidden">
       <div className="absolute inset-0 spatial-mesh opacity-10 pointer-events-none" />
       
       <div className="mb-12 flex justify-between items-end border-b border-white/10 pb-10 relative z-10">
          <div>
             <h2 className="text-4xl font-black flex items-center gap-4 tracking-tighter uppercase italic"><Activity className="text-cyan-400" size={36}/> HELIUM_CORE</h2>
             <p className="text-[10px] font-black text-white/20 mt-2 uppercase tracking-[0.4em]">Real-time Kernel Telemetry // Build 5.0</p>
          </div>
          <div className="flex gap-3">
             <div className="px-5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest">ACTIVE</div>
             <div className="px-5 py-2 rounded-xl bg-white/5 border border-white/5 text-white/20 text-[10px] font-black uppercase tracking-widest">WASM-64</div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 relative z-10">
          <div className="q-glass rounded-[2.5rem] p-8 border-white/10 group">
             <div className="flex items-center gap-3 text-white/40 mb-4 font-black text-[10px] uppercase tracking-widest"><CpuIcon size={18} className="group-hover:text-cyan-400 transition-colors"/> LITHIUM_CPU</div>
             <div className="text-6xl font-black tracking-tighter shimmer-text italic">{data[data.length-1] || 0}%</div>
             <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${data[data.length-1] || 0}%` }} className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(0,212,255,0.8)]" />
             </div>
          </div>
          <div className="q-glass rounded-[2.5rem] p-8 border-white/10 group">
             <div className="flex items-center gap-3 text-white/40 mb-4 font-black text-[10px] uppercase tracking-widest"><MemoryStick size={18} className="group-hover:text-violet-400 transition-colors"/> ALLOC_MEM</div>
             <div className="text-6xl font-black tracking-tighter text-white italic">{(Math.random()*2 + 6).toFixed(1)} <span className="text-2xl opacity-20">GB</span></div>
             <div className="mt-4 flex gap-1 h-1">
                {[...Array(10)].map((_,i) => <div key={i} className={`flex-1 rounded-full ${i < 7 ? 'bg-violet-500' : 'bg-white/10'}`} />)}
             </div>
          </div>
          <div className="q-glass rounded-[2.5rem] p-8 border-white/10 group">
             <div className="flex items-center gap-3 text-white/40 mb-4 font-black text-[10px] uppercase tracking-widest"><Activity size={18} className="group-hover:text-emerald-400 transition-colors"/> LOAD_AVG</div>
             <div className="text-6xl font-black tracking-tighter text-white italic">0.24</div>
             <div className="mt-4 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Optimal Node Health</div>
          </div>
       </div>

       <div className="flex-1 q-glass rounded-[3rem] border-white/10 p-10 flex items-end gap-1.5 overflow-hidden relative group">
          <div className="absolute inset-0 spatial-mesh opacity-5 group-hover:opacity-10 transition-opacity" />
          <div className="absolute top-8 left-10 text-[10px] font-black uppercase tracking-[0.5em] text-white/10 group-hover:text-white/20 transition-colors">SPECTRAL_BUFFER_01</div>
          {data.map((val, i) => (
            <motion.div 
              key={i} 
              className="flex-1 bg-gradient-to-t from-cyan-500 to-violet-500 rounded-full min-w-[2px]" 
              style={{ height: `${val}%` }} 
              transition={{ duration: 0.1 }} 
            />
          ))}
       </div>
    </div>
  )
}

export function RadarApp() {
  return (
    <div className="w-full h-full bg-[#050505] flex items-center justify-center relative overflow-hidden isolate shadow-inner">
      <div className="absolute inset-0 spatial-mesh opacity-[0.15] pointer-events-none" />
      <div className="absolute top-10 left-10 z-20 flex flex-col gap-2">
         <div className="flex items-center gap-3 text-emerald-400 font-mono font-black text-sm tracking-[0.3em]">
            <Satellite size={20} className="animate-pulse" /> SCANNING_FRQ
         </div>
         <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Atmosphere Monitoring Protocol</p>
      </div>

      <div className="relative">
         {/* Circular Rings */}
         {[1, 2, 3, 4].map((r) => (
            <div 
               key={r} 
               style={{ width: `${r * 180}px`, height: `${r * 180}px` }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/20" 
            />
         ))}

         <div className="w-[720px] h-[720px] rounded-full flex items-center justify-center relative">
            <div className="w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_30px_rgba(52,211,153,1)] z-30" />
            
            {/* Radar Sweep Line */}
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }} 
              className="absolute w-1/2 h-full top-0 left-1/2 origin-left z-10"
            >
               <div className="w-full h-1/2 bg-gradient-to-tr from-emerald-500/20 to-transparent border-t border-emerald-400/60 blur-[1px]" />
            </motion.div>

            {/* Blips */}
            <motion.div animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }} transition={{ repeat: Infinity, duration: 6, delay: 1 }} className="absolute bg-emerald-300 w-4 h-4 rounded-full top-[30%] left-[40%] shadow-[0_0_20px_rgba(110,231,183,1)] flex items-center justify-center">
               <div className="w-8 h-8 rounded-full border border-emerald-500/40 animate-ping" />
            </motion.div>
            <motion.div animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }} transition={{ repeat: Infinity, duration: 6, delay: 4 }} className="absolute bg-violet-400 w-3 h-3 rounded-full bottom-[20%] right-[35%] shadow-[0_0_20px_rgba(139,92,246,1)]" />
         </div>
      </div>

      <div className="absolute bottom-10 right-10 flex flex-col gap-4 text-right">
         <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">OBJ_COUNT: 14</div>
         <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">SIGNAL_STRENGTH: NOMINAL</div>
      </div>

      <div className="absolute inset-0 pointer-events-none noise-overlay opacity-10" />
    </div>
  );
}
