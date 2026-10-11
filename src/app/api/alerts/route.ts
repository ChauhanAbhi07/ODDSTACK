import { createHash } from "node:crypto";
import { z } from "zod";
import { alertLabel, alertMessage, allowedPath } from "@/lib/alerts/targets";
import { sendWhatsApp, whatsappConfig } from "@/lib/alerts/whatsapp";

export const runtime = "nodejs";

const requests = new Map<
  string,
  { count: number; reset: number; seen: Map<string, number> }
>();
const WINDOW_MS = 10 * 60 * 1000;
const DUPLICATE_MS = 2 * 60 * 1000;
const LIMIT = 8;
const GLOBAL_LIMIT = 40;
let globalCount = 0;
let globalReset = 0;

const payloadSchema = z.object({
  kind: z.enum(["click", "enquiry"]),
  label: z.string().max(80).optional(),
  path: z.string().max(360).optional(),
  session: z.string().max(80).optional(),
});

export function clearAlertLimits() {
  requests.clear();
  globalCount = 0;
  globalReset = 0;
}

function response(body: object | null, status = 200) {
  return new Response(body ? JSON.stringify(body) : null, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(status === 429 ? { "Retry-After": "60" } : {}),
    },
  });
}

function allowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  let browserOrigin: URL;
  try {
    browserOrigin = new URL(origin);
  } catch {
    return false;
  }
  const matchesHost =
    browserOrigin.origin === origin &&
    browserOrigin.host === request.headers.get("host") &&
    browserOrigin.protocol === new URL(request.url).protocol;
  return (
    matchesHost ||
    origin === new URL(request.url).origin ||
    origin === process.env.NEXT_PUBLIC_SITE_URL
  );
}

function clientBucket(request: Request, session?: string) {
  if (
    session &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      session,
    )
  )
    return createHash("sha256").update(`session:${session}`).digest("hex");
  const address =
    process.env.TRUST_PROXY === "true"
      ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        "unknown"
      : "local";
  return createHash("sha256").update(address).digest("hex");
}

export async function POST(request: Request) {
  if (!allowedOrigin(request))
    return response({ error: "This origin cannot send an alert." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return response({ error: "Send a JSON alert." }, 415);
  if (Number(request.headers.get("content-length")) > 2048)
    return response({ error: "The alert is too large." }, 413);
  const reader = request.body?.getReader();
  if (!reader) return response({ error: "An alert is required." }, 400);
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > 2048) {
      await reader.cancel();
      return response({ error: "The alert is too large." }, 413);
    }
    chunks.push(value);
  }
  let raw: unknown;
  try {
    raw = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return response({ error: "The alert must contain valid JSON." }, 400);
  }
  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success)
    return response({ error: "This alert is not recognized." }, 422);
  let message: string;
  let fingerprint: string;
  if (parsed.data.kind === "enquiry") {
    message = alertMessage({ kind: "enquiry" });
    fingerprint = "enquiry";
  } else {
    const label = parsed.data.label ? alertLabel(parsed.data.label) : null;
    const path = parsed.data.path ? allowedPath(parsed.data.path) : null;
    if (!label || !path)
      return response({ error: "This alert is not recognized." }, 422);
    message = alertMessage({ label, path });
    fingerprint = `click:${label}|${path}`;
  }
  const now = Date.now();
  for (const [key, value] of requests)
    if (value.reset < now) requests.delete(key);
  if (globalReset < now) {
    globalCount = 0;
    globalReset = now + WINDOW_MS;
  }
  const bucket = clientBucket(request, parsed.data.session);
  const limit = requests.get(bucket) || {
    count: 0,
    reset: now + WINDOW_MS,
    seen: new Map<string, number>(),
  };
  const previous = limit.seen.get(fingerprint);
  if (previous && now - previous < DUPLICATE_MS) return response(null, 204);
  if (
    limit.count >= LIMIT ||
    globalCount >= GLOBAL_LIMIT ||
    requests.size > 2000
  )
    return response({ error: "Too many alerts. Please try again later." }, 429);
  limit.count++;
  globalCount++;
  limit.seen.set(fingerprint, now);
  requests.set(bucket, limit);
  if (!whatsappConfig()) return response(null, 204);
  try {
    await sendWhatsApp(message);
  } catch {
    return response({ error: "The alert could not be delivered." }, 502);
  }
  return response(null, 204);
}
