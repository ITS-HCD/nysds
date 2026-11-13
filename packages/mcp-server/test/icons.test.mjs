/**
 * Icon tests: the MCP server lists the built-in NYSDS icon set (from
 * @nysds/nys-icon's manifest) for every icon-name attribute, warns about
 * names outside it, and documents registering another library.
 *
 * Run after building this package: npm test -w @nysds/mcp-server
 */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const here = dirname(fileURLToPath(import.meta.url));
const SERVER = resolve(here, "../dist/index.js");
const ICON_MANIFEST = resolve(here, "../../nys-icon/manifest.json");
const { icons: nysdsIcons } = JSON.parse(readFileSync(ICON_MANIFEST, "utf-8"));

let client;

before(async () => {
  client = new Client({ name: "icons-test", version: "1.0.0" });
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

async function call(name, args) {
  const result = await client.callTool({ name, arguments: args });
  assert.ok(!result.isError, `${name} errored: ${result.content[0].text}`);
  return result.content[0].text;
}

test("get_component lists the NYSDS icon set for icon attributes", async () => {
  const icon = JSON.parse(await call("get_component", { tagName: "nys-icon" }));
  assert.deepEqual(icon.icons?.attributes, ["name"]);
  assert.deepEqual(icon.icons.names, [...nysdsIcons].sort());

  const button = JSON.parse(
    await call("get_component", { tagName: "nys-button" }),
  );
  assert.deepEqual(button.icons?.attributes.sort(), [
    "icon",
    "prefixIcon",
    "suffixIcon",
  ]);

  const toggle = JSON.parse(
    await call("get_component", { tagName: "nys-toggle" }),
  );
  assert.equal(toggle.icons, undefined, "noIcon is a flag, not an icon name");
});

test("nys-icon no longer describes the default library as Material Symbols", async () => {
  const icon = JSON.parse(await call("get_component", { tagName: "nys-icon" }));
  assert.doesNotMatch(icon.description, /Material Symbols\)/);
});

test("validate_component_api warns on icon names outside the NYSDS set", async () => {
  const check = async (tagName, attributes) =>
    JSON.parse(await call("validate_component_api", { tagName, attributes }))
      .warnings;

  assert.equal((await check("nys-icon", { name: "favorite" })).length, 1);
  assert.equal((await check("nys-button", { prefixIcon: "home" })).length, 1);
  assert.deepEqual(await check("nys-icon", { name: nysdsIcons[0] }), []);
  // A registered library resolves its own names.
  assert.deepEqual(
    await check("nys-icon", { name: "favorite", library: "material" }),
    [],
  );
});

test("get_guide icons explains custom libraries and lists every name", async () => {
  const guide = await call("get_guide", { topic: "icons" });
  assert.match(guide, /registerIconLibrary/);
  assert.match(guide, /library="/);
  for (const name of nysdsIcons) {
    assert.ok(guide.includes(`\`${name}\``), `guide is missing ${name}`);
  }
});
