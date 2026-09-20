export type Publication = "published" | "draft";
export interface Service {
  slug: string;
  title: string;
  short: string;
  description: string;
  items: string[];
  outcome: string;
}
export interface Solution {
  slug: string;
  title: string;
  description: string;
  capabilities: string[];
  approach: string;
}
export interface Industry {
  slug: string;
  title: string;
  description: string;
  challenge: string;
  items: string[];
  capabilities: string[];
}
export interface TeamMember {
  name: string;
  role: string;
  tags: string[];
  bio: string;
  placeholder: boolean;
}
export interface CaseStudy {
  slug: string;
  title: string;
  category: string;
  description: string;
  challenge: string;
  approach: string;
  outcome: string;
  stack: string[];
  capabilities: string[];
  status: Publication;
  art:
    "voice" | "field" | "routes" | "mobile" | "commerce" | "content" | "data";
}
export interface Article {
  slug: string;
  title: string;
  category: string;
  description: string;
  readTime: string;
  sections: { title: string; text: string }[];
  status: Publication;
}
