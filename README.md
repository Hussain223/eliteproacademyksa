# Elite Pro Academy — Platform

A bilingual (Arabic/English) web platform for Elite Pro Academy, a youth sports
academy in Saudi Arabia.

**Start here:** [`CLAUDE.md`](./CLAUDE.md) is the standing brief. The detail
lives in [`/docs`](./docs):

| File | What's in it |
|---|---|
| [`docs/product.md`](./docs/product.md) | What the product does, the five roles, every resolved decision |
| [`docs/data-model.md`](./docs/data-model.md) | Entities, relationships, and who may read/write what |
| [`docs/design-system.md`](./docs/design-system.md) | Brand, tokens, components, RTL and responsive rules |
| [`docs/build-plan.md`](./docs/build-plan.md) | The phased build order and the "done" bar |

---

## Current status: Phase 0 complete

Phase 0 is the foundations — a deployable skeleton with the bilingual framework
in place. **There are no features yet, and the look is not designed yet.** The
page you see is a deliberately plain placeholder that proves the plumbing works.

The visual direction is chosen by the client in Phase 1, before any feature
screen is built.

**No database tables exist yet, and no personal data is stored anywhere.**

---

## Running it on your machine

You need [Node.js](https://nodejs.org) version 20.9 or newer. To check what you
have, open a terminal and run `node -v`.

```bash
# 1. Get the code
git clone https://github.com/hussain223/eliteproacademyksa.git
cd eliteproacademyksa

# 2. Install the libraries it depends on (one time, a minute or two)
npm install

# 3. Start it
npm run dev
```

Then open **http://localhost:3000** in your browser.

To stop it, press `Ctrl` and `C` together in the terminal.

### Seeing both languages

- English: <http://localhost:3000/en>
- Arabic: <http://localhost:3000/ar>

Or use the language buttons at the top of the page. Switching language should
flip the entire layout — text moves to the right, the tick marks in the list
move to the right, the coloured bar on the warning box moves to the right. If
anything stays stubbornly on the left in Arabic, that is a bug worth reporting.

---

## The commands, and what each one does

| Command | What it does |
|---|---|
| `npm run dev` | Runs the site locally while you work. Updates as files change. |
| `npm run build` | Builds the production version. If this fails, the site will not deploy. |
| `npm run start` | Runs the built production version locally. |
| `npm run lint` | Checks for code mistakes and bad patterns. |
| `npm run typecheck` | Checks the code is internally consistent before it ever runs. |
| `npm run check:rtl` | **Checks nothing will break in Arabic.** See below. |
| `npm run check` | Runs all of the above in order. Run this before opening a pull request. |

### `npm run check:rtl` — the Arabic safety net

Arabic reads right-to-left, so a layout pinned to "the left" breaks in Arabic.
The fix is to write "the side the text starts on" instead of "the left", which
flips by itself.

Getting that right once is easy. Remembering it on every component for years is
not — so this check remembers instead of us. It scans the code, and if it finds
anything frozen to one side it fails the build and tells you the replacement to
use.

This is the bilingual non-negotiable from `CLAUDE.md`, made mechanical. It runs
automatically on every pull request.

---

## How changes get made

Per `CLAUDE.md`: one feature at a time, on its own branch.

1. A branch is created for the change.
2. `npm run check` must pass.
3. A pull request is opened, and Hussain reviews it.
4. On merge to `main`, Vercel deploys it automatically.

`main` is always deployable. The CI checks in
[`.github/workflows/ci.yml`](./.github/workflows/ci.yml) run on every pull
request, so a branch that would break the live site fails before review.

---

## How the project is laid out

```
CLAUDE.md                     the standing brief — read first
docs/                         product, data model, design system, build plan
messages/
  en.json  ar.json            all user-facing text, both languages
src/
  app/
    globals.css               design tokens — every colour and size, named once
    [locale]/
      layout.tsx              sets page language + direction
      page.tsx                the Phase 0 placeholder (deleted in Phase 2)
  components/
    LanguageSwitcher.tsx      the العربية | English control
  i18n/
    routing.ts                the two languages, defined once
    navigation.ts             language-aware links
    request.ts                loads the right translations per request
  proxy.ts                    puts the language in the URL on every request
scripts/
  check-logical-css.mjs       the Arabic safety net
.github/workflows/ci.yml      checks that run on every pull request
.env.example                  the environment variables, documented
```

### Two rules worth knowing

**All text lives in `messages/`.** Never type a sentence directly into a screen
— if it is not in both `en.json` and `ar.json`, it cannot be translated. This is
also how a non-developer can later review the Arabic wording in one place.

**All colours and sizes live in `src/app/globals.css`.** Never hardcode a colour
in a screen. When the client approves a direction in Phase 1, or rebrands in
three years, we change those values once and the whole platform follows.

---

## Known limitations, deliberately accepted

These are recorded so they are not mistaken for oversights.

- **The colours are placeholders.** They are the right *roles* — green primary,
  gold accent, navy neutral, orange attention — with provisional values. The
  real brand values replace them in Phase 2.
- **The typefaces are provisional.** IBM Plex Sans / IBM Plex Sans Arabic, chosen
  because they pair Latin and Arabic properly. Final choice follows the approved
  Phase 1 direction.
- **TypeScript is pinned to 6.0.3, not the newer 7.0.2.** The linting toolchain
  does not support TypeScript 7 yet. Revisit when
  [typescript-eslint#10940](https://github.com/typescript-eslint/typescript-eslint/issues/10940)
  closes.
- **ESLint is pinned to 9.x, not 10.** The React plugin bundled with Next.js does
  not support ESLint 10 yet. It prints a "no longer supported" notice on install;
  that is expected, and 9.x is the version the Next.js toolchain actually works
  with today.
- **No Supabase code yet.** The database arrives in Phase 3, with Row Level
  Security switched on from the very first table.
