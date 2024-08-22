import * as dotenv from "dotenv";

export const getEnv = () => {
  dotenv.config({
    override: true,
    path: `support/env/.env.${process.env.ENV}`,
  });
};
