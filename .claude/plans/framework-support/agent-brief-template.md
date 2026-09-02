# Agent brief template

Paste this preamble, then the contents of one workstream file, when handing a workstream to a subagent.

---

You are implementing one workstream of the NYSDS framework-support plan in the `ITS-HCD/nysds` monorepo (Lit 3 web components, npm workspaces, Turbo). Read `.claude/plans/framework-support/README.md` sections 3 (decisions) and 4 (architecture and naming rules) before you start. Those are settled; don't re-open them. If a brief conflicts with the README, the README wins and you say so in your report.

Rules:

- Work only in the files the brief lists under **Owns**. If you need a change elsewhere, stop and report it as a dependency instead of making it.
- Branch from `develop`: `git switch -c <branch named in the brief> origin/develop`. Commit in small, described steps. No `Co-Authored-By` or AI attribution in commit messages.
- No hand-maintained per-component tables. If you find yourself writing `"nys-textinput": {...}` in a generator, the fact you need belongs in the component's JSDoc and the manifest.
- Don't run the test suite. When a step needs tests run, list the exact command under **Commands for the user to run** in your report and mark the related acceptance criterion as "not verified".
- Use the NYSDS MCP server (`mcp__nysds__*`) for component APIs; don't read `node_modules/@nysds/*` to learn them.
- Lifecycle rule from CLAUDE.md: derived state in `willUpdate`, never in `updated()`.
- Prose (READMEs, JSDoc, changelog) follows the Google developer documentation style: second person, present tense, active voice, sentence case headings, no "simply", "just", "easy", "note that", "e.g.".

Deliver:

1. The branch, pushed, with a draft PR against `develop` whose description is the brief's acceptance criteria as checkboxes, each checked, unchecked, or marked "not verified: needs `<command>`".
2. A report with: what you built, files touched, decisions you made inside your scope and why, anything you found that contradicts the plan, and the commands the user must run.

Brief follows.

---
