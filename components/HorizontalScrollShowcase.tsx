import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Project } from '../types.ts';

interface HorizontalScrollShowcaseProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const ProjectCard: React.FC<{ 
  project: Project; 
  index: number; 
  containerProgress: MotionValue<number>;
  onProjectClick: (p: Project) => void;
  totalProjects: number;
}> = ({ project, index, containerProgress, onProjectClick, totalProjects }) => {
  // We calculate where this item is in the 0-1 range of the total scroll
  const step = 1 / totalProjects;
  const itemStart = index * step;
  const itemEnd = (index + 1) * step;
  const itemCenter = itemStart + step / 2;

  // Cinematic Focus Effects based on container progress
  // Item is focused when containerProgress is near itemCenter
  const scale = useTransform(
    containerProgress,
    [itemCenter - step, itemCenter, itemCenter + step],
    [0.85, 1.1, 0.85]
  );
  
  const opacity = useTransform(
    containerProgress,
    [itemCenter - step, itemCenter, itemCenter + step],
    [0.4, 1, 0.4]
  );

  const blur = useTransform(
    containerProgress,
    [itemCenter - step, itemCenter, itemCenter + step],
    ['8px', '0px', '8px']
  );

  const textY = useTransform(
    containerProgress,
    [itemCenter - step, itemCenter, itemCenter + step],
    [40, 0, -40]
  );

  const springScale = useSpring(scale, { stiffness: 100, damping: 20 });

  return (
    <motion.div 
      style={{ scale: springScale, opacity }}
      className="relative h-[70vh] w-[85vw] md:w-[65vw] flex-shrink-0 flex items-center justify-center mx-[5vw]"
    >
      <div 
        className="relative w-full h-full group cursor-pointer"
        onClick={() => onProjectClick(project)}
      >
        {/* Background Index Number */}
        <div className="absolute -top-16 -left-12 opacity-5 pointer-events-none select-none z-0">
          <span className="text-[25vw] font-black text-white leading-none">0{index + 1}</span>
        </div>

        {/* Cinematic Image Frame */}
        <motion.div 
          style={{ filter: `blur(${blur.get()})` }}
          className="relative w-full h-full overflow-hidden rounded-[3rem] border border-white/10 bg-[#0a0a0a] shadow-2xl"
        >
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          
          {/* Glowing Border Overlay */}
          <div className="absolute inset-0 rounded-[3rem] border border-white/5 pointer-events-none" />
        </motion.div>

        {/* Content Overlay */}
        <motion.div 
          style={{ y: textY }}
          className="absolute inset-0 flex flex-col justify-end p-10 md:p-16 pointer-events-none z-20"
        >
          <div className="max-w-xl space-y-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.6em]">
                {project.role}
              </span>
            </div>
            
            <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.8] mb-4">
              {project.title}
            </h3>
            
            <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed max-w-sm">
              {project.description}
            </p>

            <div className="pt-6 flex items-center gap-6 group-hover:gap-8 transition-all">
               <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-indigo-500 group-hover:border-indigo-500 transition-all duration-500">
                  <ArrowUpRight className="w-6 h-6" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">VIEW CASE</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const HorizontalScrollShowcase: React.FC<HorizontalScrollShowcaseProps> = ({ projects, onProjectClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  const numItems = projects.length;
  // We add 1 to the denominator to allow the last item to be fully scrolled past/into center
  // itemWidthVw + marginVw
  const itemWidthTotalVw = 75; // 65vw width + 10vw total horizontal margin
  
  // Translation logic:
  // At progress 0, we want the first item centered.
  // At progress 1, we want the last item centered.
  const totalTrackWidthVw = numItems * itemWidthTotalVw;
  const xTranslate = useTransform(
    scrollYProgress, 
    [0, 1], 
    ["0vw", `-${totalTrackWidthVw - itemWidthTotalVw}vw`]
  );
  
  const smoothX = useSpring(xTranslate, { 
    stiffness: 50, 
    damping: 20, 
    mass: 0.5 
  });

  // Vertical Height of the section controls the speed of the horizontal scroll
  // More projects = more vertical space needed to keep it cinematic
  const sectionHeight = `${numItems * 100 + 100}vh`;

  return (
    <section 
      ref={scrollRef} 
      style={{ height: sectionHeight }} 
      className="relative bg-transparent"
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        
        {/* Header Label */}
        <div className="absolute top-12 left-12 md:left-24 z-30">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-px bg-indigo-500" />
            <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[1em]">Selected Works</span>
          </motion.div>
        </div>

        {/* Track Content */}
        <motion.div 
          style={{ x: smoothX }} 
          className="flex items-center px-[17.5vw]" // 17.5vw padding ensures the first card starts near center ( (100 - 65) / 2 )
        >
          {projects.map((project, i) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={i} 
              containerProgress={scrollYProgress}
              onProjectClick={onProjectClick}
              totalProjects={numItems}
            />
          ))}

          {/* Archive Link Slide */}
          <div className="h-screen w-[85vw] md:w-[65vw] flex-shrink-0 flex items-center justify-center mx-[5vw]">
             <motion.button
               whileHover={{ scale: 1.1, color: '#818cf8' }}
               onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
               className="text-[12vw] font-black tracking-tighter text-white opacity-10 hover:opacity-100 transition-all duration-1000 uppercase leading-none"
             >
               ARCHIVE.
             </motion.button>
          </div>
        </motion.div>

        {/* Bottom Progress UI */}
        <div className="absolute bottom-12 left-12 right-12 md:left-24 md:right-24 flex items-center justify-between gap-12 z-30">
           <div className="flex flex-col gap-1">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Navigation</span>
             <span className="text-xs font-bold text-white uppercase tracking-tighter">01 — 0{numItems}</span>
           </div>
           
           <div className="flex-1 h-px bg-white/10 relative overflow-hidden">
              <motion.div 
                style={{ scaleX: scrollYProgress }}
                className="absolute inset-0 bg-indigo-500 origin-left"
              />
           </div>

           <div className="hidden md:flex flex-col items-end gap-1">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Interaction</span>
             <span className="text-xs font-bold text-white uppercase tracking-tighter">Vertical Scroll</span>
           </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/5 blur-[150px] rounded-full opacity-50" />
        </div>
      </div>
    </section>
  );
};

export default HorizontalScrollShowcase;