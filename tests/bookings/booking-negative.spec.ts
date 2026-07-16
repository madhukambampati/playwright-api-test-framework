import { test, expect } from '../../src/utils/fixtures';
import { buildBooking } from '../../src/utils/booking-factory';

test.describe('Booking — negative & authorization @regression', () => {
  test('rejects update without a token', async ({ bookingClient }) => {
    const { bookingid } = await bookingClient.create(buildBooking());

    const response = await bookingClient.updateRaw(bookingid, buildBooking());
    expect(response.status()).toBe(403);
  });

  test('rejects update with a forged token', async ({ bookingClient }) => {
    const { bookingid } = await bookingClient.create(buildBooking());

    const response = await bookingClient.updateRaw(
      bookingid,
      buildBooking(),
      'not-a-real-token',
    );
    expect(response.status()).toBe(403);
  });

  test('rejects delete without a token', async ({ bookingClient }) => {
    const { bookingid } = await bookingClient.create(buildBooking());

    const response = await bookingClient.deleteRaw(bookingid);
    expect(response.status()).toBe(403);
  });

  test('GET for a non-existent id returns 404', async ({ bookingClient }) => {
    const response = await bookingClient.getRaw(99_999_999);
    expect(response.status()).toBe(404);
  });

  test('create with malformed payload does not 500', async ({ bookingClient }) => {
    const response = await bookingClient.createRaw({ firstname: 42, nonsense: true });

    // The API should reject bad input gracefully; a 5xx here would indicate
    // unhandled server-side validation, which is worth failing the build over.
    expect(response.status(), 'malformed input must not crash the server').toBeLessThan(500);
  });
});
