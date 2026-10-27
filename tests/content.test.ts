import test from 'node:test';
import assert from 'node:assert/strict';
import { getModules, roles, tiers, languagesFor } from '../src/content/catalog';

test('all nine tracks and supported languages have complete, referenced assessments', () => {
  assert.equal(roles.length * tiers.length, 9);
  for (const role of roles)
    for (const tier of tiers)
      for (const language of languagesFor(role.id)) {
        const modules = getModules({ role: role.id, tier: tier.id, language: language.id });
        assert.equal(modules.filter((m) => !m.optional).length, 4);
        assert.equal(modules.filter((m) => m.optional).length, 1);
        const count = modules
          .filter((m) => !m.optional)
          .reduce((n, m) => n + m.questions.length, 0);
        assert.ok(count >= 120 && count <= 160, `Core bank has ${count} questions`);
        const questions = modules.flatMap((module) => module.questions);
        assert.equal(new Set(questions.map((q) => q.id)).size, questions.length);
        assert.equal(new Set(questions.map((q) => q.prompt)).size, questions.length);
        assert.equal(new Set(modules.map((m) => m.id)).size, 5);
        for (const module of modules) {
          assert.ok(
            module.questions.length >= (module.optional ? 12 : 24),
            `${role.id}/${tier.id}/${module.id}`,
          );
          assert.equal(new Set(module.questions.map((q) => q.id)).size, module.questions.length);
          assert.ok(module.steps.length >= 3);
          assert.ok(module.exercise.criteria.length >= 3);
          assert.ok(module.exercise.reference.length > 100);
          const exercises = module.exercises!;
          assert.ok(exercises.length >= 3);
          assert.equal(new Set(exercises.map((e) => e.id)).size, exercises.length);
          assert.equal(new Set(exercises.map((e) => e.prompt)).size, exercises.length);
          for (const exercise of exercises) {
            assert.ok(exercise.criteria.length >= 3);
            assert.ok(exercise.reference.length > 100);
          }
          assert.ok(module.sources.every((s) => s.url.startsWith('https://')));
          for (const q of module.questions) {
            assert.equal(q.choices.length, 4);
            assert.ok(
              q.choices.every((c) => c.text.length > 0 && c.explanation.length > 15),
              q.id,
            );
            assert.ok(q.correct >= 0 && q.correct < 4);
          }
        }
      }
});

test('language choices change code, and tiers change technical questions', () => {
  const base = { role: 'backend' as const, tier: 'junior' as const };
  const python = getModules({ ...base, language: 'python' });
  const java = getModules({ ...base, language: 'java' });
  assert.notEqual(python[1].questions[0].code, java[1].questions[0].code);
  assert.match(python[1].questions[0].code!, /\bdef\b|\blen\b|\blist\b/);
  assert.notEqual(
    python[1].questions[24].prompt,
    getModules({ ...base, tier: 'senior', language: 'python' })[1].questions[24].prompt,
  );
});

test('no supported module rewards a fixed answer-length strategy', () => {
  for (const role of roles)
    for (const tier of tiers)
      for (const language of languagesFor(role.id))
        for (const module of getModules({
          role: role.id,
          tier: tier.id,
          language: language.id,
        })) {
          for (const rank of [0, 1, 2, 3]) {
            const expectedCorrect = module.questions.reduce((total, question) => {
              const lengths = question.choices.map((choice) => choice.text.length);
              const target = [...lengths].sort((a, b) => a - b)[rank];
              return (
                total +
                (lengths[question.correct] === target
                  ? 1 / lengths.filter((length) => length === target).length
                  : 0)
              );
            }, 0);
            assert.ok(
              expectedCorrect / module.questions.length < 0.45,
              `${role.id}/${tier.id}/${language.id}/${module.id}: length rank ${rank + 1}`,
            );
          }
        }
});
