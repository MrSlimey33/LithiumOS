import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Cpu, Zap, Eye, MousePointer2, Box, Sparkles, Command } from 'lucide-react';

const ConceptSection = ({ title, subtitle, icon: Icon, delay }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8 }}
    className="q-glass rounded-[3rem] p-12 border-white/5 hover:border-cyan-500/30 transition-all group relative overflow-hidden mb-12"
  >
    <div className="absolute inset-0 spatial-mesh opacity-10 group-hover:opacity-20 transition-opacity" />
    <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center text-center md:text-left">
      <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shrink-0 shadow-2xl group-hover:rotate-6 transition-transform">
        <Icon size={48} className="text-white" />
      </div>
      <div>
        <h2 className="text-4xl font-black mb-4 text-white tracking-tighter uppercase italic">{title}</h2>
        <p className="text-xl text-q-text-secondary leading-relaxed italic">{subtitle}</p>
      </div>
    </div>
  </motion.div>
);

export default function Concepts() {
  return (
    <div className="bg-q-void min-h-screen pt-40 pb-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-cyan-400 mb-8 font-black text-[10px] uppercase tracking-[0.4em]"
          >
            Visual Laboratory
          </motion.div>
          <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none mb-12 shimmer-text italic">
            FUTURE <br /> ECHOES
          </h1>
          <p className="text-2xl text-q-text-secondary max-w-3xl mx-auto leading-relaxed">
            Exploring the boundaries of human-computer interaction. These are the experimental seeds of LithiumOS v6.0 and beyond.
          </p>
        </div>

        {/* Concept Grid */}
        <div className="space-y-8">
          <ConceptSection 
            title="Neural Desktop" 
            subtitle="An interface that adapts to your cognitive state, dynamically rearranging windows and tools based on focus patterns and neural telemetry."
            icon={Zap}
            delay={0.1}
          />
          <ConceptSection 
            title="Holographic File Systems"
            subtitle="Moving beyond folders into multi-dimensional data clouds. Navigate your information through spatial gravity and semantic relevance."
            icon={Box}
            delay={0.2}
          />
          <ConceptSection 
            title="Kinetic Logic"
            subtitle="Programming through physical metaphors. Build logic flows by manipulating geometric primitives in a 3D browser environment."
            icon={MousePointer2}
            delay={0.3}
          />
          <ConceptSection 
            title="Ambient Awareness"
            subtitle="System events communicated through subtle atmospheric shifts—light, color temperature, and micro-vibrations of the interface."
            icon={Eye}
            delay={0.4}
          />
        </div>

        {/* Laboratory Close */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-40 text-center"
        >
          <div className="inline-block p-1 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full mb-12">
            <div className="bg-q-void rounded-full px-12 py-4">
               <span className="text-lg font-black tracking-widest uppercase italic">End Transmission</span>
            </div>
          </div>
          <p className="text-q-text-muted italic max-w-xl mx-auto">
            These concepts are currently being synthesized in our R&D labs. Stay tuned for the next phase of the digital evolution.
          </p>
        </motion.div>
      </div>

      <footer className="mt-40 pt-20 border-t border-white/5 text-center px-6">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-4">Concepts // Lithium R&D</p>
        <p className="text-white/40 text-xs italic">Experimental build status: Alpha-4.</p>
      </footer>
    </div>
  );
}
