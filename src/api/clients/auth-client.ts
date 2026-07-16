import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseClient } from './base-client';
import { authTokenSchema } from '../schemas/booking.schema';
import { env } from '../../config/env';

export class AuthClient extends BaseClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  /** Raw response — used by negative tests that assert on failure shape. */
  async createTokenRaw(username: string, password: string): Promise<APIResponse> {
    return this.request.post('/auth', { data: { username, password } });
  }

  /** Happy-path token creation with contract validation. */
  async createToken(
    username: string = env.API_USERNAME,
    password: string = env.API_PASSWORD,
  ): Promise<string> {
    const response = await this.createTokenRaw(username, password);
    if (!response.ok()) {
      throw new Error(`Auth failed: ${response.status()} ${await response.text()}`);
    }
    const parsed = await this.parse(response, authTokenSchema);
    return parsed.token;
  }
}
