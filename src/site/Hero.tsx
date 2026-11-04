import { useCallback, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Download, MapPin, Play } from 'lucide-react';
import { links } from './content';
import { GithubIcon } from './icons';
import { Magnetic } from './motion';
import { asset, EASE, useSite } from './context';
import { BUILD_DELAY, BuildOverlay, CountUp } from './Build';
import { HeroDeck } from './HeroDeck';

export function Hero() {
  const { t, motionOn } = useSite();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const introY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const h = t.hero;
  const play = 'shown';
  const [building, setBuilding] = useState(motionOn);
  const [base] = useState(() => (motionOn ? BUILD_DELAY : 0));
  const finishBuild = useCallback(() => setBuilding(false), []);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  return (
    <section
      id="home"
      className="hero"
      ref={ref}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return;
        const box = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - box.left) / box.width - 0.5) * 2);
        my.set(((e.clientY - box.top) / box.height - 0.5) * 2);
      }}
    >
      <div className="hero-fog" aria-hidden="true">
        <i />
        <i />
      </div>
      {building && <BuildOverlay host={ref} onDone={finishBuild} />}
      <motion.div
        className="hero-top"
        initial={motionOn ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: base }}
      >
        <span data-build="span.kicker">
          {h.kicker}
          <br />
          <span className="muted">{h.kickerMuted}</span>
        </span>
        <span className="availability" data-build="span.status">
          <i />
          {h.status}
        </span>
      </motion.div>

      <motion.div
        className="hero-title display"
        aria-hidden="true"
        data-build="div.hero-title"
        style={motionOn ? { y: titleY } : {}}
        initial={motionOn ? { clipPath: 'inset(0 0 100% 0)' } : false}
        animate={play}
        variants={{ hidden: {}, shown: { clipPath: 'inset(0 0 0% 0)' } }}
        transition={{ duration: 1.4, delay: base, ease: EASE }}
      >
        {h.backdrop}
      </motion.div>

      <HeroDeck base={base} mx={mx} my={my} scroll={scrollYProgress} />

      <motion.div
        className="hero-intro"
        style={motionOn ? { y: introY } : {}}
        initial={motionOn ? { opacity: 0, x: -40 } : false}
        animate={play}
        variants={{ hidden: {}, shown: { opacity: 1, x: 0 } }}
        transition={{ duration: 0.9, delay: base + 0.35, ease: EASE }}
      >
        <motion.div style={motionOn ? { opacity: fade } : {}}>
        <p className="handwriting" data-build="p.hello" data-build-text="true">
          {h.hello}
        </p>
        <h1 className="display" data-build="h1.name" data-build-text="true">
          {h.name}
          <span className="accent">.</span>
        </h1>
        <p className="hero-role" data-build="p.role" data-build-text="true">
          {h.role[0]}
          <br />
          {h.role[1]}
        </p>
        <p className="hero-description" data-build="p.description">{h.description}</p>
        <Magnetic href="#work" className="primary-link" data-build="a.primary-link">
          {h.cta} <ArrowDown size={16} />
        </Magnetic>
        <span className="hero-location">
          <MapPin size={12} /> {h.location}
        </span>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-side"
        initial={motionOn ? { opacity: 0, x: 40 } : false}
        animate={play}
        variants={{ hidden: {}, shown: { opacity: 1, x: 0 } }}
        transition={{ duration: 1, delay: base + 0.55, ease: EASE }}
      >
        <motion.div style={motionOn ? { opacity: fade } : {}}>
        <div className="hero-manifesto" data-build="div.manifesto">
          <span className="crosshair" aria-hidden="true">
            ✳
          </span>
          <p>
            {h.manifesto[0]}
            <br />
            {h.manifesto[1]}
          </p>
        </div>
        <div className="hero-stats" data-build="div.stats">
          {h.stats.map(([value, a, b]) => (
            <div key={a}>
              <span className="display">
                <CountUp value={value} />
                <span className="accent">+</span>
              </span>
              <p>
                {a}
                <br />
                {b}
              </p>
            </div>
          ))}
          <a href={asset(h.cvHref)} download>
            <Download size={15} />
            <span>{h.cv}</span>
          </a>
        </div>
        </motion.div>
      </motion.div>

      <div className="hero-bottom">
        <a className="reel-button" href={links.github} target="_blank" rel="noopener noreferrer">
          <span className="play-circle">
            <GithubIcon size={13} />
          </span>
          {h.github}
          <span className="muted">github.com/baonguyen3568</span>
        </a>
        <button className="hero-scroll autoplay" onClick={() => window.dispatchEvent(new Event('director:toggle'))}>
          <Play size={12} />
          {h.autoplay}
          <ArrowDown size={13} />
        </button>
        <span className="edition">{h.edition}</span>
      </div>
    </section>
  );
}
