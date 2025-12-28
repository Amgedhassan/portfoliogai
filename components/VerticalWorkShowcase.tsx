
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowUpRight, Plus, ExternalLink } from 'lucide-react';
import { Project } from '../types';

interface VerticalWorkShowcaseProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const ProjectSection: React.FC<{ project: Project; index: number; onProjectClick: (p: Project) => void }> = ({ project, index, onProjectClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax mapping for different layers
  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["100px", "-100px"]);
  const ghostY = useTransform(scrollYProgress, [0, 1], ["-200px", "200px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <div 
      ref={containerRef} 
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-transparent py-20"
    >
      {/* Background Ghost Index */}
      <motion.div 
        style={{ y: ghostY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      >
        <span className="text-[40vw] font-black text-white/5 leading-none select-none tracking-tighter">
          0{index + 1}
        </span>
      </motion.div>

      <motion.div 
        style={{ scale: springScale, opacity }}
        className="relative w-full max-w-7xl px-6 grid lg:grid-cols-12 gap-12 items-center z-10"
      >
        {/* Project Image Frame */}
        <div className="lg:col-span-7 relative group cursor-pointer" onClick={() => onProjectClick(project)}>
          <div className="relative aspect-[16/10] md:aspect-[4/3] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a]">
            <motion.div 
              style={{ y: imageY, scale: 1.2 }}
              className="absolute inset-0"
            >
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
              />
            </motion.div>
            
            {/* Corner Decorative Elements */}
            <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100">
              <Plus className="w-6 h-6" />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-12 left-12">
               <div className="flex flex-wrap gap-2">
                 {project.tags.slice(0, 3).map(tag => (
                   <span key={tag} className="px-4 py-1.5 bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300">
                     {tag}
                   </span>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Content Side */}
        <motion.div 
          style={{ y: textY }}
          className="lg:col-span-5 space-y-8"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-indigo-500" />
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.8em]">Project Highlight</span>
            </div>
            
            <h3 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85]">
              {project.title.split(' ').map((word, i) => (
                <span key={i} className="block">
                  {word}{i === project.title.split(' ').length - 1 ? '.' : ''}
                </span>
              ))}
            </h3>
          </div>

          <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-sm">
            {project.description}
          </p>

          <button 
            onClick={() => onProjectClick(project)}
            className="group flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-indigo-400 transition-all"
          >
            Explore Case Study
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-indigo-500 group-hover:border-indigo-500 transition-all">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

const VerticalWorkShowcase: React.FC<VerticalWorkShowcaseProps> = ({ projects, onProjectClick }) => {
  return (
    <section id="projects" className="relative bg-[#050505] pt-40 pb-20">
      {/* Sidebar Navigation Context */}
      <div className="fixed left-12 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-6 items-center">
         <div className="h-20 w-px bg-white/10" />
         <span className="text-[10px] font-black text-slate-700 uppercase tracking-[1em] rotate-90 origin-center whitespace-nowrap mb-24">Archive</span>
         <div className="flex flex-col gap-3">
           {projects.map((_, i) => (
             <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-500/20" />
           ))}
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center"
        >
          <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[1em] mb-8">Selected Portfolio</span>
          <h2 className="text-7xl md:text-[10vw] font-black text-white tracking-tighter uppercase leading-[0.8]">
            WORKS<span className="text-indigo-500">_</span>
          </h2>
        </motion.div>
      </div>

      <div className="flex flex-col">
        {projects.map((project, i) => (
          <ProjectSection 
            key={project.id} 
            project={project} 
            index={i} 
            onProjectClick={onProjectClick} 
          />
        ))}
      </div>

      {/* Footer CTA */}
      <div className="py-60 flex flex-col items-center text-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <button 
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-[12vw] font-black tracking-tighter text-white opacity-20 hover:opacity-100 hover:text-indigo-400 transition-all duration-700 uppercase leading-none"
          >
            VIEW ALL.
          </button>
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
             <div className="w-px h-12 bg-indigo-500" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Philosophies</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VerticalWorkShowcase;
