"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Asterisk,
  AudioLines,
  Layers,
  Workflow,
  ShoppingBag,
  ChartNoAxesCombined,
} from "lucide-react";
import type { Article } from "@/lib/content-types";
const icons = [
  Layers,
  AudioLines,
  Workflow,
  ChartNoAxesCombined,
  Asterisk,
  ShoppingBag,
];
export function ArticleGrid({
  articles,
  filter = false,
}: {
  articles: Article[];
  filter?: boolean;
}) {
  const [category, setCategory] = useState("All");
  return (
    <>
      {filter && (
        <div className="filter-tabs" role="group" aria-label="Article category">
          {[
            "All",
            "AI & Automation",
            "Growth",
            "Technology",
            "Ecommerce",
            "Design",
            "Data",
            "Operations",
          ].map((c) => (
            <button
              aria-pressed={category === c}
              key={c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <div className="article-grid">
        {articles
          .filter((a) => category === "All" || a.category === category)
          .map((a) => {
            const i = articles.indexOf(a);
            const Icon = icons[i % icons.length];
            return (
              <Link
                key={a.slug}
                className="article-card"
                href={`/insights/${a.slug}`}
              >
                <div className={`article-art article-art-${i % 3}`}>
                  <Icon size={85} strokeWidth={0.8} />
                  <span>ODD / PERSPECTIVES</span>
                  <ArrowUpRight className="article-arrow" size={22} />
                </div>
                <div className="article-meta">
                  <span>{a.category}</span>
                  <span>{a.readTime} read</span>
                </div>
                <h3>{a.title}</h3>
                {a.status === "draft" && (
                  <span className="draft-label">Sample editorial</span>
                )}
              </Link>
            );
          })}
      </div>
      {!articles.some((a) => category === "All" || a.category === category) && (
        <p className="empty-state">
          New perspectives in {category.toLowerCase()} are in the works.
        </p>
      )}
    </>
  );
}
