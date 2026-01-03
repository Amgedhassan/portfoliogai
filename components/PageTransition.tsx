import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  isChanging: boolean;
}

const PageTransition: React.FC<PageTransitionProps> = ({ isChanging }) => {
  // Create a 10x6 grid for a mosaic effect
  const rows = 6;
  const cols = 10;
  const totalBlocks = rows * cols;
  
  const statusMessages = [
    "SYNC_GEOMETRY",
    "INIT_LAYOUT",
    "RECONFIG_NODES",
    "LOAD_ASSETS",
    "LOAD_DESIGN_OPS"
  ];

  return (
    <AnimatePresence>
      {isChanging && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
        >
          {/* Mosaic Grid Layer */}
          <div 
            className="absolute inset-0 grid h-full w-full"
            style={{ 
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)` 
            }}
          >
            {[...Array(totalBlocks)].map((_, i) => {
              const row = Math.floor(i / cols);
              const col = i % cols;
              // Calculate distance from center for radial stagger
              const centerX = cols / 2;
              const centerY = rows / 2;
              const dist = Math.sqrt(Math.pow(col - centerX, 2) + Math.pow(row - centerY, 2));
              
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.05, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: dist * 0.04, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className="bg-[#0a0a0a] border-[0.5px] border-white/5"
                />
              );
            })}
          </div>

          {/* Scanning Beam Effect */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "200%" }}
            transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50 blur-sm shadow-[0_0_20px_rgba(99,102,241,0.5)] z-[101]"
          />

          {/* High-End Terminal UI Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-[102] gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-white text-[10px] font-black uppercase tracking-[2em] ml-[2em]">Synchronizing</span>
              </div>
              
              <div className="flex items-center gap-2 overflow-hidden h-4">
                <motion.div
                  animate={{ y: [0, -16, -32, -48, -64, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  className="flex flex-col items-center"
                >
                  {statusMessages.map((msg, idx) => (
                    <span key={idx} className="text-[8px] font-bold text-indigo-400/60 uppercase tracking-widest h-4 flex items-center">
                      {msg}
                    </span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
            
            {/* Progress Bar */}
            <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden">
               <motion.div 
                 initial={{ x: "-100%" }}
                 animate={{ x: "100%" }}
                 transition={{ duration: 0.8, ease: "easeInOut" }}
                 className="absolute inset-0 bg-indigo-500"
               />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageTransition;