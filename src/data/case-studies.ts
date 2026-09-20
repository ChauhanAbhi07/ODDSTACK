import type { CaseStudy } from "@/lib/content-types";
export const caseStudies: CaseStudy[] = [
  {
    slug: "ai-voice-platform",
    title: "Conversations that get things done.",
    category: "AI VOICE & AGENTIC AUTOMATION",
    description: "Real-time voice. Connected knowledge. Business actions.",
    challenge:
      "Businesses need conversational agents that can understand a request and act through their existing systems.",
    approach:
      "Connect speech recognition, language models and speech synthesis through a real-time orchestration layer. Ground responses in retrieved knowledge and expose bounded business actions through APIs, with human escalation where needed.",
    outcome:
      "The experience area covers real-time conversation, knowledge retrieval and workflow execution. This anonymized draft describes supplied team experience; measured results have not been supplied.",
    stack: [
      "Voice AI",
      "LLMs",
      "STT / TTS",
      "RAG",
      "API orchestration",
      "WebSockets",
      "Cloud",
      "Workflow automation",
    ],
    capabilities: ["ai-automation", "technology"],
    status: "draft",
    art: "voice",
  },
  {
    slug: "enterprise-field-service",
    title: "The field. The office. Finally connected.",
    category: "ENTERPRISE SYSTEMS",
    description: "Asset records and service workflows in a shared platform.",
    challenge:
      "Service teams need consistent asset, ticket and customer context across enterprise systems and mobile tools.",
    approach:
      "Connect an ERP-backed asset and ticketing model with mobile workflows, notifications and SAP-facing APIs. Define roles and a clear source of truth for each record.",
    outcome:
      "The experience area spans connected asset and field-service workflows. No delivery metrics or customer claims are asserted.",
    stack: [
      "ERP",
      "Mobile",
      "REST APIs",
      "SAP Integration",
      "Asset Management",
      "Ticketing",
      "Notifications",
    ],
    capabilities: ["erp-business-systems", "mobile", "technology"],
    status: "draft",
    art: "field",
  },
  {
    slug: "field-workforce",
    title: "A working day with a better route.",
    category: "WORKFORCE INTELLIGENCE",
    description: "Scheduling and field coordination with operational context.",
    challenge:
      "Field assignments need to account for location, availability and job information without losing role-based control.",
    approach:
      "Bring scheduling, route planning, maps and attendance into a shared backend. Give each role a relevant view of work and make assignment updates accessible to field teams.",
    outcome:
      "The experience area includes scheduling, route optimization and role-based operations. Performance improvements require project-specific evidence.",
    stack: [
      "Backend",
      "Scheduling",
      "Route Optimization",
      "Maps",
      "FSM",
      "Attendance",
      "Role-based Security",
    ],
    capabilities: ["technology", "mobile", "operations"],
    status: "draft",
    art: "routes",
  },
  {
    slug: "fintech-mobile",
    title: "Complex money. Clearer journeys.",
    category: "MOBILE PRODUCT",
    description: "A cohesive mobile experience for a complex product space.",
    challenge:
      "Customer-facing fintech journeys need consistent interfaces and understandable information across many screens.",
    approach:
      "Build reusable React Native components and typed API integrations. Align the design system with key journeys and instrument interaction points for product learning.",
    outcome:
      "The supplied experience covers mobile interfaces, API connections and analytics. This is not a claim about regulated advice or financial outcomes.",
    stack: [
      "React Native",
      "TypeScript",
      "API Integration",
      "Analytics",
      "Design Systems",
      "Financial Planning UX",
    ],
    capabilities: ["mobile", "design", "data"],
    status: "draft",
    art: "mobile",
  },
  {
    slug: "commerce-logistics",
    title: "Beyond the checkout.",
    category: "COMMERCE & PLATFORMS",
    description: "Storefronts and the operational tools behind each order.",
    challenge:
      "Commerce experiences must connect customer journeys to catalog, order and logistics operations.",
    approach:
      "Connect a modern storefront to APIs and an administrative dashboard. Treat search visibility, performance and order operations as part of the same product.",
    outcome:
      "The experience area includes ecommerce and logistics applications. Revenue and conversion claims are intentionally absent without supporting evidence.",
    stack: [
      "Next.js",
      "MERN",
      "Commerce",
      "Admin Dashboard",
      "APIs",
      "SEO",
      "Performance",
    ],
    capabilities: ["commerce", "technology", "operations"],
    status: "draft",
    art: "commerce",
  },
  {
    slug: "social-content",
    title: "Made for the scroll. Built to connect.",
    category: "CONTENT & CREATIVE",
    description: "A repeatable creative workflow for social-first brands.",
    challenge:
      "Brands need consistent short-form stories across formats without losing their voice.",
    approach:
      "Connect content planning, editing and motion treatments into a repeatable production process. Adapt the opening, pacing and framing to the story and channel.",
    outcome:
      "The supplied experience covers short-form production and campaign content. Audience or engagement results have not been supplied.",
    stack: [
      "Short-form Video",
      "Reels",
      "Motion",
      "Editing",
      "Campaign Content",
      "Storytelling",
    ],
    capabilities: ["content", "growth", "design"],
    status: "draft",
    art: "content",
  },
  {
    slug: "business-intelligence",
    title: "From scattered data to a shared picture.",
    category: "DATA & INTELLIGENCE",
    description: "Decision-focused dashboards built on connected data.",
    challenge:
      "Operational and commercial information becomes difficult to use when definitions and sources disagree.",
    approach:
      "Prepare source data with SQL and transformation workflows, agree on KPI definitions, and assemble Power BI views around recurring business questions.",
    outcome:
      "The experience area covers dashboards and business reporting. No quantified business impact is claimed.",
    stack: [
      "Power BI",
      "Excel",
      "SQL",
      "Data Transformation",
      "KPIs",
      "Business Insights",
    ],
    capabilities: ["data", "operations"],
    status: "draft",
    art: "data",
  },
];
