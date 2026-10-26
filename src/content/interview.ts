import { q, sources, type Blueprint, type Role, type Tier } from './types';

export function interview(role: Role, tier: Tier): Blueprint {
  const questions =
    tier === 'junior'
      ? [
          q(
            'int-j-1',
            'An interviewer gives you an underspecified coding task. What should you do before implementing?',
            [
              'Clarify inputs, outputs, constraints, and an example',
              'A short clarification establishes the contract and prevents solving a different problem.',
            ],
            [
              [
                'Assume every missing constraint',
                'Unstated assumptions can make a technically correct solution fail the intended requirements.',
              ],
              [
                'Start typing without speaking',
                'Silent implementation hides your reasoning and leaves ambiguities unresolved.',
              ],
              [
                'Ask for the complete solution',
                'Clarification should establish requirements while leaving the reasoning and implementation to you.',
              ],
            ],
          ),
          q(
            'int-j-2',
            'You do not know the answer to a technical question. What is the strongest response?',
            [
              'State what you know, identify the gap, and explain how you would investigate',
              'Honest boundaries and a concrete investigation plan demonstrate reasoning without inventing knowledge.',
            ],
            [
              [
                'Invent a confident explanation',
                'Fabrication prevents a useful discussion and makes follow-up questions harder to answer honestly.',
              ],
              [
                'Say the question is irrelevant',
                'Dismissing the question avoids demonstrating your approach to unfamiliar work.',
              ],
              [
                'Claim another team always handles it',
                'Delegation does not explain how you would understand the issue or collaborate.',
              ],
            ],
          ),
          q(
            'int-j-3',
            'Which project explanation best demonstrates your contribution?',
            [
              'Describe the problem, your specific change, how you tested it, and what you learned',
              'Concrete ownership and verification distinguish your work from a broad description of the team project.',
            ],
            [
              [
                'List the framework names only',
                'Tools alone do not explain the problem, decisions, or your contribution.',
              ],
              [
                'Claim ownership of all team work',
                'Misrepresenting scope is misleading and leaves no accurate account of your decisions.',
              ],
              [
                'Recite every commit chronologically',
                'A commit log buries the important problem and result in implementation detail.',
              ],
            ],
          ),
          q(
            'int-j-4',
            'You finish a solution with time remaining. What should you do next?',
            [
              'Walk through edge cases, test behavior, and explain limitations',
              'Verification and clear limitations provide evidence that you understand the solution beyond the happy path.',
            ],
            [
              [
                'Add unrelated features',
                'Extra scope can introduce bugs and distract from the stated task.',
              ],
              [
                'Stop immediately without checking',
                'Unchecked boundary cases may invalidate an otherwise plausible solution.',
              ],
              [
                'Rename every variable repeatedly',
                'Cosmetic churn offers less value than validating correctness and complexity.',
              ],
            ],
          ),
        ]
      : tier === 'mid'
        ? [
            q(
              'int-m-1',
              'When discussing a design decision, what makes an answer persuasive?',
              [
                'State constraints, compare alternatives, explain the choice, and give observed results',
                'Tradeoffs tied to constraints and evidence make a decision assessable rather than a personal preference.',
              ],
              [
                [
                  'Call the chosen tool the industry standard',
                  'A popularity claim does not explain why the tool met the actual requirements.',
                ],
                [
                  'Describe only the successful outcome',
                  'Without alternatives and constraints, the decision process remains unclear.',
                ],
                [
                  'Avoid mentioning limitations',
                  'Real decisions have costs; hiding them weakens evidence of sound judgment.',
                ],
              ],
            ),
            q(
              'int-m-2',
              'A teammate disagreed with your approach. What should a behavioral answer emphasize?',
              [
                'How you established shared goals, compared evidence, and resolved the disagreement',
                'A specific account of collaboration and evidence demonstrates how you work through technical conflict.',
              ],
              [
                [
                  'Why the teammate was inferior',
                  'Personal criticism does not explain a constructive decision process.',
                ],
                [
                  'That disagreement never happens',
                  'An absolute claim avoids the requested example and provides no evidence.',
                ],
                [
                  'That you silently implemented your preference',
                  'Bypassing discussion can undermine agreement and does not demonstrate collaboration.',
                ],
              ],
            ),
            q(
              'int-m-3',
              'How should you describe the impact of a performance change?',
              [
                'Give the measured baseline, changed metric, workload, and caveats',
                'A baseline and workload make the improvement meaningful; caveats prevent overgeneralization.',
              ],
              [
                [
                  'Say it was much faster without data',
                  'An unquantified impression is weak evidence when measurements are available.',
                ],
                [
                  'Invent a percentage to sound precise',
                  'Fabricated precision is misleading and cannot withstand follow-up questions.',
                ],
                [
                  'Report only code size',
                  'Code volume does not establish latency, throughput, or user impact.',
                ],
              ],
            ),
            q(
              'int-m-4',
              'A system design interviewer changes a requirement midway. What should happen?',
              [
                'Revisit assumptions and adapt the design while explaining affected tradeoffs',
                'A requirement change can invalidate earlier choices; explicitly revisiting them shows controlled adaptation.',
              ],
              [
                [
                  'Ignore the new requirement',
                  'The proposed design would no longer answer the current problem.',
                ],
                [
                  'Restart without explaining why',
                  'An unexplained restart obscures which assumptions changed and what can be retained.',
                ],
                [
                  'Promise the current design handles every change',
                  'Universal claims avoid investigating the actual cost and feasibility.',
                ],
              ],
            ),
          ]
        : [
            q(
              'int-s-1',
              'A senior system-design prompt starts with “design a notification platform.” What is the best opening?',
              [
                'Clarify delivery semantics, channels, scale, latency, privacy and failure requirements',
                'These requirements determine storage, queues, retries and operational tradeoffs before component selection.',
              ],
              [
                [
                  'Draw a large microservice diagram immediately',
                  'A component diagram without requirements can encode unnecessary or incorrect assumptions.',
                ],
                [
                  'Guarantee exactly-once delivery everywhere',
                  'End-to-end delivery claims require precise scope and mechanisms, not an unsupported guarantee.',
                ],
                [
                  'Choose the newest database first',
                  'Storage choice should follow access patterns and guarantees, not novelty.',
                ],
              ],
            ),
            q(
              'int-s-2',
              'Which leadership example provides the strongest evidence?',
              [
                'A specific intervention that improved team decisions, with evidence and lessons',
                'Leadership is demonstrated through decisions, influence, outcomes and reflection, not just a job title.',
              ],
              [
                [
                  'The number of direct reports alone',
                  'Team size does not describe how you influenced technical outcomes.',
                ],
                [
                  'Taking credit for every result',
                  'This obscures collaborators and gives little evidence of enabling others.',
                ],
                [
                  'Avoiding all technical disagreement',
                  'Healthy disagreement is often necessary; avoidance does not demonstrate sound leadership.',
                ],
              ],
            ),
            q(
              'int-s-3',
              'A past architectural decision failed. How should you discuss it?',
              [
                'Explain the original evidence, missed signals, recovery, and changes to the decision process',
                'Accountability plus concrete learning gives the interviewer insight into how your judgment improves.',
              ],
              [
                [
                  'Hide the failure',
                  'Omission prevents an honest account of the decision and its consequences.',
                ],
                [
                  'Blame the implementers only',
                  'A senior account should examine system and decision factors rather than transfer all responsibility.',
                ],
                [
                  'Claim the outcome was inevitable',
                  'That claim needs evidence and can conceal opportunities to improve detection or recovery.',
                ],
              ],
            ),
            q(
              'int-s-4',
              'An interviewer asks you to choose between reliability work and a feature deadline. What is the strongest answer?',
              [
                'Quantify customer risk, clarify commitments, and propose staged options with explicit tradeoffs',
                'A senior response connects technical risk to business constraints and provides choices that stakeholders can evaluate.',
              ],
              [
                [
                  'Reliability always wins regardless of context',
                  'An absolute rule ignores the actual severity, commitments and available mitigations.',
                ],
                [
                  'Features always win because they are visible',
                  'Visibility does not justify exposing customers to unacceptable failure.',
                ],
                [
                  'Delegate the decision without analysis',
                  'Stakeholders need technical evidence and options to make an informed decision.',
                ],
              ],
            ),
          ];
  const scenario = {
    frontend: 'an accessible account-settings interface',
    backend: 'a duplicate-safe order API',
    fullstack: 'an end-to-end checkout flow',
  }[role];
  return {
    title: 'Interview & communication',
    description:
      'Turn your technical work into clear explanations, credible examples, and productive interview conversations.',
    questions,
    steps: [
      {
        title: 'Prepare evidence from your work',
        body: `Choose a project involving ${scenario}, or a comparable project you actually worked on. Note the problem, constraints, your personal contribution, validation, and outcome. Use honest observations if you do not have measured impact.`,
      },
      {
        title:
          tier === 'senior'
            ? 'Explain decisions at system and team level'
            : 'Practice explaining a tradeoff',
        body: `For ${tier === 'junior' ? 'a small implementation choice' : tier === 'mid' ? 'a feature you owned' : 'a cross-team architectural decision'}, describe at least two plausible approaches. Explain why the chosen approach fit the constraints, what it cost, and what evidence would change your mind.`,
      },
      {
        title: 'Rehearse with follow-up questions',
        body: 'Give a two-minute answer aloud, then ask: What did I personally do? How did I know it worked? What failed? What would I do differently? Replace broad claims with a specific example and acknowledge what you cannot verify.',
      },
    ],
    exercise: {
      title:
        tier === 'senior' ? 'Tell a technical leadership story' : 'Prepare a project walkthrough',
      prompt: `Write a concise interview answer about ${scenario}, or a real comparable project. ${tier === 'junior' ? 'Explain the problem, your implementation, an edge case, and how you tested it.' : tier === 'mid' ? 'Discuss ownership, alternative designs, collaboration, and a measurable or honestly observed outcome.' : 'Discuss ambiguity, stakeholder tradeoffs, how you enabled others, failure risks, and what changed after delivery.'} Clearly label a hypothetical example if you do not have a real one.`,
      reference:
        'A useful outline is: context and constraint; my responsibility; alternatives and why we chose one; specific actions and verification; outcome and limitations; lesson for next time. Separate “I” from “we” accurately. A truthful qualitative outcome is better than an invented metric. End with a decision you would revisit and the evidence needed to revisit it.',
      criteria: [
        'My personal contribution is clear and accurately scoped.',
        'I explained an alternative, a tradeoff, and verification.',
        'I gave a truthful outcome and a specific lesson.',
      ],
    },
    sources: [sources.sfia],
  };
}
