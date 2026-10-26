# Jobprep

A Next.js app using Material UI and Redux Toolkit for developer job preparation. Choose a frontend, backend,
fullstack, or mobile role; junior, mid-level, or senior responsibility; and a technical
language. Work through guided preparation, multiple-choice assessments, written
exercises, and interview practice. Optional AI workflow preparation has separate
progress.

## Run locally

Use Node.js 20.9 or newer and npm. The lockfile records the installed versions.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). No environment variables, database,
account, or API key are required.

For a production build:

```sh
npm run build
npm start
```

## Preparation and progress

- Four required modules per role/tier: aptitude, fundamentals, practical
  engineering, and interviews. Each contains a guide, four MCQs with explanations,
  and a self-reviewed exercise. All modules are available immediately.
- Frontend supports JavaScript/TypeScript. Backend and fullstack also support
  Python, Java, C#, and Go. Fullstack browser scenarios use JavaScript/TypeScript.
- Mobile paths cover Flutter (Dart), React Native (TypeScript/JavaScript), Kotlin
  Multiplatform, native Android (Kotlin or Java), and native iOS (Swift). Each stack
  includes tier-specific guides, assessments, practical exercises, and official references.
- Fullstack enrollment can include mobile development. Choose a mobile stack
  alongside your backend language to add a fifth required module covering mobile/API
  integration, offline work, lifecycle, security, testing, and release decisions.
- A module is complete after its preparation checklist, a quiz result of at
  least 75%, and a nonempty response with its self-review checklist completed.
- Retakes preserve the best result and the most recent 20 attempts per module.
  A lower retake score does not remove a previous pass. Content-version changes
  invalidate incompatible quiz results for completion but retain history.
- Reset erases only the selected path's work. Unenroll leaves its work saved;
  re-enroll in the same role/tier/language/mobile stack to resume. Different profiles are isolated.
- AI preparation is optional, uses supplied scenarios rather than a live model,
  and never changes required completion. Disabling it retains its work.

Progress is stored under `jobprep.progress.v1` in this origin's localStorage.
It does not sync between browsers, devices, or origins (including different
localhost ports). Clearing site data removes it. Storage failures display a
persistent warning; in-memory work may be lost on reload. Unreadable data is
preserved until explicitly reset. Another tab's changes block stale writes until
the latest saved state is loaded. Writes and recovery resets are serialized with
Web Locks. Use a current browser on HTTPS or localhost; without lock support, the
app keeps work in memory and shows a warning rather than saving unsafely.

Quizzes are auto-scored; written responses are not executed or AI-graded.
Completion measures preparation activity, not certified job readiness. The bundled
content is reviewed with app updates rather than refreshed daily. Guides link to
MDN, SFIA, OWASP, HTTP specifications, language documentation and responsible AI
guidance. The documented reference review date is October 26, 2026. Language
choices are curated ecosystem options, not a geographic hiring-demand ranking.

## Verify

```sh
npm test
npm run typecheck
npm run lint
npm run format:check
npm run build
npm run test:e2e
```

Browser tests use Playwright with an installed Google Chrome (`channel: 'chrome'`)
and start a local Next.js server on port 3100 if one is not already running.
To use bundled Chromium instead, remove the channel setting in
`playwright.config.ts` and install it with `npx playwright install chromium`.
The suite covers onboarding, assessment feedback, completion, drafts, retakes,
profile isolation, reset, unenrollment, AI toggles, storage failure/conflicts,
responsive layouts and automated accessibility checks.

## Project structure

- `src/content/`: original question banks, guides, language variants and references.
- `src/lib/progress.ts`: scoring, completion and enrollment transitions.
- `src/lib/storage.ts`: schema validation and revision-aware local persistence.
- `src/lib/workspace-store.ts`: per-provider Redux Toolkit store for progress and save status.
- `src/components/progress-provider.tsx`: Redux-backed commands, hydration and coordinated browser persistence.
- `src/theme/theme.ts`: Material UI palette, typography and shared component styles.
- `src/components/app-theme.tsx`: Material theme and semantic CSS-variable adapter.
- `src/components/`: focused screens and shared interaction primitives.
- `src/app/`: thin App Router routes, local fonts and responsive domain layout CSS.
- `tests/`: domain/content/storage checks and Playwright workflows.

To change a quiz incompatibly, increment its module version in
`src/content/catalog.ts`. Update its questions, explanations and source metadata
together; run coverage checks for every supported role/tier/language.

See [the approved design](docs/superpowers/specs/2026-10-26-job-preparation-design.md),
[implementation plan](docs/superpowers/plans/2026-10-26-job-preparation.md),
[visual system](DESIGN.md), and [interaction contract](UX-CONTRACT.md).
