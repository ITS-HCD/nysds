#!/usr/bin/env node
// Tiny static file server with SPA fallback, used to serve Angular
// production builds to Playwright. No dependencies.
//
// Usage: node examples/scripts/serve-static.mjs <dir> <port>

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const [dir, portArg] = process.argv.slice(2);
if (!dir || !portArg) {
  console.error("Usage: node serve-static.mjs <dir> <port>");
  process.exit(1);
}
const root = resolve(dir);
const port = Number(portArg);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json",
};

createServer(async (req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
  // Resolve inside root only.
  let filePath = normalize(join(root, urlPath));
  if (!filePath.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  try {
    if (urlPath.endsWith("/")) filePath = join(filePath, "index.html");
    const body = await readFile(filePath);
    res.writeHead(200, {
      "content-type": MIME[extname(filePath)] ?? "application/octet-stream",
    });
    res.end(body);
  } catch {
    // SPA fallback: serve index.html for unknown paths without extensions.
    try {
      const body = await readFile(join(root, "index.html"));
      res.writeHead(200, { "content-type": MIME[".html"] });
      res.end(body);
    } catch {
      res.writeHead(404).end("Not found");
    }
  }
}).listen(port, () => {
  console.log(`Serving ${root} at http://localhost:${port}`);
});
