/**
 * get_component member tests: `members` carries only the public API, and never
 * repeats a field that `attributes` already describes (issue #2052).
 *
 * Run after building this package: npm test -w @nysds/mcp-server
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
  client = new Client({ name: "get-component-test", version: "1.0.0" });
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

async function getComponent(tagName) {
  const result = await client.callTool({
    name: "get_component",
    arguments: { tagName },
  });
  assert.ok(!result.isError, `get_component errored: ${result.content[0].text}`);
  return JSON.parse(result.content[0].text);
}

test("members has no private, protected or deprecated entries", async () => {
  const components = JSON.parse(
    (await client.callTool({ name: "find_components", arguments: {} }))
      .content[0].text,
  );
  for (const { tagName } of components) {
    const component = await getComponent(tagName);
    for (const m of component.members ?? []) {
      const where = `${tagName} member ${m.name}`;
      assert.ok(!/^[_#]/.test(m.name), `${where} is private`);
      assert.ok(
        m.privacy !== "private" && m.privacy !== "protected",
        `${where} is ${m.privacy}`,
      );
      assert.ok(!m.deprecated, `${where} is deprecated`);
      assert.ok(!m.static, `${where} is static`);
    }
    const attributeFields = new Set(
      (component.attributes ?? []).map((a) => a.fieldName ?? a.name),
    );
    for (const m of component.members ?? []) {
      assert.ok(
        !(m.kind === "field" && attributeFields.has(m.name)),
        `${tagName} lists attribute field ${m.name} in members too`,
      );
    }
  }
});

test("public methods stay in members", async () => {
  const { members } = await getComponent("nys-button");
  assert.ok(
    members?.some((m) => m.kind === "method" && m.name === "focus"),
    "nys-button is missing focus()",
  );
});
