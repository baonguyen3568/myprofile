import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, Search, X } from 'lucide-react';
import { categories, stackRail, type Project } from './content';
import { Reveal } from './motion';
import { asset, EASE, useSite } from './context';
import { useProjects } from '../features/github-projects/useProjects';

type Card = Project & { repo?: boolean };

function CodePoster({ project }: { project: Card }) {
  return (
    <div className="code-poster" aria-hidden="true">
      <div className="code-poster-bar">
        <i />
        <i />
        <i />
        <span>{project.file}</span>
      </div>
      <pre>
        <span className="tok-k">class</span> <span className="tok-f">{project.title.replace(/[^A-Za-z0-9]/g, '') || 'Project'}</span>:
        {'\n'}
        {'    '}
        <span className="tok-c"># {project.role}</span>
        {'\n'}
        {'    '}stack = [{project.stack.slice(0, 3).map((s) => `"${s}"`).join(', ')}]
        {'\n'}
        {'    '}
        <span className="tok-k">async def</span> <span className="tok-f">run</span>(self):
        {'\n'}
        {'        '}
        <span className="tok-k">return await</span> self.ship()
      </pre>
    </div>
  );
}

function ProjectCard({ project, index, onOpen }: { project: Card; index: number; onOpen: (p: Card) => void }) {
  const { motionOn } = useSite();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-14, 14]);
  return (
    <motion.article
      ref={ref}
      className="project-card"
      layout
      initial={motionOn ? { opacity: 0, y: 40 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.08 }}
      transition={{ duration: motionOn ? 0.6 : 0, delay: (index % 3) * 0.07, ease: EASE }}
      exit={{ opacity: 0, scale: 0.96 }}
    >
      <button className="project-open" onClick={() => onOpen(project)} aria-label={project.title}>
        <motion.div className="project-picture" style={motionOn ? { y } : {}}>
          {project.image ? <img src={project.image.startsWith('http') ? project.image : asset(project.image)} alt="" loading="lazy" /> : <CodePoster project={project} />}
        </motion.div>
        <span className="project-type">{project.repo ? 'REPO' : project.category.toUpperCase()}</span>
        <span className="project-hover">
          <ArrowUpRight size={22} />
        </span>
        <span className="project-frame" aria-hidden="true" />
      </button>
      <button className="project-caption" onClick={() => onOpen(project)}>
        <span className="project-number display">{String(index + 1).padStart(2, '0')}</span>
        <span>
          <h3>{project.title}</h3>
          <span className="project-category">
            {project.role} / {project.year}
          </span>
        </span>
        <ArrowUpRight size={20} />
      </button>
    </motion.article>
  );
}

export function ProjectModal({ project, onClose }: { project: Card | null; onClose: () => void }) {
  const { t } = useSite();
  useEffect(() => {
    if (!project) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            initial={{ y: 60, opacity: 0, rotateX: 8 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-tabs">
              <span className="tab active">README.md</span>
              <span className="tab">{project.file}</span>
              <button className="icon-button" onClick={onClose} aria-label={t.modal.close}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="gutter" aria-hidden="true">
                {Array.from({ length: 14 }, (_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>
              <div>
                <p className="eyebrow accent">
                  # {project.category} · {project.year}
                </p>
                <h3 className="display">{project.title}</h3>
                <p className="modal-role">{project.role}</p>
                <p className="modal-summary">{project.summary}</p>
                <ul>
                  {project.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <div className="skill-tags">
                  {project.stack.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
                {project.link && (
                  <a className="text-link" href={project.link.href} target="_blank" rel="noopener noreferrer">
                    {t.modal.open} {project.link.label} <ArrowUpRight size={16} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StackRail() {
  const { t, motionOn } = useSite();
  const [paused, setPaused] = useState(false);
  const [offset, setOffset] = useState(0);
  const running = motionOn && !paused;
  return (
    <Reveal className="brand-section">
      <div className="brand-heading">
        <p>
          {t.stack.lead}
          <br />
          <strong>{t.stack.strong}</strong>
        </p>
        <div>
          <button className="icon-button" aria-pressed={paused} aria-label="Pause" onClick={() => setPaused((p) => !p)}>
            {paused ? <Play size={13} /> : <Pause size={13} />}
          </button>
          <button className="icon-button" aria-label="Previous" onClick={() => setOffset((o) => o + 180)}>
            <ChevronLeft size={17} />
          </button>
          <button className="icon-button" aria-label="Next" onClick={() => setOffset((o) => o - 180)}>
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
      <div className="brand-viewport">
        <motion.div className="brand-nudge" animate={{ x: offset }} transition={{ duration: 0.6, ease: EASE }}>
          <div className={`brand-rail ${running ? '' : 'is-paused'}`}>
            {[0, 1].map((copy) => (
              <div className="brand-set" key={copy} aria-hidden={copy === 1 || undefined}>
                {stackRail.map((name) => (
                  <span className="brand-logo" key={name}>
                    <i>{'>'}</i>
                    {name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Reveal>
  );
}

export function Work({ onOpen }: { onOpen: (p: Card) => void }) {
  const { t } = useSite();
  const { projects: repos } = useProjects();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [showRepos, setShowRepos] = useState(false);
  const [limit, setLimit] = useState(9);

  const repoCards: Card[] = repos.map((r) => ({
    id: r.fullName,
    file: `${r.name}/README.md`,
    title: r.title,
    category: 'Infra',
    year: r.pushedAt.slice(0, 4),
    role: r.language ?? r.category ?? 'Repository',
    summary: r.description,
    bullets: r.summary ? [r.summary] : [],
    stack: r.keywords?.slice(0, 5) ?? [],
    link: { label: 'GitHub', href: r.url },
    repo: true
  }));

  const source: Card[] = showRepos ? repoCards : t.projects;
  const q = query.toLowerCase();
  const filtered = source.filter(
    (p) =>
      (showRepos || filter === 'all' || p.category === filter) &&
      `${p.title} ${p.role} ${p.stack.join(' ')} ${p.summary}`.toLowerCase().includes(q)
  );
  const shown = showRepos ? filtered.slice(0, limit) : filtered;

  return (
    <section id="work" className="portfolio section-wrap">
      <Reveal className="section-heading" sparks>
        <div>
          <span className="eyebrow">{t.work.eyebrow}</span>
          <h2>
            {showRepos ? t.work.all : t.work.title}
            <span className="accent">.</span>
          </h2>
        </div>
        <button
          className="text-link"
          onClick={() => {
            setShowRepos((v) => !v);
            setLimit(9);
            setFilter('all');
          }}
        >
          {showRepos ? t.work.selected : `${t.work.all} (${repos.length || '…'})`} <ArrowUpRight size={20} />
        </button>
      </Reveal>
      <Reveal className="portfolio-toolbar">
        <div className="filters" role="group" aria-label="Categories">
          {!showRepos &&
            ['all', ...categories].map((c) => (
              <button key={c} className={filter === c ? 'selected' : ''} aria-pressed={filter === c} onClick={() => setFilter(c)}>
                {c === 'all' ? t.work.filterAll : c}
                {filter === c && <motion.span className="filter-line" layoutId="filter-line" />}
              </button>
            ))}
          {showRepos && <span className="repo-note">{t.work.repoNote}</span>}
        </div>
        <label className="search-box">
          <Search size={14} />
          <span className="mono">{t.work.search}</span>
          <input type="search" aria-label="Search" placeholder={t.work.placeholder} value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </Reveal>
      <motion.div className="project-grid" layout>
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onOpen={onOpen} />
          ))}
        </AnimatePresence>
      </motion.div>
      {shown.length === 0 && (
        <div className="empty-state">
          <p>
            {t.work.empty} “{query}”.
          </p>
          <button className="text-link" onClick={() => setQuery('')}>
            {t.work.reset} <X size={15} />
          </button>
        </div>
      )}
      {showRepos && filtered.length > limit && (
        <div className="load-more">
          <button className="outline-button" onClick={() => setLimit((n) => n + 9)}>
            {t.work.more}
          </button>
          <span>
            {shown.length} {t.work.of} {filtered.length}
          </span>
        </div>
      )}
      <StackRail />
    </section>
  );
}

export type { Card };
