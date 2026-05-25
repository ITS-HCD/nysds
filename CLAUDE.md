# Execution brief

Read `.claude/plans/tabgroup-memory-leak.md` and execute it.

If you need additional audit context, read from `~/Sites/nys/nysds-audit/`.

Rules:
- Stay within scope. Do not fix anything not in the plan.
- If you discover the plan is wrong, stop and write findings to 
  `.claude/plans/tabgroup-memory-leak-notes.md` before proceeding.
- Run tests for affected packages before declaring done.
- Update or add tests as the plan specifies.
- If you make any public API change, append it to `BREAKING-CHANGES.md` 
  at the worktree root with: component, change type, before/after, 
  migration path.
- Never commit anything from ~/Sites/nys/nysds-audit/ into this repo. 
  It contains sensitive findings including credentials.

When done, commit with a clear message and stop.
