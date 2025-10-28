const fs = require('node:fs');

// ============================================================================
// CONSTANTS
// ============================================================================

const FILES = {
  TEST_RESULTS: 'coverage/proyectoFinal/test-results.json',
  LCOV_INFO: 'coverage/proyectoFinal/lcov.info',
  COVERAGE_SUMMARY: 'coverage/proyectoFinal/coverage-summary.json'
};

const COMPLEXITY_THRESHOLDS = {
  LOW: 5,
  MEDIUM: 10,
  HIGH: 20
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
 * Get test status icon based on test state
 */
function getTestIcon(test) {
  if (test.success) return '✅';
  if (test.skipped) return '⏭️';
  return '❌';
}

/**
 * Get complexity indicator based on average complexity
 */
function getComplexityIndicator(avgComplexity) {
  if (avgComplexity <= COMPLEXITY_THRESHOLDS.LOW) return '🟢';
  if (avgComplexity <= COMPLEXITY_THRESHOLDS.MEDIUM) return '🟡';
  if (avgComplexity <= COMPLEXITY_THRESHOLDS.HIGH) return '🟠';
  return '🔴';
}

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

/**
 * Extract filename from full path
 */
function getFileName(filePath) {
  return filePath.split('\\').pop() || filePath.split('/').pop() || filePath;
}

// ============================================================================
// DATA READING FUNCTIONS
// ============================================================================

/**
 * Read and parse test results JSON
 */
function readTestResults() {
  if (!fs.existsSync(FILES.TEST_RESULTS)) {
    return null;
  }

  try {
    const content = fs.readFileSync(FILES.TEST_RESULTS, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    console.log('Error parsing test results:', e);
    return null;
  }
}

/**
 * Read and parse coverage summary JSON
 */
function readCoverageSummary() {
  if (!fs.existsSync(FILES.COVERAGE_SUMMARY)) {
    return null;
  }

  try {
    const content = fs.readFileSync(FILES.COVERAGE_SUMMARY, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    console.log('Could not read coverage-summary.json:', e);
    return null;
  }
}

/**
 * Parse LCOV file and extract coverage metrics
 */
function parseLcovFile() {
  if (!fs.existsSync(FILES.LCOV_INFO)) {
    return null;
  }

  const content = fs.readFileSync(FILES.LCOV_INFO, 'utf8');
  const metrics = {
    totalLines: 0,
    hitLines: 0,
    totalFunctions: 0,
    hitFunctions: 0,
    totalBranches: 0,
    hitBranches: 0,
    totalStatements: 0,
    hitStatements: 0
  };

  const lines = content.split('\n');
  for (const line of lines) {
    if (line.startsWith('LF:')) metrics.totalLines += Number.parseInt(line.substring(3));
    else if (line.startsWith('LH:')) metrics.hitLines += Number.parseInt(line.substring(3));
    else if (line.startsWith('FNF:')) metrics.totalFunctions += Number.parseInt(line.substring(4));
    else if (line.startsWith('FNH:')) metrics.hitFunctions += Number.parseInt(line.substring(4));
    else if (line.startsWith('BRF:')) metrics.totalBranches += Number.parseInt(line.substring(4));
    else if (line.startsWith('BRH:')) metrics.hitBranches += Number.parseInt(line.substring(4));
    else if (line.startsWith('DA:')) {
      metrics.totalStatements++;
      const parts = line.substring(3).split(',');
      if (parts.length >= 2 && Number.parseInt(parts[1]) > 0) {
        metrics.hitStatements++;
      }
    }
  }

  return metrics;
}

/**
 * Collect all tests from test results
 */
function collectAllTests(testDetails) {
  const allTests = [];
  if (!testDetails.result) {
    return allTests;
  }

  for (const browserId in testDetails.result) {
    const tests = testDetails.result[browserId];
    for (const test of tests) {
      allTests.push(test);
    }
  }
  return allTests;
}

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate coverage percentages from metrics
 */
function calculateCoveragePercentages(metrics) {
  return {
    linesPct: metrics.totalLines ? ((metrics.hitLines / metrics.totalLines) * 100).toFixed(2) : 'N/A',
    funcsPct: metrics.totalFunctions ? ((metrics.hitFunctions / metrics.totalFunctions) * 100).toFixed(2) : 'N/A',
    branchesPct: metrics.totalBranches ? ((metrics.hitBranches / metrics.totalBranches) * 100).toFixed(2) : 'N/A',
    statementsPct: metrics.totalStatements ? ((metrics.hitStatements / metrics.totalStatements) * 100).toFixed(2) : 'N/A'
  };
}

/**
 * Calculate cyclomatic complexity
 */
function calculateComplexity(metrics) {
  const estimatedComplexity = metrics.totalBranches + metrics.totalFunctions + 1;
  const avgComplexityPerFunction = metrics.totalFunctions > 0
    ? (estimatedComplexity / metrics.totalFunctions).toFixed(2)
    : 'N/A';

  return {
    total: estimatedComplexity,
    average: avgComplexityPerFunction
  };
}

/**
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
  }

  fs.appendFileSync(summaryPath, '### 🔍 Complexity by File\n\n');
  fs.appendFileSync(summaryPath, '| File | Functions | Branches | Est. Complexity | Avg/Function |\n');
  fs.appendFileSync(summaryPath, '|------|-----------|----------|-----------------|---------------|\n');

  for (const filePath in coverageData) {
    if (filePath === 'total') continue;

    const fileData = coverageData[filePath];
    const fileName = getFileName(filePath);
    const complexity = calculateFileComplexity(fileData);

    let complexityIndicator = '';
    if (complexity.functions > 0) {
      const avg = Number.parseFloat(complexity.average);
      complexityIndicator = getComplexityIndicator(avg);
    }

    fs.appendFileSync(summaryPath, `| ${fileName} | ${complexity.functions} | ${complexity.branches} | ${complexityIndicator} ${complexity.total} | ${complexity.average} |\n`);
  }

  fs.appendFileSync(summaryPath, '\n');
  fs.appendFileSync(summaryPath, '> 🟢 Low (≤5) | 🟡 Medium (6-10) | 🟠 High (11-20) | 🔴 Very High (>20)\n\n');
}

/**
 * Generate coverage progress bar
 */
function generateCoverageProgressBar(summaryPath, percentages) {
  const overallPct = Number.parseFloat(percentages.linesPct);
  const statusEmoji = getStatusEmoji(overallPct);

  fs.appendFileSync(summaryPath, `### 📈 Coverage Progress\n\n`);

  // Create visual bar
  const totalBlocks = 30;
  const filledBlocks = Math.round((overallPct / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;

  const fullBlock = '█';
  const emptyBlock = '░';
  const visualBar = fullBlock.repeat(filledBlocks) + emptyBlock.repeat(emptyBlocks);

  fs.appendFileSync(summaryPath, `<table><tr><td>\n\n`);
  fs.appendFileSync(summaryPath, `${statusEmoji} **${percentages.linesPct}%** Lines Covered\n\n`);
  fs.appendFileSync(summaryPath, '```\n');
  fs.appendFileSync(summaryPath, `${visualBar}\n`);
  fs.appendFileSync(summaryPath, '```\n\n');
  fs.appendFileSync(summaryPath, `</td></tr></table>\n\n`);
}

/**
 * Generate coverage not found message
 */
function generateCoverageNotFound(summaryPath) {
  fs.appendFileSync(summaryPath, `## ❌ Coverage Report Not Found\n\n`);
  fs.appendFileSync(summaryPath, `Could not find coverage file at: \`${FILES.LCOV_INFO}\`\n\n`);
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

/**
 * Generate complete CI Summary with test results and coverage information
 */
function generateSummary() {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  const testOutcome = process.env.TEST_OUTCOME;

  // Generate header
  generateHeader(summaryPath);

  // Read and process test results
  const testDetails = readTestResults();
  generateTestSummary(summaryPath, testOutcome, testDetails);
  generateTestDetailsTable(summaryPath, testDetails);
  generateFailedTestDetails(summaryPath, testDetails);

  // Read and process coverage data
  const metrics = parseLcovFile();
  if (metrics) {
    const percentages = calculateCoveragePercentages(metrics);
    const complexity = calculateComplexity(metrics);

    generateCoverageMetricsTable(summaryPath, metrics, percentages, complexity);
    generateComplexityByFileTable(summaryPath);
    generateCoverageProgressBar(summaryPath, percentages);
  } else {
    generateCoverageNotFound(summaryPath);
  }

  console.log('✅ Summary generated successfully');
}

// ============================================================================
// EXECUTION
// ============================================================================

generateSummary();

