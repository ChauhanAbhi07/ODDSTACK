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
    alternates: { canonical: path },
    openGraph: {
      title: `${title} — ODDESTACK`,
      description,
      url: path,
      siteName: site.name,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
    ...(draft ? { robots: { index: false, follow: true } } : {}),
  };
}
