import { createHash } from "node:crypto";
import { z } from "zod";
import { services } from "../../data/services";
import type { Inquiry } from "../inquiry-schema";
import { StorageError, type Receipt } from "./errors";

export function emailConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.INQUIRY_EMAIL_FROM?.trim();
  const to = process.env.INQUIRY_EMAIL_TO?.trim();
  if (
    !apiKey ||
    !z.email().safeParse(from).success ||
    !z.email().safeParse(to).success
  )
    throw new StorageError(
      "Email delivery isn't connected yet. Please use the email link below.",
    );
  return { apiKey, from: from!, to: to! };
}

export async function sendInquiryEmail(
  inquiry: Inquiry,
  key: string,
): Promise<Receipt> {
  const { apiKey, from, to } = emailConfig();
  const reference = createHash("sha256").update(key).digest("hex");
  // Stable payload and key let the provider deduplicate retries for 24 hours.
  // Plain text keeps visitor content out of HTML and email headers.
  const text = [
    "New ODDESTACK website enquiry",
    "",
    `Name: ${inquiry.name}`,
    `Company / project: ${inquiry.company}`,
    `Email: ${inquiry.email}`,
    `Phone / WhatsApp: ${inquiry.phone || "Not provided"}`,
    "",
    `Intent: ${inquiry.intent}`,
    `Services: ${inquiry.capabilities.map((id) => services.find((s) => s.slug === id)?.title || id).join(", ") || "Not sure yet"}`,
    `Industry: ${inquiry.industry}`,
    `Company size: ${inquiry.companySize}`,
    `Budget: ${inquiry.budget}`,
    `Timeline: ${inquiry.timeline}`,
    `Engagement: ${inquiry.engagement || "Not specified"}`,
    "",
    "Project description:",
    inquiry.description,
    "",
    `Submission reference: ${reference}`,
  ].join("\n");
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      redirect: "error",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `oddestack-inquiry/${reference}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: inquiry.email,
        subject: "New ODDESTACK website enquiry",
        text,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      if (response.status === 409) {
        const detail = await response.json().catch(() => null);
        if (detail?.name === "invalid_idempotent_request")
          throw new StorageError(
            "This submission key belongs to a different brief. Please start a new submission.",
            409,
          );
      }
      throw new StorageError(
        "We couldn't confirm your enquiry email. Your answers are still here; please retry shortly.",
        response.status === 429 ? 429 : 503,
      );
    }
    const receipt = await response.json();
    if (
      typeof receipt?.id !== "string" ||
      !/^[a-zA-Z0-9_-]{1,100}$/.test(receipt.id)
    )
      throw new StorageError(
        "The email service didn't confirm your enquiry. Please retry.",
      );
    return { id: receipt.id, mode: "email" };
  } catch (error) {
    if (error instanceof StorageError) throw error;
    throw new StorageError(
      "We couldn't confirm your enquiry email. Your answers are still here; please retry shortly.",
    );
  }
}
