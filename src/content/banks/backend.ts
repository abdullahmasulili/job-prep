import { bank, type Item, type RoleBank } from '../bank';
import type { Exercise, Tier } from '../types';

type Answer = [text: string, explanation: string];
function item(
  id: string,
  topic: string,
  prompt: string,
  code: string,
  ...choices: [Answer, Answer, Answer, Answer]
): Item {
  return {
    id: `be-${id}`,
    topic,
    prompt,
    ...(code ? { code } : {}),
    options: choices.map((c) => c[0]) as Item['options'],
    reasons: choices.map((c) => c[1]) as Item['reasons'],
    answer: 0,
  };
}

const sharedFundamentals: Item[] = [
  item(
    'f-null',
    'SQL and data modeling',
    'Which predicate returns accounts with no recorded deletion time?',
    'accounts(id, deleted_at)\n(1, NULL), (2, 2026-01-02)',
    ['deleted_at IS NULL', 'IS NULL tests the absence of a value and selects account 1.'],
    ['deleted_at = NULL', 'Equality with NULL evaluates to unknown, not true.'],
    ['deleted_at <> NULL', 'Inequality with NULL also evaluates to unknown.'],
    ['deleted_at IS NOT NULL', 'This selects the deleted account, which has a timestamp.'],
  ),
  item(
    'f-foreign',
    'SQL and data modeling',
    'Orders must refer to an existing customer even when writes come from several services. Which database rule enforces this?',
    'orders(id, customer_id)\ncustomers(id PRIMARY KEY)',
    [
      'A foreign key from orders.customer_id to customers.id',
      'A foreign key checks the referenced customer at the database boundary.',
    ],
    [
      'Unique index on customer_id',
      'Uniqueness limits orders per customer but does not prove the customer exists.',
    ],
    ['Non-null constraint on customer_id', 'A non-null value can still name a missing customer.'],
    [
      'Application lookup before each order insert',
      'A separate check can race with deletion and other writers can omit it.',
    ],
  ),
  item(
    'f-money',
    'SQL and data modeling',
    'An invoice stores amounts in one currency with exactly two fractional digits. Which representation makes cent-level equality straightforward?',
    '',
    [
      'Store exact cents as integers with an explicit rounding rule',
      'Store 1250 for 12.50 and apply explicit rounding at the input boundary.',
    ],
    [
      'Binary floating point',
      'Many decimal fractions have no exact binary floating representation.',
    ],
    [
      'Formatted currency strings including symbols',
      'Presentation strings complicate arithmetic, sorting, and validation.',
    ],
    [
      'Rounded whole currency units',
      'Whole units discard the cents that the invoice must preserve.',
    ],
  ),
  item(
    'f-index-cost',
    'SQL and data modeling',
    'A table receives frequent inserts. A proposed secondary index is unused by its read workload. What is the principal tradeoff?',
    '',
    [
      'Extra write and storage cost',
      'Every insert must maintain another index even if reads do not use it.',
    ],
    [
      'Less transaction isolation',
      'An additional index does not change the configured isolation level.',
    ],
    [
      'Automatic query result caching',
      'An index stores access paths rather than complete cached query responses.',
    ],
    [
      'Reduced size of the underlying rows',
      'An index adds a structure rather than shrinking stored table rows.',
    ],
  ),
  item(
    'f-authz',
    'HTTP and security',
    'A signed-in caller requests the record below. Which condition must the API enforce before returning its private contents?',
    'session.userId = 18\nGET /notes/75\nnote = { id: 75, ownerId: 21, body: "private" }',
    [
      'The caller’s permission to access note 75',
      'Authentication identifies the caller; object authorization protects this specific note.',
    ],
    [
      'The session signature is valid',
      'A valid signature alone does not grant access to another owner’s object.',
    ],
    [
      'The note identifier is a positive integer',
      'Shape validation does not establish ownership or shared access.',
    ],
    [
      'The request includes an accepted media type',
      'Response format negotiation does not decide resource permission.',
    ],
  ),
  item(
    'f-bind',
    'HTTP and security',
    'Which change safely treats the supplied email as a SQL value?',
    'sql = "SELECT id FROM users WHERE email = \u0027" + email + "\u0027"',
    [
      'Use a placeholder and bind email through the database driver',
      'A bound value remains data instead of becoming part of the SQL grammar.',
    ],
    [
      'Remove spaces from the email string',
      'SQL injection does not require spaces, and valid data may be changed.',
    ],
    [
      'Escape quotes with a custom replacement',
      'Ad hoc escaping is sensitive to encoding and database parsing rules.',
    ],
    [
      'Run this query using a read-only account',
      'Read-only privileges reduce impact but still allow unintended reads.',
    ],
  ),
  item(
    'f-secret',
    'HTTP and security',
    'An incident needs request correlation, but the request contains a bearer token. Which log entry is appropriate?',
    '',
    [
      'Request ID and sanitized route, status, and elapsed time',
      'These fields support correlation without retaining a reusable credential.',
    ],
    ['Request ID with the bearer token', 'The token can authorize actions if copied from logs.'],
    [
      'Full headers with shortened retention',
      'Short retention still exposes credentials during the retention window.',
    ],
    [
      'Request body and session cookie hash map',
      'Broad payload logging adds private data and unnecessary correlation material.',
    ],
  ),
  item(
    'f-create',
    'HTTP and security',
    'The contract creates a resource synchronously and returns its representation and location. Which status best fits?',
    'POST /projects → persisted project 42',
    [
      '201 Created',
      'The request completed and created a resource that can be identified by Location.',
    ],
    [
      '202 Accepted',
      'Accepted describes work accepted for processing whose completion is not established.',
    ],
    [
      '204 No Content',
      'A 204 response cannot carry the representation described by this contract.',
    ],
    [
      '200 OK',
      'Generic success does not specifically communicate creation; 201 best matches the stated contract.',
    ],
  ),
  item(
    'f-atomic',
    'Transactions and concurrency',
    'A transfer writes two balances in one database. What must the transaction guarantee if the second write fails?',
    'debit(A, 50)\ncredit(B, 50) // constraint failure',
    [
      'Roll back the debit and the failed credit together',
      'Atomicity prevents a transfer from leaving only its debit committed.',
    ],
    ['The first write stays committed', 'Keeping the debit loses money from the combined balance.'],
    [
      'The second write retries after the first commits',
      'A separate retry leaves an intermediate state requiring a different recovery design.',
    ],
    [
      'Commit debit; queue credit',
      'A queued credit is a separate recovery design and does not roll back the failed atomic transfer.',
    ],
  ),
  item(
    'f-timeout',
    'Transactions and concurrency',
    'A client loses the connection after submitting a payment. Which conclusion is supported by that observation alone?',
    '',
    [
      'The payment outcome remains unknown',
      'The server may have committed before the response was lost.',
    ],
    ['The payment was rolled back', 'A lost response does not establish a database rollback.'],
    [
      'The payment completed successfully',
      'The request might also have failed before it committed.',
    ],
    [
      'A new payment identifier is safe for the retry',
      'A new identity can create a second charge if the first succeeded.',
    ],
  ),
  item(
    'f-boundary',
    'Testing and operations',
    'A field accepts integer quantities from 1 through 20. Which cases target its boundary behavior most directly?',
    '',
    ['0, 1, 20, 21', 'The values bracket both inclusive boundaries.'],
    ['2, 5, 9', 'These cover ordinary valid values but miss both edges and rejections.'],
    [
      '1, 5, 10, 15 with repeated requests',
      'Only the lower edge is covered and there is no out-of-range case.',
    ],
    [
      '-20, -10, 30, 40',
      'All inputs are invalid and none checks the inclusive accepted endpoints.',
    ],
  ),
  item(
    'f-health',
    'Testing and operations',
    'A service process is alive but cannot connect to the database required to serve requests. Which signal should remove it from request routing?',
    '',
    [
      'Readiness failure reported to the router',
      'Readiness describes whether the instance can currently serve its workload.',
    ],
    [
      'A passing process liveness check',
      'A live process may still be unable to serve dependent operations.',
    ],
    [
      'A higher memory allocation limit',
      'Memory changes do not communicate the dependency outage to the router.',
    ],
    [
      'A successful application build from the deploy',
      'Build success does not establish runtime dependency availability.',
    ],
  ),
];

const sharedPractical: Item[] = [
  item(
    'p-left-join',
    'SQL and data modeling',
    'What rows does this query return for the fixture?',
    'customers: (id=1), (id=2)\norders: (id=9, customer_id=1)\nSELECT c.id, COUNT(o.id) AS n\nFROM customers c LEFT JOIN orders o ON o.customer_id=c.id\nGROUP BY c.id ORDER BY c.id;',
    [
      '(1, 1), (2, 0)',
      'The left join retains customer 2 and COUNT(o.id) ignores its null joined value.',
    ],
    ['(1, 1)', 'That would omit the unmatched customer, unlike this left join.'],
    ['(1, 1), (2, 1)', 'COUNT(*) would count the null-extended row; COUNT(o.id) does not.'],
    ['(1, 2), (2, 0)', 'Customer 1 has just one matching order in the fixture.'],
  ),
  item(
    'p-where-join',
    'SQL and data modeling',
    'The report must retain customers with no paid orders. Which edit fixes the query?',
    "SELECT c.id, o.id FROM customers c\nLEFT JOIN orders o ON o.customer_id=c.id\nWHERE o.status='paid';",
    [
      "Put the status='paid' predicate in ON",
      'Filtering in ON preserves unmatched customers with null order columns.',
    ],
    ['Change LEFT JOIN to INNER JOIN', 'An inner join removes customers without matching orders.'],
    [
      'Add DISTINCT to the projection',
      'Deduplication cannot restore rows already removed by WHERE.',
    ],
    [
      "Use WHERE o.status <> 'unpaid'",
      'The comparison still rejects null-extended rows and changes the status contract.',
    ],
  ),
  item(
    'p-unique',
    'Transactions and concurrency',
    'Both requests pass the availability check. What closes this race while preserving a friendly conflict response?',
    'A: SELECT username → absent\nB: SELECT username → absent\nA: INSERT username\nB: INSERT username',
    [
      'Unique constraint; translate its violation',
      'The database arbitrates concurrent inserts, and the API can map the losing insert to conflict.',
    ],
    [
      'Repeat the SELECT just before INSERT',
      'Both requests can still complete the second check before either insert.',
    ],
    [
      'Cache the first availability response briefly',
      'A cached absence extends the time during which competing requests see stale state.',
    ],
    [
      'Put both statements in default isolation transactions',
      'Read committed transactions alone do not prevent this check-then-insert race.',
    ],
  ),
  item(
    'p-auth-update',
    'HTTP and security',
    'The route receives an authenticated session. Which SQL change prevents another user from renaming this task?',
    'UPDATE tasks SET title=$1 WHERE id=$2;\n-- $2 comes from the URL',
    [
      'Add owner_id=$3 from the session',
      'The write itself is scoped to the trusted identity and cannot update another owner’s row.',
    ],
    [
      'Add owner_id=$3 from the JSON body',
      'The caller can supply the victim owner ID in that body.',
    ],
    [
      'Validate that $2 is a UUID',
      'A well-formed identifier can still refer to a different owner.',
    ],
    [
      'Check that the new title is unique',
      'Title uniqueness does not grant permission to mutate the task.',
    ],
  ),
  item(
    'p-n-plus-one',
    'Testing and operations',
    'Which change most directly addresses the measured database round trips?',
    'GET /teams\n1 query: fetch 40 teams\n40 queries: fetch members for each team\nDB round trip: 8 ms; execution: <1 ms/query',
    [
      'Batch the member reads for the selected teams',
      'Batching removes the per-team network round trips while retaining the required data.',
    ],
    [
      'Cache each member lookup',
      'A cache can help repeat traffic but cold requests still issue the per-team round trips.',
    ],
    [
      'Index the team name display column',
      'That column is not the repeated member lookup responsible for the measured delay.',
    ],
    [
      'Run the same 40 queries on a larger pool',
      'Parallelism may hide some latency but retains the expensive fan-out and extra connections.',
    ],
  ),
  item(
    'p-rollback-test',
    'Testing and operations',
    'Which assertion reveals a partial-write bug in this failure case?',
    'createOrder() inserts order, then inserts order_lines\nInject a constraint failure into order_lines insertion.',
    [
      'The inserted order is absent after failure',
      'Checking persisted effects proves the earlier write was rolled back.',
    ],
    [
      'The endpoint responds with JSON',
      'A structured response can accompany an incorrectly persisted order.',
    ],
    [
      'The endpoint logs the constraint name',
      'A useful log does not establish rollback of the first write.',
    ],
    [
      'The first INSERT statement was called once',
      'Invocation count does not prove the write was undone.',
    ],
  ),
  item(
    'p-redaction',
    'HTTP and security',
    'A password reset request fails. Which diagnostic field can remain in the structured error log?',
    'body={email:"a@example.com", resetToken:"secret", password:"new-secret"}\nrequestId="req-73"',
    [
      'requestId: req-73',
      'An opaque request identifier supports tracing without storing the reset secret or password.',
    ],
    ['resetToken', 'A reset token can authorize takeover while valid.'],
    ['password: new-secret', 'Password material should not be retained in diagnostics.'],
    [
      'The complete body with a restricted log role',
      'Access control does not justify unnecessary storage of reusable secrets.',
    ],
  ),
  item(
    'p-lost-update',
    'Transactions and concurrency',
    'What is the final count under this interleaving, and which change preserves both increments?',
    'Initial count=10\nA reads 10; B reads 10\nA writes 11; B writes 11',
    [
      '11; use an atomic SQL increment',
      'Both clients overwrite with 11; SET count=count+1 lets the database serialize increments.',
    ],
    [
      '12; keep the existing read/write sequence',
      'Both computed values are 11, so neither write produces 12.',
    ],
    [
      '11; cache the read',
      'Caching the old value makes stale read-modify-write behavior more likely.',
    ],
    [
      '10; commit both writes in separate transactions',
      'The given writes already change the value, and separate transactions do not combine them.',
    ],
  ),
  item(
    'p-rate-limit',
    'HTTP and security',
    'A public endpoint exhausts its per-client request quota. Which response best lets cooperative clients slow down?',
    '',
    [
      '429 Too Many Requests with retry guidance',
      '429 signals rate limiting, and appropriate retry guidance helps clients pace later requests.',
    ],
    [
      '401 with a new login challenge',
      'Authentication is not the reason this valid client was limited.',
    ],
    [
      '404 with a generic missing-resource body',
      'A missing-resource response hides the actionable quota condition.',
    ],
    [
      '200 with an empty collection and normal cache headers',
      'That misrepresents the operation as a successful empty result.',
    ],
  ),
  item(
    'p-pagination',
    'SQL and data modeling',
    'Rows can have the same created_at. Which ORDER BY gives deterministic pagination for a fixed dataset?',
    'events(id PRIMARY KEY, created_at NOT NULL)',
    [
      'created_at DESC, id DESC',
      'The unique ID breaks timestamp ties and establishes a total order.',
    ],
    ['created_at DESC', 'Equal timestamps leave the relative order unspecified.'],
    ['date(created_at) DESC', 'Truncating timestamps creates even more ties.'],
    [
      'created_at DESC, date(created_at) DESC',
      'The second expression cannot distinguish rows sharing the same timestamp.',
    ],
  ),
  item(
    'p-pool',
    'Testing and operations',
    'Database query execution is fast but requests wait. What should be investigated first?',
    'p95 query execution=4 ms\np95 pool acquisition=950 ms\nactive connections=20/20\nseveral transactions idle for 30 s',
    [
      'Why idle transactions retain pool connections',
      'Long-held connections explain queueing even when individual queries are fast.',
    ],
    [
      'Whether each SELECT needs another index',
      'Indexes target execution time, which the evidence already shows is small.',
    ],
    [
      'The query execution plan',
      'The measured queueing dominates execution; inspect long-held connections before optimizing the query itself.',
    ],
    [
      'Whether the load balancer uses HTTP compression',
      'Transport compression does not release the idle database transactions.',
    ],
  ),
  item(
    'p-retry-safe',
    'Transactions and concurrency',
    'A worker may receive the same event twice. Where should it record completion to protect a database counter?',
    'event id=e17: increase account points by 10\nBoth writes use the same database.',
    [
      'In the transaction that applies the increment',
      'A unique event record and the increment must commit atomically to prevent duplication or loss.',
    ],
    [
      'In memory before incrementing the counter',
      'A restart loses memory and concurrent workers do not share it.',
    ],
    [
      'In a separate transaction before the increment',
      'A crash between commits records completion without awarding the points.',
    ],
    [
      'In a separate transaction after acknowledging the event',
      'A crash after acknowledgement can lose the event before durable completion is recorded.',
    ],
  ),
];

const juniorFundamentals: Item[] = [
  item(
    'j-f-count',
    'SQL and data modeling',
    'What value does the aggregate return?',
    'scores(value): 7, NULL, 9\nSELECT COUNT(value) FROM scores;',
    ['2', 'COUNT(expression) counts only rows where that expression is non-null.'],
    ['3', 'COUNT(*) would count all three rows, including the null-valued one.'],
    ['16', 'Sixteen is the sum of the non-null values, not their count.'],
    ['NULL', 'COUNT returns a numeric count even when some values are null.'],
  ),
  item(
    'j-f-key',
    'SQL and data modeling',
    'A membership table links users to groups. A user may join many groups but only once per group. Which key matches this rule?',
    '',
    [
      'UNIQUE(user_id, group_id)',
      'The pair must be unique while either component may repeat independently.',
    ],
    ['UNIQUE(user_id)', 'This incorrectly restricts each user to one group.'],
    ['UNIQUE(group_id)', 'This incorrectly restricts each group to one user.'],
    [
      'Two separate unique constraints on both columns',
      'Separate uniqueness constraints enforce both incorrect one-to-one restrictions.',
    ],
  ),
  item(
    'j-f-order',
    'SQL and data modeling',
    'A SELECT has no ORDER BY. What row order can an API promise from that statement?',
    'SELECT id FROM tickets WHERE status=$1;',
    [
      'No particular row order',
      'A query without ordering does not promise insertion order or key order.',
    ],
    [
      'Ascending primary-key order',
      'The optimizer may choose an access path that produces another order.',
    ],
    ['Most recently inserted row first', 'Insertion recency is not part of the query contract.'],
    [
      'The same order as the previous execution',
      'Plan and storage changes can alter the result sequence.',
    ],
  ),
  item(
    'j-f-delete',
    'SQL and data modeling',
    'Deleting an account is rejected by a foreign key from invoices. What does this establish?',
    '',
    [
      'An invoice still references the account',
      'The constraint preserves the relationship until an explicit permitted deletion policy is applied.',
    ],
    [
      'The account primary key has changed',
      'A foreign-key deletion failure does not imply the primary key was modified.',
    ],
    [
      'An index on invoice totals is missing',
      'Query performance indexes do not explain this referential-integrity error.',
    ],
    [
      'Another account has the same email address',
      'Email uniqueness is a different constraint from the reported foreign key.',
    ],
  ),
  item(
    'j-f-parse',
    'HTTP and security',
    'The API accepts a JSON integer age from 0 to 120. Which input must fail this contract before persistence?',
    'A: {"age": 0}\nB: {"age": 120}\nC: {"age": "18"}\nD: {"age": 42}',
    ['C', 'The string is not a JSON number under the stated strict integer contract.'],
    ['A', 'Zero is explicitly included in the permitted range.'],
    ['B', 'The upper bound is inclusive, so 120 is valid.'],
    ['D', 'Forty-two is a valid integer inside the permitted range.'],
  ),
  item(
    'j-f-hash',
    'HTTP and security',
    'A login system needs to verify passwords without retaining recoverable plaintext. Which storage approach fits?',
    '',
    [
      'A salted adaptive password hash',
      'A password-specific hashing function supports verification while making guessing expensive.',
    ],
    [
      'Encryption with a key stored beside the rows',
      'Anyone who obtains both the database and key can recover the passwords.',
    ],
    [
      'A plain unsalted fast digest',
      'Fast unsalted hashes allow cheap guessing and reuse of precomputed guesses.',
    ],
    [
      'Base64 encoding with a separate username column',
      'Base64 is reversible encoding and offers no password protection.',
    ],
  ),
  item(
    'j-f-cookie',
    'HTTP and security',
    'Which cookie attribute prevents page JavaScript from reading a session cookie directly?',
    '',
    [
      'HttpOnly',
      'HttpOnly removes access through document.cookie while the browser can still send the cookie.',
    ],
    ['Secure', 'Secure restricts transport to secure connections rather than JavaScript access.'],
    ['SameSite=Lax', 'SameSite influences cross-site sending, not direct JavaScript readability.'],
    [
      'Path=/account',
      'Path scopes sending by URL and is not a confidentiality boundary against page scripts.',
    ],
  ),
  item(
    'j-f-json',
    'HTTP and security',
    'A parser rejects malformed JSON before route validation. Which failure category fits the request?',
    'POST /notes\nContent-Type: application/json\n{"title":',
    ['400 Bad Request', 'The request representation is malformed and cannot be parsed.'],
    ['409 Conflict', 'No conflict with stored resource state has been established.'],
    ['503 Service Unavailable', 'A bad request body is not evidence of service unavailability.'],
    ['201 Created', 'Parsing failed, so resource creation did not succeed.'],
  ),
  item(
    'j-f-commit',
    'Transactions and concurrency',
    'Which step makes the successful transaction changes durable under the database durability configuration?',
    'BEGIN;\nUPDATE wallets SET balance=balance-5 WHERE id=1;\nUPDATE wallets SET balance=balance+5 WHERE id=2;\n-- next step?',
    [
      'COMMIT;',
      'Commit completes the transaction; durability then follows the database configuration.',
    ],
    ['ROLLBACK;', 'Rollback discards the transaction’s changes.'],
    [
      'SAVEPOINT done;',
      'A savepoint marks an internal rollback position without committing the transaction.',
    ],
    [
      'SELECT balance FROM wallets;',
      'Reading the changes in the transaction does not finalize them.',
    ],
  ),
  item(
    'j-f-local-lock',
    'Transactions and concurrency',
    'Two application processes update the same row. Why does a mutex held in one process not coordinate both?',
    '',
    [
      'The mutex state is process-local',
      'Each process owns a separate in-memory lock and may enter simultaneously.',
    ],
    [
      'The database cannot support concurrent connections',
      'Databases normally support multiple connections; shared coordination is the issue.',
    ],
    [
      'The row identifier changes between processes',
      'The identifier can be identical while the locks remain separate.',
    ],
    [
      'Mutex acquisition automatically commits pending SQL',
      'A process mutex has no inherent transaction-commit behavior.',
    ],
  ),
  item(
    'j-f-unit',
    'Testing and operations',
    'Which test isolates a pure shipping-fee rule from network and database behavior?',
    'fee(subtotal) = subtotal >= 50 ? 0 : 5',
    ['Call fee with 49 and 50', 'The pure function can be checked directly at the threshold.'],
    [
      'Deploy and send a live payment request',
      'That exercises external systems unrelated to this deterministic fee rule.',
    ],
    [
      'Seed production customer records first',
      'Customer persistence is unnecessary for a function receiving just a subtotal.',
    ],
    [
      'Assert that the application port is open',
      'An open port does not establish the fee calculation.',
    ],
  ),
  item(
    'j-f-config',
    'Testing and operations',
    'An application requires a database URL. What startup behavior makes missing configuration easiest to diagnose?',
    '',
    [
      'Fail with a clear redacted error',
      'Failing at startup makes the missing dependency explicit without exposing credentials.',
    ],
    [
      'Continue until the first request needs SQL',
      'This delays detection and allows a broken instance to appear healthy.',
    ],
    [
      'Use a developer database URL embedded in code',
      'A fallback can send production traffic to an unintended database.',
    ],
    [
      'Retry startup with an empty connection string',
      'Repeating an invalid configuration cannot repair the missing value.',
    ],
  ),
];

const juniorPractical: Item[] = [
  item(
    'j-p-sum',
    'SQL and data modeling',
    'What does this query return?',
    "orders(user_id,total,status): (1,10,'paid'), (1,7,'pending'), (2,4,'paid')\nSELECT user_id,SUM(total) FROM orders\nWHERE status='paid' GROUP BY user_id ORDER BY user_id;",
    ['(1, 10), (2, 4)', 'Filtering removes the pending order before grouping and summing.'],
    ['(1, 17), (2, 4)', 'Seventeen includes the pending order excluded by WHERE.'],
    ['(1, 14), (2, 14)', 'The grouping keeps each user’s totals separate.'],
    ['(1, 10)', 'User 2 also has a paid order and is retained.'],
  ),
  item(
    'j-p-having',
    'SQL and data modeling',
    'Which clause returns users with at least three orders?',
    'SELECT user_id,COUNT(*) AS n\nFROM orders GROUP BY user_id\n-- filter grouped totals',
    ['HAVING COUNT(*) >= 3', 'HAVING filters the aggregate results after grouping.'],
    [
      'WHERE COUNT(*) >= 3',
      'WHERE operates before grouping and cannot filter this aggregate result.',
    ],
    ['ORDER BY COUNT(*) >= 3', 'Ordering does not remove groups below the threshold.'],
    ['LIMIT 3', 'A limit returns at most three groups, regardless of their counts.'],
  ),
  item(
    'j-p-or',
    'SQL and data modeling',
    'What defect can expose another tenant’s archived record?',
    "SELECT * FROM documents\nWHERE tenant_id=$1 AND status='active' OR status='archived';",
    [
      'OR bypasses the tenant condition',
      'AND binds more tightly, so every archived row satisfies the second branch.',
    ],
    [
      'The tenant comparison rejects active rows',
      'Matching active rows satisfy the first branch correctly.',
    ],
    ['The query excludes every archived row', 'Archived rows satisfy the unscoped OR branch.'],
    [
      'The status comparison changes the tenant value',
      'Comparisons filter rows; they do not assign column values.',
    ],
  ),
  item(
    'j-p-delete-where',
    'SQL and data modeling',
    'The cleanup should delete only expired sessions. Which bug is present?',
    'DELETE FROM sessions;\n-- expires_at is available on each row',
    [
      'There is no expiration predicate',
      'Without WHERE, DELETE targets all rows visible to the statement.',
    ],
    [
      'The statement lacks a RETURNING clause',
      'RETURNING is optional and does not restrict which rows are deleted.',
    ],
    [
      'The table needs an alias to allow deletion',
      'An alias is not required for this simple DELETE.',
    ],
    [
      'The expiration column must be selected first',
      'A single DELETE can filter directly on expires_at without a preceding SELECT.',
    ],
  ),
  item(
    'j-p-range',
    'SQL and data modeling',
    'Which predicate includes all January timestamps but excludes February 1?',
    'created_at is a UTC timestamp; boundaries are UTC.',
    [
      "created_at >= '2026-01-01' AND created_at < '2026-02-01'",
      'The half-open range includes the whole month without depending on timestamp precision.',
    ],
    [
      "created_at BETWEEN '2026-01-01' AND '2026-02-01'",
      'BETWEEN includes both endpoints and admits midnight on February 1.',
    ],
    [
      "created_at > '2026-01-01' AND created_at < '2026-02-01'",
      'The exclusive lower bound drops midnight at the start of January.',
    ],
    [
      "created_at >= '2026-01-01' AND created_at <= '2026-01-31'",
      'The upper timestamp is midnight at the start of January 31, excluding most of that day.',
    ],
  ),
  item(
    'j-p-index',
    'SQL and data modeling',
    'This large table repeatedly looks up orders by customer_id. Which index is the most direct candidate to test?',
    'SELECT id,total FROM orders WHERE customer_id=$1;',
    [
      'An index on customer_id',
      'It supports locating rows for the equality predicate; the plan should confirm benefit.',
    ],
    ['An index on total', 'Total is returned but not used to locate these rows.'],
    ['An index on created_at', 'The query has no created_at filter or ordering requirement.'],
    [
      'A second index on the existing primary key id',
      'The lookup predicate targets customer_id, not the primary key.',
    ],
  ),
  item(
    'j-p-boundary-input',
    'HTTP and security',
    'Why can this route persist an invalid empty title?',
    'if (!body.title) reject();\nsave({ title: body.title.trim() });\n// input: {title: "   "}',
    [
      'Whitespace passes the pre-trim check',
      'A nonempty whitespace string is truthy, then trim produces the invalid empty string.',
    ],
    [
      'trim mutates the original request body',
      'String trimming returns a new string; mutation is not the defect.',
    ],
    [
      'Whitespace is removed by JSON parsing',
      'JSON parsers preserve whitespace inside quoted strings.',
    ],
    [
      'The save operation reintroduces leading spaces',
      'There is no evidence of persistence adding spaces to the trimmed value.',
    ],
  ),
  item(
    'j-p-mass-assignment',
    'HTTP and security',
    'What should replace this update when callers may edit only their display name?',
    'updateUser(session.userId, request.body);\n// body may contain { displayName, role, suspended }',
    [
      'Pass an allowlisted displayName field',
      'Constructing the permitted update prevents privilege fields from being mass-assigned.',
    ],
    [
      'Reject requests lacking a displayName property',
      'A request can include displayName together with an unauthorized role change.',
    ],
    [
      'Verify that every body key is a string',
      'Valid key types do not establish permission to change the corresponding fields.',
    ],
    [
      'Remove suspended but preserve other supplied fields',
      'The role field would still permit a privilege change.',
    ],
  ),
  item(
    'j-p-header',
    'HTTP and security',
    'A browser refuses to interpret the API response as its declared format. What header should identify this JSON body?',
    '{"items":[]}',
    [
      'Content-Type: application/json',
      'Content-Type describes the representation format sent in the response.',
    ],
    [
      'Accept: application/json',
      'Accept expresses a preference for received formats rather than labeling this response.',
    ],
    [
      'Authorization: application/json',
      'Authorization carries credentials and does not describe the payload format.',
    ],
    [
      'Content-Encoding: application/json',
      'Content-Encoding describes compression or other encoding, not the JSON media type.',
    ],
  ),
  item(
    'j-p-no-content',
    'HTTP and security',
    'The server sends 204 after deletion. What should the client expect in the response body?',
    '',
    ['No response content', 'A 204 response communicates success without a message body.'],
    [
      'A JSON object containing the deleted identifier',
      'That representation requires a status that permits response content.',
    ],
    [
      'A JSON null token as a required marker',
      'The null token is content and is not required for 204.',
    ],
    [
      'The resource’s previous representation',
      'Returning the prior resource contradicts the no-content response semantics.',
    ],
  ),
  item(
    'j-p-path',
    'HTTP and security',
    'A download route joins a caller-supplied name to /exports. Which input most directly tests directory traversal?',
    'readFile("/exports/" + request.query.name)',
    [
      '../../private/config',
      'Parent-directory segments attempt to escape the intended export directory.',
    ],
    ['report-2026.csv', 'This is an ordinary filename within the export directory.'],
    [
      'a-very-long-report-name.csv',
      'Length may test limits but does not itself traverse parent directories.',
    ],
    ['summary%20report.csv', 'An encoded space tests decoding rather than directory escape.'],
  ),
  item(
    'j-p-secret-error',
    'HTTP and security',
    'Which API response preserves useful support context after this failure?',
    'Database connection failed: user=app password=secret host=db.internal\ncorrelationId=r9',
    [
      'Generic failure with correlationId r9',
      'The client gets a support reference while infrastructure and credentials remain private.',
    ],
    [
      'The connection error without its stack trace',
      'The message itself still contains credentials and internal host information.',
    ],
    [
      'A success object with a missing record',
      'False success prevents correct client recovery and obscures the failed operation.',
    ],
    [
      'A retry object containing the database hostname',
      'Clients do not need the private database address to handle this failure.',
    ],
  ),
  item(
    'j-p-check-decrement',
    'Transactions and concurrency',
    'Two buyers compete for the last ticket. Which statement combines availability checking with decrementing?',
    'tickets(id=8, remaining=1)',
    [
      'UPDATE tickets SET remaining=remaining-1 WHERE id=8 AND remaining>0',
      'The predicate and decrement occur at the shared database boundary; check the affected-row count.',
    ],
    [
      'UPDATE tickets SET remaining=0 WHERE id=8',
      'Both buyers can report success without knowing which one acquired the ticket.',
    ],
    [
      'SELECT remaining FROM tickets WHERE id=8',
      'A read does not reserve the ticket or prevent a competing buyer.',
    ],
    [
      'UPDATE tickets SET remaining=remaining-1 WHERE id=8',
      'Without the positive-stock condition, the second decrement can make stock negative.',
    ],
  ),
  item(
    'j-p-affected',
    'Transactions and concurrency',
    'An owner-scoped UPDATE affects zero rows. What can the handler conclude from that count alone?',
    'UPDATE notes SET title=$1 WHERE id=$2 AND owner_id=$3;',
    [
      'No row matched both conditions',
      'The row may be absent or belong to another owner; the count alone cannot distinguish them.',
    ],
    ['The database connection was lost', 'A successful zero-row result is not a connection error.'],
    [
      'The note exists under another owner',
      'The same result also occurs when the identifier does not exist.',
    ],
    [
      'The title was saved with its original value',
      'Zero matching rows provides no evidence that any row was updated.',
    ],
  ),
  item(
    'j-p-check-null',
    'Transactions and concurrency',
    'Why does this schema still allow a row with a null quantity in PostgreSQL?',
    'quantity integer CHECK (quantity > 0)',
    [
      'CHECK accepts an unknown result',
      'A null comparison is unknown; add NOT NULL if missing quantities are forbidden.',
    ],
    [
      'CHECK runs only when the row is deleted',
      'CHECK constraints are evaluated on relevant inserts and updates.',
    ],
    [
      'The integer type converts null to zero',
      'Null remains null and is not converted into zero by the integer type.',
    ],
    [
      'Positive checks are enforced only through indexes',
      'CHECK enforces row expressions independently of secondary indexes.',
    ],
  ),
  item(
    'j-p-transaction-order',
    'Transactions and concurrency',
    'What is wrong with returning success here?',
    'BEGIN\nINSERT order\nsendResponse(201)\nCOMMIT // may fail',
    [
      'Success precedes durable completion',
      'A commit failure can leave the client believing an order exists when it does not.',
    ],
    [
      'INSERT cannot execute inside a transaction',
      'Inserts are routinely executed in transactions.',
    ],
    [
      'The response causes an automatic database rollback',
      'Sending HTTP bytes has no inherent rollback effect on the database.',
    ],
    [
      'COMMIT must execute before the INSERT statement',
      'A commit belongs after the writes it is intended to finalize.',
    ],
  ),
  item(
    'j-p-double-click',
    'Transactions and concurrency',
    'Disabling the submit button reduced duplicate orders but did not eliminate them. Which remaining cause is plausible?',
    '',
    [
      'Network retries can repeat the request',
      'Client UI state does not prevent transport retries or requests from other clients.',
    ],
    [
      'The button state is stored only on this page',
      'This explains cross-page limits but does not itself identify a repeated request in the same interaction.',
    ],
    [
      'A transaction removes the need for a request key',
      'Atomic writes do not distinguish a retry from a second logical order.',
    ],
    [
      'A successful response prevents later retries',
      'Responses can be lost or clients can resend; server-side duplicate handling is still required.',
    ],
  ),
  item(
    'j-p-rollback-read',
    'Transactions and concurrency',
    'What balance will another transaction read after this transaction ends, assuming no other writer?',
    'Initial balance=40\nBEGIN;\nUPDATE wallets SET balance=25 WHERE id=1;\nROLLBACK;',
    ['40', 'Rollback discards the attempted update and preserves the original committed balance.'],
    ['25', 'Twenty-five would be visible after a successful commit, not this rollback.'],
    ['65', 'The update assigns a value; it does not add 25 to the original.'],
    ['0', 'Rollback restores prior state rather than resetting numeric values to zero.'],
  ),
  item(
    'j-p-fixture',
    'Testing and operations',
    'A test passes alone but fails after another test inserts a user with the same unique email. What is the most direct repair?',
    '',
    [
      'Isolate and clean each test’s data',
      'Independent fixtures prevent prior test state from changing the expected outcome.',
    ],
    [
      'Run the failing test last in the suite',
      'Ordering changes hide rather than eliminate the state dependency.',
    ],
    [
      'Remove the production email constraint',
      'That weakens a real invariant to accommodate a flawed test setup.',
    ],
    [
      'Retry the test until the duplicate disappears',
      'The persisted duplicate will not reliably disappear through retries.',
    ],
  ),
  item(
    'j-p-clock',
    'Testing and operations',
    'Which test design avoids waiting in real time to check token expiration?',
    'isExpired(token, now) compares token.expiresAt <= now',
    [
      'Supply fixed times around expiresAt',
      'An explicit clock input makes both sides of the expiration boundary deterministic.',
    ],
    [
      'Sleep until the token expires in production time',
      'Real sleeping is slow and sensitive to scheduling delays.',
    ],
    [
      'Increase the expiration interval for tests',
      'A longer interval does not exercise expiration promptly.',
    ],
    [
      'Assert that the token contains an expiration field',
      'Field presence does not establish the boundary comparison behavior.',
    ],
  ),
  item(
    'j-p-logs',
    'Testing and operations',
    'Which pair of log fields best connects this HTTP failure to the database error from the same request?',
    'HTTP log and SQL error log are emitted by different components.',
    [
      'Shared request ID and timestamps',
      'A propagated identifier correlates the operation; timestamps establish its sequence.',
    ],
    [
      'Database password and client IP address',
      'Credentials should not be logged, and IP alone is not a unique request correlation.',
    ],
    [
      'Process start time and build file size',
      'These describe an instance or artifact, not the individual failed request.',
    ],
    [
      'Raw request body and total server memory',
      'Payload content is unnecessary and memory does not link the two events.',
    ],
  ),
  item(
    'j-p-latency',
    'Testing and operations',
    'What does this trace suggest optimizing first?',
    'request 180 ms\nvalidation 2 ms\nSQL 160 ms\nJSON serialization 3 ms\nother 15 ms',
    [
      'Inspect the SQL plan and waits',
      'SQL consumes most of the measured latency and is the strongest initial lead.',
    ],
    [
      'Rewrite the validation helper first',
      'Eliminating all validation time would save only 2 ms.',
    ],
    [
      'Change JSON indentation settings first',
      'Serialization accounts for only 3 ms in this trace.',
    ],
    [
      'Increase the static image cache lifetime',
      'Static image delivery is absent from the measured request.',
    ],
  ),
  item(
    'j-p-env',
    'Testing and operations',
    'After deployment, uploads fail because a required writable directory is absent. Which check would catch this before routing traffic?',
    '',
    [
      'Validate storage access during startup',
      'A startup check can verify the required directory and permissions before readiness.',
    ],
    [
      'Confirm that the source file compiles',
      'Compilation does not verify the deployed filesystem.',
    ],
    [
      'Assert that the upload button is visible',
      'UI visibility does not establish server-side storage access.',
    ],
    [
      'Check that the API returns a JSON content type',
      'Response media type is independent of writable storage.',
    ],
  ),
  item(
    'j-p-resource',
    'Testing and operations',
    'Which change fixes connection exhaustion after exceptions?',
    'connection = pool.acquire()\nresult = query(connection) // can throw\npool.release(connection)',
    [
      'Release in a finally block',
      'Finally runs on both success and exceptional exits so the connection returns to the pool.',
    ],
    [
      'Release before running the query',
      'Returning the connection early permits reuse while the operation still needs it.',
    ],
    [
      'Increase the pool size after each exception',
      'More connections delay exhaustion while retaining the underlying leak.',
    ],
    [
      'Catch the error and return without releasing',
      'That error path still retains the connection and reproduces the leak.',
    ],
  ),
];

const midFundamentals: Item[] = [
  item(
    'm-f-composite',
    'SQL and data modeling',
    'A feed selects one tenant and orders by newest timestamp then ID. Which B-tree index best matches that access pattern?',
    'WHERE tenant_id=$1 ORDER BY created_at DESC,id DESC LIMIT 30',
    [
      '(tenant_id, created_at DESC, id DESC)',
      'The tenant equality prefixes the ordered columns and the ID breaks timestamp ties.',
    ],
    [
      '(created_at DESC, tenant_id, id DESC)',
      'Interleaving tenants in timestamp order can require scanning many irrelevant entries.',
    ],
    [
      '(id DESC, tenant_id, created_at DESC)',
      'Leading with ID does not match the requested timestamp ordering.',
    ],
    [
      'Separate single-column indexes on all three fields',
      'Separate indexes do not directly provide the combined filtered ordering.',
    ],
  ),
  item(
    'm-f-normalize',
    'SQL and data modeling',
    'An order must preserve the address used at purchase even if the customer changes their profile. Which model fits?',
    '',
    [
      'Store an order address snapshot',
      'The order records a historical fact whose lifetime differs from the mutable profile.',
    ],
    [
      'Read the customer’s current address at display time',
      'A later profile edit would rewrite the apparent destination of the old order.',
    ],
    [
      'Store only the profile address identifier',
      'A mutable referenced address still changes the historical order unless versioned.',
    ],
    [
      'Copy the current address into a shared customer cache',
      'A cache is neither an immutable historical record nor durable order evidence.',
    ],
  ),
  item(
    'm-f-exists',
    'SQL and data modeling',
    'The API needs customers who have at least one unpaid invoice, once per customer. Which expression captures that intent?',
    '',
    [
      'A correlated EXISTS predicate',
      'EXISTS tests membership without multiplying customer rows by invoice count.',
    ],
    [
      'A join with no deduplication',
      'A customer with multiple unpaid invoices can appear multiple times.',
    ],
    [
      'COUNT(*) over all invoices without grouping',
      'A global invoice count does not identify qualifying customers.',
    ],
    [
      'A LEFT JOIN filtered only by customer status',
      'Without testing unpaid invoices, the query includes customers who do not qualify.',
    ],
  ),
  item(
    'm-f-expand',
    'SQL and data modeling',
    'Old and new application versions run during deployment. How should a required replacement column be introduced?',
    '',
    [
      'Add, backfill, switch, then constrain',
      'An additive phase and verified backfill preserve compatibility while writers transition.',
    ],
    [
      'Drop the old column before starting new instances',
      'Old instances can still issue queries that require the removed column.',
    ],
    [
      'Add NOT NULL with no default to populated rows',
      'Existing rows lack the value and cannot satisfy the new requirement.',
    ],
    [
      'Rename the old column during a rolling deployment',
      'Old binaries still refer to the old name and will fail.',
    ],
  ),
  item(
    'm-f-csrf',
    'HTTP and security',
    'A cookie-authenticated endpoint transfers funds. Why is CORS configuration alone insufficient as CSRF protection?',
    '',
    [
      'Some cross-site writes can still be sent',
      'CORS governs script access to responses; permitted request shapes can reach the server with cookies.',
    ],
    [
      'CORS encrypts only the response body',
      'CORS is an origin access mechanism, not an encryption mechanism.',
    ],
    [
      'A cookie signature prevents request forgery',
      'A browser may attach a valid cookie to a request the user did not intend.',
    ],
    [
      'CSRF requires the attacker to read the response',
      'A harmful state change can succeed without the attacker reading its response.',
    ],
  ),
  item(
    'm-f-etag',
    'HTTP and security',
    'A client edits version 4 while the server already stores version 5. Which conditional-request mechanism detects the stale edit?',
    '',
    [
      'If-Match with version 4’s ETag',
      'The server rejects the write when the supplied validator no longer matches.',
    ],
    [
      'If-None-Match on the latest list endpoint',
      'A conditional list read does not guard the later resource mutation.',
    ],
    [
      'Cache-Control: no-cache on the write response',
      'Revalidation policy does not compare the client’s base version before mutation.',
    ],
    [
      'An Accept header containing the API version',
      'Representation version negotiation is distinct from the resource’s current revision.',
    ],
  ),
  item(
    'm-f-ssrf',
    'HTTP and security',
    'A server fetches caller-provided webhook preview URLs. Which control must cover redirects as well as the original URL?',
    '',
    [
      'Destination network allowlisting',
      'Each resolved destination must satisfy policy so redirects cannot reach internal services.',
    ],
    [
      'Response content-type validation',
      'Content type is checked after the forbidden connection may already have occurred.',
    ],
    [
      'HTML escaping of preview titles',
      'Escaping protects rendered output but not the server’s network access.',
    ],
    [
      'Authentication on the preview UI',
      'An authenticated caller can still supply an internal or redirected URL.',
    ],
  ),
  item(
    'm-f-scope',
    'HTTP and security',
    'A service validates a signed token intended for a different API. Which missed check most directly explains the acceptance?',
    'issuer matches; signature valid; exp in future; aud="billing"\nreceiver="reporting"',
    [
      'Expected audience',
      'Audience validation prevents one service’s token from being used at another recipient.',
    ],
    ['The token’s expiration', 'The fixture explicitly says the token has not expired.'],
    [
      'The token’s signature algorithm only',
      'A valid signature and approved algorithm do not establish the intended recipient.',
    ],
    [
      'The resource’s response content type',
      'Media type does not participate in token audience validation.',
    ],
  ),
  item(
    'm-f-isolation',
    'Transactions and concurrency',
    'In PostgreSQL READ COMMITTED, another transaction commits a row between two SELECT statements. Can the second SELECT see it?',
    '',
    [
      'Yes, each statement gets a snapshot',
      'Read committed takes a fresh statement snapshot and may observe the newly committed row.',
    ],
    [
      'No, BEGIN fixes the snapshot until COMMIT',
      'That describes a stronger snapshot behavior than read committed provides.',
    ],
    [
      'Only if the first SELECT modified the row',
      'Visibility does not require the reader to have performed an earlier write.',
    ],
    [
      'Only after reconnecting to the database',
      'A new statement can observe committed changes on the existing connection.',
    ],
  ),
  item(
    'm-f-deadlock',
    'Transactions and concurrency',
    'Two transfers lock the same account pair in opposite order. What change reduces this deadlock pattern?',
    '',
    [
      'Acquire account locks in a fixed order',
      'A shared ordering removes the circular wait caused by opposite acquisition sequences.',
    ],
    [
      'Increase the lock wait timeout',
      'A longer timeout does not remove the cycle of dependencies.',
    ],
    ['Use a faster JSON serializer', 'Serialization speed does not determine account lock order.'],
    [
      'Retry only the final UPDATE in the failed transaction',
      'A database-aborted transaction must be restarted as a complete unit.',
    ],
  ),
  item(
    'm-f-backpressure',
    'Testing and operations',
    'A producer sends 500 jobs/s while a worker sustains 300 jobs/s. What does an unbounded in-memory queue do over time?',
    '',
    [
      'Accumulates backlog and memory pressure',
      'The queue gains roughly 200 jobs per second while the rate difference persists.',
    ],
    [
      'Stabilizes at the worker’s average latency',
      'Latency does not cap queue length when arrival rate exceeds service rate.',
    ],
    [
      'Makes producer delivery durable across restarts',
      'An in-memory buffer loses data when its process stops.',
    ],
    [
      'Increases worker throughput to match arrival rate',
      'Buffering does not add processing capacity.',
    ],
  ),
  item(
    'm-f-tail',
    'Testing and operations',
    'Mean latency remains 40 ms, but p99 rises from 120 ms to 2 s. What does this indicate?',
    '',
    [
      'A slow tail hidden by the mean',
      'A relatively small fraction of requests can worsen sharply without moving the average much.',
    ],
    ['Every request now takes two seconds', 'The 99th percentile does not describe every request.'],
    [
      'The service handles fewer requests than before',
      'Latency percentiles alone do not establish throughput.',
    ],
    [
      'The request error rate is exactly one percent',
      'A latency percentile does not measure the error rate.',
    ],
  ),
];

const midPractical: Item[] = [
  item(
    'm-p-keyset',
    'SQL and data modeling',
    'Which next-page predicate matches the descending order and cursor below?',
    'ORDER BY created_at DESC,id DESC\nlast row: created_at=T, id=90\nBoth columns are NOT NULL.',
    [
      '(created_at,id) < (T,90)',
      'Tuple comparison continues strictly after the cursor in descending lexicographic order.',
    ],
    [
      'created_at < T AND id < 90',
      'Independent comparisons omit earlier timestamps whose IDs happen to be larger.',
    ],
    [
      '(created_at,id) > (T,90)',
      'The opposite comparison points toward rows preceding the cursor.',
    ],
    ['created_at <= T', 'This includes the cursor and earlier rows with the same timestamp.'],
  ),
  item(
    'm-p-fanout-sum',
    'SQL and data modeling',
    'One order has two lines totaling 30 and three payment attempts. A join over both child tables sums lines as 90. What fixes the aggregation?',
    '',
    [
      'Aggregate children before joining',
      'Each child contributes one row per order before the join can multiply its rows.',
    ],
    [
      'Use SUM(DISTINCT line.amount)',
      'Equal-priced distinct lines would be collapsed incorrectly.',
    ],
    [
      'Apply DISTINCT to the final order rows',
      'The sum has already been inflated before final-row deduplication.',
    ],
    [
      'Add an index to payment_attempt.order_id',
      'An index can improve access time but cannot change the join’s multiplicity.',
    ],
  ),
  item(
    'm-p-plan-loops',
    'SQL and data modeling',
    'Approximately how many rows did this plan node emit across all loops?',
    'Index Scan on lines (actual rows=4 loops=250)',
    [
      '1,000',
      'Actual rows is reported per loop, so four rows across 250 loops totals about 1,000.',
    ],
    ['4', 'That is the average per execution, not the total across all loops.'],
    ['250', 'The loop count is not the number of emitted rows.'],
    ['254', 'Adding rows and loops has no execution-plan interpretation.'],
  ),
  item(
    'm-p-not-in',
    'SQL and data modeling',
    'Why does this PostgreSQL query return no users when the subquery includes NULL?',
    'SELECT id FROM users\nWHERE id NOT IN (SELECT blocked_user_id FROM blocks);\n-- blocks contains (2), (NULL)',
    [
      'NULL makes unmatched comparisons unknown',
      'For other IDs, NOT IN cannot establish true when one comparison is unknown.',
    ],
    [
      'The subquery orders NULL before all IDs',
      'Ordering is irrelevant to the three-valued logical result.',
    ],
    [
      'NOT IN treats NULL as every integer value',
      'NULL is unknown, not a wildcard that equals every integer.',
    ],
    [
      'The primary key index cannot handle the subquery',
      'This is SQL null semantics rather than an index limitation.',
    ],
  ),
  item(
    'm-p-partial',
    'SQL and data modeling',
    'Which query most directly matches this PostgreSQL partial index?',
    "CREATE INDEX pending_jobs ON jobs(run_at) WHERE state='pending';",
    [
      "WHERE state='pending' ORDER BY run_at LIMIT 20",
      'The query explicitly implies the partial predicate and uses the indexed ordering.',
    ],
    [
      "WHERE state='done' ORDER BY run_at LIMIT 20",
      'Completed jobs are absent from this partial index.',
    ],
    ['ORDER BY run_at LIMIT 20', 'The unrestricted query needs rows outside the indexed subset.'],
    [
      "WHERE state IN ('pending','running') ORDER BY run_at",
      'Running rows are not represented by this partial index.',
    ],
  ),
  item(
    'm-p-soft-unique',
    'SQL and data modeling',
    'Soft-deleted usernames may be reused, but active usernames must be unique. Which PostgreSQL constraint mechanism fits?',
    'users(username, deleted_at)',
    [
      'Unique index WHERE deleted_at IS NULL',
      'The partial unique index enforces uniqueness within the active subset.',
    ],
    [
      'UNIQUE(username, deleted_at) with default null handling',
      'Default distinct-null semantics permit multiple active rows sharing a username.',
    ],
    [
      'UNIQUE(username) across the whole table',
      'This prevents reuse even after the original row is soft-deleted.',
    ],
    [
      'CHECK(username IS NOT NULL)',
      'Presence validation does not enforce uniqueness between rows.',
    ],
  ),
  item(
    'm-p-idempotency-payload',
    'HTTP and security',
    'The same caller reuses a completed idempotency key with a different cart. What should the API do?',
    'key=k1\noriginal fingerprint=cart-A\nretry fingerprint=cart-B',
    [
      'Reject conflicting key reuse',
      'A key identifies one logical request; a changed payload must not silently reuse its result.',
    ],
    [
      'Return the original order as the new cart’s order',
      'The response would falsely imply the changed cart was processed.',
    ],
    [
      'Create a second order under the same key',
      'That breaks the key’s one-request interpretation and complicates future retries.',
    ],
    [
      'Overwrite the original fingerprint after charging',
      'Overwriting destroys evidence of the first operation and permits duplicate effects.',
    ],
  ),
  item(
    'm-p-trusted-proxy',
    'HTTP and security',
    'Rate limiting trusts X-Forwarded-For from any connection. Attackers vary the header to evade quotas. Which correction addresses the trust boundary?',
    '',
    [
      'Trust forwarding data only from known proxies',
      'Untrusted clients must not control the identity used by the rate limiter.',
    ],
    [
      'Hash the received header before using it as a key',
      'Hashing preserves the attacker’s ability to choose many distinct identities.',
    ],
    [
      'Store the header in an encrypted cache',
      'Encryption does not make an attacker-supplied value authoritative.',
    ],
    [
      'Increase the TTL of each header-based quota',
      'A longer lifetime does not prevent switching to another forged value.',
    ],
  ),
  item(
    'm-p-cache-private',
    'HTTP and security',
    'A shared response cache is keyed only by path. Why can the fixture leak information?',
    'GET /me with cookie=A → Alice profile cached\nGET /me with cookie=B → cache hit',
    [
      'The cache omits the authorization context',
      'The same path returns different private representations for different identities.',
    ],
    [
      'JSON profiles require a different HTTP method',
      'GET can return profiles; the cache partitioning is the defect.',
    ],
    [
      'Cookie B must be a forged cookie',
      'A valid cookie for another user is enough to reproduce the leak.',
    ],
    [
      'The first response was serialized too early',
      'Serialization timing does not distinguish the two identities in the cache key.',
    ],
  ),
  item(
    'm-p-upload',
    'HTTP and security',
    'An upload endpoint checks only the filename extension before serving files inline. Which improvement addresses deceptive file content?',
    '',
    [
      'Validate bytes and constrain serving behavior',
      'Content inspection plus safe response handling prevents trusting an attacker-controlled filename.',
    ],
    [
      'Lowercase the filename extension before saving',
      'Case normalization does not establish the type of the uploaded bytes.',
    ],
    [
      'Require an authenticated uploader for every file',
      'An authenticated account can still upload malicious or mislabeled content.',
    ],
    [
      'Store the filename in a unique database column',
      'Uniqueness does not make the file contents safe to render.',
    ],
  ),
  item(
    'm-p-webhook-signature',
    'HTTP and security',
    'A webhook signature covers the exact received bytes. Why can this verification reject valid events?',
    'parsed = JSON.parse(rawBody)\nverify(JSON.stringify(parsed), signature)',
    [
      'Reserialization can change signed bytes',
      'Whitespace and key representation may change even when parsed data is equivalent.',
    ],
    [
      'JSON parsing decrypts the sender signature',
      'Parsing JSON does not perform cryptographic operations.',
    ],
    [
      'Signatures can only cover URL query strings',
      'Message signatures can cover request bodies as specified by the protocol.',
    ],
    [
      'The sender must use the receiver’s field order',
      'Verification should use the original bytes rather than require a new serialization.',
    ],
  ),
  item(
    'm-p-redirect-auth',
    'HTTP and security',
    'A download client follows redirects and forwards its Authorization header to any new host. What should change?',
    '',
    [
      'Restrict credential forwarding by destination',
      'A redirect to another origin must not automatically receive the original origin’s credential.',
    ],
    [
      'Append the original host to the User-Agent string',
      'An informational header does not prevent the destination from receiving the credential.',
    ],
    [
      'Encode the bearer token before following redirects',
      'Encoding is reversible and does not prevent credential disclosure.',
    ],
    [
      'Raise the maximum number of allowed redirects',
      'More redirects increase exposure without establishing destination trust.',
    ],
  ),
  item(
    'm-p-cas',
    'Transactions and concurrency',
    'Two editors load version 7. Which update detects that another editor committed first?',
    'documents(id, body, version)',
    [
      'UPDATE ... SET body=$1,version=8 WHERE id=$2 AND version=7',
      'The version predicate makes the change conditional; zero rows signals a stale base version.',
    ],
    [
      'UPDATE ... SET body=$1,version=8 WHERE id=$2',
      'Both writers can overwrite the document because no old-version condition exists.',
    ],
    [
      'SELECT version FROM documents WHERE id=$2; then unconditional UPDATE',
      'Another writer can commit between the separate check and write.',
    ],
    [
      'UPDATE ... SET body=$1 WHERE id=$2 RETURNING version',
      'Returning the version after an unconditional write does not prevent overwriting.',
    ],
  ),
  item(
    'm-p-outbox',
    'Transactions and concurrency',
    'An order commits but the process crashes before publishing OrderCreated. What design preserves an eventual publication obligation?',
    '',
    [
      'Write an outbox row with the order',
      'A durable outbox in the same transaction survives a crash and can be published later.',
    ],
    [
      'Publish only after returning HTTP success',
      'A crash before publishing still loses the obligation.',
    ],
    [
      'Publish first and then start the order transaction',
      'A database failure can leave an event for an order that never committed.',
    ],
    [
      'Increase the publisher’s network timeout',
      'Timeout length cannot close the crash gap between database commit and publication.',
    ],
  ),
  item(
    'm-p-deadlock-retry',
    'Transactions and concurrency',
    'PostgreSQL aborts a transaction as a deadlock victim. What unit should a bounded retry repeat?',
    '',
    [
      'The complete transaction',
      'All decisions and writes must be recomputed in a fresh transaction after rollback.',
    ],
    [
      'Only the SQL statement that received the error',
      'The aborted transaction is not a valid context for continuing its work.',
    ],
    [
      'Only COMMIT on the same connection',
      'Committing cannot resurrect a transaction already aborted by the database.',
    ],
    [
      'Only the HTTP response serialization',
      'The database operation did not finish, so changing the response does not recover it.',
    ],
  ),
  item(
    'm-p-claim',
    'Transactions and concurrency',
    'Two workers must claim different pending jobs without waiting on each other’s locked rows. Which PostgreSQL pattern fits a work queue?',
    '',
    [
      'FOR UPDATE SKIP LOCKED within a claim transaction',
      'The workers skip rows currently locked by competitors and persist their claim before committing.',
    ],
    [
      'SELECT without locking followed by separate UPDATE',
      'Both workers can select the same unclaimed row before either update.',
    ],
    [
      'FOR SHARE while leaving the job state pending',
      'Shared locks permit multiple readers and do not establish exclusive claims.',
    ],
    [
      'ORDER BY run_at without a transaction',
      'Ordering chooses candidates but does not coordinate competing workers.',
    ],
  ),
  item(
    'm-p-remote-in-tx',
    'Transactions and concurrency',
    'An HTTP call takes up to 20 seconds inside a database transaction holding inventory locks. What is the main operational risk?',
    '',
    [
      'Long lock and connection retention',
      'A slow dependency extends scarce database resource occupancy and blocks competing reservations.',
    ],
    [
      'The HTTP server gains database rollback support',
      'An ordinary HTTP dependency is not enlisted in the local database transaction.',
    ],
    [
      'The inventory locks become globally distributed',
      'Local database locks do not automatically coordinate remote service state.',
    ],
    [
      'The dependency response inherits read committed isolation',
      'Database isolation applies to database operations, not external HTTP results.',
    ],
  ),
  item(
    'm-p-commit-lost',
    'Transactions and concurrency',
    'The database connection drops while COMMIT is being acknowledged. What should a retryable API use to resolve the outcome?',
    '',
    [
      'A durable request key lookup',
      'The operation may have committed; a persisted scoped key can recover its result without repeating effects.',
    ],
    [
      'A new transaction with a fresh request key',
      'A fresh identity may duplicate a transaction that actually committed.',
    ],
    [
      'The elapsed duration of the failed connection',
      'Timing cannot establish whether the database made the commit durable.',
    ],
    [
      'The HTTP status that the handler intended to send',
      'An intended response is not evidence of the database’s final outcome.',
    ],
  ),
  item(
    'm-p-retry-storm',
    'Testing and operations',
    'Three layers each retry an operation up to three attempts. What is the worst-case number of leaf attempts for one top-level request?',
    '',
    ['27', 'Nested attempts multiply: three attempts at each of three layers gives 3×3×3.'],
    ['9', 'Adding the three layer budgets undercounts the nested amplification.'],
    ['6', 'The retries are not a pair of independent three-attempt loops.'],
    ['3', 'A shared end-to-end budget could cap at three, but that is not the stated design.'],
  ),
  item(
    'm-p-deadline',
    'Testing and operations',
    'A request has 800 ms remaining and makes two sequential dependency calls. Which deadline allocation respects the caller’s budget?',
    '',
    [
      'Propagate the decreasing remaining budget',
      'Each step must account for time already spent and reserve enough time to finish the response.',
    ],
    [
      'Give each call a fresh 800 ms timeout',
      'Sequential calls could consume 1,600 ms plus overhead.',
    ],
    [
      'Give the second call the original client timeout',
      'Resetting the budget disregards elapsed time in the first call.',
    ],
    [
      'Rely on the dependency’s default 30-second timeout',
      'A default longer than the caller budget wastes work and delays resource release.',
    ],
  ),
  item(
    'm-p-alert',
    'Testing and operations',
    'A service has a brief CPU spike but successful requests remain fast. Which alert is better evidence of user impact?',
    '',
    [
      'Sustained error-budget burn',
      'A sustained rise in user-visible failures or latency tracks the service objective directly.',
    ],
    [
      'Any sample above fifty percent CPU',
      'An isolated utilization threshold can page for harmless headroom usage.',
    ],
    [
      'A single garbage collection event',
      'Routine collection need not affect user-visible service quality.',
    ],
    [
      'An increase in deployed build number',
      'Deployment metadata is useful context but not evidence of impact.',
    ],
  ),
  item(
    'm-p-concurrency-test',
    'Testing and operations',
    'Which test reliably challenges a last-seat reservation invariant?',
    '',
    [
      'Synchronize competing buyers; inspect committed state',
      'A barrier forces overlap, and durable assertions check one winner and nonnegative availability.',
    ],
    [
      'Send two reservations sequentially and compare statuses',
      'Sequential calls miss the check-then-write interleaving that causes overselling.',
    ],
    [
      'Mock the repository to return success only once',
      'The mock supplies the invariant instead of testing the real concurrency boundary.',
    ],
    [
      'Assert that the reservation SQL contains the word transaction',
      'Text inspection does not establish correct behavior under competing writes.',
    ],
  ),
  item(
    'm-p-plan-estimate',
    'Testing and operations',
    'What should be investigated when this estimate causes a bad join choice?',
    'Estimated rows=10\nActual rows=900000\nPredicate filters a recently bulk-loaded column',
    [
      'Stale or insufficient column statistics',
      'A large cardinality error after a bulk load suggests statistics do not represent the current data.',
    ],
    [
      'The query result’s JSON indentation',
      'Serialization format does not determine planner row estimates.',
    ],
    [
      'The HTTP keep-alive idle timeout',
      'Connection reuse at HTTP level does not explain a database estimate.',
    ],
    [
      'The spelling of the selected column aliases',
      'Aliases do not change predicate selectivity or stored statistics.',
    ],
  ),
  item(
    'm-p-graceful',
    'Testing and operations',
    'A worker receives a termination signal while processing a job with an expiring lease. Which shutdown sequence best preserves recoverability?',
    '',
    [
      'Stop claims, finish or relinquish work, then exit',
      'Draining or allowing safe redelivery prevents new work from being stranded during termination.',
    ],
    [
      'Acknowledge every leased job and then exit immediately',
      'Acknowledging unfinished work removes the queue’s recovery mechanism.',
    ],
    [
      'Continue claiming until the process is forcibly killed',
      'Newly claimed work gains no chance to finish and increases disruption.',
    ],
    [
      'Delete the lease records before committing job effects',
      'Another worker can begin the same work while the first still has uncommitted effects.',
    ],
  ),
];

const seniorFundamentals: Item[] = [
  item(
    's-f-skew',
    'Transactions and concurrency',
    'Each doctor may leave only if another remains on call. Under snapshot isolation, two transactions update different doctor rows after both count two on-call doctors. What must the design address?',
    'T1 snapshot: A=on, B=on → set A=off\nT2 snapshot: A=on, B=on → set B=off',
    [
      'Write skew across the shared predicate',
      'Disjoint row writes can both commit while violating an invariant over the set of doctors.',
    ],
    [
      'A lost update to one doctor row',
      'The writers update different rows, so no single-row overwrite is required.',
    ],
    [
      'A dirty read of an uncommitted doctor change',
      'Both decisions can use committed snapshots and still violate the invariant.',
    ],
    [
      'A missing unique constraint on doctor identity',
      'Unique doctor identifiers do not enforce minimum on-call staffing.',
    ],
  ),
  item(
    's-f-fencing',
    'Transactions and concurrency',
    'A paused lease holder resumes after its lease expires and a successor starts writing. What extra mechanism can let storage reject the stale writer?',
    '',
    [
      'Monotonic fencing tokens checked on writes',
      'Storage can reject a token older than the highest accepted generation even if the old process resumes.',
    ],
    [
      'A longer lease expiration duration',
      'A longer lease changes timing but does not prevent pauses exceeding that duration.',
    ],
    [
      'A heartbeat recorded in local process memory',
      'Other actors and storage cannot rely on the paused process’s local state.',
    ],
    [
      'A random owner identifier with no ordering',
      'An opaque identity distinguishes owners but does not establish which generation is stale.',
    ],
  ),
  item(
    's-f-linearizable',
    'Transactions and concurrency',
    'A permission revocation completes before the next protected request starts. The contract requires that next request to observe revocation. Which read guarantee is needed at that decision point?',
    '',
    [
      'Fresh authoritative authorization state',
      'The decision must respect the completed revocation through a linearizable read or equivalent synchronization.',
    ],
    [
      'An eventually consistent replica with no lag bound',
      'The replica can still expose the old permission after revocation returns.',
    ],
    [
      'A cached permission with a twenty-minute TTL',
      'The cache can authorize requests throughout its remaining lifetime.',
    ],
    [
      'A snapshot taken when the session was created',
      'A session-time snapshot cannot observe later permission changes.',
    ],
  ),
  item(
    's-f-compensate',
    'Transactions and concurrency',
    'A saga charged a card and then failed to reserve stock. Why is refunding a compensation rather than a database rollback?',
    '',
    [
      'The external charge has already committed',
      'A refund is a new action with its own failures and observable history, not erasure of the original transaction.',
    ],
    [
      'The refund must reuse the database transaction ID',
      'External compensation does not depend on sharing a local transaction identifier.',
    ],
    [
      'The refund necessarily restores the exact original state',
      'Fees, notifications, and external history can remain after compensation.',
    ],
    [
      'The charge can remain uncommitted until the refund finishes',
      'The scenario states that the charge succeeded before the later failure.',
    ],
  ),
  item(
    's-f-tenant-fk',
    'SQL and data modeling',
    'Row ownership is scoped by tenant. Which foreign key prevents a child from naming a parent in another tenant even if its parent ID is valid?',
    'parents UNIQUE(tenant_id,id)\nchildren(tenant_id,parent_id)',
    [
      '(tenant_id,parent_id) REFERENCES parents(tenant_id,id)',
      'The composite reference binds identity and tenant in the database relationship.',
    ],
    [
      'parent_id REFERENCES parents(id) with globally unique id',
      'Existence of a globally unique parent does not ensure its tenant matches the child.',
    ],
    [
      'tenant_id REFERENCES tenants(id)',
      'This establishes a valid tenant but not that the parent belongs to it.',
    ],
    [
      'A unique index on children(parent_id)',
      'Uniqueness limits child cardinality without checking tenant agreement.',
    ],
  ),
  item(
    's-f-ledger',
    'SQL and data modeling',
    'An audit must explain every balance change and safely replay corrections. Which model best supports that requirement?',
    '',
    [
      'Immutable entries with reversing corrections',
      'An append-only ledger retains the causal history while explicit reversals correct errors.',
    ],
    [
      'Overwrite balances and keep the latest audit message',
      'A latest-value record loses the sequence needed to explain earlier changes.',
    ],
    [
      'Update old ledger amounts in place after approval',
      'Changing history makes prior balances and previously generated reports difficult to reconstruct.',
    ],
    [
      'Reconstruct balances from sampled application logs',
      'Sampling and log retention make those logs an incomplete financial record.',
    ],
  ),
  item(
    's-f-cover',
    'SQL and data modeling',
    'A PostgreSQL index contains every selected column, yet the plan reports many heap fetches. Which explanation should be investigated?',
    'Index Only Scan\nHeap Fetches: 85000\nTable receives frequent updates.',
    [
      'Visibility checks still require heap visits',
      'Index-only scans also need visibility information; recently modified pages may not be all-visible.',
    ],
    [
      'The planner ignored the index entirely',
      'The plan explicitly reports an index-only scan, so the index is being used.',
    ],
    [
      'Included columns are silently removed on updates',
      'Updates maintain index contents according to PostgreSQL rules; visibility is a separate concern.',
    ],
    [
      'Every covering index guarantees zero heap fetches',
      'Coverage alone does not guarantee that the visibility map can eliminate heap access.',
    ],
  ),
  item(
    's-f-restore',
    'Testing and operations',
    'A team meets a five-minute backup interval but needs a ten-minute recovery time. Which evidence is still missing?',
    '',
    [
      'Measured restore and validation duration',
      'Backup frequency constrains potential data loss, not the time required to recover service.',
    ],
    [
      'A shorter retention period for application logs',
      'Log retention does not establish backup restoration speed.',
    ],
    [
      'A count of successful backup upload requests',
      'Upload success does not prove the backups can restore a usable service on time.',
    ],
    [
      'The compression ratio of the smallest backup',
      'Size is relevant context but cannot replace a timed recovery drill.',
    ],
  ),
  item(
    's-f-capacity',
    'Testing and operations',
    'A service averages 200 requests/s and each request occupies a database connection for 0.1 s. What average connection occupancy does Little’s Law predict under a stable workload?',
    '',
    [
      '20 connections',
      'Average occupancy is arrival rate times holding time: 200×0.1=20; peaks still require separate planning.',
    ],
    ['2 connections', 'That underestimates the product by a factor of ten.'],
    ['200 connections', 'That would correspond to a one-second holding time at the stated rate.'],
    [
      '2,000 connections',
      'Dividing rate by holding time is not Little’s Law for concurrent occupancy.',
    ],
  ),
  item(
    's-f-jwks',
    'HTTP and security',
    'A verifier refreshes signing keys whenever it sees an unknown key ID. Attackers send many distinct unknown IDs. Which policy balances rotation support with availability?',
    '',
    [
      'Bound refreshes and reject unresolved keys',
      'Rate-limited refresh with bounded caching supports rotation without making each bad token a remote fetch.',
    ],
    [
      'Fetch the key set on every rejected token',
      'That gives an attacker a cheap way to amplify dependency traffic.',
    ],
    [
      'Accept unknown keys until the next scheduled refresh',
      'Accepting an unverified signature creates an authentication bypass.',
    ],
    [
      'Disable refresh and retain the first key indefinitely',
      'That breaks legitimate key rotation and can retain revoked keys.',
    ],
  ),
  item(
    's-f-deputy',
    'HTTP and security',
    'An export service has broad storage credentials and accepts a caller-supplied object path. Authentication succeeds. What additional boundary prevents a confused-deputy leak?',
    '',
    [
      'Authorize the object against caller scope',
      'The service must not use its broader authority to read objects the caller cannot access.',
    ],
    [
      'Verify that the path is syntactically valid',
      'A valid path can still identify another tenant’s object.',
    ],
    [
      'Encrypt the service’s storage credentials at rest',
      'Credential storage protection does not restrict what a valid caller can ask the service to read.',
    ],
    [
      'Require an unpredictable export job identifier',
      'An opaque job ID does not authorize the source object selected by the caller.',
    ],
  ),
  item(
    's-f-erasure',
    'HTTP and security',
    'A deletion workflow removes the primary row but a replay rebuilds the personal data from old events. What architectural gap does this reveal?',
    '',
    [
      'Erasure is missing from replay semantics',
      'Derived-state rebuilds need a deletion policy that prevents retained history from resurrecting erased data.',
    ],
    [
      'The primary delete needs a longer SQL timeout',
      'A successful primary deletion can still be undone by an uninformed replay.',
    ],
    [
      'The read replica needs an additional index',
      'Indexing does not change which personal data replay materializes.',
    ],
    [
      'The event consumer needs a larger batch size',
      'Faster replay would reproduce the same incorrect state more quickly.',
    ],
  ),
];

const seniorPractical: Item[] = [
  item(
    's-p-skew-fix',
    'Transactions and concurrency',
    'Both transactions below can commit under PostgreSQL REPEATABLE READ. Which change protects the staffing invariant?',
    'A and B initially on call.\nT1 reads count=2, updates A off.\nT2 reads count=2, updates B off.\nRule: at least one doctor stays on call.',
    [
      'Use SERIALIZABLE with whole-transaction retries',
      'Serializable execution detects the incompatible dependency pattern; retry recomputes the staffing decision.',
    ],
    [
      'Add row locks only to the doctor each transaction updates',
      'The transactions lock different rows and can still make incompatible decisions.',
    ],
    [
      'Add a unique index on each doctor’s primary key',
      'Identity uniqueness does not constrain the number of on-call doctors.',
    ],
    [
      'Retry COMMIT without rerunning the staffing query',
      'An aborted transaction needs a fresh snapshot and re-evaluated decision.',
    ],
  ),
  item(
    's-p-stale-lease',
    'Transactions and concurrency',
    'Storage has accepted token 42. A paused worker now submits a write with token 41 and a still-valid user credential. What should storage do?',
    'lease generation 41 → paused\nlease generation 42 → acquired and wrote\ngeneration 41 → resumes',
    [
      'Reject generation 41 as stale',
      'The fencing comparison protects the resource independently of process pause and user authentication.',
    ],
    [
      'Accept because the user credential is valid',
      'Authentication does not establish that this worker still owns the lease generation.',
    ],
    [
      'Accept if generation 41’s payload differs',
      'A different payload does not restore ownership to the stale worker.',
    ],
    [
      'Reset the stored generation to the lower value',
      'Moving the fence backward permits stale writers to overwrite successor work.',
    ],
  ),
  item(
    's-p-outbox-duplicate',
    'Transactions and concurrency',
    'An outbox relay publishes an event then crashes before marking it sent. Which consumer design preserves one database effect on redelivery?',
    '',
    [
      'Unique event receipt and effect in one transaction',
      'The retry may publish again; atomic deduplication prevents the duplicate from changing state twice.',
    ],
    [
      'Mark sent before the relay publishes the event',
      'A crash after marking but before sending loses the event.',
    ],
    [
      'Discard events sharing the same creation timestamp',
      'Distinct events can share timestamps, so timestamp deduplication loses valid work.',
    ],
    [
      'Commit the effect and later insert its event receipt',
      'A crash between those commits permits the effect to repeat.',
    ],
  ),
  item(
    's-p-read-your-write',
    'Transactions and concurrency',
    'A user creates a project on the primary and immediately gets 404 from a lagging replica. Which targeted policy provides read-your-write without routing all reads to the primary?',
    '',
    [
      'Wait for a write position or use the primary',
      'A causal write token lets a replica serve only once it has replayed the needed commit, with primary fallback.',
    ],
    [
      'Retry replicas randomly without a position check',
      'Random selection provides no guarantee that any chosen replica includes the write.',
    ],
    [
      'Increase the cache TTL for missing projects',
      'Caching the stale absence extends the inconsistency visible to the user.',
    ],
    [
      'Return creation success before committing the project',
      'Earlier acknowledgement increases the interval in which reads cannot find the project.',
    ],
  ),
  item(
    's-p-idem-expiry',
    'Transactions and concurrency',
    'Idempotency records expire after one day, but a client retries a two-day-old charge request. What must the contract or storage design address?',
    '',
    [
      'Duplicate risk beyond the retention window',
      'Removing the deduplication record can turn an old retry into a new charge unless another durable identity protects it.',
    ],
    [
      'A guaranteed rollback of the original charge',
      'Record expiration does not reverse the external payment.',
    ],
    [
      'An automatic extension of all expired records',
      'An expired record cannot establish its original result unless retained elsewhere.',
    ],
    [
      'A change from POST to GET for the same charge',
      'HTTP method naming does not recreate the lost deduplication evidence.',
    ],
  ),
  item(
    's-p-stock-race',
    'Transactions and concurrency',
    'In PostgreSQL READ COMMITTED, what happens when B waits on this row and A commits its successful decrement?',
    'stock=1\nA: UPDATE inventory SET stock=stock-1 WHERE id=5 AND stock>0;\nB: same UPDATE, waits on A\nA: COMMIT',
    [
      'B rechecks the predicate and updates zero rows',
      'The updated row has stock zero, so the condition no longer qualifies after the wait.',
    ],
    [
      'B decrements the old snapshot value to zero again',
      'The waiting updater evaluates the updated row rather than blindly overwriting the old version.',
    ],
    [
      'B decrements the committed value to negative one',
      'The positive-stock predicate excludes the newly committed zero value.',
    ],
    [
      'B must fail with a serialization error in this isolation level',
      'Read committed can handle this case by rechecking the updated row instead.',
    ],
  ),
  item(
    's-p-fanout-count',
    'SQL and data modeling',
    'What values does this query produce for the one account in the fixture?',
    'account 1 has 2 invoices and 3 contacts\nSELECT COUNT(i.id),COUNT(c.id)\nFROM accounts a JOIN invoices i ON i.account_id=a.id\nJOIN contacts c ON c.account_id=a.id WHERE a.id=1;',
    [
      '6 and 6',
      'The two one-to-many joins form six combinations, each containing one invoice and one contact ID.',
    ],
    ['2 and 3', 'Those are source counts; the joined rows multiply them.'],
    ['5 and 5', 'The joins form a product of matching children, not their union.'],
    ['3 and 2', 'Reversing the source counts still ignores join multiplication.'],
  ),
  item(
    's-p-anti-join',
    'SQL and data modeling',
    'Users with no paid invoice must be retained, including users with unpaid invoices. Which query matches?',
    '',
    [
      "WHERE NOT EXISTS (SELECT 1 FROM invoices i WHERE i.user_id=u.id AND i.status='paid')",
      'The anti-existence test excludes exactly users with a paid invoice.',
    ],
    [
      "JOIN invoices i ON i.user_id=u.id WHERE i.status <> 'paid'",
      'A user with both paid and unpaid invoices can still pass, and users with none vanish.',
    ],
    [
      'WHERE u.id NOT IN (SELECT user_id FROM invoices)',
      'This excludes users with any invoice, including exclusively unpaid invoices.',
    ],
    [
      'LEFT JOIN invoices i ON i.user_id=u.id WHERE i.status IS NULL',
      'This tests unmatched or null-status invoices, not absence of paid invoices.',
    ],
  ),
  item(
    's-p-immutable-cursor',
    'SQL and data modeling',
    'A keyset-paginated export orders by updated_at and ID while rows continue changing. It must contain each row exactly once as of export start. What is missing?',
    '',
    [
      'A stable snapshot or materialized export set',
      'Mutable ordering keys can cross the cursor; a fixed source view defines the required historical membership.',
    ],
    [
      'A larger page size with the same live ordering',
      'Bigger pages reduce requests but do not stop rows from moving across page boundaries.',
    ],
    [
      'A unique ID tie-breaker added to updated_at',
      'The tie-breaker resolves equal timestamps but cannot freeze changing timestamps.',
    ],
    [
      'An index covering the response columns',
      'Faster access does not establish a consistent export snapshot.',
    ],
  ),
  item(
    's-p-dual-write',
    'SQL and data modeling',
    'A migration writes old and new columns, but a legacy worker writes only the old one. The backfill is complete. Is switching reads safe?',
    'new reader: uses normalized_phone\nlegacy worker: updates phone only',
    [
      'No; the legacy writer can reintroduce divergence',
      'A completed backfill is insufficient until all writers maintain the new representation or a reconciliation mechanism covers them.',
    ],
    [
      'Yes; one successful backfill proves future equality',
      'Backfill establishes a point-in-time state, not correctness of later legacy writes.',
    ],
    [
      'Yes; a nullable new column prevents stale values',
      'Nullable schema design does not keep two independently written values synchronized.',
    ],
    [
      'No; a second index on phone is mandatory first',
      'An index does not solve the incompatible write path.',
    ],
  ),
  item(
    's-p-distribution',
    'SQL and data modeling',
    'An index helps queries for small tenants but a huge tenant still uses a sequential scan. What is the best interpretation before forcing the index?',
    'tenant A: 0.01% of rows\ntenant B: 65% of rows\nSame predicate shape; different tenant values.',
    [
      'Selectivity may justify different access paths',
      'Reading most of a table through scattered index entries can cost more than a sequential scan.',
    ],
    [
      'The index must be corrupted for tenant B',
      'Different selectivity can explain the plan without corruption.',
    ],
    [
      'Every equality predicate should use an index scan',
      'Index suitability depends on rows visited and physical access cost.',
    ],
    [
      'Tenant B’s rows cannot appear in a multicolumn index',
      'A multicolumn index can contain those rows; cost is the relevant distinction.',
    ],
  ),
  item(
    's-p-online-index',
    'SQL and data modeling',
    'A failed PostgreSQL CREATE INDEX CONCURRENTLY leaves an invalid index. What should the deployment automation do before retrying?',
    '',
    [
      'Inspect validity and clean up or rebuild deliberately',
      'An invalid leftover can retain a name and maintenance costs; a retry needs explicit catalog-aware recovery.',
    ],
    [
      'Treat the existing index name as proof of success',
      'Name existence does not establish validity or usability.',
    ],
    [
      'Wrap CREATE INDEX CONCURRENTLY in a transaction block',
      'PostgreSQL does not permit that command inside a transaction block.',
    ],
    [
      'Drop the table to remove the invalid index dependency',
      'Destroying the table is unnecessary for recovering a failed index build.',
    ],
  ),
  item(
    's-p-auth-cache',
    'HTTP and security',
    'Permission revocation must take effect within five seconds. A cache lives for sixty seconds and invalidation messages may be lost. Which design satisfies the stated bound?',
    '',
    [
      'Bound cache freshness to five seconds or revalidate',
      'A finite freshness policy or authoritative validation enforces the bound even when invalidation delivery fails.',
    ],
    [
      'Keep the TTL and send invalidations asynchronously',
      'A lost invalidation still permits stale authorization for up to sixty seconds.',
    ],
    [
      'Increase cache replicas in each region',
      'More copies do not reduce the maximum lifetime of stale permissions.',
    ],
    [
      'Invalidate only when the user next logs in',
      'An existing session can continue beyond the required revocation window.',
    ],
  ),
  item(
    's-p-dns-rebind',
    'HTTP and security',
    'A URL validator resolves a public IP, but the HTTP client later resolves the hostname again to a private IP. What gap must be closed?',
    '',
    [
      'Bind validation to the actual connection destination',
      'The address used for the connection must satisfy policy; a separate earlier lookup is vulnerable to rebinding.',
    ],
    [
      'Require the URL path to end in .json',
      'Path syntax does not constrain the network address receiving the connection.',
    ],
    [
      'Log both DNS answers after the fetch completes',
      'Post hoc logs can diagnose a forbidden request but cannot prevent it.',
    ],
    [
      'Encrypt the stored preview URL before fetching',
      'Storage encryption does not control later DNS resolution.',
    ],
  ),
  item(
    's-p-tenant-cache',
    'HTTP and security',
    'Two tenants can each have document ID 17. What is the smallest sufficient cache-key correction for this authorized document lookup?',
    'key="document:" + documentId\nAuthorization is checked before loading.',
    [
      'Include tenant ID in the cache key',
      'The representation identity is the tenant-and-document pair, even when access was checked before the cache lookup.',
    ],
    [
      'Include only the request method in the cache key',
      'Both tenants perform GET, so their representations still collide.',
    ],
    [
      'Hash documentId with a fixed application salt',
      'The same document ID still produces the same cache key across tenants.',
    ],
    [
      'Reduce the TTL to one second without changing the key',
      'Even a brief collision can return another tenant’s private representation.',
    ],
  ),
  item(
    's-p-webhook-replay',
    'HTTP and security',
    'A validly signed webhook can be replayed by someone who captured it. Which controls address both old replays and repeated delivery within the accepted clock window?',
    '',
    [
      'Timestamp tolerance plus durable event deduplication',
      'Freshness rejects old messages; event identity prevents repeated effects for messages still within tolerance.',
    ],
    [
      'Signature verification with no other state',
      'A captured authentic message still has a valid signature.',
    ],
    [
      'Timestamp tolerance with no event receipt record',
      'A captured message can be replayed repeatedly inside the accepted window.',
    ],
    [
      'A random request ID generated by the receiver each time',
      'A new receiver ID cannot recognize the sender event as a duplicate.',
    ],
  ),
  item(
    's-p-zip',
    'HTTP and security',
    'A compressed upload is 2 MB but expands to 30 GB. Which resource limit protects the extraction stage?',
    '',
    [
      'Expanded-byte and entry-count budgets',
      'Extraction must bound the work and output it creates, not only the compressed input size.',
    ],
    [
      'A two-megabyte compressed request limit',
      'The malicious archive already fits within that limit.',
    ],
    [
      'A restriction to authenticated uploaders',
      'Authentication does not make the archive’s expansion safe.',
    ],
    [
      'A filename extension allowlist for archive formats',
      'An allowed archive format can still have an extreme expansion ratio.',
    ],
  ),
  item(
    's-p-trace-trust',
    'HTTP and security',
    'A public caller chooses a trace ID that collides with another tenant’s ID. What should an internal troubleshooting endpoint avoid assuming?',
    '',
    [
      'Trace ID possession implies permission',
      'Correlation identifiers can be attacker-controlled and are not authorization credentials.',
    ],
    [
      'Requests may carry the same trace identifier',
      'Collisions or supplied IDs are possible; systems should handle them without granting access.',
    ],
    [
      'Trace IDs are useful for correlation',
      'They remain useful diagnostic context even when they are not trusted secrets.',
    ],
    [
      'Logs need both tenant context and correlation data',
      'Scoped diagnostic access and correlation are compatible and often necessary.',
    ],
  ),
  item(
    's-p-timeout-slo',
    'Testing and operations',
    'The client deadline is one second. The service reports 99.99% success by counting only completed requests and dropping canceled ones. What is wrong with this SLI?',
    '10,000 requests started\n9,000 completed successfully\n1,000 canceled at deadline',
    [
      'It excludes user-visible deadline failures',
      'The denominator must represent eligible attempts; dropping timed-out requests inflates success.',
    ],
    [
      'Its sample needs a longer server timeout',
      'Changing timeout duration does not fix the biased measurement definition.',
    ],
    [
      'Canceled requests necessarily count as successes',
      'A caller who receives no result has not experienced a successful completed operation.',
    ],
    [
      'The result proves the dependency is healthy',
      'The incomplete-request cohort may contain the dependency’s worst behavior.',
    ],
  ),
  item(
    's-p-queue-age',
    'Testing and operations',
    'Queue depth is stable but oldest-job age rises. Which explanation should be tested?',
    'depth≈1000 for an hour\noldest age: 2 min → 62 min\nnew high-priority jobs complete quickly',
    [
      'Low-priority work may be starving',
      'Stable total depth can hide an old cohort that never gets service while newer work cycles through.',
    ],
    [
      'The queue has necessarily stopped accepting messages',
      'New high-priority completions contradict a conclusion based solely on stopped intake.',
    ],
    [
      'Every worker must be idle',
      'The prompt says newer jobs complete quickly, which shows ongoing work.',
    ],
    [
      'A stable depth proves bounded latency for each job',
      'Aggregate size does not guarantee fairness or latency for individual items.',
    ],
  ),
  item(
    's-p-replay-test',
    'Testing and operations',
    'A projection is rebuilt from events and duplicates can occur. Which property test most directly checks replay safety?',
    '',
    [
      'Duplicate and reorder only allowed events; compare state',
      'The generator should follow the event contract and verify that supported delivery variation preserves the expected projection.',
    ],
    [
      'Randomly reorder all events regardless of their contract',
      'That demands commutativity even when ordering is an explicit requirement.',
    ],
    [
      'Assert that each handler returns a successful status',
      'Handler status does not reveal incorrect accumulated state.',
    ],
    [
      'Use only one event type repeated with the same payload',
      'That misses interactions and dependencies between event types.',
    ],
  ),
  item(
    's-p-burn',
    'Testing and operations',
    'A 99.9% success SLO permits 0.1% errors. Current errors are 2%. What is the instantaneous error-budget burn multiple?',
    '',
    ['20×', 'Two percent divided by the permitted 0.1 percent is twenty.'],
    ['2×', 'This treats the allowed fraction as one percent rather than 0.1 percent.'],
    ['0.2×', 'This reverses the scale by two orders of magnitude.'],
    ['99.9×', 'The success target itself is not the error-budget burn multiple.'],
  ),
  item(
    's-p-rollback-deploy',
    'Testing and operations',
    'New binaries write values old binaries cannot parse. An incident starts after deployment. Why might simply restoring the old binary be unsafe?',
    '',
    [
      'Persisted data may violate the old reader contract',
      'Binary rollback does not undo incompatible data already committed by the new version.',
    ],
    [
      'A rollback necessarily restores the database snapshot',
      'Application deployments do not automatically restore database contents.',
    ],
    [
      'The old binary will reinterpret unknown values correctly',
      'That behavior cannot be assumed when the old parser rejects them.',
    ],
    [
      'The deploy timestamp needs a different timezone first',
      'Timestamp display does not resolve incompatible stored values.',
    ],
  ),
  item(
    's-p-pool-scale',
    'Testing and operations',
    'Autoscaling from 10 to 40 instances with 20 connections each exceeds a database cap of 300. Which mitigation addresses this scaling mismatch?',
    '10 × 20 = 200 possible connections\n40 × 20 = 800 possible connections',
    [
      'Budget aggregate connections and bound demand',
      'Pool sizes, admission control, and instance limits must respect the shared database capacity.',
    ],
    [
      'Increase every instance pool to 40 connections',
      'That doubles the already excessive aggregate connection demand.',
    ],
    [
      'Measure only average query execution duration',
      'Execution time alone does not prevent the configured total from overwhelming the server.',
    ],
    [
      'Disable all per-request deadlines during scale-out',
      'Longer occupancy makes resource pressure worse and does not increase database capacity.',
    ],
  ),
];

function exercise(
  id: string,
  title: string,
  prompt: string,
  reference: string,
  criteria: string[],
): Exercise {
  return { id: `be-${id}`, title, prompt, reference, criteria };
}
const fundamentalsExercises: Record<Tier, Exercise[]> = {
  junior: [
    exercise(
      'j-f-schema',
      'Model club memberships',
      'Design PostgreSQL tables for clubs, users, and memberships. A user can join many clubs once each; a membership has a joined_at timestamp. Deliver CREATE TABLE statements, a query listing every club with its member count including empty clubs, and fixtures that demonstrate rejected invalid memberships.',
      'Use primary keys, non-null foreign keys, and uniqueness of the club/user pair. Count a non-null membership key over a left join so an empty club reports zero. Include an attempted duplicate and an attempted reference to a nonexistent user.',
      [
        'DDL prevents duplicate pairs and dangling references.',
        'The count query retains an empty club and returns zero.',
        'Fixtures show both valid many-to-many membership and rejected writes.',
      ],
    ),
    exercise(
      'j-f-http',
      'Specify an address-book API',
      'Write a request/response contract for creating and retrieving private address-book entries. Include name length limits, malformed JSON, a missing entry, a different owner, and a database failure. Deliver example HTTP exchanges and a table connecting each case to its stored effects.',
      'Derive ownership from the authenticated session, validate the parsed input, and return a created representation only after persistence succeeds. Choose a consistent missing/forbidden disclosure policy, keep internal errors private, and use a request identifier for support.',
      [
        'Contract distinguishes parse, validation, permission, and dependency failures.',
        'Ownership cannot be supplied as authority by the client.',
        'Each example explains whether a durable row exists afterward.',
      ],
    ),
    exercise(
      'j-f-query',
      'Explain a revenue report',
      'Create a fixture with three customers, multiple paid and unpaid orders, and a customer with no orders. Write a report of paid order count and paid total for every customer. Deliver the SQL, hand-computed expected rows, and an explanation of where the paid-status predicate belongs.',
      'Use a left join with the paid predicate in its ON clause or preaggregate paid orders before joining. Count a non-null order identifier and convert missing sums to zero. Explain why a WHERE filter on the joined status drops customers without paid orders.',
      [
        'Expected values are computed from a visible fixture.',
        'Customers with zero paid orders remain present.',
        'Explanation distinguishes COUNT(*), COUNT(id), and null SUM behavior.',
      ],
    ),
  ],
  mid: [
    exercise(
      'm-f-index',
      'Design a tenant activity feed',
      'Design a tenant-scoped activity-feed query over ten million events. Results are newest first with 50 rows per page; timestamps can tie. Deliver an index candidate, first/next-page SQL, a cursor format, and a measurement plan comparing a large tenant with a small tenant.',
      'Prefix the index with tenant equality, then order by timestamp and a unique ID. The next-page tuple predicate must match descending ordering and the cursor must preserve both values. Compare representative execution plans and latency without assuming one plan wins for every tenant.',
      [
        'Pagination has a unique tie-breaker and strict cursor boundary.',
        'Index order follows the filtering and ordering contract.',
        'Validation includes realistic tenant skew and write-cost discussion.',
      ],
    ),
    exercise(
      'm-f-security',
      'Review a webhook preview service',
      'Design a service that fetches a customer-supplied URL to display a webhook preview. Deliver a trust-boundary diagram, URL and redirect policy, network limits, response-size rules, and tests for internal IPs, redirects, and a slow origin. Explain which requests are rejected before a connection is made.',
      'Authorize the caller and constrain actual network destinations, including resolved addresses and redirects. Bound connection time, total time, response bytes, and concurrency. Keep fetched content untrusted when displaying it, and avoid forwarding service credentials.',
      [
        'Destination policy covers resolution and redirects.',
        'Time, byte, and concurrency budgets are explicit.',
        'Tests distinguish server-side request forgery from unsafe rendered content.',
      ],
    ),
    exercise(
      'm-f-migration',
      'Plan a compatible phone migration',
      'Replace a free-form phone column with a normalized representation while old and new workers overlap. Deliver ordered migration/deployment phases, validation queries, a backfill checkpoint design, and rollback conditions. Include how legacy writers are handled before switching reads.',
      'Expand the schema first, introduce compatible write paths, and backfill in bounded resumable batches. Reconcile concurrent changes and verify completeness and normalization before switching readers. Delay removal of the old shape until all writers and rollback requirements are accounted for.',
      [
        'Every phase states compatible reader and writer versions.',
        'Backfill is bounded, resumable, and reconciles concurrent updates.',
        'Rollback addresses stored data compatibility as well as binaries.',
      ],
    ),
  ],
  senior: [
    exercise(
      's-f-consistency',
      'Define a revocation guarantee',
      'A multi-region service promises that permission revocation takes effect globally within five seconds. Regional caches and replicas may lag, and invalidation messages may be lost. Deliver a consistency design, a timeline showing an isolated region, explicit failure behavior, and tests that measure the maximum stale authorization window.',
      'Define the authority for permission state, the freshness proof accepted by each region, and the action when that proof expires. Bounded cache lifetime or synchronized validation must uphold the five-second promise despite lost invalidations; discuss the availability cost under partition.',
      [
        'The guarantee is expressed against completed revocation and request times.',
        'Lost invalidation and partition cases have enforceable stale-state bounds.',
        'Tests verify forbidden access after the deadline, not just message delivery.',
      ],
    ),
    exercise(
      's-f-ledger',
      'Design an auditable credit ledger',
      'Design storage for credit grants, debits, reversals, and replayed external events. A customer balance must never become negative. Deliver schema constraints, the posting transaction, duplicate-event behavior, an audit query, and reasoning about concurrent debits and reversal failures.',
      'Use immutable entries and durable event identity; synchronize balance checks and updates at the shared database boundary. Post reversals as new linked entries and keep deduplication atomic with effects. State how derived balances are reconciled with the entry history and how contested debits are serialized.',
      [
        'Schema preserves historical entries and links corrections.',
        'Concurrent debits cannot jointly violate the balance invariant.',
        'Duplicate and partial-failure tests assert both ledger and balance state.',
      ],
    ),
    exercise(
      's-f-recovery',
      'Prove a recovery objective',
      'A database-backed service requires RPO five minutes and RTO twenty minutes. Design a recovery drill including backups, point-in-time restoration, queue replay, credentials, routing, and validation. Deliver a timed runbook, a data-loss measurement, and go/no-go criteria for reopening writes.',
      'Measure the recovery point from restored committed data and the recovery duration through usable service, including dependencies. Validate integrity, replay boundaries, and duplicate handling before reopening writes. Record observed timings and remaining gaps rather than treating backup-job success as recovery evidence.',
      [
        'RPO and RTO measurements use distinct observable timestamps.',
        'Runbook covers dependency access and replay, not only database restore.',
        'Reopening criteria include invariant checks and ownership of recovery decisions.',
      ],
    ),
  ],
};

const practicalExercises: Record<Tier, Exercise[]> = {
  junior: [
    exercise(
      'j-p-route',
      'Repair a private-note update',
      'Implement or write executable pseudocode for PATCH /notes/:id. The current route trusts body.ownerId, trims titles after checking length, and leaks database messages. Deliver the corrected handler and tests for whitespace, oversized titles, another owner, an unknown ID, and a persistence failure.',
      'Parse and normalize the allowed field before validating it. Bind the title and note ID while deriving owner identity from the session, and scope the UPDATE to both ID and owner. Handle zero rows consistently with the chosen disclosure policy and return safe errors with correlation IDs.',
      [
        'Validation checks normalized data and rejects unauthorized fields.',
        'The mutation itself includes trusted ownership scope.',
        'Tests inspect persisted title and safe response contents on failure.',
      ],
    ),
    exercise(
      'j-p-debug',
      'Diagnose a connection leak',
      'A pool has ten connections. After ten invalid import requests, every later request waits for a connection. Each import acquires a connection, parses data, runs SQL, and releases only on success. Deliver a repaired control flow, a deterministic regression test, and metrics that distinguish pool wait from query execution.',
      'Return the connection in a finally block and roll back any opened transaction before release. Trigger failures after acquisition and verify a later valid request completes without expanding the pool. Measure acquisition duration separately from query duration and active transaction count.',
      [
        'The connection is released on parse and query failures.',
        'The regression exercises more failures than the pool capacity.',
        'The diagnosis uses acquisition and execution measurements separately.',
      ],
    ),
    exercise(
      'j-p-import',
      'Build a bounded CSV import',
      'Design an import for product code, name, and integer stock. Reject duplicate codes, missing names, and negative quantities. The contract is all-or-nothing for a file with at most 100 rows. Deliver validation logic, a persistence transaction, sample input, and expected responses for valid and invalid files.',
      'Validate the bounded file structure and fields, detect within-file duplicates, and retain database uniqueness for races with other imports. Execute the accepted batch atomically and report safe row-level validation errors. A constraint failure must leave no partial products from the file.',
      [
        'Limits and row errors are specified with concrete sample input.',
        'Database constraints protect cross-request races.',
        'Failure tests confirm there are no partially imported rows.',
      ],
    ),
  ],
  mid: [
    exercise(
      'm-p-worker',
      'Implement a retry-safe reward worker',
      'A queue delivers reward events at least once. Implement a worker that adds points to an account and records event completion in the same PostgreSQL database. Deliver schema, transaction pseudocode, acknowledgement order, and tests for duplicate delivery, concurrent duplicate workers, and a crash after commit before acknowledgement.',
      'Use a unique event identity and apply the point increment in the same transaction as the receipt. Acknowledge after durable commit; a redelivery should discover the receipt and avoid another increment. Validate event identity and account scope before applying the effect.',
      [
        'Concurrent duplicate delivery produces one increment.',
        'Receipt and effect cannot commit independently.',
        'Crash tests cover both sides of commit and acknowledgement.',
      ],
    ),
    exercise(
      'm-p-performance',
      'Remove a measured query bottleneck',
      'A team dashboard fetches 80 teams and then issues one member-count query per team. Database round trips average 6 ms while query execution averages 1 ms. Deliver a batch query, an empty-team fixture, a before/after measurement plan, and a discussion of pagination and response-size limits.',
      'Batch counts for the selected team IDs or join a preaggregation while retaining teams with zero members. Verify counts on fixtures with multiple members, empty teams, and out-of-page teams. Measure total round trips and endpoint latency on comparable datasets and inspect the resulting query plan.',
      [
        'One result per selected team includes correct zero counts.',
        'The optimization removes per-team round trips.',
        'Measurements cover realistic cardinality and bounded page size.',
      ],
    ),
    exercise(
      'm-p-cache',
      'Fix tenant cache contamination',
      'A document API authorizes the user, then reads a cache keyed only by document ID. IDs are unique within a tenant. Deliver a corrected key strategy, invalidation behavior for edits and deletions, and a test that alternates two tenants using the same document ID without flushing the cache.',
      'Include tenant identity in the representation key and preserve authorization before returning data. Scope edit/delete invalidation to the same identity and define the permitted stale-data window. The regression must populate one tenant’s entry and prove another tenant receives its own document.',
      [
        'Keys and invalidation use the same tenant/document identity.',
        'Authorization remains enforced on cache hits.',
        'The cross-tenant test uses an already-populated shared cache.',
      ],
    ),
  ],
  senior: [
    exercise(
      's-p-fence',
      'Make lease recovery safe',
      'Two workers write to a shared object store under a renewable lease. Worker A pauses, loses its lease, and resumes after worker B writes. Deliver a fencing protocol, state transitions, storage-side acceptance rule, and a deterministic interleaving test. Explain what happens if the object store cannot condition writes on a generation.',
      'Issue monotonic generations and have the write authority reject stale generations atomically with the write. A process-side lease check cannot close the pause between checking and writing. If storage lacks the required primitive, route writes through a fenced authority or change the guarantee; document the limitation.',
      [
        'The stale write is rejected at the actual write boundary.',
        'The test pauses A across expiry and B’s accepted write.',
        'The design addresses unavailable conditional-write primitives explicitly.',
      ],
    ),
    exercise(
      's-p-rollout',
      'Repair a live data migration',
      'A replacement address column was backfilled and read traffic switched. A forgotten legacy worker still changes the old column, creating divergence. Deliver containment steps, a repair query or job, a safe convergence protocol, and proof required before dropping the old column. Include records edited during the repair.',
      'Identify and stop or adapt incompatible writers, choose the authoritative representation for conflicting records, and reconcile with version-aware writes or a change stream. Repeated scans alone need a completion argument under ongoing mutation. Validate convergence and preserve a compatible rollback path before removal.',
      [
        'Containment prevents further silent divergence.',
        'Repair cannot overwrite a newer concurrent edit unnoticed.',
        'Removal requires verified writer coverage and convergence evidence.',
      ],
    ),
    exercise(
      's-p-incident',
      'Investigate autoscaling overload',
      'During an incident, instances scale from 10 to 40, each with a 20-connection pool; the database cap is 300. Query execution stays fast but pool waits and retry traffic rise. Deliver a causal timeline, immediate mitigation, a connection and retry budget, and a load test with a slow dependency and instance scale-out.',
      'Aggregate connection demand grows from 200 to 800 before accounting for administration and other services. Bound admission, pool totals, and retry amplification while preserving deadlines; avoid assuming added instances add database capacity. Verify user-visible latency and error-budget recovery under representative pressure.',
      [
        'Analysis distinguishes query execution from resource queueing.',
        'Budgets account for all instances and retry layers.',
        'The load test validates recovery and user-facing success under scale-out.',
      ],
    ),
  ],
};

function positionAnswers(items: Item[]): Item[] {
  const hash = (id: string) =>
    [...id].reduce(
      (value, character) => Math.imul(value ^ character.charCodeAt(0), 16777619) >>> 0,
      2166136261,
    );
  const ranked = [...items].sort((a, b) => hash(a.id) - hash(b.id));
  const positions = new Map(ranked.map((entry, index) => [entry.id, index % 4]));
  return items.map((entry) => {
    const position = positions.get(entry.id)!;
    const order = [1, 2, 3];
    order.splice(position, 0, 0);
    return {
      ...entry,
      options: order.map((i) => entry.options[i]) as Item['options'],
      reasons: order.map((i) => entry.reasons[i]) as Item['reasons'],
      answer: position,
    };
  });
}

export function backendBank(tier: Tier): RoleBank {
  const fundamentals = {
    junior: juniorFundamentals,
    mid: midFundamentals,
    senior: seniorFundamentals,
  };
  const practical = { junior: juniorPractical, mid: midPractical, senior: seniorPractical };
  return {
    fundamentals: bank(positionAnswers([...sharedFundamentals, ...fundamentals[tier]])),
    practical: bank(positionAnswers([...sharedPractical, ...practical[tier]])),
    fundamentalsExercises: fundamentalsExercises[tier],
    practicalExercises: practicalExercises[tier],
  };
}
