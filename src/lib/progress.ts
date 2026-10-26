import type { PrepModule, ProfileConfig } from '../content/types';
import { validProfileConfig } from '../content/catalog';

export type Attempt = {
  id: string;
  version: number;
  answers: Record<string, number>;
  score: number;
  at: string;
};
export type ModuleProgress = {
  version: number;
  prep: boolean[];
  response: string;
  review: boolean[];
  answers: Record<string, number>;
  attempts: Attempt[];
  best: Attempt | null;
  submitted: boolean;
};
export type Profile = ProfileConfig & {
  aiEnabled: boolean;
  enrolledAt: string;
  lastModule?: string;
  modules: Record<string, ModuleProgress>;
};
export type Store = {
  schemaVersion: 1;
  revision: number;
  activeId: string | null;
  profiles: Record<string, Profile>;
  theme: 'light' | 'dark';
};
export function emptyStore(): Store {
  return { schemaVersion: 1, revision: 0, activeId: null, profiles: {}, theme: 'light' };
}
export function profileId(config: ProfileConfig) {
  return `${config.role}:${config.tier}:${config.language}${config.mobileStack ? `:${config.mobileStack}` : ''}`;
}
export function enroll(state: Store, config: ProfileConfig, aiEnabled: boolean): Store {
  if (!validProfileConfig(config)) throw new Error('Choose a valid preparation path.');
  const id = profileId(config);
  const existing = state.profiles[id];
  const profile: Profile = existing
    ? { ...existing, aiEnabled }
    : { ...config, aiEnabled, enrolledAt: new Date().toISOString(), modules: {} };
  return { ...state, activeId: id, profiles: { ...state.profiles, [id]: profile } };
}
export function unenroll(state: Store): Store {
  return { ...state, activeId: null };
}
export function resetProfile(state: Store, id: string): Store {
  const profile = state.profiles[id];
  if (!profile) return state;
  return {
    ...state,
    profiles: { ...state.profiles, [id]: { ...profile, modules: {}, lastModule: undefined } },
  };
}
export function updateProfile(
  state: Store,
  id: string,
  change: (profile: Profile) => Profile,
): Store {
  if (!state.profiles[id]) return state;
  return { ...state, profiles: { ...state.profiles, [id]: change(state.profiles[id]) } };
}
export function emptyModule(module: PrepModule): ModuleProgress {
  return {
    version: module.version,
    prep: module.steps.map(() => false),
    response: '',
    review: module.exercise.criteria.map(() => false),
    answers: {},
    attempts: [],
    best: null,
    submitted: false,
  };
}
export function currentModule(module: PrepModule, saved?: ModuleProgress): ModuleProgress {
  if (!saved) return emptyModule(module);
  if (saved.version === module.version) return saved;
  return {
    ...emptyModule(module),
    response: saved.response,
    attempts: saved.attempts,
    best: saved.best,
  };
}
export function scoreQuiz(module: PrepModule, answers: Record<string, number>): number {
  if (
    !module.questions.every(
      (q) =>
        Number.isInteger(answers[q.id]) && answers[q.id] >= 0 && answers[q.id] < q.choices.length,
    )
  )
    throw new Error('Answer every question before checking your answers.');
  return Math.round(
    (module.questions.filter((q) => answers[q.id] === q.correct).length / module.questions.length) *
      100,
  );
}
export function recordAttempt(
  module: PrepModule,
  progress: ModuleProgress,
  answers: Record<string, number>,
  at = new Date().toISOString(),
): ModuleProgress {
  const score = scoreQuiz(module, answers);
  const attempt: Attempt = {
    id: crypto.randomUUID(),
    version: module.version,
    answers: { ...answers },
    score,
    at,
  };
  const p = currentModule(module, progress);
  const best =
    !p.best || p.best.version !== module.version || score >= p.best.score ? attempt : p.best;
  return {
    ...p,
    answers: { ...answers },
    attempts: [...p.attempts, attempt].slice(-20),
    best,
    submitted: true,
  };
}
export function moduleStatus(module: PrepModule, saved?: ModuleProgress) {
  const p = currentModule(module, saved);
  const preparation = module.steps.every((_, i) => p.prep[i] === true);
  let quiz = false;
  try {
    quiz = !!p.best && p.best.version === module.version && scoreQuiz(module, p.best.answers) >= 75;
  } catch {
    /* An incompatible answer snapshot cannot grant completion. */
  }
  const exercise =
    p.response.trim().length > 0 && module.exercise.criteria.every((_, i) => p.review[i] === true);
  return {
    preparation,
    quiz,
    exercise,
    complete: preparation && quiz && exercise,
    requirements: Number(preparation) + Number(quiz) + Number(exercise),
    started:
      !!saved &&
      (p.prep.some(Boolean) ||
        Object.keys(p.answers).length > 0 ||
        p.response.length > 0 ||
        p.attempts.length > 0),
  };
}
export function pathStats(modules: PrepModule[], profile: Profile) {
  const core = modules.filter((m) => !m.optional);
  const completed = core.filter((m) => moduleStatus(m, profile.modules[m.id]).complete).length;
  const ai = modules.find((m) => m.optional);
  return {
    completed,
    total: core.length,
    percent: Math.round((completed / core.length) * 100),
    aiCompleted: ai ? moduleStatus(ai, profile.modules[ai.id]).complete : false,
  };
}
