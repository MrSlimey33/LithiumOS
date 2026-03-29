import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Star, Download, ShieldCheck, Zap, Globe, Cpu, Layout, Search, Filter, ShoppingBag, ArrowUpRight } from 'lucide-react';

const APP_DATA = [
  { id: 'devstudio', name: 'Dev Studio', category: 'Productivity', rating: 4.9, icon: Layout, color: 'from-blue-500 to-indigo-600', desc: 'Full-featured IDE for the spatial web.' },
  { id: 'terminal', name: 'Hermes Terminal', category: 'Utilities', rating: 5.0, icon: Cpu, color: 'from-slate-700 to-black', desc: 'The ultimate POSIX shell for power users.' },
  { id: 'photos', name: 'Lens Gallery', category: 'Media', rating: 4.7, icon: Globe, color: 'from-fuchsia-500 to-pink-500', desc: 'Minimalist AI-powered photo management.' },
  { id: 'synthesia', name: 'Synthesia', category: 'Media', rating: 4.8, icon: Zap, color: 'from-emerald-400 to-teal-500', desc: 'Professional audio workstation and sequencer.' },
  { id: 'vault', name: 'Identity Vault', category: 'Security', rating: 4.9, icon: ShieldCheck, color: 'from-rose-400 to-red-600', desc: 'Secure decentralized identity management.' },
];

const AppCard = ({ app, delay }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="q-glass rounded-[2rem] p-6 border-white/10 hover:border-cyan-500/30 transition-all group flex flex-col"
  >
    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
      <app.icon size={30} className="text-white drop-shadow-lg" />
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-white tracking-tight">{app.name}</h3>
        <div className="flex items-center gap-1 text-cyan-400">
          <Star size={12} fill="currentColor" />
          <span className="text-xs font-black">{app.rating}</span>
        </div>
      </div>
      <p className="text-sm text-white/40 mb-6 leading-relaxed uppercase tracking-wider font-bold text-[10px]">{app.category}</p>
      <p className="text-q-text-secondary line-clamp-2 text-sm leading-relaxed mb-8">{app.desc}</p>
    </div>
    <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest group-hover:bg-cyan-500 group-hover:text-black group-hover:border-cyan-500 transition-all flex items-center justify-center gap-2">
      Install App <ArrowUpRight size={14} />
    </button>
  </motion.div>
);

export default function Marketplace() {
  return (
    <div className="bg-q-void min-h-screen pt-40 pb-20 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-cyan-400 mb-6"
            >
              <ShoppingBag size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">The Neural Market</span>
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-4">APPS FOR THE <br/> <span className="shimmer-text">NEXT ERA</span></h1>
            <p className="text-xl text-q-text-secondary italic">Curated experiences built for the Helium kernel.</p>
          </div>
          
          <div className="flex gap-4">
             <div className="relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Browse Apps..." 
                  className="bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-cyan-500/30 text-white w-64 transition-all"
                />
             </div>
             <button className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-white/60">
                <Filter size={20} />
             </button>
          </div>
        </div>

        {/* Featured App */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[3rem] overflow-hidden p-12 mb-20 border border-white/10 group"
        >
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850715649-1d0106293cb1?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center brightness-[0.25] group-hover:scale-105 transition-transform duration-[10s]" />
           <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" />
           <div className="relative z-10 max-w-xl">
              <span className="px-3 py-1 bg-cyan-500 text-black text-[9px] font-black uppercase tracking-widest rounded-full mb-8 inline-block">App of the Month</span>
              <h2 className="text-5xl font-black text-white mb-6 tracking-tighter italic">QUANTUM EDITOR</h2>
              <p className="text-lg text-white/60 mb-10 leading-relaxed italic">The first spatial IDE featuring real-time AI collaboration and holographic debugging. Build the web from within the web.</p>
              <button className="btn-primary">Learn More</button>
           </div>
        </motion.div>

        {/* Categories */}
        <div className="flex gap-4 mb-16 overflow-x-auto pb-4 scrollbar-hide">
           {['All Apps', 'Productivity', 'Utilities', 'Security', 'Media', 'System'].map((cat, i) => (
              <button 
                key={cat} 
                className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all ${i === 0 ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(0,212,255,0.3)]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
              >
                {cat}
              </button>
           ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {APP_DATA.map((app, i) => (
            <AppCard key={app.id} app={app} delay={i * 0.1} />
          ))}
        </div>

        {/* Developers Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-40 p-16 rounded-[4rem] bg-black border border-white/5 text-center relative overflow-hidden"
        >
           <div className="absolute inset-0 spatial-mesh opacity-10" />
           <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10 tracking-tighter">BUILD THE ECOSYSTEM</h2>
           <p className="text-xl text-white/40 mb-12 max-w-2xl mx-auto relative z-10 font-medium italic">
             Are you a developer? Join the Lithium ecosystem and ship high-performance spatial apps to millions of users.
           </p>
           <button className="btn-secondary relative z-10 italic">Get SDK Access</button>
        </motion.div>
      </div>

      <footer className="mt-40 pt-20 border-t border-white/5 text-center px-6">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-4">Marketplace // Lithium Project</p>
        <p className="text-white/40 text-xs italic">All assets verified for the Lithium ecosystem.</p>
      </footer>
    </div>
  );
}
