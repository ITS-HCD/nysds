/**
 * SSR smoke test: verifies the NYSDS bundle can be imported in Node.js
 * without crashing on browser-only APIs (window, document, etc.).
 *
 * Run after building: node scripts/test-ssr.mjs
 */

import { fileURLToPath } from "url";
import { resolve, dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const bundlePath = resolve(__dirname, "../dist/nysds.es.js");

try {
  await import(bundlePath);
  console.log("SSR smoke test passed: bundle imported without errors.");
  process.exit(0);
} catch (err) {
  console.error("SSR smoke test FAILED:", err.message);
  process.exit(1);
}
