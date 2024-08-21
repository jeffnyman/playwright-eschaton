import { expect } from "@playwright/test";
import { fixtures, AuthResponse, BookingResponse } from "./harness/fixture";

fixtures.describe("Booker API Tests", () => {
  let token: string;
  let bookingId: string;

  fixtures.beforeAll(async ({ API }) => {
    const response = await API.postRequest("/auth", {
      username: "admin",
      password: "password123",
    });

    const authResponse: AuthResponse = (await response.json()) as AuthResponse;
    token = authResponse.token;
  });

  fixtures("list of bookings can be retrieved", async ({ API }) => {
    const response = await API.getRequest("/booking");

    const bookings: BookingResponse[] =
      (await response.json()) as BookingResponse[];

    expect.soft(response.status()).toBe(200);
    expect(bookings[0]).toHaveProperty("bookingid");
  });

  fixtures.describe("create a booking", () => {
    fixtures.beforeAll(async ({ API }) => {
      const response = await API.postRequest("/booking", {
        firstname: "Jeff",
        lastname: "Nyman",
        totalprice: 250,
        depositpaid: true,
        bookingdates: {
          checkin: "2024-11-01",
          checkout: "2024-11-08",
        },
        additionalneeds: "excessive pampering",
      });

      const bookingResponse: BookingResponse =
        (await response.json()) as BookingResponse;
      bookingId = bookingResponse.bookingid;
    });

    fixtures("existing bookings can be updated", async ({ API }) => {
      const response = await API.putRequest(
        `/booking/${bookingId}`,
        {
          firstname: "Jeffrey",
          lastname: "Nyman",
          totalprice: 100,
          depositpaid: true,
          bookingdates: {
            checkin: "2024-11-01",
            checkout: "2024-11-08",
          },
          additionalneeds: "excessive pampering",
        },
        token,
      );

      const updatedBooking: BookingResponse =
        (await response.json()) as BookingResponse;

      expect.soft(response.status()).toBe(200);
      expect(updatedBooking.firstname).toBe("Jeffrey");
      expect(updatedBooking.totalprice).toBe(100);
    });

    fixtures("existing booking can be partially updated", async ({ API }) => {
      const response = await API.patchRequest(
        `/booking/${bookingId}`,
        {
          firstname: "Jefficus",
          lastname: "Nymanus",
        },
        token,
      );

      const partialUpdate: BookingResponse =
        (await response.json()) as BookingResponse;

      expect.soft(response.status()).toBe(200);
      expect(partialUpdate.firstname).toBe("Jefficus");
      expect(partialUpdate.lastname).toBe("Nymanus");
    });

    fixtures("existing booking can be deleted", async ({ API }) => {
      const response = await API.deleteRequest(`/booking/${bookingId}`, token);
      expect.soft(response.status()).toBe(201);
    });
  });
});
