# AGENTS.md

**The project brief is [`CLAUDE.md`](./CLAUDE.md), not this file.** Read that
first, then the four documents in [`/docs`](./docs).

This file exists for one narrow reason: `next dev` automatically writes a block
of its own instructions into whichever of `AGENTS.md` or `CLAUDE.md` it finds.
Left alone, it edits `CLAUDE.md` — our human-authored source of truth — on every
run, which shows up as an unexplained change in Git every time anyone starts the
dev server.

Giving it this file to write into keeps `CLAUDE.md` ours. Everything below the
marker is managed by Next.js; don't hand-edit it.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
