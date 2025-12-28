
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Experience } from '../types';

interface HorizontalTimelineProps {
  experiences: Experience[];
}

const TimelineItem: React.FC<{ exp: Experience; index: number }> = ({ exp, index }) => {
  return (
    <div className="relative h-screen w-[70vw] md:w-[50vw] flex-shrink-0 flex flex-col justify-center px-12 md:px-24 border-l border-white/5">
      {/* Year / Period background */}
      <div className="absolute top-1/4 left-10 opacity-5 pointer-events-none select-none">
        <span className="text-[15vw] font-black text-white leading-none whitespace-nowrap uppercase">
          {exp.period.split('–')[0]}
        </span>
      </div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-left"
      >
        <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">
          {exp.period}
        </span>
        <h3 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-8">
          {exp.role} <br/>
          <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>
            @ {exp.company}
          </span>
        </h3>
        
        <ul className="space-y-4 max-w-lg">
          {exp.description.map((item, i) => (
            <li key={i} className="flex gap-4 items-start">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">
                {item}
              </p>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({ experiences }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Precise Width Math:
  // Intro: 60vw
  // Items: N * 50vw
  // Outro: 40vw
  const introWidth = 60;
  const itemWidth = 50;
  const outroWidth = 40;
  const totalWidthVw = introWidth + (experiences.length * itemWidth) + outroWidth;
  const scrollDistanceVw = totalWidthVw - 100;

  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${scrollDistanceVw}vw`]);
  const smoothX = useSpring(x, { stiffness: 80, damping: 25, restDelta: 0.001 });

  // Dynamic Height based on content width
  const sectionHeight = `${100 + (scrollDistanceVw)}vh`;

  return (
    <section ref={targetRef} style={{ height: sectionHeight }} className="relative bg-[#050505]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* Section Header Overlay */}
        <div className="absolute top-20 left-12 md:left-24 z-20 pointer-events-none">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.8em]"
          >
            Professional Path
          </motion.h2>
        </div>

        {/* Timeline Track Line */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 z-0" />

        <motion.div 
          style={{ x: smoothX }} 
          className="flex items-center"
        >
          {/* Introductory Slide */}
          <div className="h-screen w-[60vw] flex-shrink-0 flex items-center justify-center px-12 md:px-24">
             <h2 className="text-7xl md:text-[10vw] font-black text-white tracking-tighter uppercase leading-none text-left">
               EXPER<br/>IENCE.
             </h2>
          </div>

          {experiences.map((exp, i) => (
            <TimelineItem 
              key={exp.id} 
              exp={exp} 
              index={i} 
            />
          ))}
          
          {/* Outro */}
          <div className="h-screen w-[40vw] flex-shrink-0 flex items-center justify-center">
             <div className="h-24 w-px bg-gradient-to-b from-indigo-500 to-transparent" />
          </div>
        </motion.div>

        {/* Bottom Navigation Progress */}
        <div className="absolute bottom-20 left-12 right-12 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-600">
          <span>{experiences[experiences.length - 1]?.period.split('–')[0] || '2021'}</span>
          <div className="flex-1 mx-12 h-px bg-white/5 relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-indigo-500 origin-left"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
          <span>PRESENT</span>
        </div>
      </div>
    </section>
  );
};

export default HorizontalTimeline;
