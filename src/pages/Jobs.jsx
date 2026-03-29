import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Trash, Code, Briefcase, Frown, ShoppingBag } from 'lucide-react';

export function Jobs() {
  const [applied, setApplied] = useState(false);
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <header className="py-20 text-center px-4">
         <motion.h1 initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="text-5xl font-bold tracking-tighter mb-4 text-white">Careers at Lithium</motion.h1>
         <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">Work for a 17-year-old. Get paid in exposure. Maybe.</p>
      </header>
      
      <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 gap-6 pb-20">
         <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-[2rem] flex items-center justify-between group">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-fuchsia-500/20 text-fuchsia-400 rounded-2xl flex items-center justify-center group-hover:bg-fuchsia-500 group-hover:text-white transition-colors"><Code size={32}/></div>
               <div>
                  <h3 className="text-xl font-bold text-white">Senior Lead Prompt Engineer</h3>
                  <p className="text-slate-400 mt-1">Requirements: Copy-paste stack overflow into ChatGPT.</p>
               </div>
            </div>
            <button onClick={()=>setApplied(true)} className="px-6 py-3 bg-white text-slate-900 font-bold rounded-full hover:scale-105 active:scale-95 transition-transform">Apply ($0/hr)</button>
         </div>

         <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-[2rem] flex items-center justify-between group">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors"><Coffee size={32}/></div>
               <div>
                  <h3 className="text-xl font-bold text-white">Executive Coffee Fetcher</h3>
                  <p className="text-slate-400 mt-1">Requirements: I code late. Bring me espresso. Do not look me in the eye.</p>
               </div>
            </div>
            <button onClick={()=>setApplied(true)} className="px-6 py-3 bg-white text-slate-900 font-bold rounded-full hover:scale-105 active:scale-95 transition-transform">Apply ($0/hr)</button>
         </div>

         <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-[2rem] flex items-center justify-between group">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors"><Trash size={32}/></div>
               <div>
                  <h3 className="text-xl font-bold text-white">Vice President of Deleteing console.logs</h3>
                  <p className="text-slate-400 mt-1">Requirements: Can you type CMD+F? You're hired.</p>
               </div>
            </div>
            <button onClick={()=>setApplied(true)} className="px-6 py-3 bg-white text-slate-900 font-bold rounded-full hover:scale-105 active:scale-95 transition-transform">Apply ($0/hr)</button>
         </div>
      </div>
      
      {applied && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
           <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="bg-slate-800 border border-slate-600 p-10 rounded-[2.5rem] text-center max-w-sm">
              <Frown size={48} className="text-slate-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">Application Rejected</h2>
              <p className="text-slate-300 mb-8">You are over-qualified. Also, I don't actually have payroll set up.</p>
              <button onClick={()=>setApplied(false)} className="w-full bg-blue-600 py-4 rounded-xl text-white font-bold hover:bg-blue-500">Okay then</button>
           </motion.div>
        </div>
      )}

    </div>
  )
}

export default Jobs;
