import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Music, Box as BoxIcon, Play, Camera, Image as ImageIcon, Mic, Palette, Eraser, Download, MicOff } from 'lucide-react';

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
    <div className="w-full h-full bg-slate-900 text-slate-200 p-8 flex flex-col font-mono select-none overflow-y-auto isolate relative">
       <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/10 to-transparent pointer-events-none" />
       <div className="flex justify-between items-center mb-8 relative z-10 border-b border-slate-800 pb-6">
          <div><h2 className="text-3xl font-bold text-white tracking-widest uppercase mb-1">Synthesia 4.0</h2><p className="text-emerald-400 text-sm font-medium">16-Step Audio Sequencer</p></div>
          <button onClick={()=>{setPlaying(!playing); if(audioCtx?.state==='suspended')audioCtx.resume();}} className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${playing?'bg-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.4)]':'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]'}`}>
             {playing ? <BoxIcon size={28} className="text-white"/> : <Play size={28} className="text-white ml-1"/>}
          </button>
       </div>
       <div className="flex-1 flex flex-col gap-3 relative z-10 w-full overflow-x-auto pb-4">
         <div className="min-w-[700px] flex flex-col gap-3 h-full justify-center">
         {grid.map((r,i)=>(
            <div key={i} className="flex gap-3">
               {r.map((v,j)=>(
                 <div key={j} onClick={()=>toggle(i,j)} className={`flex-1 aspect-[1.8/1] rounded-lg border transition-all duration-75 cursor-pointer flex items-center justify-center ${v?'bg-emerald-400 border-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.5)]':'bg-slate-800 border-slate-700 hover:bg-slate-700'} ${j===step&&playing?'ring-2 ring-white scale-[1.12] z-10 shadow-lg':''}`} />
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
    }).catch(e => console.error("Camera access denied or unavailable", e));
    return () => { if(stream) stream.getTracks().forEach(t => t.stop()); }
  }, []); // eslint-disable-line

  return (
    <div className="w-full h-full bg-black relative flex items-center justify-center overflow-hidden isolate">
       {!stream && <div className="text-white flex flex-col items-center opacity-50"><Camera size={48} className="mb-4"/><p>Requesting Camera Access...</p></div>}
       <video ref={videoRef} autoPlay playsInline muted className="absolute min-w-full min-h-full object-cover" />
       {stream && (
         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/50 backdrop-blur-xl p-4 rounded-full border border-white/20">
           <button className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"><ImageIcon size={18} className="text-white"/></button>
           <button className="w-16 h-16 rounded-full bg-white border-[4px] border-slate-300 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform" />
           <button className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors" onClick={()=>{stream.getVideoTracks().forEach(t=>t.enabled = !t.enabled)}}><Camera size={18} className="text-white"/></button>
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
    <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center relative p-8">
      <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-slate-200 p-10 flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Voice Memos</h2>
        <p className="text-slate-500 font-medium mb-12">Record high-fidelity local audio.</p>
        
        <div className="text-6xl font-light text-slate-900 font-mono tracking-tighter mb-10">{formatTime(time)}</div>
        
        {recording && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-100 rounded-full blur-[40px] -z-10 animate-pulse" />}

        <button onClick={()=>setRecording(!recording)} className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all border-4 bg-white hover:scale-105 active:scale-95 ${recording ? 'border-red-500' : 'border-slate-800'}`}>
          {recording ? <BoxIcon className="text-red-500" size={28}/> : <Mic className="text-slate-800" size={32}/>}
        </button>
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
    <div className="w-full h-full bg-slate-50 h-full flex flex-col p-6">
      <div className="mb-6 px-2"><h2 className="text-3xl font-bold text-slate-800 tracking-tight">Gallery</h2></div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-6">
        {imgs.map((src, i) => (
          <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-slate-200 hover:-translate-y-1 group relative">
             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center text-white font-bold tracking-widest text-sm">VIEW</div>
             <img src={`${src}?auto=format&fit=crop&q=80&w=400&h=400`} alt="gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CanvasApp() {
  const cRef = useRef(null); const ctxRef = useRef(null); const [md, setMd] = useState(false);
  const [color, setColor] = useState('#f43f5e');
  const [lineWidth, setLineWidth] = useState(4);
  
  useEffect(()=>{
    if(cRef.current){
      const c = cRef.current; 
      c.width = c.offsetWidth; 
      c.height = c.offsetHeight; 
      ctxRef.current = c.getContext('2d');
      ctxRef.current.lineCap = 'round';
      ctxRef.current.lineJoin = 'round';
      // Fill white bg
      ctxRef.current.fillStyle = '#ffffff';
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
    ctx.strokeStyle = color === 'erase' ? '#ffffff' : color;
    ctx.lineWidth = color === 'erase' ? 20 : lineWidth;
    ctx.lineTo(e.clientX - r.left, e.clientY - r.top); 
    ctx.stroke();
  };
  
  const end = () => setMd(false);

  return (
    <div className="w-full h-full bg-white flex flex-col relative select-none touch-none">
       <div className="h-16 border-b border-slate-200 flex items-center px-6 gap-4 bg-slate-50 shadow-sm z-10 shrink-0">
          <Palette className="text-slate-400 mr-2" />
          {['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#1e293b'].map(c=>(<div key={c} onClick={()=>setColor(c)} className={`w-8 h-8 rounded-full cursor-pointer shadow-sm transition-transform active:scale-95 ${color===c?'scale-110 ring-4 ring-offset-2 ring-blue-400':'border-2 border-transparent'}`} style={{background:c}}/>))}
          <div className="mx-2 w-px h-8 bg-slate-300" />
          <button onClick={()=>setColor('erase')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${color==='erase'?'bg-blue-100 text-blue-600':'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'}`}><Eraser size={20}/></button>
          <div className="flex-1" />
          <button onClick={()=>{ctxRef.current.fillStyle='#ffffff';ctxRef.current.fillRect(0,0,cRef.current.width,cRef.current.height)}} className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm active:bg-slate-100 transition-colors uppercase tracking-widest hidden sm:block">Clear</button>
       </div>
       <canvas ref={cRef} onMouseDown={start} onMouseUp={end} onMouseLeave={end} onMouseMove={draw} 
               onTouchStart={e=>{e.preventDefault();start(e.touches[0]);}} onTouchMove={e=>draw(e.touches[0])} onTouchEnd={end}
               className="flex-1 w-full bg-white cursor-crosshair touch-none" />
    </div>
  );
}
