
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { View } from '../App';

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
    return false;
  };

  const navItems = [
    { name: 'WORKS', id: 'projects', action: () => onNavigate({ type: 'home', anchor: 'projects' }) },
    { name: 'COURSES', id: 'courses', action: () => onNavigate({ type: 'courses' }) },
    { name: 'INDEX', id: 'gallery', action: () => onNavigate({ type: 'gallery' }) },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 px-8 py-8 md:px-16 ${
          scrolled ? 'bg-black/60 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex justify-between items-center">
          <button onClick={() => onNavigate({ type: 'home' })} className="text-2xl font-black tracking-tighter text-white uppercase">
            AM<span className="text-indigo-400">GAD.</span>
          </button>
          
          <div className="hidden md:flex items-center gap-12">
            <ul className="flex items-center gap-12">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={item.action}
                    className={`text-[10px] font-black uppercase tracking-[0.5em] transition-all hover:translate-y-[-4px] ${
                      isItemActive(item.id) ? 'text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={() => onNavigate({ type: 'home', anchor: 'contact' })} className="bg-white text-black text-[10px] font-black px-8 py-4 rounded-full uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl">
              Contact
            </button>
          </div>

          <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-white p-2" aria-label="Open Menu">
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-2xl p-16 flex flex-col justify-center"
          >
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-16 right-16 text-white p-4" aria-label="Close Menu">
              <X className="w-12 h-12" />
            </button>
            <nav className="space-y-8 flex flex-col">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => { item.action(); setIsMenuOpen(false); }} className="block text-6xl font-black tracking-tighter text-white hover:text-indigo-500 uppercase text-left">
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
