import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { content, type Lang } from './content';
import { SiteContext } from './context';
import { ScrollProgress, type Theme } from './Chrome';
import { Dock, SceneRail } from './Rail';
import { Director } from './Director';
import { Gallery } from './Gallery';
import { AgentCursors } from './Build';
import { useWireOnView } from './wire';
import { Hero } from './Hero';
import { ProjectModal, Work, type Card } from './Work';
import { About, Breakdown, Impact } from './Story';
import { Contact, Journey } from './Ending';
import { Showcase } from './Showcase';
import { Orchestra } from './Orchestra';
import './site.css';

const SimViewport = lazy(() => import('./Sim').then((m) => ({ default: m.SimViewport })));

const readPref = <T extends string>(key: string, fallback: T): T => {
  try {
    return (localStorage.getItem(key) as T) || fallback;
  } catch {
    return fallback;
  }
};

const savePref = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
};

export function App() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const [motionOn, setMotionOn] = useState(() => readPref('motion', reduced ? 'off' : 'on') === 'on');
  const [theme, setTheme] = useState<Theme>(() => readPref<Theme>('theme', prefersLight ? 'light' : 'dark'));
  const [lang, setLang] = useState<Lang>(() => readPref<Lang>('lang', 'en'));
  const [project, setProject] = useState<Card | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dataset.theme = theme;
    root.classList.toggle('motion-off', !motionOn);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b0d10' : '#eceff2');
  }, [lang, theme, motionOn]);

  const value = useMemo(() => ({ motionOn, lang, t: content[lang] }), [motionOn, lang]);
  const closeModal = useCallback(() => setProject(null), []);
  useWireOnView(motionOn, lang);

  return (
    <SiteContext.Provider value={value}>
      <MotionConfig reducedMotion={motionOn ? 'never' : 'always'}>
        <ScrollProgress />
        <div className="grain" aria-hidden="true" />
        <Dock
          theme={theme}
          onTheme={() =>
            setTheme((current) => {
              const next = current === 'dark' ? 'light' : 'dark';
              savePref('theme', next);
              return next;
            })
          }
          onToggleMotion={() =>
            setMotionOn((on) => {
              savePref('motion', on ? 'off' : 'on');
              return !on;
            })
          }
          onLang={(next) => {
            savePref('lang', next);
            setLang(next);
          }}
        />
        <main>
          <Hero />
          <Showcase />
          <Work onOpen={setProject} />
          <Gallery />
          <Impact />
          <Orchestra />
          <Suspense fallback={<section id="sim" className="sim section-wrap" style={{ minHeight: 640 }} />}>
            <SimViewport />
          </Suspense>
          <Breakdown />
          <About />
          <Journey />
          <Contact />
        </main>
        <ProjectModal project={project} onClose={closeModal} />
        <AgentCursors />
        <SceneRail />
        <Director />
      </MotionConfig>
    </SiteContext.Provider>
  );
}
