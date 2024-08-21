import type { Stats } from "./summary/model";

function conciseReport(stats: Stats) {
  return `TESTING: ${stats.expectedPasses} tests passed in ${stats.formattedExecutionDuration}`;
}

export default conciseReport;
