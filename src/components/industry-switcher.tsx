"use client";
import { useState } from "react";
import { ArrowUpRight, Check, CornerDownRight } from "lucide-react";
import Link from "next/link";
import { industries } from "@/data/industries";
export function IndustrySwitcher() {
  const [active, setActive] = useState(0);
  const industry = industries[active];
  return (
    <div className="industry-switcher">
      <div
        className="industry-tabs"
        role="group"
        aria-label="Choose an industry"
      >
        {industries.map((item, i) => (
          <button
            key={item.slug}
            aria-pressed={active === i}
            onClick={() => setActive(i)}
          >
            {item.title}
            <ArrowUpRight size={17} />
          </button>
        ))}
      </div>
      <div className="industry-detail" aria-live="polite">
        <svg
          className="industry-watermark"
          aria-hidden="true"
          width="220"
          height="210"
          viewBox="0 0 220 210"
        >
          <text x="0" y="180" fill="currentColor">
            0{active + 1}
          </text>
        </svg>
        <CornerDownRight size={35} strokeWidth={1} />
        <h3>{industry.description}</h3>
        <p>{industry.challenge}</p>
        <div className="industry-services">
          {industry.items.map((t) => (
            <span key={t}>
              <Check size={13} />
              {t}
            </span>
          ))}
        </div>
        <Link className="text-link" href={`/industries/${industry.slug}`}>
          Explore the {industry.title.toLowerCase()} stack{" "}
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </div>
  );
}
