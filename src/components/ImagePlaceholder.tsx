/**
 * A visible stand-in for an image that does not exist yet.
 *
 * Deliberately not an empty box or a broken <img>: it holds the exact shape
 * and size the real photograph will occupy, and states the pixel size to
 * supply, so the layout can be judged now and the right asset generated later.
 *
 * Decorative by definition — there is no image here to describe — so it is
 * hidden from screen readers. The card's own title and body carry the meaning.
 *
 * Every use must carry a TODO naming exactly which photograph belongs in it.
 * Delete this component once all slots are filled.
 */
export function ImagePlaceholder({
  recommended,
  className = '',
}: {
  /** The pixel size to generate, e.g. "1200 × 900". Shown on the placeholder. */
  recommended: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center border-2 border-dashed border-primary-300 bg-primary-50 ${className}`}
    >
      <div className="flex flex-col items-center gap-1.5 p-4 text-primary-600">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7 opacity-70"
        >
          <rect x="3" y="4" width="18" height="16" rx="2.5" />
          <circle cx="8.5" cy="9.5" r="1.6" />
          <path d="M21 16l-5-5-5 5-2-2-6 6" />
        </svg>
        <span className="font-mono text-xs tracking-wide tabular-nums">
          {recommended}
        </span>
      </div>
    </div>
  );
}
