import { q, type TechnicalTrack, type Tier } from './types';

export const fullstackTracks: Record<Tier, TechnicalTrack> = {
  junior: {
    learn: [
      {
        title: 'Trace one request end to end',
        body: 'Follow a form value through a browser event, HTTP request, server validation, database write, response, and rendered feedback. Distinguish a network failure from a validation failure and from an empty successful result.',
      },
      {
        title: 'Keep secrets on the server',
        body: 'Browser bundles and requests are inspectable. Keep database credentials and private service tokens in server-controlled configuration. A hidden input or a minified variable does not make a secret private.',
      },
      {
        title: 'Validate across the boundary',
        body: 'Client validation helps people correct mistakes quickly; server validation enforces the actual contract. Check authorization for each resource. Make the browser handle error responses explicitly rather than assuming every resolved request succeeded.',
      },
    ],
    build: [
      {
        title: 'Design a complete task flow',
        body: 'Describe the form, request contract, ownership checks, persistence, and success response. Use native labeled controls and a pending state. Derive record ownership from trusted authentication, not an editable browser field.',
      },
      {
        title: 'Preserve work across a failure',
        body: 'When saving fails, keep the entered values and show a specific retry or correction action. Do not claim the record exists until the server confirms its durable result.',
      },
      {
        title: 'Test the full contract',
        body: 'Test an empty form, a valid create/read flow, a failed response, and access by a different user. Assert the visible result and stored behavior, not just that a request was sent.',
      },
    ],
    task: 'Describe a task-creation flow from browser form to persisted record. Include validation at both boundaries, safe secret handling, ownership, loading/error feedback, and end-to-end tests.',
    reference:
      'Use labeled browser controls and preserve draft input. Validate again on the server, derive the owner from trusted identity, and use bound database parameters. Return a safe structured response and show success only after confirmed creation. Test malformed input, failure, normal retrieval, and cross-user access.',
    questions: [
      q(
        'fs-j-1',
        'Where should a private database credential be used?',
        [
          'Only in server-controlled code/configuration',
          'A credential shipped to the browser can be inspected and reused by an untrusted client.',
        ],
        [
          ['In a hidden HTML input', 'Hidden inputs remain visible in source and developer tools.'],
          [
            'In a minified browser variable',
            'Minification does not make browser-delivered values secret.',
          ],
          [
            'In a URL query parameter',
            'URLs can enter history, logs and referrers, exposing the credential.',
          ],
        ],
      ),
      q(
        'fs-j-2',
        'Why must both browser and server handle validation?',
        [
          'Browser checks improve feedback; server checks enforce the contract',
          'The client is untrusted, while immediate browser feedback reduces unnecessary round trips for ordinary mistakes.',
        ],
        [
          [
            'Browser checks make the server trustworthy automatically',
            'Clients can bypass those checks or send requests directly.',
          ],
          [
            'Server checks make labels unnecessary',
            'Input labeling and validation serve different accessibility and correctness needs.',
          ],
          [
            'Both checks guarantee the network stays available',
            'Validation cannot prevent connectivity failures.',
          ],
        ],
      ),
      q(
        'fs-j-3',
        'A fetch call resolves with an HTTP 500 response. What should the application do?',
        [
          'Check the HTTP result and show a recoverable failure',
          'A received response can still carry a failure status; transport resolution is not application success.',
        ],
        [
          [
            'Always show saved because the promise resolved',
            'Promise resolution alone does not establish a successful operation.',
          ],
          [
            'Erase the user’s draft immediately',
            'A failure should preserve work so the user can recover.',
          ],
          [
            'Display database credentials for debugging',
            'Sensitive internal details must not be exposed in public feedback.',
          ],
        ],
      ),
      q(
        'fs-j-4',
        'A create request is still pending. What is appropriate UI behavior?',
        [
          'Show pending feedback and prevent duplicate submissions',
          'Clear pending state explains the wait and avoids accidental repeated work.',
        ],
        [
          [
            'Show success immediately without a strategy to reconcile',
            'Unconfirmed success can misrepresent whether the record exists.',
          ],
          [
            'Submit again every animation frame',
            'Repeated unbounded submissions can create duplicates and overload the server.',
          ],
          [
            'Hide the entire navigation permanently',
            'A pending request should not disable unrelated navigation indefinitely.',
          ],
        ],
      ),
      q(
        'fs-j-5',
        'Which identity should determine the owner of a newly created private task?',
        [
          'The authenticated identity verified by the server',
          'Ownership must come from a trusted identity boundary, not a user-editable field.',
        ],
        [
          [
            'Any userId typed into the browser',
            'An attacker can submit another person’s identifier.',
          ],
          [
            'The display name in local storage',
            'Local browser values are editable and are not authentication proof.',
          ],
          [
            'The first record in the users table',
            'Record order is unrelated to the requesting identity.',
          ],
        ],
      ),
      q(
        'fs-j-6',
        'Which end-to-end test best covers task creation?',
        [
          'Fill the form, submit it, and verify the created task appears after retrieval',
          'This checks the browser, API and persistence contract together.',
        ],
        [
          [
            'Assert the submit handler exists',
            'A handler can exist without saving or displaying anything correctly.',
          ],
          ['Count the CSS classes', 'Presentation structure does not verify the create flow.'],
          [
            'Only check the initial heading',
            'The initial page does not establish mutation or persistence behavior.',
          ],
        ],
      ),
      q(
        'fs-j-7',
        'A saved list contains no records. Which response is most useful?',
        [
          'An empty-state explanation and a create action',
          'The user needs to know the request succeeded and how to add the first item.',
        ],
        [
          [
            'A fake record to fill the space',
            'Invented user data misrepresents what has been saved.',
          ],
          ['An endless spinner', 'A completed empty request should not remain in loading state.'],
          ['A fatal error page', 'No records is a normal state, not necessarily a system failure.'],
        ],
      ),
    ],
  },
  mid: {
    learn: [
      {
        title: 'Own browser/server contracts',
        body: 'Specify request and response schemas, validation errors, authorization failures, and pagination. Treat type declarations as developer aids: untrusted network data still needs runtime validation at the boundary.',
      },
      {
        title: 'Coordinate caches and mutations',
        body: 'After a mutation, decide which views become stale and how to reconcile them. Avoid stale overwrite of a newer local edit. Include identities and relevant scopes in cache keys, and invalidate private data on identity changes.',
      },
      {
        title: 'Treat retries as a consistency problem',
        body: 'A timeout leaves an uncertain result. Use server-side idempotency for side effects, map retry status to the browser, and distinguish an uncertain operation from a definite failure or confirmed success.',
      },
    ],
    build: [
      {
        title: 'Specify a safe checkout flow',
        body: 'Define authoritative prices, inventory checks, request identity, payment state, and what the user sees during pending or uncertain outcomes. Browser totals are a presentation, not the authoritative charge calculation.',
      },
      {
        title: 'Make integration failures observable',
        body: 'Use a shared request or operation identifier across browser and server diagnostics without logging payment details. Simulate delayed responses and verify recovery can find the existing operation rather than create another one.',
      },
      {
        title: 'Test stale data and permission changes',
        body: 'Cover a stale cart, unauthorized request, duplicate click, response lost after success, and a new user session. Confirm cached private data from the old identity cannot be shown to the new one.',
      },
    ],
    task: 'Plan a checkout flow with authoritative server totals, duplicate-safe submissions, stale-cart handling, safe error states, and cache reconciliation after confirmation.',
    reference:
      'Treat catalog prices and stock as server-authoritative. Submit an operation-scoped idempotency key and preserve it for retries of the same logical request. Show pending or uncertain status until the server confirms the durable result, then invalidate affected views. Test a lost response after success and verify the retry returns the original order.',
    questions: [
      q(
        'fs-m-1',
        'Does a TypeScript response type validate arbitrary JSON at runtime?',
        [
          'No; untrusted JSON needs runtime validation where required',
          'Type annotations are erased and do not prove a network payload has the declared structure.',
        ],
        [
          [
            'Yes; any annotation rewrites invalid JSON',
            'A compile-time type does not transform or validate received values.',
          ],
          [
            'Yes, but only for private APIs',
            'Visibility of an API does not change type erasure at runtime.',
          ],
          [
            'No; therefore types have no value',
            'Types still help developers reason about verified data and catch static mistakes.',
          ],
        ],
      ),
      q(
        'fs-m-2',
        'After an order mutation, what should happen to cached order and stock views?',
        [
          'Reconcile or invalidate the affected cached data',
          'Mutation changes can make dependent views stale; update them according to the data contract.',
        ],
        [
          [
            'Keep every cached view forever',
            'Stale views may mislead the user about order or inventory state.',
          ],
          [
            'Invalidate unrelated private data for every user',
            'Invalidation should be scoped to affected identities and resources.',
          ],
          [
            'Assume the browser and server always share memory',
            'The browser and server do not share a single in-process cache.',
          ],
        ],
      ),
      q(
        'fs-m-3',
        'Which checkout value must the server calculate or verify authoritatively?',
        [
          'The payable total using trusted pricing and applicable rules',
          'A client can alter submitted values, so payment amounts must not be trusted from browser input.',
        ],
        [
          ['Only the button’s color', 'Styling is not an authoritative financial calculation.'],
          [
            'Only the browser window size',
            'Viewport dimensions do not establish the correct order total.',
          ],
          ['Nothing if the input is hidden', 'Hidden values remain editable by the client.'],
        ],
      ),
      q(
        'fs-m-4',
        'A checkout times out after the server may have charged. What should the retry do?',
        [
          'Reuse the same logical operation key and resolve its durable status',
          'Preserving operation identity makes it possible to recover the existing outcome without a second charge.',
        ],
        [
          [
            'Create a new key for every retry',
            'A new key can be interpreted as a new payment operation.',
          ],
          [
            'Always claim the charge failed',
            'The original side effect may have succeeded before the response was lost.',
          ],
          ['Always claim the charge succeeded', 'A timeout also cannot prove success.'],
        ],
      ),
      q(
        'fs-m-5',
        'When a user signs out and another signs in, what must happen to private cached data?',
        [
          'Clear or isolate it by verified identity and permission scope',
          'Private cached responses must not leak between sessions or identities.',
        ],
        [
          [
            'Reuse it because it is already downloaded',
            'Downloaded data remains private and may not belong to the new identity.',
          ],
          [
            'Only change the greeting',
            'Presentation changes do not remove stale sensitive records.',
          ],
          ['Hide the sign-out button', 'Hiding controls does not enforce cache isolation.'],
        ],
      ),
      q(
        'fs-m-6',
        'A stale browser cart submits an old price. What should the server do?',
        [
          'Validate against current authoritative rules and return a clear reconciliation result',
          'The client needs a deliberate way to handle changed pricing rather than silently trusting outdated input.',
        ],
        [
          [
            'Charge the browser’s total without checking',
            'Client totals can be stale or intentionally modified.',
          ],
          [
            'Return raw payment credentials',
            'Secrets are unrelated to explaining a price conflict and must stay private.',
          ],
          [
            'Retry the stale request forever',
            'Repeating identical stale input does not resolve the changed contract.',
          ],
        ],
      ),
      q(
        'fs-m-7',
        'Which test most directly verifies duplicate-safe checkout?',
        [
          'Submit the same operation twice and assert one durable order/charge result',
          'The observable side-effect count is the invariant the idempotency design is meant to protect.',
        ],
        [
          [
            'Check that both buttons look disabled',
            'Visual state alone cannot prevent direct or concurrent requests.',
          ],
          [
            'Assert two HTTP requests occurred',
            'Request count does not establish that only one side effect happened.',
          ],
          [
            'Only test a single successful purchase',
            'A single request cannot expose duplicate submission behavior.',
          ],
        ],
      ),
    ],
  },
  senior: {
    learn: [
      {
        title: 'Design around end-to-end invariants',
        body: 'Define what the user must observe across browser, API, jobs, and data stores. Decide where truth lives and which transitions can be temporarily stale. Component correctness alone does not establish a correct customer journey.',
      },
      {
        title: 'Evolve contracts across independent deployments',
        body: 'Browser tabs may outlive a server deployment. Maintain backward-compatible request/response handling during transitions and define a recovery path for clients too old to continue. Version contracts where compatibility cannot be preserved.',
      },
      {
        title: 'Balance experience, reliability and delivery',
        body: 'Compare architectures using user journeys, team boundaries, operability and failure recovery. A split into services adds network and ownership boundaries; it is not an automatic improvement over a modular deployment.',
      },
    ],
    build: [
      {
        title: 'Map a critical journey and its failure modes',
        body: 'For checkout, identify the authoritative order state, uncertain payment outcomes, webhook retries, stale clients and data boundaries. Define explicit state transitions and user-visible recovery.',
      },
      {
        title: 'Propose a staged architectural change',
        body: 'Choose a reversible boundary, preserve old clients during rollout, and route a small cohort first. Record how the team will detect contract failures, reconcile stuck operations, and restore service.',
      },
      {
        title: 'Review team-level ownership and evidence',
        body: 'Assign ownership for each operational state, including failures between teams. Use synthetic end-to-end probes and customer-relevant indicators alongside component metrics. State how sensitive data is redacted from diagnostics.',
      },
    ],
    task: 'Design a staged change to a checkout platform with independently deployed browser and API code. Include durable state, stale-client compatibility, uncertain payments, team ownership, rollout metrics and recovery.',
    reference:
      'Map the durable order state machine and authority for payment confirmation. Preserve compatible API behavior for older browser tabs, make duplicate events safe, and provide status reconciliation for uncertain outcomes. Pilot a cohort with customer-journey indicators, establish operational ownership, and retain a compatible rollback until the new flow is proven.',
    questions: [
      q(
        'fs-s-1',
        'Why must an API rollout consider old browser tabs?',
        [
          'Clients can keep running older code after the server deploys',
          'Independent client lifetimes require compatibility or an explicit safe update/recovery mechanism.',
        ],
        [
          [
            'Every browser instantly reloads on server deployment',
            'There is no automatic guarantee that existing tabs load the newest bundle.',
          ],
          [
            'Static types force all tabs to update',
            'Type definitions do not control deployed browser lifetimes.',
          ],
          [
            'Old clients can safely be ignored for every API',
            'Ignoring clients can break active user workflows and durable operations.',
          ],
        ],
      ),
      q(
        'fs-s-2',
        'Which indicator best tests a critical checkout journey?',
        [
          'Confirmed successful purchases with latency and failure visibility across the whole flow',
          'End-to-end outcomes detect failures that healthy individual components can conceal.',
        ],
        [
          [
            'Only the frontend bundle compiles',
            'Compilation does not establish payment, API or persistence behavior.',
          ],
          [
            'Only that every service process is running',
            'A running process can still return incorrect or failed outcomes.',
          ],
          ['The number of services deployed', 'Topology count does not measure customer success.'],
        ],
      ),
      q(
        'fs-s-3',
        'When is extracting a service a defensible choice?',
        [
          'When ownership, scaling or isolation benefits justify new operational and consistency costs',
          'A boundary should solve a concrete problem while acknowledging network and coordination tradeoffs.',
        ],
        [
          [
            'Whenever a file exceeds an arbitrary line count',
            'File size alone does not justify an independent operational boundary.',
          ],
          [
            'Because microservices remove network failures',
            'Splitting services introduces more network interactions and failure modes.',
          ],
          [
            'Because every team must use a different database',
            'Technology diversity is not automatically a product or reliability benefit.',
          ],
        ],
      ),
      q(
        'fs-s-4',
        'How should a system handle a payment that is pending confirmation?',
        [
          'Represent uncertainty explicitly and reconcile against the authoritative provider state',
          'A durable pending/uncertain state supports safe recovery without falsely declaring success or failure.',
        ],
        [
          [
            'Always mark it paid immediately',
            'That can misrepresent an operation that never succeeded.',
          ],
          [
            'Always charge again after a timeout',
            'The original payment may have succeeded, causing a duplicate.',
          ],
          [
            'Delete the order so no uncertainty is visible',
            'Deleting the record removes recovery context while the side effect may still exist.',
          ],
        ],
      ),
      q(
        'fs-s-5',
        'A cross-team journey fails between service boundaries. What ownership is needed?',
        [
          'Named ownership for diagnosing and reconciling the end-to-end failure',
          'Customers need recovery across boundaries rather than a gap between individually owned components.',
        ],
        [
          [
            'No owner because every component passed unit tests',
            'Local test success does not remove responsibility for the integrated failure.',
          ],
          [
            'Only the user should investigate',
            'Users cannot reliably diagnose internal boundaries or reconcile durable side effects.',
          ],
          [
            'Blame whichever team replied last',
            'Response order does not establish cause or operational responsibility.',
          ],
        ],
      ),
      q(
        'fs-s-6',
        'What should a staged contract migration verify?',
        [
          'Coexisting client/server versions and safe rollback as well as the new happy path',
          'Compatibility during transition and recovery are part of the actual deployment behavior.',
        ],
        [
          [
            'Only a screenshot of the new client',
            'A screenshot cannot establish API compatibility or data recovery.',
          ],
          [
            'Only that the newest server starts',
            'Startup does not prove old clients or partial deployments still work.',
          ],
          [
            'That every error message is hidden',
            'Suppressing evidence makes rollout failures harder to detect and recover from.',
          ],
        ],
      ),
      q(
        'fs-s-7',
        'How should architecture decisions account for sensitive cross-layer telemetry?',
        [
          'Minimize and redact private data while preserving useful operation identifiers',
          'Correlating events does not require storing raw secrets or private form contents.',
        ],
        [
          [
            'Copy complete payment details into every log',
            'Duplicating sensitive payloads increases exposure and is unnecessary for ordinary correlation.',
          ],
          [
            'Put authentication tokens in trace URLs',
            'URLs can propagate into logs and history, exposing the token.',
          ],
          [
            'Collect all data now and decide later',
            'Unbounded collection creates exposure before any justified diagnostic need is established.',
          ],
        ],
      ),
    ],
  },
};
