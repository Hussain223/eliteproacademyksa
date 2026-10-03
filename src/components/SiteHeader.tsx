import { useTranslations } from 'next-intl';

import { BrandMark } from './BrandMark';
import { LanguageSwitcher } from './LanguageSwitcher';

/**
 * The public site header.
 *
 * In-page links only — there is nothing to sign in to until Phase 3, so
 * "Sign in" points at the portal section rather than a dead route. A link that
 * goes nowhere is worse than one that explains itself.
 */
export function SiteHeader() {
  const t = useTranslations('nav');
  const brand = useTranslations('brand');

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/92 backdrop-blur-sm">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-2.5">
        <a
          href="#top"
          className="flex items-center gap-2.5 text-primary-600 me-auto"
        >
          <BrandMark className="h-9 w-9 shrink-0" />
          <span className="text-base leading-tight font-semibold text-ink-900">
            {brand('name')}
          </span>
        </a>

        <nav aria-label={t('menu')} className="hidden items-center gap-1 md:flex">
          {(['programmes', 'approach', 'contact'] as const).map((key) => (
            <a
              key={key}
              href={`#${key}`}
              className="flex min-h-11 items-center rounded-sm px-3 text-sm font-medium text-ink-600 transition-colors hover:bg-surface-2 hover:text-ink-900"
            >
              {t(key)}
            </a>
          ))}
        </nav>

        <LanguageSwitcher />
      </div>
    </header>
  );
}
