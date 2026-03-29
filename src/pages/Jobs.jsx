import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, UserCheck, Search, Activity, Cpu } from 'lucide-react';

export default function Jobs() {
  return (
    <div className="min-h-screen bg-q-void text-white pt-40 pb-32 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full spatial-mesh opacity-10 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-500/10 blur-[140px] rounded-full group animate-pulse-glow" />
      
      <div className="max-w-4xl mx-auto relative z-10 text-center">
         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
           className="w-24 h-24 bg-rose-500/10 text-rose-500 rounded-[2rem] flex items-center justify-center mb-12 mx-auto border border-rose-500/20 shadow-2xl"
         >
            <Shield size={48} />
         </motion.div>

         <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] mb-10 italic uppercase shimmer-text">
            UNAVAILABLE_
         </h1>
         <p className="text-xl md:text-2xl text-q-text-secondary mb-20 max-w-2xl mx-auto leading-relaxed italic">
            "The architecture and infrastructure of Lithium is currently being maintained by a single-node founder protocol."
         </p>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="q-glass rounded-[3rem] p-10 border-white/5 relative overflow-hidden group">
               <div className="flex items-center gap-4 mb-6">
                  <Activity size={20} className="text-cyan-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Operational Status</span>
               </div>
               <h3 className="text-2xl font-black mb-4 italic text-white uppercase italic">Zero Growth Policy</h3>
               <p className="text-sm text-q-text-secondary leading-relaxed font-medium">I'm currently not hiring humans. Code is faster than consensus, and Lithium thrives on individual sovereignty.</p>
            </div>

            <div className="q-glass rounded-[3rem] p-10 border-white/5 relative overflow-hidden group">
               <div className="flex items-center gap-4 mb-6">
                  <Cpu size={20} className="text-violet-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Next Synchronization</span>
               </div>
               <h3 className="text-2xl font-black mb-4 italic text-white uppercase italic">Future Horizon: 2027</h3>
               <p className="text-sm text-q-text-secondary leading-relaxed font-medium">When the network matures and the browser-kernel scales, I may consider peer nodes for low-level development.</p>
            </div>
         </div>

         <div className="mt-40 pt-20 border-t border-white/5 opacity-40">
            <p className="text-[10px] font-black tracking-[0.5em] uppercase mb-4 italic">Work with Lithium // 0 Positions Open</p>
         </div>
      </div>
    </div>
  );
}
