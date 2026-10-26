import test from 'node:test';
import assert from 'node:assert/strict';
import { getModules, roles, tiers, languagesFor } from '../src/content/catalog';

test('all web tracks and supported languages have complete, referenced assessments', () => {
  assert.equal(roles.length * tiers.length, 12);
  for (const role of roles.filter((r) => r.id !== 'mobile'))
    for (const tier of tiers)
      for (const language of languagesFor(role.id)) {
        const modules = getModules({ role: role.id, tier: tier.id, language: language.id });
        assert.equal(modules.filter((m) => !m.optional).length, 4);
        assert.equal(modules.filter((m) => m.optional).length, 1);
        assert.equal(new Set(modules.map((m) => m.id)).size, 5);
        for (const module of modules) {
          assert.equal(module.questions.length, 4, `${role.id}/${tier.id}/${module.id}`);
          assert.equal(new Set(module.questions.map((q) => q.id)).size, 4);
          assert.ok(module.steps.length >= 3);
          assert.ok(module.exercise.criteria.length >= 3);
          assert.ok(module.exercise.reference.length > 100);
          assert.ok(module.sources.every((s) => s.url.startsWith('https://')));
          for (const q of module.questions) {
            assert.equal(q.choices.length, 4);
            assert.ok(q.choices.every((c) => c.text.length > 0 && c.explanation.length > 15));
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
    python[1].questions[1].prompt,
    getModules({ ...base, tier: 'senior', language: 'python' })[1].questions[1].prompt,
  );
});
