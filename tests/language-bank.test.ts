import assert from 'node:assert/strict';
import test from 'node:test';
import { languageBank } from '../src/content/banks/language';
import type { Language, Tier } from '../src/content/types';

const languages: Language[] = ['javascript', 'typescript', 'python', 'java', 'csharp', 'go'];
const tiers: Tier[] = ['junior', 'mid', 'senior'];

for (const language of languages) {
  test(`${language}: language drills include tier-specific reasoning and usable answers`, () => {
    const tierBanks = tiers.map((tier) => languageBank(language, tier));
    for (const questions of tierBanks) {
      assert.equal(questions.length, 12);
      assert.equal(new Set(questions.map((question) => question.id)).size, 12);
      assert.equal(new Set(questions.map((question) => question.prompt)).size, 12);
      assert.ok(
        questions.filter((question) => question.topic?.startsWith(`language-${language}-`))
          .length >= 6,
      );
      for (const question of questions) {
        assert.ok(question.code);
        assert.equal(question.choices.length, 4);
        assert.equal(new Set(question.choices.map((choice) => choice.text)).size, 4);
        assert.ok(question.correct >= 0 && question.correct < 4);
        for (const choice of question.choices) assert.ok(choice.explanation.length >= 20);
      }
      for (const select of [Math.min, Math.max]) {
        const score = questions.filter((question) => {
          const lengths = question.choices.map((choice) => choice.text.length);
          return lengths[question.correct] === select(...lengths);
        }).length;
        assert.ok(score / 12 < 0.45, `${language} length heuristic: ${score}/12`);
      }
    }
    for (let i = 0; i < tiers.length; i++) {
      for (let j = i + 1; j < tiers.length; j++) {
        const prompts = new Set(tierBanks[i].map((question) => question.prompt));
        assert.ok(tierBanks[j].filter((question) => prompts.has(question.prompt)).length <= 6);
      }
    }
  });
}

test('TypeScript drill snippets remain syntactically valid even when demonstrating type errors', async () => {
  const ts = await import('typescript');
  for (const tier of tiers) {
    for (const question of languageBank('typescript', tier)) {
      const result = ts.transpileModule(question.code!, {
        compilerOptions: { target: ts.ScriptTarget.ES2022 },
        reportDiagnostics: true,
      });
      const errors = (result.diagnostics ?? []).filter(
        (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
      );
      assert.equal(
        errors.length,
        0,
        `${question.id}: ${errors.map((error) => ts.flattenDiagnosticMessageText(error.messageText, ' ')).join('; ')}`,
      );
    }
  }
});
