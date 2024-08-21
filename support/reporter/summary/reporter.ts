import * as fs from "fs";
import * as path from "path";

import {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";

import { Stats, InputTemplate, OutputFile } from "./model";
import convertMillisecondsToMMSS from "./helpers";
import DefaultReport from "./default";

const initialStats = (): Stats => ({
  totalTests: 0,
  totalTestsExecuted: 0,
  expectedPasses: 0,
  unexpectedFailures: 0,
  flakyPasses: 0,
  skippedTests: 0,
  executionDuration: 0,
  totalDuration: 0,
  averageDuration: 0,
  formattedAverageDuration: "",
  formattedExecutionDuration: "",
  failureFree: true,
  failures: {},
  workers: 1,
});

class PlaywrightReportSummary implements Reporter {
  private startTime: number;
  private endTime: number;

  outputFile: OutputFile;
  inputTemplate: InputTemplate;
  stats: Stats;

  constructor(
    options: {
      outputFile?: string;
      inputTemplate?: () => string;
    } = {},
  ) {
    // this.outputFile = options.outputFile as string;
    // this.inputTemplate = options.inputTemplate as InputTemplate;

    const { outputFile, inputTemplate } = options;

    if (outputFile !== undefined) {
      this.outputFile = outputFile;
    }

    if (inputTemplate !== undefined) {
      this.inputTemplate = inputTemplate as InputTemplate;
    }
  }

  onBegin(config: FullConfig, suite: Suite): void {
    this.startTime = Date.now();
    this.stats = initialStats();
    this.stats.totalTests = suite.allTests().length;
    this.stats.workers = config.workers;
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const outcome = test.outcome();
    const { retry } = result;

    if (outcome === "flaky") this.stats.flakyPasses += 1;
    if (outcome === "skipped") this.stats.skippedTests += 1;

    if (outcome === "expected") this.stats.expectedPasses += 1;

    if (outcome === "unexpected") {
      this.stats.failures[test.title] = result.status;

      if (retry === 0) {
        this.stats.unexpectedFailures += 1;
      }
    }

    this.stats.totalTestsExecuted += 1;
    this.stats.executionDuration += result.duration;

    this.stats.failureFree =
      this.stats.unexpectedFailures - this.stats.flakyPasses === 0;
  }

  onEnd(result: FullResult) {
    void result;
    this.endTime = Date.now();

    this.stats.totalDuration = this.endTime - this.startTime;

    this.stats.averageDuration = Math.ceil(
      this.stats.totalDuration / (this.stats.totalTestsExecuted || 1),
    );

    this.stats.formattedAverageDuration = convertMillisecondsToMMSS(
      this.stats.averageDuration,
    );

    this.stats.formattedExecutionDuration = convertMillisecondsToMMSS(
      this.stats.totalDuration,
    );

    outputReport(this.stats, this.inputTemplate, this.outputFile);
  }
}

function outputReport(
  stats: Stats,
  inputTemplate?: (stats: Stats) => string,
  outputFile = "summary.txt",
) {
  let reportString: string;
  const report = new DefaultReport(stats);

  if (typeof inputTemplate === "undefined") {
    reportString = report.templateReport();
  } else {
    reportString = inputTemplate(stats);

    if (typeof reportString !== "string") {
      throw new Error("Custom input templates must return a string.");
    }
  }

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, reportString);
}

export default PlaywrightReportSummary;
