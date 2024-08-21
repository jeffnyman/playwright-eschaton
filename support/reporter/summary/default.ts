import type { Stats } from "./model";

export default class DefaultReport {
  stats: Stats;

  constructor(stats: Stats) {
    this.stats = stats;
  }

  templateReport(): string {
    return `Total Tests in Suite: ${this.stats.totalTests}
Total Tests Completed: ${this.stats.totalTestsExecuted}
Failure free?: ${this.stats.failureFree}
Tests Passed: ${this.stats.expectedPasses}
Tests Failed: ${this.stats.unexpectedFailures}
Flaky Tests: ${this.stats.flakyPasses}
Skipped Tests: ${this.stats.skippedTests}
Total Duration: ${this.stats.totalDuration}
Suite Duration: ${this.stats.executionDuration} - ${this.stats.formattedExecutionDuration}
Average Test Duration: ${this.stats.averageDuration} - ${this.stats.formattedAverageDuration}
Workers Used: ${this.stats.workers}`;
  }
}
