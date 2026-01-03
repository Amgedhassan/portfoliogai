import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Trash2, Plus, DollarSign, List, Briefcase, User, 
  MessageSquare, BookOpen, GraduationCap, CheckCircle2, Clock, 
  X, Save, Wifi, WifiOff, RefreshCw, Calendar, Tag, AlertCircle,
  ChevronRight, ExternalLink, Filter, Search, Phone, Edit3, Eye,
  Layout, Layers, Code, Target, Sparkles, ToggleLeft, ToggleRight, FileText, Image as ImageIcon
} from 'lucide-react';
import { DataService } from '../dataService.ts';
import { 
  PortfolioData, 
  Project, 
  Experience, 
  Course,
  MentorshipSession,
  MentorshipSlot,
  Booking,
  ContactMessage,
  Registration
} from '../types.ts';

type Tab = 'overview' | 'about' | 'projects' | 'experience' | 'courses' | 'registrations' | 'mentorship' | 'slots' | 'bookings' | 'messages';

const Dashboard: React.FC<{ onBack: () => void; onRefresh: () => void }> = ({ onBack, onRefresh }) => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isActionPending, setIsActionPending] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [bookingFilter, setBookingFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);

  const checkConnection = async () => {
    const status = await DataService.checkConnection();
    setIsConnected(status);
  };

  const fetchCurrentData = async () => {
    setIsLoading(true);
    try {
      const updated = await DataService.getData();
      setData(updated);
      await checkConnection();
    } catch (e) {
      console.error("Dashboard fetch failure:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    fetchCurrentData();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  const refreshDashboard = async () => {
    setIsActionPending(false);
    setIsAdding(false);
    setEditingItem(null);
    setErrorMsg(null);
    await fetchCurrentData();
    onRefresh();
  };

  const handleAboutSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsActionPending(true);
    const formData = new FormData(e.currentTarget);
    const about = {
      title: formData.get('title') as string,
      summary: formData.get('summary') as string,
      philosophy: formData.get('philosophy') as string,
      image: formData.get('image') as string,
    };
    await DataService.updateAbout(about);
    await refreshDashboard();
  };

  const handleProjectSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsActionPending(true);
    const formData = new FormData(e.currentTarget);
    const project: Project = {
      id: editingItem?.id || `prj-${Date.now()}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      longDescription: formData.get('longDescription') as string,
      challenge: formData.get('challenge') as string,
      solution: formData.get('solution') as string,
      impact: formData.get('impact') as string,
      image: formData.get('image') as string,
      role: formData.get('role') as string,
      timeline: formData.get('timeline') as string,
      tools: (formData.get('tools') as string).split(',').map(s => s.trim()),
      tags: (formData.get('tags') as string).split(',').map(s => s.trim()),
      isFeatured: formData.get('isFeatured') === 'on',
      showCaseStudy: formData.get('showCaseStudy') === 'on',
      behanceUrl: formData.get('behanceUrl') as string
    };
    await DataService.saveProject(project);
    await refreshDashboard();
  };

  const handleCourseSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsActionPending(true);
    const formData = new FormData(e.currentTarget);
    const course: Course = {
      id: editingItem?.id || `crs-${Date.now()}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      fullDescription: formData.get('fullDescription') as string,
      type: formData.get('type') as 'external' | 'session',
      platform: formData.get('platform') as string,
      url: formData.get('url') as string,
      price: Number(formData.get('price')),
      priceEGP: Number(formData.get('priceEGP')),
      currency: formData.get('currency') as string,
      duration: formData.get('duration') as string,
      image: formData.get('image') as string,
      instructor: formData.get('instructor') as string,
      skills: (formData.get('skills') as string).split(',').map(s => s.trim())
    };
    await DataService.saveCourse(course);
    await refreshDashboard();
  };

  const handleMentorshipSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsActionPending(true);
    const formData = new FormData(e.currentTarget);
    const session: MentorshipSession = {
      id: editingItem?.id || `ses-${Date.now()}`,
      title: formData.get('title') as string,
      duration: formData.get('duration') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      priceEGP: Number(formData.get('priceEGP')),
      topics: (formData.get('topics') as string).split(',').map(s => s.trim())
    };
    await DataService.saveMentorshipSession(session);
    await refreshDashboard();
  };

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setIsAdding(false);
    setEditingItem(null);
    setErrorMsg(null);
  };

  const filterBookings = (bookings: Booking[]) => {
    const now = new Date();
    return bookings.filter(b => {
      const slot = data?.slots.find(s => s.id === b.slotId);
      if (!slot) return false;
      const sessionTime = new Date(slot.dateTime);
      if (bookingFilter === 'upcoming') return sessionTime >= now;
      if (bookingFilter === 'past') return sessionTime < now;
      return true;
    }).sort((a,b) => b.timestamp.localeCompare(a.timestamp));
  };

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Admin Terminal</span>
    </div>
  );
  
  if (!data) return null;

  const sidebarItems = [
    { id: 'overview', label: 'Analytics', icon: List },
    { id: 'about', label: 'Identity', icon: User },
    { id: 'projects', label: 'Works', icon: Briefcase },
    { id: 'experience', label: 'Timeline', icon: GraduationCap },
    { id: 'courses', label: 'Academy', icon: BookOpen },
    { id: 'registrations', label: 'Enrollments', icon: FileText },
    { id: 'mentorship', label: 'Sessions', icon: Tag },
    { id: 'slots', label: 'Scheduler', icon: Calendar },
    { id: 'bookings', label: 'Bookings', icon: DollarSign },
    { id: 'messages', label: 'Inbox', icon: MessageSquare },
  ];

  const renderSectionHeader = (title: string, subtitle: string, showAdd = true) => (
    <div className="flex justify-between items-end mb-10">
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">{title}</h2>
        <p className="text-gray-500 font-medium">{subtitle}</p>
      </div>
      {showAdd && !(isAdding || editingItem) && (
        <button onClick={() => setIsAdding(true)} className="bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-800 transition-all shadow-xl flex items-center gap-2">
          <Plus className="w-5 h-5" /> New Entry
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex text-gray-900">
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col pt-24 pb-8 px-6 fixed inset-y-0 shadow-sm z-50">
        <div className="mb-8 px-4">
           <div className={`flex items-center gap-3 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${isConnected ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isConnected ? 'Sync Online' : 'Cloud Sync Offline'}
           </div>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
          {sidebarItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => switchTab(item.id as Tab)} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === item.id ? 'bg-indigo-700 text-white shadow-lg shadow-indigo-100' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <button onClick={onBack} className="mt-8 flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-400 border-t border-gray-50 pt-8 hover:text-red-600 transition-colors">Terminate Admin</button>
      </aside>

      <main className="flex-1 ml-72 p-12">
        <div className="max-w-6xl mx-auto">
          
          {activeTab === 'courses' && (
            <div className="space-y-8">
              {renderSectionHeader("Academy Director", "Manage learning modules and platform curriculum.")}
              {(isAdding || editingItem) ? (
                <form onSubmit={handleCourseSubmit} className="bg-white p-12 rounded-[40px] shadow-sm space-y-8 border border-gray-100">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 block mb-2">Course Title</label>
                      <input name="title" defaultValue={editingItem?.title} required className="w-full bg-slate-50 border-none p-4 rounded-xl font-bold text-gray-900" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 block mb-2">Investment Price (USD)</label>
                      <input type="number" name="price" defaultValue={editingItem?.price} required className="w-full bg-slate-50 border-none p-4 rounded-xl font-bold text-gray-900" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 block mb-2">Investment Price (EGP)</label>
                      <input type="number" name="priceEGP" defaultValue={editingItem?.priceEGP} className="w-full bg-slate-50 border-none p-4 rounded-xl font-bold text-gray-900" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button type="submit" disabled={isActionPending} className="bg-indigo-700 text-white font-black px-12 py-5 rounded-2xl flex items-center gap-3 shadow-xl">
                      {isActionPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      Save Academy Module
                    </button>
                    <button type="button" onClick={() => switchTab('courses')} className="bg-slate-100 px-10 py-5 rounded-2xl font-black text-xs uppercase text-gray-500">Discard</button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.courses.map(c => (
                    <div key={c.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col group hover:shadow-md transition-all">
                      <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 mb-6">
                         <img src={c.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <h4 className="font-black text-gray-900 mb-1">{c.title}</h4>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{c.price} USD / {c.priceEGP || c.price * 50} EGP</p>
                      <div className="flex gap-2 mt-6 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => setEditingItem(c)} className="p-2.5 text-indigo-400 hover:bg-indigo-50 rounded-xl transition-all"><Edit3 className="w-4 h-4" /></button>
                         <button onClick={async () => { if(confirm('Delete course?')) { await DataService.deleteCourse(c.id); refreshDashboard(); } }} className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-8">
              {renderSectionHeader("Booking Terminal", "View and manage upcoming mentee missions.", false)}
              <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Mentee Protocol</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Context</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Receipt</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filterBookings(data.bookings).map(b => (
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-10 py-8">
                          <p className="font-black text-slate-900">{b.userName}</p>
                          <p className="text-[10px] font-bold text-slate-400">{b.userEmail} | {b.userPhone}</p>
                        </td>
                        <td className="px-10 py-8">
                          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-[8px] font-black uppercase">{b.sessionId}</span>
                        </td>
                        <td className="px-10 py-8">
                          {b.paymentReceipt && (
                            <button onClick={() => setViewingReceipt(b.paymentReceipt!)} className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2">
                              <ImageIcon className="w-4 h-4" /> <span className="text-[10px] font-black uppercase">View</span>
                            </button>
                          )}
                        </td>
                        <td className="px-10 py-8 text-right">
                          <p className="font-black text-slate-900">{b.currency} {b.amount}</p>
                          <span className="text-[8px] font-black text-green-600 uppercase">Verification Pending</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'registrations' && (
            <div className="space-y-8">
              {renderSectionHeader("Academy Enrollments", "Direct registrations and payment proofs for live sessions.", false)}
              <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Student</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Course</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Receipt</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.registrations.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-10 py-8">
                          <p className="font-black text-slate-900">{r.userName}</p>
                          <p className="text-[10px] font-bold text-slate-400">{r.userEmail} | {r.userPhone}</p>
                        </td>
                        <td className="px-10 py-8">
                           <p className="text-xs font-bold text-slate-700">{r.courseTitle}</p>
                        </td>
                        <td className="px-10 py-8">
                           {r.paymentReceipt && (
                             <button onClick={() => setViewingReceipt(r.paymentReceipt!)} className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2">
                               <ImageIcon className="w-4 h-4" /> <span className="text-[10px] font-black uppercase">Verify</span>
                             </button>
                           )}
                        </td>
                        <td className="px-10 py-8 text-right">
                          <p className="font-black text-slate-900">{r.selectedCurrency} {r.paidAmount}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Receipt Viewer Modal */}
      <AnimatePresence>
        {viewingReceipt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-12 bg-black/90 backdrop-blur-xl">
             <button onClick={() => setViewingReceipt(null)} className="absolute top-8 right-8 text-white"><X className="w-10 h-10" /></button>
             <motion.img 
               initial={{ scale: 0.9, opacity: 0 }} 
               animate={{ scale: 1, opacity: 1 }} 
               src={viewingReceipt} 
               className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain" 
             />
          </div>
        )}
      </AnimatePresence>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Dashboard;