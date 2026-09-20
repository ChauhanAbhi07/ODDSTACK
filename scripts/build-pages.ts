import {
  cp,
  mkdir,
  mkdtemp,
  symlink,
  writeFile,
  readdir,
} from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { caseStudies } from "../src/data/case-studies";
import { articles } from "../src/data/articles";

async function main() {
  const root = process.cwd();
  const buildRoot = path.join(root, ".pages-build");
  await mkdir(buildRoot, { recursive: true });
  // Build a fresh isolated source tree. Never copy private environment files or enquiries.
  const stage = await mkdtemp(path.join(buildRoot, "site-"));
  const omitted = ["src/app/api"];
  if (!caseStudies.some((item) => item.status === "published"))
    omitted.push("src/app/work/[slug]");
  if (!articles.some((item) => item.status === "published"))
    omitted.push("src/app/insights/[slug]");
  for (const file of [
    "src",
    "next.config.ts",
    "tsconfig.json",
    "package.json",
    "package-lock.json",
    "postcss.config.mjs",
  ]) {
    await cp(path.join(root, file), path.join(stage, file), {
      recursive: true,
      filter: (source) => {
        const relative = path.relative(root, source).split(path.sep).join("/");
        return !omitted.some(
          (item) => relative === item || relative.startsWith(item + "/"),
        );
      },
    });
  }
  await cp(path.join(root, "public"), path.join(stage, "public"), {
    recursive: true,
  }).catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
  await symlink(
    path.join(root, "node_modules"),
    path.join(stage, "node_modules"),
    "junction",
  );
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://chauhanabhi07.github.io/ODDSTACK";
  const siteUrl = new URL(origin);
  const basePath = siteUrl.pathname.replace(/\/$/, "");
  const result = spawnSync(
    process.execPath,
    [path.join(root, "node_modules/next/dist/bin/next"), "build", "--webpack"],
    {
      cwd: stage,
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_ENV: "production",
        CONTENT_MODE: "public",
        NEXT_PUBLIC_STATIC_SITE: "true",
        NEXT_PUBLIC_BASE_PATH: basePath,
        NEXT_PUBLIC_SITE_URL: siteUrl.href.replace(/\/$/, ""),
        NEXT_PUBLIC_CONTACT_EMAIL:
          process.env.NEXT_PUBLIC_CONTACT_EMAIL || "iamabhishekk2003@gmail.com",
        INQUIRY_STORAGE_DRIVER: "disabled",
        // Ensure one copy of React/Next when building from the isolated source tree.
        NEXT_TELEMETRY_DISABLED: "1",
      },
    },
  );
  if (result.status !== 0) process.exit(result.status || 1);
  const output = path.join(stage, "out");
  await cp(
    path.join(output, "opengraph-image"),
    path.join(output, "opengraph-image.png"),
  );
  // Next 16.3's Windows exporter leaves backslash-separated RSC segments as
  // directories, while the browser requests dot-separated filenames.
  async function normalizeSegments(directory: string) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await normalizeSegments(file);
      else {
        const parts = path.relative(output, file).split(path.sep);
        const segment = parts.findIndex((part) => part.startsWith("__next."));
        if (segment >= 0 && segment < parts.length - 1) {
          await cp(
            file,
            path.join(
              output,
              ...parts.slice(0, segment),
              parts.slice(segment).join("."),
            ),
          );
        }
      }
    }
  }
  if (process.platform === "win32") await normalizeSegments(output);
  await writeFile(path.join(output, ".nojekyll"), "");
  await writeFile(
    path.join(buildRoot, "latest.json"),
    JSON.stringify({ output, basePath }),
  );
  if (process.env.GITHUB_OUTPUT) {
    const { appendFile } = await import("node:fs/promises");
    await appendFile(process.env.GITHUB_OUTPUT, `path=${output}\n`);
  }
  console.log(`GitHub Pages export ready: ${output}`);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
