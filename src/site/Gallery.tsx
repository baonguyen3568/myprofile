import { useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import { useProjects } from '../features/github-projects/useProjects';
import { asset, EASE, useSite } from './context';
import { Reveal } from './motion';

interface Tile {
  src: string;
  title: string;
  desc: string;
  href?: string;
}

const LOCAL: Tile[] = [
  { src: 'assets/cases/face-attendance.png', title: 'VisionID', desc: 'Face-recognition attendance' },
  { src: 'assets/cases/enterprise-rag.webp', title: 'Doc Agent RAG', desc: 'Cited answers on DGX Spark' },
  { src: 'assets/images/rag-platform.png', title: 'RAG platform', desc: 'Chatbot workspace' },
  { src: 'assets/cases/facespeed.png', title: 'FaceSpeed', desc: 'Voice RAG with an avatar' },
  { src: 'assets/cases/retail-agent.jpg', title: 'Retail agent', desc: 'ReAct storefront agent' },
  { src: 'assets/cases/story-studio.png', title: 'Story Studio', desc: 'Local AI media pipeline' }
];

function TileView({ tile, i, progress, onOpen }: { tile: Tile; i: number; progress: MotionValue<number>; onOpen: () => void }) {
  const { motionOn } = useSite();
  const depth = ((i * 37) % 5) / 4 - 0.5;
  const y = useTransform(progress, [0, 1], [120 * depth, -120 * depth]);
  const rot = ((i * 53) % 11) - 5;
  return (
    <motion.button
      className="tile"
      style={motionOn ? { y, rotate: rot } : { rotate: rot }}
      initial={motionOn ? { opacity: 0, scale: 0.6, rotateX: 40 } : false}
      whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: (i % 6) * 0.05, ease: EASE }}
      whileHover={{ scale: 1.08, rotate: 0, zIndex: 5 }}
      onClick={onOpen}
      aria-label={tile.title}
    >
      <img src={tile.src.startsWith('http') ? tile.src : asset(tile.src)} alt="" loading="lazy" />
      <span>{tile.title}</span>
    </motion.button>
  );
}

/** Image-first collage: project shots plus banners from public repositories, layered with parallax. */
export function Gallery() {
  const { t } = useSite();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const { projects } = useProjects();
  const [open, setOpen] = useState<Tile | null>(null);
  const remote: Tile[] = projects
    .filter((p) => p.bannerImage && /\.(png|jpe?g|webp|gif)$/i.test(p.bannerImage) && p.bannerImage.startsWith('https://raw.githubusercontent.com/baonguyen3568/'))
    .slice(0, 11)
    .map((p) => ({ src: p.bannerImage!, title: p.title, desc: p.description, href: p.url }));
  const tiles = [...LOCAL, ...remote];
  const g = t.gallery;

  return (
    <section id="gallery" className="gallery section-wrap" ref={ref}>
      <Reveal className="section-heading" sparks>
        <div>
          <span className="eyebrow">{g.eyebrow}</span>
          <h2>
            {g.title}
            <span className="accent">.</span>
          </h2>
        </div>
        <span className="gallery-count">
          {tiles.length} {g.count}
        </span>
      </Reveal>
      <div className="mosaic">
        {tiles.map((tile, i) => (
          <TileView key={tile.src} tile={tile} i={i} progress={scrollYProgress} onOpen={() => setOpen(tile)} />
        ))}
        <AnimatePresence>
          {open && (
            <motion.button
              className="tile-pop"
              onClick={() => setOpen(null)}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: EASE }}
              aria-label={g.close}
            >
              <img src={open.src.startsWith('http') ? open.src : asset(open.src)} alt="" />
              <span className="tile-pop-text">
                <b>{open.title}</b>
                {open.desc}
                {open.href && (
                  <a href={open.href} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    GitHub <ArrowUpRight size={12} />
                  </a>
                )}
              </span>
              <X size={14} className="tile-pop-x" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
