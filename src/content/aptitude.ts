import { sources, type Guide, type Tier } from './types';

export function aptitude(tier: Tier): Guide {
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
