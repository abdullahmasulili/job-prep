# Material UI and Redux Toolkit migration

User request: convert the existing UI to Material UI and use Redux Toolkit when
shared state needs management. Preserve the approved preparation flows and data.

1. Add a per-provider Redux Toolkit store for durable workspace data and shared
   hydration/save/error status. Keep all browser I/O, Web Locks, queues and revision
   checks outside reducers. Preserve `useProgress` as the view-facing adapter and
   retain `jobprep.progress.v1` so saved work remains compatible.
2. Integrate Material UI with the Next.js App Router cache and a project theme.
   Preserve blue/neutral identity, local fonts, light/dark appearance and responsive
   layouts. Material UI owns Buttons, Papers, Chips, navigation, radio/checkbox
   controls, text fields, tabs, stepper, progress and confirmation dialogs.
3. Replace hand-built interaction primitives across every screen; remove their
   obsolete CSS. Keep semantic HTML for instructional content and domain layouts.
   Preserve accessible labels, validation focus, keyboard tabs, dialog cancellation,
   local drafts and all assessment/enrollment behavior.
4. Verify isolated Redux stores and saved-data compatibility; run the existing
   unit/storage/content suite and production browser workflows. Inspect desktop,
   phone and dark mode, run type/lint/format/build checks, then obtain one final
   independent review and preserve the verified migration in local Git history.

Scope excludes curriculum changes, new features, cloud state, remote publishing,
or changes to completion/scoring rules. Existing Context state is intentionally
replaced rather than mirrored: Redux becomes the single observable state source.

All four steps are complete. Verification and the independent review outcome are
recorded in [the migration report](../../../artifacts/material-ui-migration.md).
