import Link from "next/link";
import {
  ArrowUpRight,
  Globe,
  MapPin,
  Megaphone,
  Smartphone,
} from "lucide-react";
import { ButtonLink, SectionTitle } from "./ui";

const offers = [
  {
    title: "A website that works for you.",
    icon: Globe,
    description:
      "Give customers a clear view of your business, what you offer, and how to book, buy or get in touch.",
    examples: "Business websites / Online stores / Booking pages",
    action: "Build my website",
    stack: "technology,design",
  },
  {
    title: "Your business, in their pocket.",
    icon: Smartphone,
    description:
      "Make ordering, booking and staying connected easier with a mobile app built around your customers.",
    examples: "Customer apps / Appointments / Ordering",
    action: "Plan my app",
    stack: "mobile,design",
  },
  {
    title: "Social media with a purpose.",
    icon: Megaphone,
    description:
      "Show up consistently with content that tells your story, showcases your work and gives people a reason to enquire.",
    examples: "Social media management / Reels / Brand content",
    action: "Grow my social presence",
    stack: "growth,content",
  },
  {
    title: "Help nearby customers find you.",
    icon: MapPin,
    description:
      "Connect local search, relevant ads and simple enquiry journeys so people can discover your business and take the next step.",
    examples: "Local SEO / Google & Meta ads / Enquiry pages",
    action: "Reach more customers",
    stack: "growth,technology",
  },
];

export function LocalBusiness() {
  return (
    <section className="section container local-business" id="local-business">
      <SectionTitle
        eyebrow="For the businesses around us"
        title={
          <>
            Your local business.
            <br />
            <span className="muted">Ready for its next chapter.</span>
          </>
        }
        description="You know your business. We help you bring it online, show up on social media and make it easier for customers to reach you. Start with what you need today."
      />
      <p className="local-business-audience">
        Shops & retailers <span aria-hidden="true">/</span> Cafés & restaurants{" "}
        <span aria-hidden="true">/</span> Salons & studios{" "}
        <span aria-hidden="true">/</span> Clinics{" "}
        <span aria-hidden="true">/</span> Local service businesses
      </p>
      <div className="local-business-grid">
        {offers.map(
          ({ title, icon: Icon, description, examples, action, stack }) => (
            <article className="local-business-card" key={title}>
              <Icon
                className="local-business-icon"
                size={25}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h3>{title}</h3>
              <p>{description}</p>
              <p className="local-business-examples">{examples}</p>
              <Link className="text-link" href={`/contact?stack=${stack}`}>
                {action} <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </article>
          ),
        )}
      </div>
      <div className="local-business-next">
        <div>
          <h3>Start with one thing. Build from there.</h3>
          <p>
            A first website, a fresh social presence or an app idea. Tell us
            what would help your business next.
          </p>
        </div>
        <ButtonLink href="/contact">Let’s talk about your business</ButtonLink>
      </div>
    </section>
  );
}
