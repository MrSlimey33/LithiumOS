import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Mail, ArrowRight, Zap, Fingerprint, Lock, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate biometric/vault authentication
    setTimeout(() => {
      window.localStorage.setItem('LITHIUM_CLOUD_ID', 'dev_quantum_01');
      navigate('/station');
    }, 1500);
  };

  return (
    <div className="bg-q-void min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 spatial-mesh opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-lg relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="q-glass rounded-[2.5rem] p-12 border-white/10 shadow-2xl relative overflow-hidden"
        >
          {/* Internal Glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          
          <div className="text-center mb-12">
            <motion.div 
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center mx-auto mb-8 shadow-2xl glow-cyan"
            >
              <Shield size={40} className="text-white drop-shadow-lg" />
            </motion.div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-4 uppercase italic">Initialize Link</h1>
            <p className="text-q-text-secondary font-medium italic">Authenticate with the Lithium Cloud Vault.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-4">Neural Identity (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@nexus.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-cyan-500/30 focus:bg-white/10 transition-all placeholder:text-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-4">Access Key</label>
              <div className="relative group">
                <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-cyan-500/30 focus:bg-white/10 transition-all placeholder:text-white/10"
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-cyan-500 text-black font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-wait mt-8"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Synchronizing...
                </div>
              ) : (
                <>Establish Link <ArrowRight size={18} /></>
              )}
            </motion.button>
          </form>

          <div className="mt-12 flex items-center justify-center gap-6">
             <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                <Fingerprint size={16} /> Biometrics
             </button>
             <div className="w-px h-4 bg-white/10" />
             <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                <Lock size={16} /> Recover Key
             </button>
          </div>
        </motion.div>

        <div className="mt-12 flex justify-center gap-8 text-[10px] font-black uppercase tracking-[0.5em] text-white/10">
           <div className="flex items-center gap-2"><Globe size={12}/> Global Node</div>
           <div className="flex items-center gap-2"><Zap size={12}/> Quantum Encrypted</div>
        </div>
      </div>
    </div>
  );
}
