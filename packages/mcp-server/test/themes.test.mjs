/**
 * Theme drift tests: tokens.css is the source of truth for agency themes.
 * Fails when a theme or a themed value in tokens.css is missing from the
 * MCP tool output, or when the themes guide names a token or selector that
 * tokens.css doesn't define.
 *
 * Run after building @nysds/tokens and this package: npm test -w @nysds/mcp-server
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
const TOKENS_CSS = resolve(here, "../../tokens/dist/tokens.css");

const css = readFileSync(TOKENS_CSS, "utf-8");

/** `--name: value;` declarations inside one CSS block body */
function declarations(body) {
  return Object.fromEntries(
    [...body.matchAll(/(--nys-[\w-]+):\s*([^;]+);/g)].map((m) => [
      m[1],
      m[2].trim(),
    ]),
  );
}

/** theme -> { selectors, values } for every [data-theme] block in tokens.css */
const cssThemes = new Map(
  [
    ...css.matchAll(/((?:[^{}]*\[data-theme="[\w-]+"\][^{}]*))\{([^}]*)\}/g),
  ].map((m) => {
    const selectors = m[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const name = m[1].match(/\[data-theme="([\w-]+)"\]/)[1];
    return [name, { selectors, values: declarations(m[2]) }];
  }),
);

/** Every custom property tokens.css defines, in any block */
const definedVariables = new Set(
  [...css.matchAll(/(--nys-[\w-]+):/g)].map((m) => m[1]),
);

/** :root values of the variables the themes override */
const rootValues = declarations(css.match(/:root\s*\{([^}]*)\}/)[1]);
const themedVariables = [
  ...new Set([...cssThemes.values()].flatMap((t) => Object.keys(t.values))),
];

let client;

before(async () => {
  client = new Client({ name: "themes-test", version: "1.0.0" });
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

async function callJson(name, args) {
  const result = await client.callTool({ name, arguments: args });
  assert.ok(
    !result.isError,
    `${name} returned an error: ${result.content[0].text}`,
  );
  return JSON.parse(result.content[0].text);
}

test("tokens.css defines agency themes", () => {
  assert.ok(cssThemes.size > 0, "no [data-theme] blocks found in tokens.css");
  assert.ok(themedVariables.length > 0, "theme blocks override no variables");
});

test("get_token returns every tokens.css theme value for each themed token", async () => {
  for (const variable of themedVariables) {
    const token = await callJson("get_token", { token: variable });
    assert.equal(token.themed, true, `${variable} is not marked themed`);
    assert.equal(
      token.themes?.default?.cssValue,
      rootValues[variable],
      `${variable}: default value differs from :root`,
    );
    for (const [theme, { values }] of cssThemes) {
      if (!(variable in values)) continue;
      assert.equal(
        token.themes?.[theme]?.cssValue,
        values[variable],
        `${variable}: ${theme} value missing or differs from tokens.css`,
      );
      assert.ok(
        token.themes[theme].resolvedValue,
        `${variable}: ${theme} has no resolved value`,
      );
    }
  }
});

test("theme selectors in the tool output match tokens.css", async () => {
  const resource = await client.readResource({ uri: "nysds://tokens" });
  const { themes } = JSON.parse(resource.contents[0].text);
  const served = new Map(themes.map((t) => [t.name, t.selectors]));

  for (const [theme, { selectors }] of cssThemes) {
    assert.deepEqual(
      served.get(theme),
      selectors,
      `theme ${theme}: selectors differ`,
    );
  }
  for (const name of served.keys()) {
    if (name === "default") continue;
    assert.ok(
      cssThemes.has(name),
      `tool output lists theme ${name}, which tokens.css doesn't define`,
    );
  }
});

test("find_tokens returns each theme's values in one call", async () => {
  for (const theme of cssThemes.keys()) {
    const { results } = await callJson("find_tokens", { query: theme });
    for (const variable of Object.keys(cssThemes.get(theme).values)) {
      const hit = results.find((r) => r.cssVariable === variable);
      assert.ok(hit, `find_tokens("${theme}") is missing ${variable}`);
      assert.equal(
        hit.themes?.[theme]?.cssValue,
        cssThemes.get(theme).values[variable],
      );
    }
  }
});

test("themes guide only names tokens and selectors tokens.css defines", async () => {
  const guide = (
    await client.callTool({ name: "get_guide", arguments: { topic: "themes" } })
  ).content[0].text;

  for (const [variable] of guide.matchAll(/--nys-[\w-]*\w/g)) {
    if (variable === "--nys-color") continue; // "`--nys-color-` prefix omitted" note
    assert.ok(
      definedVariables.has(variable),
      `guide names ${variable}, which tokens.css doesn't define`,
    );
  }

  for (const [, attribute] of guide.matchAll(/\b(data-[\w-]*theme[\w-]*)\b/g)) {
    assert.equal(
      attribute,
      "data-theme",
      `guide uses attribute ${attribute}; tokens.css uses data-theme`,
    );
  }
  for (const [, theme] of guide.matchAll(/data-theme="([\w-]+)"/g)) {
    assert.ok(
      cssThemes.has(theme),
      `guide applies data-theme="${theme}", which tokens.css doesn't define`,
    );
  }
  for (const [, theme] of guide.matchAll(/\bnys-theme-([\w-]+)/g)) {
    assert.ok(
      cssThemes.has(theme),
      `guide uses .nys-theme-${theme}, which tokens.css doesn't define`,
    );
  }

  for (const variable of themedVariables) {
    assert.ok(
      guide.includes(`\`${variable}\``),
      `guide doesn't list ${variable}`,
    );
  }
});
