import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Cpu, Globe, Infinity as InfinityIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Concepts() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-white">
      <div className="fixed top-0 left-0 w-full p-8 z-50 flex justify-between items-center">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold tracking-widest text-xs uppercase">Return</span>
        </button>
      </div>

      <header className="relative py-40 flex flex-col items-center text-center px-4 overflow-hidden isolate">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
         <motion.div initial={{opacity:0, scale:0.9, filter:'blur(10px)'}} animate={{opacity:1, scale:1, filter:'blur(0px)'}} transition={{duration:1.5, ease:'easeOut'}} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-indigo-500/20 to-purple-800/20 rounded-full blur-[100px] -z-10" />
         
         <motion.h1 initial={{y:30, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:1, delay:0.2}} className="text-6xl md:text-8xl font-medium tracking-tighter mb-6 text-white text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 pb-2">Future Concepts</motion.h1>
         <motion.p initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:1, delay:0.4}} className="text-xl md:text-2xl text-slate-400 max-w-2xl font-light">The architecture of tomorrow. Exploring unreleased nodes and hardware horizons.</motion.p>
      </header>

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 grid grid-cols-1 md:grid-cols-2 gap-10">
         <motion.div initial={{opacity:0, y:50}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.8}} className="bg-[#0a0f18] rounded-[3rem] p-10 border border-[#1e2330] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] group-hover:bg-cyan-500/20 transition-colors" />
            <Globe className="text-cyan-400 mb-8" size={48} />
            <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Lithium Glass</h2>
            <p className="text-slate-400 leading-relaxed text-lg font-light mb-8">An augmented reality spatial interface powered natively through a lightweight WebXR compositor. Interact with your web-node apps in true 3D space without legacy headset bloat.</p>
            <div className="text-xs font-bold tracking-widest text-cyan-500 uppercase px-4 py-2 border border-cyan-500/30 rounded-full inline-block">Estimated R&D 2028</div>
         </motion.div>

         <motion.div initial={{opacity:0, y:50}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.8, delay:0.2}} className="bg-[#0a0f18] rounded-[3rem] p-10 border border-[#1e2330] relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px] group-hover:bg-fuchsia-500/20 transition-colors" />
            <InfinityIcon className="text-fuchsia-400 mb-8" size={48} />
            <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Lithium Quant</h2>
            <p className="text-slate-400 leading-relaxed text-lg font-light mb-8">Harnessing WebGPU compute shaders to run simulated quantum entanglement routines directly in the browser node. A massive leap for in-browser cryptographic security.</p>
            <div className="text-xs font-bold tracking-widest text-fuchsia-500 uppercase px-4 py-2 border border-fuchsia-500/30 rounded-full inline-block">Estimated R&D 2029</div>
         </motion.div>
      </section>

      <footer className="text-center py-20 text-slate-500 font-medium">
         &copy; 2026. The future is frictionless.
      </footer>
    </div>
  )
}
