import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { ImagePlaceholder } from './ImagePlaceholder';

/**
 * Section 3 of the copy file — the intro line and the six programmes.
 *
 * IMAGE SLOTS ARE SQUARE (1:1), recommended source 1200 × 1200.
 *
 * Square is the compromise that suits what we have: the swimmer is already a
 * square photograph, and the two cut-out figures are portrait, so they stand
 * full-height on the tinted panel. A landscape slot would have suited none of
 * the three.
 *
 * Two treatments share that one shape:
 *   photo   — a real photograph with its own background, filling the slot.
 *   cutout  — a figure on transparency, standing on the tinted panel.
 *
 * Every image here is below the fold, so none is marked priority: Next.js
 * lazy-loads them by default and they do not compete with the hero.
 */

type Slot =
  | { kind: 'photo' | 'cutout'; src: string }
  | { kind: 'todo'; needs: string };

const PROGRAMS: { key: string; slot: Slot }[] = [
  // TODO(image): football — a child mid-play with a ball on the pitch, plain
  // studio background for a clean cut-out. 1200 × 1200.
  { key: 'football', slot: { kind: 'todo', needs: '1200 × 1200' } },

  { key: 'swimming', slot: { kind: 'photo', src: '/images/swimmer-boy.webp' } },
  { key: 'gymnastics', slot: { kind: 'cutout', src: '/images/gymnast-girl.webp' } },
  { key: 'martialArts', slot: { kind: 'cutout', src: '/images/karate-boy.webp' } },

  // TODO(image): nutrition & wellness — a child with healthy food, or a coach
  // talking a child through a meal plan. 1200 × 1200.
  { key: 'nutrition', slot: { kind: 'todo', needs: '1200 × 1200' } },

  // TODO(image): obesity solutions — a coach supporting a child through gentle
  // exercise. Must read as encouraging and dignified, never as a "before"
  // picture; this is the one image where the wrong shot does real harm.
  { key: 'obesity', slot: { kind: 'todo', needs: '1200 × 1200' } },
];

export async function Programs() {
  const t = await getTranslations('programs');

  return (
    <section
      id="programs"
      className="scroll-mt-20 border-y border-line bg-surface-2/60 py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto w-full max-w-6xl px-5">
        <h2 className="reveal max-w-3xl text-3xl leading-[1.08] font-bold tracking-tight text-ink-900 text-balance sm:text-4xl lg:text-[2.75rem]">
          {t('introTitle')}
        </h2>
        <p className="reveal mt-5 max-w-[62ch] text-lg leading-relaxed text-ink-600">
          {t('introBody')}
        </p>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map(({ key, slot }) => (
            <li
              key={key}
              className="reveal group flex flex-col overflow-hidden rounded-md border border-line bg-surface shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-accent-300 hover:shadow-raised motion-reduce:transform-none motion-reduce:transition-none"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-primary-50">
                {slot.kind === 'todo' ? (
                  <ImagePlaceholder recommended={slot.needs} className="h-full w-full" />
                ) : (
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
                )}
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
