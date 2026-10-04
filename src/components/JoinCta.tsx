import { getTranslations } from 'next-intl/server';

/**
 * Section 5 of the copy file — the closing call to action.
 *
 * Orange appears here and in the hero and nowhere else, which is the whole
 * point of an attention colour: two uses on the page, both the primary action.
 * Dark text on the orange, because white text fails contrast on every orange
 * bright enough to be worth using (measured: 3.08:1 against 6.20:1).
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
        <div className="reveal rounded-lg border border-line bg-surface px-6 py-12 text-center shadow-card sm:px-12 sm:py-16">
          <h2 className="text-3xl leading-[1.1] font-black tracking-tight text-ink-900 text-balance sm:text-4xl lg:text-[2.75rem]">
            {t('title')}
          </h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-base leading-relaxed text-ink-600 sm:text-lg">
            {t('body')}
          </p>
          <a
            href={whatsapp}
            className="mt-9 inline-flex min-h-13 items-center justify-center rounded-full bg-[#e8711f] px-8 text-base font-bold text-[#1a0c04] transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
          >
            {t('button')}
          </a>
        </div>
      </div>
    </section>
  );
}
