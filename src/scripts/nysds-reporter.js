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
      // TODO: Task 3 — collect per-package results
    },

    getTestProgress({ sessions, testRun, focusedTestFile, testCoverage }) {
      // TODO: Task 4 — render branded output
      return [];
    },
  };
}
