import { getTranslations, setRequestLocale } from 'next-intl/server';

import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { directionOf, localeLabels, type Locale } from '@/i18n/routing';

/**
 * PHASE 0 PLACEHOLDER — NOT A DESIGN.
 *
 * This page is intentionally plain. Its only job is to prove the foundations
 * work: the app builds, deploys, serves both languages from their own URLs,
 * flips direction, reads its colours from design tokens, and reflows on a
 * phone.
 *
 * It is deliberately NOT a styled screen, because the visual direction is the
 * client's decision in Phase 1. Building something handsome here would invite
 * the client to approve a look that never went through that process.
 *
 * This file gets deleted in Phase 2 when the real app shell arrives.
 */
export default async function Phase0Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('phase0');
  const brand = await getTranslations('brand');

  const checks = [
    t('checks.deploy'),
    t('checks.locale'),
    t('checks.direction'),
    t('checks.tokens'),
    t('checks.mobile'),
  ];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-10 px-5 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-200 pb-5">
        <div>
          <p className="text-lg font-semibold text-primary-700">
            {brand('name')}
          </p>
          <p className="text-sm text-ink-500">{brand('tagline')}</p>
        </div>
        <LanguageSwitcher />
      </header>

      <main className="flex flex-col gap-8">
        <section className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-widest text-ink-400 uppercase">
            {t('eyebrow')}
          </p>
          <h1 className="text-3xl font-semibold text-ink-900">
            {t('heading')}
          </h1>
          <p className="max-w-prose text-ink-600">{t('intro')}</p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-ink-900">
            {t('checklistTitle')}
          </h2>
          <ul className="flex flex-col gap-2">
            {checks.map((check) => (
              <li
                key={check}
                className="flex items-start gap-3 rounded-md bg-surface p-3 shadow-card"
              >
                {/* The tick is decorative — the sentence carries the meaning.
                    Status is never communicated by a symbol or colour alone. */}
                <span
                  aria-hidden="true"
                  className="mt-1 text-sm text-success-600"
                >
                  &#10003;
                </span>
                <span className="text-sm text-ink-700">{check}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <dl className="rounded-md bg-surface p-4 shadow-card">
            <dt className="text-xs font-medium tracking-wide text-ink-400 uppercase">
              {t('localeLabel')}
            </dt>
            <dd className="mt-1 text-sm font-medium text-ink-900">
              {localeLabels[locale as Locale]}{' '}
              <span className="font-normal text-ink-400">({locale})</span>
            </dd>
          </dl>
          <dl className="rounded-md bg-surface p-4 shadow-card">
            <dt className="text-xs font-medium tracking-wide text-ink-400 uppercase">
              {t('directionLabel')}
            </dt>
            <dd className="mt-1 text-sm font-medium text-ink-900">
              {directionOf(locale as Locale)}
            </dd>
          </dl>
        </section>

        {/* The one place the attention colour is allowed: a single important
            caveat the reader must not miss. */}
        <aside className="rounded-md border-s-4 border-attention-500 bg-accent-50 p-4">
          <p className="text-sm text-ink-700">{t('tokenWarning')}</p>
        </aside>

        <section className="flex flex-col gap-2 border-t border-ink-200 pt-6">
          <h2 className="text-base font-semibold text-ink-900">
            {t('nextTitle')}
          </h2>
          <p className="max-w-prose text-sm text-ink-600">{t('nextBody')}</p>
        </section>
      </main>
    </div>
  );
}
