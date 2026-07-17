import { useMemo, useRef, useState, useEffect } from 'react';
import { Section } from '../components/Section';
import { Reveal } from '../components/Reveal';
import { LADDER } from '../lib/data';

const MIN = -35, MAX = 27;

function fmtPower(log: number): { mantissa: string; exp: number } {
  const e = Math.floor(log);
  const m = Math.pow(10, log - e);
  return { mantissa: m.toFixed(2), exp: e };
}

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
function sup(n: number): string {
  const s = String(Math.abs(n)).split('').map((c) => SUP[+c]).join('');
  return (n < 0 ? '⁻' : '') + s;
}

export default function Ladder() {
  const [log, setLog] = useState(0);
  const [touring, setTouring] = useState(false);
  const tourRef = useRef<number | null>(null);

  const nearest = useMemo(() => {
    let best = LADDER[0];
    let bd = Infinity;
    for (const m of LADDER) {
      const d = Math.abs(m.log - log);
      if (d < bd) { bd = d; best = m; }
    }
    return bd < 1.2 ? best : null;
  }, [log]);

  const p = fmtPower(log);
  const sizePct = Math.pow((log - MIN) / (MAX - MIN), 1.6);

  useEffect(() => () => { if (tourRef.current) cancelAnimationFrame(tourRef.current); }, []);

  const tour = () => {
    if (touring) { setTouring(false); if (tourRef.current) cancelAnimationFrame(tourRef.current); return; }
    setTouring(true);
    const start = performance.now();
    const dur = 14000;
    const from = MIN, to = MAX;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setLog(from + (to - from) * eased);
      if (t < 1) tourRef.current = requestAnimationFrame(step);
      else setTouring(false);
    };
    tourRef.current = requestAnimationFrame(step);
  };

  return (
    <Section id="ladder" className="flex flex-col justify-center">
      <div className="text-center mb-10 md:mb-14">
        <Reveal>
          <div className="flex items-baseline gap-4 justify-center">
            <span className="font-mono2 text-xs md:text-sm text-cyan-200/80 tracking-[0.4em]">07</span>
            <span className="hairline w-16 md:w-28 inline-block" />
            <span className="font-mono2 text-xs md:text-sm text-white/40 tracking-[0.4em] uppercase">The Ladder</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-serif-sc font-black text-5xl md:text-7xl mt-6 text-glow tracking-wide">对数阶梯</h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 text-white/55 max-w-2xl mx-auto leading-loose text-sm md:text-base font-light">
            线性坐标在这趟旅程面前早已失效。拖动滑块，沿着 10 的幂次从普朗克长度爬到可观测宇宙——每一格，都是前一个世界的十亿倍。
          </p>
        </Reveal>
      </div>

      <Reveal>
        <div className="glass rounded-2xl p-6 md:p-10">
          {/* 读数区 */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-14">
            <div className="relative flex-shrink-0 w-40 h-40 md:w-52 md:h-52 flex items-center justify-center">
              <div
                className="rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${12 + sizePct * 88}%`,
                  height: `${12 + sizePct * 88}%`,
                  background: `radial-gradient(circle at 35% 35%, rgba(160,200,255,0.9), rgba(90,110,255,0.25) 55%, transparent 75%)`,
                  boxShadow: '0 0 40px rgba(130,160,255,0.35)',
                }}
              />
              <div className="absolute inset-0 rounded-full border border-white/10 animate-spin-slower" style={{ borderTopColor: 'rgba(160,200,255,0.5)' }} />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="font-grotesk text-4xl md:text-6xl font-light text-white tabular-nums">
                {p.mantissa}<span className="text-white/40 text-2xl md:text-3xl mx-2">×10</span><sup className="text-cyan-200 text-2xl md:text-4xl">{p.exp}</sup>
                <span className="text-lg md:text-xl text-white/40 ml-3">米</span>
              </div>
              <div className="mt-4 h-16">
                {nearest ? (
                  <>
                    <div className="font-serif-sc text-xl md:text-2xl text-cyan-100">
                      {nearest.name}
                      <span className="font-mono2 text-xs text-white/35 ml-3 tracking-widest uppercase">{nearest.en}</span>
                    </div>
                    <p className="mt-2 text-sm text-white/55 font-light">{nearest.note}</p>
                  </>
                ) : (
                  <p className="text-sm text-white/35 font-light italic">继续拖动，寻找下一个路标……</p>
                )}
              </div>
            </div>
          </div>

          {/* 滑块 */}
          <div className="mt-10 relative">
            <input
              type="range"
              min={MIN}
              max={MAX}
              step={0.05}
              value={log}
              onChange={(e) => { setTouring(false); if (tourRef.current) cancelAnimationFrame(tourRef.current); setLog(parseFloat(e.target.value)); }}
              className="ladder-slider w-full"
              aria-label="对数尺度"
            />
            <div className="relative h-10 mt-2">
              {LADDER.map((m) => (
                <button
                  key={m.name}
                  onClick={() => setLog(m.log)}
                  className="group absolute -translate-x-1/2"
                  style={{ left: `${((m.log - MIN) / (MAX - MIN)) * 100}%` }}
                  aria-label={m.name}
                >
                  <span className={`block w-px mx-auto transition-all duration-300 ${Math.abs(m.log - log) < 1.2 ? 'h-5 bg-cyan-200' : 'h-3 bg-white/25 group-hover:bg-white/60'}`} />
                  <span className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono2 text-[9px] text-white/0 group-hover:text-white/70 transition-colors pointer-events-none">
                    10{sup(m.log)}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex justify-between font-mono2 text-[10px] text-white/35 mt-1">
              <span>10⁻³⁵ m · 普朗克长度</span>
              <span>10⁰ · 你</span>
              <span>10²⁷ m · 可观测宇宙</span>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={tour}
              className="font-mono2 text-xs tracking-[0.3em] uppercase px-8 py-3 rounded-full border border-cyan-200/30 text-cyan-100 hover:bg-cyan-200/10 hover:border-cyan-200/60 transition-all duration-300"
            >
              {touring ? '■ 停止巡航' : '▶ 自动巡航 · 14 秒纵贯 62 个数量级'}
            </button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
