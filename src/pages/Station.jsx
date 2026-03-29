import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Lock } from 'lucide-react';
import LithiumOS from '../LithiumOS';

export default function Station() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [bootSequence, setBootSequence] = useState(true);
  const [bootLogs, setBootLogs] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem('LITHIUM_CLOUD_ID');
    if (!user) {
      navigate('/login');
    } else {
      setAuthChecked(true);
      // Simulate boot sequence
      const logs = [
         "Initializing Lithium Kernel v4.2.0...",
         "Solo-Dev Mode: ENABLED",
         "Caffeine Levels: OPTIMAL",
         "Bypassing Silicon Valley Gatekeepers...",
         "Authenticating Founder: " + user,
         "Loading Spatial Window Manager...",
         "Establishing AeroEngine Compositor...",
         "Checking for Homework: 0 files found (Good).",
         "Boot Sequence Complete. Yielding to UI Thread."
      ];
      
      let index = 0;
      const interval = setInterval(() => {
        if (index < logs.length) {
          setBootLogs(prev => [...prev, logs[index]]);
          index++;
        } else {
          clearInterval(interval);
          setTimeout(() => setBootSequence(false), 800);
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, [navigate]);

  if (!authChecked) return null;

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-900 text-slate-100 relative">
      <AnimatePresence mode="wait">
        {bootSequence ? (
          <motion.div 
            key="boot"
            exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 bg-[#0a0f18] font-mono text-sm leading-relaxed"
          >
            <div className="w-full max-w-2xl text-cyan-400">
               <div className="flex items-center gap-3 mb-8">
                  <Terminal size={24} className="text-slate-500" />
                  <span className="font-bold tracking-widest uppercase text-slate-300">Lithium Pre-Boot Environment</span>
               </div>
               <div className="flex flex-col gap-2 min-h-[300px] justify-end opacity-80">
                  {bootLogs.map((log, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-3"
                    >
                      <span className="text-slate-600 shrink-0">[{new Date().toISOString().substring(11,23)}]</span>
                      <span>{log}</span>
                    </motion.div>
                  ))}
                  {bootLogs.length < 7 && (
                    <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-3 h-5 bg-cyan-400 mt-2" />
                  )}
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="os"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-10"
          >
             <LithiumOS previewMode={false} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
