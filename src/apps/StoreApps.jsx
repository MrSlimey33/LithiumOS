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
        const parsedApps = [];
         for (const issue of data) {
            try {
              const body = issue.body || '';
              // More robust regex
              const jsonMatch = body.match(/```json\s*([\s\S]*?)\s*```/);
              if (jsonMatch && jsonMatch[1]) {
                 const appData = JSON.parse(jsonMatch[1].trim());
                 if (appData.name && appData.code) {
                    parsedApps.push({
                       id: `ext_${issue.id}`,
                       title: appData.name,
                       dev: appData.developer || issue.user.login,
                       icon: appData.icon || 'Box',
                       img: appData.color || 'from-slate-700 to-slate-900',
                       desc: appData.description || 'No description provided.',
                       code: appData.code
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
    <div className="w-full h-full bg-slate-50/80 backdrop-blur-xl text-slate-800 flex flex-col pt-6 font-sans">
      <div className="px-8 flex justify-between items-end border-b border-slate-200/50 pb-4 mb-2 shrink-0">
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 text-slate-900"><Store className="text-purple-500" size={32}/> Ecosystem</h2>
        <div className="flex gap-3">
           <a href="#/developers" target="_blank" className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-lg hover:bg-slate-800 transition-all hover:-translate-y-1">
              Publish Module <ExternalLink size={14} />
           </a>
           <button onClick={()=>{if(playSound)playSound('open',{}); openDevStudio();}} className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all hover:-translate-y-1 group">
              <Sparkles size={14} className="group-hover:rotate-12 transition-transform" /> Dev Studio
           </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-8 pb-10 scrollbar-hide space-y-10">
        
        {/* Core Modules Section */}
        <div>
           <h3 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-4 ml-2 mt-4">Core Modules</h3>
           {coreUninstalled.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                 {coreUninstalled.map(id => {
                   const Ic = REG[id].ic;
                   return (
                   <div key={`store-core-${id}`} className="bg-white/80 p-6 rounded-[2rem] border border-white/50 shadow-sm flex flex-col items-center justify-center text-center gap-3 hover:-translate-y-1 hover:shadow-xl transition-all">
                     <div className={`w-16 h-16 rounded-3xl flex items-center justify-center bg-gradient-to-br ${REG[id].c} ${REG[id].t} shadow-inner drop-shadow-sm`}><Ic size={32}/></div>
                     <span className="font-bold text-slate-800 tracking-tight">{REG[id].n}</span>
                     <button onClick={(e)=>{if(playSound)playSound('click',e); setIns([...ins, id]);}} className="mt-2 text-[10px] font-bold tracking-widest uppercase bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-blue-600 transition-colors active:scale-95 w-full">Install</button>
                   </div>
                   );
                 })}
              </div>
           ) : (
              <div className="bg-white/40 border border-slate-200/50 rounded-3xl p-6 text-center text-sm font-medium text-slate-500">All core modules installed.</div>
           )}
        </div>

        {/* Community Modules Section */}
        <div>
           <h3 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-4 ml-2 flex justify-between items-center">
             Community Hub {loading && <Loader2 size={14} className="animate-spin text-blue-500 inline ml-2"/>}
           </h3>
           {!loading && extApps.length === 0 && (
              <div className="bg-white/40 border border-slate-200/50 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 text-slate-500 text-center">
                 <CloudOff size={32} className="opacity-40" />
                 <p className="font-medium text-sm">No community modules found. Be the first to publish one!</p>
              </div>
           )}
           <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
               {extApps.filter(a => !ins.includes(a.id)).map(a => {
                  const IconComponent = LucideIcons[a.icon] || LucideIcons.Box || LucideIcons.Zap;
                  return (
                  <div key={a.id} className="bg-white/80 p-6 rounded-[2rem] border border-white/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:-translate-y-1 hover:shadow-xl transition-all relative overflow-hidden group">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${a.img} shadow-inner mb-2 flex items-center justify-center border border-white/20`}>
                       {IconComponent && <IconComponent className="text-white drop-shadow-md" size={32} />}
                    </div>
                   <h4 className="font-bold text-slate-800 tracking-tight truncate w-full px-2">{a.title}</h4>
                   <p className="text-[9px] font-bold tracking-widest uppercase text-slate-400">By {a.dev}</p>
                   <p className="text-xs text-slate-500 line-clamp-2 my-2">{a.desc}</p>
                   <button onClick={()=>handleInstallExt(a)} className="mt-auto text-[10px] font-bold tracking-widest uppercase bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-full hover:brightness-110 active:scale-95 transition-all shadow-md w-full flex items-center justify-center gap-2">
                       <Download size={12}/> Get
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
  const [status, setStatus] = useState("idle"); // idle, generating, done, submitted
  const [code, setCode] = useState("");

  const handleGenerate = (e) => {
    e.preventDefault();
    if(!prompt) return;
    if(playSound) playSound('click', null);
    setStatus("generating");
    
    // Simulate AI generation time
    setTimeout(() => {
      setCode(`import React from 'react';\n\nexport default function CustomApp() {\n  return (\n    <div className="w-full h-full p-8 flex flex-col items-center justify-center text-center">\n      <h1 className="text-3xl font-bold mb-4">You built: ${prompt.slice(0, 20)}...</h1>\n      <p className="text-slate-500">This app was dynamically generated by Lithium AI.</p>\n    </div>\n  );\n}`);
      setStatus("done");
    }, 2500);
  };

  const handleEmailSubmit = () => {
    if(playSound) playSound('click', null);
    setStatus("submitted");
    // In a real scenario, this would POST to Formspree/EmailJS
    // Try opening mailto as a fallback real-world interaction
    setTimeout(() => {
       window.open(`mailto:admin@lithiumos.com?subject=New App Submission&body=I created an app: ${prompt}. Please review my code.`);
    }, 500);
  };

  return (
    <div className="w-full h-full bg-[#0a0a0c] text-white flex overflow-hidden font-sans isolate relative">
       <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay pointer-events-none" />
       
       <div className="w-1/2 h-full flex flex-col p-10 border-r border-[#1f2023] bg-[#0d0e12] relative z-10">
          <div className="mb-10 flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20"><Code2 size={24} /></div>
             <div><h2 className="text-2xl font-bold tracking-tight">Developer Studio</h2><p className="text-slate-400 text-sm font-medium">Lithium AI Code Generator</p></div>
          </div>
          
          <form className="flex-1 flex flex-col" onSubmit={handleGenerate}>
             <label className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-4">Describe Your App</label>
             <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} disabled={status !== 'idle'} className="w-full flex-1 bg-[#15171c] border border-[#2a2c33] rounded-[1.5rem] p-6 text-lg text-slate-200 outline-none focus:border-blue-500/50 transition-colors resize-none placeholder-slate-600 mb-6" placeholder="E.g. A beautiful pomodoro timer with glassmorphic buttons and a relaxing particle background..."></textarea>
             
             {status === 'idle' && (
                <button type="submit" disabled={!prompt} className="w-full py-5 rounded-[1.5rem] bg-white text-black font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)]"><Sparkles size={20}/> Generate React Code</button>
             )}
             {status === 'generating' && (
                <button disabled className="w-full py-5 rounded-[1.5rem] bg-[#15171c] text-slate-400 font-bold text-lg flex items-center justify-center gap-3 border border-[#2a2c33]"><motion.div animate={{rotate:360}} transition={{repeat:Infinity, duration:1, ease:'linear'}}><Cpu size={20}/></motion.div> Training Node Core...</button>
             )}
             {(status === 'done' || status === 'submitted') && (
                <button type="button" onClick={()=> {setPrompt(""); setCode(""); setStatus("idle");}} className="w-full py-5 rounded-[1.5rem] bg-[#15171c] text-slate-300 font-bold text-lg hover:bg-[#1a1d24] transition-colors border border-[#2a2c33]">Reset Environment</button>
             )}
          </form>
       </div>

       <div className="w-1/2 h-full flex flex-col bg-[#050505] relative z-10 font-mono text-sm leading-relaxed p-6">
          <div className="flex justify-between items-center mb-4 text-[#30363d] font-bold text-xs tracking-widest uppercase">
            <span>Editor_Preview.js</span>
            <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-[#ff7b72]"/><div className="w-3 h-3 rounded-full bg-[#d2a8ff]"/><div className="w-3 h-3 rounded-full bg-[#3fb950]"/></div>
          </div>
          <div className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 overflow-hidden relative">
             <AnimatePresence>
                {code ? (
                   <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-[#a5d6ff] h-full overflow-y-auto whitespace-pre-wrap">{code}</motion.div>
                ) : (
                   <p className="text-[#30363d] italic absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">// Waiting for AI context stream...</p>
                )}
             </AnimatePresence>
          </div>
          
          <AnimatePresence>
             {status === 'done' && (
                <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="mt-6">
                   <button onClick={handleEmailSubmit} className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold font-sans flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-emerald-500/20 transition-all hover:-translate-y-1"><Send size={18}/> Submit to Lithium Market Review</button>
                </motion.div>
             )}
             {status === 'submitted' && (
                <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="mt-6 flex flex-col items-center justify-center p-6 bg-emerald-900/20 border border-emerald-500/30 rounded-xl text-emerald-400 font-sans text-center gap-2">
                   <CheckCircle2 size={32} className="mb-2"/>
                   <p className="font-bold text-lg">App Submitted to Admin!</p>
                   <p className="text-sm opacity-80">You will receive an email upon review completion.</p>
                </motion.div>
             )}
          </AnimatePresence>
       </div>
    </div>
  )
}
