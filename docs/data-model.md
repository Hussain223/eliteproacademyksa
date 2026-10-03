# data-model.md — Elite Pro Academy Platform

This is the security spine. Every entity below says what it is, why it exists, what
it links to, and **who can read/write it**. The permission rules here are enforced
in the database with **Supabase Row Level Security (RLS)** — not just in the UI.
Frontend checks decide what a person *sees*; RLS decides what they can *access*.
Both are required.

Rule for Claude Code: **do not create a table that isn't described here without
first explaining to Hussain what it represents, why it exists, what it links to,
and its read/write rules.** No convenience tables.

---

## The core idea in one paragraph

A **child** is the centre of everything. A child belongs to one shared **parent
account**. A child is **assigned** into one or more **groups** (a sport + level,
e.g. "U12 Football"), and each group has recurring **schedule slots** (a time + a
coach). Against each child, the academy records **attendance** (by management),
and coaches record **assessments** and **feedback** (per child, within a session).
**Reports** are generated per session from that recorded data. Separately, outside
**clients** (not parents) make **freelance requests** and **event requests**. A
**payment ledger** tracks money handled offline. Everything important is written to
an **activity log**.

---

## Entities

### `profiles`
Who a user is, extending Supabase Auth. One row per login account.
- **Fields (core):** id (→ auth user), full_name, phone, email, preferred_language
  (ar/en), role (see roles below), is_active, created_at.
- **Links:** a profile *is* a user; a parent profile links to one or more children;
  a coach profile links to assignments and feedback.
- **Read:** the user reads their own profile; Admin/Management read all.
- **Write:** Admin/Management create and edit profiles and set roles. A user may
  edit limited fields of their own profile (e.g. language). No one self-assigns a
  higher role.

### `roles` / role model (Version A)
Five fixed roles: **admin, management, coach, parent, freelance_coach.** Role
definitions are fixed in v1; **which role a person has is freely reassignable** by
Admin/Management. Built so a future per-permission toggle layer (Version B) can be
added without reworking this — but v1 does **not** ship editable-permissions-in-UI.
- **Implementation note:** store the role on `profiles.role` as a constrained enum.
  Keep the permission-to-role mapping in **one** place (a policy helper /
  `has_permission()` function) so RLS reads it consistently and a future dynamic
  layer can replace that one place. Do not scatter `role === 'x'` checks through
  the database.

### `children`
The athlete. The most important record.
- **Fields:** id, full_name, date_of_birth, gender, photo (storage ref), status
  (active/inactive), notes-visibility-controlled fields, created_at.
- **Links:** belongs to one `parent_account`; has many `assignments`; has many
  `attendance` rows, `assessments`, `feedback`, `reports`.
- **Read:** the owning parent; coaches **assigned** to that child (via assignment);
  Management/Admin. A parent can read **only their own** child — this is the single
  most important RLS boundary in the system.
- **Write:** Management/Admin create and edit. Coaches do **not** edit child core
  records.

### `parent_accounts`
One shared account per child household; both parents use the same login (both can
be signed in at once). Kept distinct from `profiles` only if a parent can hold
several children under one login — model as: a parent `profile` owns one
`parent_account`, which owns one or more `children`. (If one child = one login with
no sibling grouping, this can collapse into the parent `profile` directly — **flag
to Hussain at build time**; default to supporting siblings under one account.)
- **Read/Write:** the parent reads their own; Management/Admin manage.

### `coaches`
A coach's professional profile. **One coach entity** — the same person can be
academy staff, a freelancer, or both; that's a **capability flag**, not a separate
identity.
- **Fields:** id (→ profile), coach_code (public identifier), specialties/sports,
  is_academy (bool), is_freelance (bool), availability, status (for freelance:
  pending/approved/rejected), bio, created_at.
- **coach_code:** a **public identifier** used to link/reassign a child to a coach.
  The code identifies the coach publicly; **the authority to make the link stays
  with staff** — a parent or outsider knowing the code must never be able to attach
  themselves to a child.
- **Read:** Management/Admin read all; a coach reads their own; parents see limited
  coach info (name, sport) for their own child's coach only. Freelance browsing is
  controlled — not a public directory.
- **Write:** Management/Admin approve/manage; a coach edits own bio/availability.

### `groups`
A named training unit: sport + level (e.g. "U12 Football"). Staff-defined and
editable.
- **Fields:** id, name, sport, level/age_band, default_coach (optional), status.
- **Read:** staff; parents/coaches see groups relevant to their own children/
  assignments.
- **Write:** Management/Admin.

### `schedule_slots`
A recurring time attached to a group.
- **Fields:** id, group_id, weekday, start_time, end_time, coach_id, location.
- **Links:** belongs to a `group`; referenced by `assignments` and `sessions`.
- **Write:** Management/Admin.

### `assignments`
Puts a child into a group/slot. **This is the flexible link** — created, changed,
and ended easily. A child can have **several** at once (multiple sports/groups).
- **Fields:** id, child_id, group_id, schedule_slot_id, start_date, end_date
  (null = active), created_by.
- **Clash rule (soft block):** when creating an assignment whose slot **overlaps**
  another active assignment for the same child, **warn and require explicit
  override** — do not silently allow, do not hard-block. The override is recorded.
- **History:** ending an assignment (set end_date) **never deletes** past
  attendance/assessment/feedback tied to it. History is preserved under the old
  group.
- **Read:** parents for their own child; assigned coaches; staff.
- **Write:** Management/Admin.

### `sessions`
A concrete occurrence of a schedule slot on a date (the thing attendance and
feedback attach to).
- **Fields:** id, schedule_slot_id, date, coach_id, status.
- **Write:** generated from slots / managed by staff.

### `attendance`
Records whether a child attended. **Recorded by Management — not the coach.**
- **Fields:** id, child_id, session_id, status (present/absent/excused), recorded_by,
  recorded_at, note.
- **Parent pre-notice:** a parent can submit an **absence notice** (see
  `absence_notices`) — that is a *signal to management*, **not** an authoritative
  attendance row. Management records the real attendance.
- **Read:** owning parent (their child); assigned coach (read-only); staff.
- **Write:** Management/Admin.

### `absence_notices`
A parent's advance heads-up that a child will miss a session. A signal, not a record.
- **Fields:** id, child_id, session_id/date, reason, submitted_by, status
  (new/acknowledged).
- **Read/Write:** parent creates for their own child; Management reads/acts.

### `assessments`
A coach's structured evaluation of **one child** (per session context). Grouped
input (physical / technical / tactical / behaviour), draft-able.
- **Fields:** id, child_id, session_id (or date), coach_id, status (draft/submitted),
  structured scores (JSON or typed columns), created_at.
- **Never lose data:** drafts persist; a failed submit keeps the entered data.
- **Read:** owning parent (permitted fields only — not every internal field);
  assigned coach; staff.
- **Write:** the **assigned** coach creates/edits own; staff oversight.

### `feedback` / `notes`
Free-text per-child notes/reviews from a coach. Permission-controlled — some notes
are internal and **not** parent-visible.
- **Fields:** id, child_id, coach_id, body, visibility (parent_visible/internal),
  created_at.
- **Read:** parent sees only `parent_visible` notes for their own child; assigned
  coach; staff.
- **Write:** assigned coach; staff.

### `reports`
A generated report for a child. **Per-session** reports are AI-generated from
assessments + feedback + attendance; **weekly/monthly** are aggregations of session
reports (no new AI call).
- **Fields:** id, child_id, period (session/week/month), status
  (draft/generating/ready/reviewed/sent/failed), content, generated_at, source refs.
- **Security:** **no public URL.** Access is account-tied; auth + authorization
  checked on every open, including when reached via a WhatsApp link. A `failed`
  generation **must not** destroy the source assessment/feedback data.
- **Read:** owning parent (their child, when status allows); staff. 
- **Write:** system/staff; parents never write.

### `clients`
An **outside** party — not a parent. Two kinds: **individual** (wants private
training) and **corporate** (wants an event).
- **Fields:** id, type (individual/corporate), name, contact, created_at.
- **Links:** source of `freelance_requests` and `event_requests`.
- **Read/Write:** staff.

### `freelance_requests`
A client's request for a private/freelance coach; managers match a coach.
- **Fields:** id, client_id, sport, age, preferred_time, location, requirements,
  status (pending/matched/accepted/rejected/cancelled/completed), matched_coach_id.
- **Read/Write:** Management/Admin manage; a freelance coach sees requests relevant
  to them once matched. Controlled visibility — not open to all coaches.

### `events` / `event_requests`
Academy events, meetings, calls, reservations. States: upcoming / completed /
cancelled / pending.
- **Fields:** id, name, type, date, time, location/link, participants, status, notes,
  (requests also: client_id).
- **Read/Write:** staff manage; participants see their own.

### `whatsapp_messages`
A log of outbound WhatsApp communication. WhatsApp is an **external channel**, not
app UI.
- **Fields:** id, purpose, recipient, related_ref (child/report/event), sent_status,
  failure_reason, timestamp.
- **Never assume delivery** — status reflects the provider's report, not the app's
  intent.
- **Read/Write:** staff/system.

### `payments` (ledger only)
Tracks money handled **offline** — v1 moves no money through the platform.
- **Fields:** id, child_id/client_id, amount, currency, paid_on, method, outstanding,
  note, recorded_by.
- **Read/Write:** Management/Admin.

### `activity_log` (audit)
Who did what, when, to which record, old→new where useful. Especially for: account
changes, role changes, child-relationship changes, assessments, attendance
corrections, report generation/status, coach matching, assignment overrides.
- **Read:** **Admin only.** Management does not read the audit log.
- **Write:** append-only, system-written. Never editable.

---

## The permission matrix (who can do what)

| Entity              | Admin | Management | Coach (assigned)      | Parent (own child)        | Freelance coach        |
|---------------------|-------|------------|-----------------------|---------------------------|------------------------|
| profiles / roles    | CRUD  | CRUD       | read own              | read own                  | read own               |
| children            | CRUD  | CRUD       | read assigned         | read own                  | –                      |
| coaches             | CRUD  | CRUD       | edit own              | read own child's coach    | edit own               |
| groups / slots      | CRUD  | CRUD       | read own              | read own child's          | –                      |
| assignments         | CRUD  | CRUD       | read assigned         | read own child's          | –                      |
| attendance          | CRUD  | CRUD       | **read** assigned     | read own child            | –                      |
| absence_notices     | CRUD  | CRUD       | –                     | create/read own child     | –                      |
| assessments         | CRUD  | CRUD       | CRUD own (assigned)   | read own child (permitted)| –                      |
| feedback/notes      | CRUD  | CRUD       | CRUD own (assigned)   | read parent-visible only  | –                      |
| reports             | CRUD  | CRUD       | read assigned         | read own child (ready+)   | –                      |
| clients             | CRUD  | CRUD       | –                     | –                         | –                      |
| freelance_requests  | CRUD  | CRUD       | –                     | –                         | read matched to them   |
| events              | CRUD  | CRUD       | read own              | read own                  | read own               |
| payments (ledger)   | CRUD  | CRUD       | –                     | –                         | –                      |
| activity_log        | read  | –          | –                     | –                         | –                      |
| whatsapp_messages   | CRUD  | CRUD       | –                     | –                         | –                      |

"–" = no access. "assigned" = linked to that child via an active assignment.
"own" = the row belongs to that user. This matrix is the source for the RLS
policies; the UI mirrors it for what each role *sees*.

---

## RLS principles (how this is enforced)

1. **Every table has RLS enabled.** No table is left open. A table with no policy
   denies by default — that's correct.
2. **The parent↔child boundary is the crown jewel.** A parent can read a child row
   **only** if they own it. Test this one hardest — it's where a bug exposes another
   family's child.
3. **The coach↔child boundary runs through `assignments`.** A coach reads a child's
   data only if an **active assignment** links them. Ending the assignment ends the
   access (history stays, access to new data stops).
4. **Role checks go through one helper**, not scattered literals — so Version B
   (per-permission toggles) can replace that one helper later.
5. **The service-role key never reaches the browser.** Server-only. Any privileged
   operation runs in a Supabase Edge Function, not the client.
6. **Reports enforce authorization on open**, independently of how the link was
   reached (WhatsApp included). The link is not the permission; the logged-in
   user's right to that child is.

---

## Open sub-decisions to confirm at build time (don't guess)

- **parent_accounts vs profiles:** support siblings under one parent account
  (default yes) or one-child-per-login? Affects whether `parent_accounts` is its
  own table.
- **assessment scores shape:** typed columns (queryable, rigid) vs JSON (flexible,
  harder to query). Lean JSON for v1 flexibility given sports differ; confirm.
- **sessions generation:** auto-generate session rows from slots on a schedule, or
  create on demand when attendance/feedback is first recorded? Affects empty-state
  behaviour.

These are reversible enough to default on, but each materially shapes a table, so
surface them to Hussain when the relevant phase starts rather than deciding silently.
