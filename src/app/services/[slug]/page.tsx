import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { services } from "@/data/services";
import { solutions } from "@/data/solutions";
import { industries } from "@/data/industries";
import { PageIntro, ButtonLink, JsonLd } from "@/components/ui";
import { metadata as meta } from "@/lib/seo";
import { site } from "@/config/site";
import { contactLink } from "@/lib/recommendations";
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = services.find((s) => s.slug === slug);
  return s ? meta(s.title, s.description, `/services/${slug}`) : {};
}
export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();
  return (
    <>
      <PageIntro
        label={service.title}
        title={service.short}
        description={service.description}
      />
      <div className="container page-content detail-layout">
        <div className="detail-main">
          <h2>What’s in this part of the stack?</h2>
          <ul className="service-items">
            {service.items.map((item) => (
              <li key={item}>
                <Check />
                {item}
              </li>
            ))}
          </ul>
          <h2>Built around the outcome.</h2>
          <p>
            {service.outcome} We start with the workflow, agree on a focused
            scope, and connect the right specialists to deliver it.
          </p>
          <h2>Where it connects.</h2>
          <div className="related-list">
            {industries
              .filter((i) => i.capabilities.includes(slug))
              .slice(0, 4)
              .map((i) => (
                <Link href={`/industries/${i.slug}`} key={i.slug}>
                  {i.title}
                  <ArrowUpRight />
                </Link>
              ))}
          </div>
        </div>
        <aside className="detail-aside">
          <h3>
            One capability.
            <br />A bigger possibility.
          </h3>
          <p>
            {solutions.find((s) => s.capabilities.includes(slug))?.description}{" "}
            Let’s work out what this capability can unlock for your business.
          </p>
          <ButtonLink href={contactLink([slug])}>Build your stack</ButtonLink>
          <div className="related-list">
            {services
              .filter((s) => s.slug !== slug)
              .slice(0, 3)
              .map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`}>
                  {s.title}
                  <ArrowUpRight />
                </Link>
              ))}
          </div>
        </aside>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.description,
          url: `${site.url}/services/${slug}`,
          provider: { "@type": "Organization", name: site.name, url: site.url },
        }}
      />
    </>
  );
}
