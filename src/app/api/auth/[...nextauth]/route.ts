/**
 * Auth.js's own endpoints. Under /api/, which robots.ts disallows.
 *
 * Nothing here is admin-specific: the whole configuration lives in
 * src/lib/admin/auth.ts, and this file exists because Auth.js v5 needs a route
 * to mount its handlers on.
 */
import { handlers } from "@/lib/admin/auth";

export const { GET, POST } = handlers;
