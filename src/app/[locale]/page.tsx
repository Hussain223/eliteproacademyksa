import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AboutMission } from '@/components/AboutMission';
import { Coaches } from '@/components/Coaches';
import { Events } from '@/components/Events';
import { Hero } from '@/components/Hero';
import { JoinCta } from '@/components/JoinCta';
import { Programs } from '@/components/Programs';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { routing } from '@/i18n/routing';

/**
 * The public landing page — module 1 of docs/product.md.
 *
 * Every word on this page comes from docs/elite_pro_academy_landing_page_copy.md
 * through next-intl, in both languages. Nothing is written here and nothing is
 * baked into an image.
 *
 * The seven [NEEDS INPUT] items at the end of that file — fees, locations,
 * coach certifications, whether the Olympic pathway is an established
 * programme or an ambition, and the rest — appear nowhere on this page. They
 * are open questions for the client, not gaps to fill with plausible text.
 *
 * Section order follows the copy file — hero, why choose us, programmes,
 * mission, call to action, footer — with two additions after programmes
 * (21 Oct 2026): coaches, then events. Their copy is not in the copy file; it
 * was written for them and approved 22 Oct 2026 (see "_source" in messages).
 *
 * Band rhythm is deliberate. The hero is dark; below it the page alternates
 * warm light, tinted, warm light (coaches), tinted (events), dark, warm light,
 * dark footer — so the mission statement ties back to the hero's palette
 * without making the whole page dark and hard to read.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const brand = await getTranslations({ locale, namespace: 'brand' });
  const hero = await getTranslations({ locale, namespace: 'hero' });

  return {
    title: `${brand('name')} — ${brand('tagline')}`,
    description: hero('sub'),
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <WhyChooseUs />
        <Programs />
        <Coaches />
        <Events />
        <AboutMission />
        <JoinCta />
      </main>
      <SiteFooter />
    </div>
  );
}
