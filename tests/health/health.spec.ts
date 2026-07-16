import { test, expect } from '../../src/utils/fixtures';

test.describe('Health @smoke', () => {
  test('API is reachable and responsive', async ({ request }) => {
    const start = Date.now();
    const response = await request.get('/ping');
    const elapsed = Date.now() - start;

    expect(response.status()).toBe(201); // documented ping behaviour
    expect(elapsed, 'health endpoint should respond within SLA').toBeLessThan(3_000);
  });
});
