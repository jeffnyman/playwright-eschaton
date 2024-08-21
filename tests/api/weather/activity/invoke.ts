import { APIRequestContext } from "@playwright/test";

const apiURL = process.env.WEATHER_API_URL;
const apiKey = process.env.WEATHER_API_KEY || "";
const an_authenticated_user = apiKey;

const invoke_get_current_weather = async (
  request: APIRequestContext,
  location?: string,
  apiKey?: string,
) => {
  const path = "current.json";
  const url = `${apiURL}/${path}?q=${location}${apiKey ? `&key=${apiKey}` : ""}`;

  return await request.get(url);
};

const invoke_get_forecast = async (
  request: APIRequestContext,
  location?: string,
  days?: number,
  apiKey?: string,
) => {
  const path = "forecast.json";
  const url = `${apiURL}/${path}?q=${location}&days=${days?.toString()}${apiKey ? `&key=${apiKey}` : ""}`;

  return await request.get(url);
};

export {
  an_authenticated_user,
  invoke_get_current_weather,
  invoke_get_forecast,
};
