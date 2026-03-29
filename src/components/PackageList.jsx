import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, List, Music, Folder, FileText, HardDrive, Search, Trash2, Download, Image as ImageIcon, Box, Activity, Layers, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ===== MUSIC PLAYER APP =====
export function MusicApp({ playSound }) {
  const [playing, setPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  
  const tracks = [
    { title: "Silicon Dreams", artist: "Lithium Core", duration: "3:42" },
    { title: "Neural Drift", artist: "SoloDev", duration: "4:15" },
    { title: "Compiler Error", artist: "The Debuggers", duration: "2:58" }
  ];

  return (
    <div className="flex flex-col h-full bg-q-void text-white font-sans p-10 relative overflow-hidden backdrop-blur-3xl">
      <div className="absolute inset-0 spatial-mesh opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse-glow" />
      
      <div className="flex-1 flex flex-col items-center justify-center gap-12 relative z-10">
        <motion.div 
          animate={{ rotate: playing ? 360 : 0 }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-64 h-64 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-2xl relative group p-1"
        >
          <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity" />
          <div className="w-full h-full rounded-full bg-q-void flex items-center justify-center border-4 border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent" />
            <Music size={80} className="text-cyan-400 opacity-20 group-hover:opacity-40 transition-opacity" />
          </div>
          <div className="absolute w-6 h-6 bg-q-void rounded-full border-2 border-white/20 shadow-inner" />
        </motion.div>

        <div className="text-center">
          <motion.h2 key={currentTrack} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl font-black tracking-tighter shimmer-text italic uppercase">{tracks[currentTrack].title}</motion.h2>
          <p className="text-cyan-500 font-black tracking-[0.4em] uppercase text-[10px] mt-4 italic">{tracks[currentTrack].artist}</p>
        </div>

        <div className="w-full max-w-sm space-y-4">
           <div className="h-1.5 bg-white/5 rounded-full relative overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: playing ? "60%" : "40%" }} 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-violet-500 shadow-[0_0_15px_rgba(0,212,255,0.5)]" 
              />
           </div>
           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/20 italic">
              <span>01:24</span>
              <span>{tracks[currentTrack].duration}</span>
           </div>
        </div>

        <div className="flex items-center gap-12">
          <button className="text-white/20 hover:text-white transition-colors active:scale-90"><SkipBack size={28} /></button>
          <button 
            onClick={() => { setPlaying(!playing); if(playSound) playSound('click'); }}
            className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all border-4 border-white/10"
          >
            {playing ? <Pause size={32} fill="currentColor" /> : <Play size={32} className="translate-x-1" fill="currentColor" />}
          </button>
          <button className="text-white/20 hover:text-white transition-colors active:scale-90"><SkipForward size={28} /></button>
        </div>
      </div>

      <div className="mt-12 space-y-3 relative z-10">
         <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6 italic"><List size={14}/> Spectral Queue</div>
         {tracks.map((t, i) => (
            <div key={i} onClick={()=>setCurrentTrack(i)} className={`p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all border ${i === currentTrack ? 'bg-cyan-500 border-cyan-400 text-black shadow-2xl' : 'bg-white/5 border-white/5 hover:bg-white/10 text-white/40'}`}>
               <div className="flex items-center gap-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black ${i===currentTrack?'bg-black/10':'bg-white/5'}`}>{i+1}</div>
                  <div>
                     <div className="text-sm font-black uppercase tracking-tight">{t.title}</div>
                     <div className={`text-[9px] font-bold uppercase tracking-widest ${i===currentTrack?'text-black/60':'opacity-40'}`}>{t.artist}</div>
                  </div>
               </div>
               <span className="text-[10px] font-mono font-black opacity-40">{t.duration}</span>
            </div>
         ))}
      </div>
    </div>
  );
}

// ===== FILE EXPLORER APP =====
export function FileExplorerApp({ useVDisk }) {
  const [files] = useVDisk('files', [
    { name: 'Manifesto.txt', size: '2kb', type: 'text' },
    { name: 'Core_Logic.js', size: '14kb', type: 'code' },
    { name: 'Splash_Concept.png', size: '1.2mb', type: 'image' },
    { name: 'System_Logs.db', size: '450kb', type: 'data' }
  ]);
  const [search, setSearch] = useState('');

  return (
    <div className="flex flex-col h-full bg-q-void text-white font-sans overflow-hidden backdrop-blur-3xl relative">
       <div className="absolute inset-0 spatial-mesh opacity-5 pointer-events-none" />
       
       <div className="p-8 border-b border-white/10 flex items-center gap-6 bg-black/40 relative z-10">
          <div className="flex-1 relative group">
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
             <input 
               value={search} onChange={e=>setSearch(e.target.value)}
               className="w-full pl-12 pr-6 py-3 bg-white/5 rounded-2xl border border-white/5 text-sm font-bold text-white outline-none focus:border-cyan-500/30 transition-all placeholder-white/10" 
               placeholder="Index Query..."
             />
          </div>
          <button className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"><Download size={20}/></button>
       </div>

       <div className="flex-1 overflow-y-auto p-10 relative z-10 scrollbar-thin">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-16">
             <div className="q-glass-light p-8 rounded-[2.5rem] flex flex-col items-center gap-4 cursor-pointer hover:scale-105 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-2xl group-hover:rotate-6 transition-transform">
                   <HardDrive size={36} className="text-cyan-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">VDISK_ROOT</span>
             </div>
             {['Documents', 'Downloads', 'Code', 'Media'].map((folder, idx) => (
                <div key={folder} className="q-glass-light p-8 rounded-[2.5rem] flex flex-col items-center gap-4 cursor-pointer hover:scale-105 transition-all group">
                   <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 shadow-2xl group-hover:rotate-6 transition-transform`}>
                      <Folder size={36} className="text-white/20 group-hover:text-white/60 transition-colors" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-white/60 transition-colors">{folder}</span>
                </div>
             ))}
          </div>

          <div className="space-y-8">
             <div className="flex items-center gap-6 px-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10">Recent Spectral Nodes</h3>
                <div className="h-px flex-1 bg-white/5" />
             </div>
             <div className="space-y-2">
                {files.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).map((file, i) => (
                   <motion.div 
                     key={i} 
                     initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                     className="group p-5 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 flex items-center justify-between transition-all cursor-pointer relative overflow-hidden"
                   >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center gap-6 relative z-10">
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${file.type==='code'?'bg-indigo-500/10 text-indigo-400':file.type==='image'?'bg-rose-500/10 text-rose-400':'bg-white/5 text-white/20'}`}>
                            {file.type === 'image' ? <ImageIcon size={22}/> : file.type === 'code' ? <Layers size={22}/> : <FileText size={22}/>}
                         </div>
                         <div>
                            <div className="text-sm font-black uppercase tracking-tight text-white group-hover:text-cyan-400 transition-colors">{file.name}</div>
                            <div className="text-[9px] font-black text-white/20 flex items-center gap-3 uppercase tracking-widest mt-1">
                               <span>{file.size}</span>
                               <div className="w-1 h-1 rounded-full bg-white/10" />
                               <span>{file.type}</span>
                            </div>
                         </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity relative z-10">
                         <button className="p-2.5 bg-white/5 hover:bg-white hover:text-black rounded-xl text-white/40 transition-all active:scale-95"><ArrowUpRight size={18}/></button>
                         <button className="p-2.5 bg-white/5 hover:bg-rose-500 hover:text-white rounded-xl text-white/40 transition-all active:scale-95"><Trash2 size={18}/></button>
                      </div>
                   </motion.div>
                ))}
             </div>
          </div>
       </div>

       <div className="p-6 bg-black/60 border-t border-white/10 flex justify-between items-center relative z-10">
          <div className="flex gap-8">
             <div className="text-[10px] font-black text-white/20 uppercase tracking-widest"><span className="text-white">4</span> NODES_IN_BUFFER</div>
             <div className="text-[10px] font-black text-white/20 uppercase tracking-widest"><span className="text-cyan-400">12.4GB</span> ALLOCATED</div>
          </div>
          <div className="w-40 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
             <div className="h-full bg-cyan-500 w-[65%] shadow-[0_0_10px_rgba(0,212,255,0.4)]" />
          </div>
       </div>
    </div>
  );
}
