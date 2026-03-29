import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Zap, Sparkles, ArrowUpRight, Shield, Layers } from 'lucide-react';

const MerchCard = ({ title, price, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
    className="group cursor-pointer"
  >
    <div className="aspect-[4/5] q-glass rounded-[3rem] mb-8 overflow-hidden border-white/5 relative shadow-2xl">
       <div className="absolute inset-0 spatial-mesh opacity-20" />
       <div className={`w-full h-full bg-gradient-to-br ${color} opacity-10 group-hover:opacity-30 transition-all duration-700 group-hover:scale-110`} />
       <div className="absolute inset-0 flex items-center justify-center">
          <Layers size={120} className="text-white opacity-5 group-hover:opacity-20 transition-all duration-700 group-hover:rotate-12" />
       </div>
       <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <button className="bg-white text-black px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-2xl">
             Reserve Node <ArrowUpRight size={14}/>
          </button>
       </div>
    </div>
    <div className="flex justify-between items-end px-4">
       <div>
          <h3 className="text-2xl font-black text-white tracking-tighter italic uppercase">{title}</h3>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-2 italic">Official Lithium Artifact</p>
       </div>
       <div className="text-right">
          <span className="text-xl font-mono font-black text-cyan-400 italic">${price}</span>
       </div>
    </div>
  </motion.div>
);

export default function Merch() {
  return (
    <div className="min-h-screen bg-q-void text-white pt-40 pb-32 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full spatial-mesh opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[60vw] h-[60vh] bg-cyan-500/5 blur-[160px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-32">
           <div className="max-w-2xl">
              <motion.div
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="inline-flex items-center gap-2 text-cyan-400 mb-6 font-black text-[10px] uppercase tracking-[0.4em]"
              >
                 <ShoppingBag size={16} /> The Armory
              </motion.div>
              <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] italic uppercase shimmer-text">
                LITHIUM <br /> GEAR_
              </h1>
           </div>
           <p className="text-xl text-q-text-secondary italic font-medium max-w-sm text-right leading-relaxed mb-4">
             "Wear the future. 17% of every acquisition supports my caffeine synchronization protocol."
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <MerchCard 
            title="'Solo Dev' Hoodie"
            price="64.00"
            color="from-cyan-500 to-indigo-600"
            delay={0.1}
          />
          <MerchCard 
            title="Kernel Cap v5"
            price="32.00"
            color="from-rose-500 to-orange-600"
            delay={0.2}
          />
          <MerchCard 
            title="WASM Protocol Tee"
            price="38.00"
            color="from-violet-500 to-emerald-500"
            delay={0.3}
          />
        </div>

        {/* Exclusive Membership */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 p-16 rounded-[4rem] q-glass border-white/5 relative overflow-hidden flex flex-col items-center text-center shadow-2xl"
        >
           <div className="absolute inset-0 spatial-mesh opacity-5" />
           <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-10 border border-white/10 shadow-2xl group cursor-pointer hover:scale-110 transition-transform">
              <Sparkles size={40} className="text-cyan-400 group-hover:rotate-12 transition-transform" />
           </div>
           <h2 className="text-4xl md:text-6xl font-black mb-8 italic uppercase tracking-tighter">Genesis Node Member</h2>
           <p className="text-xl text-white/40 mb-12 max-w-2xl italic font-medium leading-relaxed">
             Unlock early access to future OS droplets, private terminal themes, and physical artifacts.
           </p>
           <button className="btn-primary px-16 py-6 rounded-3xl text-xs tracking-[0.4em] font-black uppercase italic shadow-2xl hover:shadow-cyan-500/20">Aquire Membership</button>
        </motion.div>
      </div>

      <footer className="mt-40 pt-20 border-t border-white/5 text-center px-6">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-4">Lithium Gear // Est 2024</p>
        <p className="text-white/40 text-xs italic">Shipping worldwide from the digital void.</p>
      </footer>
    </div>
  );
}
