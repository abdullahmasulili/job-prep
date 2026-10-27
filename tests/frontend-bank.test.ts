import assert from 'node:assert/strict';
import test from 'node:test';
import type { RoleBank } from '../src/content/bank';
import type { Tier } from '../src/content/types';

async function loadBank() {
  const path = '../src/content/banks/frontend';
  const module = await import(path).catch(() => null);
  assert.ok(module?.frontendBank, 'frontendBank must provide the authored frontend curriculum');
  return module.frontendBank as (tier: Tier) => RoleBank;
}

for (const tier of ['junior', 'mid', 'senior'] as const) {
  test(`${tier}: frontend bank has enough distinct, explained questions and exercises`, async () => {
    const value = (await loadBank())(tier);
    assert.equal(value.fundamentals.length, 24);
    assert.equal(value.practical.length, 36);
    const questions = [...value.fundamentals, ...value.practical];
    assert.equal(new Set(questions.map((question) => question.id)).size, 60);
    assert.equal(new Set(questions.map((question) => question.prompt)).size, 60);
    for (const group of [value.fundamentals, value.practical]) {
      assert.ok(new Set(group.map((question) => question.topic)).size >= 4);
      assert.ok(group.filter((question) => question.code).length >= 6);
      for (const question of group) {
        assert.equal(question.choices.length, 4);
        assert.equal(new Set(question.choices.map((choice) => choice.text)).size, 4);
        assert.ok(question.correct >= 0 && question.correct <= 3);
        for (const choice of question.choices) assert.ok(choice.explanation.length >= 20);
      }
      for (const select of [Math.min, Math.max]) {
        const matches = group.filter((question) => {
          const lengths = question.choices.map((choice) => choice.text.length);
          return lengths[question.correct] === select(...lengths);
        }).length;
        assert.ok(
          matches / group.length < 0.45,
          `${tier}: answer length heuristic succeeds ${matches}/${group.length}`,
        );
      }
      for (let index = 0; index < 4; index++) {
        const count = group.filter((question) => question.correct === index).length;
        assert.ok(count >= group.length / 4 - 2 && count <= group.length / 4 + 2);
      }
    }
    for (const exercises of [value.fundamentalsExercises, value.practicalExercises]) {
      assert.equal(exercises.length, 3);
      for (const exercise of exercises) {
        assert.ok(exercise.id && exercise.title && exercise.prompt && exercise.reference);
        assert.ok(exercise.criteria.length >= 4);
      }
    }
  });
}

test('frontend tiers share at most twelve questions in either module', async () => {
  const build = await loadBank();
  const tiers = ['junior', 'mid', 'senior'] as const;
  for (let i = 0; i < tiers.length; i++) {
    for (let j = i + 1; j < tiers.length; j++) {
      for (const module of ['fundamentals', 'practical'] as const) {
        const prompts = new Set(build(tiers[i])[module].map((question) => question.prompt));
        assert.ok(
          build(tiers[j])[module].filter((question) => prompts.has(question.prompt)).length <= 12,
        );
      }
    }
  }
});
