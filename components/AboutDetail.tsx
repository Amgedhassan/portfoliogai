
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Quote, Award, Target, Coffee } from 'lucide-react';
import { PortfolioData } from '../types';

interface AboutDetailProps {
  onBack: () => void;
  isEmbedded?: boolean;
  aboutData: PortfolioData['about'];
}

const AboutDetail: React.FC<AboutDetailProps> = ({ onBack, aboutData, isEmbedded = false }) => {
  useEffect(() => {
    if (!isEmbedded) window.scrollTo(0, 0);
  }, [isEmbedded]);

  const fadeUp = {
    initial: { opacity: 0, y: 48 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const }
  };

  return (
    <div className={`relative text-[#f8fafc] bg-transparent ${isEmbedded ? '' : 'min-h-screen pt-32 pb-48'}`}>
      <div className={`${isEmbedded ? '' : 'max-w-7xl mx-auto px-8'}`}>
        {!isEmbedded && (
          <motion.button 
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack} 
            className="flex items-center gap-4 text-slate-400 hover:text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em] transition-all mb-24 p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg clickable"
          >
            <ArrowLeft className="w-5 h-5" />
            Back Home
          </motion.button>
        )}

        <div className="grid lg:grid-cols-12 gap-32 items-start mb-64">
          <div className="lg:col-span-7">
            <motion.div {...fadeUp}>
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-12">
                <Sparkles className="w-4 h-4 text-indigo-300" />
                <span className="text-[10px] font-black text-indigo-300 tracking-[0.4em] uppercase">The Architect</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-black mb-16 tracking-tighter leading-[0.85] text-white uppercase">
                {aboutData.title.split(' ')[0]} <br/>
                <span className="text-indigo-400">{aboutData.title.split(' ').slice(1).join(' ')}.</span>
              </h1>
              <div className="space-y-12 text-2xl text-slate-300 font-medium leading-relaxed">
                <p className="text-white text-3xl font-bold italic leading-tight mb-16 border-l-4 border-indigo-500 pl-8">
                  "{aboutData.philosophy}"
                </p>
                <p>
                  {aboutData.summary}
                </p>
                <p>
                  With a background that values architectural precision and human empathy, I translate complex problems into simple, beautiful digital experiences.
                </p>
                <p>
                  I lead design initiatives where I focus on enterprise-scale platforms that power global operations. 
                </p>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5 space-y-16">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
               whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
               viewport={{ once: true }}
               className="aspect-[4/5] bg-slate-900/40 rounded-[4rem] overflow-hidden shadow-2xl relative group border border-white/5 backdrop-blur-xl"
             >
               <img 
                 src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" 
                 alt="Amgad Hassan professional background" 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] opacity-80" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent"></div>
               <div className="absolute bottom-12 left-12 text-white">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Base Operations</p>
                  <p className="text-3xl font-black tracking-tighter uppercase">Cairo, Egypt 🇪🇬</p>
               </div>
             </motion.div>
             
             <div className="grid grid-cols-2 gap-8">
                <motion.div {...fadeUp} className="bg-white/5 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/5 shadow-xl hover:border-indigo-500/30 transition-colors">
                  <Target className="w-10 h-10 text-indigo-400 mb-8" />
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Core Focus</h4>
                  <p className="text-white text-lg font-bold">Enterprise UX Systems</p>
                </motion.div>
                <motion.div {...fadeUp} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }} className="bg-white/5 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/5 shadow-xl hover:border-indigo-500/30 transition-colors">
                  <Coffee className="w-10 h-10 text-indigo-400 mb-8" />
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Community</h4>
                  <p className="text-white text-lg font-bold">ITI Instructor</p>
                </motion.div>
             </div>
          </div>
        </div>

        <motion.section 
          {...fadeUp}
          className="bg-slate-950/40 backdrop-blur-2xl rounded-[5rem] p-24 md:p-40 text-center text-white relative overflow-hidden shadow-2xl border border-white/5"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.25),transparent_75%)]"></div>
          </div>
          <Quote className="w-20 h-20 text-indigo-400 mx-auto mb-16 opacity-30" />
          <h2 className="text-5xl md:text-8xl font-black mb-16 leading-[0.9] tracking-tighter uppercase relative z-10">
            "Empathy is the core of efficiency. If we don't understand the user, we build obstacles, not tools."
          </h2>
          <div className="flex justify-center items-center gap-16 relative z-10">
             <div className="flex flex-col items-center gap-4">
               <Award className="w-12 h-12 text-indigo-400" />
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Impact Driven</p>
             </div>
             <div className="w-px h-16 bg-white/10" />
             <div className="flex flex-col items-center gap-4">
               <Award className="w-12 h-12 text-indigo-400" />
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Scalable Systems</p>
             </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutDetail;
