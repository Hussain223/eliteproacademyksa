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
    <section id="contact" className="scroll-mt-20 bg-bg py-18 sm:py-24">
      <div className="mx-auto w-full max-w-3xl px-5 text-center">
        <h2 className="text-3xl font-black tracking-tight text-ink-900 text-balance sm:text-4xl lg:text-5xl">
          {t('title')}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-ink-600 sm:text-lg">
          {t('body')}
        </p>
        <a
          href={whatsapp}
          className="mt-9 inline-flex min-h-13 items-center justify-center rounded-full bg-[#e8711f] px-8 text-base font-bold text-[#1a0c04] transition-transform hover:scale-[1.03]"
        >
          {t('button')}
        </a>
      </div>
    </section>
  );
}
