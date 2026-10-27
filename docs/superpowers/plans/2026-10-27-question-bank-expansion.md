# Question Bank Expansion Implementation Plan

**Goal:** Implement the authorized question-quality and practice expansion.
**Architecture:** Authored topic-tagged banks, persisted session selections with
canonical answers, and independent exercise drafts in the existing local store.
**Tech Stack:** Existing TypeScript, Next.js, React, MUI, node:test, Playwright.
**Spec:** ../specs/2026-10-27-question-bank-design.md

## Constraints

- 120 core questions for each of 42 supported profiles; 12 per assessment session.
- Preserve saved drafts and attempt history; incompatible quiz passes expire.
- No new runtime dependencies, commits, pushes, or external services.
- Parallel content work has disjoint file ownership. Root owns integration.

## Tasks

- [x] Content contract/tests: count, unique prompts/IDs, plausible choices,
      topic coverage, length heuristics and independently named exercises.
- [x] Frontend bank: 24 role fundamentals + 36 practical per tier; 4 exercises each.
- [x] Backend bank: same contract, database/API/security/concurrency focus.
- [x] Fullstack bank: same contract, cross-boundary/product workflows.
- [x] Shared aptitude/interview and language banks; optional AI cue corrections.
- [x] Session domain: tests first for 12-item selections, topic distribution,
      unseen preference, canonical scoring, history, reload and version transitions.
- [x] Exercise domain/storage: tests first for independent drafts, two-exercise
      completion, migration, malformed session fields and isolation.
- [x] Integrate accessible controls, dynamic counts, feedback and documentation.
- [x] Full tests/typecheck/lint/format/build; browser retake and exercise flows;
      independent final review and fixes.

## Review focus

Reload during a partial session; retakes after 20 attempts; version-1 saved work;
switching exercises before saving finishes; distractors revealing correct answers.

## Verification record

No external ticket. Implementation followed the user's explicit go-ahead.
No new runtime dependencies, commits or pushes.

- All 42 supported profiles have 120 core questions and 17 core exercises.
  Optional AI adds 16 questions and 3 exercises.
- All six language choices have 12 questions per tier, including six language-
  and tier-specific items. Role banks supply 24 fundamentals and 36 practical
  questions per tier; each includes distinct scenarios and concrete artifacts.
- All four answer-length strategies stay below 45% expected success in every
  supported module (ties split uniformly); observed maximum is 43.8%.
  Manual edits replaced unrelated distractors with plausible misconceptions.
- Unit/content/domain/storage tests: 63/63 passed. Typecheck, lint, formatting
  and production build passed on the integrated implementation.
- Browser tests cover shuffled canonical scoring, unseen retakes, stable reloads,
  independent drafts/reviews, two-exercise completion, lifecycle, persistence,
  accessibility and responsive layouts: final 13/13 passed. An earlier navigation
  was interrupted by a content-edit Fast Refresh; the complete run passed after
  edits stopped, without relaxing assertions or adding retries.
- Mobile exercise picker and assessment inspected at 390px: readable controls,
  correct question/exercise counts, no horizontal overflow.
- Independent runtime review found inconsistent trust in cached attempt scores;
  a failing regression reproduced it and the shared recomputation fix passed.
  Focused follow-up found it resolved. Independent storage/migration review
  found no further actionable issues; 22 focused tests passed.
- Version-one history and drafts remain readable. Version-two completion requires
  fresh preparation, assessment and exercise self-review.
- Dependencies were copied into this worktree after Turbopack rejected an external
  node_modules symlink. Local browser execution used the approved port/browser context.

Limitations: exercises are self-reviewed, not executed or AI-graded. Automated
cue checks and editorial review do not establish psychometric validation.
