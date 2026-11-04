import { motion, useScroll, useSpring } from 'framer-motion';

export type Theme = 'dark' | 'light';

/** Thin progress bar pinned to the top edge. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX }} />
      <div className="side-line" aria-hidden="true">
        <motion.i style={{ scaleY: scaleX }} />
      </div>
    </>
  );
}
