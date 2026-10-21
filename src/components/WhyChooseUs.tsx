import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

/**
 * Section 2 of the copy file — the four reasons to choose the academy.
 *
 * Styled to follow the split "Soccer Camp" hero (approved 21 Oct 2026): white
 * cards on the warm ground, each led by a small flat tile in one of the hero's
 * colours — navy, green, gold — carrying a simple football-world icon. Playful
 * through colour and shape, calm through layout.
 *
 * NOTE ON THE MISSING HEADING: the copy file gives the four block titles and
 * bodies in both languages, but no section heading in Arabic ("Why Choose Us"
 * appears only as the document's own section marker). Rather than invent an
 * Arabic title, the four blocks carry the section on their own. If the client
 * wants a heading here, it needs writing in both languages first.
 *
 * ICONS do not mirror in Arabic — none of them points anywhere. They are
 * decorative (aria-hidden); the title beside each one says what it means.
 */

const ITEMS = ['coaches', 'space', 'everyChild', 'beyond'] as const;
type Item = (typeof ITEMS)[number];

/** Tile colour + icon per item. Colours cycle navy, green, gold, deep green. */
const TILES: Record<Item, { tile: string; icon: ReactNode }> = {
  // A whistle — the coach.
  coaches: {
    tile: 'bg-navy-700 text-accent-300',
    icon: (
      <g fill="currentColor">
        <circle cx="12" cy="19" r="8.5" />
        <path d="M12 10.5h16v7h-9z" />
        <circle cx="12" cy="19" r="3" className="fill-navy-700" />
      </g>
    ),
  },
  // A pitch from above — the space.
  space: {
    tile: 'bg-primary-500 text-white',
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="2.2">
        <rect x="4" y="7" width="24" height="18" rx="2.5" />
        <line x1="16" y1="7" x2="16" y2="25" />
        <circle cx="16" cy="16" r="4" />
      </g>
    ),
  },
  // A heart — every child matters.
  everyChild: {
    tile: 'bg-accent-300 text-navy-700',
    icon: (
      <path
        d="M16 26s-9.5-5.6-9.5-12.2A5.3 5.3 0 0 1 16 10.6a5.3 5.3 0 0 1 9.5 3.2C25.5 20.4 16 26 16 26z"
        fill="currentColor"
      />
    ),
  },
  // The hero's four-point spark — aiming beyond today.
  beyond: {
    tile: 'bg-primary-800 text-accent-300',
    icon: <path d="M16 4l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill="currentColor" />,
  },
};

export async function WhyChooseUs() {
  const t = await getTranslations('why');

  return (
    <section
      id="why"
      className="relative isolate scroll-mt-20 overflow-hidden bg-bg py-20 sm:py-24 lg:py-28"
    >
      {/* One quiet echo of the hero's rings, so the page reads as one piece. */}
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
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {ITEMS.map((key) => (
            <li
              key={key}
              className="reveal rounded-lg bg-surface p-6 shadow-card ring-1 ring-line sm:p-7"
            >
              <span
                aria-hidden="true"
                className={`flex size-14 items-center justify-center rounded-md ${TILES[key].tile}`}
              >
                <svg viewBox="0 0 32 32" className="size-8">
                  {TILES[key].icon}
                </svg>
              </span>
              <h3 className="mt-5 text-xl leading-[1.15] font-bold tracking-tight text-balance text-ink-900">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-3 leading-relaxed text-ink-600">{t(`${key}.body`)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
