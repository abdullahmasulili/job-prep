import { bank, type Item } from '../bank';
import type { Exercise, Tier } from '../types';

type Row = [
  string,
  string,
  [string, string, string, string],
  number,
  [string, string, string, string],
];
const common: Row[] = [
  [
    'rates',
    'A job falls from 80 seconds to 60 seconds. What is the reduction relative to its original time?',
    ['20%', '25%', '33%', '75%'],
    1,
    [
      '20 is the seconds saved, not the percentage.',
      '20 divided by the original 80 is 25%.',
      'This divides by the new duration instead of the original.',
      '75% is the remaining fraction, not the saving.',
    ],
  ],
  [
    'logic',
    'Every published package passed validation. Package K failed validation. What follows from these facts?',
    [
      'K was not published',
      'K cannot be repaired',
      'Only K failed validation',
      'Every validated package shipped',
    ],
    0,
    [
      'Failure rules out publication under the stated implication.',
      'The facts say nothing about future repairs.',
      'Other packages may also have failed.',
      'Validation is necessary here, but is not stated to be sufficient.',
    ],
  ],
  [
    'tracing',
    'Count starts at zero. A loop increments it for each of seven records except the two marked archived. What is count?',
    ['2', '6', '7', '5'],
    3,
    [
      'Two is the excluded count.',
      'Exactly two records, not one, are excluded.',
      'Archived records do not increment the count.',
      'Seven minus two leaves five increments.',
    ],
  ],
  [
    'evidence',
    'Only requests without a nickname fail. Which comparison isolates whether absence matters?',
    [
      'New version with nickname vs old without',
      'Successful requests vs unrelated failures',
      'Same request with and without nickname',
      'Two missing-nickname requests at different loads',
    ],
    2,
    [
      'Version changes confound the field comparison.',
      'Unrelated requests change more than the suspected field.',
      'Holding the rest constant isolates the suspected input.',
      'Load changes introduce another possible cause.',
    ],
  ],
  [
    'rates',
    'One worker handles 12 jobs/minute while 15 arrive/minute. Starting empty, how many jobs queue after 8 minutes?',
    ['24', '96', '120', '3'],
    0,
    [
      'The excess rate is three jobs per minute for eight minutes.',
      '96 jobs are processed, not left waiting.',
      '120 arrive but most are processed.',
      'Three is the per-minute increase, not the total backlog.',
    ],
  ],
  [
    'measurement',
    'A 100 ms database call and 100 ms of other work run sequentially. Halving only the database time gives what total?',
    ['100 ms', '50 ms', '150 ms', '200 ms'],
    2,
    [
      'Only half of the original work was improved.',
      'This omits the unchanged 100 ms.',
      '50 ms database plus 100 ms other work equals 150 ms.',
      'The improved database call saves 50 ms.',
    ],
  ],
  [
    'measurement',
    'Durations are 10, 10, 11, 12, and 107 ms. Which value is the median?',
    ['30 ms', '11 ms', '12 ms', '107 ms'],
    1,
    [
      '30 ms is the arithmetic mean.',
      'The middle of the five sorted values is 11.',
      '12 is the fourth sorted observation.',
      '107 is the maximum observation.',
    ],
  ],
  [
    'uncertainty',
    'A new cache was deployed during a traffic drop and latency improved. What evidence best separates the cache effect?',
    [
      'Compare this hour with yesterday',
      'Compare request counts before and after',
      'Compare all users with cached users',
      'Compare matched concurrent control traffic',
    ],
    3,
    [
      'Time changes may include traffic and workload differences.',
      'Counts alone do not isolate a latency effect.',
      'The groups may have different workloads.',
      'Comparable concurrent groups help control the traffic change.',
    ],
  ],
  [
    'logic',
    'A rollout requires both checks A and B. A passed; B has not run. What is justified?',
    [
      'Roll out because no check failed',
      'Roll out to half the users',
      'Wait for evidence from B',
      'Treat B as a failed check',
    ],
    2,
    [
      'Lack of failure does not establish the required pass.',
      'Reduced exposure does not satisfy the stated rule.',
      'Both checks must pass before the rule permits rollout.',
      'Missing evidence is distinct from a failed result.',
    ],
  ],
  [
    'measurement',
    'An error rate changes from 2% to 3%. How should the change be described?',
    [
      'Up one percentage point',
      'Up one percent relative',
      'Down one percentage point',
      'Up three percentage points',
    ],
    0,
    [
      'Subtracting the rates gives one percentage point; relative growth is 50%.',
      'The relative increase is 1 divided by 2, or 50%.',
      'The error rate increased rather than decreased.',
      'Three percentage points would imply an initial rate of zero.',
    ],
  ],
  [
    'tracing',
    'An array has indices 0 through 5. A loop visits i=1 while i<5, incrementing i each time. How many elements does it visit?',
    ['5', '6', '3', '4'],
    3,
    [
      'The loop excludes index zero and index five.',
      'Six is the total array length.',
      'Indices 1, 2, 3 and 4 are visited.',
      'The visited indices are 1, 2, 3 and 4.',
    ],
  ],
  [
    'uncertainty',
    'A benchmark improves from 100 to 98 ms, with normal run-to-run variation of 8 ms. What can one run establish?',
    [
      'A reliable two-percent improvement',
      'An observed two-ms difference',
      'A regression within the new version',
      'An eight-percent improvement',
    ],
    1,
    [
      'One noisy observation does not establish a stable effect.',
      'The observation is real, but repeat comparable runs to estimate the effect.',
      'The measured time decreased; a regression is not established.',
      'Variation is not the measured performance change.',
    ],
  ],
];
const tierRows: Record<Tier, Row[]> = {
  junior: [
    [
      'rates',
      'A 120-second task becomes 20% faster in duration, then adds 10 seconds setup. What is the new total?',
      ['96 s', '110 s', '106 s', '100 s'],
      2,
      [
        '96 excludes the setup cost.',
        '20% of 120 is 24, not 20.',
        '120 × 0.8 + 10 = 106 seconds.',
        'This subtracts both the wrong saving and setup.',
      ],
    ],
    [
      'logic',
      'If an input is empty, validation fails. Validation passed. What follows?',
      [
        'The input was not empty',
        'The input was an email',
        'The input was saved',
        'The input was unique',
      ],
      0,
      [
        'This is the contrapositive of the stated rule.',
        'No email-format rule is given.',
        'Passing validation does not establish persistence.',
        'Uniqueness was not part of the premise.',
      ],
    ],
    [
      'tracing',
      'Starting with n=3, execute n=n+2 twice, then n=n*2. What is n?',
      ['10', '12', '16', '14'],
      3,
      [
        'This omits one addition.',
        'This does not follow the stated sequence.',
        'The value before doubling is seven, not eight.',
        'The successive values are 3 → 5 → 7 → 14.',
      ],
    ],
    [
      'measurement',
      'A file has 240 rows; 18 are invalid and 12 more are duplicates. The groups do not overlap. How many remain?',
      ['222', '210', '228', '204'],
      1,
      [
        'This removes only invalid rows.',
        '240 minus 18 minus 12 leaves 210.',
        'This removes only duplicates.',
        'The two excluded groups total 30, not 36.',
      ],
    ],
    [
      'rates',
      'Three equal tasks take 15 minutes each on one worker. With three workers and no shared bottleneck, how long for all three?',
      ['45 minutes', '5 minutes', '30 minutes', '15 minutes'],
      3,
      [
        '45 is the sequential duration.',
        'Parallelism does not shorten an individual task here.',
        'All three can begin at the same time.',
        'The longest task finishes after 15 minutes.',
      ],
    ],
    [
      'evidence',
      'A reproducible bug occurs only after clicking Save twice. Which regression case targets it?',
      [
        'Load the page twice',
        'Save once with valid data',
        'Double-save and inspect stored records',
        'Check the Save button label',
      ],
      2,
      [
        'Reloading does not recreate the triggering actions.',
        'One save misses the duplicate-submission condition.',
        'It reproduces the trigger and checks the durable outcome.',
        'The label does not verify submission behavior.',
      ],
    ],
    [
      'tracing',
      'A queue starts with A,B,C. Remove the front, append D, then remove the front. Which remains?',
      ['C,D', 'A,D', 'B,C', 'B,D'],
      0,
      [
        'A and then B leave; C and D remain.',
        'A was the first removed item.',
        'B was removed and D was appended.',
        'B leaves on the second removal.',
      ],
    ],
    [
      'rates',
      'A download is 6 MB at a constant 2 MB/s, plus 1 second connection setup. How long in total?',
      ['3 s', '4 s', '12 s', '7 s'],
      1,
      [
        'Three seconds excludes connection setup.',
        '6/2 + 1 = four seconds.',
        'Multiply neither file size by rate nor ignore units.',
        'Six is a size, not a duration.',
      ],
    ],
    [
      'evidence',
      'A test passes alone but fails after another test changes a shared object. What investigation is most direct?',
      [
        'Increase the timeout',
        'Randomize the input values',
        'Compare shared state before each test',
        'Repeat only the passing test',
      ],
      2,
      [
        'The evidence points to state, not duration.',
        'Random input adds variables without isolating the cause.',
        'The state comparison tests the suspected order dependency.',
        'Isolated reruns do not reproduce the failing sequence.',
      ],
    ],
    [
      'logic',
      'A task can finish only after both X and Y. X takes 3 minutes; Y takes 5; they start together. The final task takes 2. Total?',
      ['10 minutes', '5 minutes', '8 minutes', '7 minutes'],
      3,
      [
        'X and Y overlap rather than run sequentially.',
        'Five excludes the final task.',
        'The prerequisite delay is five rather than six.',
        'Wait five minutes for both, then run two minutes.',
      ],
    ],
    [
      'measurement',
      'A report shows 9 errors in 300 requests. What is the error percentage?',
      ['3%', '9%', '0.3%', '30%'],
      0,
      [
        '9/300 × 100 = 3%.',
        'Nine is the error count, not the percent.',
        'This is a decimal-place error.',
        'Thirty percent would mean 90 errors.',
      ],
    ],
    [
      'uncertainty',
      'Two similar fixes are available. One reproduces and resolves the bug in a focused test. The other only looks cleaner. What is supported?',
      [
        'Cleaner fix has fewer defects',
        'Tested fix addresses the reproduced case',
        'Both fixes cover all cases',
        'Neither observation is useful',
      ],
      1,
      [
        'Appearance does not prove correctness.',
        'The test supports this specific behavior; other cases still need review.',
        'A single reproduced case cannot establish complete coverage.',
        'The reproduced and verified case supplies useful evidence.',
      ],
    ],
  ],
  mid: [
    [
      'rates',
      'Requests arrive at 180/minute. Each worker serves 50/minute. What minimum whole worker count keeps capacity above arrivals?',
      ['3', '4', '5', '6'],
      1,
      [
        'Three workers serve only 150/minute.',
        'Four provide 200/minute, above the stated rate.',
        'Five works but is not the minimum.',
        'Six exceeds the minimum required by this simplified model.',
      ],
    ],
    [
      'measurement',
      'A 400 ms request spends 300 ms in a step that becomes three times faster. Other work is unchanged. New total?',
      ['200 ms', '133 ms', '100 ms', '300 ms'],
      0,
      [
        'The improved step takes 100 ms; other work takes 100 ms.',
        'This incorrectly speeds up the whole request.',
        'This excludes the unchanged work.',
        'This keeps the improved portion at its former size.',
      ],
    ],
    [
      'uncertainty',
      'Variant A succeeds in 90/100 trials; B in 9/10. Which conclusion follows from the observed fractions alone?',
      [
        'A has higher observed success',
        'B has lower observed success',
        'Both have equal uncertainty',
        'Both have 90% observed success',
      ],
      3,
      [
        'Both fractions reduce to 0.9.',
        'Both fractions reduce to 0.9.',
        'Different sample sizes provide different precision.',
        'The observed proportions match; confidence need not match.',
      ],
    ],
    [
      'logic',
      'A task needs a credential and a network path. The network path works but the task fails. Which conclusion is warranted?',
      [
        'The credential must be invalid',
        'The network check was incorrect',
        'Other causes remain possible',
        'The task requires no credential',
      ],
      2,
      [
        'Failure may involve the credential or another step.',
        'A later failure does not refute the network observation.',
        'Necessary prerequisites do not rule out other failures.',
        'The premise explicitly requires a credential.',
      ],
    ],
    [
      'measurement',
      '90% of requests take 20 ms; 10% take 200 ms. What is the weighted mean?',
      ['110 ms', '38 ms', '22 ms', '200 ms'],
      1,
      [
        'This treats the groups as equally large.',
        '0.9 × 20 + 0.1 × 200 = 38 ms.',
        'The slow group contributes 20 ms, not two.',
        '200 is the slow-group duration, not the mean.',
      ],
    ],
    [
      'rates',
      'A backlog of 120 jobs has 30 jobs/min arriving and 50/min processing. How long until it drains under these constant rates?',
      ['2.4 min', '4 min', '6 min', '10 min'],
      2,
      [
        'This ignores continuing arrivals.',
        'This divides by arrival rate rather than net drain.',
        'Net drain is 20/min, so 120/20 = six minutes.',
        'The net drain is not 12/min.',
      ],
    ],
    [
      'evidence',
      'A query change improves latency on an empty table. Production has one million rows and skewed keys. What check comes next?',
      [
        'Benchmark representative data and keys',
        'Repeat the empty-table run more times',
        'Compare the SQL character counts',
        'Measure only connection setup',
      ],
      0,
      [
        'The representative workload tests the actual optimization claim.',
        'More repeats cannot repair an unrepresentative workload.',
        'Text length does not measure the query work.',
        'Connection setup misses the changed query execution.',
      ],
    ],
    [
      'uncertainty',
      'A canary has 2 errors in 20 requests; control has 20 in 200. What should the report say?',
      [
        'Canary has fewer errors so is safer',
        'Canary is ten times less reliable',
        'Equal rates prove equivalent behavior',
        'Equal observed rates; precision differs',
      ],
      3,
      [
        'Raw counts use different denominators.',
        'Both observed error rates are 10%.',
        'Equal estimates do not prove equivalence.',
        'Report the denominators and avoid certainty from the small canary.',
      ],
    ],
    [
      'rates',
      'A cache serves 80% of 1000 requests. Each remaining request makes two database reads. How many reads occur?',
      ['200', '400', '800', '1600'],
      1,
      [
        'Each of the 200 misses makes two reads.',
        '200 misses × two reads = 400 reads.',
        '800 is the hit count.',
        'Hits do not make these reads in the stated model.',
      ],
    ],
    [
      'tracing',
      'Tasks A(4 min) and B(6 min) run independently. C(3 min) needs A; D(2 min) needs B and C. Earliest D completion?',
      ['8 min', '9 min', '11 min', '15 min'],
      1,
      [
        'C finishes at seven, after B.',
        'C ends at seven; D ends at nine.',
        'A and B overlap.',
        'This incorrectly serializes all four tasks.',
      ],
    ],
    [
      'evidence',
      'A failure appears after changing timeout and pool size together. What isolates the timeout effect?',
      [
        'Increase both settings again',
        'Measure only successful requests',
        'Hold pool size fixed and vary timeout',
        'Compare against a different service',
      ],
      2,
      [
        'Changing both repeats the confounding.',
        'Removing failures hides the phenomenon being studied.',
        'One controlled change isolates its contribution.',
        'A different service adds workload and implementation differences.',
      ],
    ],
    [
      'measurement',
      'Processing 100 records takes 50 ms fixed setup plus 2 ms per record. What is the total for 200 records?',
      ['450 ms', '500 ms', '400 ms', '250 ms'],
      0,
      [
        '50 + 200 × 2 = 450 ms.',
        'Doubling the whole old duration doubles setup incorrectly.',
        'This omits fixed setup.',
        '250 is the duration for 100 records.',
      ],
    ],
  ],
  senior: [
    [
      'rates',
      'Capacity is 800 requests/s. It doubles while demand rises from 800 to 2400. What is the shortfall?',
      ['1600 requests/s', '2400 requests/s', '800 requests/s', '400 requests/s'],
      2,
      [
        '1600 is the new capacity.',
        'The system can still serve 1600 requests/s.',
        'Demand 2400 minus capacity 1600 leaves 800.',
        'No stated quantity produces a 400 shortfall.',
      ],
    ],
    [
      'measurement',
      'An availability target permits 0.1% failure over 1,000,000 requests. There have been 700 failures. How many remain in the budget?',
      ['300', '700', '1000', '30'],
      0,
      [
        'The budget is 1000 failures; 300 remain.',
        '700 is already consumed.',
        '1000 is the total allowed, not the remainder.',
        'This understates the remaining count by tenfold.',
      ],
    ],
    [
      'uncertainty',
      'A migration costs 10 engineer-days and may save 2–5 days/month. Ignoring other costs, what payback range follows?',
      ['1–2 months', '2–5 months', '5–10 months', '10–25 months'],
      1,
      [
        'Even the best saving needs 10/5 = two months.',
        'Divide cost by each endpoint: 10/5 to 10/2.',
        'This does not use the stated savings range.',
        'These values multiply cost by savings instead of dividing.',
      ],
    ],
    [
      'logic',
      'Two teams double local throughput, but customer lead time rises. Which measurement could explain the discrepancy?',
      [
        'Average source file length',
        'Number of engineers per team',
        'Deployments per engineer',
        'Waiting time between teams',
      ],
      3,
      [
        'File length does not locate delay between stages.',
        'Staff count alone does not locate waiting.',
        'Another local throughput measure misses the system delay.',
        'Queues and handoffs can dominate end-to-end lead time.',
      ],
    ],
    [
      'rates',
      'Traffic is 100 requests/s. On failure each request gets two additional attempts. If all fail, what downstream rate results?',
      ['200/s', '100/s', '300/s', '400/s'],
      2,
      [
        'Two retries accompany the initial attempt.',
        'This counts only initial attempts.',
        'One initial plus two retries triples the request rate.',
        'There are three total attempts, not four.',
      ],
    ],
    [
      'measurement',
      'Region A serves 9000 requests at 1% errors; B serves 1000 at 9%. What is the global error rate?',
      ['5%', '1.8%', '10%', '0.9%'],
      1,
      [
        'The regions have unequal request counts.',
        '90+90 errors across 10000 requests gives 1.8%.',
        'Adding rates ignores their denominators.',
        'This includes only A errors across both denominators.',
      ],
    ],
    [
      'uncertainty',
      'A pilot excludes the largest tenants, but they account for most traffic. What remains uncertain?',
      [
        'Whether the pilot ever ran',
        'Whether small tenants can migrate',
        'Whether the code can compile',
        'Whether large-tenant behavior transfers',
      ],
      3,
      [
        'The exclusion does not dispute that the pilot ran.',
        'Small-tenant behavior is what the pilot did observe.',
        'Compilation is a separate question.',
        'The pilot does not exercise the dominant workload group.',
      ],
    ],
    [
      'rates',
      'A service uses 30% serial work and 70% perfectly parallel work. With unlimited workers, what limits maximum speedup?',
      ['About 3.33×', 'About 1.43×', 'About 30×', 'About 70×'],
      0,
      [
        'The serial fraction bounds speedup at 1/0.3.',
        'This takes the reciprocal of the parallel fraction.',
        '30% is 0.3, not 0.03.',
        'Parallel work cannot remove the serial portion.',
      ],
    ],
    [
      'evidence',
      'A rollout reduces mean latency while increasing p99 and timeout rate. What conclusion fits all three metrics?',
      [
        'Every customer experience improved',
        'The p99 observation is redundant',
        'Some tail requests worsened',
        'The mean must be calculated wrong',
      ],
      2,
      [
        'The tail and timeout observations contradict a universal improvement.',
        'p99 describes behavior hidden by the mean.',
        'A better average can coexist with worse slow-request outcomes.',
        'The statistics can validly move in different directions.',
      ],
    ],
    [
      'uncertainty',
      'An incident estimate assumes a 1% probability, but plausible values span 0.1–10%. What analysis helps the decision?',
      [
        'Report only the midpoint loss',
        'Vary probability and failure cost',
        'Use the lowest estimate for planning',
        'Use last year’s budget as probability',
      ],
      1,
      [
        'A midpoint hides the wide uncertainty.',
        'Sensitivity analysis reveals which assumptions change the decision.',
        'Choosing the optimistic endpoint understates uncertainty.',
        'A budget is not a probability estimate.',
      ],
    ],
    [
      'logic',
      'A dependency has 99.9% availability. Your service also has independent local failures. What can be claimed about end-to-end availability?',
      [
        'It is exactly 99.9%',
        'It is exactly 99.99%',
        'It is the sum of both availabilities',
        'Local failures can lower it',
      ],
      3,
      [
        'Additional failure causes can reduce the total.',
        'No mechanism supports this improvement.',
        'Adding probabilities can exceed one and is inappropriate.',
        'End-to-end success requires both the dependency and local path.',
      ],
    ],
    [
      'measurement',
      'One team cuts a stage from 20 to 10 minutes, but handoff waiting remains 180 minutes. End-to-end time improves by what fraction?',
      ['5%', '50%', '10%', '90%'],
      0,
      [
        'Total falls from 200 to 190 minutes: 10/200 = 5%.',
        '50% applies to the stage, not the full flow.',
        'The saving is 10 minutes, not 10% of 200.',
        '180 is the unchanged waiting time.',
      ],
    ],
  ],
};
export function aptitudeBank(tier: Tier) {
  return bank(
    [...common, ...tierRows[tier]].map(([topic, prompt, options, answer, reasons], i): Item => ({
      id: `apt-v2-${tier}-${i + 1}`,
      topic,
      prompt,
      options,
      answer,
      reasons,
    })),
  );
}
export function aptitudeExercises(tier: Tier): Exercise[] {
  return [
    {
      id: 'estimate',
      title: 'Build and challenge an estimate',
      prompt:
        tier === 'junior'
          ? 'A CSV import has 600 records. Setup takes 2 seconds and each record takes 5 ms. Calculate total time, then estimate the effect of doubling record count. State units.'
          : tier === 'mid'
            ? 'An import receives 90 jobs/minute; two workers each process 35/minute. Starting with 100 queued jobs, estimate backlog after ten minutes and a recovery plan.'
            : 'A service forecasts 2–4× traffic growth. Model capacity and cost under both endpoints, identify the most sensitive assumption, and set measurable pilot stop conditions.',
      reference:
        'Separate fixed and variable work, keep time units consistent, and model incoming work as well as processing. Junior: 2 + 600×0.005 = 5 seconds, then 8 seconds for 1200 records. Mid: net growth 20/minute leaves 300 queued jobs after ten minutes. Senior: compare ranges and bottlenecks rather than a single unsupported estimate.',
      criteria: [
        'I showed the equation and consistent units.',
        'I tested an assumption or boundary case.',
        'I proposed a measurement that could disprove the estimate.',
      ],
    },
    {
      id: 'experiment',
      title: 'Separate a cause from a coincidence',
      prompt:
        'A team changed caching and request batching in the same release. Median latency fell but timeouts doubled. Design an investigation that separates the effects, defines comparable workloads, and protects users while gathering evidence.',
      reference:
        'Measure errors and latency by cohort and workload. Change one factor at a time in a bounded environment, retaining a control. Inspect tail latency, batch waits, cache misses and downstream saturation. Set explicit exposure and rollback limits; do not treat a better median as proof of overall improvement.',
      criteria: [
        'I identified at least two competing explanations.',
        'I described a controlled comparison and the observations to collect.',
        'I specified a stopping condition and acknowledged uncertainty.',
      ],
    },
  ];
}
