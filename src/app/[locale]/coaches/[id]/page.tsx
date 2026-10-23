import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ArrowEnd } from '@/components/ArrowEnd';
import { CoachPhoto } from '@/components/CoachPhoto';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { COACHES, findCoach } from '@/content/coaches';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { whatsappUrl } from '@/lib/whatsapp';

/**
 * Public coach profile — /[locale]/coaches/[id].
 *
 * A MARKETING PAGE, not the app's coach record: photo, sport, bio and (once
 * confirmed) qualifications. Nothing private lives here and nothing here needs
 * a login. The app's own coach screens come in later phases and are a
 * different thing entirely.
 *
 * STATES
 *   loading   — loading.tsx beside this file (shown while moving here from
 *               another page on a slow connection).
 *   not found — an unknown id calls notFound(), which renders not-found.tsx
 *               beside this file: a friendly page with a way back. It is
 *               served with noindex; the status code reads 200, not 404,
 *               because loading.tsx makes the response stream — documented
 *               Next.js behaviour, and harmless since search engines skip it.
 *   pending   — qualifications are null until the academy confirms them
 *               ([NEEDS INPUT]); a clearly marked placeholder holds their place.
 *
 * Every profile is pre-built for both languages at build time (the locale comes
 * from the parent layout; this file adds the ids).
 */

export function generateStaticParams() {
  return COACHES.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const coach = findCoach(id);
  if (!coach) return {};
  const brand = await getTranslations({ locale, namespace: 'brand' });
  const programs = await getTranslations({ locale, namespace: 'programs' });
  const l = locale as Locale;
  return {
    title: `${coach.name[l]} — ${programs(`${coach.sport}.name`)} · ${brand('name')}`,
    description: coach.tagline[l],
  };
}

export default async function CoachProfilePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const coach = findCoach(id);
  if (!coach) notFound();

  const l = locale as Locale;
  const t = await getTranslations('coachProfile');
  const programs = await getTranslations('programs');
  const footer = await getTranslations('footer');

  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1 bg-bg">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:py-14 lg:py-20">
          <Link
            href="/#coaches"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            <ArrowEnd back />
            {t('back')}
          </Link>

          <div className="mt-6 grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14">
            {/* Portrait first in the reading order, so on phones it sits on
                top; on wider screens it is the first (start-side) column. */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -end-4 -top-4 -z-0 aspect-square w-24 rounded-full bg-accent-300 sm:w-32"
              />
              <div className="relative overflow-hidden rounded-lg shadow-card">
                <CoachPhoto
                  coach={coach}
                  locale={l}
                  priority
                  sizes="(max-width: 768px) 90vw, 440px"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-bold tracking-wider text-accent-700 uppercase">
                {programs(`${coach.sport}.name`)}
              </p>
              <h1 className="mt-2 text-4xl leading-[1.05] font-black tracking-tight text-balance text-ink-900 sm:text-5xl">
                {coach.name[l]}
              </h1>
              <p className="mt-4 text-xl leading-relaxed text-ink-700">{coach.tagline[l]}</p>

              <h2 className="mt-10 text-lg font-bold text-ink-900">{t('about')}</h2>
              <p className="mt-3 max-w-[62ch] leading-relaxed text-ink-600">{coach.bio[l]}</p>

              <h2 className="mt-10 text-lg font-bold text-ink-900">{t('credentials')}</h2>
              {coach.credentials ? (
                <ul className="mt-3 space-y-2">
                  {coach.credentials.map((c) => (
                    <li key={c[l]} className="flex gap-3 text-ink-700">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 size-2 shrink-0 rounded-full bg-accent-400"
                      />
                      {c[l]}
                    </li>
                  ))}
                </ul>
              ) : (
                // PENDING — [NEEDS INPUT]. Visible on purpose, like the image
                // placeholders, so nobody mistakes the gap for a finished page.
                // TODO(content): hide or fill before launch.
                <p className="mt-3 rounded-md border-2 border-dashed border-primary-300 bg-primary-50 px-4 py-3 text-sm text-primary-700">
                  {t('credentialsPending')}
                </p>
              )}

              <a
                href={whatsappUrl(footer('phone'), t('whatsappText'))}
                className="mt-10 inline-flex min-h-13 items-center justify-center rounded-full bg-attention-400 px-7 text-base font-bold text-ink-900 shadow-[0_8px_24px_rgb(232_113_31/0.28)] transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
              >
                {t('cta')}
              </a>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
