import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

/**
 * Environment is validated at startup with zod so that a misconfigured
 * pipeline fails immediately with a clear message, not halfway through
 * a run with a cryptic 401.
 */
const envSchema = z.object({
  BASE_URL: z.string().url().default('https://restful-booker.herokuapp.com'),
  API_USERNAME: z.string().default('admin'),
  API_PASSWORD: z.string().default('password123'),
});

export const env = envSchema.parse({
  BASE_URL: process.env.BASE_URL,
  API_USERNAME: process.env.API_USERNAME,
  API_PASSWORD: process.env.API_PASSWORD,
});

export type Env = z.infer<typeof envSchema>;
