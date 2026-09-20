import { PageIntro } from "@/components/ui";
import { TeamGrid, FinalCTA } from "@/components/content-sections";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "The collective",
  "Meet the multidisciplinary capabilities and people behind the ODDESTACK collective.",
  "/team",
);
export default function Team() {
  return (
    <>
      <PageIntro
        label="The collective"
        title="Different minds. A shared kind of ambition."
        description="Engineers, designers, analysts and storytellers. The unusual combination of people businesses usually hire separately."
      />
      <div className="container page-content">
        <p className="intro-note">
          Names are pseudonyms used to protect individual privacy. Additional
          planned roles are explicitly marked as placeholder profiles in preview
          mode.
        </p>
        <TeamGrid />
      </div>
      <FinalCTA />
    </>
  );
}
