import { PageIntro } from "@/components/ui";
import { ArticleGrid } from "@/components/article-grid";
import { articles } from "@/data/articles";
import { visibleContent } from "@/lib/publication";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Odd perspectives",
  "Ideas about AI automation, growth, technology, commerce, design, data and operations.",
  "/insights",
);
export default function Insights() {
  return (
    <>
      <PageIntro
        label="Odd perspectives"
        title="Good questions. Different angles."
        description="Notes on the connections between technology, creativity and the way businesses work."
      />
      <div className="container page-content">
        <ArticleGrid articles={visibleContent(articles)} filter />
      </div>
    </>
  );
}
