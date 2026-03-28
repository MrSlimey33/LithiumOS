import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Cpu, Globe, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Technology() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-white">

      <header className="relative py-40 flex flex-col items-center text-center px-4 overflow-hidden isolate">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
         <motion.div initial={{opacity:0, scale:0.9, filter:'blur(10px)'}} animate={{opacity:1, scale:1, filter:'blur(0px)'}} transition={{duration:1.5, ease:'easeOut'}} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-indigo-500/20 to-purple-800/20 rounded-full blur-[100px] -z-10" />
         
         <motion.h1 initial={{y:30, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:1, delay:0.2}} className="text-6xl md:text-8xl font-medium tracking-tighter mb-6 text-white text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 pb-2">Future Hardware</motion.h1>
         <motion.p initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:1, delay:0.4}} className="text-xl md:text-2xl text-slate-400 max-w-2xl font-light">The actual physical architecture of tomorrow. Because software gets boring.</motion.p>
      </header>

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 grid grid-cols-1 md:grid-cols-2 gap-10">
         <motion.div initial={{opacity:0, y:50}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.8}} className="glass-dark rounded-[2.5rem] p-10 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] group-hover:bg-cyan-500/20 transition-colors" />
            <Globe className="text-cyan-400 mb-8" size={48} />
            <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Lithium Glass</h2>
            <p className="text-slate-400 leading-relaxed text-lg font-light mb-8">An augmented reality spatial interface powered natively through a lightweight WebXR compositor. Interact with your web-node apps in true 3D space.</p>
            <div className="text-xs font-bold tracking-widest text-cyan-500 uppercase px-4 py-2 border border-cyan-500/30 rounded-full inline-block">Estimated R&D 2028</div>
         </motion.div>

         <motion.div initial={{opacity:0, y:50}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.8, delay:0.2}} className="glass-dark rounded-[2.5rem] p-10 border border-white/10 relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px] group-hover:bg-fuchsia-500/20 transition-colors" />
            <Zap className="text-fuchsia-400 mb-8" size={48} />
            <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Lithium Quant</h2>
            <p className="text-slate-400 leading-relaxed text-lg font-light mb-8">Harnessing WebGPU compute shaders to run simulated quantum entanglement routines directly in the browser node.</p>
            <div className="text-xs font-bold tracking-widest text-fuchsia-500 uppercase px-4 py-2 border border-fuchsia-500/30 rounded-full inline-block">Estimated R&D 2029</div>
         </motion.div>

         <motion.div initial={{opacity:0, y:50}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.8, delay:0.4}} className="glass-dark rounded-[2.5rem] p-10 border border-white/10 relative overflow-hidden group col-span-1 md:col-span-2 text-center md:text-left md:flex items-center gap-10">
            <div className="w-full md:w-1/3 aspect-square bg-[#151a25] rounded-[2rem] border border-[#2a2f3a] flex items-center justify-center shadow-inner mb-6 md:mb-0 relative overflow-hidden">
               <Cpu className="text-rose-500" size={64}/>
               <div className="absolute inset-0 bg-rose-500/10 mix-blend-overlay animate-pulse" />
            </div>
            <div className="flex-1">
               <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Neural Link Beta</h2>
               <p className="text-slate-400 leading-relaxed text-lg font-light mb-8 max-w-2xl">Currently in testing. I connected a Raspberry Pi to my cerebral cortex. Mild headaches reported.</p>
               <div className="text-xs font-bold tracking-widest text-rose-500 uppercase px-4 py-2 border border-rose-500/30 rounded-full inline-block">Testing Phase</div>
            </div>
         </motion.div>
      </section>

      <footer className="text-center py-20 text-slate-500 font-medium cursor-pointer" onClick={()=>navigate('/')}>
         <div className="flex items-center justify-center gap-2 hover:text-white transition-colors"><ChevronLeft size={16}/> Back to Home</div>
      </footer>
    </div>
  )
}
