import { PageIntro } from "@/components/ui";
import { WorkGrid, FinalCTA } from "@/components/content-sections";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Experience behind the stack",
  "Explore anonymized collective team experience across AI voice, enterprise systems, mobile, commerce, content and business intelligence.",
  "/work",
);
export default function Work() {
  return (
    <>
      <PageIntro
        label="Experience behind the stack"
        title="Built by people who've shipped real things."
        description="A closer look at the problems, technologies and disciplines behind our collective team experience."
      />
      <div className="container page-content">
        <p className="intro-note">
          These anonymized examples describe individual team experience. They
          are not claims of ODDESTACK client delivery. Drafts remain unpublished
          until their details are verified.
        </p>
        <WorkGrid />
      </div>
      <FinalCTA />
    </>
  );
}
