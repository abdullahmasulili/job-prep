import assert from 'node:assert/strict';
import test from 'node:test';
import { aiBank, aiExercises } from '../src/content/banks/ai';
import { interviewBank, interviewExercises } from '../src/content/banks/interview';
import type { Question, Tier } from '../src/content/types';

function checkBank(questions: Question[], count: number) {
  assert.equal(questions.length, count);
  assert.equal(new Set(questions.map((q) => q.id)).size, count);
  assert.equal(new Set(questions.map((q) => q.prompt)).size, count);
  const positions = [0, 0, 0, 0];
  for (const question of questions) {
    assert.equal(question.choices.length, 4);
    assert.equal(new Set(question.choices.map((c) => c.text)).size, 4);
    assert.ok(question.correct >= 0 && question.correct < 4);
    positions[question.correct]++;
    for (const choice of question.choices) assert.ok(choice.explanation.length >= 20);
  }
  assert.ok(Math.max(...positions) - Math.min(...positions) <= 1);
  for (const rank of [0, 1, 2, 3]) {
    const expectedCorrect = questions.reduce((total, question) => {
      const lengths = question.choices.map((c) => c.text.length);
      const target = [...lengths].sort((a, b) => a - b)[rank];
      return (
        total +
        (lengths[question.correct] === target ? 1 / lengths.filter((n) => n === target).length : 0)
      );
    }, 0);
    assert.ok(
      expectedCorrect / count < 0.45,
      `length rank ${rank + 1} success ${((expectedCorrect / count) * 100).toFixed(1)}%`,
    );
  }
}
function checkDistractors(questions: Question[]) {
  const unrelatedCues =
    /\blogo\b|font size|brand color|tab width|CSS class|number of source files|file length|file exports|diagram tool|function has a short name/i;
  for (const q of questions) {
    for (const [index, choice] of q.choices.entries()) {
      if (index !== q.correct) assert.doesNotMatch(choice.text, unrelatedCues, q.id);
    }
  }
}
for (const tier of ['junior', 'mid', 'senior'] as Tier[]) {
  test(`interview ${tier} preserves scope without length shortcuts`, () =>
    checkBank(interviewBank(tier), 24));
  test(`interview ${tier} distractors concern the decision being assessed`, () =>
    checkDistractors(interviewBank(tier)));
  test(`interview ${tier} preserves rehearsal exercises`, () => {
    for (const role of ['frontend', 'backend', 'fullstack'] as const) {
      const exercises = interviewExercises(role, tier);
      assert.equal(exercises.length, 5);
      assert.equal(new Set(exercises.map((e) => e.id)).size, 5);
      assert.ok(exercises.every((e) => e.criteria.length >= 3 && e.reference.length >= 100));
    }
  });
}
test('AI review bank preserves scope without length shortcuts', () => checkBank(aiBank, 16));
test('AI review distractors concern the decision being assessed', () => checkDistractors(aiBank));
test('AI review preserves both exercises', () => {
  assert.equal(aiExercises.length, 2);
  assert.ok(aiExercises.every((e) => e.criteria.length >= 3 && e.reference.length >= 100));
});
