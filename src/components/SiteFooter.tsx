import { getTranslations } from 'next-intl/server';

import { BrandMark } from './BrandMark';
import { LanguageSwitcher } from './LanguageSwitcher';

/**
 * Section 6 — the footer.
 *
 * Phone and email are verbatim from the copy file. The labels around them
 * ("Phone", "Follow us") are interface chrome rather than marketing copy, so
 * they were written here; if the client wants different wording they belong in
 * the copy file like everything else.
 *
 * SOCIAL LINKS: WhatsApp and email are built from the real published number
 * and address, so they work today. Instagram and Facebook are NOT links —
 * their URLs are unknown, and a button that silently goes nowhere is worse
 * than one that is visibly not connected yet. They render muted and are marked
 * unavailable to screen readers until the real profile URLs arrive.
 */

const ICONS = {
  whatsapp: (
    <path d="M12 2a9.9 9.9 0 00-8.5 15l-1.2 4.4 4.5-1.2A9.9 9.9 0 1012 2zm5.3 13.9c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1a12 12 0 01-4.9-4.3c-.4-.6-.9-1.5-.9-2.3s.4-1.3.6-1.5c.2-.2.4-.3.6-.3h.5c.2 0 .4 0 .5.4l.7 1.7c.1.2 0 .4-.1.5l-.3.4c-.1.1-.2.3-.1.5.3.6 1 1.5 1.7 2 .4.3.7.4.9.2l.5-.5c.2-.2.4-.2.5-.1l1.6.8c.2.1.3.2.3.3 0 .2 0 .5-.1.7z" />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" />
    </>
  ),
  facebook: (
    <path d="M14.5 8.5h2.2V5.6c-.4-.05-1.7-.17-3.2-.17-3.2 0-5.3 1.9-5.3 5.5v2.3H5.6v3.3h2.6v8.2h3.4v-8.2h2.7l.4-3.3h-3.1v-2c0-1 .3-1.7 1.9-1.7z" />
  ),
  email: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
} as const;

function SocialIcon({ name }: { name: keyof typeof ICONS }) {
  const filled = name === 'whatsapp' || name === 'facebook';
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name]}
    </svg>
  );
}

export async function SiteFooter() {
  const t = await getTranslations('footer');
  const brand = await getTranslations('brand');

  const phoneDigits = t('phone').replace(/[^0-9]/g, '');

  const live = [
    { key: 'whatsapp' as const, href: `https://wa.me/${phoneDigits}`, label: t('whatsapp') },
    { key: 'email' as const, href: `mailto:${t('email')}`, label: t('emailUs') },
  ];

  // TODO(links): replace with the academy's real profile URLs, then move these
  // into `live` above so they become working links.
  const pending = [
    { key: 'instagram' as const, label: t('instagram') },
    { key: 'facebook' as const, label: t('facebook') },
  ];

  return (
    <footer className="bg-[#07140d] text-white">
      <div className="mx-auto w-full max-w-6xl px-5 py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          {/* brand */}
          <div className="flex items-center gap-3">
            <BrandMark className="h-12 w-auto shrink-0" />
            <div>
              <p className="text-base font-bold">{brand('name')}</p>
              <p className="mt-0.5 text-sm text-[#cdd8d0]">{brand('tagline')}</p>
            </div>
          </div>

          {/* contact — verbatim from the copy file */}
          <div className="grid gap-5 sm:grid-cols-2 lg:gap-10">
            <div>
              <h2 className="text-xs font-bold tracking-widest text-accent-400 uppercase">
                {t('phoneLabel')}
              </h2>
              <a
                href={`tel:${phoneDigits}`}
                dir="ltr"
                className="mt-1.5 block text-base font-medium [unicode-bidi:plaintext] hover:text-accent-300"
              >
                {t('phone')}
              </a>
            </div>
            <div>
              <h2 className="text-xs font-bold tracking-widest text-accent-400 uppercase">
                {t('emailLabel')}
              </h2>
              <a
                href={`mailto:${t('email')}`}
                dir="ltr"
                className="mt-1.5 block text-base font-medium break-all [unicode-bidi:plaintext] hover:text-accent-300"
              >
                {t('email')}
              </a>
            </div>
          </div>
        </div>

        {/* social */}
        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-white/12 pt-8">
          <h2 className="text-xs font-bold tracking-widest text-accent-400 uppercase">
            {t('followLabel')}
          </h2>

          <ul className="flex flex-wrap items-center gap-2">
            {live.map((s) => (
              <li key={s.key}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-accent-400 hover:text-accent-300"
                >
                  <SocialIcon name={s.key} />
                </a>
              </li>
            ))}
            {pending.map((s) => (
              <li key={s.key}>
                <span
                  aria-disabled="true"
                  title={s.label}
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-dashed border-white/20 text-white/35"
                >
                  <SocialIcon name={s.key} />
                </span>
              </li>
            ))}
          </ul>

          <div className="ms-auto">
            <LanguageSwitcher tone="dark" />
          </div>
        </div>

        <p className="mt-8 text-xs text-[#8fa197]">
          © {new Date().getFullYear()} {t('rights')}
        </p>
      </div>
    </footer>
  );
}
