import { type TechnicalTrack, type Tier } from './types';

export const frontendTracks: Record<Tier, TechnicalTrack> = {
  junior: {
    learn: [
      {
        title: 'Start with meaningful HTML',
        body: 'Use a button for an action and a link for navigation. Give inputs visible labels. A native button supplies focus and keyboard activation; a clickable div does not. Test the page with only Tab, Shift+Tab, Enter, and Space.',
      },
      {
        title: 'Understand data and state',
        body: 'Trace values through inputs, derived output, and event handlers. Keep a single source of truth for an editable value. Distinguish empty, loading, success, and error states before writing the happy-path interface.',
      },
      {
        title: 'Make the layout adapt',
        body: 'Build from content constraints: allow text to wrap, use flexible tracks, and contain long code inside its own scroll area. Try a 375px viewport and 200% zoom. Avoid fixed widths that push controls off screen.',
      },
    ],
    build: [
      {
        title: 'Define an accessible form contract',
        body: 'For an email-preference form, define valid input, labels, submit behavior, and feedback. Preserve the user’s input after an error. Connect each error to its field and move focus to the first error when submission fails.',
      },
      {
        title: 'Implement and test the states',
        body: 'Exercise an empty submit, malformed input, a valid save, and a failed save. Prevent duplicate submissions while work is pending. Announce the result in text so it does not depend on color.',
      },
      {
        title: 'Review behavior on a narrow screen',
        body: 'Check keyboard order and touch targets. Ensure labels, help, and buttons stay visible with long text. Explain one tradeoff between a native control and a custom control, including its maintenance cost.',
      },
    ],
    task: 'Design an accessible email-preference form with validation, pending, success, and failure states. Describe the markup, state transitions, and at least four behavior checks.',
    reference:
      'Use a labeled email input and a submit button inside a form. Keep the entered value after a failure, show a connected field error, and announce save status. Test missing/invalid values, a successful save, network failure, and keyboard operation. Use fluid width so content fits a narrow viewport.',
  },
  mid: {
    learn: [
      {
        title: 'Control asynchronous state',
        body: 'Model loading, loaded, empty, and failed states explicitly. When a query changes, cancel an old request or ignore its result. A response arriving last is not necessarily the response for the current input.',
      },
      {
        title: 'Own feature boundaries',
        body: 'Keep state with the feature that owns it and derive values instead of storing duplicate copies. Define UI/API contracts for missing fields, pagination, authorization failures, and retriable errors.',
      },
      {
        title: 'Measure user-facing performance',
        body: 'Inspect network timing, render work, and layout shifts before optimizing. Test on slower hardware and realistic data. Virtualization or memoization has maintenance costs, so use it to address measured bottlenecks.',
      },
    ],
    build: [
      {
        title: 'Write a testable search contract',
        body: 'Specify query, pending state, no-results feedback, clear behavior, and stale-response handling. Decide whether filters belong in the URL so a link or reload restores the same view.',
      },
      {
        title: 'Protect edits and failures',
        body: 'Preserve a draft when a save fails, prevent duplicate submission, and communicate whether data is saved locally or remotely. An optimistic success needs a rollback strategy when the server rejects the operation.',
      },
      {
        title: 'Test the integration boundary',
        body: 'Simulate a slow old response after a fast new response. Check network failure, keyboard use, a long result title, and a narrow viewport. Assert behavior without relying on component-private implementation.',
      },
    ],
    task: 'Plan a searchable, paginated user list. Include URL filters, an explicit clear action, request races, empty/error states, accessible controls, and tests for out-of-order responses.',
    reference:
      'Treat the committed query and page as navigation state. Reset the page after a filter change, abort or invalidate superseded requests, and keep the active input responsive. Distinguish no matches from network errors. Test a slow old request arriving after a newer result and ensure it cannot replace the current view.',
  },
  senior: {
    learn: [
      {
        title: 'Set durable frontend boundaries',
        body: 'Separate product policy from reusable interaction behavior. A shared component should expose a stable contract for focus, validation, and feedback, not merely matching CSS. Plan compatibility and gradual adoption before changing that contract.',
      },
      {
        title: 'Treat accessibility and performance as system properties',
        body: 'Define representative user journeys and measurable budgets. Combine automated checks with keyboard and assistive-technology review. An aggregate score cannot prove that a critical workflow is usable.',
      },
      {
        title: 'Plan migration and operational feedback',
        body: 'Map consumers, introduce compatible variants, migrate gradually, and retire old paths only after evidence. Instrument failures without collecting sensitive form contents. Define rollout and rollback criteria before release.',
      },
    ],
    build: [
      {
        title: 'Write a migration decision record',
        body: 'For a shared form system, list consumers and observable behavior: validation timing, focus, local drafts, and submission. Compare incremental adoption with a rewrite using team capacity and risk, not aesthetics alone.',
      },
      {
        title: 'Choose a representative pilot',
        body: 'Select a flow with realistic error and accessibility needs. Verify compatibility with downstream callers and compare task completion, regressions, and performance to the current implementation.',
      },
      {
        title: 'Create evidence for the rollout',
        body: 'Combine contract tests, end-to-end workflows, keyboard review, and sampled production indicators. Keep a rollback path until migration health is established. Teach the new contract and prevent introduction of the retired pattern.',
      },
    ],
    task: 'Propose an incremental migration of a shared form system used by several teams. Cover behavioral compatibility, accessibility, performance evidence, ownership, rollout, and rollback.',
    reference:
      'Inventory consumers and establish a canonical contract for labels, validation, focus, drafts, pending states, and failure recovery. Pilot a representative workflow behind a reversible boundary. Test compatibility and actual user journeys, document ownership, measure regressions and performance, and expand only while the agreed acceptance criteria hold.',
  },
};
