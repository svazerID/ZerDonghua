import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

// Single reveal used by every home section; `once` keeps it from
// re-flashing when the user scrolls back up.
// Hidden on the server and on the client's first render, so hydration
// matches. `animate` (not whileInView) drives the fade: with reduced
// motion MotionConfig strips whileInView entirely, which would leave the
// section invisible.
export const Reveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className, delay = 0 }) => {
  const reduce = useReducedMotion();
  const [shown, setShown] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={shown ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};
