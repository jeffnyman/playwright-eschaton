import { ensureDirSync, emptyDirSync } from "fs-extra";

try {
  ensureDirSync("results");
  emptyDirSync("results");
} catch (error) {
  console.log(`Results folder not created. ${error}`);
}
