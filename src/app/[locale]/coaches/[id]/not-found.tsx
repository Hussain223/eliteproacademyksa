'use client';

import { useTranslations } from 'next-intl';

import { ArrowEnd } from '@/components/ArrowEnd';
import { SiteHeader } from '@/components/SiteHeader';
import { Link } from '@/i18n/navigation';

/**
 * NOT-FOUND STATE for a coach profile — an old or mistyped link.
 *
 * Says what happened in plain words and offers the way back to the coaches,
 * in the visitor's own language. Never a bare "404".
 *
 * A CLIENT COMPONENT ON PURPOSE — see the note in loading.tsx. The header
 * works here because it needs nothing from the server; the footer does, so
 * this page goes without it. The way back is the button and the header.
 */
export default function CoachNotFound() {
  const t = useTranslations('coachProfile');

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center bg-bg">
        <div className="mx-auto w-full max-w-xl px-5 py-24 text-center">
          <h1 className="text-3xl font-black tracking-tight text-balance text-ink-900 sm:text-4xl">
            {t('notFoundTitle')}
          </h1>
          <p className="mt-4 leading-relaxed text-ink-600">{t('notFoundBody')}</p>
          <Link
            href="/#coaches"
            className="mt-8 inline-flex min-h-13 items-center gap-2 rounded-full border-[1.5px] border-primary-500 px-6 font-semibold text-primary-600 transition-colors hover:bg-primary-50 hover:text-primary-700"
          >
            {t('notFoundCta')}
            <ArrowEnd />
          </Link>
        </div>
      </main>
    </div>
  );
}
