/**
 * A small arrow pointing toward the end of the line — right in English, left in
 * Arabic. Direction-bearing icons must mirror (docs/design-system.md), and
 * `rtl:-scale-x-100` is the one place that happens, so no caller has to
 * remember. Use `back` for an arrow pointing toward the start instead.
 *
 * Decorative: the link text beside it says where it goes.
 */
export function ArrowEnd({ back = false, className = 'size-4' }: { back?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${back ? '-scale-x-100 rtl:scale-x-100' : 'rtl:-scale-x-100'} ${className}`}
    >
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}
