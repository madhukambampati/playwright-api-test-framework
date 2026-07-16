export interface BookingDates {
  checkin: string; // ISO date, e.g. "2026-08-01"
  checkout: string;
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export interface BookingCreatedResponse {
  bookingid: number;
  booking: Booking;
}

export interface BookingId {
  bookingid: number;
}

export interface AuthToken {
  token: string;
}
