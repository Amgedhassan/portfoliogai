
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { DataService } from '../dataService';

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

  return (
    <div className="bg-white/5 backdrop-blur-2xl p-12 md:p-20 rounded-[4rem] border border-white/10 shadow-2xl relative overflow-hidden">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-32 text-center"
            role="alert"
          >
            <div className="w-24 h-24 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-12 border border-indigo-500/20">
               <CheckCircle className="w-12 h-12 text-indigo-400" />
            </div>
            <h3 className="text-4xl font-black mb-6 text-white uppercase tracking-tighter">Transmission Sent.</h3>
            <p className="text-slate-500 uppercase tracking-[0.5em] text-[10px] font-black">Average Response Window: 24h</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="space-y-16"
          >
            <div className="space-y-12">
              <div className="relative group">
                <label htmlFor="full-name" className="text-[10px] font-black text-slate-700 uppercase tracking-widest block mb-4">Design Inquiry From</label>
                <input
                  required
                  id="full-name"
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b border-white/10 py-6 focus:border-indigo-500 outline-none transition-all text-2xl font-bold text-white placeholder:text-slate-800 focus:ring-0"
                  placeholder="YOUR NAME / COMPANY"
                />
              </div>
              <div className="relative group">
                <label htmlFor="email-address" className="text-[10px] font-black text-slate-700 uppercase tracking-widest block mb-4">Contact Gateway</label>
                <input
                  required
                  id="email-address"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-b border-white/10 py-6 focus:border-indigo-500 outline-none transition-all text-2xl font-bold text-white placeholder:text-slate-800 focus:ring-0"
                  placeholder="EMAIL ADDRESS"
                />
              </div>
              <div className="relative group">
                <label htmlFor="project-brief" className="text-[10px] font-black text-slate-700 uppercase tracking-widest block mb-4">Brief Specification</label>
                <textarea
                  required
                  id="project-brief"
                  rows={3}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-transparent border-b border-white/10 py-6 focus:border-indigo-500 outline-none transition-all text-2xl font-bold resize-none text-white placeholder:text-slate-800 focus:ring-0"
                  placeholder="DESCRIBE THE PROBLEM SPACE..."
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="group w-full flex items-center justify-between gap-8 text-xs font-black uppercase tracking-[0.6em] text-white hover:text-indigo-400 disabled:opacity-50 transition-all p-2"
            >
              <span>{status === 'submitting' ? 'DISPATCHING SEQUENCE...' : 'INITIALIZE CONTACT'}</span>
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:border-indigo-500 group-hover:scale-110 transition-all duration-500">
                {status === 'submitting' ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
              </div>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      
      {/* Visual Decor */}
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
         <Sparkles className="w-24 h-24 text-white" />
      </div>
    </div>
  );
};

export default ContactForm;
