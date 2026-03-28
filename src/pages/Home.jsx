import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Zap, Cpu } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-blue-500/30">
       <header className="relative py-40 flex flex-col items-center text-center px-4 overflow-hidden isolate">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/20 to-indigo-900/40 rounded-full blur-[100px] -z-10" />
         
         <motion.div initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}} className="mb-6 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 font-bold text-xs tracking-widest uppercase">
            Built by a 17-Year-Old. Deal with it.
         </motion.div>

         <motion.h1 initial={{y:30, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:1, delay:0.2}} className="text-7xl md:text-9xl font-semibold tracking-tighter mb-8 text-white">Lithium.</motion.h1>
         <motion.p initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:1, delay:0.4}} className="text-xl md:text-2xl text-slate-400 max-w-3xl font-light mb-12">I got bored one weekend and decided to build an entire operating system in my browser. Now I'm taking over the tech industry. Welcome to the future.</motion.p>
         
         <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:1, delay:0.6}} className="flex flex-col md:flex-row gap-6">
            <button onClick={()=>navigate('/station')} className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg tracking-wide shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all">Experience Lithium OS</button>
            <button onClick={()=>navigate('/manifesto')} className="bg-transparent border border-slate-700 text-white px-8 py-4 rounded-full font-bold text-lg tracking-wide hover:bg-slate-800 transition-all">Read The Manifesto</button>
         </motion.div>
       </header>

       <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-10 rounded-[3rem] bg-slate-800/50 border border-slate-700 flex flex-col items-center">
             <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6"><Cpu size={32}/></div>
             <h3 className="text-2xl font-bold text-white mb-3">Better Than Windows</h3>
             <p className="text-slate-400 leading-relaxed text-sm">I mean, it literally doesn't have blue screens of death. Mostly because I haven't coded a blue screen yet. But still.</p>
          </div>
          <div className="p-10 rounded-[3rem] bg-slate-800/50 border border-slate-700 flex flex-col items-center">
             <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6"><Zap size={32}/></div>
             <h3 className="text-2xl font-bold text-white mb-3">Infinite Scale</h3>
             <p className="text-slate-400 leading-relaxed text-sm">Powered by the absolute raw computing power of whichever laptop you are using right now. Thank you for your CPU cycles.</p>
          </div>
          <div className="p-10 rounded-[3rem] bg-slate-800/50 border border-slate-700 flex flex-col items-center">
             <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mb-6"><ShieldAlert size={32}/></div>
             <h3 className="text-2xl font-bold text-white mb-3">"Cloud" Security</h3>
             <p className="text-slate-400 leading-relaxed text-sm">I store all your Lithium IDs in an encrypted JSON payload. Is it secure? Probably. Am I legally liable? I'm 17.</p>
          </div>
       </section>
    </div>
  )
}
