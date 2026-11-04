import { useEffect, useState, type ReactNode } from 'react';
import { motion, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { asset, EASE, useSite } from './context';

const CODE = [
  ['k', 'async def '],
  ['f', 'run_turn'],
  ['p', '(ctx, tools):'],
  ['n', ''],
  ['p', '    reply = '],
  ['k', 'await '],
  ['p', 'llm.chat(ctx.view(), tools)'],
  ['n', ''],
  ['k', '    for '],
  ['p', 'call '],
  ['k', 'in '],
  ['p', 'reply.tool_calls:'],
  ['n', ''],
  ['p', '        out = '],
  ['k', 'await '],
  ['p', 'tools.run(call)'],
  ['n', ''],
  ['p', '        ctx.add(call, out)  '],
  ['c', '# never raises'],
  ['n', ''],
  ['k', '    return '],
  ['p', 'reply']
] as const;

const TOTAL = CODE.reduce((n, [kind, text]) => n + (kind === 'n' ? 1 : text.length), 0);

/** VS Code window that types an agent loop, then starts over. */
function CodeWindow() {
  const { motionOn } = useSite();
  const [typed, setTyped] = useState(TOTAL);

  useEffect(() => {
    if (!motionOn) return;
    const timer = window.setInterval(() => setTyped((n) => (n >= TOTAL + 40 ? 0 : n + 2)), 45);
    return () => window.clearInterval(timer);
  }, [motionOn]);

  const shown = motionOn ? typed : TOTAL;
  let budget = shown;
  const parts: ReactNode[] = [];
  CODE.forEach(([kind, text], i) => {
    if (budget <= 0) return;
    if (kind === 'n') {
      parts.push(<br key={i} />);
      budget -= 1;
      return;
    }
    const slice = text.slice(0, budget);
    budget -= slice.length;
    parts.push(
      <span key={i} className={`tok-${kind}`}>
        {slice}
      </span>
    );
  });

  return (
    <div className="win win-code">
      <div className="win-tabs">
        <span className="active">agent_loop.py</span>
        <span>tools.py</span>
        <span>memory.py</span>
      </div>
      <div className="win-editor">
        <div className="win-gutter">
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i}>{i + 12}</span>
          ))}
        </div>
        <pre>
          {parts}
          <i className="caret" />
        </pre>
      </div>
      <div className="win-status">
        <span>⎇ release/v1.14</span>
        <span>Python 3.12 · ruff ✓</span>
      </div>
    </div>
  );
}

const GPU_LOG = ['vllm  qwen3.8-27b nvfp4', 'kv-cache fp8 · 92% hit', 'tok/s  41.8', 'scrfd  cam_03 18.6 fps', 'arcface batch 24 · 6 ms'];

/** Terminal with live GPU bars and a scrolling serving log. */
function GpuWindow() {
  const { motionOn } = useSite();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!motionOn) return;
    const timer = window.setInterval(() => setTick((n) => n + 1), 700);
    return () => window.clearInterval(timer);
  }, [motionOn]);
  const bars = [0.72, 0.58, 0.86].map((b, i) => Math.min(0.98, b + Math.sin(tick * 0.9 + i * 2) * 0.1));
  const lines = [...GPU_LOG.slice(tick % GPU_LOG.length), ...GPU_LOG.slice(0, tick % GPU_LOG.length)].slice(0, 3);
  return (
    <div className="win win-term">
      <div className="win-bar">
        <i />
        <i />
        <i />
        <span>bao@dgx-spark ~ watch nvidia-smi</span>
      </div>
      <div className="win-gpu">
        {['GB10', 'RTX PRO 5000', 'RTX PRO 2000'].map((name, i) => (
          <div key={name}>
            <span>{name}</span>
            <b>
              <i style={{ transform: `scaleX(${bars[i]})` }} />
            </b>
            <em>{Math.round(bars[i] * 100)}%</em>
          </div>
        ))}
      </div>
      <div className="win-log">
        {lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
      </div>
    </div>
  );
}


const COMMITS = ['feat(agent): structured tool errors', 'fix(nginx): csp header under 4 KB', 'refactor: ports & adapters', 'perf(vision): batch arcface', 'test: golden set v3', 'chore(release): v1.14'];

/** git log that keeps prepending commits. */
function GitWidget() {
  const { motionOn } = useSite();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!motionOn) return;
    const timer = window.setInterval(() => setN((v) => v + 1), 1300);
    return () => window.clearInterval(timer);
  }, [motionOn]);
  const rows = Array.from({ length: 3 }, (_, i) => COMMITS[(n + i) % COMMITS.length]);
  return (
    <div className="win mini">
      <div className="mini-title">git log --oneline</div>
      {rows.map((r, i) => (
        <motion.p key={`${n}-${i}`} initial={i === 0 ? { opacity: 0, x: -6 } : false} animate={{ opacity: 1, x: 0 }}>
          <b>{(0xa3f1 + n * 7 + i).toString(16)}</b> {r}
        </motion.p>
      ))}
    </div>
  );
}

/** pytest dots filling up, then a green summary. */
function TestWidget() {
  const { motionOn } = useSite();
  const [n, setN] = useState(24);
  useEffect(() => {
    if (!motionOn) return;
    const timer = window.setInterval(() => setN((v) => (v >= 34 ? 0 : v + 1)), 160);
    return () => window.clearInterval(timer);
  }, [motionOn]);
  const done = Math.min(n, 24);
  return (
    <div className="win mini">
      <div className="mini-title">pytest -q</div>
      <p className="dots">{'.'.repeat(done)}</p>
      <p className={done >= 24 ? 'pass' : 'muted'}>{done >= 24 ? '24 passed in 1.8s' : `${done}/24`}</p>
    </div>
  );
}

/** Latency sparkline that scrolls. */
function LatencyWidget() {
  const { motionOn } = useSite();
  const [pts, setPts] = useState(() => Array.from({ length: 24 }, (_, i) => 40 + Math.sin(i / 2) * 12));
  useEffect(() => {
    if (!motionOn) return;
    const timer = window.setInterval(() => setPts((p) => [...p.slice(1), 30 + Math.random() * 30]), 260);
    return () => window.clearInterval(timer);
  }, [motionOn]);
  const d = pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${(i / 23) * 100},${70 - v}`).join(' ');
  return (
    <div className="win mini">
      <div className="mini-title">p95 latency · {Math.round(pts[pts.length - 1] * 9)} ms</div>
      <svg viewBox="0 0 100 60" preserveAspectRatio="none">
        <path d={d} />
      </svg>
    </div>
  );
}

/** Wireframe cube in CSS 3D. */
function CubeWidget() {
  return (
    <div className="win mini cube-wrap">
      <div className="mini-title">mesh · cube_01</div>
      <div className="cube">
        {['f', 'b', 'l', 'r', 't', 'd'].map((face) => (
          <i key={face} className={`face ${face}`} />
        ))}
      </div>
    </div>
  );
}

const CONTAINERS = [['api', 'healthy'], ['worker', 'healthy'], ['vllm', 'serving'], ['qdrant', 'healthy']];

function DockerWidget() {
  return (
    <div className="win mini">
      <div className="mini-title">docker ps</div>
      {CONTAINERS.map(([name, state]) => (
        <p key={name} className="docker-row">
          <i />
          {name}
          <em>{state}</em>
        </p>
      ))}
    </div>
  );
}

function AgentChip({ label, text }: { label: string; text: string }) {
  return (
    <div className="win chip">
      <i />
      <b>{label}</b>
      <span>{text}</span>
    </div>
  );
}

interface DeckProps {
  base: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  scroll: MotionValue<number>;
  bounds?: unknown;
}

function Layer({ depth, className, delay, mx, my, scroll, children }: { depth: number; className: string; delay: number } & Omit<DeckProps, 'base' | 'bounds'> & { children: ReactNode }) {
  const { motionOn } = useSite();
  const [finePointer] = useState(() => window.matchMedia('(pointer: fine)').matches);
  const x = useTransform(mx, (v) => v * depth * 26);
  const yMouse = useTransform(my, (v) => v * depth * 18);
  const yScroll = useTransform(scroll, [0, 1], [0, -160 * depth]);
  const y = useTransform([yMouse, yScroll] as MotionValue<number>[], ([a, b]: number[]) => a + b);
  return (
    <motion.div
      className={`deck-layer ${className}`}
      style={motionOn ? { x, y } : {}}
      initial={motionOn ? { opacity: 0, scale: 0.85, rotateX: 25 } : false}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      <motion.div
        className="deck-drag"
        drag={finePointer}
        dragMomentum
        dragElastic={0.2}
        whileHover={{ scale: 1.06, rotateX: -6, rotateY: 8, zIndex: 20 }}
        whileDrag={{ scale: 1.1, zIndex: 30, cursor: 'grabbing' }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Floating windows and project shots across the hero, with mouse and scroll parallax. */
export function HeroDeck({ base, mx, my, scroll }: DeckProps) {
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });
  const p = { mx: smx, my: smy, scroll };
  return (
    <div className="hero-deck" aria-hidden="true">
      <Layer className="shot shot-a" depth={0.5} delay={base + 0.5} {...p}>
        <img src={asset('assets/images/edge-ai.png')} alt="" />
        <span>edge-ai · jetson</span>
      </Layer>
      <Layer className="shot shot-b" depth={0.35} delay={base + 0.6} {...p}>
        <img src={asset('assets/images/rag-platform.png')} alt="" />
        <span>rag-platform</span>
      </Layer>
      <Layer className="shot shot-c" depth={0.7} delay={base + 0.7} {...p}>
        <img src={asset('assets/cases/enterprise-rag.webp')} alt="" />
        <span>doc-agent · rag</span>
      </Layer>
      <Layer className="shot shot-d" depth={0.6} delay={base + 0.75} {...p}>
        <img src={asset('assets/cases/facespeed.png')} alt="" />
        <span>facespeed · riva</span>
      </Layer>
      <Layer className="shot shot-e" depth={0.45} delay={base + 0.78} {...p}>
        <img src={asset('assets/cases/retail-agent.jpg')} alt="" />
        <span>store-agent · mcp</span>
      </Layer>
      <Layer className="deck-code" depth={1.1} delay={base + 0.8} {...p}>
        <CodeWindow />
      </Layer>
      <Layer className="deck-term" depth={1.4} delay={base + 0.9} {...p}>
        <GpuWindow />
      </Layer>
      <Layer className="deck-git" depth={0.9} delay={base + 1} {...p}>
        <GitWidget />
      </Layer>
      <Layer className="deck-test" depth={1.6} delay={base + 1.05} {...p}>
        <TestWidget />
      </Layer>
      <Layer className="deck-lat" depth={1.2} delay={base + 1.1} {...p}>
        <LatencyWidget />
      </Layer>
      <Layer className="deck-cube" depth={1.8} delay={base + 1.15} {...p}>
        <CubeWidget />
      </Layer>
      <Layer className="deck-docker" depth={0.8} delay={base + 1.2} {...p}>
        <DockerWidget />
      </Layer>
      <Layer className="deck-chip1" depth={2} delay={base + 1.25} {...p}>
        <AgentChip label="planner" text="split → 3 tasks" />
      </Layer>
      <Layer className="deck-chip2" depth={1.7} delay={base + 1.3} {...p}>
        <AgentChip label="review" text="PR #686 approved" />
      </Layer>
      <Layer className="deck-chip3" depth={2.2} delay={base + 1.35} {...p}>
        <AgentChip label="test" text="golden set 20/20" />
      </Layer>
    </div>
  );
}
