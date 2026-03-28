/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Feather, Wind, Zap, Shield, ArrowRight, Layers, Maximize, Cpu, Terminal, CheckCircle2, XCircle } from 'lucide-react';
import LithiumOS from './LithiumOS';

function FeatureCard({ icon: Icon, title, desc, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      className="bg-white/70 backdrop-blur-xl border border-white/40 p-10 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-2 group"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
        <Icon className="text-slate-700 w-8 h-8" strokeWidth={1.5} />
      </div>
      <h3 className="text-2xl text-slate-800 font-medium mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-light">{desc}</p>
    </motion.div>
  );
}

function Marquee() {
  const content = "/// ATOMIC SCALING /// ZERO LATENCY /// CLIENT-SIDE VDISKS /// SPATIAL WINDOW MANAGEMENT /// LOCAL STORAGE VAULT /// REACTIVE NODE ECOSYSTEM /// LITHIUM OS 4.0 /// ";
  return (
    <div className="w-full bg-slate-900 border-y border-white/10 overflow-hidden py-3 relative z-20 shadow-2xl">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-900 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-900 to-transparent z-10" />
      <motion.div 
        animate={{ x: [0, -2000] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        className="flex whitespace-nowrap text-rose-300 font-mono tracking-widest text-[10px] font-bold uppercase opacity-80"
      >
        <div className="mr-4">{content}</div>
        <div className="mr-4">{content}</div>
        <div className="mr-4">{content}</div>
        <div className="mr-4">{content}</div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const opacityFade = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f8f9fb] text-slate-800 font-sans selection:bg-rose-200 selection:text-slate-900 overflow-x-hidden">
      
      {/* GLOBAL BACKGROUND NOISE & REACTIVE BLOBS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-multiply" />
         <motion.div 
            animate={{ 
              x: mousePos.x * -100, 
              y: mousePos.y * -100 
            }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-100/40 blur-[150px]" 
         />
         <motion.div 
            animate={{ 
              x: mousePos.x * 100, 
              y: mousePos.y * 100 
            }}
            transition={{ type: "spring", stiffness: 40, damping: 25 }}
            className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-100/40 blur-[150px]" 
         />
      </div>

      {/* HEADER NAV */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 md:px-16 py-6 transition-all duration-300 backdrop-blur-xl bg-white/40 border-b border-white/40">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-200 to-white shadow-sm flex items-center justify-center border border-white">
               <div className="w-3 h-3 rounded-full bg-slate-800" />
            </div>
            <span className="font-semibold text-xl tracking-tight text-slate-800">Lithium</span>
         </div>
         <div className="hidden md:flex gap-10 text-sm font-semibold tracking-wide text-slate-500">
            <a href="#philosophy" className="hover:text-slate-900 transition-colors">Philosophy</a>
            <a href="#features" className="hover:text-slate-900 transition-colors">Architecture</a>
            <a href="#demo" className="hover:text-slate-900 transition-colors">Live Station</a>
         </div>
         <button onClick={() => document.getElementById('demo').scrollIntoView({ behavior: 'smooth' })} className="bg-slate-900 text-white px-7 py-3 rounded-full text-sm font-bold tracking-wide hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-900/20 active:scale-95 cursor-pointer">
            Boot Kernel
         </button>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-48 pb-24 px-4 md:px-12 flex flex-col items-center justify-center text-center min-h-[100vh] z-10">
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
           className="max-w-5xl mx-auto"
         >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-slate-200 bg-white/60 backdrop-blur-md text-slate-500 text-[11px] font-bold tracking-[0.2em] uppercase mb-10 shadow-sm">
               <Feather size={14} className="text-slate-800" /> The Silver Standard
            </div>
            <h1 className="text-7xl md:text-8xl lg:text-[9rem] font-medium tracking-tighter mb-8 leading-[1.0] text-slate-900">
               Lightest OS.<br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600">Fastest node.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-16 leading-relaxed font-light">
               Lithium rewrites the rules of desktop architectures. Stripped of legacy bloat, wrapped in frosted glass, and engineered to execute client-side reactive logic with zero footprint.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
               <button onClick={() => document.getElementById('demo').scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-10 py-5 rounded-full bg-slate-900 text-white font-semibold text-lg hover:-translate-y-1 transition-transform flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.15)] cursor-pointer">
                  Experience Station <ArrowRight size={20} />
               </button>
               <a href="https://github.com" target="_blank" rel="noreferrer" className="w-full sm:w-auto px-10 py-5 rounded-full bg-white/80 backdrop-blur border border-slate-200 text-slate-700 font-semibold text-lg hover:bg-white transition-colors cursor-pointer shadow-sm">
                  View Source Code
               </a>
            </div>
         </motion.div>

         {/* INTERACTIVE 3D HERO PREVIEW (Visually reacts to mouse) */}
         <motion.div 
            style={{ opacity: opacityFade }}
            initial={{ opacity: 0, rotateX: 20, y: 100 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-28 w-full max-w-6xl relative perspective-[2500px] pointer-events-none"
         >
            <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fb] via-[#f8f9fb]/20 to-transparent z-10 h-full w-full" />
            
            <motion.div
               animate={{ 
                 rotateX: mousePos.y * -15, 
                 rotateY: mousePos.x * 15 
               }}
               transition={{ type: "spring", stiffness: 400, damping: 90 }}
               className="w-full aspect-[16/10] rounded-t-[3rem] bg-slate-100 shadow-[0_-20px_50px_rgba(0,0,0,0.05)] border-t border-x border-white overflow-hidden relative isolate p-2"
            >
               <div className="absolute inset-0 bg-slate-800/5 backdrop-blur-xl" />
               <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-cover bg-center border border-white shadow-inner relative" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop)' }}>
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mix-blend-overlay opacity-60">
                     <h2 className="text-8xl font-bold text-slate-900 tracking-tighter">10:09</h2>
                     <p className="text-2xl font-medium text-slate-900 mt-2">Tuesday, Lithium OS 4.0</p>
                  </div>
               </div>
            </motion.div>
         </motion.div>
      </section>

      <Marquee />

      {/* PHILOSOPHY SECTION */}
      <section id="philosophy" className="py-32 px-6 md:px-12 bg-white relative z-10 rounded-b-[4rem] shadow-[0_20px_40px_rgba(0,0,0,0.02)]">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-100 bg-rose-50 text-rose-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-8">
                  <Cpu size={14} /> The Math
               </div>
               <h2 className="text-5xl md:text-6xl font-medium tracking-tight mb-8 text-slate-900 leading-[1.1]">
                  Born from simplicity.<br/>Built for speed.
               </h2>
               <p className="text-xl text-slate-500 mb-10 leading-relaxed font-light">
                  Traditional desktop environments are weighed down by decades of backwards compatibility and bloated graphics pipelines. We deleted the bloat.
               </p>
               
               {/* Terminal Code Preview */}
               <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl font-mono text-sm border border-slate-700 w-full mb-10 hover:border-slate-500 transition-colors">
                  <div className="flex gap-2 mb-4">
                     <div className="w-3 h-3 rounded-full bg-red-500" />
                     <div className="w-3 h-3 rounded-full bg-yellow-500" />
                     <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="text-slate-300">
                     <p className="mt-1"><span className="text-rose-400">$</span> npm run benchmark</p>
                     <p className="mt-2 text-slate-400">&gt; Starting Lithium Kernel Initialization...</p>
                     <p className="mt-1 text-slate-400">&gt; Mounting Spatial Window Manager...</p>
                     <p className="mt-1 text-slate-400">&gt; Authenticating VDisk Storage...</p>
                     <p className="mt-4 text-emerald-400">✓ System Ready in 250ms</p>
                     <p className="mt-1 text-blue-400">⚡ Memory Footprint: 2.3MB / 0.05% CPU</p>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="flex gap-5">
                     <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0 border border-rose-100">
                        <Wind className="text-rose-500" />
                     </div>
                     <div>
                        <h4 className="text-2xl font-medium text-slate-800 mb-2 tracking-tight">AeroEngine</h4>
                        <p className="text-slate-500 font-light leading-relaxed">Renders UI elements using a unified composite layer. Windows float and blur with practically zero GPU overhead.</p>
                     </div>
                  </div>
                  <div className="flex gap-5">
                     <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                        <Terminal className="text-blue-500" />
                     </div>
                     <div>
                        <h4 className="text-2xl font-medium text-slate-800 mb-2 tracking-tight">POSIX-Ready</h4>
                        <p className="text-slate-500 font-light leading-relaxed">Our sandboxed internal console acts just like your standard local environment. Run logic smoothly.</p>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="relative order-first lg:order-last">
               <div className="aspect-square rounded-[4rem] bg-gradient-to-tr from-slate-100 to-white shadow-[0_30px_60px_rgba(0,0,0,0.05)] border border-white p-10 overflow-hidden relative">
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-multiply" />
                  <div className="w-full h-full rounded-[3rem] border border-slate-200/50 bg-white/50 backdrop-blur-md shadow-inner flex items-center justify-center p-8">
                     <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                        className="w-64 h-64 rounded-full bg-gradient-to-tr from-rose-200 via-white to-blue-200 opacity-60 blur-3xl absolute" 
                     />
                     <div className="w-40 h-40 rounded-full bg-white shadow-2xl flex items-center justify-center relative z-10 border border-slate-100">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-slate-100 to-white shadow-inner flex items-center justify-center border border-slate-200/50">
                           <div className="w-6 h-6 rounded-full bg-slate-800 shadow-[0_0_20px_rgba(30,41,59,0.5)]" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-32 px-6 md:px-12 relative z-10 max-w-5xl mx-auto">
         <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4 text-slate-900">Why choose Lithium?</h2>
            <p className="text-lg text-slate-500 font-light">The math is simple. The architecture is undeniable.</p>
         </div>
         <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200/60 overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200/60 font-semibold text-sm tracking-wide text-slate-500 uppercase p-6">
               <div className="col-span-1">Feature Match</div>
               <div className="col-span-1 text-center font-bold text-slate-800">Lithium OS</div>
               <div className="col-span-1 text-center">Legacy Systems</div>
            </div>
            {[
               { f: 'Boot Time', l: 'Instant (Web Native)', o: '45+ Seconds' },
               { f: 'Background Processes', l: 'Strict Sandbox', o: 'Infinite Bloat' },
               { f: 'Cross-device Portability', l: 'Universal Browser URL', o: 'Hardware Locked' },
               { f: 'Update Dependency', l: 'Zero-Install Delivery', o: 'Manual Installers' },
               { f: 'Visual Engine', l: 'Aero CSS Blur Modules', o: 'Heavy GPU Draw Calls' }
            ].map((row, i) => (
               <div key={i} className="grid grid-cols-3 border-b border-slate-100 p-6 items-center hover:bg-slate-50 transition-colors">
                  <div className="col-span-1 font-medium text-slate-700">{row.f}</div>
                  <div className="col-span-1 flex flex-col items-center justify-center gap-2 text-emerald-600 font-medium text-center">
                     <CheckCircle2 size={20} /> <span className="text-sm">{row.l}</span>
                  </div>
                  <div className="col-span-1 flex flex-col items-center justify-center gap-2 text-slate-400 font-medium text-center">
                     <XCircle size={20} /> <span className="text-sm">{row.o}</span>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-24 px-6 md:px-12 relative z-10">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <FeatureCard 
                  icon={Layers}
                  title="Spatial Windows"
                  desc="Dynamic z-indexing with smooth constraint logic and flawless drag performance acting natively within the DOM matrix."
                  delay={0.1}
               />
               <FeatureCard 
                  icon={Shield}
                  title="VDisk Vault"
                  desc="Your data is entirely sandboxed in client-tier local storage APIs. Nothing ever touches our external servers."
                  delay={0.2}
               />
               <FeatureCard 
                  icon={Maximize}
                  title="Fluid Runtime"
                  desc="Every app is built from fundamental monolithic React components ensuring instant zero-hydration rendering."
                  delay={0.3}
               />
            </div>
         </div>
      </section>

      {/* LIVE DEMO KERNEL */}
      <section id="demo" className="py-32 px-4 md:px-12 relative z-20 bg-slate-900 rounded-t-[4rem] mt-20 shadow-[0_-30px_100px_rgba(0,0,0,0.1)] text-white">
         <div className="max-w-[1400px] mx-auto">
            <div className="mb-16 text-center">
               <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-slate-700 bg-slate-800 text-slate-300 text-[11px] font-bold tracking-[0.2em] uppercase mb-6 shadow-sm">
                  <Zap size={14} className="text-yellow-400" /> Interactive Mode
               </div>
               <h2 className="text-5xl md:text-6xl font-medium tracking-tight mb-6 text-white pt-2">Live Station</h2>
               <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">Interact with the actual Lithium OS workstation environment. Launch modules, drag windows, and experience the zero-friction engine directly beneath your cursor.</p>
            </div>
            
            <motion.div 
               initial={{ opacity: 0, y: 50, scale: 0.95 }}
               whileInView={{ opacity: 1, y: 0, scale: 1 }}
               viewport={{ once: true, margin: "-200px" }}
               transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
               className="w-[95%] max-w-[1600px] mx-auto h-[750px] bg-white rounded-[2rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden relative isolate ring-1 ring-white/10"
            >
               <div className="absolute inset-0">
                  <LithiumOS />
               </div>
            </motion.div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 pt-20 pb-10 px-12 relative z-10 text-slate-400 overflow-hidden block border-t border-slate-800">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 border-b border-slate-800 pb-20 relative z-10">
            <div className="max-w-xs">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                     <div className="w-3 h-3 rounded-full bg-slate-400" />
                  </div>
                  <span className="font-semibold text-xl tracking-tight text-white">Lithium</span>
               </div>
               <p className="text-sm leading-relaxed text-slate-500">The first truly web-native, singularity-driven desktop operating system environment. Building the future of frictionless computation.</p>
            </div>
            <div className="flex gap-16">
               <div className="flex flex-col gap-4">
                  <p className="text-white font-semibold mb-2">Platform</p>
                  <a href="#features" className="hover:text-white transition-colors">Architecture</a>
                  <a href="#philosophy" className="hover:text-white transition-colors">Philosophy</a>
                  <a href="#demo" className="hover:text-white transition-colors">Live Demo</a>
               </div>
               <div className="flex flex-col gap-4">
                  <p className="text-white font-semibold mb-2">Connect</p>
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub Repository</a>
                  <a href="https://github.com/pages" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Pages Deployment</a>
                  <a href="#" className="hover:text-white transition-colors">Documentation</a>
               </div>
            </div>
         </div>
         <div className="relative z-10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-600 font-medium tracking-wide w-full max-w-7xl mx-auto">
            <p>&copy; {new Date().getFullYear()} Lithium OS Foundation. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
               <span>System Uptime: Immeasurable</span>
               <span>Built with React & Vite</span>
            </div>
         </div>
         
         <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 text-[15vw] font-bold text-slate-800/30 whitespace-nowrap pointer-events-none tracking-tighter mix-blend-overlay">
            LITHIUM OS
         </div>
      </footer>
    </div>
  );
}
