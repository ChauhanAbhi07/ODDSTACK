"use client";
import { useSearchParams } from "next/navigation";
import { ProjectWizard } from "./project-wizard";
import { site } from "@/config/site";

export function ContactForm() {
  const query = useSearchParams();
  const stack = (query.get("stack") || "")
    .split(",")
    .filter(Boolean)
    .slice(0, 10);
  const industry = query.get("industry") || "";
  const requestedEngagement = query.get("engagement") || "";
  const engagement = [
    "Project",
    "Growth retainer",
    "Managed stack",
    "Transformation",
  ].includes(requestedEngagement)
    ? requestedEngagement
    : "";
  return (
    <section className="container page-content contact-section">
      <div>
        <h2>
          A good conversation.
          <br />
          <span className="muted">A better starting point.</span>
        </h2>
        <p style={{ marginTop: 25 }}>
          No perfect brief required. Just a little ambition.
        </p>
        {engagement && (
          <p style={{ marginTop: 20 }}>Let’s discuss: {engagement}.</p>
        )}
        <a
          className="text-link lime"
          style={{ marginTop: 20 }}
          href={`mailto:${site.email}`}
        >
          {site.email} ↗
        </a>
        <span className="contact-asterisk" aria-hidden="true">
          ✳
        </span>
      </div>
      <ProjectWizard
        key={JSON.stringify([stack, industry, engagement])}
        initialCapabilities={stack}
        initialIndustry={industry}
        initialEngagement={engagement}
      />
    </section>
  );
}
