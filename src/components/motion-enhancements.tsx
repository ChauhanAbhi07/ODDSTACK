"use client";
import { useEffect, useRef, useState } from "react";
export function MotionEnhancements() {
  useEffect(() => {
    if (
      !window.matchMedia(
        "(pointer: fine) and (prefers-reduced-motion: no-preference)",
      ).matches
    )
      return;
    let active: HTMLElement | null = null;
    let frame = 0;
    const reset = () => {
      if (active) active.style.translate = "";
      active = null;
      cancelAnimationFrame(frame);
    };
    const move = (event: PointerEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(".button")
          : null;
      if (!target) {
        reset();
        return;
      }
      if (active !== target) reset();
      active = target;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = target.getBoundingClientRect();
        target.style.translate = `${Math.max(-3, Math.min(3, (event.clientX - rect.left - rect.width / 2) / 14))}px ${Math.max(-2, Math.min(2, (event.clientY - rect.top - rect.height / 2) / 10))}px`;
      });
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", reset);
    return () => {
      reset();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", reset);
    };
  }, []);
  return null;
}
export function AnimatedCount({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !ref.current
    )
      return;
    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / 800);
          setDisplay(Math.round(value * (1 - (1 - progress) ** 3)));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);
  return (
    <span ref={ref} aria-label={`${value}${suffix}`}>
      <span aria-hidden="true">
        {display}
        {suffix}
      </span>
    </span>
  );
}
