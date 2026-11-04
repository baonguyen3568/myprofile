import { useEffect, useState, type ComponentType } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { BarChart3, Box, GitCommitHorizontal, GitCompare, Images, LayoutGrid, Mail, Moon, Network, Pause, Play, Power, Sun, Terminal, User } from 'lucide-react';
import { scrollToScene, useSite } from './context';
import type { Lang } from './content';
import type { Theme } from './Chrome';

const ICONS: Record<string, ComponentType<{ size?: number }>> = {
  home: Power,
  showcase: Terminal,
  work: LayoutGrid,
  gallery: Images,
  impact: BarChart3,
  agents: Network,
  sim: Box,
  diff: GitCompare,
  about: User,
  journey: GitCommitHorizontal,
  contact: Mail
};

/** Vertical progress rail on the right: one node per scene, hover for a description, click to jump. */
export function SceneRail() {
  const { t } = useSite();
  const [active, setActive] = useState('home');
  const [hover, setHover] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    const ids = t.scenes.map(([id]) => id);
    const watch = () => ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    watch();
    const late = window.setTimeout(watch, 1500);
    return () => {
      observer.disconnect();
      window.clearTimeout(late);
    };
  }, [t.scenes]);

  return (
    <nav className="scene-rail" aria-label="Scenes">
      <div className="rail-track">
        <motion.i style={{ scaleY: fill }} />
      </div>
      {t.scenes.map(([id, label, desc], i) => {
        const Icon = ICONS[id] ?? Power;
        return (
          <button
            key={id}
            className={`rail-node ${active === id ? 'active' : ''}`}
            onClick={() => scrollToScene(id)}
            onMouseEnter={() => setHover(id)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(id)}
            onBlur={() => setHover(null)}
            aria-label={`${label}: ${desc}`}
            data-scene={id}
          >
            <Icon size={12} />
            {hover === id && (
              <motion.span className="rail-tip" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
                <b>
                  {String(i).padStart(2, '0')} · {label}
                </b>
                {desc}
              </motion.span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

interface DockProps {
  theme: Theme;
  onTheme: () => void;
  onToggleMotion: () => void;
  onLang: (lang: Lang) => void;
}

/** Tiny corner dock that replaces the old navbar: wordmark plus language, theme and motion toggles. */
export function Dock({ theme, onTheme, onToggleMotion, onLang }: DockProps) {
  const { motionOn, lang } = useSite();
  return (
    <>
      <a className="dock-mark" href="#home" onClick={(e) => (e.preventDefault(), scrollToScene('home'))}>
        QUỐC BẢO<span className="wordmark-mark">®</span>
      </a>
      <div className="dock-tools">
        {(['en', 'vi'] as Lang[]).map((code) => (
          <button key={code} className={lang === code ? 'on' : ''} onClick={() => onLang(code)} aria-pressed={lang === code}>
            {code}
          </button>
        ))}
        <button onClick={onTheme} aria-label="Theme">
          {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
        </button>
        <button onClick={onToggleMotion} aria-label="Motion" aria-pressed={!motionOn}>
          {motionOn ? <Pause size={12} /> : <Play size={12} />}
        </button>
      </div>
    </>
  );
}
