import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Key, Globe, AlertCircle, Loader, CheckCircle2 } from 'lucide-react';
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
    
    setStatus('loading');
    setMsg(type === 'login' ? 'Fetching vault from repository...' : 'Forging new identity...');
    
    try {
      const { data: vault, source } = await getVault();
      
      if (source === 'empty' && type === 'login') {
        throw new Error("No vault exists yet. Create an account first.");
      }
      
      const existingUser = vault.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (type === 'register') {
         if (existingUser) throw new Error("Email already registered in the vault.");
         
         // Build initial encrypted state for new user
         const initialState = {
            'LITHIUM_apps_core': ["terminal", "calc", "notes", "settings", "store", "media", "vault", "clock"],
            'LITHIUM_notes_db': [{id:1, title:'Welcome', text:'Your Lithium ID is now stored in the repository.\nSecurity: Client-Side AES-256'}]
         };
         
         const encryptedPayload = await encrypt(initialState, password);
         vault.push({ email, payload: encryptedPayload });
         
         // Save encrypted vault to GitHub repo
         await saveVault(vault);
         
         setStatus('success');
         setMsg('Identity forged. Switching to login...');
         setTimeout(() => setMode('login'), 2000);
         return;
      }

      // ---- LOGIN FLOW ----
      if (!existingUser) throw new Error("User not found. Register first.");

      try {
         const decryptedPayload = await decrypt(existingUser.payload, password);
         
         // Hydrate localStorage with user's state
         window.localStorage.clear();
         Object.keys(decryptedPayload).forEach(k => {
            window.localStorage.setItem(k, JSON.stringify(decryptedPayload[k]));
         });
         
         window.localStorage.setItem('LITHIUM_CLOUD_ID', email);
         window.localStorage.setItem('LITHIUM_SECRET', password); 
         
         setStatus('success');
         setMsg('Authentication Complete. Booting OS...');
         setTimeout(() => navigate('/station'), 1500);
      } catch {
         throw new Error("Invalid password. Decryption failed.");
      }

    } catch (err) {
      console.error(err);
      setStatus('error');
      setMsg(err.message || 'Authentication failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-slate-200 flex items-center justify-center font-sans overflow-hidden relative isolate px-4">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-sky-500/10 to-blue-800/10 rounded-full blur-[100px] -z-10" />
      
      <div className="w-full max-w-md p-4 md:p-8 relative z-10">
        <div className="flex flex-col items-center mb-10 text-center">
           <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] shadow-lg shadow-blue-500/20 flex items-center justify-center mb-6">
              <Shield size={40} className="text-white drop-shadow-md"/>
           </div>
           <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">Lithium ID</h1>
           <p className="text-slate-400 font-medium tracking-wide text-sm md:text-base">Encrypted Cloud Vault</p>
        </div>

        <div className="bg-[#0a0a0c] border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl backdrop-blur-3xl overflow-hidden relative">
           
           <AnimatePresence mode="wait">
                <motion.form key={mode} initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}} onSubmit={(e)=>executeAuth(e, mode)} className="flex flex-col gap-5 md:gap-6">
                   <div>
                     <label className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3 block pl-2">Email Address</label>
                     <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
                        <input value={email} onChange={e=>setEmail(e.target.value)} disabled={status==='loading'} type="email" required className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-4 md:py-5 pl-12 pr-4 text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-mono text-sm" placeholder="you@example.com" />
                     </div>
                   </div>

                   <div>
                     <label className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3 block pl-2">Security Key (Password)</label>
                     <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
                        <input value={password} onChange={e=>setPassword(e.target.value)} disabled={status==='loading'} type="password" required className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-4 md:py-5 pl-12 pr-4 text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-mono text-sm" placeholder="••••••••" />
                     </div>
                   </div>
                   
                   <button type="submit" disabled={!email || !password || status==='loading'} className="mt-2 md:mt-4 w-full bg-white text-black font-bold text-lg md:text-xl py-4 md:py-5 rounded-xl md:rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center gap-2">
                      {status==='loading' ? <Loader size={22} className="animate-spin" /> : mode === 'login' ? 'Launch Node' : 'Initialize Vault'}
                   </button>
                   
                   <button type="button" onClick={()=>{setMode(mode === 'login' ? 'register' : 'login'); setStatus('idle'); setMsg('');}} className="text-sm font-bold text-slate-400 hover:text-white transition-colors text-center w-full">
                      {mode === 'login' ? "Don't have a vault? Create one." : "Already have a vault? Login here."}
                   </button>
                </motion.form>
           </AnimatePresence>

           <AnimatePresence>
             {status !== 'idle' && (
               <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0}} className={`mt-6 md:mt-8 text-xs font-bold tracking-widest uppercase text-center flex items-center justify-center gap-2 ${status==='error'?'text-rose-500':status==='success'?'text-emerald-400':'text-blue-400'}`}>
                  {status === 'error' && <AlertCircle size={14} />}
                  {status === 'success' && <CheckCircle2 size={14} />}
                  {status === 'loading' && <Loader size={14} className="animate-spin" />}
                  {msg}
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6 font-medium leading-relaxed">
          All credentials are encrypted client-side with AES-256-GCM<br/>before being stored in the repository.
        </p>
      </div>
    </div>
  );
}
