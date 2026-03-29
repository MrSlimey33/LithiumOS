import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Globe, Cpu, Shield, ChevronRight, ChevronLeft } from 'lucide-react';

export default function Marketplace() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-20 flex flex-col items-center">
       <motion.h1 initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="text-6xl font-black mb-6">Lithium Marketplace</motion.h1>
       <p className="text-slate-400 text-xl max-w-2xl text-center mb-12">The digital bazaar for the next generation. All transactions are peer-to-peer and founder-certified.</p>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {[1,2,3].map(i => (
             <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl">
                <div className="w-12 h-12 bg-blue-500 rounded-xl mb-6 flex items-center justify-center"><Zap size={24}/></div>
                <h3 className="text-2xl font-bold mb-2">Module #{i}</h3>
                <p className="text-slate-400 text-sm mb-6">Advanced kernel extension for spatial processing.</p>
                <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold">Purchase</button>
             </div>
          ))}
       </div>
    </div>
  );
}

export function Merch() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-20 flex flex-col items-center">
       <motion.h1 initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="text-6xl font-black mb-6">Lithium Gear</motion.h1>
       <p className="text-slate-400 text-xl max-w-2xl text-center mb-12">Wear the future. 17% of all proceeds go to my caffeine fund.</p>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
          <div className="group cursor-pointer">
             <div className="aspect-square bg-slate-800 rounded-[3rem] mb-6 overflow-hidden border border-white/5">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 opacity-20 group-hover:opacity-40 transition-opacity" />
             </div>
             <h3 className="text-2xl font-bold">"Solo Dev" Hoodie</h3>
             <p className="text-slate-400">$64.00</p>
          </div>
          <div className="group cursor-pointer">
             <div className="aspect-square bg-slate-800 rounded-[3rem] mb-6 overflow-hidden border border-white/5">
                <div className="w-full h-full bg-gradient-to-br from-rose-500 to-orange-600 opacity-20 group-hover:opacity-40 transition-opacity" />
             </div>
             <h3 className="text-2xl font-bold">Lithium Kernel Cap</h3>
             <p className="text-slate-400">$32.00</p>
          </div>
       </div>
    </div>
  );
}

export function Jobs() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-20 flex flex-col items-center">
       <div className="w-20 h-20 bg-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center mb-10"><Shield size={40}/></div>
       <h1 className="text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Careers</h1>
       <p className="text-slate-400 text-xl max-w-2xl text-center mb-12 italic">"Why hire a team when I'm already doing everything?" — Founder</p>
       <div className="w-full max-w-2xl p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl text-center">
          <h3 className="text-3xl font-bold mb-4 text-rose-400">0 Open Positions</h3>
          <p className="text-slate-300">I enjoy my own company. Check back when I decide to scale (maybe in 2027).</p>
       </div>
    </div>
  );
}

export function Manifesto() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-20 flex flex-col items-center">
       <div className="max-w-3xl">
          <motion.h1 initial={{x:-20, opacity:0}} animate={{x:0, opacity:1}} className="text-7xl font-black mb-12 tracking-tighter italic">THE MANIFESTO.</motion.h1>
          <div className="space-y-12 text-2xl font-light leading-relaxed text-slate-300">
             <p>1. <span className="text-white font-bold">The solo developer is the new sovereign state.</span> Computing power has decentralized the ability to build empires.</p>
             <p>2. <span className="text-white font-bold">Code is the only law that matters.</span> Algorithms don't care about your college degree or your corporate hierarchy.</p>
             <p>3. <span className="text-white font-bold">Simplicity is superior to scale.</span> I built Lithium OS to prove that one person with a vision is faster than 1000 engineers with a roadmap.</p>
             <p>4. <span className="text-white font-bold">The browser is the hardware.</span> We don't need silicone anymore; we need pixels and logic.</p>
          </div>
       </div>
    </div>
  );
}
