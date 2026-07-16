import { test, expect } from '../../src/utils/fixtures';
import { env } from '../../src/config/env';

test.describe('Authentication', () => {
  test('issues a token for valid credentials @smoke', async ({ authClient }) => {
    const token = await authClient.createToken();
    expect(token).toMatch(/^[a-z0-9]+$/i);
  });

  test('rejects invalid credentials without leaking detail @regression', async ({
    authClient,
  }) => {
    const response = await authClient.createTokenRaw(env.API_USERNAME, 'wrong-password');

    // Restful Booker returns 200 with a reason body rather than 401 —
    // documented quirk, asserted deliberately so a behaviour change is caught.
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ reason: 'Bad credentials' });
    expect(body).not.toHaveProperty('token');
  });

  test('rejects empty credentials @regression', async ({ authClient }) => {
    const response = await authClient.createTokenRaw('', '');
    const body = await response.json();
    expect(body).not.toHaveProperty('token');
  });
});
