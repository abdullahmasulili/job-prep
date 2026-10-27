import { bank, type Item, type RoleBank } from '../bank';
import type { Exercise, Tier } from '../types';

const coreFundamentals: Item[] = [
  {
    id: 'fs-f-contract-shape',
    topic: 'Contracts',
    prompt:
      'The API changes a list response from an array to an envelope. What must change in the browser?',
    code: 'Before: [{"id":"p1"}]\nAfter: {"items":[{"id":"p1"}],"next":null}\nrenderRows(await response.json());',
    options: [
      'Read and validate the items field before rendering.',
      'Keep the array reader and add a longer request timeout.',
      'Change the request method from GET to POST.',
      'Wrap the received envelope in an additional array.',
    ],
    answer: 0,
    reasons: [
      'The collection moved inside an object, so the reader must follow that contract.',
      'Timeouts cannot repair a successfully delivered but incompatible JSON shape.',
      'HTTP method selection does not convert an envelope back into an array.',
      'An array containing an envelope still lacks the row fields the renderer expects.',
    ],
  },
  {
    id: 'fs-f-owner',
    topic: 'Identity and security',
    prompt:
      'A note-create endpoint receives the payload below. Which source should establish the owner?',
    code: 'session.userId = "alice"\nbody = { title: "Budget", ownerId: "bob" }',
    options: [
      'The submitted ownerId after checking it is a string.',
      'The verified session identity and applicable permissions.',
      'The ownerId stored by the browser at the previous login.',
      'The user referenced by the most recent note in the database.',
    ],
    answer: 1,
    reasons: [
      'Shape validation does not make a client-selected identity trustworthy.',
      'A server-verified identity establishes the actor; delegation requires an explicit permission check.',
      'Browser storage is editable and can retain a previous account identity.',
      'A neighboring record has no authority to determine who owns this request.',
    ],
  },
  {
    id: 'fs-f-runtime',
    topic: 'Contracts',
    prompt: 'Why can this typed reader still fail for a successful HTTP response?',
    code: 'type Profile = { name: string };\nconst p = (await response.json()) as Profile;\nshow(p.name.toUpperCase());',
    options: [
      'JSON parsing converts numeric names to uppercase text.',
      'The type assertion executes only for failed HTTP statuses.',
      'The assertion does not validate the received JSON.',
      'The profile type requires the server to use the same compiler.',
    ],
    answer: 2,
    reasons: [
      'JSON parsing preserves a number as a number; it does not apply this domain conversion.',
      'The assertion has no runtime validation behavior for either success or failure.',
      'Missing or non-string name values remain possible and need boundary validation.',
      'A shared compiler is not required; a matching runtime contract is required.',
    ],
  },
  {
    id: 'fs-f-http-result',
    topic: 'Contracts',
    prompt:
      'The server sends the response shown. Which statement about the browser fetch promise is correct?',
    code: 'HTTP/1.1 422 Unprocessable Content\nContent-Type: application/json\n\n{"errors":{"email":"Invalid format"}}',
    options: [
      'It rejects because JSON includes a field called errors.',
      'It remains pending until the user fixes the email.',
      'It resolves only if the body includes a successful field.',
      'It can resolve; the application must inspect the status.',
    ],
    answer: 3,
    reasons: [
      'Fetch does not interpret application field names as promise control signals.',
      'Receiving the HTTP response completes that network exchange regardless of later edits.',
      'Fetch does not require a particular success property in a JSON response.',
      'HTTP error statuses ordinarily fulfill fetch; response.ok or status drives application handling.',
    ],
  },
  {
    id: 'fs-f-cancel',
    topic: 'Async and consistency',
    prompt:
      'A user cancels a browser request after the server begins a database write. What can the UI infer from cancellation?',
    options: [
      'The client stopped waiting; the write outcome needs checking.',
      'The database rolled back when the browser closed its connection.',
      'The write completed because cancellation followed request dispatch.',
      'The server queued a replacement request using the original body.',
    ],
    answer: 0,
    reasons: [
      'Cancellation of client work is not proof about server-side commit status.',
      'Rollback depends on server transaction handling, not simply the browser cancellation.',
      'Dispatch is not confirmation that validation or persistence succeeded.',
      'No replacement request follows from cancellation without an explicit retry mechanism.',
    ],
  },
  {
    id: 'fs-f-private-cache',
    topic: 'Identity and security',
    prompt:
      'Two accounts use the same browser tab sequentially. A private query cache uses ["invoices"] as its key. What boundary is missing?',
    options: [
      'The API route and the current list filter parameters.',
      'The authenticated identity or a cleared session-specific cache.',
      'The response ETag without changing the session cache scope.',
      'The access token expiry timestamp shared by both sessions.',
    ],
    answer: 1,
    reasons: [
      'Route and filters can match across accounts; they do not establish private ownership.',
      'Identity scoping and session cleanup prevent reuse of another account’s cached records.',
      'An ETag is a representation validator, not an authenticated identity boundary.',
      'Expiry times can coincide and are not a substitute for the current principal.',
    ],
  },
  {
    id: 'fs-f-uncertain',
    topic: 'Async and consistency',
    prompt:
      'A create request times out after dispatch. No result is available yet. Which UI state accurately describes the outcome?',
    options: [
      'Failed, with the form cleared to prepare another request.',
      'Saved, because the request body left the browser.',
      'Unconfirmed, with recovery using the same operation identity.',
      'Rejected, with validation errors copied from the last submission.',
    ],
    answer: 2,
    reasons: [
      'A timeout does not prove failure, and clearing input removes recovery context.',
      'Dispatch proves neither server validation nor a durable successful write.',
      'Uncertainty is explicit while a status lookup or safe retry resolves the existing operation.',
      'Earlier validation errors provide no evidence about this request’s outcome.',
    ],
  },
  {
    id: 'fs-f-authorization',
    topic: 'Identity and security',
    prompt:
      'A project screen hides Delete for viewers. A viewer sends DELETE directly. Where should enforcement occur?',
    options: [
      'In the component that decides whether to display Delete.',
      'In the browser router before navigation to the project.',
      'In the list query that originally loaded visible projects.',
      'In the server mutation using current resource permissions.',
    ],
    answer: 3,
    reasons: [
      'A hidden control improves UX but can be bypassed by a direct request.',
      'Client routing is not a trust boundary for an API mutation.',
      'An earlier list read does not authorize a later action or account for permission changes.',
      'The mutation must establish the actor’s right to delete this particular resource.',
    ],
  },
  {
    id: 'fs-f-version-window',
    topic: 'Delivery',
    prompt:
      'An API deployment finishes while a customer keeps yesterday’s browser bundle open. What contract condition should deployment tests cover?',
    options: [
      'Old browser code calling the newly deployed API.',
      'New source files compiling against their own generated types.',
      'A clean browser loading assets after the entire rollout ends.',
      'The newest server handling requests from its own health check.',
    ],
    answer: 0,
    reasons: [
      'Open tabs create an overlap period with old clients and new servers.',
      'Compilation can pass while an already deployed client uses an incompatible contract.',
      'A fresh browser misses compatibility failures in long-lived sessions.',
      'A server health check rarely exercises the older browser request format.',
    ],
  },
  {
    id: 'fs-f-observe',
    topic: 'Debugging and tests',
    prompt:
      'Support has a failed save time but several servers handled requests then. What added data best links browser and server evidence?',
    options: [
      'The full form payload copied into every service log.',
      'An opaque request or operation identifier across the flow.',
      'A screenshot of the frontend build output for that release.',
      'The session cookie embedded in the displayed error message.',
    ],
    answer: 1,
    reasons: [
      'Raw payload replication increases exposure and still may not identify one attempt cleanly.',
      'A shared identifier connects relevant events without requiring private payload contents.',
      'Build output identifies a release, not the specific request and its outcome.',
      'Session cookies are credentials and are unsafe correlation identifiers.',
    ],
  },
  {
    id: 'fs-f-e2e',
    topic: 'Debugging and tests',
    prompt:
      'Which test provides direct evidence that a submitted address survives a real persistence round trip?',
    options: [
      'Verify the submit handler calls the browser request adapter.',
      'Snapshot the success banner immediately after a mocked response.',
      'Submit, start a fresh read, and verify the saved address.',
      'Check the form reducer stores each field before submission.',
    ],
    answer: 2,
    reasons: [
      'Calling an adapter does not demonstrate that the server stored the address.',
      'A mocked response can show success even when persistence is broken.',
      'A subsequent independent read checks the save-to-storage-to-render path.',
      'Draft state correctness does not establish durable persistence.',
    ],
  },
  {
    id: 'fs-f-latency',
    topic: 'Performance',
    prompt:
      'A product page waits for /product, then starts an unrelated /announcements request. Both are required before rendering. Which change addresses the avoidable delay?',
    code: 'product: 300 ms\nannouncements: 250 ms\nNo input dependency between requests',
    options: [
      'Raise the timeout from one second to three seconds.',
      'Compress the HTML after both responses have arrived.',
      'Cache the rendered loading indicator for subsequent visits.',
      'Start the two independent reads concurrently.',
    ],
    answer: 3,
    reasons: [
      'A larger timeout changes failure tolerance rather than successful response latency.',
      'Compression may help transfer size but leaves the sequential request wait intact.',
      'Caching a spinner does not make either data dependency available earlier.',
      'Concurrent independent reads avoid adding their waiting times sequentially.',
    ],
  },
];

const corePractical: Item[] = [
  {
    id: 'fs-p-stale-search',
    topic: 'Async and consistency',
    prompt: 'Typing "ca" and then "cat" produces the log below. What should guard the UI update?',
    code: 'request 41: q=ca, started 0ms, completed 300ms\nrequest 42: q=cat, started 30ms, completed 140ms\nonResponse = rows => setRows(rows)',
    options: [
      'Accept results only for the current query generation.',
      'Sort all received rows by their title before rendering.',
      'Render whichever request has the greatest elapsed duration.',
      'Delay each response by another 200 milliseconds.',
    ],
    answer: 0,
    reasons: [
      'A generation guard prevents the older query response overwriting the current result.',
      'Sorting cannot establish which search term produced the rows.',
      'The slower request here is the stale one, so duration is not a freshness signal.',
      'A fixed delay preserves the race instead of establishing request relevance.',
    ],
  },
  {
    id: 'fs-p-cookie-cors',
    topic: 'Identity and security',
    prompt:
      'A same-site UI at app.example.com calls api.example.com. Cookie policy permits the cookie, but the response is blocked. What server change addresses this configuration?',
    code: 'fetch(url, { credentials: "include" })\nAccess-Control-Allow-Origin: *\nAccess-Control-Allow-Credentials: true',
    options: [
      'Send the session cookie back in a JSON response property.',
      'Allow the trusted UI origin explicitly.',
      'Keep the headers and add an ETag for the current session.',
      'Change the JSON body to text while preserving the headers.',
    ],
    answer: 1,
    reasons: [
      'Exposing a session credential in JSON does not correct credentialed CORS.',
      'Credentialed CORS requires an explicit allowed origin; dynamic allowlists also need proper Vary handling.',
      'ETag validation does not change the credentialed CORS origin requirement.',
      'Response media type does not make wildcard credentialed CORS valid.',
    ],
  },
  {
    id: 'fs-p-runtime-array',
    topic: 'Contracts',
    prompt:
      'The dashboard receives a 200 response but crashes. Which boundary check prevents this particular failure?',
    code: 'payload = { "items": null }\nconst titles = payload.items.map(x => x.title);',
    options: [
      'Confirm that response.status is exactly 200.',
      'Require the Content-Length header to be nonzero.',
      'Validate items and its element shapes.',
      'Retry parsing the same body with a larger JSON buffer.',
    ],
    answer: 2,
    reasons: [
      'The example already has a successful HTTP status but violates the data contract.',
      'A nonempty body can still contain null or malformed domain data.',
      'The renderer requires an array of suitable elements, which must be established before use.',
      'Buffer size cannot change the meaning of a valid JSON null value.',
    ],
  },
  {
    id: 'fs-p-total',
    topic: 'Identity and security',
    prompt: 'Checkout receives the payload below. What is the appropriate charge input?',
    code: '{"sku":"book","quantity":2,"displayedTotal":1}\nTrusted catalog: book = 1800 cents',
    options: [
      'The submitted total after converting it to integer cents.',
      'The cached total in local storage from the product screen.',
      'The displayed total if the submit control was disabled first.',
      'A total calculated from trusted pricing.',
    ],
    answer: 3,
    reasons: [
      'Integer conversion validates representation, not pricing authority.',
      'Local storage is under client control and may also be stale.',
      'Disabling a control does not prevent a modified request body.',
      'The server must apply authoritative pricing and validate the requested quantity.',
    ],
  },
  {
    id: 'fs-p-logout-inflight',
    topic: 'Identity and security',
    prompt:
      'After logout the app clears its cache. A previous private request then completes and repopulates the screen. Which additional protection addresses the race?',
    code: 't0 GET /account as Alice\nt1 logout; cache.clear()\nt2 login as Bob\nt3 Alice response arrives',
    options: [
      'Discard replies from the previous session.',
      'Clear the cache once more when Bob opens a different route.',
      'Keep the response but replace the account heading with Bob.',
      'Retry the old request without any session credentials.',
    ],
    answer: 0,
    reasons: [
      'The response belongs to a prior session and must not enter the current session state.',
      'Waiting for navigation still exposes private data in the meantime.',
      'Changing a heading cannot make Alice’s data authorized for Bob.',
      'An unauthenticated retry does not prevent the original response being displayed.',
    ],
  },
  {
    id: 'fs-p-duplicate',
    topic: 'Async and consistency',
    prompt:
      'A server created receipt r7, but the response was lost. The client is retrying the same purchase. Which request identity supports duplicate prevention?',
    code: 'first request: operationKey = "checkout-47"\nserver: committed receipt r7\nclient: network timeout',
    options: [
      'A new random key generated for the second HTTP attempt.',
      'The original checkout-47 key and payload.',
      'A shared key used for every purchase by this customer.',
      'The current timestamp rounded to the nearest minute.',
    ],
    answer: 1,
    reasons: [
      'A new key can be interpreted as a new logical purchase.',
      'A durable server-side idempotency record can return the existing outcome for this operation.',
      'A customer-wide key would incorrectly collapse distinct purchases together.',
      'Time buckets can collide for separate purchases and differ for delayed retries.',
    ],
  },
  {
    id: 'fs-p-validation-error',
    topic: 'Contracts',
    prompt:
      'A save returns the structured response below. Which UI response best supports correction?',
    code: '422 {"code":"VALIDATION","fields":{"postcode":"Use five digits"}}',
    options: [
      'Replace all form values with the previous saved record.',
      'Retry with an empty postcode so the request is smaller.',
      'Preserve the draft and associate the error with postcode.',
      'Treat the body as the newly saved profile and navigate away.',
    ],
    answer: 2,
    reasons: [
      'Replacing values destroys unrelated user edits that may be valid.',
      'An empty value does not address the stated format requirement.',
      'Keeping the draft and locating the field error enables a focused correction.',
      'A validation response is not confirmation that a profile was saved.',
    ],
  },
  {
    id: 'fs-p-stale-write',
    topic: 'Async and consistency',
    prompt:
      'Two tabs edit document version 8. Tab A saves version 9. How should B submit its older draft to detect a conflict?',
    code: 'A read version=8; B read version=8\nA PATCH succeeds -> version=9\nB PATCH contains edits based on version=8',
    options: [
      'Send its edit timestamp and accept whichever clock is later.',
      'Read the current version, then write without a condition.',
      'Use a different HTTP connection for the older draft.',
      'Send version 8 as an atomic update precondition.',
    ],
    answer: 3,
    reasons: [
      'Client clocks do not establish whether the edit incorporated version 9.',
      'A separate read followed by an unconditional write leaves another race window.',
      'Connection identity does not enforce document concurrency rules.',
      'A conditional write can reject the stale base instead of silently losing A’s changes.',
    ],
  },
  {
    id: 'fs-p-private-http-cache',
    topic: 'Identity and security',
    prompt:
      'A shared CDN caches this personalized response by URL. Which immediate response policy prevents new storage of this content by compliant HTTP caches?',
    code: 'GET /account\nCache-Control: public, max-age=600\n{"email":"alice@example.test"}',
    options: [
      'Use no-store and purge shared entries.',
      'Keep public caching but shorten max-age to thirty seconds.',
      'Add a random identifier to the JSON body on each response.',
      'Add a user-specific page title after the browser loads.',
    ],
    answer: 0,
    reasons: [
      'No-store prevents new storage; existing incorrectly shared entries also need removal.',
      'A shorter shared-cache lifetime still permits cross-account exposure.',
      'A body field does not partition a CDN key that uses only the URL.',
      'Client presentation changes cannot undo the shared response exposure.',
    ],
  },
  {
    id: 'fs-p-waterfall',
    topic: 'Performance',
    prompt:
      'A team list loads 40 members and then fetches each avatar URL sequentially. What change removes the observed network round-trip amplification?',
    code: 'GET /members -> 40 IDs\nfor (const id of ids) {\n  avatars.push(await getAvatar(id));\n}',
    options: [
      'Increase the member endpoint timeout to fit all avatar calls.',
      'Return required avatar metadata in a bounded list response.',
      'Move the same sequential loop into the click handler.',
      'Reduce the spinner animation frequency during the loop.',
    ],
    answer: 1,
    reasons: [
      'Waiting longer does not remove the repeated network overhead.',
      'A bounded response shaped for the view avoids one dependent request per member.',
      'Changing the event that starts the loop leaves the request pattern unchanged.',
      'Spinner work is not the dominant cost demonstrated by the request sequence.',
    ],
  },
  {
    id: 'fs-p-error-trace',
    topic: 'Debugging and tests',
    prompt:
      'A user sees "Save failed". The logs show the same request ID. Which layer should be investigated first?',
    code: 'browser requestId=q9 status=502\nedge q9 upstream_reset\napi q9 db_commit order=17 success\napi q9 response_write connection_closed',
    options: [
      'Form validation rejected the order before persistence.',
      'The database rolled back the transaction after the response.',
      'The response path failed after the order was committed.',
      'The browser never sent an HTTP request to the edge.',
    ],
    answer: 2,
    reasons: [
      'The successful commit contradicts a pre-persistence validation rejection.',
      'The log reports a commit; a failed response does not reverse it.',
      'The order exists according to the API, while the response transport failed afterward.',
      'The correlated edge and API entries demonstrate that the request reached them.',
    ],
  },
  {
    id: 'fs-p-isolation-test',
    topic: 'Debugging and tests',
    prompt:
      'Which integration test most directly exercises private cache isolation in a shared browser?',
    options: [
      'Render Alice’s dashboard twice and compare the screenshots.',
      'Check that logout sends one request to the session endpoint.',
      'Verify that the login page has a password input label.',
      'Load Alice’s data, switch to Bob, and inspect all private views.',
    ],
    answer: 3,
    reasons: [
      'Repeated use of one account cannot reveal cross-account data reuse.',
      'A logout call alone does not prove cached data or pending work was cleared.',
      'A label check is valuable but unrelated to private cache isolation.',
      'Switching identities in one browser tests cache reuse across the relevant boundary.',
    ],
  },
];

const juniorFundamentals: Item[] = [
  {
    id: 'fs-j-f-form-encoding',
    topic: 'Contracts',
    prompt: 'A server JSON parser rejects this form request. Which mismatch should be fixed?',
    code: 'Content-Type: application/json\n\ntitle=First+task&done=false',
    options: [
      'Encode a JSON body that matches the declared media type.',
      'Rename title to taskTitle while keeping the encoded body.',
      'Send the same body using a longer request timeout.',
      'Add an Accept header requesting a JSON response document.',
    ],
    answer: 0,
    reasons: [
      'The body is form-encoded while the header declares JSON.',
      'Field naming cannot repair a syntax mismatch at the body parser.',
      'A parser error is not caused by insufficient request waiting time.',
      'Accept describes the desired response, not the request body format.',
    ],
  },
  {
    id: 'fs-j-f-empty-result',
    topic: 'Contracts',
    prompt: 'A task list receives 200 with {items: []}. What should the screen communicate?',
    options: [
      'The request failed and the previous rows were restored.',
      'The list is empty, with a way to create the first task.',
      'The request is still pending until at least one task exists.',
      'The server denied access and requires another login.',
    ],
    answer: 1,
    reasons: [
      'An empty successful response is not evidence of a request failure.',
      'This distinguishes a successful empty collection from an error or pending state.',
      'The server completed the read even though the collection has no rows.',
      'The given status and body do not indicate an authentication failure.',
    ],
  },
  {
    id: 'fs-j-f-secret',
    topic: 'Identity and security',
    prompt:
      'A browser needs weather data from a provider requiring a private API key. Which boundary keeps the key private?',
    options: [
      'Fetch directly after storing the key in a hidden form control.',
      'Load the key from a public configuration endpoint on demand.',
      'Use an authenticated server endpoint that calls the provider.',
      'Place the key in a minified module loaded only on the weather page.',
    ],
    answer: 2,
    reasons: [
      'Hidden controls remain readable to the browser user.',
      'A public endpoint still delivers the secret to untrusted clients.',
      'The server can hold the credential and enforce policy without sending it to the browser.',
      'Minification and lazy loading do not prevent inspection of delivered code.',
    ],
  },
  {
    id: 'fs-j-f-null',
    topic: 'Contracts',
    prompt:
      'A profile allows users to omit a biography. Which contract makes that absence predictable for the UI?',
    code: 'Example response: {"name":"Ari","bio":null}',
    options: [
      'Document bio as a string and rely on callers to guess null.',
      'Return an HTTP failure whenever a biography was omitted.',
      'Send the literal text "null" as a substitute biography.',
      'Specify bio as string or null and render the empty case.',
    ],
    answer: 3,
    reasons: [
      'A declared string contract would be inconsistent with the shown response.',
      'An optional biography is normal domain data, not necessarily a request failure.',
      'The word null is data, not a structural absence value.',
      'An explicit nullable contract lets the renderer handle absence intentionally.',
    ],
  },
  {
    id: 'fs-j-f-pending',
    topic: 'Async and consistency',
    prompt:
      'Submitting a support form takes two seconds. Which browser behavior best prevents accidental repeated clicks while retaining the draft?',
    options: [
      'Mark the request pending and disable its submit control.',
      'Clear every input as soon as the first click is received.',
      'Navigate to the success screen before receiving a result.',
      'Create a separate background submission for each click.',
    ],
    answer: 0,
    reasons: [
      'A pending state explains the delay and blocks repeated local submissions.',
      'Clearing early loses user work if the request is rejected.',
      'A speculative success screen misrepresents an unconfirmed submission.',
      'Separate submissions increase the chance of duplicate support tickets.',
    ],
  },
  {
    id: 'fs-j-f-statuses',
    topic: 'Identity and security',
    prompt:
      'An authenticated viewer attempts an editor-only action. Under this API’s documented 401/403 policy, what does a 403 indicate?',
    options: [
      'The request body cannot be decoded as JSON.',
      'The identified user lacks permission for this action.',
      'The server is asking the browser to use its cached response.',
      'The client must resend the request to the Location URL.',
    ],
    answer: 1,
    reasons: [
      'Body syntax failure is a separate contract error, commonly represented by 400.',
      'The user is known but is not authorized under the stated policy.',
      'Cache validation uses a different response status and flow.',
      'Redirection is not the meaning of a permission-denied response.',
    ],
  },
  {
    id: 'fs-j-f-bound-query',
    topic: 'Identity and security',
    prompt:
      'A surname search includes an apostrophe. Which server pattern handles the value safely?',
    code: 'surname = "O\'Neil"\nquery text currently concatenates surname into SQL',
    options: [
      'Delete punctuation from the surname before every search.',
      'Encode the surname as a URL and concatenate that into SQL.',
      'Bind the surname as a parameter to a fixed query.',
      'Move the same SQL string construction into the browser.',
    ],
    answer: 2,
    reasons: [
      'Removing punctuation changes legitimate data and is not a robust query boundary.',
      'URL encoding is not SQL parameter binding.',
      'Binding keeps the supplied value separate from SQL structure.',
      'Relocating unsafe construction does not make the database operation safe.',
    ],
  },
  {
    id: 'fs-j-f-deploy-config',
    topic: 'Delivery',
    prompt:
      'A frontend built for production still calls http://localhost:4000. What evidence most directly identifies the configuration problem?',
    options: [
      'The production database contains the expected seed records.',
      'The stylesheet request succeeds with a cached response.',
      'The login screen has the same heading as development.',
      'The browser Network panel shows the compiled request URL.',
    ],
    answer: 3,
    reasons: [
      'Database contents do not reveal which host the browser actually contacts.',
      'A stylesheet can load successfully while API URLs are incorrect.',
      'Matching text is unrelated to the request destination.',
      'The actual destination reveals that a development URL reached the deployed client.',
    ],
  },
  {
    id: 'fs-j-f-refresh',
    topic: 'Async and consistency',
    prompt:
      'A saved task appears immediately but vanishes after a page reload. What does that observation suggest checking first?',
    options: [
      'Whether the UI updated local state without a durable save.',
      'Whether the UI used a temporary ID that retrieval does not recognize.',
      'Whether the success response should be cached for a longer period.',
      'Whether the draft should be copied into the URL before reloading.',
    ],
    answer: 0,
    reasons: [
      'A local-only update can look saved until state is rebuilt from persistent data.',
      'Temporary ID reconciliation can affect an item, but first establish whether a durable record exists at all.',
      'Caching the success response longer does not establish that the record was persisted.',
      'Putting a draft in the URL preserves a client value without proving a server save.',
    ],
  },
  {
    id: 'fs-j-f-measure',
    topic: 'Performance',
    prompt:
      'The browser shows a 1.8-second request wait and 20 ms rendering time. What is the most useful next measurement?',
    options: [
      'Profile client rendering again with the same cached response.',
      'Trace server and database time for that same request.',
      'Increase the fetch timeout and measure how often it expires.',
      'Compare JSON property order across slow and fast responses.',
    ],
    answer: 1,
    reasons: [
      'Render profiling can help later, but the measured wait points first to the request path.',
      'Server-side timing helps locate the dominant portion of the measured latency.',
      'Timeout changes do not locate why successful requests take 1.8 seconds.',
      'Property order is not evidence about the server-side wait dominating this trace.',
    ],
  },
  {
    id: 'fs-j-f-test-layer',
    topic: 'Debugging and tests',
    prompt:
      'A unit test verifies a price-formatting function. Which additional test checks the browser/server agreement on price units?',
    options: [
      'Test the formatter with several locally constructed decimal values.',
      'Mock the API with values copied from the formatter test cases.',
      'Fetch a known cents value and assert its displayed currency.',
      'Verify the API price property is a number before rendering.',
    ],
    answer: 2,
    reasons: [
      'Locally chosen decimals may agree with the formatter while the API uses different units.',
      'A mock derived from the same assumption can preserve a mistaken unit contract.',
      'A known API value rendered as currency exposes disagreement about units.',
      'Both cents and whole currency units can be numbers, so a type check alone misses unit disagreement.',
    ],
  },
  {
    id: 'fs-j-f-relative-path',
    topic: 'Contracts',
    prompt:
      'The UI and API share https://shop.example.test. What is the advantage of fetch("/api/cart") over a development host hardcoded in the bundle?',
    options: [
      'The request gains server authorization without a session.',
      'The browser converts unsuccessful responses into exceptions.',
      'The response bypasses HTTP cache rules by using a short path.',
      'The request uses the current origin across environments.',
    ],
    answer: 3,
    reasons: [
      'A relative URL does not supply authentication or authorization.',
      'Fetch status handling is unchanged by relative URL resolution.',
      'Cache behavior depends on the request and response rules, not path length.',
      'An origin-relative path follows the deployed host instead of a development hostname.',
    ],
  },
];

const juniorPractical: Item[] = [
  {
    id: 'fs-j-p-json-stringify',
    topic: 'Contracts',
    prompt:
      'The server receives "[object Object]" instead of JSON. Which change fixes the request body?',
    code: 'fetch("/api/tasks", {\n method: "POST", headers: {"Content-Type":"application/json"},\n body: String({title: "Pack"})\n})',
    options: [
      'Serialize the object with JSON.stringify before sending.',
      'Parse the title with JSON.parse before constructing the object.',
      'Rename the request header from Content-Type to Accept.',
      'Append a newline to the existing String conversion result.',
    ],
    answer: 0,
    reasons: [
      'JSON.stringify produces the JSON representation expected by the server parser.',
      'The title is ordinary text, not a JSON document to parse.',
      'Accept changes response negotiation and leaves the body invalid.',
      'Whitespace does not transform the object’s default string representation into JSON.',
    ],
  },
  {
    id: 'fs-j-p-number-input',
    topic: 'Contracts',
    prompt:
      'The API requires a positive integer quantity. What should the server do with this payload?',
    code: '{"quantity":"3x"}\nClient input used type="number", but a direct request bypassed it.',
    options: [
      'Parse the leading digit and save quantity 3.',
      'Reject the invalid quantity with a field-level error.',
      'Store the string because the browser advertised a numeric control.',
      'Replace the value with the previous customer’s last quantity.',
    ],
    answer: 1,
    reasons: [
      'Accepting the numeric prefix silently changes an invalid value into a different request.',
      'The server enforces the actual numeric contract regardless of client controls.',
      'HTML input restrictions do not constrain a caller making a direct API request.',
      'Another customer’s state has no relevance to this validation decision.',
    ],
  },
  {
    id: 'fs-j-p-delete-empty',
    topic: 'Contracts',
    prompt:
      'Deletion succeeds but the UI displays an error. What is wrong with the response handling?',
    code: 'Server: 204 No Content\nClient: const result = await response.json();\nshowDeleted(result.id);',
    options: [
      'The DELETE request requires a second identical request.',
      'The response should be read twice to find the missing JSON.',
      'The client attempts to parse a body the contract omits.',
      'The browser needs a longer timeout before reading the body.',
    ],
    answer: 2,
    reasons: [
      'A successful 204 does not call for repeating the mutation.',
      'Reading again cannot produce JSON from an intentionally absent body.',
      'The client should handle success without parsing JSON for this response contract.',
      'An intentionally empty response will not gain a body after waiting.',
    ],
  },
  {
    id: 'fs-j-p-network-offline',
    topic: 'Debugging and tests',
    prompt:
      'An offline save fails before any HTTP response exists. Which feedback accurately distinguishes it from a validation rejection?',
    options: [
      'Mark email invalid because the request did not finish.',
      'Show the server’s stored record as a confirmed new save.',
      'Display a 422 status copied from the last failed request.',
      'Keep the draft and explain the connection could not complete.',
    ],
    answer: 3,
    reasons: [
      'Transport failure provides no evidence that email validation failed.',
      'No received result confirms that the current draft was saved.',
      'Reusing an earlier status misrepresents this attempt’s evidence.',
      'Preserving work and describing transport failure supports a later recovery attempt.',
    ],
  },
  {
    id: 'fs-j-p-path-scope',
    topic: 'Identity and security',
    prompt:
      'A request retrieves another user’s note because the handler checks only that a session exists. What must be added?',
    code: 'GET /notes/n17\nsession.user = "bob"\ndb.note("n17").owner = "alice"',
    options: [
      'Check access to note n17 for the authenticated user.',
      'Require the note ID to contain at least three characters.',
      'Reject requests that do not come from the note detail page.',
      'Read the owner name from a new browser query parameter.',
    ],
    answer: 0,
    reasons: [
      'Authentication identifies Bob; a resource authorization check decides whether Bob may read n17.',
      'ID length does not establish ownership or access permission.',
      'Navigation history is not a trusted authorization boundary.',
      'A client-controlled query value cannot prove ownership.',
    ],
  },
  {
    id: 'fs-j-p-exception-detail',
    topic: 'Identity and security',
    prompt:
      'A database exception contains the connection URL. Which error response is appropriate for the browser?',
    code: 'Error: connection refused postgres://app:secret@db.internal:5432/shop',
    options: [
      'Return the stack trace after removing the exception class name.',
      'Return a safe error code and an opaque support identifier.',
      'Put the connection URL in a tooltip hidden by default.',
      'Send the URL only when the request came from the app interface.',
    ],
    answer: 1,
    reasons: [
      'Removing the exception class leaves the credential and internal host exposed.',
      'A safe error with a correlation identifier supports diagnosis without exposing secrets.',
      'Hidden UI text is still delivered to and inspectable by the user.',
      'The interface is not an authorization boundary for secret disclosure.',
    ],
  },
  {
    id: 'fs-j-p-success-after-await',
    topic: 'Async and consistency',
    prompt:
      'The form shows "Saved" even when the server later returns 500. Which change addresses the sequence?',
    code: 'saveTask(draft);\nsetMessage("Saved");',
    options: [
      'Call setMessage before saveTask to make the order consistent.',
      'Wait a fixed second and then display the same success message.',
      'Await the result and check success before confirming the save.',
      'Clear the draft immediately so another save cannot be sent.',
    ],
    answer: 2,
    reasons: [
      'Moving the message earlier further separates it from the real outcome.',
      'A timer is not evidence that the server accepted and persisted the request.',
      'The confirmation must follow the actual application result.',
      'Clearing the draft can lose work and does not correct the false success message.',
    ],
  },
  {
    id: 'fs-j-p-empty-loading',
    topic: 'Contracts',
    prompt:
      'The request completed with an empty array, but the spinner never disappears. Which state distinction is missing?',
    code: 'if (tasks.length === 0) return "Loading…";\nreturn renderTasks(tasks);',
    options: [
      'The distinction between a missing items field and a null field.',
      'The distinction between an empty collection and a missing route.',
      'The distinction between stale cached rows and new server rows.',
      'The distinction between request status and collection length.',
    ],
    answer: 3,
    reasons: [
      'The supplied response is a valid empty array, so missing-versus-null is not the failing distinction.',
      'The route already returned a successful collection; the spinner condition still confuses loaded and pending.',
      'Freshness matters elsewhere, but either empty collection still triggers this incorrect pending condition.',
      'A completed empty collection needs an empty state; pending must be tracked separately.',
    ],
  },
  {
    id: 'fs-j-p-route-method',
    topic: 'Contracts',
    prompt:
      'The API contract defines POST /api/contact. The browser receives 405. What should be checked first?',
    code: 'fetch("/api/contact")',
    options: [
      'Whether the client specifies the required request method.',
      'Whether the server should return a larger contact result.',
      'Whether the client needs to add Accept: application/json.',
      'Whether the response JSON needs an additional array wrapper.',
    ],
    answer: 0,
    reasons: [
      'Fetch defaults to GET, while this endpoint requires an explicit POST method.',
      'Result size does not resolve the method mismatch.',
      'Response negotiation does not correct the missing POST request method.',
      'The failure occurs before any need to transform a successful response envelope.',
    ],
  },
  {
    id: 'fs-j-p-missing-await',
    topic: 'Async and consistency',
    prompt:
      'The handler returns before the database insertion has finished. What is needed before confirming durable creation?',
    code: 'async function create(req) {\n  db.insert(req.body);\n  return {status: 201};\n}',
    options: [
      'Convert the response status to a string before returning it.',
      'Await the database outcome and handle a failed insertion.',
      'Add a browser animation matching the average insertion time.',
      'Log the requested title before starting the insertion call.',
    ],
    answer: 1,
    reasons: [
      'Changing status representation does not wait for persistence.',
      'The server cannot claim successful creation until its required write succeeds.',
      'A browser animation cannot provide a server persistence guarantee.',
      'Logging intent is not confirmation that the database accepted the write.',
    ],
  },
  {
    id: 'fs-j-p-list-identity',
    topic: 'Async and consistency',
    prompt:
      'Deleting a task removes the wrong row after the list is sorted. What is the contract mistake?',
    code: 'DELETE /tasks/2\n// "2" is the current array index, not the database task ID',
    options: [
      'The list needs an extra reverse sort before deletion.',
      'The API should derive the target from the browser viewport.',
      'The request should carry the task’s stable resource ID.',
      'The server should delete the newest task in the same project.',
    ],
    answer: 2,
    reasons: [
      'Changing sorting still leaves positions unstable across views and updates.',
      'Viewport size does not identify a database resource.',
      'A stable resource ID names the intended task independently of presentation order.',
      'Newest-task selection is not equivalent to the user’s selected row.',
    ],
  },
  {
    id: 'fs-j-p-saved-shape',
    topic: 'Contracts',
    prompt:
      'The server normalizes a title and assigns an ID. What should the UI use to add the confirmed record?',
    code: 'request: {"title":"  Pack  "}\n201 response: {"id":"t9","title":"Pack","version":1}',
    options: [
      'The draft object without the generated ID or version.',
      'A new random ID created after the response arrives.',
      'The record from the last successful request in this tab.',
      'The validated canonical record returned by this save.',
    ],
    answer: 3,
    reasons: [
      'The draft omits server-assigned fields and normalization.',
      'A second generated ID would diverge from the persisted resource identity.',
      'A previous response may refer to a different task.',
      'The returned record reflects the actual resource and its server-assigned identity.',
    ],
  },
  {
    id: 'fs-j-p-filter-url',
    topic: 'Contracts',
    prompt:
      'Searching for "tea & cake" unexpectedly adds a second query parameter. How should the URL be constructed?',
    code: 'const url = "/api/search?q=" + term;',
    options: [
      'Encode the query value, for example with URLSearchParams.',
      'Remove spaces while preserving the rest of the raw term.',
      'Move the raw term into a URL fragment after a hash.',
      'Append the same raw value as both q and search parameters.',
    ],
    answer: 0,
    reasons: [
      'Query encoding preserves ampersands and spaces as part of one value.',
      'The ampersand remains a query delimiter if only spaces are removed.',
      'Fragments are not sent to the server in the HTTP request target.',
      'Duplicating an incorrectly encoded value does not repair the delimiter issue.',
    ],
  },
  {
    id: 'fs-j-p-accessible-errors',
    topic: 'Debugging and tests',
    prompt:
      'A server returns a required-name error. Sighted users see red text, but keyboard and screen-reader users cannot locate the problem. Which change should be verified?',
    options: [
      'Show one generic error banner above the form without field associations.',
      'Associate the error with the labeled input and expose its state.',
      'Set the input border to a stronger red without changing its accessible state.',
      'Focus the submit button again and leave error markup unchanged.',
    ],
    answer: 1,
    reasons: [
      'A generic banner may announce failure but does not identify the invalid input or its correction.',
      'Programmatic association and an invalid state make the field error discoverable.',
      'A color-only change does not expose the error relationship to screen readers.',
      'Returning focus to Submit does not associate the error with the field needing correction.',
    ],
  },
  {
    id: 'fs-j-p-request-cost',
    topic: 'Performance',
    prompt:
      'A profile page fetches 5,000 full audit records just to display a total. Which API change directly reduces the unnecessary work?',
    options: [
      'Request the same records once per animation frame.',
      'Move the full audit array into the URL query string.',
      'Provide the authorized aggregate count needed by the view.',
      'Increase the response timeout to allow slower devices to wait.',
    ],
    answer: 2,
    reasons: [
      'More frequent reads multiply the existing cost.',
      'Moving records into a URL does not reduce their volume and may expose data.',
      'A scoped aggregate avoids transferring and rendering irrelevant record details.',
      'A longer timeout tolerates cost but does not remove it.',
    ],
  },
  {
    id: 'fs-j-p-base-url',
    topic: 'Delivery',
    prompt:
      'The app works locally. In staging the browser sends /api/tasks to the static asset host, which has no API proxy. What configuration should be investigated?',
    code: 'UI host: assets.staging.test\nAPI host: api.staging.test\nRequest: https://assets.staging.test/api/tasks -> 404',
    options: [
      'The API handler’s validation rule for an empty task title.',
      'The response adapter’s handling of an empty successful task list.',
      'The session cookie expiry on the intended API host.',
      'The deployed API base URL or same-origin proxy route.',
    ],
    answer: 3,
    reasons: [
      'The request reaches the static host before the intended API validator can run.',
      'Successful-response mapping is downstream of the incorrect request destination.',
      'Cookie expiry may affect authentication after routing, but cannot explain this static-host URL.',
      'The observed URL shows that the deployment lacks the intended API destination mapping.',
    ],
  },
  {
    id: 'fs-j-p-cookie-httponly',
    topic: 'Identity and security',
    prompt:
      'The session cookie has HttpOnly. A developer cannot read it through document.cookie, but authenticated same-origin requests work. What does this indicate?',
    options: [
      'The browser can attach the cookie without exposing it to scripts.',
      'The cookie is broken and must be copied into local storage.',
      'The API authenticated using the task ID in the request path.',
      'The browser converted the cookie into a public response field.',
    ],
    answer: 0,
    reasons: [
      'HttpOnly limits script access while the browser can still send eligible cookies.',
      'Lack of script access is the intended property, not evidence of a broken session.',
      'A task ID does not authenticate a user.',
      'Cookie handling does not automatically publish a credential in response JSON.',
    ],
  },
  {
    id: 'fs-j-p-cross-user-test',
    topic: 'Debugging and tests',
    prompt:
      'A test creates a private note as Alice. Which follow-up assertion checks the resource permission boundary?',
    options: [
      'Read it as Alice again and assert that the title is nonempty.',
      'Request its ID as Bob and assert no private content is returned.',
      'Use a mocked forbidden response and verify Bob’s error banner.',
      'Reload Alice’s page and compare the heading with its snapshot.',
    ],
    answer: 1,
    reasons: [
      'Owner access can succeed even if unauthorized access is also mistakenly allowed.',
      'A second identity exercises the server’s resource-level authorization.',
      'A mocked denial verifies UI handling but not the real server permission boundary.',
      'A same-user heading snapshot does not cross the relevant security boundary.',
    ],
  },
  {
    id: 'fs-j-p-response-html',
    topic: 'Debugging and tests',
    prompt:
      'response.json() throws on an API request. What should be examined before changing the JSON parser?',
    code: 'status=200\ncontent-type=text/html\nbody begins: <!doctype html><title>Sign in</title>',
    options: [
      'Whether the server escaped apostrophes inside JSON string values.',
      'Whether the browser parsed the same body twice as text.',
      'Whether authentication or routing returned an HTML page.',
      'Whether the content-type header was stripped from otherwise valid JSON.',
    ],
    answer: 2,
    reasons: [
      'The shown response is HTML rather than a malformed JSON string.',
      'The shown media type and body already identify a different representation.',
      'A redirect or fallback route may have supplied a login page instead of the API contract.',
      'Both the header and the actual document body identify HTML in this evidence.',
    ],
  },
  {
    id: 'fs-j-p-validation-test',
    topic: 'Debugging and tests',
    prompt:
      'Client checks prevent submitting an empty title. Which test establishes that the server enforces the same invariant?',
    options: [
      'Verify the Save button is disabled on an empty form.',
      'Assert that the title input has a required attribute.',
      'Run the client validator against an empty-title fixture.',
      'Send an empty title directly and verify no record is created.',
    ],
    answer: 3,
    reasons: [
      'Button state demonstrates only the browser’s local restriction.',
      'An HTML attribute does not constrain a direct API caller.',
      'A client unit test does not establish independent API validation.',
      'A direct invalid request checks both rejection and the absence of a persisted side effect.',
    ],
  },
  {
    id: 'fs-j-p-draft-recovery',
    topic: 'Async and consistency',
    prompt:
      'A draft-save request fails validation because a required category is missing. Which state should remain available while the user fixes it?',
    options: [
      'The entered title and body, plus the category error.',
      'A blank form with the last server error removed.',
      'A success receipt containing a client-generated record ID.',
      'The previous user’s cached category selection.',
    ],
    answer: 0,
    reasons: [
      'Retaining valid draft values lets the user correct the specific missing field.',
      'A blank form loses work unrelated to the reported validation problem.',
      'Validation failure does not justify issuing a success receipt.',
      'Another user’s cached choice is neither a safe nor meaningful correction.',
    ],
  },
  {
    id: 'fs-j-p-page-size',
    topic: 'Performance',
    prompt:
      'An activity page transfers 20 MB and renders ten visible rows. What is the best first contract change?',
    options: [
      'Cache the complete activity response for later visits.',
      'Return bounded pages with a way to request the next page.',
      'Virtualize the visible rows while retaining the complete API response.',
      'Filter the downloaded array down to ten rows in the browser.',
    ],
    answer: 1,
    reasons: [
      'Caching can help repeat visits but leaves the first oversized transfer and processing cost.',
      'Pagination bounds transfer and processing to a useful amount of data.',
      'Virtualization reduces rendered elements but not the 20 MB transfer.',
      'Filtering after download does not reduce network transfer or initial parsing.',
    ],
  },
  {
    id: 'fs-j-p-timezone',
    topic: 'Contracts',
    prompt:
      'An event starts at the instant below. The UI must show each viewer’s local time. Which representation should remain authoritative across the API?',
    code: '2026-10-27T08:00:00Z',
    options: [
      'The phrase "eight in the morning" without a date.',
      'The hour number 8 with the date inferred from the browser.',
      'The timestamp with its offset, formatted for the viewer.',
      'A date label generated by whichever user opened the event first.',
    ],
    answer: 2,
    reasons: [
      'A local phrase lacks a date and time-zone reference for the instant.',
      'An hour alone loses the day and offset needed for conversion.',
      'The offset-bearing timestamp identifies the instant while presentation can vary by viewer.',
      'The first viewer’s label is not a stable representation of the event instant.',
    ],
  },
  {
    id: 'fs-j-p-release-smoke',
    topic: 'Delivery',
    prompt:
      'A release changes both a form and its create endpoint. Which staging smoke test best checks that the deployed pieces work together?',
    options: [
      'Run the frontend formatter against the new source files.',
      'Check that the API process listens on its configured port.',
      'Run the form against a successful mocked create response.',
      'Create a record through the UI and retrieve it after reload.',
    ],
    answer: 3,
    reasons: [
      'Formatting says nothing about the deployed request contract.',
      'A listening process can still reject or mishandle the form payload.',
      'A mocked response does not test the deployed endpoint and persistence path.',
      'Creation followed by retrieval checks the deployed browser, API, and persistence integration.',
    ],
  },
];

const midFundamentals: Item[] = [
  {
    id: 'fs-m-f-idempotency-scope',
    topic: 'Async and consistency',
    prompt:
      'An API stores idempotency records under the client-supplied key alone. Two tenants choose the same key. Which design prevents a cross-tenant collision?',
    options: [
      'Scope records to the authenticated tenant and operation.',
      'Prefix keys with the client-reported tenant display name.',
      'Return the first stored response regardless of its owner.',
      'Expire all keys immediately after the first HTTP response.',
    ],
    answer: 0,
    reasons: [
      'The lookup needs a trusted ownership boundary and a defined logical operation.',
      'A display name can collide or be forged; scope must come from verified tenant identity.',
      'Returning another tenant’s response would expose data and corrupt operation semantics.',
      'Immediate expiry loses deduplication when a successful response is lost.',
    ],
  },
  {
    id: 'fs-m-f-csrf',
    topic: 'Identity and security',
    prompt:
      'A mutation relies on automatically attached session cookies. What role do server-validated CSRF protections play beyond hiding the action button?',
    options: [
      'They encrypt database records before the mutation runs.',
      'They reject forged cross-site requests using the user’s session.',
      'They prove that the submitted account balance is correct.',
      'They make every script running on the app origin trustworthy.',
    ],
    answer: 1,
    reasons: [
      'CSRF protection addresses request provenance, not storage encryption.',
      'Cookie attachment alone does not prove the user intended a cross-site-triggered mutation.',
      'Request provenance does not replace server-side business validation.',
      'CSRF defenses do not make same-origin malicious scripts safe.',
    ],
  },
  {
    id: 'fs-m-f-http-revalidate',
    topic: 'Caching',
    prompt:
      'A response uses Cache-Control: no-cache with an ETag. How should this differ from no-store?',
    options: [
      'No-cache forbids retaining the response under any circumstances.',
      'No-store permits reuse when an ETag matches a previous value.',
      'No-cache permits storage but requires validation before reuse.',
      'Both directives allow shared reuse until max-age is exceeded.',
    ],
    answer: 2,
    reasons: [
      'The storage prohibition is the role of no-store, not no-cache.',
      'An ETag does not override a no-store storage prohibition.',
      'No-cache controls reuse through validation; no-store forbids storage by compliant caches.',
      'Neither directive means unrestricted fresh reuse until an age limit.',
    ],
  },
  {
    id: 'fs-m-f-schema-compat',
    topic: 'Delivery',
    code: 'old accepted statuses: draft | published\nnew response: {"status":"paused"}',
    prompt:
      'Old clients reject unknown enum values. A new server wants to add status="paused". What is the main compatibility risk?',
    options: [
      'Adding a value necessarily changes the HTTP request method.',
      'JSON parsers cannot parse an unfamiliar string value.',
      'The database must rename every existing record ID.',
      'Old clients may fail despite the field retaining its string type.',
    ],
    answer: 3,
    reasons: [
      'An enum extension does not inherently change request methods.',
      'JSON parsing accepts strings; application validation or rendering may reject them.',
      'Resource identity changes are not required by an enum extension.',
      'A strict consumer’s accepted value set can make an additive schema change breaking.',
    ],
  },
  {
    id: 'fs-m-f-read-after-write',
    topic: 'Async and consistency',
    prompt:
      'A save commits on the primary, but the next list read uses a lagging replica. Which observation can the user see?',
    code: 'primary version=12\nreplica version=11\nwrite response version=12',
    options: [
      'The freshly saved value appears to revert on the next read.',
      'The primary transaction becomes uncommitted retroactively.',
      'The browser automatically waits for replica catch-up.',
      'The replica returns version 12 because the browser has seen it.',
    ],
    answer: 0,
    reasons: [
      'A stale replica read can overwrite a newer confirmed value unless the flow accounts for version freshness.',
      'Replication lag does not reverse a committed primary transaction.',
      'The browser has no inherent knowledge of replication progress.',
      'The browser’s prior response does not update replica state.',
    ],
  },
  {
    id: 'fs-m-f-outbox',
    topic: 'Async and consistency',
    prompt:
      'An order commit and an email-queue publish use different systems. What gap does a transactional outbox address?',
    options: [
      'The browser may format the order date in a local timezone.',
      'A committed order may never get its required event published.',
      'The email subject may contain a spelling error from the editor.',
      'The network may deliver a single event more than once.',
    ],
    answer: 1,
    reasons: [
      'Timezone formatting is unrelated to atomically recording an event with a database write.',
      'Recording the event in the same database transaction closes the commit-then-crash publishing gap.',
      'An outbox does not validate editorial content.',
      'Outbox delivery can still be repeated; consumers need deduplication where appropriate.',
    ],
  },
  {
    id: 'fs-m-f-pagination-order',
    topic: 'Contracts',
    code: 'createdAt=10:00:00, id=41\ncreatedAt=10:00:00, id=42\npage size=1; timestamp-only cursor',
    prompt:
      'An activity feed sorts by createdAt, but many records share that timestamp. What is needed for a stable cursor boundary?',
    options: [
      'Use the number of visible rows as the next cursor.',
      'Compare each timestamp using the browser’s locale string.',
      'Add a deterministic tie-breaker such as the record ID.',
      'Reverse the sort direction whenever a timestamp repeats.',
    ],
    answer: 2,
    reasons: [
      'Row count does not identify a stable boundary among tied records.',
      'Locale formatting can obscure values and does not resolve equal timestamps.',
      'A total order lets the cursor identify a position even when timestamps match.',
      'Changing direction mid-stream creates inconsistent traversal.',
    ],
  },
  {
    id: 'fs-m-f-upload',
    topic: 'Identity and security',
    prompt:
      'A direct-to-storage upload returns a key chosen by the browser. Before attaching the file to a private project, what must the API verify?',
    options: [
      'The browser’s displayed filename contains a recognized extension.',
      'The client reported that its upload progress reached 100 percent.',
      'The upload control is hidden for users without editor access.',
      'The object and upload authorization belong to the permitted scope.',
    ],
    answer: 3,
    reasons: [
      'An extension does not establish object ownership or permitted project attachment.',
      'A progress report is not proof of server-side authorization or object identity.',
      'A hidden control does not constrain direct API calls.',
      'The server must bind the uploaded object to the authenticated actor and authorized project.',
    ],
  },
  {
    id: 'fs-m-f-contract-test',
    topic: 'Debugging and tests',
    prompt:
      'Frontend and API unit suites pass while production fails on renamed response fields. Which check targets the gap?',
    options: [
      'Run consumer expectations against a real provider response.',
      'Raise unit-test line-coverage thresholds in the formatter.',
      'Compare minified frontend bundle sizes before each release.',
      'Run the API health endpoint from a second geographic region.',
    ],
    answer: 0,
    reasons: [
      'A contract test checks agreement between what the consumer expects and the provider produces.',
      'More unrelated coverage does not establish a shared response contract.',
      'Bundle size is not evidence about JSON field compatibility.',
      'Health availability does not establish the affected response shape.',
    ],
  },
  {
    id: 'fs-m-f-debounce',
    topic: 'Performance',
    prompt:
      'Debouncing a search input reduces request count. Why might stale results still appear?',
    options: [
      'Debouncing forces the browser to reuse old HTTP headers.',
      'Requests already dispatched can still finish out of order.',
      'Debouncing changes every successful response into a retry.',
      'A debounce interval removes the need for server pagination.',
    ],
    answer: 1,
    reasons: [
      'Debouncing controls scheduling rather than HTTP header reuse.',
      'Scheduling fewer calls does not establish relevance ordering among calls that still run.',
      'The timing technique does not change HTTP success semantics.',
      'Pagination and request scheduling address different costs.',
    ],
  },
  {
    id: 'fs-m-f-invalidation-scope',
    topic: 'Caching',
    prompt:
      'A product edit changes the detail view, category list, and search index. What should its cache plan be based on?',
    options: [
      'Every cache entry created after the user first signed in.',
      'The component currently visible when Save was clicked.',
      'The read models that depend on the changed product fields.',
      'The cache entries whose keys share the same string prefix.',
    ],
    answer: 2,
    reasons: [
      'Creation time does not indicate whether a cached representation is affected.',
      'Other views may depend on the same data even when currently hidden.',
      'Dependencies determine which representations require updates or invalidation.',
      'A shared prefix may be an implementation convenience but does not reliably capture data dependencies.',
    ],
  },
  {
    id: 'fs-m-f-retry-class',
    topic: 'Delivery',
    prompt:
      'A shared client retries every non-2xx mutation three times. What distinction should guide a safer policy?',
    options: [
      'Whether the server supplied a human-readable error message.',
      'Whether the browser has received any previous successful response.',
      'Whether the response includes the server’s release number.',
      'Whether the failure is transient and the operation is retry-safe.',
    ],
    answer: 3,
    reasons: [
      'A message can accompany either a permanent rejection or a transient failure.',
      'Earlier success does not classify this operation’s failure or duplicate-effect risk.',
      'Release metadata may aid diagnosis but is not a retry policy by itself.',
      'A retry should account for both failure class and the logical operation’s side effects.',
    ],
  },
];

const midPractical: Item[] = [
  {
    id: 'fs-m-p-optimistic-overlap',
    topic: 'Async and consistency',
    prompt:
      'Two optimistic likes overlap. The first fails after the second succeeds. What avoids undoing the confirmed second change?',
    code: 'base likes=10\nop A optimistic ->11\nop B optimistic ->12\nB confirms 12\nA fails; rollback sets 10',
    options: [
      'Reconcile operation-specific changes against confirmed state.',
      'Rollback to the page’s original snapshot after every failure.',
      'Delay all failure notifications by a fixed five-second timer.',
      'Apply the most recently arriving full snapshot as the authoritative base.',
    ],
    answer: 0,
    reasons: [
      'A rollback must not discard later confirmed operations; track each operation’s contribution.',
      'The original snapshot predates B and would erase its successful update.',
      'A delay does not establish which operations remain valid.',
      'The latest arrival may describe older state and erase later confirmed work.',
    ],
  },
  {
    id: 'fs-m-p-request-fingerprint',
    topic: 'Async and consistency',
    prompt:
      'The client reuses an idempotency key but changes the purchase quantity. What should the API do?',
    code: 'key=k1, body={sku:"A", quantity:1} -> order 41\nkey=k1, body={sku:"A", quantity:3} -> ?',
    options: [
      'Create a second order because the JSON body differs.',
      'Reject the key reuse as a different logical request.',
      'Update order 41 silently to the new quantity.',
      'Return order 41 while claiming the new quantity was saved.',
    ],
    answer: 1,
    reasons: [
      'Treating the reused key as new defeats its stable operation identity.',
      'A stored request fingerprint can distinguish retry from conflicting key reuse.',
      'Silent mutation changes the meaning of an operation already confirmed.',
      'Returning a mismatched outcome would falsely acknowledge the altered request.',
    ],
  },
  {
    id: 'fs-m-p-refresh-storm',
    topic: 'Identity and security',
    prompt:
      'Five requests receive an expired-session response together. Each initiates refresh, rotating the token five times. Which client coordination reduces this race?',
    options: [
      'Give every failed request a separate persistent refresh cookie.',
      'Delay each request by its position in the component tree.',
      'Share one in-flight refresh and replay eligible requests afterward.',
      'Send expired credentials again until one request succeeds.',
    ],
    answer: 2,
    reasons: [
      'Additional independent credentials complicate session state without coordinating the refresh.',
      'Component order is not a reliable concurrency protocol.',
      'A single shared refresh avoids conflicting rotations and lets waiting requests use its result.',
      'Repeating expired credentials cannot establish a renewed session.',
    ],
  },
  {
    id: 'fs-m-p-csrf-origin',
    topic: 'Identity and security',
    prompt:
      'A cookie-authenticated transfer API accepts form POSTs from any origin. Which change addresses forged cross-site submission while keeping normal browser use?',
    code: 'POST /transfer\nCookie: session=...\nContent-Type: application/x-www-form-urlencoded\namount=50&to=attacker',
    options: [
      'Move the amount field from the body to the query string.',
      'Rename the endpoint and update the visible button label.',
      'Require the browser to display a confirmation toast first.',
      'Validate anti-CSRF evidence and trusted request origin policy.',
    ],
    answer: 3,
    reasons: [
      'Moving fields does not prove that the user intended the request.',
      'An endpoint name is discoverable and does not form a security boundary.',
      'A server cannot rely on a client toast having been displayed.',
      'Server-enforced provenance protections address automatic cookie use by forged requests.',
    ],
  },
  {
    id: 'fs-m-p-cache-filter',
    topic: 'Caching',
    prompt:
      'Switching from open to closed tickets briefly displays the wrong dataset. The cache key is shown. What missing input matters?',
    code: 'queryKey = ["tickets", tenantId]\nGET /tickets?status=closed',
    options: [
      'Include the status filter in the cache key.',
      'Include the response’s compressed byte count in the key.',
      'Use the title of whichever ticket is first in the list.',
      'Invalidate the cache only when the browser window closes.',
    ],
    answer: 0,
    reasons: [
      'Different filters produce different representations and must not collide in the same cache entry.',
      'Response size is unknown at lookup time and does not identify the requested filter.',
      'The first title is unstable and not the query’s semantic identity.',
      'Window closure does not prevent incorrect reuse during active filter changes.',
    ],
  },
  {
    id: 'fs-m-p-etag-precondition',
    topic: 'Async and consistency',
    prompt:
      'An editor sends If-Match: "v6" but the document is now v7. The API returns 412. What recovery preserves intent?',
    options: [
      'Repeat the same update without its precondition header.',
      'Show the conflict and allow comparison with the current record.',
      'Change the response status to 200 in the client adapter.',
      'Overwrite the draft with a blank document and resubmit it.',
    ],
    answer: 1,
    reasons: [
      'Removing the precondition reintroduces the lost-update risk the check detected.',
      'The user can reconcile their draft against the version that changed.',
      'Changing a local status cannot make the rejected write durable.',
      'A blank overwrite destroys information rather than reconciling concurrent edits.',
    ],
  },
  {
    id: 'fs-m-p-poll-after-unmount',
    topic: 'Async and consistency',
    prompt:
      'A report screen polls every second. After navigation, old polling continues and updates the next screen’s shared state. Which lifecycle fix is needed?',
    code: 'startPolling(reportId);\n// route changes from report A to report B',
    options: [
      'Increase the polling interval to reduce the frequency of leaks.',
      'Keep polling but clear the shared state once when navigation begins.',
      'Stop old polling and reject updates for the previous report scope.',
      'Reuse report A’s request parameters until report B completes once.',
    ],
    answer: 2,
    reasons: [
      'Less frequent stale updates remain incorrect and retain unnecessary work.',
      'A one-time clear can be undone when old polling delivers its next result.',
      'Cleanup plus scope checking prevents obsolete work from mutating the new screen.',
      'Reusing A’s parameters deliberately fetches the wrong resource.',
    ],
  },
  {
    id: 'fs-m-p-cursor-ties',
    topic: 'Contracts',
    prompt:
      'The next-page query skips some events created at the same timestamp. Which cursor rule fixes the boundary?',
    code: 'ORDER BY created_at DESC, id DESC\nWHERE created_at < :last_time\n// final row on previous page: (10:00, id=50)',
    options: [
      'Increase the page size until timestamp collisions disappear.',
      'Use WHERE created_at <= :last_time without tracking IDs.',
      'Sort on the client after collecting the skipped timestamp group.',
      'Compare the pair (created_at, id) with the last row’s pair.',
    ],
    answer: 3,
    reasons: [
      'Larger pages do not guarantee that a tied group stays inside one page.',
      'Inclusive timestamp-only comparison can repeatedly return already seen records.',
      'Client sorting cannot recover records the API boundary excluded.',
      'The cursor predicate must match the complete deterministic ordering.',
    ],
  },
  {
    id: 'fs-m-p-upload-finalize',
    topic: 'Identity and security',
    prompt:
      'A user uploads one object but finalizes another tenant’s object key. What should the finalize endpoint check?',
    code: 'issued upload: tenant=A, object=A/u91\nfinalize body: {objectKey:"B/private/payroll"}',
    options: [
      'Match the object to a server-issued upload authorization.',
      'Accept the key when it names an object that exists.',
      'Accept the key when the filename lacks dot-dot segments.',
      'Compare its length with the object key originally displayed.',
    ],
    answer: 0,
    reasons: [
      'The object must be bound to the actor and allowed destination established by the upload authorization.',
      'Existence does not establish permission to attach or read the object.',
      'Path normalization does not establish tenant ownership.',
      'Keys of equal length can belong to entirely different tenants.',
    ],
  },
  {
    id: 'fs-m-p-service-worker',
    topic: 'Caching',
    prompt:
      'Logout clears the app query cache, but a service worker still serves yesterday’s /account JSON offline. What is missing from logout isolation?',
    options: [
      'A second update of the visible account display name.',
      'A policy excluding or clearing identity-bound worker responses.',
      'A longer freshness lifetime for the service-worker cache.',
      'An extra no-cache meta tag inside the already loaded HTML.',
    ],
    answer: 1,
    reasons: [
      'Display-name changes do not remove private response contents.',
      'Private data can live in more than one cache, so worker storage needs identity-aware treatment.',
      'Longer freshness extends the exposure window.',
      'An HTML meta tag does not directly clear programmatic worker cache entries.',
    ],
  },
  {
    id: 'fs-m-p-transaction-cart',
    topic: 'Async and consistency',
    prompt:
      'Two customers buy the final unit. Both requests read stock=1 before decrementing it. Which database operation addresses overselling?',
    code: 'if (stock > 0) {\n  createOrder();\n  setStock(stock - 1);\n}',
    options: [
      'Run the same check again in the browser before submission.',
      'Store each customer’s stock reading in local storage.',
      'Conditionally decrement stock and commit the order atomically.',
      'Read stock from a longer-lived cache to keep values consistent.',
    ],
    answer: 2,
    reasons: [
      'Client checks cannot serialize competing server transactions.',
      'Local storage does not coordinate separate customers.',
      'An atomic conditional update and order transaction enforce the stock invariant under concurrency.',
      'A stale shared value does not reserve inventory for one buyer.',
    ],
  },
  {
    id: 'fs-m-p-outbox-crash',
    topic: 'Async and consistency',
    prompt:
      'An order commits, then the process crashes before publishing its event. Which design lets recovery find the missing publication?',
    code: 'COMMIT order\nprocess exits\npublish("OrderCreated") never runs',
    options: [
      'Publish from the browser after displaying the receipt.',
      'Retry every successful order request using a fresh key.',
      'Write the publication intent to a separate queue after committing the order.',
      'Commit an outbox row with the order and deliver it later.',
    ],
    answer: 3,
    reasons: [
      'The browser may close and cannot reliably own the server’s durable event obligation.',
      'Fresh operation keys can create duplicate orders rather than recover an event.',
      'A separate post-commit enqueue retains the same crash window between the two writes.',
      'A durable event record committed with the order survives a crash and can be retried.',
    ],
  },
  {
    id: 'fs-m-p-runtime-union',
    topic: 'Contracts',
    prompt:
      'An SDK result is typed as a discriminated union. A third-party response includes an unsupported status. What should the adapter do?',
    code: 'type Result = {status:"ready", url:string} | {status:"pending"};\npayload = {status:"expired"};',
    options: [
      'Validate the payload and map unsupported data to a handled error.',
      'Cast to Result and read url whenever status is not pending.',
      'Convert the unfamiliar status to ready without checking url.',
      'Remove the status field so existing rendering falls through.',
    ],
    answer: 0,
    reasons: [
      'The adapter must establish the runtime union contract before consumers rely on it.',
      'The cast does not create a URL or validate the unknown status.',
      'Renaming a status invents a successful result with missing data.',
      'Deleting the discriminator makes interpretation less reliable.',
    ],
  },
  {
    id: 'fs-m-p-expand-contract',
    topic: 'Delivery',
    prompt:
      'The API is renaming fullName to displayName. Old tabs must keep saving during a one-week transition. Which rollout supports that?',
    options: [
      'Rename the field everywhere in one server deployment.',
      'Accept the old and new shapes during a measured migration window.',
      'Reject all older clients immediately with a generic 500.',
      'Keep accepting both names but choose randomly when both appear.',
    ],
    answer: 1,
    reasons: [
      'Old deployed clients would still send fullName after that server change.',
      'Compatibility handling with defined precedence permits staged client migration and later removal.',
      'A generic failure breaks the required transition period and hides the reason.',
      'Ambiguous input needs a deterministic rule or explicit rejection, not random precedence.',
    ],
  },
  {
    id: 'fs-m-p-contract-fixture',
    topic: 'Debugging and tests',
    prompt:
      'Browser tests mock {total: 12}; the real API now returns {totalCents: 1200}. Which change detects this drift in CI?',
    options: [
      'Increase the browser screenshot comparison tolerance.',
      'Regenerate expected screenshots from the unchanged mock.',
      'Validate the consumer fixture against actual provider output.',
      'Regenerate frontend types from its unchanged local response fixture.',
    ],
    answer: 2,
    reasons: [
      'Screenshot tolerance does not establish that mocks reflect the provider.',
      'Refreshing screenshots can conceal rather than expose the contract mismatch.',
      'A provider-backed contract check reveals that the fixture no longer represents real responses.',
      'Types generated from the stale fixture preserve the same mismatch with the actual provider.',
    ],
  },
  {
    id: 'fs-m-p-query-plan',
    topic: 'Performance',
    prompt:
      'A dashboard is slow only for large tenants. The browser waits 2.6 seconds; server logs attribute 2.4 seconds to a filtered database query. What should be inspected next?',
    code: 'WHERE tenant_id=? AND status=?\nORDER BY created_at DESC LIMIT 25',
    options: [
      'The loading spinner’s animation duration and easing curve.',
      'The number of event listeners on the browser’s Save button.',
      'The compressed size of a separate help-page image.',
      'The query plan and indexes for the tenant/filter ordering.',
    ],
    answer: 3,
    reasons: [
      'The measured database wait dominates the browser-side animation.',
      'A save listener is not implicated by the dashboard read timing.',
      'An unrelated image cannot explain the server’s database measurement.',
      'The filter and order may need an appropriate access path; the plan supplies evidence.',
    ],
  },
  {
    id: 'fs-m-p-log-redaction',
    topic: 'Debugging and tests',
    prompt:
      'A shared error logger serializes every request header. What change preserves useful diagnosis while reducing credential exposure?',
    options: [
      'Allowlist diagnostic fields and redact authentication headers.',
      'Base64-encode the headers before writing the same log entry.',
      'Copy the headers into the browser console instead of server logs.',
      'Keep raw headers but hide the log link from the navigation menu.',
    ],
    answer: 0,
    reasons: [
      'Useful request metadata and opaque IDs can be retained without copying credentials.',
      'Base64 is reversible encoding, not protection against credential disclosure.',
      'Moving the disclosure to another log destination does not remove it.',
      'Navigation visibility does not control the sensitive contents already stored.',
    ],
  },
  {
    id: 'fs-m-p-replica-flicker',
    topic: 'Async and consistency',
    prompt:
      'After saving version 14, a background replica read returns version 13. The view flickers back. Which client reconciliation rule is appropriate?',
    code: 'confirmed local record version=14\nbackground read version=13',
    options: [
      'Apply the response because its network arrival was later.',
      'Do not replace a newer confirmed version with an older one.',
      'Clear the record and show a not-found page on every version gap.',
      'Repeat the write to create a new version for each stale read.',
    ],
    answer: 1,
    reasons: [
      'Arrival order does not imply that the represented database state is newer.',
      'A version guard preserves the confirmed state while a suitably fresh read is obtained.',
      'Replica lag is not evidence that the resource is absent.',
      'Repeated writes create unnecessary effects rather than solving read freshness.',
    ],
  },
  {
    id: 'fs-m-p-request-budget',
    topic: 'Performance',
    prompt:
      'The page makes two independent calls and one dependent call. Which schedule minimizes waiting without changing the dependencies?',
    code: 'A: permissions, 100ms\nB: catalog, 300ms\nC: quote, 200ms, needs B result\nRender requires A and C',
    options: [
      'A then B then C, for a 600ms network critical path.',
      'B then A then C, because A is the shortest call.',
      'Start A and B together; start C when B finishes.',
      'Start all three together with an empty catalog passed to C.',
    ],
    answer: 2,
    reasons: [
      'Serializing A adds a wait that is not required by the dependency graph.',
      'A still adds avoidable waiting before C in that schedule.',
      'C can follow B while A completes independently, yielding a 500ms network critical path.',
      'C has a real dependency; an empty catalog changes the request meaning.',
    ],
  },
  {
    id: 'fs-m-p-error-contract',
    topic: 'Contracts',
    prompt:
      'The UI branches on an English message string. A copy edit breaks validation handling. Which API shape makes this less brittle?',
    code: 'if (error.message === "Email already used") focusEmail();',
    options: [
      'Compare only the first eight characters of the message.',
      'Use the HTTP reason phrase as the unique field identifier.',
      'Send the same message twice under different property names.',
      'Send a stable error code and field metadata beside the message.',
    ],
    answer: 3,
    reasons: [
      'A shorter text comparison remains coupled to presentation wording.',
      'A general HTTP phrase cannot identify a specific field-level domain error.',
      'Duplicating text does not create a stable machine-readable contract.',
      'Stable codes and field metadata separate program behavior from editable display copy.',
    ],
  },
  {
    id: 'fs-m-p-tenant-switch',
    topic: 'Identity and security',
    prompt:
      'A user belongs to two organizations. Switching organizations updates the route but an export uses the old organization’s cached selection. What boundary should the export recheck?',
    options: [
      'Bind selected resource IDs to the current authorized organization.',
      'Authorize the user’s membership in either organization without checking the selected IDs.',
      'Trust the organization stored when the browser tab first opened.',
      'Authorize the export endpoint but trust the cached resource selection.',
    ],
    answer: 0,
    reasons: [
      'Current scope and resource membership must be verified even when the user belongs to both organizations.',
      'Membership somewhere does not bind the exported resources to the currently selected organization.',
      'A tab’s initial scope becomes stale after an organization switch.',
      'Endpoint permission alone does not establish that each selected resource belongs to the active scope.',
    ],
  },
  {
    id: 'fs-m-p-rate-limit',
    topic: 'Delivery',
    prompt:
      'A background refresh gets 429 with Retry-After: 30. What behavior fits this read-only flow?',
    options: [
      'Restart all refreshes immediately with independent retry loops.',
      'Back off for the indicated interval and keep stale data labeled.',
      'Clear the user’s session and force password entry.',
      'Convert the response to an empty successful collection.',
    ],
    answer: 1,
    reasons: [
      'Immediate parallel retries intensify the overload that produced the rate limit.',
      'Respecting the wait reduces load while the UI distinguishes stale data from a new result.',
      'Rate limiting does not by itself establish an invalid session.',
      'An empty success would misrepresent unavailable fresh data.',
    ],
  },
  {
    id: 'fs-m-p-interrupted-test',
    topic: 'Debugging and tests',
    prompt:
      'Which fault-injection point best verifies recovery from a lost create response without duplicate records?',
    options: [
      'Block the request before it reaches server validation.',
      'Reject an empty title before any database transaction begins.',
      'Drop the response after commit, then retry the same operation.',
      'Drop the response before the handler starts its transaction.',
    ],
    answer: 2,
    reasons: [
      'Pre-dispatch loss does not exercise an already completed side effect.',
      'A rejected invalid input has no committed result to deduplicate.',
      'This creates the uncertain-outcome boundary the idempotency design must handle.',
      'A pre-transaction failure misses the committed-side-effect uncertainty this test needs.',
    ],
  },
  {
    id: 'fs-m-p-session-revoked',
    topic: 'Identity and security',
    prompt:
      'A tab remains open after its server session is revoked. A private API returns the documented session-expired response. What should the client do?',
    options: [
      'Keep polling with the same credentials while showing cached identity.',
      'Treat the response as a successful empty data refresh.',
      'Replace the session cookie with a random browser-generated value.',
      'End authenticated state and isolate cached private views.',
    ],
    answer: 3,
    reasons: [
      'Repeated use of revoked credentials does not restore the session and can leave stale private UI visible.',
      'An authentication failure is not a successful empty collection.',
      'A random client value is not a server-issued authenticated session.',
      'The client should transition out of the revoked session and prevent its private data from crossing identities.',
    ],
  },
];

const seniorFundamentals: Item[] = [
  {
    id: 'fs-s-f-migration-invariant',
    topic: 'Delivery',
    prompt:
      'A database migration must support old and new API instances during a rolling deploy. Which invariant most directly makes rollback viable?',
    options: [
      'Both versions can interpret data written during the overlap.',
      'Every new API instance reports the same build identifier.',
      'The new browser bundle passes its isolated contract fixtures.',
      'The migration finishes before the first new instance starts.',
    ],
    answer: 0,
    reasons: [
      'Rollback requires the previous version to understand the schema and data produced during transition.',
      'Matching build metadata does not establish data compatibility with the old version.',
      'New-client fixtures do not exercise old servers or old persisted representations.',
      'A migration can finish first yet still make old instances unable to operate.',
    ],
  },
  {
    id: 'fs-s-f-revocation-budget',
    topic: 'Identity and security',
    prompt:
      'A permission cache has a five-minute TTL, but access revocation must take effect within ten seconds. What architecture matches that requirement?',
    options: [
      'Shorten the UI refresh period while retaining the server TTL.',
      'Enforce a bounded revocation check or invalidation at access time.',
      'Hide revoked resources after the next successful mutation.',
      'Extend session expiry so a user keeps one consistent identity.',
    ],
    answer: 1,
    reasons: [
      'More UI reads do not bypass stale server permission decisions.',
      'The authoritative access path must meet the ten-second bound rather than rely on a five-minute cache.',
      'The requirement applies to reads and other accesses before any subsequent mutation.',
      'Session stability does not meet a resource permission revocation deadline.',
    ],
  },
  {
    id: 'fs-s-f-local-transaction',
    topic: 'Async and consistency',
    code: 'BEGIN; insert order; call remote provider; COMMIT;\nProvider has no participation in this SQL transaction.',
    prompt:
      'A checkout needs a database order and a remote payment. The payment provider does not participate in database transactions. What can a local SQL transaction guarantee?',
    options: [
      'The provider charge rolls back whenever the database rolls back.',
      'The browser receives the response before either operation commits.',
      'Atomicity of the participating database writes.',
      'One HTTP attempt produces exactly one effect in both systems.',
    ],
    answer: 2,
    reasons: [
      'A remote provider outside the transaction cannot be rolled back by the database.',
      'Database transactions do not guarantee response delivery to the browser.',
      'The system needs separate state, idempotency, and reconciliation for the remote effect.',
      'Exactly-once cross-system behavior is not established by a local transaction alone.',
    ],
  },
  {
    id: 'fs-s-f-journey-slo',
    topic: 'Debugging and tests',
    prompt:
      'Frontend and API availability each meet target, but users often cannot finish onboarding because the verification step stalls. What measurement exposes the gap?',
    options: [
      'The number of healthy containers averaged across the hour.',
      'The fraction of API requests returning any 2xx response.',
      'The success rate of rendering the first onboarding page.',
      'Completion and latency of the entire eligible onboarding journey.',
    ],
    answer: 3,
    reasons: [
      'Container health can coexist with a broken multi-step user journey.',
      'Individual request success does not establish that a user reached the required final state.',
      'The first page excludes the verification step causing failures.',
      'Journey completion measures the customer outcome and reveals failures between components.',
    ],
  },
  {
    id: 'fs-s-f-extraction',
    topic: 'Architecture',
    prompt:
      'A reporting workload causes latency spikes in checkout. The team has limited operational capacity. Which first proposal best tests whether a service extraction is justified?',
    options: [
      'Measure contention, then trial bounded workload isolation.',
      'Split both flows into services before identifying the shared bottleneck.',
      'Adopt separate databases immediately because the screens have different names.',
      'Keep one unbounded shared worker pool and increase every timeout.',
    ],
    answer: 0,
    reasons: [
      'Evidence and a bounded isolation experiment can establish whether a new operational boundary solves the problem.',
      'Splitting without locating contention may preserve the bottleneck and add distributed failure modes.',
      'Screen names alone do not justify separate consistency and operational boundaries.',
      'Longer timeouts leave resource contention and queue growth unaddressed.',
    ],
  },
  {
    id: 'fs-s-f-consistency-budget',
    topic: 'Caching',
    prompt:
      'Public descriptions may be five minutes stale; permissions and checkout totals may not use stale values. What should the cache policy follow?',
    options: [
      'A single five-minute TTL for every endpoint to simplify operations.',
      'The consistency and authorization requirements of each representation.',
      'A browser-wide preference that selects the longest available lifetime.',
      'The average update frequency of the largest table in the database.',
    ],
    answer: 1,
    reasons: [
      'A uniform lifetime violates the stricter guarantees of sensitive and authoritative decisions.',
      'Different data paths have different tolerance for staleness and require explicit policies.',
      'A client preference cannot relax server security or purchase invariants.',
      'A table-wide average does not represent the risks of each consumer and decision.',
    ],
  },
  {
    id: 'fs-s-f-delete-propagation',
    topic: 'Identity and security',
    prompt:
      'Deleting an account removes its primary rows, but exports and search indexes retain copies. What defines a complete deletion design?',
    options: [
      'Successful deletion of the user’s browser session cookie.',
      'A database transaction that ignores downstream read models.',
      'An inventory of copies with bounded deletion and verification workflows.',
      'A UI redirect that makes the deleted profile route unavailable.',
    ],
    answer: 2,
    reasons: [
      'Session removal does not remove copies stored by other systems.',
      'A primary transaction does not automatically delete data in external stores.',
      'Known replicas, derived stores, and exports need explicit propagation and evidence of completion.',
      'Hiding a route does not demonstrate removal from stored copies.',
    ],
  },
  {
    id: 'fs-s-f-retry-budget',
    topic: 'Performance',
    prompt:
      'Browser, gateway, and API each retry three times during an outage. Why is a shared retry budget useful?',
    options: [
      'It guarantees that one of the retries will reach a healthy dependency.',
      'It makes non-idempotent operations safe without server changes.',
      'It removes the need to classify validation and authorization failures.',
      'It bounds amplified work across layers under the same user operation.',
    ],
    answer: 3,
    reasons: [
      'A retry budget cannot make an unavailable dependency healthy.',
      'Retry count control does not establish duplicate-effect protection.',
      'Failure classification remains necessary to avoid useless or unsafe retries.',
      'Layered retries can multiply load, so a coordinated budget constrains total work.',
    ],
  },
  {
    id: 'fs-s-f-feature-contract',
    topic: 'Delivery',
    prompt:
      'A server flag enables a new response shape for 10% of requests. A user may hit either shape on consecutive requests. What is the key rollout flaw?',
    options: [
      'The flag allocation is not aligned with a compatible consumer contract.',
      'The percentage should be larger to expose incompatibilities faster.',
      'The response schema can be inferred safely from the percentage alone.',
      'A shorter HTTP cache lifetime will make old consumers accept both shapes.',
    ],
    answer: 0,
    reasons: [
      'Consumers need compatible shapes or a stable version/capability policy, not random incompatible payloads.',
      'A larger rollout increases exposure without solving incompatible consumers.',
      'The rollout percentage does not tell a consumer which schema a response will use.',
      'Cache lifetime cannot expand the set of response shapes an old consumer understands.',
    ],
  },
  {
    id: 'fs-s-f-monotonic-state',
    topic: 'Async and consistency',
    code: 'received: payment paid, version=12\nreceived later: payment pending, version=11',
    prompt:
      'A payment projection receives paid and then an older pending event. Which rule protects the user-visible state?',
    options: [
      'Apply events in the order their HTTP deliveries reach the service.',
      'Check event version and allowed state transitions before applying.',
      'Let the browser pick whichever status has a newer local timestamp.',
      'Refetch the page after every event without changing projection rules.',
    ],
    answer: 1,
    reasons: [
      'Delivery order can differ from the order in which events occurred.',
      'Version and transition checks prevent stale messages from regressing a confirmed state.',
      'Browser clocks do not establish the provider’s authoritative transition order.',
      'A refetch still reads the wrong projection if its update rule is unsafe.',
    ],
  },
  {
    id: 'fs-s-f-trace-sampling',
    topic: 'Debugging and tests',
    prompt:
      'Only 1% of traces are retained, and rare reconciliation failures are hard to investigate. Which policy improves evidence without retaining all private payloads?',
    options: [
      'Log complete payment requests for the sampled successful journeys.',
      'Remove sampling and keep every request body indefinitely.',
      'Retain failed reconciliation traces with opaque IDs and safe fields.',
      'Record only deployment timestamps and remove operation identifiers.',
    ],
    answer: 2,
    reasons: [
      'Sampling successful payloads may miss the target failure and unnecessarily exposes private data.',
      'Unbounded payload retention is disproportionate and does not focus on the needed evidence.',
      'Outcome-aware retention preserves useful failure context while minimizing sensitive data.',
      'Without operation identity, correlating cross-system failures becomes harder.',
    ],
  },
  {
    id: 'fs-s-f-contract-evolution',
    topic: 'Contracts',
    code: 'command created: schema v1, day 1\nserver deploys: schema v2, day 3\nclient reconnects: day 7',
    prompt:
      'An API needs to tighten validation, but offline clients can submit queued commands up to seven days later. What must the migration plan account for?',
    options: [
      'The new web bundle’s build duration as the full client lifetime.',
      'The current session cookie expiry as proof no old command remains.',
      'The number of active server instances at rollout completion.',
      'The age and schema of accepted queued commands.',
    ],
    answer: 3,
    reasons: [
      'An offline command can outlive the build and deployment interval.',
      'A refreshed session may still submit a command created under an older schema.',
      'Server count does not reveal the schema of queued client commands.',
      'The transition must define how older commands are validated, translated, or rejected recoverably.',
    ],
  },
];

const seniorPractical: Item[] = [
  {
    id: 'fs-s-p-expand-rollback',
    topic: 'Delivery',
    prompt:
      'A rollout adds currency to invoices. Old servers read amount alone. New servers start writing euros into the old amount column. Rollback must preserve correct charges. What is the safest next step?',
    code: 'old interpretation: amount is USD cents\nnew row: amount=1000, currency=EUR\nold server still serving 40% of traffic',
    options: [
      'Gate new writes behind an old-reader-safe representation.',
      'Finish deployment faster so old servers disappear before more reads occur.',
      'Rollback the browser bundle while leaving mixed-currency rows in place.',
      'Hide the currency label until all servers report the new release.',
    ],
    answer: 0,
    reasons: [
      'The data semantics already violate old readers; compatibility requires separating or explicitly gating new representations.',
      'Faster rollout does not protect current reads or make later rollback safe.',
      'Old browsers and servers still misinterpret existing euro amounts as dollars.',
      'Presentation changes cannot repair an authoritative monetary interpretation.',
    ],
  },
  {
    id: 'fs-s-p-dual-write',
    topic: 'Async and consistency',
    prompt:
      'Profile updates write a database and search index separately. The database succeeds; search fails. The UI needs a truthful saved state and eventual discovery. Which design fits?',
    code: 'db update v22: committed\nindex update v22: timeout\nGET profile -> v22\nsearch -> v21',
    options: [
      'Return failure and roll the browser back to v21 without recording recovery.',
      'Confirm the durable profile update and queue durable index reconciliation.',
      'Repeat the database update with a new version whenever search returns v21.',
      'Delete the profile so database and search both return a missing result.',
    ],
    answer: 1,
    reasons: [
      'The database has changed, so pretending the update failed leaves the UI inconsistent and recovery untracked.',
      'Separate persistence from projection freshness and reliably deliver the pending index update.',
      'Repeated profile mutations create unrelated versions and do not ensure indexing recovery.',
      'Deleting valid data is not a proportionate way to synchronize a delayed projection.',
    ],
  },
  {
    id: 'fs-s-p-cdn-tenant',
    topic: 'Identity and security',
    prompt:
      'A CDN key includes URL and locale, but not tenant. The origin authorizes correctly; cached responses bypass it. Which containment should come first?',
    code: 'tenant A -> /reports/summary -> MISS -> A data\ntenant B -> /reports/summary -> HIT -> A data',
    options: [
      'Increase the origin authorization log level and wait for more samples.',
      'Add tenantId to browser state while leaving CDN behavior unchanged.',
      'Disable shared storage for this route and purge affected cached objects.',
      'Shorten the cached response lifetime from one hour to five minutes.',
    ],
    answer: 2,
    reasons: [
      'More origin logs cannot prevent hits that never reach origin authorization.',
      'Browser state cannot partition a server-side shared cache.',
      'Stopping shared reuse and purging existing entries contains the observed disclosure before redesign.',
      'Five minutes still permits the demonstrated cross-tenant exposure.',
    ],
  },
  {
    id: 'fs-s-p-revoke-race',
    topic: 'Identity and security',
    prompt:
      'An export is queued while an employee has access. Before the worker starts, that access is revoked. Policy requires authorization at execution and download. What must happen?',
    code: '10:00 export queued as editor\n10:01 membership revoked\n10:04 worker starts\n10:06 download requested',
    options: [
      'Trust the permission snapshot saved when the export button was clicked.',
      'Authorize the download only and create the file with the old scope.',
      'Trust queue possession as proof the employee remains authorized.',
      'Recheck permission at execution and again before serving the export.',
    ],
    answer: 3,
    reasons: [
      'The stated policy rejects relying solely on enqueue-time authority.',
      'This violates execution-time authorization and may create an unauthorized sensitive artifact.',
      'A queued command survives changes in the actor’s permissions.',
      'Both required boundaries need current authorization and safe handling of revoked jobs.',
    ],
  },
  {
    id: 'fs-s-p-payment-reconcile',
    topic: 'Async and consistency',
    prompt:
      'The provider timed out after accepting an idempotent payment request. Its status API is also unavailable. A user wants to retry immediately. What should the application do?',
    code: 'operation=pay-81 state=awaiting_provider\nprovider request timeout\nstatus lookup timeout\nlocal order remains pending',
    options: [
      'Keep it pending and reconcile with the same operation ID.',
      'Create a new payment key so the provider sees an independent attempt.',
      'Mark the order failed and release the cart as proof no payment exists.',
      'Mark it paid because the provider accepted the TCP connection.',
    ],
    answer: 0,
    reasons: [
      'Neither failure nor success is known; stable identity and reconciliation preserve recovery without a second logical charge.',
      'A new key can produce a duplicate payment if the original succeeded.',
      'Timeouts do not prove that no charge exists and releasing resources may complicate recovery.',
      'A network connection does not establish a completed payment.',
    ],
  },
  {
    id: 'fs-s-p-fencing',
    topic: 'Async and consistency',
    prompt:
      'A report worker loses its lease, pauses, then resumes after a replacement worker publishes a newer report. What prevents the old worker from overwriting the new artifact?',
    code: 'worker A lease token=17\nlease expires\nworker B token=18 publishes\nworker A resumes and attempts publish',
    options: [
      'Have each worker check the local clock just before upload.',
      'Make storage reject writes carrying an older fencing token.',
      'Increase the lease duration until pauses are unlikely.',
      'Choose whichever artifact has the lexicographically larger filename.',
    ],
    answer: 1,
    reasons: [
      'A local clock check alone does not atomically prevent stale writes at the shared resource.',
      'The write target can enforce that an obsolete lease generation cannot publish.',
      'Longer leases reduce frequency but do not establish correctness after a long pause.',
      'Filename order does not represent valid ownership of the publish right.',
    ],
  },
  {
    id: 'fs-s-p-schema-capability',
    topic: 'Delivery',
    prompt:
      'A new UI needs a pricing breakdown, but half the API fleet still returns only a total. The release cannot pause sales. Which transition is viable?',
    options: [
      'Require the new fields immediately and retry any old-server response.',
      'Route by random request ID so each server gets equal traffic.',
      'Deploy compatible API support first, then enable the UI capability.',
      'Remove the total field so old clients are forced onto the new UI.',
    ],
    answer: 2,
    reasons: [
      'Retries may keep hitting old servers and do not make missing capability reliable.',
      'Random routing distributes incompatible responses rather than addressing the contract.',
      'An expand-first rollout establishes the required capability before dependent consumers use it.',
      'Breaking old clients conflicts with uninterrupted sales and does not update open tabs.',
    ],
  },
  {
    id: 'fs-s-p-distributed-deadline',
    topic: 'Performance',
    prompt:
      'The browser abandons checkout after 3 seconds, but each internal service uses a fresh 3-second timeout. Queued work continues for 9 seconds. Which change bounds wasted work?',
    code: 'browser budget=3s\ngateway -> pricing -> inventory -> quote\neach hop resets timeout=3s',
    options: [
      'Increase the browser timeout to the sum of all service defaults.',
      'Retry each service once when its individual timer expires.',
      'Give every service the same request ID without propagating time limits.',
      'Propagate the remaining deadline and cancel work where safe.',
    ],
    answer: 3,
    reasons: [
      'A larger user wait may hide the mismatch but does not create a coherent operation budget.',
      'Additional retries amplify work after the customer has stopped waiting.',
      'Correlation helps diagnosis but does not bound execution.',
      'A shared deadline lets each hop respect the actual remaining journey budget.',
    ],
  },
  {
    id: 'fs-s-p-slo-denominator',
    topic: 'Debugging and tests',
    prompt:
      'Checkout reports 99.9% success by counting only requests that reach the order API. A frontend exception prevents 8% of attempts from making a request. What should the success denominator include?',
    code: 'browser checkout intents=10,000\norder API received=9,200\nAPI confirmed=9,191',
    options: [
      'Eligible user checkout attempts, including failures before API dispatch.',
      'Only order API requests with a valid server trace identifier.',
      'Only sessions that displayed a receipt page at least once.',
      'Only purchases whose payment provider returned within one second.',
    ],
    answer: 0,
    reasons: [
      'The user journey begins before the API, so pre-dispatch failures belong in its outcome measure.',
      'Requiring a server trace excludes the frontend failures being investigated.',
      'Selecting sessions with receipts biases the measure toward successful journeys.',
      'A provider latency filter excludes relevant failures and changes the measured population.',
    ],
  },
  {
    id: 'fs-s-p-backfill-race',
    topic: 'Delivery',
    prompt:
      'A background backfill copies display_name into normalized_name. Live writes update both. A delayed backfill writes an older normalized value after a live edit. What guards against this?',
    code: 'backfill reads version 4: "Ana"\nlive edit commits version 5: "Anya"\nbackfill writes normalized="ana"',
    options: [
      'Pause the browser refresh until the backfill reports completion.',
      'Condition the backfill update on the source version it read.',
      'Sort the backfill by user ID in descending order instead.',
      'Run the backfill twice and accept the last stored value.',
    ],
    answer: 1,
    reasons: [
      'A browser pause does not prevent a stale server-side write.',
      'A version predicate detects that the source changed and avoids overwriting the newer derived value.',
      'Traversal order does not remove concurrent edits to a given row.',
      'Another pass can encounter the same race unless the update is guarded.',
    ],
  },
  {
    id: 'fs-s-p-ordered-events',
    topic: 'Async and consistency',
    prompt:
      'A fulfillment view processes events with the shown versions. How should it handle the final delivery?',
    code: 'Order v31: packed\nOrder v33: shipped\nOrder v32: label_created (arrives last)',
    options: [
      'Apply label_created because its message arrived most recently.',
      'Delete the order until all queues have no delayed messages.',
      'Acknowledge delivery without regressing the state.',
      'Emit a new packing command to make the state sequence repeat.',
    ],
    answer: 2,
    reasons: [
      'Delivery order is not the authoritative order’s version order.',
      'A delayed event does not invalidate the newer confirmed shipped state.',
      'The projection should not regress from v33 to v32, while deduplication and audit can acknowledge delivery.',
      'Replaying a physical operation is not a safe way to repair event ordering.',
    ],
  },
  {
    id: 'fs-s-p-write-skew',
    topic: 'Async and consistency',
    prompt:
      'Two PostgreSQL transactions each see two on-call engineers, then remove a different engineer. The requirement is at least one on call. Which design enforces the cross-row invariant?',
    code: 'T1: count(on_call)=2; remove Alice\nT2: count(on_call)=2; remove Bob\nBoth act on distinct rows',
    options: [
      'Use a client debounce so each browser submits at most once.',
      'Lock only the individual engineer row each transaction removes.',
      'Use read committed and rerun the same unguarded count after saving.',
      'Serialize the invariant check or use serializable transactions with retry.',
    ],
    answer: 3,
    reasons: [
      'Different clients can still perform the conflicting operations concurrently.',
      'The transactions modify different rows, so those row locks alone do not serialize the shared count invariant.',
      'A post-save count observes the problem after the invariant may already be violated.',
      'A shared locking protocol or serializable execution with whole-transaction retry addresses this anomaly.',
    ],
  },
  {
    id: 'fs-s-p-cache-stampede',
    topic: 'Performance',
    prompt:
      'A popular public catalog entry expires and 8,000 requests rebuild it concurrently. Rebuilds take two seconds and overwhelm the database. Which control directly limits duplicate regeneration?',
    code: 'cache expiry 12:00:00\n8,000 misses -> 8,000 identical aggregate queries',
    options: [
      'Coalesce regeneration and serve permitted stale data during refresh.',
      'Lower the TTL so the cache is refreshed more frequently.',
      'Retry every failed rebuild immediately from the browser.',
      'Move the same aggregate query into every API instance’s startup.',
    ],
    answer: 0,
    reasons: [
      'Single-flight or equivalent coordination bounds rebuild work; permitted stale serving protects latency.',
      'More expirations can increase regeneration pressure without coordination.',
      'Immediate retries amplify the overload.',
      'Startup execution does not coordinate demand-driven regeneration or later expiry.',
    ],
  },
  {
    id: 'fs-s-p-ssrf-preview',
    topic: 'Identity and security',
    prompt:
      'A URL-preview service fetches user URLs from a privileged network. A public URL redirects to an internal metadata endpoint. Which protection must cover the redirect chain?',
    code: 'https://public.example/preview -> 302\nLocation: http://169.254.169.254/...',
    options: [
      'Validate the initial URL’s visible hostname before following redirects.',
      'Enforce destination and egress policy for every connection and redirect.',
      'Require the initial URL string to contain an HTTPS prefix.',
      'Hide the preview UI for accounts created in the last hour.',
    ],
    answer: 1,
    reasons: [
      'An initial hostname check misses a later redirect to a prohibited address.',
      'Each resolved connection and redirect needs enforcement; network egress controls add a stronger boundary.',
      'The initial scheme does not constrain later destinations or network addresses.',
      'Account age does not make a user-supplied network destination safe.',
    ],
  },
  {
    id: 'fs-s-p-deletion-lineage',
    topic: 'Identity and security',
    prompt:
      'A privacy deletion removes primary data, but nightly exports recreate it from a delayed queue. What missing mechanism should the design add?',
    code: '09:00 account deleted\n09:05 delayed ProfileUpdated event consumed\n09:10 export includes deleted profile',
    options: [
      'Filter deleted profiles only in the download page’s presentation layer.',
      'Delete the current export and leave event processing unchanged.',
      'Propagate deletion state so stale events cannot resurrect the account.',
      'Rebuild the export more frequently from the same delayed events.',
    ],
    answer: 2,
    reasons: [
      'A display filter does not stop stale events from recreating stored personal data.',
      'A one-time deletion is undone by the demonstrated replay behavior.',
      'A deletion marker or equivalent authoritative policy must dominate stale updates across derived stores.',
      'More frequent processing repeats the resurrection unless semantics change.',
    ],
  },
  {
    id: 'fs-s-p-offline-command',
    topic: 'Contracts',
    prompt:
      'A seven-day-old offline booking command reconnects after pricing rules changed. The user must approve a changed price. Which server response supports a safe flow?',
    code: 'queued quoteVersion=7, total=10000\ncurrent quoteVersion=9, total=12000\noperation has not yet executed',
    options: [
      'Charge 12000 because current server pricing is authoritative.',
      'Charge 10000 because offline commands retain price authority.',
      'Replace the queued payload silently and report a successful retry.',
      'Return a repricing conflict and require confirmation of a new quote.',
    ],
    answer: 3,
    reasons: [
      'Authoritative pricing does not override the stated need for user approval of a changed charge.',
      'A stale client quote is not sufficient authority under the current contract.',
      'Silent replacement changes the meaning of the command without consent.',
      'A recoverable conflict preserves intent while obtaining confirmation for the current price.',
    ],
  },
  {
    id: 'fs-s-p-release-signal',
    topic: 'Debugging and tests',
    prompt:
      'A canary has normal API error rates but a sharp drop in completed password resets. Which rollout decision is best supported?',
    code: 'canary API 5xx=0.1% (baseline 0.1%)\nreset completion=62% (baseline 94%)\nreset starts stable; client validation errors rise',
    options: [
      'Pause the canary and investigate the degraded reset journey.',
      'Proceed because the backend availability signal is unchanged.',
      'Increase rollout to 100% to collect more reset completion data.',
      'Remove validation telemetry so it matches the backend error rate.',
    ],
    answer: 0,
    reasons: [
      'The customer outcome regressed despite healthy service status; the canary should stop widening exposure.',
      'Backend availability misses the client validation regression.',
      'Expanding a known degradation harms more users without a need for wider exposure.',
      'Discarding a useful signal does not fix the broken journey.',
    ],
  },
  {
    id: 'fs-s-p-bounded-query',
    topic: 'Performance',
    prompt:
      'A bulk permission endpoint accepts arbitrary resource IDs and returns every matching object. One user sends 100,000 IDs, causing high memory use. What contract change addresses the amplification?',
    options: [
      'Compress the final JSON more aggressively after constructing it.',
      'Bound input and response work, with pagination or a controlled job path.',
      'Raise the process memory limit without changing per-request work.',
      'Let the browser decide how many IDs the server should consider safe.',
    ],
    answer: 1,
    reasons: [
      'Compression after construction does not bound parsing, query, or in-memory result costs.',
      'Explicit limits and a separate controlled bulk path constrain resource consumption.',
      'More memory may postpone failure but leaves unbounded caller-controlled amplification.',
      'The server must enforce limits against clients that bypass interface guidance.',
    ],
  },
  {
    id: 'fs-s-p-hydration-private',
    topic: 'Identity and security',
    prompt:
      'A server-rendered page injects private account JSON into HTML. The CDN caches HTML by path, while API responses use no-store. Which conclusion follows?',
    code: 'GET /dashboard HTML: public, max-age=300\n<script type="application/json">{"account":"Alice"}</script>\nGET /api/account: no-store',
    options: [
      'The API header protects every representation containing the same data.',
      'The injected JSON is safe because it is not executable JavaScript.',
      'The HTML response itself needs a private-data-safe caching policy.',
      'The browser will strip the injected JSON before a shared cache sees it.',
    ],
    answer: 2,
    reasons: [
      'Cache directives apply to their own responses, not all representations of the underlying record.',
      'Non-executable JSON can still disclose private data when another user receives it.',
      'Sensitive data in HTML creates an independent response-cache boundary.',
      'The CDN sees the server’s HTML before any browser processing.',
    ],
  },
  {
    id: 'fs-s-p-dual-tab-refresh',
    topic: 'Identity and security',
    prompt:
      'Single-flight refresh works within one tab, but two tabs race rotating the same session credential. What additional scope must the design address?',
    code: 'tab A refresh token R -> R1\ntab B refresh token R -> rejected\ntab B clears shared login state',
    options: [
      'Give each fetch call a unique component-level request counter.',
      'Increase the refresh-token size to reduce random collisions.',
      'Debounce the login button in each tab independently.',
      'Coordinate tab refreshes or tolerate rotation replays.',
    ],
    answer: 3,
    reasons: [
      'A counter scoped to a request or component does not coordinate browser tabs.',
      'The race uses the same legitimate token, not an accidental token collision.',
      'Independent debouncing does not coordinate expiry-driven refresh in different tabs.',
      'The concurrency boundary spans tabs, requiring cross-tab coordination or a deliberate server policy.',
    ],
  },
  {
    id: 'fs-s-p-compensation',
    topic: 'Async and consistency',
    prompt:
      'A booking reserves inventory, charges payment, then fails to confirm the reservation. Refunds are asynchronous and can fail. Which UI and workflow model is truthful?',
    options: [
      'Record compensation pending and expose tracked recovery until resolved.',
      'Erase the booking and show failure as though no charge occurred.',
      'Mark the refund complete when its request enters the queue.',
      'Repeat the full booking with a fresh payment identity automatically.',
    ],
    answer: 0,
    reasons: [
      'Compensation is another fallible operation and needs durable state, reconciliation, and visible status.',
      'Deleting the record hides an existing charge and removes recovery context.',
      'Queue acceptance is not proof that money was refunded.',
      'A fresh booking can create another charge while the first remains unresolved.',
    ],
  },
  {
    id: 'fs-s-p-time-skew',
    topic: 'Debugging and tests',
    prompt:
      'Browser telemetry appears to precede a server request by 900 ms. Their clocks are not synchronized. What should diagnosis rely on?',
    code: 'browser wall time: 10:00:00.100 submit op=88\nserver wall time: 09:59:59.200 receive op=88',
    options: [
      'Subtract the wall-clock timestamps and report negative network latency.',
      'Correlate operation IDs and use local monotonic durations within spans.',
      'Discard all server spans whose timestamps precede browser events.',
      'Sort every event by timestamp and infer causality from that total order.',
    ],
    answer: 1,
    reasons: [
      'Cross-host clock differences make that subtraction unsuitable as a latency measure.',
      'Correlation establishes relationship; monotonic local timing measures durations without cross-host clock assumptions.',
      'Discarding spans loses valid evidence merely because clocks differ.',
      'Wall-clock ordering can contradict real causality when clocks are skewed.',
    ],
  },
  {
    id: 'fs-s-p-test-matrix',
    topic: 'Delivery',
    prompt:
      'A form-schema rollout supports two client versions and two server versions. Which test matrix covers the overlap and rollback requirement?',
    options: [
      'New client with new server, plus screenshots of the old client.',
      'Old client with old server, repeated under higher network latency.',
      'Supported cross-version pairs, including data written before rollback.',
      'Each server’s health endpoint called once by the new client.',
    ],
    answer: 2,
    reasons: [
      'The new-new happy path misses old-new and rollback interactions.',
      'The old-old pair does not exercise the migration boundary.',
      'Compatibility includes mixed versions and whether rollback can consume newly written data.',
      'Health endpoints rarely validate the evolving form and persistence contract.',
    ],
  },
  {
    id: 'fs-s-p-backpressure',
    topic: 'Architecture',
    prompt:
      'Export jobs grow faster than workers can process them. Increasing workers saturates the primary database and harms checkout. Which response protects both journeys under a fixed database budget?',
    code: 'exports queue age: 2m -> 30m\nworkers: 8 -> 40\ncheckout p95: 250ms -> 3s\nDB CPU: 97%',
    options: [
      'Keep increasing workers until the export queue stops growing.',
      'Lower checkout timeouts so failures release browser connections sooner.',
      'Raise export priority in the same unrestricted connection pool.',
      'Limit export concurrency and admission, isolate budgets, and show queue status.',
    ],
    answer: 3,
    reasons: [
      'More workers add contention to the already saturated shared dependency.',
      'Shorter browser waits do not remove the competing database workload.',
      'Prioritizing exports further risks the critical checkout journey.',
      'Backpressure and resource budgets bound interference while a truthful queued state supports users.',
    ],
  },
];

const fundamentalsExercises: Record<Tier, Exercise[]> = {
  junior: [
    {
      id: 'fs-j-f-ex-contract',
      title: 'Trace a support-ticket contract',
      prompt:
        'Write a request/response worksheet for creating a support ticket with subject and message. Include the browser input, HTTP request, server validation, stored owner, successful response, and two invalid payloads. Show which layer owns each decision.',
      reference:
        'The browser collects labeled fields and sends JSON matching the declared media type. The server derives ownership from the verified session and validates both strings. A successful response returns the stored ID; field errors preserve the draft. Direct malformed requests are rejected before insertion.',
      criteria: [
        'Maps browser, HTTP, server, and storage boundaries.',
        'Defines concrete success and field-error payloads.',
        'Derives owner from trusted identity.',
        'Includes malformed and missing-field examples.',
      ],
    },
    {
      id: 'fs-j-f-ex-session',
      title: 'Audit a shared-browser session',
      prompt:
        'Draw a sequence for Alice viewing invoices, logging out, and Bob signing in on the same tab. Include a delayed Alice response arriving after Bob signs in. List the UI and cache transitions needed to keep Alice’s invoices out of Bob’s view.',
      reference:
        'Tag private requests and cached results with the active session scope. Logout removes private visible state and cache entries; a session generation changes so old responses cannot repopulate them. Bob receives only data fetched under his verified identity, with resource authorization on the server.',
      criteria: [
        'Shows the delayed response explicitly.',
        'Clears or partitions private cache state.',
        'Rejects stale session updates.',
        'Keeps server resource authorization in the sequence.',
      ],
    },
    {
      id: 'fs-j-f-ex-evidence',
      title: 'Diagnose a false save confirmation',
      prompt:
        'Given a UI that displays Saved immediately, an API returning 422 for an empty title, and a database with no new record, produce a short incident explanation and corrected state table. Include pending, invalid, successful, and connection-failure states.',
      reference:
        'The UI confirmed intent before receiving evidence. Await the response, branch on status and the validated body, and confirm only the durable success contract. A 422 is a field correction state; a connection failure keeps the draft and avoids asserting either success or server rejection.',
      criteria: [
        'Explains the causal order using the supplied evidence.',
        'Distinguishes 422 from a transport failure.',
        'Preserves draft values on recoverable failures.',
        'Defines the transition that permits Saved.',
      ],
    },
  ],
  mid: [
    {
      id: 'fs-m-f-ex-versioning',
      title: 'Specify an evolving profile API',
      prompt:
        'Write a compatibility note for renaming fullName to displayName while week-old tabs remain active. Provide accepted payload examples, a deterministic rule for both fields being present, runtime validation errors, rollout phases, and a measurable retirement condition.',
      reference:
        'First accept the old and new shapes with a documented precedence rule or reject conflicting values. Preserve responses old consumers can read, then ship the new client. Track old-contract usage without private payloads, retain rollback compatibility, and remove support only after the supported overlap window closes.',
      criteria: [
        'Covers old client against new server.',
        'Defines conflicting-field behavior.',
        'Includes a runtime-invalid payload.',
        'Gives observable migration and removal gates.',
      ],
    },
    {
      id: 'fs-m-f-ex-cache-map',
      title: 'Map a product edit to its read models',
      prompt:
        'A product edit changes name, category, and price. Produce a dependency map covering detail, category list, search, cart display, and authoritative checkout. Assign cache keys, invalidation or reconciliation actions, and a test for one stale response arriving after the edit.',
      reference:
        'Keys include representation inputs and relevant tenant scope. Reconcile the confirmed detail response, invalidate affected category and search views, and distinguish stale cart presentation from server-authoritative checkout pricing. Use a version or request-generation guard so a stale background read cannot overwrite confirmed data.',
      criteria: [
        'Identifies every affected representation.',
        'Separates presentation cache from checkout authority.',
        'Includes scoped keys and targeted invalidation.',
        'Tests a delayed stale read after confirmation.',
      ],
    },
    {
      id: 'fs-m-f-ex-outcome',
      title: 'Model an uncertain payment attempt',
      prompt:
        'Create a state diagram and API examples for a payment that can time out after provider success. Include the operation key, same-key retry, changed-payload retry, status lookup, and what the browser displays while the provider cannot be reached.',
      reference:
        'Persist operation identity with a request fingerprint and states such as pending, succeeded, or failed. A timeout remains unresolved; same-key retries recover the original result, while changed semantics are rejected. Authorize status lookups and use bounded provider reconciliation before changing the visible outcome.',
      criteria: [
        'Keeps one identity across retries of one operation.',
        'Rejects conflicting key reuse.',
        'Represents uncertainty without a false success or failure.',
        'Protects status lookup by owner or tenant.',
      ],
    },
  ],
  senior: [
    {
      id: 'fs-s-f-ex-rollout',
      title: 'Review a currency migration for rollback',
      prompt:
        'Design a migration from implicit USD cents to explicit multi-currency invoices. Old browser and API versions can remain active for 48 hours, and rollback must work after new records exist. Deliver a compatibility matrix, schema sequence, write gates, and rollback decision criteria.',
      reference:
        'Do not reinterpret the old amount column for old readers. Expand the representation and define which versions may write each currency. Keep an old-readable path or gate unsupported records, exercise mixed versions and persisted data during rollback, and delay destructive cleanup until the compatibility window and recovery evidence permit it.',
      criteria: [
        'States the monetary representation invariant.',
        'Covers persisted new data during rollback.',
        'Defines feature and write gates across mixed versions.',
        'Includes explicit validation and retirement evidence.',
      ],
    },
    {
      id: 'fs-s-f-ex-revocation',
      title: 'Design a bounded export revocation path',
      prompt:
        'A tenant requires revoked access to stop new exports and downloads within ten seconds. Exports queue for minutes and signed download URLs currently last one hour. Produce a threat model and architecture sketch spanning UI, queue, workers, caches, and object delivery.',
      reference:
        'Do not rely on enqueue-time permissions or an hour-long bearer URL for a ten-second revocation guarantee. Reauthorize execution and delivery, bound cache invalidation or verification time, and use a delivery mechanism whose revocation semantics meet the requirement. Audit delayed jobs and prevent obsolete session responses from repopulating private UI.',
      criteria: [
        'Identifies all access and cache boundaries.',
        'Explains why the existing download URL violates the bound.',
        'Defines execution-time and download-time checks.',
        'Provides a timed revocation test and failure policy.',
      ],
    },
    {
      id: 'fs-s-f-ex-boundaries',
      title: 'Choose a reporting isolation strategy',
      prompt:
        'Checkout p95 rises from 250 ms to 3 s during exports. Database CPU reaches 97%, but the team can operate only one deployment today. Compare at least two isolation options, specify a constrained experiment, and state what evidence would justify a later service extraction.',
      reference:
        'Start with measured contention and enforce export admission, concurrency, and database budgets within the current deployment. Compare scheduled or replica-backed reads where freshness allows. A separate service is justified only if it gives a concrete ownership or isolation benefit beyond moving the same saturated database calls across a network.',
      criteria: [
        'Uses the supplied bottleneck evidence.',
        'Respects the operational capacity constraint.',
        'Defines measurable checkout and export success criteria.',
        'Explains remaining consistency and operational costs.',
      ],
    },
  ],
};

const practicalExercises: Record<Tier, Exercise[]> = {
  junior: [
    {
      id: 'fs-j-p-ex-contact',
      title: 'Build a recoverable contact form',
      prompt:
        'Implement or provide executable pseudocode for a contact form and POST handler. Require a nonempty subject and message, preserve input on 422 and network failure, and show confirmation after a stored ticket is returned. Supply valid, invalid, and failed-transport test cases.',
      reference:
        'Serialize a JSON payload and validate it independently on the server. Derive any account ownership from verified identity, await persistence, and return the canonical ticket ID. The browser tracks pending separately from field errors, checks HTTP status, preserves the draft on failure, and confirms only a valid successful result.',
      criteria: [
        'Shows both browser and server validation.',
        'Uses correct request and response contracts.',
        'Preserves the draft and clears pending after errors.',
        'Tests a subsequent read of the saved ticket.',
      ],
    },
    {
      id: 'fs-j-p-ex-search',
      title: 'Reproduce and fix stale search results',
      prompt:
        'Build a small search controller with a fake transport whose responses you can resolve manually. Send ca followed by cat, complete cat first, and then complete ca. Demonstrate the bug and supply a fix with a test that the visible term and rows remain paired.',
      reference:
        'Assign each query a generation and update state only if the completing request still belongs to the current query. Cancellation can reduce work but must not be treated as proof that no stale callback can run. Keep pending and error updates under the same relevance guard.',
      criteria: [
        'Controls completion order without arbitrary sleeps.',
        'Reproduces the stale overwrite before the fix.',
        'Guards results and loading or error updates.',
        'Verifies rows match the latest term.',
      ],
    },
    {
      id: 'fs-j-p-ex-private-notes',
      title: 'Test a private note boundary',
      prompt:
        'Create an integration test plan or runnable tests for Alice creating a note, Alice reading it, and Bob requesting the same ID directly. Add a shared-browser account switch after Alice’s data has been cached. Specify both response assertions and visible-state assertions.',
      reference:
        'Creation uses Alice’s verified identity and a durable read confirms the stored record. The API denies Bob access to Alice’s note without returning its private content. Account switching clears or scopes private state and rejects Alice’s delayed responses so Bob does not see them through cache reuse.',
      criteria: [
        'Tests the server with a direct cross-user request.',
        'Verifies actual persistence after creation.',
        'Exercises one browser with two identities.',
        'Checks that denied responses do not contain note content.',
      ],
    },
  ],
  mid: [
    {
      id: 'fs-m-p-ex-optimism',
      title: 'Implement concurrent optimistic edits',
      prompt:
        'Implement a task-board update controller that handles two overlapping optimistic edits to one task. Resolve the later edit successfully, then fail the first edit. Deliver a deterministic test showing that rollback does not discard the successful edit or apply a stale server snapshot.',
      reference:
        'Track operation identities and the confirmed resource version separately from pending patches. Reconcile each outcome against the current confirmed base, remove only the failed operation’s contribution, and recompute the visible state. Guard stale responses and retain a recoverable conflict path when edits cannot be merged safely.',
      criteria: [
        'Models confirmed state and pending operations separately.',
        'Controls success and failure order in the test.',
        'Preserves the later confirmed change.',
        'Defines stale-version and conflict behavior.',
      ],
    },
    {
      id: 'fs-m-p-ex-upload',
      title: 'Secure a direct-upload workflow',
      prompt:
        'Design request contracts and tests for issuing an upload authorization, uploading an object, and attaching it to a project. Include attempts to attach another tenant’s object, finalize an expired upload, and reuse a finalized authorization for a different project.',
      reference:
        'Issue a scoped, expiring authorization bound to actor, tenant, destination, and object identity. Finalization verifies that binding and current project permissions before recording the attachment, with explicit replay semantics. Treat client filenames, object keys, and progress reports as untrusted claims.',
      criteria: [
        'Binds upload authority to a specific scope and object.',
        'Rechecks permissions at finalization.',
        'Defines expiry and replay behavior.',
        'Includes all three negative test cases.',
      ],
    },
    {
      id: 'fs-m-p-ex-contract-ci',
      title: 'Catch a response contract drift in CI',
      prompt:
        'Create a small provider/consumer test where a cart API changes from total to totalCents. Demonstrate that an isolated mocked UI test can still pass, then add a provider-backed contract test and a compatible migration. Include a runtime-invalid response fixture.',
      reference:
        'The consumer fixture must be checked against the actual provider representation, including units rather than merely numeric types. Add the new representation in a compatible phase with a clear unit contract, migrate consumers, and validate network payloads before rendering. The invalid fixture should fail at the boundary with controlled UI feedback.',
      criteria: [
        'Exposes the stale-mock failure mode.',
        'Verifies real provider output against consumer needs.',
        'Tests units and runtime shape.',
        'Demonstrates old and new client compatibility during rollout.',
      ],
    },
  ],
  senior: [
    {
      id: 'fs-s-p-ex-saga',
      title: 'Exercise booking compensation failures',
      prompt:
        'Build a state-machine prototype for reserve inventory, charge payment, and confirm booking. Inject a failure after payment success, then make the first refund attempt time out. Deliver the transition table, durable operation records, retry rules, and user-visible states with deterministic tests.',
      reference:
        'Use stable operation identities and explicit pending, confirmed, and compensating states. A refund request is not a confirmed refund; reconcile its provider outcome and keep the booking’s recovery record. Enforce allowed transitions and deduplicate repeated events so late pending messages cannot overwrite terminal outcomes.',
      criteria: [
        'Does not erase a charged but unconfirmed booking.',
        'Treats compensation as a fallible tracked operation.',
        'Tests duplicates, reordered events, and a lost response.',
        'Provides bounded retry and operational recovery ownership.',
      ],
    },
    {
      id: 'fs-s-p-ex-backfill',
      title: 'Prove a migration survives live writes',
      prompt:
        'Implement a deterministic simulation of a backfill from display_name to normalized_name while live edits continue. Pause the backfill after reading version 4, commit a version 5 edit, then resume it. Add a rollback reader and show that mixed versions remain correct.',
      reference:
        'Make backfill writes conditional on the source version or equivalent unchanged-source predicate, and retry or skip rows that changed. Keep old readers supported through an expand/transition/contract rollout. Tests must exercise persisted data after rollback, not merely compile both versions in isolation.',
      criteria: [
        'Reproduces the stale-backfill schedule.',
        'Prevents overwriting a newer live edit.',
        'Verifies old and new readers against migrated records.',
        'Defines completion and destructive-cleanup gates.',
      ],
    },
    {
      id: 'fs-s-p-ex-journey',
      title: 'Investigate a green-services broken journey',
      prompt:
        'Produce an incident analysis from 10,000 checkout intents, 9,200 API requests, 9,191 confirmed orders, and client validation errors after a canary rollout. Define a journey metric, a privacy-conscious correlation plan, containment, and a release test that catches the pre-dispatch failure.',
      reference:
        'The API success ratio hides 800 intents that never reached it. Measure eligible attempts through confirmed outcomes and segment by release, while linking browser and server events using opaque IDs. Pause the canary, preserve failed-journey evidence without raw payment data, and add a mixed-version browser-to-provider contract test.',
      criteria: [
        'Uses the full eligible journey denominator.',
        'Distinguishes frontend failures from API failures.',
        'Defines containment and measurable recovery evidence.',
        'Adds a targeted release test and safe correlation fields.',
      ],
    },
  ],
};

const tierFundamentals: Record<Tier, Item[]> = {
  junior: juniorFundamentals,
  mid: midFundamentals,
  senior: seniorFundamentals,
};
const tierPractical: Record<Tier, Item[]> = {
  junior: juniorPractical,
  mid: midPractical,
  senior: seniorPractical,
};

export function fullstackBank(tier: Tier): RoleBank {
  return {
    fundamentals: bank([...coreFundamentals, ...tierFundamentals[tier]]),
    practical: bank([...corePractical, ...tierPractical[tier]]),
    fundamentalsExercises: fundamentalsExercises[tier],
    practicalExercises: practicalExercises[tier],
  };
}
