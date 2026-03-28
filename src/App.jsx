import React, { useState } from 'react';
import { Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Zap, Menu, X } from 'lucide-react';

// Import all pages
import Home from './pages/Home';
import Login from './pages/Login';
import Station from './pages/Station';
import Technology from './pages/Technology';
import Marketplace from './pages/Marketplace';
import Merch from './pages/Merch';
import Jobs from './pages/Jobs';
import Manifesto from './pages/Manifesto';
import Concepts from './pages/Concepts';

const NAV_LINKS = [
  { to: '/technology', label: 'Technology' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/merch', label: 'Merch' },
  { to: '/jobs', label: 'Careers' },
  { to: '/manifesto', label: 'Manifesto' },
];

export function GlobalNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const id = window.localStorage.getItem('LITHIUM_CLOUD_ID');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full px-6 md:px-8 py-4 md:py-5 flex items-center justify-between z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 transition-all font-sans">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="text-white font-bold tracking-tighter text-xl md:text-2xl flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
             <Zap className="text-blue-500 group-hover:rotate-12 transition-transform" size={20} />
             LITHIUM TECH
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-400">
             {NAV_LINKS.map(l => (
               <Link key={l.to} to={l.to} className={`hover:text-white transition-colors ${location.pathname === l.to ? 'text-white' : ''}`}>{l.label}</Link>
             ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
           {id ? (
              <div className="flex items-center gap-3">
                 <span className="hidden sm:flex text-emerald-400 font-mono text-xs font-bold px-3 py-1 bg-emerald-900/40 border border-emerald-500/50 rounded-full items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"/>ID: {id.slice(0,6)}...</span>
                 <button onClick={()=>navigate('/station')} className="bg-white text-slate-900 px-4 md:px-5 py-2 rounded-full font-bold text-xs md:text-sm tracking-wide shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105 transition-all">Launch OS</button>
              </div>
           ) : (
              <button onClick={()=>navigate('/login')} className="text-blue-400 hover:text-white font-bold text-sm tracking-wide transition-colors hidden md:block">Cloud Login →</button>
           )}
           <button className="md:hidden w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-xl transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
           </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-2xl pt-24 px-8 flex flex-col gap-2 md:hidden"
          >
            {NAV_LINKS.map((l, i) => (
              <motion.div key={l.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={l.to} onClick={() => setMobileOpen(false)} className={`block py-4 text-2xl font-bold tracking-tight border-b border-slate-800 transition-colors ${location.pathname === l.to ? 'text-blue-400' : 'text-white hover:text-blue-400'}`}>{l.label}</Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8">
              {id ? (
                <button onClick={() => { navigate('/station'); setMobileOpen(false); }} className="w-full bg-white text-slate-900 py-4 rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.15)]">Launch OS</button>
              ) : (
                <button onClick={() => { navigate('/login'); setMobileOpen(false); }} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30">Cloud Login</button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12 px-6 text-center font-sans">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-white font-bold tracking-tighter text-lg">
          <Zap className="text-blue-500" size={18} /> LITHIUM TECH
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-500">
          {NAV_LINKS.map(l => <Link key={l.to} to={l.to} className="hover:text-white transition-colors">{l.label}</Link>)}
        </div>
        <p className="text-xs text-slate-600 font-medium">© 2026 Lithium Tech. Built by a 17-year-old.</p>
      </div>
    </footer>
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
          {!isStation && <Footer />}
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
      <Route path="/concepts" element={<PageTransition><Concepts /></PageTransition>} />
    </Routes>
  );
}
