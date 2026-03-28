import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Database, Shield, Cloud, Mail, Key, Globe } from 'lucide-react';
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
      if (!GAS_URL) return alert("You must deploy the Google Apps Script and paste the URL into src/pages/Login.jsx first!");
      if (!email || !password) return;

      setStatus('loading'); setMsg(type === 'login' ? 'Decrypting secure node...' : 'Allocating encrypted payload structure...');

      try {
         if (type === 'register') {
            const initialState = {
               'LITHIUM_apps_core': ["terminal", "calc", "notes", "settings", "store", "media", "vault", "clock"],
               'LITHIUM_notes_db': [{ id: 1, title: 'Welcome', text: 'Your Lithium Cloud ID is now secured on your personal Google Drive.\nData is end-to-end encrypted.' }]
            };

            const encryptedPayload = await encrypt(initialState, password);

            const res = await fetch(GAS_URL, {
               method: 'POST',
               mode: 'no-cors', // GAS requires no-cors for simple web app triggers
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ action: 'register', email, payload: encryptedPayload })
            });

            setStatus('success');
            setMsg('Account encrypted and saved to your Drive! Switching to login...');
            setTimeout(() => setMode('login'), 2000);
            return;
         }

         // LOGIN FLOW
         const res = await fetch(GAS_URL + "?query=true", { // Simple way to trigger GAS
            method: 'POST',
            body: JSON.stringify({ action: 'login', email })
         });

         const data = await res.json();
         if (!data.success) throw new Error(data.error || "User not found.");

         // Decrypt the payload from your Drive
         try {
            const decryptedPayload = await decrypt(data.payload, password);
            window.localStorage.clear();
            Object.keys(decryptedPayload).forEach(k => {
               window.localStorage.setItem(k, JSON.stringify(decryptedPayload[k]));
            });

            window.localStorage.setItem('LITHIUM_CLOUD_ID', email);
            window.localStorage.setItem('LITHIUM_SECRET', password); // Used for future syncs

            setStatus('success'); setMsg('Authentication Complete.');
            setTimeout(() => navigate('/station'), 1500);
         } catch (err) {
            throw new Error("Invalid password. Decryption failed.");
         }

      } catch (err) {
         console.error(err);
         setStatus('error'); setMsg(err.message || 'Verification failed.');
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
                  <Cloud size={40} className="text-white drop-shadow-md" />
               </div>
               <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Lithium Tech ID</h1>
               <p className="text-slate-400 font-medium tracking-wide italic">Secure Personal GDrive Storage</p>
            </div>

            <div className="bg-[#0a0a0c] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-3xl overflow-hidden relative">

               <AnimatePresence mode="wait">
                  <motion.form key={mode} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={(e) => executeAuth(e, mode)} className="flex flex-col gap-5">
                     <div>
                        <label className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-2 block pl-2">Email Address</label>
                        <div className="relative">
                           <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                           <input value={email} onChange={e => setEmail(e.target.value)} disabled={status === 'loading'} type="email" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-mono text-sm" placeholder="founder@lithiumtech.net" />
                        </div>
                     </div>

                     <div>
                        <label className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-2 block pl-2">Security Key (Password)</label>
                        <div className="relative">
                           <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                           <input value={password} onChange={e => setPassword(e.target.value)} disabled={status === 'loading'} type="password" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-mono text-sm" placeholder="••••••••" />
                        </div>
                     </div>

                     <button type="submit" disabled={!email || !password || status === 'loading'} className="mt-2 w-full bg-white text-black font-bold text-lg py-4 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center gap-2">
                        {status === 'loading' ? <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> : mode === 'login' ? 'Launch Node' : 'Initialize Vault'}
                     </button>

                     <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
                        {mode === 'login' ? "Don't have a vault? Create one." : "Already have a vault? Login here."}
                     </button>
                  </motion.form>
               </AnimatePresence>

               {status !== 'idle' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 text-xs font-bold tracking-widest uppercase text-center ${status === 'error' ? 'text-rose-500' : 'text-blue-400'}`}>
                     {msg}
                  </motion.div>
               )}
            </div>
         </div>
      </div>
   );
}
