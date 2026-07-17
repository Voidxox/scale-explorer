import { useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollState, notifyScroll } from '../lib/data';
import ShaderBackground from '../components/ShaderBackground';
import HUD from '../components/HUD';
import Hero from '../sections/Hero';
import { Abyss, Atmosphere, Solar, DeepSpace, Galaxy, Cosmos } from '../sections/Chapters';
import Ladder from '../sections/Ladder';
import Outro from '../sections/Outro';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    let lastY = 0, lastT = performance.now();
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      const now = performance.now();
      const dt = Math.max(16, now - lastT);
      const vel = ((window.scrollY - lastY) / dt) * 16;
      lastY = window.scrollY;
      lastT = now;
      scrollState.velocity = scrollState.velocity * 0.85 + vel * 0.15;
      scrollState.progress = p;

      const sections = document.querySelectorAll<HTMLElement>('[data-chapter]');
      let ch = 0;
      sections.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        if (r.top < innerHeight * 0.5) ch = i;
      });
      scrollState.chapter = ch;
      notifyScroll();
    };
    window.addEventListener('scroll', update, { passive: true });
    update();

    const onMouse = (e: MouseEvent) => {
      scrollState.mouse.x = e.clientX / innerWidth;
      scrollState.mouse.y = 1 - e.clientY / innerHeight;
      const dot = dotRef.current, ring = ringRef.current;
      if (dot) dot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      if (ring) {
        const rx = parseFloat(ring.dataset.x || '0'), ry = parseFloat(ring.dataset.y || '0');
        const nx = rx + (e.clientX - 18 - rx) * 0.18;
        const ny = ry + (e.clientY - 18 - ry) * 0.18;
        ring.dataset.x = String(nx); ring.dataset.y = String(ny);
        ring.style.transform = `translate(${nx}px, ${ny}px)`;
      }
    };
    window.addEventListener('mousemove', onMouse);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('mousemove', onMouse);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  const navigate = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el && lenisRef.current) lenisRef.current.scrollTo(el, { duration: 2.2 });
  }, []);

  const toTop = useCallback(() => {
    lenisRef.current?.scrollTo(0, { duration: 3 });
  }, []);

  return (
    <main className="relative isolate min-h-screen">
      <div aria-hidden className="space-fallback fixed inset-0 z-0 pointer-events-none" />
      <ShaderBackground />
      <div className="relative z-10">
        <HUD onNavigate={navigate} />
        <div ref={dotRef} className="cursor-dot" />
        <div ref={ringRef} className="cursor-ring" />
        <Hero />
        <Abyss />
        <Atmosphere />
        <Solar />
        <DeepSpace />
        <Galaxy />
        <Cosmos />
        <Ladder />
        <Outro onTop={toTop} />
      </div>
    </main>
  );
}
