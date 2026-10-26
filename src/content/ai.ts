import { q, sources, type Blueprint, type Role, type Tier } from './types';

export function aiWorkflow(role: Role, tier: Tier): Blueprint {
  const questions = [
    q(
      `ai-${tier}-1`,
      tier === 'junior'
        ? 'What belongs in a useful request to a coding assistant?'
        : tier === 'mid'
          ? 'An assistant must change an existing feature safely. What context is most useful?'
          : 'Before delegating a migration plan to an assistant, what should you define?',
      [
        'A bounded task, relevant contracts, constraints, acceptance criteria and verification',
        'Explicit scope and verifiable outcomes let you assess the output and reduce irrelevant or unsafe changes.',
      ],
      [
        [
          'A vague request to make everything better',
          'Without scope or acceptance criteria, the output cannot be evaluated reliably.',
        ],
        [
          'Every private file and production secret',
          'More context is not always better; secrets and unrelated private data should not be supplied.',
        ],
        [
          'Only the desired line count',
          'Code volume is not a functional or quality acceptance criterion.',
        ],
      ],
    ),
    q(
      `ai-${tier}-2`,
      'Generated code looks plausible and the assistant says its tests passed. What is the next step?',
      [
        'Inspect the change and independently run relevant checks against the requirement',
        'The assertion is not evidence. Review the diff, verify the intended behavior, and run checks yourself before accepting the change.',
      ],
      [
        [
          'Accept it because the explanation is confident',
          'Confidence of wording does not establish functional correctness or safety.',
        ],
        [
          'Check formatting only',
          'Formatting does not expose logic, authorization, or regression errors.',
        ],
        [
          'Ask the same assistant to declare it correct again',
          'Repeating an unsupported assertion does not provide independent verification.',
        ],
      ],
    ),
    q(
      `ai-${tier}-3`,
      'A generated patch adds a library you do not recognize. What should happen before adoption?',
      [
        'Verify it exists, check its official API, suitability, maintenance and security implications',
        'Generated dependencies can be fictional or unsuitable. Verify the actual package and evaluate the cost before adding it.',
      ],
      [
        [
          'Install it because its name sounds familiar',
          'A plausible package name is not evidence of authenticity or suitability.',
        ],
        [
          'Assume the model checked the current version',
          'Models may rely on stale or incorrect API knowledge; current documentation matters.',
        ],
        [
          'Disable dependency checks to unblock the patch',
          'Removing verification increases exposure instead of resolving the uncertainty.',
        ],
      ],
    ),
    q(
      `ai-${tier}-4`,
      tier === 'senior'
        ? 'Who remains accountable for accepting an AI-assisted architecture change?'
        : 'A generated fix passes a happy-path test. What evidence is still needed?',
      tier === 'senior'
        ? [
            'The human/team accepting it, using review criteria and operational evidence',
            'An assistant can propose changes, but responsibility for review, risk and acceptance remains with the people shipping the system.',
          ]
        : [
            'Tests for relevant edge cases, failure paths and regressions',
            'A single success case does not establish correctness under missing input, failure, concurrency or existing behavior.',
          ],
      tier === 'senior'
        ? [
            [
              'The model provider alone',
              'The provider does not know the complete context or own your production acceptance decision.',
            ],
            [
              'No one if it was automatically generated',
              'Automation does not remove accountability for the behavior shipped to users.',
            ],
            [
              'Only the person who typed the prompt, without review',
              'Accountability requires a suitable team review process, not merely prompt authorship.',
            ],
          ]
        : [
            [
              'Nothing; one passing test proves correctness',
              'One case cannot cover all relevant behavior or demonstrate absence of regressions.',
            ],
            [
              'A more enthusiastic explanation',
              'Tone has no relationship to whether failure and boundary conditions work.',
            ],
            [
              'More generated code before any testing',
              'Increasing the patch without validation can compound the original risk.',
            ],
          ],
    ),
  ];
  const bug = {
    frontend:
      'The suggested button is a clickable div with no keyboard behavior and no error state.',
    backend:
      'The suggested endpoint accepts a userId from the request and returns that user’s private orders without checking ownership.',
    fullstack:
      'The suggested checkout retries a charge after a timeout without an idempotency key and shows success before confirmation.',
    mobile:
      'The suggested mobile screen retains a subscription after it is removed, logs an authentication token, and assumes a timed-out submission was never saved.',
  }[role];
  return {
    title: 'AI-assisted engineering',
    description:
      'Practice giving useful context, inspecting generated changes, and taking responsibility for verification.',
    questions,
    steps: [
      {
        title: 'Frame a bounded task',
        body: `Write the goal, relevant ${role === 'frontend' ? 'interaction and accessibility' : role === 'backend' ? 'API and data' : role === 'mobile' ? 'lifecycle, platform, and API' : 'browser/server'} contracts, constraints, and acceptance criteria. Supply a minimal sanitized example, not production credentials or an entire unrelated repository.`,
      },
      {
        title:
          tier === 'senior' ? 'Set review and rollback boundaries' : 'Review the generated diff',
        body: `${tier === 'senior' ? 'Define what an assistant may change, what needs human review, and evidence required for rollout. ' : ''}Read the actual code. Check authorization, error states, data handling, and dependency assumptions. An assistant’s explanation of its own patch is a hypothesis to verify.`,
      },
      {
        title: 'Require evidence before accepting',
        body: 'Run the relevant tests, inspect failures, and add a regression case for the original issue. Compare the result with the acceptance criteria. Record what was reviewed by you and what remains uncertain; do not present generated claims as measured results.',
      },
    ],
    exercise: {
      title: 'Review an assistant’s suggestion',
      prompt: `${bug} Write a review that identifies the defect, proposes a bounded correction, and states the evidence required before accepting it. ${tier === 'senior' ? 'Include the rollout and rollback controls you would require for a team.' : tier === 'mid' ? 'Include both a regression test and a failure-path test.' : 'Explain the defect in your own words.'}`,
      reference: `First identify the violated contract: ${role === 'frontend' ? 'all users must be able to operate the control and understand failure' : role === 'backend' ? 'authentication alone does not authorize access to another user’s data' : 'uncertain network outcomes must not produce duplicate charges or false success'}. Request the smallest correction, then test the original failure and a valid path. Review the changed diff and verify relevant platform behavior with official documentation. Human acceptance follows evidence, not the assistant’s confidence.`,
      criteria: [
        'I named a concrete defect and the affected user or invariant.',
        'I proposed a bounded fix and specific verification cases.',
        'I distinguished generated claims from verified evidence.',
      ],
    },
    sources: [sources.ai, sources.security],
  };
}
