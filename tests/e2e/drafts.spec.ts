import { test, expect } from '@playwright/test';
import { enrollPath } from './helpers';

test('a long saved response remains fully visible after reload and switching to the exercise', async ({
  page,
}) => {
  await enrollPath(page);
  await page.goto('/practice/aptitude');
  await page.getByRole('tab', { name: /Exercise/ }).click();
  const response = page.getByLabel('Your response');
  await response.fill(
    Array.from(
      { length: 35 },
      (_, i) => `Step ${i + 1}: explain the evidence and verify the result.`,
    ).join('\n'),
  );
  await page.reload();
  await page.getByRole('tab', { name: /Exercise/ }).click();
  expect(await response.evaluate((el) => el.clientHeight >= el.scrollHeight - 2)).toBe(true);
});

test('exercise responses and reviews remain independent across switches and reload', async ({
  page,
}) => {
  await enrollPath(page);
  await page.goto('/practice/fundamentals');
  await page.getByRole('tab', { name: /Exercise/ }).click();
  await page.getByLabel('Your response').fill('Original exercise draft');
  await page.locator('.self-review').getByRole('checkbox').first().check();
  await page.getByLabel('Choose an exercise').selectOption({ index: 1 });
  await expect(page.getByLabel('Your response')).toBeEmpty();
  await expect(page.locator('.self-review input:checked')).toHaveCount(0);
  await page.getByLabel('Your response').fill('Second independent draft');
  await page.reload();
  await page.getByRole('tab', { name: /Exercise/ }).click();
  await expect(page.getByLabel('Your response')).toHaveValue('Original exercise draft');
  await expect(page.locator('.self-review input:checked')).toHaveCount(1);
  await page.getByLabel('Choose an exercise').selectOption({ index: 1 });
  await expect(page.getByLabel('Your response')).toHaveValue('Second independent draft');
});
