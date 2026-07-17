// ─── 全局滚动状态（供着色器与 HUD 共享，避免高频 React 渲染） ───
export const scrollState = {
  progress: 0, // 0..1 全页进度
  velocity: 0,
  chapter: 0,
  mouse: { x: 0.5, y: 0.5 },
};

type Listener = () => void;
const listeners = new Set<Listener>();
export function subscribeScroll(fn: Listener) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}
export function notifyScroll() {
  listeners.forEach((f) => f());
}

// ─── 海拔关键帧：progress → 海拔（米）───
const LY = 9.4607e15;
const KEYFRAMES: Array<[number, number]> = [
  [0.0, -10909],
  [0.05, -6000],
  [0.1, -1000],
  [0.14, -10],
  [0.17, 0],
  [0.21, 8849],
  [0.25, 12000],
  [0.29, 100000],
  [0.34, 420000],
  [0.4, 3.844e8],
  [0.46, 1.496e11],
  [0.53, 2.5e13],
  [0.6, 4.0e16],
  [0.7, 9.46e20],
  [0.82, 8.8e26],
  [1.0, 8.8e26],
];

function signedLog(v: number) {
  return Math.sign(v) * Math.log10(1 + Math.abs(v));
}
function signedExp(v: number) {
  return Math.sign(v) * (Math.pow(10, Math.abs(v)) - 1);
}

export function elevationAt(p: number): number {
  const t = Math.min(1, Math.max(0, p));
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const [p0, v0] = KEYFRAMES[i];
    const [p1, v1] = KEYFRAMES[i + 1];
    if (t >= p0 && t <= p1) {
      const f = (t - p0) / (p1 - p0);
      const a = signedLog(v0);
      const b = signedLog(v1);
      return signedExp(a + (b - a) * f);
    }
  }
  return KEYFRAMES[KEYFRAMES.length - 1][1];
}

export function formatElevation(meters: number): { value: string; unit: string } {
  const sign = meters < -0.5 ? '−' : '';
  const v = Math.abs(meters);
  if (v < 0.5) return { value: '0', unit: '米 · 海平面' };
  if (v < 1000) return { value: sign + v.toFixed(0), unit: '米' };
  if (v < 1e7) return { value: sign + (v / 1000).toFixed(v < 1e5 ? 1 : 0), unit: '公里' };
  if (v < 1e11) return { value: sign + (v / 1e8).toFixed(2), unit: '亿米' };
  if (v < 1e12) return { value: sign + (v / 1.496e11).toFixed(2), unit: '天文单位' };
  if (v < 5e12) return { value: sign + (v / 1.496e11).toFixed(0), unit: '天文单位' };
  if (v < LY * 0.5) return { value: sign + (v / LY).toFixed(3), unit: '光年' };
  if (v < LY * 1e4) return { value: sign + (v / LY).toFixed(2), unit: '光年' };
  if (v < LY * 1e8) return { value: sign + (v / LY / 1e4).toFixed(1), unit: '万光年' };
  return { value: sign + (v / LY / 1e8).toFixed(0), unit: '亿光年' };
}

// ─── 章节定义 ───
export const CHAPTERS = [
  { id: 'hero', num: '00', zh: '原点', en: 'ORIGIN' },
  { id: 'abyss', num: '01', zh: '深渊', en: 'THE ABYSS' },
  { id: 'atmosphere', num: '02', zh: '大气', en: 'ATMOSPHERE' },
  { id: 'solar', num: '03', zh: '太阳系', en: 'SOLAR SYSTEM' },
  { id: 'deep', num: '04', zh: '深空', en: 'DEEP SPACE' },
  { id: 'galaxy', num: '05', zh: '银河', en: 'GALAXY' },
  { id: 'cosmos', num: '06', zh: '宇宙网', en: 'COSMIC WEB' },
  { id: 'ladder', num: '07', zh: '阶梯', en: 'THE LADDER' },
  { id: 'outro', num: '08', zh: '回望', en: 'PALE BLUE DOT' },
];

// ─── 深渊数据 ───
export const OCEAN_ZONES = [
  { name: '透光带', en: 'Epipelagic', range: '0 – 200 m', desc: '阳光所能抵达的疆域。地球 90% 的海洋生命聚居于此，光合作用在此定义了整颗行星的大气成分。' },
  { name: '中层带', en: 'Mesopelagic', range: '200 – 1000 m', desc: '暮色之海。地球上最大规模的生物迁徙每夜在此上演——数十亿生物上浮觅食，体量超过所有陆生动物迁徙的总和。' },
  { name: '深层带', en: 'Bathypelagic', range: '1000 – 4000 m', desc: '永恒的黑夜从这里开始。唯一的光源来自生物荧光——据估计，深渊中 76% 的动物能够自行发光。' },
  { name: '深渊带', en: 'Abyssopelagic', range: '4000 – 6000 m', desc: '名字意为「没有底的底」。水温逼近冰点，压强超过 400 个大气压，然而生命依然无处不在。' },
  { name: '超深渊带', en: 'Hadalpelagic', range: '> 6000 m', desc: '以希腊冥王哈迪斯命名。46 条海沟构成的隐秘世界，总面积超过澳大利亚大陆，却只有寥寥数人到访。' },
];

export const ABYSS_FACTS = [
  { value: '10,909', unit: 'm', label: '奋斗者号坐底深度', sub: '2020 · 马里亚纳海沟' },
  { value: '1,086', unit: 'bar', label: '挑战者深渊压强', sub: '≈ 每平方米承载 11,000 吨' },
  { value: '3', unit: '人', label: '曾抵达最深处的人数', sub: '少于登陆月球的 12 人' },
  { value: '~1–4', unit: '°C', label: '深渊水温', sub: '永恒的寒夜' },
];

// ─── 大气数据 ───
export const ATMOS_LAYERS = [
  { name: '对流层', en: 'Troposphere', alt: '0 – 12 km', desc: '所有天气在此发生。民航客机在 10 公里巡航——此刻你头顶的每一片云，都属于这层仅有 Everest 1.4 倍高的薄膜。' },
  { name: '平流层', en: 'Stratosphere', alt: '12 – 50 km', desc: '臭氧层在此拦下了 97% 以上的致命紫外线。2014 年，Alan Eustace 从 41,419 米一跃而下，自由落体突破音速。' },
  { name: '中间层', en: 'Mesosphere', alt: '50 – 85 km', desc: '流星在此燃烧殆尽。地球大气中最冷之处，温度低至 −90°C，夜光云在极区夏夜发出幽蓝的辉光。' },
  { name: '热层', en: 'Thermosphere', alt: '85 – 600 km', desc: '极光在此起舞——太阳风粒子撞击氧氮原子，释放出横跨千公里的绿与红。国际空间站在此层静默穿行。' },
  { name: '散逸层', en: 'Exosphere', alt: '600 – 10,000 km', desc: '大气稀薄的终章，原子几乎不再碰撞，沿弹道滑向太空。卫星在此游弋，气体分子在此永别地球。' },
];

export const ATMOS_FACTS = [
  { value: '8,849', unit: 'm', label: '珠穆朗玛峰', sub: '地表之巅' },
  { value: '100', unit: 'km', label: '卡门线', sub: '国际公认的太空边界' },
  { value: '420', unit: 'km', label: '国际空间站轨道', sub: '90 分钟环绕地球一周' },
  { value: '99.99997', unit: '%', label: '大气质量集中线以下', sub: '卡门线以上近乎真空' },
];

// ─── 太阳系数据 ───
export const PLANETS = [
  { name: '水星', en: 'Mercury', dist: '0.39 AU', time: '3.2 光分', size: 0.383, color: '#b8a89a', fact: '昼夜温差 610°C' },
  { name: '金星', en: 'Venus', dist: '0.72 AU', time: '6.0 光分', size: 0.949, color: '#e8c97a', fact: '失控温室效应，464°C' },
  { name: '地球', en: 'Earth', dist: '1.00 AU', time: '8.3 光分', size: 1.0, color: '#6db3f2', fact: '已知唯一的生命绿洲' },
  { name: '火星', en: 'Mars', dist: '1.52 AU', time: '12.7 光分', size: 0.532, color: '#e07a5f', fact: '奥林帕斯山高 21.9 km' },
  { name: '木星', en: 'Jupiter', dist: '5.20 AU', time: '43 光分', size: 11.21, color: '#d8b48f', fact: '大红斑可吞下整个地球' },
  { name: '土星', en: 'Saturn', dist: '9.58 AU', time: '80 光分', size: 9.45, color: '#e6d3a3', fact: '光环厚度仅约 10 米' },
  { name: '天王星', en: 'Uranus', dist: '19.2 AU', time: '2.7 光时', size: 4.01, color: '#9fd8dc', fact: '自转轴躺倒 98°' },
  { name: '海王星', en: 'Neptune', dist: '30.1 AU', time: '4.2 光时', size: 3.88, color: '#6f8fdd', fact: '风速 2,100 km/h' },
];

export const SOLAR_FACTS = [
  { value: '384,400', unit: 'km', label: '地月距离', sub: '光只需 1.3 秒' },
  { value: '1.496', unit: '亿 km', label: '日地距离 · 1 AU', sub: '光需 8 分 20 秒' },
  { value: '>160', unit: 'AU', label: '旅行者 1 号', sub: '人类最远的造物 · 1977 年发射' },
  { value: '~2', unit: '光年', label: '奥尔特云半径', sub: '太阳引力疆域的边界' },
];

// ─── 深空数据 ───
export const DEEP_FACTS = [
  { value: '4.246', unit: '光年', label: '比邻星 Proxima Centauri', sub: '最近的恒星邻居' },
  { value: '~400', unit: '光年', label: '北极星', sub: '你看到的它，来自明朝' },
  { value: '~7,000', unit: '光年', label: '创生之柱', sub: '鹰状星云 · 韦布与哈勃的著名目标' },
  { value: '~26,000', unit: '光年', label: '银心方向', sub: '人马座 A* 潜伏之处' },
];

// ─── 银河与宇宙网 ───
export const GALAXY_FACTS = [
  { value: '~10万', unit: '光年', label: '银河系直径', sub: '光穿越需十万年' },
  { value: '2,000–4,000', unit: '亿', label: '银河恒星数量', sub: '太阳只是毫不起眼的一颗' },
  { value: '430万', unit: 'M☉', label: '人马座 A*', sub: '银心超大质量黑洞' },
  { value: '254', unit: '万光年', label: '仙女座星系', sub: '正以 110 km/s 向我们奔来' },
];

export const COSMOS_FACTS = [
  { value: '~2万亿', unit: '个', label: '可观测宇宙星系数', sub: '每个都如银河般浩瀚' },
  { value: '5.2亿', unit: '光年', label: '拉尼亚凯亚超星系团', sub: '「无尽的天堂」· 我们的宇宙地址' },
  { value: '930亿', unit: '光年', label: '可观测宇宙直径', sub: '自大爆炸以来光与时空膨胀的极限' },
  { value: '~10⁸⁰', unit: '个', label: '可观测宇宙原子总数', sub: '你由星尘组成，绝非修辞' },
];

// ─── 对数阶梯数据（log10 米）───
export interface LadderMark {
  log: number;
  name: string;
  en: string;
  note: string;
}
export const LADDER: LadderMark[] = [
  { log: -35, name: '普朗克长度', en: 'Planck Length', note: '1.616×10⁻³⁵ m — 时空失去意义的尺度，现有物理学的边界' },
  { log: -18, name: '夸克与电子', en: 'Quarks & Electrons', note: '< 10⁻¹⁸ m — 至今未被分解，被视为真正的点粒子' },
  { log: -15, name: '质子', en: 'Proton', note: '1.7×10⁻¹⁵ m — 三个夸克在胶子的洪流中永恒震颤' },
  { log: -14, name: '铀原子核', en: 'Uranium Nucleus', note: '1.5×10⁻¹⁴ m — 92 个质子在强核力下勉强维系的巨兽' },
  { log: -10, name: '氢原子', en: 'Hydrogen Atom', note: '1.06×10⁻¹⁰ m — 99.9999999999996% 是空无一物' },
  { log: -9, name: 'DNA 双螺旋', en: 'DNA Helix', note: '2.5×10⁻⁹ m — 宽度仅为可见光波长的二百分之一' },
  { log: -7, name: '病毒', en: 'Virus', note: '~10⁻⁷ m — 游走在生命与非生命之间的幽灵' },
  { log: -5, name: '人体细胞', en: 'Human Cell', note: '~3×10⁻⁵ m — 你的体内有 37 万亿个这样的宇宙' },
  { log: -3, name: '一粒米', en: 'Grain of Rice', note: '5×10⁻³ m — 肉眼世界的分水岭' },
  { log: -1, name: '蜂鸟', en: 'Hummingbird', note: '~0.09 m — 心跳每分钟 1,200 次的飞行宝石' },
  { log: 0, name: '人类', en: 'Human Being', note: '1.7 m — 宇宙用以认识自己的方式' },
  { log: 1.5, name: '蓝鲸', en: 'Blue Whale', note: '30 m — 地球史上存在过的最大动物' },
  { log: 2.9, name: '哈利法塔', en: 'Burj Khalifa', note: '828 m — 人类向天空的签名' },
  { log: 3.9, name: '珠穆朗玛峰', en: 'Mt. Everest', note: '8,849 m — 仍在以每年约 4 毫米长高' },
  { log: 5.1, name: '北京—上海', en: 'Beijing–Shanghai', note: '~1,200 km — 高铁 4.5 小时的尺度' },
  { log: 7.1, name: '地球', en: 'Earth', note: '12,742 km — 卡尔·萨根的「暗淡蓝点」' },
  { log: 8.2, name: '木星', en: 'Jupiter', note: '139,820 km — 1,300 个地球才装得满' },
  { log: 9.1, name: '太阳', en: 'The Sun', note: '1.39×10⁹ m — 占据太阳系 99.86% 的质量' },
  { log: 11.2, name: '日地距离', en: '1 AU', note: '1.496×10¹¹ m — 光走 8 分 20 秒' },
  { log: 13.3, name: '日球层顶', en: 'Heliopause', note: '~120 AU — 太阳风止步之处，旅行者在此进入星际空间' },
  { log: 16.6, name: '比邻星', en: 'Proxima Centauri', note: '4.246 光年 — 最近的恒星，光也要走四年' },
  { log: 18.6, name: '北极星', en: 'Polaris', note: '~433 光年 — 今夜的光启程于明朝万历年间' },
  { log: 21, name: '银河系', en: 'Milky Way', note: '~10 万光年 — 数千亿颗恒星的旋涡之岛' },
  { log: 23, name: '本星系群', en: 'Local Group', note: '~1,000 万光年 — 80 余个星系的引力村落' },
  { log: 24.7, name: '拉尼亚凯亚', en: 'Laniakea', note: '5.2 亿光年 — 夏威夷语「无尽的天堂」' },
  { log: 26.9, name: '可观测宇宙', en: 'Observable Universe', note: '930 亿光年 — 认知的视界，而非存在的尽头' },
];
