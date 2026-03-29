import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, AlertTriangle } from 'lucide-react';

export default function Merch() {
  const [error, setError] = useState('');
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <header className="py-20 text-center px-4">
         <motion.h1 initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="text-5xl font-bold tracking-tighter mb-4 text-white">Lithium Drip</motion.h1>
         <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">Fund my college tuition by buying literal overpriced concept art.</p>
      </header>

      {error && (
         <div className="max-w-md mx-auto mb-10 bg-rose-500/20 text-rose-400 border border-rose-500/50 p-4 rounded-xl flex items-center gap-4 animate-bounce">
            <AlertTriangle />
            <span className="font-bold">{error}</span>
         </div>
      )}
      
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
         <div className="bg-slate-800 border border-slate-700 rounded-[2rem] p-6 text-center">
            <div className="w-full aspect-square bg-slate-700 rounded-[1.5rem] mb-6 flex items-center justify-center break-all p-4 text-white font-black text-6xl">LITHIUM WATER</div>
            <h3 className="text-2xl font-bold text-white mb-2">Lithium Water Bottle</h3>
            <p className="text-slate-400 mb-4">$5,000.00 USD</p>
            <p className="text-sm text-slate-500 mb-6 px-4">It's a plastic bottle. I wrote 'Lithium' on it with a Sharpie. Free shipping.</p>
            <button onClick={()=>setError("Credit card declined. It's a sign. Don't buy this.")} className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200">Add to Cart</button>
         </div>

         <div className="bg-slate-800 border border-slate-700 rounded-[2rem] p-6 text-center shadow-[0_0_40px_rgba(59,130,246,0.1)] border-blue-500/30">
            <div className="w-full aspect-square bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[1.5rem] mb-6 flex items-center justify-center text-white font-black text-4xl p-6">BLACK HOODIE</div>
            <h3 className="text-2xl font-bold text-white mb-2">The Founder Hoodie</h3>
            <p className="text-slate-400 mb-4">$499.99 USD</p>
            <p className="text-sm text-slate-500 mb-6 px-4">Mandatory uniform for 17-year-old tech tycoons. Very dark. Very moody. Overpriced.</p>
            <button onClick={()=>setError("Out of stock. Only I get to wear it.")} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-500/20">Add to Cart</button>
         </div>

         <div className="bg-slate-800 border border-slate-700 rounded-[2rem] p-6 text-center">
            <div className="w-full aspect-square bg-slate-100 rounded-[1.5rem] mb-6 flex items-center justify-center text-slate-900 font-black text-8xl">.</div>
            <h3 className="text-2xl font-bold text-white mb-2">Nothing</h3>
            <p className="text-slate-400 mb-4">$10,000.00 USD</p>
            <p className="text-sm text-slate-500 mb-6 px-4">Literally just donate to me. You receive absolutely nothing in return.</p>
            <button onClick={()=>setError("Stripe API threw an error: 'User attempting to send you too much money'.")} className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200">Buy Nothing</button>
         </div>
      </div>
    </div>
  )
}
