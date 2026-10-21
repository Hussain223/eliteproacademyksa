'use client';

import { useTranslations } from 'next-intl';

/**
 * LOADING STATE for a coach profile.
 *
 * Shown while moving to a profile from another page on a slow connection, and
 * — once profiles come from the database — while that query runs. A skeleton
 * in the page's real shape rather than a spinner, so nothing jumps when the
 * content lands. The text is for screen readers; sighted visitors see the
 * pulsing shapes.
 *
 * No header or footer here: Next.js shows this in place of the page only, and
 * the page brings its own.
 *
 * A CLIENT COMPONENT ON PURPOSE. It reads its words from the translations the
 * layout already sent to the browser. As a server component it would have to
 * look the language up from the request instead, and that alone forces every
 * coach profile to be rebuilt on each visit rather than built once in advance.
 */
export default function CoachProfileLoading() {
  const t = useTranslations('coachProfile');

  return (
    <div role="status" aria-live="polite" className="min-h-dvh bg-bg">
      <span className="sr-only">{t('loading')}</span>
      <div
        aria-hidden="true"
        className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-24 motion-safe:animate-pulse md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14"
      >
        <div className="aspect-[4/5] rounded-lg bg-surface-2" />
        <div className="space-y-4">
          <div className="h-4 w-24 rounded-full bg-surface-2" />
          <div className="h-12 w-3/4 rounded-md bg-surface-2" />
          <div className="h-5 w-full rounded-full bg-surface-2" />
          <div className="h-5 w-5/6 rounded-full bg-surface-2" />
        </div>
      </div>
    </div>
  );
}
