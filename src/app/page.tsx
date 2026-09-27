import Link from "next/link";
import {
  ArrowUpRight,
  Globe,
  Smartphone,
  Megaphone,
  Palette,
  Sparkles,
  Workflow,
} from "lucide-react";
import { ButtonLink, Eyebrow, SectionTitle } from "@/components/ui";
import { Reviews } from "@/components/reviews";
import { site } from "@/config/site";
import { metadata as makeMetadata } from "@/lib/seo";
import styles from "./home.module.css";

export const metadata = makeMetadata(
  "Websites, apps & digital growth",
  "Websites, apps, design, social media and AI automation for local businesses and growing teams. Explore our services and talk to ODDESTACK about your project.",
);

const services = [
  {
    slug: "technology",
    title: "Websites & online stores",
    description:
      "Make it easy for customers to find you, browse your business and get in touch.",
    detail: "Business websites · Ecommerce · Booking pages",
    icon: Globe,
  },
  {
    slug: "mobile",
    title: "Mobile apps",
    description:
      "Put your business in your customers’ hands with an app built around their needs.",
    detail: "Android · iOS · Customer & team apps",
    icon: Smartphone,
  },
  {
    slug: "growth",
    title: "Social media & marketing",
    description:
      "Reach the right people and turn interest into enquiries with a clear digital presence.",
    detail: "Social media · SEO · Google & Meta ads",
    icon: Megaphone,
  },
  {
    slug: "design",
    title: "Branding & design",
    description:
      "Give your brand a clear identity and your customers an experience that feels easy.",
    detail: "Brand identity · Website & app design",
    icon: Palette,
  },
  {
    slug: "ai-automation",
    title: "AI & automation",
    description:
      "Handle routine questions and follow-ups so your team can focus on the work that matters.",
    detail: "Chatbots · Voice agents · WhatsApp",
    icon: Sparkles,
  },
  {
    slug: "erp-business-systems",
    title: "Business software",
    description:
      "Bring your customers, tasks and daily operations together in tools that work for you.",
    detail: "CRM · ERP · Connected workflows",
    icon: Workflow,
  },
];

const steps = [
  {
    title: "Tell us what you need",
    text: "Share your idea or the problem you want to solve. You don’t need a technical brief.",
  },
  {
    title: "Agree on a plan",
    text: "We work out the right services, scope, timeline and cost with you before starting.",
  },
  {
    title: "Build, launch & improve",
    text: "We bring the work together, keep you involved and plan the next steps for your business.",
  },
];

const questions = [
  {
    question: "Can I start with just one service?",
    answer:
      "Yes. Start with a website, an app, design or marketing. You can bring in other services as your needs grow.",
  },
  {
    question: "Do you work with small and local businesses?",
    answer:
      "Yes. We work on websites, booking and enquiry pages, social media and customer apps for local businesses, as well as larger platforms for growing teams.",
  },
  {
    question: "How much will my project cost?",
    answer:
      "The cost depends on what you need and the scope of the work. Tell us about your project so we can discuss an approach, timeline and quote.",
  },
  {
    question: "What if I’m not sure what I need?",
    answer:
      "Start with what you want to improve. We can help you choose the right services, or you can use our solution finder to explore a starting point.",
  },
];

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={`container ${styles.hero}`}>
        <div>
          <Eyebrow>One team. From idea to launch.</Eyebrow>
          <h1>
            Your business.
            <br />
            <span>Made easier online.</span>
          </h1>
          <p className={styles.intro}>
            Websites, apps, design and digital growth for local businesses and
            growing teams. Tell us what you need. We’ll help you get there.
          </p>
          <div className={styles.actions}>
            <ButtonLink href="/contact">Let’s talk</ButtonLink>
            <a className="button button-secondary" href="#services">
              Explore services <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
          <p className={styles.note}>Start small. Add more as you grow.</p>
        </div>
        <aside
          className={styles.startPanel}
          aria-label="Popular starting points"
        >
          <span className={styles.panelMark} aria-hidden="true">
            ✳
          </span>
          <h2>
            What’s next
            <br />
            for your business?
          </h2>
          <p>A simple place to start.</p>
          <Link href="/services/technology">
            I need a website <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <Link href="/services/growth">
            I want more customers <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <Link href="/services/ai-automation">
            I want to save time <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </aside>
      </section>

      <section className={`container ${styles.section}`} id="services">
        <SectionTitle
          eyebrow="Our services"
          title="What can we help you with?"
          description="Choose what you need today. We’ll connect the right people to make it happen."
        />
        <div className={styles.serviceGrid}>
          {services.map(({ slug, title, description, detail, icon: Icon }) => (
            <Link
              href={`/services/${slug}`}
              className={styles.serviceCard}
              key={slug}
            >
              <Icon
                size={25}
                className={styles.serviceIcon}
                aria-hidden="true"
              />
              <h3>{title}</h3>
              <p>{description}</p>
              <span className={styles.serviceDetail}>{detail}</span>
              <span className={styles.cardLink}>
                Explore service <ArrowUpRight size={17} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
        <div className={styles.sectionFoot}>
          <p>Need content, ecommerce, data or something more specific?</p>
          <Link href="/services" className="text-link">
            View all services <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <Reviews />

      <section
        className={`container ${styles.section} ${styles.experience}`}
        id="experience"
      >
        <div>
          <Eyebrow>The people behind the work</Eyebrow>
          <h2>
            Different skills.
            <br />
            One team for your business.
          </h2>
          <p>
            Our team brings experience across customer apps, web platforms,
            enterprise systems and creative work. You can explore the people and
            experience behind ODDESTACK before starting a conversation.
          </p>
          <div className={styles.actions}>
            <ButtonLink href="/team" secondary>
              Meet the team
            </ButtonLink>
            <Link href="/work" className="text-link">
              Explore our experience{" "}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <ul className={styles.experienceList}>
          <li>
            <span>01</span>
            <div>
              <h3>Web & mobile</h3>
              <p>Customer apps, online stores and web platforms.</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>AI & business systems</h3>
              <p>Conversations, integrations and everyday workflows.</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Design & growth</h3>
              <p>Brand experiences, content and digital marketing.</p>
            </div>
          </li>
        </ul>
      </section>

      <section className={`container ${styles.section}`} id="process">
        <SectionTitle
          eyebrow="How it works"
          title="A clear plan. At every step."
        />
        <ol className={styles.steps}>
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className={styles.stepNumber}>0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        className={`container ${styles.section} ${styles.faq}`}
        id="questions"
      >
        <div>
          <Eyebrow>A few useful details</Eyebrow>
          <h2>
            Good questions.
            <br />
            Simple answers.
          </h2>
        </div>
        <div>
          {questions.map(({ question, answer }) => (
            <details className={styles.question} key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
          <Link href="/solutions" className={`text-link ${styles.finderLink}`}>
            Help me choose a service{" "}
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className={`container ${styles.contact}`} id="project-brief">
        <div>
          <Eyebrow>Let’s get started</Eyebrow>
          <h2>Tell us what you have in mind.</h2>
          <p>
            A small project or a bigger idea. A conversation is all it takes to
            start.
          </p>
        </div>
        <div className={styles.contactActions}>
          <ButtonLink href="/contact">Discuss your project</ButtonLink>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>
      </section>
    </div>
  );
}
