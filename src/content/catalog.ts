import { aptitude } from './aptitude';
import { interview } from './interview';
import { aiWorkflow } from './ai';
import { frontendTracks } from './frontend';
import { backendTracks } from './backend';
import { fullstackTracks } from './fullstack';
import { languages } from './languages';
import { frontendBank } from './banks/frontend';
import { backendBank } from './banks/backend';
import { fullstackBank } from './banks/fullstack';
import { aptitudeBank, aptitudeExercises } from './banks/aptitude';
import { interviewBank, interviewExercises } from './banks/interview';
import { languageBank } from './banks/language';
import { aiBank, aiExercises } from './banks/ai';
import {
  sources,
  type ProfileConfig,
  type Role,
  type Tier,
  type PrepModule,
  type Blueprint,
} from './types';
export { languages };
export const REVIEWED_ON = '2026-10-27';
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
export function languagesFor(role: Role) {
  return languages.filter(
    (l) => role !== 'frontend' || l.id === 'javascript' || l.id === 'typescript',
  );
}
export function profileLabel(config: ProfileConfig) {
  return `${tiers.find((t) => t.id === config.tier)!.label} ${roles.find((r) => r.id === config.role)!.title}`;
}
export function getModules(config: ProfileConfig): PrepModule[] {
  const track = { frontend: frontendTracks, backend: backendTracks, fullstack: fullstackTracks }[
    config.role
  ][config.tier];
  const bank = { frontend: frontendBank, backend: backendBank, fullstack: fullstackBank }[
    config.role
  ](config.tier);
  const language = languages.find((l) => l.id === config.language)!;
  const technicalSources =
    config.role === 'frontend'
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
    questions: [...languageBank(config.language, config.tier), ...bank.fundamentals],
    exercise,
    exercises: [{ ...exercise, id: 'original' }, ...bank.fundamentalsExercises],
    sources: technicalSources,
  };
  const practical: Blueprint = {
    title: 'Practical engineering',
    description:
      'Work through realistic implementation decisions, failure cases, testing, and design tradeoffs.',
    steps: track.build,
    questions: bank.practical,
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
  const aptitudeContent = aptitude(config.tier);
  const interviewContent = interview(config.role, config.tier);
  const aiContent = aiWorkflow(config.role, config.tier);
  return [
    {
      ...aptitudeContent,
      questions: aptitudeBank(config.tier),
      exercises: [
        { ...aptitudeContent.exercise, id: 'original' },
        ...aptitudeExercises(config.tier),
      ],
      id: 'aptitude',
      subtitle: 'Think clearly',
      minutes: 25,
      version: 2,
    },
    { ...fundamentals, id: 'fundamentals', subtitle: 'Know your craft', minutes: 40, version: 2 },
    {
      ...practical,
      exercises: [{ ...practical.exercise, id: 'original' }, ...bank.practicalExercises],
      id: 'practical',
      subtitle: 'Put it into practice',
      minutes: 50,
      version: 2,
    },
    {
      ...interviewContent,
      questions: interviewBank(config.tier),
      exercises: [
        { ...interviewContent.exercise, id: 'original' },
        ...interviewExercises(config.role, config.tier),
      ],
      id: 'interview',
      subtitle: 'Tell your story',
      minutes: 30,
      version: 2,
    },
    {
      ...aiContent,
      questions: aiBank,
      exercises: [{ ...aiContent.exercise, id: 'original' }, ...aiExercises],
      id: 'ai',
      subtitle: 'Optional extension',
      minutes: 30,
      optional: true,
      version: 2,
    },
  ];
}
export function getModule(profile: ProfileConfig, id: string) {
  return getModules(profile).find((m) => m.id === id);
}
