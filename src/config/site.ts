export const site = {
  name: "ODDESTACK",
  socialImage:
    process.env.NEXT_PUBLIC_STATIC_SITE === "true"
      ? "opengraph-image.png"
      : "opengraph-image",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@oddestack.com",
  description:
    "Websites, apps, social media and digital growth for local businesses and growing teams. Technology, creative and AI, connected by ODDESTACK.",
  showPricing: false,
  socials: [] as { label: string; href: string }[],
};
