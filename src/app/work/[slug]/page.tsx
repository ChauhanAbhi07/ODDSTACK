import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { caseStudies } from "@/data/case-studies";
import { visibleContent } from "@/lib/publication";
import { CaseArtwork } from "@/components/artwork";
import { PageIntro, Tags, ButtonLink } from "@/components/ui";
import { metadata as meta } from "@/lib/seo";
import { contactLink } from "@/lib/recommendations";
export function generateStaticParams() {
  return visibleContent(caseStudies).map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = visibleContent(caseStudies).find((c) => c.slug === slug);
  return c
    ? meta(c.title, c.description, `/work/${slug}`, c.status === "draft")
    : {};
}
export default async function WorkDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = visibleContent(caseStudies).find((c) => c.slug === slug);
  if (!work) notFound();
  return (
    <>
      <PageIntro
        label={work.category}
        title={work.title}
        description={work.description}
      />
      <div className="container page-content">
        <div className="detail-art">
          <CaseArtwork type={work.art} />
        </div>
        <div className="detail-layout">
          <div className="detail-main">
            <p className="intro-note">
              Collective team experience · anonymized{" "}
              {work.status === "draft"
                ? "draft awaiting verification"
                : "experience"}
              . Not an ODDESTACK customer case study.
            </p>
            <h2>The challenge.</h2>
            <p>{work.challenge}</p>
            <h2>The connected approach.</h2>
            <p>{work.approach}</p>
            <div
              className="architecture-flow"
              aria-label="Connected technologies"
            >
              {work.stack.map((s, i) => (
                <span key={s}>
                  {s}
                  {i < work.stack.length - 1 && <ArrowRight />}
                </span>
              ))}
            </div>
            <h2>The experience.</h2>
            <p>{work.outcome}</p>
          </div>
          <aside className="detail-aside">
            <h3>Inside the stack.</h3>
            <Tags items={work.stack} />
            <p>
              Working on something similar? Start with your business problem.
            </p>
            <ButtonLink href={contactLink(work.capabilities)}>
              Let’s connect
            </ButtonLink>
          </aside>
        </div>
      </div>
    </>
  );
}
