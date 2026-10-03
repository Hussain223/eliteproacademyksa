import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BrandMark } from '@/components/BrandMark';
import { SiteHeader } from '@/components/SiteHeader';
import { routing } from '@/i18n/routing';

/**
 * The public landing page.
 *
 * Module 1 of docs/product.md: explain the academy, build trust, let visitors
 * enquire, and give existing users a way in. Premium and youth-oriented
 * without being childish.
 *
 * Built in the client-approved direction C — warm ground, soft green, rounded
 * corners, Rubik across both scripts. Every value comes from the frozen tokens
 * in globals.css, so the real brand colours drop in without touching this file.
 *
 * NOTE ON PHOTOGRAPHY: there are deliberately no images. We have no real
 * photographs of the academy, and stock photos of children carry consent and
 * licensing problems that are not worth inviting. The page is built to look
 * finished without them; real photography is the single biggest upgrade
 * available once the academy supplies it.
 *
 * NOTE ON CONTENT: every claim here is drawn from docs/product.md and
 * describes something the platform genuinely does. Nothing is invented —
 * no testimonials, no statistics, no accreditations. Contact details are
 * placeholders and live in messages/en.json and messages/ar.json.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'brand' });
  const hero = await getTranslations({ locale, namespace: 'hero' });

  return {
    title: `${t('name')} — ${t('tagline')}`,
    description: hero('body'),
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('hero');
  const brand = await getTranslations('brand');
  const prog = await getTranslations('programmes');
  const app = await getTranslations('approach');
  const contact = await getTranslations('contact');
  const portal = await getTranslations('portal');
  const footer = await getTranslations('footer');

  const disciplines = [
    'football',
    'swimming',
    'gymnastics',
    'martialArts',
    'nutrition',
  ] as const;

  const approachItems = ['coaches', 'records', 'reports', 'groups'] as const;

  const contactRows = [
    { label: contact('callLabel'), value: contact('phone'), dir: 'ltr' },
    { label: contact('emailLabel'), value: contact('email'), dir: 'ltr' },
    { label: contact('locationLabel'), value: contact('location'), dir: undefined },
    { label: contact('hoursLabel'), value: contact('hours'), dir: undefined },
  ];

  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* ---------- hero ---------- */}
        <section className="mx-auto w-full max-w-6xl px-5 pt-12 pb-14 sm:pt-16 sm:pb-20">
          <p className="text-xs font-semibold tracking-widest text-primary-600 uppercase">
            {t('eyebrow')}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl leading-[1.12] font-bold tracking-tight text-ink-900 text-balance sm:text-5xl lg:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-600">{t('body')}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="inline-flex min-h-12 items-center justify-center rounded-sm bg-primary-500 px-6 text-base font-semibold text-white transition-colors hover:bg-primary-600"
            >
              {t('ctaPrimary')}
            </a>
            <a
              href="#programmes"
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-primary-500 px-6 text-base font-semibold text-primary-600 transition-colors hover:bg-primary-50"
            >
              {t('ctaSecondary')}
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-2 border-t border-line pt-5 text-sm font-medium text-ink-600">
            <li>{t('ages')}</li>
            <li>{t('disciplinesCount')}</li>
            <li>{t('bilingual')}</li>
          </ul>
        </section>

        {/* ---------- programmes ---------- */}
        <section
          id="programmes"
          className="scroll-mt-20 border-y border-line bg-surface-2/60 py-14 sm:py-20"
        >
          <div className="mx-auto w-full max-w-6xl px-5">
            <p className="text-xs font-semibold tracking-widest text-primary-600 uppercase">
              {prog('eyebrow')}
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-ink-900 text-balance sm:text-4xl">
              {prog('title')}
            </h2>
            <p className="mt-4 max-w-2xl text-ink-600">{prog('body')}</p>

            <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {disciplines.map((key) => (
                <li
                  key={key}
                  className="rounded-md border border-line bg-surface p-6 shadow-card"
                >
                  <h3 className="text-lg font-semibold text-ink-900">
                    {prog(`${key}.name`)}
                  </h3>
                  <p className="mt-2 text-sm text-ink-600">{prog(`${key}.body`)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- approach ---------- */}
        <section id="approach" className="scroll-mt-20 py-14 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-5">
            <p className="text-xs font-semibold tracking-widest text-primary-600 uppercase">
              {app('eyebrow')}
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-ink-900 text-balance sm:text-4xl">
              {app('title')}
            </h2>

            <dl className="mt-9 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {approachItems.map((key) => (
                <div key={key} className="border-s-2 border-accent-500 ps-5">
                  <dt className="text-lg font-semibold text-ink-900">
                    {app(`${key}.name`)}
                  </dt>
                  <dd className="mt-2 text-ink-600">{app(`${key}.body`)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------- contact ---------- */}
        <section
          id="contact"
          className="scroll-mt-20 border-y border-line bg-surface-2/60 py-14 sm:py-20"
        >
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold tracking-widest text-primary-600 uppercase">
                {contact('eyebrow')}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 text-balance sm:text-4xl">
                {contact('title')}
              </h2>
              <p className="mt-4 max-w-md text-ink-600">{contact('body')}</p>

              <a
                href={`https://wa.me/${contact('phone').replace(/[^0-9]/g, '')}`}
                className="mt-7 inline-flex min-h-12 items-center justify-center rounded-sm bg-primary-500 px-6 text-base font-semibold text-white transition-colors hover:bg-primary-600"
              >
                {contact('whatsapp')}
              </a>
            </div>

            <dl className="grid content-start gap-5 rounded-md border border-line bg-surface p-6 shadow-card sm:grid-cols-2">
              {contactRows.map((row) => (
                <div key={row.label}>
                  <dt className="text-xs font-semibold tracking-wide text-ink-500 uppercase">
                    {row.label}
                  </dt>
                  <dd
                    dir={row.dir}
                    className="mt-1 text-ink-900 [unicode-bidi:plaintext]"
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------- portal ---------- */}
        <section className="py-14 sm:py-16">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-5">
            <div>
              <h2 className="text-xl font-semibold text-ink-900">
                {portal('title')}
              </h2>
              <p className="mt-1.5 max-w-lg text-ink-600">{portal('body')}</p>
            </div>
            {/* Not a link: there is no portal to sign in to until Phase 3.
                A button that silently does nothing is worse than one that
                says it is not open yet, so this is marked unavailable for
                screen readers too — and uses ink-600 rather than ink-400,
                which fails contrast as text (3.06:1). */}
            <span
              aria-disabled="true"
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-line-strong bg-surface px-6 text-base font-semibold text-ink-600"
            >
              {portal('cta')}
            </span>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-5 px-5 py-9">
          <div className="flex items-center gap-2.5 text-primary-600">
            <BrandMark className="h-8 w-8 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-ink-900">{brand('name')}</p>
              <p className="text-xs text-ink-500">{brand('tagline')}</p>
            </div>
          </div>
          <p className="text-xs text-ink-500">
            © {new Date().getFullYear()} {footer('rights')} · {footer('builtFor')}
          </p>
        </div>
      </footer>
    </div>
  );
}
