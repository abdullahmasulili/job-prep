import { sources, type Guide, type Role, type Tier } from './types';

export function interview(role: Role, tier: Tier): Guide {
  const scenario = {
    frontend: 'an accessible account-settings interface',
    backend: 'a duplicate-safe order API',
    fullstack: 'an end-to-end checkout flow',
  }[role];
  return {
    title: 'Interview & communication',
    description:
      'Turn your technical work into clear explanations, credible examples, and productive interview conversations.',
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
