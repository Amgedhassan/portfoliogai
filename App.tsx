
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Loader2, ArrowRight, ChevronRight, Layers, Layout, BookOpen, 
  ExternalLink, Play, Zap, Shield, Target, TrendingUp, BarChart3, 
  Rocket, CheckCircle2, Globe, Cpu, MousePointer2 
} from 'lucide-react';
import Navbar from './components/Navbar.tsx';
import ProjectDetail from './components/ProjectDetail.tsx';
import CoursePage from './components/CoursePage.tsx';
import AboutDetail from './components/AboutDetail.tsx';
import MentorshipDetail from './components/MentorshipDetail.tsx';
import Dashboard from './components/Dashboard.tsx';
import Login from './components/Login.tsx';
import ProjectsGallery from './components/ProjectsGallery.tsx';
import CoursesGallery from './components/CoursesGallery.tsx';
import ContactForm from './components/ContactForm.tsx';
import Footer from './components/Footer.tsx';
import SophisticatedCarousel from './components/SophisticatedCarousel.tsx';
import VerticalTimeline from './components/VerticalTimeline.tsx';
import SceneBackground from './components/SceneBackground.tsx';
import PageTransition from './components/PageTransition.tsx';
// Fix: Import AIAssistant component
import AIAssistant from './components/AIAssistant.tsx';
import { DataService } from './dataService.ts';
import { Project, PortfolioData, AsyncState, Course } from './types.ts';
// Fix: Import PERSONAL_INFO used in the contact section
import { PERSONAL_INFO } from './constants.tsx';

export type View = 
  | { type: 'home'; anchor?: string }
  | { type: 'project'; data: Project }
  | { type: 'course_detail'; data: Course }
  | { type: 'about' }
  | { type: 'mentorship' }
  | { type: 'login' }
  | { type: 'dashboard' }
  | { type: 'gallery' }
  | { type: 'courses' };

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>({ type: 'home' });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [portfolio, setPortfolio] = useState<AsyncState<PortfolioData>>({
    data: null,
    loading: true,
    error: null,
  });
  
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  const heroY = useTransform(scrollY, [0, 500], [0, -160]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const loadData = async () => {
    try {
      const data = await DataService.getData();
      setPortfolio({ data, loading: false, error: null });
    } catch (err) {
      console.error("Critical error loading portfolio data:", err);
      setPortfolio({ data: null, loading: false, error: "Initialization failure" });
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('portfolio-updated', loadData);
    return () => window.removeEventListener('portfolio-updated', loadData);
  }, []);

  const handleNavigate = (view: View) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
      window.scrollTo(0, 0);
    }, 800);
  };

  if (portfolio.loading) {
    return (
      <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-[#020202] z-[1000]">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full" />
        </motion.div>
        <span className="mt-8 text-[10px] font-black uppercase tracking-[1em] text-white/60 animate-pulse">Syncing Environment</span>
      </div>
    );
  }

  if (!portfolio.data) {
    return (
      <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-[#020202] z-[1000] p-12 text-center">
        <h1 className="text-white text-2xl font-black mb-4 uppercase tracking-tighter">System Offline</h1>
        <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest">Reboot</button>
      </div>
    );
  }

  const nameParts = ["AMGAD", "HASSAN"];

  return (
    <div className="relative selection:bg-indigo-500 selection:text-white bg-transparent min-h-screen text-[#f8fafc]">
      <SceneBackground />
      {currentView.type !== 'dashboard' && <Navbar onNavigate={handleNavigate} currentView={currentView} />}
      <PageTransition isChanging={isTransitioning} />
      
      <AnimatePresence mode="wait">
        {currentView.type === 'home' && (
          <motion.main
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-transparent"
          >
            {/* Conversion-Focused Hero */}
            <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center px-8 md:px-32 py-40">
               <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-7xl mx-auto w-full relative z-10">
                  <div className="mb-12 overflow-hidden">
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-12 h-px bg-indigo-500/50" />
                      <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.8em]">
                        Strategic UX & Design Engineering
                      </span>
                    </motion.div>
                  </div>
                  
                  <div className="mb-12">
                    <motion.h1 
                      className="text-[14vw] md:text-[11vw] font-black text-white leading-[0.8] tracking-tighter uppercase"
                    >
                      <div className="overflow-hidden">
                        <motion.span
                          initial={{ y: "100%" }}
                          animate={{ y: 0 }}
                          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                          className="block"
                        >
                          {nameParts[0]}
                        </motion.span>
                      </div>
                      <div className="overflow-hidden">
                        <motion.span
                          initial={{ y: "100%" }}
                          animate={{ y: 0 }}
                          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                          className="block text-transparent"
                          style={{ WebkitTextStroke: '2px rgba(255,255,255,0.4)' }}
                        >
                          {nameParts[1]}.
                        </motion.span>
                      </div>
                    </motion.h1>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                    className="flex flex-col lg:flex-row lg:items-end justify-between gap-16"
                  >
                     <div className="max-w-3xl">
                       <p className="text-2xl md:text-4xl text-slate-400 font-medium leading-[1.1] mb-12 tracking-tight">
                         Designing <span className="text-white italic">Enterprise Efficiency</span> and <br className="hidden md:block"/> 
                         fueling <span className="text-white italic">Startup Velocity</span>.
                       </p>
                       <div className="flex flex-wrap gap-6">
                          <button onClick={() => document.getElementById('projects')?.scrollIntoView({behavior:'smooth'})} className="bg-white text-black px-10 py-5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-2xl">
                            Case Studies
                          </button>
                          <button onClick={() => document.getElementById('academy')?.scrollIntoView({behavior:'smooth'})} className="bg-indigo-700 text-white px-10 py-5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                            Product Academy
                          </button>
                       </div>
                     </div>
                     
                     <div className="hidden md:flex flex-col items-end gap-6 text-right">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">6+ Years Exp</span>
                          <p className="text-white font-bold text-sm">Fortune 500 Trusted</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/5 backdrop-blur-md">
                           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                           <span className="text-white font-bold text-[10px] uppercase tracking-widest">Available for Gigs</span>
                        </div>
                     </div>
                  </motion.div>
               </motion.div>
            </section>

            {/* Strategic Value Proposition */}
            <section className="py-48 px-8 bg-transparent border-y border-white/5 relative">
               <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 md:gap-24">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-12 p-12 bg-white/[0.02] rounded-[4rem] border border-white/5 backdrop-blur-3xl group hover:bg-white/[0.04] transition-all"
                  >
                     <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-8 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                        <Shield className="w-8 h-8" />
                     </div>
                     <h3 className="text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">For Enterprises:<br/><span className="text-indigo-400">Scale Without Friction.</span></h3>
                     <p className="text-slate-400 text-lg font-medium leading-relaxed">
                        I specialize in high-density data management and legacy system modernization. My designs focus on **reducing cognitive load, minimizing training time, and cutting operational costs.**
                     </p>
                     <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { text: 'Design Ops', icon: Layers },
                          { text: 'B2B Workflow Logic', icon: Cpu },
                          { text: 'Data Visualization', icon: BarChart3 },
                          { text: 'Governance', icon: Shield }
                        ].map(item => (
                          <li key={item.text} className="flex items-center gap-4 text-white font-bold text-xs uppercase tracking-widest bg-white/5 p-4 rounded-2xl">
                            <item.icon className="w-4 h-4 text-indigo-500" /> {item.text}
                          </li>
                        ))}
                     </ul>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-12 p-12 bg-indigo-500/[0.03] rounded-[4rem] border border-indigo-500/10 backdrop-blur-3xl group hover:bg-indigo-500/[0.06] transition-all"
                  >
                     <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-8 border border-indigo-500/20">
                        <Rocket className="w-8 h-8" />
                     </div>
                     <h3 className="text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">For Startups:<br/><span className="text-indigo-400">Ship to Fund.</span></h3>
                     <p className="text-slate-400 text-lg font-medium leading-relaxed">
                        I act as a **Fractional Head of Design**, building funding-ready MVPs in record time. I bridge the gap between complex tech stacks and user-friendly interfaces that drive early adoption.
                     </p>
                     <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { text: 'Rapid Prototyping', icon: Zap },
                          { text: 'MVP Roadmapping', icon: Target },
                          { text: 'Growth UX', icon: TrendingUp },
                          { text: 'Investor Demos', icon: Layout }
                        ].map(item => (
                          <li key={item.text} className="flex items-center gap-4 text-white font-bold text-xs uppercase tracking-widest bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/10">
                            <item.icon className="w-4 h-4 text-indigo-500" /> {item.text}
                          </li>
                        ))}
                     </ul>
                  </motion.div>
               </div>
            </section>

            {/* Evidence & Case Studies */}
            <section id="projects" className="py-32 relative bg-transparent overflow-hidden">
              <div className="max-w-7xl mx-auto px-8 mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                  <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[1em] mb-4 block">Proven Outcomes</span>
                  <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">The Proof is <br/> in the ROI.</h2>
                </div>
                <button onClick={() => handleNavigate({ type: 'gallery' })} className="group flex items-center gap-4 text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
                  Full Archive <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
              <SophisticatedCarousel 
                projects={portfolio.data.projects || []} 
                onProjectClick={(p) => handleNavigate({ type: 'project', data: p })}
              />
            </section>

            {/* Services Matrix - High Conversion */}
            <section className="py-48 bg-transparent">
               <div className="max-w-7xl mx-auto px-8">
                  <div className="text-center mb-32">
                     <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none mb-4">Core Gigs.</h2>
                     <p className="text-slate-500 text-xl font-medium tracking-tight">Standardized solutions for high-velocity teams.</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {[
                       { 
                         title: 'UX/UI Product Audit', 
                         icon: BarChart3, 
                         desc: 'A comprehensive evaluation of your product\'s usability and conversion blockers with a 10-day actionable roadmap.',
                         benefit: 'Identifies friction that costs revenue.'
                       },
                       { 
                         title: 'Design System Ops', 
                         icon: Layers, 
                         desc: 'Scalable library for multi-brand enterprises. Atomic components designed for engineering efficiency.',
                         benefit: 'Reduces technical labor costs by 40%.'
                       },
                       { 
                         title: 'B2B SaaS Launch', 
                         icon: Rocket, 
                         desc: 'End-to-end design for complex internal tools and customer-facing dashboard MVPs.',
                         benefit: 'Accelerates time-to-market.'
                       }
                     ].map((service, i) => (
                       <motion.div 
                        key={i}
                        whileHover={{ y: -10 }}
                        className="p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-8 backdrop-blur-sm hover:border-indigo-500/30 transition-all group"
                       >
                          <div className="flex justify-between items-start">
                             <service.icon className="w-10 h-10 text-indigo-400 group-hover:scale-110 transition-transform" />
                             <span className="text-[10px] font-black text-indigo-500/40 uppercase tracking-widest">Service_0{i+1}</span>
                          </div>
                          <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight">{service.title}</h4>
                          <p className="text-slate-500 text-sm font-medium leading-relaxed">{service.desc}</p>
                          <div className="pt-8 flex items-center gap-3">
                             <CheckCircle2 className="w-4 h-4 text-green-500" />
                             <span className="text-white font-bold text-xs italic">{service.benefit}</span>
                          </div>
                       </motion.div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Product Academy Section */}
            <section id="academy" className="py-48 px-8 bg-indigo-600 rounded-[5rem] mx-4 md:mx-16 relative overflow-hidden group">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
                  <div className="space-y-12">
                     <span className="text-white text-[10px] font-black uppercase tracking-[1em]">The Academy</span>
                     <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85]">Learn the <br/> B2B Logic.</h2>
                     <p className="text-indigo-100 text-xl md:text-2xl font-medium leading-relaxed">
                        I teach designers how to handle enterprise complexity, build scalable systems, and present design as a business value—not just an aesthetic choice.
                     </p>
                     <div className="flex flex-wrap gap-6">
                        <button onClick={() => handleNavigate({ type: 'courses' })} className="bg-white text-black px-12 py-6 rounded-full font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-2xl flex items-center gap-4">
                           Browse Curriculum <ChevronRight className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
                  <div className="hidden lg:block relative">
                     <div className="aspect-square bg-white/10 backdrop-blur-3xl rounded-[4rem] p-12 border border-white/20 transform rotate-3 hover:rotate-0 transition-transform duration-700">
                        <div className="space-y-8">
                           <div className="flex items-center gap-4 mb-8">
                              <div className="w-3 h-3 rounded-full bg-red-400" />
                              <div className="w-3 h-3 rounded-full bg-yellow-400" />
                              <div className="w-3 h-3 rounded-full bg-green-400" />
                           </div>
                           {[
                             { label: 'Next Session', val: 'Oct 15, 2025' },
                             { label: 'Total Students', val: '450+' },
                             { label: 'Satisfaction', val: '98.5%' }
                           ].map((stat, i) => (
                             <div key={i} className="space-y-1">
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                                <p className="text-white text-3xl font-black tracking-tighter">{stat.val}</p>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* Experience Section */}
            <section id="experience" className="py-32 relative z-10 bg-transparent">
              <div className="max-w-7xl mx-auto px-8 mb-24 text-center">
                 <motion.h2 className="text-[8vw] font-black text-white tracking-tighter uppercase leading-none mb-4">Proven Tenure.</motion.h2>
              </div>
              <VerticalTimeline experiences={portfolio.data.experiences || []} />
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-48 bg-transparent border-t border-white/5 relative">
              <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-12 gap-24">
                 <div className="lg:col-span-5 space-y-12">
                   <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85]">Let's Scale <br/> Your Vision.</h2>
                   <div className="space-y-6">
                      <p className="text-slate-400 text-xl font-medium leading-relaxed">
                        Currently accepting freelance projects for Q4 2025. Whether you need an enterprise overhaul or a startup launch, let's talk logic.
                      </p>
                      <div className="flex flex-col gap-4">
                        <a href={`mailto:${PERSONAL_INFO.email}`} className="text-white font-black uppercase text-sm tracking-widest flex items-center gap-3 hover:text-indigo-400 transition-colors">
                          <ExternalLink className="w-5 h-5" /> Direct: amgedhassan@outlook.com
                        </a>
                      </div>
                   </div>
                 </div>
                 <div className="lg:col-span-7">
                    <ContactForm />
                 </div>
              </div>
            </section>

            <Footer onNavigate={handleNavigate} />
          </motion.main>
        )}

        {currentView.type === 'project' && (
          <ProjectDetail 
            key="project"
            project={currentView.data} 
            onBack={() => handleNavigate({ type: 'home', anchor: 'projects' })} 
          />
        )}

        {currentView.type === 'course_detail' && (
          <CoursePage 
            key="course_detail"
            course={currentView.data} 
            onBack={() => handleNavigate({ type: 'courses' })} 
          />
        )}

        {currentView.type === 'about' && (
          <AboutDetail 
            key="about"
            onBack={() => handleNavigate({ type: 'home' })} 
            aboutData={portfolio.data.about}
          />
        )}

        {currentView.type === 'mentorship' && (
          <MentorshipDetail 
            key="mentorship"
            sessions={portfolio.data.mentorship || []}
            onBack={() => handleNavigate({ type: 'home' })} 
          />
        )}

        {currentView.type === 'courses' && (
          <div key="courses-layout">
            <CoursesGallery 
              courses={portfolio.data.courses || []} 
              onNavigate={handleNavigate} 
            />
            <Footer onNavigate={handleNavigate} />
          </div>
        )}

        {currentView.type === 'gallery' && (
          <div key="gallery-layout">
            <ProjectsGallery 
              projects={portfolio.data.projects || []} 
              onNavigate={handleNavigate} 
            />
            <Footer onNavigate={handleNavigate} />
          </div>
        )}

        {currentView.type === 'login' && (
          <Login 
            key="login"
            onLogin={() => handleNavigate({ type: 'dashboard' })} 
            onCancel={() => handleNavigate({ type: 'home' })} 
          />
        )}

        {currentView.type === 'dashboard' && (
          <Dashboard 
            key="dashboard"
            onBack={() => handleNavigate({ type: 'home' })} 
            onRefresh={loadData} 
          />
        )}
      </AnimatePresence>

      {/* Fix: Display AIAssistant on all non-dashboard views when portfolio data is loaded */}
      {currentView.type !== 'dashboard' && portfolio.data && (
        <AIAssistant portfolioData={portfolio.data} />
      )}
    </div>
  );
};

export default App;
