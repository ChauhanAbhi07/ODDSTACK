import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Inquiry } from "../inquiry-schema";
import { StorageError, type Receipt } from "./errors";
export { StorageError } from "./errors";
export type { Receipt } from "./errors";
export async function saveLocal(
  inquiry: Inquiry,
  key: string,
  root: string,
): Promise<Receipt> {
  const digest = createHash("sha256")
    .update(JSON.stringify(inquiry))
    .digest("hex");
  const folder = path.join(
    root,
    createHash("sha256").update(key).digest("hex"),
  );
  await mkdir(root, { recursive: true });
  try {
    await mkdir(folder);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    for (let attempt = 0; attempt < 20; attempt++) {
      try {
        const previous = JSON.parse(
          await readFile(path.join(folder, "record.json"), "utf8"),
        );
        if (previous.digest !== digest)
          throw new StorageError(
            "This submission key belongs to a different brief. Please start a new submission.",
            409,
          );
        return { id: previous.id, mode: "local" };
      } catch (readError) {
        if ((readError as NodeJS.ErrnoException).code !== "ENOENT")
          throw readError;
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
    }
    throw new StorageError(
      "The previous submission is still being saved. Please retry shortly.",
    );
  }
  const id = randomUUID();
  await writeFile(
    path.join(folder, "record.tmp"),
    JSON.stringify({
      id,
      digest,
      createdAt: new Date().toISOString(),
      inquiry,
    }),
    { encoding: "utf8", mode: 0o600 },
  );
  await rename(
    path.join(folder, "record.tmp"),
    path.join(folder, "record.json"),
  );
  return { id, mode: "local" };
}
export async function saveInquiry(
  inquiry: Inquiry,
  key: string,
  clientKey = "anonymous",
): Promise<Receipt> {
  const driver =
    process.env.INQUIRY_STORAGE_DRIVER ||
    (process.env.NODE_ENV === "production" ? "disabled" : "local");
  if (driver === "postgres") {
    const { savePostgres } = await import("./postgres");
    return savePostgres(inquiry, key, clientKey);
  }
  if (
    driver === "local" &&
    (process.env.NODE_ENV !== "production" ||
      process.env.ALLOW_LOCAL_INQUIRIES === "true")
  )
    return saveLocal(
      inquiry,
      key,
      path.resolve(
        /* turbopackIgnore: true */ process.env.INQUIRY_LOCAL_PATH ||
          ".local/inquiries",
      ),
    );
  if (
    driver === "webhook" &&
    process.env.INQUIRY_WEBHOOK_URL &&
    process.env.INQUIRY_WEBHOOK_SECRET
  ) {
    const url = new URL(process.env.INQUIRY_WEBHOOK_URL);
    if (url.protocol !== "https:")
      throw new StorageError("Secure inquiry storage is not configured.");
    const response = await fetch(url, {
      method: "POST",
      redirect: "error",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.INQUIRY_WEBHOOK_SECRET}`,
        "Idempotency-Key": key,
      },
      body: JSON.stringify(inquiry),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok)
      throw new StorageError(
        "Your brief could not be saved. Please try again.",
        response.status === 409 ? 409 : response.status === 429 ? 429 : 503,
      );
    const receipt = await response.json();
    if (
      typeof receipt.id !== "string" ||
      !/^[a-zA-Z0-9_-]{1,100}$/.test(receipt.id)
    )
      throw new StorageError(
        "The storage service did not confirm your brief. Please retry.",
      );
    return { id: receipt.id, mode: "live" };
  }
  throw new StorageError(
    "The project form isn't connected yet. Please use the email link below.",
  );
}
