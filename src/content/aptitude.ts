import { q, sources, type Blueprint, type Tier } from './types';

export function aptitude(tier: Tier): Blueprint {
  const questions =
    tier === 'junior'
      ? [
          q(
            'apt-j-1',
            'A build takes 80 seconds. A change reduces its time by 25%. How long does it now take?',
            ['60 seconds', '25% of 80 is 20; subtracting 20 from 80 gives 60 seconds.'],
            [
              ['20 seconds', 'Twenty seconds is the saving, not the remaining duration.'],
              ['55 seconds', 'A 25% reduction is proportional, not a subtraction of 25 seconds.'],
              ['100 seconds', 'This adds 25% instead of reducing the original time.'],
            ],
          ),
          q(
            'apt-j-2',
            'Every deployed service passed validation. Service K did not pass validation. Which conclusion follows?',
            [
              'K was not deployed',
              'If deployment implies validation, failing validation rules out deployment. This is the contrapositive.',
            ],
            [
              [
                'K is the only failed service',
                'Nothing states how many other services passed or failed.',
              ],
              [
                'Every validated service was deployed',
                'The implication does not work in reverse; validation is necessary, not sufficient.',
              ],
              [
                'K can never be deployed',
                'The facts concern this deployment; a later validation could succeed.',
              ],
            ],
          ),
          q(
            'apt-j-3',
            'A loop starts at count = 0 and adds 1 for each of 7 items, skipping exactly 2 items. What is the final count?',
            ['5', 'Five of the seven items contribute one increment: 7 minus 2 equals 5.'],
            [
              ['7', 'The skipped items do not contribute an increment.'],
              ['2', 'Two is the number skipped, not the number counted.'],
              ['6', 'Exactly two items are skipped, so one cannot count six items.'],
            ],
          ),
          q(
            'apt-j-4',
            'A bug report says a form fails. What is the most useful first step before changing code?',
            [
              'Record reproducible inputs, expected behavior, and actual behavior',
              'A reproducible example establishes what failed and lets you check whether the change fixes that behavior.',
            ],
            [
              [
                'Rewrite the entire form',
                'Rewriting before isolating the issue adds risk and may preserve the original bug.',
              ],
              [
                'Assume the server is broken',
                'The report provides no evidence locating the failure on the server.',
              ],
              [
                'Disable validation',
                'Removing validation changes the contract without diagnosing the failure.',
              ],
            ],
          ),
        ]
      : tier === 'mid'
        ? [
            q(
              'apt-m-1',
              'A request spends 100 ms in the database and 100 ms elsewhere. Database work becomes twice as fast; everything else stays equal. What is the new total?',
              [
                '150 ms',
                'Only database time halves to 50 ms; the unchanged 100 ms gives a 150 ms total.',
              ],
              [
                [
                  '100 ms',
                  'This incorrectly halves the whole request rather than only its database portion.',
                ],
                ['50 ms', 'The unchanged non-database work still takes 100 ms.'],
                ['200 ms', 'The database improvement saves 50 ms under the stated assumptions.'],
              ],
            ),
            q(
              'apt-m-2',
              'A worker handles 12 independent jobs per minute. At a constant arrival rate of 15 per minute, what happens to the queue without scaling or dropping jobs?',
              [
                'It grows by 3 jobs per minute',
                'Arrival exceeds service by 15 minus 12, so the backlog grows steadily by three jobs per minute.',
              ],
              [
                [
                  'It stabilizes at 15 jobs',
                  'There is no mechanism to eliminate the continuing excess arrival rate.',
                ],
                [
                  'It shrinks by 3 jobs per minute',
                  'The service rate is lower than the arrival rate, not higher.',
                ],
                ['It stays empty', 'More jobs arrive each minute than the worker can finish.'],
              ],
            ),
            q(
              'apt-m-3',
              'Errors appear only for requests missing an optional field. Which experiment best isolates the cause?',
              [
                'Replay otherwise identical requests with and without the field',
                'Changing one variable while holding the rest constant directly tests the suspected condition.',
              ],
              [
                [
                  'Change the field and database version together',
                  'Changing multiple variables makes it harder to attribute the result.',
                ],
                [
                  'Restart every server repeatedly',
                  'A restart may change the symptom without testing the input condition.',
                ],
                [
                  'Measure only successful requests',
                  'Excluding failing requests removes the evidence needed to diagnose the bug.',
                ],
              ],
            ),
            q(
              'apt-m-4',
              'A feature has a strict legal deadline; a cosmetic redesign has no committed date. Both need the same engineer. What should happen first?',
              [
                'Clarify the deadline risk and sequence the constrained work with stakeholders',
                'The explicit constraint warrants prioritization, with scope and risks communicated rather than silently guessing.',
              ],
              [
                [
                  'Pick the visually appealing task',
                  'Visual appeal does not address the stated deadline constraint.',
                ],
                [
                  'Promise both without estimating effort',
                  'Unbounded commitments hide the capacity conflict instead of resolving it.',
                ],
                [
                  'Refuse to communicate until work is finished',
                  'Stakeholders need the tradeoff early enough to adjust the plan.',
                ],
              ],
            ),
          ]
        : [
            q(
              'apt-s-1',
              'A system handles 800 requests/second. A proposed improvement doubles capacity but traffic is expected to triple. Under equal workload assumptions, what remains?',
              [
                'A capacity shortfall of 800 requests/second',
                'New capacity is 1600 and expected demand is 2400, leaving an 800 requests/second deficit.',
              ],
              [
                [
                  '800 requests/second spare capacity',
                  'Demand exceeds the improved capacity; it does not leave spare capacity.',
                ],
                [
                  'No shortfall because capacity doubled',
                  'A twofold supply increase cannot satisfy a threefold demand increase from the same baseline.',
                ],
                [
                  'A shortfall of 2400 requests/second',
                  'The improved system still serves 1600 of the expected 2400 requests/second.',
                ],
              ],
            ),
            q(
              'apt-s-2',
              'A risky migration has uncertain failure cost and uncertain probability. Which decision process is most defensible?',
              [
                'Bound the risks, gather evidence with a reversible pilot, and define stop criteria',
                'A bounded experiment reduces uncertainty while limiting exposure and preserving the option to stop.',
              ],
              [
                [
                  'Multiply invented point estimates and treat the result as certain',
                  'False precision conceals uncertainty instead of providing evidence.',
                ],
                [
                  'Ship to every customer to collect data faster',
                  'Maximum exposure is unjustified before the failure cost is understood.',
                ],
                [
                  'Delay forever until all risk is zero',
                  'Zero uncertainty is generally unattainable; decisions need bounded evidence and recovery.',
                ],
              ],
            ),
            q(
              'apt-s-3',
              'A dashboard shows correlation between deployments and errors. What is needed before concluding deployments caused them?',
              [
                'Compare timing, affected cohorts and alternative causes using detailed evidence',
                'Correlation motivates investigation; timing and controlled comparisons help distinguish causal mechanisms from confounders.',
              ],
              [
                [
                  'No more evidence; correlation proves causation',
                  'Two quantities can move together because of a third factor.',
                ],
                [
                  'Ignore the correlation entirely',
                  'The relationship may be useful evidence even though it is not conclusive.',
                ],
                [
                  'Average all errors across the year',
                  'A coarse average can hide the timing and cohorts needed for causal diagnosis.',
                ],
              ],
            ),
            q(
              'apt-s-4',
              'Two teams optimize their own throughput but increase end-to-end customer lead time. What metric should guide a joint intervention?',
              [
                'The end-to-end flow, including queues and handoff delays',
                'System-level lead time exposes bottlenecks that local throughput can conceal or worsen.',
              ],
              [
                [
                  'Each team’s ticket count alone',
                  'Local output does not account for waiting between teams or actual customer outcomes.',
                ],
                [
                  'Lines of code produced',
                  'Code volume is not a measure of end-to-end delivery time or value.',
                ],
                [
                  'The number of meetings canceled',
                  'Meeting counts do not locate the queue or dependency delaying customers.',
                ],
              ],
            ),
          ];
  const focus = {
    junior: [
      'Reason from the facts',
      'Separate given facts from assumptions. Translate percentages into absolute values, trace one item at a time, and write the smallest reproducible example before proposing a fix.',
    ],
    mid: [
      'Model the constraint',
      'Separate arrival rate from processing capacity. Break a total into the parts a change actually affects; a 2x improvement to one component does not imply a 2x improvement to the whole system.',
    ],
    senior: [
      'Make uncertainty explicit',
      'State the baseline, unit, time horizon, and confidence in each assumption. Use ranges and reversible experiments when failure costs are uncertain; avoid precise-looking numbers without evidence.',
    ],
  }[tier];
  return {
    title: 'Aptitude & problem solving',
    description:
      'Practice the reasoning behind good engineering decisions, from tracing logic to weighing uncertain constraints.',
    steps: [
      { title: focus[0], body: focus[1] },
      {
        title: 'Show the working',
        body: 'Write an equation or a short chain of implications before choosing an answer. Keep units attached to numbers. Check the result against a simple boundary case, such as a zero-percent improvement or equal arrival and service rates.',
      },
      {
        title: 'Review the reasoning, not just the score',
        body: 'For each missed question, identify whether the error came from arithmetic, an unsupported assumption, or a reversed implication. Redo the reasoning in your own words before retrying the assessment.',
      },
    ],
    questions,
    exercise: {
      title: 'Explain a decision with evidence',
      prompt:
        tier === 'junior'
          ? 'A task takes 120 seconds. An optimization reduces it by 20%, but adds a 10-second setup cost. Calculate the new time and explain how you would verify the improvement.'
          : tier === 'mid'
            ? 'A worker processes 30 jobs/minute and receives 36 jobs/minute for 10 minutes. Estimate the backlog, then propose an experiment to improve capacity without changing correctness.'
            : 'Traffic may grow by 2x to 4x over six months. Outline a capacity decision with assumptions, measurements, a reversible pilot, and explicit thresholds for scaling or stopping.',
      reference:
        tier === 'junior'
          ? 'A 20% saving on 120 seconds is 24 seconds. Processing becomes 96 seconds; including setup, total time is 106 seconds. Repeat measurements on the same workload, report variation, and verify the output is still correct.'
          : tier === 'mid'
            ? 'Excess arrival is 6 jobs/minute, so 60 jobs accumulate in ten minutes, starting from an empty queue. Measure service time and saturation, pilot an extra worker with duplicate-safe processing, and compare throughput, error rate, and queue age.'
            : 'Measure present throughput, tail latency, saturation, and cost per workload unit. Model both 2x and 4x demand with headroom. Pilot a reversible capacity change; define acceptable latency/error budgets and rollback triggers before expanding it.',
      criteria: [
        'I stated assumptions and kept units explicit.',
        'I showed intermediate reasoning and checked the result.',
        'I described a concrete verification or measurement.',
      ],
    },
    sources: [sources.sfia],
  };
}
