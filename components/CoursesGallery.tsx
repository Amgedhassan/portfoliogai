
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Calendar, Users, ChevronRight, X, CreditCard, CheckCircle2, Info, AlertCircle } from 'lucide-react';
import { Course } from '../types';
import { DataService } from '../dataService';
import { View } from '../App';

interface CoursesGalleryProps {
  courses: Course[];
  onNavigate: (view: View) => void;
}

const CoursesGallery: React.FC<CoursesGalleryProps> = ({ courses, onNavigate }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regStatus, setRegStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

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
    if (!selectedCourse) return;

    // Final validation before submit
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
        courseId: selectedCourse.id,
        courseTitle: selectedCourse.title,
        userName: formData.name,
        userEmail: formData.email,
      });
      
      setTimeout(() => {
        setRegStatus('success');
        setTimeout(() => {
          setIsRegistering(false);
          setRegStatus('idle');
          setSelectedCourse(null);
          setFormData({ name: '', email: '' });
        }, 2000);
      }, 1500);
    } catch (error) {
      console.error(error);
      setRegStatus('idle');
    }
  };

  const openRegister = (course: Course) => {
    setSelectedCourse(course);
    setFormData({ name: '', email: '' });
    setErrors({});
    setIsRegistering(true);
  };

  return (
    <div className="min-h-screen pt-32 pb-40 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24">
          <button onClick={() => onNavigate({ type: 'home' })} className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12">
            <ArrowLeft className="w-4 h-4" /> Return Home
          </button>
          <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none mb-8">
            PRODUCT <br/> <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(129,140,248,0.5)' }}>ACADEMY.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl font-medium leading-relaxed">
            Scalable design systems, B2B logic, and leadership masterclasses.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <motion.div 
              key={course.id}
              whileHover={{ y: -10 }}
              className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-[3rem] overflow-hidden flex flex-col group cursor-pointer"
              onClick={() => onNavigate({ type: 'course_detail', data: course })}
            >
              <div className="aspect-video relative overflow-hidden">
                <img src={course.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" alt="" />
                <div className="absolute top-6 left-6">
                  <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    course.type === 'session' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-300'
                  }`}>
                    {course.type === 'session' ? 'Live Session' : 'Self-Paced'}
                  </span>
                </div>
              </div>
              
              <div className="p-10 flex flex-col flex-1">
                <div className="flex items-center gap-4 mb-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span className="text-indigo-400">{course.platform}</span>
                  <div className="w-1 h-1 bg-white/10 rounded-full" />
                  <span>{course.duration}</span>
                </div>
                
                <h3 className="text-2xl font-black text-white mb-6 tracking-tight leading-tight">{course.title}</h3>
                <p className="text-slate-400 text-sm font-medium mb-12 flex-1 leading-relaxed line-clamp-3">{course.description}</p>
                
                <div className="flex items-center justify-between pt-8 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Investment</span>
                    <span className="text-2xl font-black text-white">{course.price === 0 ? 'FREE' : `${course.currency} ${course.price}`}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onNavigate({ type: 'course_detail', data: course }); }} 
                      className="bg-white/5 text-white p-4 rounded-2xl hover:bg-white hover:text-black transition-all border border-white/10"
                    >
                      <Info className="w-5 h-5" />
                    </button>
                    {course.type === 'external' ? (
                      <a 
                        href={course.url} 
                        target="_blank" 
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white text-black p-4 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all shadow-xl"
                      >
                        <Play className="w-6 h-6" />
                      </a>
                    ) : (
                      <button 
                        onClick={(e) => { e.stopPropagation(); openRegister(course); }} 
                        className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isRegistering && selectedCourse && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setIsRegistering(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl">
              <div className="bg-slate-900 p-12 text-white relative">
                <button onClick={() => setIsRegistering(false)} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center"><Calendar className="w-6 h-6" /></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Secure Enrollment</span>
                </div>
                <h3 className="text-3xl font-black tracking-tighter mb-4 text-white">{selectedCourse.title}</h3>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2"><Users className="w-4 h-4 text-indigo-400" /><span className="text-xs font-bold opacity-60">Limited Slots</span></div>
                  <div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-indigo-400" /><span className="text-xs font-bold opacity-60">SSL Encrypted</span></div>
                </div>
              </div>

              <div className="p-12">
                {regStatus === 'success' ? (
                  <div className="py-12 text-center space-y-6">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
                    <h4 className="text-2xl font-black text-slate-900 tracking-tighter">Registration Successful</h4>
                    <p className="text-slate-500 text-sm font-medium">Confirmation email sent to your inbox.</p>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-8" noValidate>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Full Name</label>
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
                          className={`w-full bg-slate-50 border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-100 focus:ring-indigo-500'} rounded-2xl px-6 py-4 outline-none font-bold text-slate-900 transition-all`}
                          placeholder="Amgad Hassan"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Email Address</label>
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
                          className={`w-full bg-slate-50 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-100 focus:ring-indigo-500'} rounded-2xl px-6 py-4 outline-none font-bold text-slate-900 transition-all`}
                          placeholder="name@company.com"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-6 rounded-[2rem] flex justify-between items-center">
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Due</p>
                         <p className="text-2xl font-black text-slate-900">{selectedCourse.currency} {selectedCourse.price}</p>
                      </div>
                      <button 
                        type="submit" 
                        disabled={regStatus === 'submitting'} 
                        className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl disabled:opacity-50"
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

export default CoursesGallery;
