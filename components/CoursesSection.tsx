import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Play, Award, GraduationCap } from 'lucide-react';
import { Course, View } from '../types.ts';

interface CoursesSectionProps {
  courses: Course[];
  onNavigate: (view: View) => void;
}

const CoursesSection: React.FC<CoursesSectionProps> = ({ courses, onNavigate }) => {
  // Display only the top 3 most relevant courses on the landing page
  const featuredCourses = courses.slice(0, 3);

  return (
    <section id="academy" className="py-[56pt] bg-transparent relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-6"
            >
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[1em]">Knowledge Systems</span>
            </motion.div>
            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85]">
              Master the <br/> <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.4)' }}>Logic.</span>
            </h2>
          </div>
          
          <button 
            onClick={() => onNavigate({ type: 'courses' })}
            className="group flex flex-col items-start gap-4 mb-4"
          >
            <span className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em]">Explore Academy</span>
            <div className="flex items-center gap-4 text-white font-black text-xs uppercase tracking-widest group-hover:text-indigo-400 transition-colors">
              Full Curriculum <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onNavigate({ type: 'course_detail', data: course })}
              className="group relative bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer flex flex-col h-full overflow-hidden shadow-2xl"
            >
              <div className="aspect-[16/10] relative overflow-hidden">
                <img 
                  src={course.image} 
                  alt="" 
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-all duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent" />
                <div className="absolute top-8 left-8">
                   <div className="px-4 py-2 bg-indigo-600 rounded-full flex items-center gap-2 border border-indigo-400/50 shadow-xl">
                      <Play className="w-3 h-3 fill-white" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-white">Featured Session</span>
                   </div>
                </div>
              </div>

              <div className="p-10 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-6 text-[9px] font-black uppercase tracking-widest text-slate-500">
                  <span className="text-indigo-400">{course.platform}</span>
                  <div className="w-1 h-1 bg-white/20 rounded-full" />
                  <span>{course.duration}</span>
                </div>

                <h3 className="text-2xl font-black text-white mb-6 tracking-tight leading-tight group-hover:text-indigo-300 transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10 line-clamp-2">
                  {course.description}
                </p>

                <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Enrollment Fee</span>
                    <span className="text-xl font-black text-white">
                      {course.price === 0 ? 'FREE' : `${course.currency} ${course.price}`}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-500">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating statistics/badge */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 flex flex-wrap justify-center gap-12 py-10 border-y border-white/5"
        >
          <div className="flex items-center gap-4">
             <Award className="w-5 h-5 text-indigo-400" />
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Industry Verified Certificates</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Next Live Cohort: Q4 2025</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CoursesSection;