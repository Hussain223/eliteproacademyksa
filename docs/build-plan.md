# build-plan.md — Elite Pro Academy Platform

How this platform gets built, in order. Follow the phases as written. Each phase
ends with something Hussain can see, test, or show the client. Nothing large is
built before the thing it depends on is settled.

Two constraints shape the whole sequence:

- **The visual direction is approved by the client before feature screens are
  built.** We de-risk "will they like the look?" up front, on cheap artifacts,
  not after features are coded.
- **The cohort/batch question is unresolved.** Attendance and scheduling wait for
  it. Everything before that point is independent of it, so we lose no time.

---

## Phase 0 — Foundations (no personal data touched yet)

Goal: a running, deployable skeleton and the brand assets in order.

- [ ] GitHub repo, branch-per-feature workflow, `main` auto-deploying to Vercel or
      Cloudflare Pages (a blank app is fine — prove the pipeline).
- [ ] React app scaffold, mobile-first, with the **i18n + RTL framework wired in
      from the first commit** (English and Arabic switch, direction flips). This is
      the one thing that must exist before any UI, because retrofitting it is the
      expensive mistake we're avoiding.
- [ ] Supabase project created in the **UAE/Bahrain** region. No tables yet.
- [ ] **Logo to vector.** The logo is currently raster only. Get the SVG from the
      original designer, or have it traced. Flag to Hussain — a crisp logo is a
      visible quality marker; a fuzzy one cheapens every screen.

**Decision for Hussain:** confirm hosting target (Vercel vs Cloudflare Pages) —
reversible, so Claude Code should default to Vercel unless told otherwise.

---

## Phase 1 — Visual direction, locked with the client

Goal: the client approves *how the platform looks* before we build features. This
is the answer to the biggest project risk. **No feature logic here — appearance
only.**

- [ ] **2–3 static mockup directions**, all "premium youth sports academy," anchored
      on the real Elite Pro logo and brand colours, differing in feel (e.g. clean-
      editorial / bold-athletic / warm-parent-friendly). Each shows the same three
      screens so the client compares like with like:
      - the **login / landing** entry,
      - the **parent dashboard** (the most emotionally important screen — a parent
        must understand "how is my child doing?" in seconds),
      - one **management screen** (e.g. the children list/table).
- [ ] Built as static, non-functional pages Hussain can open on phone and desktop
      and send to the client. Shown in **both Arabic and English** so RTL is judged,
      not assumed.
- [ ] Client picks one direction.

**Decision for Hussain / client:** which direction. This is *the* sign-off that
protects everything downstream. Everything after Phase 2 inherits it.

**Exit:** one approved visual direction.

---

## Phase 2 — Design system + app shell

Goal: turn the approved direction into reusable foundations, so every later screen
is consistent and fast to build.

- [ ] Freeze design tokens from the approved direction (colours, type, spacing,
      radius, shadows) — see `/docs/design-system.md`. Starting palette: **green
      primary, gold accent, navy neutral, orange as a single attention colour.**
- [ ] Core reusable components: AppShell, Sidebar, MobileNavigation, TopBar,
      PageHeader, Button, Input, Select, Card, Badge, Modal, Drawer, Toast, Alert,
      Tabs, plus the state primitives **EmptyState, LoadingState/Skeleton,
      ErrorState, ConfirmDialog.** Build the state primitives early — every feature
      reuses them.
- [ ] The app shell rendered in the approved look, in both languages, responsive.

**Exit:** Hussain can show the client a real, navigable (empty) shell that looks
like the approved direction. First tangible product moment.

---

## Phase 3 — Auth, roles, and the permission spine

Goal: people can log in, and the database enforces who-sees-what before any real
data exists to protect.

- [ ] Supabase Auth: login, password reset, session handling, language preference
      stored per user.
- [ ] The five roles (Admin, Management, Coach, Parent, Freelance coach) and
      role-aware navigation (hide what a role can't use — see `/docs/product.md`).
- [ ] **RLS switched on from the first real table.** Establish the pattern now, on
      a small table, so every later table inherits a proven approach rather than
      bolting security on at the end. See `/docs/data-model.md`.

**Exit:** each role logs in and sees only their own shell. Security is real, not
cosmetic.

---

## Phase 4 — People management (the operational core begins)

Goal: staff can run the academy's people — the heart of "the client operates it
themselves."

- [ ] Children/athletes: create, view, edit, list (with the child profile screen).
- [ ] Parent accounts (one shared account per child; both parents can sign in).
- [ ] Coaches (one coach entity; academy/freelance is a capability on them).
- [ ] Coach ↔ child assignment, using the coach code.
- [ ] Search, filtering, and the mobile card-list treatment for tables.

Build these one entity at a time, each with its full set of states. This phase is
independent of the cohort question.

**Exit:** management can create and manage real people end to end.

---

## Phase 5 — Groups, scheduling, attendance & assessments

Cohort model is resolved (flexible-assignment — see `/docs/product.md` and
`/docs/data-model.md`). No dependency hold.

- [ ] **Groups & schedule slots** — staff create/edit groups (sport + level) and
      recurring slots (time + coach).
- [ ] **Assignment** — assign a child into a group/slot; reassignable; multi-group
      allowed. Overlap → **soft block** (warn + explicit override, recorded).
- [ ] **Attendance** — recorded by **Management** (not the coach); coaches get
      read-only visibility. Parent **absence notice** is a separate signal, not the
      record.
- [ ] **Coach assessments & feedback** — **per child**, fast, stepped (physical/
      technical/tactical/behaviour), draft-able, never lose entered data. On an
      assigned child the coach sees the full picture incl. other coaches' notes.
- [ ] **History preserved** across reassignment, and **downloadable per child.**

---

## Phase 6 — Reports (recorded data → AI → secure delivery)

- [ ] Per-session AI report from coach reviews + notes + absence. Statuses: Draft,
      Generating, Ready, Reviewed, Sent, Failed. Never a forever-spinner; failure
      keeps the source data safe.
- [ ] Weekly/monthly reports as **aggregations** of session reports (no new AI
      calls).
- [ ] **Secure, account-tied report access.** No public URLs. Auth + authorization
      enforced even on WhatsApp links.

---

## Phase 7 — Freelance marketplace

Client request (from an outside individual or corporate client — not a parent) →
manager reviews coaches → matches → status flow (Pending, Matched, Accepted,
Rejected, Cancelled, Completed). Controlled access, not a public directory.

---

## Phase 8 — Events

Upcoming / Completed / Cancelled / Pending views. Simple event creation. Don't
build an enterprise calendar unless requirements demand it.

---

## Phase 9 — WhatsApp automation & payment ledger

- [ ] WhatsApp as an external channel: record purpose, recipient, related
      child/report/event, sent/failed status, timestamp. Never assume delivery.
- [ ] Payment **ledger** only: record who paid, how much, when, what's outstanding.
      **No money moves through the platform in v1.**

---

## Phase 10 — Handover readiness

- [ ] Admin onboarding / first-run so the client isn't staring at an empty system.
- [ ] Data export for the client.
- [ ] A short, plain-language operator guide for academy staff.

---

## The "done" bar — a feature is complete only when ALL are true

Not "the database operation works." A feature is done when:

- Happy path works.
- Validation works (and never erases valid input).
- Loading state exists.
- Empty state exists.
- Error state exists (human-readable, no raw errors).
- Permission behaviour works (and RLS enforces it in the database).
- Mobile layout works. Desktop layout works.
- Arabic works. English works.
- The relevant data is protected.
- The user gets clear feedback on what happened.

If any of these is undefined, the feature is not finished.

---

## The smallest sensible first feature

After Phases 0–2 (foundations, approved look, shell), the first **real feature**
to build is **"create and view a child"** in Phase 4:

- It's the spine of the whole data model — parent, coach, reports all hang off it.
- It exercises the full stack once, small: a form (validation, states), a table
  (empty/loading/error, mobile cards), a detail screen, and its first RLS policy.
- It's independent of the parked cohort question.
- It gives Hussain a concrete, testable thing to review and a pattern every later
  feature copies.

Write its spec first (screen, flow, states, permissions, mobile + desktop + RTL),
get Hussain's nod, then build.
