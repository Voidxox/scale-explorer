import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export function Reveal({ children, className, y = 48, delay = 0, duration = 1.1, once = true }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const tween = gsap.fromTo(
      el,
      { y, opacity: 0, filter: 'blur(8px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [y, delay, duration, once]);
  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

interface CounterProps {
  value: string; // 显示文本（可能含非数字字符）
  className?: string;
}

/** 数字滚动器：提取字符串中的数字部分做补间 */
export function Counter({ value, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const m = value.match(/[\d,.]+/);
    if (!m) {
      el.textContent = value;
      return;
    }
    const numStr = m[0].replace(/,/g, '');
    const target = parseFloat(numStr);
    if (isNaN(target)) {
      el.textContent = value;
      return;
    }
    const hasComma = m[0].includes(',');
    const decimals = (numStr.split('.')[1] || '').length;
    const obj = { v: 0 };
    el.textContent = value.replace(m[0], '0');
    const tween = gsap.to(obj, {
      v: target,
      duration: 2.2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => {
        let s = obj.v.toFixed(decimals);
        if (hasComma) {
          const parts = s.split('.');
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          s = parts.join('.');
        }
        el.textContent = value.replace(m[0], s);
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value]);
  return <span ref={ref} className={className} />;
}
