import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, ExternalLink, Sparkles, ArrowLeft, Home } from 'lucide-react';
import { PERSONAL_INFO } from '../constants.tsx';

interface ComingSoonProps {
  onRetry?: () => void;
  label?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ onRetry, label }) => {
  return (
    <div className="fixed inset-0 z-[1000] bg-[#020202] flex items-center justify-center p-8 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-4xl w-full relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-3 px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-12"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-[10px] font-black text-indigo-400 tracking-[0.4em] uppercase">
            {label ? `STAGING: ${label.toUpperCase()}` : "System Evolution"}
          </span>
        </motion.div>

        <div className="overflow-hidden mb-8">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-[12vw] md:text-[8vw] font-black text-white leading-none tracking-tighter uppercase"
          >
            COMING <br/>
            <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.1)' }}>SOON.</span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-16 leading-relaxed"
        >
          The {label || "architecture"} is currently being reconfigured. Amgad Hassan is refining new enterprise workflows and strategic methodologies. 
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12"
        >
          <a 
            href={`mailto:${PERSONAL_INFO.email}`}
            className="group flex items-center gap-4 bg-white text-black px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-2xl"
          >
            Direct Inquiry <Mail className="w-4 h-4" />
          </a>
          
          <div className="flex items-center gap-6">
            <a 
              href={PERSONAL_INFO.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition-colors p-2"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a 
              href={PERSONAL_INFO.behance} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition-colors p-2"
              aria-label="Behance"
            >
              <ExternalLink className="w-6 h-6" />
            </a>
          </div>
        </motion.div>

        {onRetry && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onRetry}
            className="bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4 mx-auto hover:bg-indigo-600 hover:text-white transition-all shadow-lg"
          >
            <Home className="w-4 h-4" />
            Return to Core Architecture
          </motion.button>
        )}
      </div>

      {/* Footer System Status */}
      <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end opacity-20">
        <div className="text-[10px] font-black uppercase tracking-widest text-white leading-loose">
          STATUS: BUFF_LOADING<br/>
          KERNEL_v5.0.1<br/>
          STABLE_IDLE
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">© 2025 AMGD_SYSTEMS</p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;