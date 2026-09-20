export const finderIndustries = [
  "Real Estate",
  "Automotive",
  "D2C / Ecommerce",
  "Healthcare / Clinics",
  "Education",
  "Field Service",
  "Consumer Products",
  "Fintech",
  "Professional Services",
  "Other",
] as const;
export const goals = [
  {
    id: "leads",
    label: "Get more leads",
    services: ["growth", "design", "erp-business-systems", "data"],
    challenges: [
      "Not enough qualified enquiries",
      "Leads slip through the cracks",
      "Campaigns aren't connected",
    ],
  },
  {
    id: "conversions",
    label: "Improve conversions",
    services: ["design", "growth", "ai-automation", "data"],
    challenges: [
      "Visitors leave without acting",
      "Follow-up takes too long",
      "We can't see where people drop off",
    ],
  },
  {
    id: "support",
    label: "Automate customer support",
    services: ["ai-automation", "technology", "erp-business-systems"],
    challenges: [
      "Too many repetitive questions",
      "Context is spread across tools",
      "Customers need after-hours help",
    ],
  },
  {
    id: "app",
    label: "Build an app",
    services: ["mobile", "design", "technology"],
    challenges: [
      "We need a first product",
      "Our current app is hard to use",
      "Our systems aren't connected",
    ],
  },
  {
    id: "erp",
    label: "Modernize ERP",
    services: ["erp-business-systems", "technology", "operations"],
    challenges: [
      "Too many spreadsheets",
      "Our tools don't talk",
      "Approvals take too long",
    ],
  },
  {
    id: "operations",
    label: "Automate operations",
    services: ["operations", "erp-business-systems", "ai-automation", "data"],
    challenges: [
      "Too much repetitive work",
      "Too many manual handoffs",
      "Reporting takes too long",
    ],
  },
  {
    id: "experience",
    label: "Improve customer experience",
    services: ["design", "mobile", "ai-automation"],
    challenges: [
      "Customers repeat themselves",
      "The journey feels disconnected",
      "Support lacks context",
    ],
  },
  {
    id: "commerce",
    label: "Launch ecommerce",
    services: ["commerce", "design", "growth", "operations"],
    challenges: [
      "We're starting from scratch",
      "Our catalog needs work",
      "Orders and marketing aren't connected",
    ],
  },
  {
    id: "data",
    label: "Understand our data",
    services: ["data", "technology", "operations"],
    challenges: [
      "Reports don't agree",
      "Data lives in different tools",
      "We don't know what to measure",
    ],
  },
  {
    id: "ai",
    label: "Build AI solutions",
    services: ["ai-automation", "technology", "data"],
    challenges: [
      "We don't know where to start",
      "Our knowledge is scattered",
      "We need agents that take action",
    ],
  },
] as const;
export type GoalId = (typeof goals)[number]["id"];
const additions: Record<string, string[]> = {
  "Real Estate": ["ai-automation", "erp-business-systems"],
  Automotive: ["erp-business-systems"],
  "D2C / Ecommerce": ["commerce"],
  "Healthcare / Clinics": ["erp-business-systems"],
  Education: ["technology"],
  "Field Service": ["mobile", "erp-business-systems"],
  "Consumer Products": ["commerce", "content"],
  Fintech: ["design", "mobile"],
  "Professional Services": ["operations"],
};
const reasons: Record<string, string> = {
  growth: "Connect demand to a measurable acquisition plan.",
  design: "Give customers a clear next step.",
  "erp-business-systems":
    "Keep customer and operational context in one system.",
  data: "Make progress visible through shared metrics.",
  "ai-automation":
    "Connect conversations and repetitive work to useful actions.",
  technology: "Connect the tools and build the missing capabilities.",
  mobile: "Bring the experience to customers and teams on the move.",
  operations: "Make handoffs, ownership and reporting work together.",
  commerce: "Connect the buying journey with order operations.",
  content: "Give your brand a consistent story across channels.",
};
export function recommend(industry: string, goal: string, challenge = "") {
  const selected = goals.find((g) => g.id === goal);
  const ids = [
    ...(selected?.services || ["technology", "design", "data"]),
    ...(additions[industry] || []),
  ];
  if (/report|measure|drop off/i.test(challenge)) ids.push("data");
  if (/follow-up|repetitive|after-hours|action/i.test(challenge))
    ids.push("ai-automation");
  return [...new Set(ids)].map((id) => ({ id, reason: reasons[id] }));
}
export function contactLink(capabilities: string[], industry?: string) {
  const params = new URLSearchParams({ stack: capabilities.join(",") });
  if (industry) params.set("industry", industry);
  return `/contact?${params.toString()}`;
}
