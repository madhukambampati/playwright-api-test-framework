import { test as base } from '@playwright/test';
import { AuthClient } from '../api/clients/auth-client';
import { BookingClient } from '../api/clients/booking-client';

interface ApiFixtures {
  authClient: AuthClient;
  bookingClient: BookingClient;
  /** A valid auth token, created once per test that requests it. */
  token: string;
}

/**
 * Playwright fixtures wire the service clients into every test, so specs
 * never construct clients or fetch tokens inline. Tests read as intent:
 *
 *   test('deletes a booking', async ({ bookingClient, token }) => { ... })
 */
export const test = base.extend<ApiFixtures>({
  authClient: async ({ request }, use) => {
    await use(new AuthClient(request));
  },
  bookingClient: async ({ request }, use) => {
    await use(new BookingClient(request));
  },
  token: async ({ authClient }, use) => {
    const token = await authClient.createToken();
    await use(token);
  },
});

export { expect } from '@playwright/test';
