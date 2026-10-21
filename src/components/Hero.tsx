import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

/**
 * The landing-page hero — the split "Soccer Camp" refinement (21 Oct 2026).
 *
 * Composition: two halves. One is a bright, warm "stage" holding the cutout
 * footballer in front of a gold sun-disc and a few playful pitch shapes; the
 * other is a solid deep-green panel carrying eyebrow, headline, paragraph and
 * the call to action. The mood comes from the Soccer Camp template Hussain
 * shared — warm, bright, playful, trustworthy — but every colour is ours:
 * green panel, gold accents, navy shapes, and orange on the primary CTA only.
 *
 * Why the stage is sand and not green: the boy wears a green kit. On a green
 * panel he would dissolve into it. On sand he is the brightest thing on the
 * page, which is the point.
 *
 * This section deliberately breaks the calm, restrained rules in
 * docs/design-system.md. Those govern the dashboard; the landing page is the
 * one place the brand goes visually loud. Don't "fix" this toward the
 * dashboard styling.
 *
 * MIRRORING: on desktop the stage takes the first grid column and the panel
 * the second. A grid's columns follow the page direction, so in Arabic the
 * photo moves to the right and the panel to the left with no second layout.
 * Decorative shapes are placed with start/end, never left/right, so they
 * follow. The photo itself is NOT flipped — it would mirror the kit's logos.
 *
 * MOBILE ORDER is the approved stack: eyebrow, headline, paragraph, image,
 * buttons. See the note on the panel wrapper for how that works.
 *
 * IMAGES ARE PLACEHOLDERS. These are AI-generated stand-ins to be replaced by
 * real academy photography (with guardian consent) before launch. The path
 * lives in one place — the constant below — so swapping it is a one-line
 * change.
 */

const HERO_ATHLETE = '/images/hero-football-boy.webp';

export async function Hero() {
  const t = await getTranslations('hero');
  const brand = await getTranslations('brand');

  return (
    <section className="relative isolate overflow-hidden bg-primary-800 text-white">
      <div className="grid lg:min-h-[min(calc(100dvh-4rem),820px)] lg:grid-cols-2">
        {/* ---- panel ----
            `contents` on phones dissolves this wrapper, so eyebrow, headline,
            paragraph and buttons become grid items in their own right and the
            stage can slot in between the paragraph and the buttons. From lg up
            it is an ordinary block again: the second column, text centred
            vertically.

            The end padding lines the text up with the header's 72rem content
            column even though the panel itself runs to the screen edge. */}
        <div className="contents lg:relative lg:order-2 lg:flex lg:flex-col lg:justify-center lg:py-20 lg:ps-14 lg:pe-[max(1.25rem,calc(50vw-36rem+1.25rem))] xl:ps-20">
          {/* Thin rings in the panel corner — the template's line pattern,
              kept quiet so it never competes with the headline. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 200 200"
            className="pointer-events-none absolute -end-14 -top-14 -z-10 w-40 text-primary-700 sm:w-56 lg:-end-16 lg:-top-16 lg:w-72 lg:text-primary-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="100" cy="100" r="40" />
            <circle cx="100" cy="100" r="60" />
            <circle cx="100" cy="100" r="80" />
            <circle cx="100" cy="100" r="98" />
          </svg>

          <p className="hero-rise order-1 flex items-center gap-3 px-5 pt-10 text-sm font-semibold tracking-wide text-accent-300 sm:pt-16 lg:order-none lg:p-0">
            <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-accent-400" />
            {brand('tagline')}
          </p>

          <h1 className="hero-rise order-2 mt-4 px-5 text-4xl leading-[1.04] font-black tracking-tight text-balance sm:text-5xl lg:order-none lg:px-0 lg:text-[3.4rem] xl:text-6xl">
            {t('titleLead')}
            <span className="text-accent-300">{t('titleAccent')}</span>
          </h1>

          <p className="hero-rise hero-rise-2 order-3 mt-5 max-w-xl px-5 text-base leading-relaxed text-primary-100 sm:text-lg lg:order-none lg:px-0">
            {t('sub')}
          </p>

          {/* Centred as a group on phones, start-aligned on desktop. Orange
              appears on the primary action and nowhere else in the hero. The
              secondary action is kept but deliberately quiet — a text link, so
              there is one obvious thing to press. */}
          <div className="hero-rise hero-rise-3 order-5 mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-5 pb-12 sm:pb-16 lg:order-none lg:mt-9 lg:justify-start lg:p-0">
            <a
              href="#programmes"
              className="inline-flex min-h-13 items-center justify-center rounded-full bg-attention-400 px-7 text-base font-bold text-ink-900 shadow-[0_8px_24px_rgb(232_113_31/0.28)] transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
            >
              {t('ctaPrimary')}
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-13 items-center px-1 text-base font-semibold text-white underline decoration-accent-400 decoration-2 underline-offset-[6px] transition-colors hover:text-accent-200"
            >
              {t('ctaSecondary')}
            </a>
          </div>
        </div>

        {/* ---- stage ----
            On phones, a rounded card sitting fourth in the stack. On desktop
            it becomes the first column and runs edge to edge. */}
        <div className="hero-rise hero-rise-2 relative order-4 mx-5 mt-7 flex items-end justify-center overflow-hidden rounded-lg bg-accent-100 pt-6 lg:order-1 lg:m-0 lg:rounded-none lg:pt-16">
          {/* Every shape here is decoration: aria-hidden, and placed with
              start/end so the whole composition mirrors in Arabic. */}

          {/* Gold sun-disc behind the athlete. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[12%] mx-auto aspect-square w-[78%] max-w-[520px] rounded-full bg-accent-300"
          />

          {/* Navy concentric arcs, top-start corner. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 200 200"
            className="absolute -start-14 -top-14 w-36 text-navy-700 lg:-start-20 lg:-top-20 lg:w-60"
            fill="none"
            stroke="currentColor"
            strokeWidth="9"
          >
            <circle cx="100" cy="100" r="34" />
            <circle cx="100" cy="100" r="58" />
            <circle cx="100" cy="100" r="82" />
          </svg>

          {/* Small green spark, top-end. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 40 40"
            className="absolute end-[10%] top-[9%] w-7 text-primary-500 lg:w-10"
            fill="currentColor"
          >
            <path d="M20 0l4.5 15.5L40 20l-15.5 4.5L20 40l-4.5-15.5L0 20l15.5-4.5z" />
          </svg>

          {/* Navy pitch tile, bottom-end — the half-way line and centre
              circle, the one unmistakably "football" shape in the set. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 120 120"
            className="absolute end-[6%] bottom-[8%] w-16 lg:w-24"
          >
            <rect width="120" height="120" rx="22" className="fill-navy-700" />
            <g fill="none" strokeWidth="4" className="stroke-accent-300">
              <line x1="60" y1="14" x2="60" y2="106" />
              <circle cx="60" cy="60" r="20" />
            </g>
            <circle cx="60" cy="60" r="5" className="fill-accent-300" />
          </svg>

          {/* Navy half-disc peeking in from the start edge — the template's
              cut-circle shapes. (Not stripes: three bars read as a menu icon,
              and people would try to tap it.) */}
          <div
            aria-hidden="true"
            className="absolute -start-8 top-[54%] aspect-square w-16 rounded-full bg-navy-700 lg:-start-12 lg:w-24"
          />

          {/* Sized by HEIGHT on desktop, so the space above and below him
              stays roughly constant from a laptop to a large monitor. */}
          <Image
            src={HERO_ATHLETE}
            alt={t('athleteAlt')}
            width={1000}
            height={1500}
            priority
            sizes="(max-width: 1024px) 80vw, 40vw"
            className="relative h-[min(40vh,380px)] w-auto object-contain drop-shadow-[0_18px_28px_rgb(15_24_48/0.28)] lg:h-[min(72vh,660px)]"
          />
        </div>
      </div>
    </section>
  );
}
