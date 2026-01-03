import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Calendar, Clock, User, Phone, Mail, 
  CreditCard, ShieldCheck, CheckCircle2, Loader2, 
  ChevronRight, ChevronLeft, Sparkles, AlertCircle, Upload, Image as ImageIcon
} from 'lucide-react';
import { MentorshipSession, MentorshipSlot, View } from '../types.ts';
import { DataService } from '../dataService.ts';

interface MentorshipBookingProps {
  session: MentorshipSession;
  onBack: () => void;
  onSuccess: () => void;
}

const MentorshipBooking: React.FC<MentorshipBookingProps> = ({ session, onBack, onSuccess }) => {
  const [step, setStep] = useState<'slots' | 'details' | 'payment' | 'success'>('slots');
  const [slots, setSlots] = useState<MentorshipSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<MentorshipSlot | null>(null);
  const [currency, setCurrency] = useState<'USD' | 'EGP'>('EGP');
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [receipt, setReceipt] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const USD_TO_EGP = 50;

  useEffect(() => {
    const fetchSlots = async () => {
      const available = await DataService.getAvailableSlots(session.id);
      setSlots(available);
      setIsLoading(false);
    };
    fetchSlots();
  }, [session.id]);

  const validateDetails = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Contact number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceipt(reader.result as string);
        setErrors(prev => {
          const n = { ...prev };
          delete n.receipt;
          return n;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    if (!receipt) {
      setErrors(prev => ({ ...prev, receipt: 'Receipt upload required' }));
      return;
    }

    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    
    try {
      const finalPrice = currency === 'EGP' ? (session.priceEGP || session.price * USD_TO_EGP) : session.price;
      await DataService.createBooking({
        slotId: selectedSlot.id,
        sessionId: session.id,
        userName: formData.name,
        userEmail: formData.email,
        userPhone: formData.phone,
        amount: finalPrice,
        currency: currency,
        paymentReceipt: receipt || undefined
      });
      setStep('success');
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const currentPrice = currency === 'EGP' ? (session.priceEGP || session.price * USD_TO_EGP) : session.price;

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020202]">
      <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Syncing Availability</span>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-transparent pt-32 pb-40 px-8"
    >
      <div className="max-w-5xl mx-auto">
        <header className="mb-20">
          <button onClick={onBack} className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12 hover:gap-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded p-1">
            <ArrowLeft className="w-4 h-4" /> Cancel Booking
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Mentorship Terminal</span>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase">
                {step === 'success' ? 'Confirmed.' : 'Secure Your Slot.'}
              </h1>
            </div>
            {step !== 'success' && (
              <div className="flex flex-col items-end gap-4">
                 <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    <button onClick={() => setCurrency('EGP')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black ${currency === 'EGP' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>EGP</button>
                    <button onClick={() => setCurrency('USD')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black ${currency === 'USD' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>USD</button>
                 </div>
                 <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Investment</span>
                    <span className="text-2xl font-black text-white">{currency} {currentPrice}</span>
                 </div>
              </div>
            )}
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Booking Content */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {step === 'slots' && (
                <motion.div
                  key="slots-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="bg-white/5 border border-white/5 rounded-[3rem] p-10 md:p-16">
                    <h3 className="text-2xl font-black text-white mb-12 uppercase tracking-tight">Select a Date & Time</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {slots.length === 0 ? (
                        <p className="col-span-2 text-slate-500 text-center py-20 font-bold italic">No available slots in this window.</p>
                      ) : (
                        slots.map(slot => {
                          const date = new Date(slot.dateTime);
                          const isSelected = selectedSlot?.id === slot.id;
                          return (
                            <button
                              key={slot.id}
                              onClick={() => setSelectedSlot(slot)}
                              className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-3 group ${
                                isSelected 
                                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-2xl' 
                                  : 'bg-white/5 border-white/5 text-slate-400 hover:border-indigo-500/50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                  {date.toLocaleDateString(undefined, { weekday: 'long' })}
                                </span>
                                {isSelected && <CheckCircle2 className="w-4 h-4" />}
                              </div>
                              <div className="text-lg font-black tracking-tight">
                                {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </div>
                              <div className="text-xl font-bold flex items-center gap-2">
                                <Clock className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-indigo-400'}`} />
                                {date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      disabled={!selectedSlot}
                      onClick={() => setStep('details')}
                      className="bg-white text-black px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50 shadow-2xl flex items-center gap-3"
                    >
                      Next Step <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'details' && (
                <motion.div
                  key="details-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="bg-white/5 border border-white/5 rounded-[3rem] p-10 md:p-16">
                    <h3 className="text-2xl font-black text-white mb-12 uppercase tracking-tight">Mentee Registration</h3>
                    <div className="space-y-8">
                      <div className="relative">
                        <label htmlFor="name" className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Full Legal Name</label>
                        <input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className={`w-full bg-white/5 border rounded-2xl px-6 py-4 outline-none font-bold text-white transition-all ${errors.name ? 'border-red-500' : 'border-white/10 focus:border-indigo-500'}`}
                          placeholder="Your Name"
                          aria-invalid={!!errors.name}
                        />
                        {errors.name && <span className="text-red-500 text-[9px] font-black mt-2 flex items-center gap-1 uppercase tracking-widest"><AlertCircle className="w-3 h-3" /> {errors.name}</span>}
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <label htmlFor="email" className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Digital Gateway (Email)</label>
                          <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className={`w-full bg-white/5 border rounded-2xl px-6 py-4 outline-none font-bold text-white transition-all ${errors.email ? 'border-red-500' : 'border-white/10 focus:border-indigo-500'}`}
                            placeholder="email@example.com"
                            aria-invalid={!!errors.email}
                          />
                          {errors.email && <span className="text-red-500 text-[9px] font-black mt-2 flex items-center gap-1 uppercase tracking-widest"><AlertCircle className="w-3 h-3" /> {errors.email}</span>}
                        </div>
                        <div>
                          <label htmlFor="phone" className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">WhatsApp / Contact Protocol</label>
                          <input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className={`w-full bg-white/5 border rounded-2xl px-6 py-4 outline-none font-bold text-white transition-all ${errors.phone ? 'border-red-500' : 'border-white/10 focus:border-indigo-500'}`}
                            placeholder="+20 100..."
                            aria-invalid={!!errors.phone}
                          />
                          {errors.phone && <span className="text-red-500 text-[9px] font-black mt-2 flex items-center gap-1 uppercase tracking-widest"><AlertCircle className="w-3 h-3" /> {errors.phone}</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button onClick={() => setStep('slots')} className="text-slate-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors">
                      <ChevronLeft className="w-4 h-4" /> Back to Slots
                    </button>
                    <button
                      onClick={() => validateDetails() && setStep('payment')}
                      className="bg-white text-black px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all shadow-2xl flex items-center gap-3"
                    >
                      Verify Payment <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div
                  key="payment-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="bg-white/5 border border-white/5 rounded-[3rem] p-10 md:p-16">
                    <h3 className="text-2xl font-black text-white mb-12 uppercase tracking-tight">Manual Instapay Verification</h3>
                    <div className="space-y-8">
                      <div className="bg-white/5 p-10 rounded-[2rem] border border-white/10 space-y-8">
                         <div className="flex flex-col md:flex-row justify-between gap-8">
                           <div>
                              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Instructions</p>
                              <p className="text-lg font-black text-white tracking-tight leading-relaxed">
                                Transfer <span className="text-indigo-400">{currency} {currentPrice}</span> to:<br/>
                                <span className="text-2xl text-white">amgedhassan@instapay</span>
                              </p>
                           </div>
                           <div className="md:text-right">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Method</p>
                              <p className="text-white font-bold">Instapay / Manual Triage</p>
                           </div>
                         </div>

                         <div className="pt-8 border-t border-white/5 space-y-6">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Attach Verification Screenshot</label>
                            <div className={`relative h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all ${receipt ? 'border-indigo-400 bg-indigo-500/10' : 'border-white/10 hover:border-indigo-500/50'}`}>
                               {receipt ? (
                                 <div className="text-center">
                                   <CheckCircle2 className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
                                   <p className="text-[10px] font-black text-white uppercase">Receipt Received</p>
                                   <button type="button" onClick={() => setReceipt(null)} className="text-[9px] font-bold text-slate-500 hover:text-red-500 uppercase mt-2">Change Image</button>
                                 </div>
                               ) : (
                                 <div className="text-center">
                                   <Upload className="w-10 h-10 text-slate-700 mx-auto mb-4" />
                                   <p className="text-[10px] font-black text-slate-500 uppercase">Click to upload JPG/PNG</p>
                                 </div>
                               )}
                               <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                            {errors.receipt && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest text-center">{errors.receipt}</p>}
                         </div>
                      </div>

                      <form onSubmit={handlePayment} className="space-y-8">
                         <button 
                           type="submit"
                           disabled={isProcessing}
                           className="w-full bg-indigo-600 text-white font-black py-8 rounded-full flex items-center justify-center gap-6 hover:bg-white hover:text-black transition-all shadow-2xl disabled:opacity-50"
                         >
                           {isProcessing ? (
                             <>
                               <Loader2 className="w-6 h-6 animate-spin" />
                               Registering Protocol...
                             </>
                           ) : (
                             <>
                               Commit Booking & Verification
                               <ShieldCheck className="w-6 h-6" />
                             </>
                           )}
                         </button>
                      </form>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  key="success-step"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 border border-white/10 rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-12 shadow-2xl">
                      <CheckCircle2 className="w-12 h-12 text-green-500 animate-bounce" />
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-8">Verification <br/> Received.</h2>
                    <p className="text-xl text-slate-300 font-medium max-w-lg mx-auto mb-16 leading-relaxed">
                      Your booking and payment proof are being triaged. A confirmation will be sent to <span className="text-indigo-400">{formData.email}</span> within 12 hours.
                    </p>
                    <button 
                      onClick={onSuccess}
                      className="bg-white text-black px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all shadow-2xl"
                    >
                      Return to Index
                    </button>
                  </div>
                  <div className="absolute top-0 right-0 p-12 opacity-5" aria-hidden="true">
                     <Sparkles className="w-32 h-32 text-white" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Summary */}
          {step !== 'success' && (
            <aside className="lg:col-span-4 space-y-8">
              <div className="bg-white/5 border border-white/5 rounded-[3rem] p-10 backdrop-blur-xl">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">Selection Summary</h4>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 border border-white/5 flex-shrink-0">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Session</p>
                      <p className="text-white font-bold leading-tight">{session.title}</p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedSlot && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-6"
                      >
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 border border-white/5 flex-shrink-0">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Scheduled Date</p>
                          <p className="text-white font-bold leading-tight">
                            {new Date(selectedSlot.dateTime).toLocaleDateString(undefined, { dateStyle: 'long' })} <br/>
                            at {new Date(selectedSlot.dateTime).toLocaleTimeString(undefined, { timeStyle: 'short' })}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-8 border-t border-white/5">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Selected Rate</span>
                      <span className="text-white font-bold">{currency} {currentPrice}</span>
                    </div>
                    <div className="h-px w-full bg-white/10 my-6" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-black text-white uppercase tracking-tighter">Due Verification</span>
                      <span className="text-2xl font-black text-indigo-400">{currency} {currentPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MentorshipBooking;