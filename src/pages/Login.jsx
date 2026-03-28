import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cloud, Mail, Key, Globe, AlertCircle } from 'lucide-react';
import { encrypt, decrypt } from '../lib/crypto';

// ⚠️ PASTE YOUR GOOGLE APPS SCRIPT URL HERE
const GAS_URL = "https://script.google.com/macros/s/AKfycbyaqY7PKLnrs8XXgBqXc6Sg1xa0U9WAC5_isP4F_s2skPcL19RSp4yQKGfZukgzJP0fTg/exec"; 

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle'); 
  const [msg, setMsg] = useState('');

  const executeAuth = async (e, type) => {
    e.preventDefault();
    if(!GAS_URL) return alert("You must deploy the Google Apps Script and paste the URL into src/pages/Login.jsx first!");
    if(!email || !password) return;
    
    setStatus('loading'); setMsg(type === 'login' ? 'Searching Founder Drive...' : 'Allocating space on your Drive...');
    
    try {
      if (type === 'register') {
         const initialState = {
            'LITHIUM_apps_core': ["terminal", "calc", "notes", "settings", "store", "media", "vault", "clock"],
            'LITHIUM_notes_db': [{id:1, title:'Welcome', text:'Your Lithium Cloud ID is now live on your personal Google Drive.\nEncryption: Disabled (Performance Mode)'}]
         };
         
         const payload = await encrypt(initialState, password); // Passthrough now
         
         const res = await fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors', 
            body: JSON.stringify({ action: 'register', email, payload })
         });
         
         setStatus('success');
         setMsg('Account Created! Welcome to the empire.');
         setTimeout(() => setMode('login'), 2000);
         return;
      }

      // LOGIN FLOW
      const url = `${GAS_URL}?action=login&email=${encodeURIComponent(email)}`;
      const res = await fetch(url);
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "User not found.");

      const payload = await decrypt(data.payload, password); // Passthrough now
      window.localStorage.clear();
      Object.keys(payload).forEach(k => {
         window.localStorage.setItem(k, JSON.stringify(payload[k]));
      });
      
      window.localStorage.setItem('LITHIUM_CLOUD_ID', email);
      window.localStorage.setItem('LITHIUM_SECRET', password); 
      
      setStatus('success'); setMsg('Authentication Complete.');
      setTimeout(() => navigate('/station'), 1500);

    } catch (err) {
      console.error(err);
      setStatus('error'); setMsg(err.message || 'Verification failed (CORS or Network issue).');
      if(err.message === "Email already taken. Try logging in.") {
         setMode('login');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-slate-200 flex items-center justify-center font-sans overflow-hidden relative isolate">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-sky-500/10 to-blue-800/10 rounded-full blur-[100px] -z-10" />
      
      <div className="w-full max-w-md p-8 relative z-10">
        {!GAS_URL && (
           <div className="mb-10 p-6 bg-rose-500/20 border border-rose-500/50 rounded-[2rem] text-rose-200 text-sm font-medium animate-pulse">
              <Globe size={24} className="mb-2" />
              Founder Action Required: Paste your Google Apps Script URL into <code className="bg-black/30 px-1">Login.jsx</code> to enable the Drive bridge.
           </div>
        )}

        <div className="flex flex-col items-center mb-10 text-center">
           <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] shadow-lg shadow-blue-500/20 flex items-center justify-center mb-6">
              <Cloud size={40} className="text-white drop-shadow-md"/>
           </div>
           <h1 className="text-5xl font-bold tracking-tight text-white mb-2 italic">Lithium ID</h1>
           <p className="text-slate-400 font-medium tracking-wide">Secure Personal GDrive Storage</p>
        </div>

        <div className="bg-[#0a0a0c] border border-white/10 rounded-[3rem] p-10 shadow-2xl backdrop-blur-3xl overflow-hidden relative">
           
           <AnimatePresence mode="wait">
                <motion.form key={mode} initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}} onSubmit={(e)=>executeAuth(e, mode)} className="flex flex-col gap-6">
                   <div>
                     <label className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3 block pl-2">Email Address</label>
                     <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
                        <input value={email} onChange={e=>setEmail(e.target.value)} disabled={status==='loading'} type="email" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-4 text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-mono text-sm" placeholder="founder@lithiumtech.net" />
                     </div>
                   </div>

                   <div>
                     <label className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3 block pl-2">Security Key (Password)</label>
                     <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
                        <input value={password} onChange={e=>setPassword(e.target.value)} disabled={status==='loading'} type="password" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-4 text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-mono text-sm" placeholder="••••••••" />
                     </div>
                   </div>
                   
                   <button type="submit" disabled={!email || !password || status==='loading'} className="mt-4 w-full bg-white text-black font-bold text-xl py-5 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center gap-2">
                      {status==='loading' ? <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"/> : mode === 'login' ? 'Launch Node' : 'Initialize Vault'}
                   </button>
                   
                   <button type="button" onClick={()=>setMode(mode === 'login' ? 'register' : 'login')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors text-center w-full">
                      {mode === 'login' ? "Don't have a vault? Create one." : "Already have a vault? Login here."}
                   </button>
                </motion.form>
           </AnimatePresence>

           {status !== 'idle' && (
             <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className={`mt-8 text-xs font-bold tracking-widest uppercase text-center flex items-center justify-center gap-2 ${status==='error'?'text-rose-500':'text-blue-400'}`}>
                {status === 'error' && <AlertCircle size={14} />} {msg}
             </motion.div>
           )}
        </div>
      </div>
    </div>
  );
}
