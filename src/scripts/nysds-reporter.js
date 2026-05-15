// src/scripts/nysds-reporter.js

// --- Mode detection ---
function getMode() {
  const env = process.env.NYSDS_TEST_OUTPUT;
  if (env === 'compact') return 'compact';
  if (env === 'ai') return 'ai';
  return 'default';
}

// --- Color utilities ---
// Respect NO_COLOR convention: https://no-color.org/
function useColor() {
  return !process.env.NO_COLOR && getMode() !== 'ai';
}

const NYSDS_BLUE = '\x1b[38;2;36;95;194m'; // #245FC2
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const DIM = '\x1b[90m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';
const YELLOW = '\x1b[33m';

function c(text, color) {
  if (!useColor()) return text;
  return `${color}${text}${RESET}`;
}

// --- Logo ---
const LOGO_LINES = [
  '             ↗↗↗↗↗↗↗↗↗↗↗↗↗↗             ',
  '         ↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗         ',
  '       ↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗       ',
  '     ↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗     ',
  '   ↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗   ',
  '  ↗↗↗↗↗↗↗                      ↗↗↗↗↗↗↗  ',
  ' ↗↗↗↗↗↗↗↗                      ↗↗↗↗↗↗↗↗ ',
  '↗↗↗↗↗↗↗↗↗                      ↗↗↗↗↗↗↗↗↗',
  '↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗          ↗↗↗↗↗↗↗↗↗',
  '↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗            ↗↗↗↗↗↗↗↗↗',
  '↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗      ↗↗     ↗↗↗↗↗↗↗↗↗',
  '↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗      ↗↗↗↗     ↗↗↗↗↗↗↗↗↗',
  '↗↗↗↗↗↗↗↗↗↗↗↗↗↗       ↗↗↗↗↗     ↗↗↗↗↗↗↗↗↗',
  '↗↗↗↗↗↗↗↗↗↗↗↗       ↗↗↗↗↗↗↗     ↗↗↗↗↗↗↗↗↗',
  '↗↗↗↗↗↗↗↗↗↗       ↗↗↗↗↗↗↗↗↗     ↗↗↗↗↗↗↗↗↗',
  ' ↗↗↗↗↗↗↗↗      ↗↗↗↗↗↗↗↗↗↗↗     ↗↗↗↗↗↗↗↗ ',
  '  ↗↗↗↗↗      ↗↗↗↗↗↗↗↗↗↗↗↗↗     ↗↗↗↗↗↗↗  ',
  '   ↗↗       ↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗   ',
  '          ↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗     ',
  '        ↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗       ',
  '         ↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗↗         ',
  '             ↗↗↗↗↗↗↗↗↗↗↗↗↗↗             ',
];

function renderLogo() {
  return LOGO_LINES.map(line => c(line, NYSDS_BLUE));
}

// --- Package name extraction ---
function getPackageName(testFile) {
  const match = testFile.match(/packages\/([^/]+)\//);
  return match ? match[1] : testFile;
}

// --- Recursive test result counting ---
function countResults(suiteResult) {
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  const failures = [];

  function walk(suite) {
    for (const test of suite.tests) {
      if (test.skipped) {
        skipped++;
      } else if (test.passed) {
        passed++;
      } else {
        failed++;
        failures.push({
          name: test.name,
          error: test.error,
        });
      }
    }
    for (const child of suite.suites) {
      walk(child);
    }
  }

  walk(suiteResult);
  return { passed, failed, skipped, failures };
}

function walkDuration(suiteResult) {
  let total = 0;
  function walk(suite) {
    for (const test of suite.tests) {
      total += test.duration || 0;
    }
    for (const child of suite.suites) {
      walk(child);
    }
  }
  walk(suiteResult);
  return total;
}

// --- Reporter factory ---
export function nysdsReporter() {
  const mode = getMode();
  let startTime;
  let testFiles = [];
  let browserNames = [];
  const packageResults = new Map();

  return {
    start(args) {
      startTime = args.startTime;
      testFiles = args.testFiles;
      browserNames = args.browserNames;
    },

    reportTestFileResults({ logger, testFile, sessionsForTestFile }) {
      const pkg = getPackageName(testFile);

      // Aggregate results across all browser sessions for this file.
      // A test file runs once per browser (6 browsers = 6 sessions).
      // We use the first session with testResults for counts (tests are
      // the same across browsers), but check all sessions for failures.
      let passed = 0;
      let failed = 0;
      let skipped = 0;
      let duration = 0;
      const failures = [];

      for (const session of sessionsForTestFile) {
        if (!session.testResults) continue;
        const counts = countResults(session.testResults);
        // Use the max counts across browsers (they should be equal
        // for pass/skip, but a test might fail in only one browser).
        passed = Math.max(passed, counts.passed);
        failed = Math.max(failed, counts.failed);
        skipped = Math.max(skipped, counts.skipped);

        // Collect unique failures across browsers
        for (const f of counts.failures) {
          if (!failures.some(existing => existing.name === f.name)) {
            failures.push(f);
          }
        }
      }

      // Calculate duration from session timing
      for (const session of sessionsForTestFile) {
        if (session.testResults) {
          const sessionDuration = walkDuration(session.testResults);
          duration = Math.max(duration, sessionDuration);
        }
      }

      // If this package already has results (shouldn't happen with one
      // test file per package, but guard against it), merge them.
      if (packageResults.has(pkg)) {
        const existing = packageResults.get(pkg);
        existing.passed += passed;
        existing.failed += failed;
        existing.skipped += skipped;
        existing.duration += duration;
        existing.failures.push(...failures);
      } else {
        packageResults.set(pkg, { passed, failed, skipped, duration, failures });
      }

      // Log failure details to the buffered logger so they appear
      // above the progress area and persist (not cleared on re-render).
      if (failures.length > 0) {
        logger.log('');
        logger.log(c(`  ${pkg}`, `${BOLD}${RED}`) + ' failures:');
        for (const f of failures) {
          const msg = f.error?.message || 'Unknown error';
          logger.log(c(`    ✗ ${f.name}`, RED));
          logger.log(c(`      ${msg}`, DIM));
        }
        logger.log('');
      }
    },

    getTestProgress({ sessions, testRun, focusedTestFile, testCoverage }) {
      // TODO: Task 4 — render branded output
      return [];
    },
  };
}
