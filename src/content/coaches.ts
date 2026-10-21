import type { Locale } from '@/i18n/routing';

/**
 * The coaches shown on the public site — the landing-page section and the
 * public profile pages at /[locale]/coaches/[id].
 *
 * THIS IS MARKETING CONTENT, NOT THE APP'S COACH RECORD. The academy system
 * (Phase 3 onward) will have its own coaches table with logins, assignments and
 * permissions. This file is only what a visitor sees. When the public profiles
 * move into the database, the shape below is what the query must return, and
 * nothing that renders it needs to change.
 *
 * EVERY ENTRY IS A PLACEHOLDER. TODO(content): replace with the academy's real
 * coaches — name, sport, a tagline and a short bio written with each coach, and
 * a portrait photo (with the coach's consent). The ids become the URL, so the
 * real ones should be readable, e.g. "ahmed-alharbi".
 *
 * CREDENTIALS ARE DELIBERATELY null. Which qualifications and certifications
 * the coaches hold is an open [NEEDS INPUT] item in the copy file. Nothing may be
 * written here until the academy confirms it in writing — a made-up
 * certification on a children's academy site is a real liability.
 *
 * The taglines and bios below are role descriptions, not claims: no years of
 * experience, no titles, no results.
 */

type Localized = Record<Locale, string>;

/** The four sports with a coach, keyed to the programme names in messages. */
export type CoachSport = 'football' | 'swimming' | 'gymnastics' | 'martialArts';

export type Coach = {
  /** URL segment: /coaches/<id>. */
  id: string;
  sport: CoachSport;
  name: Localized;
  tagline: Localized;
  bio: Localized;
  /** Path under /public, or null while the photo is still to come. */
  photo: string | null;
  /** Written now so it is ready the day the photo arrives; rewrite to match it. */
  photoAlt: Localized;
  /** null = not yet confirmed by the academy. Never fill this in by guessing. */
  credentials: Localized[] | null;
};

const PLACEHOLDER_NAME: Localized = { en: 'Coach name', ar: 'اسم المدرب' };

export const COACHES: Coach[] = [
  {
    id: 'football-coach', // TODO(content): real coach
    sport: 'football',
    name: PLACEHOLDER_NAME,
    tagline: {
      en: 'Guides young players through every session on the pitch.',
      ar: 'يرافق اللاعبين الصغار في كل حصة على أرض الملعب.',
    },
    bio: {
      en: 'Leads the academy’s football sessions, helping children build their skills, play as a team, and grow in confidence with every match.',
      ar: 'يقود حصص كرة القدم في الأكاديمية، ويساعد الأطفال على تطوير مهاراتهم، واللعب بروح الفريق، واكتساب الثقة مع كل مباراة.',
    },
    photo: null, // TODO(image): portrait of the football coach, 1000 × 1250
    photoAlt: {
      en: 'Portrait of the academy’s football coach',
      ar: 'صورة لمدرب كرة القدم في الأكاديمية',
    },
    credentials: null, // NEEDS INPUT
  },
  {
    id: 'swimming-coach', // TODO(content): real coach
    sport: 'swimming',
    name: PLACEHOLDER_NAME,
    tagline: {
      en: 'Helps every child feel safe and confident in the water.',
      ar: 'يساعد كل طفل على الشعور بالأمان والثقة في الماء.',
    },
    bio: {
      en: 'Leads the academy’s swimming sessions, building water skills step by step at a pace that suits each child.',
      ar: 'يقود حصص السباحة في الأكاديمية، ويطوّر مهارات السباحة خطوة بخطوة وبوتيرة تناسب كل طفل.',
    },
    photo: null, // TODO(image): portrait of the swimming coach, 1000 × 1250
    photoAlt: {
      en: 'Portrait of the academy’s swimming coach',
      ar: 'صورة لمدرب السباحة في الأكاديمية',
    },
    credentials: null, // NEEDS INPUT
  },
  {
    id: 'gymnastics-coach', // TODO(content): real coach
    sport: 'gymnastics',
    name: PLACEHOLDER_NAME,
    tagline: {
      en: 'Builds strength, balance and flexibility, one move at a time.',
      ar: 'يبني القوة والتوازن والمرونة، حركةً بعد حركة.',
    },
    bio: {
      en: 'Leads the academy’s gymnastics sessions, helping children develop body awareness, control and the confidence to try something new.',
      ar: 'يقود حصص الجمباز في الأكاديمية، ويساعد الأطفال على تنمية الوعي بأجسامهم والتحكم في حركتهم والثقة لتجربة الجديد.',
    },
    photo: null, // TODO(image): portrait of the gymnastics coach, 1000 × 1250
    photoAlt: {
      en: 'Portrait of the academy’s gymnastics coach',
      ar: 'صورة لمدرب الجمباز في الأكاديمية',
    },
    credentials: null, // NEEDS INPUT
  },
  {
    id: 'martial-arts-coach', // TODO(content): real coach
    sport: 'martialArts',
    name: PLACEHOLDER_NAME,
    tagline: {
      en: 'Teaches focus, discipline and respect on the mat.',
      ar: 'يعلّم التركيز والانضباط والاحترام على البساط.',
    },
    bio: {
      en: 'Leads the academy’s martial arts sessions, helping children build discipline, focus and self-confidence through structured practice.',
      ar: 'يقود حصص الفنون القتالية في الأكاديمية، ويساعد الأطفال على اكتساب الانضباط والتركيز والثقة بالنفس من خلال تدريب منظّم.',
    },
    photo: null, // TODO(image): portrait of the martial arts coach, 1000 × 1250
    photoAlt: {
      en: 'Portrait of the academy’s martial arts coach',
      ar: 'صورة لمدرب الفنون القتالية في الأكاديمية',
    },
    credentials: null, // NEEDS INPUT
  },
];

export function findCoach(id: string): Coach | undefined {
  return COACHES.find((c) => c.id === id);
}
