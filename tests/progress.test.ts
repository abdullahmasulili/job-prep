import test from 'node:test';
import assert from 'node:assert/strict';
import { getModules } from '../src/content/catalog';
import {
  emptyStore,
  enroll,
  unenroll,
  resetProfile,
  profileId,
  scoreQuiz,
  moduleStatus,
  pathStats,
  recordAttempt,
  emptyModule,
} from '../src/lib/progress';

const config = { role: 'backend' as const, tier: 'mid' as const, language: 'python' as const };
const modules = getModules(config);
const module = modules[0];
const correct = Object.fromEntries(module.questions.map((q) => [q.id, q.correct]));
test('scoring requires all answers, rejects invalid choices, and has the exact 75% boundary', () => {
  assert.equal(scoreQuiz(module, correct), 100);
  const answers = { ...correct, [module.questions[0].id]: (module.questions[0].correct + 1) % 4 };
  assert.equal(scoreQuiz(module, answers), 75);
  assert.equal(
    scoreQuiz(module, {
      ...answers,
      [module.questions[1].id]: (module.questions[1].correct + 1) % 4,
    }),
    50,
  );
  assert.throws(() => scoreQuiz(module, {}));
  assert.throws(() => scoreQuiz(module, { ...correct, [module.questions[0].id]: 7 }));
});
test('completion requires each preparation, objective and self-review condition', () => {
  const p = recordAttempt(module, emptyModule(module), correct, '2026-10-26T00:00:00Z');
  assert.equal(moduleStatus(module, p).complete, false);
  p.prep = module.steps.map(() => true);
  p.response = 'My concrete answer';
  p.review = module.exercise.criteria.map(() => true);
  assert.equal(moduleStatus(module, p).complete, true);
  p.response = '  ';
  assert.equal(moduleStatus(module, p).complete, false);
});
test('stale quiz versions cannot count toward completion', () => {
  const p = recordAttempt(module, emptyModule(module), correct, '2026-10-26T00:00:00Z');
  assert.equal(moduleStatus({ ...module, version: 2 }, p).quiz, false);
});
test('retakes preserve a best passing attempt beyond the bounded history', () => {
  let p = recordAttempt(module, emptyModule(module), correct, '2026-10-26T00:00:00Z');
  const wrong = Object.fromEntries(module.questions.map((q) => [q.id, (q.correct + 1) % 4]));
  for (let i = 0; i < 25; i++)
    p = recordAttempt(module, p, wrong, `2026-10-26T00:00:${String(i).padStart(2, '0')}Z`);
  assert.equal(p.attempts.length, 20);
  assert.equal(p.best?.score, 100);
  assert.equal(moduleStatus(module, p).quiz, true);
});
test('optional AI never changes the core completion denominator', () => {
  const store = enroll(emptyStore(), config, true);
  const p = store.profiles[store.activeId!];
  assert.deepEqual(pathStats(modules, p), {
    completed: 0,
    total: 4,
    percent: 0,
    aiCompleted: false,
  });
});
test('unenrollment retains profiles, reenrollment resumes, reset clears only chosen profile', () => {
  let state = enroll(emptyStore(), config, true);
  const id = profileId(config);
  state.profiles[id].modules.aptitude = { ...emptyModule(module), response: 'Keep this answer' };
  state = unenroll(state);
  assert.equal(state.activeId, null);
  assert.equal(state.profiles[id].modules.aptitude.response, 'Keep this answer');
  state = enroll(state, { ...config, language: 'java' }, false);
  const otherId = state.activeId!;
  assert.notEqual(id, otherId);
  assert.deepEqual(state.profiles[otherId].modules, {});
  state = enroll(state, config, true);
  assert.equal(state.profiles[id].modules.aptitude.response, 'Keep this answer');
  state = resetProfile(state, id);
  assert.equal(state.activeId, id);
  assert.deepEqual(state.profiles[id].modules, {});
  assert.ok(state.profiles[otherId]);
});
