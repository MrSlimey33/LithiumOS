import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Zap, Cpu, ArrowRight, LayoutDashboard, Code, Sparkles } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
       <header className="relative py-40 flex flex-col items-center text-center px-4 overflow-hidden isolate">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
         <motion.div initial={{scale:0.8, opacity:0, filter:'blur(20px)'}} animate={{scale:1, opacity:1, filter:'blur(0px)'}} transition={{duration:1.5, ease:'easeOut'}} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-600/20 to-indigo-900/30 rounded-full blur-[100px] -z-10" />
         
         <motion.div initial={{y:-20, opacity:0}} animate={{y:0, opacity:1}} className="mb-8 px-4 py-1.5 glass-dark border border-blue-500/20 rounded-full text-blue-400 font-bold text-xs tracking-widest uppercase flex items-center gap-2">
            <Sparkles size={14} className="text-blue-300"/> Built by a 17-Year-Old. Deal with it.
         </motion.div>

         <motion.h1 initial={{y:30, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:1, delay:0.2}} className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 text-white text-glow">Lithium.</motion.h1>
         <motion.p initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:1, delay:0.4}} className="text-xl md:text-2xl text-slate-400 max-w-3xl font-light mb-12 leading-relaxed">I got bored one weekend and decided to build an entire operating system in my browser. Now I'm taking over the tech industry. Welcome to a pure spatial computing experience.</motion.p>
         
         <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:1, delay:0.6}} className="flex flex-col md:flex-row gap-6">
            <button onClick={()=>navigate('/station')} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-5 rounded-full font-bold text-lg tracking-wide shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
               Launch Environment <ArrowRight size={20}/>
            </button>
            <button onClick={()=>navigate('/manifesto')} className="glass text-slate-800 px-8 py-5 rounded-full font-bold text-lg tracking-wide hover:bg-slate-50 transition-all">
               Read The Manifesto
            </button>
         </motion.div>
       </header>

       <section className="py-32 px-6 max-w-7xl mx-auto flex flex-col gap-8 text-center relative z-10">
          <motion.div initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:true}} className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="glass-dark p-10 rounded-[2.5rem] border border-white/10 flex flex-col items-center hover:-translate-y-2 transition-transform">
                <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner"><LayoutDashboard size={32}/></div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Spatial Interface</h3>
                <p className="text-slate-400 leading-relaxed text-sm">A full window manager featuring dynamic physics, drag constraints, snapping, and beautiful glassmorphism that puts Windows to shame.</p>
             </div>
             <div className="glass-dark p-10 rounded-[2.5rem] border border-white/10 flex flex-col items-center hover:-translate-y-2 transition-transform">
                <div className="w-16 h-16 bg-fuchsia-500/10 text-fuchsia-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner"><Code size={32}/></div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Zero-Code Marketplace</h3>
                <p className="text-slate-400 leading-relaxed text-sm">Anyone can build and publish a Lithium app by simply providing an iframe URL. No developer fees, no waiting for reviews. Just ship.</p>
             </div>
             <div className="glass-dark p-10 rounded-[2.5rem] border border-white/10 flex flex-col items-center hover:-translate-y-2 transition-transform shadow-[0_0_50px_rgba(59,130,246,0.05)]">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner"><ShieldAlert size={32}/></div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Encrypted Cloud</h3>
                <p className="text-slate-400 leading-relaxed text-sm">Every user is issued a Lithium ID. All OS state, apps, and files are encrypted client-side with AES-256 before ever syncing remotely.</p>
             </div>
          </motion.div>
       </section>
    </div>
  )
}
