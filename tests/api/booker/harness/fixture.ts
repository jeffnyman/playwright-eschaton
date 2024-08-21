import { test as base } from "@playwright/test";
import api from "./api";

export interface AuthResponse {
  token: string;
}

export interface BookingResponse {
  bookingid: string;
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  additionalneeds: string;
}

interface TestFixture {
  API: api;
}

const fixtures = base.extend<TestFixture>({
  API: async ({ request }, use) => {
    const API = new api(request);
    await use(API);
  },
});

export { fixtures };
