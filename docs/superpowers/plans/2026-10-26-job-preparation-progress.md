# Execution ledger: 2026-10-26-job-preparation.md

Spec approved. Plan self-reviewed for coverage and interface consistency.
Pre-flight: content types feed progress and views; state adapter exclusively owns persistence; all interfaces consistent.
Ruling: execute inline in the existing workspace on a feature branch because the repository contains only the initial design; no competing implementation needs worktree isolation. Cost if wrong: changes are visible in this checkout, protected by the feature branch.
Ruling: explicit user request to execute takes precedence over another plan-approval pause. Cost if wrong: the implementation follows the already approved design.

Task 1: complete. Next.js 16.4.3 / React 19.3.1 installed. Nine role/tier tracks and all language combinations pass the content checks. Initial missing-catalog test observed RED, authored curriculum GREEN.
Task 2: complete. 12 unit/content/storage tests pass, including pass boundary, versioning, bounded retakes, AI independence, retention/reset, invalid schema, quota/denied storage and stale revisions. Missing progress/storage imports observed RED before implementation.
Task 3: complete. Enrollment, validation, themes, navigation, path/progress/settings and confirmations implemented. Browser tests verified reload and specific role/tier/language restoration.
Task 4: complete. Preparation, assessment and self-review flow passes browser checks, including missing-answer validation, correct/incorrect feedback, saved drafts, retakes and retained completion. Missing practice route observed RED before implementation.
Task 5: complete. Final suite: 15 unit and 12 production browser tests passed; typecheck, lint, formatter, production build and strict UI audit passed. Independent review completed and the Important finding was fixed. Screenshots inspected at desktop and mobile, including dark mode. Detailed evidence in artifacts/verification.md.
Regression: long saved responses were clipped after reload because hidden panels were measured. Reproduced with a failing browser test, fixed with active-panel and width-aware sizing; test and full suite GREEN.
Regression: onboarding validation did not focus the first invalid choice. Reproduced with a failing browser assertion, fixed with group focus/error associations; full suite GREEN.
Ruling: use installed Google Chrome for Playwright rather than download a separate Chromium build. Cost if wrong: contributors without Chrome must change the documented channel or install Chromium; README includes both paths.

Final review: independent reviewer found one Important overlapping-save race; no Critical or Minor findings.
Final: fixed overlapping writes: deterministic adapter test observed both saves succeeding (RED), then shared Web Locks serialized revision check + write (GREEN). Recovery resets use the same lock and compare the original raw data before replacement; cancellation prevents old queued snapshots from writing after reload/recovery.
Ruling: require Web Locks on HTTPS/localhost for persistent writes and fail closed to explicit in-memory mode otherwise. Cost if wrong: older/insecure browsers cannot persist; supported browsers retain safe cross-tab saving. README documents this boundary.
Final: Ruling: exhaustive hiring predictive value was not judged by the reviewer. The app records practice completion and states employer assessments vary; it claims no certification or hiring prediction. Cost if wrong: question difficulty may need later calibration with candidate feedback.
Final: Ruling: exhaustive editorial calibration was not independently judged. All question schemas, combinations and language variants are covered; author reviewed original content and linked source guidance. Cost if wrong: a content defect requires a reviewed curriculum update and version increment.

Final browser run: 12/12 passed against production with one worker and tracing disabled after an earlier traced run encountered host disk-space errors during context teardown. No product-flow assertion failed in that environmental run. Final unit suite: 15/15. No deferred Minor findings. Keep the local feature branch; no merge or remote publication was requested.
