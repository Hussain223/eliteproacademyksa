import { getTranslations } from 'next-intl/server';

/**
 * Section 2 of the copy file — the four reasons to choose the academy.
 *
 * NOTE ON THE MISSING HEADING: the copy file gives the four block titles and
 * bodies in both languages, but no section heading in Arabic ("Why Choose Us"
 * appears only as the document's own section marker). Rather than invent an
 * Arabic title, the four blocks carry the section on their own. If the client
 * wants a heading here, it needs writing in both languages first.
 *
 * Light warm ground, as agreed: the hero is the only dark band at the top of
 * the page, and everything below it stays readable.
 */

const ITEMS = ['coaches', 'space', 'everyChild', 'beyond'] as const;

export async function WhyChooseUs() {
  const t = await getTranslations('why');

  return (
    <section id="why" className="scroll-mt-20 bg-bg py-20 sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-5">
        <ul className="grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:gap-x-20 lg:gap-y-14">
          {ITEMS.map((key) => (
            <li
              key={key}
              className="reveal border-s-[3px] border-accent-500/70 ps-6 sm:ps-7"
            >
              <h3 className="text-xl leading-[1.15] font-bold tracking-tight text-ink-900 text-balance sm:text-2xl">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-3.5 max-w-[60ch] leading-relaxed text-ink-600">
                {t(`${key}.body`)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
