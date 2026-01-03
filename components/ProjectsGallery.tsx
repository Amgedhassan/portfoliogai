
import React, { useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowLeft, LayoutGrid, Briefcase } from 'lucide-react';
// Corrected import: View is exported from types.ts
import { Project, View } from '../types.ts';

interface ProjectsGalleryProps {
  projects: Project[];
  onNavigate: (view: View) => void;
}

const ProjectsGallery: React.FC<ProjectsGalleryProps> = ({ projects, onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-transparent pt-32 pb-24 relative"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.header 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-32"
        >
          <button 
            onClick={() => onNavigate({ type: 'home' })}
            className="group flex items-center gap-2 text-indigo-500 font-black text-[10px] uppercase tracking-[0.4em] mb-12 hover:gap-4 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Return Home
          </button>
          <h1 className="text-7xl md:text-9xl font-black text-white mb-8 tracking-tighter leading-none">
            INDEX <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-400">ARCHIVE.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl leading-relaxed font-medium">
            An expansive library of enterprise workflows, data visualizations, and strategic product architecture.
          </p>
        </motion.header>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 gap-12"
        >
          {projects.map((project) => (
            <motion.div 
              key={project.id}
              variants={item}
              onClick={() => onNavigate({ type: 'project', data: project })}
              className="group cursor-pointer"
            >
              <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/5 mb-8 relative shadow-2xl">
                <motion.img 
                  layoutId={`project-image-${project.id}`}
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.4em]">{project.role}</span>
                  <div className="h-px w-8 bg-white/10"></div>
                </div>
                <motion.h3 
                  layoutId={`project-title-${project.id}`}
                  className="text-4xl font-black text-white group-hover:text-indigo-400 transition-colors leading-tight"
                >
                  {project.title}
                </motion.h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {projects.length === 0 && (
          <div className="text-center py-40 border border-white/5 rounded-3xl bg-white/5 backdrop-blur-sm">
            <LayoutGrid className="w-12 h-12 text-slate-800 mx-auto mb-6" />
            <p className="text-slate-500 uppercase tracking-widest text-xs font-black">Archive synchronization in progress...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectsGallery;
