import { getLocale, getTranslations } from 'next-intl/server';

import { COACHES } from '@/content/coaches';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { whatsappUrl } from '@/lib/whatsapp';

import { ArrowEnd } from './ArrowEnd';
import { CoachPhoto } from './CoachPhoto';

/**
 * Landing-page section — meet the coaches. Each card links to the coach's
 * public profile at /[locale]/coaches/[id].
 *
 * Styled to follow the split "Soccer Camp" hero: white cards on the warm
 * ground, the sport as a small gold label, one quiet echo of the hero's arcs.
 *
 * PHONES: the cards sit in one row that scrolls sideways inside its own
 * container (the page itself never scrolls sideways). Each card is a little
 * narrower than the screen so the next one peeks in — that sliver is what tells
 * people there is more. In Arabic the row starts from the right and scrolls
 * left, because a flex row follows the page direction. From sm up it becomes an
 * ordinary grid.
 *
 * STATES: the data is static today, so there is no loading state on this page
 * (it is rendered in full before it is sent). EMPTY is handled: with no coaches
 * the section says so and offers a way to ask, rather than showing a blank row.
 *
 * Heading and intro are DRAFT copy, not from the client's copy file — see the
 * note in messages/*.json under "coaches".
 */
export async function Coaches() {
  const t = await getTranslations('coaches');
  const programs = await getTranslations('programs');
  const footer = await getTranslations('footer');
  const locale = (await getLocale()) as Locale;

  return (
    <section
      id="coaches"
      className="relative isolate scroll-mt-20 overflow-hidden bg-bg py-20 sm:py-24 lg:py-28"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className="pointer-events-none absolute -end-24 -top-24 -z-10 w-72 text-accent-200"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
      >
        <circle cx="100" cy="100" r="44" />
        <circle cx="100" cy="100" r="70" />
        <circle cx="100" cy="100" r="94" />
      </svg>

      <div className="mx-auto w-full max-w-6xl px-5">
        <span aria-hidden="true" className="reveal block h-1 w-12 rounded-full bg-accent-400" />
        <h2 className="reveal mt-5 max-w-3xl text-3xl leading-[1.08] font-bold tracking-tight text-balance text-ink-900 sm:text-4xl lg:text-[2.75rem]">
          {t('title')}
        </h2>
        <p className="reveal mt-5 max-w-[62ch] text-lg leading-relaxed text-ink-600">
          {t('intro')}
        </p>

        {COACHES.length === 0 ? (
          // EMPTY STATE — never a blank row.
          <div className="reveal mt-12 rounded-lg border-2 border-dashed border-line-strong bg-surface px-6 py-12 text-center">
            <p className="text-lg font-semibold text-ink-900">{t('empty')}</p>
            <a
              href={whatsappUrl(footer('phone'))}
              className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-primary-600 underline decoration-2 underline-offset-4 hover:text-primary-700"
            >
              {t('emptyCta')}
              <ArrowEnd />
            </a>
          </div>
        ) : (
          <ul
            // -mx-5 + px-5 lets the scrolling row run to the screen edges on
            // phones while the first card still lines up with the heading.
            // `reveal` sits on the row, not the cards: inside a sideways
            // scroller a card's view() timeline would track that scroller,
            // and cards off to the side would stay invisible.
            className="reveal -mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4"
          >
            {COACHES.map((coach) => (
              <li key={coach.id} className="w-[78%] shrink-0 snap-start sm:w-auto">
                <Link
                  href={`/coaches/${coach.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-accent-300 hover:shadow-raised motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <CoachPhoto
                    coach={coach}
                    locale={locale}
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 270px"
                  />
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="text-xs font-bold tracking-wider text-accent-700 uppercase">
                      {programs(`${coach.sport}.name`)}
                    </p>
                    <h3 className="mt-1.5 text-lg leading-snug font-bold tracking-tight text-ink-900">
                      {coach.name[locale]}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">
                      {coach.tagline[locale]}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 group-hover:text-primary-700">
                      {t('viewProfile')}
                      <ArrowEnd className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none rtl:group-hover:-translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
