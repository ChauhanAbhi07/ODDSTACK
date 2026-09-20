import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { services } from "@/data/services";
import { industries } from "@/data/industries";
import { caseStudies } from "@/data/case-studies";
import { articles } from "@/data/articles";
import { visibleContent } from "@/lib/publication";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/services",
    "/solutions",
    "/industries",
    "/work",
    "/team",
    "/insights",
    "/about",
    "/contact",
    ...services.map((s) => `/services/${s.slug}`),
    ...industries.map((i) => `/industries/${i.slug}`),
    ...visibleContent(caseStudies, false).map((c) => `/work/${c.slug}`),
    ...visibleContent(articles, false).map((a) => `/insights/${a.slug}`),
  ];
  return paths.map((p) => ({
    url: `${site.url}${p}`,
    changeFrequency: p ? "monthly" : "weekly",
    priority: p ? 0.7 : 1,
  }));
}
