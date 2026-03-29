import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Terminal, Shield, Cpu, Zap, Globe, ArrowRight, Layout, Code2, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] }}
    className="feature-card p-8 group relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 border border-cyan-500/20 group-hover:scale-110 transition-transform duration-500">
        <Icon size={24} className="text-cyan-400" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-q-text-secondary leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <div ref={containerRef} className="relative bg-q-void overflow-x-hidden min-h-screen">
      {/* ─── Cinematic Hero Section ─── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 spatial-mesh opacity-40" />
        <div className="absolute inset-0 grid-pattern opacity-10" />
        
        {/* Hero Content */}
        <motion.div 
          style={{ y, opacity, scale }}
          className="relative z-20 max-w-6xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6"
          >
            <span className="px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-[0.2em] animate-pulse-glow">
              Now in Orbit: Version 5.0
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-[0.9] tracking-tighter shimmer-text"
          >
            THE OS FOR <br /> THE SPATIAL WEB
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="text-xl md:text-2xl text-q-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            A high-fidelity workstation running entirely in your browser. 
            No installs, no compromises. Just pure spatial computing.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link to="/station" className="btn-primary group flex items-center gap-2">
              Launch Station <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/technology" className="btn-secondary group">
              Explore Architecture
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating UI Elements (Decorative) */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[10%] top-[20%] w-64 h-80 refraction-tile rounded-3xl hidden lg:block opacity-40 rotate-[15deg]"
        />
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute left-[5%] bottom-[15%] w-80 h-64 refraction-tile rounded-3xl hidden lg:block opacity-30 -rotate-[10deg]"
        />
      </section>

      {/* ─── Features Grid ─── */}
      <section className="relative z-20 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-6">BUILT FOR POWER</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-violet-500 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Terminal} 
              title="Real Terminal" 
              description="A true Linux terminal emulator using xterm.js. Virtual filesystem, pipes, redirects, and 50+ built-in commands."
              delay={0.1}
            />
            <FeatureCard 
              icon={Shield} 
              title="Identity Vault" 
              description="Secure, cloud-synchronized identity management. Store your keys, tokens, and data with end-to-end encryption."
              delay={0.2}
            />
            <FeatureCard 
              icon={Zap} 
              title="Quantum Glass" 
              description="State-of-the-art UI with high-performance blur, saturation, and glassmorphism. It feels like the future."
              delay={0.3}
            />
            <FeatureCard 
              icon={Globe} 
              title="Universal Access" 
              description="Your entire workstation available on any device with a browser. Sync your state across the globe instantly."
              delay={0.4}
            />
            <FeatureCard 
              icon={Layout} 
              title="Spatial Tiling" 
              description="An advanced window manager designed for focused deep work. Snap, tile, and stack windows with precision."
              delay={0.5}
            />
            <FeatureCard 
              icon={Layers} 
              title="Extensible" 
              description="Build your own apps using the Lithium SDK. A modular architecture that scales with your needs."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="relative py-32 px-6 bg-q-surface-0 border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-8 shimmer-text">READY TO EVOLVE?</h2>
          <p className="text-xl text-q-text-secondary mb-12">
            Experience the internet through a different lens. Lithium OS isn't just a website; it's a new perspective on computing.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/station" className="btn-primary">Get Started Now</Link>
            <Link to="/marketplace" className="btn-secondary">Explore Apps</Link>
          </div>
        </div>
        <div className="absolute inset-0 noise-overlay opacity-10" />
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-black mb-6 gradient-text-cyan">LITHIUM OS</h3>
            <p className="text-q-text-secondary max-w-sm mb-8">
              Pioneering the spatial web. A production-grade operating system within the browser.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Globe size={20} className="text-white/60" />
              </a>
              <a href="https://twitter.com" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <ExternalLink size={20} className="text-white/60" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Platform</h4>
            <ul className="space-y-4 text-q-text-secondary">
              <li><Link to="/station" className="hover:text-cyan-400 transition-colors">Launch Station</Link></li>
              <li><Link to="/marketplace" className="hover:text-cyan-400 transition-colors">App Marketplace</Link></li>
              <li><Link to="/technology" className="hover:text-cyan-400 transition-colors">Architecture</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Connect</h4>
            <ul className="space-y-4 text-q-text-secondary">
              <li><Link to="/developers" className="hover:text-cyan-400 transition-colors">Documentation</Link></li>
              <li><Link to="/merch" className="hover:text-cyan-400 transition-colors">Official Merch</Link></li>
              <li><Link to="/manifesto" className="hover:text-cyan-400 transition-colors">The Manifesto</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-center text-q-text-muted text-sm">
          &copy; 2026 Lithium Project. Built with &hearts; for the Spatial Web.
        </div>
      </footer>
    </div>
  );
}
