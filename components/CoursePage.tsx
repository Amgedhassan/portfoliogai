
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, User, Calendar, CheckCircle, ChevronDown, Play, CreditCard, X, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { Course } from '../types';
import { DataService } from '../dataService';

interface CoursePageProps {
  course: Course;
  onBack: () => void;
}

const CoursePage: React.FC<CoursePageProps> = ({ course, onBack }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [regStatus, setRegStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { name?: string; email?: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    else if (formData.name.trim().length < 2) newErrors.name = 'Name is too short';
    
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setRegStatus('submitting');
    
    try {
      await DataService.addRegistration({
        courseId: course.id,
        courseTitle: course.title,
        userName: formData.name,
        userEmail: formData.email,
      });
      
      setTimeout(() => {
        setRegStatus('success');
        setTimeout(() => {
          setIsRegistering(false);
          setRegStatus('idle');
          setFormData({ name: '', email: '' });
        }, 2000);
      }, 1500);
    } catch (error) {
      console.error(error);
      setRegStatus('idle');
    }
  };

  const openRegister = () => {
    setFormData({ name: '', email: '' });
    setErrors({});
    setIsRegistering(true);
  };

  return (
    <div className="min-h-screen bg-transparent text-white pb-40">
      {/* Hero Header */}
      <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden pt-24 px-8 md:px-16">
        <div className="absolute inset-0 z-0">
          <img src={course.image} className="w-full h-full object-cover opacity-20" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <button onClick={onBack} className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12 hover:gap-4 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Academy
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="px-4 py-1.5 rounded-full bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest">
                {course.type === 'session' ? 'Live Workshop' : 'On-Demand'}
              </span>
              <span className="text-slate-400 font-black text-[9px] uppercase tracking-widest">{course.platform}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase">
              {course.title}
            </h1>
            <div className="flex flex-wrap items-center gap-12">
               <div className="flex items-center gap-3">
                 <Clock className="w-5 h-5 text-indigo-400" />
                 <span className="font-bold text-slate-300">{course.duration}</span>
               </div>
               <div className="flex items-center gap-3">
                 <User className="w-5 h-5 text-indigo-400" />
                 <span className="font-bold text-slate-300">{course.instructor}</span>
               </div>
               {course.date && (
                 <div className="flex items-center gap-3">
                   <Calendar className="w-5 h-5 text-indigo-400" />
                   <span className="font-bold text-slate-300">{course.date}</span>
                 </div>
               )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 mt-24">
        <div className="grid lg:grid-cols-12 gap-24">
          <div className="lg:col-span-8 space-y-24">
            {/* Description */}
            <section className="space-y-12">
              <h2 className="text-3xl font-black tracking-tight uppercase">About this course.</h2>
              <p className="text-xl text-slate-300 font-medium leading-relaxed">
                {course.fullDescription}
              </p>
            </section>

            {/* Curriculum */}
            {course.curriculum && (
              <section className="space-y-12">
                <h2 className="text-3xl font-black tracking-tight uppercase">Curriculum Roadmap.</h2>
                <div className="space-y-6">
                  {course.curriculum.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ x: 10 }}
                      className="bg-white/5 border border-white/5 rounded-3xl p-8 group hover:border-indigo-500/30 transition-all"
                    >
                      <div className="flex items-start gap-8">
                        <span className="text-indigo-400 text-3xl font-black italic opacity-30 group-hover:opacity-100 transition-opacity">0{idx + 1}</span>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                          <p className="text-slate-300 font-medium leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            <section className="space-y-12">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Mastered Competencies</h2>
              <div className="flex flex-wrap gap-4">
                {course.skills.map(skill => (
                  <div key={skill} className="px-6 py-3 bg-white/5 border border-white/5 rounded-2xl font-bold text-indigo-300 text-sm">
                    {skill}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Enrollment Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-32 bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[4rem] shadow-2xl">
              <div className="space-y-12">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Investment</p>
                   <div className="flex items-baseline gap-2">
                     <span className="text-5xl font-black text-white">{course.price === 0 ? 'FREE' : course.price}</span>
                     <span className="text-xl font-bold text-slate-400">{course.currency}</span>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                     <CheckCircle className="w-5 h-5 text-green-500" />
                     <span className="text-sm font-bold text-slate-200">Lifetime Access</span>
                   </div>
                   <div className="flex items-center gap-4">
                     <CheckCircle className="w-5 h-5 text-green-500" />
                     <span className="text-sm font-bold text-slate-200">Verified Certificate</span>
                   </div>
                   <div className="flex items-center gap-4">
                     <CheckCircle className="w-5 h-5 text-green-500" />
                     <span className="text-sm font-bold text-slate-200">B2B Case Studies</span>
                   </div>
                </div>

                {course.type === 'external' ? (
                  <a href={course.url} target="_blank" className="block text-center bg-white text-black font-black py-6 rounded-3xl hover:bg-indigo-600 hover:text-white transition-all shadow-xl group">
                    Start Learning <Play className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                ) : (
                  <button onClick={openRegister} className="w-full bg-indigo-700 text-white font-black py-6 rounded-3xl hover:bg-white hover:text-black transition-all shadow-xl">
                    Enroll in Session
                  </button>
                )}
                
                <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest">Secure SSL Connection</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Registration Modal Overlay */}
      <AnimatePresence>
        {isRegistering && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setIsRegistering(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl">
              <div className="bg-slate-900 p-12 text-white relative">
                <button onClick={() => setIsRegistering(false)} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center"><Calendar className="w-6 h-6" /></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Secure Enrollment</span>
                </div>
                <h3 className="text-3xl font-black tracking-tighter mb-4 text-white">{course.title}</h3>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2"><Users className="w-4 h-4 text-indigo-400" /><span className="text-xs font-bold opacity-80">Limited Slots</span></div>
                  <div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-indigo-400" /><span className="text-xs font-bold opacity-80">SSL Encrypted</span></div>
                </div>
              </div>

              <div className="p-12">
                {regStatus === 'success' ? (
                  <div className="py-12 text-center space-y-6">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
                    <h4 className="text-2xl font-black text-slate-900 tracking-tighter">Registration Successful</h4>
                    <p className="text-slate-600 text-sm font-medium">Confirmation email sent to your inbox.</p>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-8" noValidate>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Full Name</label>
                          {errors.name && (
                            <span className="text-red-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {errors.name}
                            </span>
                          )}
                        </div>
                        <input 
                          name="name" 
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full bg-slate-50 border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'} rounded-2xl px-6 py-4 outline-none font-bold text-slate-900 transition-all`}
                          placeholder="Amgad Hassan"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Email Address</label>
                          {errors.email && (
                            <span className="text-red-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {errors.email}
                            </span>
                          )}
                        </div>
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full bg-slate-50 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'} rounded-2xl px-6 py-4 outline-none font-bold text-slate-900 transition-all`}
                          placeholder="name@company.com"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-6 rounded-[2rem] flex justify-between items-center">
                      <div>
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Due</p>
                         <p className="text-2xl font-black text-slate-900">{course.currency} {course.price}</p>
                      </div>
                      <button 
                        type="submit" 
                        disabled={regStatus === 'submitting'} 
                        className="bg-indigo-700 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl disabled:opacity-50"
                      >
                        {regStatus === 'submitting' ? 'Processing...' : 'Complete Payment'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoursePage;
