// eslint-disable-next-line @typescript-eslint/no-require-imports
const report = require("multiple-cucumber-html-reporter");

report.generate({
  jsonDir: "./results/",
  reportPath: "./results/reports",
  reportName: "Automation Report",
  pageTitle: "Eschaton Test Report",
  metadata: {
    browser: {
      name: "chrome",
      version: "112",
    },
    device: "Local Test Machine",
    platform: {
      name: "Windows",
      version: "11",
    },
  },
  customData: {
    title: "Test Info",
    data: [
      { label: "Project", value: "Eschaton" },
      { label: "Release", value: "0.0.0" },
      { label: "Cycle", value: "Training" },
    ],
  },
});
