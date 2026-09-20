import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ArrowUpRight } from "lucide-react";
import { industries } from "@/data/industries";
import { services } from "@/data/services";
import { PageIntro, ButtonLink } from "@/components/ui";
import { metadata as meta } from "@/lib/seo";
import { contactLink } from "@/lib/recommendations";
export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const i = industries.find((i) => i.slug === slug);
  return i ? meta(i.title, i.description, `/industries/${slug}`) : {};
}
const finderMap: Record<string, string> = {
  "real-estate": "Real Estate",
  automotive: "Automotive",
  ecommerce: "D2C / Ecommerce",
  healthcare: "Healthcare / Clinics",
  education: "Education",
  "field-service": "Field Service",
  fintech: "Fintech",
  "growing-smes": "Other",
};
export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) notFound();
  return (
    <>
      <PageIntro
        label={industry.title}
        title={industry.description}
        description={industry.challenge}
      />
      <div className="container page-content detail-layout">
        <div className="detail-main">
          <h2>The possibilities.</h2>
          <ul className="service-items">
            {industry.items.map((i) => (
              <li key={i}>
                <Check />
                {i}
              </li>
            ))}
          </ul>
          <h2>One connected industry stack.</h2>
          <p>
            We start by mapping your customer journey and the systems behind it.
            Then we choose a focused first workflow, connect the necessary tools
            and agree on the signals that will tell us what to improve.
          </p>
          <div className="related-list">
            {industry.capabilities.map((id) => {
              const s = services.find((s) => s.slug === id)!;
              return (
                <Link href={`/services/${id}`} key={id}>
                  {s.title}
                  <ArrowUpRight />
                </Link>
              );
            })}
          </div>
        </div>
        <aside className="detail-aside">
          <h3>Let’s build around your business.</h3>
          <p>
            Bring us the operational challenge, the product idea or the growth
            bottleneck. We’ll figure out the stack together.
          </p>
          <ButtonLink
            href={contactLink(industry.capabilities, finderMap[slug])}
          >
            Build this stack
          </ButtonLink>
        </aside>
      </div>
    </>
  );
}
