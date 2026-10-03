import { defineRouting } from 'next-intl/routing';

/**
 * The two languages, defined in one place.
 *
 * Every URL carries its language: /en/... and /ar/... . That matters for three
 * reasons — a parent can bookmark or share a link in their own language, Google
 * can index both versions separately, and the server knows which direction to
 * render before the page is sent (no flash of the wrong layout).
 */
export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
});

export type Locale = (typeof routing.locales)[number];

/** Arabic reads right-to-left; English left-to-right. */
export function directionOf(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

/** What each language calls itself — never translated. */
export const localeLabels: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
};
