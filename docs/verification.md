# Verification by change

Run checks from the repository root after following [Run locally](../README.md#run-locally). Use [the package scripts](../package.json) and choose the checks that cover the behavior you changed.

| Change                                       | Checks                                                                                                                                                                                                                         |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Markdown and agent guidance                  | Run `pnpm exec prettier --check` with the changed Markdown paths. Check relative links and anchors, and confirm any cited commands and file names against the repo.                                                            |
| Curriculum, scoring, sessions, or enrollment | Run `pnpm test`. For changes to the learner flow, also run the relevant Playwright spec under `tests/e2e/`.                                                                                                                    |
| Persistence or workspace state               | Run `pnpm test` and `pnpm test:e2e tests/e2e/resilience.spec.ts`. Verify legacy data, reload, write failure, and overlapping tabs as applicable.                                                                               |
| UI or interaction                            | Run `pnpm test:e2e tests/e2e/accessibility.spec.ts` and the affected flow spec. For visual changes, also inspect narrow and wide layouts in both themes. Check keyboard focus and any changed loading, empty, or error states. |
| Routes, build configuration, or hosting      | Run `pnpm build`. Use `pnpm start` to preview `out/` and open changed routes directly, including applicable practice module URLs.                                                                                              |

For TypeScript or JavaScript changes, also run `pnpm typecheck` and `pnpm lint`. Use the [full verification commands](../README.md#verify) for cross-cutting changes. Playwright uses installed Google Chrome and starts or reuses the server on port 3100. For browser checks against the export, start the built preview on port 3100 before running Playwright.

Report what ran and what passed. If a check is unavailable, name the missing prerequisite and the behavior the check would have covered.
