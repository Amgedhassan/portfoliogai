import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Calendar, Users, ChevronRight, X, CreditCard, CheckCircle2, Info, AlertCircle, Phone, Wallet, Upload, Image as ImageIcon } from 'lucide-react';
import { Course, View } from '../types.ts';
import { DataService } from '../dataService.ts';

interface CoursesGalleryProps {
  courses: Course[];
  onNavigate: (view: View) => void;
}

const CoursesGallery: React.FC<CoursesGalleryProps> = ({ courses, onNavigate }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regStatus, setRegStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [currency, setCurrency] = useState<'USD' | 'EGP'>('EGP');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [receipt, setReceipt] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; receipt?: string }>({});

  const USD_TO_EGP = 50; // Fallback conversion rate if priceEGP is missing

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceipt(reader.result as string);
        setErrors(prev => ({ ...prev, receipt: undefined }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim() || !validateEmail(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!receipt) newErrors.receipt = 'Payment verification receipt is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setRegStatus('submitting');
    try {
      const finalPrice = currency === 'EGP' 
        ? (selectedCourse.priceEGP || selectedCourse.price * USD_TO_EGP) 
        : selectedCourse.price;

      await DataService.addRegistration({
        courseId: selectedCourse.id,
        courseTitle: selectedCourse.title,
        userName: formData.name,
        userEmail: formData.email,
        userPhone: formData.phone,
        selectedCurrency: currency,
        paidAmount: finalPrice,
        paymentReceipt: receipt || undefined
      });
      
      setTimeout(() => {
        setRegStatus('success');
        setTimeout(() => {
          setIsRegistering(false);
          setRegStatus('idle');
          setSelectedCourse(null);
          setFormData({ name: '', email: '', phone: '' });
          setReceipt(null);
        }, 5000);
      }, 1500);
    } catch (error) {
      console.error(error);
      setRegStatus('idle');
    }
  };

  const openRegister = (course: Course) => {
    setSelectedCourse(course);
    setFormData({ name: '', email: '', phone: '' });
    setReceipt(null);
    setErrors({});
    setIsRegistering(true);
  };

  const currentPrice = selectedCourse 
    ? (currency === 'EGP' ? (selectedCourse.priceEGP || selectedCourse.price * USD_TO_EGP) : selectedCourse.price)
    : 0;

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
                    {course.type === 'session' ? 'Live Session' : 'External Course'}
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
                    <span className="text-2xl font-black text-white">{course.price === 0 ? 'FREE' : `USD ${course.price}`}</span>
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
                        Register Now
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
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="bg-slate-900 p-12 text-white relative shrink-0">
                <button onClick={() => setIsRegistering(false)} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center"><Calendar className="w-6 h-6" /></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Live Workshop Access</span>
                </div>
                <h3 className="text-3xl font-black tracking-tighter mb-4 text-white">{selectedCourse.title}</h3>
                
                {/* Currency Switcher */}
                <div className="flex items-center gap-4 mt-6">
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Pay In:</span>
                   <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                      <button onClick={() => setCurrency('EGP')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${currency === 'EGP' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>EGP</button>
                      <button onClick={() => setCurrency('USD')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${currency === 'USD' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>USD</button>
                   </div>
                </div>
              </div>

              <div className="p-12 overflow-y-auto custom-scrollbar">
                {regStatus === 'success' ? (
                  <div className="py-12 text-center space-y-8">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Transmission Verified</h4>
                      <p className="text-slate-500 text-sm font-medium">Your registration and receipt have been logged. Amgad's team will verify the transfer and confirm your seat shortly.</p>
                    </div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-t pt-8">Watch your inbox for the welcome pack.</p>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-8" noValidate>
                    <div className="space-y-6">
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Full Name</label>
                        <input name="name" value={formData.name} onChange={handleInputChange} className={`w-full bg-slate-50 border ${errors.name ? 'border-red-500' : 'border-slate-100'} rounded-2xl px-6 py-4 outline-none font-bold text-slate-900 transition-all focus:ring-2 focus:ring-indigo-500`} placeholder="Amgad Hassan" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Email</label>
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-100'} rounded-2xl px-6 py-4 outline-none font-bold text-slate-900 transition-all focus:ring-2 focus:ring-indigo-500`} placeholder="name@company.com" />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">WhatsApp Number</label>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full bg-slate-50 border ${errors.phone ? 'border-red-500' : 'border-slate-100'} rounded-2xl px-6 py-4 outline-none font-bold text-slate-900 transition-all focus:ring-2 focus:ring-indigo-500`} placeholder="+20 100..." />
                        </div>
                      </div>

                      {/* Payment Verification Step */}
                      <div className="bg-indigo-50/50 p-8 rounded-3xl space-y-6 border border-indigo-100">
                         <div>
                            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Payment Verification Needed</p>
                            <p className="text-sm font-medium text-slate-700 leading-relaxed">
                              Send <strong className="text-indigo-600 font-black">{currency} {currentPrice}</strong> via Instapay to:<br/>
                              <span className="text-lg font-black text-slate-900 tracking-tight">amgedhassan@instapay</span>
                            </p>
                         </div>

                         <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                             <Upload className="w-3 h-3" /> Upload Transaction Screenshot
                           </label>
                           <div className={`relative h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${receipt ? 'border-green-400 bg-green-50/20' : errors.receipt ? 'border-red-400 bg-red-50/20' : 'border-slate-200 hover:border-indigo-400 bg-white'}`}>
                              {receipt ? (
                                <div className="flex flex-col items-center gap-2">
                                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                                  <span className="text-[10px] font-black text-green-600 uppercase">Receipt Captured</span>
                                  <button type="button" onClick={() => setReceipt(null)} className="text-[9px] font-black text-slate-400 underline uppercase tracking-widest hover:text-red-500">Remove</button>
                                </div>
                              ) : (
                                <div className="text-center px-6">
                                  <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Click to upload JPG/PNG</p>
                                </div>
                              )}
                              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                           </div>
                           {errors.receipt && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest text-center">{errors.receipt}</p>}
                         </div>
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={regStatus === 'submitting'} 
                      className="w-full bg-indigo-600 text-white px-10 py-6 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-4"
                    >
                      {regStatus === 'submitting' ? 'Uploading & Verifying...' : 'Finalize Live Registration'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
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