import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cpu, ArrowRight, ArrowLeft, ShieldCheck, User } from 'lucide-react';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if they are already logged in
  useEffect(() => {
    const user = localStorage.getItem('LITHIUM_USER');
    if (user) {
      navigate('/station');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Credentials required.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate network delay for effects
    setTimeout(() => {
      if (mode === 'register') {
        const users = JSON.parse(localStorage.getItem('LITHIUM_DB_USERS') || '{}');
        if (users[username]) {
          setError('Lithium ID already exists.');
          setLoading(false);
          return;
        }
        users[username] = { password }; // Real app would hash
        localStorage.setItem('LITHIUM_DB_USERS', JSON.stringify(users));
        localStorage.setItem('LITHIUM_USER', username);
        navigate('/station');
      } else {
        const users = JSON.parse(localStorage.getItem('LITHIUM_DB_USERS') || '{}');
        if (users[username] && users[username].password === password) {
          localStorage.setItem('LITHIUM_USER', username);
          navigate('/station');
        } else {
          setError('Invalid credentials.');
          setLoading(false);
        }
      }
    }, 800);
  };

  return (
    <div className="relative min-h-screen bg-slate-900 flex items-center justify-center overflow-hidden font-sans text-slate-200">
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 240, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-cyan-500/10 blur-[150px]" 
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 180, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-blue-600/10 blur-[150px]" 
        />
      </div>

      <button onClick={() => navigate('/')} className="absolute top-8 left-8 sm:top-12 sm:left-12 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-20 group font-medium">
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" /> Back to Home
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10 px-6 sm:px-0"
      >
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden isolate">
          {/* Glass glare effect */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-[2.5rem]" />

          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.4)] border border-white/20">
               {mode === 'login' ? <User className="text-white" size={32} /> : <ShieldCheck className="text-white" size={32} />}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2 text-center">
              {mode === 'login' ? 'Authentication' : 'Initialize ID'}
            </h1>
            <p className="text-slate-400 text-sm text-center font-medium">
              {mode === 'login' ? 'Enter your Lithium ID to sync session.' : 'Create a master identity for the node cluster.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
            <div>
              <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">Lithium ID (Username)</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 outline-none text-white px-5 py-4 rounded-2xl focus:bg-slate-900 focus:border-cyan-500/50 transition-all font-medium placeholder-slate-600"
                placeholder="system_admin"
                spellCheck="false"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">Security Key</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 outline-none text-white px-5 py-4 rounded-2xl focus:bg-slate-900 focus:border-cyan-500/50 transition-all font-medium placeholder-slate-600 tracking-widest"
                placeholder="••••••••"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-rose-400 text-sm font-semibold text-center mt-2"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={loading}
              className={`mt-4 w-full bg-white text-slate-900 font-bold text-lg py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${loading ? 'opacity-70 pointer-events-none' : ''}`}
            >
               {loading ? (
                 <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Cpu size={24} /></motion.div>
               ) : (
                 <>{mode === 'login' ? 'Boot Session' : 'Register Node'} <ArrowRight size={20}/></>
               )}
            </button>
          </form>

          <div className="mt-8 text-center relative z-10">
            <button 
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
              className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
            >
               {mode === 'login' ? "Don't have an ID? Register Node" : "Already registered? Boot Session"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
