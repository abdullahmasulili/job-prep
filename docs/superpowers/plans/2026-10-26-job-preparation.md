# Job preparation implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement task-by-task. Steps use checkbox syntax.

**Goal:** Deliver the approved browser-persistent role and seniority preparation app.
**Architecture:** Typed, bundled curriculum feeds pure scoring/completion functions. One validated localStorage adapter and React provider own durable state; thin App Router routes render focused onboarding, overview, path, practice, progress, and settings views.
**Tech Stack:** Next.js App Router, React, TypeScript, CSS custom properties, Node test runner with tsx, Playwright.
**Spec:** `docs/superpowers/specs/2026-10-26-job-preparation-design.md` (approved).

## Global Constraints

- Nine role/tier tracks; frontend JavaScript/TypeScript, backend/fullstack six languages.
- Four required modules per track, four MCQs per module, original tier-specific guides and exercises.
- Optional AI module has a separate completion denominator.
- 75% quiz pass; preparation checklist, passing quiz, nonempty response and review checklist required for module completion.
- Browser-only progress, versioned data, explicit storage errors and multi-tab conflict recovery.
- No executable editor, live AI, database or accounts.
- Work locally on `feat/no-ticket-job-preparation-mvp`; no remote writes. Git commits follow the user's local history request.

## Review Focus

- Corrupt or incompatible storage must be preserved until explicit recovery.
- Cross-tab writes must block stale edits until latest data is loaded.
- Versioned questions must not count stale answers toward completion.
- Language/profile changes must not reuse another path's answers or drafts.
- Direct unknown practice links and disabled optional modules must show recoverable states.

## Task 1: Curriculum and application foundation

**Files:** package/config files; `src/content/{types,catalog,aptitude,frontend,backend,fullstack,interview,ai,languages}.ts`; `tests/content.test.ts`.
**Interfaces:** `getModules(profile: ProfileConfig): PrepModule[]`; `getModule(profile, id): PrepModule | undefined`; typed `Question`, `PrepModule`, `ProfileConfig`, role/tier/language catalogs.

- [ ] Configure npm scripts, Next.js and TypeScript; install dependencies.
- [ ] Write content tests asserting nine tracks, four core modules plus AI, four valid questions per module, unique IDs, >=3 preparation/review steps, links and language-specific snippets. Run `npm test` and observe missing-module failure.
- [ ] Author guides, exercises, tier-specific banks, and language variants; implement typed catalog assembly.
- [ ] Run `npm test`; all content tests pass.

## Task 2: Scoring, lifecycle and browser storage

**Files:** `src/lib/{progress,storage}.ts`; `src/components/progress-provider.tsx`; `tests/{progress,storage}.test.ts`.
**Interfaces:** `scoreQuiz(module, answers): number`; `moduleStatus(module, progress)`; `pathStats(modules, profile)`; `updateProfile`, `enroll`, `resetProfile`, `unenroll`; `readStore(storage)`, `writeStore(storage, state)`; `useProgress()`.

- [ ] Write tests for 75% boundary, missing/incorrect answers, version invalidation, AI denominator, profile isolation, retention on unenroll, reset, bounded attempt history and best-result retention. Observe failures before implementing.
- [ ] Implement pure progress functions and typed state shape; run progress tests.
- [ ] Write adapter tests for invalid JSON/schema/version, unavailable/quota storage, malformed nested fields and state roundtrip. Observe failures.
- [ ] Implement validation and storage; provider hydrates after mount, saves only actions, tracks revision against stored state, blocks conflict writes and exposes reload/recovery.
- [ ] Run complete unit suite.

## Task 3: Study workspace and enrollment

**Files:** `DESIGN.md`, `UX-CONTRACT.md`, `premium-ui.json`; `src/app/{layout,globals,page,onboarding/page,path/page,progress/page,settings/page}.tsx`; `src/components/{icons,ui,shell,onboarding,dashboard,path-view,progress-view,settings-view}.tsx`.
**Interfaces:** Shared `ProgressBar`, `PageHeader`, `ConfirmDialog`, `EmptyPath`; views consume provider and content only; no duplicate persistence.

- [ ] Write Playwright enrollment flow: choose role/tier/language/AI, enroll, verify zero progress and reload restoration. Run and observe app/flow failure.
- [ ] Establish documented runtime tokens and canonical controls; implement responsive navigation, hydration/loading/errors, themes and confirmations.
- [ ] Implement four-step onboarding, dashboard, path, progress history and settings with correct reset/unenroll behavior.
- [ ] Run enrollment flow plus typecheck and lint.

## Task 4: Practice and assessments

**Files:** `src/app/practice/[moduleId]/page.tsx`; `src/components/{practice-view,quiz,exercise}.tsx`; `tests/e2e/practice.spec.ts`.
**Interfaces:** Preparation toggles, quiz drafts/submission/retake, attempt snapshot, exercise response and self-review update active profile via provider.

- [ ] Write browser tests for missing answers, passing/failing quiz, review feedback, persisted drafts, completion, retake retention and optional AI independence. Observe failure before implementation.
- [ ] Implement guide/quiz/exercise tabs, all-choice feedback, latest/best results, reference approach and local saved responses.
- [ ] Implement unknown/disabled module states and last-visited resume.
- [ ] Run browser and unit suites, typecheck and lint.

## Task 5: Resilience, review and delivery

**Files:** `tests/e2e/{lifecycle,resilience,accessibility}.spec.ts`; `README.md`; verification report and plan ledger.
**Interfaces:** Public UI flows and browser storage error/conflict handling.

- [ ] Write and run lifecycle/failure tests covering reset, unenroll/re-enroll, corrupt/versioned data, denied storage, cross-tab conflict, language isolation and direct links. Fix any observed failures with regression tests.
- [ ] Inspect actual desktop/mobile screenshots, themes, keyboard navigation, contrast, dialogs, code overflow and reduced motion.
- [ ] Run `npm test`, `npm run test:e2e`, `npm run lint`, `npm run typecheck`, `npm run build`, and strict premium audit.
- [ ] Dispatch one fresh final reviewer against the plan, spec, code and test evidence. Resolve important findings with failing regression tests followed by fixes.
- [ ] Document setup, local data limitations, content grounding and verification. Commit verified local changes as authorized; do not publish.

## Execution record

The user approved the design and explicitly requested execution. Proceed inline without another approval round. Keep progress in `docs/superpowers/plans/2026-10-26-job-preparation-progress.md` so work survives compaction.
