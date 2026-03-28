import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Database, Terminal, Zap, ExternalLink, Plus, Trash2, Settings2, Type, Square, Layout, MousePointer2, ChevronRight, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NODE_TYPES = {
  TITLE: { n: 'Title', ic: Type, d: { text: 'New Title', color: '#ffffff', size: '3rem' } },
  TEXT: { n: 'Paragraph', ic: Type, d: { text: 'Add your description here...', color: '#94a3b8', size: '1rem' } },
  BUTTON: { n: 'Button', ic: MousePointer2, d: { text: 'Click Me', bg: '#3b82f6', color: '#ffffff', action: 'alert("Hello World!")' } },
  CARD: { n: 'Card', ic: Square, d: { bg: 'rgba(255,255,255,0.05)', radius: '1.5rem', border: 'rgba(255,255,255,0.1)' } },
  SPACER: { n: 'Spacer', ic: Layout, d: { height: '2rem' } }
};

export default function Developers() {
  const [appName, setAppName] = useState('');
  const [developer, setDeveloper] = useState('');
  const [icon, setIcon] = useState('Gamepad2');
  const [color, setColor] = useState('from-indigo-500 to-purple-600');
  const [description, setDescription] = useState('');

  // Designer State
  const [nodes, setNodes] = useState([
    { id: '1', type: 'TITLE', ...NODE_TYPES.TITLE.d },
    { id: '2', type: 'TEXT', ...NODE_TYPES.TEXT.d }
  ]);
  const [selectedId, setSelectedId] = useState(null);

  const addNode = (type) => {
    const newNode = {
      id: Math.random().toString(36).substr(2, 9),
      type: type,
      ...NODE_TYPES[type].d
    };
    setNodes([...nodes, newNode]);
    setSelectedId(newNode.id);
  };

  const updateNode = (id, data) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, ...data } : n));
  };

  const deleteNode = (id) => {
    setNodes(nodes.filter(n => n.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const moveNode = (id, dir) => {
    const idx = nodes.findIndex(n => n.id === id);
    if ((dir === -1 && idx === 0) || (dir === 1 && idx === nodes.length - 1)) return;
    const newNodes = [...nodes];
    const item = newNodes.splice(idx, 1)[0];
    newNodes.splice(idx + dir, 0, item);
    setNodes(newNodes);
  };

  const generateSourceCode = () => {
    let html = `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body { font-family: sans-serif; background: #0c0c0e; color: white; margin: 0; padding: 2rem; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }\n  .node-btn { padding: 0.8rem 2rem; border-radius: 99px; border: none; font-weight: bold; cursor: pointer; transition: transform 0.2s; }\n  .node-btn:active { scale: 0.95; }\n  .node-card { width: 100%; max-width: 500px; padding: 2rem; box-sizing: border-box; }\n</style>\n</head>\n<body>\n`;
    
    nodes.forEach(n => {
      switch (n.type) {
        case 'TITLE': html += `  <h1 style="color: ${n.color}; font-size: ${n.size}; margin: 0; text-align: center; font-weight: 800; letter-spacing: -2px;">${n.text}</h1>\n`; break;
        case 'TEXT': html += `  <p style="color: ${n.color}; font-size: ${n.size}; line-height: 1.6; text-align: center; max-width: 600px;">${n.text}</p>\n`; break;
        case 'BUTTON': html += `  <button class="node-btn" onclick='${n.action}' style="background: ${n.bg}; color: ${n.color};">${n.text}</button>\n`; break;
        case 'CARD': html += `  <div class="node-card" style="background: ${n.bg}; border: 1px solid ${n.border}; border-radius: ${n.radius};"></div>\n`; break;
        case 'SPACER': html += `  <div style="height: ${n.height};"></div>\n`; break;
      }
    });

    html += `</body>\n</html>`;
    return html;
  };

  const handlePublish = (e) => {
    e.preventDefault();
    const payload = {
      name: appName,
      developer: developer || 'Anonymous',
      icon: icon || 'AppWindow',
      color: color,
      code: generateSourceCode(),
      description: description
    };
    const issueTitle = encodeURIComponent(`App Submission: ${appName}`);
    const issueBody = encodeURIComponent(`### LithiumOS App Manifest\n\n\`\`\`json\n${JSON.stringify(payload, null, 2)}\n\`\`\`\n\n_Do not edit this block._`);
    window.open(`https://github.com/MrSlimey33/LithiumOS/issues/new?title=${issueTitle}&body=${issueBody}&labels=marketplace`, '_blank');
  };

  const selNode = nodes.find(n => n.id === selectedId);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col h-screen">
       {/* TOP NAV */}
       <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20"><Zap size={18} className="fill-white"/></div>
             <h1 className="text-sm font-black tracking-widest uppercase italic">Node Designer</h1>
             <div className="h-4 w-px bg-white/10 mx-2"/>
             <span className="text-xs font-bold text-slate-500">{appName || 'Untitled App'}</span>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={handlePublish} className="bg-white text-black px-5 py-2 rounded-full font-bold text-xs flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-xl">
                <Save size={14}/> Ship Module
             </button>
          </div>
       </header>

       <div className="flex-1 flex overflow-hidden">
          {/* TOOLBOX */}
          <div className="w-64 border-r border-white/5 p-6 flex flex-col gap-6 bg-black/20">
             <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Palette</h3>
                <div className="grid grid-cols-1 gap-2">
                   {Object.entries(NODE_TYPES).map(([key, type]) => (
                      <button key={key} onClick={() => addNode(key)} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group">
                         <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white"><type.ic size={16}/></div>
                         <span className="text-xs font-bold">{type.n}</span>
                         <Plus size={12} className="ml-auto opacity-0 group-hover:opacity-100"/>
                      </button>
                   ))}
                </div>
             </div>
             
             <div className="mt-auto space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                   <h4 className="text-[10px] font-bold text-indigo-400 mb-2 uppercase tracking-tight leading-none">Manifest Sync</h4>
                   <p className="text-[10px] font-medium text-slate-400 leading-normal">Node data is live-compiled into the manifest payload.</p>
                </div>
             </div>
          </div>

          {/* STAGE (CANVAS) */}
          <div className="flex-1 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.8] relative overflow-y-auto p-12 flex flex-col items-center">
             <div className="absolute inset-0 bg-[#050505] -z-10" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[120px] -z-10" />
             
             <div className="w-full max-w-2xl bg-[#0c0c0e] min-h-full rounded-[3rem] border border-white/5 shadow-2xl p-10 flex flex-col items-center gap-4 relative isolate">
                <div className="absolute top-4 inset-x-0 flex justify-center opacity-20"><div className="w-12 h-1 bg-white/20 rounded-full"/></div>
                
                {nodes.length === 0 && (
                   <div className="flex-1 flex flex-col items-center justify-center text-slate-600 italic gap-4">
                      <Layout size={48} className="opacity-20"/>
                      <p className="text-sm font-medium">Drag nodes onto the stage to build</p>
                   </div>
                )}

                <AnimatePresence>
                   {nodes.map((node, i) => (
                      <motion.div 
                        key={node.id} layout initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} 
                        onClick={(e) => {e.stopPropagation(); setSelectedId(node.id)}}
                        className={`w-full relative group cursor-pointer transition-all ${selectedId === node.id ? 'ring-2 ring-indigo-500/50 rounded-xl bg-indigo-500/5' : 'hover:bg-white/5 hover:rounded-xl ring-1 ring-white/0 hover:ring-white/10'}`}
                        style={{ padding: '0.5rem' }}
                      >
                         {/* Visual Representation */}
                         {node.type === 'TITLE' && <h1 style={{ color: node.color, fontSize: node.size }} className="text-center font-black tracking-tighter m-0">{node.text}</h1>}
                         {node.type === 'TEXT' && <p style={{ color: node.color, fontSize: node.size }} className="text-center leading-relaxed m-0 font-medium">{node.text}</p>}
                         {node.type === 'BUTTON' && <div className="flex justify-center"><button style={{ background: node.bg, color: node.color }} className="px-8 py-3 rounded-full font-black text-sm shadow-lg pointer-events-none">{node.text}</button></div>}
                         {node.type === 'CARD' && <div style={{ background: node.bg, borderRadius: node.radius, border: `1px solid ${node.border}` }} className="w-full h-32"/>}
                         {node.type === 'SPACER' && <div style={{ height: node.height }} className="w-full flex items-center justify-center text-[10px] text-slate-800 font-black tracking-widest uppercase">Spacer</div>}
                         
                         {/* Node Helper Controls */}
                         <div className={`absolute -right-12 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
                            <button onClick={(e) => {e.stopPropagation(); moveNode(node.id, -1)}} className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">↑</button>
                            <button onClick={(e) => {e.stopPropagation(); moveNode(node.id, 1)}} className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">↓</button>
                            <button onClick={(e) => {e.stopPropagation(); deleteNode(node.id)}} className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"><Trash2 size={12}/></button>
                         </div>
                      </motion.div>
                   ))}
                </AnimatePresence>
             </div>
          </div>

          {/* PROPERTIES SIDEBAR */}
          <div className="w-80 border-l border-white/5 p-8 flex flex-col gap-8 bg-black/20 overflow-y-auto">
             <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><Database size={12}/> App Meta</h3>
                <div className="space-y-4">
                   <div>
                      <label className="text-[9px] font-black uppercase text-slate-600 block mb-2">Display Name</label>
                      <input value={appName} onChange={e=>setAppName(e.target.value)} className="w-full bg-[#151518] border border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-500" placeholder="My App" />
                   </div>
                   <div>
                      <label className="text-[9px] font-black uppercase text-slate-600 block mb-2">Developer</label>
                      <input value={developer} onChange={e=>setDeveloper(e.target.value)} className="w-full bg-[#151518] border border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-500" placeholder="Your Name" />
                   </div>
                </div>
             </div>

             <AnimatePresence mode="wait">
                {selNode ? (
                   <motion.div initial={{x:20, opacity:0}} animate={{x:0, opacity:1}} exit={{x:20, opacity:0}} key={selNode.id} className="space-y-6">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2 border-t border-white/5 pt-6"><Settings2 size={12}/> {NODE_TYPES[selNode.type].n} Settings</h3>
                      
                      <div className="space-y-4">
                         {(selNode.text !== undefined) && (
                            <div>
                               <label className="text-[9px] font-black uppercase text-slate-600 block mb-2">Content Text</label>
                               <textarea value={selNode.text} onChange={e=>updateNode(selNode.id, {text: e.target.value})} className="w-full bg-[#151518] border border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-500 resize-none h-20" />
                            </div>
                         )}
                         {(selNode.color !== undefined) && (
                            <div>
                               <label className="text-[9px] font-black uppercase text-slate-600 block mb-2">Text Color</label>
                               <input type="color" value={selNode.color} onChange={e=>updateNode(selNode.id, {color: e.target.value})} className="w-full h-8 bg-transparent border-none outline-none cursor-pointer" />
                            </div>
                         )}
                         {(selNode.size !== undefined) && (
                            <div>
                               <label className="text-[9px] font-black uppercase text-slate-600 block mb-2">Text Size</label>
                               <input type="text" value={selNode.size} onChange={e=>updateNode(selNode.id, {size: e.target.value})} className="w-full bg-[#151518] border border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-500" />
                            </div>
                         )}
                         {(selNode.bg !== undefined) && (
                            <div>
                               <label className="text-[9px] font-black uppercase text-slate-600 block mb-2">Background Color</label>
                               <input type="color" value={selNode.bg} onChange={e=>updateNode(selNode.id, {bg: e.target.value})} className="w-full h-8 bg-transparent border-none outline-none cursor-pointer" />
                            </div>
                         )}
                         {(selNode.action !== undefined) && (
                            <div>
                               <label className="text-[9px] font-black uppercase text-slate-600 block mb-2">Click Action (JS)</label>
                               <input value={selNode.action} onChange={e=>updateNode(selNode.id, {action: e.target.value})} className="w-full bg-[#151518] border border-white/5 rounded-xl py-2 px-3 text-xs font-mono outline-none focus:border-indigo-500" />
                            </div>
                         )}
                         {(selNode.height !== undefined) && (
                            <div>
                               <label className="text-[9px] font-black uppercase text-slate-600 block mb-2">Spacer Height</label>
                               <input value={selNode.height} onChange={e=>updateNode(selNode.id, {height: e.target.value})} className="w-full bg-[#151518] border border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-500" />
                            </div>
                         )}
                      </div>
                   </motion.div>
                ) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-slate-600 text-center border-t border-white/5 pt-6 gap-4">
                      <MousePointer2 size={32} className="opacity-10"/>
                      <p className="text-[11px] font-medium leading-relaxed">Select a node on the stage to edit its properties.</p>
                   </div>
                )}
             </AnimatePresence>
          </div>
       </div>
    </div>
  );
}
