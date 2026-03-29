import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Key, Globe, AlertCircle, Loader, CheckCircle2, Zap } from 'lucide-react';
import { encrypt, decrypt } from '../lib/crypto';
import { getVault, saveVault } from '../lib/github_vault';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [msg, setMsg] = useState('');

  const executeAuth = async (e, type) => {
    e.preventDefault();
    if(!email || !password) return;
    
    // DOMAIN VALIDATION FOR REGISTRATION
    if (type === 'register' && !email.toLowerCase().endsWith('@lithium-tech.net')) {
       setStatus('error');
       setMsg("Membership Restricted: Use @lithium-tech.net to register.");
       return;
    }

    setStatus('loading');
    setMsg(type === 'login' ? 'Fetching encrypted vault...' : 'Forging new identity...');
    
    try {
      const { data: vault, source } = await getVault();
      const existingUser = vault.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (type === 'register') {
         if (existingUser) throw new Error("Email already registered in the vault.");
         
         const initialState = {
            'LITHIUM_apps_core': ["terminal", "calc", "notes", "settings", "store", "media", "vault", "clock"],
            'LITHIUM_notes_db': [{id:1, title:'Welcome', text:'Your Lithium ID is now stored in the repository.\nSecurity: Client-Side AES-256'}]
         };
         
         const encryptedPayload = await encrypt(initialState, password);
         vault.push({ email, payload: encryptedPayload });
         
         const syncResult = await saveVault(vault);
         
         if (syncResult && syncResult.status === 'error') {
            setStatus('error');
            setMsg(`Sync Failed: ${syncResult.message}`);
         } else {
            setStatus('success');
            setMsg('Identity forged. Switching to login...');
            setTimeout(() => {
               setMode('login');
               setStatus('idle');
               setMsg('');
            }, 2500);
         }
         return;
      }

      // ---- LOGIN FLOW ----
      if (!existingUser) throw new Error("User not found. Register first.");

      try {
         const decryptedPayload = await decrypt(existingUser.payload, password);
         
         window.localStorage.clear();
         Object.keys(decryptedPayload).forEach(k => {
            window.localStorage.setItem(k, JSON.stringify(decryptedPayload[k]));
         });
         
         window.localStorage.setItem('LITHIUM_CLOUD_ID', email);
         window.localStorage.setItem('LITHIUM_SECRET', password); 
         
         setStatus('success');
         setMsg('Authentication Complete. Booting...');
         setTimeout(() => navigate('/station'), 1200);
      } catch {
         throw new Error("Invalid decryption key. Access denied.");
      }

    } catch (err) {
      console.error(err);
      setStatus('error');
      setMsg(err.message || 'Authentication failed.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans overflow-hidden relative px-6">
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-500 to-indigo-900 opacity-20" />
      </div>

      <div className="w-full max-w-sm flex flex-col items-center">
        <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="mb-12 cursor-pointer" onClick={()=>navigate('/')}>
           <div className="w-16 h-16 rounded-[1.5rem] bg-white text-black flex items-center justify-center shadow-2xl shadow-white/10 mx-auto mb-6"><Zap size={32} className="fill-black" /></div>
           <h1 className="text-3xl font-black tracking-tighter text-center italic uppercase">Lithium</h1>
        </motion.div>

        <div className="w-full glass-liquid rounded-[3rem] p-10 border border-white/5 relative">
           <h2 className="text-2xl font-black tracking-tighter mb-2">{mode === 'login' ? 'Continue' : 'Initialize'}</h2>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-10">Encrypted Cloud Gateway</p>

           <form className="flex flex-col gap-8" onSubmit={(e)=>executeAuth(e, mode)}>
              <div className="space-y-3">
                 <label className="text-[10px] font-black tracking-widest uppercase text-slate-600 block pl-1">Email Hash</label>
                 <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors" size={18}/>
                    <input value={email} onChange={e=>setEmail(e.target.value)} disabled={status==='loading'} type="email" required className="w-full liquid-well rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-bold placeholder-slate-800 outline-none focus:ring-4 ring-white/5 transition-all" placeholder="name@lithium-tech.net" />
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black tracking-widest uppercase text-slate-600 block pl-1">Security Key</label>
                 <div className="relative group">
                    <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors" size={18}/>
                    <input value={password} onChange={e=>setPassword(e.target.value)} disabled={status==='loading'} type="password" required className="w-full liquid-well rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-bold placeholder-slate-800 outline-none focus:ring-4 ring-white/5 transition-all" placeholder="Unlock code" />
                 </div>
              </div>

              <button type="submit" disabled={status==='loading'} className="bg-white text-black py-5 rounded-full font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-white/5 disabled:opacity-20 flex justify-center items-center gap-3">
                 {status==='loading' ? <Loader size={20} className="animate-spin" /> : mode === 'login' ? 'Launch Node' : 'Initialize Vault'}
              </button>

              <button type="button" onClick={()=>{setMode(mode === 'login' ? 'register' : 'login'); setStatus('idle'); setMsg('');}} className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors w-full text-center mt-2">
                 {mode === 'login' ? "Register Domain Account" : "Return to Credentials"}
              </button>
           </form>

           <AnimatePresence>
              {status !== 'idle' && (
                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0}} className={`mt-10 p-4 rounded-3xl text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-3 border ${status==='error'?'bg-rose-500/10 text-rose-500 border-rose-500/20':'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                   {status === 'loading' ? <Loader size={14} className="animate-spin" /> : status === 'error' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                   {msg}
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        <p className="mt-12 text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] text-center opacity-40">
           Standard AES-256 Vault / Client-Side Encrypted
        </p>
      </div>
    </div>
  );
}
