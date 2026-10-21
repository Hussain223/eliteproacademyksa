import { getTranslations } from 'next-intl/server';

/**
 * Section 5 of the copy file — the closing call to action.
 *
 * Orange appears here and in the hero and nowhere else, which is the whole
 * point of an attention colour: two uses on the page, both the primary action.
 * Dark text on the orange, because white text fails contrast on every orange
 * bright enough to be worth using (measured: white 3.08:1, ink-900 5.30:1).
 *
 * Follows the split "Soccer Camp" hero (approved 21 Oct 2026): the panel is
 * the hero's sand stage, with its navy arcs, gold sun-disc and green spark,
 * so the page ends where it began. Shapes use start/end and swap corners in
 * Arabic. MEASURED: ink-700 body text on accent-100 = 8.52:1.
 *
 * The button points at the WhatsApp number from the copy file. That is the
 * academy's real published contact channel, so it is a working action rather
 * than a link to a form that does not exist yet.
 */
export async function JoinCta() {
  const t = await getTranslations('cta');
  const footer = await getTranslations('footer');
  const whatsapp = `https://wa.me/${footer('phone').replace(/[^0-9]/g, '')}`;

  return (
    <section id="contact" className="scroll-mt-20 bg-bg py-20 sm:py-24 lg:py-28">
      {/* A contained panel rather than a third run of centred text on a plain
          ground. The mission statement immediately above is already a centred
          block, and two in a row read as the same section twice. Giving the
          closing action its own surface makes it land as a deliberate end to
          the page. Copy and structure are unchanged; only the container is. */}
      <div className="mx-auto w-full max-w-4xl px-5">
        <div className="reveal relative isolate overflow-hidden rounded-lg bg-accent-100 px-6 py-14 text-center sm:px-12 sm:py-20">
          {/* Navy arcs, top-start corner. */}
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
          {/* Gold sun-disc rising from the bottom-end corner. */}
          <div
            aria-hidden="true"
            className="absolute -end-10 -bottom-14 -z-10 aspect-square w-28 rounded-full bg-accent-300 sm:-end-16 sm:-bottom-20 sm:w-60"
          />
          {/* Green spark, top-end. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 40 40"
            className="absolute end-[9%] top-5 -z-10 w-6 sm:top-8 text-primary-500 sm:w-9"
            fill="currentColor"
          >
            <path d="M20 0l4.5 15.5L40 20l-15.5 4.5L20 40l-4.5-15.5L0 20l15.5-4.5z" />
          </svg>

          <h2 className="text-3xl leading-[1.1] font-black tracking-tight text-ink-900 text-balance sm:text-4xl lg:text-[2.75rem]">
            {t('title')}
          </h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-base leading-relaxed text-ink-700 sm:text-lg">
            {t('body')}
          </p>
          <a
            href={whatsapp}
            className="mt-9 inline-flex min-h-13 items-center justify-center rounded-full bg-attention-400 px-8 text-base font-bold text-ink-900 shadow-[0_8px_24px_rgb(232_113_31/0.28)] transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
          >
            {t('button')}
          </a>
        </div>
      </div>
    </section>
  );
}
