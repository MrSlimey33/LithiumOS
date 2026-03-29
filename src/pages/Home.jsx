import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Zap, Shield, Layout, Cpu, Globe } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* NAVIGATIONBAR */}
      <nav className="fixed top-0 inset-x-0 h-14 glass-liquid z-[100] flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
          <div className="w-6 h-6 rounded bg-white flex items-center justify-center shadow-lg shadow-white/10"><Zap size={14} className="text-black fill-black" /></div>
          <span className="text-sm font-black tracking-tighter uppercase italic">Lithium</span>
        </div>
        <div className="flex items-center gap-8 text-[10px] font-black tracking-widest uppercase text-slate-500">
           <a href="#/marketplace" className="hover:text-white transition-colors">Market</a>
           <a href="#/developers" className="hover:text-white transition-colors">Nodes</a>
           <a href="#/technology" className="hover:text-white transition-colors">Engine</a>
           <button onClick={() => navigate('/login')} className="bg-white text-black px-4 py-1.5 rounded-full hover:scale-105 transition-transform active:scale-95 text-[10px] font-black uppercase">Launch</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.35, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 -z-10"
        >
          {/* Note: In a real deploy, ensure the path is correct relative to public/src */}
          <img 
            src="/LithiumOS/src/lithium_hero_abstract_1774731906213.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2070";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" />
        </motion.div>

        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="max-w-5xl">
          <h1 className="text-6xl md:text-[140px] font-black tracking-tighter leading-[0.85] mb-8 shimmer-text">
            Pure Spatial.<br/>Zero Limits.
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto mb-14 leading-relaxed tracking-tight">
            The minimalist operating system for high-performance builders. One OS. Every device. Natively hosted for the solo-dev era.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
             <button onClick={() => navigate('/login')} className="px-12 py-6 bg-white text-black rounded-full font-black text-xl hover:scale-105 transition-transform active:scale-95 shadow-2xl shadow-white/10 flex items-center gap-2">
                Launch Lithium <ChevronRight size={20} />
             </button>
             <button onClick={() => navigate('/technology')} className="text-white font-bold text-xl hover:text-blue-400 transition-colors flex items-center gap-1 group">
                Review the Engine <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </motion.div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
           <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-slate-400">Scroll</span>
           <div className="w-px h-16 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* FEATURE GRIDS: THE APPLE WAY */}
      <section className="py-40 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
         <motion.div initial={{y:40, opacity:0}} whileInView={{y:0, opacity:1}} className="col-span-1 md:col-span-2 glass-liquid rounded-[4rem] p-12 md:p-24 overflow-hidden relative group">
            <div className="relative z-10 max-w-2xl">
               <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-10"><Cpu size={28}/></div>
               <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.95]">The Node Engine.<br/>Native Execution.</h2>
               <p className="text-xl text-slate-400 leading-relaxed mb-12 font-medium">Lithium transforms your web apps into 'Nodes'—sandboxed native modules executed with precision directly in the spatial environment. No external hosting. No latency. Just raw logic.</p>
               <button onClick={() => navigate('/developers')} className="text-blue-400 font-black text-lg flex items-center gap-2 hover:gap-6 transition-all uppercase tracking-widest">Learn About Nodes <ChevronRight size={20}/></button>
            </div>
            <div className="absolute -right-40 -bottom-40 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[160px] group-hover:bg-blue-500/10 transition-all pointer-events-none" />
         </motion.div>

         <motion.div initial={{y:40, opacity:0}} whileInView={{y:0, opacity:1}} className="glass-liquid rounded-[3.5rem] p-16 relative overflow-hidden group min-h-[500px] flex flex-col justify-end">
            <Shield className="text-white mb-10 opacity-20" size={64} />
            <h3 className="text-4xl font-black tracking-tighter mb-6 text-white">Encrypted Vaults.</h3>
            <p className="text-lg text-slate-400 leading-relaxed font-medium">Your data belongs to you. Period. We use standard AES-256 local-first encryption with GitHub cloud syncing using your own personal token.</p>
         </motion.div>

         <motion.div initial={{y:40, opacity:0}} whileInView={{y:0, opacity:1}} className="glass-liquid rounded-[3.5rem] p-16 relative overflow-hidden group min-h-[500px] flex flex-col justify-end">
            <Layout className="text-white mb-10 opacity-20" size={64} />
            <h3 className="text-4xl font-black tracking-tighter mb-6 text-white">Spatial Logic.</h3>
            <p className="text-lg text-slate-400 leading-relaxed font-medium">A windowing system that respects your focus. Smooth transitions, intelligent snapping, and deep customizability for every solo-dev task.</p>
         </motion.div>
      </section>

      {/* MARKETPLACE TEASER */}
      <section className="py-60 px-6 text-center border-t border-white/5 relative overflow-hidden">
         <div className="absolute inset-0 bg-blue-600/5 blur-[120px] -z-10" />
         <motion.div initial={{scale:0.95, opacity:0}} whileInView={{scale:1, opacity:1}} transition={{duration:1}} className="max-w-4xl mx-auto">
            <h2 className="text-6xl md:text-[100px] font-black tracking-tighter mb-10 shimmer-text">The Ecosystem.</h2>
            <p className="text-xl md:text-2xl text-slate-400 mb-16 max-w-2xl mx-auto leading-relaxed font-medium">Browse hundreds of community-built Node apps in our zero-cost marketplace. One-click installs. Infinite possibilities.</p>
            <button onClick={() => navigate('/marketplace')} className="bg-white text-black px-16 py-7 rounded-full font-black text-2xl hover:scale-110 active:scale-95 transition-all shadow-4xl shadow-white/20">
                Explore The Marketplace
            </button>
         </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 px-6 border-t border-white/5 text-center">
         <div className="flex justify-center gap-16 mb-16 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
            <a href="https://github.com/MrSlimey33/LithiumOS" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
            <a href="#" className="hover:text-white transition-colors">X</a>
         </div>
         <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.5em]">© 2026 Lithium Project. Built for the high-end solo-dev.</p>
      </footer>
    </div>
  );
}
