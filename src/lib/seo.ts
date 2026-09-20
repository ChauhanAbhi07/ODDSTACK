import type { Metadata } from "next";
import { site } from "@/config/site";
export function metadata(
  title: string,
  description: string,
  path = "/",
  draft = false,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${site.url.replace(/\/$/, "")}${path}` },
    openGraph: {
      title: `${title} — ODDESTACK`,
      description,
      url: `${site.url.replace(/\/$/, "")}${path}`,
      siteName: site.name,
      type: "website",
      images: [
        { url: `${site.url}/${site.socialImage}`, width: 1200, height: 630 },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${site.url}/${site.socialImage}`],
    },
    ...(draft ? { robots: { index: false, follow: true } } : {}),
  };
}
