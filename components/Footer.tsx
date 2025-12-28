
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Linkedin, ExternalLink, Mail, Phone, Globe } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';
import { View } from '../App';

interface FooterProps {
  onNavigate: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050505] pt-32 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-8">
            <button 
              onClick={() => onNavigate({ type: 'home' })}
              className="text-3xl font-black tracking-tighter text-white uppercase"
            >
              AM<span className="text-indigo-400">GAD.</span>
            </button>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
              Senior Product Designer specializing in high-fidelity B2B enterprise systems and scalable digital architectures.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href={PERSONAL_INFO.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 transition-all group"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href={PERSONAL_INFO.behance} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 transition-all group"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
              <a 
                href={`mailto:${PERSONAL_INFO.email}`}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 transition-all group"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-1">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8">Navigation</h4>
            <ul className="space-y-4">
              {[
                { name: 'Works Archive', action: () => onNavigate({ type: 'gallery' }) },
                { name: 'Product Academy', action: () => onNavigate({ type: 'courses' }) },
                { name: 'About Philosophy', action: () => onNavigate({ type: 'home', anchor: 'experience' }) }, // Approximate
                { name: 'Contact Link', action: () => onNavigate({ type: 'home', anchor: 'contact' }) },
              ].map((item) => (
                <li key={item.name}>
                  <button 
                    onClick={item.action}
                    className="text-slate-400 hover:text-white text-sm font-bold transition-colors"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-1">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8">Direct Access</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-400 text-sm font-bold">
                <Globe className="w-4 h-4 text-indigo-500" />
                <span>Cairo, Egypt</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm font-bold">
                <Mail className="w-4 h-4 text-indigo-500" />
                <a href={`mailto:${PERSONAL_INFO.email}`} className="hover:text-white transition-colors">{PERSONAL_INFO.email}</a>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm font-bold">
                <Phone className="w-4 h-4 text-indigo-500" />
                <span>{PERSONAL_INFO.phone}</span>
              </li>
            </ul>
          </div>

          {/* Utility Column */}
          <div className="lg:col-span-1 flex flex-col items-start lg:items-end justify-between">
            <div className="hidden lg:block">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 text-right">Topographic Index</h4>
              <p className="text-right text-slate-600 text-[10px] font-black uppercase tracking-widest leading-loose">
                SYSTEM_v1.0.4<br/>
                STABLE_BUILD<br/>
                LAT: 30.0444<br/>
                LNG: 31.2357
              </p>
            </div>
            <button 
              onClick={scrollToTop}
              className="mt-8 lg:mt-0 group flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              Back to top
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em]">
            © {currentYear} Amgad Hassan. Handcrafted with Precision.
          </p>
          <div className="flex items-center gap-8">
             <span className="text-slate-600 text-[8px] font-black uppercase tracking-widest">Privacy Policy</span>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-slate-500 text-[8px] font-black uppercase tracking-widest">Server: Online</span>
             </div>
          </div>
        </div>
      </div>
      
      {/* Visual Sub-Decor */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent pointer-events-none" />
    </footer>
  );
};

export default Footer;
