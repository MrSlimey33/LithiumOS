import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Terminal, Cpu, Zap, Globe, BookOpen, Layers, Rocket, Command, GitBranch } from 'lucide-react';

const DocCard = ({ title, description, icon: Icon, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
    className="q-glass rounded-3xl p-8 border-white/5 hover:border-cyan-500/30 transition-all group cursor-pointer"
  >
    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cyan-500/10 transition-all duration-500 shadow-2xl">
      <Icon size={24} className="text-white/40 group-hover:text-cyan-400" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-white tracking-tight">{title}</h3>
    <p className="text-sm text-q-text-secondary leading-relaxed mb-6 font-medium italic">{description}</p>
    <div className="flex items-center gap-2 text-cyan-400 font-black text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
      Read Documentation <Command size={10} />
    </div>
  </motion.div>
);

export default function Developers() {
  return (
    <div className="bg-q-void min-h-screen pt-40 pb-32 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[50vw] h-full bg-gradient-to-l from-violet-500/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 text-cyan-400 mb-6 font-black text-[10px] uppercase tracking-[0.4em]"
            >
              <Code2 size={16} /> Developer Portal
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8 italic">
              BUILD THE <br /> <span className="shimmer-text uppercase not-italic">SPATIAL FUTURE</span>
            </h1>
            <p className="text-xl text-q-text-secondary mb-10 leading-relaxed italic max-w-lg">
              Everything you need to build high-performance, glassmorphic applications for the Lithium ecosystem.
            </p>
            <div className="flex gap-4">
              <button className="btn-primary flex items-center gap-2">Get Started <Rocket size={18}/></button>
              <a href="https://github.com" className="btn-secondary flex items-center gap-2">Github <GitBranch size={18}/></a>
            </div>
          </div>
          <div className="relative">
            <div className="q-glass rounded-[3rem] p-1 border-white/10 aspect-square overflow-hidden shadow-2xl relative group">
               <div className="absolute inset-0 spatial-mesh opacity-30" />
               <div className="w-full h-full bg-black/60 p-8 font-mono text-[11px] leading-relaxed overflow-hidden">
                  <div className="flex gap-1.5 mb-6">
                     <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
                     <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                     <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                  </div>
                  <pre className="text-cyan-400/80 group-hover:scale-105 transition-transform duration-[10s]">
{`const LithiumApp = {
  id: "quantum-vision",
  title: "Spatial Core",
  icon: "Zap",
  
  init: async (kernel) => {
    const ctx = kernel.getContext();
    ctx.render(<MainUI />);
    
    // POSIX Bridge
    await kernel.fs.mkdir("/app/data");
    kernel.on("signal", (sig) => {
      console.log(\`Signal: \${sig}\`);
    });
    
    // High-Perf WebGPU
    const device = await kernel.gpu.request();
    return device;
  }
};`}
                  </pre>
               </div>
            </div>
            {/* Decorative Blurs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 blur-[120px] rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-500/10 blur-[120px] rounded-full" />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DocCard 
            icon={BookOpen}
            title="Getting Started"
            description="Learn the basics of Lithium development, from environment setup to your first 'Hello World' app."
            delay={0.1}
          />
          <DocCard 
            icon={Layers}
            title="Lithium SDK"
            description="Explore our rich library of React components and hooks specifically designed for spatial glass UI."
            delay={0.2}
          />
          <DocCard 
            icon={Terminal}
            title="Runtime CLI"
            description="Control the OS programmatically using the Hermes Terminal API and custom shell scripting."
            delay={0.3}
          />
          <DocCard 
            icon={Cpu}
            title="System Bridge"
            description="Access browser-level APIs like WebGPU, WebAudio, and WebHID through our secure Posix abstraction layer."
            delay={0.4}
          />
          <DocCard 
            icon={Shield}
            title="Security & Auth"
            description="Implement secure data persistence and LithiumID authentication for user-specific configurations."
            delay={0.5}
          />
          <DocCard 
            icon={Globe}
            title="Cloud Deployment"
            description="Ship your apps to the Lithium Marketplace and reach users across the entire spatial web."
            delay={0.6}
          />
        </div>

        {/* API Reference Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mt-40 p-16 rounded-[4rem] bg-black/40 backdrop-blur-3xl border border-white/5 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 noise-overlay opacity-5" />
          <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10 tracking-tighter italic">EXPLORE THE FULL API</h2>
          <p className="text-xl text-white/40 mb-12 max-w-2xl mx-auto relative z-10 italic font-medium">
            Deep dive into the core Helium kernel and the Lithium runtime specifications.
          </p>
          <button className="btn-secondary relative z-10 uppercase tracking-[0.3em] text-[10px] px-12 py-5 font-black">View Reference Document</button>
        </motion.div>
      </div>

      <footer className="mt-40 pt-20 border-t border-white/5 text-center px-6">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-4">Developers // Lithium Project</p>
        <p className="text-white/40 text-xs italic">Building the infrastructure for web-native computing.</p>
      </footer>
    </div>
  );
}
