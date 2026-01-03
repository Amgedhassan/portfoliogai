import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowUpRight, Sparkles, Target, Zap } from 'lucide-react';
import { MentorshipSession, View } from '../types.ts';

interface MentorshipSectionProps {
  sessions: MentorshipSession[];
  onNavigate: (view: View) => void;
}

const MentorshipSection: React.FC<MentorshipSectionProps> = ({ sessions, onNavigate }) => {
  return (
    <section id="mentorship" className="py-[56pt] bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-6"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[1em]">Strategic Growth</span>
            </motion.div>
            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85]">
              Architecting <br/> <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.4)' }}>Your Success.</span>
            </h2>
          </div>
          <button 
            onClick={() => onNavigate({ type: 'mentorship' })}
            className="group flex items-center gap-4 text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all mb-4"
          >
            Explore Programs <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {sessions.slice(0, 2).map((session, idx) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-white/5 backdrop-blur-xl p-12 rounded-[4rem] border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer shadow-2xl"
              onClick={() => onNavigate({ type: 'mentorship' })}
            >
              <div className="absolute top-12 right-12 opacity-10 group-hover:opacity-20 transition-opacity">
                {idx === 0 ? <Target className="w-24 h-24 text-white" /> : <Zap className="w-24 h-24 text-white" />}
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <Clock className="w-6 h-6" />
                  </div>
                  <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest">{session.duration} Mastery</span>
                </div>

                <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
                  {session.title}
                </h3>
                
                <p className="text-slate-400 text-lg font-medium leading-relaxed mb-12 max-w-sm line-clamp-2">
                  {session.description}
                </p>

                <div className="flex items-center justify-between pt-8 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Starting at</span>
                    <span className="text-3xl font-black text-white">${session.price}</span>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-500">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom decorative text */}
        <div className="mt-24 text-center">
           <p className="text-[9px] font-black text-slate-800 uppercase tracking-[1em]">Limited Windows Available per Quarter</p>
        </div>
      </div>
    </section>
  );
};

export default MentorshipSection;