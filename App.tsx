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
import MentorshipBooking from './components/MentorshipBooking.tsx';
import MentorshipSection from './components/MentorshipSection.tsx';
import CoursesSection from './components/CoursesSection.tsx';
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
import AIAssistant from './components/AIAssistant.tsx';
import ComingSoon from './components/ComingSoon.tsx';
import { DataService } from './dataService.ts';
import { Project, PortfolioData, AsyncState, Course, View } from './types.ts';
import { PERSONAL_INFO } from './constants.tsx';

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
      setPortfolio(prev => ({ ...prev, loading: false, error: "System initialization failure" }));
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('portfolio-updated', loadData);
    
    const handleDeepLink = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      
      if (path === '/login' || hash === '#login') {
        setCurrentView({ type: 'login' });
      } else if (path === '/' || !hash) {
        setCurrentView({ type: 'home' });
      }
    };

    handleDeepLink();
    window.addEventListener('popstate', handleDeepLink);

    return () => {
      window.removeEventListener('portfolio-updated', loadData);
      window.removeEventListener('popstate', handleDeepLink);
    };
  }, []);

  const handleNavigate = (view: View) => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
      
      try {
        if (view.type === 'login') {
          window.history.pushState(null, '', '#login');
        } else if (view.type === 'home') {
          window.history.pushState(null, '', window.location.pathname);
        }
      } catch (e) {
        console.warn("SYSTEM: History API restricted.");
      }

      if (view.type === 'home' && view.anchor) {
        setTimeout(() => {
          const el = document.getElementById(view.anchor!);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        window.scrollTo(0, 0);
      }
    }, 600);
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
        <span className="mt-8 text-[10px] font-black uppercase tracking-[1em] text-white/60 animate-pulse">Syncing Kernel</span>
      </div>
    );
  }

  // Base state check: If even the core 'about' is missing, the whole app isn't ready
  if (!portfolio.data || (!portfolio.data.projects.length && !portfolio.data.courses.length && !portfolio.data.mentorship.length)) {
    return <ComingSoon onRetry={() => window.location.reload()} />;
  }

  const hasProjects = portfolio.data.projects?.length > 0;
  const hasCourses = portfolio.data.courses?.length > 0;
  const hasMentorship = portfolio.data.mentorship?.length > 0;

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
            <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center px-8 md:px-32 py-[56pt]">
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
                          {PERSONAL_INFO.name.split(' ')[0]}
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
                          {PERSONAL_INFO.name.split(' ')[1]}.
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
                          {hasProjects && (
                            <button onClick={() => document.getElementById('projects')?.scrollIntoView({behavior:'smooth'})} className="bg-white text-black px-10 py-5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-2xl">
                              Case Studies
                            </button>
                          )}
                          {hasCourses && (
                            <button onClick={() => handleNavigate({ type: 'courses' })} className="bg-indigo-700 text-white px-10 py-5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                              Product Academy
                            </button>
                          )}
                       </div>
                     </div>
                  </motion.div>
               </motion.div>
            </section>

            {hasProjects && (
              <section id="projects" className="py-[56pt] relative bg-transparent overflow-hidden">
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
            )}

            <section id="experience" className="py-[56pt] relative z-10 bg-transparent">
              <div className="max-w-7xl mx-auto px-8 mb-24 text-center">
                 <motion.h2 className="text-[8vw] font-black text-white tracking-tighter uppercase leading-none mb-4">Proven Tenure.</motion.h2>
              </div>
              <VerticalTimeline experiences={portfolio.data.experiences || []} />
            </section>

            {hasCourses && (
              <CoursesSection 
                courses={portfolio.data.courses || []} 
                onNavigate={handleNavigate} 
              />
            )}

            {hasMentorship && (
              <MentorshipSection 
                sessions={portfolio.data.mentorship || []} 
                onNavigate={handleNavigate} 
              />
            )}

            <section id="contact" className="py-[56pt] bg-transparent border-t border-white/5 relative">
              <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-12 gap-24">
                 <div className="lg:col-span-5 space-y-12">
                   <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85]">Let's Scale <br/> Your Vision.</h2>
                   <div className="space-y-6">
                      <p className="text-slate-400 text-xl font-medium leading-relaxed">
                        Currently accepting freelance projects for Q4 2025. Whether you need an enterprise overhaul or a startup launch, let's talk logic.
                      </p>
                      <div className="flex flex-col gap-4">
                        <a href={`mailto:${PERSONAL_INFO.email}`} className="text-white font-black uppercase text-sm tracking-widest flex items-center gap-3 hover:text-indigo-400 transition-colors">
                          <ExternalLink className="w-5 h-5" /> Direct: {PERSONAL_INFO.email}
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
          hasMentorship ? (
            <MentorshipDetail 
              key="mentorship"
              onNavigate={handleNavigate}
              sessions={portfolio.data.mentorship || []}
              onBack={() => handleNavigate({ type: 'home' })} 
            />
          ) : (
            <ComingSoon onRetry={() => handleNavigate({ type: 'home' })} label="Mentorship Sessions" />
          )
        )}

        {currentView.type === 'mentorship_booking' && (
          <MentorshipBooking 
            key="mentorship_booking"
            session={currentView.session}
            onBack={() => handleNavigate({ type: 'mentorship' })}
            onSuccess={() => handleNavigate({ type: 'home' })}
          />
        )}

        {currentView.type === 'courses' && (
          hasCourses ? (
            <div key="courses-layout">
              <CoursesGallery 
                courses={portfolio.data.courses || []} 
                onNavigate={handleNavigate} 
              />
              <Footer onNavigate={handleNavigate} />
            </div>
          ) : (
            <ComingSoon onRetry={() => handleNavigate({ type: 'home' })} label="Academy Modules" />
          )
        )}

        {currentView.type === 'gallery' && (
          hasProjects ? (
            <div key="gallery-layout">
              <ProjectsGallery 
                projects={portfolio.data.projects || []} 
                onNavigate={handleNavigate} 
              />
              <Footer onNavigate={handleNavigate} />
            </div>
          ) : (
            <ComingSoon onRetry={() => handleNavigate({ type: 'home' })} label="Works Archive" />
          )
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

      {currentView.type !== 'dashboard' && portfolio.data && (
        <AIAssistant portfolioData={portfolio.data} />
      )}
    </div>
  );
};

export default App;