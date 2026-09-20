"use client";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Asterisk,
  AudioLines,
  Code2,
  Layers,
  Sparkles,
} from "lucide-react";
import { ButtonLink } from "./ui";

export function StackArt({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  return (
    <div
      ref={ref}
      className={`stack-art ${compact ? "compact" : ""}`}
      role="img"
      aria-label="AI, technology, creative and growth connected in one ODDESTACK"
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse" || !ref.current) return;
        const r = e.currentTarget.getBoundingClientRect();
        ref.current.style.setProperty(
          "--pointer-x",
          `${((e.clientX - r.left) / r.width - 0.5) * 12}px`,
        );
        ref.current.style.setProperty(
          "--pointer-y",
          `${((e.clientY - r.top) / r.height - 0.5) * 12}px`,
        );
      }}
      onPointerLeave={() => {
        ref.current?.style.setProperty("--pointer-x", "0px");
        ref.current?.style.setProperty("--pointer-y", "0px");
      }}
    >
      <div className="art-grid" />
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="art-coordinate coord-top">CONNECTED BY DESIGN</div>
      <div className="art-coordinate coord-bottom">
        10 CAPABILITIES. ONE COLLECTIVE.
      </div>
      <div className="stack-object">
        <div className="stack-slab slab-bottom">
          <span>04 / GROWTH & OPERATIONS</span>
          <ArrowUpRight />
        </div>
        <div className="stack-slab slab-middle">
          <span>03 / CREATIVE & DESIGN</span>
          <Asterisk />
        </div>
        <div className="stack-slab slab-second">
          <span>02 / TECHNOLOGY</span>
          <Code2 />
        </div>
        <div className="stack-slab slab-top">
          <div className="slab-label">
            01 / INTELLIGENCE
            <Sparkles size={20} />
          </div>
          <div className="slab-mark">
            <i />
            <i />
            <i />
          </div>
          <span className="slab-word">
            ODD<span>ESTACK</span>
            <sup>™</sup>
          </span>
          <div className="slab-baseline">
            <span>THE WHOLE IS GREATER.</span>
            <span>↗</span>
          </div>
        </div>
      </div>
      <span className="floating-tag tag-ai">
        <AudioLines size={17} /> AI, with purpose{" "}
        <span className="status-dot" />
      </span>
      <span className="floating-tag tag-design">
        <Asterisk size={18} /> A little different.
      </span>
      <span className="floating-tag tag-stack">
        <Layers size={16} /> Built to work together
      </span>
    </div>
  );
}
export function Hero() {
  return (
    <section className="hero container">
      <div className="hero-copy">
        <div className="hero-eyebrow">
          <span className="status-dot" /> AN ODDLY POWERFUL COLLECTIVE
        </div>
        <h1>
          Your business.
          <br />
          One better
          <br />
          <span className="hero-stack-word">
            stack<span className="hero-star">✳</span>
          </span>
          <span className="lime">.</span>
        </h1>
        <p>
          Websites. Apps. Social media. Growth.
          <br />
          For local businesses and bigger ambitions.
          <br />
          <span>One team to help customers find you and get in touch.</span>
        </p>
        <div className="hero-actions">
          <ButtonLink href="/contact">Build your stack</ButtonLink>
          <a className="text-link" href="#local-business">
            For local businesses <ArrowDown size={16} />
          </a>
        </div>
        <div className="hero-note">
          <span className="small-cross">+</span> A little unconventional. A lot
          more connected.
        </div>
      </div>
      <StackArt />
      <div className="hero-bottom">
        <span>TECHNOLOGY × GROWTH × INTELLIGENCE</span>
        <a href="#the-problem">
          SCROLL TO CONNECT <ArrowDown size={13} />
        </a>
      </div>
    </section>
  );
}
export function ProblemVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end center"],
  });
  const gap = useTransform(scrollYProgress, [0, 1], [28, 5]);
  return (
    <div ref={ref} className="problem-visual">
      <div className="problem-old">
        <span className="mono-label">THE USUAL WAY</span>
        <motion.div
          className="fragment-list"
          style={{ gap: reduced ? 8 : gap }}
        >
          {[
            "Creative agency",
            "Software company",
            "Marketing agency",
            "ERP vendor",
            "AI consultant",
            "Analytics team",
          ].map((t, i) => (
            <div key={t} style={{ rotate: `${i % 2 ? 3 : -3}deg` }}>
              <span>{t}</span>
              <span>↗</span>
            </div>
          ))}
        </motion.div>
        <p>Different briefs. Different directions.</p>
      </div>
      <span className="problem-arrow">→</span>
      <div className="problem-new">
        <span className="mono-label">THE ODDESTACK WAY</span>
        <div className="unified-stack">
          <Layers size={40} strokeWidth={1.2} />
          <strong>
            One strategy.
            <br />
            One team.
            <br />
            <span>One stack.</span>
          </strong>
        </div>
        <p>Shared context. Connected momentum.</p>
      </div>
    </div>
  );
}
