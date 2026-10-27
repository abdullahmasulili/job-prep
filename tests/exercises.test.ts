import test from 'node:test';
import assert from 'node:assert/strict';
import { getModules } from '../src/content/catalog';
import { emptyModule, exerciseProgress, updateExercise, moduleStatus } from '../src/lib/progress';
const base = getModules({ role: 'frontend', tier: 'junior', language: 'typescript' })[1];
const module = {
  ...base,
  exercises: [
    { ...base.exercise, id: 'original' },
    { ...base.exercise, id: 'debug' },
    { ...base.exercise, id: 'design' },
  ],
};
test('exercise drafts remain separate and completion needs two reviewed responses', () => {
  let p = emptyModule(module);
  p = updateExercise(module, p, 'original', {
    response: 'first draft',
    review: [true, true, true],
  });
  assert.equal(moduleStatus(module, p).exercise, false);
  p = updateExercise(module, p, 'debug', { response: 'second draft', review: [true, true, true] });
  assert.equal(moduleStatus(module, p).exercise, true);
  assert.equal(exerciseProgress(module, p, 'original').response, 'first draft');
  assert.equal(exerciseProgress(module, p, 'design').response, '');
  p = updateExercise(module, p, 'debug', { response: ' ', review: [true, true, true] });
  assert.equal(moduleStatus(module, p).exercise, false);
  assert.throws(() => updateExercise(module, p, 'unknown', { response: 'no', review: [] }));
});
