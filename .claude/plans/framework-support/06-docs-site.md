# WS6: Docs site (`nysds-site`)

**Goal:** Every component page shows HTML, React, and Angular snippets without anyone authoring the framework versions, and each framework has its own reference pages.
**Depends on:** WS2 (transformer), WS3 and WS4 for the pages to be accurate. The tab UI and filters can start against WS2's fixtures.
**Owns (in `nysds-site`):** `.eleventy.js`, `src/_includes/partials/code-preview.njk`, `src/_data/manifest.js` (new), `src/assets/js/nysds-site.js`, `src/assets/css/nysds-site.css` (code-preview section only), `src/content/pages/get-started/*.md`, `src/content/pages/foundations/components.md`, `src/content/components/**/index.md` (only where an example needs a framework override).
**Branch:** `feat/fw-6-docs` in `nysds-site`, off its `develop` (confirm the site's branching; `main` deploys).

## Findings to build on

- 426 examples across 72 pages, all through `partials/code-preview.njk`, almost all `{% set code = preview %}`.
- `custom-elements.json` is in `node_modules/@nysds/components/` at build time; unused today.
- `showSourceCode`/`copyCode` scope to `.code-preview-container`; a tablist can nest inside.
- Prism via `@11ty/eleventy-plugin-syntaxhighlight`; `jsx` and `typescript` grammars need confirming.
- No framework tab UI exists. `nys-tabgroup` is a documented component but the docs chrome doesn't use it; use it here (dogfooding, and it's accessible already) unless it can't be styled to fit the code-preview chrome, in which case a minimal `role="tablist"` with the same keyboard behavior is acceptable and must be called out as a gap.

## Tasks

### 6.1 Data: expose the manifest to Eleventy

`src/_data/manifest.js`:

```js
const { loadManifest } = require("@nysds/codegen");
module.exports = () => loadManifest(require.resolve("@nysds/components/custom-elements.json"));
```

Add `@nysds/codegen` to the site's `dependencies` at the same version as `@nysds/components`. Keep `copy:assets` as is; the manifest is read from `node_modules`, not copied.

### 6.2 Filters

In `.eleventy.js`:

```js
const { transformExample } = require("@nysds/codegen");
eleventyConfig.addFilter("toReact", (html, opts = {}) => transformExample({ html, framework: "react", manifest, ...opts }));
eleventyConfig.addFilter("toAngular", (html, opts = {}) => transformExample({ html, framework: "angular", manifest, ...opts }));
```

Both return `{ code, language, imports, warnings, unsupported }`. In production builds, log warnings with page and example index; fail the build only on transformer exceptions, never on `unsupported` (those render as a visible fallback).

### 6.3 `code-preview.njk`

New optional inputs: `reactCode`, `angularCode` (hand-written overrides), `frameworks` (default `["html", "react", "angular"]`), `formsMode` (`none` default; component pages for form controls set `template` so Angular snippets show `[(ngModel)]` and React snippets show the controlled pattern).

Behavior:
- When `reactCode` isn't set, compute `code | toReact({ formsMode })`; same for Angular.
- Render a tablist above `.code-preview__code-container`: HTML, React, Angular. One panel per framework, each with its own `.code-preview__code-block`. Prism language per panel: `html`, `jsx`, `html` (Angular templates highlight fine as HTML).
- React and Angular panels show an import line above the snippet built from `result.imports`: `import { NysButton } from "@nysds/react";` and `imports: [NysButtonComponent]`.
- `unsupported: true` → panel shows "This example uses script or markup that has no direct React/Angular equivalent. See the [framework guide](/get-started/react/)." and the copy button is disabled for that panel.
- Persist the chosen tab in `localStorage` (`nysds-docs-framework`) so a reader who picks Angular sees Angular across pages. Wrap in try/catch.
- `copyCode` copies the active panel only. `showSourceCode` unchanged.
- On-page nav already skips headings inside `.code-preview-container`; keep it that way.

### 6.4 Per-framework reference pages

Create under `src/content/pages/get-started/` with `section: Get Started`, `parent: Developers`, and `navOrder`:

- `react.md` → `/get-started/react/`
- `angular.md` → `/get-started/angular/`

Section structure mirrors the package READMEs (WS3/WS4 section "README structure") so the three stay in sync; the site pages are the long form with live previews. Content sources: the package README and the `examples/*` apps. Every snippet on these pages uses `code-preview.njk` with `frameworks` limited to that framework.

Angular page must cover: standalone and NgModule setup, the three forms flavors, group controls, disabled, the two validation modes with `nysControlErrors`, SSR/hydration, zoneless, and a troubleshooting table whose first row is "'nys-button' is not a known element".

React page must cover: install, `"use client"`, controlled/uncontrolled/React Hook Form, refs and imperative methods (`setFiles`, `checkValidity`), Next.js App Router and Pages Router, troubleshooting (`onChange` vs `onNysChange`, duplicate React).

### 6.5 Rewire existing prose

- `developers.md`: replace the `## Framework Guides` React and Angular subsections with two-paragraph summaries linking to the new pages. Remove the "Undergoing Revisions" alert and the `nysds-react-demo` link (or point it at `examples/`). Vue and .NET stay as they are.
- `foundations/components.md` `#framework-integration`: replace "planned but not yet available" with the real state and links.
- Fix the header active-state check (`'Getting Started'` vs `Get Started`) while in there; it's a one-line bug found during investigation.

### 6.6 Component page passes

For each form component page, add `{% set formsMode = "template" %}` before the primary example so the framework tabs show the binding pattern. For examples that the transformer marks `unsupported` (expect: modal open/close scripts, tab/stepper programmatic examples, anything with `<script>`), either supply `reactCode`/`angularCode` inline or accept the fallback. Budget: override the top example on each of the ten form components and on modal, tabs, pagination, and stepper; accept the fallback elsewhere and list them in the PR.

### 6.7 Search

Pagefind currently ignores `.code-preview__preview`. Add `data-pagefind-ignore` to the React and Angular panels too so search results don't triplicate.

## Acceptance criteria

- [ ] Every component page's examples render three tabs; tab choice persists across pages
- [ ] Build log lists transformer warnings by page; zero exceptions
- [ ] `/get-started/react/` and `/get-started/angular/` exist, are in the sidebar under Developers, and follow the shared section structure
- [ ] `developers.md` and `foundations/components.md` agree with the packages' real state
- [ ] Copy button copies only the visible panel; keyboard navigation of tabs works; axe passes on a component page
- [ ] Lighthouse performance on a component page doesn't regress by more than 2 points (the tabs add markup to 426 blocks; check DOM size)

## Commands for the user to run

- In `nysds-site`: `npm i && npm run start`, then open `/components/textinput/` and `/get-started/angular/`
- `npm run build` and grep the log for `[toReact]`/`[toAngular]` warnings
