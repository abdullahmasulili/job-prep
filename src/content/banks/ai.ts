import { bank, type Item } from '../bank';
import type { Exercise } from '../types';
type Row = [
  string,
  string,
  [string, string, string, string],
  number,
  [string, string, string, string],
];
const rows: Row[] = [
  [
    'review',
    'An assistant adds an order lookup using a request-supplied userId. Authentication already runs. Which missing check is decisive?',
    [
      'Authorize the order against the authenticated session identity',
      'Order existence',
      'The type of the request-supplied userId',
      'The validity of the session signature',
    ],
    0,
    [
      'Authorize the order against the trusted session identity, not the caller-supplied userId.',
      'Existence does not establish permission to retrieve someone else’s order.',
      'A well-formed userId can still identify another user.',
      'The prompt already establishes authentication; object-level permission remains to be checked.',
    ],
  ],
  [
    'verification',
    'An assistant reports tests passed, but its log says “command not found.” What is the verified result?',
    [
      'The tests passed before a logging failure',
      'The test command did not run',
      'Assertions failed',
      'Assertions passed; coverage collection failed',
    ],
    1,
    [
      'The transcript provides no successful execution of the requested test command.',
      'A missing command establishes no passing assertions; repair the environment and run the intended tests.',
      'No assertions ran, so assertion failures have not been established either.',
      'Neither successful assertions nor a coverage-specific failure appears in the evidence.',
    ],
  ],
  [
    'scope',
    'A bug fix changes the failing validator plus an unrelated authentication policy. What review action addresses scope risk?',
    [
      'Keep both changes because they share a request',
      'Accept when existing regression tests pass',
      'Justify the policy separately',
      'Treat stable API shape as evidence of safe cleanup',
    ],
    2,
    [
      'Sharing a request path does not establish that the behavior change is required for the validator fix.',
      'Existing coverage may not exercise the altered permission behavior.',
      'Require a rationale and relevant verification for the additional policy change.',
      'Authorization can change materially without changing the public request or response shape.',
    ],
  ],
  [
    'context',
    'A prompt needs to explain a production parsing failure. What input best supports reproduction without unnecessary disclosure?',
    [
      'A successful parsed object',
      'The failing payload with credentials for realism',
      'A redacted trace omitting the malformed input bytes',
      'A minimal failing payload with secrets safely substituted',
    ],
    3,
    [
      'A successful parsed value can omit the encoding or malformed syntax that causes the failure.',
      'Credentials are unnecessary unless their structure causes the failure; use nonsecret replacements.',
      'The trace can locate the failure but may not let the parser defect be reproduced.',
      'Preserve the failing structure or encoding while removing secrets and unrelated data.',
    ],
  ],
  [
    'review',
    'Generated retry code creates a new operation key on every retry. What failure can this cause?',
    [
      'Duplicate side effects',
      'Reuse of the first result',
      'Conflicting-key rejection on each fresh retry',
      'Resumption of the transaction under the new key',
    ],
    0,
    [
      'Fresh keys prevent the server from recognizing retries as the same logical operation.',
      'Different keys ordinarily identify different operations, so deduplication cannot rely on the original key.',
      'Conflict detection for reused keys does not trigger when each attempt supplies a new key.',
      'Changing the operation identity does not resume a previous transaction.',
    ],
  ],
  [
    'verification',
    'A generated test asserts only that save() was called. Which additional assertion checks the user requirement “the task survives reload”?',
    [
      'Immediate local UI update',
      'Reload and retrieve the task',
      'The save promise resolves without throwing',
      'The repository mock receives the expected fields',
    ],
    1,
    [
      'An optimistic UI can display an item that was never durably stored.',
      'Retrieving after reload directly exercises the required persisted behavior.',
      'Promise resolution alone does not prove the task survives a fresh application load.',
      'Correct mock arguments do not prove real persistence or hydration.',
    ],
  ],
  [
    'context',
    'An assistant asks for the entire repository to fix one boundary parser. What narrower context is most useful first?',
    [
      'The parser implementation alone',
      'The error message alone',
      'Contract, failing input, and callers',
      'A passing fixture and desired return type',
    ],
    2,
    [
      'Implementation alone may hide the intended boundary behavior and integration assumptions.',
      'An error message often lacks the bytes or shape required to reproduce the defect.',
      'These establish the expected behavior, reproduction, and relevant integration boundaries.',
      'A passing fixture omits the failing condition the proposed repair must address.',
    ],
  ],
  [
    'scope',
    'A generated migration drops a column before old readers are retired. Which acceptance condition is missing?',
    [
      'Migration on an empty database',
      'A completed replacement-column backfill',
      'Passing tests for new readers',
      'Compatibility with coexisting readers',
    ],
    3,
    [
      'An empty-schema check does not exercise legacy readers or live data.',
      'Backfilling a replacement does not keep an old query working after its column is dropped.',
      'The failure concerns old readers still running during deployment.',
      'Schema removal must wait until required readers no longer depend on the old column.',
    ],
  ],
  [
    'review',
    'An assistant solves a flaky test by deleting the assertion. What should determine whether that change is valid?',
    [
      'The asserted contract',
      'Whether removal stops flakes',
      'Whether a nearby test passes on the same module',
      'Whether it duplicates implementation details',
    ],
    0,
    [
      'A required behavior needs a valid check or an explicit contract change; inspect what the assertion actually proves.',
      'Stability obtained by removing the check does not show the product behavior is correct.',
      'Another passing test may cover a different case and cannot be assumed equivalent.',
      'Implementation coupling can justify redesigning the test, but first determine whether its behavior remains required.',
    ],
  ],
  [
    'verification',
    'A patch uses a package API absent from the installed version. What is the appropriate next check?',
    [
      'Latest release notes',
      'Official documentation for the exact installed package version',
      'A generated example of the same API',
      'Unrelated integration tests using the package',
    ],
    1,
    [
      'Latest-release features may be absent from the version the project actually runs.',
      'Verify the installed package and documented supported call before adapting or upgrading.',
      'Another generated example is not independent evidence that the API exists.',
      'Coverage of other calls does not establish this API’s availability.',
    ],
  ],
  [
    'context',
    'A generated diff is correct for one tenant but reads cached data without tenant identity in its key. Which review input is essential?',
    [
      'The cache eviction policy',
      'Cached-read latency target',
      'The tenant isolation and cache-key contract',
      'The cached value’s configured time-to-live',
    ],
    2,
    [
      'Eviction determines which entries remain, not whether two tenants share an entry identity.',
      'Fast reads can still disclose another tenant’s representation.',
      'The cache must preserve the identity and permission boundaries of the underlying records.',
      'A shorter lifetime can limit exposure duration but cannot make an unscoped key safe.',
    ],
  ],
  [
    'scope',
    'An assistant proposes deploying a large change after unit tests pass. A compatibility test remains red. What evidence is still missing?',
    [
      'A successful artifact build',
      'A passing unit regression for the changed helper',
      'A rollout plan with a small initial traffic percentage',
      'Compatibility verified',
    ],
    3,
    [
      'Compilation does not resolve the observed compatibility failure.',
      'A green unit subset does not establish that the failing integration contract works.',
      'A gradual rollout can limit exposure but does not explain or fix known incompatibility.',
      'Identify the failed contract and establish acceptable behavior before treating rollout as ready.',
    ],
  ],
  [
    'review',
    'Generated code catches every parsing error and returns an empty result. The contract distinguishes invalid input from no matches. What is the defect?',
    [
      'Invalid and empty outcomes are conflated',
      'Missing pagination metadata',
      'A missing cached-response fallback',
      'Insufficient retries before returning',
    ],
    0,
    [
      'The caller loses the required distinction between malformed input and a valid query with no matches.',
      'The stated contract violation is outcome classification, not pagination fields.',
      'A previous response would not communicate that the current request is invalid.',
      'Repeating deterministic parsing on the same invalid bytes does not repair the missing error outcome.',
    ],
  ],
  [
    'verification',
    'A generated performance claim compares different input sizes. What experiment would support attribution to the change?',
    [
      'More runs of each unmatched workload',
      'A matched comparison',
      'Peak memory on the two different inputs',
      'New-version timings on several smaller inputs',
    ],
    1,
    [
      'More observations reduce noise but retain the input-size confound.',
      'Comparable workload and environment make the implementation change the variable under investigation.',
      'That still changes both the implementation and input, and measures a different resource.',
      'Varying only the new version does not provide a matched old-version baseline.',
    ],
  ],
  [
    'scope',
    'A bounded assistant task is “fix keyboard activation.” Which acceptance criterion directly checks it?',
    [
      'A nonnegative tabindex',
      'Direct click-handler invocation',
      'Focus and activate the action by keyboard',
      'A successful simulated pointer click',
    ],
    2,
    [
      'Focusability alone does not prove the relevant keys activate the action correctly.',
      'Direct handler invocation bypasses focus and keyboard event behavior.',
      'Exercise focus plus the relevant keyboard interaction and verify the observable action.',
      'Pointer behavior can work while keyboard activation remains broken.',
    ],
  ],
  [
    'verification',
    'An assistant cites a source that cannot be found. What should the review record say?',
    [
      'Verified by a relevant-looking citation',
      'False: its page is unavailable',
      'Accepted pending a later documentation review',
      'Unverified; check a primary source',
    ],
    3,
    [
      'A plausible-looking citation is not verified source evidence.',
      'Missing evidence does not establish that the underlying claim is false.',
      'Deferring verification does not justify marking the unresolved claim accepted.',
      'Record the source as unverified and check the claim independently against an appropriate primary source.',
    ],
  ],
];
export const aiBank = bank(
  rows.map(([topic, prompt, options, answer, reasons], i): Item => ({
    id: `ai-v2-${i + 1}`,
    topic,
    prompt,
    options,
    answer,
    reasons,
  })),
);
export const aiExercises: Exercise[] = [
  {
    id: 'ai-acceptance',
    title: 'Turn a vague prompt into a verifiable task',
    prompt:
      'An assistant is told “make checkout more reliable.” Rewrite this as a bounded task with the relevant contracts, sanitized context, allowed changes and observable acceptance checks. Include what should trigger human review.',
    reference:
      'Name one failure, such as duplicate submission after timeout. Supply a minimal request flow, the operation identity contract and permitted files. Require a duplicate-submission regression case, a failure-path check and evidence from the actual diff. State which schema or payment-policy changes need explicit review.',
    criteria: [
      'I bounded the intended change and named an invariant.',
      'I supplied relevant sanitized context and acceptance checks.',
      'I set a review boundary for changes beyond the task.',
    ],
  },
  {
    id: 'ai-evidence',
    title: 'Audit a generated completion report',
    prompt:
      'An assistant reports: “All tests passed; latency improved 40%.” Its transcript contains an unavailable test command and one run on a smaller input. Write the review, separate confirmed facts from unsupported claims, and specify the next checks.',
    reference:
      'The test command did not establish any passing assertions. The changed workload prevents attributing the timing difference to the patch. Inspect the diff, run the intended tests in a working environment and compare performance on matched workloads with repeated observations. Record unresolved limitations explicitly.',
    criteria: [
      'I identified both unsupported claims and their evidence gaps.',
      'I proposed concrete repeatable checks.',
      'I separated implementation correctness from measurement claims.',
    ],
  },
];
