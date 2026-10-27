import assert from 'node:assert/strict';
import test from 'node:test';
import type { Question, Tier } from '../src/content/types';

const tiers: Tier[] = ['junior', 'mid', 'senior'];

test('fullstack practice supplies complete, varied tier banks without answer shortcuts', async () => {
  const { fullstackBank } = await import('../src/content/banks/fullstack');
  for (const tier of tiers) {
    const result = fullstackBank(tier);
    for (const [name, count] of [
      ['fundamentals', 24],
      ['practical', 36],
    ] as const) {
      const questions = result[name];
      assert.equal(questions.length, count, `${tier} ${name} count`);
      assert.equal(new Set(questions.map((q) => q.id)).size, count);
      assert.equal(new Set(questions.map((q) => q.prompt)).size, count);
      assert.ok(new Set(questions.map((q) => q.topic)).size >= 4);
      assert.ok(questions.filter((q) => q.code).length >= count / 3);
      const positions = [0, 0, 0, 0];
      for (const q of questions) {
        assert.equal(q.choices.length, 4);
        assert.equal(new Set(q.choices.map((c) => c.text)).size, 4);
        assert.ok(q.correct >= 0 && q.correct < 4);
        positions[q.correct]++;
        for (const choice of q.choices) assert.ok(choice.explanation.length >= 25);
      }
      assert.ok(Math.max(...positions) - Math.min(...positions) <= 2);
      for (const mode of ['longest', 'shortest'] as const) {
        const hits = questions.filter((q) => {
          const lengths = q.choices.map((c) => c.text.length);
          const target = mode === 'longest' ? Math.max(...lengths) : Math.min(...lengths);
          return lengths[q.correct] === target;
        }).length;
        assert.ok(hits / count < 0.45, `${tier} ${name}: ${mode} ${hits}/${count}`);
      }
    }
    for (const name of ['fundamentalsExercises', 'practicalExercises'] as const) {
      const exercises = result[name];
      assert.equal(exercises.length, 3);
      assert.equal(new Set(exercises.map((e) => e.id)).size, 3);
      for (const e of exercises) {
        assert.ok(e.prompt.length > 100);
        assert.ok(e.reference.length > 100);
        assert.ok(e.criteria.length >= 4);
      }
    }
  }
});

test('fullstack senior and mid banks add distinct reasoning rather than renamed junior prompts', async () => {
  const { fullstackBank } = await import('../src/content/banks/fullstack');
  const overlap = (a: Question[], b: Question[]) =>
    a.filter((q) => b.some((other) => other.prompt === q.prompt)).length;
  for (let i = 0; i < tiers.length; i++) {
    for (let j = i + 1; j < tiers.length; j++) {
      const a = fullstackBank(tiers[i]);
      const b = fullstackBank(tiers[j]);
      assert.ok(overlap(a.fundamentals, b.fundamentals) <= 12);
      assert.ok(overlap(a.practical, b.practical) <= 12);
    }
  }
});
