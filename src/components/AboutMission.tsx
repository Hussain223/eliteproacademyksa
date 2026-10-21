import { getTranslations } from 'next-intl/server';

/**
 * Section 4 of the copy file — the mission statement.
 *
 * The one dark band below the hero. It gives the page a rhythm (light,
 * tinted, dark, light) and ties the bottom half back to the hero's palette
 * without making the whole page dark, which would hurt readability.
 *
 * No gold accent word here: the copy file marks one in the hero headline but
 * not in this heading, and picking a word to highlight would be writing
 * design intent the client has not approved.
 */
export async function AboutMission() {
  const t = await getTranslations('about');

  return (
    <section id="about" className="scroll-mt-20 bg-[#07140d] py-20 text-white sm:py-28 lg:py-32">
      <div className="mx-auto w-full max-w-4xl px-5 text-center">
        <h2 className="reveal text-3xl leading-[1.1] font-black tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">
          {t('title')}
        </h2>
        <p className="reveal mx-auto mt-7 max-w-[62ch] text-base leading-[1.75] text-[#cdd8d0] sm:text-lg">
          {t('body')}
        </p>
        {/* A quiet gold rule, the one brand flourish this section needs. */}
        <span
          aria-hidden="true"
          className="reveal mx-auto mt-11 block h-px w-24 bg-accent-500"
        />
      </div>
    </section>
  );
}
