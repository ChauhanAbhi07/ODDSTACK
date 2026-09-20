import { Hero, ProblemVisual } from "@/components/hero";
import { LocalBusiness } from "@/components/local-business";
import { StackBuilder } from "@/components/stack-builder";
import { SolutionFinder } from "@/components/solution-finder";
import { SolutionsGrid } from "@/components/solutions-grid";
import { IndustrySwitcher } from "@/components/industry-switcher";
import {
  Experience,
  WorkGrid,
  TeamGrid,
  Process,
  Engagements,
  FinalCTA,
} from "@/components/content-sections";
import { Comparison } from "@/components/comparison";
import { ArticleGrid } from "@/components/article-grid";
import { ProjectWizard } from "@/components/project-wizard";
import { ButtonLink, SectionTitle } from "@/components/ui";
import { articles } from "@/data/articles";
import { visibleContent } from "@/lib/publication";
import { metadata as makeMetadata } from "@/lib/seo";
export const metadata = makeMetadata(
  "One better stack",
  "Websites, apps, social media and digital growth for local businesses and growing teams. Bring design, technology and AI together with ODDESTACK.",
);
export default function Home() {
  return (
    <>
      <Hero />
      <div
        className="capability-strip"
        aria-label="Build. Grow. Automate. Operate. Analyze."
      >
        <div>
          {["BUILD", "GROW", "AUTOMATE", "OPERATE", "ANALYZE"].map((t) => (
            <span key={t}>
              {t}
              <span className="strip-star" aria-hidden="true">
                ✳
              </span>
            </span>
          ))}
        </div>
      </div>
      <LocalBusiness />
      <section className="section container" id="the-problem">
        <div className="problem-heading">
          <SectionTitle
            number="01"
            eyebrow="A better kind of together"
            title={
              <>
                Too many vendors.
                <br />
                <span className="muted">Not enough momentum.</span>
              </>
            }
          />
          <p>
            One team for your website. Another for growth. Someone else for AI.
            Sound familiar?
            <br />
            <br />
            Your business doesn’t fit in one service category.
            <br />
            <strong>Neither do we.</strong>
          </p>
        </div>
        <ProblemVisual />
      </section>
      <section className="section section-border container" id="capabilities">
        <SectionTitle
          number="02"
          eyebrow="Meet your unfair advantage"
          title={
            <>
              Different skills.
              <br />
              <span className="muted">One connected stack.</span>
            </>
          }
          description="Pick a capability. See what happens when it connects to everything else."
        >
          <span className="section-side-note">
            10 CAPABILITIES
            <br />
            ENDLESS POSSIBILITIES ↗
          </span>
        </SectionTitle>
        <StackBuilder />
      </section>
      <section className="section container" id="stack-finder">
        <SectionTitle
          number="03"
          eyebrow="Find your starting point"
          title={
            <>
              What’s slowing
              <br />
              <span className="muted">you down?</span>
            </>
          }
          description="You don't need to know which services you need. Start with what you want to change."
        />
        <SolutionFinder />
      </section>
      <section className="section section-border container">
        <SectionTitle
          number="04"
          eyebrow="Outcomes over service menus"
          title={
            <>
              One problem.
              <br />
              <span className="muted">Whatever stack it takes.</span>
            </>
          }
          description="We bring the right capabilities together around the thing you're trying to achieve."
        />
        <SolutionsGrid />
      </section>
      <section className="section container">
        <SectionTitle
          number="05"
          eyebrow="Built around your world"
          title={
            <>
              Different industries.
              <br />
              <span className="muted">Same connected thinking.</span>
            </>
          }
        />
        <IndustrySwitcher />
      </section>
      <Experience />
      <section className="section container" id="work">
        <SectionTitle
          number="06"
          eyebrow="Experience behind the stack"
          title={
            <>
              Real problems.
              <br />
              <span className="muted">Thoughtfully connected.</span>
            </>
          }
          description="Anonymized experience from the people behind ODDESTACK."
        >
          <ButtonLink href="/work" secondary>
            Explore the experience
          </ButtonLink>
        </SectionTitle>
        <WorkGrid limit={4} />
      </section>
      <section className="section section-border container">
        <SectionTitle
          eyebrow="Different minds. Shared ambition."
          title={
            <>
              Meet the humans
              <br />
              <span className="muted">behind the stack.</span>
            </>
          }
          description="Builders, thinkers and makers. Public profiles use pseudonyms."
        >
          <ButtonLink href="/team" secondary>
            Meet the collective
          </ButtonLink>
        </SectionTitle>
        <TeamGrid limit={4} />
      </section>
      <Process />
      <section className="section section-border container comparison-section">
        <SectionTitle
          number="08"
          eyebrow="The connected advantage"
          title={
            <>
              Less coordinating.
              <br />
              <span className="muted">More creating.</span>
            </>
          }
          description="One shared context changes how the whole thing works."
        />
        <Comparison />
      </section>
      <Engagements />
      <section className="section section-border container">
        <SectionTitle
          number="10"
          eyebrow="Odd perspectives"
          title={
            <>
              A little food
              <br />
              <span className="muted">for thought.</span>
            </>
          }
        >
          <ButtonLink href="/insights" secondary>
            All perspectives
          </ButtonLink>
        </SectionTitle>
        <ArticleGrid articles={visibleContent(articles).slice(0, 3)} />
      </section>
      <FinalCTA />
      <section className="section container contact-section" id="project-brief">
        <div>
          <SectionTitle
            eyebrow="Start a conversation"
            title={
              <>
                Big idea?
                <br />
                Messy problem?
                <br />
                <span className="muted">We’re listening.</span>
              </>
            }
          />
          <p>
            No perfect brief required.
            <br />
            Just a little ambition.
          </p>
          <span className="contact-asterisk" aria-hidden="true">
            ✳
          </span>
        </div>
        <ProjectWizard />
      </section>
    </>
  );
}
