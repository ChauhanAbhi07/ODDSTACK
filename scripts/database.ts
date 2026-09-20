import { loadEnvConfig } from "@next/env";
import { readFile } from "node:fs/promises";
import { database, closeDatabase } from "../src/lib/inquiries/postgres";
import {
  deliverPending,
  notificationDelivery,
} from "../src/lib/inquiries/notifications";

loadEnvConfig(process.cwd());
async function main() {
  const command = process.argv[2];
  if (command === "migrate") {
    await database().query(
      await readFile("database/001-inquiries.sql", "utf8"),
    );
    console.log("Enquiry database migration complete.");
  } else if (command === "notify") {
    console.log(JSON.stringify(await deliverPending(notificationDelivery())));
  } else if (command === "status") {
    const result = await database().query(
      "SELECT count(*)::int AS stored FROM oddestack_inquiries",
    );
    const pending = await database().query(
      "SELECT count(*)::int AS pending FROM oddestack_inquiry_notifications WHERE delivered_at IS NULL",
    );
    console.log(JSON.stringify({ ...result.rows[0], ...pending.rows[0] }));
  } else if (command === "retention") {
    const days = Number(process.env.INQUIRY_RETENTION_DAYS);
    if (!Number.isInteger(days) || days < 1 || days > 3650)
      throw new Error(
        "Set INQUIRY_RETENTION_DAYS to an approved value between 1 and 3650.",
      );
    const result = await database().query(
      "SELECT count(*)::int AS expired FROM oddestack_inquiries WHERE created_at < clock_timestamp()-($1 * interval '1 day')",
      [days],
    );
    console.log(
      JSON.stringify({
        days,
        ...result.rows[0],
        mode: process.argv.includes("--apply") ? "apply" : "dry-run",
      }),
    );
    if (process.argv.includes("--apply")) {
      await database().query(
        "DELETE FROM oddestack_inquiries WHERE created_at < clock_timestamp()-($1 * interval '1 day')",
        [days],
      );
      await database().query(
        "DELETE FROM oddestack_inquiry_limits WHERE window_start < clock_timestamp()-interval '1 day'",
      );
    }
  } else throw new Error("Use migrate, notify, status or retention.");
}
main()
  .catch(() => {
    console.error(
      "Database command failed. Check configuration and connectivity; no credentials or contact details have been logged.",
    );
    process.exitCode = 1;
  })
  .finally(closeDatabase);
