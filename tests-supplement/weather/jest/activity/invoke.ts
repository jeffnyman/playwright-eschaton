import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import "dotenv/config";

const apiURL = process.env.WEATHER_API_URL;
const apiKey = process.env.WEATHER_API_KEY || "";
const an_authenticated_user = apiKey;

const respondFrom = async (axiosResp: AxiosResponse) => ({
  statusCode: axiosResp.status,
  body: axiosResp.data,
  headers: axiosResp.headers,
});

const generateHttpRequest = async (
  method: string,
  url: string,
  headers: { accept: string },
  data?: unknown,
) => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url,
      headers,
      data,
    };
    const resp = await axios.request(config);

    return await respondFrom(resp);
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      return {
        statusCode: err.response.status,
        headers: err.response.headers,
        body: err.response.data,
      };
    } else {
      return {
        statusCode: 500,
        headers: {},
        body: "An unknown error occurred",
      };
    }
  }
};

const invoke_get_current_weather = async (
  location?: string,
  apiKey?: string,
) => {
  const headers = {
    accept: "application/json",
  };

  const method = "GET";
  const path = "current.json";
  const url = `${apiURL}/${path}?q=${location}${apiKey ? `&key=${apiKey}` : ""}`;

  return generateHttpRequest(method, url, headers);
};

const invoke_get_forecast = async (
  location?: string,
  days?: number,
  apiKey?: string,
) => {
  const headers = {
    accept: "application/json",
  };

  const method = "GET";
  const path = "forecast.json";
  const url = `${apiURL}/${path}?q=${location}&days=${days?.toString()}${apiKey ? `&key=${apiKey}` : ""}`;

  return generateHttpRequest(method, url, headers);
};

export {
  an_authenticated_user,
  invoke_get_current_weather,
  invoke_get_forecast,
};
