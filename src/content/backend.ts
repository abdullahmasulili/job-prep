import { type TechnicalTrack, type Tier } from './types';

export const backendTracks: Record<Tier, TechnicalTrack> = {
  junior: {
    learn: [
      {
        title: 'Define the request contract',
        body: 'For each API operation, specify method, path, valid input, output, and failure responses. Validate data at the server boundary even if the browser already validated it. Return a stable error shape that clients can handle.',
      },
      {
        title: 'Separate identity from permission',
        body: 'Authentication establishes who is making a request. Authorization decides which records and actions that identity can access. Never trust a userId in a request as proof that the caller owns the resource.',
      },
      {
        title: 'Use parameterized data access',
        body: 'Treat user input as data, not part of a SQL command. Use placeholders with bound parameters. Know how null values, unique constraints, and primary keys affect a query and its failure behavior.',
      },
    ],
    build: [
      {
        title: 'Implement a bounded CRUD operation',
        body: 'Design creation and retrieval of a personal task. Validate title length, derive ownership from the authenticated identity, and return only the fields in the contract. Decide what missing and forbidden records should return consistently.',
      },
      {
        title: 'Test the boundaries',
        body: 'Cover valid input, missing input, malformed input, a missing record, and access to another user’s record. Assert both response behavior and stored effects. An error response must not leave a half-created object.',
      },
      {
        title: 'Handle failure without leaking internals',
        body: 'Log useful diagnostic context without secrets, return a safe error, and keep the original cause available to operators. Avoid exposing SQL text or stack traces to clients.',
      },
    ],
    task: 'Design a personal-task API in your selected language. Describe validation, ownership checks, parameterized persistence, success/error responses, and boundary tests.',
    reference:
      'Use a server-side schema or explicit checks for the title, derive the owner from the authenticated session, and bind input values in the database query. Verify ownership on retrieval and modification. Test invalid input and another user’s identifier as well as the happy path. Return safe structured errors without stack traces.',
  },
  mid: {
    learn: [
      {
        title: 'Protect transactional invariants',
        body: 'Identify values that must change together, such as an order and its inventory reservation. Choose a transaction and appropriate isolation or locking. A check followed by a write can race even when both statements look correct individually.',
      },
      {
        title: 'Design retries and idempotency',
        body: 'A timeout does not prove an operation failed. Bind an idempotency key to the caller and request payload, persist the outcome consistently, and return the prior result on a valid retry. Set bounded retries and backoff for transient failures.',
      },
      {
        title: 'Diagnose queries and services with evidence',
        body: 'Use query plans, timing, and representative data to locate bottlenecks. Watch for repeated per-item queries. Correlate sanitized logs with request identifiers and metrics rather than collecting private payloads.',
      },
    ],
    build: [
      {
        title: 'Specify an order-creation invariant',
        body: 'Define how duplicate submissions behave, when inventory is reserved, and which state is durable. Treat concurrent attempts using the same idempotency key and different payloads as a conflict rather than silently reusing a result.',
      },
      {
        title: 'Test concurrency and partial failures',
        body: 'Run competing reservations for the last stock item. Simulate a timeout after commit and retry the same request. Verify one durable order and no negative stock, rather than asserting only the returned status.',
      },
      {
        title: 'Review operational failure paths',
        body: 'Bound external calls with deadlines, classify retriable failures, and make queue processing duplicate-safe. Establish useful latency/error metrics and redacted diagnostic context for failed requests.',
      },
    ],
    task: 'Design an order-creation API with inventory reservation and idempotent retries. State the transaction boundary, duplicate-key behavior, failure handling, and concurrency tests.',
    reference:
      'Bind an idempotency key to an authenticated caller and a request fingerprint. Persist the order and stock reservation atomically, using a conditional update or suitable locking. After a timeout, the same key returns the recorded result. Test simultaneous requests, conflicting payload reuse, out-of-stock cases, and a response lost after commit.',
  },
  senior: {
    learn: [
      {
        title: 'Make guarantees precise',
        body: 'Define invariants, consistency boundaries, failure assumptions, and recovery goals before choosing a topology. A queue is not an end-to-end exactly-once guarantee. Discuss duplicates, ordering, and replay explicitly.',
      },
      {
        title: 'Plan compatible data evolution',
        body: 'Use expand-and-contract migrations when old and new application versions coexist. Add compatible structures, backfill with monitoring, switch reads/writes safely, then remove old structures after all consumers migrate.',
      },
      {
        title: 'Manage reliability as a product constraint',
        body: 'Choose service indicators that reflect user outcomes and set objectives with stakeholders. Use error budgets to discuss risk. Identify blast radius, capacity headroom, dependency failure modes, and ownership of recovery.',
      },
    ],
    build: [
      {
        title: 'Design durable event publication',
        body: 'When a database update and event publication must correspond, evaluate a transactional outbox and duplicate-safe consumers. Explain the relay’s retries and how consumers detect repeats, rather than assuming a distributed transaction exists.',
      },
      {
        title: 'Practice a staged migration',
        body: 'Document coexisting versions, backfill progress, verification queries, and stop conditions. Rehearse restore or compensation. Verify that the rollback does not depend on data already destroyed by a later step.',
      },
      {
        title: 'Review the operational contract',
        body: 'Set alerts on symptoms, not every isolated log. Define runbooks, recovery ownership, and load-shedding or degraded behavior. Test delayed messages, redelivery, and unavailable dependencies against the invariant.',
      },
    ],
    task: 'Design an order service that updates its database and publishes an event reliably. Include consistency boundaries, duplicate delivery, schema evolution, observability, and a staged rollout.',
    reference:
      'Write the order and an outbox record in one local database transaction. A relay publishes committed records and retries safely; consumers deduplicate or make side effects idempotent. State ordering requirements rather than assuming global order. Evolve schemas compatibly, monitor publication lag and customer-facing errors, and retain a tested rollback or compensation path.',
  },
};
