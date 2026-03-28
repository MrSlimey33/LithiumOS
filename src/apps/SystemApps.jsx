import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Cpu, Lock, Globe, FileText, Plus, Calculator, Terminal, Shield, Folder, Clock } from 'lucide-react';

export function TerminalApp({ playSound }) {
  const [log, setLog] = useState(["> Lithium OS Kernel loaded.", "> Run 'help' for commands.", "> Connecting to primary node... OK"]);
  const [inp, setInp] = useState('');
  const run = (e) => {
    if (e.key === 'Enter' && inp) {
      if(playSound) playSound('click', e);
      let res = `> ${inp}`;
      const cmd = inp.toLowerCase().trim();
      
      if(cmd === 'clear') setLog([]); 
      else if(cmd === 'help') setLog([...log, res, "Commands: clear, help, date, whoami, neofetch, sudo make me a sandwich, do a barrel roll, matrix"]);
      else if(cmd === 'date') setLog([...log, res, new Date().toString()]);
      else if(cmd === 'whoami') setLog([...log, res, "root@lithium"]);
      else if(cmd === 'neofetch') setLog([...log, res, "   .o+`\n  `ooo/\n `+oooo:\n`+oooooo:\n-+oooooo+:\n Lithium OS 4.0\n Kernel: Web Native\n UI: AeroComposite"]);
      else if(cmd === 'sudo make me a sandwich') setLog([...log, res, "What? Make it yourself."]);
      else if(cmd === 'matrix') {
         setLog([...log, res, "Wake up, Neo..."]);
         setTimeout(() => { document.body.style.filter = "invert(1) hue-rotate(180deg)"; setTimeout(()=>document.body.style.filter="", 5000); }, 1000);
      }
      else if(cmd === 'do a barrel roll') {
         setLog([...log, res, "Executing aileron roll..."]);
         document.body.style.transition = "transform 1s ease";
         document.body.style.transform = "rotate(360deg)";
         setTimeout(() => { document.body.style.transition = ""; document.body.style.transform = ""; }, 1000);
      }
      else { try { res += `\n< ${String(new Function('return ' + inp)())}`; } catch(err) { res += `\n< Err: Command not recognized or invalid JS.`; } setLog([...log, res]); }
      setInp('');
    }
  };
  return (
    <div className="w-full h-full bg-[#0d1117] text-[#58a6ff] font-mono text-[13px] p-5 flex flex-col relative overflow-hidden isolate">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
      <div className="flex-1 overflow-y-auto whitespace-pre-wrap flex flex-col justify-end space-y-2 mb-3 relative z-10 scrollbar-hide">
        {log.map((l,i) => <motion.div initial={{opacity:0, x:-5}} animate={{opacity:1, x:0}} key={i} className={l.startsWith('< Err') ? 'text-[#ff7b72]' : l.startsWith('<') ? 'text-[#3fb950]' : ''}>{l}</motion.div>)}
      </div>
      <div className="flex border-t border-[#30363d] pt-3 relative z-10"><span className="mr-3 text-[#3fb950] font-bold">root@station:~$</span><input autoFocus value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={run} className="flex-1 bg-transparent outline-none text-[#c9d1d9]" spellCheck="false" /></div>
    </div>
  );
}

export function NotesApp({ useVDisk }) {
  const [notes, setNotes] = useVDisk('notes_db', [{id:1, title:'Idea Log', text:'Welcome to Lithium Notes.\nAuto-saved to your local VDisk.'}]);
  const [sel, setSel] = useState(1);
  const cur = notes.find(n=>n.id===sel) || notes[0];
  const update = (t) => setNotes(notes.map(n=>n.id===sel ? {...n, text:t} : n));
  const mkNew = () => { const id=Date.now(); setNotes([...notes, {id, title:'Untitled', text:''}]); setSel(id); };
  return (
    <div className="w-full h-full bg-slate-50/50 backdrop-blur-md flex text-slate-800">
       <div className="w-64 bg-slate-100/50 border-r border-slate-200/50 flex flex-col backdrop-blur-xl shrink-0 h-full">
          <div className="p-5 flex justify-between items-center"><span className="font-bold text-slate-500 tracking-widest text-[10px] uppercase">All Notes</span><button onClick={mkNew} className="p-1.5 hover:bg-slate-200/80 rounded-lg text-slate-600 transition-colors shadow-sm bg-white/50"><Plus size={14}/></button></div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
             {notes.map(n=>(<div key={n.id} onClick={()=>setSel(n.id)} className={`p-3 rounded-xl cursor-pointer text-sm font-semibold truncate transition-all border ${sel===n.id?'bg-white border-slate-200 shadow-sm text-slate-900':'bg-transparent border-transparent hover:bg-white/40 text-slate-500 hover:text-slate-700'}`}>{n.title||'Untitled'}</div>))}
          </div>
       </div>
       <div className="flex-1 flex flex-col relative px-10 py-8 bg-white/60 h-full overflow-y-auto">
          <input value={cur?.title} onChange={e=>setNotes(notes.map(n=>n.id===sel?{...n,title:e.target.value}:n))} className="text-4xl font-bold tracking-tight text-slate-900 outline-none placeholder-slate-300 bg-transparent mb-8 transition-colors" placeholder="Note Title..." />
          <textarea value={cur?.text||''} onChange={e=>update(e.target.value)} className="flex-1 resize-none bg-transparent outline-none text-slate-700 text-lg leading-relaxed placeholder-slate-300 font-serif min-h-[500px]" placeholder="Start typing here..."/>
       </div>
    </div>
  );
}

export function CalculatorApp({ playSound }) {
  const [calc, setCalc] = useState('0');
  const press = (b,e) => { 
    if(playSound) playSound('click',e); 
    if(b==='C')setCalc('0'); 
    else if(b==='=')try{setCalc(String(new Function('return '+calc)()).slice(0,12))}catch{setCalc('ERR')} 
    else setCalc(calc==='0'||calc==='ERR'?b:calc.length<12?calc+b:calc); 
  };
  return (
    <div className="w-full h-full bg-slate-100/80 flex flex-col p-6 font-sans select-none backdrop-blur-xl">
      <div className="bg-white/80 backdrop-blur rounded-[2rem] mb-6 flex-1 flex flex-col justify-end p-8 text-right border border-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden flex-shrink-0 min-h-[140px]">
         <span className="text-6xl font-light text-slate-800 tracking-tighter break-all">{calc}</span>
      </div>
      <div className="grid grid-cols-4 gap-4 text-2xl font-medium h-72 shrink-0 border-t border-slate-200/50 pt-4">
         {['C','/','*','-','7','8','9','+','4','5','6','=','1','2','3','0'].map(b => (
           <button key={b} onClick={(e)=>press(b,e)} className={`rounded-[1.5rem] shadow-sm border active:scale-95 transition-all flex items-center justify-center ${b==='='?'row-span-2 bg-gradient-to-br from-orange-400 to-rose-500 text-white border-rose-500 shadow-rose-500/30 shadow-lg':b==='C'?'bg-slate-200/50 text-rose-500 border-slate-300/50 hover:bg-slate-200':b==='0'?'col-span-3 bg-white/90 border-white hover:bg-white':'bg-white/90 hover:bg-white text-slate-700 border-white'}`}>{b}</button>
         ))}
      </div>
    </div>
  );
}

export function SettingsApp({ ins, un, lock, REG, playSound }) {
  const [rickRoll, setRickRoll] = useState(false);
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
       const res = await fetch(`http://localhost:3001/api/sync`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email: id, password: pw, payload })
       });
       const data = await res.json();
       if (!data.success) throw new Error(data.error);
       if(playSound) playSound('click', null);
     } catch(e) {
       console.error(e); alert("Local Computer Sync Failed. Is the server running?");
     }
     setSyncing(false);
  };

  return (
    <div className="w-full h-full bg-slate-50/80 backdrop-blur-xl text-slate-800 p-8 overflow-y-auto font-sans relative">
      <h2 className="text-4xl font-bold mb-10 tracking-tight flex items-center gap-4 text-slate-900"><Settings className="text-slate-400" size={36}/> System Settings</h2>
      
      <div className="bg-white/90 backdrop-blur rounded-[2rem] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-white mb-10 flex items-center gap-8 relative overflow-hidden isolate" onDoubleClick={()=>setRickRoll(true)}>
         <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-100 rounded-full blur-[60px] -z-10 opacity-70" />
         <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-50 to-white flex items-center justify-center shrink-0 border border-cyan-100 shadow-md"><Cpu size={40} className="text-cyan-500"/></div>
         <div>
            <h3 className="font-bold text-3xl text-slate-900 mb-1">{rickRoll ? 'Never Gonna Give You Up' : 'Lithium Station'}</h3>
            <p className="text-slate-500 font-medium text-lg">Kernel OS 4.2.0 • AeroComposite Engine</p>
         </div>
         <div className="flex-1 flex justify-end">
            <button onClick={handleSync} disabled={syncing || !id} className="bg-sky-50 text-sky-600 px-6 py-3 rounded-xl font-bold border border-sky-100 hover:bg-sky-100 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm">
               {syncing ? <div className="w-4 h-4 rounded-full border-2 border-sky-600 border-t-transparent animate-spin"/> : <Globe size={18}/>}
               {id ? 'Push State to Cloud' : 'Lithium ID Required'}
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
         <div className="bg-white/70 backdrop-blur p-6 rounded-3xl border border-white shadow-sm flex flex-col gap-4">
            <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2"><Lock size={18} className="text-rose-500"/> Security</h4>
            <button onClick={(e)=>{if(playSound)playSound('click',e);lock()}} className="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold tracking-wide shadow-xl shadow-slate-900/10 hover:-translate-y-1 hover:shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">Lock Workstation</button>
            <button onClick={()=>{alert("Self destruct initiated... just kidding.")}} className="w-full bg-red-50 text-red-600 border border-red-200 rounded-2xl py-4 font-bold tracking-wide hover:bg-red-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2">Self Destruct</button>
         </div>
         <div className="bg-white/70 backdrop-blur p-6 rounded-3xl border border-white shadow-sm flex flex-col gap-4">
            <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2"><Globe size={18} className="text-blue-500"/> Network</h4>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100"><span className="font-semibold text-slate-600 text-sm">LithiumNet</span><span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">Connected</span></div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100"><span className="font-semibold text-slate-600 text-sm">Cloud ID</span><span className="text-xs font-mono font-bold text-sky-500 bg-sky-50 px-3 py-1 rounded-full truncate max-w-[120px]">{id || 'NONE'}</span></div>
         </div>
      </div>

      <div className="mb-4 text-xs font-bold tracking-widest text-slate-400 uppercase">Installed Modules</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ins.map(id => {
          if (REG[id]?.d !== 1) return null;
          const Ic = REG[id].ic;
          return (
          <div key={`set-${id}`} className="bg-white/80 backdrop-blur rounded-2xl p-5 flex justify-between items-center shadow-sm border border-white">
            <span className="font-semibold text-slate-800 text-base flex items-center gap-4"><div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${REG[id].c} ${REG[id].t} shadow-inner drop-shadow-sm`}><Ic size={20}/></div>{REG[id].n}</span>
            <button onClick={(e)=>{if(playSound)playSound('click',e); un(id)}} className="px-5 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 active:scale-95 transition-transform border border-rose-100">Delete</button>
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
    const arr=[]; 
    for(let i=0;i<window.localStorage.length;i++){ 
      if(window.localStorage.key(i).startsWith('LITHIUM_')) arr.push(window.localStorage.key(i)); 
    }
    setKeys(arr);
  }, []);

  return (
    <div className="w-full h-full bg-slate-50/90 text-slate-800 p-8 flex flex-col backdrop-blur-xl">
       <div className="mb-8 flex items-center gap-4">
         <div className="w-14 h-14 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center"><Shield size={28}/></div>
         <div>
           <h2 className="text-3xl font-bold tracking-tight text-slate-900">VDisk Vault</h2>
           <p className="text-slate-500 mt-1 font-medium">Local Sandboxed Storage Volumes</p>
         </div>
       </div>
       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {keys.length === 0 && <p className="col-span-4 text-slate-400 font-medium">No storage volumes found.</p>}
         {keys.map(k => {
           let s = 0; try { s = window.localStorage.getItem(k).length; } catch{}
           return (
           <div key={k} className="p-5 rounded-[1.5rem] border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 group">
             <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:text-red-500 transition-colors"><Folder size={20} /></div>
             <div className="flex flex-col">
               <span className="font-bold text-sm truncate text-slate-700" title={k.replace('LITHIUM_','')}>{k.replace('LITHIUM_','')}</span>
               <span className="text-xs text-slate-400 font-mono mt-1">{(s/1024).toFixed(2)} KB</span>
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
    <div className="w-full h-full bg-[#1c1c1e] flex flex-col items-center justify-center relative shadow-inner isolate">
       <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0c] to-transparent pointer-events-none" />
       <div className="w-72 h-72 rounded-full relative flex items-center justify-center bg-[#2c2c2e] border-[12px] border-[#121214] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_2px_10px_rgba(255,255,255,0.1)]">
         {/* Hour */}
         <div className="absolute w-2.5 h-20 bg-slate-200 rounded-full origin-bottom shadow-lg" style={{ transform: `translateY(-50%) rotate(${t.getHours()*30 + t.getMinutes()*0.5}deg)` }} />
         {/* Minute */}
         <div className="absolute w-1.5 h-28 bg-slate-300 rounded-full origin-bottom shadow-lg" style={{ transform: `translateY(-50%) rotate(${t.getMinutes()*6}deg)` }} />
         {/* Second */}
         <div className="absolute w-[2px] h-32 bg-orange-500 origin-bottom" style={{ transform: `translateY(-50%) rotate(${t.getSeconds()*6}deg)` }} />
         <div className="absolute w-4 h-4 bg-orange-500 rounded-full z-10 border-[3px] border-[#2c2c2e]"/>
         
         {[...Array(12)].map((_,i)=><div key={i} className="absolute w-1.5 h-4 bg-slate-500 rounded-full" style={{transform:`rotate(${i*30}deg) translateY(-120px)`}}/>)}
         {[...Array(60)].map((_,i)=> i%5 !== 0 && <div key={`s-${i}`} className="absolute w-0.5 h-2 bg-slate-700" style={{transform:`rotate(${i*6}deg) translateY(-125px)`}}/>)}
       </div>
       <div className="mt-12 text-white font-mono text-3xl font-light tracking-widest drop-shadow-md">{t.toLocaleTimeString()}</div>
    </div>
  );
}
