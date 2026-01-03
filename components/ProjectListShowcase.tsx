import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Project } from '../types.ts';

interface ProjectListShowcaseProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const ProjectItem: React.FC<{ project: Project; index: number; onProjectClick: (p: Project) => void }> = ({ project, index, onProjectClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Parallax and Reveal Effects
  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <div ref={ref} className="relative min-h-screen flex items-center justify-center py-40 px-6">
      <motion.div 
        style={{ opacity }}
        className="w-full max-w-7xl grid lg:grid-cols-12 gap-12 items-center"
      >
        {/* Project Number & Title - Left side or Overlapping */}
        <div className="lg:col-span-5 relative z-10">
          <motion.div style={{ y: textY }}>
            <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.6em] mb-6 block">
              PROJECT — 0{index + 1}
            </span>
            <h3 
              className="text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter uppercase mb-8 cursor-pointer hover:text-indigo-300 transition-colors"
              onClick={() => onProjectClick(project)}
            >
              {project.title}
            </h3>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-md mb-12 leading-relaxed">
              {project.description}
            </p>
            <button 
              onClick={() => onProjectClick(project)}
              className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-300 hover:text-white transition-all"
            >
              DISCOVER CASE <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Project Image - Right side with Cinematic Parallax */}
        <div className="lg:col-span-7 relative">
          <motion.div 
            style={{ scale: springScale }}
            className="relative aspect-[4/5] md:aspect-[16/10] rounded-[2rem] overflow-hidden cursor-pointer bg-[#0a0a0a] border border-white/5 shadow-2xl"
            onClick={() => onProjectClick(project)}
          >
            <motion.img
              style={{ y: springY, scale: 1.2 }}
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700"
            />
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/60 to-transparent" />
          </motion.div>
          
          {/* Subtle floating tag */}
          <motion.div 
            style={{ y: useTransform(scrollYProgress, [0, 1], [20, -20]) }}
            className="absolute -bottom-6 -right-6 md:bottom-12 md:-right-12 bg-white text-black px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hidden md:block"
          >
            {project.role}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const ProjectListShowcase: React.FC<ProjectListShowcaseProps> = ({ projects, onProjectClick }) => {
  return (
    <section className="relative bg-[#050505] overflow-hidden">
      {/* Decorative vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2 hidden lg:block" />
      
      <div className="flex flex-col">
        {projects.map((project, i) => (
          <ProjectItem 
            key={project.id} 
            project={project} 
            index={i} 
            onProjectClick={onProjectClick} 
          />
        ))}
      </div>
      
      {/* View All CTA at the bottom of the list */}
      <div className="py-40 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-[12vw] font-black tracking-tighter text-white opacity-20 hover:opacity-100 transition-opacity uppercase leading-none"
        >
          View Archive
        </motion.button>
      </div>
    </section>
  );
};

export default ProjectListShowcase;