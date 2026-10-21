import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ArrowEnd } from '@/components/ArrowEnd';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { Link } from '@/i18n/navigation';
import { whatsappUrl } from '@/lib/whatsapp';

/**
 * Public events page — /[locale]/events. PLACEHOLDER.
 *
 * TODO(content): the academy's events and activities — photos and a short
 * description for each, newest first. Which events the academy runs, and the
 * photos (with guardian consent for every child shown), are still to come.
 *
 * Until then this page IS the empty state: it says plainly that the gallery is
 * being put together, and offers the two useful ways forward — ask on
 * WhatsApp, or go back home. It never shows an empty grid.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'events' });
  const brand = await getTranslations({ locale, namespace: 'brand' });
  return { title: `${t('title')} · ${brand('name')}`, description: t('body') };
}

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('events');
  const page = await getTranslations('eventsPage');
  const footer = await getTranslations('footer');

  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1 bg-bg">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:py-14 lg:py-20">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            <ArrowEnd back />
            {page('back')}
          </Link>

          <span aria-hidden="true" className="mt-8 block h-1 w-12 rounded-full bg-accent-400" />
          <h1 className="mt-5 text-4xl leading-[1.05] font-black tracking-tight text-balance text-ink-900 sm:text-5xl">
            {t('title')}
          </h1>

          {/* EMPTY STATE */}
          <div className="relative isolate mt-10 overflow-hidden rounded-lg bg-accent-100 px-6 py-14 text-center sm:px-12 sm:py-20">
            <svg
              aria-hidden="true"
              viewBox="0 0 200 200"
              className="absolute -start-16 -top-16 -z-10 w-36 text-navy-700 sm:w-48"
              fill="none"
              stroke="currentColor"
              strokeWidth="9"
            >
              <circle cx="100" cy="100" r="34" />
              <circle cx="100" cy="100" r="58" />
              <circle cx="100" cy="100" r="82" />
            </svg>
            <div
              aria-hidden="true"
              className="absolute -end-10 -bottom-14 -z-10 aspect-square w-28 rounded-full bg-accent-300 sm:-end-16 sm:-bottom-20 sm:w-60"
            />

            <h2 className="text-2xl font-bold tracking-tight text-balance text-ink-900 sm:text-3xl">
              {page('emptyTitle')}
            </h2>
            <p className="mx-auto mt-4 max-w-[52ch] leading-relaxed text-ink-700">
              {page('emptyBody')}
            </p>
            <a
              href={whatsappUrl(footer('phone'), t('whatsappText'))}
              className="mt-8 inline-flex min-h-13 items-center justify-center rounded-full bg-attention-400 px-7 text-base font-bold text-ink-900 shadow-[0_8px_24px_rgb(232_113_31/0.28)] transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
            >
              {t('secondary')}
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
