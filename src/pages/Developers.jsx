import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Github, Terminal, Zap, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Developers() {
  const [appName, setAppName] = useState('');
  const [developer, setDeveloper] = useState('');
  const [icon, setIcon] = useState('Gamepad2');
  const [color, setColor] = useState('from-indigo-500 to-purple-600');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  const handlePublish = (e) => {
    e.preventDefault();
    
    // Create the JSON payload that will be stored in the GitHub Issue body
    const payload = {
      name: appName,
      developer: developer || 'Anonymous',
      icon: icon || 'AppWindow',
      color: color,
      url: url,
      description: description
    };

    const issueTitle = encodeURIComponent(`App Submission: ${appName}`);
    const issueBody = encodeURIComponent(
      `### LithiumOS App Manifest\n\n\`\`\`json\n${JSON.stringify(payload, null, 2)}\n\`\`\`\n\n_Do not edit this JSON block. It will be parsed automatically by the LithiumOS native Marketplace._`
    );
    const labels = encodeURIComponent('marketplace');
    
    // Open GitHub new issue template
    const githubPublishUrl = `https://github.com/MrSlimey33/LithiumOS/issues/new?title=${issueTitle}&body=${issueBody}&labels=${labels}`;
    window.open(githubPublishUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
       <header className="relative pt-32 pb-20 flex flex-col items-center text-center px-4 overflow-hidden isolate">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br from-indigo-600/20 to-blue-900/30 rounded-full blur-[100px] -z-10" />
         
         <motion.div initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}} className="mb-6 px-4 py-1.5 glass rounded-full text-indigo-400 font-bold text-xs tracking-widest uppercase">
            Lithium WebModules™
         </motion.div>

         <motion.h1 initial={{y:30, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:1, delay:0.2}} className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-white text-glow">Build The Future.</motion.h1>
         <motion.p initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:1, delay:0.4}} className="text-lg md:text-xl text-slate-400 max-w-2xl font-light mb-12 leading-relaxed">Publishing an app shouldn't require paying $99/year or waiting 3 weeks for an arbitrary review. With LithiumOS, you build it, you host it, you publish it instantly for free.</motion.p>
       </header>

       <section className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div className="space-y-10">
             <div className="glass-dark p-8 rounded-[2rem] border border-white/10">
                <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6"><Code2 size={24}/></div>
                <h3 className="text-2xl font-bold text-white mb-4">Zero-Code Publishing</h3>
                <p className="text-slate-400 leading-relaxed mb-6">Lithium applications are "WebModules" — glorified iframes perfectly sandboxed into the beautiful spatial window manager. You build your app using HTML/JS, host it on GitHub Pages, Vercel, or anywhere you like, and simply provide the URL here.</p>
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs text-blue-300">
                   <span className="text-slate-500">// Your App is literally just this:</span><br/>
                   &lt;iframe src="YOUR_URL" className="w-full h-full" /&gt;
                </div>
             </div>

             <div className="glass-dark p-8 rounded-[2rem] border border-white/10">
                <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6"><Github size={24}/></div>
                <h3 className="text-2xl font-bold text-white mb-4">The Free Database</h3>
                <p className="text-slate-400 leading-relaxed">Our marketplace runs entirely on GitHub Issues. When you submit the form, it generates a perfect JSON payload inside a GitHub issue. The LithiumOS Marketplace fetches these open issues and instantly displays them globally. Free, uncostly, and deeply rooted in open source.</p>
             </div>
          </div>

          <div className="glass-dark p-8 md:p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none"><Zap size={200}/></div>
             <h3 className="text-3xl font-bold text-white mb-2">Publish Interface</h3>
             <p className="text-slate-400 mb-8 text-sm">Fill out the manifest and ship it to the world instantly.</p>
             
             <form onSubmit={handlePublish} className="space-y-5 relative z-10">
                <div>
                   <label className="text-[10px] font-bold tracking-widest uppercase text-slate-500 block mb-2">Application Name</label>
                   <input required value={appName} onChange={e=>setAppName(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-600 outline-none focus:border-blue-500/50 transition-colors" placeholder="E.g. My Awesome Game" />
                </div>
                <div>
                   <label className="text-[10px] font-bold tracking-widest uppercase text-slate-500 block mb-2">Developer Name</label>
                   <input required value={developer} onChange={e=>setDeveloper(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-600 outline-none focus:border-blue-500/50 transition-colors" placeholder="xXx_hacker_17_xXx" />
                </div>
                <div>
                   <label className="text-[10px] font-bold tracking-widest uppercase text-slate-500 block mb-2">Hosted URL (Iframe Source)</label>
                   <input required type="url" value={url} onChange={e=>setUrl(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-600 outline-none focus:border-blue-500/50 transition-colors font-mono text-sm" placeholder="https://..." />
                </div>
                <div>
                   <label className="text-[10px] font-bold tracking-widest uppercase text-slate-500 block mb-2">Lucide Icon Name</label>
                   <input required value={icon} onChange={e=>setIcon(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-600 outline-none focus:border-blue-500/50 transition-colors" placeholder="E.g. Gamepad2, Browser, Cpu" />
                </div>
                <div>
                   <label className="text-[10px] font-bold tracking-widest uppercase text-slate-500 block mb-2">Tailwind Gradient Colors</label>
                   <input required value={color} onChange={e=>setColor(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-600 outline-none focus:border-blue-500/50 transition-colors font-mono text-sm" placeholder="from-red-500 to-orange-400" />
                </div>
                <div>
                   <label className="text-[10px] font-bold tracking-widest uppercase text-slate-500 block mb-2">Description</label>
                   <textarea required value={description} onChange={e=>setDescription(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-600 outline-none focus:border-blue-500/50 transition-colors resize-none h-24" placeholder="Be descriptive, but brief..."></textarea>
                </div>

                <div className="pt-4">
                   <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:bg-blue-500 active:scale-95 transition-all flex items-center justify-center gap-2">
                      <Terminal size={18} /> Generate Manifest & Publish <ExternalLink size={14} className="opacity-70 ml-1"/>
                   </button>
                </div>
             </form>
          </div>
       </section>
    </div>
  );
}
