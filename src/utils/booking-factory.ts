import { faker } from '@faker-js/faker';
import { Booking } from '../api/types/booking.types';

const toIsoDate = (d: Date): string => {
  const iso = d.toISOString().split('T')[0];
  if (!iso) throw new Error('Failed to format date');
  return iso;
};

/**
 * Data factory for bookings.
 *
 * Every test gets unique, realistic data by default; anything a test cares
 * about is passed via `overrides` so intent stays visible at the call site
 * ("this test is about depositpaid=false", not "this test uses Bob Smith").
 */
export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  const checkin = faker.date.soon({ days: 30 });
  const checkout = faker.date.soon({ days: 14, refDate: checkin });

  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 50, max: 2500 }),
    depositpaid: faker.datatype.boolean(),
    bookingdates: {
      checkin: toIsoDate(checkin),
      checkout: toIsoDate(checkout),
    },
    additionalneeds: faker.helpers.arrayElement([
      'Breakfast',
      'Late checkout',
      'Extra pillows',
      undefined,
    ]),
    ...overrides,
  };
}
