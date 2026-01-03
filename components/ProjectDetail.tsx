import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ExternalLink, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { Project } from '../types.ts';
import { PERSONAL_INFO } from '../constants.tsx';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onNext?: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onNext }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isStudyAvailable = project.showCaseStudy !== false;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-transparent text-[#f8fafc]"
    >
      {/* Immersive Header */}
      <header className="relative h-[100vh] w-full overflow-hidden flex items-center px-8 md:px-16">
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 z-0"
        >
          <motion.img 
            layoutId={`project-image-${project.id}`}
            src={project.image} 
            alt="" 
            className="h-full w-full object-cover opacity-30"
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
        </motion.div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10 pt-32">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            onClick={onBack}
            className="flex items-center gap-4 text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em] mb-16 hover:gap-6 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg p-2 clickable"
          >
            <ArrowLeft className="w-5 h-5" /> Return to Index
          </motion.button>
          
          <div className="overflow-hidden">
            <motion.h1 
              layoutId={`project-title-${project.id}`}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[12vw] md:text-[10vw] font-black leading-[0.8] tracking-tighter mb-16 text-white uppercase"
            >
              {project.title}
            </motion.h1 >
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid md:grid-cols-4 gap-16 border-t border-white/10 pt-16"
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-4">Professional Role</p>
              <p className="text-xl font-bold text-white">{project.role}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-4">Core Toolbox</p>
              <p className="text-xl font-bold text-white">{project.tools.join(', ')}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-4">Delivery Cycle</p>
              <p className="text-xl font-bold text-white">{project.timeline}</p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Content Section with Standardized Spacing */}
      <div className="max-w-7xl mx-auto px-8 mt-[56pt] pb-[56pt]">
        <div className="grid lg:grid-cols-12 gap-24">
          <div className="lg:col-span-7 space-y-[56pt]">
            <motion.section 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-16"
            >
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.6em]">Design Context</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-white">Reimagining workflows for global scale.</h2>
              <p className="text-2xl md:text-3xl text-slate-300 font-medium leading-relaxed">
                {project.longDescription}
              </p>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-16"
            >
              <div className="flex items-center gap-6">
                 <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.6em]">Metrics & ROI</span>
                 <div className="flex-1 h-px bg-white/10" />
              </div>
              <div className="grid sm:grid-cols-2 gap-12">
                {project.outcomes?.map((outcome, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl p-12 rounded-[3rem] border border-white/5 hover:border-indigo-500/30 transition-all group clickable"
                  >
                    <p className="text-6xl font-black text-indigo-400 mb-6 group-hover:scale-110 transition-transform">{outcome.value}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6">{outcome.label}</p>
                    <p className="text-slate-400 font-medium text-lg leading-relaxed">{outcome.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>

          <aside className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="sticky top-40 space-y-12 bg-white/5 backdrop-blur-xl p-12 rounded-[4rem] border border-white/5 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-8">
                 <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-black tracking-tighter text-white uppercase">The Challenge.</h3>
              <p className="text-slate-400 font-medium leading-relaxed text-lg">
                {project.challenge}
              </p>
              <div className="h-px w-full bg-white/5" />
              
              <button 
                disabled={!isStudyAvailable}
                onClick={() => isStudyAvailable && window.open(project.behanceUrl || PERSONAL_INFO.behance, '_blank')}
                className={`w-full font-black py-8 rounded-full flex items-center justify-center gap-6 text-xs uppercase tracking-[0.2em] shadow-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isStudyAvailable 
                    ? 'bg-white text-black hover:bg-indigo-500 hover:text-white clickable' 
                    : 'bg-white/10 text-slate-500 opacity-50 cursor-not-allowed'
                }`}
              >
                {isStudyAvailable ? 'Launch Visual Case Study' : 'Case Study — Coming Soon'}
                {isStudyAvailable && <ExternalLink className="w-5 h-5" />}
              </button>
            </motion.div>
          </aside>
        </div>
      </div>

      {/* Navigation Footer */}
      {onNext && (
        <section 
          className="border-t border-white/5 pt-[56pt] pb-[56pt] px-8 group cursor-pointer overflow-hidden relative clickable bg-transparent" 
          onClick={onNext}
          onKeyDown={(e) => e.key === 'Enter' && onNext()}
          tabIndex={0}
          role="button"
          aria-label="Navigate to next project"
        >
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.8em]">Up Next</span>
            </motion.div>
            
            <h2 className="text-[12vw] font-black tracking-tighter mb-16 group-hover:text-indigo-400 transition-all duration-700 text-white leading-none uppercase">
              NEXT PROJECT
            </h2>
            
            <div className="flex justify-center items-center gap-12 group-hover:gap-24 transition-all duration-700">
              <div className="h-px w-24 bg-white/10 group-hover:w-48 transition-all duration-700"></div>
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                <ArrowRight className="w-8 h-8" />
              </div>
              <div className="h-px w-24 bg-white/10 group-hover:w-48 transition-all duration-700"></div>
            </div>
          </div>
          <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-all duration-1000" />
        </section>
      )}
    </motion.div>
  );
};

export default ProjectDetail;