# product.md — Elite Pro Academy Platform

The product model and every resolved decision, in plain language. This is the "why"
behind the data model — read it alongside `data-model.md`. Where this describes
*what the product does*, `data-model.md` describes *how the data enforces it*.

---

## What the platform is for

A bilingual web platform for **Elite Pro Academy**, a youth sports academy in Saudi
Arabia (children aged 5–14; football, swimming, gymnastics, martial arts, nutrition/
obesity solutions). It connects academy management, coaches, parents, children, and
outside clients.

**The governing principle:** after handover, the client's own non-technical team
operates everything through the UI — no developer in the loop, ever. Every feature
is judged by whether an academy employee can do it alone, first time, without
documentation.

---

## The four modules

1. **Public landing page** — explains the academy, builds trust, lets visitors
   enquire, and gives existing users a way to log in. Premium and youth-oriented
   without being childish.
2. **Academy management system** — the operational core: users, coaches, children,
   groups/schedules, attendance, assessments, feedback, reports, exports.
3. **Freelance marketplace** — an Uber-style, *controlled* matching of outside
   clients with freelance coaches. Not a public directory.
4. **Events** — academy events, meetings, calls, reservations, with history.

WhatsApp automation and AI-generated reports run across all of it.

---

## The five roles

Role definitions are **fixed** (Version A). *Which* role a person holds is freely
reassignable by Admin/Management at any time. A future version may allow editing
individual permissions (Version B) — the system is built to allow that later, but v1
does not ship it.

- **Admin** — all permissions. Creates accounts, assigns roles, sees the reports
  dashboard and exports, manages system config. **Only Admin reads the audit log.**
- **Management** — operational staff. Add/delete users, coaches, **and children**;
  record attendance; manage matching and events; view permitted reports. Does **not**
  see the audit log or an overwhelming developer-style interface — only what their
  job needs.
- **Coach** — views assigned children; records assessments and per-child feedback/
  notes; reads permitted child info including **attendance (read-only)**. On an
  assigned child a coach sees the **full picture**, including other coaches' notes.
  The coach interface prioritises speed, especially on mobile.
- **Parent / user** — primarily reads. Sees their own child's info, training
  overview, attendance, daily report, progress, coach info, and reports — including
  **both raw assessment scores and the finished reports.** Can submit an absence
  pre-notice and request a trainer change. Simple, reassuring, premium; no internal
  academy jargon.
- **Freelance coach** — applies to join, manages profile and availability, sees
  matching requests relevant to them. The same person can be *both* an academy coach
  and a freelancer — it's a capability, not a separate account.

---

## Resolved decisions (the full list)

**Accounts & people**
- Academy staff create accounts at launch. Family self-registration with staff
  approval is designed-for but a **later** feature.
- A **child** is one account with one data set, shared by both parents on one login
  (both can be signed in at once).
- There is **one coach entity**. Academy-staff and freelancer are capability flags on
  it, not separate identities. Outside freelancers also get a coach profile.
- A **"client"** is an outside party — either an **individual** wanting private
  training or a **corporate** wanting an event. Distinct from parent-users. So v1 has
  **two front doors**: academy families, and outside clients.
- The **coach code** is a public identifier used to link or reassign a child to a
  coach. It identifies the coach publicly; the authority to actually make the link
  stays with staff.

**Groups, scheduling, assignment**
- Staff **define and edit groups** (sport + level, e.g. "U12 Football") and recurring
  **schedule slots** (time + coach).
- Children are **assigned** into groups/slots — reassignable any time. A child can be
  in **multiple** groups/sports at once.
- Assigning a child to a slot that **overlaps** an existing assignment triggers a
  **soft block**: a clear warning requiring a deliberate override (not a silent
  allow, not a hard block).
- A child's **history** (attendance, assessments, feedback) is **preserved** across
  reassignment and is **downloadable per child**.

**Attendance, assessments, feedback**
- **Attendance is recorded by Management** — not the coach. A parent can submit an
  advance **absence notice**, which is a *signal* to management, not the
  authoritative record.
- **Assessments and feedback are per child**, recorded by the coach within a
  session's context — never roster-level.

**Reports**
- A **per-session** report is AI-generated from coach reviews + notes + absence for
  that session.
- **Weekly/monthly** reports are **aggregations** of the session reports — no new AI
  call.
- AI must only use recorded data — it never invents scores, attendance, or
  achievements. A failed generation never destroys the source data.
- Reports are **account-tied and access-controlled**. No public/guessable URLs.
  A WhatsApp link still enforces auth + authorization on open.

**Trainer change**
- A parent requests a change on the platform → **only Management/Admin are notified**
  (the current coach is not) → it's decided offline by meeting or call → the outcome
  (reassigned, or kept as-is) is recorded on the platform.

**Communication, money, language, hosting**
- **WhatsApp** is an external channel, not app UI. The platform logs purpose,
  recipient, related record, sent/failed status, timestamp — and never assumes
  delivery.
- **Payments: ledger only** in v1 — record who paid, how much, when, what's
  outstanding. No money moves through the platform. (Real processing is out of scope
  for v1.)
- **Bilingual Arabic + English from day one**, RTL/LTR both first-class.
  Non-negotiable.
- **Hosting:** managed Supabase, UAE/Bahrain region. The data-residency decision is
  the client's and has been accepted.

---

## Still open / parked

- None blocking. The three build-time sub-decisions (siblings under one parent
  account; assessment score shape; how sessions are generated) are noted in
  `data-model.md` to settle when their phase starts — each is reversible enough to
  default on, but shapes a table, so surface them rather than guessing.

---

## What "built right" means here (product-level)

Every feature is measured against the operator, not the database:
- **First-time:** can a new employee understand what this screen does?
- **Daily:** can an experienced one do the task fast?
- **Mistakes:** what happens on wrong input? (Explain and recover — never lose data.)
- **Empty / loading / failure / permission:** all handled, visibly.
- **Confirmation:** does the user understand what just happened?
- **Privacy:** is this person seeing only what they should?

If any of those is undefined for a feature, the feature isn't finished.
