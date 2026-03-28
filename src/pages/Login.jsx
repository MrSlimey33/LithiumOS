import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Database, Shield, Cloud, Mail, Key } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // login or register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, error, success
  const [msg, setMsg] = useState('');

  const executeAuth = async (e, type) => {
    e.preventDefault();
    if(!email || !password) return;
    setStatus('loading'); setMsg(type === 'login' ? 'Decrypting secure node...' : 'Allocating encrypted payload structure...');
    
    try {
      const res = await fetch(`http://localhost:3001/api/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Authentication failed.");

      if (type === 'register') {
         setStatus('success');
         setMsg('Email registered locally on your computer. Switching to login...');
         setTimeout(() => setMode('login'), 2000);
         return;
      }

      // LOGIN FLOW
      if (data.payload) {
         window.localStorage.clear();
         Object.keys(data.payload).forEach(k => {
            window.localStorage.setItem(k, JSON.stringify(data.payload[k]));
         });
      }
      
      // Store credentials locally so we can sync back to the server later in Settings
      window.localStorage.setItem('LITHIUM_CLOUD_ID', email);
      window.localStorage.setItem('LITHIUM_SECRET', password); 
      
      setStatus('success'); setMsg('Authentication Complete.');
      setTimeout(() => navigate('/station'), 1500);

    } catch (err) {
      console.error(err);
      setStatus('error'); setMsg(err.message || 'Server not reachable. Did you start the backend?');
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-slate-200 flex items-center justify-center font-sans overflow-hidden relative isolate">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-sky-500/10 to-indigo-800/10 rounded-full blur-[100px] -z-10" />
      
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="flex flex-col items-center mb-10 text-center">
           <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] shadow-lg shadow-purple-500/20 flex items-center justify-center mb-6">
              <Shield size={40} className="text-white drop-shadow-md"/>
           </div>
           <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Lithium Secure</h1>
           <p className="text-slate-400 font-medium">Local Computer Node File Storage</p>
        </div>

        <div className="bg-[#0a0a0c] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-3xl overflow-hidden relative">
           
           <AnimatePresence mode="wait">
                <motion.form key={mode} initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}} onSubmit={(e)=>executeAuth(e, mode)} className="flex flex-col gap-5">
                   {mode === 'register' && (
                     <div className="text-center mb-4">
                        <Database className="mx-auto text-blue-400 mb-2" size={32}/>
                        <h3 className="text-xl font-bold text-white mb-2">Register Local Node</h3>
                        <p className="text-sm text-slate-400">Your details are heavily encrypted and physically saved to <code className="bg-slate-800 px-1 rounded">server/data/</code> on your computer.</p>
                     </div>
                   )}

                   <div>
                     <label className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-2 block pl-2">Node Email</label>
                     <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
                        <input value={email} onChange={e=>setEmail(e.target.value)} disabled={status==='loading'} type="email" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-mono text-sm" placeholder="founder@lithiumtech.net" />
                     </div>
                   </div>

                   <div>
                     <label className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-2 block pl-2">Encryption Cipher (Password)</label>
                     <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
                        <input value={password} onChange={e=>setPassword(e.target.value)} disabled={status==='loading'} type="password" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-mono text-sm" placeholder="••••••••" />
                     </div>
                   </div>
                   
                   <button type="submit" disabled={!email || !password || status==='loading'} className="mt-2 w-full bg-white text-black font-bold text-lg py-4 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center gap-2">
                      {status==='loading' ? <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"/> : mode === 'login' ? 'Authenticate' : 'Secure & Register'}
                   </button>
                   
                   <button type="button" onClick={()=>setMode(mode === 'login' ? 'register' : 'login')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
                      {mode === 'login' ? "Don't have a node? Create one." : "Already have a node? Login here."}
                   </button>
                </motion.form>
           </AnimatePresence>

           {status !== 'idle' && (
             <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className={`mt-6 text-xs font-bold tracking-widest uppercase text-center ${status==='error'?'text-rose-500':'text-indigo-400'}`}>
                {msg}
             </motion.div>
           )}
        </div>
      </div>
    </div>
  );
}
