import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldAlert, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (password: string) => void;
  onCancel: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    await new Promise(r => setTimeout(r, 800));

    if (password === 'justAhly@1907') {
      onLogin(password);
    } else {
      setError(true);
      setIsAuthenticating(false);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl px-6" role="dialog" aria-modal="true">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`w-full max-w-md bg-slate-900/60 backdrop-blur-3xl rounded-[3rem] p-12 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden ${error ? 'shake' : ''}`}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
          {isAuthenticating && (
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-full h-full bg-indigo-500"
            />
          )}
        </div>

        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-white/5 border border-white/10 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
            {error ? <ShieldAlert className="w-10 h-10 text-red-500" /> : <Lock className="w-10 h-10" />}
          </div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">Kernel Access</h2>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Authorized Systems Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-indigo-400/50 uppercase tracking-[0.4em] text-center">Cipher Key</label>
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 outline-none focus:border-indigo-500/50 transition-all text-center text-4xl tracking-[0.4em] font-black text-white placeholder:text-white/5"
              placeholder="••••"
            />
          </div>

          <button 
            disabled={isAuthenticating}
            type="submit"
            className="w-full bg-indigo-600 text-white font-black py-6 rounded-2xl hover:bg-white hover:text-black transition-all duration-500 shadow-xl flex items-center justify-center gap-4 disabled:opacity-50"
          >
            <span className="text-[11px] uppercase tracking-[0.2em]">{isAuthenticating ? 'VERIFYING...' : 'INITIATE LINK'}</span>
            {!isAuthenticating && <ArrowRight className="w-5 h-5" />}
          </button>

          <button 
            type="button"
            onClick={onCancel}
            className="w-full text-slate-600 font-black text-[9px] uppercase tracking-widest hover:text-white transition-colors"
          >
            DISCONNECT_SESSION
          </button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 p-4 bg-red-500/10 text-red-400 rounded-xl flex items-center justify-center gap-3 border border-red-500/20"
            >
              <span className="text-[9px] font-black uppercase tracking-widest">Auth_Failure: Access Denied</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default Login;