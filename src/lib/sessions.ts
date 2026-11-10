import type { PrepModule } from '../content/types';
import type { ModuleProgress } from './progress';

export type QuizSession = {
  questionIds: string[];
  choiceOrders: Record<string, number[]>;
};
export const SESSION_SIZE = 12;

function hash(value: string) {
  let n = 2166136261;
  for (const char of value) n = Math.imul(n ^ char.charCodeAt(0), 16777619);
  return n >>> 0;
}
function shuffled<T>(values: T[], seed: string): T[] {
  const result = [...values];
  let n = hash(seed);
  for (let i = result.length - 1; i > 0; i--) {
    n = (Math.imul(n, 1664525) + 1013904223) >>> 0;
    const j = n % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function validSession(module: PrepModule, session: QuizSession) {
  return (
    session.questionIds.length === Math.min(SESSION_SIZE, module.questions.length) &&
    new Set(session.questionIds).size === session.questionIds.length &&
    session.questionIds.every((id) => {
      const question = module.questions.find((q) => q.id === id);
      const order = session.choiceOrders[id];
      return (
        question &&
        Array.isArray(order) &&
        order.length === question.choices.length &&
        new Set(order).size === order.length &&
        order.every((i) => Number.isInteger(i) && i >= 0 && i < question.choices.length)
      );
    })
  );
}
export function getSession(module: PrepModule, progress: ModuleProgress): QuizSession {
  if (progress.session && validSession(module, progress.session)) return progress.session;
  const seed = `${module.id}:${module.version}:${progress.round ?? 0}:${module.questions[0]?.id}`;
  const remaining = shuffled(module.questions, seed);
  const selected: typeof remaining = [];
  const topicCounts = new Map<string, number>();
  while (selected.length < Math.min(SESSION_SIZE, module.questions.length)) {
    let best = 0;
    for (let i = 1; i < remaining.length; i++) {
      const a = remaining[i],
        b = remaining[best];
      const seenA = progress.seenAt?.[a.id] ?? -1,
        seenB = progress.seenAt?.[b.id] ?? -1;
      if (
        seenA < seenB ||
        (seenA === seenB &&
          (topicCounts.get(a.topic ?? '') ?? 0) < (topicCounts.get(b.topic ?? '') ?? 0))
      )
        best = i;
    }
    const [question] = remaining.splice(best, 1);
    selected.push(question);
    topicCounts.set(question.topic ?? '', (topicCounts.get(question.topic ?? '') ?? 0) + 1);
  }
  const questionIds = shuffled(
    selected.map((q) => q.id),
    `${seed}:order`,
  );
  return {
    questionIds,
    choiceOrders: Object.fromEntries(
      selected.map((q) => [
        q.id,
        shuffled(
          q.choices.map((_, i) => i),
          `${seed}:${q.id}`,
        ),
      ]),
    ),
  };
}
export function assessmentModule(module: PrepModule, progress: ModuleProgress): PrepModule {
  const session = getSession(module, progress);
  return {
    ...module,
    questions: session.questionIds.map((id) => module.questions.find((q) => q.id === id)!),
  };
}
export function startRetake(module: PrepModule, progress: ModuleProgress): ModuleProgress {
  const next = {
    ...progress,
    answers: {},
    submitted: false,
    session: undefined,
    round: (progress.round ?? 0) + 1,
  };
  return { ...next, session: getSession(module, next) };
}
