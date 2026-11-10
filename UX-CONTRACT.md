# Jobprep interaction contract

Business source: approved `docs/superpowers/specs/2026-10-26-job-preparation-design.md`.
Curriculum expansion: `docs/superpowers/specs/2026-10-27-question-bank-design.md`.
Visual source: `DESIGN.md`. Locale: English; dates use browser locale/timezone.

## Canonical UI Map

| Capability     | Canonical owner                                          | Source of truth         | Allowed variants                          | Verification                       |
| -------------- | -------------------------------------------------------- | ----------------------- | ----------------------------------------- | ---------------------------------- |
| Form           | Material UI Radio, Checkbox and TextField                | Approved spec           | radio / checkbox / response               | E2E validation and accessibility   |
| Select/Listbox | Material UI Radio/Button; labeled native exercise select | Approved specs          | role / tier / language / theme / exercise | Keyboard and E2E                   |
| Scrollbar      | src/app/globals.css                                      | DESIGN.md               | standards and WebKit fallback             | Computed style and viewport checks |
| Toast          | Material UI Alert and Redux save status                  | Approved spec           | storage error / conflict                  | Resilience E2E                     |
| CRUD           | Progress domain functions and ConfirmDialog              | Approved spec lifecycle | enroll / reset / unenroll                 | Lifecycle E2E                      |

## Flow ledger

Enroll saves role/tier/language/AI and navigates to overview. Re-enrolling resumes
that profile. Prep/response/review updates enqueue a save after each action and show
saving status until the serialized Web Locks write completes. Quiz drafts persist,
submission validates all answers, saves an immutable
snapshot and displays feedback. Retake clears only the current quiz draft/result
display, retaining history and best results. Paths remain unlocked.

Each quiz draws 12 questions, prioritizing unseen and least recently practiced
items and balancing topics among equally recent questions. Question and option
order vary between attempts; the current selection and canonical answers survive
reload. Each exercise has an independent draft and self-review. Module completion
requires the preparation checklist, a passing current-version quiz, and any two
reviewed nonempty exercise responses. Editing a response clears only its review.

Reset confirms path identity and erases that profile's work while keeping choices.
Unenroll confirms retention and returns to onboarding. Both use the shared
Material UI Dialog adapter, focus Cancel initially, support Escape and restore trigger focus.
Actions are disabled while the dialog is exiting; a cancelled dialog must finish
closing before a new dialog interaction. Tabs, progress and stepper behavior are
owned by Material UI. Responsive domain layout remains in the app stylesheet.

## Recovery

Initial hydration shows a stable loading state. Invalid storage is preserved and
writes blocked until explicit recovery. Unavailable storage allows in-memory work
with a persistent error. Stale-tab conflict blocks edits; load latest to proceed.
Saves and explicit recovery share an exclusive browser lock, with revision/raw-data
checks inside it. Without Web Locks, saving fails closed to in-memory mode. Actual
page unload warns if edits are unsaved; normal client navigation preserves them.
Unknown practice modules show a link back to the path. Disabled AI offers settings.
No autosave network operation, external submission, account, money or permissions.

## Accessibility and state

Native semantics, named navigation, fieldsets/legends, associated labels, visible
focus, inline errors and live status. Quiz first-error group receives focus on
failed submission. Textareas auto-grow and have no user resize handle. Dialogs use
Material UI Modal focus trapping and restoration. Theme and reduced motion apply across views.
Local answers never enter URL parameters. No charts depend on color alone.

Redux Toolkit is the single observable source for workspace data, theme, hydration,
saving and errors. Each provider creates its own store. Persistence, promises,
Web Locks and DOM effects stay in the controller, outside reducers. The saved JSON
schema/key remains version 1; optional session and exercise fields preserve legacy
readability. Content version 2 retains prior drafts and attempt history while
requiring fresh preparation checks, assessments and exercise reviews for completion.
