import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { Project } from '../types.ts';

interface FeaturedCarouselProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ projects, onProjectClick }) => {
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragX = useMotionValue(0);

  // Smooth out the drag movement for parallax effects
  const smoothDragX = useSpring(dragX, { stiffness: 300, damping: 30 });

  const nextSlide = () => {
    if (index < projects.length - 1) setIndex(index + 1);
    else setIndex(0); // Loop back for premium experience
  };

  const prevSlide = () => {
    if (index > 0) setIndex(index - 1);
    else setIndex(projects.length - 1);
  };

  const onDragEnd = () => {
    setIsDragging(false);
    const x = dragX.get();
    if (x <= -100) {
      nextSlide();
    } else if (x >= 100) {
      prevSlide();
    }
    dragX.set(0);
  };

  return (
    <div className="relative w-full overflow-hidden select-none py-20">
      <div className="max-w-[1440px] mx-auto">
        <div className="relative flex items-center justify-center min-h-[85vh]">
          
          {/* Main Carousel Track */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={onDragEnd}
            style={{ x: dragX }}
            className="flex items-center cursor-grab active:cursor-grabbing w-full"
          >
            {projects.map((project, i) => {
              const isActive = i === index;
              
              return (
                <motion.div
                  key={project.id}
                  initial={false}
                  animate={{
                    scale: isActive ? 1 : 0.9,
                    opacity: isActive ? 1 : 0.2,
                    x: `calc(${(i - index) * 100}% + ${(i - index) * 20}px)`,
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 150, 
                    damping: 25, 
                    mass: 0.8 
                  }}
                  className="absolute inset-0 flex items-center justify-center px-6 md:px-24"
                >
                  <div 
                    className="relative w-full max-w-6xl aspect-[16/10] md:aspect-[21/9] rounded-[3rem] overflow-hidden group border border-white/5 bg-[#0a0a0a] shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                    onClick={() => isActive && !isDragging && onProjectClick(project)}
                  >
                    {/* Ken Burns Effect Image */}
                    <motion.div
                      animate={{
                        scale: isActive ? [1, 1.1] : 1,
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear",
                      }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-60 transition-opacity duration-1000 group-hover:opacity-80"
                      />
                    </motion.div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />
                    
                    {/* Content Overlay with Staggered Mask Reveal */}
                    <AnimatePresence mode="wait">
                      {isActive && (
                        <div className="absolute inset-0 p-12 md:p-24 flex flex-col justify-end pointer-events-none">
                          <div className="max-w-3xl space-y-6">
                            
                            {/* Category Badge Reveal */}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                              className="flex items-center gap-3"
                            >
                              <div className="w-8 h-[1px] bg-indigo-500" />
                              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.6em]">
                                {project.role}
                              </span>
                            </motion.div>

                            {/* Title Mask Reveal */}
                            <div className="overflow-hidden">
                              <motion.h3
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                                className="text-5xl md:text-[7vw] font-black tracking-tighter text-white uppercase leading-[0.85]"
                              >
                                {project.title}
                              </motion.h3>
                            </div>

                            {/* Description Stagger */}
                            <motion.p
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.7, duration: 0.8 }}
                              className="text-slate-300 text-sm md:text-xl font-medium max-w-xl leading-relaxed"
                            >
                              {project.description}
                            </motion.p>
                            
                            {/* CTA Reveal */}
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.9 }}
                              className="pt-8 flex items-center gap-6"
                            >
                              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white">
                                EXPLORE DEPTH <ArrowRight className="w-5 h-5 text-indigo-400" />
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      )}
                    </AnimatePresence>

                    {/* Floating Index */}
                    <div className="absolute top-12 right-12 opacity-20 hidden md:block">
                       <span className="text-[10vw] font-black text-white leading-none tracking-tighter">0{i + 1}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Side Controls (Hidden on Mobile) */}
          <div className="absolute left-10 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
            <button 
              onClick={prevSlide}
              className="group w-20 h-20 rounded-full border border-white/5 flex items-center justify-center bg-black/20 backdrop-blur-sm text-white hover:bg-indigo-600 transition-all duration-500"
            >
              <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="absolute right-10 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
            <button 
              onClick={nextSlide}
              className="group w-20 h-20 rounded-full border border-white/5 flex items-center justify-center bg-black/20 backdrop-blur-sm text-white hover:bg-indigo-600 transition-all duration-500"
            >
              <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Global Progress Line & Counter */}
        <div className="max-w-6xl mx-auto px-6 mt-12 flex items-center gap-12">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
            0{index + 1} <span className="mx-2">/</span> 0{projects.length}
          </div>
          <div className="flex-1 h-px bg-white/5 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-indigo-500 origin-left"
              animate={{ width: `${((index + 1) / projects.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
               <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">Drag to Explore</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCarousel;