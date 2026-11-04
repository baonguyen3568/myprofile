import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { asset, EASE, useSite } from './context';

/**
 * Pinned scroll scene: each step types a few terminal commands, then the
 * product they launch slides in beside the terminal.
 */
export function Showcase() {
  const { t, motionOn } = useSite();
  const s = t.showcase;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [pos, setPos] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setPos(Math.min(0.9999, Math.max(0, v))));

  const count = s.steps.length;
  const step = Math.floor(pos * count);
  const local = motionOn ? pos * count - step : 1;
  const current = s.steps[step];
  const shownLines = Math.min(current.lines.length, Math.floor(local * current.lines.length * 2.4) + 1);
  const built = local > 0.36;

  return (
    <section ref={ref} id="showcase" className="showcase" style={{ height: motionOn ? `${count * 75 + 100}vh` : 'auto' }}>
      <div className="showcase-sticky">
        <div className="showcase-head">
          <span className="eyebrow">{s.eyebrow}</span>
          <h2 className="display">
            {s.title[0]} <span className="accent">{s.title[1]}</span>
          </h2>
          <div className="showcase-steps">
            {s.steps.map((st, i) => (
              <span key={st.name} className={i === step ? 'active' : i < step ? 'done' : ''}>
                0{i + 1} · {st.name}
              </span>
            ))}
          </div>
        </div>
        <div className="showcase-stage">
          <div className="term">
            <div className="term-bar">
              <i />
              <i />
              <i />
              <span>bao@dgx-spark: ~/{current.dir}</span>
            </div>
            <div className="term-body">
              {current.lines.slice(0, shownLines).map((line, i) => (
                <motion.p
                  key={`${step}-${i}`}
                  className={line.startsWith('$') ? 'cmd' : line.startsWith('✓') ? 'ok' : 'log'}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {line}
                </motion.p>
              ))}
              {!built && <i className="caret" />}
            </div>
            <div className="term-progress">
              <i style={{ transform: `scaleX(${Math.min(1, local / 0.36)})` }} />
            </div>
          </div>
          <div className="product">
            <div className="product-bar">
              <i />
              <i />
              <i />
              <span className="product-url">{current.url}</span>
            </div>
            <div className="product-view">
              <motion.img
                key={current.image}
                src={asset(current.image)}
                alt={current.name}
                initial={false}
                animate={built ? { clipPath: 'inset(0 0 0% 0)', scale: 1, filter: 'blur(0px)' } : { clipPath: 'inset(0 0 100% 0)', scale: 1.06, filter: 'blur(8px)' }}
                transition={{ duration: 0.8, ease: EASE }}
              />
              {!built && (
                <div className="product-skeleton">
                  <span>{s.building}</span>
                  <i />
                  <i />
                  <i />
                </div>
              )}
            </div>
            <p className="product-caption">
              <strong>{current.name}</strong> {current.caption}
            </p>
          </div>
          <div className="showcase-rail">
            {current.stats.map((stat, i) => (
              <motion.span
                key={`${step}-${stat}`}
                className="rail-stat"
                initial={{ opacity: 0, x: 20 }}
                animate={built ? { opacity: 1, x: 0 } : { opacity: 0.25, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: EASE }}
              >
                <i />
                {stat}
              </motion.span>
            ))}
            <div className="rail-stack">
              {current.stack.map((tech, i) => (
                <motion.b
                  key={`${step}-${tech}`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.05, type: 'spring', stiffness: 260, damping: 18 }}
                >
                  {tech}
                </motion.b>
              ))}
            </div>
          </div>
        </div>
        <span className="showcase-note">{s.note}</span>
      </div>
    </section>
  );
}
