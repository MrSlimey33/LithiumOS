import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Zap, Sparkles, Code2, CheckCircle2, Send, Cpu, CloudOff, Loader2, Download, ExternalLink } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export function StoreApp({ ins, setIns, REG, playSound, openDevStudio }) {
  const [extApps, setExtApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.github.com/repos/MrSlimey33/LithiumOS/issues?state=open&per_page=100')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        const parsedApps = [];
         for (const issue of data) {
            try {
              const body = issue.body || '';
              const jsonMatch = body.match(/```json\s*([\s\S]*?)\s*```/);
              if (jsonMatch && jsonMatch[1]) {
                 const appData = JSON.parse(jsonMatch[1].trim());
                 // V2 VALIDATION
                 if (appData.name && (appData.code || appData.url)) {
                    parsedApps.push({
                       id: `ext_${issue.id}`,
                       title: appData.name,
                       dev: appData.developer || issue.user.login,
                       icon: appData.icon || 'Box',
                       img: appData.color || 'from-slate-700 to-slate-900',
                       desc: appData.description || 'A native Node module.',
                       code: appData.code || `<iframe src="${appData.url}" style="width:100%;height:100%;border:none;"></iframe>`
                    });
                 }
              }
            } catch(e) { console.error("StoreApp Parse Error:", e); }
         }
        setExtApps(parsedApps);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleInstallExt = (app) => {
     if(playSound) playSound('click', null);
     const currentRaw = window.localStorage.getItem('LITHIUM_ext_apps');
     const currentMap = currentRaw ? JSON.parse(currentRaw) : {};
     currentMap[app.id] = app;
     window.localStorage.setItem('LITHIUM_ext_apps', JSON.stringify(currentMap));
     setIns([...ins, app.id]);
  };

  const coreUninstalled = Object.keys(REG).filter(k => REG[k].d === 1 && !ins.includes(k));

  return (
    <div className="w-full h-full bg-black/60 backdrop-blur-3xl text-white flex flex-col pt-8 font-sans overflow-hidden">
      <div className="px-10 flex justify-between items-end border-b border-white/5 pb-6 mb-2 shrink-0">
        <div>
           <h2 className="text-4xl font-black tracking-tighter flex items-center gap-3 text-white">Ecosystem</h2>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1">Native Module Library</p>
        </div>
        <div className="flex gap-4">
           <button onClick={()=>{if(playSound)playSound('open',{}); openDevStudio();}} className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/5 group">
              <Sparkles size={14} className="group-hover:rotate-12 transition-transform" /> Dev Studio
           </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-10 pb-20 scrollbar-hide space-y-12 pt-6">
        
        {/* Core Modules Section */}
        <div>
           <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-600 mb-6">System Nodes</h3>
           {coreUninstalled.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {coreUninstalled.map(id => {
                    const Ic = REG[id].ic;
                    return (
                    <div key={`store-core-${id}`} className="glass-liquid p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-4 hover:-translate-y-1 transition-all">
                      <div className={`w-20 h-20 rounded-[1.8rem] flex items-center justify-center bg-gradient-to-br ${REG[id].c} ${REG[id].t} shadow-2xl`}><Ic size={36}/></div>
                      <span className="font-black text-white tracking-tight text-lg">{REG[id].n}</span>
                      <button onClick={(e)=>{if(playSound)playSound('click',e); setIns([...ins, id]);}} className="mt-2 text-[9px] font-black tracking-widest uppercase bg-white text-black px-8 py-3 rounded-full hover:bg-white transition-colors active:scale-95 w-full">Install</button>
                    </div>
                    );
                 })}
              </div>
           ) : (
              <div className="liquid-well rounded-[2rem] p-10 text-center text-[10px] font-black uppercase tracking-widest text-slate-600">All system nodes synchronized.</div>
           )}
        </div>

        {/* Community Modules Section */}
        <div>
           <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-600 mb-6 flex justify-between items-center">
              Community Hub {loading && <Loader2 size={14} className="animate-spin text-blue-500 inline ml-2"/>}
           </h3>
           {!loading && extApps.length === 0 && (
              <div className="liquid-well rounded-[2.5rem] p-16 flex flex-col items-center justify-center gap-4 text-slate-600 text-center opacity-50">
                 <CloudOff size={42} />
                 <p className="font-bold text-xs uppercase tracking-widest italic">The hub is waiting for logic.</p>
              </div>
           )}
           <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {extApps.filter(a => !ins.includes(a.id)).map(a => {
                 const IconComponent = LucideIcons[a.icon] || LucideIcons.Box;
                 return (
                 <div key={a.id} className="glass-liquid p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-3 hover:-translate-y-1 transition-all relative overflow-hidden group">
                   <div className={`w-20 h-20 rounded-[1.8rem] bg-gradient-to-br ${a.img} shadow-2xl mb-4 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform`}>
                      {IconComponent && <IconComponent className="text-white drop-shadow-2xl" size={36} />}
                   </div>
                   <h4 className="font-black text-white tracking-tight truncate w-full px-2 text-lg">{a.title}</h4>
                   <p className="text-[8px] font-black tracking-[0.3em] uppercase text-slate-500">Node by {a.dev}</p>
                   <p className="text-xs text-slate-400 line-clamp-2 my-2 font-medium">{a.desc}</p>
                   <button onClick={()=>handleInstallExt(a)} className="mt-auto text-[9px] font-black tracking-widest uppercase bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-blue-500/20 w-full flex items-center justify-center gap-2">
                       <Download size={14}/> Get
                   </button>
                 </div>
                 );
              })}
           </div>
        </div>

      </div>
    </div>
  );
}

export function DeveloperStudioApp({ playSound }) {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("idle");
  const [code, setCode] = useState("");

  const handleGenerate = (e) => {
    e.preventDefault();
    if(!prompt) return;
    if(playSound) playSound('click', null);
    setStatus("generating");
    
    setTimeout(() => {
      setCode(`import React from 'react';\n\nexport default function CustomApp() {\n  return (\n    <div className="w-full h-full p-8 flex flex-col items-center justify-center text-center">\n      <h1 className="text-3xl font-bold mb-4">You built: ${prompt.slice(0, 20)}...</h1>\n      <p className="text-slate-500">This app was dynamically generated by Lithium AI.</p>\n    </div>\n  );\n}`);
      setStatus("done");
    }, 2500);
  };

  const handleEmailSubmit = () => {
    if(playSound) playSound('click', null);
    setStatus("submitted");
    setTimeout(() => {
       window.open(`mailto:admin@lithiumos.com?subject=New App Submission&body=I created an app: ${prompt}. Please review my code.`);
    }, 500);
  };

  return (
    <div className="w-full h-full bg-black text-white flex overflow-hidden font-sans border border-white/5 rounded-3xl m-2">
       <div className="w-1/2 h-full flex flex-col p-12 border-r border-white/5 bg-slate-900/20 backdrop-blur-xl relative z-10">
          <div className="mb-12 flex items-center gap-5">
             <div className="w-14 h-14 rounded-[1.2rem] bg-white text-black flex items-center justify-center shadow-2xl shadow-white/10"><Code2 size={28} /></div>
             <div><h2 className="text-3xl font-black tracking-tighter text-white">Developer Studio</h2><p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Lithium AI Generation v2</p></div>
          </div>
          
          <form className="flex-1 flex flex-col" onSubmit={handleGenerate}>
             <label className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-600 mb-6 ml-2">App Description</label>
             <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} disabled={status !== 'idle'} className="w-full flex-1 glass-liquid rounded-[2.5rem] p-8 text-xl text-white outline-none focus:ring-4 ring-white/5 transition-all resize-none placeholder-slate-800 mb-8 leading-relaxed font-medium" placeholder="E.g. A premium pomodoro timer with liquid glass textures..."></textarea>
             
             {status === 'idle' && (
                <button type="submit" disabled={!prompt} className="w-full py-6 rounded-full bg-white text-black font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 flex items-center justify-center gap-3 shadow-2xl shadow-white/10 italic tracking-tighter">SHIP LOGIC v2</button>
             )}
             {status === 'generating' && (
                <div className="w-full py-6 rounded-full liquid-well text-slate-500 font-black text-xl flex items-center justify-center gap-4 italic tracking-tighter"><motion.div animate={{rotate:360}} transition={{repeat:Infinity, duration:1, ease:'linear'}}><Cpu size={24}/></motion.div> Training Node Core...</div>
             )}
             {(status === 'done' || status === 'submitted') && (
                <button type="button" onClick={()=> {setPrompt(""); setCode(""); setStatus("idle");}} className="w-full py-6 rounded-full liquid-well text-slate-400 font-black text-xl hover:text-white transition-all italic tracking-tighter">RESET CONTEXT</button>
             )}
          </form>
       </div>

       <div className="w-1/2 h-full flex flex-col bg-black/40 relative z-10 p-8">
          <div className="flex justify-between items-center mb-6 text-slate-700 font-black text-[9px] tracking-[0.4em] uppercase ml-4">
            <span>Editor_Preview.json</span>
            <div className="flex gap-2"><div className="w-2.5 h-2.5 rounded-full bg-white/5"/><div className="w-2.5 h-2.5 rounded-full bg-white/5"/><div className="w-2.5 h-2.5 rounded-full bg-white/5"/></div>
          </div>
          <div className="flex-1 liquid-well rounded-[3rem] p-10 overflow-hidden relative border border-white/5">
             <AnimatePresence>
                {code ? (
                   <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-blue-400 h-full overflow-y-auto whitespace-pre-wrap font-mono text-xs leading-relaxed">{code}</motion.div>
                ) : (
                   <p className="text-slate-900 font-black italic absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 tracking-tighter text-2xl opacity-20 italic">WAITING FOR STREAM</p>
                )}
             </AnimatePresence>
          </div>
          
          <AnimatePresence>
             {status === 'done' && (
                <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="mt-8">
                   <button onClick={handleEmailSubmit} className="w-full py-5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-blue-500/40 transition-all hover:-translate-y-1 uppercase text-xs tracking-[0.2em]"><Send size={18}/> Push to Hub</button>
                </motion.div>
             )}
          </AnimatePresence>
       </div>
    </div>
  );
}
