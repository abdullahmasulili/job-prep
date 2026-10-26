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
