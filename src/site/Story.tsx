import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { InfoPop, Reveal } from './motion';
import { CountUp } from './Build';
import { useSite } from './context';

export function Impact() {
  const { t } = useSite();
  const [expanded, setExpanded] = useState(false);
  const c = t.impact;
  return (
    <section id="impact" className={`recognition section-wrap ${expanded ? 'awards-expanded' : ''}`}>
      <Reveal className="recognition-intro" sparks>
        <span className="eyebrow">{c.eyebrow}</span>
        <h2 className="display">
          {c.title[0]}
          <br />
          <span className="accent">{c.title[1]}</span>
        </h2>
        <div className="award-total">
          <svg className="laurel" viewBox="0 0 60 100" aria-hidden="true">
            <path d="M48 94C8 68 9 30 35 5M22 61C8 60 3 49 3 44c12 0 19 6 19 17zm-5-19C5 35 6 23 8 19c11 5 13 14 9 23zm7-20C15 12 20 3 24 0c7 8 6 16 0 22zM31 79C17 79 8 70 7 64c13-2 22 4 24 15zm-3-18c-5-10-2-19 7-25 5 11 1 20-7 25zm10 24c-6-11-4-20 5-27 6 9 5 20-5 27z" fill="currentColor" />
          </svg>
          <span className="display">
            <CountUp value={c.big} />
            <span className="accent">+</span>
          </span>
          <svg className="laurel" viewBox="0 0 60 100" aria-hidden="true">
            <g transform="translate(60 0) scale(-1 1)">
              <path d="M48 94C8 68 9 30 35 5M22 61C8 60 3 49 3 44c12 0 19 6 19 17zm-5-19C5 35 6 23 8 19c11 5 13 14 9 23zm7-20C15 12 20 3 24 0c7 8 6 16 0 22zM31 79C17 79 8 70 7 64c13-2 22 4 24 15zm-3-18c-5-10-2-19 7-25 5 11 1 20-7 25zm10 24c-6-11-4-20 5-27 6 9 5 20-5 27z" fill="currentColor" />
            </g>
          </svg>
          <span className="award-total-label">{c.bigLabel}</span>
        </div>
        <InfoPop label="why.md">
          {c.body[0]} {c.body[1]}
        </InfoPop>
      </Reveal>
      <div className="recognition-list">
        <div className="recognition-list-head">
          <span>{c.listHead[0]}</span>
          <span>{c.listHead[1]}</span>
        </div>
        <ol>
          {c.rows.map(([title, note, value], i) => (
            <Reveal as="li" key={title} className={`recognition-row ${i > 3 ? 'additional-award' : ''}`} delay={i * 0.05}>
              <span className="award-index">0{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{note}</p>
              </div>
              <span className="award-year display">
                <CountUp value={value} />
              </span>
            </Reveal>
          ))}
        </ol>
        <button className="award-expand" aria-expanded={expanded} onClick={() => setExpanded((v) => !v)}>
          {expanded ? c.less : c.more}
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
    </section>
  );
}

const V1 = `# v1: planner → executor
plan = planner.generate(ctx)        # JSON plan
for step in plan.steps:
    try:
        result = executor.run(step)
    except PlanError:
        return CANNED_REPLY         # model gave up
    ctx.append(result)              # raw dump
return writer.answer(ctx)`;

const V2 = `# v2: one tool-calling loop
while turn < MAX_TURNS:
    reply = llm.chat(memory.view(), tools)
    if not reply.tool_calls:
        return reply.text
    for call in reply.tool_calls:
        out = tools.run(call)       # never raises
        memory.add(call, out)       # error → JSON
    turn += 1`;

function CodePane({ code }: { code: string }) {
  return (
    <pre className="code-pane">
      {code.split('\n').map((line, i) => (
        <span key={i} className="code-line">
          <span className="ln">{String(i + 1).padStart(2, ' ')}</span>
          <span className={line.trim().startsWith('#') ? 'tok-c' : ''}>{line}</span>
        </span>
      ))}
    </pre>
  );
}

export function Breakdown() {
  const { t, motionOn } = useSite();
  const ref = useRef<HTMLElement>(null);
  const [dragged, setDragged] = useState(false);
  const [cut, setCut] = useState(65);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (!dragged && motionOn) setCut(Math.round(90 - value * 80));
  });
  const x = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const b = t.breakdown;
  return (
    <section id="diff" className="breakdown section-wrap" ref={ref} aria-labelledby="breakdown-title">
      <Reveal className="breakdown-copy" sparks>
        <span className="eyebrow">{b.eyebrow}</span>
        <motion.h2 id="breakdown-title" className="display" style={motionOn ? { x } : {}}>
          {b.title[0]}
          <br />
          <span className="accent">{b.title[1]}</span>
        </motion.h2>
        <p className="lead-1">{b.body[0]}</p>
        <InfoPop label="CHANGELOG.md">{b.body[1]}</InfoPop>
        <span className="breakdown-credit">
          {b.credit[0]}
          <br />
          {b.credit[1]}
        </span>
      </Reveal>
      <Reveal className="comparison vsc">
        <div className="vsc-tabs">
          <span className={cut > 50 ? 'active' : ''}>planner_executor.py</span>
          <span className={cut <= 50 ? 'active' : ''}>tool_loop.py</span>
          <em>git diff --stat · 1 file changed, 9 insertions(+), 9 deletions(-)</em>
        </div>
        <div className="vsc-body">
          <aside className="vsc-explorer">
            <p>EXPLORER</p>
            <span>▾ ntcsale</span>
            <span className="d1">▾ agent</span>
            <span className={`d2 ${cut > 50 ? 'on' : ''}`}>planner_executor.py</span>
            <span className={`d2 ${cut <= 50 ? 'on' : ''}`}>tool_loop.py</span>
            <span className="d2">memory.py</span>
            <span className="d2">tools.py</span>
            <span className="d1">▸ api</span>
            <span className="d1">▸ tests</span>
          </aside>
        <div className="comparison-stage" style={{ '--cut': `${motionOn || dragged ? cut : 50}%` } as React.CSSProperties}>
          <div className="comparison-raw">
            <CodePane code={V1} />
          </div>
          <div className="comparison-final">
            <CodePane code={V2} />
          </div>
          <span className="comparison-label raw-label">{b.left}</span>
          <span className="comparison-label final-label">{b.right}</span>
          <div className="comparison-divider">
            <span>
              <ChevronLeft size={14} />
              <ChevronRight size={14} />
            </span>
          </div>
          <input
            aria-label={b.hint}
            type="range"
            min="0"
            max="100"
            value={cut}
            onChange={(e) => {
              setDragged(true);
              setCut(Number(e.target.value));
            }}
          />
        </div>
        </div>
        <div className="vsc-status">
          <span>⎇ main</span>
          <span>✓ 0 problems</span>
          <span>Python 3.12</span>
          <span>UTF-8</span>
        </div>
        <div className="comparison-caption">
          <span>{b.hint}</span>
          <span>{b.hint2}</span>
        </div>
      </Reveal>
    </section>
  );
}

export function About() {
  const { t, motionOn } = useSite();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 75%'] });
  const a = t.about;
  return (
    <section id="about" className="about section-wrap" ref={ref}>
      <Reveal className="about-lead" sparks>
        <div>
          <span className="eyebrow">{a.eyebrow}</span>
          <h2 className="display">
            {a.title[0]}
            <br />
            {a.title[1]}
            <span className="accent">{a.accent}</span>
          </h2>
        </div>
        <InfoPop>{a.body}</InfoPop>
      </Reveal>
      <div className="studio-grid">
        <Reveal className="education-panel">
          <h3 className="panel-heading">{a.eduTitle}</h3>
          <p className="eyebrow accent">{a.eduLabel}</p>
          {a.edu.map(([name, year, note]) => (
            <div className="education-row" key={name}>
              <strong>{name}</strong>
              <span>{year}</span>
              <p>{note}</p>
            </div>
          ))}
          <p className="eyebrow accent skills-heading">{a.toolkit}</p>
          <div className="skill-tags">
            {a.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </Reveal>
        <div className="process-panel">
          <Reveal>
            <h3 className="panel-heading">{a.processTitle}</h3>
          </Reveal>
          <div className="process-list">
            <div className="process-track">
              <motion.div style={{ scaleY: motionOn ? scrollYProgress : 1 }} />
            </div>
            {a.process.map(([num, title, text], i) => (
              <Reveal className="process-row" key={num} delay={i * 0.04}>
                <span className="process-num display">{num}</span>
                <span className="process-node" />
                <div>
                  <h4>{title}</h4>
                  <p>{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal className="quote-panel">
          <span className="quote-mark display">“</span>
          <blockquote>
            {a.quote[0]}
            <br />
            {a.quote[1]}
            <br />
            <em>
              {a.quote[2]}
              <br />
              {a.quote[3]}
            </em>
          </blockquote>
          <span className="handwriting signature">{a.sign}</span>
          <div className="quote-bottom">
            {a.quoteBottom[0]}
            <br />
            {a.quoteBottom[1]}
            <span className="quote-symbol" aria-hidden="true">
              ▍
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
