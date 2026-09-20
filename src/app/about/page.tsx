import { PageIntro } from "@/components/ui";
import { Process, FinalCTA } from "@/components/content-sections";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "About ODDESTACK",
  "An integrated business growth, technology and intelligence company. Different specialists, working as one team.",
  "/about",
);
export default function About() {
  return (
    <>
      <PageIntro
        label="The idea behind the odd"
        title="An unusual combination. A better way forward."
        description="Businesses are connected systems. We think the people building them should be connected, too."
      />
      <section className="container page-content">
        <p className="about-statement">
          Why hire five different companies when you can build{" "}
          <span>one better stack?</span>
        </p>
        <div className="about-grid">
          <article>
            <h2>Different by design.</h2>
            <p>
              Engineers, creatives, growth thinkers and operations specialists.
              ODDESTACK brings them into one multidisciplinary team, with one
              shared understanding of your business.
            </p>
          </article>
          <article>
            <h2>Connected in practice.</h2>
            <p>
              A campaign should know what happens after the click. A product
              should connect to the operation. An AI agent should be able to do
              something useful. The connections are part of the work.
            </p>
          </article>
          <article>
            <h2>Built around you.</h2>
            <p>
              We start with what needs to change. Then we assemble the
              capabilities, define a useful first step and learn from the work.
              Build. Grow. Automate. Operate. Analyze.
            </p>
          </article>
        </div>
      </section>
      <Process />
      <FinalCTA />
    </>
  );
}
