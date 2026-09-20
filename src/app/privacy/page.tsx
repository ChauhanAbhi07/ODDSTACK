import { PageIntro } from "@/components/ui";
import { site } from "@/config/site";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Privacy notice draft",
  "Privacy information for the ODDESTACK development website.",
  "/privacy",
  true,
);
export default function Privacy() {
  return (
    <>
      <PageIntro
        label="Privacy / Draft"
        title="Your information matters."
        description="This development notice is a placeholder. Business-specific privacy terms must be completed before public collection of personal information."
      />
      <div className="container page-content legal-content">
        <h2>Project enquiries</h2>
        <p>
          The project form asks for contact details and information about your
          business and project. In local development, submissions are saved on
          the machine running this site and are not emailed or sent to a CRM.
          When a production storage integration is configured, its handling must
          be described here.
        </p>
        <h2>What this build does</h2>
        <p>
          The website does not include advertising trackers or analytics
          cookies. Form answers stay in memory in the current page until you
          submit or leave. Server-side submission records contain the details
          you provide. The form applies request limits and validates inputs.
        </p>
        <h2>Before launch</h2>
        <p>
          The business must supply its legal identity, applicable privacy
          rights, processing purposes, service providers, retention periods,
          deletion process and contact details. This placeholder does not
          replace that policy.
        </p>
        <h2>Contact</h2>
        <p>
          The configured business contact is{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>. Inbox ownership
          must be confirmed before launch.
        </p>
      </div>
    </>
  );
}
