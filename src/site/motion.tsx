import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useSpring, type HTMLMotionProps } from 'framer-motion';
import { EASE, useSite } from './context';
import { Sparks } from './Build';

interface RevealProps {
  as?: 'div' | 'li';
  className?: string;
  delay?: number;
  sparks?: boolean;
  children: ReactNode;
}

/** Fades and lifts children in each time they enter the viewport. */
export function Reveal({ as = 'div', className, delay = 0, sparks = false, children }: RevealProps) {
  const { motionOn } = useSite();
  const Tag = as === 'li' ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={motionOn ? { opacity: 0, y: 36 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: motionOn ? 0.8 : 0, delay, ease: EASE }}
    >
      {children}
      {sparks && <Sparks />}
    </Tag>
  );
}

/** A link that leans toward the pointer, then springs back. */
export function Magnetic({ children, className, ...rest }: HTMLMotionProps<'a'>) {
  const { motionOn } = useSite();
  const x = useSpring(0, { stiffness: 220, damping: 18 });
  const y = useSpring(0, { stiffness: 220, damping: 18 });
  return (
    <motion.a
      className={className}
      style={{ x, y }}
      onPointerMove={(event) => {
        if (!motionOn || event.pointerType !== 'mouse') return;
        const box = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - box.left - box.width / 2) * 0.18);
        y.set((event.clientY - box.top - box.height / 2) * 0.28);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      {...rest}
    >
      {children}
    </motion.a>
  );
}

/** Small "README" chip that opens a popover with the text it hides, so scenes stay image-first. */
export function InfoPop({ label = 'README.md', children }: { label?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <span className={`info-pop ${open ? 'is-open' : ''}`}>
      <button className="info-pop-btn" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <i />
        {label}
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            className="info-pop-body"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
