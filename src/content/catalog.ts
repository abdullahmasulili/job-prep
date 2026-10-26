import { aptitude } from './aptitude';
import { interview } from './interview';
import { aiWorkflow } from './ai';
import { frontendTracks } from './frontend';
import { backendTracks } from './backend';
import { fullstackTracks } from './fullstack';
import { languages, languageQuestion } from './languages';
import { fullstackMobile, mobileStackFor, mobileStacks, mobileTrack } from './mobile';
import {
  sources,
  type ProfileConfig,
  type Role,
  type Tier,
  type PrepModule,
  type Blueprint,
  type MobileStack,
} from './types';
export { languages };
export const REVIEWED_ON = '2026-10-26';
export const roles: {
  id: Role;
  label: string;
  title: string;
  description: string;
  skills: string;
}[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    title: 'Frontend developer',
    description: 'Build interfaces people enjoy using.',
    skills: 'Interfaces · Accessibility · Performance',
  },
  {
    id: 'backend',
    label: 'Backend',
    title: 'Backend developer',
    description: 'Build the systems behind the experience.',
    skills: 'APIs · Databases · Reliability',
  },
  {
    id: 'fullstack',
    label: 'Fullstack',
    title: 'Fullstack developer',
    description: 'Connect the whole product, end to end.',
    skills: 'Browser · Server · Integration',
  },
  {
    id: 'mobile',
    label: 'Mobile',
    title: 'Mobile developer',
    description: 'Build apps for Android and iOS.',
    skills: 'Cross-platform · Android · iOS',
  },
];
export const tiers: { id: Tier; label: string; description: string }[] = [
  {
    id: 'junior',
    label: 'Junior',
    description: 'Build strong foundations and solve well-defined tasks.',
  },
  {
    id: 'mid',
    label: 'Mid-level',
    description: 'Own features, work across boundaries, and explain tradeoffs.',
  },
  {
    id: 'senior',
    label: 'Senior',
    description: 'Navigate ambiguity, design systems, and guide technical decisions.',
  },
];
export function languagesFor(role: Role, mobileStack?: MobileStack) {
  if (role === 'mobile') {
    const allowed = mobileStack
      ? mobileStackFor(mobileStack).languages
      : mobileStacks.flatMap((s) => s.languages);
    return languages.filter((l) => allowed.includes(l.id));
  }
  return languages.filter(
    (l) =>
      !['dart', 'kotlin', 'swift'].includes(l.id) &&
      (role !== 'frontend' || l.id === 'javascript' || l.id === 'typescript'),
  );
}
export function validProfileConfig(config: ProfileConfig): boolean {
  if (!roles.some((r) => r.id === config.role) || !tiers.some((t) => t.id === config.tier))
    return false;
  if (
    config.mobileStack !== undefined &&
    (!['mobile', 'fullstack'].includes(config.role) ||
      !mobileStacks.some((s) => s.id === config.mobileStack))
  )
    return false;
  if (config.role === 'mobile' && !config.mobileStack) return false;
  return languagesFor(config.role, config.mobileStack).some((l) => l.id === config.language);
}
export function profileDetails(config: ProfileConfig) {
  const language = languages.find((l) => l.id === config.language)!.label;
  if (!config.mobileStack) return language;
  const stack = mobileStackFor(config.mobileStack);
  return config.role === 'mobile'
    ? `${stack.label} · ${language}`
    : `${language} backend · Mobile: ${stack.label}`;
}
export function profileLabel(config: ProfileConfig) {
  return `${tiers.find((t) => t.id === config.tier)!.label} ${roles.find((r) => r.id === config.role)!.title}`;
}
export function getModules(config: ProfileConfig): PrepModule[] {
  if (!validProfileConfig(config))
    throw new Error('Choose a valid role, language, and mobile stack.');
  const track =
    config.role === 'mobile'
      ? mobileTrack(config.mobileStack!, config.tier)
      : { frontend: frontendTracks, backend: backendTracks, fullstack: fullstackTracks }[
          config.role
        ][config.tier];
  const language = languages.find((l) => l.id === config.language)!;
  const technicalSources =
    config.role === 'mobile'
      ? [mobileStackFor(config.mobileStack!).source, language.source]
      : config.role === 'frontend'
        ? [sources.mdn, sources.a11y, language.source]
        : [sources.http, sources.sql, sources.security, language.source];
  const exercise = {
    title: 'Explain and apply the fundamentals',
    prompt: `Using ${language.label}, explain the key data structures, error handling, and boundary checks for this task: ${track.task} ${config.role === 'fullstack' ? 'Use JavaScript/TypeScript for browser-specific behavior.' : ''}`,
    reference: `${track.reference} Explain how your selected language represents the values and failures. A correct-looking written answer still needs execution and review in a real project; this exercise is self-reviewed.`,
    criteria: [
      'I explained the relevant language behavior and data boundaries.',
      'I considered an edge case and a failure path.',
      'I named concrete checks that would verify the behavior.',
    ],
  };
  const fundamentals: Blueprint = {
    title: 'Role & language fundamentals',
    description: `Build the ${config.tier === 'junior' ? 'foundations' : config.tier === 'mid' ? 'feature-level judgment' : 'system-level judgment'} expected in a ${roles.find((r) => r.id === config.role)!.label.toLowerCase()} role, using ${language.label}.`,
    steps: track.learn,
    questions: [languageQuestion(config.language, config.tier), ...track.questions.slice(0, 3)],
    exercise,
    sources: technicalSources,
  };
  const practical: Blueprint = {
    title: 'Practical engineering',
    description:
      'Work through realistic implementation decisions, failure cases, testing, and design tradeoffs.',
    steps: track.build,
    questions: track.questions.slice(3, 7),
    exercise: {
      title: 'Work through a realistic scenario',
      prompt: `${track.task} Use ${language.label} where implementation details matter. ${config.role === 'fullstack' ? 'Browser-specific code uses JavaScript/TypeScript.' : ''}`,
      reference: track.reference,
      criteria: [
        'I stated the contract, constraints, and ownership.',
        'I explained the implementation and at least one tradeoff.',
        'I included failure cases and concrete verification steps.',
      ],
    },
    sources: technicalSources,
  };
  return [
    {
      ...aptitude(config.tier),
      id: 'aptitude',
      subtitle: 'Think clearly',
      minutes: 25,
      version: 1,
    },
    { ...fundamentals, id: 'fundamentals', subtitle: 'Know your craft', minutes: 40, version: 1 },
    { ...practical, id: 'practical', subtitle: 'Put it into practice', minutes: 50, version: 1 },
    ...(config.role === 'fullstack' && config.mobileStack
      ? [
          {
            ...fullstackMobile(config.mobileStack, config.tier),
            id: 'mobile',
            subtitle: 'Extend to mobile',
            minutes: 50,
            version: 1,
          },
        ]
      : []),
    {
      ...interview(config.role, config.tier),
      id: 'interview',
      subtitle: 'Tell your story',
      minutes: 30,
      version: 1,
    },
    {
      ...aiWorkflow(config.role, config.tier),
      id: 'ai',
      subtitle: 'Optional extension',
      minutes: 30,
      optional: true,
      version: 1,
    },
  ];
}
export function getModule(profile: ProfileConfig, id: string) {
  return getModules(profile).find((m) => m.id === id);
}
