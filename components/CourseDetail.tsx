
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, Sparkles, ShieldCheck, Bookmark } from 'lucide-react';
import { Certification } from '../types';

interface CourseDetailProps {
  course: Certification;
  onBack: () => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-40 text-white">
      <div className="max-w-5xl mx-auto px-6">
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="group flex items-center gap-2 text-slate-400 hover:text-indigo-400 font-bold transition-all mb-16"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Back
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-2xl p-12 md:p-24 rounded-[4rem] border border-white/5 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="flex flex-wrap items-start justify-between gap-8 mb-20">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-8">
                   <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">{course.date}</span>
                   <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
                   <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{course.issuer}</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] tracking-tighter mb-8">
                  {course.name}
                </h1>
                <p className="text-2xl text-slate-400 font-medium leading-relaxed">
                  Verified professional certification in advanced design methodologies and strategic thinking.
                </p>
              </div>
              <div className="w-24 h-24 bg-white/5 border border-white/10 text-indigo-400 rounded-[2.5rem] flex items-center justify-center shadow-2xl">
                 <ShieldCheck className="w-12 h-12" />
              </div>
            </div>

            <div className="grid md:grid-cols-12 gap-16 mb-24">
              <div className="md:col-span-8">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Curriculum Overview</h3>
                <div className="text-xl text-slate-300 leading-relaxed font-medium">
                  {course.description}
                </div>
              </div>
              <div className="md:col-span-4">
                 <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 shadow-sm">
                    <Bookmark className="w-6 h-6 text-indigo-400 mb-6" />
                    <h4 className="text-sm font-black text-white mb-4">Official Verification</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">This credential has been reviewed and verified by the issuing body.</p>
                 </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-10">Specialized Competencies</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {course.skills.map((skill, i) => (
                  <motion.div 
                    key={skill} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 border border-white/5 p-8 rounded-[2rem] flex items-center gap-4 group hover:border-indigo-600 transition-colors"
                  >
                    <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-lg shadow-indigo-100 group-hover:scale-125 transition-transform"></div>
                    <span className="font-black text-white tracking-tight text-lg">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseDetail;
