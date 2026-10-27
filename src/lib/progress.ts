import type { PrepModule, ProfileConfig } from '../content/types';
import { assessmentModule, getSession, SESSION_SIZE, type QuizSession } from './sessions';

export type Attempt = {
  id: string;
  version: number;
  questionIds?: string[];
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
  session?: QuizSession;
  round?: number;
  seenAt?: Record<string, number>;
  exerciseDrafts?: Record<string, { response: string; review: boolean[] }>;
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
  return `${config.role}:${config.tier}:${config.language}`;
}
export function enroll(state: Store, config: ProfileConfig, aiEnabled: boolean): Store {
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
    exerciseDrafts:
      saved.exerciseDrafts &&
      Object.fromEntries(
        Object.entries(saved.exerciseDrafts).map(([id, draft]) => [id, { ...draft, review: [] }]),
      ),
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
  const session = getSession(module, progress);
  const selected = assessmentModule(module, progress);
  const score = scoreQuiz(selected, answers);
  const canonical = Object.fromEntries(session.questionIds.map((id) => [id, answers[id]]));
  const attempt: Attempt = {
    id: crypto.randomUUID(),
    version: module.version,
    questionIds: session.questionIds,
    answers: canonical,
    score,
    at,
  };
  const p = currentModule(module, progress);
  const previousScore = attemptScore(module, p.best);
  const best =
    previousScore === null || score >= previousScore
      ? attempt
      : { ...p.best!, score: previousScore };
  return {
    ...p,
    answers: canonical,
    session,
    seenAt: {
      ...p.seenAt,
      ...Object.fromEntries(session.questionIds.map((id) => [id, p.round ?? 0])),
    },
    attempts: [...p.attempts, attempt].slice(-20),
    best,
    submitted: true,
  };
}
export function moduleStatus(module: PrepModule, saved?: ModuleProgress) {
  const p = currentModule(module, saved);
  const preparation = module.steps.every((_, i) => p.prep[i] === true);
  const quiz = (attemptScore(module, p.best) ?? -1) >= 75;
  const exercises = exerciseList(module);
  const reviewedExercises = exercises.filter((e) => {
    const draft = exerciseProgress(module, p, e.id);
    return draft.response.trim().length > 0 && e.criteria.every((_, i) => draft.review[i] === true);
  }).length;
  const exercise = reviewedExercises >= Math.min(2, exercises.length);
  return {
    preparation,
    reviewedExercises,
    requiredExercises: Math.min(2, exercises.length),
    quiz,
    exercise,
    complete: preparation && quiz && exercise,
    requirements: Number(preparation) + Number(quiz) + Number(exercise),
    started:
      !!saved &&
      (p.prep.some(Boolean) ||
        Object.keys(p.answers).length > 0 ||
        p.response.length > 0 ||
        Object.values(p.exerciseDrafts ?? {}).some((d) => d.response.length > 0) ||
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

export function exerciseList(module: PrepModule) {
  return module.exercises ?? [{ ...module.exercise, id: 'original' }];
}
export function exerciseProgress(module: PrepModule, progress: ModuleProgress, id: string) {
  if (id === exerciseList(module)[0].id)
    return { response: progress.response, review: progress.review };
  return progress.exerciseDrafts?.[id] ?? { response: '', review: [] };
}
export function updateExercise(
  module: PrepModule,
  progress: ModuleProgress,
  id: string,
  draft: { response: string; review: boolean[] },
) {
  if (!exerciseList(module).some((e) => e.id === id)) throw new Error('Unknown exercise');
  if (id === exerciseList(module)[0].id) return { ...progress, ...draft };
  return { ...progress, exerciseDrafts: { ...progress.exerciseDrafts, [id]: draft } };
}

export function attemptScore(
  module: PrepModule,
  attempt: Attempt | null | undefined,
): number | null {
  if (!attempt || attempt.version !== module.version) return null;
  const ids = attempt.questionIds;
  if (
    !ids ||
    ids.length !== Math.min(SESSION_SIZE, module.questions.length) ||
    new Set(ids).size !== ids.length
  )
    return null;
  const questions: PrepModule['questions'] = [];
  for (const id of ids) {
    const question = module.questions.find((q) => q.id === id);
    if (!question) return null;
    questions.push(question);
  }
  try {
    return scoreQuiz({ ...module, questions }, attempt.answers);
  } catch {
    return null;
  }
}
