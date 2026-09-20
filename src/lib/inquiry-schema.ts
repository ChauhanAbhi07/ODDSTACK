import { z } from "zod";
import { services } from "@/data/services";
import { finderIndustries } from "./recommendations";
export const intents = [
  "Build something",
  "Grow something",
  "Automate something",
  "Fix something",
  "Not sure yet",
] as const;
export const companySizes = [
  "Just me",
  "2–10 people",
  "11–50 people",
  "51–200 people",
  "201+ people",
] as const;
export const budgets = [
  "Under ₹1 lakh",
  "₹1–5 lakh",
  "₹5–15 lakh",
  "₹15 lakh+",
  "Let's figure it out",
] as const;
export const timelines = [
  "As soon as possible",
  "1–3 months",
  "3–6 months",
  "Just exploring",
] as const;
export const engagementNames = [
  "",
  "Project",
  "Growth retainer",
  "Managed stack",
  "Transformation",
] as const;
export const inquirySchema = z.object({
  engagement: z.enum(engagementNames).default(""),
  intent: z.enum(intents, { error: "Choose what you want to do." }),
  capabilities: z
    .array(
      z
        .string()
        .refine(
          (v) => services.some((s) => s.slug === v),
          "Choose a listed capability.",
        ),
    )
    .max(10)
    .transform((v) => [...new Set(v)]),
  industry: z.enum(finderIndustries, { error: "Choose an industry." }),
  companySize: z.enum(companySizes, { error: "Choose your company size." }),
  budget: z.enum(budgets, {
    error: "Choose a budget or the undecided option.",
  }),
  timeline: z.enum(timelines, { error: "Choose a timeline." }),
  description: z
    .string()
    .trim()
    .min(20, "Add at least 20 characters about your project.")
    .max(4000),
  name: z.string().trim().min(2, "Add your name.").max(100),
  company: z
    .string()
    .trim()
    .min(2, "Add your company or project name.")
    .max(150),
  email: z.email({ error: "Enter a valid email address." }).max(254),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine(
      (v) => !v || /^[+\d\s().-]{6,40}$/.test(v),
      "Enter a valid phone number or leave it blank.",
    ),
  website: z.string().max(0),
});
export type Inquiry = z.infer<typeof inquirySchema>;
