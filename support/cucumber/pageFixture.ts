import { Page } from "@playwright/test";
import { Logger } from "winston";

export const pageFixture = {
  page: undefined as unknown as Page,
  logger: undefined as unknown as Logger,
};
