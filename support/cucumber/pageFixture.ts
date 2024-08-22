import { Page } from "@playwright/test";
import { Logger } from "winston";

export const fixture = {
  page: undefined as unknown as Page,
  logger: undefined as unknown as Logger,
};
