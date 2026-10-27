import { test, expect } from '@playwright/test';
import { enrollPath } from './helpers';
import { getModules } from '../../src/content/catalog';
const modules = getModules({ role: 'frontend', tier: 'junior', language: 'typescript' });
test('assessment validation, feedback, drafts and completion survive reload and retakes', async ({
  page,
}) => {
  await enrollPath(page);
  await page.goto('/practice/aptitude');
  const preparation = page.getByRole('tab', { name: /Preparation/ });
  await preparation.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: /Assessment/ })).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('tab', { name: /Exercise/ })).toBeFocused();
  await page.getByText('Compare with a reference approach', { exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Compare with a reference approach' }),
  ).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('tab', { name: /Assessment/ }).click();
  await page.getByRole('button', { name: 'Check answers', exact: true }).click();
  await expect(page.locator('main').getByRole('alert')).toContainText('Answer every question');
  const firstIds = await page
    .locator('[data-question-id]')
    .evaluateAll((els) => els.map((el) => el.getAttribute('data-question-id')!));
  expect(firstIds).toHaveLength(12);
  for (const id of firstIds) {
    const q = modules[0].questions.find((q) => q.id === id)!;
    const choice = page
      .locator(`[data-question-id="${id}"] label`)
      .filter({ hasText: q.choices[q.correct].text })
      .getByRole('radio');
    await expect(choice).toHaveAttribute('value', String(q.correct));
    await choice.check();
  }
  await page.getByRole('button', { name: 'Check answers', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Assessment passed' })).toBeVisible();
  await expect(page.getByText('Correct answer', { exact: true })).toHaveCount(12);
  await page.getByRole('tab', { name: /Preparation/ }).click();
  for (const checkbox of await page.locator('.lesson-steps').getByRole('checkbox').all())
    await checkbox.check();
  await page.getByRole('tab', { name: /Exercise/ }).click();
  await page
    .getByLabel('Your response')
    .fill(
      '120 × 0.8 + 10 = 106 seconds. Repeat measurements on equal workloads and verify the output.',
    );
  for (const checkbox of await page.locator('.self-review').getByRole('checkbox').all())
    await checkbox.check();
  await expect(page.getByText('Module complete', { exact: true })).not.toBeVisible();
  await page.getByLabel('Choose an exercise').selectOption({ index: 1 });
  await expect(page.getByLabel('Your response')).toBeEmpty();
  await page
    .getByLabel('Your response')
    .fill(
      'I calculated the fixed and variable costs, checked the units, and compared a doubled workload.',
    );
  for (const checkbox of await page.locator('.self-review').getByRole('checkbox').all())
    await checkbox.check();
  await expect(page.getByText('Module complete', { exact: true })).toBeVisible();
  await page.getByLabel('Choose an exercise').selectOption({ index: 0 });
  await page.reload();
  await page.getByRole('tab', { name: /Exercise/ }).click();
  await expect(page.getByLabel('Your response')).toHaveValue(/106 seconds/);
  await page.getByRole('tab', { name: /Assessment/ }).click();
  await page.getByRole('button', { name: 'Try again' }).click();
  const nextIds = await page
    .locator('[data-question-id]')
    .evaluateAll((els) => els.map((el) => el.getAttribute('data-question-id')!));
  expect(nextIds.filter((id) => firstIds.includes(id))).toHaveLength(0);
  for (const id of nextIds) {
    const q = modules[0].questions.find((q) => q.id === id)!;
    await page.locator(`[data-question-id="${id}"] input[value="${(q.correct + 1) % 4}"]`).check();
  }
  const orderBefore = await page
    .locator('[data-question-id] input')
    .evaluateAll((els) => els.map((el) => (el as HTMLInputElement).value));
  await page.reload();
  await page.getByRole('tab', { name: /Assessment/ }).click();
  expect(
    await page
      .locator('[data-question-id]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('data-question-id')!)),
  ).toEqual(nextIds);
  expect(
    await page
      .locator('[data-question-id] input')
      .evaluateAll((els) => els.map((el) => (el as HTMLInputElement).value)),
  ).toEqual(orderBefore);
  await expect(page.locator('[data-question-id] input:checked')).toHaveCount(12);
  await page.getByRole('button', { name: 'Check answers', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A useful place to practice' })).toBeVisible();
  await expect(page.getByText('Best result: 100%', { exact: true })).toBeVisible();
  await expect(page.getByText('Module complete', { exact: true })).toBeVisible();
  await page.goto('/progress');
  await expect(page.getByText('1 of 4 required modules complete')).toBeVisible();
});

test('unknown modules and disabled AI links have a recovery route', async ({ page }) => {
  await enrollPath(page);
  await page.goto('/practice/missing');
  await expect(page.getByRole('heading', { name: 'Module not found' })).toBeVisible();
  await page.goto('/practice/ai');
  await expect(page.getByRole('heading', { name: 'Add AI workflow preparation' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Enable in Settings' })).toBeVisible();
});
