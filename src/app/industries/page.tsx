import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industries } from "@/data/industries";
import { PageIntro, Tags } from "@/components/ui";
import { FinalCTA } from "@/components/content-sections";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Industries",
  "Connected solutions for automotive, real estate, ecommerce, healthcare, education, field service, fintech and growing businesses.",
  "/industries",
);
export default function Industries() {
  return (
    <>
      <PageIntro
        label="Industries"
        title="Your world. A more connected way."
        description="Every industry has its own moving parts. We bring the right mix of people and capabilities to connect yours."
      />
      <div className="container page-content service-grid">
        {industries.map((industry, i) => (
          <article key={industry.slug} className="service-card">
            <div className="service-card-top">
              <span>0{i + 1} / INDUSTRY</span>
              <ArrowUpRight size={20} />
            </div>
            <h2>{industry.title}</h2>
            <p>{industry.description}</p>
            <Tags items={industry.items.slice(0, 5)} />
            <Link className="text-link" href={`/industries/${industry.slug}`}>
              Explore your industry <ArrowUpRight size={17} />
            </Link>
          </article>
        ))}
      </div>
      <FinalCTA />
    </>
  );
}
