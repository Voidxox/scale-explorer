import type { ReactNode } from 'react';
import { Reveal, Counter } from './Reveal';

export function ChapterHeader({
  num, zh, en, tag, align = 'left',
}: { num: string; zh: string; en: string; tag: string; align?: 'left' | 'center' }) {
  return (
    <div className={`mb-14 md:mb-20 ${align === 'center' ? 'text-center' : ''}`}>
      <Reveal>
        <div className={`flex items-baseline gap-4 ${align === 'center' ? 'justify-center' : ''}`}>
          <span className="font-mono2 text-xs md:text-sm text-cyan-200/80 tracking-[0.4em]">{num}</span>
          <span className="hairline w-16 md:w-28 inline-block" />
          <span className="font-mono2 text-xs md:text-sm text-white/40 tracking-[0.4em] uppercase">{en}</span>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="font-serif-sc font-black text-5xl md:text-7xl lg:text-8xl mt-6 text-glow tracking-wide">
          {zh}
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mt-6 text-white/55 max-w-xl leading-loose text-sm md:text-base font-light mx-auto">
          {tag}
        </p>
      </Reveal>
    </div>
  );
}

export interface Fact {
  value: string;
  unit: string;
  label: string;
  sub: string;
}

export function StatGrid({ facts, cols = 4 }: { facts: Fact[]; cols?: 2 | 4 }) {
  return (
    <div className={`grid gap-3 md:gap-4 ${cols === 4 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2'}`}>
      {facts.map((f, i) => (
        <Reveal key={f.label} delay={i * 0.08}>
          <div className="glass rounded-xl p-5 md:p-6 h-full hover:border-cyan-200/30 transition-colors duration-500 group">
            <div className="font-grotesk text-2xl md:text-4xl font-medium text-white group-hover:text-cyan-100 transition-colors">
              <Counter value={f.value} />
              <span className="text-sm md:text-base text-cyan-200/70 ml-1.5">{f.unit}</span>
            </div>
            <div className="mt-3 text-sm text-white/80">{f.label}</div>
            <div className="mt-1 text-xs text-white/40 leading-relaxed">{f.sub}</div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function TimelineRow({
  items, titleKey = 'name',
}: {
  items: Array<Record<string, string>>;
  titleKey?: string;
}) {
  return (
    <div className="space-y-0">
      {items.map((it, i) => (
        <Reveal key={it[titleKey]} delay={i * 0.05}>
          <div className="group grid md:grid-cols-[180px_140px_1fr] gap-2 md:gap-8 items-baseline py-6 border-b border-white/8 hover:border-white/20 transition-colors">
            <div className="flex items-baseline gap-3">
              <span className="font-serif-sc text-xl md:text-2xl text-white group-hover:text-cyan-100 transition-colors">
                {it.name}
              </span>
              <span className="font-mono2 text-[10px] text-white/35 tracking-widest uppercase">{it.en}</span>
            </div>
            <div className="font-mono2 text-sm text-cyan-200/80 tabular-nums">{it.range ?? it.alt ?? ''}</div>
            <p className="text-sm text-white/50 leading-relaxed font-light">{it.desc}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function Section({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} data-chapter className={`relative min-h-screen py-28 md:py-40 px-6 md:px-16 lg:px-28 ${className}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}
