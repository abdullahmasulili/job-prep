import { q, type TechnicalTrack, type Tier } from './types';

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
    questions: [
      q(
        'fe-j-1',
        'A control saves preferences. Which HTML element is the best default?',
        ['button', 'A button supplies action semantics and native keyboard activation.'],
        [
          [
            'div with an onClick handler only',
            'A div lacks the keyboard and semantic behavior required for an action.',
          ],
          [
            'a without an href',
            'An anchor without a destination is not the appropriate native action control.',
          ],
          [
            'span with blue text',
            'Visual styling does not provide focus, activation, or action semantics.',
          ],
        ],
      ),
      q(
        'fe-j-2',
        'A search response returns no matches. What should the interface display?',
        [
          'A clear no-results message and a way to adjust the query',
          'A distinct empty result tells the user the request succeeded but found no matching items.',
        ],
        [
          [
            'An endless loading spinner',
            'Loading would falsely imply the completed request is still running.',
          ],
          [
            'An unexplained blank panel',
            'A blank panel does not distinguish no results from a broken interface.',
          ],
          [
            'A generic server error',
            'A successful response with no matches is not a server failure.',
          ],
        ],
      ),
      q(
        'fe-j-3',
        'A fixed-width panel overflows a phone viewport. What is the most suitable correction?',
        [
          'Use a fluid width and allow children to wrap or shrink',
          'The layout must fit available space; flexible sizing and wrapping address the source of the overflow.',
        ],
        [
          [
            'Hide the right half of the panel',
            'Clipping removes information and controls rather than adapting the layout.',
          ],
          [
            'Reduce every font to 8px',
            'Unreadable text does not resolve rigid geometry or preserve usability.',
          ],
          [
            'Disable browser zoom',
            'Blocking zoom limits accessibility and does not fix the layout constraint.',
          ],
        ],
      ),
      q(
        'fe-j-4',
        'An input has only placeholder text as its label. What should change?',
        [
          'Add a persistent, associated label',
          'A visible associated label remains available after typing and provides an accessible name.',
        ],
        [
          [
            'Make the placeholder lighter',
            'Lower contrast makes the hint harder to read and still provides no persistent label.',
          ],
          [
            'Remove the input’s name',
            'The name attribute has a separate form-data role and does not create a visible label.',
          ],
          [
            'Use color alone to identify the input',
            'Color does not communicate an unambiguous input purpose to all users.',
          ],
        ],
      ),
      q(
        'fe-j-5',
        'A form save fails. Which behavior best supports recovery?',
        [
          'Preserve input and show actionable error feedback',
          'Retaining work lets the user correct or retry without re-entering their response.',
        ],
        [
          [
            'Clear every field immediately',
            'Clearing data after failure forces unnecessary work and removes diagnostic context.',
          ],
          [
            'Show a success message anyway',
            'False success misrepresents whether the data was saved.',
          ],
          [
            'Disable the form permanently',
            'A recoverable failure should offer correction or retry rather than a dead end.',
          ],
        ],
      ),
      q(
        'fe-j-6',
        'Which test best checks a counter’s visible behavior?',
        [
          'Click Increment and assert the displayed count increases by one',
          'This checks the user-facing contract rather than implementation details.',
        ],
        [
          [
            'Assert the component file exists',
            'File existence does not verify that the interaction works.',
          ],
          [
            'Assert a private helper was called',
            'A helper call does not prove the rendered count changed correctly.',
          ],
          [
            'Check only the button’s color',
            'Color does not establish the behavior of the counter.',
          ],
        ],
      ),
      q(
        'fe-j-7',
        'Why should feedback include text as well as color?',
        [
          'Users may not perceive or distinguish the color',
          'Text communicates meaning independently of color perception and display conditions.',
        ],
        [
          [
            'Text guarantees the network request succeeded',
            'A message can still be wrong; feedback must reflect the actual request result.',
          ],
          [
            'Color is unsupported in modern browsers',
            'Modern browsers support color; the concern is accessible interpretation.',
          ],
          [
            'It removes the need for semantic HTML',
            'Text feedback complements, rather than replaces, semantic structure.',
          ],
        ],
      ),
    ],
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
    questions: [
      q(
        'fe-m-1',
        'An old search response arrives after the new query’s response. What prevents stale results?',
        [
          'Cancel old requests or reject responses with an outdated request identity',
          'Only the current query’s response should update the visible results. Cancellation or request identity enforces that ownership.',
        ],
        [
          [
            'Always use the last response to arrive',
            'Arrival order is not the same as query order.',
          ],
          [
            'Increase the input debounce indefinitely',
            'Debouncing can reduce requests but does not guarantee correct response ordering.',
          ],
          [
            'Disable search after the first request',
            'This avoids the actual interaction contract instead of making it correct.',
          ],
        ],
      ),
      q(
        'fe-m-2',
        'A component stores items and also stores a count that is always items.length. What is usually preferable?',
        [
          'Derive the count from items',
          'Derivation removes a second state value that could become inconsistent with the list.',
        ],
        [
          [
            'Update the count in a separate timer',
            'A timer adds delay and another synchronization failure mode.',
          ],
          [
            'Store three independent count copies',
            'More copies create more opportunities for divergence without adding information.',
          ],
          [
            'Calculate the count only once at module load',
            'A one-time calculation will not reflect later list changes.',
          ],
        ],
      ),
      q(
        'fe-m-3',
        'A text field visibly lags. What should guide the first optimization?',
        [
          'Measure input-to-render work and identify the expensive path',
          'A trace can distinguish unnecessary rendering, synchronous computation, and other causes before choosing an optimization.',
        ],
        [
          [
            'Memoize every component immediately',
            'Broad memoization adds complexity and may not address the measured bottleneck.',
          ],
          [
            'Remove accessible labels',
            'Labels are not a justified performance target and removing them harms usability.',
          ],
          ['Change the theme color', 'Color choice does not diagnose input latency.'],
        ],
      ),
      q(
        'fe-m-4',
        'An optimistic save is rejected. What must the feature support?',
        [
          'Restore a consistent state and explain the failure with a retry path',
          'Optimistic changes need reconciliation when the server rejects them, while preserving useful user work.',
        ],
        [
          [
            'Keep showing saved forever',
            'This misrepresents the durable state and can cause data loss.',
          ],
          ['Ignore the response', 'Ignoring rejection leaves the browser and server inconsistent.'],
          [
            'Delete every unrelated draft',
            'A local operation failure does not justify destroying unrelated work.',
          ],
        ],
      ),
      q(
        'fe-m-5',
        'Why put committed filters in the URL for a browseable results page?',
        [
          'So links, reloads and history can restore the view',
          'The URL is an appropriate source for shareable navigation state when it contains no sensitive data.',
        ],
        [
          [
            'So passwords can be shared too',
            'Secrets must not be encoded into browseable URLs or history.',
          ],
          [
            'To avoid validating API responses',
            'Navigation state does not remove the need to validate data boundaries.',
          ],
          [
            'To guarantee requests cannot race',
            'Response ordering requires a separate cancellation or identity mechanism.',
          ],
        ],
      ),
      q(
        'fe-m-6',
        'Which regression test is most useful for a race-condition fix?',
        [
          'Resolve a newer request first, then an older request, and assert the newer results remain',
          'The controlled ordering reproduces the actual failure and proves stale results cannot overwrite current ones.',
        ],
        [
          ['Run only one fast request', 'A single request cannot reproduce an out-of-order race.'],
          [
            'Assert the filename contains “search”',
            'A filename does not establish runtime behavior.',
          ],
          [
            'Wait a fixed ten seconds without assertions',
            'Waiting alone neither controls ordering nor proves correctness.',
          ],
        ],
      ),
      q(
        'fe-m-7',
        'A large image causes page content to jump on load. What directly addresses the layout shift?',
        [
          'Reserve space using its dimensions or aspect ratio',
          'Known geometry lets the browser allocate the image’s space before its bytes arrive.',
        ],
        [
          ['Add a box shadow', 'A shadow does not reserve layout space.'],
          [
            'Hide the entire page until every resource loads',
            'Blocking all content is a costly workaround and not the direct geometry fix.',
          ],
          [
            'Increase animation duration',
            'A longer animation can prolong movement without correcting missing space.',
          ],
        ],
      ),
    ],
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
    questions: [
      q(
        'fe-s-1',
        'A shared component changes validation timing. What should determine whether this is breaking?',
        [
          'Its observable contract and effects on existing consumers',
          'Behavior such as validation timing and focus can be a compatibility contract even if TypeScript props did not change.',
        ],
        [
          [
            'Whether the CSS class names changed',
            'Class names alone do not capture validation behavior or caller expectations.',
          ],
          [
            'Whether the new code is shorter',
            'Code length does not establish compatibility for existing users.',
          ],
          [
            'Whether the author likes the interaction',
            'Personal preference does not override established behavior and consumer needs.',
          ],
        ],
      ),
      q(
        'fe-s-2',
        'An accessibility scanner reports no issues. What can you conclude?',
        [
          'Its covered automated checks passed; important manual workflow checks remain',
          'Automation catches a subset of accessibility issues and cannot prove every interaction is usable.',
        ],
        [
          [
            'Every user can complete every workflow',
            'The scanner does not simulate all users, devices, or task semantics.',
          ],
          [
            'Keyboard testing is unnecessary',
            'Keyboard operation includes behavior that static checks may not assess.',
          ],
          [
            'All labels communicate the right meaning',
            'A label can technically exist while still being confusing or misleading.',
          ],
        ],
      ),
      q(
        'fe-s-3',
        'A team proposes a full rewrite to unify UI behavior. What is the strongest evaluation?',
        [
          'Compare incremental migration and rewrite against compatibility, delivery cost and measurable risks',
          'A good decision weighs alternatives against actual constraints rather than assuming a rewrite is always beneficial.',
        ],
        [
          [
            'Always rewrite because old code has no value',
            'Existing behavior and accumulated knowledge may be expensive to replace correctly.',
          ],
          [
            'Never change shared components',
            'Avoiding all change prevents necessary improvements and does not manage evolution.',
          ],
          [
            'Choose solely by screenshot similarity',
            'Visual resemblance does not establish interaction compatibility or maintainability.',
          ],
        ],
      ),
      q(
        'fe-s-4',
        'What makes a frontend performance budget useful across teams?',
        [
          'Representative journeys, agreed metrics and thresholds, and an enforcement/exception process',
          'A measurable contract tied to user journeys guides decisions and makes regressions actionable.',
        ],
        [
          [
            'One score with no defined test environment',
            'An undefined environment makes results difficult to compare or act on.',
          ],
          [
            'A rule to use memoization everywhere',
            'A technique is not a measured performance outcome and can add overhead.',
          ],
          [
            'Only bundle size regardless of experience',
            'Bundle size matters but does not capture all latency and rendering behavior.',
          ],
        ],
      ),
      q(
        'fe-s-5',
        'What is a safer rollout for a high-risk shared UI change?',
        [
          'Pilot representative flows, monitor agreed indicators, and retain a rollback path',
          'Limited exposure and explicit acceptance criteria reduce migration risk while collecting useful evidence.',
        ],
        [
          [
            'Replace every consumer in one untested release',
            'Large simultaneous exposure makes defects harder to isolate and reverse.',
          ],
          [
            'Remove the old path before checking the new one',
            'Removing recovery before validation increases the cost of a failure.',
          ],
          [
            'Measure only developer enthusiasm',
            'Sentiment does not establish user-facing reliability or compatibility.',
          ],
        ],
      ),
      q(
        'fe-s-6',
        'What should client error telemetry avoid collecting by default?',
        [
          'Raw sensitive form contents and authentication secrets',
          'Diagnostic evidence should minimize sensitive information; tokens and private inputs can create exposure.',
        ],
        [
          [
            'Error category',
            'A sanitized category can help diagnose a failure without including private data.',
          ],
          ['Application version', 'Version information helps correlate failures with releases.'],
          [
            'A sanitized workflow identifier',
            'A non-sensitive identifier can locate the affected flow without recording its input.',
          ],
        ],
      ),
      q(
        'fe-s-7',
        'How should a shared component’s ownership support adoption?',
        [
          'Document the contract, provide migration examples, and define who handles changes',
          'Clear ownership and examples make reuse predictable and reduce divergent copies.',
        ],
        [
          [
            'Tell every team to fork it',
            'Independent forks recreate the divergence the shared system is meant to address.',
          ],
          [
            'Change behavior without release notes',
            'Undocumented changes make compatibility failures difficult to anticipate.',
          ],
          [
            'Require all product rules inside the primitive',
            'Embedding every product rule makes the shared primitive difficult to reuse and maintain.',
          ],
        ],
      ),
    ],
  },
};
