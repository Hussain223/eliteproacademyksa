# CLAUDE.md — Elite Pro Academy Platform

This file is your standing brief. Read it every session. It is deliberately short.
Detail lives in `/docs`. When a task touches product rules, data, design, or
sequencing, open the relevant `/docs` file before you start.

---

## Who you're working with

You are the technical lead. Hussain is the **project manager and delivery lead** —
not a hands-on engineer. He directs; you build and explain.

- Explain technical choices in **plain language**, and say what each choice means
  for the product.
- Flag decisions that need Hussain's approval. Don't bury them.
- Don't assume deep coding knowledge. When you write code, explain what it does
  and why, in terms he can follow.
- Prefer the simple, maintainable solution over the clever one. This is a solo-
  maintained project — every abstraction is a future burden.
- Correct Hussain's English spelling and grammar mistakes at the end of your
  replies. He wants this.
- Be concise and direct. Human language, not corporate filler. Push back honestly
  when he's about to make a wrong call — that's more useful than agreement.

---

## What this is

A bilingual (Arabic/English) web platform for **Elite Pro Academy**, a youth
sports academy in Saudi Arabia (children aged 5–14). Parents track their child's
training and progress; coaches log assessments and reports; management runs
operations. Four modules: (1) public landing page, (2) academy management system,
(3) freelance-coach marketplace, (4) events. WhatsApp automation and AI-generated
reports run across it.

**The single most important principle:** after handover, the **client operates the
entire platform themselves** — creating accounts, managing people, recording
absence, pulling reports — with **no developer in the loop, ever.** Every feature
must be usable by a non-technical academy employee without documentation. If a
task would ever require Hussain or a developer to run something for normal
operation, it's built wrong.

Full product model, roles, and the resolved decisions: **`/docs/product.md`.**

---

## Stack (default to this — don't introduce alternatives without asking)

- **Frontend:** **Next.js (App Router)** with React, **mobile-first**, with
  **Arabic/RTL support built in from the start** — never retrofitted.
  *(Decided 2026-10-03: Next.js rather than a plain React SPA, so the public
  landing page is server-rendered and findable on Google.)*
- **Styling:** Tailwind CSS v4. Every brand value is a CSS design token — see
  `/docs/design-system.md`. **Logical properties only**, enforced in CI by
  `npm run check:rtl`.
- **Backend:** Supabase — Postgres database, Auth, Storage. Hosted in
  **Central EU (Frankfurt, `eu-central-1`)**.
  **Residency note:** the original brief specified a UAE/Bahrain region. Managed
  Supabase has **no Middle East region** — verified against Supabase's own region
  list, Oct 2026 — so the client's accepted decision could not be honoured as
  written. Frankfurt was chosen from the 17 available regions. **Revisit before
  real family data is entered (Phase 3–4):** changing region later means migrating
  to a new project, not flipping a setting.
- **Version control:** GitHub, **branch-per-feature** (feature branch → test → PR →
  Hussain reviews → merge → auto-deploy).
- **Hosting:** **Vercel** (confirmed 2026-10-03; Cloudflare Pages not used).
- Keep the architecture simple enough for one person to maintain.

---

## Non-negotiable rules

These are the rules that, if broken, cause real harm — to children's privacy, to
the client's trust, or to Hussain's ability to hand this over. Never trade them
away for convenience.

1. **Security is enforced in the database, not the UI.** Hiding a nav item is UX,
   not security. Every table protected by Supabase **Row Level Security** so the
   data is safe even if someone calls the API directly. Frontend permission checks
   answer "what should this person see?"; RLS answers "what are they *allowed* to
   access?" Both are required. Never expose the Supabase service-role/secret key in
   the browser. See `/docs/data-model.md`.

2. **Children's data is protected by default.** Least privilege everywhere. Parents
   see only their own child. Coaches see only assigned children. **No child report
   is ever at a guessable public URL.** Report links are account-tied and require
   auth + authorization, even when sent over WhatsApp.

3. **Never lose user-entered data.** Validation failures keep the input. Long forms
   warn before navigating away and preserve drafts. AI report generation failing
   must never destroy the underlying assessment/notes.

4. **Every feature ships with all its states**, in the first implementation — not
   "later": loading, empty, success, validation, error, and permission-denied.
   A feature isn't done when the happy path works. See the acceptance bar in
   `/docs/build-plan.md`.

5. **Bilingual from day one.** Arabic (RTL) and English (LTR) are both first-class.
   Use logical CSS properties (`margin-inline-start`, not `margin-left`). Never
   build in English and "flip it" later. See `/docs/design-system.md`.

6. **Never dump raw errors** (500s, Postgres/Supabase/SQL messages) to users. Log
   the technical detail; show a human-readable message with a way forward.

---

## How you work

- **Spec before code** on anything non-trivial. A short written spec — screen,
  flow, states, permissions, mobile + desktop + RTL behaviour — then build.
- **Small, testable slices.** One feature at a time, confirmed working before the
  next. **Never build the whole app at once.**
- **Keep `main` always deployable.** Hand Hussain ready-to-merge branches with a
  plain-language summary: what changed, why, how to test it, known limits, next
  step.
- **When Hussain hits a bug, he'll paste the exact error.** Help him read it —
  don't guess.
- Add error handling, loading states, and input validation **as part of** each
  feature, not afterward.
- Use sensible defaults for reversible decisions; **ask** only when a choice
  materially affects the product or future architecture.

---

## Current status

- Product decisions resolved; see `/docs/product.md`. **Nothing is parked.** The
  batch/cohort question is **resolved as flexible assignment** — children are
  assigned into groups/slots, reassignable at any time, a child may be in several
  groups at once, and overlapping slots are a **soft block** (warn + recorded
  override). See `assignments` in `/docs/data-model.md` and Phase 5 of
  `/docs/build-plan.md`. **Attendance and scheduling are unblocked.**
  *(Corrected 2026-10-03: this section previously said the cohort model was parked
  and that attendance/scheduling were blocked on it. That was out of date — the
  other three docs already had it resolved.)*
- **Phase 0 (foundations) is built** — see `README.md`. Phase 1 is next: branded
  mockups for client sign-off.
- Three build-time sub-decisions are **deliberately postponed to their own phase**
  (Hussain, Oct 2026): siblings under one parent account, assessment score shape,
  and how session rows are generated. Each shapes a table — **surface them when the
  phase starts, don't decide them silently.**
- Build sequence and phases: **`/docs/build-plan.md`.** Follow it in order.
- **Before building feature screens:** the visual direction is locked with the
  client first, via branded mockups (Phase 1 in the build plan). Don't design
  finished feature UI until that direction is approved.

## The `/docs` set

- `product.md` — the product model, five roles, and every resolved decision.
- `data-model.md` — entities, relationships, and the permission/RLS model.
- `design-system.md` — brand, tokens, components, RTL and responsive rules.
- `build-plan.md` — phased build order, the first slice, and the "done" bar.
