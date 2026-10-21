import { getTranslations } from 'next-intl/server';

/**
 * Section 4 of the copy file — the mission statement.
 *
 * The one dark band below the hero. It gives the page a rhythm (light,
 * tinted, dark, light) and ties the bottom half back to the hero's palette
 * without making the whole page dark, which would hurt readability.
 *
 * Follows the split "Soccer Camp" hero (approved 21 Oct 2026): the same
 * solid deep-green panel as the hero's copy side, with the hero's thin rings
 * and gold spark in opposite corners. Both are placed with start/end, so they
 * swap corners in Arabic.
 *
 * No gold accent word here: the copy file marks one in the hero headline but
 * not in this heading, and picking a word to highlight would be writing
 * design intent the client has not approved.
 */
export async function AboutMission() {
  const t = await getTranslations('about');

  return (
    <section
      id="about"
      className="relative isolate scroll-mt-20 overflow-hidden bg-primary-800 py-20 text-white sm:py-28 lg:py-32"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className="pointer-events-none absolute -start-20 -bottom-20 -z-10 w-56 text-primary-700 sm:w-72 lg:text-primary-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="100" cy="100" r="40" />
        <circle cx="100" cy="100" r="60" />
        <circle cx="100" cy="100" r="80" />
        <circle cx="100" cy="100" r="98" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 40 40"
        className="absolute end-[8%] top-12 -z-10 w-7 text-accent-300 sm:w-9"
        fill="currentColor"
      >
        <path d="M20 0l4.5 15.5L40 20l-15.5 4.5L20 40l-4.5-15.5L0 20l15.5-4.5z" />
      </svg>

      <div className="mx-auto w-full max-w-4xl px-5 text-center">
        <h2 className="reveal text-3xl leading-[1.1] font-black tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">
          {t('title')}
        </h2>
        <p className="reveal mx-auto mt-7 max-w-[62ch] text-base leading-[1.75] text-primary-100 sm:text-lg">
          {t('body')}
        </p>
        {/* A quiet gold rule, the one brand flourish this section needs. */}
        <span
          aria-hidden="true"
          className="reveal mx-auto mt-11 block h-1 w-12 rounded-full bg-accent-400"
        />
      </div>
    </section>
  );
}
