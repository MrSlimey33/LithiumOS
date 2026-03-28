import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, AlertCircle, ShoppingCart, Loader2, Download, CloudOff } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export default function Marketplace() {
  const [modal, setModal] = useState(null);
  const [apps, setApps] = useState([]);
  const [status, setStatus] = useState('loading'); // loading, success, error
  const id = window.localStorage.getItem('LITHIUM_CLOUD_ID');

  useEffect(() => {
    fetch('https://api.github.com/repos/MrSlimey33/LithiumOS/issues?labels=marketplace&state=open')
      .then(res => res.json())
      .then(data => {
        const parsedApps = [];
        for (const issue of data) {
           try {
             const body = issue.body || '';
             const jsonMatch = body.match(/```json\n([\s\S]*?)\n```/);
             if (jsonMatch && jsonMatch[1]) {
                const appData = JSON.parse(jsonMatch[1]);
                // Validate app
                if (appData.name && appData.url) {
                   parsedApps.push({
                      id: `ext_${issue.id}`,
                      title: appData.name,
                      dev: appData.developer || issue.user.login,
                      icon: appData.icon || 'Box',
                      img: appData.color || 'from-slate-700 to-slate-900',
                      desc: appData.description || 'No description provided.',
                      url: appData.url,
                      issueUrl: issue.html_url
                   });
                }
             }
           } catch (e) { console.error("Failed to parse app issue:", issue.id); }
        }
        setApps(parsedApps);
        setStatus(parsedApps.length > 0 ? 'success' : 'empty');
      })
      .catch(err => {
        console.error(err);
        setStatus('error');
      });
  }, []);

  const handleInstall = () => {
     if (!id) return;
     // Retrieve current external apps
     const extRaw = window.localStorage.getItem('LITHIUM_ext_apps');
     const extApps = extRaw ? JSON.parse(extRaw) : {};
     extApps[modal.id] = modal;
     window.localStorage.setItem('LITHIUM_ext_apps', JSON.stringify(extApps));

     // Add to core apps so it appears on desktop
     const coreRaw = window.localStorage.getItem('LITHIUM_apps_core');
     const core = coreRaw ? JSON.parse(coreRaw) : [];
     if (!core.includes(modal.id)) {
        core.push(modal.id);
        window.localStorage.setItem('LITHIUM_apps_core', JSON.stringify(core));
     }

     alert(`Successfully installed ${modal.title} to your Lithium Cloud ID! Launch LithiumOS to see it.`);
     setModal(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-500/30">
       <header className="relative py-32 px-6 text-center shadow-xl overflow-hidden isolate">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 to-blue-900/10 -z-10" />
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white text-glow">Marketplace</h1>
          <p className="text-xl font-light text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">Install custom web modules built by the community directly into your Lithium spatial environment.</p>
          <div className="max-w-xl mx-auto relative group">
             <input type="text" className="w-full glass-dark border border-white/10 rounded-full py-4 px-12 text-white outline-none focus:border-blue-500/50 transition-all font-medium text-lg placeholder-slate-500" placeholder="Search community modules..." />
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          </div>
       </header>

       <div className="max-w-7xl mx-auto px-6 py-20 min-h-[40vh]">
          {status === 'loading' && (
             <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-4 mt-20">
                <Loader2 size={40} className="animate-spin text-blue-500" />
                <p className="font-bold tracking-widest uppercase text-sm">Syncing with GitHub Registry...</p>
             </div>
          )}

          {status === 'empty' && (
             <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-4 mt-20">
                <CloudOff size={48} className="opacity-20" />
                <p className="font-bold tracking-widest uppercase text-sm">No modules found in the registry.</p>
             </div>
          )}

          {status === 'error' && (
             <div className="w-full h-full flex flex-col items-center justify-center text-rose-500 gap-4 mt-20">
                <AlertCircle size={48} className="opacity-50" />
                <p className="font-bold tracking-widest uppercase text-sm">Failed to connect to marketplace.</p>
             </div>
          )}

          {status === 'success' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {apps.map((a) => {
                   const IconCmp = LucideIcons[a.icon] || LucideIcons.Box;
                   return (
                      <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} key={a.id} className="glass-dark rounded-[2.5rem] p-8 border border-white/10 hover:-translate-y-2 transition-all cursor-pointer flex flex-col items-center text-center group hover:shadow-[0_20px_40px_rgba(59,130,246,0.1)]" onClick={()=>setModal(a)}>
                         <div className={`w-24 h-24 rounded-[1.8rem] bg-gradient-to-br ${a.img} shadow-inner mb-6 flex items-center justify-center border border-white/20 group-hover:scale-105 transition-transform`}>
                            <IconCmp className="text-white drop-shadow-md" size={36} />
                         </div>
                         <h3 className="text-xl font-bold text-white mb-2">{a.title}</h3>
                         <p className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-4">{a.dev}</p>
                         <p className="text-sm text-slate-400 line-clamp-2">{a.desc}</p>
                      </motion.div>
                   );
                })}
             </div>
          )}
       </div>

       <AnimatePresence>
          {modal && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4 isolate">
                <motion.div initial={{scale:0.95, opacity:0, y:20}} animate={{scale:1, opacity:1, y:0}} exit={{scale:0.95, opacity:0, y:20}} className="glass-dark rounded-[3rem] p-10 max-w-lg w-full shadow-2xl relative text-center border border-white/10">
                   
                   <div className="mb-6">
                      <div className={`w-32 h-32 mx-auto rounded-[2rem] bg-gradient-to-br ${modal.img} shadow-lg mb-6 flex items-center justify-center border border-white/20`}>
                         {React.createElement(LucideIcons[modal.icon] || LucideIcons.Box, { size: 48, className: "text-white drop-shadow-md" })}
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2">{modal.title}</h2>
                      <p className="text-xs text-blue-400 font-bold mb-6 block uppercase tracking-widest">By: {modal.dev}</p>
                      <p className="text-slate-400 leading-relaxed mb-8">{modal.desc}</p>
                   </div>
                   
                   {!id ? (
                      <div className="bg-rose-500/10 text-rose-400 p-4 rounded-2xl flex items-center justify-center gap-3 font-bold mb-6 border border-rose-500/20 text-sm">
                         <AlertCircle size={18}/> You must be logged in to install.
                      </div>
                   ) : (
                      <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-2xl flex items-center justify-center gap-3 font-bold mb-6 border border-emerald-500/20 text-sm">
                         <Sparkles size={18}/> Ready to deploy to your Lithium instance.
                      </div>
                   )}
                   
                   <div className="flex gap-4 w-full">
                      <button className="flex-1 bg-slate-800 text-white py-4 font-bold rounded-2xl hover:bg-slate-700 transition-colors" onClick={()=>setModal(null)}>Cancel</button>
                      <button disabled={!id} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 font-bold rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 flex items-center justify-center gap-2" onClick={handleInstall}>
                         <Download size={18}/> Install Module
                      </button>
                   </div>
                </motion.div>
             </div>
          )}
       </AnimatePresence>
    </div>
  )
}

