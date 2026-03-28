import React from 'react';
import { Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, Cpu, Globe, Infinity, Battery, Zap, AlertTriangle, Coffee } from 'lucide-react';

// Import all pages
import Home from './pages/Home';
import Login from './pages/Login';
import Station from './pages/Station';
import Technology from './pages/Technology';
import Marketplace from './pages/Marketplace';
import Merch from './pages/Merch';
import Jobs from './pages/Jobs';
import Manifesto from './pages/Manifesto';

export function GlobalNav() {
  const navigate = useNavigate();
  const id = window.localStorage.getItem('LITHIUM_CLOUD_ID');

  return (
    <nav className="fixed top-0 left-0 w-full px-8 py-5 flex items-center justify-between z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 transition-all font-sans">
      <div className="flex items-center gap-10">
        <Link to="/" className="text-white font-bold tracking-tighter text-2xl flex items-center gap-2 group">
           <Zap className="text-blue-500 group-hover:rotate-12 transition-transform" />
           LITHIUM TECH
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-400">
           <Link to="/technology" className="hover:text-white transition-colors">Technology</Link>
           <Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
           <Link to="/merch" className="hover:text-white transition-colors">Merch</Link>
           <Link to="/jobs" className="hover:text-white transition-colors">Careers</Link>
           <Link to="/manifesto" className="hover:text-white transition-colors">Manifesto</Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
         {id ? (
            <div className="flex items-center gap-3">
               <span className="text-emerald-400 font-mono text-xs font-bold px-3 py-1 bg-emerald-900/40 border border-emerald-500/50 rounded-full flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"/>ID: {id.slice(0,6)}...</span>
               <button onClick={()=>navigate('/station')} className="bg-white text-slate-900 px-5 py-2 rounded-full font-bold text-sm tracking-wide shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105 transition-all">Launch OS</button>
            </div>
         ) : (
            <button onClick={()=>navigate('/login')} className="text-blue-400 hover:text-white font-bold text-sm tracking-wide transition-colors">Cloud Login →</button>
         )}
      </div>
    </nav>
  );
}

function PageTransition({ children }) {
  const location = useLocation();
  const isStation = location.pathname === '/station';
  return (
    <>
      {!isStation && <GlobalNav />}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full h-full ${!isStation ? 'pt-20' : ''}`}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PageTransition><Home /></PageTransition>} />
      <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
      <Route path="/station" element={<PageTransition><Station /></PageTransition>} />
      <Route path="/technology" element={<PageTransition><Technology /></PageTransition>} />
      <Route path="/marketplace" element={<PageTransition><Marketplace /></PageTransition>} />
      <Route path="/merch" element={<PageTransition><Merch /></PageTransition>} />
      <Route path="/jobs" element={<PageTransition><Jobs /></PageTransition>} />
      <Route path="/manifesto" element={<PageTransition><Manifesto /></PageTransition>} />
    </Routes>
  );
}
