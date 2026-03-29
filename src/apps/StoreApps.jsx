import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Zap, Sparkles, Code2, CheckCircle2, Send, Cpu, CloudOff, Loader2, Download, ExternalLink, Box, Terminal, Activity, Layers, Shield } from 'lucide-react';
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
    <div className="w-full h-full bg-black/40 backdrop-blur-3xl text-white flex flex-col font-sans overflow-hidden">
      <div className="absolute inset-0 spatial-mesh opacity-5 pointer-events-none" />
      <div className="px-12 pt-12 pb-10 flex justify-between items-end border-b border-white/10 shrink-0 relative z-10">
        <div>
           <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-2xl"><Store size={24} className="text-cyan-400" /></div>
              <h2 className="text-5xl font-black tracking-tighter uppercase italic shimmer-text">Ecosystem</h2>
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Lithium Node Distribution Hub</p>
        </div>
        <div className="flex gap-6">
           <button onClick={()=>{if(playSound)playSound('open',{}); openDevStudio();}} className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10 group italic">
              <Sparkles size={16} className="group-hover:rotate-12 transition-transform" /> Forge Node
           </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-12 py-10 scrollbar-thin relative z-10">
        <div className="flex flex-col gap-16 pb-20">
           
           {/* CORE NODES */}
           <section>
              <div className="flex items-center gap-6 mb-10">
                 <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-cyan-500">System Core Nodes</h3>
                 <div className="h-px flex-1 bg-white/5" />
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                 {coreUninstalled.map(id => {
                    const Ic = REG[id].ic;
                    return (
                    <motion.div 
                      key={`store-core-${id}`} 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      className="q-glass-light p-10 rounded-[3rem] flex flex-col items-center justify-center text-center gap-6 border-white/5 hover:border-white/20 transition-all group"
                    >
                      <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center bg-gradient-to-br ${REG[id].c} ${REG[id].t} shadow-2xl group-hover:scale-110 transition-transform`}><Ic size={42}/></div>
                      <div className="flex flex-col gap-1">
                         <span className="font-black text-white tracking-tighter text-2xl italic">{REG[id].n}</span>
                         <span className="text-[9px] font-black uppercase tracking-widest text-white/20 italic">Native Buffer</span>
                      </div>
                      <button onClick={(e)=>{if(playSound)playSound('click',e); setIns([...ins, id]);}} className="w-full py-4 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black tracking-[0.2em] uppercase text-white hover:bg-white hover:text-black transition-all active:scale-95 italic">Synchronize</button>
                    </motion.div>
                    );
                 })}
                 {coreUninstalled.length === 0 && (
                    <div className="col-span-full py-16 liquid-well rounded-[3rem] text-center">
                       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic">All core nodes are operational and synchronized.</p>
                    </div>
                 )}
              </div>
           </section>

           {/* COMMUNITY HUB */}
           <section>
              <div className="flex items-center gap-6 mb-10">
                 <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-violet-500">Quantum Community Hub</h3>
                 <div className="h-px flex-1 bg-white/5" />
                 {loading && <Loader2 size={16} className="animate-spin text-violet-400"/>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                 {extApps.filter(a => !ins.includes(a.id)).map((a, idx) => {
                    const IconComponent = LucideIcons[a.icon] || LucideIcons.Box;
                    return (
                    <motion.div 
                      key={a.id} 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                      className="q-glass-light p-10 rounded-[3rem] flex flex-col gap-6 border-white/5 hover:border-white/20 transition-all relative overflow-hidden group"
                    >
                       <div className="flex items-center justify-between">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${a.img} shadow-2xl flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-transform`}>
                             {IconComponent && <IconComponent className="text-white drop-shadow-2xl" size={28} />}
                          </div>
                          <div className="flex flex-col items-end">
                             <span className="text-[8px] font-black tracking-widest text-white/20 uppercase">Auth: Verif.</span>
                             <span className="text-[10px] font-black text-violet-400 italic">v1.2.4</span>
                          </div>
                       </div>
                       <div>
                          <h4 className="font-black text-white tracking-tighter text-2xl italic mb-1">{a.title}</h4>
                          <p className="text-[10px] font-black tracking-widest uppercase text-white/20">Source: {a.dev}</p>
                       </div>
                       <p className="text-sm text-white/40 leading-relaxed font-medium line-clamp-3 flex-1">{a.desc}</p>
                       <button onClick={()=>handleInstallExt(a)} className="w-full py-5 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-black text-[10px] tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-violet-500/20 flex items-center justify-center gap-3 italic">
                           <Download size={16}/> Pull Logic
                       </button>
                    </motion.div>
                    );
                 })}
                 {!loading && extApps.length === 0 && (
                    <div className="col-span-full py-24 q-glass-light rounded-[3rem] border-dashed border-white/10 flex flex-col items-center justify-center gap-6 text-white/10 italic">
                       <CloudOff size={48} />
                       <p className="font-black text-xs uppercase tracking-[0.5em]">The Hub is waiting for logical frequency.</p>
                    </div>
                 )}
              </div>
           </section>

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
    <div className="w-full h-full bg-q-void flex overflow-hidden font-sans relative isolate">
       <div className="absolute inset-0 spatial-mesh opacity-10 pointer-events-none" />
       
       <div className="w-1/2 h-full flex flex-col p-16 border-r border-white/5 bg-black/20 backdrop-blur-3xl relative z-10">
          <div className="mb-20 flex items-center gap-6">
             <div className="w-16 h-16 rounded-[1.5rem] bg-white text-black flex items-center justify-center shadow-2xl group shadow-white/10 transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                <Code2 size={32} />
             </div>
             <div>
                <h2 className="text-4xl font-black tracking-tighter text-white italic uppercase">Forge</h2>
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(0,212,255,1)]" />
                   <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">Quantum Compiler v2.0</p>
                </div>
             </div>
          </div>
          
          <form className="flex-1 flex flex-col" onSubmit={handleGenerate}>
             <label className="text-[10px] font-black tracking-[0.4em] uppercase text-cyan-500/40 mb-8 ml-4">Architectural Blueprint</label>
             <textarea 
               value={prompt} onChange={e=>setPrompt(e.target.value)} disabled={status !== 'idle'} 
               className="w-full flex-1 q-glass rounded-[3rem] p-10 text-xl text-white outline-none focus:border-cyan-500/40 transition-all resize-none placeholder-white/5 mb-12 leading-relaxed font-bold border-white/5 shadow-2xl" 
               placeholder="Define the logic of your next node..."
             ></textarea>
             
             {status === 'idle' && (
                <button type="submit" disabled={!prompt} className="group relative w-full py-8 rounded-[2rem] bg-white text-black font-black text-2xl overflow-hidden active:scale-95 transition-all disabled:opacity-20 italic tracking-tighter shadow-2xl">
                   <span className="relative z-10">EMIT LOGIC_</span>
                   <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
             )}
             {status === 'generating' && (
                <div className="w-full py-8 rounded-[2rem] liquid-well text-cyan-400 font-black text-2xl flex items-center justify-center gap-6 italic tracking-tighter shadow-2xl border-white/10">
                   <motion.div animate={{rotate:360}} transition={{repeat:Infinity, duration:1.5, ease:'linear'}}><Cpu size={32}/></motion.div> Training Neural Gates...
                </div>
             )}
             {(status === 'done' || status === 'submitted') && (
                <button type="button" onClick={()=> {setPrompt(""); setCode(""); setStatus("idle");}} className="w-full py-8 rounded-[2rem] bg-white/5 border border-white/5 text-white/20 font-black text-2xl hover:text-white hover:bg-white/10 transition-all italic tracking-tighter">CLEAR_STATE</button>
             )}
          </form>
       </div>

       <div className="w-1/2 h-full flex flex-col bg-black/40 relative z-10 p-10">
          <div className="flex justify-between items-center mb-8 text-white/10 font-black text-[10px] tracking-[0.5em] uppercase ml-6">
            <div className="flex items-center gap-3"><Layers size={14}/> Node_Buffer.raw</div>
            <div className="flex gap-3">
               {[...Array(3)].map((_,i) => <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/5 border border-white/10"/>)}
            </div>
          </div>
          <div className="flex-1 liquid-well rounded-[3rem] p-12 overflow-hidden relative border border-white/5 shadow-2xl">
             <div className="absolute inset-0 noise-overlay opacity-5 pointer-events-none" />
             <AnimatePresence>
                {code ? (
                   <motion.div initial={{opacity:0, x: 20}} animate={{opacity:1, x: 0}} className="text-cyan-400 h-full overflow-y-auto whitespace-pre-wrap font-mono text-sm leading-relaxed scrollbar-thin">{code}</motion.div>
                ) : (
                   <div className="h-full flex flex-col items-center justify-center gap-4 opacity-5 italic">
                      <Terminal size={64} className="text-white" />
                      <p className="font-black tracking-tighter text-4xl text-white">READY_FOR_LINK</p>
                   </div>
                )}
             </AnimatePresence>
          </div>
          
          <AnimatePresence>
             {status === 'done' && (
                <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="mt-10">
                   <button onClick={handleEmailSubmit} className="w-full py-6 rounded-[2rem] bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-black flex items-center justify-center gap-4 hover:shadow-[0_0_60px_rgba(0,100,255,0.4)] transition-all hover:-translate-y-1 uppercase text-xs tracking-[0.3em] italic">
                      <Send size={18}/> Commit to Global Hub
                   </button>
                </motion.div>
             )}
          </AnimatePresence>
       </div>
    </div>
  );
}
