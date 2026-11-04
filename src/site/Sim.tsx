import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box, Move3d, Pause, Play, RotateCcw } from 'lucide-react';
import { InfoPop, Reveal } from './motion';
import { useSite } from './context';

interface Rig {
  joints: THREE.Object3D[];
  cube: THREE.Mesh;
}

const JOINTS = ['joint_1 · base yaw', 'joint_2 · shoulder', 'joint_3 · elbow', 'joint_4 · wrist'];

function buildArm(scene: THREE.Scene): Rig {
  const metal = new THREE.MeshStandardMaterial({ color: 0xc9d1da, metalness: 0.85, roughness: 0.28 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x2a313a, metalness: 0.6, roughness: 0.45 });
  const glow = new THREE.MeshStandardMaterial({ color: 0x8ab4ff, emissive: 0x3b6fd6, emissiveIntensity: 0.9, metalness: 0.2, roughness: 0.4 });

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 0.4, 48), dark);
  base.position.y = 0.2;
  scene.add(base);

  const j1 = new THREE.Group();
  j1.position.y = 0.4;
  scene.add(j1);
  const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 0.6, 40), metal);
  turret.position.y = 0.3;
  j1.add(turret);

  const j2 = new THREE.Group();
  j2.position.y = 0.7;
  j1.add(j2);
  j2.add(new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 32), glow));
  const upper = new THREE.Mesh(new THREE.BoxGeometry(0.34, 2.1, 0.4), metal);
  upper.position.y = 1.05;
  j2.add(upper);

  const j3 = new THREE.Group();
  j3.position.y = 2.1;
  j2.add(j3);
  j3.add(new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 32), glow));
  const fore = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.7, 0.32), metal);
  fore.position.y = 0.85;
  j3.add(fore);

  const j4 = new THREE.Group();
  j4.position.y = 1.7;
  j3.add(j4);
  j4.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 24), glow));
  const palm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.14, 0.3), dark);
  palm.position.y = 0.2;
  j4.add(palm);
  for (const side of [-1, 1]) {
    const finger = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.38, 0.22), metal);
    finger.position.set(side * 0.2, 0.44, 0);
    j4.add(finger);
  }

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.42, 0.42),
    new THREE.MeshStandardMaterial({ color: 0x9fc3e6, metalness: 0.3, roughness: 0.35, emissive: 0x1d3552, emissiveIntensity: 0.6 })
  );
  cube.position.set(2.2, 0.21, 0.6);
  scene.add(cube);

  return { joints: [j1, j2, j3, j4], cube };
}

/** Interactive robot-arm viewport styled after robotics simulators (three.js). */
export function SimViewport() {
  const { t, motionOn } = useSite();
  const s = t.sim;
  const canvasRef = useRef<HTMLDivElement>(null);
  const anglesRef = useRef<number[]>([0, 0, 0, 0]);
  const [angles, setAngles] = useState<number[]>([0, 0, 0, 0]);
  const [playing, setPlaying] = useState(true);
  const [frame, setFrame] = useState(0);
  const playingRef = useRef(playing);
  const resetRef = useRef<() => void>(() => {});

  useEffect(() => {
    playingRef.current = playing && motionOn;
  }, [playing, motionOn]);

  useEffect(() => {
    const host = canvasRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      host.dataset.nogl = 'true';
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    scene.add(new THREE.HemisphereLight(0xdfe8f2, 0x0b0d10, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(5, 8, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8ab4ff, 1.6);
    rim.position.set(-6, 4, -5);
    scene.add(rim);

    const grid = new THREE.GridHelper(14, 28, 0x8ab4ff, 0x3a4350);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.45;
    scene.add(grid);
    const axes = new THREE.AxesHelper(1.2);
    axes.position.set(-3.5, 0.01, 2.5);
    scene.add(axes);

    const rig = buildArm(scene);
    const gizmo = new THREE.Group();
    const arrow = (dir: THREE.Vector3, color: number) => gizmo.add(new THREE.ArrowHelper(dir, new THREE.Vector3(), 0.8, color, 0.2, 0.12));
    arrow(new THREE.Vector3(1, 0, 0), 0xff6b6b);
    arrow(new THREE.Vector3(0, 1, 0), 0x7be3a1);
    arrow(new THREE.Vector3(0, 0, 1), 0x8ab4ff);
    scene.add(gizmo);

    let theta = 0.75;
    let phi = 1.08;
    let radius = 9.5;
    const target = new THREE.Vector3(0.6, 1.6, 0);
    const placeCamera = () => {
      camera.position.set(target.x + radius * Math.sin(phi) * Math.sin(theta), target.y + radius * Math.cos(phi), target.z + radius * Math.sin(phi) * Math.cos(theta));
      camera.lookAt(target);
    };
    resetRef.current = () => {
      theta = 0.75;
      phi = 1.08;
      radius = 9.5;
    };

    let drag: { x: number; y: number } | null = null;
    const down = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY };
      try {
        renderer.domElement.setPointerCapture(e.pointerId);
      } catch {
        /* synthetic pointer from the director script */
      }
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      theta -= (e.clientX - drag.x) * 0.008;
      phi = Math.min(1.45, Math.max(0.35, phi - (e.clientY - drag.y) * 0.006));
      drag = { x: e.clientX, y: e.clientY };
    };
    const up = () => {
      drag = null;
    };
    renderer.domElement.addEventListener('pointerdown', down);
    renderer.domElement.addEventListener('pointermove', move);
    renderer.domElement.addEventListener('pointerup', up);

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    let visible = false;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(host);

    let time = 0;
    let last = performance.now();
    let raf = 0;
    const pose = (tt: number) => {
      // pick at the cube, lift, swing, place, return
      const cycle = (tt % 8) / 8;
      const swing = Math.sin(cycle * Math.PI * 2);
      const a = [0.35 + swing * 0.9, -0.55 + Math.sin(cycle * Math.PI * 4) * 0.25, 1.15 + Math.cos(cycle * Math.PI * 2) * 0.35, 0.4 + Math.sin(cycle * Math.PI * 6) * 0.3];
      rig.joints[0].rotation.y = a[0];
      rig.joints[1].rotation.z = a[1];
      rig.joints[2].rotation.z = a[2];
      rig.joints[3].rotation.z = a[3];
      anglesRef.current = a;
      const tip = new THREE.Vector3();
      rig.joints[3].getWorldPosition(tip);
      const carry = cycle > 0.15 && cycle < 0.6;
      if (carry) rig.cube.position.lerp(new THREE.Vector3(tip.x, Math.max(0.21, tip.y - 0.5), tip.z), 0.2);
      else rig.cube.position.y += (0.21 - rig.cube.position.y) * 0.15;
      rig.cube.rotation.y += 0.01;
      gizmo.position.copy(rig.cube.position).add(new THREE.Vector3(0, 0.35, 0));
    };
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible) {
        if (playingRef.current) time += dt;
        if (!drag && playingRef.current) theta += dt * 0.08;
        pose(time);
        placeCamera();
        renderer.render(scene, camera);
      }
      raf = requestAnimationFrame(tick);
    };
    pose(0);
    placeCamera();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);

    const readout = window.setInterval(() => {
      setAngles([...anglesRef.current]);
      setFrame(Math.floor(time * 24) % 192);
    }, 120);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(readout);
      ro.disconnect();
      io.disconnect();
      renderer.domElement.removeEventListener('pointerdown', down);
      renderer.domElement.removeEventListener('pointermove', move);
      renderer.domElement.removeEventListener('pointerup', up);
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  const deg = (r: number) => `${((r * 180) / Math.PI).toFixed(1)}°`;
  const activeJoint = Math.floor(frame / 48) % JOINTS.length;

  return (
    <section id="sim" className="sim section-wrap">
      <Reveal className="section-heading" sparks>
        <div>
          <span className="eyebrow">{s.eyebrow}</span>
          <h2>
            {s.title}
            <span className="accent">.</span>
          </h2>
        </div>
        <InfoPop>{s.body}</InfoPop>
      </Reveal>
      <Reveal className="sim-app">
        <div className="sim-menubar">
          <span className="sim-logo">
            <Box size={13} /> scene.usd
          </span>
          {s.tabs.map((tab, i) => (
            <span key={tab} className={i === 2 ? 'active' : ''}>
              {tab}
            </span>
          ))}
          <span className="sim-spacer" />
          <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? <Pause size={13} /> : <Play size={13} />}
          </button>
          <button onClick={() => resetRef.current()} aria-label="Reset view">
            <RotateCcw size={13} />
          </button>
        </div>
        <div className="sim-body">
          <aside className="sim-outliner">
            <p className="sim-panel-title">{s.outliner}</p>
            <ul>
              <li>/World</li>
              <li className="indent">GroundPlane</li>
              <li className="indent">Robot</li>
              {JOINTS.map((j, i) => (
                <li key={j} className={`indent2 ${i === activeJoint ? 'active' : ''}`}>
                  {j.split(' · ')[0]}
                </li>
              ))}
              <li className="indent">Cube_01</li>
              <li className="indent">DomeLight</li>
            </ul>
          </aside>
          <div className="sim-viewport">
            <div ref={canvasRef} className="sim-canvas" />
            <span className="sim-overlay tl">Perspective · RTX Real-Time</span>
            <span className="sim-overlay tr">
              <Move3d size={12} /> {s.drag}
            </span>
          </div>
          <aside className="sim-props">
            <p className="sim-panel-title">{s.props}</p>
            {JOINTS.map((j, i) => (
              <div key={j} className={`sim-prop ${i === activeJoint ? 'active' : ''}`}>
                <span>{j}</span>
                <strong>{deg(angles[i])}</strong>
                <i style={{ width: `${Math.min(100, Math.abs(angles[i]) * 45)}%` }} />
              </div>
            ))}
            <div className="sim-prop">
              <span>physics · step</span>
              <strong>1/60 s</strong>
            </div>
          </aside>
        </div>
        <div className="sim-timeline">
          <span>{String(frame).padStart(3, '0')}</span>
          <div className="sim-track">
            <i style={{ left: `${(frame / 192) * 100}%` }} />
            {[0, 48, 96, 144].map((k) => (
              <b key={k} style={{ left: `${(k / 192) * 100}%` }} />
            ))}
          </div>
          <span>192</span>
        </div>
      </Reveal>
    </section>
  );
}
