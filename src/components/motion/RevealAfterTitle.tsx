import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealAfterTitleProps {
  ready: boolean;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function RevealAfterTitle({ ready, children, className, delay = 0 }: RevealAfterTitleProps) {
  void ready;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
