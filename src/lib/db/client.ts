import { neon } from "@neondatabase/serverless";

let cached: ReturnType<typeof neon> | null = null;

/**
 * Throws rather than silently degrading — a route that cannot reach the
 * capture table has nowhere durable to put the payload, and must fail loudly
 * instead of returning the false success this layer exists to close.
 */
export function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set.");
  }
  if (!cached) cached = neon(url);
  return cached;
}
