
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Calendar, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { MentorshipSession } from '../types';

interface MentorshipDetailProps {
  onBack: () => void;
  sessions: MentorshipSession[];
}

const MentorshipDetail: React.FC<MentorshipDetailProps> = ({ onBack, sessions }) => {
  const [selectedSession, setSelectedSession] = useState(sessions[0] || null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!selectedSession && sessions.length > 0) {
    setSelectedSession(sessions[0]);
  }

  const revealVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] as const 
      } 
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#f8fafc] pt-32 pb-40">
      <div className="max-w-7xl mx-auto px-6">
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack} 
          className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em] mb-20 hover:gap-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg p-1"
        >
          <ArrowLeft className="w-4 h-4" /> Return Home
        </motion.button>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={revealVariants}
          className="max-w-4xl mb-32"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span className="text-[10px] font-black text-indigo-300 tracking-[0.3em] uppercase">Community & Coaching</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black mb-12 tracking-tighter leading-[0.85] text-white">
            GROW <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-300">TOGETHER.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl">
            I offer limited mentorship slots for designers looking to level up their craft, navigate enterprise complexity, and master product strategy.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 space-y-4">
            {sessions.map((session) => (
              <motion.button
                key={session.id}
                whileHover={{ x: 10 }}
                onClick={() => setSelectedSession(session)}
                className={`w-full text-left p-8 rounded-2xl border transition-all relative overflow-hidden group ${
                  selectedSession?.id === session.id 
                    ? 'bg-indigo-500/10 border-indigo-400/50 text-white' 
                    : 'bg-white/5 backdrop-blur-sm border-white/5 text-slate-500 hover:border-white/10'
                }`}
              >
                <div className="relative z-10">
                  <div className={`flex items-center gap-2 mb-4 font-black text-[10px] uppercase tracking-[0.3em] ${selectedSession?.id === session.id ? 'text-indigo-300' : 'text-slate-600'}`}>
                    <Clock className="w-3 h-3" />
                    {session.duration}
                  </div>
                  <h3 className={`text-xl font-black tracking-tight ${selectedSession?.id === session.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {session.title}
                  </h3>
                </div>
                {selectedSession?.id === session.id && (
                  <motion.div 
                    layoutId="active-pill" 
                    className="absolute left-0 top-0 w-1 h-full bg-indigo-400"
                  />
                )}
              </motion.button>
            ))}
          </div>

          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {selectedSession && (
                <motion.div
                  key={selectedSession.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                  className="bg-white/5 backdrop-blur-2xl p-10 md:p-20 rounded-[3rem] border border-white/5 shadow-2xl min-h-[600px] flex flex-col"
                >
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 border border-white/5">
                          <Calendar className="w-8 h-8" />
                        </div>
                        <div>
                          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">{selectedSession.title}</h2>
                          <div className="flex items-center gap-2 mt-2">
                             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                             <p className="text-indigo-300 font-black uppercase tracking-[0.2em] text-[10px]">Active Mentorship Window</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xl md:text-2xl text-slate-300 mb-16 leading-relaxed font-medium">
                      {selectedSession.description}
                    </p>
                    
                    <h4 className="font-black text-slate-500 mb-10 uppercase tracking-[0.4em] text-[10px]">Curriculum Highlights</h4>
                    <div className="grid md:grid-cols-2 gap-4 mb-16">
                      {selectedSession.topics.map(topic => (
                        <div key={topic} className="flex items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/5 group hover:border-indigo-400/30 transition-colors">
                          <span className="w-5 h-5 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                          </span>
                          <span className="font-bold text-slate-200 text-lg">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="text-center md:text-left">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Availability Status</p>
                      <div className="flex items-center justify-center md:justify-start gap-3">
                         <p className="text-2xl font-black text-white tracking-tighter">Slots Available</p>
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-black px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-400 hover:text-white transition-all shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-4 focus-visible:ring-offset-black flex items-center gap-4"
                    >
                      Secure Booking <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorshipDetail;
