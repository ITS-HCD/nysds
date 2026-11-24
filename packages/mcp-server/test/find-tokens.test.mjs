/**
 * find_tokens filter tests: the default include ("recommended") drops color
 * primitives, and the response must say how many matches it hid (issue #2053).
 *
 * Run after building @nysds/tokens and this package: npm test -w @nysds/mcp-server
 */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const here = dirname(fileURLToPath(import.meta.url));
const SERVER = resolve(here, "../dist/index.js");

let client;

before(async () => {
  client = new Client({ name: "find-tokens-test", version: "1.0.0" });
  await client.connect(
    new StdioClientTransport({
      command: process.execPath,
      args: [SERVER],
      stderr: "ignore",
    }),
  );
});

after(async () => {
  await client?.close();
});

async function findTokens(args) {
  const result = await client.callTool({ name: "find_tokens", arguments: args });
  assert.ok(!result.isError, `find_tokens errored: ${result.content[0].text}`);
  return JSON.parse(result.content[0].text);
}

test("default filter reports the color primitives it hid", async () => {
  const all = await findTokens({ query: "blue", include: "all" });
  const primitives = all.results.filter((r) =>
    /^--nys-color-blue-\d+$/.test(r.cssVariable),
  );
  assert.ok(primitives.length > 0, "no blue palette primitives exist");

  const def = await findTokens({ query: "blue" });
  assert.equal(def.count, all.count - def.hidden?.colorPrimitives);
  assert.ok(def.hidden?.colorPrimitives >= primitives.length);
  assert.match(def.hidden.hint, /include: "all"/);
});

test("no hidden note when the filter hid nothing", async () => {
  for (const args of [
    { query: "blue", include: "all" },
    { query: "blue", include: "primitive" },
    { query: "space" },
    { category: "space" },
  ]) {
    const res = await findTokens(args);
    assert.equal(res.hidden, undefined, JSON.stringify(args));
  }
});
