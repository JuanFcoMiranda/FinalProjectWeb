const fs = require('node:fs');

// ============================================================================
// CONSTANTS - Updated for Vitest
// ============================================================================

const FILES = {
  COVERAGE_SUMMARY: 'coverage/coverage-summary.json',
  LCOV_INFO: 'coverage/lcov.info'
};

const COVERAGE_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  NEEDS_IMPROVEMENT: 40
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get coverage icon based on percentage
 */
function getCoverageIcon(percentage) {
  if (percentage >= COVERAGE_THRESHOLDS.EXCELLENT) return '🟢';
  if (percentage >= COVERAGE_THRESHOLDS.GOOD) return '🟡';
  return '🔴';
}

/**
 * Get status emoji based on coverage percentage
 */
function getStatusEmoji(percentage) {
  if (percentage >= COVERAGE_THRESHOLDS.EXCELLENT) return '🎉';
  if (percentage >= COVERAGE_THRESHOLDS.GOOD) return '👍';
  if (percentage >= COVERAGE_THRESHOLDS.NEEDS_IMPROVEMENT) return '⚠️';
  return '🔴';
}

// ============================================================================
// DATA READING FUNCTIONS
// ============================================================================

/**
 * Read and parse coverage summary JSON (Vitest format)
 */
function readCoverageSummary() {
  if (!fs.existsSync(FILES.COVERAGE_SUMMARY)) {
    console.log('❌ Coverage summary not found at:', FILES.COVERAGE_SUMMARY);
    return null;
  }

  try {
    const content = fs.readFileSync(FILES.COVERAGE_SUMMARY, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    console.log('Error parsing coverage summary:', e);
    return null;
  }
}
 * Calculate file-specific complexity
 */
function calculateFileComplexity(fileData) {
  const fileFunctions = fileData.functions.total;
  const fileBranches = fileData.branches.total;
  const fileComplexity = fileBranches + fileFunctions + 1;
  const fileAvgComplexity = fileFunctions > 0
    ? (fileComplexity / fileFunctions).toFixed(2)
    : 'N/A';

  return {
    functions: fileFunctions,
    branches: fileBranches,
    total: fileComplexity,
    average: fileAvgComplexity
  };
}

// ============================================================================
// REPORT GENERATION FUNCTIONS
// ============================================================================

/**
 * Generate header section
 */
function generateHeader(summaryPath) {
  fs.appendFileSync(summaryPath, '# 📊 Test & Coverage Report\n\n');
}

/**
 * Generate test summary section
 */
function generateTestSummary(summaryPath, testOutcome, testDetails) {
  const testsPassed = (testOutcome === 'success');
  const testIcon = testsPassed ? '✅' : '❌';
  const testStatus = testsPassed ? 'Passed' : 'Failed';

  if (!testDetails || !testDetails.summary) {
    fs.appendFileSync(summaryPath, `## ${testIcon} Tests: ${testStatus}\n\n`);
    fs.appendFileSync(summaryPath, `_Test details not available_\n\n`);
    return;
  }

  const totalTests = testDetails.summary.success + testDetails.summary.failed + testDetails.summary.skipped;
  const passedTests = testDetails.summary.success || 0;
  const failedTests = testDetails.summary.failed || 0;
  const skippedTests = testDetails.summary.skipped || 0;

  fs.appendFileSync(summaryPath, `## ${testIcon} Tests: ${testStatus}\n\n`);
  fs.appendFileSync(summaryPath, `**Total:** ${totalTests} | `);
  fs.appendFileSync(summaryPath, `**Passed:** ✅ ${passedTests} | `);
  fs.appendFileSync(summaryPath, `**Failed:** ❌ ${failedTests} | `);
  fs.appendFileSync(summaryPath, `**Skipped:** ⏭️ ${skippedTests}\n\n`);
}

/**
 * Generate test details table
 */
function generateTestDetailsTable(summaryPath, testDetails) {
  if (!testDetails || !testDetails.result) {
    return;
  }

  fs.appendFileSync(summaryPath, '### 📋 Test Details\n\n');
  fs.appendFileSync(summaryPath, '| Suite | Test | Status | Time |\n');
  fs.appendFileSync(summaryPath, '|-------|------|--------|------|\n');

  const allTests = collectAllTests(testDetails);

  for (const test of allTests) {
    const suiteName = test.suite.join(' > ') || 'Uncategorized';
    const testIcon = getTestIcon(test);
    const testName = test.description || 'Unknown test';
    const duration = test.time ? `${test.time}ms` : '-';

    fs.appendFileSync(summaryPath, `| ${suiteName} | ${testName} | ${testIcon} | ${duration} |\n`);
  }

  fs.appendFileSync(summaryPath, '\n');
}

/**
 * Generate failed test details
 */
function generateFailedTestDetails(summaryPath, testDetails) {
  if (!testDetails || !testDetails.result) {
    return;
  }

  const allTests = collectAllTests(testDetails);
  const failedTests = allTests.filter(t => !t.success && !t.skipped);

  if (failedTests.length === 0) {
    return;
  }

  fs.appendFileSync(summaryPath, '### ❌ Failed Test Details\n\n');

  for (const test of failedTests) {
    const suiteName = test.suite.join(' > ') || 'Uncategorized';
    const testName = test.description || 'Unknown test';
    fs.appendFileSync(summaryPath, `#### ${suiteName} > ${testName}\n\n`);

    if (test.log && test.log.length > 0) {
      fs.appendFileSync(summaryPath, '```\n');
      for (const log of test.log) {
        fs.appendFileSync(summaryPath, log + '\n');
      }
      fs.appendFileSync(summaryPath, '```\n\n');
    }
  }
}

/**
 * Generate coverage metrics table
 */
function generateCoverageMetricsTable(summaryPath, metrics, percentages, complexity) {
  const overallPct = Number.parseFloat(percentages.linesPct);
  const coverageIcon = getCoverageIcon(overallPct);

  fs.appendFileSync(summaryPath, `## ${coverageIcon} Code Coverage: ${percentages.linesPct}%\n\n`);
  fs.appendFileSync(summaryPath, '| Metric | Coverage | Covered | Total |\n');
  fs.appendFileSync(summaryPath, '|--------|----------|---------|-------|\n');
  fs.appendFileSync(summaryPath, `| **Statements** | ${percentages.statementsPct}% | ${metrics.hitStatements} | ${metrics.totalStatements} |\n`);
  fs.appendFileSync(summaryPath, `| **Lines** | ${percentages.linesPct}% | ${metrics.hitLines} | ${metrics.totalLines} |\n`);
  fs.appendFileSync(summaryPath, `| **Functions** | ${percentages.funcsPct}% | ${metrics.hitFunctions} | ${metrics.totalFunctions} |\n`);
  fs.appendFileSync(summaryPath, `| **Branches** | ${percentages.branchesPct}% | ${metrics.hitBranches} | ${metrics.totalBranches} |\n`);
  fs.appendFileSync(summaryPath, `| **Complexity** | ~${complexity.average} | - | ${complexity.total} |\n`);
  fs.appendFileSync(summaryPath, '\n');
  fs.appendFileSync(summaryPath, `> 📊 **Estimated Cyclomatic Complexity:** ${complexity.total} total, ~${complexity.average} avg per function\n\n`);
}

/**
 * Generate complexity by file table
 */
function generateComplexityByFileTable(summaryPath) {
  const coverageData = readCoverageSummary();
  if (!coverageData) {
    return;

// ============================================================================
// SUMMARY GENERATION FUNCTIONS
// ============================================================================

/**
 * Generate header for summary
 */
function generateHeader(summaryPath) {
  const testOutcome = process.env.TEST_OUTCOME || 'unknown';
  const emoji = testOutcome === 'success' ? '✅' : '❌';

  fs.appendFileSync(summaryPath, `# ${emoji} CI/CD Pipeline - Vitest Test Results\n\n`);
  fs.appendFileSync(summaryPath, `**Status:** ${testOutcome}\n`);
  fs.appendFileSync(summaryPath, `**Framework:** Vitest\n`);
  fs.appendFileSync(summaryPath, `**Date:** ${new Date().toISOString()}\n\n`);
  fs.appendFileSync(summaryPath, '---\n\n');
}

/**
 * Generate coverage summary table
 */
function generateCoverageSummary(summaryPath, coverageData) {
  if (!coverageData || !coverageData.total) {
    fs.appendFileSync(summaryPath, `## ❌ Coverage Report Not Available\n\n`);
    fs.appendFileSync(summaryPath, `Coverage data could not be found or parsed.\n\n`);
    return;
  }

  const total = coverageData.total;

  fs.appendFileSync(summaryPath, '## 📊 Coverage Summary\n\n');
  fs.appendFileSync(summaryPath, '| Metric | Coverage | Covered | Total | Status |\n');
  fs.appendFileSync(summaryPath, '|--------|----------|---------|-------|--------|\n');

  const metrics = ['statements', 'branches', 'functions', 'lines'];

  for (const metric of metrics) {
    const data = total[metric];
    const icon = getCoverageIcon(data.pct);
    const capitalizedMetric = metric.charAt(0).toUpperCase() + metric.slice(1);

    fs.appendFileSync(summaryPath,
      `| ${capitalizedMetric} | **${data.pct}%** | ${data.covered} | ${data.total} | ${icon} |\n`
    );
  }

  fs.appendFileSync(summaryPath, '\n');
  fs.appendFileSync(summaryPath, '> 🟢 Excellent (≥80%) | 🟡 Good (≥60%) | 🔴 Needs Improvement (<60%)\n\n');

  // Generate progress bar
  generateCoverageProgressBar(summaryPath, total.lines.pct);
}

/**
 * Generate coverage progress bar
 */
function generateCoverageProgressBar(summaryPath, percentage) {
  const statusEmoji = getStatusEmoji(percentage);

  fs.appendFileSync(summaryPath, `### 📈 Coverage Progress\n\n`);

  // Create visual bar
  const totalBlocks = 30;
  const filledBlocks = Math.round((percentage / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;

  const fullBlock = '█';
  const emptyBlock = '░';
  const visualBar = fullBlock.repeat(filledBlocks) + emptyBlock.repeat(emptyBlocks);

  fs.appendFileSync(summaryPath, `<table><tr><td>\n\n`);
  fs.appendFileSync(summaryPath, `${statusEmoji} **${percentage}%** Lines Covered\n\n`);
  fs.appendFileSync(summaryPath, '```\n');
  fs.appendFileSync(summaryPath, `${visualBar}\n`);
  fs.appendFileSync(summaryPath, '```\n\n');
  fs.appendFileSync(summaryPath, `</td></tr></table>\n\n`);
}

/**
 * Generate file-by-file coverage table
 */
function generateFileCoverageTable(summaryPath, coverageData) {
  if (!coverageData) return;

  fs.appendFileSync(summaryPath, '## 📁 Coverage by File\n\n');
  fs.appendFileSync(summaryPath, '<details>\n');
  fs.appendFileSync(summaryPath, '<summary>Click to expand file coverage details</summary>\n\n');
  fs.appendFileSync(summaryPath, '| File | Statements | Branches | Functions | Lines |\n');
  fs.appendFileSync(summaryPath, '|------|------------|----------|-----------|-------|\n');

  for (const filePath in coverageData) {
    if (filePath === 'total') continue;

    const fileData = coverageData[filePath];
    const fileName = filePath.replace(/^.*[\\\/]/, '').substring(0, 50);

    const stmtIcon = getCoverageIcon(fileData.statements.pct);
    const branchIcon = getCoverageIcon(fileData.branches.pct);
    const funcIcon = getCoverageIcon(fileData.functions.pct);
    const lineIcon = getCoverageIcon(fileData.lines.pct);

    fs.appendFileSync(summaryPath,
      `| ${fileName} | ${stmtIcon} ${fileData.statements.pct}% | ${branchIcon} ${fileData.branches.pct}% | ${funcIcon} ${fileData.functions.pct}% | ${lineIcon} ${fileData.lines.pct}% |\n`
    );
  }

  fs.appendFileSync(summaryPath, '\n</details>\n\n');
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

/**
 * Generate complete CI Summary with Vitest coverage information
 */
function generateSummary() {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;

  if (!summaryPath) {
    console.log('❌ GITHUB_STEP_SUMMARY environment variable not set');
    console.log('This script is meant to run in GitHub Actions');
    return;
  }

  // Generate header
  generateHeader(summaryPath);

  // Read and process coverage data
  const coverageData = readCoverageSummary();

  if (coverageData) {
    generateCoverageSummary(summaryPath, coverageData);
    generateFileCoverageTable(summaryPath, coverageData);

    fs.appendFileSync(summaryPath, '---\n\n');
    fs.appendFileSync(summaryPath, '💡 **Tip:** Run `npm run test:coverage` locally to see detailed coverage reports.\n');
  } else {
    fs.appendFileSync(summaryPath, `## ❌ Coverage Not Available\n\n`);
    fs.appendFileSync(summaryPath, `Coverage file not found at: \`${FILES.COVERAGE_SUMMARY}\`\n\n`);
    fs.appendFileSync(summaryPath, `Make sure to run tests with coverage enabled: \`npm run test:ci\`\n`);
  }

  console.log('✅ Summary generated successfully');
}

// ============================================================================
// EXECUTION
// ============================================================================

generateSummary();

