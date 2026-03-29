import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Box as BoxIcon, Play, Camera, Image as ImageIcon, Mic, Palette, Eraser, Download, MicOff, Zap, Sparkles, Activity } from 'lucide-react';

export function SynthesiaApp({ audioCtx, playSound }) {
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00]; 
  const [grid, setGrid] = useState(Array(6).fill().map(()=>Array(16).fill(false)));
  
  useEffect(()=>{
     let t;
     if (playing) { t = setInterval(()=>{ setStep(s=>(s+1)%16); }, 200); }
     return ()=>clearInterval(t);
  }, [playing]);

  useEffect(()=>{
     if (playing && audioCtx && audioCtx.state !== 'suspended') {
       grid.forEach((row, i) => {
         if(row[step]){
            const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.type='sine'; osc.frequency.value = notes[i];
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime+0.5);
            osc.start(); osc.stop(audioCtx.currentTime+0.5);
         }
       });
     }
  }, [step, playing, grid, audioCtx, notes]);

  const toggle = (r,c)=>{
    const ng=[...grid]; ng[r][c]=!ng[r][c]; setGrid(ng); 
    if(ng[r][c] && playSound) playSound('click',{});
  };
  
  return (
    <div className="w-full h-full bg-black/60 text-white p-10 flex flex-col font-mono select-none overflow-hidden isolate relative backdrop-blur-3xl">
       <div className="absolute inset-0 spatial-mesh opacity-10 pointer-events-none" />
       <div className="flex justify-between items-center mb-10 relative z-10 border-b border-white/10 pb-8">
          <div>
             <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Synthesia</h2>
             <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">16-Step Quantum Sequencer</p>
          </div>
          <button onClick={()=>{setPlaying(!playing); if(audioCtx?.state==='suspended')audioCtx.resume();}} className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all ${playing?'bg-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.4)]':'bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)]'}`}>
             {playing ? <BoxIcon size={32} className="text-white"/> : <Play size={32} className="text-white ml-1"/>}
          </button>
       </div>
       <div className="flex-1 flex flex-col gap-4 relative z-10 w-full overflow-x-auto pb-6 scrollbar-thin">
          <div className="min-w-[800px] flex flex-col gap-4 h-full justify-center">
          {grid.map((r,i)=>(
             <div key={i} className="flex gap-4">
                {r.map((v,j)=>(
                  <div key={j} onClick={()=>toggle(i,j)} className={`flex-1 aspect-[1.5/1] rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-center ${v?'bg-emerald-400 border-white/20 shadow-[0_0_20px_rgba(52,211,153,0.6)]':'bg-white/5 border-white/5 hover:bg-white/10'} ${j===step&&playing?'ring-2 ring-white scale-[1.05] z-10':''}`} />
                ))}
             </div>
          ))}
          </div>
       </div>
    </div>
  );
}

export function CameraApp() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(s => {
      setStream(s);
      if(videoRef.current) videoRef.current.srcObject = s;
    }).catch(e => console.error("Camera access denied", e));
    return () => { if(stream) stream.getTracks().forEach(t => t.stop()); }
  }, []); // eslint-disable-line

  return (
    <div className="w-full h-full bg-black relative flex items-center justify-center overflow-hidden isolate">
       {!stream && <div className="text-white flex flex-col items-center opacity-20"><Camera size={64} className="mb-4 animate-pulse"/><p className="font-black uppercase tracking-[0.4em] text-xs">Requesting Optical Link...</p></div>}
       <video ref={videoRef} autoPlay playsInline muted className="absolute min-w-full min-h-full object-cover opacity-80" />
       <div className="absolute inset-0 noise-overlay opacity-10 pointer-events-none" />
       {stream && (
         <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-10 bg-black/40 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
           <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"><ImageIcon size={20} className="text-white/60"/></button>
           <button className="w-20 h-20 rounded-full bg-white flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              <div className="w-16 h-16 rounded-full border-4 border-black/10" />
           </button>
           <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10" onClick={()=>{stream.getVideoTracks().forEach(t=>t.enabled = !t.enabled)}}><Mic size={20} className="text-white/60"/></button>
         </div>
       )}
    </div>
  );
}

export function MemosApp() {
  const [recording, setRecording] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let t;
    if(recording) { t = setInterval(()=>setTime(prev=>prev+1), 1000); }
    else { setTime(0); }
    return () => clearInterval(t);
  }, [recording]);

  const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <div className="w-full h-full bg-black/40 backdrop-blur-3xl flex flex-col items-center justify-center relative p-12 overflow-hidden">
      <div className="absolute inset-0 spatial-mesh opacity-10 pointer-events-none" />
      <div className="w-full max-w-sm q-glass rounded-[3rem] p-12 flex flex-col items-center text-center relative z-10 border-white/10 shadow-2xl">
        <div className="flex items-center gap-3 text-cyan-400 mb-4 font-black text-[10px] uppercase tracking-[0.4em]">
           <Activity size={16} /> Spectral Monitor
        </div>
        <h2 className="text-3xl font-black text-white mb-10 tracking-tighter italic">VOICE MEMO</h2>
        
        <div className="text-8xl font-black text-white tracking-widest leading-none mb-12 shimmer-text">{formatTime(time)}</div>
        
        <div className="relative">
           {recording && <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-rose-500 rounded-full blur-[40px] -z-10" />}
           <button onClick={()=>setRecording(!recording)} className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all border-4 ${recording ? 'bg-rose-500 border-white/20' : 'bg-white border-white/10 hover:scale-105 active:scale-95'}`}>
             {recording ? <BoxIcon className="text-white" size={32}/> : <Mic className="text-black" size={38}/>}
           </button>
        </div>
      </div>
    </div>
  )
}

export function PhotosApp() {
  const imgs = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853',
    'https://images.unsplash.com/photo-1614850715649-1d0106293cb1',
    'https://images.unsplash.com/photo-1542435503-9a4ae4f37f30',
    'https://images.unsplash.com/photo-1506744626753-1fa44df14dd4',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e'
  ];
  return (
    <div className="w-full h-full bg-black/40 backdrop-blur-3xl p-10 flex flex-col overflow-hidden">
      <div className="mb-10 flex justify-between items-end border-b border-white/10 pb-8">
         <div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Atmosphere</h2>
            <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.5em] mt-2">Visual Observation Node</p>
         </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto scrollbar-thin pr-2 pb-12">
        {imgs.map((src, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="aspect-square rounded-[2rem] overflow-hidden border border-white/5 hover:border-cyan-500/50 transition-all cursor-pointer group relative shadow-2xl"
          >
             <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center text-white font-black tracking-widest text-[10px] uppercase">Analyze Node</div>
             <img src={`${src}?auto=format&fit=crop&q=80&w=600&h=600`} alt="gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function CanvasApp() {
  const cRef = useRef(null); const ctxRef = useRef(null); const [md, setMd] = useState(false);
  const [color, setColor] = useState('#00d4ff');
  const [lineWidth, setLineWidth] = useState(6);
  
  useEffect(()=>{
    if(cRef.current){
      const c = cRef.current; 
      c.width = c.offsetWidth; 
      c.height = c.offsetHeight; 
      ctxRef.current = c.getContext('2d');
      ctxRef.current.lineCap = 'round';
      ctxRef.current.lineJoin = 'round';
      ctxRef.current.fillStyle = '#08090d';
      ctxRef.current.fillRect(0,0,c.width,c.height);
    }
  },[]);
  
  const start = (e) => {
    setMd(true);
    const ctx = ctxRef.current;
    if(!ctx) return;
    const r = cRef.current.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - r.left, e.clientY - r.top);
  };

  const draw = (e)=>{
    if(!md||!ctxRef.current)return; 
    const ctx = ctxRef.current; 
    const r = cRef.current.getBoundingClientRect(); 
    ctx.strokeStyle = color === 'erase' ? '#08090d' : color;
    ctx.lineWidth = color === 'erase' ? 40 : lineWidth;
    ctx.lineTo(e.clientX - r.left, e.clientY - r.top); 
    ctx.stroke();
  };
  
  const end = () => setMd(false);

  return (
    <div className="w-full h-full bg-q-void flex flex-col relative select-none touch-none">
       <div className="h-20 border-b border-white/10 flex items-center px-8 gap-6 bg-black/20 backdrop-blur-3xl z-10 shrink-0">
          <Palette className="text-white/20 mr-4" size={24} />
          {['#00d4ff', '#8b5cf6', '#f43f5e', '#10b981', '#ffffff'].map(c=>(<div key={c} onClick={()=>setColor(c)} className={`w-8 h-8 rounded-xl cursor-pointer shadow-2xl transition-all active:scale-95 ${color===c?'scale-125 ring-2 ring-white':'border border-white/10'}`} style={{background:c}}/>))}
          <div className="mx-4 w-px h-8 bg-white/10" />
          <button onClick={()=>setColor('erase')} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${color==='erase'?'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)]':'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'}`}><Eraser size={22}/></button>
          <div className="flex-1" />
          <button onClick={()=>{ctxRef.current.fillStyle='#08090d';ctxRef.current.fillRect(0,0,cRef.current.width,cRef.current.height)}} className="text-[10px] font-black text-white/60 hover:text-white px-8 py-3 bg-white/5 rounded-xl border border-white/5 shadow-2xl active:scale-95 transition-all uppercase tracking-[0.3em] italic">Purge Buffer</button>
       </div>
       <canvas ref={cRef} onMouseDown={start} onMouseUp={end} onMouseLeave={end} onMouseMove={draw} 
               onTouchStart={e=>{e.preventDefault();start(e.touches[0]);}} onTouchMove={e=>draw(e.touches[0])} onTouchEnd={end}
               className="flex-1 w-full bg-q-void cursor-crosshair touch-none" />
       <div className="absolute inset-0 pointer-events-none noise-overlay opacity-5" />
    </div>
  );
}
