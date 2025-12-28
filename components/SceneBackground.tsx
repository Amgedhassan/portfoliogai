
import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const SceneBackground: React.FC = () => {
  const { scrollYProgress } = useScroll();
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Very subtle light bleed that reacts to scroll
  const ambientOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.05, 0.1, 0.05]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-transparent">
      <motion.div
        style={{ opacity: ambientOpacity }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(129,140,248,0.02),transparent_80%)]"
      />
    </div>
  );
};

export default SceneBackground;
