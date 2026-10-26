import { q, type TechnicalTrack, type Tier } from './types';

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
    questions: [
      q(
        'be-j-1',
        'Why validate request data on the server if the frontend already validates it?',
        [
          'Clients can bypass or change browser validation',
          'The server is the trust boundary and must enforce its own input contract.',
        ],
        [
          [
            'The browser never sends valid data',
            'Browsers can send valid data; the issue is that validation cannot be trusted as enforcement.',
          ],
          [
            'It replaces authorization checks',
            'Valid input can still request a record the caller is not allowed to access.',
          ],
          [
            'It guarantees all database operations succeed',
            'Constraints, connectivity and concurrency can still cause database failures.',
          ],
        ],
      ),
      q(
        'be-j-2',
        'Which approach prevents input from changing the structure of a SQL statement?',
        [
          'Use parameterized queries with bound values',
          'Bound parameters separate the SQL structure from untrusted values.',
        ],
        [
          [
            'Concatenate the input after removing spaces',
            'Removing spaces does not safely separate executable SQL from data.',
          ],
          [
            'Trust input from a logged-in user',
            'Authentication does not make every submitted value safe SQL syntax.',
          ],
          [
            'Hide the query in frontend code',
            'Exposing a query in the browser does not protect database execution.',
          ],
        ],
      ),
      q(
        'be-j-3',
        'A request is authenticated. Before returning an order, what else must be checked?',
        [
          'Whether that identity is authorized to access the order',
          'Identity and resource permission are separate checks.',
        ],
        [
          [
            'Only whether the order ID is an integer',
            'A valid identifier can belong to a different user.',
          ],
          [
            'Whether the browser button was visible',
            'UI visibility does not enforce server-side authorization.',
          ],
          [
            'Whether the user knows the URL',
            'Knowing a resource address is not proof of permission.',
          ],
        ],
      ),
      q(
        'be-j-4',
        'Which status best represents a successful resource creation under a conventional HTTP API contract?',
        [
          '201 Created',
          '201 indicates that the request resulted in one or more newly created resources.',
        ],
        [
          [
            '500 Internal Server Error',
            '500 communicates an unexpected server failure, not successful creation.',
          ],
          ['404 Not Found', '404 does not describe the successful creation of a resource.'],
          [
            '401 Unauthorized',
            '401 indicates missing or invalid authentication credentials for the target resource.',
          ],
        ],
      ),
      q(
        'be-j-5',
        'A database operation fails unexpectedly. What should a public API return?',
        [
          'A safe error shape and appropriate failure status',
          'Clients need useful failure information without implementation details or secrets.',
        ],
        [
          [
            'The full stack trace and database credentials',
            'Diagnostic secrets and stack traces can expose internals unnecessarily.',
          ],
          [
            'A success status with no record',
            'False success makes it difficult for clients to recover correctly.',
          ],
          [
            'Unrelated cached private data',
            'A failure does not justify returning another resource’s sensitive data.',
          ],
        ],
      ),
      q(
        'be-j-6',
        'Which test is essential for a private-task endpoint?',
        [
          'A different user cannot retrieve the task',
          'This directly checks resource-level authorization beyond the normal success path.',
        ],
        [
          [
            'Only that the route filename exists',
            'A route file can exist while its access checks are broken.',
          ],
          [
            'Only that the response is JSON',
            'A JSON response can still expose unauthorized records.',
          ],
          [
            'Only that the endpoint is fast',
            'Latency does not establish authorization or correctness.',
          ],
        ],
      ),
      q(
        'be-j-7',
        'What is a database unique constraint useful for?',
        [
          'Enforcing uniqueness even when concurrent requests race',
          'The database can enforce the invariant atomically instead of relying only on a prior application check.',
        ],
        [
          [
            'Encrypting every stored value',
            'Uniqueness and encryption serve different data guarantees.',
          ],
          [
            'Making authorization unnecessary',
            'A unique record may still be private to another identity.',
          ],
          [
            'Guaranteeing every query is fast',
            'Constraints do not ensure all access patterns have efficient plans.',
          ],
        ],
      ),
    ],
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
    questions: [
      q(
        'be-m-1',
        'What problem does an idempotency key address for a retried order submission?',
        [
          'A repeated logical request creating duplicate side effects',
          'The same scoped key and request can return a persisted result rather than execute the side effect again.',
        ],
        [
          [
            'All forms of unauthorized access',
            'Keys do not replace authentication and resource authorization.',
          ],
          [
            'Every slow database query',
            'Duplicate suppression does not guarantee efficient query execution.',
          ],
          [
            'Every network outage',
            'Idempotency makes retries safer but cannot make the network always available.',
          ],
        ],
      ),
      q(
        'be-m-2',
        'An order and its stock reservation must succeed or fail together in one database. What is the appropriate boundary?',
        [
          'A database transaction covering both changes',
          'A transaction can commit the related changes together or roll them back together.',
        ],
        [
          [
            'Two unrelated writes without recovery',
            'One write can succeed while the other fails, violating the invariant.',
          ],
          [
            'Only a frontend loading indicator',
            'A browser state does not establish atomicity in persistence.',
          ],
          [
            'A log line after the first write',
            'A diagnostic message does not make the second write atomic.',
          ],
        ],
      ),
      q(
        'be-m-3',
        'An endpoint performs one query for a list and then one query for each item. What should you investigate?',
        [
          'An N+1 access pattern and a suitable batch or join',
          'Repeated per-item round trips can dominate latency; inspect plans and batch appropriately for the access pattern.',
        ],
        [
          [
            'Whether a new logo would help',
            'Brand presentation does not address query round trips.',
          ],
          [
            'Whether errors can be hidden',
            'Suppressing errors neither diagnoses nor fixes the access pattern.',
          ],
          [
            'Whether all indexes should be deleted',
            'Removing indexes without evidence can make query execution worse.',
          ],
        ],
      ),
      q(
        'be-m-4',
        'A client times out after sending an order. What does that timeout prove?',
        [
          'Only that the client did not receive a timely result',
          'The server may have committed the order before the response was lost or delayed.',
        ],
        [
          ['That no order was created', 'A response can be lost after a successful commit.'],
          [
            'That the order definitely committed',
            'A timeout alone does not establish the server’s final outcome.',
          ],
          [
            'That retrying without a key is always safe',
            'An unprotected retry can duplicate a committed side effect.',
          ],
        ],
      ),
      q(
        'be-m-5',
        'Two requests each see one item in stock and both decrement it. What protects against overselling?',
        [
          'An atomic conditional update or suitable transaction locking',
          'The check and decrement must be coordinated at the shared data boundary.',
        ],
        [
          [
            'A separate preflight read only',
            'Both requests can pass the same read before either writes.',
          ],
          [
            'A browser-side stock check',
            'Other clients and server instances do not share that browser state.',
          ],
          [
            'Retry all failed writes indefinitely',
            'Unbounded retries do not establish the inventory invariant.',
          ],
        ],
      ),
      q(
        'be-m-6',
        'Which evidence most directly checks a query optimization?',
        [
          'Representative query plans and latency before/after on comparable data',
          'A comparable workload and execution evidence reveal whether the change addresses the actual bottleneck.',
        ],
        [
          ['A shorter SQL string', 'Text length does not determine the query plan or runtime.'],
          [
            'A single empty-table query',
            'An empty dataset does not represent real cardinality or access costs.',
          ],
          [
            'The database product’s popularity',
            'Popularity does not establish this query’s performance.',
          ],
        ],
      ),
      q(
        'be-m-7',
        'A transient downstream error is retriable. What retry policy is most appropriate?',
        [
          'Bounded retries with backoff, deadlines, and duplicate-safe semantics',
          'This limits load amplification and makes repeated work controlled and safe.',
        ],
        [
          [
            'Retry forever with no delay',
            'An unbounded tight loop can overload a struggling dependency.',
          ],
          [
            'Retry every validation error',
            'Invalid input is not made valid by repeating the same request.',
          ],
          [
            'Remove all request timeouts',
            'Unbounded waits consume resources and obscure failure recovery.',
          ],
        ],
      ),
    ],
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
    questions: [
      q(
        'be-s-1',
        'A service must persist an order and eventually publish its event without losing committed orders. Which pattern directly addresses the dual write?',
        [
          'A transactional outbox with a retrying relay and duplicate-safe consumers',
          'The local transaction ties order and publication intent together; retries and consumer deduplication address delivery uncertainty.',
        ],
        [
          [
            'Publish then write, with no recovery',
            'A failure between the two operations can publish an event for an order that was never committed.',
          ],
          [
            'Write then publish, with no persisted retry intent',
            'A crash after commit and before publish can permanently lose the event.',
          ],
          [
            'Assume the network delivers exactly once',
            'That assumption does not establish an end-to-end durability or deduplication mechanism.',
          ],
        ],
      ),
      q(
        'be-s-2',
        'Old and new service versions run during a column rename. What is a safer migration?',
        [
          'Expand compatibly, backfill and migrate consumers, then contract',
          'Coexisting versions need compatible data access until every consumer has moved.',
        ],
        [
          [
            'Drop the old column before deploying new readers',
            'Old readers can fail immediately while still running.',
          ],
          [
            'Change only the application type name',
            'A type rename does not migrate stored data or database consumers.',
          ],
          [
            'Assume no deployments overlap',
            'The stated rollout explicitly includes overlapping versions.',
          ],
        ],
      ),
      q(
        'be-s-3',
        'What does a useful service-level indicator measure?',
        [
          'A customer-relevant aspect of service behavior, such as successful request latency',
          'An SLI should connect observable service behavior to the experience the objective is intended to protect.',
        ],
        [
          [
            'Only developer hours worked',
            'Work hours do not measure whether customers receive successful service.',
          ],
          [
            'The number of microservices',
            'Component count is topology, not a customer-relevant reliability outcome.',
          ],
          [
            'A target without an observable metric',
            'An unmeasurable target cannot be evaluated as an indicator.',
          ],
        ],
      ),
      q(
        'be-s-4',
        'A queue delivers a message twice. What should a payment consumer do?',
        [
          'Recognize the repeated operation and avoid charging again',
          'At-least-once delivery makes duplicate handling part of the consumer’s side-effect contract.',
        ],
        [
          [
            'Charge on every delivery',
            'Delivery count should not determine how often a logical payment is executed.',
          ],
          [
            'Assume duplicates mean data corruption',
            'Redelivery can be normal under retry and acknowledgement failures.',
          ],
          [
            'Delete all future messages',
            'One duplicate does not justify destroying unrelated work.',
          ],
        ],
      ),
      q(
        'be-s-5',
        'Which rollback plan is unsafe during a data migration?',
        [
          'Restore an old reader after deleting the data it requires',
          'Rolling code back cannot recover required data that was destructively removed.',
        ],
        [
          [
            'Retain compatible data until readers migrate',
            'Keeping compatible data preserves options during the rollout.',
          ],
          [
            'Verify a restore procedure before starting',
            'Rehearsing restoration provides evidence that recovery is possible.',
          ],
          [
            'Use explicit stop criteria during backfill',
            'Stop criteria help contain migration failures.',
          ],
        ],
      ),
      q(
        'be-s-6',
        'Why can aggressive retries worsen a dependency incident?',
        [
          'They amplify traffic precisely when capacity is impaired',
          'Repeated attempts add load and can prevent recovery without backoff, limits and admission control.',
        ],
        [
          [
            'Retries always reduce traffic',
            'Additional attempts increase request volume unless other work is suppressed.',
          ],
          ['Retries remove the need for timeouts', 'Each attempt still needs a bounded deadline.'],
          [
            'They automatically create extra database capacity',
            'A retry policy cannot create processing resources.',
          ],
        ],
      ),
      q(
        'be-s-7',
        'What is the right way to evaluate a proposed consistency model?',
        [
          'Tie it to required invariants, acceptable staleness and failure behavior',
          'The model must satisfy the business operations and recovery guarantees under stated failures.',
        ],
        [
          [
            'Choose eventual consistency for every field',
            'Some invariants cannot tolerate stale independent updates without additional coordination.',
          ],
          [
            'Choose a database by its logo',
            'Brand identity does not establish the required semantics.',
          ],
          [
            'Ignore partition and recovery cases',
            'Failures are precisely where consistency tradeoffs become important.',
          ],
        ],
      ),
    ],
  },
};
