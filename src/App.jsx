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
import Developers from './pages/Developers';

const NAV_LINKS = [
  { to: '/technology', label: 'Technology' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/developers', label: 'Developers' },
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
      <nav className="fixed top-0 left-0 w-full px-8 py-5 flex items-center justify-between z-[100] glass-liquid border-b border-white/5 transition-all font-sans">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-white font-black tracking-tighter text-2xl flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
             <Zap size={22} className="text-white fill-white group-hover:rotate-12 transition-transform shadow-white/20 shadow-lg" />
             <span className="italic uppercase tracking-tighter shimmer-text">Lithium</span>
          </Link>
          <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
             {NAV_LINKS.map(l => (
               <Link key={l.to} to={l.to} className={`hover:text-white transition-colors ${location.pathname === l.to ? 'text-white' : ''}`}>{l.label}</Link>
             ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
           {id ? (
              <div className="flex items-center gap-3">
                 <button onClick={()=>navigate('/station')} className="bg-white text-black px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-white/10 hover:scale-105 transition-all active:scale-95">Launch OS</button>
              </div>
           ) : (
              <button onClick={()=>navigate('/login')} className="bg-white text-black px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all active:scale-95">Cloud Login</button>
           )}
           <button className="md:hidden w-10 h-10 flex items-center justify-center text-white glass-liquid rounded-xl transition-all" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
           </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-3xl pt-32 px-10 flex flex-col gap-4 md:hidden"
          >
            {NAV_LINKS.map((l, i) => (
              <motion.div key={l.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={l.to} onClick={() => setMobileOpen(false)} className={`block py-5 text-4xl font-black tracking-tighter border-b border-white/5 transition-colors ${location.pathname === l.to ? 'text-white underline decoration-white/20' : 'text-slate-600 hover:text-white'}`}>{l.label}</Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-12">
              <button onClick={() => { navigate(id ? '/station' : '/login'); setMobileOpen(false); }} className="w-full bg-white text-black py-6 rounded-full font-black text-xl italic tracking-tighter">
                {id ? 'Launch Environment' : 'Initialize Vault'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Footer() {
  return (
    <footer className="py-24 px-8 border-t border-white/5 text-center bg-black">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
        <div className="flex items-center gap-3 text-white font-black tracking-tighter text-2xl italic">
          <Zap className="text-white fill-white" size={24} /> LITHIUM
        </div>
        <div className="flex flex-wrap items-center justify-center gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
          {NAV_LINKS.map(l => <Link key={l.to} to={l.to} className="hover:text-white transition-colors">{l.label}</Link>)}
        </div>
        <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.5em]">Lithium Project. All Logic Native. © 2026</p>
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
      <Route path="/developers" element={<PageTransition><Developers /></PageTransition>} />
    </Routes>
  );
}
