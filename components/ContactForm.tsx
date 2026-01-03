import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { DataService } from '../dataService.ts';

const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      await DataService.addMessage(formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setStatus('idle');
    }
  };

  const inputClasses = "w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-indigo-500/10 transition-all text-lg font-bold text-white placeholder:text-white/10";

  return (
    <div className="bg-slate-900/40 backdrop-blur-3xl p-12 md:p-16 rounded-[4rem] border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.4)] relative overflow-hidden">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-24 text-center"
            role="status"
          >
            <div className="w-24 h-24 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-10 border border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.1)]">
               <CheckCircle className="w-12 h-12 text-indigo-400" />
            </div>
            <h3 className="text-4xl font-black mb-4 text-white uppercase tracking-tighter">Transmission Sent.</h3>
            <p className="text-indigo-400/60 uppercase tracking-[0.5em] text-[10px] font-black">Dispatcher active: 24h Window</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="space-y-10"
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-indigo-400/70 uppercase tracking-[0.4em] block ml-2">Identity Protocol</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={inputClasses}
                  placeholder="NAME / ORGANIZATION"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-indigo-400/70 uppercase tracking-[0.4em] block ml-2">Communication Link</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={inputClasses}
                  placeholder="EMAIL@DOMAIN.COM"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-indigo-400/70 uppercase tracking-[0.4em] block ml-2">Objective Specification</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className={`${inputClasses} resize-none`}
                  placeholder="HOW CAN WE ACCELERATE YOUR PRODUCT?"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="group w-full bg-white text-black font-black py-7 rounded-3xl flex items-center justify-center gap-6 hover:bg-indigo-600 hover:text-white transition-all duration-500 shadow-2xl disabled:opacity-50"
            >
              <span className="text-[11px] uppercase tracking-[0.3em]">
                {status === 'submitting' ? 'COMMITTING DATA...' : 'INITIALIZE DISPATCH'}
              </span>
              {status === 'submitting' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      
      {/* Decorative Matrix Elements */}
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
         <Sparkles className="w-32 h-32 text-white" />
      </div>
    </div>
  );
};

export default ContactForm;