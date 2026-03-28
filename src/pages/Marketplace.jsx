import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, AlertCircle, ShoppingCart } from 'lucide-react';

export function Marketplace() {
  const [modal, setModal] = useState(null);
  const id = window.localStorage.getItem('LITHIUM_CLOUD_ID');

  const apps = [
    { title: 'Lithium Crypto Miner', dev: 'xXx_hacker_17_xXx', rating: '⭐️⭐️⭐️⭐️⭐️', img: 'from-orange-500 to-red-500', desc: 'Silently burns your CPU to make me 0.0001 cents a day. Not a virus.' },
    { title: 'Homework Evader', dev: 'Lithium Core', rating: '⭐️⭐️⭐️⭐️', img: 'from-blue-500 to-cyan-400', desc: 'Automatically generates a believable excuse as to why your assignment file got corrupted.' },
    { title: 'Useless Box OS', dev: 'Bored_User', rating: '⭐️', img: 'from-slate-700 to-slate-900', desc: 'An app that literally just has a toggle button that turns itself off immediately.' },
    { title: 'AI Code Typer', dev: 'Lithium Labs', rating: '⭐️⭐️⭐️⭐️⭐️', img: 'from-emerald-400 to-teal-500', desc: 'Press any key on your keyboard to instantly write beautiful, functional React code. Mostly for impressing friends.' }
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
       <header className="bg-slate-900 text-white py-24 px-6 text-center shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-transparent pointer-events-none" />
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 relative z-10">Marketplace</h1>
          <p className="text-xl font-light text-slate-300 relative z-10 max-w-2xl mx-auto mb-10">Install custom apps directly to your Lithium Cloud ID. Warning: None of these are moderated.</p>
          <div className="max-w-xl mx-auto relative z-10">
             <input type="text" className="w-full bg-white/10 border border-white/20 rounded-full py-4 px-12 text-white outline-none focus:bg-white/20 transition-all font-medium text-lg placeholder-white/40" placeholder="Search for literal garbage..." />
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
          </div>
       </header>

       <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {apps.map((a, i) => (
             <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} transition={{delay: i * 0.1}} key={i} className="bg-white rounded-[2rem] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-200 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all cursor-pointer flex flex-col items-center text-center" onClick={()=>setModal(a)}>
                <div className={`w-32 h-32 rounded-[2rem] bg-gradient-to-br ${a.img} shadow-inner mb-6 flex items-center justify-center`}><Sparkles className="text-white/60" size={48} /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{a.title}</h3>
                <p className="text-sm font-medium text-slate-500 mb-4">{a.dev}</p>
                <div className="text-sm tracking-widest">{a.rating}</div>
             </motion.div>
          ))}
       </div>

       <AnimatePresence>
          {modal && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl relative text-center">
                   <div className={`w-32 h-32 mx-auto rounded-[2rem] bg-gradient-to-br ${modal.img} shadow-lg mb-6`} />
                   <h2 className="text-3xl font-bold text-slate-900 mb-2">{modal.title}</h2>
                   <p className="text-sm text-slate-500 font-bold mb-6 block border-b border-slate-100 pb-6 uppercase tracking-widest">By: {modal.dev}</p>
                   <p className="text-slate-600 leading-relaxed mb-8">{modal.desc}</p>
                   
                   {!id ? (
                      <div className="bg-orange-50 text-orange-600 p-4 rounded-xl flex items-center justify-center gap-3 font-bold mb-4">
                         <AlertCircle size={20}/> You must be logged in to sync this app.
                      </div>
                   ) : (
                      <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl flex items-center justify-center gap-3 font-bold mb-4">
                         App synced to cloud ID: {id.slice(0,6)}...
                      </div>
                   )}
                   
                   <div className="flex gap-4 w-full">
                      <button className="flex-1 bg-slate-100 text-slate-800 py-4 font-bold rounded-2xl hover:bg-slate-200" onClick={()=>setModal(null)}>Cancel</button>
                      <button className="flex-1 bg-blue-600 text-white py-4 font-bold rounded-2xl hover:bg-blue-500 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2" onClick={()=>{alert("Just kidding. This marketplace is completely fake. Go back to work."); setModal(null)}}><ShoppingCart size={18}/> Get</button>
                   </div>
                </motion.div>
             </div>
          )}
       </AnimatePresence>
    </div>
  )
}

export default Marketplace;
