# NYSDS Custom Test Reporter — Design Spec

## Overview

Replace Web Test Runner's default console output with a branded, color-coded custom reporter that gives developers a polished summary of test results. Three output modes serve different audiences: developers at a terminal, developers wanting a quick glance, and LLMs running tests programmatically.

## Goals

- Branded, visually clear test output for local development
- Per-package pass/fail/duration at a glance
- Compact grouped view for quick scans
- Token-efficient plain-text mode for AI assistants
- Zero impact on CI — this is local dev only

## Non-Goals

- Replacing the default reporter in CI/GitHub Actions
- Custom coverage reporting (LCOV stays as-is)
- Interactive/TUI features (no cursor manipulation or live-updating tables)

## Architecture

### Single file

`src/scripts/nysds-reporter.js` — a plain JS module exporting a factory function that returns a WTR `Reporter` object.

### Integration point

`web-test-runner.config.js` imports and registers the reporter:

```js
import { nysdsReporter } from './src/scripts/nysds-reporter.js';

export default {
  // ...existing config...
  reporters: [nysdsReporter()],
};
```

### Mode selection

Environment variable `NYSDS_TEST_OUTPUT` controls the mode:

| Value | Mode | Description |
|-------|------|-------------|
| _(unset/default)_ | Default | Full logo, all 33 packages listed individually, ANSI colors |
| `compact` | Compact | Full logo, packages grouped into categories, ANSI colors |
| `ai` | AI | No logo, no colors, minimal plain text — one line per package |

## Output Modes

### Default Mode

```
             ↗↗↗↗↗↗↗↗↗↗↗↗↗↗
         ↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗
       ↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗
     ↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗
   ↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗
  ↗↗↗↗↗↗↗                      ↗↗↗↗↗↗↗
 ↗↗↗↗↗↗↗↗                      ↗↗↗↗↗↗↗↗
↗↗↗↗↗↗↗↗↗                      ↗↗↗↗↗↗↗↗↗
↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗          ↗↗↗↗↗↗↗↗↗
↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗            ↗↗↗↗↗↗↗↗↗
↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗      ↗↗     ↗↗↗↗↗↗↗↗↗
↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗      ↗↗↗↗     ↗↗↗↗↗↗↗↗↗
↗↗↗↗↗↗↗↗↗↗↗↗↗↗       ↗↗↗↗↗     ↗↗↗↗↗↗↗↗↗
↗↗↗↗↗↗↗↗↗↗↗↗       ↗↗↗↗↗↗↗     ↗↗↗↗↗↗↗↗↗
↗↗↗↗↗↗↗↗↗↗       ↗↗↗↗↗↗↗↗↗     ↗↗↗↗↗↗↗↗↗
 ↗↗↗↗↗↗↗↗      ↗↗↗↗↗↗↗↗↗↗↗     ↗↗↗↗↗↗↗↗
  ↗↗↗↗↗      ↗↗↗↗↗↗↗↗↗↗↗↗↗     ↗↗↗↗↗↗↗
   ↗↗       ↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗
          ↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗
        ↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗
         ↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗
             ↗↗↗↗↗↗↗↗↗↗↗↗↗↗

  @nysds: Running test suites...

  ✓ nys-accordion            12 passed   0.84s
  ✓ nys-alert                 8 passed   0.62s
  ✓ nys-avatar                5 passed   0.41s
  ✓ nys-backtotop             6 passed   0.38s
  ✓ nys-badge                 4 passed   0.29s
  ✓ nys-breadcrumbs           7 passed   0.51s
  ✓ nys-button               18 passed   1.12s
  ... (all 33 packages) ...

  Test Files:  33 passed (33)
  Tests:      287 passed (287)
  Browsers:   6
  Duration:   42.6s

  ✓ All test suites passed!
```

- Logo rendered in NYSDS blue (`#245FC2`) using 24-bit ANSI escape codes (`\x1b[38;2;36;95;194m`)
- `✓` and pass counts in green (`\x1b[32m`)
- `✗` and fail counts in red (`\x1b[31m`)
- Package names in white/default
- Timing in dim/gray (`\x1b[90m`)
- Columns aligned with right-justified numbers

### Compact Mode

Same logo and color scheme, but packages grouped into categories:

```
             ↗↗↗↗↗↗↗↗↗↗↗↗↗↗
                ... logo ...
             ↗↗↗↗↗↗↗↗↗↗↗↗↗↗

  @nysds: Running test suites...

  ✓ tokens                    4 passed   0.19s
  ✓ styles                    2 passed   0.12s
  ✓ components              281 passed  41.8s

  Test Files:  33 passed (33)
  Tests:      287 passed (287)
  Browsers:   6
  Duration:   42.6s

  ✓ All test suites passed!
```

**Grouping rules:**

| Group | Packages |
|-------|----------|
| `tokens` | `packages/tokens` |
| `styles` | `packages/styles` |
| `components` | All `packages/nys-*` |

If a group has any failures, it shows `✗` and the individual failing packages are listed indented below it.

### AI Mode

```
NYSDS Test Results
PASS nys-accordion 12/12 0.84s
PASS nys-alert 8/8 0.62s
PASS nys-button 18/18 1.12s
...
TOTAL 33 files, 287/287 passed, 42.6s, 6 browsers
STATUS PASS
```

On failure:

```
NYSDS Test Results
PASS nys-accordion 12/12 0.84s
FAIL nys-button 17/18 1.12s
  FAIL "should reflect disabled state" — Expected true, got false
PASS nys-alert 8/8 0.62s
...
TOTAL 33 files, 286/287 passed, 42.6s, 6 browsers
STATUS FAIL
```

- No ANSI escape codes
- No logo or decorative characters
- `PASS`/`FAIL` prefix for grep-ability
- Failure details indented under the failing package (test name + error message)
- Final `STATUS PASS`/`STATUS FAIL` line for easy programmatic check

## Reporter Implementation

### WTR Reporter Interface

The reporter implements these callbacks from `@web/test-runner-core`:

```
Reporter {
  start(args: ReporterArgs)
  reportTestFileResults(args: ReportTestResultsArgs)
  stop(args: StopArgs)
}
```

### Data flow

1. **`start()`** — Print logo (default/compact) or nothing (AI). Record `startTime`. Initialize per-package accumulator.

2. **`reportTestFileResults({ testFile, sessionsForTestFile })`** — Called once per test file, per test run. Extract package name from `testFile` path. Aggregate results across all browser sessions for that file:
   - Count passed/failed/skipped tests from `session.testResults` (recursive walk of `TestSuiteResult`)
   - Sum durations
   - Store any failure details (test name, error message)
   - In default mode: print the package row immediately
   - In compact/AI mode: buffer results

3. **`stop()`** — Print summary. In compact mode: aggregate buffered results into groups and print. In AI mode: print all buffered rows, then summary.

### Package name extraction

```js
function getPackageName(testFile) {
  // testFile: "packages/nys-button/src/nys-button.test.ts"
  const match = testFile.match(/packages\/([^/]+)\//);
  return match ? match[1] : path.basename(testFile);
}
```

### Multi-browser aggregation

WTR runs each test file across 6 browsers, calling `reportTestFileResults` once per file (with `sessionsForTestFile` containing all 6 browser sessions). We aggregate across all sessions — a test is "passed" only if it passed in all browsers.

### Color utilities

```js
const NYSDS_BLUE = '\x1b[38;2;36;95;194m';  // #245FC2
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const DIM = '\x1b[90m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

function useColor() {
  return !process.env.NO_COLOR && process.env.NYSDS_TEST_OUTPUT !== 'ai';
}

function colorize(text, color) {
  if (!useColor()) return text;
  return `${color}${text}${RESET}`;
}
```

## Convenience Scripts

Added to root `package.json`:

```json
{
  "scripts": {
    "test:compact": "NYSDS_TEST_OUTPUT=compact npx playwright install && wtr --node-resolve",
    "test:ai": "NYSDS_TEST_OUTPUT=ai npx playwright install && wtr --node-resolve"
  }
}
```

## File Changes

| File | Change |
|------|--------|
| `src/scripts/nysds-reporter.js` | **New** — Custom WTR reporter |
| `web-test-runner.config.js` | Add `reporters: [nysdsReporter()]` import and config |
| `package.json` | Add `test:compact` and `test:ai` scripts |

## Edge Cases

- **No test files found:** Print logo, then "No test files found." and exit cleanly.
- **All tests skipped:** Show skip count in yellow, treat as pass for the banner.
- **Mixed pass/fail in compact mode:** Group shows `✗`, failing packages listed indented below.
- **Terminal without 24-bit color support:** The `#245FC2` blue degrades gracefully — worst case the logo shows in default terminal color. We do not add a fallback detection layer.
- **`NO_COLOR` env var:** Respect the [NO_COLOR](https://no-color.org/) convention — if set, strip all ANSI codes (equivalent to AI mode visuals but with the logo in plain text).

## Testing the Reporter

Manual verification only — run `npm run test`, `npm run test:compact`, and `npm run test:ai` and visually confirm output. No automated tests for the reporter itself (it's a presentation layer).
