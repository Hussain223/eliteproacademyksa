import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Rubik } from 'next/font/google';

import { directionOf, routing, type Locale } from '@/i18n/routing';
import '../globals.css';

/**
 * The typeface, fixed by the client-approved direction (Phase 1, 3 Oct 2026).
 *
 * One family covering BOTH scripts, which is what design-system.md asks for.
 * Rubik ships a genuine Arabic subset, so Arabic and English share one voice
 * rather than being two families chosen to resemble each other. Next.js loads
 * only the glyphs each page needs, so carrying both scripts costs the visitor
 * nothing extra.
 */
const rubik = Rubik({
  subsets: ['latin', 'arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rubik',
  display: 'swap',
});

/** Pre-render both languages at build time rather than on first visit. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: 'brand' });

  return {
    title: t('name'),
    description: t('tagline'),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // A URL asking for a language we don't serve shows a proper 404, never a crash.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  /**
   * `dir` on <html> is the single switch that mirrors the entire layout.
   * Because every component uses logical CSS properties, nothing else has to
   * change: margins, padding, text alignment and borders all flip from this
   * one attribute. That is the whole reason the RTL rule is enforced in CI.
   */
  return (
    <html
      lang={locale}
      dir={directionOf(locale as Locale)}
      className={rubik.variable}
    >
      <body className="min-h-dvh antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
