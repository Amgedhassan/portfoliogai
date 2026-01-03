import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Shield, Cpu, Zap, Terminal } from 'lucide-react';
import { Experience } from '../types.ts';

interface VerticalTimelineProps {
  experiences: Experience[];
}

const ExperienceNode: React.FC<{ exp: Experience; index: number; total: number }> = ({ exp, index, total }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: nodeRef,
    offset: ["start end", "center center", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.8, 1, 1, 0.8]);
  const rotateX = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [25, 0, 0, -25]);
  const yOffset = useTransform(scrollYProgress, [0, 1], [150, -150]);
  
  const bgYearX = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const bgYearOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.04, 0]);

  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });
  const smoothRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 });

  return (
    <div 
      id={`exp-node-${index}`}
      ref={nodeRef} 
      className="relative min-h-screen flex items-center justify-center py-32 overflow-hidden"
    >
      <motion.div 
        style={{ x: bgYearX, opacity: bgYearOpacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
      >
        <span className="text-[35vw] font-black text-white leading-none uppercase tracking-tighter">
          {exp.period.split('–')[0]}
        </span>
      </motion.div>

      <motion.div
        style={{ 
          opacity, 
          scale: smoothScale, 
          rotateX: smoothRotateX,
          y: yOffset,
          perspective: "1200px"
        }}
        className="relative z-10 w-full max-w-6xl px-6 grid md:grid-cols-12 gap-16 items-center"
      >
        <div className="hidden md:flex md:col-span-2 flex-col items-center justify-center h-full relative">
           <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-indigo-500/40 to-transparent" />
           <motion.div 
              style={{ scale: useTransform(scrollYProgress, [0.4, 0.5, 0.6], [1, 1.4, 1]) }}
              className="w-16 h-16 rounded-2xl bg-[#0a0a0a] border border-indigo-500/50 flex items-center justify-center text-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.3)] relative z-10"
           >
              {index === 0 ? <Cpu className="w-8 h-8" /> : <Shield className="w-8 h-8" />}
           </motion.div>
           <div className="mt-8 flex flex-col items-center gap-2">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Entry_{index + 1}</span>
              <div className="h-8 w-px bg-indigo-500/20" />
           </div>
        </div>

        <div className="md:col-span-10 space-y-12">
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
              <div className="px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                <span className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.4em]">{exp.period}</span>
              </div>
              <div className="h-px w-12 bg-white/10" />
            </motion.div>
            <h3 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85]">
              {exp.role.split(' ').map((word, i) => (
                <span key={i} className="block group cursor-default">
                  {word}{i === exp.role.split(' ').length - 1 && <span className="text-indigo-400">_</span>}
                </span>
              ))}
            </h3>
            <div className="flex items-center gap-4 text-xl md:text-2xl font-bold text-slate-400 uppercase tracking-tighter">
              <span className="text-white">@ {exp.company}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {exp.description.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="group relative p-8 rounded-[2rem] bg-[#0a0a0a]/50 border border-white/5 hover:border-indigo-500/30 transition-all overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-indigo-500 transition-all duration-500" />
                <div className="flex gap-6">
                  <div className="mt-1">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                      <Terminal className="w-4 h-4 text-indigo-400 group-hover:text-white" />
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed group-hover:text-slate-200 transition-colors">
                    {item}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const VerticalTimeline: React.FC<VerticalTimelineProps> = ({ experiences }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="relative bg-transparent">
      <div className="relative">
        {experiences.map((exp, i) => (
          <ExperienceNode key={exp.id} exp={exp} index={i} total={experiences.length} />
        ))}
      </div>

      <div className="h-60 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="w-px h-full bg-gradient-to-b from-indigo-500/30 to-transparent" />
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="absolute bottom-10 flex flex-col items-center gap-4">
          <Zap className="w-5 h-5 text-indigo-400/50 animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-[1em] text-slate-800">Sequence Complete</span>
        </motion.div>
      </div>
    </section>
  );
};

export default VerticalTimeline;