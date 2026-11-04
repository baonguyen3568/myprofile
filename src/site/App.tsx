import { useEffect, useRef, useState, type ReactNode } from 'react';
import { content, links, type Lang } from './content';
import { GithubIcon } from './icons';
import './site.css';

type Theme = 'dark' | 'light';
const SECTIONS = ['about', 'experience', 'projects', 'talks'] as const;

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage can be blocked; the page works without it */
  }
}

/** Renders **bold** spans inside otherwise plain copy. */
function rich(text: string): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));
}

function Pills({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <ul className="pills" aria-label="Technologies">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}

function Title({ text, href }: { text: string; href?: string }) {
  if (!href) return <h3>{text}</h3>;
  return (
    <h3>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {text}
        <span className="arrow" aria-hidden="true">
          ↗
        </span>
      </a>
    </h3>
  );
}

function CopyButton({ value, label, done }: { value: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="copy"
      onClick={() =>
        navigator.clipboard?.writeText(value).then(
          () => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
          },
          () => undefined
        )
      }
    >
      {copied ? done : label}
    </button>
  );
}

export function App() {
  const [lang, setLang] = useState<Lang>(() => (read('lang') === 'vi' ? 'vi' : 'en'));
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'));
  const [active, setActive] = useState<string>('about');
  const spot = useRef<HTMLDivElement>(null);
  const t = content[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    write('lang', lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    write('theme', theme);
  }, [theme]);

  // Soft light that follows the mouse, desktop only.
  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const move = (e: PointerEvent) => {
      spot.current?.style.setProperty('--x', `${e.clientX}px`);
      spot.current?.style.setProperty('--y', `${e.clientY}px`);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  // Highlight the nav item for the section in the middle of the screen.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: '-30% 0px -60% 0px' }
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="spotlight" ref={spot} aria-hidden="true" />
      <a className="skip" href="#content">
        Skip to content
      </a>
      <div className="wrap">
        <header className="side">
          <div>
            <h1>Nguyễn Lê Quốc Bảo</h1>
            <h2>{t.role}</h2>
            <p className="tagline">{t.tagline}</p>
            <p className="status">
              <i aria-hidden="true" />
              {t.status}
            </p>
            <nav className="nav" aria-label="Sections">
              {SECTIONS.map((id) => (
                <a key={id} href={`#${id}`} className={active === id ? 'on' : undefined} aria-current={active === id ? 'true' : undefined}>
                  {t.nav[id]}
                </a>
              ))}
            </nav>
          </div>

          <div className="contact">
            <div className="lines">
              <span>
                <a href={`mailto:${links.email}`}>{links.email}</a>
                <CopyButton value={links.email} label={t.copy} done={t.copied} />
              </span>
              <span>
                <a href={`tel:${links.phoneRaw}`}>{links.phone}</a>
                <CopyButton value={links.phoneRaw} label={t.copy} done={t.copied} />
              </span>
            </div>
            <div className="socials">
              <a href={links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <GithubIcon size={22} />
              </a>
              <div className="toggles">
                {(['en', 'vi'] as Lang[]).map((code) => (
                  <button key={code} type="button" aria-pressed={lang === code} onClick={() => setLang(code)}>
                    {code.toUpperCase()}
                  </button>
                ))}
                <button type="button" aria-label={t.theme} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                  {theme === 'dark' ? '☀' : '☾'}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main id="content">
          <section id="about" aria-label={t.nav.about}>
            <h2 className="sec-head">{t.nav.about}</h2>
            <div className="about">
              {t.about.map((p) => (
                <p key={p.slice(0, 24)}>{rich(p)}</p>
              ))}
            </div>
          </section>

          <section id="experience" aria-label={t.nav.experience}>
            <h2 className="sec-head">{t.nav.experience}</h2>
            <ol className="list">
              {t.experience.map((e) => (
                <li key={e.when + e.org} className="item">
                  <p className="when">{e.when}</p>
                  <div className="body">
                    <Title text={`${e.title}\u00a0· ${e.org}`} href={e.href} />
                    <p className="desc">{e.desc}</p>
                    <Pills tags={e.tags} />
                  </div>
                </li>
              ))}
            </ol>
            <a className="more" href={asset(t.resumeHref)} target="_blank" rel="noopener noreferrer">
              <span>{t.resume}</span>
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </a>
          </section>

          <section id="projects" aria-label={t.nav.projects}>
            <h2 className="sec-head">{t.nav.projects}</h2>
            <ul className="list">
              {t.projects.map((p) => (
                <li key={p.title} className="item proj">
                  {p.image ? (
                    <img className="thumb" src={asset(p.image)} alt="" loading="lazy" width="200" height="125" />
                  ) : (
                    <div className="thumb tile" aria-hidden="true">
                      <b>{p.tile?.[0]}</b>
                      <span>{p.tile?.[1]}</span>
                    </div>
                  )}
                  <div className="body">
                    <Title text={p.title} href={p.href} />
                    <p className="desc">{p.desc}</p>
                    <p className="metric">
                      {p.metrics.map((m) => (
                        <span key={m}>{m}</span>
                      ))}
                    </p>
                    <Pills tags={p.tags} />
                  </div>
                </li>
              ))}
            </ul>
            <a className="more" href={links.repos} target="_blank" rel="noopener noreferrer">
              <span>{t.archive}</span>
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </a>
          </section>

          <section id="talks" aria-label={t.nav.talks}>
            <h2 className="sec-head">{t.nav.talks}</h2>
            <ul className="list">
              {t.talks.map((k) => (
                <li key={k.title} className="item">
                  <p className="when">{k.when}</p>
                  <div className="body">
                    <h3>{k.title}</h3>
                    <p className="sub">{k.org}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <footer>
            {t.footer[0]}
            <a href={links.inspiration} target="_blank" rel="noopener noreferrer">
              {t.footer[1]}
            </a>
            {t.footer[2]}
          </footer>
        </main>
      </div>
    </>
  );
}
