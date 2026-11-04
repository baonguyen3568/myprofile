import { useCallback, useEffect, useRef, useState } from 'react';
import { animate, AnimatePresence, motion, useSpring } from 'framer-motion';
import { Minus, Pause, Play, RotateCcw } from 'lucide-react';
import { useSite } from './context';

/**
 * The tour script. Every line is shown in the console and then executed as-is,
 * so what visitors read is exactly what drives the page.
 */
const SCRIPT = [
  "await wait(600)",
  "await scene.goto('showcase')",
  "await scene.scrollBy(0.53)",
  "await wait(900)",
  "await scene.scrollBy(0.75)",
  "await wait(900)",
  "await scene.scrollBy(0.75)",
  "await wait(900)",
  "await scene.scrollBy(0.75)",
  "await wait(900)",
  "await scene.goto('work')",
  "await cursor.click('#work .project-card:nth-child(2) .project-open')",
  "await wait(1600)",
  "await cursor.click('.modal-tabs .icon-button')",
  "await scene.goto('gallery')",
  "fx.glitch('#gallery h2')",
  "await cursor.click('#gallery .tile:nth-child(4)')",
  "await wait(1400)",
  "await cursor.click('#gallery .tile-pop')",
  "await scene.goto('impact')",
  "await cursor.click('#impact .award-expand')",
  "await scene.goto('agents')",
  "fx.glitch('#agents h2')",
  "await wait(2400)",
  "await scene.goto('sim')",
  "await cursor.drag('#sim canvas', 220, -40)",
  "await wait(1200)",
  "await scene.goto('diff')",
  "await scene.scrollBy(0.35)",
  "await wait(900)",
  "await scene.goto('about')",
  "await cursor.click('#about .info-pop-btn')",
  "await wait(1500)",
  "await cursor.click('#about .info-pop-btn')",
  "await scene.goto('journey')",
  "await cursor.click('#journey .experience-row:nth-child(2) button')",
  "await scene.goto('contact')",
  "await cursor.click('.deploy-play')",
  "fx.glitch('#contact h2')"
];

class Stopped extends Error {}

interface DirectorApi {
  scene: { goto: (id: string) => Promise<void>; scrollBy: (screens: number) => Promise<void> };
  cursor: { click: (selector: string) => Promise<void>; drag: (selector: string, dx: number, dy: number) => Promise<void> };
  wait: (ms: number) => Promise<void>;
  fx: { glitch: (selector: string) => void };
}

type Compiled = (api: DirectorApi) => Promise<void>;
const compile = (line: string) => new Function('api', `const { scene, cursor, wait, fx } = api; return (async () => { ${line} })();`) as Compiled;

/** Floating "director.js" console: types the tour, runs each line, drives the scroll and its own cursor. */
export function Director() {
  const { motionOn } = useSite();
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(0);
  const [typed, setTyped] = useState('');
  const [minimized, setMinimized] = useState(() => window.innerWidth < 760);
  const [pressing, setPressing] = useState(0);
  const [visible, setVisible] = useState(false);
  const token = useRef(0);
  const runningRef = useRef(false);
  const doneRef = useRef(0);
  useEffect(() => {
    runningRef.current = running;
    doneRef.current = done;
  }, [running, done]);
  const cx = useSpring(-60, { stiffness: 120, damping: 20 });
  const cy = useSpring(-60, { stiffness: 120, damping: 20 });

  const stop = useCallback(() => {
    token.current += 1;
    setRunning(false);
  }, []);

  const run = useCallback(
    async (from: number) => {
      const my = ++token.current;
      setRunning(true);
      setVisible(true);
      const alive = () => {
        if (token.current !== my) throw new Stopped();
      };
      const wait = (ms: number) =>
        new Promise<void>((resolve, reject) => {
          const t = window.setTimeout(() => (token.current === my ? resolve() : reject(new Stopped())), ms);
          if (token.current !== my) {
            window.clearTimeout(t);
            reject(new Stopped());
          }
        });
      const scrollTo = async (top: number) => {
        alive();
        document.documentElement.style.scrollBehavior = 'auto';
        const from = window.scrollY;
        const duration = Math.min(2.4, 0.5 + Math.abs(top - from) / 1800);
        await new Promise<void>((resolve) => {
          const controls = animate(from, top, {
            duration,
            ease: [0.65, 0, 0.35, 1],
            onUpdate: (v) => {
              if (token.current !== my) controls.stop();
              else window.scrollTo(0, v);
            },
            onComplete: resolve
          });
          const guard = window.setInterval(() => {
            if (token.current !== my) {
              controls.stop();
              window.clearInterval(guard);
              resolve();
            }
          }, 100);
          void controls.then(() => window.clearInterval(guard));
        });
        document.documentElement.style.scrollBehavior = '';
        alive();
      };
      const moveTo = async (el: Element) => {
        const r = el.getBoundingClientRect();
        cx.set(r.left + r.width / 2);
        cy.set(r.top + r.height / 2);
        await wait(650);
      };
      const api: DirectorApi = {
        wait,
        scene: {
          goto: async (id) => {
            const el = document.getElementById(id);
            if (el) await scrollTo(el.getBoundingClientRect().top + window.scrollY - 8);
          },
          scrollBy: async (screens) => scrollTo(window.scrollY + window.innerHeight * screens)
        },
        cursor: {
          click: async (selector) => {
            const el = document.querySelector<HTMLElement>(selector);
            if (!el) return;
            const r = el.getBoundingClientRect();
            if (r.bottom < 0 || r.top > window.innerHeight) await scrollTo(window.scrollY + r.top - window.innerHeight / 3);
            await moveTo(el);
            setPressing((n) => n + 1);
            el.click();
            await wait(250);
          },
          drag: async (selector, dx, dy) => {
            const el = document.querySelector<HTMLElement>(selector);
            if (!el) return;
            await moveTo(el);
            const r = el.getBoundingClientRect();
            const x0 = r.left + r.width / 2;
            const y0 = r.top + r.height / 2;
            const fire = (type: string, x: number, y: number) =>
              el.dispatchEvent(new PointerEvent(type, { clientX: x, clientY: y, bubbles: true, pointerId: 1, pointerType: 'mouse' }));
            fire('pointerdown', x0, y0);
            for (let i = 1; i <= 24; i++) {
              const x = x0 + (dx * i) / 24;
              const y = y0 + (dy * i) / 24;
              cx.set(x);
              cy.set(y);
              fire('pointermove', x, y);
              await wait(40);
            }
            fire('pointerup', x0 + dx, y0 + dy);
          }
        },
        fx: {
          glitch: (selector) => {
            const el = document.querySelector(selector);
            if (!el) return;
            el.classList.remove('glitch-on');
            void (el as HTMLElement).offsetWidth;
            el.classList.add('glitch-on');
          }
        }
      };

      try {
        for (let i = from; i < SCRIPT.length; i++) {
          alive();
          setDone(i);
          for (let c = 1; c <= SCRIPT[i].length; c += 2) {
            setTyped(SCRIPT[i].slice(0, c));
            await wait(14);
          }
          setTyped(SCRIPT[i]);
          await compile(SCRIPT[i])(api);
        }
        setDone(SCRIPT.length);
        setTyped('');
        setRunning(false);
      } catch (error) {
        if (!(error instanceof Stopped)) throw error;
      }
    },
    [cx, cy]
  );

  // Start on its own after the intro, and hand control back on any user input.
  useEffect(() => {
    if (!motionOn) return;
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const start = window.setTimeout(() => void run(0), 4800);
    const interrupt = (e: Event) => {
      if (!e.isTrusted) return;
      if (e.type === 'keydown' && (e as KeyboardEvent).key === 'Tab') return;
      if ((e.target as HTMLElement | null)?.closest?.('.director')) return;
      if (runningRef.current) stop();
    };
    const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    events.forEach((e) => window.addEventListener(e, interrupt, { passive: true }));
    const toggle = () => (runningRef.current ? stop() : void run(doneRef.current >= SCRIPT.length ? 0 : doneRef.current));
    window.addEventListener('director:toggle', toggle);
    return () => {
      window.clearTimeout(start);
      events.forEach((e) => window.removeEventListener(e, interrupt));
      window.removeEventListener('director:toggle', toggle);
    };
  }, [motionOn, run, stop]);

  useEffect(() => () => void (token.current += 1), []);

  if (!motionOn) return null;
  const window0 = Math.max(0, done - 5);
  const lines = SCRIPT.slice(window0, Math.min(SCRIPT.length, done + 3));

  return (
    <>
      <AnimatePresence>
        {visible && running && (
          <motion.div className="director-cursor" style={{ x: cx, y: cy }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path d="M3 2l18 8.5-7.6 2.1L10.8 21z" fill="currentColor" stroke="var(--bg)" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
            <span>director.js</span>
            <AnimatePresence>
              {pressing > 0 && (
                <motion.i key={pressing} initial={{ scale: 0.2, opacity: 0.9 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 0.5 }} />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div className={`director ${minimized ? 'is-min' : ''}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 4.2 }}>
        <div className="director-bar">
          <i />
          <i />
          <i />
          <span>director.js</span>
          <em>{running ? 'running' : done >= SCRIPT.length ? 'done' : 'paused'}</em>
          <button onClick={() => (running ? stop() : void run(done >= SCRIPT.length ? 0 : done))} aria-label={running ? 'Pause tour' : 'Run tour'}>
            {running ? <Pause size={11} /> : <Play size={11} />}
          </button>
          <button onClick={() => void run(0)} aria-label="Restart tour">
            <RotateCcw size={11} />
          </button>
          <button onClick={() => setMinimized((m) => !m)} aria-label="Minimize">
            <Minus size={11} />
          </button>
        </div>
        {!minimized && (
          <div className="director-code">
            {lines.map((line, k) => {
              const i = window0 + k;
              const state = i < done ? 'ok' : i === done ? 'now' : 'next';
              return (
                <p key={i} className={state}>
                  <b>{String(i + 1).padStart(2, '0')}</b>
                  <span>{state === 'now' && running ? typed : line}</span>
                  {state === 'now' && running && <i className="caret" />}
                  {state === 'ok' && <em>✓</em>}
                </p>
              );
            })}
          </div>
        )}
      </motion.div>
    </>
  );
}
