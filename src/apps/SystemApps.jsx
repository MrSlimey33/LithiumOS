import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Cpu, Lock, Globe, FileText, Plus, Calculator, Terminal, Shield, Folder, Clock, Zap, Database, Activity, RefreshCw } from 'lucide-react';
import { encrypt } from '../lib/crypto';
import { getVault, saveVault } from '../lib/github_vault';

export function NotesApp({ useVDisk }) {
  const [notes, setNotes] = useVDisk('notes_db', [{ id: 1, title: 'Quantum Thoughts', text: 'Welcome to the v5.0 workspace.\nEverything here is local-first and high-fidelity.\n' }]);
  const [sel, setSel] = useState(1);
  const cur = notes.find(n => n.id === sel) || notes[0];
  const update = (t) => setNotes(notes.map(n => n.id === sel ? { ...n, text: t } : n));
  const mkNew = () => { const id = Date.now(); setNotes([...notes, { id, title: 'New Fragment', text: '' }]); setSel(id); };
  
  return (
    <div className="w-full h-full bg-black/60 flex text-white relative overflow-hidden">
      <div className="absolute inset-0 noise-overlay opacity-5 pointer-events-none" />
      <div className="w-72 bg-white/5 border-r border-white/10 flex flex-col backdrop-blur-3xl shrink-0 h-full">
        <div className="p-6 flex justify-between items-center">
          <span className="font-black text-white/40 tracking-[0.3em] text-[10px] uppercase">Fragments</span>
          <button onClick={mkNew} className="p-2 hover:bg-white/10 rounded-xl text-cyan-400 transition-all border border-white/5 active:scale-90 bg-white/5">
            <Plus size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
          {notes.map(n => (
            <div 
              key={n.id} 
              onClick={() => setSel(n.id)} 
              className={`p-4 rounded-2xl cursor-pointer text-sm font-bold truncate transition-all border ${sel === n.id ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_20px_rgba(0,212,255,0.3)] text-black' : 'bg-transparent border-transparent hover:bg-white/5 text-white/40 hover:text-white'}`}
            >
              {n.title || 'Untitled'}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col relative px-12 py-10 h-full overflow-y-auto scrollbar-thin">
        <input 
          value={cur?.title} 
          onChange={e => setNotes(notes.map(n => n.id === sel ? { ...n, title: e.target.value } : n))} 
          className="text-5xl font-black tracking-tighter text-white outline-none placeholder-white/10 bg-transparent mb-10 transition-colors italic" 
          placeholder="TITLE_" 
        />
        <textarea 
          value={cur?.text || ''} 
          onChange={e => update(e.target.value)} 
          className="flex-1 resize-none bg-transparent outline-none text-q-text-secondary text-xl leading-relaxed placeholder-white/10 font-medium min-h-[500px]" 
          placeholder="Enter logic fragments..." 
        />
      </div>
    </div>
  );
}

export function CalculatorApp({ playSound }) {
  const [calc, setCalc] = useState('0');
  const press = (b, e) => {
    if (playSound) playSound('click', e);
    if (b === 'C') setCalc('0');
    else if (b === '=') try { setCalc(String(new Function('return ' + calc)()).slice(0, 12)) } catch { setCalc('ERR') }
    else setCalc(calc === '0' || calc === 'ERR' ? b : calc.length < 12 ? calc + b : calc);
  };
  
  return (
    <div className="w-full h-full p-8 flex flex-col font-sans select-none bg-black/40 backdrop-blur-3xl">
      <div className="bg-white/5 rounded-[2.5rem] mb-8 flex-1 flex flex-col justify-end p-10 text-right border border-white/10 shadow-2xl overflow-hidden flex-shrink-0 min-h-[160px]">
        <span className="text-7xl font-black text-white tracking-tighter break-all">{calc}</span>
      </div>
      <div className="grid grid-cols-4 gap-4 h-80 shrink-0">
        {['C', '/', '*', '-', '7', '8', '9', '+', '4', '5', '6', '=', '1', '2', '3', '0'].map(b => (
          <button 
            key={b} 
            onClick={(e) => press(b, e)} 
            className={`rounded-[2rem] border active:scale-95 transition-all flex items-center justify-center font-black text-xl ${b === '=' ? 'row-span-2 bg-gradient-to-br from-cyan-500 to-violet-600 text-white border-white/20 shadow-[0_0_30px_rgba(0,212,255,0.3)]' : b === 'C' ? 'bg-white/5 text-rose-500 border-white/5 hover:bg-white/10' : b === '0' ? 'col-span-3 bg-white/5 border-white/5 hover:bg-white/10 text-white' : 'bg-white/5 hover:bg-white/10 text-white border-white/5'}`}
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SettingsApp({ ins, un, lock, REG, playSound }) {
  const [syncing, setSyncing] = useState(false);
  const id = window.localStorage.getItem('LITHIUM_CLOUD_ID');

  const handleSync = async () => {
     if(!id) return alert("No active Lithium Email found.");
     const pw = window.localStorage.getItem('LITHIUM_SECRET');
     setSyncing(true);
     try {
       const payload = {};
       for(let i=0; i<window.localStorage.length; i++){
          const k = window.localStorage.key(i);
          if(k.startsWith('LITHIUM_') && k !== 'LITHIUM_CLOUD_ID' && k !== 'LITHIUM_SECRET') {
             payload[k] = JSON.parse(window.localStorage.getItem(k));
          }
       }
       const encryptedPayload = await encrypt(payload, pw);
       const { data: vault, sha } = await getVault();
       const userIdx = vault.findIndex(u => u.email.toLowerCase() === id.toLowerCase());
       if (userIdx === -1) throw new Error("User not found in the Lithium vault.");
       vault[userIdx].payload = encryptedPayload;
       await saveVault(vault, sha);
       if(playSound) playSound('click', null);
       alert("Sync successful! Encrypted profile saved to your GitHub Repository.");
     } catch(e) {
       console.error(e); alert("Cloud Sync Failed: " + e.message);
     }
     setSyncing(false);
  };

  return (
    <div className="w-full h-full bg-black/40 backdrop-blur-3xl text-white p-10 overflow-y-auto scrollbar-thin font-sans relative">
      <div className="flex justify-between items-center mb-16">
        <div>
           <h2 className="text-4xl font-black tracking-tighter flex items-center gap-4 text-white uppercase italic">System Core</h2>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 mt-2">Lithium Runtime v5.0.0</p>
        </div>
        <button onClick={lock} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-rose-500 hover:bg-rose-500/10 transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-widest">
           <Lock size={16} /> Lock Workstation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2 q-glass rounded-[3rem] p-10 border-white/10 relative overflow-hidden group">
           <div className="absolute inset-0 spatial-mesh opacity-20 pointer-events-none" />
           <div className="flex items-center gap-10 relative z-10">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shrink-0 shadow-2xl group-hover:rotate-6 transition-transform">
                 <Cpu size={48} className="text-white" />
              </div>
              <div className="flex-1">
                 <h3 className="font-black text-3xl text-white mb-2 tracking-tighter">LITHIUM_STATION</h3>
                 <div className="flex gap-3">
                    <span className="text-[10px] font-black uppercase bg-white/10 px-3 py-1 rounded-full text-white/60">64-Bit Architecture</span>
                    <span className="text-[10px] font-black uppercase bg-cyan-500/20 px-3 py-1 rounded-full text-cyan-400">Stable Build</span>
                 </div>
              </div>
              <button onClick={handleSync} disabled={syncing || !id} className="bg-white text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all disabled:opacity-20 flex items-center gap-3">
                {syncing ? <RefreshCw className="animate-spin" size={16} /> : <Database size={16} />}
                {id ? 'Push State' : 'No ID'}
              </button>
           </div>
        </div>

        <div className="q-glass rounded-[3rem] p-10 border-white/10 flex flex-col justify-center gap-6">
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Status</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
           </div>
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Encryption</span>
              <span className="text-xs font-bold text-cyan-400">AES-256</span>
           </div>
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Cloud Sync</span>
              <span className="text-xs font-bold text-white/60 truncate max-w-[100px]">{id || 'OFFLINE'}</span>
           </div>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between">
         <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/20">Active Logic Modules</h3>
         <div className="h-px flex-1 mx-8 bg-white/5" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ins.map(id => {
          if (REG[id]?.d !== 1) return null;
          const a = REG[id]; const Ic = a.ic;
          return (
            <div key={`set-${id}`} className="q-glass rounded-[2rem] p-6 flex justify-between items-center border-white/5 hover:border-white/10 transition-all group">
              <div className="flex items-center gap-5">
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${a.c} shadow-2xl group-hover:scale-110 transition-transform`}><Ic size={24} className={a.t} /></div>
                 <div>
                    <div className="font-bold text-white text-sm">{a.n}</div>
                    <div className="text-[9px] font-black text-white/20 uppercase tracking-widest">Module OK</div>
                 </div>
              </div>
              <button onClick={(e) => { if (playSound) playSound('click', e); un(id) }} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"><Plus size={18} className="rotate-45" /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function VaultApp() {
  const [keys, setKeys] = useState([]);
  useEffect(() => {
    const arr = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      if (window.localStorage.key(i).startsWith('LITHIUM_')) arr.push(window.localStorage.key(i));
    }
    setKeys(arr);
  }, []);

  return (
    <div className="w-full h-full bg-black/40 text-white p-12 flex flex-col backdrop-blur-3xl overflow-y-auto scrollbar-thin">
      <div className="mb-16 flex items-center gap-8 border-b border-white/10 pb-12">
        <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-[2rem] flex items-center justify-center border border-rose-500/20 shadow-[0_0_40px_rgba(244,63,94,0.1)]"><Shield size={40} /></div>
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">Secure Vault</h2>
          <p className="text-white/40 font-black uppercase text-[10px] tracking-[0.4em] mt-2">VDisk Sandbox Management</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {keys.length === 0 && <p className="col-span-full py-20 text-center text-white/20 text-sm font-black uppercase tracking-widest italic">No data volumes detected.</p>}
        {keys.map(k => {
          let s = 0; try { s = window.localStorage.getItem(k).length; } catch { }
          return (
            <div key={k} className="p-6 rounded-[2.5rem] border border-white/5 bg-white/5 hover:bg-white/10 transition-all flex flex-col gap-6 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 group-hover:text-cyan-400 transition-all shadow-xl group-hover:scale-110"><Folder size={24} /></div>
              <div className="flex flex-col relative z-10">
                <span className="font-black text-xs truncate text-white uppercase tracking-wider mb-1" title={k.replace('LITHIUM_', '')}>{k.replace('LITHIUM_', '')}</span>
                <span className="text-[10px] text-cyan-500 font-mono font-black uppercase tracking-widest opacity-60">{(s / 1024).toFixed(2)} KB</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ClockApp() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
  
  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center relative overflow-hidden isolate">
      <div className="absolute inset-0 spatial-mesh opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/10 to-transparent pointer-events-none" />
      
      <div className="relative w-[500px] h-[500px] flex flex-col items-center justify-center">
         {/* Huge Glowing Time */}
         <motion.h1 
           key={t.toLocaleTimeString()}
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="text-[12rem] font-black text-white tracking-titer leading-none shimmer-text"
         >
           {t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
         </motion.h1>
         <div className="flex items-center gap-8 mt-4">
            <span className="text-4xl font-black text-white/20 uppercase tracking-[0.5em] italic">{t.toLocaleTimeString([], { second: '2-digit' })}</span>
            <div className="w-px h-12 bg-white/10" />
            <span className="text-xl font-black text-cyan-500 uppercase tracking-widest italic">{t.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</span>
         </div>
      </div>

       {/* Floating stats */}
       <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
          <span>Uptime: 99.9%</span>
          <span>Sync: Atom-Precise</span>
          <span>TZ: {Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
       </div>
    </div>
  );
}
