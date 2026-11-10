import assert from 'node:assert/strict';
import test from 'node:test';
import { backendBank } from '../src/content/banks/backend';
import type { Tier } from '../src/content/types';

const tiers: Tier[] = ['junior', 'mid', 'senior'];
for (const tier of tiers) {
  const content = backendBank(tier);
  for (const [module, expected] of [
    ['fundamentals', 24],
    ['practical', 36],
  ] as const) {
    test(`backend ${tier} ${module} supplies a varied complete assessment`, () => {
      const questions = content[module];
      assert.equal(questions.length, expected);
      assert.equal(new Set(questions.map((q) => q.id)).size, expected);
      assert.equal(new Set(questions.map((q) => q.prompt)).size, expected);
      assert.ok(new Set(questions.map((q) => q.topic)).size >= 4);
      assert.ok(questions.filter((q) => q.code).length >= expected / 3);
      const positions = [0, 0, 0, 0];
      for (const q of questions) {
        assert.equal(q.choices.length, 4);
        assert.equal(new Set(q.choices.map((c) => c.text)).size, 4);
        assert.ok(q.correct >= 0 && q.correct < 4);
        positions[q.correct]++;
        for (const choice of q.choices) assert.ok(choice.explanation.length >= 20);
      }
      assert.ok(Math.max(...positions) - Math.min(...positions) <= 2, positions.join(','));
      for (const strategy of ['longest', 'shortest'] as const) {
        const successes = questions.filter((q) => {
          const lengths = q.choices.map((c) => c.text.length);
          const target = strategy === 'longest' ? Math.max(...lengths) : Math.min(...lengths);
          return lengths[q.correct] === target;
        }).length;
        assert.ok(successes / expected < 0.45, `${strategy}: ${successes}/${expected}`);
      }
    });
  }
  test(`backend ${tier} includes three additional exercises per module`, () => {
    for (const exercises of [content.fundamentalsExercises, content.practicalExercises]) {
      assert.equal(exercises.length, 3);
      assert.equal(new Set(exercises.map((e) => e.id)).size, 3);
      for (const exercise of exercises) {
        assert.ok(exercise.prompt.length > 100);
        assert.ok(exercise.criteria.length >= 3);
        assert.ok(exercise.reference.length > 100);
      }
    }
  });
}
test('backend tiers contain substantive distinct assessments', () => {
  for (let i = 0; i < tiers.length; i++)
    for (let j = i + 1; j < tiers.length; j++) {
      for (const module of ['fundamentals', 'practical'] as const) {
        const prompts = new Set(backendBank(tiers[i])[module].map((q) => q.prompt));
        assert.ok(backendBank(tiers[j])[module].filter((q) => prompts.has(q.prompt)).length <= 12);
      }
    }
});

test('backend fundamentals cannot be passed by selecting a fixed answer-length rank', () => {
  for (const tier of tiers) {
    const questions = backendBank(tier).fundamentals;
    for (const rank of [0, 1, 2, 3]) {
      const success =
        questions.reduce((total, question) => {
          const lengths = question.choices.map((choice) => choice.text.length);
          const target = [...lengths].sort((a, b) => a - b)[rank];
          return (
            total +
            (lengths[question.correct] === target
              ? 1 / lengths.filter((n) => n === target).length
              : 0)
          );
        }, 0) / questions.length;
      assert.ok(success < 0.45, `${tier} length rank ${rank + 1}: ${success}`);
    }
  }
});
