import Image from 'next/image';

import type { Coach } from '@/content/coaches';
import type { Locale } from '@/i18n/routing';

import { ImagePlaceholder } from './ImagePlaceholder';

/**
 * A coach's portrait, or the sized placeholder until the real photo arrives.
 *
 * PORTRAIT SLOT, 4:5, recommended source 1000 × 1250. Used by the landing-page
 * card and the profile page, so both stay the same shape and one photo serves
 * both.
 */
export function CoachPhoto({
  coach,
  locale,
  sizes,
  priority = false,
}: {
  coach: Coach;
  locale: Locale;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-accent-100">
      {coach.photo ? (
        <Image
          src={coach.photo}
          alt={coach.photoAlt[locale]}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        // TODO(image): the coach's portrait — see the TODO on this coach in
        // src/content/coaches.ts.
        <ImagePlaceholder recommended="1000 × 1250" className="h-full w-full" />
      )}
    </div>
  );
}
