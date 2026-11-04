import { useEffect, useRef, useState, type RefObject } from 'react';
import { animate, AnimatePresence, motion, useInView, useSpring } from 'framer-motion';
import { TextCursor } from 'lucide-react';
import { EASE, useSite } from './context';

/** Seconds the hero waits for the wireframe build before its content fades in. */
export const BUILD_DELAY = 1.6;
const BUILD_TOTAL = 4300;
const TERM_TIME = 1.05;
const BOOT = ['$ npm create portfolio@latest quoc-bao', '✓ scaffolded 14 components', '$ npm run dev -- --agents 7', '✓ ready in 312 ms · building UI…'];

interface Box {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  text: boolean;
}

/**
 * Editor-style intro over the hero: rulers slide in, selection boxes draw around
 * every element tagged with data-build, then the real content fills them.
 */
export function BuildOverlay({ host, onDone }: { host: RefObject<HTMLElement | null>; onDone: () => void }) {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const root = host.current;
      if (!root) return;
      const origin = root.getBoundingClientRect();
      setBoxes(
        [...root.querySelectorAll<HTMLElement>('[data-build]')].map((el) => {
        const r = el.getBoundingClientRect();
        return {
          label: el.dataset.build ?? '',
          x: r.left - origin.left,
          y: r.top - origin.top,
          w: r.width,
          h: r.height,
          text: el.dataset.buildText === 'true'
        };
        })
      );
    });
    return () => cancelAnimationFrame(raf);
  }, [host]);

  useEffect(() => {
    const leave = window.setTimeout(() => setLeaving(true), BUILD_TOTAL - 800);
    const done = window.setTimeout(onDone, BUILD_TOTAL);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
    };
  }, [onDone]);

  return (
    <motion.div className="build-layer" aria-hidden="true" animate={{ opacity: leaving ? 0 : 1 }} transition={{ duration: 0.7 }}>
      <motion.div
        className="boot-term"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.9, 1, 1, 0.96], y: [20, 0, 0, -10] }}
        transition={{ duration: TERM_TIME + 0.5, times: [0, 0.15, 0.8, 1] }}
      >
        <div className="term-bar">
          <i />
          <i />
          <i />
          <span>bao@dev ~ zsh</span>
        </div>
        {BOOT.map((line, i) => (
          <motion.p
            key={line}
            className={line.startsWith('$') ? 'cmd' : 'ok'}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 + i * 0.22, duration: 0.2 }}
          >
            {line}
          </motion.p>
        ))}
      </motion.div>
      <motion.div className="build-ruler-top" initial={{ y: -40 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: TERM_TIME, ease: EASE }} />
      <motion.div className="build-ruler-left" initial={{ x: -40 }} animate={{ x: 0 }} transition={{ duration: 0.5, delay: TERM_TIME + 0.1, ease: EASE }} />
      {boxes.map((box, i) => (
        <motion.div
          key={box.label}
          className={`build-box ${box.label.startsWith('img') ? 'is-media' : ''}`}
          style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
          initial={{ clipPath: 'inset(0 100% 100% 0)', opacity: 1 }}
          animate={{ clipPath: 'inset(0 0% 0% 0)' }}
          transition={{ duration: 0.45, delay: TERM_TIME + 0.2 + i * 0.07, ease: EASE }}
        >
          <span className="build-label">{box.label}</span>
          {box.w > 260 && (
            <span className="build-size">
              {Math.round(box.w)} × {Math.round(box.h)}
            </span>
          )}
          <i className="handle tl" />
          <i className="handle tr" />
          <i className="handle bl" />
          <i className="handle br" />
          {box.text && <TextCursor className="build-ibeam" size={16} />}
        </motion.div>
      ))}
      {leaving &&
        boxes.slice(0, 6).map((box, i) => (
          <motion.span
            key={`spark-${i}`}
            className="build-spark"
            style={{ left: box.x + box.w * 0.8, top: box.y }}
            initial={{ opacity: 0, scale: 0.4, y: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.6], y: -18 }}
            transition={{ duration: 0.8, delay: i * 0.05 }}
          >
            +
          </motion.span>
        ))}
    </motion.div>
  );
}

const AGENTS = ['frontend', 'review', 'test', 'backend', '3d', '', '', '', '', ''];
const TASKS = ['edit Hero.tsx', 'pytest ✓', 'git push', 'review ✓', 'fix lint', 'deploy ✓', 'tsc ✓', 'add test', 'rerank ✓', 'mesh.update()'];
const TARGETS = 'h2, .primary-link, .hero-stats > div, .deck-drag, .project-card, .tile, .recognition-row, .agent-node, .sim-prop, .process-row, .experience-row, .contact-links > a, .rail-stat, .term, .product';

/** Elements currently claimed by a cursor, so the swarm spreads out instead of piling up. */
const claimed = new Set<Element>();

function AgentCursor({ name, index }: { name: string; index: number }) {
  const x = useSpring(window.innerWidth / 2, { stiffness: 70, damping: 16 });
  const y = useSpring(window.innerHeight / 2, { stiffness: 70, damping: 16 });
  const [click, setClick] = useState(0);
  const [task, setTask] = useState('');

  useEffect(() => {
    let target: Element | null = null;
    let rel = { x: 0.5, y: 0.5 };
    let hopTimer = 0;
    let taskTimer = 0;
    let raf = 0;
    let orbit = index;

    const follow = () => {
      const card = document.querySelector<HTMLElement>('.deploy-card');
      const cr = card?.getBoundingClientRect();
      if (cr && cr.top < window.innerHeight * 0.7 && cr.bottom > window.innerHeight * 0.3) {
        orbit += 0.02;
        const ring = index % 2 ? 0.62 : 0.8;
        const a = orbit + (index / AGENTS.length) * Math.PI * 2;
        x.set(cr.left + cr.width / 2 + Math.cos(a) * cr.width * ring);
        y.set(cr.top + cr.height / 2 + Math.sin(a) * cr.height * ring);
      } else if (target) {
        const r = target.getBoundingClientRect();
        x.set(r.left + r.width * rel.x);
        y.set(r.top + Math.min(r.height, 140) * rel.y);
      }
      raf = requestAnimationFrame(follow);
    };

    const hop = () => {
      if (target) claimed.delete(target);
      const pool = [...document.querySelectorAll(TARGETS)].filter((el) => {
        if (claimed.has(el)) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.bottom > 60 && r.top < window.innerHeight - 60;
      });
      if (pool.length) {
        target = pool[(index * 7 + Math.floor(Math.random() * pool.length)) % pool.length];
        claimed.add(target);
        rel = { x: 0.15 + Math.random() * 0.7, y: 0.2 + Math.random() * 0.6 };
        if (name) {
          window.clearTimeout(taskTimer);
          taskTimer = window.setTimeout(() => {
            setClick((n) => n + 1);
            setTask(TASKS[(index + Math.floor(Math.random() * TASKS.length)) % TASKS.length]);
            taskTimer = window.setTimeout(() => setTask(''), 1300);
          }, 900);
        }
      }
      hopTimer = window.setTimeout(hop, 2200 + Math.random() * 1800);
    };

    raf = requestAnimationFrame(follow);
    hopTimer = window.setTimeout(hop, 250 + index * 140);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hopTimer);
      window.clearTimeout(taskTimer);
      if (target) claimed.delete(target);
    };
  }, [x, y, index, name]);

  return (
    <motion.div className={`agent-cursor agent-${index % 7} ${name ? '' : 'ghost'}`} style={{ x, y }}>
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 2l18 8.5-7.6 2.1L10.8 21z" fill="currentColor" stroke="var(--bg)" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      {name && (
        <span className="agent-name">
          {name}
          <AnimatePresence>
            {task && (
              <motion.em className="agent-task" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                {task}
              </motion.em>
            )}
          </AnimatePresence>
        </span>
      )}
      <AnimatePresence>
        {click > 0 && (
          <motion.i
            key={click}
            className="agent-click"
            initial={{ scale: 0.2, opacity: 0.8 }}
            animate={{ scale: 1.6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** A swarm of "agent" cursors that each claim a different visible element and stay on it while the page scrolls. */
export function AgentCursors() {
  const { motionOn } = useSite();
  const [wide] = useState(() => window.matchMedia('(min-width: 900px) and (pointer: fine)').matches);
  if (!motionOn || !wide) return null;
  return (
    <div className="agent-layer" aria-hidden="true">
      {AGENTS.map((name, i) => (
        <AgentCursor key={i} name={name} index={i} />
      ))}
    </div>
  );
}

/** A burst of "+" marks and dots each time the host scrolls into view. */
export function Sparks() {
  const { motionOn } = useSite();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const marks = [
    [-6, -18, '+'],
    [22, -30, '·'],
    [48, -12, '+'],
    [70, -26, '·'],
    [96, -8, '+'],
    [130, -22, '·']
  ] as const;
  return (
    <span ref={ref} className="sparks" aria-hidden="true">
      {motionOn &&
        inView &&
        marks.map(([dx, dy, ch], i) => (
          <motion.span
            key={i}
            className="spark"
            style={{ left: `${dx}%` }}
            initial={{ opacity: 0, y: 0, scale: 0.4 }}
            animate={{ opacity: [0, 1, 0], y: dy, scale: [0.4, 1.1, 0.7] }}
            transition={{ duration: 1.1, delay: i * 0.07, ease: EASE }}
          >
            {ch}
          </motion.span>
        ))}
    </span>
  );
}

/** Counts the numeric prefix of a value up from zero when it scrolls into view. */
export function CountUp({ value }: { value: string }) {
  const { motionOn } = useSite();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : -1;
  const suffix = match ? match[2] : '';
  const [n, setN] = useState(0);
  useEffect(() => {
    if (target < 0 || !inView || !motionOn) return;
    const controls = animate(0, target, { duration: 1.4, ease: EASE, onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [inView, motionOn, target]);
  if (target < 0) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {motionOn ? n : target}
      {suffix}
    </span>
  );
}
