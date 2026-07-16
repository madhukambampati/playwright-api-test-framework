import { z } from 'zod';

/**
 * Runtime contract validation.
 *
 * TypeScript types vanish at runtime; these zod schemas are what actually
 * catch a backend contract drift (renamed field, number -> string, dropped
 * property) the moment it ships. Every response body in the suite is parsed
 * against one of these before any assertion runs.
 */
export const bookingDatesSchema = z.object({
  checkin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'checkin must be YYYY-MM-DD'),
  checkout: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'checkout must be YYYY-MM-DD'),
});

export const bookingSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  totalprice: z.number().int().nonnegative(),
  depositpaid: z.boolean(),
  bookingdates: bookingDatesSchema,
  additionalneeds: z.string().optional(),
});

export const bookingCreatedSchema = z.object({
  bookingid: z.number().int().positive(),
  booking: bookingSchema,
});

export const bookingIdListSchema = z.array(
  z.object({ bookingid: z.number().int().positive() }),
);

export const authTokenSchema = z.object({
  token: z.string().min(1),
});
