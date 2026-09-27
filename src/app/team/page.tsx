import { PageIntro } from "@/components/ui";
import { TeamGrid, FinalCTA } from "@/components/content-sections";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "The collective",
  "Meet the people behind ODDESTACK and explore their skills and experience across mobile, web, enterprise systems, data, AI and creative work.",
  "/team",
);
export default function Team() {
  return (
    <>
      <PageIntro
        label="The collective"
        title="Different minds. Experience that connects."
        description="Meet our team and explore their skills, experience and work highlights."
      />
      <div className="container page-content">
        <p className="intro-note">
          Names are pseudonyms. Work highlights reflect individual experience.
        </p>
        <TeamGrid />
      </div>
      <FinalCTA />
    </>
  );
}
