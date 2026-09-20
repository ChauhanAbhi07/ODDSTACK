import http from "node:http";
import { readFile, stat, realpath } from "node:fs/promises";
import path from "node:path";

const manifest = JSON.parse(await readFile(".pages-build/latest.json", "utf8"));
const output = await realpath(manifest.output);
const buildRoot = await realpath(".pages-build");
if (!output.startsWith(buildRoot + path.sep))
  throw new Error("Export must be within .pages-build");
const basePath = manifest.basePath;
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".ico": "image/x-icon",
};
http
  .createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://localhost");
      const pathname = decodeURIComponent(url.pathname);
      if (pathname !== basePath && !pathname.startsWith(basePath + "/"))
        throw new Error("Not found");
      let file = path.resolve(
        output,
        "." + (pathname.slice(basePath.length) || "/"),
      );
      if (file !== output && !file.startsWith(output + path.sep))
        throw new Error("Not found");
      if ((await stat(file)).isDirectory())
        file = path.join(file, "index.html");
      file = await realpath(file);
      if (!file.startsWith(output + path.sep)) throw new Error("Not found");
      response.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
      });
      response.end(await readFile(file));
    } catch {
      response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      response.end(await readFile(path.join(output, "404.html")));
    }
  })
  .listen(4173, "127.0.0.1", () =>
    console.log(`Static preview: http://127.0.0.1:4173${basePath}/`),
  );
