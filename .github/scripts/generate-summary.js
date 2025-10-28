const fs = require('fs');

/**
 * Generate CI Summary with test results and coverage information
 */
function generateSummary() {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  const testOutcome = process.env.TEST_OUTCOME;

  // Header
  fs.appendFileSync(summaryPath, '# 📊 Test & Coverage Report\n\n');

  // Tests section
  const testsPassed = (testOutcome === 'success');
  const testIcon = testsPassed ? '✅' : '❌';
  const testStatus = testsPassed ? 'Passed' : 'Failed';

  // Read test results JSON
  const testResultsFile = 'coverage/proyectoFinal/test-results.json';
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

    fs.appendFileSync(summaryPath, `## ${testIcon} Tests: ${testStatus}\n\n`);
    fs.appendFileSync(summaryPath, `**Total:** ${totalTests} | `);
    fs.appendFileSync(summaryPath, `**Passed:** ✅ ${passedTests} | `);
    fs.appendFileSync(summaryPath, `**Failed:** ❌ ${failedTests} | `);
    fs.appendFileSync(summaryPath, `**Skipped:** ⏭️ ${skippedTests}\n\n`);

    // Show individual test results in a table
    if (testDetails.result) {
      fs.appendFileSync(summaryPath, '### 📋 Test Details\n\n');

      // Create table header
      fs.appendFileSync(summaryPath, '| Suite | Test | Status | Time |\n');
      fs.appendFileSync(summaryPath, '|-------|------|--------|------|\n');

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
        let testIcon;
        if (test.success) {
          testIcon = '✅';
        } else if (test.skipped) {
          testIcon = '⏭️';
        } else {
          testIcon = '❌';
        }
        const testName = test.description || 'Unknown test';
        const duration = test.time ? `${test.time}ms` : '-';

        fs.appendFileSync(summaryPath, `| ${suiteName} | ${testName} | ${testIcon} | ${duration} |\n`);
      }

      fs.appendFileSync(summaryPath, '\n');

      // Show error details for failed tests (if any)
      const failedTests = allTests.filter(t => !t.success && !t.skipped);
      if (failedTests.length > 0) {
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
    }
  } else {
    fs.appendFileSync(summaryPath, `## ${testIcon} Tests: ${testStatus}\n\n`);
    fs.appendFileSync(summaryPath, `_Test details not available_\n\n`);
  }

  // Coverage section
  const covFile = 'coverage/proyectoFinal/lcov.info';
  if (fs.existsSync(covFile)) {
    const s = fs.readFileSync(covFile, 'utf8');

    // Parse all metrics from lcov.info
    let totalLines = 0, hitLines = 0;
    let totalFunctions = 0, hitFunctions = 0;
    let totalBranches = 0, hitBranches = 0;

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
    const overallPct = Number.parseFloat(linesPct);
    let coverageIcon;
    if (overallPct >= 80) {
      coverageIcon = '🟢';
    } else if (overallPct >= 60) {
      coverageIcon = '🟡';
    } else {
      coverageIcon = '🔴';
    }

    fs.appendFileSync(summaryPath, `## ${coverageIcon} Code Coverage: ${linesPct}%\n\n`);
    fs.appendFileSync(summaryPath, '| Metric | Coverage | Covered | Total |\n');
    fs.appendFileSync(summaryPath, '|--------|----------|---------|-------|\n');
    fs.appendFileSync(summaryPath, `| **Lines** | ${linesPct}% | ${hitLines} | ${totalLines} |\n`);
    fs.appendFileSync(summaryPath, `| **Functions** | ${funcsPct}% | ${hitFunctions} | ${totalFunctions} |\n`);
    fs.appendFileSync(summaryPath, `| **Branches** | ${branchesPct}% | ${hitBranches} | ${totalBranches} |\n`);
    fs.appendFileSync(summaryPath, '\n');

    // Coverage bar with elegant styling
    fs.appendFileSync(summaryPath, `### 📈 Coverage Progress\n\n`);

    // Choose emoji based on coverage percentage
    let statusEmoji;
    if (overallPct >= 80) {
      statusEmoji = '🎉';
    } else if (overallPct >= 60) {
      statusEmoji = '👍';
    } else if (overallPct >= 40) {
      statusEmoji = '⚠️';
    } else {
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

    fs.appendFileSync(summaryPath, `<table><tr><td>\n\n`);
    fs.appendFileSync(summaryPath, `${statusEmoji} **${linesPct}%** Lines Covered\n\n`);
    fs.appendFileSync(summaryPath, '```\n');
    fs.appendFileSync(summaryPath, `${visualBar}\n`);
    fs.appendFileSync(summaryPath, '```\n\n');
    fs.appendFileSync(summaryPath, `</td></tr></table>\n\n`);
  } else {
    fs.appendFileSync(summaryPath, `## ❌ Coverage Report Not Found\n\n`);
    fs.appendFileSync(summaryPath, `Could not find coverage file at: \`${covFile}\`\n\n`);
  }

  console.log('✅ Summary generated successfully');
}

// Execute the function
generateSummary();

