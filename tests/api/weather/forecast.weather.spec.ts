import { test, expect } from "@playwright/test";
import { an_authenticated_user, invoke_get_forecast } from "./activity/invoke";

const location = "Frankfort";
const forecastLength = 2;

test.describe("given an authenticated user", () => {
  test.describe("when invoking the GET forecast endpoint", () => {
    test("a 200 response is received", async ({ request }) => {
      const resp = await invoke_get_forecast(
        request,
        location,
        forecastLength,
        an_authenticated_user,
      );

      expect(resp.status()).toBe(200);
    });

    test("returns the location in the response", async ({ request }) => {
      const resp = await invoke_get_forecast(
        request,
        location,
        forecastLength,
        an_authenticated_user,
      );

      const body = await resp.json();

      expect(body).toBeDefined();
      expect(body.location).toBeDefined();
      expect(body.location.name).toBe("Frankfort");
    });

    test("returns the current weather with expected keys", async ({
      request,
    }) => {
      const resp = await invoke_get_forecast(
        request,
        location,
        forecastLength,
        an_authenticated_user,
      );

      const body = await resp.json();

      expect(body.current).toBeDefined();

      expect(body.current).toEqual({
        cloud: expect.any(Number),
        condition: {
          code: expect.any(Number),
          icon: expect.any(String),
          text: expect.any(String),
        },
        dewpoint_c: expect.any(Number),
        dewpoint_f: expect.any(Number),
        feelslike_c: expect.any(Number),
        feelslike_f: expect.any(Number),
        gust_kph: expect.any(Number),
        gust_mph: expect.any(Number),
        heatindex_c: expect.any(Number),
        heatindex_f: expect.any(Number),
        humidity: expect.any(Number),
        is_day: expect.any(Number),
        last_updated: expect.any(String),
        last_updated_epoch: expect.any(Number),
        precip_in: expect.any(Number),
        precip_mm: expect.any(Number),
        pressure_in: expect.any(Number),
        pressure_mb: expect.any(Number),
        temp_c: expect.any(Number),
        temp_f: expect.any(Number),
        uv: expect.any(Number),
        vis_km: expect.any(Number),
        vis_miles: expect.any(Number),
        wind_degree: expect.any(Number),
        wind_dir: expect.any(String),
        wind_kph: expect.any(Number),
        wind_mph: expect.any(Number),
        windchill_c: expect.any(Number),
        windchill_f: expect.any(Number),
      });
    });

    test("returns an array of forecast days", async ({ request }) => {
      const resp = await invoke_get_forecast(
        request,
        location,
        forecastLength,
        an_authenticated_user,
      );

      const body = await resp.json();

      expect(body.forecast).toBeDefined();
      expect(body.forecast).toHaveProperty("forecastday");
      expect(body.forecast.forecastday.length).toEqual(forecastLength);
    });

    test("each forecast day has expected properties", async ({ request }) => {
      const resp = await invoke_get_forecast(
        request,
        location,
        forecastLength,
        an_authenticated_user,
      );

      const body = await resp.json();

      for (const day of body.forecast.forecastday) {
        expect(day).toHaveProperty("date");
        expect(day).toHaveProperty("date_epoch");
        expect(day).toHaveProperty("day");
        expect(day).toHaveProperty("astro");
        expect(day).toHaveProperty("hour");
      }
    });
  });

  test.describe("when location parameters are invalid", () => {
    test("a 400 response is received for a missing location", async ({
      request,
    }) => {
      const resp = await invoke_get_forecast(
        request,
        "",
        forecastLength,
        an_authenticated_user,
      );

      const body = await resp.json();

      expect(resp.status()).toBe(400);
      expect(body.error.code).toBe(1003);
      expect(body.error.message).toMatch(/Parameter q is missing/i);
    });
  });

  test("a 400 response is received for an unknown location", async ({
    request,
  }) => {
    const resp = await invoke_get_forecast(
      request,
      "invalid_location",
      forecastLength,
      an_authenticated_user,
    );

    const body = await resp.json();

    expect(resp.status()).toBe(400);
    expect(body.error.code).toBe(1006);
    expect(body.error.message).toMatch(/No matching location found/i);
  });
});

test.describe("given an unauthenticated user", () => {
  const invalid_api_key = "123456789";

  test.describe("when invoking the GET current weather endpoint", () => {
    test("a 403 response is received", async ({ request }) => {
      const resp = await invoke_get_forecast(
        request,
        location,
        forecastLength,
        invalid_api_key,
      );

      expect(resp.status()).toBe(403);
    });
  });
});
