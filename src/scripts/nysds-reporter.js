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
  '      \u2584\u2584\u2584\u2584      ',
  '   \u2584\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2584   ',
  '  \u2588\u2588\u2588\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2588\u2588  ',
  ' \u2588\u2588\u2588\u2588\u2584\u2584\u2584    \u2588\u2588\u2588 ',
  '\u2590\u2588\u2588\u2588\u2588\u2588\u2580  \u2584  \u2588\u2588\u2588\u258C',
  ' \u2588\u2588\u2588\u2580  \u2584\u2588\u2588  \u2588\u2588\u2588 ',
  ' \u2580\u2580  \u2584\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588  ',
  '    \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2580   ',
  '      \u2580\u2580\u2580\u2580      ',
];

function renderLogo() {
  return LOGO_LINES.map(line => c(line, NYSDS_BLUE));
}

// --- Formatting helpers ---
function formatDuration(ms) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatRow(name, passed, failed, skipped, duration) {
  const icon = failed > 0 ? c('✗', RED) : c('✓', GREEN);
  const nameCol = name.padEnd(24);
  const countParts = [];
  if (passed > 0) countParts.push(c(`${passed} passed`, GREEN));
  if (failed > 0) countParts.push(c(`${failed} failed`, RED));
  if (skipped > 0) countParts.push(c(`${skipped} skipped`, YELLOW));
  const countCol = countParts.join(', ').padEnd(useColor() ? 40 : 20);
  const timeCol = c(formatDuration(duration), DIM);
  return `  ${icon} ${nameCol} ${countCol} ${timeCol}`;
}

// --- Compact mode grouping ---
const COMPACT_GROUPS = [
  { name: 'tokens', match: (pkg) => pkg === 'tokens' },
  { name: 'styles', match: (pkg) => pkg === 'styles' },
  { name: 'components', match: (pkg) => pkg.startsWith('nys-') },
];

function groupResults(packageResults) {
  const groups = COMPACT_GROUPS.map(g => ({
    name: g.name,
    passed: 0,
    failed: 0,
    skipped: 0,
    duration: 0,
    failures: [],
    failedPackages: [],
  }));

  for (const [pkg, r] of packageResults) {
    const groupIndex = COMPACT_GROUPS.findIndex(g => g.match(pkg));
    if (groupIndex === -1) continue;
    const group = groups[groupIndex];
    group.passed += r.passed;
    group.failed += r.failed;
    group.skipped += r.skipped;
    group.duration += r.duration;
    if (r.failed > 0) {
      group.failedPackages.push(pkg);
      group.failures.push(...r.failures);
    }
  }

  return groups.filter(g => g.passed + g.failed + g.skipped > 0);
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
      const lines = [];

      // Logo (default and compact modes only)
      if (mode !== 'ai') {
        lines.push('');
        lines.push(...renderLogo());
        lines.push('');
      }

      // Header
      if (mode === 'ai') {
        lines.push('NYSDS Test Results');
      } else {
        lines.push(c('  @nysds', `${BOLD}${NYSDS_BLUE}`) + c(': Running test suites...', BOLD));
      }
      lines.push('');

      // Determine unique test files (one per package)
      const totalPackages = new Set(testFiles.map(f => getPackageName(f))).size;
      const completedCount = packageResults.size;

      if (mode === 'default') {
        // Default mode: one row per package, sorted alphabetically
        const sorted = [...packageResults.entries()].sort((a, b) => a[0].localeCompare(b[0]));
        for (const [pkg, r] of sorted) {
          lines.push(formatRow(pkg, r.passed, r.failed, r.skipped, r.duration));
        }
      } else if (mode === 'compact') {
        const groups = groupResults(packageResults);
        for (const g of groups) {
          lines.push(formatRow(g.name, g.passed, g.failed, g.skipped, g.duration));
          // If the group has failures, list failing packages indented below
          if (g.failedPackages.length > 0) {
            for (const failedPkg of g.failedPackages) {
              const r = packageResults.get(failedPkg);
              lines.push(`      ${c('↳', DIM)} ${c(failedPkg, RED)}: ${r.failed} failed`);
            }
          }
        }
      } else {
        // AI mode — inline failure details right after the failing package row
        for (const [pkg, r] of [...packageResults.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
          const status = r.failed > 0 ? 'FAIL' : 'PASS';
          const total = r.passed + r.failed + r.skipped;
          lines.push(`${status} ${pkg} ${r.passed}/${total} ${formatDuration(r.duration)}`);
          if (r.failures.length > 0) {
            for (const f of r.failures) {
              const msg = f.error?.message || 'Unknown error';
              lines.push(`  FAIL "${f.name}" — ${msg}`);
            }
          }
        }
      }

      // Progress indicator (while still running)
      if (completedCount < totalPackages) {
        lines.push('');
        if (mode === 'ai') {
          lines.push(`PROGRESS ${completedCount}/${totalPackages} packages`);
        } else {
          lines.push(c(`  Running... ${completedCount}/${totalPackages} packages complete`, DIM));
        }
      }

      // Summary (when all done)
      if (completedCount === totalPackages && completedCount > 0) {
        const totalPassed = [...packageResults.values()].reduce((sum, r) => sum + r.passed, 0);
        const totalFailed = [...packageResults.values()].reduce((sum, r) => sum + r.failed, 0);
        const totalSkipped = [...packageResults.values()].reduce((sum, r) => sum + r.skipped, 0);
        const totalTests = totalPassed + totalFailed + totalSkipped;
        const durationMs = Date.now() - startTime;
        const allPassed = totalFailed === 0;

        if (mode === 'ai') {
          // AI summary (failure details already inline above each FAIL row)
          lines.push(`TOTAL ${completedCount} files, ${totalPassed}/${totalTests} passed, ${formatDuration(durationMs)}, ${browserNames.length} browsers`);
          lines.push(`STATUS ${allPassed ? 'PASS' : 'FAIL'}`);
        } else {
          // Default/compact summary
          lines.push('');
          const passedFiles = [...packageResults.values()].filter(r => r.failed === 0).length;
          const failedFiles = completedCount - passedFiles;

          lines.push(`  ${c('Test Files:', BOLD)}  ${c(`${passedFiles} passed`, GREEN)}${failedFiles > 0 ? `, ${c(`${failedFiles} failed`, RED)}` : ''} (${completedCount})`);
          lines.push(`  ${c('Tests:', BOLD)}      ${c(`${totalPassed} passed`, GREEN)}${totalFailed > 0 ? `, ${c(`${totalFailed} failed`, RED)}` : ''}${totalSkipped > 0 ? `, ${c(`${totalSkipped} skipped`, YELLOW)}` : ''} (${totalTests})`);
          lines.push(`  ${c('Browsers:', BOLD)}   ${browserNames.length}`);
          lines.push(`  ${c('Duration:', BOLD)}   ${formatDuration(durationMs)}`);
          lines.push('');

          if (allPassed) {
            lines.push(`  ${c('✓', GREEN)} ${c('All test suites passed!', `${BOLD}${GREEN}`)}`);
          } else {
            lines.push(`  ${c('✗', RED)} ${c(`${totalFailed} test${totalFailed === 1 ? '' : 's'} failed.`, `${BOLD}${RED}`)}`);
          }
        }
      }

      lines.push('');
      return lines;
    },
  };
}
