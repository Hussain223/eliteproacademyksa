'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

import { Link, usePathname } from '@/i18n/navigation';
import { localeLabels, routing, type Locale } from '@/i18n/routing';

/**
 * The language switch.
 *
 * Three rules from design-system.md are built in here:
 *  - It is obvious, labelled in each language's own name (العربية | English) —
 *    never a flag icon, which stands for a country rather than a language.
 *  - It keeps the visitor on the page they were reading. `usePathname` returns
 *    the path without the language prefix, so we re-link the same page in the
 *    other language instead of dumping them on the home page.
 *  - It never signs anyone out. In Phase 3 the chosen language is also saved to
 *    the user's profile; the switch itself stays a plain link.
 *
 * Touch targets are 44px tall — above the WCAG minimum, because this is a
 * control people use on a phone.
 */
/**
 * `tone` exists because the switch appears twice: in the light header and
 * again in the dark footer. The light styling puts dark grey on the inactive
 * language, which is invisible on the footer's near-black ground.
 */
export function LanguageSwitcher({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const pathname = usePathname();
  const active = useLocale();
  const t = useTranslations('common');

  return (
    <nav aria-label={t('switchLanguage')}>
      <ul className="flex items-center gap-1">
        {routing.locales.map((locale) => {
          const isActive = locale === active;
          const inactive =
            tone === 'dark'
              ? 'text-[#cdd8d0] hover:bg-white/10'
              : 'text-ink-600 hover:bg-ink-100';
          return (
            <li key={locale}>
              <Link
                href={pathname}
                locale={locale}
                lang={locale}
                aria-current={isActive ? 'true' : undefined}
                className={[
                  'flex min-h-11 items-center rounded-md px-4 text-sm font-medium transition-colors',
                  isActive ? 'bg-primary-500 text-white' : inactive,
                ].join(' ')}
              >
                {localeLabels[locale as Locale]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
