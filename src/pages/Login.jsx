import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Database, Shield, Fingerprint, Cloud, Zap, Cpu } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // login or register
  const [cloudId, setCloudId] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, error, success
  const [msg, setMsg] = useState('');
  const [newId, setNewId] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatus('loading'); setMsg('Provisioning secure cloud node...');
    try {
      // Create a fresh OS state
      const initialState = {
         'LITHIUM_apps_core': ["terminal", "calc", "notes", "settings", "store", "media", "vault", "clock"],
         'LITHIUM_notes_db': [{id:1, title:'Welcome', text:'Your Lithium Cloud ID is active.\nChanges are saved locally and synced to the cloud via the Settings app.'}]
      };
      
      const res = await fetch('https://jsonblob.com/api/jsonBlob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(initialState)
      });
      
      const loc = res.headers.get('Location');
      if (loc) {
         const generatedId = loc.split('/').pop();
         setNewId(generatedId);
         setStatus('success');
         setMsg('Node provisioned successfully.');
      } else {
         throw new Error("Cloud provider failed to return node locator.");
      }
    } catch (err) {
      console.error(err);
      setStatus('error'); setMsg('Failed to reach cloud infrastructure. Check your connection.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!cloudId) return;
    setStatus('loading'); setMsg('Authenticating and pulling state...');
    try {
      const res = await fetch(`https://jsonblob.com/api/jsonBlob/${cloudId}`, {
         headers: { 'Accept': 'application/json' }
      });
      if(!res.ok) throw new Error("Invalid Cloud ID.");
      const data = await res.json();
      
      // Inject cloud data into local VDisk
      Object.keys(data).forEach(k => {
         window.localStorage.setItem(k, JSON.stringify(data[k]));
      });
      window.localStorage.setItem('LITHIUM_CLOUD_ID', cloudId);
      
      setStatus('success'); setMsg('Authentication Complete.');
      setTimeout(() => navigate('/station'), 1500);
    } catch (err) {
      console.error(err);
      setStatus('error'); setMsg('Invalid Lithium ID or node is unreachable.');
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-slate-200 flex items-center justify-center font-sans overflow-hidden relative isolate">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-sky-500/10 to-blue-800/10 rounded-full blur-[100px] -z-10" />
      
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="flex flex-col items-center mb-10 text-center">
           <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] shadow-lg shadow-blue-500/20 flex items-center justify-center mb-6">
              <Cloud size={40} className="text-white drop-shadow-md"/>
           </div>
           <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Lithium ID</h1>
           <p className="text-slate-400 font-medium">Decentralized JSON Cloud Sync</p>
        </div>

        <div className="bg-[#0a0a0c] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-3xl overflow-hidden relative">
           
           <AnimatePresence mode="wait">
             {mode === 'login' && (
                <motion.form key="login" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}} onSubmit={handleLogin} className="flex flex-col gap-5">
                   <div>
                     <label className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-2 block pl-2">Cloud ID (JSONBlob Hash)</label>
                     <div className="relative">
                        <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
                        <input value={cloudId} onChange={e=>setCloudId(e.target.value)} disabled={status==='loading'} type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-mono text-sm" placeholder="e.g. 113708573..." />
                     </div>
                   </div>
                   
                   <button type="submit" disabled={!cloudId || status==='loading'} className="mt-4 w-full bg-white text-black font-bold text-lg py-4 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center gap-2">
                      {status==='loading' ? <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"/> : 'Authenticate'}
                   </button>
                   <button type="button" onClick={()=>setMode('register')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Don't have an ID? Generate one.</button>
                </motion.form>
             )}

             {mode === 'register' && !newId && (
                <motion.form key="register" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}} onSubmit={handleRegister} className="flex flex-col gap-5 text-center px-4">
                   <Database className="mx-auto text-blue-400 mb-2" size={32}/>
                   <h3 className="text-xl font-bold text-white mb-2">Create New Node</h3>
                   <p className="text-sm text-slate-400 mb-6 font-medium">This will instantly provision an anonymous JSON storage blob on the cloud. No email or password required. Your ID acts as your sole key.</p>
                   
                   <button type="submit" disabled={status==='loading'} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg py-4 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center gap-2">
                      {status==='loading' ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> : 'Provision Node'}
                   </button>
                   <button type="button" onClick={()=>setMode('login')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Back to Login</button>
                </motion.form>
             )}

             {mode === 'register' && newId && (
                <motion.div key="success" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="flex flex-col items-center text-center gap-4">
                   <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-2"><CheckCircle2 size={32}/></div>
                   <h3 className="text-2xl font-bold text-white">Node Provisioned</h3>
                   <p className="text-slate-400 text-sm">Write down your new Cloud ID. It is impossible to recover if lost.</p>
                   
                   <div className="w-full bg-slate-900 border border-slate-700 rounded-xl p-6 font-mono font-bold text-emerald-400 text-lg tracking-widest break-all select-all my-4 shadow-inner">
                      {newId}
                   </div>
                   
                   <button onClick={()=>{setCloudId(newId); setMode('login'); setNewId('');}} className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-slate-200 transition-colors">Proceed to Login</button>
                </motion.div>
             )}
           </AnimatePresence>

           {status !== 'idle' && !newId && (
             <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className={`mt-6 text-xs font-bold tracking-widest uppercase text-center ${status==='error'?'text-rose-500':'text-blue-400'}`}>
                {msg}
             </motion.div>
           )}
        </div>
      </div>
    </div>
  );
}

// Quick hack for CheckCircle2 icon missing locally
function CheckCircle2(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
}
