import { PageIntro } from "@/components/ui";
import { TeamGrid, FinalCTA } from "@/components/content-sections";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "The collective",
  "Meet the people behind ODDESTACK and explore their experience across mobile apps, web platforms, enterprise systems, data and creative work.",
  "/team",
);
export default function Team() {
  return (
    <>
      <PageIntro
        label="The collective"
        title="Different minds. Experience that connects."
        description="Start with the work: mobile experiences, web platforms, enterprise integrations, business intelligence and social content. Meet the people who bring those skills to your project."
      />
      <div className="container page-content">
        <p className="intro-note">
          Names are pseudonyms used to protect individual privacy. Highlights
          describe individual experience, not an ODDESTACK client portfolio.
        </p>
        <TeamGrid />
      </div>
      <FinalCTA />
    </>
  );
}
