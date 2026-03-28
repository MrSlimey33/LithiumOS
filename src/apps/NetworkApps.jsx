import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Wind, Droplets, MapPin, Search, Activity, Cpu as CpuIcon, MemoryStick, Radar, Satellite } from 'lucide-react';

export function WeatherApp() {
  const [city] = useState("San Francisco");
  const [temp] = useState(72);
  const [cond] = useState("Partly Cloudy");
  
  return (
    <div className="w-full h-full bg-gradient-to-br from-sky-400 to-blue-600 text-white p-6 flex flex-col relative overflow-hidden">
      <div className="absolute top-10 right-10 w-48 h-48 bg-yellow-300 rounded-full blur-[40px] opacity-40 mix-blend-overlay" />
      <div className="absolute top-20 right-20 w-32 h-32 bg-white rounded-full blur-[20px] opacity-30" />
      
      <div className="flex justify-between items-start z-10 relative">
        <div>
           <div className="flex items-center gap-2 mb-1"><MapPin size={16} className="opacity-80"/> <span className="font-semibold tracking-wide text-lg">{city}</span></div>
           <div className="text-xs font-semibold tracking-widest uppercase opacity-70">Current Location</div>
        </div>
        <div className="text-xl font-medium tracking-wide">{cond}</div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center z-10 relative">
        <h1 className="text-[7rem] font-light tracking-tighter leading-none mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]">{temp}°</h1>
        <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md px-6 py-3 rounded-[2rem] border border-white/20">
          <div className="flex items-center gap-2"><CloudRain size={18} className="text-blue-200"/><span className="font-semibold">20%</span></div>
          <div className="w-px h-4 bg-white/30" />
          <div className="flex items-center gap-2"><Wind size={18} className="text-blue-200"/><span className="font-semibold">12mph</span></div>
          <div className="w-px h-4 bg-white/30" />
          <div className="flex items-center gap-2"><Droplets size={18} className="text-blue-200"/><span className="font-semibold">68%</span></div>
        </div>
      </div>
      
      <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-5 z-10 relative mb-2">
        <div className="flex justify-between items-center text-sm font-semibold">
           {['Now', '1PM', '2PM', '3PM', '4PM'].map((t,i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                 <span className="opacity-80">{t}</span>
                 {i === 0 ? <CloudRain className="text-white drop-shadow-md"/> : i === 1 ? <Wind className="text-white drop-shadow-md"/> : <CloudRain className="text-white opacity-80"/>}
                 <span className="text-base">{temp - (i*2)}°</span>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}

export function BrowserApp() {
  const [url, setUrl] = useState("https://wikipedia.org");
  const [inputUrl, setInputUrl] = useState(url);
  const handleGo = (e) => {
    e.preventDefault();
    let dest = inputUrl.trim();
    if (!dest.startsWith('http')) dest = 'https://' + dest;
    setUrl(dest);
  };
  return (
    <div className="w-full h-full bg-slate-100 flex flex-col font-sans">
      <div className="h-16 bg-white border-b border-slate-200 flex items-center px-4 gap-4 shadow-sm shrink-0">
         <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 font-bold">&lt;</button>
            <button className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 font-bold">&gt;</button>
         </div>
         <form onSubmit={handleGo} className="flex-1 relative">
            <input type="text" value={inputUrl} onChange={e=>setInputUrl(e.target.value)} className="w-full bg-slate-100 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-full py-2 px-10 text-sm font-medium text-slate-700 outline-none transition-all" spellCheck="false" placeholder="Enter web address..." />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
         </form>
      </div>
      <div className="flex-1 bg-white relative">
         <iframe src={url} className="w-full h-full border-none bg-white" sandbox="allow-scripts allow-same-origin" title="browser" />
      </div>
    </div>
  );
}

export function CpuApp() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const inter = setInterval(() => {
      setData(prev => {
        const nd = [...prev, Math.floor(Math.random() * 40) + 20];
        if (nd.length > 50) nd.shift();
        return nd;
      });
    }, 500);
    return () => clearInterval(inter);
  }, []);

  return (
    <div className="w-full h-full bg-[#1e1e1e] flex flex-col p-6 text-slate-200 font-mono">
       <div className="mb-8"><h2 className="text-2xl font-bold flex items-center gap-3"><Activity className="text-emerald-400"/> System Metrics</h2><p className="text-slate-500 text-xs mt-1 uppercase tracking-widest">Live Kernel Telemetry</p></div>
       <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-[#2d2d2d] rounded-2xl p-5 border border-[#444] shadow-inner">
             <div className="flex items-center gap-2 text-slate-400 mb-2"><CpuIcon size={16}/> CPU Usage</div>
             <div className="text-4xl font-light tracking-tight text-white">{data[data.length-1] || 0}%</div>
          </div>
          <div className="bg-[#2d2d2d] rounded-2xl p-5 border border-[#444] shadow-inner">
             <div className="flex items-center gap-2 text-slate-400 mb-2"><MemoryStick size={16}/> Memory Allocation</div>
             <div className="text-4xl font-light tracking-tight text-white">{(Math.random()*4 + 2).toFixed(1)}GB</div>
          </div>
       </div>
       <div className="flex-1 bg-[#2d2d2d] rounded-2xl border border-[#444] p-4 flex items-end gap-[2px] overflow-hidden">
         {data.map((val, i) => (
           <motion.div key={i} className="flex-1 bg-emerald-500/80 rounded-t-sm" style={{ height: `${val}%` }} transition={{ duration: 0.2 }} />
         ))}
       </div>
    </div>
  )
}

export function RadarApp() {
  return (
    <div className="w-full h-full bg-emerald-950 flex items-center justify-center relative overflow-hidden isolate shadow-inner">
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm tracking-widest"><Satellite size={18}/> RADAR LINK ACTIVE</div>
      <div className="w-96 h-96 rounded-full border border-emerald-500/30 flex items-center justify-center relative">
         <div className="w-72 h-72 rounded-full border border-emerald-500/30 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border border-emerald-500/30 flex items-center justify-center">
               <div className="w-24 h-24 rounded-full border border-emerald-500/30 flex items-center justify-center bg-emerald-900/50">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,1)]" />
               </div>
            </div>
         </div>
         {/* Radar Sweep Line */}
         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="absolute w-1/2 h-full top-0 left-1/2 origin-left z-10">
            <div className="w-full h-1/2 bg-gradient-to-tr from-emerald-500/40 to-transparent border-t border-emerald-400/80" />
         </motion.div>
         {/* Blips */}
         <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 1 }} className="absolute bg-emerald-300 w-3 h-3 rounded-full top-1/4 left-1/3 shadow-[0_0_10px_rgba(110,231,183,1)]" />
         <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 3 }} className="absolute bg-emerald-300 w-2.5 h-2.5 rounded-full bottom-1/3 right-1/4 shadow-[0_0_10px_rgba(110,231,183,1)]" />
      </div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
    </div>
  );
}
