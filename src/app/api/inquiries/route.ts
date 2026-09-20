import { createHash, createHmac } from "node:crypto";
import { inquirySchema } from "@/lib/inquiry-schema";
import { saveInquiry, StorageError } from "@/lib/inquiries/storage";
export const runtime = "nodejs";
const requests = new Map<string, { count: number; reset: number }>();
function response(body: object, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...(status === 429 ? { "Retry-After": "60" } : {}),
    },
  });
}
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  // Next's internal URL can use localhost even when the browser uses 127.0.0.1.
  // The Host header reflects the browser's actual destination; do not trust forwarded-host.
  let matchesHost = false;
  if (origin) {
    try {
      const browserOrigin = new URL(origin);
      matchesHost =
        browserOrigin.origin === origin &&
        browserOrigin.host === request.headers.get("host") &&
        browserOrigin.protocol === new URL(request.url).protocol;
    } catch {
      return response({ error: "This origin cannot submit a brief." }, 403);
    }
  }
  if (
    origin &&
    !matchesHost &&
    origin !== new URL(request.url).origin &&
    origin !== process.env.NEXT_PUBLIC_SITE_URL
  )
    return response({ error: "This origin cannot submit a brief." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return response({ error: "Send a JSON brief." }, 415);
  const key = request.headers.get("idempotency-key") || "";
  if (!/^[a-zA-Z0-9-]{16,80}$/.test(key))
    return response({ error: "A valid submission key is required." }, 400);
  const now = Date.now();
  for (const [key, value] of requests)
    if (value.reset < now) requests.delete(key);
  const address =
    process.env.TRUST_PROXY === "true"
      ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        "unknown"
      : "local";
  const bucket = createHash("sha256").update(address).digest("hex");
  const limit = requests.get(bucket) || { count: 0, reset: now + 60000 };
  if (limit.count >= 30 || requests.size > 2000)
    return response(
      { error: "Too many submissions. Please try again in a minute." },
      429,
    );
  limit.count++;
  requests.set(bucket, limit);
  if (Number(request.headers.get("content-length")) > 16384)
    return response({ error: "The brief is too large." }, 413);
  try {
    const reader = request.body?.getReader();
    if (!reader) return response({ error: "A brief is required." }, 400);
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > 16384) {
        await reader.cancel();
        return response({ error: "The brief is too large." }, 413);
      }
      chunks.push(value);
    }
    let raw: unknown;
    try {
      raw = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      return response({ error: "The brief must contain valid JSON." }, 400);
    }
    const parsed = inquirySchema.safeParse(raw);
    if (!parsed.success)
      return response(
        {
          error: "Please check the highlighted fields.",
          fields: Object.fromEntries(
            parsed.error.issues.map((i) => [i.path[0], i.message]),
          ),
        },
        422,
      );
    let persistentBucket = "anonymous";
    if (process.env.INQUIRY_STORAGE_DRIVER === "postgres") {
      const secret = process.env.RATE_LIMIT_SECRET;
      if (!secret || secret.length < 32)
        return response(
          {
            error:
              "Enquiry storage configuration is incomplete. Please contact us by email.",
          },
          503,
        );
      persistentBucket = createHmac("sha256", secret)
        .update(address)
        .digest("hex");
    }
    return response(await saveInquiry(parsed.data, key, persistentBucket), 201);
  } catch (error) {
    return response(
      {
        error:
          error instanceof StorageError
            ? error.message
            : "We couldn't save your brief. Please retry or contact us by email.",
      },
      error instanceof StorageError ? error.status : 503,
    );
  }
}
