import { createRequire } from "module";
import * as newman from "newman";
import * as dotenv from "dotenv";

dotenv.config();

const require = createRequire(import.meta.url);
const weatherCurrentCollection = require("./weather.current.postman_collection.json");
const weatherForecastCollection = require("./weather.forecast.postman_collection.json");

/**
 * @typedef {Object} EnvVar
 * @property {string} key
 * @property {string} value
 */

const apiContext = [
  /** @type {EnvVar} */
  {
    key: "apiKey",
    value: process.env.WEATHER_API_KEY,
  },
  {
    key: "apiURL",
    value: process.env.WEATHER_API_URL,
  },
];

newman.run(
  {
    collection: weatherCurrentCollection,
    reporters: "cli",
    envVar: apiContext,
  },
  (err) => {
    if (err) throw err;
    console.log("current weather collection run complete");
  },
);

newman.run(
  {
    collection: weatherForecastCollection,
    reporters: "cli",
    envVar: apiContext,
  },
  (err) => {
    if (err) throw err;
    console.log("forecast collection run complete");
  },
);
