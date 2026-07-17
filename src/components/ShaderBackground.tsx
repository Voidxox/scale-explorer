import { useEffect, useRef } from 'react';
import { scrollState } from '../lib/data';

const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform float uScene;   // 0..5 连续场景坐标
uniform vec2 uMouse;
uniform float uVel;     // 滚动速度（用于轻微扭曲）

#define PI 3.14159265359

float hash21(vec2 p){
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f*f*(3.0-2.0*f);
  float a = hash21(i);
  float b = hash21(i+vec2(1,0));
  float c = hash21(i+vec2(0,1));
  float d = hash21(i+vec2(1,1));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for(int i=0;i<5;i++){
    v += a * noise(p);
    p = rot * p * 2.03 + vec2(3.7, 1.3);
    a *= 0.5;
  }
  return v;
}

// 星场：三层哈希星 + 闪烁
float stars(vec2 uv, float t, float density){
  float s = 0.0;
  for(int i=0;i<3;i++){
    float fi = float(i);
    float scale = 60.0 + fi * 55.0;
    vec2 g = uv * scale + fi * 17.7;
    vec2 id = floor(g);
    vec2 f = fract(g) - 0.5;
    float h = hash21(id + fi * 31.7);
    if(h > density) continue;
    vec2 offs = vec2(hash21(id+1.3), hash21(id+2.7)) - 0.5;
    float d = length(f - offs*0.7);
    float tw = 0.6 + 0.4 * sin(t * (1.0 + h*3.0) + h * 40.0);
    float bright = smoothstep(0.08, 0.0, d) * tw;
    s += bright * (1.0 - fi*0.25);
  }
  return s;
}

// 场景 0：深渊
vec3 sceneAbyss(vec2 uv, float t){
  float depth = 1.0 - uv.y * 0.5 - 0.25;
  vec3 col = mix(vec3(0.004,0.012,0.030), vec3(0.010,0.045,0.085), clamp(1.0-depth,0.0,1.0));
  // 来自海面的神光
  float rays = 0.0;
  for(int i=0;i<4;i++){
    float fi = float(i);
    float cx = 0.5 + (fi-1.5)*0.22 + sin(t*0.13 + fi*2.1)*0.06;
    float w = 0.012 + 0.02*noise(vec2(fi*7.7, t*0.1));
    float r = smoothstep(w*6.0, 0.0, abs(uv.x-cx)) * smoothstep(0.1, 1.0, uv.y);
    rays += r * (0.5 + 0.5*noise(vec2(uv.x*8.0 + fi*9.0, t*0.25)));
  }
  col += vec3(0.10,0.22,0.30) * rays * 0.16;
  // 海雪微粒
  for(int i=0;i<2;i++){
    float fi = float(i);
    float scale = 14.0 + fi*10.0;
    vec2 g = uv*vec2(uRes.x/uRes.y,1.0)*scale;
    g.y += t * (0.25 + fi*0.2);
    vec2 id = floor(g);
    vec2 f = fract(g) - 0.5;
    float h = hash21(id + fi*13.1);
    vec2 offs = vec2(sin(t*0.4+h*6.28)*0.3, 0.0) + vec2(hash21(id+4.2), hash21(id+8.8))*0.6-0.3;
    float d = length(f-offs);
    float m = smoothstep(0.06, 0.0, d) * step(0.72, h);
    col += vec3(0.55,0.65,0.75) * m * (0.35-fi*0.12);
  }
  // 生物荧光 —— 偶发的幽蓝脉冲
  float bio = noise(uv*3.0 + vec2(0.0, t*0.05));
  bio = smoothstep(0.78, 0.95, bio) * (0.5+0.5*sin(t*0.8 + uv.x*20.0));
  col += vec3(0.05,0.35,0.45) * bio * 0.35;
  return col;
}

// 场景 1：大气层
vec3 sceneAtmos(vec2 uv, float t){
  vec3 top = vec3(0.008,0.020,0.055);
  vec3 mid = vec3(0.045,0.10,0.19);
  vec3 low = vec3(0.35,0.16,0.10);
  vec3 col = mix(low, mid, smoothstep(0.0,0.45,uv.y));
  col = mix(col, top, smoothstep(0.35,0.95,uv.y));
  // 云层
  vec2 cuv = uv*vec2(uRes.x/uRes.y,1.6);
  float cl = fbm(cuv*1.6 + vec2(t*0.02, t*0.004));
  cl = smoothstep(0.42, 0.85, cl) * smoothstep(0.9, 0.25, uv.y);
  col += vec3(0.55,0.45,0.42) * cl * 0.35;
  // 极光帘幕
  float ay = uv.y - 0.55 - fbm(vec2(uv.x*2.2 + t*0.05, t*0.06))*0.25;
  float aur = exp(-ay*ay*38.0) * (0.5+0.5*fbm(vec2(uv.x*5.0, t*0.15)));
  col += vec3(0.10,0.55,0.38) * aur * 0.5 + vec3(0.25,0.10,0.45)*aur*0.22;
  // 高空初星
  col += vec3(0.9,0.93,1.0) * stars(uv, t, 0.88) * smoothstep(0.55,0.9,uv.y) * 0.5;
  return col;
}

// 场景 2：太阳系（日光 + 黄道尘埃）
vec3 sceneSolar(vec2 uv, float t){
  vec3 col = vec3(0.004,0.005,0.012);
  vec2 sun = vec2(1.25, 0.62);
  float sd = length((uv - sun)*vec2(uRes.x/uRes.y,1.0));
  col += vec3(1.0,0.85,0.60) * (0.012 / (sd + 0.012));
  col += vec3(0.9,0.55,0.25) * exp(-sd*2.6) * 0.55;
  // 黄道尘埃带
  float band = exp(-pow((uv.y-0.42 - (uv.x-0.5)*0.18)*3.2, 2.0));
  float dust = fbm(uv*vec2(6.0,14.0) + t*0.01);
  col += vec3(0.35,0.28,0.20) * band * dust * 0.25;
  col += vec3(0.95,0.96,1.0) * stars(uv, t, 0.80) * 0.8;
  return col;
}

// 场景 3：星云（域扭曲 fbm）
vec3 sceneNebula(vec2 uv, float t){
  vec2 p = (uv - 0.5)*vec2(uRes.x/uRes.y,1.0)*2.2;
  vec2 q = vec2(fbm(p + vec2(0.0,0.0) + t*0.008), fbm(p + vec2(5.2,1.3)));
  vec2 r = vec2(fbm(p + 2.4*q + vec2(1.7,9.2) + t*0.012), fbm(p + 2.4*q + vec2(8.3,2.8)));
  float f = fbm(p + 2.6*r);
  vec3 col = mix(vec3(0.015,0.008,0.045), vec3(0.10,0.03,0.22), clamp(f*f*3.2, 0.0, 1.0));
  col = mix(col, vec3(0.45,0.12,0.38), clamp(length(q)*0.9, 0.0, 1.0)*0.75);
  col = mix(col, vec3(0.95,0.45,0.18), clamp(r.y*r.y*1.6, 0.0, 1.0)*0.6);
  col = mix(col, vec3(0.15,0.35,0.60), clamp(r.x*r.x*1.2, 0.0, 1.0)*0.45);
  col *= 0.55 + 0.9*f;
  col += vec3(1.0,0.98,0.95) * stars(uv + r*0.02, t, 0.72) * (0.6 + f);
  return col;
}

// 场景 4：银河旋臂
vec3 sceneGalaxy(vec2 uv, float t){
  vec2 p = (uv - 0.5)*vec2(uRes.x/uRes.y,1.0);
  p = mat2(cos(0.42),-sin(0.42),sin(0.42),cos(0.42)) * p;
  p.x *= 1.9; // 透视压扁
  float rr = length(p);
  float ang = atan(p.y, p.x);
  float spiral = sin(ang*2.0 + log(rr+0.02)*5.2 - t*0.05);
  float arms = smoothstep(0.2, 1.0, spiral) * exp(-rr*2.6);
  float core = exp(-rr*7.5) * 1.6;
  float haze = exp(-rr*1.8)*0.22;
  vec3 col = vec3(0.004,0.004,0.010);
  col += vec3(1.0,0.85,0.62) * core;
  col += vec3(0.45,0.50,0.75) * haze;
  col += vec3(0.55,0.60,0.90) * arms * (0.45 + 0.55*fbm(p*9.0 + t*0.01));
  col += vec3(0.85,0.45,0.30) * arms * fbm(p*13.0 - t*0.008) * 0.55;
  // 旋臂上的星尘颗粒
  float granule = stars(uv*1.4 + vec2(3.3), t, 0.55);
  col += vec3(0.9,0.92,1.0) * granule * exp(-rr*1.4) * 0.75;
  col += vec3(0.95,0.96,1.0) * stars(uv, t, 0.86) * 0.55;
  return col;
}

// 场景 5：宇宙网（voronoi 纤维）
vec2 vhash(vec2 p){
  return vec2(hash21(p), hash21(p+vec2(37.2,17.9)));
}
vec3 sceneCosmos(vec2 uv, float t){
  vec2 p = uv*vec2(uRes.x/uRes.y,1.0)*4.2;
  p += vec2(t*0.008, 0.0);
  vec2 ip = floor(p), fp = fract(p);
  float f1 = 8.0, f2 = 8.0;
  for(int j=-1;j<=1;j++)
  for(int i=-1;i<=1;i++){
    vec2 g = vec2(float(i),float(j));
    vec2 o = vhash(ip+g);
    o = 0.5 + 0.4*sin(t*0.12 + 6.28*o);
    float d = length(g + o - fp);
    if(d < f1){ f2 = f1; f1 = d; }
    else if(d < f2){ f2 = d; }
  }
  float fil = smoothstep(0.14, 0.0, f2 - f1);
  float node = smoothstep(0.16, 0.0, f1);
  vec3 col = vec3(0.006,0.004,0.016);
  col += vec3(0.30,0.16,0.55) * fil * (0.35 + 0.65*fbm(p*0.7));
  col += vec3(0.75,0.55,1.00) * node * 0.9;
  col += vec3(0.20,0.35,0.65) * fil * fbm(p*1.4 + 7.7) * 0.5;
  col += vec3(0.9,0.93,1.0) * stars(uv, t, 0.90) * 0.5;
  return col;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 par = (uMouse - 0.5) * 0.045;
  uv += par;
  uv.y += uVel * 0.02 * sin(uv.x * 8.0 + uTime);
  float t = uTime;

  float s = clamp(uScene, 0.0, 5.0);
  int i = int(floor(s));
  float f = smoothstep(0.55, 1.0, fract(s));

  vec3 c0, c1;
  if(i==0){ c0 = sceneAbyss(uv,t); c1 = sceneAtmos(uv,t); }
  else if(i==1){ c0 = sceneAtmos(uv,t); c1 = sceneSolar(uv,t); }
  else if(i==2){ c0 = sceneSolar(uv,t); c1 = sceneNebula(uv,t); }
  else if(i==3){ c0 = sceneNebula(uv,t); c1 = sceneGalaxy(uv,t); }
  else if(i==4){ c0 = sceneGalaxy(uv,t); c1 = sceneCosmos(uv,t); }
  else { c0 = sceneCosmos(uv,t); c1 = sceneCosmos(uv,t); }
  vec3 col = mix(c0, c1, f);

  // 暗角 + 胶片颗粒
  float vig = smoothstep(1.25, 0.35, length(uv - 0.5));
  col *= 0.55 + 0.45*vig;
  float grain = hash21(uv * uRes + fract(t)*7.13) - 0.5;
  col += grain * 0.028;

  gl_FragColor = vec4(col, 1.0);
}
`;

// progress → 场景坐标关键帧
const SCENE_KEYS: Array<[number, number]> = [
  [0.0, 0], [0.13, 0], [0.2, 1], [0.3, 1], [0.37, 2], [0.46, 2],
  [0.52, 3], [0.59, 3], [0.65, 4], [0.71, 4], [0.77, 5], [0.87, 5],
  [0.94, 3], [1.0, 3],
];
function sceneAt(p: number): number {
  for (let i = 0; i < SCENE_KEYS.length - 1; i++) {
    const [p0, v0] = SCENE_KEYS[i];
    const [p1, v1] = SCENE_KEYS[i + 1];
    if (p >= p0 && p <= p1) {
      const f = (p - p0) / (p1 - p0);
      return v0 + (v1 - v0) * f;
    }
  }
  return 3;
}

export default function ShaderBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    const hideCanvas = () => { canvas.style.display = 'none'; };
    if (!gl) {
      hideCanvas();
      return;
    }

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };
    const prog = gl.createProgram()!;
    const vertexShader = compile(gl.VERTEX_SHADER, VERT);
    const fragmentShader = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vertexShader || !fragmentShader) {
      console.warn('WebGL background is unavailable; using the CSS fallback.');
      hideCanvas();
      return;
    }
    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('WebGL background could not be linked; using the CSS fallback.');
      hideCanvas();
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uScene = gl.getUniformLocation(prog, 'uScene');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uVel = gl.getUniformLocation(prog, 'uVel');

    let w = 0, h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = Math.floor(innerWidth * dpr);
      h = Math.floor(innerHeight * dpr);
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      gl.viewport(0, 0, w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    const t0 = performance.now();
    let smoothVel = 0;
    const render = () => {
      const t = (performance.now() - t0) / 1000;
      smoothVel += (scrollState.velocity - smoothVel) * 0.06;
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uScene, sceneAt(scrollState.progress));
      gl.uniform2f(uMouse, scrollState.mouse.x, scrollState.mouse.y);
      gl.uniform1f(uVel, Math.max(-3, Math.min(3, smoothVel)));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden
    />
  );
}
