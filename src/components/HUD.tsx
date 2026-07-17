import { useEffect, useRef, useState } from 'react';
import { scrollState, subscribeScroll, elevationAt, formatElevation, CHAPTERS } from '../lib/data';

/** 左侧：实时海拔仪 ｜ 右侧：章节罗盘 */
export default function HUD({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [, force] = useState(0);
  const shown = useRef(false);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      if (t - last > 66) {
        last = t;
        force((x) => x + 1);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const t = setTimeout(() => { shown.current = true; }, 600);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, []);

  useEffect(() => subscribeScroll(() => {}), []);

  const p = scrollState.progress;
  const elev = elevationAt(p);
  const fmt = formatElevation(elev);
  const ch = CHAPTERS[Math.min(CHAPTERS.length - 1, scrollState.chapter)];
  const depthPct = Math.min(1, Math.max(0, p));

  return (
    <>
      {/* 顶部进度发丝线 */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-40 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 transition-[width] duration-150 ease-out"
          style={{ width: `${depthPct * 100}%` }}
        />
      </div>

      {/* 左侧海拔仪 */}
      <div
        className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-center gap-3 transition-opacity duration-1000"
        style={{ opacity: shown.current ? 1 : 0 }}
      >
        <div className="font-mono2 text-[10px] tracking-[0.3em] text-white/40 vertical-rl">
          ELEVATION
        </div>
        <div className="relative h-40 w-px bg-white/15">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-[7px] h-[7px] rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(140,200,255,0.9)]"
            style={{ top: `calc(${(1 - depthPct) * 100}% - 3px)` }}
          />
          {[0, 25, 50, 75, 100].map((tick) => (
            <div
              key={tick}
              className="absolute left-1/2 -translate-x-1/2 w-2 h-px bg-white/25"
              style={{ top: `${tick}%` }}
            />
          ))}
        </div>
        <div className="glass rounded-lg px-3 py-2 text-center min-w-[96px]">
          <div className="font-mono2 text-sm text-cyan-100 tabular-nums leading-tight">
            {fmt.value}
          </div>
          <div className="font-mono2 text-[10px] text-white/50 tracking-wider">{fmt.unit}</div>
        </div>
        <div className="font-mono2 text-[10px] text-white/35 vertical-rl tracking-[0.25em]">
          {elev < -0.5 ? '下潜中 DESCENDING' : elev < 0.5 ? '海平面 SEA LEVEL' : '上升中 ASCENDING'}
        </div>
      </div>

      {/* 右侧章节罗盘 */}
      <div
        className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-end gap-4 transition-opacity duration-1000"
        style={{ opacity: shown.current ? 1 : 0 }}
      >
        {CHAPTERS.map((c, i) => {
          const active = i === scrollState.chapter;
          return (
            <button
              key={c.id}
              onClick={() => onNavigate(c.id)}
              className="group flex items-center gap-2.5"
              aria-label={c.zh}
            >
              <span
                className={`font-mono2 text-[10px] tracking-[0.2em] transition-all duration-300 ${
                  active ? 'text-white opacity-100' : 'text-white/40 opacity-0 group-hover:opacity-100'
                }`}
              >
                {c.num} {c.zh}
              </span>
              <span
                className={`block rounded-full transition-all duration-300 ${
                  active
                    ? 'w-2 h-2 bg-cyan-200 shadow-[0_0_10px_rgba(140,200,255,0.9)]'
                    : 'w-1.5 h-1.5 bg-white/30 group-hover:bg-white/60'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* 顶部章节名 */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <div className="font-mono2 text-[10px] md:text-xs tracking-[0.5em] text-white/45 uppercase">
          {ch.num} · {ch.en}
        </div>
      </div>
    </>
  );
}
