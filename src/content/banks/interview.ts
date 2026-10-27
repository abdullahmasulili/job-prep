import { bank, type Item } from '../bank';
import type { Exercise, Role, Tier } from '../types';
type Row = [
  string,
  string,
  [string, string, string, string],
  number,
  [string, string, string, string],
];
const common: Row[] = [
  [
    'clarification',
    'An interviewer asks for a duplicate detector but gives no definition of duplicate. Which question most directly establishes correctness?',
    [
      'Preserve input order?',
      'Do matching IDs or matching records count?',
      'Return the first duplicate?',
      'What should empty input return?',
    ],
    1,
    [
      'Ordering matters to the output format but does not define when two items are duplicates.',
      'The equality rule determines which records should match.',
      'Result cardinality matters after the equality relation has been defined.',
      'Empty-input behavior does not distinguish IDs from full-record equality.',
    ],
  ],
  [
    'evidence',
    'Support staff reported fewer complaints after your feature shipped, but no production metrics were collected. Which claim is supportable?',
    [
      'The error rate fell',
      'Customer retention improved',
      'Support reported fewer complaints',
      'The feature prevented the reported errors',
    ],
    2,
    [
      'A qualitative support observation does not measure an error rate or its denominator.',
      'No retention data or causal comparison was collected.',
      'Attribute the observation to support and explain that frequency and causality were not measured.',
      'Fewer complaints do not prove the specific errors were prevented.',
    ],
  ],
  [
    'ownership',
    'A team delivered a service; you designed validation and tests. Which opening accurately scopes your contribution?',
    [
      'Our team delivered the completed service',
      'I owned the end-to-end service design',
      'I implemented the service API and validation',
      'Validation and test ownership',
    ],
    3,
    [
      'This credits the team but leaves your individual contribution unspecified.',
      'The facts establish validation and tests, not ownership of the complete design.',
      'The stated contribution does not include implementing the API.',
      'This identifies the actual responsibility within the team result.',
    ],
  ],
  [
    'tradeoffs',
    'An answer says “we chose a queue because it scales.” What follow-up best tests the decision?',
    [
      'Which workload, failure modes, and delivery guarantees?',
      'Single-message latency?',
      'What did the client integration cost?',
      'Could the team operate the chosen queue?',
    ],
    0,
    [
      'The workload and delivery contract determine whether queueing meets the system need.',
      'A single-message latency does not establish behavior under load or delivery failures.',
      'Integration cost is relevant but cannot establish the promised scaling behavior.',
      'Operational familiarity matters but does not establish capacity or delivery semantics.',
    ],
  ],
  [
    'debugging',
    'A proposed fix passes one reproduction test. Which closing statement accurately describes the evidence?',
    [
      'The regression proves rollout readiness',
      'The repro passes; other checks remain',
      'This defect alone caused the failure',
      'Production-load verification passed',
    ],
    1,
    [
      'A focused reproduction does not establish broader regression or rollout readiness.',
      'This distinguishes the observed result from behavior that has not been checked.',
      'A passing fix does not exclude other contributors to the original failure.',
      'A local reproduction is not a production-load verification.',
    ],
  ],
  [
    'communication',
    'You have two minutes to describe a project. Which structure gives the interviewer the clearest evidence?',
    [
      'Requirements, tools, architecture diagram',
      'Chronological tickets and release milestones',
      'Problem, action, evidence, result',
      'Team outcome, system overview, future plans',
    ],
    2,
    [
      'This can explain the system while omitting personal actions and evidence of results.',
      'Chronology can consume the short answer without exposing the key decision or outcome.',
      'This connects the need, personal work, verification, and observed result.',
      'This leaves the interviewer without a clear account of your contribution or validation.',
    ],
  ],
  [
    'clarification',
    'A coding task says “return the top customers.” Which unresolved detail changes the result most directly?',
    [
      'Maximum result count',
      'Whether the list refreshes on each request',
      'Whether archived customers stay visible',
      'Ranking metric, date range, and tie-breaking rule',
    ],
    3,
    [
      'A limit determines how many results appear but not which customers qualify as top.',
      'Refresh timing affects freshness but does not define ranking.',
      'Membership scope matters but still leaves the meaning of top unresolved.',
      'The metric and tie behavior determine the expected order and selected results.',
    ],
  ],
  [
    'tradeoffs',
    'The interviewer changes a requirement from batch to live updates. What should your next step address?',
    [
      'Review constraints',
      'Use shorter batches',
      'Replace the batch system with a stream processor',
      'Keep the design and add a freshness disclaimer',
    ],
    0,
    [
      'Establish the required latency and affected guarantees before selecting changes.',
      'A shorter interval may help, but its adequacy depends on the new latency and load requirements.',
      'A streaming design is one candidate, not a conclusion supported by the requirement change alone.',
      'A disclaimer does not establish whether the design meets the new contract.',
    ],
  ],
  [
    'evidence',
    'You claim a 30% speedup. What missing context is essential for evaluating that number?',
    [
      'Fastest new run',
      'Baseline workload, measurement method, and variability',
      'The total runtime of the benchmark suite',
      'The new version’s deployment configuration',
    ],
    1,
    [
      'A best-case result does not supply a comparable baseline or typical behavior.',
      'These establish what was compared and whether attribution to the change is meaningful.',
      'A total suite time can combine unrelated work and still lack a matched baseline.',
      'The new configuration alone does not reveal whether the baseline used comparable conditions.',
    ],
  ],
  [
    'ownership',
    'An incident involved several teams. Which phrasing best separates your work from the joint outcome?',
    [
      'I restored service by joining the incident response',
      'Our teams restored service through several changes',
      'I traced retries; the team recovered',
      'I owned recovery because I found one defect',
    ],
    2,
    [
      'Joining the response does not establish that your work caused the full restoration.',
      'This describes the joint result but omits the personal action being assessed.',
      'It names a specific personal contribution and the shared result.',
      'Finding one defect does not establish ownership of every recovery action.',
    ],
  ],
  [
    'communication',
    'You do not know whether a runtime guarantees an ordering. Which response is most useful?',
    [
      'Assume the ordering seen in the sample run',
      'Choose a design that ignores the ordering issue',
      'Pause until the interviewer supplies the guarantee',
      'State and verify assumptions',
    ],
    3,
    [
      'One observation cannot establish a runtime guarantee across executions or versions.',
      'Avoiding ordering may be viable only if the task permits it; the assumption still needs to be surfaced.',
      'The candidate can propose a documentation check or discriminating test without outsourcing the decision.',
      'Make the uncertainty explicit and explain the evidence needed to resolve it.',
    ],
  ],
  [
    'debugging',
    'Your solution fails on an empty input during the interview. What demonstrates a controlled response?',
    [
      'Trace the empty-input failure and verify its correction',
      'Add an early return',
      'Rewrite the loop using a more familiar pattern',
      'Add logging to the passing sample first',
    ],
    0,
    [
      'Tracing a small failing case links the defect to a verifiable correction.',
      'An early return may mask the symptom without establishing the required empty-input behavior.',
      'A rewrite changes more variables before the defect is understood.',
      'The known passing case is less direct evidence for the empty-input failure.',
    ],
  ],
];
const tierRows: Record<Tier, Row[]> = {
  junior: [
    [
      'clarification',
      'A list function must not alter the caller’s input. Which example best clarifies that requirement?',
      [
        'Call twice and compare returned values',
        'Compare input before and after the call',
        'Verify that the return value is a new object',
        'Check that the function has no global writes',
      ],
      1,
      [
        'Stable outputs do not rule out mutation of the caller’s input.',
        'The comparison directly tests the stated nonmutation contract.',
        'A function can allocate a new result and still mutate its argument.',
        'Argument mutation can occur without any global state change.',
      ],
    ],
    [
      'evidence',
      'You built a practice project without real customers. How should you describe its result?',
      [
        'Describe behavior and tests',
        'Report projected revenue as the project’s impact',
        'Call test traffic real usage',
        'Present the configured uptime target as achieved',
      ],
      0,
      [
        'Identify the practice context and describe the behavior and checks actually observed.',
        'A projection can be discussed as a projection, but it is not an observed customer result.',
        'Synthetic traffic does not establish use by real customers.',
        'A target is a design goal rather than measured operational availability.',
      ],
    ],
    [
      'debugging',
      'Your first implementation works for [1,2,3]. Which follow-up better probes its boundaries?',
      [
        'Try a longer ascending list',
        'Try distinct positive values',
        'Try empty input and repeated values',
        'Run the passing input through a benchmark',
      ],
      2,
      [
        'A larger happy-path input checks scale but may preserve the same untested assumptions.',
        'Changing values while retaining shape and uniqueness adds limited boundary coverage.',
        'These challenge both the minimum size and the equality assumptions.',
        'Timing the known passing input does not probe missing correctness boundaries.',
      ],
    ],
    [
      'communication',
      'You reach a 20-minute coding limit with a working baseline but no optimization. What should you explain?',
      [
        'Detail the unfinished optimization',
        'Estimate production capacity from the sample run',
        'Call the samples complete coverage',
        'Explain cost and remaining tradeoffs',
      ],
      3,
      [
        'The unfinished approach should not displace an accurate account of the working result.',
        'One sample run does not establish capacity for a production workload.',
        'Examples demonstrate particular cases, not every supported input.',
        'Describe the working baseline, its complexity, and when an alternative would help.',
      ],
    ],
    [
      'tradeoffs',
      'For a small fixed collection, you choose a linear scan over an index. Which rationale fits the stated scope?',
      [
        'Lower setup cost for a small fixed input',
        'Post-build lookup cost',
        'A tree index handles future growth more easily',
        'The scan uses fewer statements in this version',
      ],
      0,
      [
        'The bounded workload may not justify creating and maintaining an index.',
        'Post-build lookup cost omits setup and maintenance costs for the stated small workload.',
        'Future growth can matter, but it is not part of the fixed scope stated here.',
        'Source length alone does not establish runtime or total implementation cost.',
      ],
    ],
    [
      'ownership',
      'You followed a tutorial and added offline recovery yourself. What should the walkthrough distinguish?',
      [
        'Describe the finished application as a team result',
        'Separate the scaffold from your recovery work',
        'Explain the tutorial architecture before any changes',
        'Attribute the complete project to the tutorial author',
      ],
      1,
      [
        'This leaves the boundary between borrowed code and personal work unclear.',
        'That distinction gives proper attribution and exposes your actual contribution.',
        'Architecture context helps but does not identify which decisions and code were yours.',
        'Full attribution to the tutorial understates the recovery behavior you designed yourself.',
      ],
    ],
    [
      'clarification',
      'An interviewer asks you to sort dates. Which question avoids an important ambiguity?',
      [
        'Use a stable sort?',
        'Use a built-in comparison utility?',
        'Do the dates include time zones?',
        'Retain the original date strings?',
      ],
      2,
      [
        'Stability affects equal values but first requires a definition of chronological equality.',
        'A utility choice cannot resolve what the date values mean.',
        'Time zones can change the chronological relationship between displayed date strings.',
        'Output formatting matters, but does not establish the input’s time interpretation.',
      ],
    ],
    [
      'debugging',
      'You suspect an off-by-one bug. Which explanation best makes your reasoning inspectable?',
      [
        'Describe the loop’s purpose',
        'Change the bound and run the happy path',
        'Compare with a familiar example',
        'Trace the indices on a small case',
      ],
      3,
      [
        'Intent does not show whether the implementation visits the correct endpoints.',
        'A passing happy path may miss the skipped or extra element.',
        'A similar pattern can have different boundary assumptions.',
        'A concrete index trace exposes exactly where traversal diverges from the contract.',
      ],
    ],
    [
      'communication',
      'The interviewer asks why a test matters. Which answer links it to a requirement?',
      [
        'It checks that another user is denied',
        'It exercises a helper branch',
        'It verifies the mock returns null',
        'It reaches the required coverage target',
      ],
      0,
      [
        'The assertion directly expresses the observable resource-access requirement.',
        'Calling a helper branch does not establish the endpoint denies unauthorized access.',
        'A mock returning null can make the test pass without exercising real access control.',
        'A percentage does not identify which required behavior the test proves.',
      ],
    ],
    [
      'evidence',
      'A teammate gave you a solution you then modified. What is a credible account?',
      [
        'Describe the final solution alone',
        'Credit the starting point and explain your changes',
        'Leave your modifications implicit',
        'Omit the shared design',
      ],
      1,
      [
        'Omitting the starting point can misrepresent independent authorship.',
        'This preserves attribution and makes the added reasoning assessable.',
        'The interviewer still needs to understand your individual contribution.',
        'The origin and shared design are relevant to accurately scoping your work.',
      ],
    ],
    [
      'tradeoffs',
      'Your algorithm uses O(n) extra space to avoid repeated searches. What should you be ready to explain?',
      [
        'Average lookup time',
        'Compare concise and expanded source',
        'Explain memory cost against saved searches',
        'Report the fastest observed run of each approach',
      ],
      2,
      [
        'Construction time and retained storage are part of the cost being traded.',
        'Source presentation does not quantify algorithmic resource usage.',
        'Relate extra storage to the avoided work for expected sizes and constraints.',
        'A single fastest run cannot explain space complexity or workload sensitivity.',
      ],
    ],
    [
      'ownership',
      'A feature was cancelled before release. Which result can your interview story honestly report?',
      [
        'Report the forecast as delivered savings',
        'Call expected adoption measured usage',
        'Omit the cancellation',
        'A prototype result and what it taught',
      ],
      3,
      [
        'A forecast remains hypothetical even if the prototype supports its assumptions.',
        'An unreleased feature has no measured production adoption.',
        'Omitting cancellation makes the business case sound like an observed outcome.',
        'Unreleased work can still supply concrete evidence and learning when accurately labeled.',
      ],
    ],
  ],
  mid: [
    [
      'tradeoffs',
      'Two designs meet requirements. A is simpler today; B reduces a measured scaling bottleneck at twice the operating cost. What should the recommendation compare?',
      [
        'Current demand and scaling triggers',
        'Implementation time',
        'Maximum throughput of the complex design',
        'The team’s familiarity with each architecture',
      ],
      0,
      [
        'Compare lifecycle costs against measured demand and a threshold for revisiting the choice.',
        'Near-term effort omits whether the known bottleneck already affects required capacity.',
        'Peak throughput alone omits operating cost and whether that capacity is needed.',
        'Familiarity is a real cost factor but does not settle the workload and economics tradeoff.',
      ],
    ],
    [
      'ownership',
      'You owned delivery but another engineer found the root cause. Which account is accurate?',
      [
        'I diagnosed the root cause and led the rollout',
        'They diagnosed it; I owned the rollout',
        'I supported the diagnostician',
        'The team fixed it through shared ownership',
      ],
      1,
      [
        'That takes credit for diagnostic work performed by another engineer.',
        'The account distinguishes diagnosis from your actual delivery responsibility.',
        'This understates the stated ownership and hides concrete coordination work.',
        'A team result alone does not explain your individual actions.',
      ],
    ],
    [
      'debugging',
      'An interviewer provides rising p99, stable median, and saturated database connections. Which hypothesis best fits?',
      [
        'A uniform execution slowdown',
        'Costlier SQL on each connection',
        'Some requests queue for connections',
        'Longer frontend rendering',
      ],
      2,
      [
        'A uniform slowdown would generally affect the median as well as the tail.',
        'That is possible, but saturation directly supports an acquisition-queue hypothesis that needs checking.',
        'Resource saturation can add waits to a subset of requests while median latency remains stable.',
        'The provided database evidence is a more direct lead than client rendering.',
      ],
    ],
    [
      'communication',
      'A stakeholder asks if a delayed feature can ship Friday. Two required integration checks are unresolved. What is useful?',
      [
        'Promise Friday; verify during rollout',
        'Send the raw logs',
        'Give a probability without the open checks',
        'Present options tied to the open checks',
      ],
      3,
      [
        'A promised date hides unresolved acceptance conditions and risks shifting verification into production.',
        'Raw logs do not translate the technical blockers into delivery choices.',
        'A probability alone gives little basis for choosing scope or deciding which evidence is needed.',
        'Explain the scope options, evidence needed, and consequences for the requested date.',
      ],
    ],
    [
      'evidence',
      'A performance story compares a cold-cache baseline to a warm-cache new version. What should be acknowledged?',
      [
        'Cache state confounds the comparison',
        'The result proves the new algorithm is faster',
        'The cache difference cancels automatically',
        'Only the sample count needs to increase',
      ],
      0,
      [
        'Comparable cache conditions are needed to attribute the effect.',
        'Two changed variables prevent that conclusion.',
        'No stated mechanism cancels the cache difference.',
        'More samples of a confounded setup do not isolate the cause.',
      ],
    ],
    [
      'clarification',
      'You are asked to design file uploads for a product. Which opening most affects architecture?',
      [
        'Choose a storage provider',
        'Clarify sizes, access, and recovery',
        'Estimate storage cost from the current user count',
        'Choose multipart transfer for all clients',
      ],
      1,
      [
        'Provider selection is premature before workload and access requirements are established.',
        'These requirements determine limits, trust boundaries, and retry behavior.',
        'User count alone does not establish file sizes, retention, access patterns, or recovery needs.',
        'A transfer mechanism should follow the size and client constraints, not substitute for them.',
      ],
    ],
    [
      'tradeoffs',
      'A teammate prefers a different caching strategy. Both meet the latency goal but differ on freshness. What evidence can resolve the disagreement?',
      [
        'Median cache-read latency',
        'Implementation size',
        'The allowed stale-data window',
        'The team’s prior experience with each strategy',
      ],
      2,
      [
        'Both proposals already meet the latency goal; freshness distinguishes their suitability.',
        'Implementation effort is relevant but does not establish acceptable data age.',
        'The freshness contract determines which strategy satisfies the unresolved requirement.',
        'Experience helps estimate cost but cannot override the product freshness boundary.',
      ],
    ],
    [
      'ownership',
      'You delegated part of a feature. What demonstrates effective ownership in your story?',
      [
        'Describe your own code',
        'Explain the delegate’s qualifications',
        'Present delegated work as your implementation',
        'Explain contracts, review, and integration',
      ],
      3,
      [
        'Personal code is only part of coordinating the joint result you owned.',
        'Choosing an engineer does not show how interfaces or acceptance were managed afterward.',
        'That obscures the delegate’s authorship and your actual coordination contribution.',
        'These actions demonstrate how you enabled and verified delivery across contributors.',
      ],
    ],
    [
      'debugging',
      'A test fails only under two simultaneous requests. What interview follow-up probes the fix?',
      [
        'Show the interleaving and invariant',
        'Request thread count',
        'Repeat the sequential regression after the patch',
        'Describe the lock without tracing both requests',
      ],
      0,
      [
        'The interleaving links the failure to the shared guarantee the fix must preserve.',
        'Thread counts do not establish whether competing operations preserve the invariant.',
        'Sequential execution does not reproduce the concurrency trigger.',
        'A lock name is insufficient without showing its scope across the relevant operations.',
      ],
    ],
    [
      'communication',
      'Your first design is challenged with a plausible failure case. What response demonstrates judgment?',
      [
        'Restate the old assumptions',
        'Trace the failure and revisit the assumption',
        'Adopt the alternative without comparing costs',
        'Rely on the existing passing tests',
      ],
      1,
      [
        'The new failure case requires examining whether those assumptions still hold.',
        'Work through the evidence, then change the parts whose assumptions fail.',
        'Accepting an alternative without analysis hides the reason for changing direction.',
        'Passing tests do not address a scenario outside their coverage.',
      ],
    ],
    [
      'evidence',
      'You reduced support tickets after a UX change, while user count also halved. Which metric makes the comparison more informative?',
      [
        'Median handling time',
        'Monthly ticket volume',
        'Tickets per active user, by issue type',
        'Percentage of users exposed to the new interface',
      ],
      2,
      [
        'Handling time measures support effort but does not normalize how often users encounter the issue.',
        'Raw monthly volume is confounded by the changed active-user population.',
        'Normalizing exposure and separating the targeted issue makes the comparison more informative.',
        'Exposure to the UI is useful context but alone does not measure support incidence.',
      ],
    ],
    [
      'clarification',
      'A checkout design prompt says retries are allowed. Which requirement must be clarified?',
      [
        'The client’s retry budget',
        'The client’s HTTP timeout',
        'Whether retries use exponential backoff',
        'How repeated operations are identified',
      ],
      3,
      [
        'A retry budget limits load but does not establish whether attempts repeat the same logical action.',
        'A timeout determines waiting behavior rather than duplicate-effect prevention.',
        'Backoff controls timing and pressure, not operation identity.',
        'Identity determines whether repeated attempts can safely reuse a persisted result.',
      ],
    ],
  ],
  senior: [
    [
      'clarification',
      'A notification platform must be designed. Which unanswered requirement most changes delivery architecture?',
      [
        'Delivery guarantees by channel',
        'Advertised throughput',
        'The expected dashboard query frequency',
        'The preferred notification-template editor',
      ],
      0,
      [
        'Delivery and channel requirements shape durability, retries, and recovery boundaries.',
        'Provider capacity helps size a chosen design but does not define the required delivery contract.',
        'Dashboard reads matter operationally but do not establish notification-delivery semantics.',
        'Template editing is a product concern that does not determine the delivery guarantee.',
      ],
    ],
    [
      'tradeoffs',
      'A rewrite promises lower maintenance cost but requires a year-long parallel run. Which comparison makes the recommendation defensible?',
      [
        'Rewrite effort versus current support cost',
        'Lifecycle costs and risks on both paths',
        'Replacement implementation time',
        'Dependency count times current upgrade cost',
      ],
      1,
      [
        'That comparison omits coexistence, migration, and future costs on both paths.',
        'Include migration, parallel operation, ongoing maintenance, and the risk of staying.',
        'The year-long overlap may dominate costs excluded from implementation estimates.',
        'Dependency count can inform maintenance cost but does not quantify migration or operational risk.',
      ],
    ],
    [
      'ownership',
      'A staff-level candidate claims “I made the team faster.” Which evidence best supports the mechanism?',
      [
        'A faster-review team survey',
        'Changes merged after they joined',
        'A process change with measured cycle times',
        'A reduced review target announced to the team',
      ],
      2,
      [
        'Perceptions are useful but less direct evidence of the mechanism and elapsed time.',
        'Merge volume can change with staffing and scope without demonstrating faster review.',
        'A concrete intervention linked to measured flow makes the mechanism assessable.',
        'A target expresses intent rather than an observed improvement.',
      ],
    ],
    [
      'evidence',
      'A migration pilot improved p95 for small tenants; large tenants were excluded. What limitation should the recommendation state?',
      [
        'Apply the pilot gain to large tenants',
        'Postpone every decision',
        'Treat lower p95 as proof of migration safety',
        'Large-tenant behavior remains untested',
      ],
      3,
      [
        'Large-tenant workload and data movement were outside the pilot population.',
        'The pilot still supports bounded decisions about the population it covered.',
        'Latency improvement does not by itself establish correctness or migration safety.',
        'Identify the missing population and require representative validation before extending the claim.',
      ],
    ],
    [
      'debugging',
      'A system-design interviewer asks what happens after a crash between database commit and event send. What should your answer establish?',
      [
        'Durable intent and a recovery path',
        'Retry in the request handler',
        'Keep the event in the publisher’s memory queue',
        'Increase the publishers available for failover',
      ],
      0,
      [
        'A persisted obligation lets another process recover the send after the original process crashes.',
        'The request handler disappears in the stated crash, so its local retry is insufficient.',
        'The same crash can destroy an in-memory event before it is sent.',
        'Other publishers cannot reconstruct an event whose publication intent was never stored.',
      ],
    ],
    [
      'tradeoffs',
      'A feature deadline competes with reliability work. Which proposal supports a stakeholder decision?',
      [
        'Fund the entire reliability backlog',
        'Quantify risk and offer staged scope',
        'Ship with monitoring',
        'Let product choose by roadmap order',
      ],
      1,
      [
        'Prioritization needs the actual exposure and commitments rather than treating all reliability work alike.',
        'Options connect technical risk and evidence to delivery consequences.',
        'Monitoring helps detection but may not mitigate the risk that conflicts with safe delivery.',
        'Roadmap order alone omits the technical risk evidence needed for this decision.',
      ],
    ],
    [
      'communication',
      'A senior answer lists six services but no failure behavior. Which follow-up reveals system understanding?',
      [
        'Explain datastore ownership',
        'Trace the success path',
        'Trace an operation through partial failure',
        'Compare service implementation frameworks',
      ],
      2,
      [
        'Data ownership matters but does not expose recovery behavior across service boundaries.',
        'The success path omits the missing consistency, retry, and failure semantics.',
        'A failure trace reveals consistency, recovery, and responsibility boundaries.',
        'Framework choices do not establish what happens after a partial success.',
      ],
    ],
    [
      'ownership',
      'An architectural decision you sponsored failed. What account shows useful accountability?',
      [
        'Describe implementation defects',
        'Repeat the original recommendation and constraints',
        'Describe the replacement and its measured improvement',
        'Explain missed signals and recovery',
      ],
      3,
      [
        'Implementation issues matter, but this leaves your sponsored decision and missed evidence unexamined.',
        'Original reasoning is relevant but incomplete without confronting the failure and response.',
        'A replacement result does not explain accountability for the earlier decision.',
        'Connect the original evidence, your part in the missed signals, and the recovery actions.',
      ],
    ],
    [
      'evidence',
      'A new platform reduced deployment time but increased on-call burden. How should impact be presented?',
      [
        'Report both results and their costs',
        'Report deployment time alone',
        'Translate on-call hours into a guessed revenue impact',
        'Combine them into an unexplained impact score',
      ],
      0,
      [
        'The actual lifecycle tradeoff includes both delivery improvement and operational burden.',
        'Omitting the support change hides a material cost of the platform decision.',
        'No causal or valuation basis for that conversion has been supplied.',
        'A combined score needs explicit units, weighting, and assumptions to be meaningful.',
      ],
    ],
    [
      'clarification',
      'Two teams own separate services, but neither owns failed checkout recovery. What requirement should the design add?',
      [
        'A shared health dashboard',
        'Accountability for end-to-end recovery',
        'A local error-rate target for each service owner',
        'A common incident-status channel',
      ],
      1,
      [
        'Visibility helps, but still leaves reconciliation and customer recovery without an accountable owner.',
        'Assign responsibility for coordinating diagnosis and reconciliation across service boundaries.',
        'Both local targets can pass while the customer’s operation remains incomplete.',
        'A communication channel does not establish who must drive the failed operation to resolution.',
      ],
    ],
    [
      'tradeoffs',
      'You recommend extracting a service. Which evidence most directly justifies the new boundary?',
      [
        'Harder code navigation',
        'A different storage preference',
        'Scaling gains exceed coordination costs',
        'A preference for separate release schedules',
      ],
      2,
      [
        'Navigation problems can often be solved within the existing deployment boundary.',
        'A technology preference is not evidence that distributed operational costs are justified.',
        'This compares a concrete separation benefit against its network and operating costs.',
        'Release autonomy may help, but preference alone does not demonstrate its value relative to added coordination.',
      ],
    ],
    [
      'communication',
      'An interviewer challenges your proposed consistency guarantee. What strengthens the answer?',
      [
        'The strong-consistency label',
        'The selected write configuration',
        'Historical partition frequency',
        'Define invariants and failure assumptions',
      ],
      3,
      [
        'The label leaves the operations and failure scope of the guarantee unspecified.',
        'A configuration choice still needs a clear statement of the application invariant it supports.',
        'Failure frequency informs availability risk but does not define correctness during a failure.',
        'Precise scope makes the guarantee, its assumptions, and its costs testable.',
      ],
    ],
  ],
};
export function interviewBank(tier: Tier) {
  return bank(
    [...common, ...tierRows[tier]].map(([topic, prompt, options, answer, reasons], i): Item => ({
      id: `int-v2-${tier}-${i + 1}`,
      topic,
      prompt,
      options,
      answer,
      reasons,
    })),
  );
}
export function interviewExercises(role: Role, tier: Tier): Exercise[] {
  const scope =
    tier === 'junior'
      ? 'a bounded task'
      : tier === 'mid'
        ? 'a feature you owned'
        : 'a system or cross-team decision';
  const scenario = {
    frontend: 'a search interface',
    backend: 'an order API',
    fullstack: 'a checkout journey',
  }[role];
  return [
    {
      id: 'debug-story',
      title: 'Explain a difficult diagnosis',
      prompt: `Describe a defect in ${scope}. Give the symptoms, two competing hypotheses, the evidence that separated them, and the regression check. Follow-up: what evidence would have disproved your first hypothesis?`,
      reference:
        'Structure the answer around observations and experiments. Separate your actions from the team’s. Show a failing case, why one hypothesis survived, and the specific check that guarded the fix. State any uncertainty; label hypothetical stories.',
      criteria: [
        'I distinguished observations from hypotheses.',
        'I described my action and a concrete verification.',
        'I answered the follow-up with falsifying evidence.',
      ],
    },
    {
      id: 'tradeoff-story',
      title: 'Defend a design under constraints',
      prompt: `Design ${scenario} for ${tier === 'junior' ? 'a small defined workload' : tier === 'mid' ? 'a growing product with a tight release date' : 'independent teams with compatibility and recovery requirements'}. Compare two viable approaches. Follow-up: traffic increases tenfold; what would you revisit first?`,
      reference:
        'Begin with the contract and workload. Compare two viable designs against those constraints, name the cost of your choice and a measurable trigger to revisit it. The follow-up should change a specific assumption rather than automatically cause a rewrite.',
      criteria: [
        'I stated workload and correctness requirements.',
        'I compared plausible alternatives and their costs.',
        'I identified a measurable trigger for changing the choice.',
      ],
    },
    {
      id: 'conflict-story',
      title: 'Work through a disagreement',
      prompt: `Rehearse a two-minute account of a disagreement about ${scope}. Explain shared goals, the competing proposals, your response and the outcome. Follow-up: what did the other person understand that you initially missed?`,
      reference:
        'Use a specific situation and give the other proposal a fair account. Describe evidence or a small experiment, not rank or personal criticism, as the basis for resolution. Acknowledge your contribution and what you learned from the other person.',
      criteria: [
        'I fairly described both positions.',
        'I named a specific action that moved the decision forward.',
        'I explained what I learned or would change.',
      ],
    },
    {
      id: 'failure-story',
      title: 'Discuss a decision that failed',
      prompt: `Describe a decision about ${scenario} that did not work as expected, using a real or clearly labeled hypothetical example. Follow-up: which signal should have prompted an earlier change?`,
      reference:
        'Explain the original constraints and evidence, the missed or unavailable signal, the consequence and recovery. Own your part without claiming responsibility for everything. End with a concrete change to the decision or detection process.',
      criteria: [
        'I explained the original reasoning without hindsight certainty.',
        'I described impact, personal accountability and recovery.',
        'I named an earlier signal and a specific process change.',
      ],
    },
    {
      id: 'impact-story',
      title: 'Present evidence without exaggerating',
      prompt: `Prepare a two-minute impact story about ${scope}. Include baseline, your contribution, verification and limitations. Follow-up: how would your conclusion change if the workload or user population changed?`,
      reference:
        'Separate measured results, qualitative observations and projections. Give denominators and comparison conditions for numbers. Credit collaborators and discuss whether the evidence transfers to the changed population. Do not invent metrics when none were collected.',
      criteria: [
        'I separated measured results from estimates.',
        'I accurately attributed personal and team contributions.',
        'I explained a limitation of the evidence and the follow-up.',
      ],
    },
  ];
}
