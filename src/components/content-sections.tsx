import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { featuredTeam } from "@/data/team";
import { caseStudies } from "@/data/case-studies";
import { processSteps } from "@/data/process";
import { engagements } from "@/data/engagements";
import { stats } from "@/data/stats";
import { visibleContent } from "@/lib/publication";
import { site } from "@/config/site";
import { CaseArtwork } from "./artwork";
import { AnimatedCount } from "./motion-enhancements";
import { ButtonLink, EmptyState, Eyebrow, SectionTitle, Tags } from "./ui";

export function WorkGrid({ limit }: { limit?: number }) {
  const items = visibleContent(caseStudies).slice(0, limit);
  if (!items.length)
    return (
      <EmptyState>
        Selected experience is being prepared for publication. Tell us what
        you’re working on and we can discuss the relevant capabilities.
      </EmptyState>
    );
  return (
    <div className="work-grid">
      {items.map((work, i) => (
        <Link
          href={`/work/${work.slug}`}
          className={`work-card work-card-${i % 3}`}
          key={work.slug}
        >
          <CaseArtwork type={work.art} />
          <div className="work-caption">
            <div>
              <span className="mono-label">{work.category}</span>
              <h3>{work.title}</h3>
              <p>{work.description}</p>
            </div>
            <span className="round-arrow">
              <ArrowUpRight size={23} />
            </span>
          </div>
          <div className="work-bottom">
            <Tags items={work.stack.slice(0, 3)} />
            {work.status === "draft" && (
              <span className="draft-label">Experience draft</span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
export function TeamGrid() {
  return (
    <div className="team-grid team-experience-grid">
      {featuredTeam.map((person, i) => (
        <article className="team-card team-experience-card" key={person.name}>
          <div className="team-experience-lead">
            <span className="eyebrow">Experience</span>
            <h3>{person.experience}</h3>
          </div>
          <div className="team-person">
            <div className={`avatar avatar-${i % 4}`} aria-hidden="true">
              <div className="avatar-shape" />
              <span>
                {person.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <div className="team-card-heading">
                <h4>{person.name}</h4>
                <span>Pseudonym</span>
              </div>
              <p className="team-role">{person.role}</p>
            </div>
          </div>
          <p>{person.bio}</p>
          {!!person.highlights?.length && (
            <div className="team-evidence">
              <h4>Work highlights</h4>
              <ul>
                {person.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          )}
          {!!person.deliveredApps?.length && (
            <div className="team-evidence">
              <h4>Delivered apps</h4>
              <ul>
                {person.deliveredApps.map((app) => (
                  <li key={app.name}>
                    <strong>{app.name}</strong>
                    <span>{app.contribution}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!!person.companyWork?.length && (
            <div className="team-evidence">
              <h4>Company experience</h4>
              <ul>
                {person.companyWork.map((company) => (
                  <li key={`${company.name}-${company.relationship}`}>
                    <strong>
                      {company.name} · {company.relationship}
                    </strong>
                    <span>{company.contribution}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!!person.achievements?.length && (
            <div className="team-evidence">
              <h4>Achievements</h4>
              <ul>
                {person.achievements.map((achievement) => (
                  <li key={achievement}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}
          <Tags items={person.tags.slice(0, 4)} />
        </article>
      ))}
    </div>
  );
}
export function Experience() {
  const verified = stats.filter((s) => s.verified);
  return (
    <section className="experience-band">
      <div className="container">
        <Eyebrow>Collective team experience</Eyebrow>
        <div className="experience-heading">
          <h2>
            Built by people
            <br />
            who build <span>real things.</span>
          </h2>
          <p>
            From real-time AI conversations to enterprise systems and
            customer-facing products. Different backgrounds. A shared instinct
            to make things work.
          </p>
        </div>
        {verified.length ? (
          <div className="stats-grid">
            {verified.map((s) => (
              <div key={s.label}>
                <strong>
                  <AnimatedCount value={s.value} suffix={s.suffix} />
                </strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="experience-domains">
            {[
              "Enterprise integrations",
              "AI & voice systems",
              "Mobile & fintech",
              "Commerce & content",
              "Data & operations",
            ].map((s, i) => (
              <div key={s}>
                <span>0{i + 1}</span>
                <strong>{s}</strong>
                <ArrowUpRight size={18} />
              </div>
            ))}
          </div>
        )}
        <p className="experience-note">
          Experience areas describe the people behind the stack, not an
          ODDESTACK client portfolio.
        </p>
      </div>
    </section>
  );
}
export function Process() {
  return (
    <section className="section container" id="process">
      <SectionTitle
        number="07"
        eyebrow="How we work"
        title={
          <>
            From “what if”
            <br />
            to <span className="muted">what’s next.</span>
          </>
        }
        description="One shared process. The right people at the right moment."
      />
      <div className="process-grid">
        {processSteps.map((p, i) => (
          <article key={p.title}>
            <div className="process-number">
              <span>0{i + 1}</span>
              <Plus size={16} />
            </div>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
export function Engagements() {
  return (
    <section className="section container">
      <SectionTitle
        number="09"
        eyebrow="Ways to work together"
        title={
          <>
            Your ambition.
            <br />
            <span className="muted">Our kind of commitment.</span>
          </>
        }
        description="A defined project or a team for the long run. Let's find the right fit."
      />
      <div className="engagement-grid">
        {engagements.map((e, i) => (
          <article className={i === 2 ? "featured" : ""} key={e.title}>
            <span className="mono-label">{e.label}</span>
            <h3>{e.title}</h3>
            <p>{e.description}</p>
            {site.showPricing && e.price && <p>{e.price}</p>}
            <Link
              href={`/contact?engagement=${encodeURIComponent(e.title)}`}
              className="text-link"
            >
              Discuss your stack <ArrowUpRight size={17} />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
export function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="container">
        <Eyebrow>Better together. Better a little odd.</Eyebrow>
        <div className="cta-title">
          <h2>
            Let’s make your stack
            <br />a little <span>odd.</span>
          </h2>
          <span aria-hidden="true">✳</span>
        </div>
        <div className="cta-bottom">
          <p>
            Tell us what you’re trying to build, fix, automate or grow.
            <br />
            We’ll figure out the stack.
          </p>
          <div>
            <ButtonLink href="/contact">Build your stack</ButtonLink>
            <a className="cta-email" href={`mailto:${site.email}`}>
              {site.email} <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
