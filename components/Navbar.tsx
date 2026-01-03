import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { View } from '../types.ts';

interface NavbarProps {
  onNavigate: (view: View) => void;
  currentView: View;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 48);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isItemActive = (id: string) => {
    if (id === 'gallery') return currentView.type === 'gallery';
    if (id === 'courses') return currentView.type === 'courses';
    if (id === 'about') return currentView.type === 'about';
    if (id === 'mentorship') return currentView.type === 'mentorship';
    return false;
  };

  const navItems = [
    { name: 'ABOUT', id: 'about', action: () => onNavigate({ type: 'about' }) },
    { name: 'WORKS', id: 'projects', action: () => onNavigate({ type: 'home', anchor: 'projects' }) },
    { name: 'COACHING', id: 'mentorship', action: () => onNavigate({ type: 'home', anchor: 'mentorship' }) },
    { name: 'ACADEMY', id: 'courses', action: () => onNavigate({ type: 'courses' }) },
    { name: 'INDEX', id: 'gallery', action: () => onNavigate({ type: 'gallery' }) },
  ];

  return (
    <>
      <nav 
        aria-label="Main Navigation"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 px-8 py-6 md:px-16 ${
          scrolled 
            ? 'bg-black/60 backdrop-blur-xl border-b border-white/10' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex justify-between items-center">
          <button 
            onClick={() => onNavigate({ type: 'home' })} 
            className="text-2xl font-black tracking-tighter text-white uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2"
            aria-label="Amgad Hassan Home"
          >
            AM<span className="text-indigo-400">GAD.</span>
          </button>
          
          <div className="hidden md:flex items-center gap-12">
            <ul className="flex items-center gap-10">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={item.action}
                    aria-current={isItemActive(item.id) ? 'page' : undefined}
                    className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:translate-y-[-2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded p-1 ${
                      isItemActive(item.id) 
                        ? 'text-white' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => onNavigate({ type: 'home', anchor: 'contact' })} 
              className="bg-white text-black text-[10px] font-black px-8 py-3.5 rounded-full uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Contact
            </button>
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(true)} 
              className="text-white p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg" 
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              <Menu className="w-8 h-8" />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-2xl p-12 flex flex-col justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            <button 
              onClick={() => setIsMenuOpen(false)} 
              className="absolute top-12 right-12 text-white p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-full" 
              aria-label="Close navigation menu"
            >
              <X className="w-12 h-12" />
            </button>
            <nav className="space-y-6 flex flex-col items-center">
              {navItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => { item.action(); setIsMenuOpen(false); }} 
                  className="block text-5xl font-black tracking-tighter text-white hover:text-indigo-500 uppercase text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;