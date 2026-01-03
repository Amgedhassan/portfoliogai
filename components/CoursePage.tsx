import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Clock, User, Calendar, CheckCircle, 
  Play, CreditCard, Users, CheckCircle2, AlertCircle, 
  Send, Loader2, Sparkles, ShieldCheck, X, Phone, Wallet, Upload, Image as ImageIcon
} from 'lucide-react';
import { Course } from '../types.ts';
import { DataService } from '../dataService.ts';

interface CoursePageProps {
  course: Course;
  onBack: () => void;
}

const CoursePage: React.FC<CoursePageProps> = ({ course, onBack }) => {
  const [showForm, setShowForm] = useState(false);
  const [regStatus, setRegStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [currency, setCurrency] = useState<'USD' | 'EGP'>('EGP');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [receipt, setReceipt] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; receipt?: string }>({});

  const USD_TO_EGP = 50;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = 'Name Required';
    if (!formData.email.trim() || !validateEmail(formData.email)) newErrors.email = 'Invalid Email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone Required';
    if (!receipt) newErrors.receipt = 'Verification Missing';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setRegStatus('submitting');
    try {
      const finalPrice = currency === 'EGP' ? (course.priceEGP || course.price * USD_TO_EGP) : course.price;
      await DataService.addRegistration({
        courseId: course.id,
        courseTitle: course.title,
        userName: formData.name,
        userEmail: formData.email,
        userPhone: formData.phone,
        selectedCurrency: currency,
        paidAmount: finalPrice,
        paymentReceipt: receipt || undefined
      });
      setTimeout(() => setRegStatus('success'), 1200);
    } catch (error) {
      setRegStatus('idle');
    }
  };

  const currentPrice = currency === 'EGP' ? (course.priceEGP || course.price * USD_TO_EGP) : course.price;
  const inputStyles = "w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 focus:bg-white/[0.08] font-bold text-white transition-all placeholder:text-white/5";

  return (
    <div className="min-h-screen bg-transparent text-white pb-[56pt]">
      <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden pt-24 px-8 md:px-16">
        <div className="absolute inset-0 z-0">
          <img src={course.image} className="w-full h-full object-cover opacity-20" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <button onClick={onBack} className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12 hover:gap-4 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Academy
          </button>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <span className="px-4 py-1.5 rounded-full bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest">
                {course.type === 'session' ? 'Live Workshop' : 'Self-Paced Module'}
              </span>
              <span className="text-slate-400 font-black text-[9px] uppercase tracking-widest">{course.platform}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase">{course.title}</h1>
            <div className="flex flex-wrap items-center gap-12 text-slate-300 font-bold">
               <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-indigo-400" /><span>{course.duration}</span></div>
               <div className="flex items-center gap-3"><User className="w-5 h-5 text-indigo-400" /><span>{course.instructor}</span></div>
               {course.date && <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-indigo-400" /><span>{course.date}</span></div>}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 mt-[56pt]">
        <div className="grid lg:grid-cols-12 gap-24">
          <div className="lg:col-span-8 space-y-[56pt]">
            <section className="space-y-12">
              <h2 className="text-3xl font-black tracking-tight uppercase">Strategy Overview.</h2>
              <p className="text-xl text-slate-400 font-medium leading-relaxed">{course.fullDescription}</p>
            </section>

            {course.curriculum && (
              <section className="space-y-12">
                <h2 className="text-3xl font-black tracking-tight uppercase">Module Roadmap.</h2>
                <div className="space-y-4">
                  {course.curriculum.map((item, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/5 rounded-3xl p-8 group hover:border-indigo-500/30 transition-all flex items-start gap-8">
                        <span className="text-indigo-400 text-3xl font-black italic opacity-30 group-hover:opacity-100 transition-opacity">0{idx + 1}</span>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                          <p className="text-slate-400 font-medium leading-relaxed">{item.description}</p>
                        </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="lg:col-span-4">
            <motion.div layout className="sticky top-32 bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-12 rounded-[4rem] shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                {regStatus === 'success' ? (
                  <motion.div key="success-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                    <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-green-500/20"><CheckCircle2 className="w-10 h-10 text-green-500" /></div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Transmission Logged</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">Payment verification received. Amgad's team will verify the <span className="text-white font-bold">{currency} {currentPrice}</span> transfer shortly.</p>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Enrollment confirmation will follow.</p>
                  </motion.div>
                ) : showForm ? (
                  <motion.div key="form-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-indigo-400" /><span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Registration</span></div>
                      <button onClick={() => setShowForm(false)} className="text-slate-600 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                    </div>

                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Currency</span>
                        <div className="flex gap-2">
                           <button onClick={() => setCurrency('EGP')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black ${currency === 'EGP' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>EGP</button>
                           <button onClick={() => setCurrency('USD')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black ${currency === 'USD' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>USD</button>
                        </div>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-8">
                      <div>
                        <label className="text-[10px] font-black text-indigo-400/50 uppercase tracking-widest mb-3 block ml-1">Identity</label>
                        <input name="name" value={formData.name} onChange={handleInputChange} className={inputStyles} placeholder="FULL NAME" />
                        {errors.name && <p className="text-[9px] font-bold text-red-500 mt-2 uppercase tracking-widest">{errors.name}</p>}
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-indigo-400/50 uppercase tracking-widest mb-3 block ml-1">Communication</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputStyles} placeholder="EMAIL ADDRESS" />
                        {errors.email && <p className="text-[9px] font-bold text-red-500 mt-2 uppercase tracking-widest">{errors.email}</p>}
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={inputStyles} placeholder="WHATSAPP NUMBER" />
                        {errors.phone && <p className="text-[9px] font-bold text-red-500 mt-2 uppercase tracking-widest">{errors.phone}</p>}
                      </div>

                      <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 space-y-6">
                         <div>
                            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Instapay Transfer</p>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">Send <strong className="text-white">{currency} {currentPrice}</strong> to:<br/><span className="text-indigo-400 font-black">amgedhassan@instapay</span></p>
                         </div>
                         <div className="space-y-3">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Upload Receipt</p>
                           <div className={`h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer relative ${receipt ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 hover:border-indigo-500/50'}`}>
                             {receipt ? (
                               <CheckCircle2 className="w-6 h-6 text-green-500" />
                             ) : (
                               <ImageIcon className="w-6 h-6 text-slate-700" />
                             )}
                             <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                           </div>
                           {errors.receipt && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest text-center">{errors.receipt}</p>}
                         </div>
                      </div>

                      <button type="submit" disabled={regStatus === 'submitting'} className="w-full bg-indigo-600 text-white font-black py-6 rounded-3xl hover:bg-white hover:text-black transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50">
                        <span className="text-[10px] uppercase tracking-widest">{regStatus === 'submitting' ? 'VERIFYING...' : 'REGISTER & COMMIT'}</span>
                        {regStatus === 'submitting' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div key="details-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Module Investment</p>
                      <div className="flex items-baseline gap-2"><span className="text-5xl font-black text-white">{course.price === 0 ? 'FREE' : course.price}</span><span className="text-xl font-bold text-slate-500">{course.currency}</span></div>
                    </div>
                    <div className="space-y-5">
                      <div className="flex items-center gap-4 text-slate-400 text-sm font-bold"><CheckCircle className="w-5 h-5 text-indigo-500" /><span>Verified Certificate</span></div>
                      <div className="flex items-center gap-4 text-slate-400 text-sm font-bold"><Wallet className="w-5 h-5 text-indigo-500" /><span>Instapay Payment Support</span></div>
                    </div>
                    <div className="pt-4">
                      {course.type === 'external' ? (
                        <a href={course.url} target="_blank" className="block text-center bg-white text-black font-black py-6 rounded-3xl hover:bg-indigo-600 hover:text-white transition-all shadow-xl group">ENROLL ON PLATFORM <Play className="inline-block ml-2 w-4 h-4" /></a>
                      ) : (
                        <button onClick={() => setShowForm(true)} className="w-full bg-indigo-700 text-white font-black py-6 rounded-3xl hover:bg-white hover:text-black transition-all shadow-xl flex items-center justify-center gap-3 group">RESERVE LIVE SEAT <Sparkles className="w-5 h-5" /></button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;