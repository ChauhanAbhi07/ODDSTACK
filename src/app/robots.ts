import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { isPreview } from "@/lib/publication";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(isPreview()
        ? { disallow: "/" }
        : { allow: "/", disallow: ["/api/", "/privacy", "/terms"] }),
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
