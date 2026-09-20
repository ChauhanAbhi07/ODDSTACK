import { access, cp, mkdir } from "node:fs/promises";
await access(".next/standalone/server.js");
await mkdir(".next/standalone/.next", { recursive: true });
await cp(".next/static", ".next/standalone/.next/static", { recursive: true });
try {
  await access("public");
  await cp("public", ".next/standalone/public", { recursive: true });
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
console.log(
  "Standalone application prepared in .next/standalone. Run its server.js with Node.js; keep runtime credentials outside this directory.",
);
