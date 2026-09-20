import { Suspense } from "react";
import { PageIntro } from "@/components/ui";
import { ContactForm } from "@/components/contact-form";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Build your stack",
  "Tell us what you're trying to build, grow, automate or fix. Start your ODDESTACK project brief.",
  "/contact",
);
export default function Contact() {
  return (
    <>
      <PageIntro
        label="Build your stack"
        title="Big idea? Messy problem? We're listening."
        description="A website for your shop, an app for your customers, social media for your brand, or a bigger business challenge. Tell us what you need. We'll figure out the stack."
      />
      <Suspense
        fallback={
          <p className="container page-content" role="status">
            Loading your project brief...
          </p>
        }
      >
        <ContactForm />
      </Suspense>
    </>
  );
}
