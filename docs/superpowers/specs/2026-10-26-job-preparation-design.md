# Job preparation MVP design

Date: 2026-10-26 (Asia/Jakarta)
Status: Proposed for user approval. Product implementation has not started.
Builder review: completed; no important unanswered planning questions.

## Intent

Help developers prepare for job assessments using a specific role, seniority,
and programming language. Give learners a clear next step, substantive practice,
explanations, and a truthful view of their preparation progress.

The user requested Next.js; frontend, backend, and fullstack developer/engineer
roles; junior, mid, and senior tiers; detailed preparation steps; aptitude,
technical, and interview preparation; progress viewing, reset, and unenrollment.
Progress must stay in the browser. AI workflow preparation is an optional extension.
The user chose guided practice and clarified that executable coding assessments
should instead use multiple-choice questions because a compiler and code editor
would be difficult to maintain. The user declined browser mockups and prefers
to review the written design.

## Goals and boundaries

- Deliver a working, responsive Next.js application, with all nine role/tier
  paths populated and usable, rather than placeholder screens.
- Auto-score objective multiple-choice assessments, including code reading,
  debugging, implementation choices, and engineering tradeoffs.
- Offer written practical exercises and interview responses with saved drafts,
  reference approaches, and explicit self-review checklists.
- Keep completion, quiz results, and self-assessment distinct. Completion is
  preparation activity, not a certificate of professional competence.
- Save choices, drafts, attempts, and progress locally without an account.
- Keep optional AI work separate from required progress.
- Do not add code execution, a code editor dependency, live AI evaluation/chat,
  accounts, a database, payments, leaderboards, or fabricated hiring guarantees.
- The optional extension teaches working with AI tools; it does not require
  API keys, subscriptions, or a model integration.

## Approaches considered and decision

1. Guided practice with objective quizzes and rubric-based self-review:
   broad language coverage and transparent feedback with low operational cost.
   It cannot verify that a written implementation actually runs.
2. Executable coding assessments with runtime/test-case judging:
   stronger verification of implementations, but substantial runtime or external
   service maintenance. The user declined this maintenance burden.

Chosen: approach 1, incorporating coding-assessment scenarios as multiple-choice
questions. A plain response textarea is a scratchpad, not an executable editor.

## Product structure

### Onboarding

1. Choose Frontend, Backend, or Fullstack developer/engineer.
2. Choose Junior, Mid, or Senior, with short responsibility descriptions.
3. Choose a supported primary technical language.
4. Optionally enable AI workflow preparation; off by default.
5. Review the path and enroll.

Builder proposals for language coverage:

- Frontend: JavaScript or TypeScript.
- Backend: JavaScript, TypeScript, Python, Java, C#, or Go.
- Fullstack: JavaScript, TypeScript, Python, Java, C#, or Go as the primary
  language for backend/general coding scenarios. Browser-specific exercises
  explicitly use JavaScript/TypeScript, HTML, and CSS as applicable.
- SQL is a shared backend/fullstack skill, not an interchangeable primary language.
- Language choice changes actual snippets, explanations, and applicable exercises;
  changing only the label is unacceptable.
- These are curated MVP choices, not a claim that they rank highest in every
  hiring market. GitHub language activity is supporting context, not job demand.

Only one enrollment is active at a time. Other paths can be browsed and enrolled
in later; saved profiles remain available. A profile is identified by role, tier,
and language, so changing these choices does not mix unrelated attempts.

### Dashboard and path

The dashboard leads with the active role/tier/language, required completion, and
the next unfinished activity. Show module-level progress, best/latest quiz
results, recent attempts, and optional AI progress. Never invent activity,
streaks, scores, or users. Empty history explains how to make the first attempt.

The path contains four required modules in a suggested order. All modules are
accessible immediately so experienced learners can target gaps:

1. Aptitude and problem solving.
2. Role and language fundamentals.
3. Practical engineering and technical assessment preparation.
4. Interview preparation and communication.

Builder proposal for the minimum content per role/tier module:

- A specific goal, estimated effort labeled as an estimate, and 3-5 detailed
  preparation steps with concrete examples and useful references.
- Four authored multiple-choice questions, each with four plausible choices,
  one unambiguous correct answer, a rationale, and explanations of distractors.
- One applied exercise with instructions, a saved response draft, a reference
  approach, and at least three observable self-review criteria.

This yields 36 required modules and 144 required question slots across nine paths,
with shared aptitude content permitted where appropriate and language variants
for language-sensitive technical content. Content must genuinely change with
seniority; repeating questions with a new difficulty label is unacceptable.

### Assessment behavior

Questions may ask for output, a bug diagnosis, a suitable test, a secure fix, or
the best implementation under stated constraints. Supply enough context to make
one answer defensible. Avoid trivia that depends on unstated runtime versions.

Answers are editable until submission. Require every question to be answered.
After submission show the percentage, correct/incorrect choices, explanations,
and suggested review topics. Persist a snapshot of answers, score, and timestamp.
Retakes start a fresh attempt while keeping past results. Keep the most recent
20 attempts per quiz plus its best result to bound local storage use.

Builder proposal: passing is at least 75% (three of four questions). This is an
app practice threshold, not an industry certification requirement. A module is
complete when its preparation checklist is checked, a quiz has passed, and the
applied exercise has a nonempty response with all self-review criteria checked.
Use the best passing result so a later practice attempt does not undo completion.
Show each requirement and offer explicit controls for undoing self-review items.

Written exercises and interviews are self-reviewed. Never label them machine
graded or claim their correctness was verified. Reference approaches can be
revealed on demand and are available for learning, rather than hidden as a test
security measure. No timer or automatic timeout is required for this MVP.

### Tier and role content

| Tier | Aptitude | Technical and practical work | Interview |
| --- | --- | --- | --- |
| Junior | Logic, numerical reasoning, tracing, decomposition | Fundamentals, bounded tasks, error handling, basic tests, explaining code | Project walkthrough, clarifying questions, structured examples |
| Mid | Constraint-based reasoning, estimation, diagnosing evidence | Feature ownership, integrations, testing strategy, security, performance, maintainability | Tradeoffs, delivery decisions, collaboration, incident stories |
| Senior | Ambiguous scenarios, prioritization, risk and capacity reasoning | Architecture, reliability, migrations, observability, failure modes, design reviews | System design, leadership, mentoring, stakeholder decisions |

Frontend topics: semantic markup, responsive layout, accessibility, JavaScript
behavior, typed contracts where relevant, state/data flow, browser performance,
testing, security, and resilient user experiences.

Backend topics: primary-language behavior, HTTP/API contracts, validation,
authentication/authorization, SQL and data modeling, transactions, concurrency,
idempotency, security, testing, observability, and reliability.

Fullstack topics: browser/server boundaries, end-to-end data flow, contracts,
authentication, data consistency, error recovery, performance, testing, deployment
tradeoffs, and secure integration. Depth increases with tier.

Senior paths retain realistic foundations but emphasize responsibility and
reasoning. They must not merely ask obscure syntax questions.

### Optional AI workflow extension

One separate module per role/tier, with a preparation guide, four scenario-based
MCQs, and a self-reviewed exercise using supplied example AI output. No external
AI service is necessary to complete it.

- Junior: specify a small task, provide relevant context, understand generated
  code, spot defects, and test changes.
- Mid: scope changes, compare implementation options, inspect diffs, identify
  missing regression tests, protect sensitive data, and verify dependencies.
- Senior: define acceptance criteria, delegate bounded tasks, assess architecture
  and security risks, establish evidence for reviews, and retain accountability.

Tailor scenarios to frontend, backend, or fullstack responsibilities. Exercises
should reward verification rather than accepting plausible generated text.
Enabling/disabling this extension preserves its existing work. Optional progress
never changes the required completion denominator.

### Progress, reset, and unenrollment

- Resume: restore the last active profile, drafts, answers, checklists, and results.
- Switch: enroll in another configuration without deleting previous work;
  re-enrollment in a saved configuration resumes its progress.
- Reset current path: show a confirmation naming the path and consequences;
  clear its preparation checks, attempts, quiz drafts, written drafts, and both
  core/AI progress. Keep the enrollment and language/tier choices.
- Unenroll: show a confirmation; remove the active enrollment and return to path
  selection. Retain the profile as an inactive saved path, clearly explained in
  the dialog, so later enrollment resumes it. Reset is the explicit way to erase
  its preparation work.
- View progress: show required and optional completion separately, per-module
  requirements, and attempt history. Avoid a fabricated readiness score.

## Browser persistence and failure handling

Use versioned, validated localStorage data with stable content/profile IDs and
a content version. Read browser state after hydration and render a stable loading
state until initialization finishes. Never overwrite stored data with initial
defaults before loading it. Persist draft edits and completion actions locally.

Show a clear storage error if reads/writes fail or quota is exceeded. Keep the
current session usable in memory and state that changes may not survive reload.
Malformed or incompatible data must not crash the app or be silently overwritten;
offer an explicit local-data recovery/reset control. If multiple tabs write,
detect storage events and prompt to reload the latest state rather than silently
merging conflicting edits. Clearing site data or using another browser/device
does not preserve progress; explain this during onboarding and in settings.

Store only preparation data. No analytics or network submission of responses is
needed. No live content updates are promised: content is bundled and reviewed
when the application is updated. Version changes must not apply old answer
indices to changed questions; stale attempts remain historical but are excluded
from completion when their quiz version is incompatible.

## Proposed interface direction

Working product name: Jobprep. Builder choice, not a final brand supplied by user.
Use a calm study-workspace style, with a warm neutral canvas, deep ink text, and
blue for current actions and progress. The numbered path is the recurring motif,
helping learners locate their next step. Use a readable humanist sans serif for
instructions and a monospace face only for code snippets. Avoid ornamental
illustrations and invented social proof.

Dashboard/navigation: a compact desktop sidebar for overview, path, progress,
and settings; accessible compact navigation on mobile. The next activity is the
primary focus. Use a path list for sequence, and contained assessment panels for
working through questions. Generous spacing supports long reading sessions.

Energy 1 / Rhythm 2 / Motion 1: restrained hierarchy, varied reading/assessment
layouts, and brief state transitions with reduced-motion support. Include
working light/dark appearance preferences. Both themes need legible code,
controls, feedback, and visible keyboard focus.

Required UI states: first visit, incomplete onboarding, no active enrollment,
new path, partial path, completed path, quiz validation, submitted results,
retry, empty attempt history, storage unavailable/corrupt, and reset/unenroll
confirmation. Dialogs support Escape, focus management, and keyboard operation.
Feedback uses words/icons as well as color. No horizontal overflow on mobile.

## Architecture and maintenance

Use Next.js App Router and TypeScript. Keep curriculum and language variants in
typed content modules, scoring/completion/profile transitions in pure functions,
browser persistence behind one adapter, and interactive views in focused client
components. Keep server rendering free of browser APIs. Do not introduce a
backend solely for data that stays on the device.

Proposed routes: `/` (dashboard or onboarding entry), `/onboarding`, `/path`,
`/practice/[moduleId]`, `/progress`, and `/settings`. Direct practice links must
respect the active profile and handle unknown modules without crashing.

Use current official documentation via Context7 when implementing framework or
library behavior. The exact component library, local font availability, test
runner, and file organization are builder decisions. Choose minimal dependencies.
Do not initialize, commit, or publish Git history without applicable authorization;
the mandatory git-convention skill prohibits automatic commits from skill steps.

## Content grounding and freshness

Reviewed 2026-10-26. These are curriculum references, not a universal hiring exam
standard or an endorsement. Author original questions and explanations, with
source links attached to the relevant guides/assessments. Seniority mapping and
the practice passing threshold are our app's proposals.

- MDN curriculum: https://developer.mozilla.org/en-US/curriculum/
- MDN core modules: https://developer.mozilla.org/en-US/curriculum/core/
- SFIA 9 programming/software development responsibilities:
  https://sfia-online.org/en/sfia-9/skills/programming-software-development
- OWASP Top 10:2025: https://top10.owasp.org/2025/
- Responsible review and testing of generated code:
  https://docs.github.com/en/copilot/responsible-use/inline-suggestions
- Language ecosystem context, not a hiring ranking:
  https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/

Language semantics and specialized topics require relevant official sources during
content authoring. Display reference/review metadata so claims of freshness are
inspectable. Avoid claiming the static question bank updates itself daily.

## Verification and acceptance

- All role/tier/language combinations produce the intended content; no missing
  snippets or silent fallback to a different language.
- Validate content IDs, references, answer correctness structure, choice counts,
  required content counts, and language coverage with automated checks.
- Verify pure scoring, the 75% threshold, best/latest results, completion rules,
  separate AI denominator, version handling, and profile transitions with tests.
- Verify browser onboarding, completing a quiz, feedback, written draft recovery,
  checklist changes, reload persistence, switching/re-enrolling, reset, and
  unenrollment in end-to-end checks. Confirm failed/corrupt storage does not
  destroy data silently, and no wrong answers are accepted as passing.
- Run type/lint checks and a production build; inspect the actual app at mobile
  and desktop sizes, in both themes, using keyboard navigation and no-console-
  error checks on the core flows.
- Deliver the local app with clear run instructions and an honest description
  of static content, local-only persistence, and self-reviewed responses.

## Approval sought

Approve this MVP scope, including the proposed language set, four required modules
per path, multiple-choice scoring, saved self-reviewed responses, separate AI
extension, and reset/unenrollment semantics. After approval, write the implementation
plan and build the application.
