import { APIRequestContext, APIResponse } from '@playwright/test';
import { z } from 'zod';

/**
 * Thin base layer shared by all service clients.
 *
 * Responsibilities kept deliberately small:
 *  - own the Playwright request context
 *  - provide a single choke point for parsing + validating JSON bodies
 *
 * Anything endpoint-specific (paths, payloads, auth headers) lives in the
 * concrete clients so this class never grows into a god object.
 */
export abstract class BaseClient {
  protected constructor(protected readonly request: APIRequestContext) {}

  /**
   * Parse a response body and validate it against a zod schema.
   * Throws with a readable diff if the contract has drifted, which surfaces
   * in the Playwright report as the true failure cause instead of a
   * downstream undefined-property error.
   */
  protected async parse<T extends z.ZodTypeAny>(
    response: APIResponse,
    schema: T,
  ): Promise<z.infer<T>> {
    const body = await response.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      throw new Error(
        `Contract validation failed for ${response.url()}\n` +
          result.error.issues
            .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
            .join('\n'),
      );
    }
    return result.data;
  }
}
