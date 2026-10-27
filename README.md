# Jobprep

A browser-based workspace for developer job preparation. Choose a frontend,
backend, or fullstack role; junior, mid-level, or senior responsibility; and a
technical language. Work through guided preparation, multiple-choice assessments,
written exercises, and interview practice, with progress saved in your browser.
Optional AI workflow preparation has separate progress and uses bundled scenarios.

The app includes a preparation roadmap, resumable assessments, independent exercise
drafts, quiz history, saved paths, and light/dark themes. No account, database,
environment variables, or API key are required.

## Technology stack

- Next.js 16 App Router, React 19, and TypeScript 6.
- Material UI 9 with Emotion, shared theme tokens, and responsive layout CSS.
- Redux Toolkit 2 and React Redux 9 for workspace state, with a store per provider.
- Browser localStorage and Web Locks for validated, coordinated persistence.
- Locally bundled DM Sans and Manrope fonts through Fontsource.
- Node.js test runner with `tsx`, Playwright with axe accessibility checks,
  ESLint, and Prettier.

Dependency ranges are defined in [package.json](package.json); resolved versions
are recorded in [pnpm-lock.yaml](pnpm-lock.yaml).

## Run locally

Use Node.js 22.13 or newer and pnpm 12.3.4. The `packageManager` field pins pnpm,
and `pnpm-lock.yaml` records the installed dependency versions.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open [localhost:3000](http://localhost:3000) and choose a role, experience level,
and language to create your first path. You can enable the optional AI extension
during onboarding or later in Settings.

For a production build:

```sh
pnpm build
pnpm start
```

## App navigation

| Route                  | Purpose                                                                                                           |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `/`                    | Overview with current path, next practice session, and activity summary; shows onboarding when no path is active. |
| `/onboarding`          | Choose a new path or resume a saved one.                                                                          |
| `/path`                | View all required modules and the optional AI extension.                                                          |
| `/practice/[moduleId]` | Preparation checklist, assessment, and written exercises for a module.                                            |
| `/progress`            | Core completion, module requirements, best scores, and quiz attempt history.                                      |
| `/settings`            | Change path, toggle AI preparation, choose a theme, reset progress, or unenroll.                                  |

Module IDs are `aptitude`, `fundamentals`, `practical`, `interview`, and `ai`.
AI practice is available only when enabled for the active path.

## Preparation and progress

There are nine role/experience tracks and 42 supported role/experience/language
combinations. Frontend supports JavaScript and TypeScript. Backend and fullstack
also support Python, Java, C#, and Go. The fullstack language selection applies to
backend work; browser scenarios use JavaScript/TypeScript, HTML, and CSS.

Each path has 120 core questions with explanations for every choice. The current
curriculum is version 2, with these banks and exercises per path:

| Module                       | Questions in bank | Written exercises | Required |
| ---------------------------- | ----------------: | ----------------: | -------- |
| Aptitude & reasoning         |                24 |                 3 | Yes      |
| Role & language fundamentals |                36 |                 4 | Yes      |
| Practical engineering        |                36 |                 4 | Yes      |
| Interview preparation        |                24 |                 6 | Yes      |
| AI workflow extension        |                16 |                 3 | No       |

- All required modules are available immediately; the roadmap suggests an order.
- A module is complete after its preparation checklist, a quiz result of at
  least 75%, and any two exercises with nonempty responses and completed self-review.
  Each response and review saves independently. Editing a response clears its review.
- Core progress is the percentage of the four required modules fully completed.
  The optional AI module never changes that percentage.
- Assessments draw 12 questions from the module bank, balancing topics among equally
  recent questions. Retakes prioritize unseen questions, then least recently seen ones.
  Question and choice order vary; reloading preserves the current session and answers.
- Retakes preserve the best result and the most recent 20 attempts per module.
  A lower retake score does not remove a previous pass. Content-version changes
  invalidate incompatible quiz results for completion but retain history and written drafts.
  Updated exercises require fresh self-review.
- Reset path erases only the selected path's work, including its AI progress, and
  keeps enrollment. Unenroll leaves its work saved;
  re-enroll in the same role/tier/language to resume. Different profiles are isolated.
- AI preparation covers planning, reviewing generated code, and verifying changes.
  It does not call a live model. Disabling it retains its work.

## Local data and recovery

Progress is stored under `jobprep.progress.v1` in this origin's localStorage.
It does not sync between browsers, devices, or origins (including different
localhost ports). Clearing site data removes it. Storage failures display a
persistent warning; in-memory work may be lost on reload. Unreadable data is
preserved until explicitly reset. Another tab's changes block stale writes until
the latest saved state is loaded. Writes and recovery resets are serialized with
Web Locks. Use a current browser on HTTPS or localhost; without lock support, the
app keeps work in memory and shows a warning rather than saving unsafely.

- **Retry saving** retries persistence after a storage failure.
- **Load latest progress** replaces stale in-memory state after another tab saves.
- **Reset local data** is the confirmed recovery action for unreadable data. It
  clears all saved paths in this browser, unlike **Reset path** in Settings.

## Content scope

Quizzes are auto-scored; written responses are not executed or AI-graded.
Completion measures preparation activity, not certified job readiness. The bundled
content is reviewed with app updates rather than refreshed daily. Guides link to
MDN, SFIA, OWASP, HTTP specifications, language documentation and responsible AI
guidance. The documented reference review date is October 27, 2026. Language
choices are curated ecosystem options, not a geographic hiring-demand ranking.

## Verify

Run these checks after installing dependencies:

```sh
pnpm test
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build
pnpm test:e2e
```

Browser tests use Playwright with an installed Google Chrome (`channel: 'chrome'`)
and start a local Next.js server on port 3100 if one is not already running.
To use bundled Chromium instead, remove the channel setting in
`playwright.config.ts` and install it with `pnpm exec playwright install chromium`.
The suite covers onboarding, assessment feedback, completion, drafts, retakes,
profile isolation, reset, unenrollment, AI toggles, storage failure/conflicts,
responsive layouts and automated accessibility checks.

`pnpm test` runs domain, curriculum, session, exercise, Redux store, and storage
tests in `tests/*.test.ts`. `pnpm test:e2e` runs the browser workflows in
`tests/e2e/`. Use `pnpm format` to apply repository formatting; `pnpm format:check`
checks it without modifying files.

## Project structure

- `src/content/catalog.ts`: supported profiles, module assembly, versions, and reference review date.
- `src/content/banks/`: question banks and additional exercises by role, language, and shared topic.
- `src/content/`: preparation guides, language metadata, shared types, sources, and bank helpers.
- `src/lib/progress.ts`: scoring, completion, independent exercise drafts and enrollment transitions.
- `src/lib/sessions.ts`: stable assessment sessions, question coverage and retake selection.
- `src/lib/storage.ts`: schema validation and revision-aware local persistence.
- `src/lib/workspace-store.ts`: per-provider Redux Toolkit store for progress and save status.
- `src/components/progress-provider.tsx`: Redux-backed commands, hydration and coordinated browser persistence.
- `src/theme/theme.ts`: Material UI palette, typography and shared component styles.
- `src/components/app-theme.tsx`: Material theme and semantic CSS-variable adapter.
- `src/components/`: focused screens and shared interaction primitives.
- `src/app/`: thin App Router routes, root provider composition, font imports, and responsive layout CSS.
- `tests/`: domain/content/storage checks and Playwright workflows.
- `docs/superpowers/`: design specifications and implementation plans.
- `artifacts/`: saved UI screenshots and verification reports from earlier work.

## Maintain the curriculum

To change a quiz incompatibly, increment its module version in
`src/content/catalog.ts`. Update its questions, explanations and source metadata
together, and retain stable IDs for exercises whose drafts should survive an
update. A version change preserves written drafts and attempt history but requires
fresh preparation, a compatible passing quiz, and exercise self-review.

Run `pnpm test` to check every supported role/tier/language combination, including
bank sizes, unique IDs and prompts, explanations, tier variation, and resistance
to fixed answer-length guessing. Update `REVIEWED_ON` in the catalog when the
curriculum references have actually been reviewed.

See [the approved design](docs/superpowers/specs/2026-10-26-job-preparation-design.md),
[implementation plan](docs/superpowers/plans/2026-10-26-job-preparation.md),
[question-bank design](docs/superpowers/specs/2026-10-27-question-bank-design.md),
[visual system](DESIGN.md), and [interaction contract](UX-CONTRACT.md).
