# design-system.md — Elite Pro Academy Platform

How the platform looks and behaves visually. This exists so screens are consistent
and fast to build — define the system once, reuse it everywhere. **Do not style
screens individually.**

**Important:** the *exact* tokens below are a **starting direction**, not final.
The final look is set by the client-approved mockup direction (Phase 1 of the build
plan). Once that's chosen, lock these values to match it. Until then, build the
mockups from this direction.

---

## Brand

- **Name:** Elite Pro Academy — أكاديمية إيليت برو
- **Logo:** the gold + green figure-in-a-circle mark. The fixed anchor. **Get it as
  SVG** (currently raster only) before it goes into the shell — a fuzzy logo
  cheapens every screen.
- **Tagline:** "More than play, we build the way" / "أكثر من مجرد لعب، نحن نبني الطريق"
- **Feel:** premium, athletic, trustworthy, calm, modern. A parent must trust it
  with their child's information. **Not** a children's gaming app, not a generic
  admin panel, not crypto-SaaS.
- The existing print materials are **brand-colour/logo source only** — their
  execution (noisy textures, photo montages, mixed fonts) is explicitly **not** a
  design reference. This is a rebrand-in-software.

---

## Colour discipline

The print materials used four loud colours fighting each other — a big part of why
they look unprofessional. The platform imposes order: **one primary, one accent,
one deep neutral, one single attention colour.**

- **Primary — green.** Main actions, active states, brand presence, links.
- **Accent — gold.** Premium highlight, selected emphasis, small celebratory moments.
  Not for large fills.
- **Neutral/depth — navy.** Primary text, headers, depth. The workhorse dark.
- **Attention — orange.** **One** job: draw the eye to a single important thing
  (a critical alert, a primary empty-state CTA). Never a fourth brand colour
  sprinkled around.
- **Greys** — a proper neutral ramp for backgrounds, cards, borders, secondary text.

**Semantic colours** (separate from brand): success = green-tone, warning =
amber/orange, error = red, info = blue. Because orange is both the attention colour
*and* near the warning tone, keep semantic warning visually distinct (or lean on an
icon + label so they never read as the same thing).

**Hard rule — never communicate status by colour alone.** A red dot is not enough;
it's a red dot **+ "Absent"**. This is both an accessibility requirement and a
clarity one.

Define every colour as a **design token** (e.g. `--color-primary`,
`--color-accent`, `--color-attention`, `--color-text`, `--color-bg`,
`--color-border`, `--color-success/warning/error/info`). Future client re-branding
should be a token change, not a find-and-replace.

---

## Typography

- **One font system that handles Arabic and English well.** Do not pair random
  per-component fonts. A typeface with strong Arabic and Latin support (e.g. an
  IBM Plex Sans Arabic / Cairo / Noto Sans Arabic-class family for Arabic, matched
  with a clean Latin) — final choice tied to the approved mockup.
- **Arabic legibility is a first-class requirement, not an afterthought.** Test real
  Arabic at every size; Arabic needs comfortable line-height.
- Clear hierarchy, defined as tokens: Display, H1, H2, H3, Body, Secondary, Caption,
  Label. Avoid tiny secondary text.

---

## Spacing, radius, shadow, motion — all tokens

- **Spacing:** one consistent scale (e.g. 4/8-based). No arbitrary pixel values
  scattered in components.
- **Radius:** a small set (e.g. sm/md/lg/full). Pick one personality and hold it.
- **Shadow:** a restrained set. The print work drowned in drop shadows — the platform
  stays flatter and calmer.
- **Motion:** subtle, purposeful (page/modal transitions, expand/collapse, loading,
  success). No floating elements, no parallax, no animated backgrounds. **Respect
  `prefers-reduced-motion`.**

Centralise all of these as tokens so nothing is hardcoded per screen.

---

## Bilingual / RTL — architectural, from day one

Arabic (RTL) and English (LTR) are both first-class. This is wired into the app
before any UI (build-plan Phase 0). **Never build English then "flip it."**

- **Use logical CSS properties**, always: `margin-inline-start` not `margin-left`,
  `padding-inline`, `inset-inline-start`, `text-align: start`. The layout then
  mirrors correctly by direction with no per-screen rework.
- **Mirror** what should mirror: navigation side, sidebar placement, breadcrumbs,
  back arrows, progress direction.
- **Do not mirror** universal icons: search, play, most media, brand marks.
  Direction-bearing icons (back/forward, next/prev) **do** mirror.
- **Numbers, dates, phone numbers, IDs** — handle deliberately; they don't simply
  flip.
- **Charts stay readable** in both directions.
- **Language switch** is obvious (العربية | English), updates text + direction,
  preserves the current page and form state where practical, stores the preference
  per user, and **never forces a logout.**
- **Test both languages on every screen.** Arabic text is often longer than the
  English — design for it, don't assume it fits.

---

## Responsive — mobile-first, genuinely

Design for mobile first and let it grow up — **do not** design desktop and shrink.
Guidance ranges (not rigid device breakpoints): mobile 320–767, tablet 768–1023,
desktop 1024+, large 1440+. Use flexible layouts, not hardcoded device sizes.

- **The page itself never scrolls horizontally.** Content reflows to fit a ~320px
  viewport (a WCAG 2.2 reflow requirement). Wide content (a data table, a code
  block) may scroll **inside its own container** — the page body must not.
- **Tables → cards on mobile.** A 12-column table does not horizontally overflow the
  page on a phone. Desktop: full table. Tablet: drop secondary columns. Mobile:
  stack each row into a card. Controlled horizontal scroll inside a container is
  acceptable only where horizontal comparison is genuinely essential.
- **Navigation differs by device and role** — don't force one model. Desktop: sidebar
  + top bar. Mobile: compact top bar + bottom nav or a drawer, with the items that
  matter to *that role* (e.g. parent: Home / Progress / Reports / Profile; coach:
  Today / Children / Assessments / More).

---

## Touch & accessibility (WCAG 2.2 AA as the bar)

- **Touch targets:** 24×24 CSS px is the AA minimum (2.5.8); **prefer ~44×44** for
  important controls — nav, buttons, checkboxes, attendance/assessment controls,
  calendar selection, icon buttons. No tiny icon-only taps.
- Keyboard accessible; visible focus; sufficient contrast; semantic HTML; proper
  labels; accessible form errors; screen-reader-friendly controls; no info by colour
  alone; responsive reflow. (2.5.5 Enhanced 44×44 is AAA — we treat it as an internal
  bar for key controls, not a blanket requirement.)

---

## Components to build once (and reuse)

Shell & nav: **AppShell, Sidebar, MobileNavigation, TopBar, PageHeader,
Breadcrumbs.**
Inputs: **Button, IconButton, Input, Select, DatePicker, SearchInput, FilterBar,
FormSection.**
Data: **DataTable, MobileList, Card, Badge, StatusBadge, Avatar, Pagination.**
Feedback & overlays: **Modal, Drawer, Toast, Alert, ConfirmDialog, ProgressIndicator.**
Tabs: **Tabs.**
**State primitives (build early — every feature reuses them): EmptyState,
LoadingState/Skeleton, ErrorState.**
Domain: **ReportCard, ChildCard, CoachCard.**

Don't duplicate equivalent components. Don't nest card-in-card-in-card — use page
sections, dividers, and whitespace for hierarchy. The design should feel spacious,
not boxed-in.

---

## The states every feature ships with

Non-negotiable, in the first implementation — not "later":

- **Loading** — skeletons where useful; buttons show progress ("Saving…") and block
  double-submit. Never a forever-spinner.
- **Empty** — every list has one, with the action to fix it ("No coaches added yet."
  → [Add coach]). Never a blank white table.
- **Error** — human-readable ("Something went wrong loading attendance.") + [Try
  again]. Never a raw 500 / Postgres / SQL message.
- **Validation** — says what's wrong and how to fix it ("Enter a valid Saudi phone
  number."), and **never erases valid input.**
- **Permission** — a role sees only what it should; blocked access is handled
  gracefully, not a crash.
- **Success / confirmation** — the user knows what happened.

---

## Forms

- Real **labels** (placeholder is never the only label), helpful descriptions where
  needed, clear required/optional, correct input types, good mobile keyboards.
- **Destructive actions** get a confirm dialog that explains the consequence — not a
  bare "Are you sure?" (e.g. "Delete Ahmed's account? This removes access to the
  platform. Training history is retained per academy policy.")
- Long forms: warn before leaving with unsaved changes; preserve drafts; show save
  status (Saved / Saving… / Unsaved changes).

---

## Designing with real content

Test with realistic data, not "John Doe" and lorem ipsum: long Arabic and English
names, long sport/programme names, long report titles, long notes, long error
messages. Arabic can run significantly longer than expected — if it breaks the
layout, the layout is wrong.
