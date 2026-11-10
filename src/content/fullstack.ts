import { type TechnicalTrack, type Tier } from './types';

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
  },
};
