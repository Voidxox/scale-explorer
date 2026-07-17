import { Section } from '../components/Section';
import { Reveal } from '../components/Reveal';

export default function Outro({ onTop }: { onTop: () => void }) {
  return (
    <Section id="outro" className="flex flex-col justify-center items-center text-center">
      <Reveal>
        <div className="flex items-baseline gap-4 justify-center mb-16">
          <span className="font-mono2 text-xs md:text-sm text-cyan-200/80 tracking-[0.4em]">08</span>
          <span className="hairline w-16 md:w-28 inline-block" />
          <span className="font-mono2 text-xs md:text-sm text-white/40 tracking-[0.4em] uppercase">Pale Blue Dot</span>
        </div>
      </Reveal>

      {/* 暗淡蓝点 */}
      <Reveal>
        <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-white/5" />
          <div className="absolute inset-8 rounded-full border border-white/5" />
          <div className="absolute inset-16 rounded-full border border-white/8" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#7ba7d9] shadow-[0_0_24px_6px_rgba(120,160,220,0.55)] animate-float-slow" />
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <h2 className="font-serif-sc font-black text-4xl md:text-6xl mt-14 text-glow tracking-wide">回望</h2>
      </Reveal>

      <Reveal delay={0.25}>
        <p className="mt-10 max-w-2xl mx-auto text-white/60 leading-loose text-sm md:text-base font-light">
          1990 年 2 月 14 日，旅行者 1 号在 60 亿公里外转身拍下这张照片——地球不足一个像素。
          这就是我们的全部：所有爱恨、帝国与诗篇、你认识的每一个人，
          都生活在这粒悬浮于阳光中的尘埃之上。
        </p>
      </Reveal>

      <Reveal delay={0.35}>
        <blockquote className="mt-10 font-serif-sc text-lg md:text-2xl text-white/75 leading-relaxed max-w-xl mx-auto">
          「在浩瀚的宇宙剧场里，地球只是一个极小的舞台。」
          <footer className="mt-4 font-mono2 text-xs text-white/35 tracking-[0.3em] not-italic">— CARL SAGAN · 1994</footer>
        </blockquote>
      </Reveal>

      <Reveal delay={0.45}>
        <button
          onClick={onTop}
          className="mt-16 font-mono2 text-xs tracking-[0.35em] uppercase px-10 py-4 rounded-full border border-white/20 text-white/80 hover:border-cyan-200/60 hover:text-cyan-100 hover:shadow-[0_0_30px_rgba(140,180,255,0.25)] transition-all duration-500"
        >
          ↑ 重返深渊 · Dive Again
        </button>
      </Reveal>

      <Reveal delay={0.55}>
        <div className="mt-24 font-mono2 text-[10px] tracking-[0.3em] text-white/25 uppercase leading-loose">
          尺度 SCALE — A Vertical Odyssey<br />
          WebGL Shaders · GLSL · GSAP · Lenis · React
        </div>
      </Reveal>
    </Section>
  );
}
