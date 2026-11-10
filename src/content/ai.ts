import { sources, type Guide, type Role, type Tier } from './types';

export function aiWorkflow(role: Role, tier: Tier): Guide {
  const bug = {
    frontend:
      'The suggested button is a clickable div with no keyboard behavior and no error state.',
    backend:
      'The suggested endpoint accepts a userId from the request and returns that user’s private orders without checking ownership.',
    fullstack:
      'The suggested checkout retries a charge after a timeout without an idempotency key and shows success before confirmation.',
  }[role];
  return {
    title: 'AI-assisted engineering',
    description:
      'Practice giving useful context, inspecting generated changes, and taking responsibility for verification.',
    steps: [
      {
        title: 'Frame a bounded task',
        body: `Write the goal, relevant ${role === 'frontend' ? 'interaction and accessibility' : role === 'backend' ? 'API and data' : 'browser/server'} contracts, constraints, and acceptance criteria. Supply a minimal sanitized example, not production credentials or an entire unrelated repository.`,
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
