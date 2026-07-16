import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseClient } from './base-client';
import {
  bookingCreatedSchema,
  bookingIdListSchema,
  bookingSchema,
} from '../schemas/booking.schema';
import { Booking, BookingCreatedResponse } from '../types/booking.types';

/**
 * Service-object for the /booking resource.
 *
 * Convention used throughout:
 *  - `<verb>Raw(...)` returns the APIResponse untouched, for tests that
 *    assert on status codes, headers, or error bodies.
 *  - `<verb>(...)` is the validated happy path: asserts 2xx, parses the
 *    body against the contract schema, returns typed data.
 */
export class BookingClient extends BaseClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  // ---- create -------------------------------------------------------------

  async createRaw(payload: unknown): Promise<APIResponse> {
    return this.request.post('/booking', { data: payload });
  }

  async create(payload: Booking): Promise<BookingCreatedResponse> {
    const response = await this.createRaw(payload);
    if (!response.ok()) {
      throw new Error(`Create booking failed: ${response.status()}`);
    }
    return this.parse(response, bookingCreatedSchema);
  }

  // ---- read ---------------------------------------------------------------

  async getRaw(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  async get(id: number): Promise<Booking> {
    const response = await this.getRaw(id);
    if (!response.ok()) {
      throw new Error(`Get booking ${id} failed: ${response.status()}`);
    }
    return this.parse(response, bookingSchema);
  }

  async listIds(filter?: Record<string, string>): Promise<number[]> {
    const response = await this.request.get('/booking', { params: filter });
    const parsed = await this.parse(response, bookingIdListSchema);
    return parsed.map((b) => b.bookingid);
  }

  // ---- update -------------------------------------------------------------

  async updateRaw(id: number, payload: unknown, token?: string): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, {
      data: payload,
      headers: token ? { Cookie: `token=${token}` } : {},
    });
  }

  async update(id: number, payload: Booking, token: string): Promise<Booking> {
    const response = await this.updateRaw(id, payload, token);
    if (!response.ok()) {
      throw new Error(`Update booking ${id} failed: ${response.status()}`);
    }
    return this.parse(response, bookingSchema);
  }

  async partialUpdateRaw(
    id: number,
    payload: Partial<Booking>,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, {
      data: payload,
      headers: token ? { Cookie: `token=${token}` } : {},
    });
  }

  // ---- delete -------------------------------------------------------------

  async deleteRaw(id: number, token?: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, {
      headers: token ? { Cookie: `token=${token}` } : {},
    });
  }
}
