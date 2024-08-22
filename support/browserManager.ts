import { chromium, firefox, webkit, LaunchOptions } from "@playwright/test";

const options: LaunchOptions = {
  headless: false,
  slowMo: 0,
};

export const invokeBrowser = () => {
  const browserType = process.env.BROWSER || "chrome";

  switch (browserType) {
    case "chrome":
      return chromium.launch(options);
    case "firefox":
      return firefox.launch(options);
    case "webkit":
      return webkit.launch(options);
    default:
      throw new Error("Set a proper browser for execution.");
  }
};
