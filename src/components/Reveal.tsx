import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

// Single reveal used by every home section; `once` keeps it from
// re-flashing when the user scrolls back up.
// With reduced motion the whileInView variant never fires (MotionConfig
// strips the animation), leaving the section at opacity 0, so render it
// plainly instead.
export const Reveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className, delay = 0 }) => {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};
