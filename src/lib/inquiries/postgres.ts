import { createHash, randomUUID } from "node:crypto";
import { Pool } from "pg";
import type { Inquiry } from "../inquiry-schema";
import { StorageError, type Receipt } from "./errors";

let pool: Pool | undefined;
export function database() {
  if (!process.env.DATABASE_URL)
    throw new StorageError("Enquiry storage is not configured.");
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
      statement_timeout: 10000,
    });
    pool.on("error", () =>
      console.error("An idle enquiry database connection failed."),
    );
  }
  return pool;
}
export async function closeDatabase() {
  const current = pool;
  pool = undefined;
  await current?.end();
}

export async function savePostgres(
  inquiry: Inquiry,
  key: string,
  clientKey = "anonymous",
  db = database(),
): Promise<Receipt> {
  const keyHash = createHash("sha256").update(key).digest("hex");
  const payloadHash = createHash("sha256")
    .update(JSON.stringify(inquiry))
    .digest("hex");
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    // Serialize only identical submission keys, across every application instance.
    await client.query(
      "SELECT pg_advisory_xact_lock(hashtextextended($1, 0))",
      [keyHash],
    );
    const existing = await client.query<{ id: string; payload_hash: string }>(
      "SELECT id, payload_hash FROM oddestack_inquiries WHERE idempotency_hash=$1",
      [keyHash],
    );
    if (existing.rows[0]) {
      if (existing.rows[0].payload_hash !== payloadHash)
        throw new StorageError(
          "This submission key belongs to a different brief.",
          409,
        );
      await client.query("COMMIT");
      return { id: existing.rows[0].id, mode: "live" };
    }
    const rate = await client.query<{ count: number }>(
      `INSERT INTO oddestack_inquiry_limits (bucket, window_start, count)
      VALUES ($1, date_trunc('minute', clock_timestamp()), 1)
      ON CONFLICT (bucket, window_start) DO UPDATE SET count=oddestack_inquiry_limits.count+1
      RETURNING count`,
      [clientKey],
    );
    if (rate.rows[0].count > 10)
      throw new StorageError(
        "Too many submissions. Please try again in a minute.",
        429,
      );
    const id = randomUUID();
    await client.query(
      "INSERT INTO oddestack_inquiries (id, idempotency_hash, payload_hash, payload) VALUES ($1,$2,$3,$4)",
      [id, keyHash, payloadHash, JSON.stringify(inquiry)],
    );
    await client.query(
      "INSERT INTO oddestack_inquiry_notifications (inquiry_id) VALUES ($1)",
      [id],
    );
    await client.query("COMMIT");
    return { id, mode: "live" };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
