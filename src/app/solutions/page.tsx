import { PageIntro, SectionTitle } from "@/components/ui";
import { SolutionsGrid } from "@/components/solutions-grid";
import { SolutionFinder } from "@/components/solution-finder";
import { FinalCTA } from "@/components/content-sections";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Solutions",
  "Start with your business outcome. Connect AI, technology, growth and operations into the right solution.",
  "/solutions",
);
export default function Solutions() {
  return (
    <>
      <PageIntro
        label="Solutions"
        title="One problem. Whatever stack it takes."
        description="More demand. Better experiences. Less manual work. Tell us where you want to go and we'll connect the capabilities to get you there."
      />
      <div className="container page-content">
        <SolutionsGrid />
      </div>
      <section className="section container section-border">
        <SectionTitle
          eyebrow="Find your starting point"
          title="What’s slowing you down?"
        />
        <SolutionFinder />
      </section>
      <FinalCTA />
    </>
  );
}
