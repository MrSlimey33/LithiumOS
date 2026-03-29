import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Shield, Database, Layout, Code2, Globe, Command, ZapOff, Box, Radio } from 'lucide-react';

const TechSection = ({ title, subtitle, icon: Icon, features, delay, gradient }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8 }}
    className="relative py-24 border-b border-white/5 last:border-0"
  >
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className={delay % 0.2 === 0 ? 'lg:order-1' : 'lg:order-2'}>
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-8 shadow-2xl`}>
          <Icon size={32} className="text-white" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter text-white">{title}</h2>
        <p className="text-xl text-q-text-secondary leading-relaxed mb-10 font-medium italic">{subtitle}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-4 text-white/60 font-black uppercase tracking-widest text-[10px] p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
              {f}
            </div>
          ))}
        </div>
      </div>
      <div className={`relative aspect-video q-glass rounded-[3rem] border-white/10 overflow-hidden group shadow-2xl ${delay % 0.2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
         <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-700`} />
         <div className="absolute inset-0 spatial-mesh opacity-20" />
         <div className="absolute inset-0 flex items-center justify-center">
            <Icon size={120} className="text-white/5 group-hover:scale-110 transition-transform duration-[4s] group-hover:rotate-6" />
         </div>
         {/* Decorative scanning line */}
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-[scan_4s_linear_infinite]" />
      </div>
    </div>
  </motion.div>
);

export default function Technology() {
  return (
    <div className="bg-q-void min-h-screen pt-40 pb-20 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8"
          >
            Protocol Architecture
          </motion.div>
          <h1 className="text-7xl md:text-[10rem] font-black mb-12 tracking-tighter shimmer-text leading-[0.8]">THE CORE <br/> ENGINE</h1>
          <p className="text-2xl text-q-text-secondary max-w-3xl italic font-medium leading-relaxed">
            Lithium is not just a UI layer. It's a high-performance virtual machine running within the browser's sandbox, orchestrating threads and memory with surgical precision.
          </p>
        </div>

        {/* Tech Stack Sections */}
        <TechSection 
          icon={Cpu}
          gradient="from-cyan-500 to-blue-600"
          title="Virtual POSIX Layer"
          subtitle="A custom-built subsystem that bridges the gap between browser APIs and native OS expectations."
          features={["Asynchronous I/O", "Shared Memory", "Signal Handling", "Process Groups"]}
          delay={0.1}
        />

        <TechSection 
          icon={Box}
          gradient="from-violet-500 to-purple-600"
          title="Spatial Compositor"
          subtitle="Real-time 3D windowing engine utilizing hardware-accelerated transforms for zero-latency UI."
          features={["Kinetic Physics", "Glass Refraction", "HDR Color Space", "Multi-Pass Bloom"]}
          delay={0.2}
        />

        <TechSection 
          icon={Shield}
          gradient="from-rose-500 to-red-600"
          title="Zero-Trust Vault"
          subtitle="Military-grade encryption for all user data, decentralized and managed entirely on the client-side."
          features={["AES-256-GCM", "PBKDF2 Keying", "WebAuthn Ready", "Encrypted Sync"]}
          delay={0.3}
        />

        <TechSection 
          icon={Radio}
          gradient="from-emerald-500 to-teal-600"
          title="Hermes Protocol"
          subtitle="A high-speed IPC (Inter-Process Communication) layer that connects the terminal to the system kernel."
          features={["Low Latency Pipe", "Stream Encoding", "ANSI Parsing", "Buffer Persistence"]}
          delay={0.4}
        />

        {/* Neural Network Visualization Placeholder */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-40 p-20 rounded-[4rem] bg-black border border-white/5 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 spatial-mesh opacity-20" />
          <div className="absolute inset-0 grid-pattern opacity-10" />
          <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10 tracking-tighter">BEYOND THE BROWSER</h2>
          <p className="text-xl text-white/40 mb-12 max-w-2xl mx-auto relative z-10 font-medium italic">
            Lithium leverages WebGPU and WASM to provide near-native performance for heavy computational tasks, making it the fastest browser-based OS ever conceived.
          </p>
          <div className="flex justify-center gap-6 relative z-10">
             <div className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-cyan-400">WebGPU Enabled</div>
             <div className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-violet-400">WASM Core</div>
             <div className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-emerald-400">Node Compatibility</div>
          </div>
        </motion.div>
      </div>

      <footer className="mt-40 pt-20 border-t border-white/5 text-center px-6">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-4">Lithium OS v5.0 // Quantum Evolution</p>
        <p className="text-white/40 text-xs italic">Constructed for the persistent web.</p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          from { top: 0; }
          to { top: 100%; }
        }
      `}} />
    </div>
  );
}
