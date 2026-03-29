import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, AlertCircle, ShoppingCart, Loader2, Download, CloudOff, ChevronRight, Layout, Zap, Database } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export default function Marketplace() {
  const [modal, setModal] = useState(null);
  const [apps, setApps] = useState([]);
  const [status, setStatus] = useState('loading'); // loading, success, error, empty
  const id = window.localStorage.getItem('LITHIUM_CLOUD_ID');

  useEffect(() => {
    fetch('https://api.github.com/repos/MrSlimey33/LithiumOS/issues?state=open&per_page=100')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) throw new Error("Invalid API Response");
        
        const parsedApps = [];
        for (const issue of data) {
           try {
              const body = issue.body || '';
              // ROBUST REGEX (handles \r\n and additional whitespace)
              const jsonMatch = body.match(/```json\s*([\s\S]*?)\s*```/);
              if (jsonMatch && jsonMatch[1]) {
                 const appData = JSON.parse(jsonMatch[1].trim());
                 
                 // V2 DATA VALIDATION (CRASH PREVENTION)
                 // We MUST have a name and some form of executable (code or legacy url)
                 if (appData.name && (appData.code || appData.url)) {
                    parsedApps.push({
                       id: `ext_${issue.id}`,
                       title: String(appData.name).slice(0, 40),
                       dev: appData.developer || issue.user.login,
                       // SAFE ICON FALLBACK
                       icon: appData.icon || 'Box',
                       img: appData.color || 'from-slate-700 to-slate-900',
                       desc: appData.description || 'A native Lithium Node module.',
                       // Handle case where code might be missing but we don't want to crash
                       code: appData.code || `<!-- Legacy Module -->\n<iframe src="${appData.url}" style="width:100%;height:100%;border:none;"></iframe>`,
                       issueUrl: issue.html_url
                    });
                 }
              }
           } catch (e) { 
              console.warn("Skipping malformed app issue:", issue.id, e); 
           }
        }
        setApps(parsedApps);
        setStatus(parsedApps.length > 0 ? 'success' : 'empty');
      })
      .catch(err => {
        console.error("Marketplace Fetch Error:", err);
        setStatus('error');
      });
  }, []);

  const handleInstall = (app) => {
     if (!id) return;
     const extRaw = window.localStorage.getItem('LITHIUM_ext_apps');
     const extApps = extRaw ? JSON.parse(extRaw) : {};
     extApps[app.id] = app;
     window.localStorage.setItem('LITHIUM_ext_apps', JSON.stringify(extApps));

     const coreRaw = window.localStorage.getItem('LITHIUM_apps_core');
     const core = coreRaw ? JSON.parse(coreRaw) : [];
     if (!core.includes(app.id)) {
        core.push(app.id);
        window.localStorage.setItem('LITHIUM_apps_core', JSON.stringify(core));
     }

     alert(`Successfully installed ${app.title} to your Lithium Cloud ID!`);
     setModal(null);
  };

  return (
    <div className="min-h-screen bg-black font-sans text-white selection:bg-blue-500/30 overflow-x-hidden">
       {/* PREMIUM HEADER */}
       <header className="relative h-[80vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
          <motion.div initial={{opacity:0, scale:1.1}} animate={{opacity:0.25, scale:1}} transition={{duration:2}} className="absolute inset-0 -z-10">
             <img src="/LithiumOS/src/lithium_ecosystem_glass_1774731922652.png" alt="Ecosystem" className="w-full h-full object-cover" />
             <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </motion.div>

          <motion.div initial={{y:40, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:1}} className="max-w-4xl relative z-10">
             <div className="flex items-center justify-center gap-2 mb-8 text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">
                <Database size={14}/> Node Marketplace
             </div>
             <h1 className="text-6xl md:text-[120px] font-black tracking-tighter leading-[0.85] mb-8 shimmer-text">
                The New<br/>Digital Library.
             </h1>
             <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
                Browse hundreds of community-built native modules. Scalable, zero-config, and instantly executable on any device.
             </p>
             <div className="max-w-xl mx-auto relative">
                <input type="text" className="w-full glass-liquid rounded-full py-5 px-14 text-white outline-none focus:ring-4 ring-blue-500/20 transition-all font-bold text-lg placeholder-slate-600" placeholder="Search the library..." />
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={24} />
             </div>
          </motion.div>
       </header>

       <div className="max-w-7xl mx-auto px-6 py-32 min-h-[60vh]">
          {status === 'loading' && (
             <div className="w-full h-full flex flex-col items-center justify-center gap-8 py-20">
                <motion.div animate={{rotate:360}} transition={{repeat:Infinity, duration:1, ease:'linear'}} className="w-12 h-12 rounded-full border-2 border-white/5 border-t-white" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">Syncing with Registry</p>
             </div>
          )}

          {status === 'empty' && (
             <div className="w-full py-20 text-center flex flex-col items-center gap-6">
                <CloudOff size={64} className="text-slate-800" />
                <h3 className="text-3xl font-black tracking-tight">The Library is Empty.</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Be the first to push a new Node to the public registry using the Dev Studio.</p>
             </div>
          )}

          {status === 'success' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {apps.map((a, i) => {
                   const IconComponent = LucideIcons[a.icon] || LucideIcons.Box;
                   return (
                      <motion.div 
                        initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} transition={{delay: i * 0.05}}
                        key={a.id} className="glass-liquid rounded-[3.5rem] p-10 flex flex-col items-center text-center group hover:scale-[1.02] transition-all cursor-pointer"
                        onClick={() => setModal(a)}
                      >
                         <div className={`w-28 h-28 rounded-[2.2rem] bg-gradient-to-br ${a.img} shadow-inner mb-8 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform`}>
                            {IconComponent && <IconComponent className="text-white drop-shadow-2xl" size={42} />}
                         </div>
                         <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{a.title}</h3>
                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-6">By {a.dev}</span>
                         <p className="text-sm text-slate-400 font-medium leading-relaxed line-clamp-2">{a.desc}</p>
                      </motion.div>
                   );
                })}
             </div>
          )}
       </div>

       {/* MODAL REDESIGN */}
       <AnimatePresence>
          {modal && (
             <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-3xl p-6">
                <motion.div 
                   initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}}
                   className="glass-liquid rounded-[4rem] p-12 max-w-xl w-full shadow-4xl text-center border border-white/5 relative"
                >
                   <div className="mb-10">
                      <div className={`w-32 h-32 mx-auto rounded-[3rem] bg-gradient-to-br ${modal.img} shadow-2xl mb-10 flex items-center justify-center border border-white/20`}>
                         {(() => {
                            const ModalIcon = LucideIcons[modal.icon] || LucideIcons.Box;
                            return ModalIcon ? <ModalIcon size={56} className="text-white drop-shadow-2xl" /> : null;
                         })()}
                      </div>
                      <h2 className="text-5xl font-black text-white mb-3 tracking-tighter">{modal.title}</h2>
                      <p className="text-sm text-blue-500 font-black mb-8 uppercase tracking-widest leading-none underline underline-offset-8 decoration-blue-500/20">Certified Node Module</p>
                      <p className="text-lg text-slate-400 leading-relaxed font-medium mb-12">{modal.desc}</p>
                   </div>
                   
                   {!id ? (
                      <div className="bg-white/5 p-6 rounded-3xl text-slate-500 font-bold mb-10 text-sm italic">You must be logged into Lithium to deploy.</div>
                   ) : (
                      <div className="bg-blue-600/10 text-blue-400 p-6 rounded-3xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest border border-blue-500/20 mb-10">
                         <Sparkles size={16}/> Ready for Native Engine Boot
                      </div>
                   )}
                   
                   <div className="flex gap-6">
                      <button className="flex-1 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors" onClick={()=>setModal(null)}>Dismiss</button>
                      <button disabled={!id} onClick={() => handleInstall(modal)} className="flex-[3] bg-white text-black py-5 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 disabled:opacity-20 flex items-center justify-center gap-2">
                         <Download size={22}/> Install Node
                      </button>
                   </div>
                </motion.div>
             </div>
          )}
       </AnimatePresence>
    </div>
  );
}
