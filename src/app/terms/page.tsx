import { PageIntro } from "@/components/ui";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Terms draft",
  "Draft terms placeholder for the ODDESTACK website.",
  "/terms",
  true,
);
export default function Terms() {
  return (
    <>
      <PageIntro
        label="Terms / Draft"
        title="A clear understanding."
        description="This is a placeholder for business-specific website terms. It must be replaced before public launch."
      />
      <div className="container page-content legal-content">
        <h2>Website information</h2>
        <p>
          Capabilities and recommended stacks describe potential combinations of
          services. Recommendations are a starting point for discussion and do
          not constitute a binding scope, price or delivery commitment.
        </p>
        <h2>Engagements</h2>
        <p>
          Project scope, responsibilities, fees, delivery dates, intellectual
          property arrangements and support terms must be agreed in a separate
          business contract.
        </p>
        <h2>Preview content</h2>
        <p>
          Preview case studies are anonymized drafts of supplied collective team
          experience. Team names are pseudonyms; additional placeholder roles
          are labeled. Sample articles and unverified claims are excluded from
          the public production view.
        </p>
        <h2>Required before launch</h2>
        <p>
          The legal entity, applicable jurisdiction, approved usage terms,
          liability provisions and dispute process remain to be supplied and
          reviewed for the business.
        </p>
      </div>
    </>
  );
}
