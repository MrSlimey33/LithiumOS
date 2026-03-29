import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Zap, Menu, X, Layout, Shield, Cpu, Activity, Globe, Command, ExternalLink } from 'lucide-react';

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
  { to: '/manifesto', label: 'Manifesto' },
];

export function GlobalNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const id = window.localStorage.getItem('LITHIUM_CLOUD_ID');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full px-8 py-4 flex items-center justify-between z-[100] transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center glow-cyan shadow-lg transition-transform group-hover:rotate-12">
                <Zap size={20} className="text-white fill-white" />
              </div>
              <span className="font-black text-xl tracking-tighter text-white uppercase italic group-hover:shimmer-text transition-all">
                LITHIUM
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(link => (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors hover:text-cyan-400 ${location.pathname === link.to ? 'text-white' : 'text-white/40'}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(id ? '/station' : '/login')}
              className="hidden sm:block px-6 py-2.5 rounded-full bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
            >
              {id ? 'Launch Station' : 'Initialize Vault'}
            </button>
            <button className="md:hidden w-11 h-11 flex items-center justify-center text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        {/* Background Blur on Scroll */}
        <div className={`absolute inset-0 -z-10 transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border-b border-white/5" />
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(40px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-[90] bg-black/80 flex flex-col pt-32 px-10 gap-2 md:hidden"
          >
            {NAV_LINKS.map((l, i) => (
              <motion.div key={l.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Link 
                  to={l.to} 
                  onClick={() => setMobileOpen(false)} 
                  className={`block py-4 text-5xl font-black tracking-tighter transition-all ${location.pathname === l.to ? 'text-cyan-400' : 'text-white/20 hover:text-white'}`}
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-12">
              <button 
                onClick={() => { navigate(id ? '/station' : '/login'); setMobileOpen(false); }} 
                className="w-full bg-cyan-500 text-black py-6 rounded-[2rem] font-black text-xl italic tracking-tighter shadow-2xl shadow-cyan-500/20 active:scale-95 transition-transform"
              >
                {id ? 'Warp to Station' : 'Initialize Identity'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function PageLayout({ children }) {
  const location = useLocation();
  const isStation = location.pathname === '/station';
  
  return (
    <div className="flex flex-col min-h-screen">
      {!isStation && <GlobalNav />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <div className="bg-q-void text-white selection:bg-cyan-500/30 selection:text-white antialiased">
      <PageLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/station" element={<Station />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/merch" element={<Merch />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/concepts" element={<Concepts />} />
          <Route path="/developers" element={<Developers />} />
        </Routes>
      </PageLayout>
    </div>
  );
}
