import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { whatsappUrl } from '@/lib/whatsapp';

import { ArrowEnd } from './ArrowEnd';
import { ImagePlaceholder } from './ImagePlaceholder';

/**
 * Landing-page section — events and activities.
 *
 * Split like the hero: copy on one side, a landscape photo slot on the other.
 * The grid follows the page direction, so in Arabic the photo moves to the
 * left with no second layout. On phones: heading, paragraph, buttons, photo.
 *
 * TWO ACTIONS, ONE ORANGE:
 *   primary   — "View our events" → /[locale]/events (a placeholder page for
 *               now). Orange, because it is this section's main action.
 *   secondary — "Request a meeting" → a WhatsApp chat with a pre-filled first
 *               message. A request handled by a person, NOT the internal
 *               reservation module; public visitors never touch that.
 *
 * Heading and paragraph are DRAFT copy, not from the client's copy file, and
 * they deliberately name no specific events — which events the academy runs is
 * not confirmed.
 */
export async function Events() {
  const t = await getTranslations('events');
  const footer = await getTranslations('footer');

  return (
    <section
      id="events"
      className="relative isolate scroll-mt-20 overflow-hidden border-y border-line bg-surface-2/60 py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16">
        <div className="reveal">
          <span aria-hidden="true" className="block h-1 w-12 rounded-full bg-accent-400" />
          <h2 className="mt-5 text-3xl leading-[1.08] font-bold tracking-tight text-balance text-ink-900 sm:text-4xl lg:text-[2.75rem]">
            {t('title')}
          </h2>
          <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-ink-600">{t('body')}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/events"
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-attention-400 px-7 text-base font-bold text-ink-900 shadow-[0_8px_24px_rgb(232_113_31/0.28)] transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
            >
              {t('primary')}
              <ArrowEnd />
            </Link>
            {/* TODO(contact): if the academy later wants a web form instead of
                WhatsApp, it replaces this link — still a request, never a
                booking in the internal system. */}
            <a
              href={whatsappUrl(footer('phone'), t('whatsappText'))}
              className="inline-flex min-h-13 items-center rounded-full border-[1.5px] border-primary-500 px-6 text-base font-semibold text-primary-600 transition-colors hover:bg-primary-50 hover:text-primary-700"
            >
              {t('secondary')}
            </a>
          </div>
        </div>

        {/* LANDSCAPE SLOT, 3:2, recommended source 1500 × 1000.
            TODO(image): a real photograph from an academy event — children
            and families together, with guardian consent for every child shown.
            When it arrives, swap the placeholder for <Image> with
            alt={t('imageAlt')}; the alt text is already written in both
            languages. */}
        <div className="reveal relative">
          <div
            aria-hidden="true"
            className="absolute -end-4 -top-4 -z-10 aspect-square w-28 rounded-full bg-accent-300 sm:w-36"
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 120 120"
            className="absolute -start-4 -bottom-4 -z-10 w-20 sm:w-24"
          >
            <rect width="120" height="120" rx="22" className="fill-navy-700" />
            <g fill="none" strokeWidth="4" className="stroke-accent-300">
              <line x1="60" y1="14" x2="60" y2="106" />
              <circle cx="60" cy="60" r="20" />
            </g>
          </svg>
          <div className="aspect-[3/2] overflow-hidden rounded-lg bg-surface shadow-card">
            <ImagePlaceholder recommended="1500 × 1000" className="h-full w-full rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
