import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/**
 * Runs before every page request and makes sure the URL carries a language.
 *
 * A visitor landing on "/" is sent to "/en" or "/ar" based on their browser's
 * language, and their choice is remembered in a cookie afterwards.
 *
 * Note on the filename: Next.js 16 renamed this convention from `middleware`
 * to `proxy`. Same mechanism, new name.
 *
 * This is also where Supabase session refresh gets added in Phase 3 — it has to
 * happen here so an expired login is renewed before the page renders.
 */
export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next.js internals, and anything with a file extension
  // (images, fonts) — those don't need a language prefix.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
