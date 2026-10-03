import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from 'next/font/google';

import { directionOf, routing, type Locale } from '@/i18n/routing';
import '../globals.css';

/**
 * PROVISIONAL TYPEFACES.
 *
 * design-system.md calls for one font system that handles Arabic and English
 * well, with the final choice tied to the Phase 1 approved direction. IBM Plex
 * has matched Latin and Arabic families, so the pair holds together while we
 * wait — but treat it as a placeholder, not a decision.
 */
const latin = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-latin',
  display: 'swap',
});

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600'],
  variable: '--font-arabic',
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
      className={`${latin.variable} ${arabic.variable}`}
    >
      <body className="min-h-dvh antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
