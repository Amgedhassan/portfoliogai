
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue, useVelocity, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Plus, Sparkles, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '../types';

interface SophisticatedCarouselProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const CarouselItem: React.FC<{
  project: Project;
  index: number;
  scrollXProgress: MotionValue<number>;
  totalItems: number;
  onProjectClick: (p: Project) => void;
}> = ({ project, index, scrollXProgress, totalItems, onProjectClick }) => {
  // Safety check for totalItems
  const safeTotalItems = Math.max(2, totalItems);
  const center = index / (safeTotalItems - 1);
  const step = 1 / (safeTotalItems - 1);

  const rotateY = useTransform(scrollXProgress, [center - step, center, center + step], [35, 0, -35]);
  const z = useTransform(scrollXProgress, [center - step, center, center + step], [-300, 0, -300]);
  const opacity = useTransform(scrollXProgress, [center - step, center, center + step], [0.15, 1, 0.15]);
  const scale = useTransform(scrollXProgress, [center - step, center, center + step], [0.75, 1, 0.75]);
  const bgTextX = useTransform(scrollXProgress, [center - step, center, center + step], ["30%", "0%", "-30%"]);

  const smoothScale = useSpring(scale, { stiffness: 60, damping: 20 });
  const smoothZ = useSpring(z, { stiffness: 60, damping: 20 });

  return (
    <motion.div
      style={{ 
        rotateY, 
        z: smoothZ, 
        opacity,
        scale: smoothScale,
        perspective: "1500px"
      }}
      className="relative flex-shrink-0 w-[85vw] md:w-[65vw] h-[60vh] md:h-[70vh] flex items-center justify-center snap-center"
    >
      <motion.div 
        style={{ x: bgTextX }}
        className="absolute inset-0 pointer-events-none select-none z-0 flex items-center justify-center"
      >
        <h4 className="text-[25vw] font-black text-white/[0.02] uppercase leading-none whitespace-nowrap tracking-tighter">
          {project.title?.split(' ')[0] || 'WORK'}
        </h4>
      </motion.div>

      <motion.div 
        whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
        className="relative w-full h-full group cursor-pointer clickable"
        onClick={() => onProjectClick(project)}
      >
        <div className="relative w-full h-full rounded-[4rem] overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-[0_0_80px_rgba(0,0,0,0.4)] transition-all duration-700 group-hover:border-indigo-500/30">
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover opacity-30 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
          
          <div className="absolute top-12 left-12 md:top-16 md:left-16 flex items-center gap-4">
            <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] drop-shadow-lg">PRJ_0{index + 1}</span>
            <div className="h-px w-12 bg-white/20" />
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">{project.role}</span>
          </div>

          <div className="absolute bottom-12 left-12 right-12 md:bottom-16 md:left-16 md:right-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-md space-y-6">
              <div className="overflow-hidden">
                <h3 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.85] group-hover:translate-y-0 transition-transform duration-700">
                  {project.title?.split(' ')[0]} <br/>
                  <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>
                    {project.title?.split(' ').slice(1).join(' ')}
                  </span>
                </h3>
              </div>
              <p className="text-slate-300 text-sm md:text-base font-medium line-clamp-2 leading-relaxed max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                {project.description}
              </p>
            </div>

            <div className="flex items-center gap-8">
               <motion.div 
                 whileHover={{ rotate: 90 }}
                 className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:scale-110 transition-all duration-500"
               >
                  <Plus className="w-6 h-6 text-white" />
               </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SophisticatedCarousel: React.FC<SophisticatedCarouselProps> = ({ projects, onProjectClick }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [autoProgress, setAutoProgress] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const activeSlideRef = useRef(0);
  
  const { scrollXProgress } = useScroll({
    container: scrollContainerRef,
    axis: "x"
  });

  const scrollVelocity = useVelocity(scrollXProgress);
  const smoothProgress = useSpring(scrollXProgress, { stiffness: 40, damping: 20 });
  const totalItems = projects.length + 1;

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const denominator = Math.max(1, scrollWidth - clientWidth);
      const progress = scrollLeft / denominator;
      const idx = Math.min(totalItems - 1, Math.round(progress * (totalItems - 1)));
      setActiveSlide(idx);
      activeSlideRef.current = idx;
      
      if (Math.abs(scrollVelocity.get()) > 0.05) {
        setAutoProgress(0);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [totalItems, scrollVelocity]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setAutoProgress(prev => {
        const next = prev + 0.5;
        if (next >= 100) {
          handleNext();
          return 0;
        }
        return next;
      });
    }, 32);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleNext = () => {
    const nextIdx = (activeSlideRef.current + 1) % totalItems;
    scrollToIndex(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (activeSlideRef.current - 1 + totalItems) % totalItems;
    scrollToIndex(prevIdx);
  };

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const { scrollWidth, clientWidth } = scrollContainerRef.current;
    const denominator = Math.max(1, totalItems - 1);
    const targetScroll = (index / denominator) * (scrollWidth - clientWidth);
    
    const isLoopingBack = index === 0 && activeSlideRef.current === totalItems - 1;
    
    scrollContainerRef.current.scrollTo({ 
      left: targetScroll, 
      behavior: isLoopingBack ? 'auto' : 'smooth' 
    });

    if (isLoopingBack) {
      setTimeout(() => {
        setActiveSlide(0);
        activeSlideRef.current = 0;
      }, 50);
    }
  };

  return (
    <section 
      id="projects"
      className="relative h-screen bg-transparent flex flex-col justify-center overflow-hidden py-24"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="absolute top-16 left-16 md:left-24 z-30 flex items-center gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.8em] drop-shadow-md">Portfolio</span>
          <span className="text-white text-[9px] font-black uppercase tracking-widest opacity-40">Series_2025</span>
        </motion.div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex items-center overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex-shrink-0 w-[15vw] md:w-[25vw]" />

        {projects.map((project, i) => (
          <CarouselItem 
            key={project.id}
            project={project}
            index={i}
            scrollXProgress={smoothProgress}
            totalItems={totalItems}
            onProjectClick={onProjectClick}
          />
        ))}

        <div className="flex-shrink-0 w-[85vw] md:w-[65vw] h-screen flex items-center justify-center snap-center">
           <motion.div className="group flex flex-col items-center gap-12">
              <button
                onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative clickable"
              >
                <span className="text-[15vw] font-black text-white/5 group-hover:text-indigo-500/30 transition-all duration-1000 uppercase tracking-tighter leading-none block">
                  ARCHIVE.
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-6 text-indigo-400 group-hover:scale-125 transition-all duration-700">
                    <span className="text-[10px] font-black uppercase tracking-[1em] ml-4">System Entry</span>
                  </div>
                </div>
              </button>
           </motion.div>
        </div>

        <div className="flex-shrink-0 w-[15vw] md:w-[25vw]" />
      </div>

      <div className="absolute bottom-16 left-16 right-16 md:left-24 md:right-24 z-30 flex items-center gap-12">
        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={handlePrev} className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/5 flex items-center justify-center text-white/30 hover:text-white bg-white/5 backdrop-blur-xl transition-all clickable">
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          
          <button 
            onClick={() => setIsAutoPlaying(!isAutoPlaying)} 
            className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white group relative bg-white/5 border border-white/10 hover:border-white/20 transition-all clickable shadow-2xl"
            aria-label={isAutoPlaying ? "Pause Autoplay" : "Resume Autoplay"}
          >
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="46" 
                fill="none" 
                stroke="white" 
                strokeOpacity="0.05"
                strokeWidth="2.5" 
              />
              <motion.circle 
                cx="50" 
                cy="50" 
                r="46" 
                fill="none" 
                stroke="#818cf8" 
                strokeWidth="3" 
                strokeLinecap="round"
                strokeDasharray="289.02" 
                animate={{ strokeDashoffset: 289.02 - (289.02 * autoProgress) / 100 }}
                transition={{ duration: 0.1, ease: "linear" }}
                className="drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]"
              />
            </svg>

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {isAutoPlaying ? (
                  <motion.div key="pause" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                    <Pause className="w-5 h-5 md:w-6 md:h-6 fill-white" />
                  </motion.div>
                ) : (
                  <motion.div key="play" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                    <Play className="w-5 h-5 md:w-6 md:h-6 fill-white ml-0.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </button>

          <button onClick={handleNext} className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/5 flex items-center justify-center text-white/30 hover:text-white bg-white/5 backdrop-blur-xl transition-all clickable">
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>

        <div className="flex-1 h-px bg-white/10 relative">
          <motion.div style={{ scaleX: scrollXProgress }} className="absolute inset-0 bg-indigo-500 origin-left shadow-[0_0_32px_rgba(99,102,241,0.8)]" />
          <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
            {[...Array(totalItems)].map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full mt-[-3px] transition-all duration-700 ${activeSlide === i ? 'bg-indigo-400 scale-[2] shadow-[0_0_15px_rgba(129,140,248,0.8)]' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="flex flex-col items-end">
             <span className="text-white text-xl font-black tracking-tighter">0{activeSlide + 1}</span>
             <span className="text-white/40 text-[8px] font-black uppercase tracking-[0.5em] leading-none">Seq_ID</span>
          </div>
          <div className="hidden md:flex w-14 h-14 rounded-full border border-white/10 items-center justify-center bg-white/5 backdrop-blur-md">
            <ArrowUpRight className="w-6 h-6 text-white/40" />
          </div>
        </div>
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default SophisticatedCarousel;
