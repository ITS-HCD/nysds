# WS7: MCP server, Storybook, and tooling

**Goal:** Everything that teaches people (or AI assistants) how to use NYSDS knows about the framework packages, and the internal tooling that scaffolds components produces framework-ready output.
**Depends on:** WS2, WS3, WS4.
**Owns:** `packages/mcp-server/**`, `.storybook/**` and `src/scripts/generate-stories.mjs` (docs template only), `plopfile.js` and `plop-templates/**`, the `nysds-dev` plugin agents in `~/Sites/nys/ops-claude-plugins/plugins/nysds-dev/` (separate repo, separate PR).
**Branch:** `feat/fw-7-tooling` (nysds), `feat/framework-agents` (ops-claude-plugins).

## MCP server

### 7.1 Framework guides

`packages/mcp-server/data/guides/frameworks/react.md` and `angular.md` open with "integration is currently untested". Replace both with content generated from the package READMEs. Don't hand-copy: add a build step `npm run sync:guides -w @nysds/mcp-server` that copies `packages/react/README.md` and `packages/angular/README.md` into the guides folder with a generated header, and run it in `build:mcp`. One source, two surfaces.

### 7.2 `get_component` returns framework snippets

For each example on a component (manifest `examples[]` from `cem-plugin-examples`), add `react` and `angular` fields produced by `transformExample` at MCP build time, stored alongside the HTML. Extend the tool's response schema:

```json
{ "examples": [{ "title": "Basic", "html": "...", "react": { "code": "...", "imports": ["NysButton"] }, "angular": { "code": "...", "imports": ["NysButtonComponent"] } }] }
```

Add an optional `framework` parameter to `get_component` (`html` default, `react`, `angular`) that filters to one snippet set and swaps the usage notes for the framework-specific ones (import line, event prop names, forms note when `formControl` is present).

### 7.3 `setup_framework` tool

`mcp-dev.md` mentions a `setup_framework` tool. Confirm it exists; if it does, point its React and Angular branches at the new guides and add the install commands (`npm i @nysds/react @nysds/components @nysds/styles`). If it doesn't, don't add it in this WS; file it.

### 7.4 Resources

Add `nysds://frameworks/react` and `nysds://frameworks/angular` resources mirroring the guides, and list the framework packages in the `nysds://` index resource with their version.

## Storybook

### 7.5 Docs tab per component

Autodocs pages (`generate-stories.mjs` template) get a "Frameworks" section under the primary example showing the React and Angular snippets, generated with `transformExample` from the story's `@example`/`@render` HTML. Static text, no live framework rendering. Keep it to the first example per component to avoid bloating docs pages.

## Component scaffolding

### 7.6 Plop template

`plop-templates/` component class template gets:
- The `@formControl` tag as a prompt: "Is this a form control? (none / value / checked / files)" → emits the tag with `nys-change` and, for `value`, `nys-input`.
- Exported detail interfaces and `Nys<Name>ChangeEvent` aliases in `index.ts`.
- `@fires` lines referencing those aliases.

After scaffolding, `npm run build:all` produces the React and Angular wrappers with no further steps. Document this in `plop-templates/README` or the `nysds-new-component` skill.

### 7.7 Verify script

Hook `src/scripts/verify-form-contract.mjs` (WS1) into `npm run gen` post-step and into the `nysds-preflight` skill's checklist.

## Plugin agents (`ops-claude-plugins`)

### 7.8 Rewrite `react-wrapper.md` and `angular-wrapper.md`

Both are stale. Their new job is not "write a wrapper" (generation does that) but "diagnose and fix wrapper problems":

- Read `.claude/plans/framework-support/README.md` sections 3 and 4 for the rules.
- Check the component's `@formControl` and `@fires` tags first; most wrapper bugs are contract bugs.
- Know where overrides go (`packages/<fw>/src/overrides/`) and when they're justified (never for a missing prop or event; that's a manifest fix).
- Know the smoke tests in `examples/` and how to add a case.

Rename to `react-integration` and `angular-integration` if the team agrees; otherwise keep names and rewrite bodies. Update `nysds-new-component/SKILL.md` step 42 to say "run `npm run build:all`; wrappers are generated" instead of delegating to the wrapper agents. Update `docs-writer.md` to include the `@formControl` tag and typed `@fires` in its JSDoc house style. Update `mcp-dev.md` line 108 for the new guide sync.

Also update the byte-identical copies in `nysds-main/.claude/agents/` and other worktrees, or better, delete those copies and rely on the plugin (they're already drifting from the Gemini port).

## Acceptance criteria

- [ ] `npx @modelcontextprotocol/inspector packages/mcp-server/dist/index.js` → `get_component nys-textinput framework=angular` returns an Angular snippet with `formControlName`
- [ ] `get_guide react` and `get_guide angular` return the package README content with no "untested" caveat
- [ ] Storybook docs page for `nys-button` shows React and Angular snippets
- [ ] `npm run gen` with "value" answered produces a component whose wrappers appear after `npm run build:all` with no edits
- [ ] Plugin agents rewritten; `nysds-new-component` skill no longer tells agents to hand-write wrappers

## Commands for the user to run

- `npm run build:all && npm run build:mcp` then the inspector command above
- `npm run storybook` and open a component docs page
