import { useEffect } from 'react';

const WIRE: [string, string][] = [
  ['.project-card', '<ProjectCard />'],
  ['.recognition-row', '<ResultRow />'],
  ['.term', '<Terminal />'],
  ['.product', '<Preview />'],
  ['.rail-stat', '<Stat />'],
  ['.graph', '<AgentGraph />'],
  ['.sim-app', '<Viewport3D />'],
  ['.comparison-stage', '<CodeDiff />'],
  ['.process-row', '<Step />'],
  ['.education-panel', '<Education />'],
  ['.quote-panel', '<Quote />'],
  ['.experience-row', '<Commit />'],
  ['.award-item', '<Milestone />'],
  ['.contact-links > a', '<Link />'],
  ['.deploy-card', '<DeployCard />'],
  ['.brand-viewport', '<StackRail />'],
  ['.counter', '<Counter />']
];

/** Draws an editor selection box with a component label around blocks as they enter view. */
export function useWireOnView(enabled: boolean, key: string) {
  useEffect(() => {
    if (!enabled) return;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          el.classList.add('wire-on');
          timers.push(window.setTimeout(() => el.classList.remove('wire-on'), 1500));
        }),
      { threshold: 0.3 }
    );
    WIRE.forEach(([selector, label]) =>
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        el.dataset.wire = label;
        io.observe(el);
      })
    );
    return () => {
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [enabled, key]);
}
