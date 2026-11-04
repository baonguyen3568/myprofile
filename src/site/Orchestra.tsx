import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { InfoPop, Reveal } from './motion';
import { useSite } from './context';

const ROLES = ['research', 'security', 'test', 'fix', 'design', 'backend', 'frontend', 'review', 'docs', 'infra', 'data', 'release'];

/** Hub-and-spoke graph: issues flow out to twelve role agents, PRs flow back. */
export function Orchestra() {
  const { t, motionOn } = useSite();
  const o = t.orchestra;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [prs, setPrs] = useState(0);
  const [issues, setIssues] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    if (!inView) return;
    const target = { prs: 686, issues: 844 };
    let n = 0;
    const timer = window.setInterval(() => {
      n += 1;
      const k = Math.min(1, n / 60);
      setPrs(Math.round(target.prs * k));
      setIssues(Math.round(target.issues * k));
      const role = ROLES[n % ROLES.length];
      setLog((l) => [`#${1200 + n} ${role} → ${n % 3 === 0 ? 'PR merged' : n % 3 === 1 ? 'issue claimed' : 'tests ✓'}`, ...l].slice(0, 6));
      if (!motionOn && n > 60) window.clearInterval(timer);
    }, motionOn ? 140 : 1);
    return () => window.clearInterval(timer);
  }, [inView, motionOn]);

  const graphRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 500 });
  useEffect(() => {
    const el = graphRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const cx = size.w / 2;
  const cy = size.h / 2;
  const rx = size.w * 0.4;
  const ry = size.h * 0.38;
  const nodes = ROLES.map((role, i) => {
    const a = (i / ROLES.length) * Math.PI * 2 - Math.PI / 2;
    return { role, x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry };
  });

  return (
    <section id="agents" className="orchestra section-wrap">
      <Reveal className="section-heading" sparks>
        <div>
          <span className="eyebrow">{o.eyebrow}</span>
          <h2>
            {o.title}
            <span className="accent">.</span>
          </h2>
        </div>
        <InfoPop>{o.body}</InfoPop>
      </Reveal>
      <div className="orchestra-grid" ref={ref}>
        <div className="graph" ref={graphRef}>
          <svg viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden="true">
            {nodes.map((n, i) => (
              <g key={n.role}>
                <line x1={cx} y1={cy} x2={n.x} y2={n.y} className="edge" />
                {motionOn && inView && (
                  <>
                    <circle r="4" className="packet out">
                      <animateMotion dur={`${1.6 + (i % 4) * 0.35}s`} repeatCount="indefinite" begin={`${i * 0.17}s`} path={`M${cx},${cy} L${n.x},${n.y}`} />
                    </circle>
                    <circle r="3" className="packet back">
                      <animateMotion dur={`${2.1 + (i % 3) * 0.4}s`} repeatCount="indefinite" begin={`${0.6 + i * 0.13}s`} path={`M${n.x},${n.y} L${cx},${cy}`} />
                    </circle>
                  </>
                )}
              </g>
            ))}
          </svg>
          <motion.div
            className="hub"
            animate={motionOn && inView ? { boxShadow: ['0 0 0 0 var(--glow-strong)', '0 0 0 18px transparent'] } : {}}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <strong>{o.hub}</strong>
            <span>GitHub Issues · MCP</span>
          </motion.div>
          {nodes.map((n, i) => (
            <span key={n.role} className="agent-node-pos" style={{ left: n.x, top: n.y }}>
              <motion.span
                className="agent-node"
                initial={motionOn ? { opacity: 0, scale: 0.3 } : false}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.1 + i * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <i />
                {n.role}
              </motion.span>
            </span>
          ))}
          <span className="architect">{o.architect}</span>
        </div>
        <div className="orchestra-side">
          <div className="counter">
            <span className="display">{prs}</span>
            <small>{o.prs}</small>
          </div>
          <div className="counter">
            <span className="display">{issues}</span>
            <small>{o.issues}</small>
          </div>
          <div className="agent-log">
            {log.map((line) => (
              <motion.p key={line} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                {line}
              </motion.p>
            ))}
          </div>
          <InfoPop label="note.txt">{o.note}</InfoPop>
        </div>
      </div>
    </section>
  );
}
