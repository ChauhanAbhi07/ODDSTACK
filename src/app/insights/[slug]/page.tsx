import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { articles } from "@/data/articles";
import { visibleContent } from "@/lib/publication";
import { PageIntro, JsonLd } from "@/components/ui";
import { metadata as meta } from "@/lib/seo";
import { site } from "@/config/site";
export function generateStaticParams() {
  return visibleContent(articles).map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = visibleContent(articles).find((a) => a.slug === slug);
  return a
    ? meta(a.title, a.description, `/insights/${slug}`, a.status === "draft")
    : {};
}
export default async function ArticleDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = visibleContent(articles).find((a) => a.slug === slug);
  if (!article) notFound();
  return (
    <>
      <PageIntro
        label={`${article.category} / ${article.readTime} read`}
        title={article.title}
        description={article.description}
      />
      <article className="container article-body">
        {article.status === "draft" && (
          <div className="intro-note">
            Sample editorial prepared for this website. Awaiting business review
            before publication.
          </div>
        )}
        {article.sections.map((s) => (
          <section key={s.title}>
            <h2>{s.title}</h2>
            <p>{s.text}</p>
          </section>
        ))}
        <Link className="text-link" href="/insights">
          <ArrowLeft size={17} />
          All perspectives
        </Link>
      </article>
      {article.status === "published" && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.description,
            mainEntityOfPage: `${site.url}/insights/${slug}`,
            publisher: { "@type": "Organization", name: site.name },
          }}
        />
      )}
    </>
  );
}
