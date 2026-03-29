import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Shield, Globe, Layers, Wind, ChevronRight } from 'lucide-react';

export default function Technology() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
       {/* HERO SECTION */}
       <section className="relative pt-40 pb-20 px-6 text-center overflow-hidden">
          <motion.div initial={{opacity:0, scale:1.1}} animate={{opacity:0.3, scale:1}} transition={{duration:2}} className="absolute inset-x-0 top-0 h-[70vh] -z-10">
             <img 
               src="/LithiumOS/src/lithium_node_engine_liquid_1774731943765.png" 
               alt="Engine Core" 
               className="w-full h-full object-cover" 
               onError={(e) => {
                 e.target.src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072";
               }}
             />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
          </motion.div>

          <motion.div initial={{y:40, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:1}} className="max-w-4xl mx-auto relative z-10">
             <h1 className="text-6xl md:text-[100px] font-black tracking-tighter leading-[0.85] mb-8 shimmer-text">
                The Logic<br/>Engine.
             </h1>
             <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed tracking-tight">
                Standard containers are too heavy. Iframes are too fragile. We built the Node Standard—a secure, lightweight execution layer for the modern web.
             </p>
          </motion.div>
       </section>

       {/* TECHNICAL SPECS */}
       <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
             <motion.div initial={{x:-40, opacity:0}} whileInView={{x:0, opacity:1}} className="glass-liquid rounded-[4rem] p-12 md:p-20 group">
                <Wind className="text-blue-500 mb-8 group-hover:rotate-12 transition-transform" size={48} />
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-tight">Zero-Latency<br/>Virtualization.</h2>
                <p className="text-lg text-slate-400 leading-relaxed font-medium">Lithium uses a custom `srcDoc` orchestration engine that bypasses traditional network overhead. Nodes boot in under 5ms, sharing the OS core's performance without compromising security.</p>
             </motion.div>

             <motion.div initial={{x:40, opacity:0}} whileInView={{x:0, opacity:1}} className="glass-liquid rounded-[4rem] p-12 md:p-20 group">
                <Shield className="text-indigo-500 mb-8 group-hover:scale-110 transition-transform" size={48} />
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-tight">Hardened<br/>Sandboxing.</h2>
                <p className="text-lg text-slate-400 leading-relaxed font-medium">Every Node is isolated using a strict manifest-based policy. No cross-origin access, restricted local storage, and delegated event handling keep the OS core invisible to community logic.</p>
             </motion.div>
          </div>

          <motion.div initial={{y:40, opacity:0}} whileInView={{y:0, opacity:1}} className="glass-liquid rounded-[4rem] p-12 md:p-20 mb-32 relative overflow-hidden group">
             <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <div>
                   <h3 className="text-6xl md:text-7xl font-black text-blue-500 mb-2 tracking-tighter">0.0ms</h3>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Network Latency</p>
                </div>
                <div>
                   <h3 className="text-6xl md:text-7xl font-black text-indigo-500 mb-2 tracking-tighter">AES</h3>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Vault Encryption</p>
                </div>
                <div>
                   <h3 className="text-6xl md:text-7xl font-black text-white mb-2 tracking-tighter">100%</h3>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Native Context</p>
                </div>
             </div>
             <div className="absolute inset-0 bg-blue-600/5 -z-10 blur-[100px] pointer-events-none" />
          </motion.div>

          {/* PERFORMANCE GRID */}
          <div className="text-center py-20">
             <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-16 shimmer-text">Engine DNA.</h2>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {['React 19', 'Tailwind v4', 'Framer Motion', 'Vite 6', 'Lucide Icons', 'GitHub API', 'Standard JS', 'Node Schema'].map((tech) => (
                   <div key={tech} className="liquid-well py-8 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] text-slate-500 group hover:text-white hover:bg-white/5 transition-all border border-white/5">
                      {tech}
                   </div>
                ))}
             </div>
          </div>
       </section>

       {/* FOOTER */}
       <footer className="py-24 px-6 border-t border-white/5 text-center mt-32">
          <div className="flex justify-center items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-slate-700">
             <Cpu size={14}/> Integrated Engine Core / v2.0
          </div>
          <p className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.4em]">Lithium Technology Group © 2026</p>
       </footer>
    </div>
  );
}
