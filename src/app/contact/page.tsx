import { PageIntro } from "@/components/ui";
import { ProjectWizard } from "@/components/project-wizard";
import { site } from "@/config/site";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Build your stack",
  "Tell us what you're trying to build, grow, automate or fix. Start your ODDESTACK project brief.",
  "/contact",
);
export default async function Contact({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;
  const stack =
    typeof q.stack === "string" ? q.stack.split(",").slice(0, 10) : [];
  const industry = typeof q.industry === "string" ? q.industry : "";
  const engagement =
    typeof q.engagement === "string" &&
    ["Project", "Growth retainer", "Managed stack", "Transformation"].includes(
      q.engagement,
    )
      ? q.engagement
      : "";
  return (
    <>
      <PageIntro
        label="Build your stack"
        title="Big idea? Messy problem? We're listening."
        description="A website for your shop, an app for your customers, social media for your brand, or a bigger business challenge. Tell us what you need. We'll figure out the stack."
      />
      <section className="container page-content contact-section">
        <div>
          <h2>
            A good conversation.
            <br />
            <span className="muted">A better starting point.</span>
          </h2>
          <p style={{ marginTop: 25 }}>
            No perfect brief required. Just a little ambition.
          </p>
          {engagement && (
            <p style={{ marginTop: 20 }}>Let’s discuss: {engagement}.</p>
          )}
          <a
            className="text-link lime"
            style={{ marginTop: 20 }}
            href={`mailto:${site.email}`}
          >
            {site.email} ↗
          </a>
          <span className="contact-asterisk" aria-hidden="true">
            ✳
          </span>
        </div>
        <ProjectWizard
          key={JSON.stringify([stack, industry, engagement])}
          initialCapabilities={stack}
          initialIndustry={industry}
          initialEngagement={engagement}
        />
      </section>
    </>
  );
}
