import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
const missing: string[] = [];
const url = process.env.NEXT_PUBLIC_SITE_URL;
try {
  const parsed = new URL(url || "");
  if (
    parsed.protocol !== "https:" ||
    ["localhost", "127.0.0.1"].includes(parsed.hostname)
  )
    missing.push("A real HTTPS site origin");
} catch {
  missing.push("NEXT_PUBLIC_SITE_URL");
}
if (
  !process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
  process.env.CONTACT_EMAIL_CONFIRMED !== "true"
)
  missing.push("Confirmed contact email (CONTACT_EMAIL_CONFIRMED=true)");
if (process.env.CONTENT_MODE !== "public") missing.push("CONTENT_MODE=public");
if (process.env.BUSINESS_CONTENT_REVIEWED !== "true")
  missing.push("Business content review (BUSINESS_CONTENT_REVIEWED=true)");
if (process.env.LEGAL_PAGES_REVIEWED !== "true")
  missing.push(
    "Completed and reviewed privacy/terms pages (LEGAL_PAGES_REVIEWED=true)",
  );
if (process.env.INQUIRY_STORAGE_DRIVER === "postgres") {
  if (!process.env.DATABASE_URL)
    missing.push("DATABASE_URL and applied database migration");
  if ((process.env.RATE_LIMIT_SECRET?.length || 0) < 32)
    missing.push("A random RATE_LIMIT_SECRET of at least 32 characters");
  if (
    !process.env.INQUIRY_NOTIFICATION_WEBHOOK_URL ||
    !process.env.INQUIRY_NOTIFICATION_WEBHOOK_SECRET
  )
    missing.push(
      "Notification endpoint and secret, or an agreed manual database review process",
    );
} else if (process.env.INQUIRY_STORAGE_DRIVER === "webhook") {
  if (!process.env.INQUIRY_WEBHOOK_URL || !process.env.INQUIRY_WEBHOOK_SECRET)
    missing.push("Durable enquiry webhook URL and secret");
} else
  missing.push("A production enquiry storage driver (postgres or webhook)");
if (missing.length) {
  console.log(
    "Public launch inputs still needed:\n" +
      missing.map((v) => `- ${v}`).join("\n"),
  );
  process.exitCode = 1;
} else
  console.log(
    "Launch configuration is present. Confirm database connectivity, delivery and HTTPS on the actual host before opening the site to visitors.",
  );
