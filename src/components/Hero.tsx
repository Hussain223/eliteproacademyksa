import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

/**
 * The landing-page hero — the "Poster" direction approved on 4 Oct 2026.
 *
 * Composition: the athlete rises out of the dark backdrop and the headline
 * crosses in front of him, so type and image overlap rather than sitting in
 * tidy columns. He also bleeds off the bottom edge. Both are deliberate — the
 * figure is not meant to sit in a neat box.
 *
 * This section deliberately breaks the calm, restrained rules in
 * docs/design-system.md. Those govern the dashboard; the landing page is the
 * one place the brand goes visually loud. Don't "fix" this toward the
 * dashboard styling.
 *
 * MIRRORING: the athlete is offset toward the inline-END side, expressed with
 * logical properties, so in Arabic he moves to the opposite side on his own
 * and the headline still leads. There is no second layout for RTL.
 *
 * IMAGES ARE PLACEHOLDERS. These are AI-generated stand-ins to be replaced by
 * real academy photography (with guardian consent) before launch. Paths live
 * in one place — the constants below — so swapping them is a one-line change.
 */

const HERO_BACKDROP = '/images/hero-bg.webp';
const HERO_ATHLETE = '/images/hero-football-boy.webp';

export async function Hero() {
  const t = await getTranslations('hero');

  return (
    <section className="relative isolate overflow-hidden bg-[#07140d] text-white">
      {/* Backdrop. Decorative, so the alt text is deliberately empty — a screen
          reader announcing "abstract green background" helps nobody. */}
      <Image
        src={HERO_BACKDROP}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      {/* Darkening wash so the headline holds its contrast wherever the gold
          streaks in the backdrop happen to fall. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#07140d]/92 via-[#07140d]/72 to-[#07140d]/94"
      />

      <div className="mx-auto w-full max-w-6xl px-5">
        {/* On desktop the row is given a height and both columns are centred in
            it, so the text block and the athlete share one middle line. On
            phones it stays bottom-aligned and stacks, which is where the
            headline-above-figure reading order works best. */}
        <div className="grid items-end gap-0 pt-12 pb-0 sm:pt-16 lg:min-h-[min(88vh,900px)] lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:pt-20 lg:pb-20">
          {/* ---- copy: sits in front of the athlete ---- */}
          <div className="relative z-20">
            <h1 className="hero-rise text-4xl leading-[0.98] font-black tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
              {t('titleLead')}
              <span className="text-[#ddb52d]">{t('titleAccent')}</span>
            </h1>

            <p className="hero-rise hero-rise-2 mt-6 max-w-xl text-base leading-relaxed text-[#cdd8d0] sm:text-lg">
              {t('sub')}
            </p>

            <div className="hero-rise hero-rise-3 mt-8 flex flex-wrap gap-3">
              <a
                href="#programmes"
                className="inline-flex min-h-13 items-center justify-center rounded-full bg-[#e8711f] px-7 text-base font-bold text-[#1a0c04] transition-transform hover:scale-[1.03]"
              >
                {t('ctaPrimary')}
              </a>
              <a
                href="#contact"
                className="inline-flex min-h-13 items-center justify-center rounded-full border-[1.5px] border-white/35 px-7 text-base font-bold text-white transition-colors hover:bg-white/10"
              >
                {t('ctaSecondary')}
              </a>
            </div>
          </div>

          {/* ---- athlete: breaks the grid ----
              Negative inline-start margin pulls him under the headline; the
              bottom margin lets him run off the section edge. Both flip
              automatically in Arabic because they are logical properties. */}
          <div className="hero-rise hero-rise-2 relative z-10 -mt-10 flex justify-center lg:mt-0 lg:-ms-24 lg:justify-end">
            {/* On desktop he is sized by HEIGHT, not width. Capping the width
                keeps a fixed pixel size whatever the window does, so on a short
                screen he fills the row edge to edge and the breathing room
                disappears; tying him to viewport height keeps the margin above
                and below him roughly constant from 1280 to 1920. */}
            <Image
              src={HERO_ATHLETE}
              alt={t('athleteAlt')}
              width={1000}
              height={1500}
              priority
              sizes="(max-width: 1024px) 78vw, 36vw"
              className="h-auto w-[78%] max-w-[420px] origin-bottom drop-shadow-[0_26px_50px_rgba(0,0,0,0.55)] sm:max-w-[460px] lg:h-[min(68vh,660px)] lg:w-auto lg:max-w-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
