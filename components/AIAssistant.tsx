
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import { askAmgadAI } from '../geminiService.ts';
import { PortfolioData } from '../types.ts';

interface AIAssistantProps {
  portfolioData: PortfolioData;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ portfolioData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hey! I'm Amgad's AI mind. Ask me anything about his B2B design expertise or career path!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const botResponse = await askAmgadAI(userMessage, portfolioData);
    setMessages(prev => [...prev, { role: 'bot', text: botResponse || "I'm having a technical glitch, try again later!" }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            className="bg-white/95 backdrop-blur-2xl rounded-[3rem] shadow-2xl w-[22rem] md:w-[26rem] flex flex-col h-[36rem] border border-white/40 overflow-hidden mb-8"
          >
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
                   <Bot className="w-6 h-6" />
                </div>
                <div>
                  <span className="block font-bold text-sm tracking-tight">Amgad.AI</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-[10px] uppercase font-black tracking-widest opacity-80">System Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors p-2" aria-label="Close Assistant">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-6 rounded-[2rem] text-sm leading-relaxed font-medium ${
                    m.role === 'user' 
                      ? 'bg-indigo-700 text-white rounded-br-none shadow-lg shadow-indigo-100/50' 
                      : 'bg-slate-100 text-slate-900 rounded-bl-none'
                  }`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 p-6 rounded-[2rem] rounded-bl-none">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-8 border-t border-slate-100">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about B2B experience..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-900 placeholder:text-slate-500"
                />
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="bg-slate-900 hover:bg-black text-white p-4 rounded-2xl transition-all disabled:opacity-50"
                  aria-label="Send Message"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-slate-900 text-white' : 'bg-indigo-700 text-white shadow-indigo-500/30'}`}
        aria-label={isOpen ? "Close Assistant" : "Open Assistant"}
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
        {!isOpen && (
          <div className="absolute -top-14 right-0 bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-2xl shadow-xl text-slate-900 whitespace-nowrap">
            Ask Amgad's AI
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default AIAssistant;
