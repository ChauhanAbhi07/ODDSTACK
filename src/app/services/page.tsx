import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import { PageIntro, Tags } from "@/components/ui";
import { FinalCTA } from "@/components/content-sections";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Capabilities",
  "AI automation, custom software, mobile, ERP, design, growth, content, commerce, data and operations. Explore the ODDESTACK capabilities.",
  "/services",
);
export default function Services() {
  return (
    <>
      <PageIntro
        label="What we do"
        title="Different skills. One unfair advantage."
        description="From websites, apps and social media for local businesses to connected systems for growing teams. Start with what you need, and bring in more capabilities as you grow."
      />
      <div className="container page-content service-grid">
        {services.map((s, i) => (
          <article className="service-card" key={s.slug}>
            <div className="service-card-top">
              <span>0{i + 1} / CAPABILITY</span>
              <ArrowUpRight size={20} />
            </div>
            <h2>{s.title}</h2>
            <p>{s.description}</p>
            <Tags items={s.items.slice(0, 5)} />
            <Link className="text-link" href={`/services/${s.slug}`}>
              Explore the capability <ArrowUpRight size={17} />
            </Link>
          </article>
        ))}
      </div>
      <FinalCTA />
    </>
  );
}
