import test from 'node:test';
import assert from 'node:assert/strict';
import { frontendBank } from '../src/content/banks/frontend';
import type { PrepModule } from '../src/content/types';
import { emptyModule, recordAttempt, moduleStatus, currentModule } from '../src/lib/progress';
import * as sessions from '../src/lib/sessions';
const module: PrepModule = {
  id: 'practical',
  version: 2,
  title: 'Practice',
  subtitle: '',
  description: '',
  minutes: 30,
  steps: [],
  sources: [],
  questions: frontendBank('mid').practical,
  exercise: { title: 'Exercise', prompt: 'Explain', reference: 'Reference', criteria: ['Explain'] },
};
test('sessions provide twelve unique questions and fresh questions on the next retake', () => {
  assert.equal(typeof sessions.startRetake, 'function');
  let p = emptyModule(module);
  const first = sessions.getSession(module, p);
  assert.equal(first.questionIds.length, 12);
  assert.equal(new Set(first.questionIds).size, 12);
  const answers = Object.fromEntries(
    first.questionIds.map((id) => [id, module.questions.find((q) => q.id === id)!.correct]),
  );
  p = recordAttempt(module, p, answers);
  const next = sessions.getSession(module, sessions.startRetake(module, p));
  assert.equal(next.questionIds.filter((id) => first.questionIds.includes(id)).length, 0);
  assert.deepEqual(sessions.getSession(module, JSON.parse(JSON.stringify(p))), first);
  assert.equal(moduleStatus(module, p).quiz, true);
});
test('choice orders are permutations, varied on retake, and canonical answers score correctly', () => {
  const p = emptyModule(module);
  const session = sessions.getSession(module, p);
  for (const id of session.questionIds)
    assert.deepEqual([...session.choiceOrders[id]].sort(), [0, 1, 2, 3]);
  const answers = Object.fromEntries(
    session.questionIds.map((id) => [id, module.questions.find((q) => q.id === id)!.correct]),
  );
  assert.equal(recordAttempt(module, p, answers).best?.score, 100);
  assert.throws(() => recordAttempt(module, p, { [session.questionIds[0]]: 0 }));
});
test('content upgrades preserve original and additional exercise drafts but expire old quiz passes', () => {
  const old = {
    ...emptyModule(module),
    version: 1,
    response: 'existing response',
    review: [true],
    exerciseDrafts: { extra: { response: 'extra draft', review: [true] } },
  };
  const p = currentModule(module, old);
  assert.equal(p.response, 'existing response');
  assert.equal(p.exerciseDrafts?.extra.response, 'extra draft');
  assert.equal(moduleStatus(module, p).quiz, false);
});

test('bank coverage and retake sequence survive the twenty-attempt history limit', () => {
  let p = emptyModule(module);
  const visited = new Set<string>();
  const firstOrders = sessions.getSession(module, p).choiceOrders;
  let changedOrder = false;
  for (let round = 0; round < 25; round++) {
    const session = sessions.getSession(module, p);
    if (round < 3)
      for (const id of session.questionIds) {
        assert.equal(visited.has(id), false);
        visited.add(id);
      }
    for (const id of session.questionIds)
      if (
        firstOrders[id] &&
        JSON.stringify(firstOrders[id]) !== JSON.stringify(session.choiceOrders[id])
      )
        changedOrder = true;
    const answers = Object.fromEntries(
      session.questionIds.map((id) => [id, module.questions.find((q) => q.id === id)!.correct]),
    );
    p = recordAttempt(module, p, answers);
    if (round < 24) p = sessions.startRetake(module, p);
  }
  assert.equal(visited.size, 36);
  assert.equal(p.attempts.length, 20);
  assert.equal(p.round, 24);
  assert.equal(changedOrder, true);
  assert.equal(moduleStatus(module, p).quiz, true);
  const next = sessions.startRetake(module, p);
  assert.equal(next.round, 25);
  assert.deepEqual(
    sessions.getSession(module, JSON.parse(JSON.stringify(next))),
    sessions.getSession(module, next),
  );
});
test('a forged high score or undersized attempt cannot grant completion', () => {
  const p = emptyModule(module);
  const session = sessions.getSession(module, p);
  const wrong = Object.fromEntries(
    session.questionIds.map((id) => [
      id,
      (module.questions.find((q) => q.id === id)!.correct + 1) % 4,
    ]),
  );
  const result = recordAttempt(module, p, wrong);
  result.best!.score = 100;
  assert.equal(moduleStatus(module, result).quiz, false);
  result.best!.questionIds = session.questionIds.slice(0, 1);
  assert.equal(moduleStatus(module, result).quiz, false);
});

test('a legitimate pass replaces a corrupted cached best score', () => {
  let p = emptyModule(module);
  const first = sessions.getSession(module, p);
  const wrong = Object.fromEntries(
    first.questionIds.map((id) => [
      id,
      (module.questions.find((q) => q.id === id)!.correct + 1) % 4,
    ]),
  );
  p = recordAttempt(module, p, wrong);
  p.best!.score = 100;
  p = sessions.startRetake(module, p);
  const next = sessions.getSession(module, p);
  const answers = Object.fromEntries(
    next.questionIds.map((id) => [id, module.questions.find((q) => q.id === id)!.correct]),
  );
  const q = module.questions.find((q) => q.id === next.questionIds[0])!;
  answers[q.id] = (q.correct + 1) % 4;
  p = recordAttempt(module, p, answers);
  assert.equal(p.best?.score, 92);
  assert.equal(moduleStatus(module, p).quiz, true);
});
