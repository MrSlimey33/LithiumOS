import React from 'react';
import { motion } from 'framer-motion';

export function Manifesto() {
  return (
    <div className="min-h-screen bg-[#050510] text-[#a5a5b5] font-serif selection:bg-purple-500/30 selection:text-white">
       <header className="py-32 text-center px-4 max-w-4xl mx-auto border-b border-[#151525]">
         <motion.h1 initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:1}} className="text-4xl md:text-7xl font-light tracking-widest mb-6 text-white uppercase italic">The Manifesto</motion.h1>
         <motion.div initial={{width:0}} animate={{width:'100%'}} transition={{duration:1.5, delay:0.5}} className="h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto max-w-xs mb-8"/>
         <p className="text-xl md:text-2xl font-light tracking-wide italic max-w-2xl mx-auto">"Why wait for the future when I can literally build it in an afternoon?"</p>
       </header>

       <article className="max-w-3xl mx-auto px-6 py-20 text-lg md:text-xl leading-relaxed space-y-12">
          <motion.p initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.8}}>
             The tech industry is bloated. Companies with trillion-dollar valuations and armies of elite engineers spend years arguing over the padding of a button. They hold endless standup meetings, write Jira tickets for breathing, and deploy code at the speed of a resting sloth.
          </motion.p>
          <motion.p initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.8}}>
             I'm 17 years old. I don't have Jira. I have a keyboard, an excessive amount of caffeine, and a terrifying amount of free time on weekends. 
          </motion.p>
          <motion.p initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.8}}>
             Lithium Tech wasn't born out of a startup incubator. It was born out of profound boredom. I looked at the sluggish operating systems dominating the market and thought: "I could probably write a better desktop environment in Javascript." So I did. 
          </motion.p>
          <motion.p initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.8}}>
             The Lithium OS is just the beginning. I'm building an overarching ecosystem. No legacy codebases. No corporate red tape. Just pure, unadulterated aesthetic engineering driven by a single developer trying to avoid doing homework.
          </motion.p>
          <motion.div initial={{opacity:0, scale:0.9}} whileInView={{opacity:1, scale:1}} viewport={{once:true}} transition={{duration:0.8}} className="text-center py-20">
             <h2 className="text-white text-3xl italic font-bold mb-4">You are witnessing the prologue.</h2>
             <button onClick={()=>{document.body.style.filter='invert(1) hue-rotate(90deg)'; setTimeout(()=>document.body.style.filter='', 3000)}} className="px-8 py-4 bg-purple-900/30 text-purple-300 rounded-full border border-purple-500/30 hover:bg-purple-900/50 transition-colors uppercase tracking-widest text-sm font-sans mt-10">Initiate Revolution</button>
          </motion.div>
       </article>
    </div>
  )
}

export default Manifesto;
