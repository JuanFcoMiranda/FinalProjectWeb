// Script para previsualizar el summary que se mostrará en GitHub Actions
const fs = require('fs');

const testResultsFile = 'coverage/proyectoFinal/test-results.json';
const covFile = 'coverage/proyectoFinal/lcov.info';

let output = '';

// Header
output += '# 📊 Test & Coverage Report\n\n';

// Tests section
const testsPassed = true; // Simular que los tests pasaron
const testIcon = testsPassed ? '✅' : '❌';
const testStatus = testsPassed ? 'Passed' : 'Failed';

// Read test results JSON
let testDetails = null;
if (fs.existsSync(testResultsFile)) {
  try {
    const testResultsContent = fs.readFileSync(testResultsFile, 'utf8');
    testDetails = JSON.parse(testResultsContent);
  } catch (e) {
    console.log('Error parsing test results:', e);
  }
}

// Display test summary
if (testDetails && testDetails.summary) {
  const totalTests = testDetails.summary.success + testDetails.summary.failed + testDetails.summary.skipped;
  const passedTests = testDetails.summary.success || 0;
  const failedTests = testDetails.summary.failed || 0;
  const skippedTests = testDetails.summary.skipped || 0;

  output += `## ${testIcon} Tests: ${testStatus}\n\n`;
  output += `**Total:** ${totalTests} | `;
  output += `**Passed:** ✅ ${passedTests} | `;
  output += `**Failed:** ❌ ${failedTests} | `;
  output += `**Skipped:** ⏭️ ${skippedTests}\n\n`;

  // Show individual test results in a table
  if (testDetails.result) {
    output += '### 📋 Test Details\n\n';

    // Create table header
    output += '| Suite | Test | Status | Time |\n';
    output += '|-------|------|--------|------|\n';

    // Collect all tests
    const allTests = [];
    for (const browserId in testDetails.result) {
      const tests = testDetails.result[browserId];
      for (const test of tests) {
        allTests.push(test);
      }
    }

    // Display tests in table format
    for (const test of allTests) {
      const suiteName = test.suite.join(' > ') || 'Uncategorized';
      const testIcon = test.success ? '✅' : test.skipped ? '⏭️' : '❌';
      const testName = test.description || 'Unknown test';
      const duration = test.time ? `${test.time}ms` : '-';

      output += `| ${suiteName} | ${testName} | ${testIcon} | ${duration} |\n`;
    }

    output += '\n';

    // Show error details for failed tests (if any)
    const failedTests = allTests.filter((t) => !t.success && !t.skipped);
    if (failedTests.length > 0) {
      output += '### ❌ Failed Test Details\n\n';
      for (const test of failedTests) {
        const suiteName = test.suite.join(' > ') || 'Uncategorized';
        const testName = test.description || 'Unknown test';
        output += `#### ${suiteName} > ${testName}\n\n`;
        if (test.log && test.log.length > 0) {
          output += '```\n';
          for (const log of test.log) {
            output += log + '\n';
          }
          output += '```\n\n';
        }
      }
    }
  }
} else {
  output += `## ${testIcon} Tests: ${testStatus}\n\n`;
  output += `_Test details not available_\n\n`;
}

// Coverage section
if (fs.existsSync(covFile)) {
  const s = fs.readFileSync(covFile, 'utf8');

  // Parse all metrics from lcov.info
  let totalLines = 0,
    hitLines = 0;
  let totalFunctions = 0,
    hitFunctions = 0;
  let totalBranches = 0,
    hitBranches = 0;

  const lines = s.split('\n');
  for (const line of lines) {
    if (line.startsWith('LF:')) totalLines += parseInt(line.substring(3));
    else if (line.startsWith('LH:')) hitLines += parseInt(line.substring(3));
    else if (line.startsWith('FNF:')) totalFunctions += parseInt(line.substring(4));
    else if (line.startsWith('FNH:')) hitFunctions += parseInt(line.substring(4));
    else if (line.startsWith('BRF:')) totalBranches += parseInt(line.substring(4));
    else if (line.startsWith('BRH:')) hitBranches += parseInt(line.substring(4));
  }

  // Calculate percentages
  const linesPct = totalLines ? ((hitLines / totalLines) * 100).toFixed(2) : 'N/A';
  const funcsPct = totalFunctions ? ((hitFunctions / totalFunctions) * 100).toFixed(2) : 'N/A';
  const branchesPct = totalBranches ? ((hitBranches / totalBranches) * 100).toFixed(2) : 'N/A';

  // Overall coverage (based on lines)
  const overallPct = parseFloat(linesPct);
  const coverageIcon = overallPct >= 80 ? '🟢' : overallPct >= 60 ? '🟡' : '🔴';

  output += `## ${coverageIcon} Code Coverage: ${linesPct}%\n\n`;
  output += '| Metric | Coverage | Covered | Total |\n';
  output += '|--------|----------|---------|-------|\n';
  output += `| **Lines** | ${linesPct}% | ${hitLines} | ${totalLines} |\n`;
  output += `| **Functions** | ${funcsPct}% | ${hitFunctions} | ${totalFunctions} |\n`;
  output += `| **Branches** | ${branchesPct}% | ${hitBranches} | ${totalBranches} |\n`;
  output += '\n';

  // Coverage bar with elegant styling
  output += `### 📈 Coverage Progress\n\n`;

  // Choose color and emoji based on coverage percentage
  let statusBadge = '';
  let statusEmoji = '';
  if (overallPct >= 80) {
    statusBadge = '![Coverage](https://img.shields.io/badge/coverage-excellent-brightgreen)';
    statusEmoji = '🎉';
  } else if (overallPct >= 60) {
    statusBadge = '![Coverage](https://img.shields.io/badge/coverage-good-yellow)';
    statusEmoji = '👍';
  } else if (overallPct >= 40) {
    statusBadge = '![Coverage](https://img.shields.io/badge/coverage-needs_improvement-orange)';
    statusEmoji = '⚠️';
  } else {
    statusBadge = '![Coverage](https://img.shields.io/badge/coverage-low-red)';
    statusEmoji = '🔴';
  }

  // Create a visual bar using block characters
  const totalBlocks = 30;
  const filledBlocks = Math.round((overallPct / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;

  // Use Unicode block characters for smooth gradient
  const fullBlock = '█';
  const emptyBlock = '░';
  const visualBar = fullBlock.repeat(filledBlocks) + emptyBlock.repeat(emptyBlocks);

  output += `<table><tr><td>\n\n`;
  output += `${statusEmoji} **${linesPct}%** Lines Covered\n\n`;
  output += '```\n';
  output += `${visualBar}\n`;
  output += '```\n\n';
  output += `</td></tr></table>\n\n`;
} else {
  output += `## ❌ Coverage Report Not Found\n\n`;
  output += `Could not find coverage file at: \`${covFile}\`\n\n`;
}

console.log(output);

