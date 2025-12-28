
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
    
    // Artificial delay for "Authenticating" feel
    await new Promise(r => setTimeout(r, 800));

    if (password === 'amgad2025') {
      onLogin(password);
    } else {
      setError(true);
      setIsAuthenticating(false);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`w-full max-w-md bg-white rounded-[3rem] p-12 md:p-16 shadow-2xl transition-all duration-300 relative overflow-hidden ${error ? 'shake border-4 border-red-500/20' : 'border border-white/20'}`}
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-100 overflow-hidden">
          {isAuthenticating && (
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-full h-full bg-indigo-600"
            />
          )}
        </div>

        <div className="text-center mb-12">
          <motion.div 
            animate={error ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
            className="w-20 h-20 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-200"
          >
            {error ? <ShieldAlert className="w-10 h-10" /> : <Lock className="w-10 h-10" />}
          </motion.div>
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Secure Terminal</h2>
          <p className="text-slate-600 font-medium">Authorized personnel only. Access is monitored and logged.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 text-center">Credential Key</label>
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-8 py-6 outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-center text-3xl tracking-[0.5em] font-black text-slate-900"
              placeholder="••••"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isAuthenticating}
            type="submit"
            className="w-full bg-slate-900 text-white font-black py-6 rounded-2xl hover:bg-black transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {isAuthenticating ? (
              <span className="flex items-center gap-2">
                Authenticating...
              </span>
            ) : (
              <>
                Initialize Link
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </motion.button>

          <button 
            type="button"
            onClick={onCancel}
            className="w-full text-slate-500 font-black text-[10px] uppercase tracking-widest py-2 hover:text-slate-800 transition-colors"
          >
            Terminal Exit
          </button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 p-4 bg-red-50 text-red-600 rounded-xl flex items-center justify-center gap-3 border border-red-100"
            >
              <ShieldAlert className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">Authentication Failed</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default Login;
