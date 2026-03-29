import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, List, Music, Folder, FileText, HardDrive, Search, Trash2, Download } from 'lucide-react';
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
    <div className="flex flex-col h-full bg-slate-900 text-white font-sans p-6">
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <motion.div 
          animate={{ rotate: playing ? 360 : 0 }} 
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl relative"
        >
          <div className="w-40 h-40 rounded-full bg-slate-900 flex items-center justify-center border-4 border-white/10">
            <Music size={60} className="text-blue-400 opacity-50" />
          </div>
          <div className="absolute w-4 h-4 bg-slate-900 rounded-full border-2 border-white/20" />
        </motion.div>

        <div className="text-center">
          <h2 className="text-2xl font-black tracking-tight">{tracks[currentTrack].title}</h2>
          <p className="text-blue-400 font-bold tracking-widest uppercase text-[10px] mt-1">{tracks[currentTrack].artist}</p>
        </div>

        <div className="w-full max-w-xs space-y-2">
           <div className="h-1 bg-white/10 rounded-full relative overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: playing ? "60%" : "40%" }} 
                className="absolute inset-y-0 left-0 bg-blue-500" 
              />
           </div>
           <div className="flex justify-between text-[10px] font-bold opacity-40">
              <span>1:24</span>
              <span>{tracks[currentTrack].duration}</span>
           </div>
        </div>

        <div className="flex items-center gap-8">
          <button className="text-white/60 hover:text-white"><SkipBack size={24} /></button>
          <button 
            onClick={() => { setPlaying(!playing); playSound('click'); }}
            className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            {playing ? <Pause size={28} fill="currentColor" /> : <Play size={28} className="translate-x-0.5" fill="currentColor" />}
          </button>
          <button className="text-white/60 hover:text-white"><SkipForward size={24} /></button>
        </div>
      </div>

      <div className="mt-8 space-y-2">
         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 mb-4"><List size={12}/> Up Next</div>
         {tracks.map((t, i) => (
            <div key={i} className={`p-3 rounded-xl flex items-center justify-between ${i === currentTrack ? 'bg-blue-500/20 border border-blue-500/30' : 'hover:bg-white/5'}`}>
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold">{i+1}</div>
                  <div>
                     <div className="text-sm font-bold">{t.title}</div>
                     <div className="text-[10px] opacity-40">{t.artist}</div>
                  </div>
               </div>
               <span className="text-[10px] opacity-40 font-mono">{t.duration}</span>
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
    <div className="flex flex-col h-full bg-white text-slate-900 font-sans">
       <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50">
          <div className="flex-1 relative">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               value={search} onChange={e=>setSearch(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" 
               placeholder="Search files..."
             />
          </div>
          <button className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center"><Download size={18}/></button>
       </div>

       <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
             <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center gap-2 cursor-pointer hover:bg-blue-100 transition-colors">
                <HardDrive size={32} className="text-blue-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">VDisk Root</span>
             </div>
             {['Documents', 'Downloads', 'Code', 'Media'].map(folder => (
                <div key={folder} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors">
                   <Folder size={32} className="text-slate-400" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{folder}</span>
                </div>
             ))}
          </div>

          <div className="mt-8">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-2">Recent Files</h3>
             <div className="space-y-1">
                {files.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).map((file, i) => (
                   <div key={i} className="group p-3 rounded-xl hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${file.type==='code'?'bg-indigo-50 text-indigo-500':file.type==='image'?'bg-rose-50 text-rose-500':'bg-slate-100 text-slate-500'}`}>
                            {file.type === 'image' ? <ImageIcon size={20}/> : <FileText size={20}/>}
                         </div>
                         <div>
                            <div className="text-sm font-bold text-slate-800">{file.name}</div>
                            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-2 uppercase tracking-tight">{file.size} • {file.type}</div>
                         </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                         <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-rose-500"><Trash2 size={16}/></button>
                         <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-500"><Download size={16}/></button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </div>

       <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <div className="flex gap-4">
             <div className="text-[10px] font-bold text-slate-400"><span className="text-slate-900">4</span> items</div>
             <div className="text-[10px] font-bold text-slate-400"><span className="text-slate-900">12.4mb</span> available</div>
          </div>
          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 w-[65%]" />
          </div>
       </div>
    </div>
  );
}
