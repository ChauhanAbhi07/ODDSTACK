import type { Article } from "@/lib/content-types";
export const articles: Article[] = [
  {
    slug: "another-saas-tool",
    title: "Your business doesn't need another SaaS tool.",
    category: "Operations",
    description:
      "Before you buy another subscription, look at the spaces between the tools you already have.",
    readTime: "3 min",
    status: "draft",
    sections: [
      {
        title: "The problem between the products",
        text: "A team can have a capable CRM, a useful project tool and a good accounting system and still spend its day copying information. Each product solves a local problem. The work between them remains somebody's responsibility, usually without a clear owner.",
      },
      {
        title: "Follow one piece of work",
        text: "Pick a real customer request. Trace it from arrival to completion. Record each handoff, each repeated entry and each decision that requires someone to ask for context. This small exercise often tells you more than a feature comparison ever could.",
      },
      {
        title: "Choose a source of truth",
        text: "Decide where customer details, order status and task ownership should live. Define which systems can update them and what happens when an update fails. An integration is only useful when people can understand and recover from its failures.",
      },
      {
        title: "Buy for the missing capability",
        text: "Once the workflow is visible, the next decision becomes easier. You may need a new product, a small integration or a simpler process. Start with the missing capability and a named owner. The goal is less friction in the work, not a larger software collection.",
      },
    ],
  },
  {
    slug: "ai-voice-operations",
    title: "The rise of AI voice in customer operations.",
    category: "AI & Automation",
    description:
      "A voice agent becomes useful when a conversation can lead to a real, bounded action.",
    readTime: "3 min",
    status: "draft",
    sections: [
      {
        title: "A conversation is a workflow",
        text: "A booking request is more than a transcript. It involves availability, customer details, confirmation and a recovery path if something fails. A useful voice experience connects these pieces instead of ending at an answer.",
      },
      {
        title: "Start with a narrow job",
        text: "Choose a workflow with clear boundaries: appointment scheduling, basic qualification or checking an existing request. Define what the agent can say, what it can change and when it must transfer to a person. Let users know they are interacting with an automated system.",
      },
      {
        title: "Design for the imperfect call",
        text: "People interrupt, change their minds and call from noisy places. Evaluate latency, turn-taking, misunderstanding and recovery alongside accuracy. A graceful handoff with the right context can be more valuable than an agent that tries to do everything.",
      },
      {
        title: "Measure completed work",
        text: "Track whether the intended task was completed correctly, whether a follow-up was needed and whether the customer could reach a person. Review consent, recording and data-retention requirements for the deployment before launch. Scale only after the narrow workflow behaves reliably.",
      },
    ],
  },
  {
    slug: "erp-that-works",
    title: "ERP isn't boring when it actually works.",
    category: "Technology",
    description:
      "The most useful business system is the one that matches the way the work needs to happen.",
    readTime: "3 min",
    status: "draft",
    sections: [
      {
        title: "A process before a module",
        text: "ERP discussions often begin with a list of modules. A better starting point is a list of decisions: who approves a purchase, what makes a job complete and where an exception goes. The software should make those decisions easier to carry out.",
      },
      {
        title: "Keep the exception visible",
        text: "Happy paths are easy to demonstrate. Real operations include missing inventory, rejected approvals and incomplete records. Design those states explicitly, with ownership and a way to resolve them without exporting another spreadsheet.",
      },
      {
        title: "Connect deliberately",
        text: "Give each system a defined responsibility. A mobile tool can capture field activity while the ERP maintains the asset record. Agree on identifiers, retries and reconciliation so an interrupted connection does not become an invisible operational problem.",
      },
      {
        title: "Roll out with the people doing the work",
        text: "Start with a contained process and let its users test real scenarios. Watch where they leave the system to complete a task. Those moments are clues about missing context, unclear steps or unnecessary complexity. Improve the workflow before expanding it.",
      },
    ],
  },
  {
    slug: "marketing-product-stack",
    title: "What happens when marketing and product share a stack?",
    category: "Growth",
    description:
      "A campaign promise and a product experience should belong to the same conversation.",
    readTime: "3 min",
    status: "draft",
    sections: [
      {
        title: "The customer sees one business",
        text: "Internally, campaigns and product work may sit in different teams. Externally, an ad, a landing page, a sign-up and a support response are one journey. A mismatch anywhere creates confusion that the next team has to fix.",
      },
      {
        title: "Share the question",
        text: "Choose a common question such as why a qualified visitor fails to activate. Marketing brings intent and message context. Product brings behavior and usability context. A shared question makes their evidence useful together.",
      },
      {
        title: "Connect the definitions",
        text: "Agree on the meaning of a qualified lead, an activation and a returning customer. Instrument the journey consistently and avoid treating every click as progress. Use qualitative feedback to understand what a number cannot explain.",
      },
      {
        title: "Build a shared iteration rhythm",
        text: "Review a journey together, select one friction point and change the relevant message or experience. Give the experiment enough time to collect useful evidence. A connected team can learn across the handoff instead of passing the problem along.",
      },
    ],
  },
  {
    slug: "automation-before-ai",
    title: "Automation before AI: what businesses get wrong.",
    category: "AI & Automation",
    description:
      "Sometimes the smartest workflow needs a simple rule before it needs a model.",
    readTime: "3 min",
    status: "draft",
    sections: [
      {
        title: "Separate rules from judgment",
        text: "If a task follows a stable rule with well-defined inputs, conventional automation may be the clearest answer. Language models become useful when the input is unstructured or interpretation is part of the job. Many workflows benefit from a combination.",
      },
      {
        title: "Stabilize the input",
        text: "Duplicate records, missing fields and unclear ownership make any automation fragile. First agree on the input format and the expected result. Add validation and a visible exception queue so the team can correct problems.",
      },
      {
        title: "Bound the intelligent step",
        text: "Ask the model to perform a specific task, such as classifying a support request against known categories. Validate its output before taking action. Keep consequential changes behind appropriate checks and provide a human review path.",
      },
      {
        title: "Evaluate against a baseline",
        text: "Compare the proposed workflow with the current process and a simpler rules-based version. Include error rates, review effort, recovery and operating cost. Use AI where the evidence shows that it helps the task, not simply because the feature is available.",
      },
    ],
  },
  {
    slug: "ecommerce-strategy",
    title: "Your ecommerce store is not your ecommerce strategy.",
    category: "Ecommerce",
    description:
      "A storefront is one part of a much longer customer and operational journey.",
    readTime: "3 min",
    status: "draft",
    sections: [
      {
        title: "The order is the beginning of another journey",
        text: "A convincing product page matters. So do inventory accuracy, delivery updates, support and returns. Customers form their opinion across all of these interactions, even when different tools and teams deliver them.",
      },
      {
        title: "Connect the promise to the operation",
        text: "Make sure a campaign's offer can be fulfilled. Keep catalog information consistent, expose relevant availability and give support access to order context. An attractive storefront cannot compensate for an unclear post-purchase experience.",
      },
      {
        title: "Look at the complete economics",
        text: "Evaluate acquisition together with fulfillment, returns and repeat behavior. Segment carefully and agree on definitions before making decisions from a dashboard. A local improvement can create a cost elsewhere in the journey.",
      },
      {
        title: "Build a connected backlog",
        text: "Collect friction points across discovery, checkout, fulfillment and retention. Prioritize them by customer impact and operational feasibility. The next useful improvement might be an email, a catalog workflow or a support integration rather than a new homepage.",
      },
    ],
  },
];
