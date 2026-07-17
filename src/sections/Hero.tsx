import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.hero-kicker', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, 0.3)
        .fromTo('.hero-title-zh', { opacity: 0, y: 60, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4 }, 0.5)
        .fromTo('.hero-title-en', { opacity: 0, letterSpacing: '0.2em' }, { opacity: 1, letterSpacing: '0.85em', duration: 1.6 }, 0.8)
        .fromTo('.hero-sub', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1 }, 1.2)
        .fromTo('.hero-meta', { opacity: 0 }, { opacity: 1, duration: 1.2 }, 1.6)
        .fromTo('.hero-hint', { opacity: 0 }, { opacity: 1, duration: 1 }, 2.0);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" data-chapter className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden">
      <div ref={ref} className="text-center relative z-10">
        <div className="hero-kicker font-mono2 text-[11px] md:text-xs tracking-[0.6em] text-cyan-200/70 uppercase opacity-0">
          一次垂直穿越 · From the Abyss to the Edge
        </div>

        <h1 className="hero-title-zh font-serif-sc font-black text-[26vw] md:text-[15rem] leading-none mt-8 text-glow select-none opacity-0">
          尺度
        </h1>
        <div className="hero-title-en font-grotesk font-light text-lg md:text-2xl tracking-[0.85em] text-white/70 mt-4 opacity-0 pl-3">
          SCALE
        </div>

        <p className="hero-sub mt-12 text-white/55 max-w-lg mx-auto leading-loose text-sm md:text-base font-light opacity-0">
          从马里亚纳海沟底部出发，垂直上升 930 亿光年——
          <br />
          途经深海热泉、极光帘幕、行星轨道与星系长城，
          <br />
          直到时空与认知的共同边界。
        </p>

        <div className="hero-meta mt-14 flex items-center justify-center gap-8 md:gap-14 font-mono2 text-[10px] md:text-xs text-white/40 opacity-0">
          <div className="text-center">
            <div className="text-cyan-100/90 text-sm md:text-base tabular-nums">−10,909 m</div>
            <div className="mt-1 tracking-widest">起点 · 挑战者深渊</div>
          </div>
          <div className="w-px h-8 bg-white/15" />
          <div className="text-center">
            <div className="text-cyan-100/90 text-sm md:text-base tabular-nums">8.8×10²⁶ m</div>
            <div className="mt-1 tracking-widest">终点 · 可观测宇宙</div>
          </div>
          <div className="w-px h-8 bg-white/15" />
          <div className="text-center">
            <div className="text-cyan-100/90 text-sm md:text-base tabular-nums">62</div>
            <div className="mt-1 tracking-widest">跨越的数量级</div>
          </div>
        </div>
      </div>

      <div className="hero-hint absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0">
        <span className="font-mono2 text-[10px] tracking-[0.5em] text-white/45 uppercase">Scroll · 开始上升</span>
        <div className="relative w-px h-14 bg-white/10 overflow-hidden">
          <div className="absolute top-0 w-full h-6 bg-gradient-to-b from-transparent via-cyan-200 to-transparent animate-scroll-hint" />
        </div>
      </div>
    </section>
  );
}
