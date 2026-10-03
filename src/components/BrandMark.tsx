/**
 * PLACEHOLDER LOGO.
 *
 * A figure inside a circle, echoing the shape design-system.md describes (the
 * gold + green figure-in-a-circle mark) without pretending to be it. It is
 * drawn rather than bitmapped so it stays crisp at any size.
 *
 * This is the ONE file to change when the real vector arrives. Nothing else
 * references the logo artwork.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false" className={className}>
      <circle cx="24" cy="24" r="22.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="14.5" r="4" className="fill-accent-500" />
      <path
        d="M24 20.5c-4.2 0-7 2.4-7.6 6.2l-.9 5.6h4.1l.7 8.2h7.4l.7-8.2h4.1l-.9-5.6c-.6-3.8-3.4-6.2-7.6-6.2z"
        fill="currentColor"
      />
    </svg>
  );
}
