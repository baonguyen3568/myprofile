import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useSpring } from 'framer-motion';
import { ArrowUpRight, ChevronDown, ChevronUp, Download, Mail, MapPin, Phone, Play, Plus, X } from 'lucide-react';
import { links } from './content';
import { GithubIcon } from './icons';
import { Magnetic, Reveal } from './motion';
import { asset, EASE, useSite } from './context';

export function Journey() {
  const { t } = useSite();
  const [open, setOpen] = useState<number | null>(0);
  const j = t.journey;
  return (
    <section id="journey" className="journey section-wrap">
      <Reveal className="section-heading" sparks>
        <div>
          <span className="eyebrow">{j.eyebrow}</span>
          <h2>
            {j.title}
            <span className="accent">.</span>
          </h2>
        </div>
        <a className="text-link" href={asset(t.hero.cvHref)} download>
          {j.resume} <Download size={16} />
        </a>
      </Reveal>
      <div className="journey-grid">
        <div className="experience-list">
          {j.rows.map(([date, title, place, text], i) => (
            <Reveal className={`experience-row ${open === i ? 'is-open' : ''}`} key={title}>
              <button aria-expanded={open === i} aria-controls={`job-${i}`} onClick={() => setOpen(open === i ? null : i)}>
                <span className="experience-date">
                  <i className="commit-dot" />
                  {date}
                </span>
                <span>
                  <h3>{title}</h3>
                  <span className="experience-place">{place}</span>
                </span>
                {open === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    id={`job-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <p>{text}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reveal>
          ))}
        </div>
        <Reveal className="awards-panel">
          <p className="eyebrow">{j.milestonesEyebrow}</p>
          <h3 className="display">
            {j.milestonesTitle[0]}
            <br />
            <span className="accent">{j.milestonesTitle[1]}</span>
          </h3>
          <div className="award-list">
            {j.milestones.map(([title, note], i) => (
              <div className="award-item" key={title}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <span>
                  {title}
                  <small>{note}</small>
                </span>
                <ArrowUpRight size={18} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const DEPLOY_LOG = ['$ docker compose up -d', '✓ api      healthy', '✓ worker   healthy', '✓ vllm     ready (27B NVFP4)', '$ curl /health → 200 OK'];

function DeployCard() {
  const { t, motionOn } = useSite();
  const rotateX = useSpring(6, { stiffness: 150, damping: 18 });
  const rotateY = useSpring(-10, { stiffness: 150, damping: 18 });
  const [running, setRunning] = useState(false);
  const [lines, setLines] = useState(0);

  const run = () => {
    if (running) return;
    setRunning(true);
    setLines(0);
    DEPLOY_LOG.forEach((_, i) => window.setTimeout(() => setLines(i + 1), 380 * (i + 1)));
    window.setTimeout(() => setRunning(false), 380 * (DEPLOY_LOG.length + 2));
  };

  return (
    <Reveal className="contact-visual">
      <motion.div
        className="deploy-card"
        style={motionOn ? { rotateX, rotateY, transformPerspective: 900 } : {}}
        onPointerMove={(event) => {
          if (!motionOn) return;
          const box = event.currentTarget.getBoundingClientRect();
          rotateY.set(((event.clientX - box.left) / box.width - 0.5) * 18);
          rotateX.set(-((event.clientY - box.top) / box.height - 0.5) * 14);
        }}
        onPointerLeave={() => {
          rotateX.set(6);
          rotateY.set(-10);
        }}
      >
        <div className="code-poster-bar">
          <i />
          <i />
          <i />
          <span>bao@prod: ~</span>
        </div>
        <div className="deploy-body">
          <p className="display">
            {t.contact.card[0]}
            <br />
            <span className="accent">{t.contact.card[1]}</span>
          </p>
          <div className="deploy-log mono">
            {DEPLOY_LOG.slice(0, lines).map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
          <button className="deploy-play" onClick={run} aria-label={t.contact.cardHint}>
            <Play size={18} fill="currentColor" />
          </button>
        </div>
      </motion.div>
      <span className="deploy-hint">{t.contact.cardHint}</span>
    </Reveal>
  );
}

export function Contact() {
  const { t } = useSite();
  const [formOpen, setFormOpen] = useState(false);
  const c = t.contact;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = `${data.get('message') ?? ''}\n\n— ${data.get('name') ?? ''}`;
    window.location.href = `mailto:${links.email}?subject=${encodeURIComponent('Hello Bảo')}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contact" className="contact section-wrap">
      <div className="contact-grid">
        <Reveal className="contact-intro" sparks>
          <span className="eyebrow">{c.eyebrow}</span>
          <h2 className="display">
            {c.title[0]}
            <br />
            {c.title[1]}
            <span className="accent">.</span>
          </h2>
          <p>
            {c.body[0]}
            <br />
            {c.body[1]}
          </p>
          <Magnetic href={`mailto:${links.email}`} className="contact-cta">
            <span className="round-arrow">
              <ArrowUpRight size={20} />
            </span>
            {c.cta}
          </Magnetic>
        </Reveal>
        <Reveal className="contact-links" delay={0.1}>
          <a href={`mailto:${links.email}`}>
            <Mail size={18} />
            <span>
              <small>{c.email}</small>
              {links.email}
            </span>
            <ArrowUpRight size={16} />
          </a>
          <a href={links.github} target="_blank" rel="noopener noreferrer">
            <GithubIcon size={18} />
            <span>
              <small>{c.github}</small>
              github.com/baonguyen3568
            </span>
            <ArrowUpRight size={16} />
          </a>
          <a href={links.phoneHref}>
            <Phone size={18} />
            <span>
              <small>{c.phone}</small>
              {links.phone}
            </span>
            <ArrowUpRight size={16} />
          </a>
          <div>
            <MapPin size={18} />
            <span>
              <small>{c.based}</small>
              {c.city}
            </span>
          </div>
        </Reveal>
        <DeployCard />
      </div>
      <div className={`contact-form-wrap ${formOpen ? 'is-open' : ''}`}>
        <button className="contact-form-toggle" aria-expanded={formOpen} onClick={() => setFormOpen((v) => !v)}>
          {c.formToggle}
          {formOpen ? <X size={18} /> : <Plus size={18} />}
        </button>
        <AnimatePresence initial={false}>
          {formOpen && (
            <motion.form
              className="contact-form"
              onSubmit={submit}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <input name="name" required placeholder={c.name} aria-label={c.name} />
              <textarea name="message" required rows={3} placeholder={c.message} aria-label={c.message} />
              <button type="submit" className="outline-button">
                {c.send} <ArrowUpRight size={16} />
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
      <footer className="site-footer">
        <a className="wordmark" href="#home">
          QUỐC BẢO<span className="wordmark-mark">®</span>
        </a>
        <span>{c.footer}</span>
        <div>
          <a href={links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <GithubIcon size={16} />
          </a>
          <a href={`mailto:${links.email}`} aria-label="Email">
            <Mail size={16} />
          </a>
          <a href="#home" aria-label="Top">
            <ArrowUpRight size={16} />
          </a>
        </div>
      </footer>
    </section>
  );
}
