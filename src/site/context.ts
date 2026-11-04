import { animate } from 'framer-motion';
import { createContext, useContext } from 'react';
import type { Copy, Lang } from './content';

export const EASE = [0.22, 1, 0.36, 1] as const;

interface SiteState {
  motionOn: boolean;
  lang: Lang;
  t: Copy;
}

export const SiteContext = createContext<SiteState>(null as unknown as SiteState);
export const useSite = () => useContext(SiteContext);

export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

let jump: { stop: () => void } | null = null;

/** Scroll to a scene with an explicit animation, so nothing else can cancel it halfway. */
export function scrollToScene(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  jump?.stop();
  const from = window.scrollY;
  const to = Math.max(0, el.getBoundingClientRect().top + from - 8);
  const root = document.documentElement;
  root.style.scrollBehavior = 'auto';
  const cancel = () => jump?.stop();
  window.addEventListener('wheel', cancel, { once: true, passive: true });
  window.addEventListener('touchstart', cancel, { once: true, passive: true });
  jump = animate(from, to, {
    duration: Math.min(1.6, 0.4 + Math.abs(to - from) / 4000),
    ease: [0.65, 0, 0.35, 1],
    onUpdate: (v) => window.scrollTo(0, v),
    onComplete: () => {
      root.style.scrollBehavior = '';
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
    }
  });
}
