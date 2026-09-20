import { randomUUID } from "node:crypto";
import type { Pool } from "pg";
import { database } from "./postgres";
import type { Inquiry } from "../inquiry-schema";

export interface Notification {
  id: string;
  createdAt: string;
  inquiry: Inquiry;
}
export type DeliverNotification = (message: Notification) => Promise<void>;

export function notificationDelivery(): DeliverNotification {
  const endpoint = process.env.INQUIRY_NOTIFICATION_WEBHOOK_URL;
  const token = process.env.INQUIRY_NOTIFICATION_WEBHOOK_SECRET;
  if (!endpoint || !token || new URL(endpoint).protocol !== "https:")
    throw new Error(
      "Configure an HTTPS notification endpoint and its secret before running delivery.",
    );
  return async (message) => {
    const response = await fetch(endpoint, {
      method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(10000),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Idempotency-Key": message.id,
      },
      body: JSON.stringify(message),
    });
    if (!response.ok) throw new Error(`delivery_http_${response.status}`);
  };
}

export async function deliverPending(
  deliver: DeliverNotification,
  db: Pool = database(),
  limit = 20,
) {
  let delivered = 0;
  let failed = 0;
  for (let i = 0; i < limit; i++) {
    const lease = randomUUID();
    const claim = await db.query<{ inquiry_id: string; attempts: number }>(
      `WITH candidate AS (
      SELECT inquiry_id FROM oddestack_inquiry_notifications
      WHERE delivered_at IS NULL AND next_attempt_at <= clock_timestamp()
      AND (locked_until IS NULL OR locked_until < clock_timestamp())
      ORDER BY next_attempt_at FOR UPDATE SKIP LOCKED LIMIT 1
    ) UPDATE oddestack_inquiry_notifications AS n
      SET lease_token=$1, locked_until=clock_timestamp()+interval '60 seconds', attempts=n.attempts+1
      FROM candidate WHERE n.inquiry_id=candidate.inquiry_id RETURNING n.inquiry_id,n.attempts`,
      [lease],
    );
    const job = claim.rows[0];
    if (!job) break;
    const record = await db.query<{
      id: string;
      created_at: Date;
      payload: Inquiry;
    }>("SELECT id,created_at,payload FROM oddestack_inquiries WHERE id=$1", [
      job.inquiry_id,
    ]);
    if (!record.rows[0]) continue;
    try {
      const row = record.rows[0];
      await deliver({
        id: row.id,
        createdAt: row.created_at.toISOString(),
        inquiry: row.payload,
      });
      await db.query(
        "UPDATE oddestack_inquiry_notifications SET delivered_at=clock_timestamp(), locked_until=NULL,lease_token=NULL,last_error=NULL WHERE inquiry_id=$1 AND lease_token=$2",
        [job.inquiry_id, lease],
      );
      delivered++;
    } catch {
      const delay = Math.min(3600, 30 * 2 ** Math.min(job.attempts, 7));
      await db.query(
        "UPDATE oddestack_inquiry_notifications SET next_attempt_at=clock_timestamp()+($3 * interval '1 second'),locked_until=NULL,lease_token=NULL,last_error='Delivery failed; retry scheduled' WHERE inquiry_id=$1 AND lease_token=$2",
        [job.inquiry_id, lease, delay],
      );
      failed++;
    }
  }
  return { delivered, failed };
}
