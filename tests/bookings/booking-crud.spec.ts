import { test, expect } from '../../src/utils/fixtures';
import { buildBooking } from '../../src/utils/booking-factory';

test.describe('Booking CRUD', () => {
  test('creates a booking and returns it by id @smoke', async ({ bookingClient }) => {
    const payload = buildBooking();

    const created = await bookingClient.create(payload);
    expect(created.booking).toEqual(payload);

    const fetched = await bookingClient.get(created.bookingid);
    expect(fetched).toEqual(payload);
  });

  test('created booking appears in the id listing @regression', async ({
    bookingClient,
  }) => {
    const payload = buildBooking();
    const { bookingid } = await bookingClient.create(payload);

    const ids = await bookingClient.listIds({
      firstname: payload.firstname,
      lastname: payload.lastname,
    });
    expect(ids).toContain(bookingid);
  });

  test('full update replaces every field @regression', async ({
    bookingClient,
    token,
  }) => {
    const { bookingid } = await bookingClient.create(buildBooking());
    const replacement = buildBooking({ firstname: 'Updated', totalprice: 999 });

    const updated = await bookingClient.update(bookingid, replacement, token);
    expect(updated).toEqual(replacement);

    const fetched = await bookingClient.get(bookingid);
    expect(fetched, 'update must persist, not just echo').toEqual(replacement);
  });

  test('partial update changes only the targeted fields @regression', async ({
    bookingClient,
    token,
  }) => {
    const original = buildBooking({ depositpaid: false });
    const { bookingid } = await bookingClient.create(original);

    const response = await bookingClient.partialUpdateRaw(
      bookingid,
      { depositpaid: true },
      token,
    );
    expect(response.ok()).toBe(true);

    const fetched = await bookingClient.get(bookingid);
    expect(fetched.depositpaid).toBe(true);
    expect(fetched.firstname, 'untouched fields must survive a PATCH').toBe(
      original.firstname,
    );
  });

  test('deletes a booking and subsequent GET returns 404 @smoke', async ({
    bookingClient,
    token,
  }) => {
    const { bookingid } = await bookingClient.create(buildBooking());

    const del = await bookingClient.deleteRaw(bookingid, token);
    expect(del.status()).toBe(201); // documented Restful Booker behaviour

    const after = await bookingClient.getRaw(bookingid);
    expect(after.status()).toBe(404);
  });
});
