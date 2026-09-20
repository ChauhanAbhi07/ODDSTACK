"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Plus,
  Minus,
  AudioLines,
  Code2,
  Smartphone,
  Layers,
  PenTool,
  TrendingUp,
  Film,
  ShoppingBag,
  ChartNoAxesCombined,
  Workflow,
} from "lucide-react";
import { services } from "@/data/services";
const icons = [
  AudioLines,
  Code2,
  Smartphone,
  Layers,
  PenTool,
  TrendingUp,
  Film,
  ShoppingBag,
  ChartNoAxesCombined,
  Workflow,
];
export function StackBuilder() {
  const [open, setOpen] = useState<string | null>("ai-automation");
  return (
    <div className="capability-list">
      {services.map((service, i) => {
        const Icon = icons[i];
        const active = service.slug === open;
        return (
          <div
            key={service.slug}
            className={`capability-row ${active ? "is-open" : ""}`}
          >
            <button
              onClick={() => setOpen(active ? null : service.slug)}
              aria-expanded={active}
              aria-controls={`capability-${service.slug}`}
            >
              <span className="capability-index">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Icon className="capability-icon" size={23} strokeWidth={1.5} />
              <span className="capability-name">{service.title}</span>
              <span className="capability-short">{service.short}</span>
              <span className="disclosure-icon">
                {active ? <Minus size={18} /> : <Plus size={18} />}
              </span>
            </button>
            <div
              id={`capability-${service.slug}`}
              hidden={!active}
              className="capability-detail"
            >
              <p>{service.description}</p>
              <div className="capability-services">
                {service.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <Link className="text-link" href={`/services/${service.slug}`}>
                Explore {service.title.toLowerCase()} <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
