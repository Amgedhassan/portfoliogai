
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Trash2, Plus, DollarSign, List, Briefcase, User, MessageSquare, BookOpen, GraduationCap, CheckCircle2, Clock, X, Save, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { DataService } from '../dataService';
import { 
  PortfolioData, 
  Project, 
  Experience, 
  Course,
  CurriculumItem,
  MentorshipSession,
  CaseStudyOutcome
} from '../types';

type Tab = 'overview' | 'about' | 'projects' | 'experience' | 'courses' | 'mentorship' | 'messages' | 'registrations';

const Dashboard: React.FC<{ onBack: () => void; onRefresh: () => void }> = ({ onBack, onRefresh }) => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isActionPending, setIsActionPending] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  
  // States for nested array editing
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
  const [outcomes, setOutcomes] = useState<CaseStudyOutcome[]>([]);

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
      console.error("Failed to fetch dashboard data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    fetchCurrentData();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (editingItem) {
      setCurriculum(editingItem.curriculum || []);
      setOutcomes(editingItem.outcomes || []);
    } else {
      setCurriculum([]);
      setOutcomes([]);
    }
  }, [editingItem]);

  const refreshDashboard = async () => {
    setIsActionPending(false);
    setIsAdding(false);
    setEditingItem(null);
    setCurriculum([]);
    setOutcomes([]);
    await fetchCurrentData();
    onRefresh();
  };

  const handleAboutSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsActionPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      await DataService.updateAbout({
        title: formData.get('title') as string || '',
        summary: formData.get('summary') as string || '',
        philosophy: formData.get('philosophy') as string || '',
      });
      await refreshDashboard();
    } catch (err) {
      console.error(err);
      alert("Note: Server sync failed. Identity saved to browser memory.");
      await refreshDashboard();
    } finally {
      setIsActionPending(false);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsActionPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      const project: Project = {
        id: editingItem?.id || `proj-${Date.now()}`,
        title: formData.get('title') as string || '',
        description: formData.get('description') as string || '',
        longDescription: formData.get('longDescription') as string || '',
        challenge: formData.get('challenge') as string || '',
        solution: formData.get('solution') as string || '',
        impact: formData.get('impact') as string || '',
        image: formData.get('image') as string || '',
        role: formData.get('role') as string || '',
        timeline: formData.get('timeline') as string || '',
        tools: (formData.get('tools') as string || '').split(',').map(s => s.trim()).filter(Boolean),
        tags: (formData.get('tags') as string || '').split(',').map(s => s.trim()).filter(Boolean),
        outcomes: outcomes
      };
      await DataService.saveProject(project);
      await refreshDashboard();
    } catch (err) {
      console.error(err);
      alert("Note: Server sync failed. Work saved locally.");
      await refreshDashboard();
    } finally {
      setIsActionPending(false);
    }
  };

  const handleExperienceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsActionPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      const experience: Experience = {
        id: editingItem?.id || `exp-${Date.now()}`,
        role: formData.get('role') as string || '',
        company: formData.get('company') as string || '',
        period: formData.get('period') as string || '',
        description: (formData.get('description') as string || '').split('\n').filter(Boolean),
      };
      await DataService.saveExperience(experience);
      await refreshDashboard();
    } catch (err) {
      console.error("Save Experience Error:", err);
      alert("Sync failed. Record stored locally.");
      await refreshDashboard();
    } finally {
      setIsActionPending(false);
    }
  };

  const handleMentorshipSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsActionPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      const session: MentorshipSession = {
        id: editingItem?.id || `ment-${Date.now()}`,
        title: formData.get('title') as string || '',
        duration: formData.get('duration') as string || '',
        description: formData.get('description') as string || '',
        topics: (formData.get('topics') as string || '').split(',').map(s => s.trim()).filter(Boolean),
      };
      await DataService.saveMentorship(session);
      await refreshDashboard();
    } catch (err) {
      console.error(err);
      alert("Sync failed. Mentorship offering stored locally.");
      await refreshDashboard();
    } finally {
      setIsActionPending(false);
    }
  };

  const handleCourseSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsActionPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      const course: Course = {
        id: editingItem?.id || `course-${Date.now()}`,
        title: formData.get('title') as string || '',
        description: formData.get('description') as string || '',
        fullDescription: formData.get('fullDescription') as string || '',
        type: formData.get('type') as 'external' | 'session',
        platform: formData.get('platform') as string || '',
        url: formData.get('url') as string || '',
        price: Number(formData.get('price') || 0),
        currency: formData.get('currency') as string || 'USD',
        duration: formData.get('duration') as string || '',
        date: formData.get('date') as string || '',
        image: formData.get('image') as string || '',
        instructor: 'Amgad Hassan',
        skills: (formData.get('skills') as string || '').split(',').map(s => s.trim()).filter(Boolean),
        curriculum: curriculum
      };
      await DataService.saveCourse(course);
      await refreshDashboard();
    } catch (err) {
      console.error(err);
      alert("Sync failed. Academy course stored locally.");
      await refreshDashboard();
    } finally {
      setIsActionPending(false);
    }
  };

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setIsAdding(false);
    setEditingItem(null);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="w-12 h-12 text-indigo-600 animate-spin" /></div>;
  if (!data) return null;

  const sidebarItems = [
    { id: 'overview', label: 'Analytics', icon: List },
    { id: 'about', label: 'Identity', icon: User },
    { id: 'projects', label: 'Works', icon: Briefcase },
    { id: 'experience', label: 'Timeline', icon: GraduationCap },
    { id: 'courses', label: 'Academy', icon: BookOpen },
    { id: 'mentorship', label: 'Coaching', icon: Clock },
    { id: 'registrations', label: 'Students', icon: DollarSign },
    { id: 'messages', label: 'Inbox', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex text-gray-900">
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col pt-24 pb-8 px-6 fixed inset-y-0 shadow-sm z-50">
        <div className="mb-8 px-4">
           <div className={`flex items-center gap-3 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${isConnected ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isConnected ? 'Server Linked' : 'Cloud Offline'}
           </div>
        </div>
        <nav className="flex-1 space-y-2">
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
        <button onClick={onBack} className="mt-8 flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 border-t border-gray-50 pt-8 hover:text-red-600 transition-colors">Terminate Admin</button>
      </aside>

      <main className="flex-1 ml-72 p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-12">
              <header className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black text-gray-900 mb-2">Portfolio Statistics</h1>
                  <p className="text-gray-500 font-medium">Core engine metrics and real-time user data.</p>
                </div>
                <button onClick={refreshDashboard} className="p-4 bg-white rounded-2xl border border-gray-100 text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm">
                  <RefreshCw className="w-6 h-6" />
                </button>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">Gross Sales</p>
                  <p className="text-6xl font-black text-green-700 tracking-tighter">${(data.registrations || []).reduce((acc, r) => {
                    const c = (data.courses || []).find(course => course.id === r.courseId);
                    return acc + (c?.price || 0);
                  }, 0)}</p>
                </div>
                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">Total Students</p>
                  <p className="text-6xl font-black text-indigo-700 tracking-tighter">{(data.registrations || []).length}</p>
                </div>
                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">New Messages</p>
                  <p className="text-6xl font-black text-purple-700 tracking-tighter">{(data.messages || []).filter(m => m.status === 'new').length}</p>
                </div>
              </div>
            </div>
          )}

          {/* ABOUT SECTION */}
          {activeTab === 'about' && (
            <div className="space-y-8">
              <header><h2 className="text-3xl font-bold">Profile Settings</h2><p className="text-gray-600">Core narrative used by the site and AI agent.</p></header>
              <form onSubmit={handleAboutSubmit} className="bg-white p-12 rounded-[40px] shadow-sm space-y-8 border border-gray-100">
                <div className="grid gap-8">
                  <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Professional Title</label><input required name="title" defaultValue={data.about?.title} className="w-full bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900" /></div>
                  <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Executive Summary</label><textarea required name="summary" defaultValue={data.about?.summary} className="w-full bg-gray-50 p-4 rounded-xl h-40 border-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-medium text-gray-900" /></div>
                  <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Product Philosophy</label><input required name="philosophy" defaultValue={data.about?.philosophy} className="w-full bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 font-bold italic text-gray-900" /></div>
                </div>
                <button type="submit" disabled={isActionPending} className="bg-indigo-700 text-white font-black px-12 py-5 rounded-2xl flex items-center gap-3 hover:bg-indigo-800 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50">
                  {isActionPending ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                  Synchronize Identity
                </button>
              </form>
            </div>
          )}

          {/* PROJECTS SECTION */}
          {activeTab === 'projects' && (
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div><h2 className="text-3xl font-bold">Works Repository</h2><p className="text-gray-600">Add or refine deep-dive case studies.</p></div>
                {!(isAdding || editingItem) && <button onClick={() => setIsAdding(true)} className="bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-800 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"><Plus className="w-5 h-5" /> New Work</button>}
              </div>
              
              {(isAdding || editingItem) ? (
                <form onSubmit={handleProjectSubmit} className="bg-white p-12 rounded-[40px] shadow-sm space-y-12 border border-gray-100">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Work Title</label><input required name="title" defaultValue={editingItem?.title} className="w-full bg-gray-50 p-4 rounded-xl border-none font-bold text-gray-900" /></div>
                    <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Professional Role</label><input required name="role" defaultValue={editingItem?.role} className="w-full bg-gray-50 p-4 rounded-xl border-none font-bold text-gray-900" /></div>
                    <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Timeline</label><input required name="timeline" defaultValue={editingItem?.timeline} className="w-full bg-gray-50 p-4 rounded-xl border-none font-bold text-gray-900" /></div>
                    <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Cover Image URL</label><input required name="image" defaultValue={editingItem?.image} className="w-full bg-gray-50 p-4 rounded-xl border-none font-bold text-gray-900" /></div>
                  </div>
                  <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Index Summary</label><input required name="description" defaultValue={editingItem?.description} className="w-full bg-gray-50 p-4 rounded-xl border-none font-medium text-gray-900" /></div>
                  <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Toolbox (Comma separated)</label><input name="tools" defaultValue={editingItem?.tools?.join(', ')} className="w-full bg-gray-50 p-4 rounded-xl border-none font-mono text-xs text-gray-900" /></div>
                  
                  <div className="grid gap-8 border-t border-gray-100 pt-12">
                    <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Deep Narrative (Case Study Body)</label><textarea name="longDescription" defaultValue={editingItem?.longDescription} className="w-full bg-gray-50 p-4 rounded-xl h-48 border-none leading-relaxed text-gray-900" /></div>
                    <div className="grid md:grid-cols-2 gap-8">
                       <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">The Challenge</label><textarea name="challenge" defaultValue={editingItem?.challenge} className="w-full bg-gray-50 p-4 rounded-xl h-32 border-none text-gray-900" /></div>
                       <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">The Impact</label><textarea name="impact" defaultValue={editingItem?.impact} className="w-full bg-gray-50 p-4 rounded-xl h-32 border-none text-gray-900" /></div>
                    </div>
                  </div>

                  {/* Impact Outcomes Editor */}
                  <div className="space-y-6 pt-12 border-t border-gray-100">
                    <div className="flex justify-between items-center"><h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Hard Metrics</h3><button type="button" onClick={() => setOutcomes([...outcomes, { label: '', value: '', description: '' }])} className="text-indigo-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><Plus className="w-4 h-4" /> Add Metric</button></div>
                    <div className="grid gap-4">
                      {outcomes.map((o, i) => (
                        <div key={i} className="p-8 bg-gray-50 rounded-[2rem] grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                          <button type="button" onClick={() => setOutcomes(outcomes.filter((_, idx) => idx !== i))} className="absolute -top-3 -right-3 bg-white p-2 rounded-full shadow-lg text-red-600 hover:bg-red-600 hover:text-white transition-all"><X className="w-4 h-4" /></button>
                          <div><label className="text-[8px] font-black uppercase text-gray-600 block mb-2">Label (e.g. ROI)</label><input placeholder="Metric Name" value={o.label} onChange={e => { const next = [...outcomes]; next[i].label = e.target.value; setOutcomes(next); }} className="w-full p-4 rounded-xl border-none bg-white font-bold text-gray-900" /></div>
                          <div><label className="text-[8px] font-black uppercase text-gray-600 block mb-2">Value (e.g. 95%)</label><input placeholder="Value" value={o.value} onChange={e => { const next = [...outcomes]; next[i].value = e.target.value; setOutcomes(next); }} className="w-full p-4 rounded-xl border-none bg-white font-black text-indigo-700" /></div>
                          <div><label className="text-[8px] font-black uppercase text-gray-600 block mb-2">Context</label><input placeholder="Description" value={o.description} onChange={e => { const next = [...outcomes]; next[i].description = e.target.value; setOutcomes(next); }} className="w-full p-4 rounded-xl border-none bg-white text-sm text-gray-900" /></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-12 border-t border-gray-100">
                    <button type="submit" disabled={isActionPending} className="bg-indigo-700 text-white font-black px-12 py-5 rounded-2xl flex items-center gap-3 hover:bg-indigo-800 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50">
                      {isActionPending ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                      Publish Work
                    </button>
                    <button type="button" onClick={() => switchTab('projects')} className="bg-gray-100 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all text-gray-900">Discard</button>
                  </div>
                </form>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {(data.projects || []).map(p => (
                    <div key={p.id} className="bg-white p-6 rounded-[2.5rem] flex items-center gap-6 group border border-gray-100 hover:border-indigo-100 transition-all shadow-sm">
                      <img src={p.image} className="w-24 h-24 rounded-3xl object-cover shadow-lg" alt="" />
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900 leading-tight mb-1">{p.title}</h4>
                        <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest">{p.role}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => setEditingItem(p)} className="p-4 bg-gray-50 rounded-2xl text-indigo-700 hover:bg-indigo-700 hover:text-white transition-all"><Plus className="w-5 h-5" /></button>
                        <button onClick={async () => { if(confirm('Permanently delete this case study?')) { try { await DataService.deleteProject(p.id); await refreshDashboard(); } catch(e) { console.error(e); } } }} className="p-4 bg-gray-50 rounded-2xl text-red-600 hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* EXPERIENCE SECTION */}
          {activeTab === 'experience' && (
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div><h2 className="text-3xl font-bold">Career Timeline</h2><p className="text-gray-600">Manage your historical trajectory.</p></div>
                {!(isAdding || editingItem) && <button onClick={() => setIsAdding(true)} className="bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-800 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"><Plus className="w-5 h-5" /> Add Experience</button>}
              </div>

              {(isAdding || editingItem) ? (
                <form onSubmit={handleExperienceSubmit} className="bg-white p-12 rounded-[40px] shadow-sm space-y-8 border border-gray-100">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Professional Role</label><input required name="role" defaultValue={editingItem?.role} className="w-full bg-gray-50 p-4 rounded-xl border-none font-bold text-gray-900" /></div>
                    <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Enterprise Name</label><input required name="company" defaultValue={editingItem?.company} className="w-full bg-gray-50 p-4 rounded-xl border-none font-bold text-indigo-700" /></div>
                  </div>
                  <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Tenure Period (e.g. 2021–Present)</label><input required name="period" defaultValue={editingItem?.period} className="w-full bg-gray-50 p-4 rounded-xl border-none font-bold text-gray-900" /></div>
                  <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Impact Points (Each line is a bullet)</label><textarea required name="description" defaultValue={editingItem?.description?.join('\n')} className="w-full bg-gray-50 p-4 rounded-xl h-48 border-none font-medium leading-relaxed text-gray-900" /></div>
                  <div className="flex gap-4 pt-8 border-t border-gray-100">
                    <button type="submit" disabled={isActionPending} className="bg-indigo-700 text-white font-black px-12 py-5 rounded-2xl flex items-center gap-3 hover:bg-indigo-800 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50">
                      {isActionPending ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                      Update Timeline
                    </button>
                    <button type="button" onClick={() => switchTab('experience')} className="bg-gray-100 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all text-gray-900">Discard</button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {(data.experiences || []).map(e => (
                    <div key={e.id} className="bg-white p-8 rounded-[2.5rem] flex items-center justify-between group border border-gray-100 hover:border-indigo-100 transition-all shadow-sm">
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-700 shadow-sm shadow-indigo-50"><Briefcase className="w-7 h-7" /></div>
                        <div>
                          <h4 className="font-black text-xl text-gray-900">{e.role}</h4>
                          <p className="text-gray-600 font-black uppercase text-[10px] tracking-[0.2em]">{e.company} • {e.period}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setEditingItem(e)} className="p-4 bg-gray-50 rounded-2xl text-indigo-700 hover:bg-indigo-700 hover:text-white transition-all"><Plus className="w-6 h-6" /></button>
                        <button onClick={async () => { if(confirm('Remove this career record?')) { try { await DataService.deleteExperience(e.id); await refreshDashboard(); } catch(e) { console.error(e); } } }} className="p-4 bg-gray-50 rounded-2xl text-red-600 hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-6 h-6" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ACADEMY SECTION */}
          {activeTab === 'courses' && (
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div><h2 className="text-3xl font-bold">Course Management</h2><p className="text-gray-600">Curate educational roadmap.</p></div>
                {!(isAdding || editingItem) && <button onClick={() => setIsAdding(true)} className="bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-800 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"><Plus className="w-5 h-5" /> New Course</button>}
              </div>

              {(isAdding || editingItem) ? (
                <form onSubmit={handleCourseSubmit} className="bg-white p-12 rounded-[40px] shadow-sm space-y-12 border border-gray-100">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Course Title</label><input required name="title" defaultValue={editingItem?.title} className="w-full bg-gray-50 p-4 rounded-xl border-none font-bold text-gray-900" /></div>
                    <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Delivery Format</label><select name="type" defaultValue={editingItem?.type || 'session'} className="w-full bg-gray-50 p-4 rounded-xl border-none font-bold text-indigo-700"><option value="external">On-Demand (External Link)</option><option value="session">Live Workshop (Internal)</option></select></div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Enrollment Fee</label><input type="number" name="price" defaultValue={editingItem?.price} className="w-full bg-gray-50 p-4 rounded-xl border-none font-black text-green-700" /></div>
                    <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Platform Context</label><input name="platform" defaultValue={editingItem?.platform} className="w-full bg-gray-50 p-4 rounded-xl border-none font-bold text-gray-700" /></div>
                    <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Thumbnail URL</label><input name="image" defaultValue={editingItem?.image} className="w-full bg-gray-50 p-4 rounded-xl border-none text-xs text-gray-900" /></div>
                  </div>
                  <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">External Link (Optional)</label><input name="url" defaultValue={editingItem?.url} className="w-full bg-gray-50 p-4 rounded-xl border-none font-medium text-blue-700" placeholder="https://..." /></div>
                  <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Brief Synopsis</label><textarea name="description" defaultValue={editingItem?.description} className="w-full bg-gray-50 p-4 rounded-xl h-24 border-none font-medium text-gray-900" /></div>
                  
                  {/* Curriculum Editor */}
                  <div className="space-y-6 pt-12 border-t border-gray-100">
                    <div className="flex justify-between items-center"><h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Course Roadmap</h3><button type="button" onClick={() => setCurriculum([...curriculum, { title: '', description: '' }])} className="text-indigo-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><Plus className="w-4 h-4" /> Add Lesson</button></div>
                    <div className="grid gap-4">
                      {curriculum.map((c, i) => (
                        <div key={i} className="p-8 bg-gray-50 rounded-[2.5rem] space-y-4 relative">
                          <button type="button" onClick={() => setCurriculum(curriculum.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg text-red-600 hover:bg-red-600 hover:text-white transition-all"><X className="w-4 h-4" /></button>
                          <input placeholder="Lesson Title" value={c.title} onChange={e => { const next = [...curriculum]; next[i].title = e.target.value; setCurriculum(next); }} className="w-full p-4 rounded-xl border-none bg-white font-bold text-gray-900" />
                          <textarea placeholder="Learning Objective" value={c.description} onChange={e => { const next = [...curriculum]; next[i].description = e.target.value; setCurriculum(next); }} className="w-full p-4 rounded-xl border-none bg-white text-sm h-24 leading-relaxed text-gray-900" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-12 border-t border-gray-100">
                    <button type="submit" disabled={isActionPending} className="bg-indigo-700 text-white font-black px-12 py-5 rounded-2xl flex items-center gap-3 hover:bg-indigo-800 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50">
                      {isActionPending ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                      Publish Curriculum
                    </button>
                    <button type="button" onClick={() => switchTab('courses')} className="bg-gray-100 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all text-gray-900">Discard</button>
                  </div>
                </form>
              ) : (
                <div className="grid gap-6">
                  {(data.courses || []).map(c => (
                    <div key={c.id} className="bg-white p-6 rounded-[2.5rem] flex items-center gap-6 group border border-gray-100 hover:border-indigo-100 transition-all shadow-sm">
                      <img src={c.image} className="w-24 h-24 rounded-3xl object-cover shadow-lg" alt="" />
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900 leading-tight mb-1">{c.title}</h4>
                        <div className="flex items-center gap-3">
                           <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${c.type === 'session' ? 'bg-indigo-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
                             {c.type === 'session' ? 'Live Session' : 'On-Demand'}
                           </span>
                           <span className="text-[10px] text-indigo-700 font-bold">{c.platform}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingItem(c)} className="p-4 bg-gray-50 rounded-2xl text-indigo-700 hover:bg-indigo-700 hover:text-white transition-all"><Plus className="w-5 h-5" /></button>
                        <button onClick={async () => { if(confirm('Permanently delete this curriculum?')) { try { await DataService.deleteCourse(c.id); await refreshDashboard(); } catch(e) { console.error(e); } } }} className="p-4 bg-gray-50 rounded-2xl text-red-600 hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MENTORSHIP SECTION */}
          {activeTab === 'mentorship' && (
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div><h2 className="text-3xl font-bold">Mentorship Inventory</h2><p className="text-gray-600">Manage coaching options.</p></div>
                {!(isAdding || editingItem) && <button onClick={() => setIsAdding(true)} className="bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-800 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"><Plus className="w-5 h-5" /> New Session</button>}
              </div>

              {(isAdding || editingItem) ? (
                <form onSubmit={handleMentorshipSubmit} className="bg-white p-12 rounded-[40px] shadow-sm space-y-8 border border-gray-100">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Session Title</label><input required name="title" defaultValue={editingItem?.title} className="w-full bg-gray-50 p-4 rounded-xl border-none font-bold text-gray-900" /></div>
                    <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Duration (e.g. 60 Mins)</label><input required name="duration" defaultValue={editingItem?.duration} className="w-full bg-gray-50 p-4 rounded-xl border-none font-bold text-indigo-700" /></div>
                  </div>
                  <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Descriptive Value</label><textarea required name="description" defaultValue={editingItem?.description} className="w-full bg-gray-50 p-4 rounded-xl h-32 border-none font-medium leading-relaxed text-gray-900" /></div>
                  <div><label className="text-[10px] font-black uppercase text-gray-600 block mb-2">Key Topics (Comma separated)</label><input name="topics" defaultValue={editingItem?.topics?.join(', ')} className="w-full bg-gray-50 p-4 rounded-xl border-none font-bold text-gray-700" /></div>
                  <div className="flex gap-4 pt-8 border-t border-gray-100">
                    <button type="submit" disabled={isActionPending} className="bg-indigo-700 text-white font-black px-12 py-5 rounded-2xl flex items-center gap-3 hover:bg-indigo-800 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50">
                      {isActionPending ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                      Sync Offering
                    </button>
                    <button type="button" onClick={() => switchTab('mentorship')} className="bg-gray-100 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all text-gray-900">Discard</button>
                  </div>
                </form>
              ) : (
                <div className="grid gap-6">
                  {(data.mentorship || []).map(m => (
                    <div key={m.id} className="bg-white p-8 rounded-[2.5rem] flex items-center justify-between group border border-gray-100 hover:border-indigo-100 transition-all shadow-sm">
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 bg-purple-50 rounded-3xl flex items-center justify-center text-purple-700 shadow-sm shadow-purple-50"><Clock className="w-7 h-7" /></div>
                        <div>
                          <h4 className="font-black text-xl text-gray-900">{m.title}</h4>
                          <p className="text-gray-600 font-black uppercase text-[10px] tracking-[0.2em]">{m.duration}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setEditingItem(m)} className="p-4 bg-gray-50 rounded-2xl text-indigo-700 hover:bg-indigo-700 hover:text-white transition-all"><Plus className="w-6 h-6" /></button>
                        <button onClick={async () => { if(confirm('Withdraw this coaching option?')) { try { await DataService.deleteMentorship(m.id); await refreshDashboard(); } catch(e) { console.error(e); } } }} className="p-4 bg-gray-50 rounded-2xl text-red-600 hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-6 h-6" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MESSAGES SECTION */}
          {activeTab === 'messages' && (
            <div className="space-y-8">
              <header><h2 className="text-3xl font-bold">Inquiry Inbox</h2><p className="text-gray-600">Contact gateway monitoring.</p></header>
              <div className="space-y-4">
                {(data.messages || []).map(m => (
                  <div key={m.id} className={`bg-white p-8 rounded-[2.5rem] shadow-sm flex items-start justify-between group border border-gray-100 hover:border-indigo-100 transition-all ${m.status === 'new' ? 'border-l-4 border-indigo-700' : ''}`}>
                    <div className="space-y-4 flex-1 pr-12">
                      <div className="flex items-center gap-4">
                        <h4 className="font-black text-xl text-gray-900">{m.name}</h4>
                        <span className="text-gray-400">•</span>
                        <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">{m.email}</span>
                        <span className="ml-auto text-[10px] font-black text-gray-600 uppercase tracking-widest">{m.date}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed font-medium bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50">{m.message}</p>
                    </div>
                    <div className="flex gap-2">
                      {m.status === 'new' && (
                        <button onClick={async () => { try { await DataService.markMessageAsRead(m.id); await refreshDashboard(); } catch(e) { console.error(e); } }} className="p-4 bg-indigo-50 rounded-2xl text-indigo-700 hover:bg-indigo-700 hover:text-white transition-all shadow-sm"><CheckCircle2 className="w-6 h-6" /></button>
                      )}
                      <button onClick={async () => { if(confirm('Archive message?')) { try { await DataService.deleteMessage(m.id); await refreshDashboard(); } catch(e) { console.error(e); } } }} className="p-4 bg-gray-50 rounded-2xl text-red-600 hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-6 h-6" /></button>
                    </div>
                  </div>
                ))}
                {(data.messages || []).length === 0 && <div className="bg-white p-24 rounded-[3rem] text-center border border-gray-100"><p className="text-gray-600 font-black text-[10px] uppercase tracking-[0.5em]">Clear Channels</p></div>}
              </div>
            </div>
          )}

          {/* REGISTRATIONS SECTION */}
          {activeTab === 'registrations' && (
            <div className="space-y-8">
              <header><h2 className="text-3xl font-bold">Enrolled Database</h2><p className="text-gray-600">Active Academy student roster.</p></header>
              <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-600 tracking-widest">Student Index</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-600 tracking-widest">Active Curriculum</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-600 tracking-widest">Status</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-600 tracking-widest text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(data.registrations || []).map(r => (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-10 py-8">
                          <p className="font-black text-gray-900">{r.userName}</p>
                          <p className="text-[10px] font-bold text-indigo-700 uppercase">{r.userEmail}</p>
                        </td>
                        <td className="px-10 py-8 font-black text-sm text-gray-700">{r.courseTitle}</td>
                        <td className="px-10 py-8"><span className="bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Confirmed</span></td>
                        <td className="px-10 py-8 text-right text-xs text-gray-600 font-black">{r.date}</td>
                      </tr>
                    ))}
                    {(data.registrations || []).length === 0 && <tr><td colSpan={4} className="p-24 text-center text-gray-600 font-black text-[10px] uppercase tracking-widest">No active students recorded.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
