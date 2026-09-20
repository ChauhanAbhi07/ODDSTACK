import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MotionEnhancements } from "@/components/motion-enhancements";
import { JsonLd } from "@/components/ui";
import { site } from "@/config/site";
import "./globals.css";
const manrope = localFont({
  src: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  display: "swap",
  variable: "--font-manrope",
});
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "ODDESTACK — One better stack.",
    template: "%s | ODDESTACK",
  },
  description: site.description,
  openGraph: { images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={manrope.variable}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <MotionEnhancements />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.name,
            url: site.url,
            description: site.description,
          }}
        />
      </body>
    </html>
  );
}
