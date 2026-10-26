import type { Page } from '@playwright/test';
export async function enrollPath(
  page: Page,
  role = 'Frontend',
  tier = 'Junior',
  language = 'TypeScript',
  ai = false,
) {
  await page.goto('/onboarding');
  await page
    .getByRole('radio', { name: new RegExp(`^${role}`) })
    .locator('..')
    .click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page
    .getByRole('radio', { name: new RegExp(`^${tier}`) })
    .locator('..')
    .click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page
    .getByRole('radio', { name: new RegExp(`^${language}(?:\\s|$)`) })
    .locator('..')
    .click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  if (ai) await page.getByRole('checkbox', { name: /Include AI workflow preparation/ }).check();
  await page.getByRole('button', { name: 'Build my path' }).click();
}
