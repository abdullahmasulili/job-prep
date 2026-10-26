import test from 'node:test';
import assert from 'node:assert/strict';
import { getModules, languagesFor, profileDetails } from '../src/content/catalog';
import { mobileStacks } from '../src/content/mobile';
import { emptyStore, enroll, emptyModule, pathStats, profileId } from '../src/lib/progress';
import { readStore } from '../src/lib/storage';

test('every mobile stack has tier-specific lessons, assessments and exercises', () => {
  assert.equal(mobileStacks.length, 6);
  const platformPrompts = new Set<string>();
  for (const stack of mobileStacks) {
    for (const tier of ['junior', 'mid', 'senior'] as const) {
      for (const language of languagesFor('mobile', stack.id)) {
        const config = {
          role: 'mobile' as const,
          tier,
          language: language.id,
          mobileStack: stack.id,
        };
        const modules = getModules(config);
        assert.equal(modules.filter((m) => !m.optional).length, 4);
        assert.match(profileDetails(config), new RegExp(stack.label.replace(/[()]/g, '\\$&')));
        for (const module of modules) {
          assert.equal(module.questions.length, 4);
          assert.equal(new Set(module.questions.map((q) => q.id)).size, 4);
          assert.ok(module.steps.length >= 3);
          assert.ok(module.exercise.reference.length > 100);
          assert.ok(module.sources.length > 0);
          assert.ok(
            module.questions.every((q) => q.choices.every((c) => c.explanation.length > 15)),
          );
        }
        assert.ok(modules[1].questions[0].code);
        platformPrompts.add(modules[1].questions[2].prompt);
        assert.ok(modules[1].sources.some((s) => s.url === stack.source.url));
        assert.match(modules[2].exercise.prompt, new RegExp(stack.label.replace(/[()]/g, '\\$&')));
      }
    }
  }
  assert.equal(platformPrompts.size, 6, 'Each stack assesses its own platform behavior.');
  const base = {
    role: 'mobile' as const,
    language: 'dart' as const,
    mobileStack: 'flutter' as const,
  };
  assert.notDeepEqual(
    getModules({ ...base, tier: 'junior' })[2],
    getModules({ ...base, tier: 'senior' })[2],
  );
});

test('fullstack mobile adds required practice without replacing web or AI preparation', () => {
  const base = { role: 'fullstack' as const, tier: 'mid' as const, language: 'python' as const };
  const original = getModules(base);
  for (const stack of mobileStacks) {
    const config = { ...base, mobileStack: stack.id };
    const modules = getModules(config);
    assert.equal(modules.filter((m) => !m.optional).length, 5);
    assert.deepEqual(
      modules.find((m) => m.id === 'fundamentals'),
      original[1],
    );
    assert.equal(modules.find((m) => m.id === 'mobile')?.questions.length, 4);
    assert.equal(modules.find((m) => m.optional)?.id, 'ai');
    const state = enroll(emptyStore(), config, true);
    assert.equal(pathStats(modules, state.profiles[state.activeId!]).total, 5);
    assert.notEqual(profileId(base), profileId(config));
  }
});

test('old paths and new stack-specific paths round-trip without mixing progress', () => {
  const old = { role: 'fullstack' as const, tier: 'junior' as const, language: 'java' as const };
  assert.equal(profileId(old), 'fullstack:junior:java');
  let state = enroll(emptyStore(), old, false);
  const configs = mobileStacks.flatMap((stack) => [
    { ...old, mobileStack: stack.id },
    {
      role: 'mobile' as const,
      tier: 'junior' as const,
      language: stack.languages[0],
      mobileStack: stack.id,
    },
  ]);
  for (const config of configs) {
    state = enroll(state, config, false);
    const mobile = getModules(config).find((m) => m.id === 'mobile');
    if (mobile) {
      state.profiles[state.activeId!].modules.mobile = emptyModule(mobile);
      state.profiles[state.activeId!].lastModule = 'mobile';
    }
  }
  assert.equal(Object.keys(state.profiles).length, 13);
  const loaded = readStore({ getItem: () => JSON.stringify(state), setItem: () => {} });
  assert.equal(loaded.status, 'ready');
  if (loaded.status === 'ready') assert.deepEqual(loaded.state, state);
});

test('storage rejects missing, unknown or incompatible mobile stacks and languages', () => {
  const config = {
    role: 'mobile' as const,
    tier: 'junior' as const,
    language: 'dart' as const,
    mobileStack: 'flutter' as const,
  };
  for (const patch of [
    { mobileStack: undefined },
    { mobileStack: 'unknown' },
    { language: 'python' },
    { role: 'backend' },
  ]) {
    const state = enroll(emptyStore(), config, false);
    Object.assign(state.profiles[state.activeId!], patch);
    assert.equal(
      readStore({ getItem: () => JSON.stringify(state), setItem: () => {} }).status,
      'blocked',
    );
  }
});
