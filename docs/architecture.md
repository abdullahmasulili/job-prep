# Jobprep architecture

Jobprep bundles its curriculum and practice workflows into a static site. The browser owns enrollment, progress, quiz answers, exercise drafts, and theme preferences. The optional AI module uses bundled content and self-review.

## Routes and deployment

[Next configuration](../next.config.ts) enables static export outside the development server. [Wrangler](../wrangler.jsonc) serves the build output from `out/`. The [practice route](../src/app/practice/%5BmoduleId%5D/page.tsx) generates its paths from `moduleIds` in the catalog and disables dynamic parameters. The active profile and the availability of AI practice are resolved in the browser. See the [route map and local commands](../README.md#app-navigation) and [deployment instructions](../README.md#deploy-to-cloudflare-pages).

## Code ownership

| Area              | Owner                                                                                                                      | Responsibility                                                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Route composition | [Root layout](../src/app/layout.tsx) and [routes](../src/app/)                                                             | Wire route views and mount the Material UI cache provider, `ProgressProvider`, `AppTheme`, and `Shell` in that order.             |
| Interaction       | [Screen components](../src/components/) and [shared UI](../src/components/ui.tsx)                                          | Render the workspace, practice flows, feedback, and confirmations. Use `useProgress` to update workspace data.                    |
| Presentation      | [Theme](../src/theme/theme.ts), [theme adapter](../src/components/app-theme.tsx), and [global CSS](../src/app/globals.css) | Define Material UI tokens and components, expose semantic CSS variables, and handle responsive layout.                            |
| Curriculum        | [Catalog](../src/content/catalog.ts), [content types](../src/content/types.ts), and [banks](../src/content/banks/)         | Define supported profiles and assemble ordered, versioned modules from guides, questions, exercises, and references.              |
| Study rules       | [Progress](../src/lib/progress.ts) and [sessions](../src/lib/sessions.ts)                                                  | Handle enrollment, scoring, and completion. Select questions and preserve session and choice order across reloads.                |
| Workspace state   | [Redux store](../src/lib/workspace-store.ts) and [progress provider](../src/components/progress-provider.tsx)              | Create one store per provider. Expose state and commands, hydrate from browser storage, and coordinate queued saves and recovery. |
| Persistence       | [Storage adapter](../src/lib/storage.ts)                                                                                   | Validate saved JSON, serialize writes and recovery with Web Locks, and detect conflicts inside the lock.                          |

## From a practice action to a saved result

1. `ProgressProvider` hydrates the workspace from localStorage. `PracticeView` resolves the route's module against the active profile's curriculum.
2. A screen calls `change` or `changeModule` through `useProgress`. Domain functions calculate the next workspace state. For an assessment, question IDs and canonical answer indices tie the draft to the selected session even when choices are shuffled.
3. The provider publishes the update to Redux and queues a save. The storage adapter validates the stored data and checks its revision inside the lock before writing. A stale tab must load the latest progress. A write failure can leave work in memory and surfaces a warning.
4. On reload, the provider reads the last saved snapshot. The controller blocks writes to unreadable data and preserves it until the learner confirms local recovery. Recovery checks that the raw value is still the one the learner agreed to replace.

## Compatibility boundaries

- The storage key `jobprep.progress.v1` and JSON `schemaVersion` govern the persisted workspace format. The module versions in the catalog govern compatibility with curriculum changes. Review both when changing saved fields or content shape.
- Profile identity is `role:tier:language`. Unenrolling clears the active selection while retaining the profile. Reset path clears one profile's module work. The confirmed local-data recovery action replaces the whole saved workspace.
- A module version change resets preparation and requires a compatible quiz result and fresh exercise review. `currentModule` retains written responses and attempt history. Stable exercise IDs let updated modules find those drafts.
- Saved data is scoped to the browser origin. Missing Web Locks leaves practice available in memory. The [interaction contract](../UX-CONTRACT.md#recovery) defines how the UI communicates these states.
