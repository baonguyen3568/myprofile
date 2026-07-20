import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealAfterTitleProps {
  ready: boolean;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function RevealAfterTitle({ ready, children, className, delay = 0 }: RevealAfterTitleProps) {
  return (
    <motion.div
      className={className}
      initial={false}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.32, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
