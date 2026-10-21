import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

/**
 * Section 3 of the copy file — the intro line and the six programmes.
 *
 * IMAGE SLOTS ARE SQUARE (1:1), recommended source 1200 × 1200.
 *
 * Square is the compromise that suits what we have: the swimmer and nutrition
 * shots are square photographs, and the cut-out figures are portrait, so they stand
 * full-height on the tinted panel. A landscape slot would have suited none of
 * the three.
 *
 * Two treatments share that one shape:
 *   photo   — a real photograph with its own background, filling the slot.
 *   cutout  — a figure on transparency, standing on the tinted panel.
 *
 * Styled to follow the split "Soccer Camp" hero (approved 21 Oct 2026): a
 * cut-out figure stands on the same sand stage and gold sun-disc as the hero
 * athlete, so all the children on the page belong to one world. Photographs
 * with their own background fill the slot as before.
 *
 * Every image here is below the fold, so none is marked priority: Next.js
 * lazy-loads them by default and they do not compete with the hero.
 */

type Slot = { kind: 'photo' | 'cutout'; src: string };

const PROGRAMS: { key: string; slot: Slot }[] = [
  { key: 'football', slot: { kind: 'cutout', src: '/images/football-boy.webp' } },
  { key: 'swimming', slot: { kind: 'photo', src: '/images/swimmer-boy.webp' } },
  { key: 'gymnastics', slot: { kind: 'cutout', src: '/images/gymnastics-girl.webp' } },
  { key: 'martialArts', slot: { kind: 'cutout', src: '/images/karate-boy.webp' } },
  { key: 'nutrition', slot: { kind: 'photo', src: '/images/nutrition-boy.webp' } },

  // Obesity solutions: a child jumping for joy — active and encouraging, never
  // a "before" picture. This is the one slot where the wrong shot does harm.
  { key: 'obesity', slot: { kind: 'cutout', src: '/images/jumping-boy.webp' } },
];

export async function Programs() {
  const t = await getTranslations('programs');

  return (
    <section
      id="programs"
      className="scroll-mt-20 border-y border-line bg-surface-2/60 py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto w-full max-w-6xl px-5">
        <span aria-hidden="true" className="reveal block h-1 w-12 rounded-full bg-accent-400" />
        <h2 className="reveal mt-5 max-w-3xl text-3xl leading-[1.08] font-bold tracking-tight text-ink-900 text-balance sm:text-4xl lg:text-[2.75rem]">
          {t('introTitle')}
        </h2>
        <p className="reveal mt-5 max-w-[62ch] text-lg leading-relaxed text-ink-600">
          {t('introBody')}
        </p>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map(({ key, slot }) => (
            <li
              key={key}
              className="reveal group flex flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-accent-300 hover:shadow-raised motion-reduce:transform-none motion-reduce:transition-none"
            >
              <div
                className={`relative isolate aspect-square w-full overflow-hidden ${slot.kind === 'cutout' ? 'bg-accent-100' : 'bg-primary-50'}`}
              >
                {/* The hero's sun-disc, behind cut-out figures only. */}
                {slot.kind === 'cutout' && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[14%] -z-10 mx-auto aspect-square w-[74%] rounded-full bg-accent-300"
                  />
                )}
                <Image
                  src={slot.src}
                  alt={t(`${key}.alt`)}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 360px"
                  className={
                    slot.kind === 'photo'
                      ? 'object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none'
                      : 'object-contain object-bottom p-2 transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transform-none'
                  }
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg leading-snug font-bold tracking-tight text-ink-900 text-balance">
                  {t(`${key}.name`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {t(`${key}.body`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
