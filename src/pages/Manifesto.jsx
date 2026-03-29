import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, Cpu, Zap, Globe, ArrowRight, Layout, Code2, Layers } from 'lucide-react';

export default function Manifesto() {
  return (
    <div className="min-h-screen bg-q-void text-white pt-40 pb-32 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full spatial-mesh opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-violet-500/5 blur-[160px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="inline-flex items-center gap-2 text-violet-400 mb-6 font-black text-[10px] uppercase tracking-[0.4em]"
        >
           <Terminal size={16} /> THE CORE PROTOCOL
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] mb-20 italic uppercase shimmer-text"
        >
          THE MANIFESTO.
        </motion.h1>

        <div className="space-y-24">
          {[
            { id: "01", title: "Sovereign Engineering", text: "The solo developer is the new sovereign state. Computing power has decentralized the ability to build empires from a single node." },
            { id: "02", title: "Code as Law", text: "Algorithms don't care about your corporate hierarchy. In the Lithium ecosystem, logic is the only verifyable truth." },
            { id: "03", title: "Simplicity > Scale", text: "Lithium OS exists to prove that one vision, executed with absolute clarity, is faster than a thousand engineers with a roadmap." },
            { id: "04", title: "The Virtual Hardware", text: "The browser is no longer a viewer. It is the compiler, the kernel, and the hardware of the next civilization." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="flex items-start gap-12">
                <span className="text-4xl font-black text-white/10 group-hover:text-violet-500/40 transition-colors duration-500 font-mono tracking-tighter italic">{item.id}</span>
                <div>
                   <h3 className="text-3xl font-black mb-6 text-white tracking-tighter italic uppercase">{item.title}</h3>
                   <p className="text-xl text-q-text-secondary leading-relaxed font-medium italic max-w-2xl">{item.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-60 p-16 rounded-[4rem] bg-black/40 backdrop-blur-3xl border border-white/5 text-center relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 noise-overlay opacity-5" />
           <p className="text-sm font-black text-white/20 uppercase tracking-[0.5em] mb-4 italic">End of Log // Lithium Project</p>
           <p className="text-white/40 italic font-medium">Verified by Founder Node_0x01</p>
        </div>
      </div>
    </div>
  );
}
