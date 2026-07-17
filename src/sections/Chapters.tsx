import { Section, ChapterHeader, StatGrid, TimelineRow } from '../components/Section';
import { Reveal } from '../components/Reveal';
import { OCEAN_ZONES, ABYSS_FACTS, ATMOS_LAYERS, ATMOS_FACTS, PLANETS, SOLAR_FACTS, DEEP_FACTS, GALAXY_FACTS, COSMOS_FACTS } from '../lib/data';

export function Abyss() {
  return (
    <Section id="abyss">
      <ChapterHeader
        num="01" zh="深渊" en="The Abyss"
        tag="旅程始于比珠峰倒置更深的地方。阳光从未抵达这里，压强足以压碎钢铁——然而生命不仅存在，而且繁盛。深海占地球宜居空间的 95%，我们对它的测绘却还不如火星表面详尽。"
      />
      <StatGrid facts={ABYSS_FACTS} />
      <div className="mt-16 md:mt-24">
        <Reveal>
          <h3 className="font-mono2 text-xs tracking-[0.4em] text-white/40 uppercase mb-6">垂直生态带 · Ocean Zones</h3>
        </Reveal>
        <TimelineRow items={OCEAN_ZONES} />
      </div>
      <Reveal className="mt-14">
        <blockquote className="border-l-2 border-cyan-300/40 pl-6 text-white/60 font-serif-sc text-lg md:text-xl leading-loose">
          「深海是地球上最大的博物馆——它收藏的绝大多数展品，人类尚未睁开眼睛看过一眼。」
        </blockquote>
      </Reveal>
    </Section>
  );
}

export function Atmosphere() {
  return (
    <Section id="atmosphere">
      <ChapterHeader
        num="02" zh="大气" en="Atmosphere"
        tag="冲破海面的瞬间，我们穿过地球最脆弱的皮肤。如果把地球比作苹果，整个大气层比苹果皮还薄——而正是这层薄膜，挡下了太阳风、陨石与致命辐射，让下面的一切成为可能。"
      />
      <StatGrid facts={ATMOS_FACTS} />
      <div className="mt-16 md:mt-24">
        <Reveal>
          <h3 className="font-mono2 text-xs tracking-[0.4em] text-white/40 uppercase mb-6">五层铠甲 · Atmospheric Layers</h3>
        </Reveal>
        <TimelineRow items={ATMOS_LAYERS} />
      </div>
    </Section>
  );
}

export function Solar() {
  return (
    <Section id="solar">
      <ChapterHeader
        num="03" zh="太阳系" en="Solar System"
        tag="越过卡门线，距离开始以「光」计。月球在 1.3 光秒之外，太阳在 8 光分之外，而旅行者 1 号——人类最远的造物——飞了近半个世纪，信号传回家需要将近一天。"
      />
      <StatGrid facts={SOLAR_FACTS} />
      <div className="mt-16 md:mt-24">
        <Reveal>
          <h3 className="font-mono2 text-xs tracking-[0.4em] text-white/40 uppercase mb-8">八大行星 · The Planets</h3>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {PLANETS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <div className="glass rounded-xl p-5 h-full group hover:border-white/25 transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-block rounded-full shadow-[0_0_16px_rgba(255,255,255,0.25)] group-hover:scale-125 transition-transform duration-500"
                    style={{
                      width: `${Math.max(10, Math.min(30, 8 + Math.log2(p.size + 1) * 8))}px`,
                      height: `${Math.max(10, Math.min(30, 8 + Math.log2(p.size + 1) * 8))}px`,
                      background: `radial-gradient(circle at 35% 35%, ${p.color}, #0a0a18)`,
                    }}
                  />
                  <div>
                    <div className="font-serif-sc text-lg text-white">{p.name}</div>
                    <div className="font-mono2 text-[9px] text-white/35 tracking-widest uppercase">{p.en}</div>
                  </div>
                </div>
                <div className="mt-4 font-mono2 text-sm text-cyan-200/80">{p.dist}</div>
                <div className="font-mono2 text-[11px] text-white/40 mt-0.5">{p.time}</div>
                <div className="mt-3 text-xs text-white/50 leading-relaxed">{p.fact}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function DeepSpace() {
  return (
    <Section id="deep">
      <ChapterHeader
        num="04" zh="深空" en="Deep Space"
        tag="离开行星的港湾，进入恒星间的荒漠。这里的距离单位是光年——9.46 万亿公里。仰望星空时你看到的每一颗恒星，都是一封穿越了数年、数百年甚至上万年的旧信。"
      />
      <StatGrid facts={DEEP_FACTS} />
      <Reveal className="mt-16">
        <div className="glass rounded-2xl p-8 md:p-10">
          <div className="font-mono2 text-xs tracking-[0.4em] text-white/40 uppercase mb-6">光速的暴政 · The Tyranny of Light</div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { to: '月球', t: '1.3 秒', note: '阿波罗宇航员的通话延迟' },
              { to: '火星（最近）', t: '3 分钟', note: '探测器着陆只能全靠自己' },
              { to: '比邻星', t: '4.2 年', note: '即便以光速，也要读完整个大学' },
            ].map((x) => (
              <div key={x.to}>
                <div className="font-grotesk text-3xl text-white">{x.t}</div>
                <div className="mt-2 text-sm text-cyan-100/80">到 {x.to}</div>
                <div className="mt-1 text-xs text-white/40">{x.note}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-white/45 leading-loose font-light">
            光速不是速度的极限，而是因果的极限。宇宙用这道铁律，把每一颗恒星都锁进了自己的孤岛。
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

export function Galaxy() {
  return (
    <Section id="galaxy">
      <ChapterHeader
        num="05" zh="银河" en="Galaxy"
        tag="拉远到十万光年之外，我们的整个文明史——每一座城、每一场战争、每一个你爱过的人——都发生在这道旋臂上的一粒尘埃旁。银河系有数千亿颗恒星，而太阳正以 220 km/s 的速度绕着银心狂奔，一圈需要 2.3 亿年。"
      />
      <StatGrid facts={GALAXY_FACTS} />
      <Reveal className="mt-16">
        <blockquote className="border-l-2 border-fuchsia-300/40 pl-6 text-white/60 font-serif-sc text-lg md:text-xl leading-loose">
          「我们是恒星物质造就的，如今开始思考星辰从何而来。」—— 卡尔·萨根
        </blockquote>
      </Reveal>
    </Section>
  );
}

export function Cosmos() {
  return (
    <Section id="cosmos">
      <ChapterHeader
        num="06" zh="宇宙网" en="Cosmic Web"
        tag="在最大的尺度上，星系不再均匀——它们沿暗物质纤维聚集，结成绵延数亿光年的「长城」，之间是近乎空无一物的巨洞。这是 138 亿年前量子涨落被暴胀放大后，引力用百亿年雕刻出的终极结构。"
      />
      <StatGrid facts={COSMOS_FACTS} />
      <Reveal className="mt-16">
        <div className="glass rounded-2xl p-8 md:p-10 font-mono2 text-xs md:text-sm leading-loose text-white/55">
          <div className="text-white/40 tracking-[0.4em] text-[10px] uppercase mb-5">宇宙地址 · Cosmic Address</div>
          <span className="text-cyan-100">你</span> → 地球 → 太阳系（猎户臂）→ 银河系 → 本星系群 →
          室女座超星系团 → <span className="text-fuchsia-200">拉尼亚凯亚超星系团</span> →
          双鱼-鲸鱼座超星系团复合体 → <span className="text-cyan-100">可观测宇宙</span>
        </div>
      </Reveal>
    </Section>
  );
}
