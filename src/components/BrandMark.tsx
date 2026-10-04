import Image from 'next/image';
import { useTranslations } from 'next-intl';

/**
 * The Elite Pro Academy logo — the real vector, supplied 4 Oct 2026.
 *
 * `unoptimized` is set because the file is already an SVG: it is resolution
 * independent and 2 KB, so running it through the image optimiser would cost
 * a round trip and give nothing back.
 *
 * This is the only file that references the logo artwork. If the mark is ever
 * revised, it changes here and nowhere else.
 */
export function BrandMark({ className }: { className?: string }) {
  const t = useTranslations('nav');

  return (
    <Image
      src="/images/logo.svg"
      alt={t('logoAlt')}
      width={277}
      height={305}
      unoptimized
      className={className}
    />
  );
}
