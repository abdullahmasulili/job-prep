<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Working on Jobprep

Jobprep is a statically exported study workspace. The curriculum ships with the app, and learners' progress stays in their browser.

## Read before editing

- Start with [Architecture](docs/architecture.md) to find the owner of the behavior and trace its callers. Use the installed `codebase-memory` skill for structural exploration and verify material findings against source.
- For UI changes, read the [visual system](DESIGN.md) and [interaction contract](UX-CONTRACT.md). For curriculum changes, follow [Maintain the curriculum](README.md#maintain-the-curriculum).
- For library or CLI setup, usage, or migration, resolve the library in Context7 and query its current docs. For Next.js changes, also read the relevant guide shipped with the installed package as directed above.
- Use the current source and tests to establish behavior. Treat the dated specs and plans under `docs/superpowers/` as project history.

## Guardrails

- Keep production routes compatible with the static export. Use `moduleIds` from the catalog to enumerate practice routes. Ask before introducing request-time server features, accounts, external storage, or a live AI integration.
- Keep workspace mutations on the `useProgress` command path and scoring, completion, and session rules in `src/lib/`. Keep browser effects out of Redux reducers and storage access behind the persistence controller and adapter.
- Treat `jobprep.progress.v1` as a compatibility boundary. Preserve legacy saves and drafts, serialize writes and recovery with Web Locks, and reject stale writes. Require explicit confirmation before replacing unreadable data. Keep learners' answers and drafts out of URLs, logs, and network requests.
- Preserve profile, module, question, and exercise IDs when editing content. Bump the affected module version for incompatible changes. Preserve attempt history and written drafts, and keep optional AI practice out of core completion.
- Reuse Material UI, the shared theme, and `src/components/ui.tsx`. Preserve labels, visible focus, keyboard flows, confirmation behavior, and responsive light and dark layouts.
- Keep edits scoped to the request and preserve unrelated work. Update the relevant contract or architecture note when its behavior or ownership changes. Use [Verification](docs/verification.md) to choose checks and report any checks you could not run.

## Git and GitHub

- Read `~/.codex/skills/git-convention/SKILL.md` before any Git operation, including read-only inspection. Use local `git` for repository operations and publish only when authorized.
- Use local `gh` for GitHub mutations such as pull requests, comments, reviews, labels, and workflow reruns. Immediately before each GitHub write, including `git push`, run `gh api user --jq .login` successfully in the keyring-enabled execution context (`sandbox_permissions: "require_escalated"`). Use that context for the write as well.
- If a sandboxed identity check fails, retry it once in the keyring-enabled context. If that check fails, stop the write and ask the user to run it in Codex's integrated terminal. GitHub connector access is read-only. Do not fall back to browser automation, raw GitHub API calls, or a different identity.
